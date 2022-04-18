document.addEventListener("DOMContentLoaded",()=>{
  getQuotes()
  addQuote()
})

function getQuotes(){
  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(data => {
    renderQuotes(data)
  })
}
function getLikes(id,span){
  fetch(`http://localhost:3000/likes?quoteId=${id}`)
  .then(res => res.json())
  .then(data => {
   span.innerText = data.length
  })
}

function renderQuotes(quotesArray){
  const ul = document.querySelector("#quote-list") 
  ul.innerHTML = ""
  quotesArray.forEach(quote => {
    const li = document.createElement("li")
    const blockQuote = document.createElement("blockquote") 
    const p = document.createElement("p")
    const footer = document.createElement("footer")
    const likBtn = document.createElement("button")
    const deleteBtn = document.createElement("button")
    const likeSpan = document.createElement("span")
    const br = document.createElement("br")

    li.className = "quote-card"
    blockQuote.className = "blockquote"
    p.className = "mb-0"
    footer.className = "blockquote-footer"
    likBtn.className = "btn-success"
    deleteBtn.className = "btn-danger"

    deleteBtn.setAttribute("data-index", `${quote.id}`)
    likBtn.setAttribute("data-index", `${quote.id}`)

    p.innerText = quote.quote
    footer.innerText = quote.author
    likBtn.innerText = "Likes:"
    deleteBtn.innerText = "Delete"
    getLikes(quote.id,likeSpan)

    likBtn.appendChild(likeSpan)
    blockQuote.append(p,footer,br,likBtn,deleteBtn)
    li.appendChild(blockQuote)
    ul.appendChild(li)

    deleteBtn.addEventListener("click",deleteQuote)
    likBtn.addEventListener("click",likeQuote)
  });
}
//delete quote button
function deleteQuote(event){
  const id = event.target.dataset.index
  fetch(`http://localhost:3000/quotes/${id}`,{
    method:"DELETE"
  })
  .then(res => res.json())
  .then(data => {
    getQuotes()
  }) 
}

function likeQuote(event){
  const id = event.target.dataset.index
  const dataObj = {
    quoteId: Number(id),
    createdAt:Date.now()
  }
  fetch("http://localhost:3000/likes",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      accept: "application/json"
    },
    body:JSON.stringify(dataObj)
  })
  .then(res => res.json())
  .then(data => {
    getQuotes()
  })

}
function addQuote(){
  const form = document.querySelector("#new-quote-form")
  const newQuote = form.querySelector("#new-quote")
  const author = form.querySelector("#author")
  form.addEventListener("submit",(event)=>{
    event.preventDefault()
    const dataObj = {
      quote: newQuote.value,
      author:author.value
    }
    fetch("http://localhost:3000/quotes",{
      method:"POST",
      headers:{
        "content-type":"application/json",
        accept:"application/json"
      },
      body:JSON.stringify(dataObj)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      getQuotes()
    })
  form.reset()
  })
}