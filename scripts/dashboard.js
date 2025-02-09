
const uploadForm=document.querySelector("#uploadForm");
const titleInput=document.querySelector("#titleInput");
const imageInput=document.querySelector("#imageInput");
const displaySection=document.querySelector("#displaySection");

// uploadForm.addEventListener('submit', event => {
//     event.preventDefault();

//     let title = titleInput.value; // Get title input
//     let imageFile = imageInput.files[0]; // Get file input

//     // Validation: Require either title or image
//     if (!title && !imageFile) {
//         alert("Please enter a title or upload an image.");
//         return;
//     }

//     // Create the card structure
//     displaySection.innerHTML += `
//         <div class="card mt-3 shadow" style="width: 18rem;">
//             <div class="card-body">
//                 ${title ? `<h5 class="card-title">${title}</h5>` : ""}
//                 ${imageFile ? `<img src="${URL.createObjectURL(imageFile)}" class="img-fluid mt-2">` : ""}
//             </div>
//         </div>`;

//     // Reset the form after submission
//     // uploadForm.reset();
// });


// Load stored data when the page loads
window.addEventListener("load", () => {
    displayStoredData();
});

uploadForm.addEventListener("submit", event => {
    event.preventDefault();

    let title = titleInput.value;
    let imageFile = imageInput.files[0];

    // Validation: Require either title or image
    if (!title && !imageFile) {
        alert("Please enter a title or upload an image.");
        return;
    }

    let imageUrl = "";
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    // Get stored items from localStorage
    let storedItems = JSON.parse(localStorage.getItem("uploadedItems")) || [];

    // Add new item
    storedItems.push({ title, imageUrl });

    // Save back to localStorage
    localStorage.setItem("uploadedItems", JSON.stringify(storedItems));

    // Update UI
    displayStoredData();

    // Reset form
    uploadForm.reset();
});

// Function to display stored items
function displayStoredData() {
    let storedItems = JSON.parse(localStorage.getItem("uploadedItems")) || [];
    displaySection.innerHTML = ""; // Clear previous content

    storedItems.forEach(item => {
        displaySection.innerHTML += `
            <div class="card mt-3 shadow" style="width: 18rem;">
                <div class="card-body">
                    ${item.title ? `<h5 class="card-title">${item.title}</h5>` : ""}
                    ${item.imageUrl ? `<img src="${item.imageUrl}" class="img-fluid mt-2">` : ""}
                </div>
            </div>`;
    });
}
