

file name: routes/todos.js

examine the routes:
    method GET
    '/',
    isAuthenticated, // check if user is authenticated
    getToken(protectedResources.apiTodoList.scopes.read),
    todolistController.getTodos

if is authenticated, `getToken` for a given scope, the access token is place in a session; call methods defined in `todolistController` controller

in the method in `todolistController` cotroller such as `postTodo`:

- construct body; then call `callEndpointWithToken` defined in `fetch.js` file.

