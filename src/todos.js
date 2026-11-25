const express = require('express');

const router = express.Router();

// The todos are kept in memory, so they reset every time the server restarts.
// Each todo looks like this: { id: 1, title: 'Read the README', done: true }
let todos = [
  { id: 1, title: 'Read the README', done: true },
  { id: 2, title: 'Build the todo API', done: false },
];
let nextId = 3;

// =====================================================================
// PART 1: build these (see "Part 1: Build the API" in README.md)
// =====================================================================

// GET /todos: list all todos.
// This one is done for you, as an example.
router.get('/', (req, res) => {
  res.json(todos);
});

// POST /todos: create a todo.
// TODO: see "1. Create a todo" in README.md
router.post('/', (req, res) => {
  
  const title = req.body.title;

  // Check 1: is the title missing or not text?
  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be text'});
  }

  // Check 2: remove spaces from the start and end
  const cleanTitle = title.trim();

  // Check 3: Is anything left after removing the spaces?
  if (cleanTitle === '') {
    return res.status(400).json({ error: 'Title cannot be empty'});
  }

  // Build the new todo object.
  const newTodo = {
    id: nextId,
    title: cleanTitle,
    done: false,
  };

  // Add 1 so the next todo has a different ID
  nextId = nextId + 1;

  // Add the new todo to the end of the list
  todos.push(newTodo);

  // Send 201 "Created" and the new todo.
  res.status(201).json(newTodo);

});

// PATCH /todos/:id: change a todo's title and/or mark it done.
// TODO: see "2. Update a todo" in README.md
router.patch('/:id', (req, res) => {

  // Turn the id from text into a number.
  const id = Number(req.params.id);

  // Find the todo itself (not its position).
  const todo = todos.find((t) => t.id === id);

  // Not found: send 404 and stop.
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // If no body was sent at all, use an empty object so we don't crash.
  const body = req.body || {};

  // Read the two fields that might have been sent.
  const title = body.title;
  const done = body.done;

  // My decision: if neither title nor done was sent, that's a bad request.
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Send a title or done to update' });
  }

  // If a title was sent, it must be text and not empty.
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must be non-empty text' });
    }
  }

  // If done was sent, it must be true or false.
  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be true or false' });
    }
  }

  // All checks passed. Now change only what was sent.
  if (title !== undefined) {
    todo.title = title.trim();
  }
  if (done !== undefined) {
    todo.done = done;
  }

  // Send 200 and the updated todo.
  res.json(todo);
});



// DELETE /todos/:id: delete a todo.
// TODO: see "3. Delete a todo" in README.md
router.delete('/:id', (req, res) => {

  // Turn the id from text ("1") into a number (1).
  const id = Number(req.params.id);

  // Find the position of the todo. -1 means not found.
  const index = todos.findIndex((t) => t.id === id);

  // Not found: send 404 and stop.
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Remove 1 item at that position.
  todos.splice(index, 1);

  // 204: it worked, nothing to send back.
  res.status(204).send();
});



// =====================================================================
// PART 2: review this (see "Part 2: Review the AI's code" in README.md)
//
// We asked an AI assistant:
//   "Add an endpoint that returns one todo by its id, and an endpoint that
//    returns stats: how many todos there are, how many are done, and the
//    percentage that are done."
//
// This is the code it wrote. It looks reasonable, but it has at least
// three bugs. Find them, fix them, and describe each one in your notes.
// =====================================================================


// GET /todos/stats: count the todos
router.get('/stats', (req, res) => {
  const done = todos.filter((t) => t.done).length;
  res.json({
    total: todos.length,
    done: done,
    percentDone: todos.length === 0 ? 0 : Math.round((done / todos.length) * 100),
  });
});

// GET /todos/:id: get one todo
router.get('/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json({ id: todo.id, title: todo.title, done: todo.done });
});


module.exports = router;
