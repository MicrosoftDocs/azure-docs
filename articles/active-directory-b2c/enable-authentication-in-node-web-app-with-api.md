---
title: Enable authentication in your own Node.js web API by using Azure Active Directory B2C 
description: Follow this article to learn how to call your own web API protected by Azure AD B2C from your own node js web app. The web app acquires an access token and uses it to call a protected endpoint in the web API. The web app adds the access token as a bearer in the Authorization header, and the web API needs to validate it. 
titleSuffix: Azure AD B2C

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.custom: devx-track-js
ms.topic: how-to
ms.date: 02/09/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Enable authentication in your own Node.js web API by using Azure Active Directory B2C

In this article, you learn how to create your web app that calls your web API. The web API needs to be protected by Azure Active Directory B2C (Azure AD B2C). To authorize access to a the web API, you serve requests that include a valid access token that's issued by Azure AD B2C. 

## Prerequisites

- Before you begin read and complete the steps in the [Configure authentication in a sample Node.js web API by using Azure AD B2C](configure-authentication-in-sample-node-web-app-with-api.md). Then, follow the steps in this article to replace the sample web app and web API with your own web API. 

- [Visual Studio Code](https://code.visualstudio.com/), or another code editor

- [Node.js runtime](https://nodejs.org/en/download/)

## Step 1: Create a protected web API

Follow these steps to create your Node.js web API. 

### Step 1.1: Create the project

Use [Express](https://expressjs.com/) for [Node.js](https://nodejs.org/) to build a web API. To create a web API, do the following:

1. Create a new folder named `TodoList`. 
1. Under the `TodoList` folder, create a file named `index.js`.
1. In a command shell, run `npm init -y`. This command creates a default `package.json` file for your Node.js project.
1. In the command shell, run `npm install express`. This command installs the Express framework.

### Step 1.2: Install dependencies

Add the authentication library to your web API project. The authentication library parses the HTTP authentication header, validates the token, and extracts claims. For more information, review the documentation for the library.

To add the authentication library, install the packages by running the following command:

```
npm install passport
npm install passport-azure-ad
npm install morgan
```
 
The [morgan package](https://www.npmjs.com/package/morgan) is an HTTP request logger middleware for Node.js.

### Step 1.3: Write the web API server code

In the `index.js` file, add the following code:

:::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js":::

Take note of the following code snippets in the `index.js`file:

- Imports the passport Microsoft Entra library
        
    :::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js" id="ms_docref_import_azuread_lib":::
        
- Sets the Azure AD B2C options 
          
    :::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js" id="ms_docref_azureadb2c_options":::

- Instantiate the passport Microsoft Entra library with the Azure AD B2C options
           
    :::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js" id="ms_docref_init_azuread_lib":::

- The protected API endpoint. It serves requests that include a valid Azure AD B2C-issued access token. This endpoint returns the value of the `name` claim within the access token. 

    :::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js" id="ms_docref_protected_api_endpoint":::
        
- The anonymous API endpoint. The web app can call it without presenting an access token. Use it to debug your web API with anonymous calls.

    :::code language="JavaScript" source="~/active-directory-b2c-javascript-nodejs-webapi/index.js" id="ms_docref_anonymous_api_endpoint":::

### Step 1.4: Configure the web API 

Add configurations to a configuration file. The file contains information about your Azure AD B2C identity provider. The web API app uses this information to validate the access token that the web app passes as a bearer token.

1. Under the project root folder, create a `config.json` file, and then add to it the following JSON object:

    :::code language="json" source="~/active-directory-b2c-javascript-nodejs-webapi/config.json":::

1. In the `config.json` file, update the following properties:


|Section  |Key  |Value  |
|---------|---------|---------|
| credentials | tenantName | The first part of your Azure AD B2C [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `fabrikamb2c`).|
| credentials |clientID | The web API application ID. To learn how to get your web API application registration ID, see [Prerequisites](#prerequisites). |
| policies | policyName | The user flows, or custom policy. To learn how to get your user flow or policy, see [Prerequisites](#prerequisites).|
| resource | scope | The scopes of your web API application registration such as `[tasks.read]`. To learn how to get your web API scope, see [Prerequisites](#prerequisites).|

## Step 2: Create the web Node web application

Follow these steps to create the Node web app. This web app authenticates a user to acquire an access token that is used to call the Node web API you created in [step 1](#step-1-create-a-protected-web-api): 

### Step 2.1: Create the node project

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

### Step 2.2: Install the dependencies

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`, and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express
npm install axios
npm install express-session
npm install @azure/msal-node
```

### Step 2.3: Build web app UI components 

1. In the `main.hbs` file, add the following code:
    
    :::code language="html" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/views/layouts/main.hbs":::

      The `main.hbs` file is in the `layout` folder and it should contain any HTML code that is required throughout your application. It implements UI built with the Bootstrap 5 CSS Framework. Any UI that changes from page to page, such as `signin.hbs`, is placed in the placeholder shown as `{{{body}}}`.
1.  In the `signin.hbs` file, add the following code:

    :::code language="html" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/views/signin.hbs":::

1. In the `api.hbs` file, add the following code:

   :::code language="html" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/views/api.hbs":::
   
   This page displays the response from the API. The `bg-{{bg_color}}` class attribute in Bootstrap's card enables the UI to display a different background color for the different API endpoints.

### Step 2.4: Complete web application server code

1. In the `.env` file, add the following code, which includes server http port,  app registration details, and sign in and sign up user flow/policy details:

   :::code language="html" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/.env":::

    Modify the values in the `.env` files as explained in [Configure the sample web app](configure-authentication-in-sample-node-web-app-with-api.md?#step-32-configure-the-sample-web-app)
    

1. In your `index.js` file, add the following code:
    
   :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/index.js":::

       
    The code in the `index.js` file consists of global variables and express routes.
    
    **Global variables**: 
    - `confidentialClientConfig`: The MSAL configuration object, which is used to create the confidential client application object. 

        :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/index.js" id="ms_docref_configure_msal":::    

    - `apiConfig`: Contains `webApiScopes` property (it's value must be an array), which is the scopes configured in the web API, and granted to the web app. It also has URIs to the web API to be called, that is `anonymousUri` and `protectedUri`.

        :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api/index.js" id="ms_docref_api_config"::: 

    - `APP_STATES`: A value included in the request that's also returned in the token response. Used to differentiate between responses received from Azure AD B2C. 
    - `authCodeRequest`: The configuration object used to retrieve authorization code. 
    - `tokenRequest`: The configuration object used to acquire a token by authorization code.
    - `sessionConfig`: The configuration object for express session. 
    - `getAuthCode`: A method that creates the URL of the authorization request, letting the user input credentials and consent to the application. It uses the `getAuthCodeUrl` method, which is defined in the [ConfidentialClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.ConfidentialClientApplication.html) class.
    
    **Express routes**:
    - `/`: 
        - It's the entry to the web app, and renders the `signin` page.
    - `/signin`:
        - Signs in the user.
        - Calls `getAuthCode()` method and passes the `authority` for **Sign in and sign up** user flow/policy, `APP_STATES.LOGIN`, and `apiConfig.webApiScopes` to it.  
        - It causes the end user to be challenged to enter their logins, or if the user doesn't have an account, they can sign up.
        - The final response resulting from this endpoint includes an authorization code from B2C posted back to the `/redirect` endpoint.
    - `/redirect`:
        - It's the endpoint set as **Redirect URI** for the web app in Azure portal.
        - It uses the `state` query parameter in Azure AD B2C's response, to differentiate between requests that are made from the web app.
        - If the app state is `APP_STATES.LOGIN`, the authorization code acquired is used to retrieve a token using the `acquireTokenByCode()` method. When requesting for a token using `acquireTokenByCode` method, you use the same scopes used while acquiring the authorization code. The acquired token includes an `accessToken`, `idToken`, and `idTokenClaims`. After you acquire the `accessToken`, you put it in a session for later use in to call the web API. 
    - `/api`:
        - Calls the web API. 
        - If the `accessToken` isn't in the session, call the anonymous API endpoint (`http://localhost:5000/public`), otherwise, call the protected API endpoint (`http://localhost:5000/hello`).
    - `/signout`:
        - Signs out the user.
        - clears the web app session is and makes an http call to the Azure AD B2C logout endpoint.


## Step 3: Run the web app and API

Follow the steps in [Run the web app and API](configure-authentication-in-sample-node-web-app-with-api.md?#step-5-run-the-web-app-and-api) to test your web app and web API. 
 

## Next steps
- [Secure an Azure API Management API with Azure AD B2C](secure-api-management.md)
