import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

const uploadForm = document.querySelector("#uploadForm");
const titleInput = document.querySelector("#titleInput");
const displaySection = document.querySelector(".displaySection");
const userName = document.querySelector(" #userFullName");

let userProfilePicUrl = "";

// Cloudinary Upload Widget
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dllgkzvz8',
    uploadPreset: 'sufiyan'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Image uploaded:', result.info);
        userProfilePicUrl = result.info.secure_url;
    }
});

document.getElementById("upload_widget").addEventListener("click", function (event) {
    event.preventDefault();
    myWidget.open();
}, false);

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDataFromFirestore();
    } else {
        // window.location = "login.html"
    }
});

async function getDataFromFirestore() {
    // Clear previous data
    const allTodo = [];
    let userProfileImage = "";
    let userFullName = "";

    // Fetch user details
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userProfileImage = userData.profileImage; // Store profile image
        userFullName = userData.fullName; // Store full name
    });

    // Fetch user blogs
    const p = query(collection(db, "blogs"), where("uid", "==", auth.currentUser.uid));
    const postSnapshot = await getDocs(p);
    postSnapshot.forEach((doc) => {
        allTodo.push({
            ...doc.data(),
            docid: doc.id,
            profileImage: userProfileImage, // Use stored profile image
            fullName: userFullName, // Use stored full name
        });
    });
    userName.innerHTML = `<div class="card1 shadow-sm mb-3 p-3">
            <div class="d-flex align-items-center">
                <img src="${userProfileImage}" alt="User Image" class="rounded-circle me-2" width="40px" height="40px">
                <h5 class="m-0">${userFullName}</h5>
            </div></div>`;

    displaySection.innerHTML = allTodo.map(item => `
        <div class="card shadow-sm mb-3 p-3">
            <div class="d-flex align-items-center">
                <img src="${item.profileImage}" alt="User Image" class="rounded-circle me-2" width="40px" height="40px">
                <h5 class="m-0">${item.fullName}</h5>
            </div>
            <hr>
            <div>
                <h5 class="m-0">${item.title}</h5></br>
                ${item.postImage ? `<img src="${item.postImage}" alt="Post Image" class="img-fluid rounded" width="100%">` : ''}
            </div>

            <div class="post-interactions mt-2">
                <button class="like-btn" data-id="${item.docid}">
                    <i class="fas fa-thumbs-up"></i> Like (${item.likeCount || 0})
                </button>
                <button class="comment-btn" data-id="${item.docid}">
                    <i class="fas fa-comment"></i> Comment (${item.commentCount || 0})
                </button>
                <button class="share-btn" data-id="${item.docid}">
                    <i class="fas fa-share-alt"></i> Share (${item.shareCount || 0})
                </button>
            </div>
        </div>
    `
).join('');
}


 
// Event delegation for handling button clicks
displaySection.addEventListener('click', async (event) => {
    const docId = event.target.dataset.id;

    if (event.target.classList.contains('like-btn')) {
        await updatePostCount(docId, 'likeCount');
    } else if (event.target.classList.contains('comment-btn')) {
        await updatePostCount(docId, 'commentCount');
    } else if (event.target.classList.contains('share-btn')) {
        await updatePostCount(docId, 'shareCount');
    }
});

// Function to update the count in Firestore
async function updatePostCount(docId, field) {
    const postRef = doc(db, "blogs", docId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
        const currentCount = postDoc.data()[field] || 0;
        await updateDoc(postRef, {
            [field]: currentCount + 1
        });

        // Re-fetch the updated data
        getDataFromFirestore();  
    }
}

// Handle Form Submission
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
            title: titleInput.value,
            postImage: userProfilePicUrl,
            uid: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            likeCount: 0, 
            commentCount: 0, 
            shareCount: 0 
        });

        console.log("Document added with ID:", docRef.id);
        titleInput.value = ""; 
    } catch (error) {
        console.error("Error adding document:", error);
    }
});
