---
title: JavaScript single-page app tutorial - auth code flow | Azure
titleSuffix: Microsoft identity platform
description: How JavaScript SPA applications can use the auth code flow to call an API that requires access tokens by Azure Active Directory v2.0 endpoint
services: active-directory
author: hahamil
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 05/19/2020
ms.author: hahamil
ms.custom: aaddev
---

# Tutorial: Sign in users and call the Microsoft Graph API from a JavaScript single-page app (SPA) using auth code flow

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature might change before general availability (GA).

This tutorial shows you how to create a JavaScript single-page application (SPA) that uses the Microsoft Authentication Library (MSAL) for JavaScript v2.0 to:

> [!div class="checklist"]
> * Perform the OAuth 2.0 authorization code flow with PKCE
> * Sign in personal Microsoft accounts as well as work and school accounts
> * Acquire an access token
> * Call Microsoft Graph or your own API that requires access tokens obtained from the Microsoft identity platform endpoint

MSAL.js 2.0 improves on MSAL.js 1.0 by supporting the authorization code flow in the browser instead of the implicit grant flow. MSAL.js 2.0 does **NOT** support the implicit flow.

## How the tutorial app works

:::image type="content" source="media/tutorial-v2-javascript-auth-code/diagram-01-auth-code-flow.png" alt-text="Diagram showing the authorization code flow in a single-page application":::

The application you create in this tutorial enables a JavaScript SPA to query the Microsoft Graph API by acquiring security tokens from the the Microsoft identity platform endpoint. In this scenario, after a user signs in, an access token is requested and added to HTTP requests in the authorization header. Token acquisition and renewal are handled by the Microsoft Authentication Library for JavaScript (MSAL.js).

This tutorial uses the following library:

[msal.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) Microsoft Authentication Library for JavaScript v2.0 browser package

## Get the completed code sample

Prefer to download this tutorial's completed sample project instead? To run the project by using a local web server, such as Node.js, clone the [ms-identity-javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2) repository:

`git clone https://github.com/Azure-Samples/ms-identity-javascript-v2`

Then, to configure the code sample before you execute it, skip to the [configuration step](#register-your-application).

To continue with the tutorial and build the application yourself, move on to the next section, [Prerequisites](#prerequisites).

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) for running a local webserver
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Create your project

Once you have [Node.js](https://nodejs.org/en/download/) installed, create a folder to host your application, for example *msal-spa-tutorial*.

Next, implement a small [Express](https://expressjs.com/) web server to serve your *index.html* file.

1. First, change to your project directory in your terminal and then run the following `npm` commands:
    ```console
    npm init -y
    npm install @azure/msal-browser
    npm install express
    npm install morgan
    npm install yargs
    ```
2. Next, create file named *server.js* and add the following code:

   ```JavaScript
   const express = require('express');
   const morgan = require('morgan');
   const path = require('path');
   const argv = require('yargs')
      .usage('Usage: $0 -p [PORT]')
      .alias('p', 'port')
      .describe('port', '(Optional) Port Number - default is 3000')
      .strict()
      .argv;

   const DEFAULT_PORT = 3000;

   //initialize express.
   const app = express();

   // Initialize variables.
   let port = DEFAULT_PORT; // -p {PORT} || 3000;
   if (argv.p) {
      port = argv.p;
   }

   // Configure morgan module to log all requests.
   app.use(morgan('dev'));

   // Set the front-end folder to serve public assets.
   app.use("/lib", express.static(path.join(__dirname, "../../lib/msal-browser/lib")));

   // Setup app folders
   app.use(express.static('app'));

   // Set up a route for index.html.
   app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
   });

   // Start the server.
   app.listen(port);
   console.log(`Listening on port ${port}...`);
    ```

You now have a small webserver to serve your SPA. After completing the rest of the tutorial, the file and folder structure of your project should look similar to the following:

```
msal-spa-tutorial/
├── app
│   ├── authConfig.js
│   ├── authPopup.js
│   ├── authRedirect.js
│   ├── graphConfig.js
│   ├── graph.js
│   ├── index.html
│   └── ui.js
└── server.js
```

## Create the SPA UI

1. Create an *app* folder in your project directory, and in it create an *index.html* file for your JavaScript SPA. This file implements a UI built with the **Bootstrap 4 Framework** and imports script files for configuration, authentication, and API calls.

    In the *index.html* file, add the following code:

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <title>Tutorial | MSAL.js JavaScript SPA</title>

        <!-- IE support: add promises polyfill before msal.js  -->
        <script type="text/javascript" src="//cdn.jsdelivr.net/npm/bluebird@3.7.2/js/browser/bluebird.min.js"></script>
        <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.0.0-beta.0/js/msal-browser.js"></script>

        <!-- adding Bootstrap 4 for UI components  -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <link rel="SHORTCUT ICON" href="https://c.s-microsoft.com/favicon.ico?v2" type="image/x-icon">
      </head>
      <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <a class="navbar-brand" href="/">Microsoft identity platform</a>
          <div class="btn-group ml-auto dropleft">
              <button type="button" id="SignIn" class="btn btn-secondary" onclick="signIn()">
                Sign In
              </button>
          </div>
        </nav>
        <br>
        <h5 class="card-header text-center">JavaScript SPA calling Microsoft Graph API with MSAL.js</h5>
        <br>
        <div class="row" style="margin:auto" >
        <div id="card-div" class="col-md-3" style="display:none">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title" id="WelcomeMessage">Please sign-in to see your profile and read your mails</h5>
            <div id="profile-div"></div>
            <br>
            <br>
            <button class="btn btn-primary" id="seeProfile" onclick="seeProfile()">See Profile</button>
            <br>
            <br>
            <button class="btn btn-primary" id="readMail" onclick="readMail()">Read Mail</button>
          </div>
        </div>
        </div>
        <br>
        <br>
          <div class="col-md-4">
            <div class="list-group" id="list-tab" role="tablist">
            </div>
          </div>
          <div class="col-md-5">
            <div class="tab-content" id="nav-tabContent">
            </div>
          </div>
        </div>
        <br>
        <br>

        <!-- importing bootstrap.js and supporting js libraries -->
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

        <!-- importing app scripts (load order is important) -->
        <script type="text/javascript" src="./authConfig.js"></script>
        <script type="text/javascript" src="./graphConfig.js"></script>
        <script type="text/javascript" src="./ui.js"></script>

        <!-- <script type="text/javascript" src="./authRedirect.js"></script>   -->
        <!-- uncomment the above line and comment the line below if you would like to use the redirect flow -->
        <script type="text/javascript" src="./authPopup.js"></script>
        <script type="text/javascript" src="./graph.js"></script>
      </body>
    </html>
    ```

2. Next, also in the *app* folder, create a file named *ui.js* and add the following code. This file will access and update DOM elements.

    ```JavaScript
    // Select DOM elements to work with
    const welcomeDiv = document.getElementById("WelcomeMessage");
    const signInButton = document.getElementById("SignIn");
    const cardDiv = document.getElementById("card-div");
    const mailButton = document.getElementById("readMail");
    const profileButton = document.getElementById("seeProfile");
    const profileDiv = document.getElementById("profile-div");

    function showWelcomeMessage(account) {

        // Reconfiguring DOM elements
        cardDiv.classList.remove('d-none');
        welcomeDiv.innerHTML = `Welcome ${account.name}`;

        // Reconfiguring DOM elements
        cardDiv.style.display = 'initial';
        welcomeDiv.innerHTML = `Welcome ${account.name}`;
        signInButton.setAttribute("onclick", "signOut();");
        signInButton.setAttribute('class', "btn btn-success")
        signInButton.innerHTML = "Sign Out";
    }

    function updateUI(data, endpoint) {
        console.log('Graph API responded at: ' + new Date().toString());

        if (endpoint === graphConfig.graphMeEndpoint) {
            const title = document.createElement('p');
            title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
            const email = document.createElement('p');
            email.innerHTML = "<strong>Mail: </strong>" + data.mail;
            const phone = document.createElement('p');
            phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
            const address = document.createElement('p');
            address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
            profileDiv.appendChild(title);
            profileDiv.appendChild(email);
            profileDiv.appendChild(phone);
            profileDiv.appendChild(address);

        } else if (endpoint === graphConfig.graphMailEndpoint) {
            if (data.value.length < 1) {
                alert("Your mailbox is empty!")
            } else {
                const tabList = document.getElementById("list-tab");
                tabList.innerHTML = ''; // clear tabList at each readMail call
                const tabContent = document.getElementById("nav-tabContent");

                data.value.map((d, i) => {
                    // Keeping it simple
                    if (i < 10) {
                        const listItem = document.createElement("a");
                        listItem.setAttribute("class", "list-group-item list-group-item-action")
                        listItem.setAttribute("id", "list" + i + "list")
                        listItem.setAttribute("data-toggle", "list")
                        listItem.setAttribute("href", "#list" + i)
                        listItem.setAttribute("role", "tab")
                        listItem.setAttribute("aria-controls", i)
                        listItem.innerHTML = d.subject;
                        tabList.appendChild(listItem)

                        const contentItem = document.createElement("div");
                        contentItem.setAttribute("class", "tab-pane fade")
                        contentItem.setAttribute("id", "list" + i)
                        contentItem.setAttribute("role", "tabpanel")
                        contentItem.setAttribute("aria-labelledby", "list" + i + "list")
                        contentItem.innerHTML = "<strong> from: " + d.from.emailAddress.address + "</strong><br><br>" + d.bodyPreview + "...";
                        tabContent.appendChild(contentItem);
                    }
                });
            }
        }
    }
    ```

## Register your application

Follow the steps in [Single-page application: App registration](scenario-spa-app-registration.md) to create an app registration for your SPA.

In the [Redirect URI: MSAL.js 2.0 with auth code flow](scenario-spa-app-registration.md#redirect-uri-msaljs-20-with-auth-code-flow) step, enter `http://localhost:3000`, the default location where this tutorial's application runs.

If you'd like to use a different port, enter `http://localhost:<port>`, where `<port>` is your preferred TCP port number. If you specify a port number other than `3000`, also update *server.js* with your preferred port number.

### Configure your JavaScript SPA

Create a file named *authConfig.js* in the *app* folder to contain your configuration parameters for authentication, and then add the following code:

```javascript
const msalConfig = {
  auth: {
    clientId: "Enter_the_Application_Id_Here",
    authority: "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here",
    redirectUri: "Enter_the_Redirect_Uri_Here",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
const loginRequest = {
 scopes: ["openid", "profile", "User.Read"]
};

// Add scopes here for access token to be used at Microsoft Graph API endpoints.
const tokenRequest = {
 scopes: ["User.Read", "Mail.Read"]
};
```

Modify the values in the `msalConfig` section as described here:

- `Enter_the_Application_Id_Here`: The **Application (client) ID** of the application you registered.
- `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com`.
  - For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
- `Enter_the_Tenant_info_here` should be one of the following:
  - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
  - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
  - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`.
  - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
- `Enter_the_Redirect_Uri_Here` is `http://localhost:3000`.

The `authority` value in your *authConfig.js* should be similar to the following if you're using the global Azure cloud:

```javascript
authority: "https://login.microsoftonline.com/common",
```

Still in the *app* folder, create a file named *graphConfig.js*. Add the following code to provide your application the configuration parameters for calling the Microsoft Graph API:

```javascript
// Add the endpoints here for Microsoft Graph API services you'd like to use.
const graphConfig = {
    graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me",
    graphMailEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me/messages"
};
```

Modify the values in the `graphConfig` section as described here:

- `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with.
  - For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com`.
  - For endpoints in **national** cloud deployments, see [National cloud deployments](https://docs.microsoft.com/graph/deployments) in the Microsoft Graph documentation.

The `graphMeEndpoint` and `graphMailEndpoint` values in your *graphConfig.js* should be similar to the following if you're using the global endpoint:

```javascript
graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
```

## Use Microsoft Authentication Library (MSAL) to sign in user

### Pop-up

In the *app* folder, create a file named *authPopup.js* and add the following authentication and token acquisition code for the login pop-up:

```JavaScript
// Create the main myMSALObj instance
// configuration parameters are located in authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

function signIn() {
    myMSALObj.loginPopup(loginRequest)
        .then(loginResponse => {
            console.log('id_token acquired at: ' + new Date().toString());

            if (myMSALObj.getAccount()) {
                showWelcomeMessage(myMSALObj.getAccount());
            }
        }).catch(error => {
            console.error(error);
        });
}

function signOut() {
    myMSALObj.logout();
}

function getTokenPopup(request) {
    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn(error);
            console.warn("silent token acquisition fails. acquiring token using popup");

            // fallback to interaction when silent call fails
            return myMSALObj.acquireTokenPopup(request)
                .then(tokenResponse => {
                    return tokenResponse;
                }).catch(error => {
                    console.error(error);
                });
        });
}

function seeProfile() {
    if (myMSALObj.getAccount()) {
        getTokenPopup(loginRequest)
            .then(response => {
                callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
                profileButton.classList.add('d-none');
                mailButton.classList.remove('d-none');
            }).catch(error => {
                console.error(error);
            });
    }
}

function readMail() {
    if (myMSALObj.getAccount()) {
        getTokenPopup(tokenRequest)
            .then(response => {
                callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
            }).catch(error => {
                console.error(error);
            });
    }
}
```

### Redirect

Create a file named *authRedirect.js* in the *app* folder and add the following authentication and token acquisition code for login redirect:

```javascript
// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accessToken;

// Register Callbacks for Redirect flow
myMSALObj.handleRedirectCallback(authRedirectCallBack);

function authRedirectCallBack(error, response) {
    if (error) {
        console.error(error);
    } else {
        if (myMSALObj.getAccount()) {
            console.log('id_token acquired at: ' + new Date().toString());
            showWelcomeMessage(myMSALObj.getAccount());
            getTokenRedirect(loginRequest);
        } else if (response.tokenType === "Bearer") {
            console.log('access_token acquired at: ' + new Date().toString());
        } else {
            console.log("token type is:" + response.tokenType);
        }
    }
}

// Redirect: once login is successful and redirects with tokens, call Graph API
if (myMSALObj.getAccount()) {
    showWelcomeMessage(myMSALObj.getAccount());
}

function signIn() {
    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
    myMSALObj.logout();
}

// This function can be removed if you do not need to support IE
function getTokenRedirect(request) {
    return myMSALObj.acquireTokenSilent(request)
        .then((response) => {
            console.log(response);
            if (response.accessToken) {
                console.log('access_token acquired at: ' + new Date().toString());
                accessToken = response.accessToken;

                callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
                profileButton.style.display = 'none';
                mailButton.style.display = 'initial';
            }
        })
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            // fallback to interaction when silent call fails
            return myMSALObj.acquireTokenRedirect(request);
        });
}

function seeProfile() {
    getTokenRedirect(loginRequest);
}

function readMail() {
    getTokenRedirect(tokenRequest);
}
```

### How the code works

When a user selects the **Sign In** button for the first time, the `signIn` method calls `loginPopup` to sign in the user. The `loginPopup` method opens a pop-up window with the *Microsoft identity platform endpoint* to prompt and validate the user's credentials. After a successful sign-in, *msal.js* initiates the [authorization code flow](v2-oauth2-auth-code-flow.md).

At this point, a PKCE-protected authorization code is sent to the CORS-protected token endpoint and is exchanged for tokens. An ID token, access token, and refresh token are received by your application and processed by *msal.js*, and the information contained in the tokens is cached.

The ID token contains basic information about the user, like their display name. If you plan to use any data provided by the ID token, your back-end server *must* validate it to guarantee the token was issued to a valid user for your application. The refresh token has a limited lifetime and expires after 24 hours. The refresh token can be used to silently acquire new access tokens.

The SPA you've created in this tutorial calls `acquireTokenSilent` and/or `acquireTokenPopup` to acquire an *access token* used to query the Microsoft Graph API for user profile info. If you need a sample that validates the ID token, see the [active-directory-javascript-singlepageapp-dotnet-webapi-v2](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2) sample application on GitHub. The sample uses an ASP.NET web API for token validation.

#### Get a user token interactively

After their initial sign-in, your app shouldn't ask users to reauthenticate every time they need to access a protected resource (that is, to request a token). To prevent such reauthentication requests, call `acquireTokenSilent`. There are some situations, however, where you might need to force users to interact with the Microsoft identity platform endpoint. For example:

- Users need to re-enter their credentials because the password has expired.
- Your application is requesting access to a resource and you need the user's consent.
- Two-factor authentication is required.

Calling `acquireTokenPopup` opens a pop-up window (or `acquireTokenRedirect` redirects users to the Microsoft identity platform endpoint). In that window, users need to interact by confirming their credentials, giving consent to the required resource, or completing the two-factor authentication.

#### Get a user token silently

The `acquireTokenSilent` method handles token acquisition and renewal without any user interaction. After `loginPopup` (or `loginRedirect`) is executed for the first time, `acquireTokenSilent` is the method commonly used to obtain tokens used to access protected resources for subsequent calls. (Calls to request or renew tokens are made silently.)
`acquireTokenSilent` may fail in some cases. For example, the user's password may have expired. Your application can handle this exception in two ways:

1. Make a call to `acquireTokenPopup` immediately to trigger a user sign-in prompt. This pattern is commonly used in online applications where there is no unauthenticated content in the application available to the user. The sample generated by this guided setup uses this pattern.
1. Visually indicate to the user that an interactive sign-in is required so the user can select the right time to sign in, or the application can retry `acquireTokenSilent` at a later time. This technique is commonly used when the user can use other functionality of the application without being disrupted. For example, there might be unauthenticated content available in the application. In this situation, the user can decide when they want to sign in to access the protected resource, or to refresh the outdated information.

> [!NOTE]
> This tutorial uses the `loginPopup` and `acquireTokenPopup` methods by default. If you're using Internet Explorer, we recommend that you use the `loginRedirect` and `acquireTokenRedirect` methods due to a [known issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#issues) with Internet Explorer and pop-up windows. For an example of achieving the same result by using redirect methods, see [*authRedirect.js*](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/blob/quickstart/JavaScriptSPA/authRedirect.js) on GitHub.

## Call the Microsoft Graph API

Create file named *graph.js* in the *app* folder and add the following code for making REST calls to the Microsoft Graph API:

```javascript
// Helper function to call Microsoft Graph API endpoint
// using authorization bearer token scheme
function callMSGraph(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}
```

In the sample application created in this tutorial, the `callMSGraph()` method is used to make an HTTP `GET` request against a protected resource that requires a token. The request then returns the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. In the sample application created in this tutorial, the protected resource is the Microsoft Graph API *me* endpoint which displays the signed-in user's profile information.

## Test your application

You've completed creation of the application and are now ready to launch the Node.js web server and test the app's functionality.

1. Start the Node.js web server by running the following command from within the root of your project folder:

   ```console
   npm start
   ```
1. In your browser, navigate to `http://localhost:3000` or `http://localhost:<port>`, where `<port>` is the port that your web server is listening on. You should see the contents of your *index.html* file and the **Sign In** button.

### Sign in to the application

After the browser loads your *index.html* file, select **Sign In**. You're prompted to sign in with the Microsoft identity platform endpoint:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-01-signin-dialog.png" alt-text="Web browser displaying sign-in dialog":::

### Provide consent for application access

The first time you sign in to your application, you're prompted to grant it access to your profile and sign you in:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-02-consent-dialog.png" alt-text="Content dialog displayed in web browser":::

If you consent to the requested permissions, the web applications displays your user name, signifying a successful login:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-03-signed-in.png" alt-text="Results of a successful sign-in in the web browser":::

### Call the Graph API

After you sign in, select **See Profile** to view the user profile information returned in the response from the call to the Microsoft Graph API:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-04-see-profile.png" alt-text="Profile information from Microsoft Graph displayed in the browser":::

### More information about scopes and delegated permissions

The Microsoft Graph API requires the *user.read* scope to read a user's profile. By default, this scope is automatically added in every application that's registered in the Azure portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. For example, the Microsoft Graph API requires the *Mail.Read* scope in order to list the user's email.

As you add scopes, your users might be prompted to provide additional consent for the added scopes.

If a back-end API doesn't require a scope, which isn't recommended, you can use `clientId` as the scope in the calls to acquire tokens.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

In this tutorial, you created a JavaScript single-page application (SPA) that uses the Microsoft Authentication Library (MSAL) for JavaScript v2.0 to:

> [!div class="checklist"]
> * Perform the OAuth 2.0 authorization code flow with PKCE
> * Sign in personal Microsoft accounts as well as work and school accounts
> * Acquire an access token
> * Call Microsoft Graph or your own API that requires access tokens obtained from the Microsoft identity platform endpoint

To learn more about the authorization code flow, including the differences between the implicit and auth code flows, see [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

If you'd like to dive deeper into JavaScript single-page application development on the Microsoft identity platform, the multi-part [Scenario: Single-page application](scenario-spa-overview.md) series of articles can help you get started.
