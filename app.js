/* ═══════════════════════════════════════════════════════════════
   DCI Document Control System — Firebase Edition v2.0
   Pure vanilla JS · No build step · Firestore + Firebase Auth
   ═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════
//  1.  FIREBASE CONFIG  ← PASTE YOUR OWN VALUES HERE
// ══════════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCnUghRn1eHMGFViaMbtKjTnGr2A_vbmPM",
  authDomain:        "dci-document-control.firebaseapp.com",
  projectId:         "dci-document-control",
  storageBucket:     "dci-document-control.firebasestorage.app",
  messagingSenderId: "934020909406",
  appId:             "1:934020909406:web:bf80144cb9a5300b9ca7cf"
};

// ══════════════════════════════════════════════════════
//  2.  CONSTANTS
// ══════════════════════════════════════════════════════
const ROLES = ['admin','management','project_manager','document_controller','engineer','viewer'];
const ROLE_LABELS = {
  admin: 'Admin', management: 'Management',
  project_manager: 'Project Manager', document_controller: 'Document Controller',
  engineer: 'Engineer', viewer: 'Viewer'
};
const OWNER_EDIT_ROLES = ['project_manager','document_controller','engineer'];
const DOC_STATES = ['active','superseded','cancelled','archived'];
const DISCIPLINES = ['','ELT','INS','MEC','PMG','PRC','QAC','CIV','STR','ARC','HSE'];
const PURPOSES    = ['','IFR','IFC','IFI','IFA','IFB','IFT','AFD'];
const INT_EXT     = ['Internal','External'];
const PAGE_SIZE   = 50;

// ══════════════════════════════════════════════════════
//  3.  FIREBASE INIT
// ══════════════════════════════════════════════════════
firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db   = firebase.firestore();

// ══════════════════════════════════════════════════════
//  4.  APP STATE
// ══════════════════════════════════════════════════════
const S = {
  user: null,           // Firebase Auth user object
  profile: null,        // Firestore /users/{uid} doc
  cache: { projects: null, users: null },
  sort: { field: null, dir: 'asc' }
};

// ══════════════════════════════════════════════════════
//  5.  PERMISSION HELPERS
// ══════════════════════════════════════════════════════
const isAdmin = () => S.profile?.role === 'admin';
const isManagement = () => ['admin','management'].includes(S.profile?.role);

function canViewDoc(doc) {
  if (isAdmin()) return true;
  if (!S.user) return false;
  return doc.primaryOwnerId === S.user.uid ||
         (Array.isArray(doc.additionalViewerIds) && doc.additionalViewerIds.includes(S.user.uid));
}
function canEditRevision(doc) {
  if (isAdmin()) return true;
  if (!S.user || !S.profile) return false;
  return doc.primaryOwnerId === S.user.uid && OWNER_EDIT_ROLES.includes(S.profile.role);
}
function canEditDoc(doc) { return isAdmin(); }

// ══════════════════════════════════════════════════════
//  6.  FIRESTORE HELPERS
// ══════════════════════════════════════════════════════

async function getAccessibleDocuments(filters = {}) {
  let docs = [];
  if (isAdmin()) {
    let q = db.collection('documents');
    if (filters.projectId) q = q.where('projectId', '==', filters.projectId);
    if (filters.state)     q = q.where('state', '==', filters.state);
    const snap = await q.orderBy('documentNumber').get();
    docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } else {
    const uid = S.user.uid;
    const [owned, viewing] = await Promise.all([
      db.collection('documents').where('primaryOwnerId', '==', uid).get(),
      db.collection('documents').where('additionalViewerIds', 'array-contains', uid).get()
    ]);
    const map = {};
    [...owned.docs, ...viewing.docs].forEach(d => { map[d.id] = { id: d.id, ...d.data() }; });
    docs = Object.values(map);
    if (filters.projectId) docs = docs.filter(d => d.projectId === filters.projectId);
    if (filters.state)     docs = docs.filter(d => d.state === filters.state);
    docs.sort((a, b) => (a.documentNumber || '').localeCompare(b.documentNumber || ''));
  }
  // client-side filters
  if (filters.discipline) docs = docs.filter(d => d.discipline === filters.discipline);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    docs = docs.filter(d =>
      (d.documentNumber || '').toLowerCase().includes(q) ||
      (d.title || '').toLowerCase().includes(q) ||
      (d.responsibleName || '').toLowerCase().includes(q)
    );
  }
  return docs;
}

async function getDocument(id) {
  const snap = await db.collection('documents').doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function getRevisions(documentId) {
  const snap = await db.collection('revisions')
    .where('documentId', '==', documentId)
    .orderBy('revisionNumber')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getRevision(id) {
  const snap = await db.collection('revisions').doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function getProjects() {
  if (S.cache.projects) return S.cache.projects;
  const snap = await db.collection('projects').orderBy('projectNumber').get();
  S.cache.projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return S.cache.projects;
}

async function getProject(id) {
  const snap = await db.collection('projects').doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function getUsers() {
  if (S.cache.users) return S.cache.users;
  const snap = await db.collection('users').orderBy('displayName').get();
  S.cache.users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return S.cache.users;
}

async function getUser(id) {
  const snap = await db.collection('users').doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function getDashboardData() {
  const [allDocsSnap, activeProjectsSnap, revsSnap, recentSnap] = await Promise.all([
    db.collection('documents').get(),
    db.collection('projects').where('active', '==', true).get(),
    db.collection('revisions').get(),
    db.collection('auditEvents').orderBy('createdAt', 'desc').limit(20).get()
  ]);

  const docs = allDocsSnap.docs.map(d => d.data());
  const revs = revsSnap.docs.map(d => d.data());
  const today = new Date(); today.setHours(0,0,0,0);
  const warningMs = 7 * 86400000;

  let overdue = 0, dueSoon = 0, awaitingResponse = 0, received = 0;
  revs.forEach(r => {
    if (r.finalApproved) { received++; return; }
    if (r.actualSentDate && !r.receivedDate) { awaitingResponse++; return; }
    if (!r.targetSentDate || r.actualSentDate) return;
    const target = new Date(r.targetSentDate);
    if (target < today) overdue++;
    else if (target - today <= warningMs) dueSoon++;
  });

  // docs by discipline
  const byDisc = {};
  docs.forEach(d => { byDisc[d.discipline || 'Other'] = (byDisc[d.discipline || 'Other'] || 0) + 1; });

  // docs by project
  const byProject = {};
  docs.forEach(d => { byProject[d.projectId] = (byProject[d.projectId] || 0) + 1; });

  const recentEvents = recentSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  return {
    totalDocs: docs.length,
    activeDocs: docs.filter(d => d.state === 'active').length,
    totalProjects: activeProjectsSnap.size,
    totalRevisions: revs.length,
    overdue, dueSoon, awaitingResponse, received,
    byDisc, byProject,
    recentEvents
  };
}

async function writeAudit(action, entityType, entityId, label, changes = {}) {
  try {
    await db.collection('auditEvents').add({
      actorId: S.user.uid,
      actorName: S.profile?.displayName || S.user.email,
      action, entityType, entityId, entityLabel: label,
      changes,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { console.warn('Audit write failed:', e); }
}

function invalidateCache() {
  S.cache.projects = null;
  S.cache.users = null;
}

// ══════════════════════════════════════════════════════
//  7.  ROUTER
// ══════════════════════════════════════════════════════
const ROUTES = [
  { re: /^\/login$/,                                 page: 'login',               pub: true },
  { re: /^\/(|dashboard)$/,                          page: 'dashboard' },
  { re: /^\/documents$/,                             page: 'documents' },
  { re: /^\/documents\/new$/,                        page: 'doc-new',             admin: true },
  { re: /^\/documents\/([^/]+)\/allocation$/,        page: 'doc-allocation',       admin: true, p: ['docId'] },
  { re: /^\/documents\/([^/]+)\/edit$/,              page: 'doc-edit',            admin: true, p: ['docId'] },
  { re: /^\/documents\/([^/]+)\/revisions\/([^/]+)\/edit$/, page: 'rev-edit',    p: ['docId','revId'] },
  { re: /^\/documents\/([^/]+)$/,                    page: 'doc-detail',          p: ['docId'] },
  { re: /^\/projects$/,                              page: 'projects' },
  { re: /^\/projects\/([^/]+)$/,                     page: 'project-detail',      p: ['projectId'] },
  { re: /^\/admin\/users\/new$/,                     page: 'user-new',            admin: true },
  { re: /^\/admin\/users\/([^/]+)\/edit$/,           page: 'user-edit',           admin: true, p: ['userId'] },
  { re: /^\/admin\/users$/,                          page: 'admin-users',         admin: true },
  { re: /^\/admin\/transfer$/,                       page: 'admin-transfer',      admin: true },
  { re: /^\/admin\/import$/,                         page: 'admin-import',        admin: true },
  { re: /^\/export$/,                                page: 'export' },
  { re: /^\/audit$/,                                 page: 'audit',               admin: true },
];

function matchRoute(hash) {
  const path = (hash || '').replace(/^#/, '') || '/';
  for (const r of ROUTES) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      (r.p || []).forEach((k, i) => params[k] = m[i + 1]);
      return { page: r.page, params, pub: r.pub, admin: r.admin };
    }
  }
  return { page: 'not-found', params: {}, pub: false };
}

function nav(path) { window.location.hash = path; }

// ══════════════════════════════════════════════════════
//  8.  RENDER ENGINE
// ══════════════════════════════════════════════════════
const $app = () => document.getElementById('app');
const render = html => { $app().innerHTML = html; };

function showSpinner() {
  render(`<div class="loading-screen"><div class="spinner"></div><p>Loading…</p></div>`);
}

// ══════════════════════════════════════════════════════
//  9.  LAYOUT COMPONENTS
// ══════════════════════════════════════════════════════

function topBar(activePage) {
  const role = S.profile?.role || '';
  const isA  = isAdmin();
  const pg   = activePage;

  const navLink = (href, label, active) =>
    `<a href="#${href}" class="${active === pg ? 'active' : ''}">${label}</a>`;

  return `
  <header class="topbar">
    <a class="brand" href="#/">
      <span class="brand-mark">DC</span>
      <span class="brand-text"><strong>Document Control</strong><small>Schedule &amp; Revision Monitor</small></span>
    </a>
    <nav class="topnav">
      ${navLink('/','Dashboard','dashboard')}
      ${navLink('/projects','Projects','projects')}
      ${navLink('/documents','Documents','documents')}
      ${navLink('/export','Export Excel','export')}
      ${isA ? `<span class="admin-sep"></span>` : ''}
      ${isA ? navLink('/admin/import','Import','admin-import') : ''}
      ${isA ? navLink('/admin/users','Users','admin-users') : ''}
      ${isA ? navLink('/admin/transfer','Ownership','admin-transfer') : ''}
      ${isA ? navLink('/audit','Audit Log','audit') : ''}
    </nav>
    <div class="user-menu">
      <span class="user-name">
        <strong>${esc(S.profile?.displayName || S.user?.email || '')}</strong>
        <small>${ROLE_LABELS[role] || role} · ${isA ? 'All documents' : 'My documents'}</small>
      </span>
      <button class="btn-link-topbar" onclick="doSignOut()">Sign out</button>
    </div>
  </header>`;
}

function pageShell(activePage, content) {
  return `${topBar(activePage)}<main class="page-shell">${content}</main><div id="toast-container"></div>`;
}

// ══════════════════════════════════════════════════════
//  10.  UTILITY HELPERS
// ══════════════════════════════════════════════════════

const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtDate = d => d ? String(d).slice(0, 10) : '—';
const today = () => { const d = new Date(); return d.toISOString().slice(0,10); };
const daysDiff = (dateStr) => {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - new Date(today())) / 86400000);
};

function revStatus(rev) {
  if (rev.finalApproved) return { label: 'Final Approved', cls: 'badge-success' };
  if (rev.receivedDate)  return { label: 'Response Received', cls: 'badge-success' };
  if (rev.actualSentDate) return { label: 'Awaiting Response', cls: 'badge-info' };
  if (!rev.targetSentDate) return { label: 'Planned', cls: 'badge-planned' };
  const diff = daysDiff(rev.targetSentDate);
  if (diff < 0)  return { label: `Overdue ${-diff}d`, cls: 'badge-overdue' };
  if (diff <= 7) return { label: `Due in ${diff}d`,  cls: 'badge-warning' };
  return { label: 'On Schedule', cls: 'badge-planned' };
}

function badge(label, cls) { return `<span class="badge ${cls}">${esc(label)}</span>`; }

function roleBadge(role) {
  return `<span class="role-badge role-${esc(role)}">${esc(ROLE_LABELS[role] || role)}</span>`;
}

function docStateBadge(state) {
  const map = { active: 'badge-success', superseded: 'badge-muted', cancelled: 'badge-overdue', archived: 'badge-muted' };
  return badge(state, map[state] || 'badge-muted');
}

// show toast
function toast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ══════════════════════════════════════════════════════
//  11.  AUTH ACTIONS
// ══════════════════════════════════════════════════════

async function doSignOut() {
  await auth.signOut();
}

// ══════════════════════════════════════════════════════
//  12.  PAGE: LOGIN
// ══════════════════════════════════════════════════════

function renderLogin() {
  render(`
  <div class="auth-shell">
    <div class="auth-card">
      <div class="auth-logo">DC</div>
      <h1>Document Control</h1>
      <p class="subtitle">Sign in to your workspace</p>
      <div class="auth-error" id="auth-err"></div>
      <form id="login-form" onsubmit="doLogin(event)">
        <div class="form-group" style="margin-bottom:14px">
          <label>Email address</label>
          <input type="email" id="login-email" required autocomplete="email" placeholder="you@company.com">
        </div>
        <div class="form-group" style="margin-bottom:20px">
          <label>Password</label>
          <input type="password" id="login-pass" required autocomplete="current-password" placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn-primary" id="login-btn">Sign in</button>
      </form>
    </div>
  </div>`);
}

async function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const btn   = document.getElementById('login-btn');
  const err   = document.getElementById('auth-err');
  err.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    // auth state listener will redirect
  } catch (ex) {
    err.textContent = friendlyAuthError(ex.code);
    err.style.display = 'block';
    btn.disabled = false; btn.textContent = 'Sign in';
  }
}

function friendlyAuthError(code) {
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential')
    return 'Incorrect email or password. Please try again.';
  if (code === 'auth/too-many-requests')
    return 'Too many attempts. Please wait a few minutes and try again.';
  if (code === 'auth/user-disabled')
    return 'Your account has been disabled. Contact your administrator.';
  return 'Sign-in failed. Check your email and password.';
}

// ══════════════════════════════════════════════════════
//  13.  PAGE: DASHBOARD
// ══════════════════════════════════════════════════════

async function renderDashboard() {
  const [data, projects] = await Promise.all([getDashboardData(), getProjects()]);

  const projectMap = {};
  projects.forEach(p => { projectMap[p.id] = p; });

  // Discipline bars
  const discEntries = Object.entries(data.byDisc).sort((a,b) => b[1]-a[1]);
  const maxDisc = Math.max(1, ...discEntries.map(e=>e[1]));
  const DISC_COLORS = { MEC:'#2563eb', PRC:'#7c3aed', QAC:'#059669', PMG:'#d97706', ELT:'#dc2626', INS:'#0891b2', Other:'#94a3b8' };

  const discBars = discEntries.map(([disc, cnt]) => `
    <div class="bar-row">
      <span>${esc(disc)}</span>
      <div class="bar-track">
        <i class="bar-fill" style="width:${Math.round(cnt/maxDisc*100)}%;background:${DISC_COLORS[disc]||'#94a3b8'}"></i>
      </div>
      <strong>${cnt}</strong>
    </div>`).join('');

  // Project table (top projects by doc count)
  const projRows = Object.entries(data.byProject)
    .sort((a,b) => b[1]-a[1]).slice(0,10)
    .map(([pid, cnt]) => {
      const p = projectMap[pid] || {};
      return `<tr>
        <td><a href="#/projects/${esc(pid)}">${esc(p.projectNumber||pid)}</a></td>
        <td>${esc(p.name||'—')}</td>
        <td>${esc(p.clientName||'—')}</td>
        <td style="text-align:right"><strong>${cnt}</strong></td>
      </tr>`;
    }).join('');

  // Recent activity
  const recentRows = data.recentEvents.slice(0,12).map(ev => {
    const ts = ev.createdAt?.toDate?.()?.toLocaleString() || '—';
    return `<tr>
      <td class="nowrap">${esc(ts)}</td>
      <td>${esc(ev.actorName||'—')}</td>
      <td><span class="audit-action">${esc(ev.action)}</span></td>
      <td>${esc(ev.entityType||'')} ${esc(ev.entityLabel||ev.entityId||'')}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:24px">No recent activity</td></tr>`;

  render(pageShell('dashboard', `
    <div class="page-header">
      <div>
        <h1>Company Schedule Dashboard</h1>
        <p>All document schedules · ${esc(today())}</p>
      </div>
      <div class="header-actions">
        <a class="btn btn-secondary" href="#/export">Export Excel</a>
        ${isAdmin() ? `<a class="btn btn-secondary" href="#/admin/import">Import Excel</a>` : ''}
        ${isAdmin() ? `<a class="btn btn-primary" href="#/documents/new">+ Add Document</a>` : ''}
      </div>
    </div>

    <div class="kpi-grid">
      <a class="kpi info" href="#/documents">
        <span>Total Documents</span><strong>${data.totalDocs}</strong>
        <small>${data.activeDocs} active</small>
      </a>
      <a class="kpi success" href="#/projects">
        <span>Active Projects</span><strong>${data.totalProjects}</strong>
        <small>in progress</small>
      </a>
      <div class="kpi">
        <span>Total Revisions</span><strong>${data.totalRevisions}</strong>
        <small>all time</small>
      </div>
      <a class="kpi danger" href="#/documents">
        <span>Overdue</span><strong>${data.overdue}</strong>
        <small>revisions past target date</small>
      </a>
      <a class="kpi warning" href="#/documents">
        <span>Due This Week</span><strong>${data.dueSoon}</strong>
        <small>target within 7 days</small>
      </a>
      <a class="kpi action" href="#/documents">
        <span>Awaiting Response</span><strong>${data.awaitingResponse}</strong>
        <small>sent, not yet received</small>
      </a>
    </div>

    <div class="dashboard-grid">
      <div class="panel table-panel">
        <div class="panel-heading">
          <div><h2>Top Projects by Document Count</h2></div>
          <a href="#/projects" style="font-size:13px">View all →</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Project #</th><th>Name</th><th>Client</th><th style="text-align:right">Docs</th></tr></thead>
            <tbody>${projRows || '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--muted)">No projects yet</td></tr>'}</tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Documents by Discipline</h2></div>
        <div class="bar-list">${discBars || '<p style="color:var(--muted)">No data yet</p>'}</div>
      </div>
    </div>

    <div class="panel table-panel">
      <div class="panel-heading">
        <div><h2>Recent Activity</h2></div>
        ${isAdmin() ? `<a href="#/audit" style="font-size:13px">View full audit log →</a>` : ''}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>When</th><th>User</th><th>Action</th><th>What</th></tr></thead>
          <tbody>${recentRows}</tbody>
        </table>
      </div>
    </div>
  `));
}

// ══════════════════════════════════════════════════════
//  14.  PAGE: DOCUMENTS LIST
// ══════════════════════════════════════════════════════

async function renderDocuments(qs = {}) {
  const projects = await getProjects();

  // Build filter state from URL query params (via hash fragment)
  const params = qs;

  // fetch matching docs
  const docs = await getAccessibleDocuments(params);

  // Project map for display
  const pmap = {};
  projects.forEach(p => { pmap[p.id] = p; });

  // Sort
  const sortField = params._sort || 'documentNumber';
  const sortDir   = params._dir  || 'asc';
  docs.sort((a,b) => {
    const av = (a[sortField]||'').toString().toLowerCase();
    const bv = (b[sortField]||'').toString().toLowerCase();
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const projectOptions = projects.map(p =>
    `<option value="${esc(p.id)}" ${params.projectId === p.id ? 'selected' : ''}>
      ${esc(p.projectNumber)} — ${esc(p.name)}
    </option>`).join('');

  const discOptions = DISCIPLINES.filter(Boolean).map(d =>
    `<option value="${esc(d)}" ${params.discipline === d ? 'selected' : ''}>${esc(d)}</option>`).join('');

  const stateOptions = DOC_STATES.map(s =>
    `<option value="${esc(s)}" ${params.state === s ? 'selected' : ''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('');

  const rows = docs.map(doc => {
    const proj = pmap[doc.projectId];
    const projLabel = proj ? `${esc(proj.projectNumber)} — ${esc(proj.name)}` : esc(doc.projectId || '—');
    return `<tr onclick="nav('/documents/${esc(doc.id)}')" style="cursor:pointer">
      <td class="nowrap"><a href="#/documents/${esc(doc.id)}" onclick="event.stopPropagation()">${esc(doc.documentNumber)}</a></td>
      <td class="title-cell">
        <strong>${esc(doc.title)}</strong>
        <span class="cell-note">${projLabel}</span>
      </td>
      <td>${esc(doc.discipline||'—')}</td>
      <td>${esc(doc.responsibleName||'—')}</td>
      <td>${docStateBadge(doc.state)}</td>
      <td class="nowrap">${fmtDate(doc.updatedAt?.toDate?.()?.toISOString())}</td>
      <td class="actions-cell">
        <a class="btn btn-link btn-sm" href="#/documents/${esc(doc.id)}">View</a>
        ${isAdmin() ? `<a class="btn btn-link btn-sm" href="#/documents/${esc(doc.id)}/allocation">Allocation</a>` : ''}
      </td>
    </tr>`;
  }).join('');

  render(pageShell('documents', `
    <div class="page-header">
      <div>
        <h1>Documents</h1>
        <p>${docs.length} document${docs.length !== 1 ? 's' : ''} ${isAdmin() ? 'total' : 'assigned to you'}</p>
      </div>
      <div class="header-actions">
        ${isAdmin() ? `<a class="btn btn-primary" href="#/documents/new">+ Add Document</a>` : ''}
      </div>
    </div>

    <form class="filter-bar" onsubmit="applyDocFilters(event)">
      <input type="search" id="f-search" placeholder="Search document number, title…" value="${esc(params.search||'')}">
      <select id="f-project">
        <option value="">All projects</option>
        ${projectOptions}
      </select>
      <select id="f-disc">
        <option value="">All disciplines</option>
        ${discOptions}
      </select>
      <select id="f-state">
        <option value="">All states</option>
        ${stateOptions}
      </select>
      <button type="submit" class="btn btn-primary">Filter</button>
      <button type="button" class="btn btn-ghost" onclick="nav('/documents')">Reset</button>
    </form>

    <div class="panel table-panel">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Doc #</th>
              <th>Title / Project</th>
              <th>Discipline</th>
              <th>Owner</th>
              <th>State</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="7"><div class="empty-state">
              <div class="empty-icon">📄</div>
              <h3>No documents found</h3>
              <p>Try adjusting your filters${isAdmin() ? ' or add a new document' : ''}.</p>
            </div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div style="padding:10px 14px;color:var(--muted);font-size:12px">
        Showing ${docs.length} document${docs.length !== 1 ? 's' : ''}
      </div>
    </div>
  `));
}

function applyDocFilters(e) {
  if (e) e.preventDefault();
  const search = document.getElementById('f-search').value.trim();
  const projectId = document.getElementById('f-project').value;
  const discipline = document.getElementById('f-disc').value;
  const state = document.getElementById('f-state').value;
  const params = {};
  if (search) params.search = search;
  if (projectId) params.projectId = projectId;
  if (discipline) params.discipline = discipline;
  if (state) params.state = state;
  renderDocuments(params);
}

// ══════════════════════════════════════════════════════
//  15.  PAGE: DOCUMENT DETAIL
// ══════════════════════════════════════════════════════

async function renderDocDetail(docId) {
  const [doc, revs, projects, users] = await Promise.all([
    getDocument(docId), getRevisions(docId), getProjects(), getUsers()
  ]);
  if (!doc) { render(pageShell('documents', `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Document not found</h3><a class="btn btn-secondary" href="#/documents">← Back</a></div>`)); return; }

  const pmap = {}; projects.forEach(p => { pmap[p.id] = p; });
  const umap = {}; users.forEach(u => { umap[u.id] = u; });

  const proj = pmap[doc.projectId];
  const owner = umap[doc.primaryOwnerId];
  const viewers = (doc.additionalViewerIds || []).map(uid => umap[uid]?.displayName || uid).join(', ');

  const canEdit = canEditRevision(doc);
  const canAdmin = canEditDoc(doc);

  const revRows = revs.map(r => {
    const st = revStatus(r);
    return `<tr>
      <td class="nowrap"><strong>Rev ${esc(r.revisionNumber)}</strong></td>
      <td class="nowrap">${fmtDate(r.startDate)}</td>
      <td class="nowrap">${fmtDate(r.targetSentDate)}</td>
      <td class="nowrap">${fmtDate(r.actualSentDate)||'—'}</td>
      <td class="nowrap">${fmtDate(r.receivedDate)||'—'}</td>
      <td class="nowrap">${fmtDate(r.clientResponseDueDate)||'—'}</td>
      <td>${badge(st.label, st.cls)}</td>
      <td>${r.finalApproved ? badge('✓ Approved','badge-success') : ''}</td>
      <td class="actions-cell">
        ${canEdit ? `<a class="btn btn-link btn-sm" href="#/documents/${esc(docId)}/revisions/${esc(r.id)}/edit">Edit</a>` : ''}
        ${canAdmin ? `<button class="btn btn-link btn-sm" style="color:var(--red)" onclick="deleteRevision('${esc(r.id)}','${esc(docId)}')">Delete</button>` : ''}
      </td>
    </tr>`;
  }).join('');

  render(pageShell('documents', `
    <div style="margin-bottom:14px">
      <a href="#/documents" style="color:var(--muted);font-size:13px">← All documents</a>
    </div>

    <div class="detail-card">
      <span class="doc-number">${esc(doc.documentNumber)}</span>
      <h2>${esc(doc.title)}</h2>
      <div class="detail-grid">
        <div class="detail-item"><label>Project</label><span>${proj ? `${esc(proj.projectNumber)} — ${esc(proj.name)}` : '—'}</span></div>
        <div class="detail-item"><label>Discipline</label><span>${esc(doc.discipline||'—')}</span></div>
        <div class="detail-item"><label>Document Code</label><span>${esc(doc.documentCode||'—')}</span></div>
        <div class="detail-item"><label>Issue Purpose</label><span>${esc(doc.issuePurpose||'—')}</span></div>
        <div class="detail-item"><label>Internal / External</label><span>${esc(doc.internalExternal||'—')}</span></div>
        <div class="detail-item"><label>Primary Owner</label><span>${esc(owner?.displayName||doc.responsibleName||'—')}</span></div>
        <div class="detail-item"><label>Additional Viewers</label><span>${esc(viewers||'—')}</span></div>
        <div class="detail-item"><label>State</label><span>${docStateBadge(doc.state)}</span></div>
        <div class="detail-item"><label>Final Approved</label><span>${doc.finalApproved ? badge('Yes','badge-success') : badge('No','badge-muted')}</span></div>
        ${doc.generalRemarks ? `<div class="detail-item" style="grid-column:1/-1"><label>Remarks</label><span>${esc(doc.generalRemarks)}</span></div>` : ''}
      </div>
      <div class="detail-actions">
        ${canAdmin ? `<a class="btn btn-secondary" href="#/documents/${esc(docId)}/edit">Edit Master Data</a>` : ''}
        ${canAdmin ? `<a class="btn btn-secondary" href="#/documents/${esc(docId)}/allocation">Edit Allocation</a>` : ''}
        ${canEdit  ? `<button class="btn btn-primary" onclick="addRevision('${esc(docId)}')">+ Add Revision</button>` : ''}
        ${canAdmin ? `<button class="btn btn-danger btn-sm" onclick="deleteDocument('${esc(docId)}')">Delete Document</button>` : ''}
      </div>
    </div>

    <div class="panel table-panel">
      <div class="panel-heading"><h2>Revisions (${revs.length})</h2></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rev #</th><th>Start</th><th>Target Sent</th><th>Actual Sent</th>
              <th>Received</th><th>Client Due</th><th>Status</th><th>Approval</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${revRows || `<tr><td colspan="9"><div class="empty-state" style="padding:32px 20px">
              <div class="empty-icon">📋</div><h3>No revisions yet</h3>
              ${canEdit ? `<p>Click "+ Add Revision" above to create the first one.</p>` : '<p>No revisions have been added.</p>'}
            </div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `));
}

async function addRevision(docId) {
  const doc = await getDocument(docId);
  if (!doc || !canEditRevision(doc)) { toast('You do not have permission to add revisions.','error'); return; }
  const revs = await getRevisions(docId);
  const nextRev = revs.length > 0 ? revs[revs.length-1].revisionNumber + 1 : 1;
  const newRev = { documentId: docId, revisionNumber: nextRev, startDate: today(), targetSentDate: '', actualSentDate: '', receivedDate: '', clientResponseDueDate: '', finalApproved: false, remarks: '', version: 1, createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: S.user.uid };
  const ref = await db.collection('revisions').add(newRev);
  await writeAudit('create','revision',ref.id,`Rev ${nextRev} of ${doc.documentNumber}`);
  toast(`Revision ${nextRev} added — editing now…`,'success');
  nav(`/documents/${docId}/revisions/${ref.id}/edit`);
}

async function deleteRevision(revId, docId) {
  if (!isAdmin()) { toast('Admin only.','error'); return; }
  if (!confirm('Delete this revision? This cannot be undone.')) return;
  await db.collection('revisions').doc(revId).delete();
  await writeAudit('delete','revision',revId,'revision');
  toast('Revision deleted.','success');
  renderDocDetail(docId);
}

async function deleteDocument(docId) {
  if (!isAdmin()) { toast('Admin only.','error'); return; }
  if (!confirm('Delete this document and ALL its revisions? This cannot be undone.')) return;
  const revs = await getRevisions(docId);
  const batch = db.batch();
  revs.forEach(r => batch.delete(db.collection('revisions').doc(r.id)));
  batch.delete(db.collection('documents').doc(docId));
  await batch.commit();
  await writeAudit('delete','document',docId,'document');
  toast('Document and revisions deleted.','success');
  nav('/documents');
}

// ══════════════════════════════════════════════════════
//  16.  PAGE: REVISION EDIT
// ══════════════════════════════════════════════════════

async function renderRevEdit(docId, revId) {
  const [doc, rev] = await Promise.all([getDocument(docId), getRevision(revId)]);
  if (!doc || !rev) { render(pageShell('documents',`<div class="empty-state"><h3>Not found</h3><a class="btn btn-secondary" href="#/documents">← Back</a></div>`)); return; }
  if (!canEditRevision(doc)) { render(pageShell('documents',`<div class="empty-state"><h3>Access denied</h3></div>`)); return; }

  render(pageShell('documents', `
    <div style="margin-bottom:14px">
      <a href="#/documents/${esc(docId)}" style="color:var(--muted);font-size:13px">← ${esc(doc.documentNumber)} — ${esc(doc.title)}</a>
    </div>
    <div class="form-card">
      <h2 style="margin-bottom:4px">Edit Revision ${esc(rev.revisionNumber)}</h2>
      <p style="color:var(--muted);margin-bottom:24px">${esc(doc.documentNumber)} — ${esc(doc.title)}</p>

      <form id="rev-form" onsubmit="saveRevision(event,'${esc(docId)}','${esc(revId)}')">
        <div class="form-section">
          <h3>Revision Dates</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Start Date</label>
              <input type="date" id="f-startDate" value="${esc(rev.startDate||'')}">
            </div>
            <div class="form-group">
              <label>Target Sent Date</label>
              <input type="date" id="f-targetSentDate" value="${esc(rev.targetSentDate||'')}">
            </div>
            <div class="form-group">
              <label>Actual Sent Date</label>
              <input type="date" id="f-actualSentDate" value="${esc(rev.actualSentDate||'')}">
            </div>
            <div class="form-group">
              <label>Received Date</label>
              <input type="date" id="f-receivedDate" value="${esc(rev.receivedDate||'')}">
            </div>
            <div class="form-group">
              <label>Client Response Due Date</label>
              <input type="date" id="f-clientResponseDueDate" value="${esc(rev.clientResponseDueDate||'')}">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Status & Notes</h3>
          <div class="form-group" style="margin-bottom:14px">
            <div class="check-group">
              <input type="checkbox" id="f-finalApproved" ${rev.finalApproved ? 'checked' : ''}>
              <label for="f-finalApproved">Final Approved</label>
            </div>
          </div>
          <div class="form-group">
            <label>Remarks</label>
            <textarea id="f-remarks" rows="4">${esc(rev.remarks||'')}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="save-btn">Save Changes</button>
          <a class="btn btn-secondary" href="#/documents/${esc(docId)}">Cancel</a>
          <span class="form-error" id="rev-err"></span>
        </div>
      </form>
    </div>
  `));
}

async function saveRevision(e, docId, revId) {
  e.preventDefault();
  const btn = document.getElementById('save-btn');
  const err = document.getElementById('rev-err');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const updates = {
      startDate:             document.getElementById('f-startDate').value || null,
      targetSentDate:        document.getElementById('f-targetSentDate').value || null,
      actualSentDate:        document.getElementById('f-actualSentDate').value || null,
      receivedDate:          document.getElementById('f-receivedDate').value || null,
      clientResponseDueDate: document.getElementById('f-clientResponseDueDate').value || null,
      finalApproved:         document.getElementById('f-finalApproved').checked,
      remarks:               document.getElementById('f-remarks').value.trim(),
      updatedAt:             firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:             S.user.uid
    };
    await db.collection('revisions').doc(revId).update(updates);
    const doc = await getDocument(docId);
    await writeAudit('update','revision',revId,`Rev of ${doc?.documentNumber}`,updates);
    toast('Revision saved.','success');
    nav(`/documents/${docId}`);
  } catch (ex) {
    err.textContent = 'Save failed: ' + ex.message;
    btn.disabled = false; btn.textContent = 'Save Changes';
  }
}

// ══════════════════════════════════════════════════════
//  17.  PAGE: DOCUMENT NEW / EDIT
// ══════════════════════════════════════════════════════

async function renderDocNew() {
  const projects = await getProjects();
  renderDocForm(null, projects);
}

async function renderDocEdit(docId) {
  const [doc, projects] = await Promise.all([getDocument(docId), getProjects()]);
  renderDocForm(doc, projects);
}

function renderDocForm(doc, projects) {
  const isNew = !doc;
  const projOptions = projects.map(p =>
    `<option value="${esc(p.id)}" ${doc?.projectId === p.id ? 'selected':''}>${esc(p.projectNumber)} — ${esc(p.name)}</option>`).join('');
  const discOptions = DISCIPLINES.map(d =>
    `<option value="${esc(d)}" ${doc?.discipline === d ? 'selected':''}>${d || '— Select —'}</option>`).join('');
  const purposeOptions = PURPOSES.map(p =>
    `<option value="${esc(p)}" ${doc?.issuePurpose === p ? 'selected':''}>${p || '— Select —'}</option>`).join('');
  const stateOptions = DOC_STATES.map(s =>
    `<option value="${esc(s)}" ${(doc?.state||'active') === s ? 'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('');

  render(pageShell('documents', `
    <div style="margin-bottom:14px">
      <a href="${doc ? `#/documents/${esc(doc.id)}` : '#/documents'}" style="color:var(--muted);font-size:13px">← ${doc ? 'Back to document' : 'All documents'}</a>
    </div>
    <div class="form-card">
      <h2 style="margin-bottom:20px">${isNew ? 'Add New Document' : 'Edit Document Master Data'}</h2>
      <form id="doc-form" onsubmit="saveDocument(event,${doc ? `'${esc(doc.id)}'` : 'null'})">
        <div class="form-section">
          <h3>Identification</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Document Number <span style="color:var(--red)">*</span></label>
              <input type="text" id="f-docNumber" value="${esc(doc?.documentNumber||'')}" required placeholder="e.g. 26002-MEC-001">
            </div>
            <div class="form-group">
              <label>Project <span style="color:var(--red)">*</span></label>
              <select id="f-projectId" required>
                <option value="">— Select project —</option>
                ${projOptions}
              </select>
            </div>
            <div class="form-group full">
              <label>Document Title <span style="color:var(--red)">*</span></label>
              <input type="text" id="f-title" value="${esc(doc?.title||'')}" required placeholder="Full document title">
            </div>
            <div class="form-group">
              <label>Discipline</label>
              <select id="f-discipline">${discOptions}</select>
            </div>
            <div class="form-group">
              <label>Document Code</label>
              <input type="text" id="f-documentCode" value="${esc(doc?.documentCode||'')}" placeholder="e.g. SP">
            </div>
            <div class="form-group">
              <label>Issue Purpose</label>
              <select id="f-issuePurpose">${purposeOptions}</select>
            </div>
            <div class="form-group">
              <label>Internal / External</label>
              <select id="f-internalExternal">
                ${INT_EXT.map(v=>`<option value="${esc(v)}" ${doc?.internalExternal===v?'selected':''}>${esc(v)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>State</label>
              <select id="f-state">${stateOptions}</select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Additional Info</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Owner Name (text)</label>
              <input type="text" id="f-responsibleName" value="${esc(doc?.responsibleName||'')}" placeholder="Enter name as text">
              <span class="hint">Free-text name visible in document lists. Use Allocation page to set actual user account as owner.</span>
            </div>
            <div class="form-group">
              <div class="check-group" style="margin-top:24px">
                <input type="checkbox" id="f-finalApprovedDoc" ${doc?.finalApproved ? 'checked':''}>
                <label for="f-finalApprovedDoc">Final Approved (master)</label>
              </div>
            </div>
            <div class="form-group full">
              <label>General Remarks</label>
              <textarea id="f-generalRemarks">${esc(doc?.generalRemarks||'')}</textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="doc-save-btn">${isNew ? 'Create Document' : 'Save Changes'}</button>
          <a class="btn btn-secondary" href="${doc ? `#/documents/${esc(doc.id)}` : '#/documents'}">Cancel</a>
          <span class="form-error" id="doc-err"></span>
        </div>
      </form>
    </div>
  `));
}

async function saveDocument(e, docId) {
  e.preventDefault();
  const btn = document.getElementById('doc-save-btn');
  const err = document.getElementById('doc-err');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const data = {
      documentNumber:   document.getElementById('f-docNumber').value.trim(),
      projectId:        document.getElementById('f-projectId').value,
      title:            document.getElementById('f-title').value.trim(),
      discipline:       document.getElementById('f-discipline').value,
      documentCode:     document.getElementById('f-documentCode').value.trim(),
      issuePurpose:     document.getElementById('f-issuePurpose').value,
      internalExternal: document.getElementById('f-internalExternal').value,
      state:            document.getElementById('f-state').value,
      responsibleName:  document.getElementById('f-responsibleName').value.trim(),
      finalApproved:    document.getElementById('f-finalApprovedDoc').checked,
      generalRemarks:   document.getElementById('f-generalRemarks').value.trim(),
      updatedAt:        firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:        S.user.uid,
    };
    let id = docId;
    if (!docId) {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      data.createdBy = S.user.uid;
      data.version = 1;
      data.primaryOwnerId = null;
      data.additionalViewerIds = [];
      const ref = await db.collection('documents').add(data);
      id = ref.id;
      await writeAudit('create','document',id,data.documentNumber);
      toast('Document created.','success');
    } else {
      await db.collection('documents').doc(docId).update(data);
      await writeAudit('update','document',docId,data.documentNumber,data);
      toast('Document saved.','success');
    }
    nav(`/documents/${id}`);
  } catch (ex) {
    err.textContent = 'Error: ' + ex.message;
    btn.disabled = false; btn.textContent = docId ? 'Save Changes' : 'Create Document';
  }
}

// ══════════════════════════════════════════════════════
//  18.  PAGE: DOCUMENT ALLOCATION
// ══════════════════════════════════════════════════════

async function renderDocAllocation(docId) {
  const [doc, users, projects] = await Promise.all([getDocument(docId), getUsers(), getProjects()]);
  if (!doc) { render(pageShell('documents',`<div class="empty-state"><h3>Not found</h3></div>`)); return; }

  const pmap = {}; projects.forEach(p => { pmap[p.id] = p; });
  const umap = {}; users.forEach(u => { umap[u.id] = u; });

  const ownerOptions = users
    .filter(u => u.isActive !== false)
    .map(u => `<option value="${esc(u.id)}" ${doc.primaryOwnerId === u.id ? 'selected':''}>${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`)
    .join('');

  const viewerOptions = users
    .filter(u => u.isActive !== false && u.id !== doc.primaryOwnerId)
    .map(u => `<option value="${esc(u.id)}">${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`)
    .join('');

  const viewerChips = (doc.additionalViewerIds || []).map(uid => {
    const u = umap[uid];
    return `<div class="viewer-chip" id="vc-${esc(uid)}">${esc(u?.displayName||uid)}<button type="button" onclick="removeViewer('${esc(uid)}')">×</button></div>`;
  }).join('');

  render(pageShell('documents', `
    <div style="margin-bottom:14px">
      <a href="#/documents/${esc(docId)}" style="color:var(--muted);font-size:13px">← ${esc(doc.documentNumber)} — ${esc(doc.title)}</a>
    </div>
    <div class="form-card">
      <h2 style="margin-bottom:4px">Edit Allocation</h2>
      <p style="color:var(--muted);margin-bottom:24px">${esc(doc.documentNumber)} — ${esc(doc.title)}</p>

      <div class="alert alert-info" style="margin-bottom:20px">
        ℹ️ <strong>Primary Owner</strong> can view and edit revisions (if their role is Project Manager, Document Controller, or Engineer).
        <strong>Additional Viewers</strong> can view the document and its revisions.
      </div>

      <form id="alloc-form" onsubmit="saveAllocation(event,'${esc(docId)}')">
        <div class="form-section">
          <h3>Primary Owner</h3>
          <div class="form-group">
            <label>Select user as primary owner</label>
            <select id="f-owner">
              <option value="">— No owner (admin-only visible) —</option>
              ${ownerOptions}
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Additional Viewers</h3>
          <div class="form-group">
            <label>Add viewer</label>
            <div style="display:flex;gap:8px">
              <select id="f-add-viewer" style="flex:1">${viewerOptions}</select>
              <button type="button" class="btn btn-secondary" onclick="addViewer()">Add</button>
            </div>
          </div>
          <div class="viewer-list" id="viewer-chips">${viewerChips}</div>
          <input type="hidden" id="f-viewerIds" value="${esc(JSON.stringify(doc.additionalViewerIds||[]))}">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="alloc-btn">Save Allocation</button>
          <a class="btn btn-secondary" href="#/documents/${esc(docId)}">Cancel</a>
          <span class="form-error" id="alloc-err"></span>
        </div>
      </form>
    </div>
  `));
  // store users for chip rendering
  window._allocUsers = Object.fromEntries(users.map(u => [u.id, u]));
}

function addViewer() {
  const sel = document.getElementById('f-add-viewer');
  const uid = sel.value;
  if (!uid) return;
  const hidden = document.getElementById('f-viewerIds');
  const ids = JSON.parse(hidden.value);
  if (ids.includes(uid)) return;
  ids.push(uid);
  hidden.value = JSON.stringify(ids);
  const u = window._allocUsers?.[uid];
  const chip = document.createElement('div');
  chip.className = 'viewer-chip'; chip.id = `vc-${uid}`;
  chip.innerHTML = `${esc(u?.displayName||uid)}<button type="button" onclick="removeViewer('${esc(uid)}')">×</button>`;
  document.getElementById('viewer-chips').appendChild(chip);
}

function removeViewer(uid) {
  const hidden = document.getElementById('f-viewerIds');
  if (!hidden) return;
  const ids = JSON.parse(hidden.value).filter(id => id !== uid);
  hidden.value = JSON.stringify(ids);
  document.getElementById(`vc-${uid}`)?.remove();
}

async function saveAllocation(e, docId) {
  e.preventDefault();
  const btn = document.getElementById('alloc-btn');
  const err = document.getElementById('alloc-err');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const ownerId = document.getElementById('f-owner').value || null;
    const viewerIds = JSON.parse(document.getElementById('f-viewerIds').value);
    await db.collection('documents').doc(docId).update({
      primaryOwnerId: ownerId,
      additionalViewerIds: viewerIds,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: S.user.uid
    });
    const doc = await getDocument(docId);
    await writeAudit('update','document-allocation',docId,doc?.documentNumber||docId,{ownerId,viewerIds});
    toast('Allocation saved.','success');
    nav(`/documents/${docId}`);
  } catch (ex) {
    err.textContent = 'Error: ' + ex.message;
    btn.disabled = false; btn.textContent = 'Save Allocation';
  }
}

// ══════════════════════════════════════════════════════
//  19.  PAGE: PROJECTS
// ══════════════════════════════════════════════════════

async function renderProjects() {
  const [projects, allDocsSnap] = await Promise.all([
    getProjects(),
    db.collection('documents').get()
  ]);
  const docCount = {};
  allDocsSnap.docs.forEach(d => {
    const pid = d.data().projectId;
    docCount[pid] = (docCount[pid] || 0) + 1;
  });

  const rows = projects.map(p => `
    <tr onclick="nav('/projects/${esc(p.id)}')" style="cursor:pointer">
      <td><a href="#/projects/${esc(p.id)}" onclick="event.stopPropagation()">${esc(p.projectNumber)}</a></td>
      <td class="title-cell"><strong>${esc(p.name)}</strong></td>
      <td>${esc(p.clientName||'—')}</td>
      <td style="text-align:right">${docCount[p.id]||0}</td>
      <td>${p.active ? badge('Active','badge-success') : badge('Inactive','badge-muted')}</td>
      <td class="actions-cell">
        ${isAdmin() ? `<button class="btn btn-link btn-sm" onclick="event.stopPropagation();editProject('${esc(p.id)}')">Edit</button>` : ''}
      </td>
    </tr>`).join('');

  render(pageShell('projects', `
    <div class="page-header">
      <div><h1>Projects</h1><p>${projects.length} projects</p></div>
      <div class="header-actions">
        ${isAdmin() ? `<button class="btn btn-primary" onclick="showNewProjectModal()">+ Add Project</button>` : ''}
      </div>
    </div>
    <div class="panel table-panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Project #</th><th>Name</th><th>Client</th><th style="text-align:right">Docs</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🏗️</div><h3>No projects yet</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
    <div id="modal-slot"></div>
  `));
}

async function renderProjectDetail(projectId) {
  const [proj, docs] = await Promise.all([getProject(projectId), getAccessibleDocuments({projectId})]);
  if (!proj) { render(pageShell('projects',`<div class="empty-state"><h3>Project not found</h3><a class="btn btn-secondary" href="#/projects">← Back</a></div>`)); return; }

  const rows = docs.map(doc => `
    <tr onclick="nav('/documents/${esc(doc.id)}')" style="cursor:pointer">
      <td><a href="#/documents/${esc(doc.id)}" onclick="event.stopPropagation()">${esc(doc.documentNumber)}</a></td>
      <td class="title-cell">${esc(doc.title)}</td>
      <td>${esc(doc.discipline||'—')}</td>
      <td>${esc(doc.responsibleName||'—')}</td>
      <td>${docStateBadge(doc.state)}</td>
    </tr>`).join('');

  render(pageShell('projects', `
    <div style="margin-bottom:14px"><a href="#/projects" style="color:var(--muted);font-size:13px">← All projects</a></div>
    <div class="detail-card">
      <h2>${esc(proj.name)}</h2>
      <div class="detail-grid">
        <div class="detail-item"><label>Project Number</label><span>${esc(proj.projectNumber)}</span></div>
        <div class="detail-item"><label>Client</label><span>${esc(proj.clientName||'—')}</span></div>
        <div class="detail-item"><label>Status</label><span>${proj.active ? badge('Active','badge-success') : badge('Inactive','badge-muted')}</span></div>
        <div class="detail-item"><label>Warning Days</label><span>${esc(proj.warningDays||7)} days</span></div>
      </div>
      <div class="detail-actions">
        ${isAdmin() ? `<button class="btn btn-secondary" onclick="editProject('${esc(proj.id)}')">Edit Project</button>` : ''}
        ${isAdmin() ? `<a class="btn btn-primary" href="#/documents/new">+ Add Document to Project</a>` : ''}
      </div>
    </div>
    <div class="panel table-panel">
      <div class="panel-heading"><h2>Documents (${docs.length})</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Doc #</th><th>Title</th><th>Discipline</th><th>Owner</th><th>State</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5"><div class="empty-state" style="padding:32px"><div class="empty-icon">📄</div><h3>No documents</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `));
}

function showNewProjectModal() {
  showProjectModal(null);
}

function editProject(id) {
  db.collection('projects').doc(id).get().then(snap => {
    if (snap.exists) showProjectModal({ id: snap.id, ...snap.data() });
  });
}

function showProjectModal(proj) {
  const slot = document.getElementById('modal-slot');
  if (!slot) return;
  slot.innerHTML = `
  <div class="modal-backdrop" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h2>${proj ? 'Edit Project' : 'New Project'}</h2>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveProject(event,${proj ? `'${esc(proj.id)}'` : 'null'})">
          <div class="form-group"><label>Project Number *</label><input id="mp-num" value="${esc(proj?.projectNumber||'')}" required placeholder="26001"></div>
          <div class="form-group"><label>Project Name *</label><input id="mp-name" value="${esc(proj?.name||'')}" required placeholder="Project name"></div>
          <div class="form-group"><label>Client Name</label><input id="mp-client" value="${esc(proj?.clientName||'')}" placeholder="Client company"></div>
          <div class="form-group"><label>Warning Days</label><input type="number" id="mp-warn" value="${esc(proj?.warningDays||7)}" min="1" max="90"></div>
          <div class="form-group"><div class="check-group"><input type="checkbox" id="mp-active" ${!proj||proj.active?'checked':''}><label for="mp-active">Active</label></div></div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${proj ? 'Save' : 'Create'}</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <span class="form-error" id="proj-err"></span>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

async function saveProject(e, projId) {
  e.preventDefault();
  const err = document.getElementById('proj-err');
  const data = {
    projectNumber: document.getElementById('mp-num').value.trim(),
    name: document.getElementById('mp-name').value.trim(),
    clientName: document.getElementById('mp-client').value.trim(),
    warningDays: parseInt(document.getElementById('mp-warn').value) || 7,
    active: document.getElementById('mp-active').checked,
  };
  try {
    if (projId) {
      await db.collection('projects').doc(projId).update({ ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      await writeAudit('update','project',projId,data.projectNumber);
      toast('Project updated.','success');
    } else {
      const ref = await db.collection('projects').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: S.user.uid });
      await writeAudit('create','project',ref.id,data.projectNumber);
      toast('Project created.','success');
    }
    invalidateCache();
    closeModal();
    renderProjects();
  } catch (ex) {
    err.textContent = 'Error: ' + ex.message;
  }
}

function closeModal(e) {
  if (e && e.target !== document.querySelector('.modal-backdrop')) return;
  document.getElementById('modal-slot')?.remove() || (document.querySelector('.modal-backdrop')?.remove());
}

// ══════════════════════════════════════════════════════
//  20.  PAGE: ADMIN USERS
// ══════════════════════════════════════════════════════

async function renderAdminUsers() {
  const users = await getUsers();
  const rows = users.map(u => `
    <tr>
      <td>${esc(u.displayName||'—')}</td>
      <td>${esc(u.email||'—')}</td>
      <td>${roleBadge(u.role)}</td>
      <td>${u.isActive === false ? badge('Inactive','badge-muted') : badge('Active','badge-success')}</td>
      <td class="actions-cell">
        <a class="btn btn-link btn-sm" href="#/admin/users/${esc(u.id)}/edit">Edit</a>
        <button class="btn btn-link btn-sm" style="color:${u.isActive===false?'var(--green)':'var(--red)'}" onclick="toggleUserActive('${esc(u.id)}',${!u.isActive})">
          ${u.isActive === false ? 'Activate' : 'Deactivate'}
        </button>
      </td>
    </tr>`).join('');

  render(pageShell('admin-users', `
    <div class="page-header">
      <div><h1>User Management</h1><p>${users.length} users in the system</p></div>
      <div class="header-actions">
        <a class="btn btn-primary" href="#/admin/users/new">+ Add User</a>
      </div>
    </div>
    <div class="alert alert-info">
      ℹ️ Users are created in Firebase Authentication. Add a user here to give them a role and allow them to sign in.
      Their password is set when you create them — they should change it after first login.
    </div>
    <div class="panel table-panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5"><div class="empty-state"><h3>No users yet</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `));
}

async function renderUserForm(userId) {
  const user = userId ? await getUser(userId) : null;
  const roleOptions = ROLES.map(r =>
    `<option value="${esc(r)}" ${(user?.role||'viewer') === r ? 'selected':''}>${esc(ROLE_LABELS[r])}</option>`).join('');

  render(pageShell('admin-users', `
    <div style="margin-bottom:14px"><a href="#/admin/users" style="color:var(--muted);font-size:13px">← Users</a></div>
    <div class="form-card">
      <h2 style="margin-bottom:20px">${user ? 'Edit User' : 'Add New User'}</h2>
      <form id="user-form" onsubmit="saveUser(event,${user ? `'${esc(user.id)}'` : 'null'})">
        <div class="form-grid">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="f-uname" value="${esc(user?.displayName||'')}" required placeholder="First Last">
          </div>
          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" id="f-uemail" value="${esc(user?.email||'')}" ${user?'readonly':''} required placeholder="user@company.com">
            ${user ? '<span class="hint">Email cannot be changed after creation.</span>' : ''}
          </div>
          ${!user ? `<div class="form-group">
            <label>Password *</label>
            <input type="password" id="f-upass" required minlength="8" placeholder="Min. 8 characters">
          </div>` : ''}
          <div class="form-group">
            <label>Role *</label>
            <select id="f-urole" required>${roleOptions}</select>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="user-save-btn">${user ? 'Save Changes' : 'Create User'}</button>
          <a class="btn btn-secondary" href="#/admin/users">Cancel</a>
          <span class="form-error" id="user-err"></span>
        </div>
      </form>
    </div>
  `));
}

async function saveUser(e, userId) {
  e.preventDefault();
  const btn = document.getElementById('user-save-btn');
  const err = document.getElementById('user-err');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const name  = document.getElementById('f-uname').value.trim();
    const email = document.getElementById('f-uemail').value.trim();
    const role  = document.getElementById('f-urole').value;
    const pass  = document.getElementById('f-upass')?.value;

    if (userId) {
      // Update profile only (email/password changes need Firebase Admin or re-auth)
      await db.collection('users').doc(userId).update({ displayName: name, role, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      invalidateCache();
      await writeAudit('update','user',userId,name,{role});
      toast('User updated.','success');
      nav('/admin/users');
    } else {
      // Create Auth account via REST API — does NOT sign out the current admin
      const apiKey = firebase.app().options.apiKey;
      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass, returnSecureToken: true })
        }
      );
      const data = await resp.json();
      if (data.error) {
        const msg = data.error.message || 'Unknown error';
        if (msg.includes('EMAIL_EXISTS')) throw { code: 'auth/email-already-in-use' };
        throw new Error(msg);
      }
      const newUid = data.localId;
      // Write Firestore profile
      await db.collection('users').doc(newUid).set({
        displayName: name, email, role, isActive: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user?.uid || ''
      });
      invalidateCache();
      await writeAudit('create', 'user', newUid, name, { role, email });
      toast('User created successfully! They can now sign in.', 'success');
      nav('/admin/users');
    }
  } catch (ex) {
    if (ex.code === 'auth/email-already-in-use') {
      err.textContent = 'That email is already registered.';
    } else {
      err.textContent = 'Error: ' + ex.message;
    }
    btn.disabled = false; btn.textContent = userId ? 'Save Changes' : 'Create User';
  }
}

async function toggleUserActive(userId, active) {
  await db.collection('users').doc(userId).update({ isActive: active, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  invalidateCache();
  await writeAudit(active ? 'activate':'deactivate','user',userId,'user');
  toast(active ? 'User activated.' : 'User deactivated.','success');
  renderAdminUsers();
}

// ══════════════════════════════════════════════════════
//  21.  PAGE: OWNERSHIP TRANSFER
// ══════════════════════════════════════════════════════

async function renderAdminTransfer() {
  const users = await getUsers();
  const userOptions = users.filter(u => u.isActive !== false).map(u =>
    `<option value="${esc(u.id)}">${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`).join('');

  render(pageShell('admin-transfer', `
    <div class="page-header"><div><h1>Ownership Transfer</h1><p>Move all documents from one owner to another.</p></div></div>
    <div class="form-card">
      <div class="alert alert-warning">⚠️ This will update the Primary Owner of every document currently assigned to the "From" user and reassign them to the "To" user. This action cannot be undone.</div>
      <form id="transfer-form" onsubmit="doTransfer(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Transfer FROM (current owner) *</label>
            <select id="t-from" required><option value="">— Select user —</option>${userOptions}</select>
          </div>
          <div class="form-group">
            <label>Transfer TO (new owner) *</label>
            <select id="t-to" required><option value="">— Select user —</option>${userOptions}</select>
          </div>
        </div>
        <div class="form-group" style="margin-top:16px">
          <div class="check-group">
            <input type="checkbox" id="t-confirm" required>
            <label for="t-confirm">I understand this will update all matching documents</label>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-danger" id="transfer-btn">Transfer Ownership</button>
          <a class="btn btn-secondary" href="#/dashboard">Cancel</a>
          <span class="form-error" id="transfer-err"></span>
        </div>
      </form>
    </div>
  `));
}

async function doTransfer(e) {
  e.preventDefault();
  const fromId = document.getElementById('t-from').value;
  const toId   = document.getElementById('t-to').value;
  const btn    = document.getElementById('transfer-btn');
  const err    = document.getElementById('transfer-err');
  if (fromId === toId) { err.textContent = 'From and To must be different users.'; return; }
  btn.disabled = true; btn.textContent = 'Transferring…';
  try {
    const snap = await db.collection('documents').where('primaryOwnerId','==',fromId).get();
    if (snap.empty) { err.textContent = 'No documents found owned by the selected user.'; btn.disabled=false; btn.textContent='Transfer Ownership'; return; }
    const batch = db.batch();
    snap.docs.forEach(d => batch.update(d.ref, { primaryOwnerId: toId, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: S.user.uid }));
    await batch.commit();
    await writeAudit('transfer-ownership','bulk','all',`${snap.size} docs`,{fromId,toId});
    toast(`Transferred ${snap.size} documents.`,'success');
    nav('/dashboard');
  } catch (ex) {
    err.textContent = 'Error: ' + ex.message;
    btn.disabled = false; btn.textContent = 'Transfer Ownership';
  }
}

// ══════════════════════════════════════════════════════
//  22.  PAGE: IMPORT EXCEL
// ══════════════════════════════════════════════════════

async function renderAdminImport() {
  const projects = await getProjects();
  const projOptions = projects.map(p =>
    `<option value="${esc(p.id)}">${esc(p.projectNumber)} — ${esc(p.name)}</option>`).join('');

  render(pageShell('admin-import', `
    <div class="page-header">
      <div><h1>Import from Excel</h1><p>Upload an Excel file to import or update documents and revisions.</p></div>
    </div>
    <div class="form-card" style="max-width:900px">
      <div class="alert alert-info">
        ℹ️ <strong>Expected format:</strong> Each row = one revision. Required columns (case-insensitive):
        <strong>Document Number, Title, Project Number, Discipline, Target Sent Date</strong>.
        Optional: Actual Sent Date, Received Date, Client Response Due Date, Final Approved, Remarks, Owner Name.
      </div>
      <div class="form-section">
        <h3>Step 1 — Select Default Project</h3>
        <div class="form-group">
          <label>Project (used when "Project Number" column is missing)</label>
          <select id="imp-project"><option value="">— Match by Project Number column —</option>${projOptions}</select>
        </div>
      </div>
      <div class="form-section">
        <h3>Step 2 — Upload Excel File</h3>
        <label class="upload-zone" for="imp-file" id="drop-zone">
          <div class="upload-icon">📊</div>
          <p><strong>Click to choose file</strong> or drag and drop here</p>
          <p>.xlsx or .xls files only</p>
          <input type="file" id="imp-file" accept=".xlsx,.xls,.csv" onchange="previewImport()">
        </label>
      </div>
      <div id="import-preview"></div>
      <div class="form-actions" id="import-actions" style="display:none">
        <button type="button" class="btn btn-primary" id="do-import-btn" onclick="doImport()">Import Now</button>
        <button type="button" class="btn btn-secondary" onclick="clearImport()">Clear</button>
        <span class="form-error" id="imp-err"></span>
      </div>
    </div>
  `));

  // Drag-and-drop
  const zone = document.getElementById('drop-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); const f = e.dataTransfer.files[0]; if (f) { document.getElementById('imp-file').files = e.dataTransfer.files; previewImport(); }});
}

let _importRows = [];

function previewImport() {
  const file = document.getElementById('imp-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: 'YYYY-MM-DD' });
      _importRows = data;
      const preview = document.getElementById('import-preview');
      const heads = data.length > 0 ? Object.keys(data[0]) : [];
      const rows = data.slice(0, 10).map(row =>
        `<tr>${heads.map(h => `<td>${esc(String(row[h]||''))}</td>`).join('')}</tr>`).join('');
      preview.innerHTML = `
        <div class="import-preview">
          <p><strong>${data.length}</strong> rows found · Showing first 10</p>
          <div class="table-wrap" style="max-height:300px;overflow:auto">
            <table>
              <thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;
      document.getElementById('import-actions').style.display = 'flex';
    } catch (ex) {
      document.getElementById('imp-err').textContent = 'Could not read file: ' + ex.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

function clearImport() {
  _importRows = [];
  document.getElementById('import-preview').innerHTML = '';
  document.getElementById('import-actions').style.display = 'none';
  document.getElementById('imp-file').value = '';
}

function normalize(obj, key) {
  const lower = key.toLowerCase().replace(/[\s_-]+/g, '');
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase().replace(/[\s_-]+/g, '') === lower) return obj[k];
  }
  return '';
}

function parseDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0,10);
  const s = String(v).trim().slice(0,10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

async function doImport() {
  if (!_importRows.length) return;
  const btn = document.getElementById('do-import-btn');
  const err = document.getElementById('imp-err');
  btn.disabled = true; btn.textContent = 'Importing…';
  try {
    const projects = await getProjects();
    const pByNum = {};
    projects.forEach(p => { pByNum[String(p.projectNumber).trim()] = p; });
    const defaultProjId = document.getElementById('imp-project').value;

    // Existing docs index by documentNumber
    const existingSnap = await db.collection('documents').get();
    const docByNum = {};
    existingSnap.docs.forEach(d => { docByNum[d.data().documentNumber] = { id: d.id, ...d.data() }; });

    let created = 0, updated = 0, skipped = 0;
    for (const row of _importRows) {
      const docNum = String(normalize(row,'document number')||normalize(row,'documentnumber')||normalize(row,'doc no')||'').trim();
      const title  = String(normalize(row,'title')||normalize(row,'document title')||'').trim();
      if (!docNum) { skipped++; continue; }

      // Resolve project
      const projNum = String(normalize(row,'project number')||normalize(row,'project no')||'').trim();
      const proj = pByNum[projNum] || (defaultProjId ? { id: defaultProjId } : null);
      const projectId = proj?.id || null;

      const revisionNumber = parseInt(normalize(row,'revision')||normalize(row,'rev no')||'1') || 1;
      const revData = {
        documentId: null, // will set after doc id known
        revisionNumber,
        startDate:             parseDate(normalize(row,'start date')||normalize(row,'startdate')),
        targetSentDate:        parseDate(normalize(row,'target sent date')||normalize(row,'target date')||normalize(row,'targetsentdate')),
        actualSentDate:        parseDate(normalize(row,'actual sent date')||normalize(row,'actual date')||normalize(row,'actualsentdate')),
        receivedDate:          parseDate(normalize(row,'received date')||normalize(row,'receiveddate')),
        clientResponseDueDate: parseDate(normalize(row,'client response due date')||normalize(row,'client due')||normalize(row,'clientresponse')),
        finalApproved:         ['yes','true','1','y'].includes(String(normalize(row,'final approved')||'').toLowerCase()),
        remarks:               String(normalize(row,'remarks')||'').trim(),
        version: 1,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user.uid
      };

      let docId;
      if (docByNum[docNum]) {
        docId = docByNum[docNum].id;
        updated++;
      } else {
        const docData = {
          documentNumber: docNum, title, projectId,
          discipline:    String(normalize(row,'discipline')||'').trim().toUpperCase(),
          documentCode:  String(normalize(row,'document code')||normalize(row,'code')||'').trim(),
          issuePurpose:  String(normalize(row,'issue purpose')||normalize(row,'purpose')||'').trim(),
          internalExternal: String(normalize(row,'internal external')||normalize(row,'type')||'External').trim(),
          responsibleName: String(normalize(row,'owner name')||normalize(row,'responsible')||'').trim(),
          state: 'active', finalApproved: false, version: 1,
          primaryOwnerId: null, additionalViewerIds: [],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: S.user.uid
        };
        const ref = await db.collection('documents').add(docData);
        docId = ref.id;
        docByNum[docNum] = { id: docId };
        created++;
      }

      revData.documentId = docId;
      await db.collection('revisions').add(revData);
    }

    await writeAudit('import','bulk','excel',`Excel import: ${created} created, ${updated} updated`);
    toast(`Import complete: ${created} new docs, ${updated} existing, ${skipped} skipped.`,'success');
    clearImport();
    btn.disabled = false; btn.textContent = 'Import Now';
  } catch (ex) {
    err.textContent = 'Import error: ' + ex.message;
    btn.disabled = false; btn.textContent = 'Import Now';
  }
}

// ══════════════════════════════════════════════════════
//  23.  PAGE: EXPORT EXCEL
// ══════════════════════════════════════════════════════

async function renderExport() {
  const projects = await getProjects();
  const projOptions = projects.map(p =>
    `<option value="${esc(p.id)}">${esc(p.projectNumber)} — ${esc(p.name)}</option>`).join('');

  render(pageShell('export', `
    <div class="page-header"><div><h1>Export to Excel</h1><p>Download a complete schedule spreadsheet.</p></div></div>
    <div class="form-card">
      <div class="form-section">
        <h3>Export Options</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Project (optional — leave blank for all)</label>
            <select id="exp-project"><option value="">All projects</option>${projOptions}</select>
          </div>
          <div class="form-group">
            <label>State</label>
            <select id="exp-state">
              <option value="">All states</option>
              ${DOC_STATES.map(s=>`<option value="${esc(s)}">${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-primary" id="exp-btn" onclick="doExport()">📥 Download Excel</button>
        <span class="form-error" id="exp-err"></span>
      </div>
      <p style="color:var(--muted);font-size:12px;margin-top:16px">The export includes all documents and their latest revision dates. Format matches the standard DCI schedule template.</p>
    </div>
  `));
}

async function doExport() {
  const btn = document.getElementById('exp-btn');
  const err = document.getElementById('exp-err');
  btn.disabled = true; btn.textContent = 'Preparing…';
  try {
    const filters = {
      projectId: document.getElementById('exp-project').value || undefined,
      state:     document.getElementById('exp-state').value   || undefined
    };
    const [docs, projects] = await Promise.all([getAccessibleDocuments(filters), getProjects()]);
    const pmap = {}; projects.forEach(p => { pmap[p.id] = p; });

    // Get all revisions for these docs
    const allRevSnap = await db.collection('revisions').get();
    const revsByDoc = {};
    allRevSnap.docs.forEach(d => {
      const r = { id: d.id, ...d.data() };
      if (!revsByDoc[r.documentId]) revsByDoc[r.documentId] = [];
      revsByDoc[r.documentId].push(r);
    });
    Object.values(revsByDoc).forEach(arr => arr.sort((a,b) => (a.revisionNumber||0)-(b.revisionNumber||0)));

    const rows = [];
    for (const doc of docs) {
      const proj = pmap[doc.projectId];
      const revs = revsByDoc[doc.id] || [{}];
      for (const rev of revs) {
        rows.push({
          'Project Number':          proj?.projectNumber || '',
          'Project Name':            proj?.name || '',
          'Client':                  proj?.clientName || '',
          'Document Number':         doc.documentNumber || '',
          'Title':                   doc.title || '',
          'Discipline':              doc.discipline || '',
          'Document Code':           doc.documentCode || '',
          'Issue Purpose':           doc.issuePurpose || '',
          'Internal/External':       doc.internalExternal || '',
          'Owner':                   doc.responsibleName || '',
          'State':                   doc.state || '',
          'Revision':                rev.revisionNumber || '',
          'Start Date':              rev.startDate || '',
          'Target Sent Date':        rev.targetSentDate || '',
          'Actual Sent Date':        rev.actualSentDate || '',
          'Received Date':           rev.receivedDate || '',
          'Client Response Due':     rev.clientResponseDueDate || '',
          'Final Approved':          rev.finalApproved ? 'Yes' : 'No',
          'Remarks':                 rev.remarks || '',
        });
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DCI Schedule');
    // Column widths
    ws['!cols'] = [12,24,18,20,40,8,10,10,12,20,10,6,12,14,14,14,16,12,40].map(w=>({wch:w}));
    const fname = `DCI_Schedule_${today()}.xlsx`;
    XLSX.writeFile(wb, fname);
    toast('Export downloaded.','success');
    await writeAudit('export','bulk','excel',`Excel export: ${rows.length} rows`);
  } catch (ex) {
    err.textContent = 'Export error: ' + ex.message;
  }
  btn.disabled = false; btn.textContent = '📥 Download Excel';
}

// ══════════════════════════════════════════════════════
//  24.  PAGE: AUDIT LOG
// ══════════════════════════════════════════════════════

async function renderAudit() {
  const snap = await db.collection('auditEvents').orderBy('createdAt','desc').limit(200).get();
  const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const rows = events.map(ev => {
    const ts = ev.createdAt?.toDate?.()?.toLocaleString() || '—';
    const changes = ev.changes ? JSON.stringify(ev.changes).slice(0,80) : '';
    return `<tr>
      <td class="nowrap" style="font-size:11.5px">${esc(ts)}</td>
      <td>${esc(ev.actorName||ev.actorId||'—')}</td>
      <td><span class="audit-action">${esc(ev.action)}</span></td>
      <td>${esc(ev.entityType||'')} <span style="color:var(--muted)">${esc(ev.entityLabel||ev.entityId||'')}</span></td>
      <td style="max-width:320px;overflow:hidden;text-overflow:ellipsis;font-size:11px;color:var(--muted)">${esc(changes)}</td>
    </tr>`;
  }).join('');

  render(pageShell('audit', `
    <div class="page-header"><div><h1>Audit Log</h1><p>Last ${events.length} events · most recent first</p></div></div>
    <div class="panel table-panel">
      <div class="table-wrap" style="max-height:calc(100vh - 200px)">
        <table>
          <thead><tr><th>When</th><th>User</th><th>Action</th><th>Object</th><th>Changes</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📋</div><h3>No audit events yet</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `));
}

// ══════════════════════════════════════════════════════
//  25.  MAIN ROUTER
// ══════════════════════════════════════════════════════

async function handleRoute() {
  const route = matchRoute(window.location.hash);

  // Redirect to login if not signed in
  if (!S.user && !route.pub) { nav('/login'); return; }

  // Already on login page with no user — show it
  if (route.page === 'login' && !S.user) { renderLogin(); return; }

  // Already signed in → redirect away from login
  if (route.page === 'login' && S.user) { nav('/'); return; }

  // Admin-only guard
  if (route.admin && !isAdmin()) {
    render(pageShell('dashboard', `<div class="empty-state"><div class="empty-icon">🔒</div><h3>Admin access required</h3><p>You do not have permission to view this page.</p><a class="btn btn-secondary" href="#/">Go to Dashboard</a></div>`));
    return;
  }

  showSpinner();

  try {
    switch (route.page) {
      case 'dashboard':        await renderDashboard();                              break;
      case 'documents':        await renderDocuments();                              break;
      case 'doc-new':          await renderDocNew();                                 break;
      case 'doc-edit':         await renderDocEdit(route.params.docId);              break;
      case 'doc-detail':       await renderDocDetail(route.params.docId);            break;
      case 'doc-allocation':   await renderDocAllocation(route.params.docId);        break;
      case 'rev-edit':         await renderRevEdit(route.params.docId, route.params.revId); break;
      case 'projects':         await renderProjects();                               break;
      case 'project-detail':   await renderProjectDetail(route.params.projectId);   break;
      case 'admin-users':      await renderAdminUsers();                             break;
      case 'user-new':         await renderUserForm(null);                           break;
      case 'user-edit':        await renderUserForm(route.params.userId);            break;
      case 'admin-transfer':   await renderAdminTransfer();                          break;
      case 'admin-import':     await renderAdminImport();                            break;
      case 'export':           await renderExport();                                 break;
      case 'audit':            await renderAudit();                                  break;
      default:
        render(pageShell('dashboard', `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Page not found</h3><a class="btn btn-secondary" href="#/">Go Home</a></div>`));
    }
  } catch (ex) {
    console.error('Route error:', ex);
    render(pageShell('dashboard', `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Something went wrong</h3><p style="color:var(--red)">${esc(ex.message)}</p><a class="btn btn-secondary" href="#/">Try again</a></div>`));
  }
}

// ══════════════════════════════════════════════════════
//  26.  BOOTSTRAP
// ══════════════════════════════════════════════════════

window.addEventListener('hashchange', handleRoute);

auth.onAuthStateChanged(async firebaseUser => {
  if (firebaseUser) {
    S.user = firebaseUser;
    try {
      const snap = await db.collection('users').doc(firebaseUser.uid).get();
      S.profile = snap.exists ? snap.data() : { role: 'viewer', displayName: firebaseUser.email };
    } catch (ex) {
      S.profile = { role: 'viewer', displayName: firebaseUser.email };
    }
    // Deactivated users get signed out
    if (S.profile.isActive === false) {
      await auth.signOut();
      return;
    }
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/login') {
      nav('/');
    } else {
      handleRoute();
    }
  } else {
    S.user = null;
    S.profile = null;
    S.cache = { projects: null, users: null };
    nav('/login');
  }
});

// Global error handler (uncaught promise rejections)
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled rejection:', e.reason);
  toast('An unexpected error occurred. See console for details.', 'error');
});
