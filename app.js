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


const SHEPL_LOGO = "data:image/gif;base64,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";
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
const DOC_TYPES   = ['Internal','External'];
const PAGE_SIZE   = 50;

// Revision workflow statuses (in order)
const REV_STATUSES = ['concept','submitted','awaiting_response','response_received','comments_received','new_revision_required','approved','final_approved'];
const REV_STATUS_LABELS = {
  concept:               'Concept',
  submitted:             'Submitted',
  awaiting_response:     'Awaiting Response',
  response_received:     'Response Received',
  comments_received:     'Comments Received',
  new_revision_required: 'New Revision Required',
  approved:              'Approved',
  final_approved:        'Final Approved'
};
const APPROVAL_STATUSES = ['pending','approved','not_approved'];
const APPROVAL_STATUS_LABELS = { pending: 'Pending', approved: 'Approved', not_approved: 'Not Approved' };

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
  if (isManagement()) return true;
  if (!S.user) return false;
  return doc.primaryOwnerId === S.user.uid ||
         (Array.isArray(doc.additionalViewerIds) && doc.additionalViewerIds.includes(S.user.uid));
}
function canEditRevision(doc) {
  if (isManagement()) return true;
  if (!S.user || !S.profile) return false;
  return doc.primaryOwnerId === S.user.uid && OWNER_EDIT_ROLES.includes(S.profile.role);
}
function canEditDoc(doc) { return isManagement(); }

// ══════════════════════════════════════════════════════
//  6.  FIRESTORE HELPERS
// ══════════════════════════════════════════════════════

