function uploadFile(file) {
  // get file input element
  const input = document.getElementById("fileInput");

  // add file to FormData object -> check multipart form data
  const fd = new FormData();
  // adding file to formdata
  fd.append("file", input.files[0]);

  // send `POST` request API call -> check fetch API and  javascript promise
  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: fd,
  })
    // converting fetch response to json -> check json
    .then((res) => res.json())
    .then((json) => {
      getAllFiles();
    })
    .catch((err) => console.error(err));
}

function getAllFiles() {
  // all the files will be added inside div element with id fileList
  const filesListElement = document.getElementById("filesList");
  // get all text elements inside div with id filesList
  const textElements = filesListElement.getElementsByClassName("uploaded_assets");
  // remove all elements already present
  Array.from(textElements).forEach((el) => filesListElement.removeChild(el));
  // get files in server
  fetch("http://localhost:3000/files", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((json) => {
      json.data.forEach((d) => {
        // creating a text element
        const textElement = document.createElement("div");
        textElement.classList.add("uploaded_assets");
        textElement.onclick = () => {
          window.open("/view.html?url="+"http://localhost:3000/files/" + d);
        };
        textElement.innerText = d;
        // adding to parent
        filesListElement.appendChild(textElement);
      });
    })
    .catch((err) => console.error(err));
}

window.addEventListener("load", () => {
  getAllFiles();
});

