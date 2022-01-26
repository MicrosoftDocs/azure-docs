---
title: Call a Node web API protected by Azure AD B2C
description: Follow this article to learn how to call a web API protected by Azure AD B2C from a node js web app. A web app acquires an access token and uses it to call a protected endpoint. The web app adds the access token as a bearer in the Authorization header, and the web API needs to validate it. 
titleSuffix: Azure AD B2C
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Call a Node web API protected by Azure AD B2C from a web application

In this article, you'll learn how to use an access token issued by Azure Active Directory B2C (Azure AD B2C) to call a sample web API. The web API need to be protected by Azure AD B2C itself. In this setup, a web app, such as *webapp1* calls a web API, such as *webapi1*. Users authenticate into the web app to acquire an access token, which is then used to call a protected web API.

The following events are accomplished by the web app:
- It authenticates users with Azure AD B2C.
- It acquires an access token with the required permissions (scopes) for the web API endpoint.
- It passes the access token as a bearer token in the authentication header of the HTTP request. It uses the format:
```http
Authorization: Bearer <token>
```

The following events are accomplished by the web API:
- It reads the bearer token from the authorization header in the HTTP request.
- It validates the token.
- It validates the permissions (scopes) in the token.
- It responds to the HTTP request. If the token isn't valid, the web API endpoint responds with `401 Unauthorized` HTTP error.

## Prerequisites
- [Node.js](https://nodejs.org)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor
- Azure AD B2C tenant. If you haven't already created your own, follow the steps in [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) and record your tenant name.

## Register the web application in Azure portal
Register the web application in Azure portal so that Azure Active Directory B2C (Azure AD B2C) can provide authentication service for your application and its users.

First, complete the steps in [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md) to register the web app. 

Use the following settings for your app registration:
- Under **Name**: `webapp1` (suggested)
- Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
- Under **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box
- Immediately you generate a **Client secret**, record the value as advised as it's shown only once.

At this point, you've the web application (client) ID, and client secret, and you've set the app's redirect URI.

## Register the web API and configure scopes in Azure portal

Register the web API is Azure portal so that you can use Azure AD B2C to protect it. 

First, complete the steps in [Add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md) to [register the web API](), [configure API scopes](add-web-api-application.md#configure-scopes), and [grant API permissions to the web app](add-web-api-application.md#grant-permissions), *webapp1*.

Use the following settings for your registration:
- While you register the web API, under **Redirect URI**, select web, but you don't need to provide the value for the redirect URI.
- While you configure web API scopes, replace the default value (a GUID) with `tasks-api`. The full URI is should then be formatted as `https://your-tenant-name.onmicrosoft.com/tasks-api`. For **Scopes**, add `tasks.read` and `tasks.write` instead of `demo.read` and `demo.write`. These are the permissions you'll grant to your web app. 

## Create Sign in and sign up user flows in Azure portal
Complete the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a **Sign in and sign up**  user flow. Give your user flow a name such as `susi_node_app`.

At this point, you've a web app, which can request an access token with scopes `https://your-tenant-name.onmicrosoft.com/tasks-api/tasks.write` and `https://your-tenant-name.onmicrosoft.com/tasks-api/tasks.read`, and then use it to call a web API. 

## Create the web Node web application

Follow these steps to create a Node web app. This web app authenticates a user to acquire an access token that is used to call a sample Node web API: 

### Create the node project
Create a folder to hold your node application, such as  `call-protected-api`.

1. In your terminal, change directory into your node app folder, such as `cd call-protected-api`, and run `npm init -y`. This command creates a default package.json file for your Node.js project.
1. In your terminal, run `npm install express`. This command installs the Express framework.
1. Create more folders and files to achieve the following project structure:
    
    ```
    call-protected-api/
    ├── index.js
    └── package.json
    └── .env
    └── views/
        └── layouts/
            └── main.hbs
        └── signin.hbs
        └── api.hbs
    ```
        
    The `views` folder contains handlebars files for the web app's UI.

### Install the dependencies

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`, and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express-session
npm install @azure/msal-node
```

### Build web app UI components 

1. In the `main.hbs` file, add the following code:
    
    :::code language="html" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/views/layouts/main.hbs":::

     The `main.hbs` file is in the `layout` folder and it should contain any HTML code that is required throughout your application. It implements UI built with the Bootstrap 5 CSS Framework. Any UI that changes from page to page, such as `signin.hbs`, is placed in the placeholder shown as ` {{{body}}}`.