async function getAccessibleDocuments(filters = {}) {
  let docs = [];
  if (isManagement()) {
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
  const uid = S.user.uid;
  const today = new Date(); today.setHours(0,0,0,0);
  const warningMs = 7 * 86400000;

  let docs = [], recentEvents = [];

  if (isManagement()) {
    // ── Admin / Management: full access to all data ──────────────────
    const [allDocsSnap, revsSnap, recentSnap] = await Promise.all([
      db.collection('documents').get(),
      db.collection('revisions').get(),
      // Audit read is admin-only in rules — safe to query here
      db.collection('auditEvents').orderBy('createdAt','desc').limit(20).get()
    ]);
    docs = allDocsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    recentEvents = recentSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const revs = revsSnap.docs.map(d => d.data());
    let overdue = 0, dueSoon = 0, awaitingResponse = 0, received = 0, approved = 0, notApproved = 0;
    // Group revisions by document, find latest per doc
    const latestRevByDoc = {};
    revs.forEach(r => {
      const docId = r.documentId;
      if (!latestRevByDoc[docId] || (r.revisionNumber || 0) > (latestRevByDoc[docId].revisionNumber || 0)) {
        latestRevByDoc[docId] = r;
      }
    });
    Object.values(latestRevByDoc).forEach(r => {
      const st = r.status;
      if (st === 'final_approved' || r.finalApproved) { approved++; return; }
      if (st === 'approved') { approved++; return; }
      if (st === 'new_revision_required' || r.approvalStatus === 'not_approved') { notApproved++; return; }
      if (st === 'awaiting_response' || (r.actualSentDate && !r.receivedDate)) { awaitingResponse++; return; }
      if (st === 'response_received' || st === 'comments_received') { received++; return; }
      // Check overdue from targetDate or targetSentDate
      const targetDateStr = r.targetDate || r.targetSentDate;
      if (targetDateStr && !r.actualSentDate) {
        const target = new Date(targetDateStr);
        if (target < today) overdue++;
        else if (target - today <= warningMs) dueSoon++;
      }
    });

    const byDisc = {}, byProject = {};
    docs.forEach(d => {
      byDisc[d.discipline || 'Other'] = (byDisc[d.discipline || 'Other'] || 0) + 1;
      byProject[d.projectId] = (byProject[d.projectId] || 0) + 1;
    });

    // Count active projects from docs (avoids separate query)
    const activeProjIds = new Set(docs.filter(d => d.state === 'active').map(d => d.projectId).filter(Boolean));

    return {
      totalDocs: docs.length,
      activeDocs: docs.filter(d => d.state === 'active').length,
      totalProjects: activeProjIds.size,
      totalRevisions: revs.length,
      overdue, dueSoon, awaitingResponse, received, approved, notApproved,
      byDisc, byProject, recentEvents,
      isFullView: true
    };

  } else {
    // ── Non-admin: only documents assigned to this user ──────────────
    // Two filtered queries — each is allowed by Firestore rules
    const [ownedSnap, viewingSnap] = await Promise.all([
      db.collection('documents').where('primaryOwnerId', '==', uid).get(),
      db.collection('documents').where('additionalViewerIds', 'array-contains', uid).get()
    ]);

    // Merge and de-duplicate
    const docMap = {};
    [...ownedSnap.docs, ...viewingSnap.docs].forEach(d => {
      docMap[d.id] = { id: d.id, ...d.data() };
    });
    docs = Object.values(docMap);

    const docIds = docs.map(d => d.id);

    // Fetch revisions only for accessible documents
    // Firestore 'in' query has a 30-item limit — chunk if needed
    let revs = [];
    if (docIds.length > 0) {
      const chunks = [];
      for (let i = 0; i < docIds.length; i += 30) chunks.push(docIds.slice(i, i + 30));
      const snapshots = await Promise.all(
        chunks.map(chunk => db.collection('revisions').where('documentId', 'in', chunk).get())
      );
      revs = snapshots.flatMap(s => s.docs.map(d => d.data()));
    }

    let overdue = 0, dueSoon = 0, awaitingResponse = 0, received = 0, approved = 0, notApproved = 0;
    const latestRevByDocNA = {};
    revs.forEach(r => {
      const docId = r.documentId;
      if (!latestRevByDocNA[docId] || (r.revisionNumber || 0) > (latestRevByDocNA[docId].revisionNumber || 0)) {
        latestRevByDocNA[docId] = r;
      }
    });
    Object.values(latestRevByDocNA).forEach(r => {
      const st = r.status;
      if (st === 'final_approved' || r.finalApproved) { approved++; return; }
      if (st === 'approved') { approved++; return; }
      if (st === 'new_revision_required' || r.approvalStatus === 'not_approved') { notApproved++; return; }
      if (st === 'awaiting_response' || (r.actualSentDate && !r.receivedDate)) { awaitingResponse++; return; }
      if (st === 'response_received' || st === 'comments_received') { received++; return; }
      const targetDateStr = r.targetDate || r.targetSentDate;
      if (targetDateStr && !r.actualSentDate) {
        const target = new Date(targetDateStr);
        if (target < today) overdue++;
        else if (target - today <= warningMs) dueSoon++;
      }
    });

    const byDisc = {}, byProject = {};
    docs.forEach(d => {
      byDisc[d.discipline || 'Other'] = (byDisc[d.discipline || 'Other'] || 0) + 1;
      byProject[d.projectId] = (byProject[d.projectId] || 0) + 1;
    });

    const activeProjIds = new Set(docs.filter(d => d.state === 'active').map(d => d.projectId).filter(Boolean));

    return {
      totalDocs: docs.length,
      activeDocs: docs.filter(d => d.state === 'active').length,
      totalProjects: activeProjIds.size,
      totalRevisions: revs.length,
      overdue, dueSoon, awaitingResponse, received, approved, notApproved,
      byDisc, byProject, recentEvents: [],
      isFullView: false
    };
  }
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
  { re: /^\/admin\/roles$/,                          page: 'admin-roles',         admin: true },
  { re: /^\/admin\/transfer$/,                       page: 'admin-transfer',      admin: true },
  { re: /^\/admin\/import$/,                         page: 'admin-import',        admin: true },
  { re: /^\/export$/,                                page: 'export' },
  { re: /^\/analytics$/,                             page: 'analytics' },
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
  const isA  = isManagement();
  const pg   = activePage;

  const navLink = (href, label, active) =>
    `<a href="#${href}" class="${active === pg ? 'active' : ''}">${label}</a>`;

  return `
  <header class="topbar">
    <a class="brand" href="#/">
      <div class="brand-mark"><img src="${SHEPL_LOGO}" alt="SH Engitech"></div>
    </a>
    <nav class="topnav">
      ${navLink('/','Dashboard','dashboard')}
      ${navLink('/projects','Projects','projects')}
      ${navLink('/documents','Documents','documents')}
      ${navLink('/analytics','Analytics','analytics')}
      ${navLink('/export','Export Excel','export')}
      ${isA ? `<span class="admin-sep"></span>` : ''}
      ${isA ? navLink('/admin/import','Import','admin-import') : ''}
      ${isA ? navLink('/admin/users','Users','admin-users') : ''}
      ${isA ? navLink('/admin/roles','Role Permissions','admin-roles') : ''}
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
  // New status-based system (primary)
  if (rev.status) {
    const st = rev.status;
    if (st === 'final_approved') return { label: 'Final Approved', cls: 'badge-final' };
    if (st === 'approved')       return { label: 'Approved', cls: 'badge-success' };
    if (st === 'not_approved' || st === 'new_revision_required') return { label: REV_STATUS_LABELS[st], cls: 'badge-overdue' };
    if (st === 'awaiting_response') return { label: 'Awaiting Response', cls: 'badge-warning' };
    if (st === 'response_received' || st === 'comments_received') return { label: REV_STATUS_LABELS[st], cls: 'badge-info' };
    // concept / submitted — check overdue
    if (rev.targetDate) {
      const diff = daysDiff(rev.targetDate);
      if (diff !== null && diff < 0) return { label: `Overdue ${-diff}d`, cls: 'badge-overdue' };
      if (diff !== null && diff <= 7) return { label: `Due in ${diff}d`, cls: 'badge-warning' };
    }
    return { label: REV_STATUS_LABELS[st] || st, cls: 'badge-planned' };
  }
  // Legacy fallback
  if (rev.finalApproved) return { label: 'Final Approved', cls: 'badge-final' };
  if (rev.receivedDate)  return { label: 'Response Received', cls: 'badge-info' };
  if (rev.actualSentDate) return { label: 'Awaiting Response', cls: 'badge-warning' };
  if (!rev.targetSentDate) return { label: 'Concept', cls: 'badge-planned' };
  const diff = daysDiff(rev.targetSentDate);
  if (diff < 0)  return { label: `Overdue ${-diff}d`, cls: 'badge-overdue' };
  if (diff <= 7) return { label: `Due in ${diff}d`,  cls: 'badge-warning' };
  return { label: 'On Schedule', cls: 'badge-planned' };
}

function revStatusBadge(rev) {
  const st = revStatus(rev);
  return badge(st.label, st.cls);
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
      <div class="auth-logo"><img src="${SHEPL_LOGO}" alt="SH Engitech" style="max-width:200px;height:auto"></div>
      <h1>DCI — Document Control</h1>
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
  // SHEPL teal/green palette for discipline bars
  const DISC_COLORS = {
    ELT:'#009E9B', INS:'#007B7A', MEC:'#005f5e', PRC:'#3a8a3e',
    PMG:'#00b4b0', QAC:'#6bd6d3', CIV:'#1a8c8a', STR:'#0d6e6c',
    ARC:'#4db8b5', HSE:'#2ca9a7', Other:'#98a2b3'
  };

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

  const heroTitle   = data.isFullView ? 'Company Schedule Dashboard' : 'My Document Dashboard';
  const heroSubtitle = data.isFullView
    ? `SH Engitech Pvt. Ltd · Document Control Index · ${esc(today())}`
    : `${esc(S.profile?.displayName || '')} · ${esc(ROLE_LABELS[S.profile?.role] || '')} · ${esc(today())}`;

  const docLabel   = data.isFullView ? 'Total Documents'   : 'My Documents';
  const projLabel  = data.isFullView ? 'Active Projects'   : 'My Projects';

  render(pageShell('dashboard', `
    <div class="dash-hero">
      <div>
        <h1>${heroTitle}</h1>
        <p>${heroSubtitle}</p>
      </div>
      <div class="hero-actions">
        <a class="btn-hero" href="#/analytics">📊 Analytics</a>
        <a class="btn-hero" href="#/export">📥 Export Excel</a>
        ${isManagement() ? `<a class="btn-hero" href="#/admin/import">📤 Import Excel</a>` : ''}
        ${isManagement() ? `<a class="btn-hero btn-hero-primary" href="#/documents/new">+ Add Document</a>` : ''}
      </div>
    </div>

    <div class="kpi-grid">
      <a class="kpi info" href="#/documents">
        <span>${docLabel}</span><strong>${data.totalDocs}</strong>
        <small>${data.activeDocs} active</small>
      </a>
      <a class="kpi success" href="#/projects">
        <span>${projLabel}</span><strong>${data.totalProjects}</strong>
        <small>active projects</small>
      </a>
      <div class="kpi">
        <span>Total Revisions</span><strong>${data.totalRevisions}</strong>
        <small>all time</small>
      </div>
      <a class="kpi danger" href="#/documents">
        <span>Overdue</span><strong>${data.overdue}</strong>
        <small>past target date</small>
      </a>
      <a class="kpi warning" href="#/documents">
        <span>Due This Week</span><strong>${data.dueSoon}</strong>
        <small>target within 7 days</small>
      </a>
      <a class="kpi action" href="#/documents">
        <span>Awaiting Response</span><strong>${data.awaitingResponse}</strong>
        <small>sent, not yet received</small>
      </a>
      <a class="kpi success" href="#/documents">
        <span>Approved</span><strong>${data.approved}</strong>
        <small>approved / final approved</small>
      </a>
      <a class="kpi danger" href="#/documents">
        <span>Not Approved</span><strong>${data.notApproved}</strong>
        <small>needs revision</small>
      </a>
    </div>

    <div class="dashboard-grid">
      <div class="panel table-panel">
        <div class="panel-heading">
          <div><h2>${data.isFullView ? 'Top Projects by Document Count' : 'My Projects'}</h2></div>
          <a href="#/projects" style="font-size:13px">View all →</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Project #</th><th>Name</th><th>Client</th><th style="text-align:right">Docs</th></tr></thead>
            <tbody>${projRows || '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--muted)">No documents assigned yet</td></tr>'}</tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Documents by Discipline</h2></div>
        <div class="bar-list">${discBars || '<p style="color:var(--muted);padding:12px 0">No documents yet</p>'}</div>
      </div>
    </div>

    ${data.isFullView && data.recentEvents.length > 0 ? `
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
    </div>` : ''}
  `));
}

// ══════════════════════════════════════════════════════
//  14.  PAGE: DOCUMENTS LIST
// ══════════════════════════════════════════════════════

// Classify a document's latest revision into a tab bucket
function docTabBucket(latestRev) {
  if (!latestRev) return 'concept';
  const st = latestRev.status || '';
  if (st === 'final_approved' || latestRev.finalApproved) return 'approved';
  if (st === 'approved')                                   return 'approved';
  if (st === 'new_revision_required' || latestRev.approvalStatus === 'not_approved') return 'not_approved';
  if (st === 'awaiting_response')                          return 'awaiting_response';
  if (st === 'response_received' || st === 'comments_received') return 'awaiting_response';
  if (st === 'submitted')                                  return 'awaiting_response';
  return 'concept'; // concept or unknown
}

async function renderDocuments(qs = {}) {
  const [projects, allRevSnap] = await Promise.all([getProjects(), db.collection('revisions').get()]);

  const params = qs;

  // ── Build latest-revision lookup from ALL revisions ──────────────
  const latestRevStatus = {};
  allRevSnap.docs.forEach(d => {
    const r = { id: d.id, ...d.data() };
    const docId = r.documentId;
    if (!latestRevStatus[docId] || (r.revisionNumber || 0) > (latestRevStatus[docId].revisionNumber || 0)) {
      latestRevStatus[docId] = r;
    }
  });

  // ── Fetch ALL accessible non-deleted docs for tab counts ─────────
  const allDocs = (await getAccessibleDocuments(params)).filter(d => !d.isDeleted);

  // ── Compute tab counts ───────────────────────────────────────────
  const tabCounts = { all: allDocs.length, awaiting_response: 0, approved: 0, not_approved: 0, concept: 0 };
  allDocs.forEach(doc => {
    const bucket = docTabBucket(latestRevStatus[doc.id]);
    if (tabCounts[bucket] !== undefined) tabCounts[bucket]++;
  });

  // ── Filter docs for the active tab ──────────────────────────────
  const activeTab = params.revStatus || 'all';
  let docs = activeTab === 'all'
    ? allDocs
    : allDocs.filter(doc => docTabBucket(latestRevStatus[doc.id]) === activeTab);

  // ── Project map for display ──────────────────────────────────────
  const pmap = {};
  projects.forEach(p => { pmap[p.id] = p; });

  // ── Sort ─────────────────────────────────────────────────────────
  const sortField = params._sort || 'documentNumber';
  const sortDir   = params._dir  || 'asc';
  docs.sort((a,b) => {
    const av = (a[sortField]||'').toString().toLowerCase();
    const bv = (b[sortField]||'').toString().toLowerCase();
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  // ── Filter bar dropdowns ─────────────────────────────────────────
  const projectOptions = projects.map(p =>
    `<option value="${esc(p.id)}" ${params.projectId === p.id ? 'selected' : ''}>
      ${esc(p.projectNumber)} — ${esc(p.name)}
    </option>`).join('');
  const discOptions = DISCIPLINES.filter(Boolean).map(d =>
    `<option value="${esc(d)}" ${params.discipline === d ? 'selected' : ''}>${esc(d)}</option>`).join('');
  const stateOptions = DOC_STATES.map(s =>
    `<option value="${esc(s)}" ${params.state === s ? 'selected' : ''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('');

  // ── Status tabs ──────────────────────────────────────────────────
  const tabs = [
    { key:'all',               label:'All' },
    { key:'awaiting_response', label:'Awaiting Response' },
    { key:'approved',          label:'Approved' },
    { key:'not_approved',      label:'Not Approved' },
    { key:'concept',           label:'In Progress' },
  ];
  const tabBar = tabs.map(t => {
    const cnt = tabCounts[t.key] ?? 0;
    const active = activeTab === t.key;
    return `<button type="button"
      class="doc-tab${active ? ' doc-tab--active' : ''}"
      onclick="switchDocTab('${t.key}')">
      ${esc(t.label)} <span class="doc-tab-count">${cnt}</span>
    </button>`;
  }).join('');

  // ── Table rows ───────────────────────────────────────────────────
  const rows = docs.map(doc => {
    const proj = pmap[doc.projectId];
    const projLabel = proj ? `${esc(proj.projectNumber)} — ${esc(proj.name)}` : esc(doc.projectId || '—');
    const latestRev = latestRevStatus[doc.id];
    const stBadge = latestRev ? revStatusBadge(latestRev) : badge('No Rev','badge-muted');
    const ownerDisplay = doc.primaryOwnerName || doc.responsibleName || '—';
    const approveBtn = isManagement() && latestRev && latestRev.status !== 'approved' && latestRev.status !== 'final_approved'
      ? `<button class="btn btn-link btn-sm" title="Mark latest revision approved" onclick="event.stopPropagation();quickApprove('${esc(doc.id)}','${esc(latestRev.id)}')">✓ Approve</button>`
      : '';
    return `<tr onclick="nav('/documents/${esc(doc.id)}')" style="cursor:pointer">
      <td class="nowrap"><a href="#/documents/${esc(doc.id)}" onclick="event.stopPropagation()">${esc(doc.documentNumber)}</a></td>
      <td class="title-cell">
        <strong>${esc(doc.title)}</strong>
        <span class="cell-note">${projLabel}</span>
      </td>
      <td>${esc(doc.documentType || 'Not Set')}</td>
      <td>${esc(doc.discipline||'—')}</td>
      <td>${esc(ownerDisplay)}</td>
      <td>${stBadge}</td>
      <td class="nowrap">${fmtDate(doc.updatedAt?.toDate?.()?.toISOString())}</td>
      <td class="actions-cell">
        <a class="btn btn-link btn-sm" href="#/documents/${esc(doc.id)}">View</a>
        ${isManagement() ? `<a class="btn btn-link btn-sm" href="#/documents/${esc(doc.id)}/edit">Edit</a>` : ''}
        ${isAdmin() ? `<a class="btn btn-link btn-sm" href="#/documents/${esc(doc.id)}/allocation">Alloc</a>` : ''}
        ${approveBtn}
      </td>
    </tr>`;
  }).join('');

  // ── Render page ──────────────────────────────────────────────────
  // Store current filter params so tab switches preserve them
  window._docFilterParams = { ...params };

  render(pageShell('documents', `
    <div class="page-header">
      <div>
        <h1>Documents</h1>
        <p>${allDocs.length} document${allDocs.length !== 1 ? 's' : ''} ${isManagement() ? 'total' : 'assigned to you'}</p>
      </div>
      <div class="header-actions">
        ${isManagement() ? `<a class="btn btn-primary" href="#/documents/new">+ Add Document</a>` : ''}
      </div>
    </div>

    <div class="doc-tabs">${tabBar}</div>

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
              <th>Type</th>
              <th>Discipline</th>
              <th>Owner</th>
              <th>Rev Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="8"><div class="empty-state">
              <div class="empty-icon">📄</div>
              <h3>No documents</h3>
              <p>${activeTab === 'all' ? (isManagement() ? 'Add a new document to get started.' : 'No documents have been assigned to you yet.') : 'No documents in this status.'}</p>
            </div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div style="padding:10px 14px;color:var(--muted);font-size:12px">
        Showing ${docs.length} of ${allDocs.length} document${allDocs.length !== 1 ? 's' : ''}
      </div>
    </div>
  `));
}

// Switch between status tabs, preserving search/project/discipline filters
function switchDocTab(tabKey) {
  const base = window._docFilterParams || {};
  const params = { ...base };
  if (tabKey && tabKey !== 'all') params.revStatus = tabKey;
  else delete params.revStatus;
  renderDocuments(params);
}

function applyDocFilters(e) {
  if (e) e.preventDefault();
  const search     = document.getElementById('f-search').value.trim();
  const projectId  = document.getElementById('f-project').value;
  const discipline = document.getElementById('f-disc').value;
  const state      = document.getElementById('f-state').value;
  // preserve active tab
  const activeTab  = (window._docFilterParams || {}).revStatus || '';
  const params = {};
  if (search)     params.search     = search;
  if (projectId)  params.projectId  = projectId;
  if (discipline) params.discipline = discipline;
  if (state)      params.state      = state;
  if (activeTab)  params.revStatus  = activeTab;
  renderDocuments(params);
}

// Quick-approve latest revision from the document list
async function quickApprove(docId, revId) {
  if (!confirm('Mark the latest revision as Approved?')) return;
  try {
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('revisions').doc(revId).update({
      status:        'approved',
      approvalStatus:'approved',
      finalApproved: false,
      updatedAt: ts, updatedBy: S.user.uid
    });
    await writeAudit('update','revision',revId,'Quick-approved');
    toast('Revision marked as Approved.','success');
    // Re-render current tab
    const params = window._docFilterParams || {};
    renderDocuments(params);
  } catch (ex) {
    toast('Error: ' + ex.message, 'error');
  }
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
    const stBadge = revStatusBadge(r);
    const approvBadge = r.approvalStatus === 'approved' ? badge('✓ Approved','badge-success') :
                        r.approvalStatus === 'not_approved' ? badge('✗ Not Approved','badge-overdue') :
                        r.finalApproved ? badge('✓ Final Approved','badge-final') : '';
    const targetDate = r.targetDate || r.targetSentDate;
    const clientDue  = r.clientDueDate || r.clientResponseDueDate;
    return `<tr>
      <td class="nowrap"><strong>Rev ${esc(r.revisionNumber)}</strong></td>
      <td class="nowrap">${fmtDate(r.startDate)}</td>
      <td class="nowrap">${fmtDate(targetDate)}</td>
      <td class="nowrap">${fmtDate(r.actualSentDate)||'—'}</td>
      <td class="nowrap">${fmtDate(r.receivedDate)||'—'}</td>
      <td class="nowrap">${fmtDate(clientDue)||'—'}</td>
      <td>${stBadge}</td>
      <td>${approvBadge}</td>
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
        <div class="detail-item"><label>Document Type</label><span>${esc(doc.documentType||'Not Set')}</span></div>
        <div class="detail-item"><label>Discipline</label><span>${esc(doc.discipline||'—')}</span></div>
        <div class="detail-item"><label>Document Code</label><span>${esc(doc.documentCode||'—')}</span></div>
        <div class="detail-item"><label>Issue Purpose</label><span>${esc(doc.issuePurpose||'—')}</span></div>
        <div class="detail-item"><label>Primary Owner</label><span>${esc(doc.primaryOwnerName||owner?.displayName||doc.responsibleName||'—')}</span></div>
        <div class="detail-item"><label>Project Manager</label><span>${esc(doc.projectManagerName||'—')}</span></div>
        <div class="detail-item"><label>Additional Viewers</label><span>${esc(viewers||'—')}</span></div>
        <div class="detail-item"><label>State</label><span>${docStateBadge(doc.state)}</span></div>
        <div class="detail-item"><label>Final Approved</label><span>${doc.finalApproved ? badge('Yes','badge-success') : badge('No','badge-muted')}</span></div>
        ${doc.generalRemarks ? `<div class="detail-item" style="grid-column:1/-1"><label>Remarks</label><span>${esc(doc.generalRemarks)}</span></div>` : ''}
      </div>
      <div class="detail-actions">
        ${canAdmin ? `<a class="btn btn-secondary" href="#/documents/${esc(docId)}/edit">Edit Master Data</a>` : ''}
        ${canAdmin ? `<a class="btn btn-secondary" href="#/documents/${esc(docId)}/allocation">Edit Allocation</a>` : ''}
        ${canEdit  ? `<button class="btn btn-primary" onclick="addRevision('${esc(docId)}')">+ Add Revision</button>` : ''}
        ${canAdmin ? `<button class="btn btn-warning btn-sm" onclick="archiveDocument('${esc(docId)}')">Archive Document</button>` : ''}
        ${canAdmin ? `<button class="btn btn-danger btn-sm" onclick="deleteDocument('${esc(docId)}')">Hard Delete</button>` : ''}
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
  // Auto-increment: find max existing revision number and add 1
  const maxRev = revs.length > 0 ? Math.max(...revs.map(r => r.revisionNumber || 0)) : -1;
  const nextRev = maxRev + 1;
  const newRev = {
    documentId: docId,
    revisionNumber: nextRev,
    status: 'concept',
    approvalStatus: 'pending',
    targetDate: '',
    sentDate: '',
    actualSentDate: '',
    receivedDate: '',
    clientDueDate: '',
    clientComments: '',
    internalRemarks: '',
    // legacy fields kept for backward compat
    startDate: today(),
    targetSentDate: '',
    clientResponseDueDate: '',
    finalApproved: false,
    remarks: '',
    version: 1,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: S.user.uid
  };
  const ref = await db.collection('revisions').add(newRev);
  await writeAudit('create','revision',ref.id,`Rev ${nextRev} of ${doc.documentNumber}`);
  toast(`Revision ${nextRev} added — editing now…`,'success');
  nav(`/documents/${docId}/revisions/${ref.id}/edit`);
}

async function deleteRevision(revId, docId) {
  if (!isManagement()) { toast('Admin/Management only.','error'); return; }
  if (!confirm('Delete this revision? This cannot be undone.')) return;
  await db.collection('revisions').doc(revId).delete();
  await writeAudit('delete','revision',revId,'revision');
  toast('Revision deleted.','success');
  renderDocDetail(docId);
}

async function archiveDocument(docId) {
  if (!isManagement()) { toast('Admin/Management only.','error'); return; }
  const doc = await getDocument(docId);
  if (!doc) return;
  if (!confirm(`Archive "${doc.documentNumber} — ${doc.title}"?\n\nThe document will be hidden from lists but can be recovered by an admin.`)) return;
  await db.collection('documents').doc(docId).update({
    isDeleted: true,
    state: 'archived',
    archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
    archivedBy: S.user.uid
  });
  await writeAudit('archive','document',docId,doc.documentNumber);
  toast('Document archived.','success');
  nav('/documents');
}

async function deleteDocument(docId) {
  if (!isAdmin()) { toast('Admin only for hard delete.','error'); return; }
  if (!confirm('PERMANENTLY delete this document and ALL its revisions? This CANNOT be undone.')) return;
  const revs = await getRevisions(docId);
  const batch = db.batch();
  revs.forEach(r => batch.delete(db.collection('revisions').doc(r.id)));
  batch.delete(db.collection('documents').doc(docId));
  await batch.commit();
  await writeAudit('delete','document',docId,'document');
  toast('Document permanently deleted.','success');
  nav('/documents');
}

// ══════════════════════════════════════════════════════
//  16.  PAGE: REVISION EDIT
// ══════════════════════════════════════════════════════

async function renderRevEdit(docId, revId) {
  const [doc, rev] = await Promise.all([getDocument(docId), getRevision(revId)]);
  if (!doc || !rev) { render(pageShell('documents',`<div class="empty-state"><h3>Not found</h3><a class="btn btn-secondary" href="#/documents">← Back</a></div>`)); return; }
  if (!canEditRevision(doc)) { render(pageShell('documents',`<div class="empty-state"><h3>Access denied</h3></div>`)); return; }

  const statusOptions = REV_STATUSES.map(s =>
    `<option value="${esc(s)}" ${(rev.status||'concept') === s ? 'selected':''}>${esc(REV_STATUS_LABELS[s])}</option>`).join('');
  const approvalOptions = APPROVAL_STATUSES.map(s =>
    `<option value="${esc(s)}" ${(rev.approvalStatus||'pending') === s ? 'selected':''}>${esc(APPROVAL_STATUS_LABELS[s])}</option>`).join('');

  render(pageShell('documents', `
    <div style="margin-bottom:14px">
      <a href="#/documents/${esc(docId)}" style="color:var(--muted);font-size:13px">← ${esc(doc.documentNumber)} — ${esc(doc.title)}</a>
    </div>
    <div class="form-card">
      <h2 style="margin-bottom:4px">Edit Revision ${esc(rev.revisionNumber)}</h2>
      <p style="color:var(--muted);margin-bottom:24px">${esc(doc.documentNumber)} — ${esc(doc.title)}</p>

      <form id="rev-form" onsubmit="saveRevision(event,'${esc(docId)}','${esc(revId)}')">
        <div class="form-section">
          <h3>Status</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Revision Status</label>
              <select id="f-status">${statusOptions}</select>
            </div>
            <div class="form-group">
              <label>Approval Status</label>
              <select id="f-approvalStatus">${approvalOptions}</select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Revision Dates</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Start Date</label>
              <input type="date" id="f-startDate" value="${esc(rev.startDate||'')}">
            </div>
            <div class="form-group">
              <label>Target Date</label>
              <input type="date" id="f-targetDate" value="${esc(rev.targetDate||rev.targetSentDate||'')}">
            </div>
            <div class="form-group">
              <label>Sent Date (planned)</label>
              <input type="date" id="f-sentDate" value="${esc(rev.sentDate||rev.targetSentDate||'')}">
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
              <label>Client Due Date</label>
              <input type="date" id="f-clientDueDate" value="${esc(rev.clientDueDate||rev.clientResponseDueDate||'')}">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Comments & Remarks</h3>
          <div class="form-grid">
            <div class="form-group full">
              <label>Client Comments</label>
              <textarea id="f-clientComments" rows="3">${esc(rev.clientComments||'')}</textarea>
            </div>
            <div class="form-group full">
              <label>Internal Remarks</label>
              <textarea id="f-internalRemarks" rows="3">${esc(rev.internalRemarks||rev.remarks||'')}</textarea>
            </div>
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
    const newStatus = document.getElementById('f-status')?.value || 'concept';
    const isFinalApproved = newStatus === 'final_approved';
    const isApproved = newStatus === 'approved' || isFinalApproved;
    const targetDate = document.getElementById('f-targetDate')?.value || null;
    const actualSentDate = document.getElementById('f-actualSentDate')?.value || null;
    const updates = {
      status:               newStatus,
      approvalStatus:       document.getElementById('f-approvalStatus')?.value || 'pending',
      startDate:            document.getElementById('f-startDate')?.value || null,
      targetDate:           targetDate,
      sentDate:             document.getElementById('f-sentDate')?.value || null,
      actualSentDate:       actualSentDate,
      receivedDate:         document.getElementById('f-receivedDate')?.value || null,
      clientDueDate:        document.getElementById('f-clientDueDate')?.value || null,
      clientComments:       document.getElementById('f-clientComments')?.value.trim() || '',
      internalRemarks:      document.getElementById('f-internalRemarks')?.value.trim() || '',
      // keep legacy fields in sync
      targetSentDate:       targetDate,
      clientResponseDueDate: document.getElementById('f-clientDueDate')?.value || null,
      finalApproved:        isFinalApproved,
      remarks:              document.getElementById('f-internalRemarks')?.value.trim() || '',
      updatedAt:            firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:            S.user.uid
    };
    await db.collection('revisions').doc(revId).update(updates);
    // If final approved, also mark the parent document as final approved
    if (isFinalApproved) {
      await db.collection('documents').doc(docId).update({ finalApproved: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    }
    const doc = await getDocument(docId);
    await writeAudit('update','revision',revId,`Rev of ${doc?.documentNumber}`,{ status: newStatus });
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
  const [projects, users] = await Promise.all([getProjects(), getUsers()]);
  renderDocForm(null, projects, users);
}

async function renderDocEdit(docId) {
  const [doc, projects, users] = await Promise.all([getDocument(docId), getProjects(), getUsers()]);
  renderDocForm(doc, projects, users);
}

function renderDocForm(doc, projects, users = []) {
  const isNew = !doc;
  const activeUsers = users.filter(u => u.isActive !== false);
  const projOptions = projects.map(p =>
    `<option value="${esc(p.id)}" ${doc?.projectId === p.id ? 'selected':''}>${esc(p.projectNumber)} — ${esc(p.name)}</option>`).join('');
  const discOptions = DISCIPLINES.map(d =>
    `<option value="${esc(d)}" ${doc?.discipline === d ? 'selected':''}>${d || '— Select —'}</option>`).join('');
  const purposeOptions = PURPOSES.map(p =>
    `<option value="${esc(p)}" ${doc?.issuePurpose === p ? 'selected':''}>${p || '— Select —'}</option>`).join('');
  const stateOptions = DOC_STATES.map(s =>
    `<option value="${esc(s)}" ${(doc?.state||'active') === s ? 'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('');
  const docTypeOptions = DOC_TYPES.map(t =>
    `<option value="${esc(t)}" ${(doc?.documentType||'External') === t ? 'selected':''}>${esc(t)}</option>`).join('');
  const ownerOptions = activeUsers.map(u =>
    `<option value="${esc(u.id)}" data-name="${esc(u.displayName)}" ${doc?.primaryOwnerId === u.id ? 'selected':''}>${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`).join('');
  const pmOptions = activeUsers.map(u =>
    `<option value="${esc(u.id)}" data-name="${esc(u.displayName)}" ${doc?.projectManagerId === u.id ? 'selected':''}>${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`).join('');

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
              <label>Document Type <span style="color:var(--red)">*</span></label>
              <select id="f-documentType" required>
                <option value="">— Select Type —</option>
                ${docTypeOptions}
              </select>
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
              <label>State</label>
              <select id="f-state">${stateOptions}</select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Ownership</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Primary Owner</label>
              <select id="f-primaryOwnerId">
                <option value="">— Not assigned —</option>
                ${ownerOptions}
              </select>
            </div>
            <div class="form-group">
              <label>Project Manager</label>
              <select id="f-projectManagerId">
                <option value="">— Not assigned —</option>
                ${pmOptions}
              </select>
            </div>
            <div class="form-group">
              <label>Owner Name (text label)</label>
              <input type="text" id="f-responsibleName" value="${esc(doc?.responsibleName||'')}" placeholder="Display name for lists">
              <span class="hint">Optional free-text name shown in document lists.</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Additional Info</h3>
          <div class="form-grid">
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
    const primaryOwnerSel = document.getElementById('f-primaryOwnerId');
    const pmSel           = document.getElementById('f-projectManagerId');
    const primaryOwnerId     = primaryOwnerSel?.value || null;
    const primaryOwnerName   = primaryOwnerSel?.selectedOptions[0]?.dataset?.name || '';
    const projectManagerId   = pmSel?.value || null;
    const projectManagerName = pmSel?.selectedOptions[0]?.dataset?.name || '';

    const data = {
      documentNumber:     document.getElementById('f-docNumber').value.trim(),
      projectId:          document.getElementById('f-projectId').value,
      title:              document.getElementById('f-title').value.trim(),
      documentType:       document.getElementById('f-documentType')?.value || 'External',
      discipline:         document.getElementById('f-discipline').value,
      documentCode:       document.getElementById('f-documentCode').value.trim(),
      issuePurpose:       document.getElementById('f-issuePurpose').value,
      state:              document.getElementById('f-state').value,
      primaryOwnerId:     primaryOwnerId,
      primaryOwnerName:   primaryOwnerName,
      projectManagerId:   projectManagerId,
      projectManagerName: projectManagerName,
      responsibleName:    document.getElementById('f-responsibleName')?.value.trim() || primaryOwnerName,
      finalApproved:      document.getElementById('f-finalApprovedDoc').checked,
      generalRemarks:     document.getElementById('f-generalRemarks').value.trim(),
      updatedAt:          firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:          S.user.uid,
    };
    let id = docId;
    if (!docId) {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      data.createdBy = S.user.uid;
      data.version = 1;
      data.additionalViewerIds = [];
      data.isDeleted = false;
      const ref = await db.collection('documents').add(data);
      id = ref.id;
      await writeAudit('create','document',id,data.documentNumber);
      // Auto-create Rev 0
      await db.collection('revisions').add({
        documentId: id,
        revisionNumber: 0,
        status: 'concept',
        approvalStatus: 'pending',
        targetDate: '',
        sentDate: '',
        actualSentDate: '',
        receivedDate: '',
        clientDueDate: '',
        clientComments: '',
        internalRemarks: '',
        startDate: today(),
        targetSentDate: '',
        clientResponseDueDate: '',
        finalApproved: false,
        remarks: '',
        version: 1,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user.uid
      });
      toast('Document created with Rev 0.','success');
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
  const [projects, allDocsSnap, users] = await Promise.all([
    getProjects(),
    db.collection('documents').get(),
    getUsers()
  ]);
  const docCount = {};
  allDocsSnap.docs.forEach(d => {
    const pid = d.data().projectId;
    docCount[pid] = (docCount[pid] || 0) + 1;
  });
  const umap = {};
  users.forEach(u => { umap[u.id] = u; });

  const rows = projects.map(p => {
    const pm = p.projectManagerId ? umap[p.projectManagerId] : null;
    const pmName = pm ? pm.displayName : (p.projectManagerName || '—');
    return `
    <tr onclick="nav('/projects/${esc(p.id)}')" style="cursor:pointer">
      <td><a href="#/projects/${esc(p.id)}" onclick="event.stopPropagation()">${esc(p.projectNumber)}</a></td>
      <td class="title-cell"><strong>${esc(p.name)}</strong></td>
      <td>${esc(p.clientName||'—')}</td>
      <td>${esc(pmName)}</td>
      <td style="text-align:right">${docCount[p.id]||0}</td>
      <td>${p.active ? badge('Active','badge-success') : badge('Inactive','badge-muted')}</td>
      <td class="actions-cell">
        ${isAdmin() ? `<button class="btn btn-link btn-sm" onclick="event.stopPropagation();editProject('${esc(p.id)}')">Edit</button>` : ''}
      </td>
    </tr>`;
  }).join('');

  render(pageShell('projects', `
    <div class="page-header">
      <div><h1>Projects</h1><p>${projects.length} projects</p></div>
      <div class="header-actions">
        ${isAdmin() ? `<button class="btn btn-secondary" onclick="showProjectImportModal()">⬆ Bulk Import</button>` : ''}
        ${isAdmin() ? `<button class="btn btn-primary" onclick="showNewProjectModal()">+ Add Project</button>` : ''}
      </div>
    </div>
    <div class="panel table-panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Project #</th><th>Name</th><th>Client</th><th>Project Manager</th><th style="text-align:right">Docs</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows || `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🏗️</div><h3>No projects yet</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
    <div id="modal-slot"></div>
  `));
}

async function renderProjectDetail(projectId) {
  const [proj, docs, users] = await Promise.all([getProject(projectId), getAccessibleDocuments({projectId}), getUsers()]);
  if (!proj) { render(pageShell('projects',`<div class="empty-state"><h3>Project not found</h3><a class="btn btn-secondary" href="#/projects">← Back</a></div>`)); return; }

  const umap = {}; users.forEach(u => { umap[u.id] = u; });
  const pm = proj.projectManagerId ? umap[proj.projectManagerId] : null;
  const pmName = pm ? pm.displayName : (proj.projectManagerName || '—');

  const rows = docs.filter(d => !d.isDeleted).map(doc => `
    <tr onclick="nav('/documents/${esc(doc.id)}')" style="cursor:pointer">
      <td><a href="#/documents/${esc(doc.id)}" onclick="event.stopPropagation()">${esc(doc.documentNumber)}</a></td>
      <td class="title-cell">${esc(doc.title)}</td>
      <td>${esc(doc.documentType||'Not Set')}</td>
      <td>${esc(doc.discipline||'—')}</td>
      <td>${esc(doc.primaryOwnerName||doc.responsibleName||'—')}</td>
      <td>${docStateBadge(doc.state)}</td>
    </tr>`).join('');

  render(pageShell('projects', `
    <div style="margin-bottom:14px"><a href="#/projects" style="color:var(--muted);font-size:13px">← All projects</a></div>
    <div class="detail-card">
      <h2>${esc(proj.name)}</h2>
      <div class="detail-grid">
        <div class="detail-item"><label>Project Number</label><span>${esc(proj.projectNumber)}</span></div>
        <div class="detail-item"><label>Client</label><span>${esc(proj.clientName||'—')}</span></div>
        <div class="detail-item"><label>Project Manager</label><span>${esc(pmName)}</span></div>
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
          <thead><tr><th>Doc #</th><th>Title</th><th>Type</th><th>Discipline</th><th>Owner</th><th>State</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6"><div class="empty-state" style="padding:32px"><div class="empty-icon">📄</div><h3>No documents</h3></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `));
}

async function showNewProjectModal() {
  const users = await getUsers();
  showProjectModal(null, users);
}

async function editProject(id) {
  const [snap, users] = await Promise.all([
    db.collection('projects').doc(id).get(),
    getUsers()
  ]);
  if (snap.exists) showProjectModal({ id: snap.id, ...snap.data() }, users);
}

function showProjectModal(proj, users = []) {
  const slot = document.getElementById('modal-slot');
  if (!slot) return;
  const activeUsers = users.filter(u => u.isActive !== false);
  const pmOptions = activeUsers.map(u =>
    `<option value="${esc(u.id)}" data-name="${esc(u.displayName)}" ${proj?.projectManagerId === u.id ? 'selected':''}>${esc(u.displayName)} (${esc(ROLE_LABELS[u.role]||u.role)})</option>`
  ).join('');
  slot.innerHTML = `
  <div class="modal-backdrop" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h2>${proj ? 'Edit Project' : 'New Project'}</h2>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveProject(event,${proj ? `'${esc(proj.id)}'` : 'null'})">
          <div class="form-group"><label>Project Number <span style="color:var(--red)">*</span></label><input id="mp-num" value="${esc(proj?.projectNumber||'')}" required placeholder="26001"></div>
          <div class="form-group"><label>Project Name <span style="color:var(--red)">*</span></label><input id="mp-name" value="${esc(proj?.name||'')}" required placeholder="Project name"></div>
          <div class="form-group"><label>Client Name</label><input id="mp-client" value="${esc(proj?.clientName||'')}" placeholder="Client company"></div>
          <div class="form-group">
            <label>Project Manager</label>
            <select id="mp-pm">
              <option value="">— None —</option>
              ${pmOptions}
            </select>
          </div>
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
  const pmSel = document.getElementById('mp-pm');
  const projectManagerId   = pmSel?.value || null;
  const projectManagerName = pmSel?.selectedOptions[0]?.dataset?.name || '';
  const data = {
    projectNumber:       document.getElementById('mp-num').value.trim(),
    name:                document.getElementById('mp-name').value.trim(),
    clientName:          document.getElementById('mp-client').value.trim(),
    projectManagerId:    projectManagerId,
    projectManagerName:  projectManagerName,
    warningDays:         parseInt(document.getElementById('mp-warn').value) || 7,
    active:              document.getElementById('mp-active').checked,
  };
  try {
    // Project closure check: warn if marking inactive and not all docs approved
    if (projId && !data.active) {
      const docsSnap = await db.collection('documents').where('projectId','==',projId).get();
      const projDocs = docsSnap.docs.map(d => d.data()).filter(d => !d.isDeleted && d.state === 'active');
      const unapproved = projDocs.filter(d => !d.finalApproved);
      if (unapproved.length > 0) {
        const proceed = confirm(
          `⚠️ Warning: ${unapproved.length} document(s) in this project are not yet Final Approved.\n\n` +
          `Closing a project with unapproved documents is not recommended.\n\nProceed anyway?`
        );
        if (!proceed) {
          document.getElementById('mp-active').checked = true;
          return;
        }
      }
    }
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

// ── Project Bulk Import ────────────────────────────────

let _projImportRows = [];

function downloadProjectTemplate() {
  const headers = ['Project Number', 'Name', 'Client', 'Project Manager Name', 'Status'];
  const sample  = ['26001', 'Substation Extension', 'ACME Corp', 'Jane Doe', 'Active'];
  const notes   = [
    ['Project Number: unique identifier, e.g. 26001'],
    ['Status: Active or Inactive (default Active)'],
    ['Project Manager Name: must match an existing user display name exactly'],
    ['If a project number already exists it will be UPDATED, not duplicated'],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, sample, [], ['--- NOTES ---'], ...notes]);
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 24) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects Template');
  XLSX.writeFile(wb, 'DCI_Projects_Import_Template.xlsx');
}

async function showProjectImportModal() {
  const slot = document.getElementById('modal-slot');
  if (!slot) return;
  slot.innerHTML = `
  <div class="modal-backdrop" onclick="closeModal(event)">
    <div class="modal" style="max-width:640px" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h2>Bulk Import Projects</h2>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="alert alert-info" style="margin-bottom:12px;font-size:13px">
          Upload an Excel file with columns: <strong>Project Number, Name, Client, Project Manager Name, Status</strong>.
          Existing project numbers will be updated; new ones will be created.
        </div>
        <div class="form-group" style="display:flex;gap:10px;align-items:center">
          <button type="button" class="btn btn-secondary btn-sm" onclick="downloadProjectTemplate()">⬇ Download Template</button>
          <input type="file" id="proj-imp-file" accept=".xlsx,.xls,.csv" onchange="previewProjectImport(this)">
        </div>
        <div id="proj-imp-preview"></div>
        <div id="proj-imp-actions" style="display:none" class="form-actions">
          <button type="button" class="btn btn-primary" id="proj-imp-btn" onclick="doProjectImport()">Import Now</button>
          <button type="button" class="btn btn-secondary" onclick="clearProjectImport()">Clear</button>
          <span class="form-error" id="proj-imp-err"></span>
        </div>
      </div>
    </div>
  </div>`;
  _projImportRows = [];
}

function clearProjectImport() {
  _projImportRows = [];
  const f = document.getElementById('proj-imp-file');
  if (f) f.value = '';
  const p = document.getElementById('proj-imp-preview');
  if (p) p.innerHTML = '';
  const a = document.getElementById('proj-imp-actions');
  if (a) a.style.display = 'none';
}

function previewProjectImport(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      _projImportRows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const preview = document.getElementById('proj-imp-preview');
      if (!_projImportRows.length) {
        preview.innerHTML = '<p class="form-error">No rows found in file.</p>';
        document.getElementById('proj-imp-actions').style.display = 'none';
        return;
      }
      const heads = ['Project Number','Name','Client','Project Manager Name','Status'];
      const tableRows = _projImportRows.slice(0,10).map(r => `
        <tr>
          <td>${esc(String(normalize(r,'project number')||''))}</td>
          <td>${esc(String(normalize(r,'name')||''))}</td>
          <td>${esc(String(normalize(r,'client')||''))}</td>
          <td>${esc(String(normalize(r,'project manager name')||normalize(r,'project manager')||''))}</td>
          <td>${esc(String(normalize(r,'status')||'Active'))}</td>
        </tr>`).join('');
      preview.innerHTML = `
        <p style="font-size:13px;margin:8px 0 4px"><strong>${_projImportRows.length}</strong> rows detected (showing first 10):</p>
        <div class="table-wrap" style="max-height:220px;overflow-y:auto">
          <table>
            <thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>`;
      document.getElementById('proj-imp-actions').style.display = 'flex';
    } catch(ex) {
      document.getElementById('proj-imp-preview').innerHTML = `<p class="form-error">Could not read file: ${esc(ex.message)}</p>`;
    }
  };
  reader.readAsArrayBuffer(file);
}

async function doProjectImport() {
  if (!_projImportRows.length) return;
  const btn = document.getElementById('proj-imp-btn');
  const err = document.getElementById('proj-imp-err');
  btn.disabled = true; btn.textContent = 'Importing…';
  try {
    // Load users for PM name → id lookup
    const users = await getUsers();
    const uByName = {};
    users.forEach(u => { uByName[u.displayName.trim().toLowerCase()] = u; });

    // Load existing projects for update-vs-create decision
    const existingSnap = await db.collection('projects').get();
    const projByNum = {};
    existingSnap.docs.forEach(d => { projByNum[String(d.data().projectNumber).trim()] = d.id; });

    let created = 0, updated = 0, skipped = 0;
    for (const row of _projImportRows) {
      const projNum  = String(normalize(row,'project number')||normalize(row,'projectnumber')||'').trim();
      const name     = String(normalize(row,'name')||normalize(row,'project name')||'').trim();
      if (!projNum || !name) { skipped++; continue; }

      const clientName  = String(normalize(row,'client')||normalize(row,'client name')||'').trim();
      const pmNameRaw   = String(normalize(row,'project manager name')||normalize(row,'project manager')||'').trim();
      const pmUser      = pmNameRaw ? uByName[pmNameRaw.toLowerCase()] : null;
      const rawStatus   = String(normalize(row,'status')||'Active').trim().toLowerCase();
      const active      = rawStatus !== 'inactive';

      const data = {
        projectNumber:       projNum,
        name,
        clientName,
        projectManagerId:    pmUser ? pmUser.id : null,
        projectManagerName:  pmUser ? pmUser.displayName : pmNameRaw,
        active,
        warningDays:         7,
        updatedAt:           firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (projByNum[projNum]) {
        await db.collection('projects').doc(projByNum[projNum]).update(data);
        await writeAudit('update','project',projByNum[projNum],projNum);
        updated++;
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.createdBy = S.user.uid;
        const ref = await db.collection('projects').add(data);
        await writeAudit('create','project',ref.id,projNum);
        projByNum[projNum] = ref.id;
        created++;
      }
    }

    invalidateCache();
    toast(`Import complete — ${created} created, ${updated} updated${skipped ? `, ${skipped} skipped` : ''}.`, 'success');
    closeModal();
    renderProjects();
  } catch (ex) {
    err.textContent = 'Error: ' + ex.message;
    btn.disabled = false; btn.textContent = 'Import Now';
  }
}

// ══════════════════════════════════════════════════════
//  20.  PAGE: ADMIN USERS
// ══════════════════════════════════════════════════════

// Dept list (mirrors DISCIPLINES but as full names for users)
const DEPARTMENTS = ['','Engineering','Electrical','Instrumentation','Mechanical','Project Management',
  'Procurement','QA/QC','Civil','Structural','Architecture','HSE','Administration','Finance','IT','Operations'];

let _usersUnsubscribe = null; // real-time listener handle

function buildUserRow(u) {
  const active = u.isActive !== false;
  return `<tr id="urow-${esc(u.id)}">
    <td><strong>${esc(u.employeeId||'—')}</strong></td>
    <td>${esc(u.displayName||'—')}</td>
    <td>${esc(u.email||'—')}</td>
    <td>${esc(u.designation||'—')}</td>
    <td>${esc(u.department||'—')}</td>
    <td>${roleBadge(u.role)}</td>
    <td>${active ? badge('Active','badge-success') : badge('Inactive','badge-muted')}</td>
    <td class="actions-cell" style="white-space:nowrap">
      <a class="btn btn-link btn-sm" href="#/admin/users/${esc(u.id)}/edit">Edit</a>
      <button class="btn btn-link btn-sm" style="color:${active?'var(--red)':'var(--green)'}"
        onclick="toggleUserActive('${esc(u.id)}',${!active})">
        ${active ? 'Deactivate' : 'Activate'}
      </button>
      <button class="btn btn-link btn-sm" style="color:var(--muted)"
        onclick="resetUserPassword('${esc(u.id)}','${esc(u.email||'')}')">
        Reset Password
      </button>
    </td>
  </tr>`;
}

async function renderAdminUsers() {
  // Tear down any previous real-time listener
  if (_usersUnsubscribe) { _usersUnsubscribe(); _usersUnsubscribe = null; }

  render(pageShell('admin-users', `
    <div class="page-header">
      <div><h1>User Management</h1><p id="users-count">Loading…</p></div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="downloadUserTemplate()">⬇ Download Template</button>
        <button class="btn btn-secondary" onclick="document.getElementById('user-bulk-section').style.display=document.getElementById('user-bulk-section').style.display==='none'?'block':'none'">⬆ Bulk Upload</button>
        <a class="btn btn-primary" href="#/admin/users/new">+ Add User</a>
      </div>
    </div>

    <!-- Bulk Upload Section (hidden by default) -->
    <div id="user-bulk-section" style="display:none" class="form-card" style="max-width:900px;margin-bottom:20px">
      <h3 style="margin-bottom:12px">Bulk Upload Users</h3>
      <div class="alert alert-info" style="margin-bottom:12px">
        ℹ️ Download the template first, fill in user details, then upload here.
        Required columns: <strong>Employee ID, Name, Email, Temporary Password, Role</strong>.
        Optional: Designation, Department, Status (default: active).
      </div>
      <label class="upload-zone" for="user-bulk-file" id="user-drop-zone" style="padding:20px;margin-bottom:12px">
        <div class="upload-icon">👥</div>
        <p><strong>Click to choose file</strong> or drag and drop here</p>
        <p>.xlsx or .xls files only</p>
        <input type="file" id="user-bulk-file" accept=".xlsx,.xls,.csv" onchange="previewUserBulkUpload()">
      </label>
      <div id="user-bulk-preview"></div>
      <div class="form-actions" id="user-bulk-actions" style="display:none">
        <button type="button" class="btn btn-primary" onclick="doBulkUserUpload()">Upload Users</button>
        <button type="button" class="btn btn-secondary" onclick="clearUserBulk()">Clear</button>
        <span class="form-error" id="user-bulk-err"></span>
      </div>
      <div id="user-bulk-progress" style="display:none;margin-top:12px"></div>
    </div>

    <div class="panel table-panel">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Employee ID</th><th>Name</th><th>Email</th>
            <th>Designation</th><th>Department</th><th>Role</th>
            <th>Status</th><th style="min-width:240px">Actions</th>
          </tr></thead>
          <tbody id="users-tbody">
            <tr><td colspan="8"><div class="empty-state"><div class="spinner" style="margin:0 auto 8px"></div><p>Loading users…</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `));

  // Real-time listener — updates table automatically when any user doc changes
  _usersUnsubscribe = db.collection('users').orderBy('displayName').onSnapshot(snap => {
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    S.cache.users = users; // keep cache in sync
    const tbody = document.getElementById('users-tbody');
    const countEl = document.getElementById('users-count');
    if (!tbody) return; // page was navigated away
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><h3>No users yet</h3><p>Click "+ Add User" to create the first user.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = users.map(buildUserRow).join('');
    }
    if (countEl) countEl.textContent = `${users.length} user${users.length !== 1 ? 's' : ''} in the system`;
  }, err => {
    const tbody = document.getElementById('users-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="color:red;padding:16px">Error loading users: ${esc(err.message)}</td></tr>`;
  });
}

function downloadUserTemplate() {
  const headers = ['Employee ID','Name','Email','Temporary Password','Designation','Department','Role','Status'];
  const sampleRows = [
    ['EMP001','John Smith','john.smith@shengitech.com','Pass@1234','Senior Engineer','Engineering','engineer','active'],
    ['EMP002','Jane Doe','jane.doe@shengitech.com','Pass@5678','Project Lead','Project Management','project_manager','active'],
  ];
  const notes = [['Roles: admin, management, project_manager, document_controller, engineer, viewer'],
                 ['Status: active or inactive'],
                 ['Departments: Engineering, Electrical, Instrumentation, Mechanical, Project Management, Procurement, QA/QC, Civil, Structural, Architecture, HSE, Administration, Finance, IT, Operations']];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows, [], ['--- NOTES ---'], ...notes]);
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 22) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'User Template');
  XLSX.writeFile(wb, 'DCI_User_Upload_Template.xlsx');
}

let _bulkUserRows = [];

function previewUserBulkUpload() {
  const file = document.getElementById('user-bulk-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { raw: false });
      // Filter out note rows (no Email column)
      _bulkUserRows = data.filter(r => r['Email'] && r['Name']);
      const preview = document.getElementById('user-bulk-preview');
      if (_bulkUserRows.length === 0) {
        preview.innerHTML = `<p style="color:red">No valid rows found. Make sure the file has Name and Email columns.</p>`;
        return;
      }
      const heads = ['Employee ID','Name','Email','Designation','Department','Role','Status'];
      const rows = _bulkUserRows.slice(0,10).map(r =>
        `<tr>${heads.map(h => `<td>${esc(String(r[h]||''))}</td>`).join('')}</tr>`).join('');
      preview.innerHTML = `
        <div class="import-preview" style="margin-bottom:12px">
          <p><strong>${_bulkUserRows.length}</strong> user${_bulkUserRows.length!==1?'s':''} found · Showing first 10</p>
          <div class="table-wrap" style="max-height:250px;overflow:auto">
            <table><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${rows}</tbody></table>
          </div>
        </div>`;
      document.getElementById('user-bulk-actions').style.display = 'flex';
    } catch(ex) {
      document.getElementById('user-bulk-err').textContent = 'Could not read file: ' + ex.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

function clearUserBulk() {
  _bulkUserRows = [];
  document.getElementById('user-bulk-preview').innerHTML = '';
  document.getElementById('user-bulk-actions').style.display = 'none';
  document.getElementById('user-bulk-file').value = '';
  document.getElementById('user-bulk-err').textContent = '';
  document.getElementById('user-bulk-progress').style.display = 'none';
}

async function doBulkUserUpload() {
  if (!_bulkUserRows.length) return;
  const btn = document.querySelector('#user-bulk-actions .btn-primary');
  const errEl = document.getElementById('user-bulk-err');
  const progress = document.getElementById('user-bulk-progress');
  btn.disabled = true; errEl.textContent = ''; progress.style.display = 'block';
  const apiKey = firebase.app().options.apiKey;
  let created = 0, skipped = 0, errors = [];

  for (let i = 0; i < _bulkUserRows.length; i++) {
    const row = _bulkUserRows[i];
    const name   = (row['Name']||'').trim();
    const email  = (row['Email']||'').trim().toLowerCase();
    const pass   = (row['Temporary Password']||'TempPass@123').trim();
    const empId  = (row['Employee ID']||'').trim();
    const desig  = (row['Designation']||'').trim();
    const dept   = (row['Department']||'').trim();
    const role   = (row['Role']||'engineer').trim().toLowerCase().replace(/ /g,'_');
    const status = (row['Status']||'active').trim().toLowerCase();
    const isActive = status !== 'inactive';

    progress.innerHTML = `<p>Processing ${i+1} of ${_bulkUserRows.length}: ${esc(email)}…</p>`;

    if (!email || !name) { errors.push(`Row ${i+2}: missing Name or Email`); skipped++; continue; }

    try {
      // Check if email already exists in Firestore
      const existing = await db.collection('users').where('email','==',email).get();
      if (!existing.empty) { skipped++; errors.push(`${email}: already exists, skipped`); continue; }

      // Create Auth user via REST API (does NOT sign out current user)
      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email, password: pass, returnSecureToken: true }) }
      );
      const data = await resp.json();
      if (data.error) {
        const msg = data.error.message;
        if (msg === 'EMAIL_EXISTS') { skipped++; errors.push(`${email}: already in Auth, skipped`); continue; }
        throw new Error(msg);
      }
      const uid = data.localId;

      // Write Firestore profile
      await db.collection('users').doc(uid).set({
        employeeId: empId, displayName: name, email,
        role: ROLES.includes(role) ? role : 'engineer',
        designation: desig, department: dept, isActive,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user?.uid || ''
      });
      created++;
    } catch(ex) {
      errors.push(`${email}: ${ex.message}`);
    }
  }

  progress.innerHTML = `
    <div class="alert ${errors.length && !created ? 'alert-danger' : 'alert-success'}" style="margin-top:8px">
      ✅ <strong>${created}</strong> user${created!==1?'s':''} created
      ${skipped ? `, <strong>${skipped}</strong> skipped` : ''}
      ${errors.length ? `<br><small style="color:#c00">${errors.join('<br>')}</small>` : ''}
    </div>`;
  btn.disabled = false;
  if (created > 0) { _bulkUserRows = []; document.getElementById('user-bulk-actions').style.display = 'none'; }
}

