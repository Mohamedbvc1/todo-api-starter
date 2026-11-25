# Todo API: Take-Home Assignment

Thanks for applying to the Johnston's Grain software development apprenticeship! This assignment has two parts:

1. **Build** the back end of a small todo app with Node.js and Express.
2. **Review** some code an AI assistant wrote for the same app, then find and fix its bugs.

The web page is already built for you. When you start the app you'll see a todo list in your browser. Showing the list works already, but adding, editing, checking off and deleting todos don't work yet. Making them work is Part 1.

## Before you start

- **Time:** aim for about **3–4 hours**, and please don't spend more than 4. If you use AI tools it will probably take less. Spend any spare time making sure you understand your code, not on extras. Unfinished work is fine. Tell us in your notes what you'd do next.
- **Deadline:** one week after you received this (the exact date is in our email).
- **Questions:** if something is unclear, reply to the email we sent you this assignment in. Asking questions is a good thing, not a bad one.

## Using AI

**Using AI is encouraged.** Use ChatGPT, Claude, Copilot or any other tool, the same way you would on the job. Our developers use these tools every day, and reviewing and testing the code they produce is a big part of this role.

**The only rule: you must understand everything you submit.** In the interview you'll be asked to:

- explain any line of your `src/todos.js` without AI help,
- predict what a request will return before we send it,
- make a small change to your code live. You may use AI for this, but you'll explain what it suggests before you accept it.

Some tips:

- Ask the AI to explain its code, not just to write it.
- Test everything it gives you. AI tools make confident mistakes, and Part 2 is full of them.
- Keep track of what the AI got wrong or what you changed. You'll need it for your notes.

