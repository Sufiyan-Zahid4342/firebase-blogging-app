import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import {collection,query,where,getDocs} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import {auth,db } from "./firebaseconfig.js";


const loginBtn = document.querySelector('#login-btn')
const loginUser = document.querySelector('#login-user')
const userName = document.querySelector('#user-profile-name')
const userProfileImage = document.querySelector('#user-profile-img')
const defaultDiv = document.querySelector('.default');
const logoutBtn = document.querySelector('#logoutbtn');




onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore()
        console.log(users);
        loginBtn.classList.add('d-none')
        loginUser.classList.remove('d-none')

        userName.innerHTML = users.fullName

        userProfileImage.src = users.profileImage

    } else {
        window.location = "login.html"
    }
});

async function getDataFromFirestore() {
    let user = null
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user
}


defaultDiv.addEventListener('click', event => {
    event.preventDefault()
})


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
       window.location = "login.html"
    }).catch((error) => {
        alert(error)
    });

})