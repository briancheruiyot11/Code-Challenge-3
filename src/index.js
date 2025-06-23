const API_URL = "http://localhost:3000/post";

// DOM elements
const postList = document.getElementById("post-list");
const postDisplay = document.getElementById("post-display");
const postForm = document.getElementById("post-form");
const addBtn = document.getElementById("add-post-btn");
const singlePostView = document.getElementById("single-post-view");
const cancelBtn = document.getElementById("cancel-edit-btn");

// Form fields
const idField = document.getElementById("post-id");
const titleField = document.getElementById("title");
const descField = document.getElementById("description");
const imageField = document.getElementById("image");
const authorField = document.getElementById("author"); 

let editingElement = null;

// Display all posts
function displayPosts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      renderPostList([...posts].reverse());
      renderPosts([...posts].reverse());
      const spotlightPost = posts.find(p => p.id === "0e50") || posts[0];
      renderSinglePost(spotlightPost);
    });
}

// Render posts in main area
function renderPosts(posts) {
  postDisplay.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.id = `post-${post.id}`;

    div.innerHTML = `
      <h2>${post.title}</h2>
      ${post.author ? `<p><strong>Author:</strong> ${post.author}</p>` : ""}
      ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
      <p>${post.description}</p>
      <button class="edit-btn" onclick="editPost('${post.id}')">
        <i class="bi bi-pencil-square"></i> Edit
      </button>
      <button class="delete-btn" onclick="deletePost('${post.id}')">
        <i class="bi bi-trash"></i> Delete
      </button>
    `;
    postDisplay.appendChild(div);
  });
}

// Render featured post
function renderSinglePost(post) {
  if (!post) {
    singlePostView.innerHTML = "<p>No featured post found.</p>";
    return;
  }

  singlePostView.innerHTML = `
    <h3>${post.title}</h3>
    ${post.author ? `<p><strong>Author:</strong> ${post.author}</p>` : ""}
    ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
    <p>${post.description}</p>
  `;
}

// Render post list on the right
function renderPostList(posts) {
  postList.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-preview";

    const shortDesc = post.description.length > 60
      ? post.description.substring(0, 60) + "..."
      : post.description;

    div.innerHTML = `
      <strong>${post.title}</strong>
      <small>${shortDesc}</small>
    `;
    div.onclick = () => handlePostClick(post.title); 
    postList.appendChild(div);
  });
}

// Scroll to post
function handlePostClick(title) {
  const postElements = document.querySelectorAll(".post");
  postElements.forEach(post => {
    if (post.querySelector("h2")?.textContent === title) {
      post.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Edit post
window.editPost = function (id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      idField.value = post.id;
      titleField.value = post.title;
      descField.value = post.description;
      imageField.value = post.image;
      authorField.value = post.author || "";

      editingElement = document.getElementById(`post-${id}`);
      editingElement.innerHTML = "";
      editingElement.appendChild(postForm);
      postForm.classList.remove("hidden");
    });
};

// Delete post
window.deletePost = function (id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => displayPosts());
};

// Add post button
addBtn.addEventListener("click", () => {
  postForm.reset();
  idField.value = "";
  postDisplay.insertBefore(postForm, postDisplay.firstChild);
  postForm.classList.remove("hidden");
});

// Cancel edit
cancelBtn.addEventListener("click", () => {
  postForm.classList.add("hidden");
  displayPosts();
});

// Form submit listener
function addNewPostListener() {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const post = {
      title: titleField.value,
      description: descField.value,
      image: imageField.value,
      author: authorField.value 
    };

    const id = idField.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    }).then(() => {
      postForm.classList.add("hidden");
      displayPosts();
    });
  });
}

// main
function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);