**Not using AI is completely fine too.** It won't count against you. If you'd like a free AI tool: GitHub Copilot is free for verified students through [GitHub Education](https://education.github.com/), and ChatGPT, Claude and Gemini all have free plans.

## Setup

1. Install **Node.js 20 or newer**. The "LTS" version from [nodejs.org](https://nodejs.org) is the right one. Check it worked by running `node --version` in a terminal.
2. Unzip the project somewhere easy to find, like your Documents folder. If you'd like to use Git, run `git init` in the project folder and commit as you go. That's optional, but a plus.
3. Open a terminal in the project folder and install the dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

   `npm run dev` restarts the server every time you save a file. (`npm start` runs it without restarting.) Keep an eye on this terminal: errors from the server show up here.

5. Open <http://localhost:3000> in your browser. You should see two todos. If you try to add one you'll see a red "not implemented yet" message. That's expected!

## What's in the project

```
public/            The web page (HTML, CSS, browser JavaScript). Already done.
src/server.js      Starts the server on port 3000.
src/app.js         Sets up Express: JSON bodies, the web page, the /todos routes, errors.
src/todos.js       The /todos routes. ← Both parts of the assignment happen in this file.
test/              A sample automated test. Run it with `npm test`.
```

You can change any file you like, but you shouldn't need to change the files in `public/`.

## Part 1: Build the API

Todos are stored in memory, in the `todos` array in `src/todos.js`. That means they reset every time the server restarts, and that's fine. A todo looks like this:

```json
{ "id": 1, "title": "Read the README", "done": true }
```

When a request has a problem, respond with a fitting status code and a JSON body in this shape:

```json
{ "error": "A short message explaining what went wrong" }
```

`GET /todos` is already done as an example. Implement these three:

| Request | When it works | When it doesn't |
| --- | --- | --- |
| `POST /todos` | `201` + the new todo | `400` if the title is bad |
| `PATCH /todos/:id` | `200` + the updated todo | `404` if the todo doesn't exist, `400` if the body is bad |
| `DELETE /todos/:id` | `204` (no body) | `404` if the todo doesn't exist |

### 1. Create a todo: `POST /todos`

The request body looks like `{ "title": "Buy milk" }`.

- Give the new todo a new, unique `id` and set `done` to `false`.
- Remove extra spaces from the start and end of the title.
- Respond with `201` and the new todo.
- Respond with `400` if `title` is missing, isn't a string, or is empty (or only spaces).

### 2. Update a todo: `PATCH /todos/:id`

The request body can contain `title`, `done`, or both, for example `{ "done": true }` or `{ "title": "Buy oat milk" }`.

- Only change the fields that were sent.
- Respond with `200` and the updated todo.
- Respond with `404` if there's no todo with that id.
- Respond with `400` if `title` is sent but is empty or not a string, or if `done` is sent but isn't `true` or `false`.
- What should happen if the body has neither `title` nor `done`? You decide, and explain your choice in your notes.

> **Hint:** `req.params.id` is always a string (like `"2"`), but the ids in the array are numbers.

### 3. Delete a todo: `DELETE /todos/:id`

- Remove the todo and respond with `204` and no body.
- Respond with `404` if there's no todo with that id.

## Part 2: Review the AI's code

At the bottom of `src/todos.js` there are two routes an AI assistant wrote for us. This is what they're **supposed** to do:

| Request | Should respond with |
| --- | --- |
| `GET /todos/:id` | `200` + that todo, or `404` + an error body if there's no todo with that id |
| `GET /todos/stats` | `200` + `{ "total": 2, "done": 1, "percentDone": 50 }`, where `percentDone` is a whole number from 0 to 100 |

The code looks reasonable, but it has **at least three bugs**. Your job:

1. Find the bugs. Try the endpoints in your browser or with curl, try unusual situations, and watch the server terminal for errors.
2. Fix each one, and make the smallest change that fixes it.
3. In your notes, describe each bug: what was wrong, how you found it, and how you fixed it.

You can ask an AI to review the code too. Be careful, though: AI reviewers often miss real bugs and "fix" things that weren't broken. Test every fix yourself before you trust it.

## Testing your work

- **The web page:** the easiest way to test Part 1. Errors from your API show up in red.
- **The browser address bar:** works for any `GET` request, like <http://localhost:3000/todos/1> or <http://localhost:3000/todos/stats>.
- **curl:** on Windows, run these in **Git Bash** (PowerShell handles the quotes differently):

  ```bash
  curl http://localhost:3000/todos
  curl http://localhost:3000/todos/stats
  curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
  curl -X PATCH http://localhost:3000/todos/1 -H "Content-Type: application/json" -d '{"done":false}'
  curl -X DELETE http://localhost:3000/todos/1 -i
  ```

- **A REST client:** [Postman](https://www.postman.com/), or the Thunder Client or REST Client extensions for VS Code, if you prefer clicking to typing.
- **Automated tests:** `npm test` runs the tests in `test/`. There's one example. Writing more is optional (see below).

## Optional extras

Only try these once both parts are done. Extras don't make up for missing required work. We'd rather see the required parts done carefully.

- Write tests that would have caught the Part 2 bugs.
- Save the todos to a JSON file so they survive a server restart.
- Support `GET /todos?done=true` and `GET /todos?done=false` to filter the list.
- Improve the web page.

## Notes

### How far I got

Everything works. I read through the whole project, built the three
missing routes (POST, PATCH and DELETE), and fixed the four bugs in the
AI's code, with Claude's help. I tested each route in the browser,
including error cases like empty titles and missing todos.

### My decision: PATCH with no title or done

My API returns 400 and stops. An empty update is probably a mistake, so
it's better to tell the sender than to pretend it worked.

### Part 2: bugs I found

| Bug | How I found it | How I fixed it |
| --- | --- | --- |
| Stats: with no todos, 0 / 0 made percentDone null | Deleted every todo, then opened /todos/stats | Ternary: if there are no todos, use 0, otherwise do the division |
| Get one: req.params.id is a string, but ids are numbers, so nothing matched | Opened /todos/1 and got "Todo not found" | Number(req.params.id) |
| Get one: no return after the 404, so it kept going and crashed on todo.id | Opened /todos/99 and saw "Cannot read properties of undefined" in the terminal | Added return before the 404 |
| Route order: /:id was above /stats, so it caught "stats" as an id | Opened /todos/stats and got "Todo not found" | Moved /stats above /:id |

### How I used AI

I used Claude to walk me through the project, explain the code line by
line, help me write the routes, and find and fix the bugs. I didn't catch
the AI getting anything wrong, but I didn't accept any code until I could
explain it, and I tested everything myself. The middle of my chat has an
unrelated question about another project.


### My AI Chat

https://claude.ai/share/d89e2e29-c48b-4d1b-9087-fe00d539f299

https://claude.ai/share/7430cfd6-f58c-45b9-a650-9e3ef238b551

You may need to sign in to Claude to view them. I included chatgpt in case there's a problem with Claude Shared file.


### What I'd improve with more time

I'd add tests for my routes, and keep practising so I get better at
finding bugs.

### What I got stuck on

I'm still learning JavaScript, so some concepts took time to understand.
In POST I typed "Title" with a capital T, so new todos showed blank. The
Network tab showed the server was saving them, which led me to the typo.
JavaScript names are case-sensitive, unlike VB.NET.

### Time spent

About 4 to 5 hours. Some of that was learning how Express and JavaScript
work, so I could explain every line.
