---
title: "Tutorial: Create a React single-page app that uses auth code flow"
description: In this tutorial, you create a React SPA that can sign in users and use the auth code flow to obtain an access token from the Microsoft identity platform and call the Microsoft Graph API.
services: active-directory
author: j-mantu
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 05/05/2022
ms.author: jamesmantu
ms.custom: aaddev, devx-track-js
---

# Tutorial: Sign in users and call the Microsoft Graph API from a React single-page app (SPA) using auth code flow

In this tutorial, you build a React single-page application (SPA) that signs in users and calls Microsoft Graph by using the authorization code flow with PKCE. The SPA you build uses the Microsoft Authentication Library (MSAL) for React.

In this tutorial:
> [!div class="checklist"]
> * Create a React project with `npm`
> * Register the application in the Azure portal
> * Add code to support user sign-in and sign-out
> * Add code to call Microsoft Graph API
> * Test the app

MSAL React supports the authorization code flow in the browser instead of the implicit grant flow. MSAL React does **NOT** support the implicit flow.

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) for running a local webserver
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## How the tutorial app works

:::image type="content" source="media/tutorial-v2-javascript-auth-code/diagram-01-auth-code-flow.png" alt-text="Diagram showing the authorization code flow in a single-page application":::

The application you create in this tutorial enables a React SPA to query the Microsoft Graph API by acquiring security tokens from the Microsoft identity platform. It uses the MSAL for React, a wrapper of the MSAL.js v2 library. MSAL React enables React 16+ applications to authenticate enterprise users by using Azure Active Directory (Azure AD), and also users with Microsoft accounts and social identities like Facebook, Google, and LinkedIn. The library also enables applications to get access to Microsoft cloud services and Microsoft Graph.

In this scenario, after a user signs in, an access token is requested and added to HTTP requests in the authorization header. Token acquisition and renewal are handled by the MSAL for React (MSAL React).

### Libraries

This tutorial uses the following libraries:

|Library|Description|
|---|---|
|[MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)|Microsoft Authentication Library for JavaScript React Wrapper|
|[MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)|Microsoft Authentication Library for JavaScript v2 browser package|

## Get the completed code sample

Prefer to download this tutorial's completed sample project instead? To run the project by using a local web server, such as Node.js, clone the [ms-identity-javascript-react-spa](https://github.com/Azure-Samples/ms-identity-javascript-react-spa) repository:

`git clone https://github.com/Azure-Samples/ms-identity-javascript-react-spa`

Then, to configure the code sample before you execute it, skip to the [configuration step](#register-your-application).

To continue with the tutorial and build the application yourself, move on to the next section, [Create your project](#create-your-project).

## Create your project

Once you have [Node.js](https://nodejs.org/en/download/) installed, open up a terminal window and then run the following commands:

```console
npx create-react-app msal-react-tutorial # Create a new React app
cd msal-react-tutorial # Change to the app directory
npm install @azure/msal-browser @azure/msal-react # Install the MSAL packages
npm install react-bootstrap bootstrap # Install Bootstrap for styling
```

You've now bootstrapped a small React project using [Create React App](https://create-react-app.dev/docs/getting-started). This will be the starting point the rest of this tutorial will build on. If you'd like to see the changes to your app as you're working through this tutorial you can run the following command: 

```console
npm start
```

A browser window should be opened to your app automatically. If it doesn't, open your browser and navigate to http://localhost:3000. Each time you save a file with updated code the page will reload to reflect the changes.

## Register your application

Follow the steps in [Single-page application: App registration](./scenario-spa-app-registration.md) to create an app registration for your SPA by using the Azure portal.

In the [Redirect URI: MSAL.js 2.0 with auth code flow](scenario-spa-app-registration.md#redirect-uri-msaljs-20-with-auth-code-flow) step, enter `http://localhost:3000`, the default location where create-react-app will serve your application.

### Configure your JavaScript SPA

1. Create a file named *authConfig.js* in the *src* folder to contain your configuration parameters for authentication, and then add the following code:

    ```javascript
    export const msalConfig = {
      auth: {
        clientId: "Enter_the_Application_Id_Here",
        authority: "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: "Enter_the_Redirect_Uri_Here",
      },
      cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
      }
    };
    
    // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
    export const loginRequest = {
     scopes: ["User.Read"]
    };
    
    // Add the endpoints here for Microsoft Graph API services you'd like to use.
    export const graphConfig = {
        graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
    };
    ```

1. Modify the values in the `msalConfig` section as described here:
    
    |Value name| About|
    |----------|------|
    |`Enter_the_Application_Id_Here`| The **Application (client) ID** of the application you registered.|
    |`Enter_the_Cloud_Instance_Id_Here`| The Azure cloud instance in which your application is registered. For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com`. For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
    |`Enter_the_Tenant_Info_Here`| Set to one of the following options: If your application supports *accounts in this organizational directory*, replace this value with the directory (tenant) ID or tenant name (for example, **contoso.microsoft.com**). If your application supports *accounts in any organizational directory*, replace this value with **organizations**. If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with **common**. To restrict support to *personal Microsoft accounts only*, replace this value with **consumers**. |
    |`Enter_the_Redirect_Uri_Here`|Replace with **http://localhost:3000**.|
    |`Enter_the_Graph_Endpoint_Here`| The instance of the Microsoft Graph API the application should communicate with. For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com`. For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.|
    
    For more information about available configurable options, see [Initialize client applications](msal-js-initializing-client-applications.md).

1. Open up the *src/index.js* file and add the following imports:

    ```javascript
    import "bootstrap/dist/css/bootstrap.min.css";
    import { PublicClientApplication } from "@azure/msal-browser";
    import { MsalProvider } from "@azure/msal-react";
    import { msalConfig } from "./authConfig";
    ```

2. Underneath the imports in *src/index.js* create a `PublicClientApplication` instance using the configuration from step 1.

    ```javascript
    const msalInstance = new PublicClientApplication(msalConfig);
    ``` 

3. Find the `<App />` component in *src/index.js* and wrap it in the `MsalProvider` component. Your render function should look like this:

    ```jsx
    root.render(
        <React.StrictMode>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </React.StrictMode>
    );
    ``` 

## Sign in users

Create a folder in *src* called *components* and create a file inside this folder named *SignInButton.jsx*. Add the code from either of the following sections to invoke login using a pop-up window or a full-frame redirect:

### Sign in using pop-ups

Add the following code to *src/components/SignInButton.jsx* to create a button component that will invoke a pop-up login when selected:

```jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";


/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogin("popup")}>Sign in using Popup</Button>
    );
}
```

### Sign in using redirects

Add the following code to *src/components/SignInButton.jsx* to create a button component that will invoke a redirect login when selected:

```jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";


/**
 * Renders a button which, when selected, will redirect the page to the login prompt
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogin("redirect")}>Sign in using Redirect</Button>
    );
}
```

### Add the sign-in button

1. Create another file in the *components* folder named *PageLayout.jsx* and add the following code to create a navbar component that will contain the sign-in button you just created:

    ```jsx
    import React from "react";
    import Navbar from "react-bootstrap/Navbar";
    import { useIsAuthenticated } from "@azure/msal-react";
    import { SignInButton } from "./SignInButton";
    
    /**
     * Renders the navbar component with a sign-in button if a user is not authenticated
     */
    export const PageLayout = (props) => {
        const isAuthenticated = useIsAuthenticated();
    
        return (
            <>
                <Navbar bg="primary" variant="dark">
                    <a className="navbar-brand" href="/">MSAL React Tutorial</a>
                    { isAuthenticated ? <span>Signed In</span> : <SignInButton /> }
                </Navbar>
                <h5><center>Welcome to the Microsoft Authentication Library For React Tutorial</center></h5>
                <br />
                <br />
                {props.children}
            </>
        );
    };
    ```

1. Now open *src/App.js* and add replace the existing content with the following code: 

    ```jsx
    import React from "react";
    import { PageLayout } from "./components/PageLayout";
    
    function App() {
      return (
          <PageLayout>
              <p>This is the main app content!</p>
          </PageLayout>
      );
    }
    
    export default App;
    ```

Your app now has a sign-in button, which is only displayed for unauthenticated users!

When a user selects the **Sign in using Popup** or **Sign in using Redirect** button for the first time, the `onClick` handler calls `loginPopup` (or `loginRedirect`) to sign in the user. The `loginPopup` method opens a pop-up window with the *Microsoft identity platform endpoint* to prompt and validate the user's credentials. After a successful sign-in, *msal.js* initiates the [authorization code flow](v2-oauth2-auth-code-flow.md).

At this point, a PKCE-protected authorization code is sent to the CORS-protected token endpoint and is exchanged for tokens. An ID token, access token, and refresh token are received by your application and processed by *msal.js*, and the information contained in the tokens is cached.

## Sign users out

In *src/components* create a file named *SignOutButton.jsx*. Add the code from either of the following sections to invoke logout using a pop-up window or a full-frame redirect:

### Sign out using pop-ups

Add the following code to *src/components/SignOutButton.jsx* to create a button component that will invoke a pop-up logout when selected:

```jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";

/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/" // redirects the top level app after logout
            });
        }
    }

    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogout("popup")}>Sign out using Popup</Button>
    );
}
```

### Sign out using redirects

Add the following code to *src/components/SignOutButton.jsx* to create a button component that will invoke a redirect logout when selected:

```jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";

/**
 * Renders a button which, when selected, will redirect the page to the logout prompt
 */
export const SignOutButton = () => {
    const { instance } = useMsal();
    
    const handleLogout = (logoutType) => {
        if (logoutType === "redirect") {
           instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }

    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogout("redirect")}>Sign out using Redirect</Button>
    );
}
```

### Add the sign-out button

Update your `PageLayout` component in *src/components/PageLayout.jsx* to render the new `SignOutButton` component for authenticated users. Your code should look like this:

```jsx
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <a className="navbar-brand" href="/">MSAL React Tutorial</a>
                { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            </Navbar>
            <h5><center>Welcome to the Microsoft Authentication Library For React Tutorial</center></h5>
            <br />
            <br />
            {props.children}
        </>
    );
};
```

## Conditionally render components

In order to render certain components only for authenticated or unauthenticated users use the `AuthenticateTemplate` and/or `UnauthenticatedTemplate` as demonstrated below.

1. Add the following import to *src/App.js*:

    ```javascript
    import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
    ```
    
1. In order to render certain components only for authenticated users update your `App` function in *src/App.js* with the following code: 

    ```jsx
    function App() {
        return (
            <PageLayout>
                <AuthenticatedTemplate>
                    <p>You are signed in!</p>
                </AuthenticatedTemplate>
            </PageLayout>
        );
    }
    ```

1. To render certain components only for unauthenticated users, such as a suggestion to login, update your `App` function in *src/App.js* with the following code: 

    ```jsx
    function App() {
        return (
            <PageLayout>
                <AuthenticatedTemplate>
                    <p>You are signed in!</p>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <p>You are not signed in! Please sign in.</p>
                </UnauthenticatedTemplate>
            </PageLayout>
        );
    }
    ```

## Acquire a token

1. Before calling an API, such as Microsoft Graph, you'll need to acquire an access token. Add a new component to *src/App.js* called `ProfileContent` with the following code:

    ```jsx
    function ProfileContent() {
        const { instance, accounts, inProgress } = useMsal();
        const [accessToken, setAccessToken] = useState(null);

        const name = accounts[0] && accounts[0].name;

        function RequestAccessToken() {
            const request = {
                ...loginRequest,
                account: accounts[0]
            };

            // Silently acquires an access token which is then attached to a request for Microsoft Graph data
            instance.acquireTokenSilent(request).then((response) => {
                setAccessToken(response.accessToken);
            }).catch((e) => {
                instance.acquireTokenPopup(request).then((response) => {
                    setAccessToken(response.accessToken);
                });
            });
        }

        return (
            <>
                <h5 className="card-title">Welcome {name}</h5>
                {accessToken ? 
                    <p>Access Token Acquired!</p>
                    :
                    <Button variant="secondary" onClick={RequestAccessToken}>Request Access Token</Button>
                }
            </>
        );
    };
    ```

1. Update your imports in *src/App.js* to match the following snippet:

    ```js
    import React, { useState } from "react";
    import { PageLayout } from "./components/PageLayout";
    import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
    import { loginRequest } from "./authConfig";
    import Button from "react-bootstrap/Button";
    ```

1. Finally, add your new `ProfileContent` component as a child of the `AuthenticatedTemplate` in your `App` component in *src/App.js*. Your `App` component should look like this:

    ```jsx
    function App() {
      return (
          <PageLayout>
              <AuthenticatedTemplate>
                  <ProfileContent />
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                  <p>You are not signed in! Please sign in.</p>
              </UnauthenticatedTemplate>
          </PageLayout>
      );
    }
    ```

The code above will render a button for signed in users, allowing them to request an access token for Microsoft Graph when the button is selected.

After a user signs in, your app shouldn't ask users to reauthenticate every time they need to access a protected resource (that is, to request a token). To prevent such reauthentication requests, call `acquireTokenSilent` which will first look for a cached, unexpired access token then, if needed, use the refresh token to obtain a new access token. There are some situations, however, where you might need to force users to interact with the Microsoft identity platform. For example:

- Users need to re-enter their credentials because the session has expired.
- The refresh token has expired.
- Your application is requesting access to a resource and you need the user's consent.
- Two-factor authentication is required.

Calling `acquireTokenPopup` opens a pop-up window (or `acquireTokenRedirect` redirects users to the Microsoft identity platform). In that window, users need to interact by confirming their credentials, giving consent to the required resource, or completing the two-factor authentication.

If you're using Internet Explorer, we recommend that you use the `loginRedirect` and `acquireTokenRedirect` methods due to a [known issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/internet-explorer.md#popups) with Internet Explorer and pop-up windows.

## Call the Microsoft Graph API

1. Create file named *graph.js* in the *src* folder and add the following code for making REST calls to the Microsoft Graph API:

    ```javascript
    import { graphConfig } from "./authConfig";
    
    /**
     * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
     */
    export async function callMsGraph(accessToken) {
        const headers = new Headers();
        const bearer = `Bearer ${accessToken}`;
    
        headers.append("Authorization", bearer);
    
        const options = {
            method: "GET",
            headers: headers
        };
    
        return fetch(graphConfig.graphMeEndpoint, options)
            .then(response => response.json())
            .catch(error => console.log(error));
    }
    ```

1. Next create a file named *ProfileData.jsx* in *src/components* and add the following code:

    ```javascript
    import React from "react";
    
    /**
     * Renders information about the user obtained from Microsoft Graph
     */
    export const ProfileData = (props) => {
        return (
            <div id="profile-div">
                <p><strong>First Name: </strong> {props.graphData.givenName}</p>
                <p><strong>Last Name: </strong> {props.graphData.surname}</p>
                <p><strong>Email: </strong> {props.graphData.userPrincipalName}</p>
                <p><strong>Id: </strong> {props.graphData.id}</p>
            </div>
        );
    };
    ```

1. Next, open *src/App.js* and add the following imports:
    
    ```javascript
    import { ProfileData } from "./components/ProfileData";
    import { callMsGraph } from "./graph";
    ```

1. Finally, update your `ProfileContent` component in *src/App.js* to call Microsoft Graph and display the profile data after acquiring the token. Your `ProfileContent` component should look like this:

    ```javascript
    function ProfileContent() {
        const { instance, accounts } = useMsal();
        const [graphData, setGraphData] = useState(null);

        const name = accounts[0] && accounts[0].name;

        function RequestProfileData() {
            const request = {
                ...loginRequest,
                account: accounts[0]
            };

            // Silently acquires an access token which is then attached to a request for Microsoft Graph data
            instance.acquireTokenSilent(request).then((response) => {
                callMsGraph(response.accessToken).then(response => setGraphData(response));
            }).catch((e) => {
                instance.acquireTokenPopup(request).then((response) => {
                    callMsGraph(response.accessToken).then(response => setGraphData(response));
                });
            });
        }

        return (
            <>
                <h5 className="card-title">Welcome {name}</h5>
                {graphData ? 
                    <ProfileData graphData={graphData} />
                    :
                    <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
                }
            </>
        );
    };
    ```

In the changes made above, the `callMSGraph()` method is used to make an HTTP `GET` request against a protected resource that requires a token. The request then returns the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. In the sample application created in this tutorial, the protected resource is the Microsoft Graph API *me* endpoint which displays the signed-in user's profile information.

## Test your application

You've completed creation of the application and are now ready to launch the web server and test the app's functionality.

1. Serve your app by running the following command from within the root of your project folder:

   ```console
   npm start
   ```
1. A browser window should be opened to your app automatically. If it doesn't, open your browser and navigate to `http://localhost:3000`. You should see a page that looks like the one below.

    :::image type="content" source="media/tutorial-v2-react/react-01-unauthenticated.png" alt-text="Web browser displaying sign-in dialog":::

1. Select the sign-in button to sign in.

### Provide consent for application access

The first time you sign in to your application, you're prompted to grant it access to your profile and sign you in:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-02-consent-dialog.png" alt-text="Content dialog displayed in web browser":::

If you consent to the requested permissions, the web applications displays your name, signifying a successful login:

:::image type="content" source="media/tutorial-v2-react/react-02-authenticated.png" alt-text="Results of a successful sign-in in the web browser":::

### Call the Graph API

After you sign in, select **See Profile** to view the user profile information returned in the response from the call to the Microsoft Graph API:

:::image type="content" source="media/tutorial-v2-react/react-03-graph-data.png" alt-text="Profile information from Microsoft Graph displayed in the browser":::

### More information about scopes and delegated permissions

The Microsoft Graph API requires the *user.read* scope to read a user's profile. By default, this scope is automatically added in every application that's registered in the Azure portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. For example, the Microsoft Graph API requires the *Mail.Read* scope in order to list the user's email.

As you add scopes, your users might be prompted to provide additional consent for the added scopes.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

If you'd like to dive deeper into JavaScript single-page application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Single-page application](scenario-spa-overview.md)
