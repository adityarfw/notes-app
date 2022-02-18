import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { data } from './data.js';
import Split from 'react-split';
import { nanoid } from 'nanoid';

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem('notes')) || []
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ''
  );

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  // Everytime a note is updated, it needs to go the top of the list.
  // When the setNotes is called, get the id of the note - done
  // Using that id find the index of that element
  // Remove that item from that array position using .splice
  // place it to the top of the array zeroth element by using .splice

  function updateNote(text) {
    setNotes((oldNotes) =>
      oldNotes.map((oldNote) => {
        return oldNote.id === currentNoteId
          ? { ...oldNote, body: text }
          : oldNote;
      })
    );
    let index = notes.findIndex((el) => {
      if (el.id === currentNoteId) {
        return true;
      }
    });
    moveUpdatedNote(index);
  }

  const moveUpdatedNote = (index) => {
    const moveNote = notes[index];
    notes.splice(index, 1); // Remove item from that index
    notes.splice(0, 0, moveNote); // Place the note in 0 index
    console.log(notes);
  };

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction='horizontal' className='split'>
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className='no-notes'>
          <h1>You have no notes</h1>
          <button className='first-note' onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
