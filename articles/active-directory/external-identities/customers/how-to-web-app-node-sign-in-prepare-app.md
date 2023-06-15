---
title: Sign in users in your own Node.js web application  - prepare your app
description: Learn about how to prepare an app that signs in users.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js web application  - prepare your app

In this article, you create a Node.js(Express) project and organize all the folders and files you require. You add authentication to the application you build here. This Node.js(Express) web application's views use [Handlebars](https://handlebarsjs.com).

## Create the Node.js project

Create a folder to host your node application, such as `ciam-sign-in-node-express-web-app`:

1. In your terminal, change directory into your Node web app folder, such as `cd ciam-sign-in-node-express-web-app`, then run `npm init -y`. This command creates a default package.json file for your Node.js project. This command creates a default `package.json` file for your Node.js project.

1. Create more folders and files to achieve the following project structure:

    ```
        ciam-sign-in-node-express-web-app/
        ├── server.js
        └── app.js
        └── authConfig.js
        └── package.json
        └── .env
        └── auth/
            └── AuthProvider.js
        └── controller/
            └── authController.js
        └── routes/
            └── auth.js
            └── index.js
            └── users.js
        └── views/
            └── layouts.hbs
            └── error.hbs
            └── id.hbs
            └── index.hbs   
        └── public/stylesheets/
            └── style.css
    ```

## Install app dependencies

In your terminal, install `axios`, `cookie-parser`, `dotenv`, `express`, `express-session`, `hbs`, `http-errors`, `morgan` and `@azure/msal-node` packages by running the following commands:

```console
    npm install express dotenv hbs express-session axios cookie-parser http-errors morgan @azure/msal-node   
```

## Build app UI components

1. In your code editor, open *views/index.hbs* file, then add the following code:

    ```html
        <h1>{{title}}</h1>
        {{#if isAuthenticated }}
        <p>Hi {{username}}!</p>
        <a href="/users/id">View ID token claims</a>
        <br>
        <a href="/auth/signout">Sign out</a>
        {{else}}
        <p>Welcome to {{title}}</p>
        <a href="/auth/signin">Sign in</a>
        {{/if}}
    ```
    In this view, if the user is authenticated, we show their username and links to visit `/auth/signout` and `/users/id` endpoints, otherwise, user needs to visit the `/auth/signin` endpoint to sign in. We define the express routes for these endpoints later in this article.

1. In your code editor, open *views/id.hbs* file, then add the following code:

    ```html
        <h1>Azure AD for customers</h1>
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

Next, learn how to sign user in and sign of your web app:

> [!div class="nextstepaction"]
> [Add sign in and sign out >](how-to-web-app-node-sign-in-sign-in-out.md)
