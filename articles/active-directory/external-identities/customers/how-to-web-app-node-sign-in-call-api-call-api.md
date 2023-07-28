---
title: Sign in users and call an API in a Node.js web application - call an API
description: Learn how to call a protected API in your own Node.js web application.
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

# Sign in users and call an API in a Node.js web application - call an API

In this article, you learn how to call the ASP.NET API from your Node.js client web app using the access token you've acquired in [Acquire access token](how-to-web-app-node-sign-in-call-api-sign-in-acquire-access-token.md#acquire-access-token).

You add code in *routes/todos.js*, *controller/todolistController.js* and  *fetch.js* files to show how the app uses the access token to call an API. 


## Update code

1. In your code editor, open *routes/todos.js* file, then add the following code:

    ```javascript
        const express = require('express');
        const router = express.Router();
        
        const toDoListController = require('../controller/todolistController');
        const authProvider = require('../auth/AuthProvider');
        const { protectedResources } = require('../authConfig');
        
        // custom middleware to check auth state
        function isAuthenticated(req, res, next) {
            if (!req.session.isAuthenticated) {
                return res.redirect('/auth/signin'); // redirect to sign-in route
            }
        
            next();
        }        
        // isAuthenticated checks if user is authenticated
        router.get('/',isAuthenticated, authProvider.getToken(protectedResources.toDoListAPI.scopes.read),toDoListController.getToDos);
        
        router.delete('/', isAuthenticated,authProvider.getToken(protectedResources.toDoListAPI.scopes.write),toDoListController.deleteToDo);
        
        router.post('/',isAuthenticated,authProvider.getToken(protectedResources.toDoListAPI.scopes.write),toDoListController.postToDo);
        
        module.exports = router;
    ```

    This file contains express routes for create, read and delete resource in the protected API. Each route uses three middleware functions, which execute in that sequence: 

    - `isAuthenticated`, checks whether the user is authenticated.
    
    - `getToken` requests an access token. You defined this function earlier in [Acquire access token](how-to-web-app-node-sign-in-call-api-sign-in-acquire-access-token.md#acquire-access-token). For example, the create resource route (POST request) requests an access token with read and write permissions.
    
    - Finally, the `postToDo` or `deleteToDo` `getToDos` methods handles the actual logic for manipulating the resource. These functions are defined in *controller/todolistController.js* file.

1. In your code editor, open *controller/todolistController.js* file, then add the following code:

    ```javascript
        const { callEndpointWithToken } = require('../fetch');
        const { protectedResources } = require('../authConfig');
        
        exports.getToDos = async (req, res, next) => {
            try {
                const todoResponse = await callEndpointWithToken(
                    protectedResources.toDoListAPI.endpoint,
                    req.session.accessToken,
                    'GET'
                );
                res.render('todos', { isAuthenticated: req.session.isAuthenticated, todos: todoResponse.data });
            } catch (error) {
                next(error);
            }
        };
        
        exports.postToDo = async (req, res, next) => {
            try {
                if (!!req.body.description) {
                    let todoItem = {
                        description: req.body.description,
                    };
        
                    await callEndpointWithToken(
                        protectedResources.toDoListAPI.endpoint,
                        req.session.accessToken,
                        'POST',
                        todoItem
                    );
                    res.redirect('todos');
                } else {
                    throw { error: 'empty request' };
                }
            } catch (error) {
                next(error);
            }
        };
        
        exports.deleteToDo = async (req, res, next) => {
            try {
                await callEndpointWithToken(
                    protectedResources.toDoListAPI.endpoint,
                    req.session.accessToken,
                    'DELETE',
                    req.body._id
                );
                res.redirect('todos');
            } catch (error) {
                next(error);
            }
        };
    ```

    Each of these functions collects all the information required to call an API. It then delegates the work to the `callEndpointWithToken` function and waits for a response. The `callEndpointWithToken` function is defined in the *fetch.js* file. For example, to create a resource in the API, the `postToDo` function passes an endpoint, an access token, an HTTP method and a request body to the `callEndpointWithToken` function and waits for a response. It then redirects the user to the *todo.hbs* view to show all tasks. 

 1. In your code editor, open *fetch.js* file, then add the following code:
 
    ```javascript
        const axios = require('axios');
        
        /**
         * Makes an Authorization "Bearer" request with the given accessToken to the given endpoint.
         * @param endpoint
         * @param accessToken
         * @param method
         */
        const callEndpointWithToken = async (endpoint, accessToken, method, data = null) => {
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
        
            switch (method) {
                case 'GET':
                    return await axios.get(endpoint, options);
                case 'POST':
                    return await axios.post(endpoint, data, options);
                case 'DELETE':
                    return await axios.delete(endpoint + `/${data}`, options);
                default:
                    return null;
            }
        };
        
        module.exports = {
            callEndpointWithToken,
        };
    ```

    This function makes the actual API call. It makes any HTTP request as long as you specify the HTTP method.

    Notice how you include the access token as a bearer token in the HTTP request header:
    
    ```javascript
        //...        
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }        
        //...
    ```

## Finalize your web app

1. In your code editor, open *app.js* file, then add the code from [app.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/2-Authorization/4-call-api-express/App/app.js) to it.

1. In your code editor, open *server.js* file, then add the code from [server.js](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/blob/main/2-Authorization/4-call-api-express/App/server.js) to it.

1. In your code editor, open *package.json* file, then update the `scripts` property to:
    
    ```json
      "scripts": {
        "start": "node server.js"
      }
    ```
    
## Run and test web app and API

At this point, you're ready to test your client web app and web API. 

1. Use the steps you learned in [Secure an ASP.NET web API](./tutorial-protect-web-api-dotnet-core-build-app.md) article to start your web API. Your web API is now ready to serve client requests.

1. In your terminal, make sure you're in the project folder that contains your client web app such as `ciam-sign-in-call-api-node-express-web-app`, then run the following command:

    ```console
    npm start
    ```
    Your client web app starts.

1. Use the steps in [Run and test sample web app and API](how-to-web-app-node-sample-sign-in-call-api.md#run-and-test-sample-web-app-and-api) to demonstrate how the client app calls the web API.

## Next steps

You may want to:

- [Customize the default branding](how-to-customize-branding-customers.md)

- [Configure sign-in with Google](how-to-google-federation-customers.md)

- [Sign in users in your own Node.js web application](tutorial-web-app-node-sign-in-prepare-tenant.md)
