---
title: Enable authentication in a React application by using Azure Active Directory B2C building blocks
description:  Use the building blocks of Azure Active Directory B2C to sign in and sign up users in a React application.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 11/20/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own React Application by using Azure Active Directory B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own React single-page application (SPA). Learn how to integrate a React application with the [MSAL for React](https://www.npmjs.com/package/@azure/msal-react) authentication library. 

Use this article with the related article titled [Configure authentication in a sample React single-page application](./configure-authentication-sample-React-spa-app.md). Substitute the sample React app with your own React app. After you complete the steps in this article, your application will accept sign-ins via Azure AD B2C.

## Prerequisites

Review the prerequisites and integration steps in the [Configure authentication in a sample React single-page application](configure-authentication-sample-React-spa-app.md) article.

## Step 1: Create a React app project

You can use an existing React app, or [create a new React App](https://react.dev/learn/start-a-new-react-project). To create a new project, run the following commands in your command shell:


```
npx create-react-app my-app
cd my-app
```

## Step 2: Install the dependencies

To install the [MSAL Browser](https://www.npmjs.com/package/@azure/msal-browser) and [MSAL React](https://www.npmjs.com/package/@azure/msal-react) libraries in your application, run the following command in your command shell:

```
npm i @azure/msal-browser  @azure/msal-react 
```

Install the [react-router-dom](https://www.npmjs.com/package/react-router-dom) version 5.*. The react-router-dom package contains bindings for using React Router in web applications. Run the following command in your command shell:

```
npm i react-router-dom@5.3.3
```


Install the [Bootstrap for React](https://www.npmjs.com/package/react-bootstrap) (optional, for UI):

```
npm i bootstrap react-bootstrap    
```

## Step 3: Add the authentication components

The sample code is made up of the following components. Add these components from the sample React app to your own app: 

- [public/index.html](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/public/index.html)- The [bundling process](https://legacy.reactjs.org/docs/code-splitting.html) uses this file as a template and injects the React components into the `<div id="root">` element. If you open it directly in the browser, you'll see an empty page. 

- [src/authConfig.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/authConfig.js) -   A configuration file that contains information about your Azure AD B2C identity provider and the web API service. The React app uses this information to establish a trust relationship with Azure AD B2C, sign in and sign out the user, acquire tokens, and validate the tokens. 

- [src/index.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/index.js) - The JavaScript entry point to your application. This JavaScript file:
  - Mounts the `App` as the root component into the *public/index.html* page's `<div id="root">` element. 
  - Initiates the MSAL `PublicClientApplication` library with the configuration defined in the *authConfig.js* file.  The MSAL React should be instantiated outside of the component tree to prevent it from being reinstantiated on re-renders. 
  - After instantiation of the MSAL library, the JavaScript code passes the `msalInstance` as props to your application components. For example, `<App instance={msalInstance} />`.

- [src/App.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/App.jsx) - Defines the **App** and **Pages** components: 

  - The **App** component is the top level component of your app. It wraps everything between `MsalProvider` component. All components underneath MsalProvider will have access to the PublicClientApplication instance via context and all hooks and components provided by MSAL React. The App component mounts the [PageLayout](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/PageLayout.jsx) and its [Pages](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/App.jsx#L18) child element.

  - The **Pages** component registers and unregister the MSAL event callbacks. The events are used to handle MSAL errors. It also defines the routing logic of the app. 

  > [!IMPORTANT]
  > If the App component file name is `App.js`, change it to `App.jsx`.

- [src/pages/Hello.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/6-AdvancedScenarios/1-call-api-obo/SPA/src/pages/Home.jsx) - Demonstrate how to call a protected resource with OAuth2 bearer token.
  - It uses the [useMsal](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md) hook that returns the PublicClientApplication instance.
  - With PublicClientApplication instance, it acquires an access token to call the REST API.
  - Invokes the [callApiWithToken](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/4-Deployment/2-deploy-static/App/src/fetch.js) function to fetch the data from the REST API and renders the result using the **DataDisplay** component.

- [src/components/NavigationBar.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/NavigationBar.jsx) - The app top navigation bar with the sign-in, sign-out, edit profile and call REST API reset buttons.
  - It uses the [AuthenticatedTemplate](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#authenticatedtemplate-and-unauthenticatedtemplate) and UnauthenticatedTemplate, which only render their children if a user is authenticated or unauthenticated, respectively.
  - Handle the login and sign out with redirection and popup window events.

- [src/components/PageLayout.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/PageLayout.jsx)
  - The common layout that provides the user with a consistent experience as they navigate from page to page. The layout includes common user interface elements such as the app header, **NavigationBar** component, footer and its child components. 
  - It uses the [AuthenticatedTemplate](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#authenticatedtemplate-and-unauthenticatedtemplate) which renders its children only if a user is authenticated.

- [src/components/DataDisplay.jsx](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/components/DataDisplay.jsx) - Renders the data return from the REST API call. 

- [src/styles/App.css](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/styles/App.css) and [src/styles/index.css](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/styles/index.css) - CSS styling files for the app.

- [src/fetch.js](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/4-Deployment/2-deploy-static/App/src/fetch.js) - Fetches HTTP requests to the REST API. 

## Step 4: Configure your React app

After you [add the authentication components](#step-3-add-the-authentication-components), configure your React app with your Azure AD B2C settings. Azure AD B2C identity provider settings are configured in the *authConfig.js* file. 

For guidance, see [Configure your React app](configure-authentication-sample-react-spa-app.md#step-4-configure-the-web-api). 

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

1. To call a REST API, follow the guidance how to [run the web API](configure-authentication-sample-react-spa-app.md#run-the-web-api)

1. In your browser, go to `http://localhost:3000` to view the application


## Next steps

- [Configure authentication options in your own React application by using Azure AD B2C](enable-authentication-React-spa-app-options.md)
- Check out the [MSAL for React documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react/docs)
- [Enable authentication in your own web API](enable-authentication-web-api.md)