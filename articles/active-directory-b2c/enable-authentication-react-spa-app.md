---
title: Enable authentication in an React application by using Azure Active Directory B2C building blocks
description:  Use the building blocks of Azure Active Directory B2C to sign in and sign up users in an React application.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/04/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own React Application by using Azure Active Directory B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own React single-page application (SPA). Learn how to integrate an React application with the [MSAL for React](https://www.npmjs.com/package/@azure/msal-react) authentication library. 

Use this article with the related article titled [Configure authentication in a sample React single-page application](./configure-authentication-sample-React-spa-app.md). Substitute the sample React app with your own React app. After you complete the steps in this article, your application will accept sign-ins via Azure AD B2C.

## Prerequisites

Review the prerequisites and integration steps in the [Configure authentication in a sample React single-page application](configure-authentication-sample-React-spa-app.md) article.

## Step 1: Create an React app project

You can use an existing React app, or [create a new React App](https://reactjs.org/docs/create-a-new-react-app.html). To create a new project, run the following commands.


```
nnpx create-react-app my-app
cd my-app
npm start
```

## Step 2: Install the dependencies

To install the [MSAL Browser](https://www.npmjs.com/package/@azure/msal-browser) and [MSAL React](https://www.npmjs.com/package/@azure/msal-react) libraries in your application, run the following command in your command shell:

```
npm i @azure/msal-browser  @azure/msal-react 
```

Install the the [react-router-dom](https://www.npmjs.com/package/react-router-dom) version 5.*:

```
npm i react-router-dom@5.3.3
```


Install the [Bootstrap for React](https://www.npmjs.com/package/react-bootstrap) (optional, for UI):

```
npm i bootstrap react-bootstrap    
```

## 3: Add the authentication components

The sample code is made up of the following components. Add these components from the sample React app to your own app: 

|Component  |Description  |
|---------|---------|
|[public/index.html](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/public/index.html)| The main HTML file of the app. |
| [src/authConfig.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/authConfig.js)|  This configuration file contains information about your Azure AD B2C identity provider and the web API service. The React app uses this information to establish a trust relationship with Azure AD B2C, sign in and sign out the user, acquire tokens, and validate the tokens. |
|[src/index.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/index.js)| The JavaScript entry point. The index.js mounts the `App` as the root component into the *public/index.html* page. It also initiates the MSAL `PublicClientApplication` object with the configuration defined in the authConfig.js file. |
|[src/App.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/App.jsx)| Defines the **App** and **Pages** components. The *Pages* component is mounted into the *App* component. The *Pages* component registers and unregister the MSAL event callbacks. The events are used to handle MSAL errors. It also defines the routing logic of the app. |
|[src/fetch.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/fetch.js)| Fetches HTTP request to the REST API. |
src/pages/Hello.jsx||
|[src/components/DataDisplay.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/DataDisplay.jsx)||
|[src/components/NavigationBar.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/NavigationBar.jsx)||
|[src/components/PageLayout.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/PageLayout.jsx)||
|[src/styles/App.css](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/styles/App.css)||
|[src/styles/index.css](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/styles/index.css)||


## Step 4: Configure your Android app

After you [add the authentication components](#step-2-add-the-authentication-components), configure your Android app with your Azure AD B2C settings. Azure AD B2C identity provider settings are configured in the *auth_config_b2c.json* file and B2CConfiguration class. 

For guidance, see [Configure the sample mobile app](configure-authentication-sample-android-app.md#step-5-configure-the-sample-mobile-app).

## Step 5: Run the React application

1. From Visual Studio code, open a new terminal and run the following commands:

    ```console
    npm install && npm update
    npm start
    ```

    The console window displays the port number of where the application is hosted:

    ```console
    Listening on port 3000...
    ```

1. Go to `http://localhost:3000` in your browser to view the application.


## Next steps

* [Configure authentication options in your own React application by using Azure AD B2C](enable-authentication-React-spa-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)