async function renderUserForm(userId) {
  const user = userId ? await getUser(userId) : null;
  const roleOptions = ROLES.map(r =>
    `<option value="${esc(r)}" ${(user?.role||'viewer') === r ? 'selected':''}>${esc(ROLE_LABELS[r])}</option>`).join('');
  const deptOptions = DEPARTMENTS.map(d =>
    `<option value="${esc(d)}" ${(user?.department||'') === d ? 'selected':''}>${esc(d||'— Select Department —')}</option>`).join('');

  render(pageShell('admin-users', `
    <div style="margin-bottom:14px"><a href="#/admin/users" style="color:var(--muted);font-size:13px">← Back to Users</a></div>
    <div class="form-card">
      <h2 style="margin-bottom:20px">${user ? 'Edit User' : 'Add New User'}</h2>
      <form id="user-form" onsubmit="saveUser(event,${user ? `'${esc(user.id)}'` : 'null'})">
        <div class="form-grid">

          <div class="form-group">
            <label>Employee ID *</label>
            <input type="text" id="f-uid" value="${esc(user?.employeeId||'')}" required placeholder="e.g. EMP-001">
            <span class="hint">Must be unique. Cannot be changed after creation.</span>
          </div>

          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="f-uname" value="${esc(user?.displayName||'')}" required placeholder="First Last">
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" id="f-uemail" value="${esc(user?.email||'')}" ${user?'readonly':''} required placeholder="user@company.com">
            ${user ? '<span class="hint">Email cannot be changed here. Use Reset Password to send a new password.</span>' : ''}
          </div>

          ${!user ? `<div class="form-group">
            <label>Temporary Password *</label>
            <input type="password" id="f-upass" required minlength="8" placeholder="Min. 8 characters — user should change after login">
          </div>` : ''}

          <div class="form-group">
            <label>Designation / Job Title *</label>
            <input type="text" id="f-udesig" value="${esc(user?.designation||'')}" required placeholder="e.g. Senior Engineer">
          </div>

          <div class="form-group">
            <label>Department</label>
            <select id="f-udept">${deptOptions}</select>
          </div>

          <div class="form-group">
            <label>Role *</label>
            <select id="f-urole" required onchange="updateRoleHint(this.value)">${roleOptions}</select>
            <span class="hint" id="role-hint">${getRoleHint(user?.role||'viewer')}</span>
          </div>

          <div class="form-group">
            <label>Account Status</label>
            <select id="f-ustatus">
              <option value="active" ${(user?.isActive !== false) ? 'selected' : ''}>Active — can log in</option>
              <option value="inactive" ${(user?.isActive === false) ? 'selected' : ''}>Inactive — login blocked</option>
            </select>
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

function getRoleHint(role) {
  const hints = {
    admin: 'Full access to everything — all pages, all data, all users.',
    management: 'Director/Management — full view access to everything, can manage users.',
    project_manager: 'Can view and manage documents in assigned projects.',
    document_controller: 'Can create and manage document revisions.',
    engineer: 'Can view documents and submit revision comments.',
    viewer: 'Read-only access to assigned documents only.'
  };
  return hints[role] || '';
}

function updateRoleHint(role) {
  const el = document.getElementById('role-hint');
  if (el) el.textContent = getRoleHint(role);
}

async function saveUser(e, userId) {
  e.preventDefault();
  const btn = document.getElementById('user-save-btn');
  const err = document.getElementById('user-err');
  btn.disabled = true; btn.textContent = 'Saving…';
  err.textContent = '';
  try {
    const name       = document.getElementById('f-uname').value.trim();
    const email      = document.getElementById('f-uemail').value.trim();
    const role       = document.getElementById('f-urole').value;
    const pass       = document.getElementById('f-upass')?.value;
    const empId      = document.getElementById('f-uid').value.trim().toUpperCase();
    const desig      = document.getElementById('f-udesig').value.trim();
    const dept       = document.getElementById('f-udept').value;
    const isActive   = document.getElementById('f-ustatus').value === 'active';

    if (!empId) throw new Error('Employee ID is required.');
    if (!name)  throw new Error('Full name is required.');

    // Check for duplicate Employee ID
    const empSnap = await db.collection('users').where('employeeId', '==', empId).get();
    if (!empSnap.empty && empSnap.docs[0].id !== userId) {
      throw new Error(`Employee ID "${empId}" is already in use by another user.`);
    }

    if (userId) {
      // ── UPDATE existing user ──────────────────────────────────────
      await db.collection('users').doc(userId).update({
        displayName: name, role, designation: desig, department: dept,
        isActive, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      invalidateCache();
      await writeAudit('update', 'user', userId, name, { role });
      toast('User updated successfully.', 'success');
      nav('/admin/users');

    } else {
      // ── CREATE new user ───────────────────────────────────────────
      if (!pass || pass.length < 8) throw new Error('Password must be at least 8 characters.');

      // Step 1: Create Auth account via REST API — does NOT sign out the admin
      const apiKey = firebase.app().options.apiKey;
      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass, returnSecureToken: true }) }
      );
      const data = await resp.json();
      if (data.error) {
        const msg = data.error.message || 'Unknown error';
        if (msg.includes('EMAIL_EXISTS')) throw new Error('That email address is already registered.');
        if (msg.includes('WEAK_PASSWORD')) throw new Error('Password is too weak. Use at least 8 characters.');
        throw new Error(msg);
      }
      const newUid = data.localId;

      // Step 2: Write Firestore profile (atomic — if this fails we know Auth was created)
      try {
        await db.collection('users').doc(newUid).set({
          employeeId: empId, displayName: name, email, role,
          designation: desig, department: dept, isActive,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: S.user?.uid || ''
        });
      } catch (fsErr) {
        // Firestore write failed — inform admin so they can retry or use Register tool
        throw new Error(`Login account created but profile save failed: ${fsErr.message}. The user can log in but won't appear in the list until their profile is fixed.`);
      }

      invalidateCache();
      await writeAudit('create', 'user', newUid, name, { role, email, empId });
      toast(`✅ User "${name}" created! They can now sign in.`, 'success');
      nav('/admin/users');
    }
  } catch (ex) {
    err.textContent = ex.message || String(ex);
    btn.disabled = false; btn.textContent = userId ? 'Save Changes' : 'Create User';
  }
}

