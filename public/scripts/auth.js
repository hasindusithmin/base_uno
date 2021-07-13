
let currentUser, uid;
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user['email'];
        uid = user['uid'];
        document.getElementById('username').innerHTML = currentUser;
        db.collection('guilds').onSnapshot(snapshot => {
            document.getElementById('root').innerHTML = '';
            setupUI(snapshot.docs)
        })
    }
    else setupUI([])
})



//signup form...
const signUp = document.querySelector('#sign form');
// console.log(signUp);
signUp.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelectorAll('span').forEach(span => { if (span.id != 'close') span.innerHTML = '' })
    const user = (validator.isAlphanumeric(e.target.user.value)) ? e.target.user.value : '';
    if (!user) document.getElementById('user').innerHTML = 'enter valid username';
    const city = (validator.isAlpha(e.target.city.value)) ? e.target.city.value : '';
    if (!city) document.getElementById('city').innerHTML = 'enter valid city';
    const email = (validator.isEmail(e.target.email.value)) ? e.target.email.value : '';
    if (!email) document.getElementById('email').innerHTML = 'enter valid email';
    const pword = (validator.isStrongPassword(e.target.pword.value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) ? e.target.pword.value : '';
    if (!pword) document.getElementById('pword').innerHTML = 'enter valid password:minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1';
    const birth = e.target.birth.value;
    const profile = e.target.profile.files[0];
    const userdata = { user, city, email, pword, birth, profile }
    if (!Object.values(userdata).includes('')) {
        auth.createUserWithEmailAndPassword(userdata['email'], userdata['pword'])
            .then(cred => {
                return bucket.child(`${Date.now()}-${profile.name}`).put(profile, { contentType: profile.type })
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(url => {
                        db.collection('users').doc(cred.user['uid']).set({ user, city, birth, url })
                    })
            }).then(() => {
                signUp.reset();
                document.getElementById('sign').style.display = 'none';
            })
            .catch(err => {
                document.getElementById('email').innerHTML = err['message']
            })
    };
})


// login form
const loginForm = document.querySelector('#login form');

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelectorAll('span').forEach(span => { if (span.id != 'close') span.innerHTML = '' })
    const email = (validator.isEmail(e.target.email.value)) ? e.target.email.value : '';
    if (!email) document.getElementById('Email').innerHTML = 'enter valid email';
    const pword = (validator.isStrongPassword(e.target.pword.value)) ? e.target.pword.value : '';
    if (!pword) document.getElementById('Pword').innerHTML = 'enter valid password:minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1';
    const userData = { email, pword };
    if (!Object.values(userData).includes('')) {
        auth.signInWithEmailAndPassword(userData['email'], userData['pword'])
            .then(crud => {
                loginForm.reset();
                document.getElementById("login").style.display = 'none';
            })
            .catch(err => {
                if (err['code'] == 'auth/wrong-password') document.getElementById('Pword').innerHTML = err['message'];
                else if (err['code'] == 'auth/user-not-found') document.getElementById('Email').innerHTML = err['message'];
            })
    };

})

// logout
function logout() {
    auth.signOut();
    setTimeout(() => location.reload(),)
}

//create guild
const guildForm = document.querySelector('#guild form');
guildForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const user = currentUser;
    db.collection('guilds').add({ user, title, content })
        .then(() => {
            guildForm.reset();
            document.getElementById('guild').style.display = 'none';
        })

})

//show Account
async function showAcc() {

    const data = await db.collection('users').doc(uid);
    const doc = await data.get();
    const user = doc.data();
    const accElem = document.querySelector('#acc #root');
    const myCol = accElem.children;
    // { 0: header, 1: img, 2: p#birth, 3: p#city, 4: footer, length: 5, … }

    // Object { user: "19it478", url: "https://firebasestorage.googleapis.com/v0/b/node-express-fir…ar1.png?alt=media&token=02e15928-7f1a-44d0-9ddc-7ba7c433ae88", birth: "2021-07-04", city: "kandy" }
    myCol[0].innerHTML = user['user'];
    myCol[1].src = user['url'];
    myCol[2].innerHTML = user['birth'];
    myCol[3].innerHTML = user['city'];
}

