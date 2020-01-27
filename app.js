class App {
  constructor() {
    this.notes=JSON.parse(localStorage.getItem('notes'))||[];
    this.id='';

    this.$notes=document.querySelector('#notes');
    this.$placeholder=document.querySelector('#placeholder');
    this.$form=document.querySelector('#form');
    this.$noteTitle=document.querySelector('#note-title');
    this.$noteText=document.querySelector('#note-text');
    this.$formButtons=document.querySelector('#form-buttons');
    this.$formCloseButton=document.querySelector('#form-close-button');
    this.$modal=document.querySelector('.modal');
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton=document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector('#color-tooltip');
    this.displayNotes();
    this.addEventListeners();
  }
  addEventListeners(){
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
      if(event.target.matches('.toolbar-delete')) this.deleteNote(event);
      else if(event.target.closest('.note')) this.openModal(event);
    });
    document.body.addEventListener('mouseover', event=>{
      this.openTooltip(event);
    });
    document.body.addEventListener('mouseout', event=>{
      this.closeTooltip(event);
    });
    this.$colorTooltip.addEventListener('mouseover', function() {
      this.style.display = 'flex';
    });
    this.$colorTooltip.addEventListener('click', event=>{
      const color = event.target.dataset.color;
       if (color) {
         this.editNoteColor(this.id, color);
       }
    });

    this.$colorTooltip.addEventListener('mouseout', function() {
       this.style.display = 'none';
    })

    this.$form.addEventListener('submit', event => {
      event.preventDefault();
      this.tryAddNote();
    });
    this.$formCloseButton.addEventListener('click', event => {
       event.stopPropagation();
       this.closeForm();
    });
    this.$modalCloseButton.addEventListener('click', event => {
      this.closeModal();
    });
  }


  handleFormClick(event){
    if(this.$form.contains(event.target)) this.openForm();
    else this.tryAddNote();
  }
  openForm(){
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display='block';
    this.$formButtons.style.display='block';
  }
  closeForm(){
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display='none';
    this.$formButtons.style.display='none';
    this.$noteTitle.value='';
    this.$noteText.value='';
  }

  openTooltip(event){
    if(!event.target.matches('.toolbar-color')) return;
    this.id = event.target.closest('.note').dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY;
    this.$colorTooltip.style.transform =
    `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';
  }
  closeTooltip(event){
    if(!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';
  }

  closeModal(){
    this.$modal.classList.toggle('open-modal');
    this.editNote(this.id);
  }
  openModal(event){
    this.id=this.selectNote(event);
    this.$modal.classList.toggle('open-modal');
  }

  editNote(id){
    let index = this.notes.findIndex(note=>note.id== id);
    this.notes[index].title = this.$modalTitle.value;
    this.notes[index].text = this.$modalText.value;
    this.displayNotes();
  }
  selectNote(event){
    const $selectedNote = event.target.closest('.note');
    const [$noteTitle,$noteText]=$selectedNote.children;
    this.$modalTitle.value=$noteTitle.innerText,
    this.$modalText.value=$noteText.innerText;
    return $selectedNote.dataset.id;
  }
  editNoteColor(id, color){
    let index = this.notes.findIndex(note=>note.id== id);
    this.notes[index].color = color;
    this.displayNotes();
  }

  hasNote(){
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    if (title||text) return {title,text};
    return null;
  }
  addNote(note){
    const newNote = {
      title: note.title,
      text: note.text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes = [...this.notes, newNote];
    this.displayNotes();
  }
  tryAddNote(){
    const note = this.hasNote();
    if (note) this.addNote(note);
    this.closeForm();
  }
  deleteNote(event){
    this.id=this.selectNote(event);
    this.notes = this.notes.filter(note=>note.id!=this.id);
    this.displayNotes();
  }

  saveNotes(){
    localStorage.setItem('notes',JSON.stringify(this.notes));
  }

  displayNotes(){
    this.saveNotes();
    this.$placeholder.style.display=this.notes.length?'none':'flex';
    this.$notes.innerHTML = this.notes.map(note=> `
      <div style="background: ${note.color};" class="note" data-id="${note.id}">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" src="https://icon.now.sh/palette">
            <img class="toolbar-delete" src="https://icon.now.sh/delete">
          </div>
        </div>
      </div>
    `).join('');
  }
}

new App();