async function resetUserPassword(userId, email) {
  if (!email) { toast('No email on record for this user.', 'error'); return; }
  if (!confirm(`Send a password reset email to ${email}?`)) return;
  try {
    const apiKey = firebase.app().options.apiKey;
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }) }
    );
    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);
    await writeAudit('reset-password', 'user', userId, email);
    toast(`Password reset email sent to ${email}.`, 'success');
  } catch (ex) {
    toast('Failed to send reset email: ' + ex.message, 'error');
  }
}

async function toggleUserActive(userId, active) {
  await db.collection('users').doc(userId).update({ isActive: active, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  invalidateCache();
  await writeAudit(active ? 'activate' : 'deactivate', 'user', userId, 'user');
  toast(active ? 'User activated.' : 'User deactivated.', 'success');
  // Table updates automatically via the real-time listener — no re-render needed
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
      <div><button class="btn btn-secondary" onclick="downloadImportTemplate()">⬇ Download Template</button></div>
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

function downloadImportTemplate() {
  const headers = [
    'Document Number', 'Title', 'Project Number', 'Document Type', 'Discipline',
    'Document Code', 'Issue Purpose', 'Owner Name', 'Project Manager Name',
    'Target Date', 'Actual Sent Date', 'Received Date', 'Client Due Date',
    'Rev Status', 'Client Comments', 'Internal Remarks'
  ];
  const sampleRow = [
    'ELT-001-001', 'Single Line Diagram', 'PRJ-001', 'External', 'ELT',
    'SP', 'IFR', 'John Smith', 'Jane Doe',
    '2024-01-31', '2024-02-05', '2024-02-10', '2024-02-20',
    'awaiting_response', 'Please review section 3', 'Issued for Review'
  ];
  const notes = [
    ['Document Type: Internal or External'],
    ['Rev Status: concept, submitted, awaiting_response, response_received, comments_received, new_revision_required, approved, final_approved'],
    ['Disciplines: ELT, INS, MEC, PMG, PRC, QAC, CIV, STR, ARC, HSE'],
    ['Issue Purpose: IFR, IFC, IFI, IFA, IFB, IFT, AFD'],
    ['Dates format: YYYY-MM-DD'],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow, [], ['--- NOTES ---'], ...notes]);
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 20) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Import Template');
  XLSX.writeFile(wb, 'DCI_Import_Template.xlsx');
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

      const revisionNumber = parseInt(normalize(row,'revision')||normalize(row,'rev no')||'0') || 0;
      const rawRevStatus = String(normalize(row,'rev status')||normalize(row,'status')||'concept').trim().toLowerCase().replace(/ /g,'_');
      const revStatus2 = REV_STATUSES.includes(rawRevStatus) ? rawRevStatus : 'concept';
      const targetDate = parseDate(normalize(row,'target date')||normalize(row,'target sent date')||normalize(row,'targetdate'));
      const actualSentDate = parseDate(normalize(row,'actual sent date')||normalize(row,'actualsentdate'));
      const clientDue = parseDate(normalize(row,'client due date')||normalize(row,'client response due date')||normalize(row,'clientdue'));
      const revData = {
        documentId: null, // will set after doc id known
        revisionNumber,
        status:               revStatus2,
        approvalStatus:       revStatus2 === 'approved' || revStatus2 === 'final_approved' ? 'approved' : 'pending',
        targetDate:           targetDate,
        sentDate:             targetDate,
        actualSentDate:       actualSentDate,
        receivedDate:         parseDate(normalize(row,'received date')||normalize(row,'receiveddate')),
        clientDueDate:        clientDue,
        clientComments:       String(normalize(row,'client comments')||'').trim(),
        internalRemarks:      String(normalize(row,'internal remarks')||normalize(row,'remarks')||'').trim(),
        // legacy fields
        startDate:            parseDate(normalize(row,'start date')||normalize(row,'startdate')),
        targetSentDate:       targetDate,
        clientResponseDueDate: clientDue,
        finalApproved:        revStatus2 === 'final_approved',
        remarks:              String(normalize(row,'internal remarks')||normalize(row,'remarks')||'').trim(),
        version: 1,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user.uid
      };

      let docId;
      if (docByNum[docNum]) {
        docId = docByNum[docNum].id;
        updated++;
      } else {
        const rawDocType = String(normalize(row,'document type')||normalize(row,'type')||'External').trim();
        const docType = DOC_TYPES.includes(rawDocType) ? rawDocType : 'External';
        const ownerNameRaw = String(normalize(row,'owner name')||normalize(row,'responsible')||'').trim();
        const pmNameRaw    = String(normalize(row,'project manager name')||normalize(row,'project manager')||'').trim();
        const docData = {
          documentNumber: docNum, title, projectId,
          documentType:  docType,
          discipline:    String(normalize(row,'discipline')||'').trim().toUpperCase(),
          documentCode:  String(normalize(row,'document code')||normalize(row,'code')||'').trim(),
          issuePurpose:  String(normalize(row,'issue purpose')||normalize(row,'purpose')||'').trim(),
          primaryOwnerName:   ownerNameRaw,
          projectManagerName: pmNameRaw,
          responsibleName:    ownerNameRaw,
          state: 'active', finalApproved: false, version: 1, isDeleted: false,
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
      const docRevs = revsByDoc[doc.id] || [{}];
      for (const rev of docRevs) {
        const targetDate = rev.targetDate || rev.targetSentDate || '';
        const clientDue  = rev.clientDueDate || rev.clientResponseDueDate || '';
        const revStatusLabel = rev.status ? (REV_STATUS_LABELS[rev.status] || rev.status) :
          (rev.finalApproved ? 'Final Approved' : rev.actualSentDate ? 'Awaiting Response' : 'Concept');
        rows.push({
          'Project Number':      proj?.projectNumber || '',
          'Project Name':        proj?.name || '',
          'Client':              proj?.clientName || '',
          'Document Number':     doc.documentNumber || '',
          'Title':               doc.title || '',
          'Document Type':       doc.documentType || 'Not Set',
          'Discipline':          doc.discipline || '',
          'Document Code':       doc.documentCode || '',
          'Issue Purpose':       doc.issuePurpose || '',
          'Primary Owner':       doc.primaryOwnerName || doc.responsibleName || '',
          'Project Manager':     doc.projectManagerName || '',
          'State':               doc.state || '',
          'Revision':            rev.revisionNumber ?? '',
          'Rev Status':          revStatusLabel,
          'Approval Status':     rev.approvalStatus ? (APPROVAL_STATUS_LABELS[rev.approvalStatus] || rev.approvalStatus) : '',
          'Start Date':          rev.startDate || '',
          'Target Date':         targetDate,
          'Sent Date':           rev.sentDate || '',
          'Actual Sent Date':    rev.actualSentDate || '',
          'Received Date':       rev.receivedDate || '',
          'Client Due Date':     clientDue,
          'Client Comments':     rev.clientComments || '',
          'Internal Remarks':    rev.internalRemarks || rev.remarks || '',
          'Final Approved':      (rev.finalApproved || rev.status === 'final_approved') ? 'Yes' : 'No',
        });
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DCI Schedule');
    // Column widths
    ws['!cols'] = [12,24,18,20,40,12,8,10,10,20,20,10,6,18,14,12,14,12,14,14,14,24,24,12].map(w=>({wch:w}));
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
//  24b.  PAGE: ROLE PERMISSIONS
// ══════════════════════════════════════════════════════

const ROLE_PAGES = [
  { key: 'dashboard',       label: 'Dashboard' },
  { key: 'projects',        label: 'Projects' },
  { key: 'documents',       label: 'Documents' },
  { key: 'export',          label: 'Export to Excel' },
  { key: 'admin-import',    label: 'Import from Excel' },
  { key: 'admin-transfer',  label: 'Ownership Transfer' },
  { key: 'audit',           label: 'Audit Log' },
];

const ROLE_COLUMNS = [
  { key: 'documentNumber',        label: 'Document Number' },
  { key: 'title',                 label: 'Title' },
  { key: 'project',               label: 'Project' },
  { key: 'discipline',            label: 'Discipline' },
  { key: 'documentCode',          label: 'Document Code' },
  { key: 'issuePurpose',          label: 'Issue Purpose' },
  { key: 'internalExternal',      label: 'Int / Ext' },
  { key: 'responsibleName',       label: 'Owner Name' },
  { key: 'state',                 label: 'State' },
  { key: 'revision',              label: 'Revision #' },
  { key: 'startDate',             label: 'Start Date' },
  { key: 'targetSentDate',        label: 'Target Sent Date' },
  { key: 'actualSentDate',        label: 'Actual Sent Date' },
  { key: 'receivedDate',          label: 'Received Date' },
  { key: 'clientResponseDueDate', label: 'Client Response Due' },
  { key: 'finalApproved',         label: 'Final Approved' },
  { key: 'remarks',               label: 'Remarks' },
];

// Roles that can be configured (admin always has full access)
const CONFIGURABLE_ROLES = ['management','project_manager','document_controller','engineer','viewer'];

// Default permissions — all pages/columns ON for all roles
function defaultRolePermissions() {
  const perms = {};
  for (const role of CONFIGURABLE_ROLES) {
    perms[role] = { pages: {}, columns: {} };
    for (const p of ROLE_PAGES)    perms[role].pages[p.key]   = true;
    for (const c of ROLE_COLUMNS)  perms[role].columns[c.key] = true;
  }
  return perms;
}

async function renderAdminRoles() {
  // Load saved permissions (or use defaults)
  let perms = defaultRolePermissions();
  try {
    const snap = await db.collection('settings').doc('rolePermissions').get();
    if (snap.exists) {
      const saved = snap.data();
      // Merge saved into defaults so new pages/columns get added automatically
      for (const role of CONFIGURABLE_ROLES) {
        if (saved[role]) {
          perms[role].pages   = Object.assign(perms[role].pages,   saved[role].pages   || {});
          perms[role].columns = Object.assign(perms[role].columns, saved[role].columns || {});
        }
      }
    }
  } catch (ex) { /* no doc yet, use defaults */ }

  // Build the permissions matrix table
  function toggleCells(role, section) {
    const keys = section === 'pages' ? ROLE_PAGES : ROLE_COLUMNS;
    return keys.map(item => {
      const checked = perms[role][section][item.key] !== false ? 'checked' : '';
      return `<td class="perm-cell">
        <label class="toggle-wrap">
          <input type="checkbox" class="perm-cb"
            data-role="${esc(role)}" data-section="${section}" data-key="${esc(item.key)}"
            ${checked}>
          <span class="toggle-slider"></span>
        </label>
      </td>`;
    }).join('');
  }

  function roleBlock(role) {
    return `
      <div class="perm-role-block" id="block-${role}">
        <div class="perm-role-header">
          <span class="role-badge role-${role}">${esc(ROLE_LABELS[role])}</span>
          <div class="perm-role-actions">
            <button class="btn btn-xs btn-secondary" onclick="rolePermSelectAll('${role}','pages',true)">All Pages</button>
            <button class="btn btn-xs btn-secondary" onclick="rolePermSelectAll('${role}','pages',false)">No Pages</button>
            <button class="btn btn-xs btn-secondary" onclick="rolePermSelectAll('${role}','columns',true)">All Cols</button>
            <button class="btn btn-xs btn-secondary" onclick="rolePermSelectAll('${role}','columns',false)">No Cols</button>
          </div>
        </div>

        <div class="perm-section-label">Pages (navigation access)</div>
        <div class="table-wrap">
          <table class="perm-table">
            <thead><tr>${ROLE_PAGES.map(p=>`<th>${esc(p.label)}</th>`).join('')}</tr></thead>
            <tbody><tr>${toggleCells(role,'pages')}</tr></tbody>
          </table>
        </div>

        <div class="perm-section-label" style="margin-top:16px">Document Columns (visibility in Documents list)</div>
        <div class="table-wrap">
          <table class="perm-table">
            <thead><tr>${ROLE_COLUMNS.map(c=>`<th>${esc(c.label)}</th>`).join('')}</tr></thead>
            <tbody><tr>${toggleCells(role,'columns')}</tr></tbody>
          </table>
        </div>
      </div>`;
  }

  const blocks = CONFIGURABLE_ROLES.map(roleBlock).join('');

  render(pageShell('admin-roles', `
    <div class="page-header">
      <div>
        <h1>Role Permissions</h1>
        <p>Control which pages and document columns each role can access. Admin always has full access.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="save-perms-btn" onclick="saveRolePermissions()">💾 Save Permissions</button>
      </div>
    </div>

    <div class="alert alert-info" style="margin-bottom:20px">
      ℹ️ <strong>Admin</strong> and <strong>Management (Director)</strong> always have full access and cannot be restricted here.
      Configure access for the remaining roles below.
    </div>

    <div id="role-perms-form">
      ${blocks}
    </div>
    <div class="form-actions" style="margin-top:24px">
      <button class="btn btn-primary" onclick="saveRolePermissions()">💾 Save Permissions</button>
      <span class="form-error" id="perms-err"></span>
      <span class="form-success" id="perms-ok" style="color:var(--green);font-weight:600"></span>
    </div>
  `));

  // Wire up checkboxes to update in-memory perms on change
  document.querySelectorAll('.perm-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      const { role, section, key } = cb.dataset;
      if (!perms[role]) perms[role] = { pages: {}, columns: {} };
      perms[role][section][key] = cb.checked;
    });
  });
}

window.rolePermSelectAll = function(role, section, value) {
  const keys = section === 'pages' ? ROLE_PAGES : ROLE_COLUMNS;
  keys.forEach(item => {
    const cb = document.querySelector(`.perm-cb[data-role="${role}"][data-section="${section}"][data-key="${item.key}"]`);
    if (cb) { cb.checked = value; cb.dispatchEvent(new Event('change')); }
  });
};

window.saveRolePermissions = async function() {
  const btn = document.getElementById('save-perms-btn');
  const err = document.getElementById('perms-err');
  const ok  = document.getElementById('perms-ok');
  if (err) err.textContent = '';
  if (ok)  ok.textContent  = '';
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  // Collect current state from checkboxes
  const perms = {};
  for (const role of CONFIGURABLE_ROLES) {
    perms[role] = { pages: {}, columns: {} };
    for (const p of ROLE_PAGES) {
      const cb = document.querySelector(`.perm-cb[data-role="${role}"][data-section="pages"][data-key="${p.key}"]`);
      perms[role].pages[p.key] = cb ? cb.checked : true;
    }
    for (const c of ROLE_COLUMNS) {
      const cb = document.querySelector(`.perm-cb[data-role="${role}"][data-section="columns"][data-key="${c.key}"]`);
      perms[role].columns[c.key] = cb ? cb.checked : true;
    }
  }

  try {
    await db.collection('settings').doc('rolePermissions').set({
      ...perms,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: S.user.uid
    });
    await writeAudit('update','settings','rolePermissions','Role permissions updated');
    toast('Role permissions saved successfully.', 'success');
    if (ok)  ok.textContent  = '✓ Saved!';
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Permissions'; }
  } catch (ex) {
    if (err) err.textContent = 'Error saving: ' + ex.message;
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Permissions'; }
  }
};

// ══════════════════════════════════════════════════════
//  24c.  PAGE: ANALYTICS
// ══════════════════════════════════════════════════════

async function renderAnalytics() {
  const [projects, docsSnap, revsSnap] = await Promise.all([
    getProjects(),
    db.collection('documents').get(),
    db.collection('revisions').get()
  ]);

  let docs = docsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => !d.isDeleted);
  const revs = revsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const pmap = {}; projects.forEach(p => { pmap[p.id] = p; });

  // Latest revision per document
  const latestRev = {};
  revs.forEach(r => {
    const docId = r.documentId;
    if (!latestRev[docId] || (r.revisionNumber||0) > (latestRev[docId].revisionNumber||0)) latestRev[docId] = r;
  });

  // 1. By Status
  const statusCount = {};
  REV_STATUSES.forEach(s => statusCount[s] = 0);
  docs.forEach(d => {
    const r = latestRev[d.id];
    const st = r?.status || 'concept';
    statusCount[st] = (statusCount[st]||0) + 1;
  });

  // 2. By Document Type
  const typeCount = { Internal: 0, External: 0, 'Not Set': 0 };
  docs.forEach(d => { const t = d.documentType || 'Not Set'; typeCount[t] = (typeCount[t]||0)+1; });

  // 3. By Discipline
  const discCount = {};
  docs.forEach(d => { const k = d.discipline||'Other'; discCount[k]=(discCount[k]||0)+1; });

  // 4. By Project
  const projCount = {};
  docs.forEach(d => { if (d.projectId) projCount[d.projectId]=(projCount[d.projectId]||0)+1; });

  // 5. Approval breakdown
  const approvedCount  = docs.filter(d => latestRev[d.id]?.status === 'approved' || latestRev[d.id]?.status === 'final_approved' || latestRev[d.id]?.finalApproved).length;
  const notApprCount   = docs.filter(d => latestRev[d.id]?.status === 'new_revision_required' || latestRev[d.id]?.approvalStatus === 'not_approved').length;
  const awaitingCount  = docs.filter(d => latestRev[d.id]?.status === 'awaiting_response').length;
  const inProgressCount = docs.length - approvedCount - notApprCount - awaitingCount;

  // 6. Overdue docs (latest rev has targetDate in the past and not sent)
  const todayStr = today();
  const overdueCount = docs.filter(d => {
    const r = latestRev[d.id];
    if (!r) return false;
    const t = r.targetDate || r.targetSentDate;
    return t && t < todayStr && !r.actualSentDate && r.status !== 'approved' && r.status !== 'final_approved';
  }).length;

  // 7. Revisions per month (last 12 months)
  const monthCount = {};
  revs.forEach(r => {
    const d = r.createdAt?.toDate?.();
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthCount[key] = (monthCount[key]||0)+1;
  });
  const sortedMonths = Object.keys(monthCount).sort().slice(-12);

  function barChart(entries, colorFn, maxW = 200) {
    const max = Math.max(1, ...entries.map(e => e[1]));
    return entries.map(([label, cnt]) => `
      <div class="bar-row">
        <span style="min-width:160px;font-size:13px">${esc(label)}</span>
        <div class="bar-track" style="flex:1;max-width:${maxW}px">
          <i class="bar-fill" style="width:${Math.round(cnt/max*100)}%;background:${colorFn(label)}"></i>
        </div>
        <strong style="min-width:36px;text-align:right">${cnt}</strong>
      </div>`).join('');
  }

  const STATUS_COLORS = { concept:'#98a2b3', submitted:'#0ea5e9', awaiting_response:'#f59e0b',
    response_received:'#6366f1', comments_received:'#8b5cf6', new_revision_required:'#ef4444',
    approved:'#009E9B', final_approved:'#007B7A' };
  const DISC_COLORS2 = { ELT:'#009E9B', INS:'#007B7A', MEC:'#005f5e', PRC:'#3a8a3e',
    PMG:'#00b4b0', QAC:'#6bd6d3', CIV:'#1a8c8a', STR:'#0d6e6c', ARC:'#4db8b5', HSE:'#2ca9a7', Other:'#98a2b3' };

  render(pageShell('analytics', `
    <div class="page-header">
      <div><h1>Analytics</h1><p>Document & revision statistics — ${esc(todayStr)}</p></div>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi info"><span>Total Documents</span><strong>${docs.length}</strong><small>excluding archived</small></div>
      <div class="kpi success"><span>Approved</span><strong>${approvedCount}</strong><small>approved or final approved</small></div>
      <div class="kpi danger"><span>Not Approved</span><strong>${notApprCount}</strong><small>needs revision</small></div>
      <div class="kpi warning"><span>Awaiting Response</span><strong>${awaitingCount}</strong><small>sent to client</small></div>
      <div class="kpi danger"><span>Overdue</span><strong>${overdueCount}</strong><small>past target, not sent</small></div>
      <div class="kpi"><span>Total Revisions</span><strong>${revs.length}</strong><small>all time</small></div>
      <div class="kpi"><span>Active Projects</span><strong>${projects.filter(p=>p.active).length}</strong><small>active</small></div>
      <div class="kpi"><span>In Progress</span><strong>${inProgressCount}</strong><small>concept / submitted</small></div>
    </div>

    <div class="dashboard-grid">
      <div class="panel">
        <div class="panel-heading"><h2>By Revision Status (latest rev)</h2></div>
        <div class="bar-list">
          ${barChart(REV_STATUSES.map(s => [REV_STATUS_LABELS[s], statusCount[s]||0]), l => STATUS_COLORS[REV_STATUSES.find(s=>REV_STATUS_LABELS[s]===l)] || '#98a2b3')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>By Discipline</h2></div>
        <div class="bar-list">
          ${barChart(Object.entries(discCount).sort((a,b)=>b[1]-a[1]), l => DISC_COLORS2[l]||'#94a3b8')}
        </div>
      </div>
    </div>

    <div class="dashboard-grid" style="margin-top:20px">
      <div class="panel">
        <div class="panel-heading"><h2>By Document Type</h2></div>
        <div class="bar-list">
          ${barChart(Object.entries(typeCount), l => l==='Internal'?'#009E9B':l==='External'?'#007B7A':'#98a2b3')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>By Project (doc count)</h2></div>
        <div class="bar-list">
          ${barChart(
            Object.entries(projCount).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([pid,cnt])=>[(pmap[pid]?.projectNumber||pid)+' '+esc(pmap[pid]?.name||''), cnt]),
            () => '#009E9B'
          )}
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:20px">
      <div class="panel-heading"><h2>Revisions Created per Month (last 12 months)</h2></div>
      <div class="bar-list">
        ${barChart(sortedMonths.map(m=>[m, monthCount[m]||0]), ()=>'#009E9B', 400)}
      </div>
    </div>

    <div class="panel" style="margin-top:20px">
      <div class="panel-heading">
        <h2>Approval Summary</h2>
        <a href="#/export" style="font-size:13px">Export data →</a>
      </div>
      <div class="bar-list">
        ${barChart([
          ['Approved / Final Approved', approvedCount],
          ['Awaiting Response', awaitingCount],
          ['Not Approved / Needs Revision', notApprCount],
          ['Overdue', overdueCount],
          ['In Progress / Concept', inProgressCount],
        ], l => l.startsWith('Approved')?'#009E9B':l.startsWith('Awaiting')?'#f59e0b':l.startsWith('Not')?'#ef4444':l.startsWith('Over')?'#dc2626':'#98a2b3', 400)}
      </div>
    </div>
  `));
}

// ══════════════════════════════════════════════════════
//  25.  MAIN ROUTER
// ══════════════════════════════════════════════════════

async function handleRoute() {
  // Tear down any users real-time listener when navigating away from that page
  if (_usersUnsubscribe && matchRoute(window.location.hash).page !== 'admin-users') {
    _usersUnsubscribe(); _usersUnsubscribe = null;
  }
  const route = matchRoute(window.location.hash);

  // Redirect to login if not signed in
  if (!S.user && !route.pub) { nav('/login'); return; }

  // Already on login page with no user — show it
  if (route.page === 'login' && !S.user) { renderLogin(); return; }

  // Already signed in → redirect away from login
  if (route.page === 'login' && S.user) { nav('/'); return; }

  // Admin/Management-only guard
  if (route.admin && !isManagement()) {
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
      case 'admin-roles':      await renderAdminRoles();                             break;
      case 'export':           await renderExport();                                 break;
      case 'analytics':        await renderAnalytics();                              break;
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
