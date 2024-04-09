import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCruqX-lLFcUT13wJYJANeSESXEsd-7XaQ",
    authDomain: "bookmark-be408.firebaseapp.com",
    projectId: "bookmark-be408",
    storageBucket: "bookmark-be408.appspot.com",
    messagingSenderId: "5584676818",
    appId: "1:5584676818:web:ea9fe8bc706eae4be54a0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore()
const colRef = collection(db, "bookmarks")

function deleteEvent() {
    const deleteButton = document.querySelectorAll('i.delete')
    deleteButton.forEach(button => {
        button.addEventListener('click', event => {
            const docRef = doc(db, "bookmarks", button.dataset.id)
            deleteDoc(docRef).then(() => {
                button.parentElement.parentElement.parentElement.remove()
            })
        })
    })
}

const cards = document.querySelector('.cards')

function showCard() {
    cards.innerHTML = ""
    getDocs(colRef).then(data => {
        data.docs.forEach(document => {
            const item = document.data()
            cards.innerHTML += generateTemplates(document.data(), document.id)
            deleteEvent()
        })
    }).catch(e => {
        console.log(e);
    })
}

showCard()

function generateTemplates(response, id) {
    return `<div class="card">
                <p class="title">${response.title}</p>
                <div class="sub-information">
                    <p>
                        <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                    </p>
                    <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                    <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                    <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                </div>
            </div>`
}

const addForm = document.querySelector('.add')
addForm.addEventListener('submit', event => {
    event.preventDefault()
    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp(),
    }).then(() => {
        addForm.reset()
        showCard()
    })
})

const categoryList = document.querySelector('.category-list')
const categorySpan = document.querySelectorAll('.category-list span')
categoryList.addEventListener('click', event => {
    categorySpan.forEach(span => span.classList.remove("active"));
    if (event.target.innerText.toLowerCase() === 'all') {
        showCard()
        event.target.classList.add('active')

    } else {
        if (event.target.tagName == 'SPAN') {
            const qRef = query(colRef, where("category", "==", event.target.innerText.toLowerCase()))
            cards.innerHTML = ""
            getDocs(qRef).then(data => {
                data.docs.forEach(document => {
                    const item = document.data()
                    cards.innerHTML += generateTemplates(document.data(), document.id)
                    deleteEvent()
                })
            }).catch(e => {
                console.log(e);
            })
        }
        event.target.classList.add('active')
    }
})
