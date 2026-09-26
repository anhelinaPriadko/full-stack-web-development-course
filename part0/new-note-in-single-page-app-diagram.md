sequenceDiagram
    participant browser
    participant server

    Note right of browser: The user types a note and clicks Save to submit HTML form

    Note right of browser: JavaScript intercepts the form submit event (e.preventDefault()), adds the note to the local list, and immediately re-renders the notes list on the DOM

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created {"message": "note created"}
    deactivate server

    Note right of browser: The browser remains on the same page with no redirects or page reloads