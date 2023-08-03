---
title: Sign in users and call an API a Node.js web application - prepare client app and API
description: Learn about how to prepare your Node.js client web app and ASP.NET web API. The app you here prepare is what you configure later to sign in users, then call an API.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer, devx-track-js
---

# Sign in users and call an API a Node.js web application - prepare client app and API

In this article, you create app projects for both the client web app and web API. Later, you add authentication and authorization to this app. You create app projects for an ASP.NET web API and a Node.js web app client. 

## Prerequisite 

- Install [.NET SDK](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install) v7 or later in your computer.

##  Build ASP.NET web API

You must first create a protected web API, which the client web calls by presenting a valid token. To do so, complete the steps in [Secure an ASP.NET web API](./tutorial-protect-web-api-dotnet-core-build-app.md) article. In this article, you learn how to create and protect ASP.NET API endpoints, and run and test the API. 

Before you proceed to this article, make sure you've [registered a web API app in Microsoft Entra admin center](how-to-web-app-node-sign-in-call-api-prepare-tenant.md#register-a-web-application-and-a-web-api).  


## Prepare Node.js client web app

In this step, you prepare the Node.js client web app that calls the ASP.NET web API.

### Create the Node.js project

Create a folder to host your node application, such as `ciam-sign-in-call-api-node-express-web-app`:

1. In your terminal, change directory into your Node web app folder, such as `cd ciam-sign-in-call-api-node-express-web-app`, then run `npm init -y`. This command creates a default package.json file for your Node.js project. This command creates a default `package.json` file for your Node.js project.

1. Create more folders and files to achieve the following project structure:

    ```
        ciam-sign-in-call-api-node-express-web-app/
        ├── server.js
        └── app.js
        └── authConfig.js
        └── fetch.js
        └── package.json
        └── auth/
            └── AuthProvider.js
        └── controller/
            └── authController.js
            └── todolistController.js
        └── routes/
            └── auth.js
            └── index.js
            └── todos.js
            └── users.js
        └── views/
            └── layouts.hbs
            └── error.hbs
            └── id.hbs
            └── index.hbs   
            └── todos.hbs 
        └── public/stylesheets/
            └── style.css
    ```

## Install app dependencies

In your terminal, install `axios`, `cookie-parser`, `dotenv`, `express`, `express-session`, `hbs`, `http-errors`, `morgan`, `body-parser`, `method-override` and `@azure/msal-node` packages by running the following commands:

```console
    npm install express dotenv hbs express-session axios cookie-parser http-errors body-parser morgan method-override @azure/msal-node   
```

### Build app UI components


1. In your code editor, open *views/index.hbs* file, then add the following code:

    ```html
        <h1>{{title}}</h1>
        {{#if isAuthenticated }}
        <p>Hi {{username}}!</p>
        <a href="/users/id">View your ID token claims</a>
        <br>
        <a href="/todos">View your todolist</a>
        <br>
        <a href="/auth/signout">Sign out</a>
        {{else}}
        <p>Welcome to {{title}}</p>
        <a href="/auth/signin">Sign in</a>
        {{/if}}
    ```
    In this view, if the user is authenticated, we show their username. We also show links  to allow the user to visit `/auth/signout`, `/todos` and `/users/id` endpoints, otherwise, user needs to visit the `/auth/signin` endpoint to sign in. We define the express routes for these endpoints later in this article.

1. In your code editor, open `views/id.hbs` file, then add the following code:

    ```html
        <h1>Azure AD</h1>
        <h3>ID Token</h3>
        <table>
            <tbody>
                {{#each idTokenClaims}}
                <tr>
                    <td>{{@key}}</td>
                    <td>{{this}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        <a href="/">Go back</a>
    ```
    We use this view to display ID token claims that Azure AD for customers returns to this app after a user successfully signs in.  

1. In your code editor, open *views/error.hbs* file, then add the following code:

    ```html
        <h1>{{message}}</h1>
        <h2>{{error.status}}</h2>
        <pre>{{error.stack}}</pre>
    ```

    We use this view to display any errors that occur when the app runs.

1. In your code editor, open *views/layout.hbs* file, then add the following code:

    ```html
        <!DOCTYPE html>
        <html>        
            <head>
                <title>{{title}}</title>
                <link rel='stylesheet' href='/stylesheets/style.css' />
            </head>            
            <body>
                {{{body}}}
            </body>        
        </html>
    ```
    The `layout.hbs` file is in the layout file. It contains the HTML code that we require throughout the application view. 

1. In your code editor, open *views/todos.hbs* file, then add the following code:

    ```html
        <h1>Todolist</h1>
        <div>
            <form action="/todos" method="POST">
                <input type="text" name="description" class="form-control" placeholder="Enter a task" aria-label="Enter a task"
                    aria-describedby="button-addon">
                <button type="submit" id="button-addon">Add</button>
            </form>
        </div>
        <div class="row" style="margin: 10px;">
            <ol id="todoListItems" class="list-group"> 
                {{#each todos}} 
                <li class="todoListItem" id="todoListItem">
                    <span>{{description}}</span>
                    <form action='/todos?_method=DELETE' method='POST'>
                        <span><input type='hidden' name='_id' value='{{id}}'></span>
                        <span><button type='submit'>Remove</button></span>
                    </form>
                </li> 
                {{/each}} 
            </ol>
        </div>
        <a href="/">Go back</a>
    ```

    This view allows the user to perform tasks that initiate an API call. For instance, after a user signs in, and the app acquires an access token, the user can create a resource (task) in the API app by submitting a form.

1. In your code editor, open *public/stylesheets/style.css*, file, then add the following code:

    ```css
        body {
          padding: 50px;
          font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
        }
        
        a {
          color: #00B7FF;
        }
    ```


## Next steps

Next, learn how to sign-in users and acquire an access token:

> [!div class="nextstepaction"]
> [Sign-in users and acquire an access token >](how-to-web-app-node-sign-in-call-api-sign-in-acquire-access-token.md)
