

const setupUI = docs => {

    docs.forEach(doc => {
        const guild = doc.data();
        let mydiv = document.createElement('div');
        mydiv.className = 'w3-card-4 w3-margin w3-padding';
        let myh3 = document.createElement('h3');
        myh3.innerHTML = guild['title'];
        mydiv.appendChild(myh3);
        let myp = document.createElement('p');
        myp.innerHTML = guild['content'];
        let myd = document.createElement("div");
        myd.className = 'w3-wide';
        myd.style.fontWeight = '900';
        myd.innerHTML = `by:${guild['user']}`;
        myp.appendChild(myd);
        mydiv.appendChild(myp);
        document.getElementById('root').appendChild(mydiv);
    })
}

