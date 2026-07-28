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
      await db.collection('users').doc(userId).update({ displayName: name, role, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      invalidateCache();
      await writeAudit('update','user',userId,name,{role});
      toast('User updated.','success');
      nav('/admin/users');
    } else {
      const apiKey = firebase.app().options.apiKey;
      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email, password: pass, returnSecureToken: false }) }
      );
      const data = await resp.json();
      if (data.error) {
        const msg = data.error.message || 'Unknown error';
        if (msg.includes('EMAIL_EXISTS')) throw { code: 'auth/email-already-in-use' };
        throw new Error(msg);
      }
      const newUid = data.localId;
      await db.collection('users').doc(newUid).set({
        displayName: name, email, role, isActive: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: S.user?.uid || ''
      });
      invalidateCache();
      await writeAudit('create','user',newUid,name,{role,email});
      toast('User created successfully! They can now sign in.','success');
      nav('/admin/users');
    }
  } catch (ex) {
    if (ex.code === 'auth/email-already-in-use') {
      document.getElementById('user-err').textContent = 'That email is already registered.';
    } else {
      document.getElementById('user-err').textContent = 'Error: ' + ex.message;
    }
    btn.disabled = false; btn.textContent = userId ? 'Save Changes' : 'Create User';
  }
}
