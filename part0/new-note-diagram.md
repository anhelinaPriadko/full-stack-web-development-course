sequenceDiagram
    participant browser
    participant server

    Note right of browser: The use types a note and clicks Save to submit HTML form

    browser->>server: POST 
    https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of the server: The server adds the new note and responds with an HTTP 302 redirect
    server-->>browser: HTTP 302 redirect to /exampleapp/notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "1111",
        "date": "2026-09-25T19:04:11.609Z" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes

