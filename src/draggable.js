function dragInit() {
    const dragElements = document.querySelectorAll('.draggable')
    const cards = document.querySelectorAll('.card')
    console.log("IT HAPPENED!!")
    dragElements.forEach(drag => {
      drag.addEventListener('dragstart', () => {
        drag.classList.add('dragging')
        if(!drag.classList.contains('searchResult'))
        {
            console.log("YEOO")
            drag.background.style.background = ""
        }
      })

      drag.addEventListener('dragend', () => {
        drag.classList.remove('dragging')
      })
    })
    cards.forEach(card => {
      card.addEventListener('dragover', e => {
        e.preventDefault()
      })
    })
    cards.forEach(card => {
      card.addEventListener("drop", e => {
        e.preventDefault()
        console.log("Happening333!!!")
        const draggable = document.querySelector('.dragging')
        //card.style["background-image"] = draggable.style["background-image"]
        console.log(e.target);
        console.log(draggable.style)
        e.target.style.background = draggable.style.backgroundImage;
      })
    })
  }

module.exports = {
    dragInit
}