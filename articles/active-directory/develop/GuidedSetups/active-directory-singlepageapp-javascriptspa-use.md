---
title: Azure AD v2 JS SPA Guided Setup - Use | Microsoft Docs
description: How JavaScript SPA applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name    
author: andretms
manager: mbaldwin
editor: ''

ms.service: active-directory 
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/01/2017
ms.author: andret    

---
## Use the Microsoft Authentication Library (MSAL) to sign-in the user

1.	Create a file named `app.js`. If you are using Visual Studio, select the project (project root folder), right click and select: `Add` > `New Item` > `JavaScript File`:
2.	Add the following code to your `app.js` file:

```javascript
// Graph API endpoint to show user profile
var graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";

// Graph API scope used to obtain the access token to read user profile
var graphAPIScopes = ["https://graph.microsoft.com/user.read"];

// Initialize application
var userAgentApplication = new Msal.UserAgentApplication(msalconfig.clientID, null, loginCallback, {
    redirectUri: msalconfig.redirectUri
});

//Previous version of msal uses redirect url via a property
if (userAgentApplication.redirectUri) {
    userAgentApplication.redirectUri = msalconfig.redirectUri;
}

window.onload = function () {
    // If page is refreshed, continue to display user info
    if (!userAgentApplication.isCallback(window.location.hash) && window.parent === window && !window.opener) {
        var user = userAgentApplication.getUser();
        if (user) {
            callGraphApi();
        }
    }
}

/**
 * Call the Microsoft Graph API and display the results on the page. Sign the user in if necessary
 */
function callGraphApi() {
    var user = userAgentApplication.getUser();
    if (!user) {
        // If user is not signed in, then prompt user to sign in via loginRedirect.
        // This will redirect user to the Azure Active Directory v2 Endpoint
        userAgentApplication.loginRedirect(graphAPIScopes);
        // The call to loginRedirect above frontloads the consent to query Graph API during the sign-in.
        // If you want to use dynamic consent, just remove the graphAPIScopes from loginRedirect call.
        // As such, user will be prompted to give consent when requested access to a resource that 
        // he/she hasn't consented before. In the case of this application - 
        // the first time the Graph API call to obtain user's profile is executed.
    } else {
        // If user is already signed in, display the user info
        var userInfoElement = document.getElementById("userInfo");
        userInfoElement.parentElement.classList.remove("hidden");
        userInfoElement.innerHTML = JSON.stringify(user, null, 4);

        // Show Sign-Out button
        document.getElementById("signOutButton").classList.remove("hidden");

        // Now Call Graph API to show the user profile information:
        var graphCallResponseElement = document.getElementById("graphResponse");
        graphCallResponseElement.parentElement.classList.remove("hidden");
        graphCallResponseElement.innerText = "Calling Graph ...";

        // In order to call the Graph API, an access token needs to be acquired.
        // Try to acquire the token used to query Graph API silently first:
        userAgentApplication.acquireTokenSilent(graphAPIScopes)
            .then(function (token) {
                //After the access token is acquired, call the Web API, sending the acquired token
                callWebApiWithToken(graphApiEndpoint, token, graphCallResponseElement, document.getElementById("accessToken"));

            }, function (error) {
                // If the acquireTokenSilent() method fails, then acquire the token interactively via acquireTokenRedirect().
                // In this case, the browser will redirect user back to the Azure Active Directory v2 Endpoint so the user 
                // can reenter the current username/ password and/ or give consent to new permissions your application is requesting.
                // After authentication/ authorization completes, this page will be reloaded again and callGraphApi() will be executed on page load.
                // Then, acquireTokenSilent will then get the token silently, the Graph API call results will be made and results will be displayed in the page.
                if (error) {
                    userAgentApplication.acquireTokenRedirect(graphAPIScopes);
                }
            });

    }
}

/**
 * Callback method from sign-in: if no errors, call callGraphApi() to show results.
 * @param {string} errorDesc - If error occur, the error message
 * @param {object} token - The token received from login
 * @param {object} error - The error string
 * @param {string} tokenType - the token type: usually id_token
 */
function loginCallback(errorDesc, token, error, tokenType) {
    if (errorDesc) {
        showError(msal.authority, error, errorDesc);
    } else {
        callGraphApi();
    }
}

/**
 * Show an error message in the page
 * @param {string} endpoint - the endpoint used for the error message
 * @param {string} error - Error string
 * @param {string} errorDesc - Error description
 */
function showError(endpoint, error, errorDesc) {
    var formattedError = JSON.stringify(error, null, 4);
    if (formattedError.length < 3) {
        formattedError = error;
    }
    document.getElementById("errorMessage").innerHTML = "An error has occurred:<br/>Endpoint: " + endpoint + "<br/>Error: " + formattedError + "<br/>" + errorDesc;
    console.error(error);
}

```

<!--start-collapse-->
### More Information

After a user clicks the *‘Call Microsoft Graph API’* button for the first time, `callGraphApi` method calls `loginRedirect` to sign in the user. This method results in redirecting the user to the *Microsoft Azure Active Directory v2 endpoint* to prompt and validate the user's credentials. As a result of a successful sign-in, the user is redirected back to the original *index.html* page, and a token is received, processed by `msal.js` and the information contained in the token is cached. This token is known as the *ID token* and contains basic information about the user, such as the user display name. If you plan to use any data provided by this token for any purposes, you need to make sure this token is validated by your backend server to guarantee that the token was issued to a valid user for your application.

The SPA generated by this guide does not make use directly of the ID token – instead, it calls `acquireTokenSilent` and/or `acquireTokenRedirect` to acquire an *access token* used to query the Microsoft Graph API. If you need a sample that validates the ID token, take a look at [this](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2 "Github active-directory-javascript-singlepageapp-dotnet-webapi-v2 sample") sample application in GitHub – the sample uses an ASP.NET Web API for token validation.

#### Getting a user token interactively

After the initial sign-in, you do not want the ask users to reauthenticate every time they need to request a token to access a resource – so *acquireTokenSilent* should be used most of the time to acquire tokens. There are situations however that you need to force users interact with Azure Active Directory v2 endpoint – some examples include:
-	Users may need to reenter their credentials because the password has expired
-	Your application is requesting access to a resource that the user needs to consent to
-	Two factor authentication is required

Calling the *acquireTokenRedirect(scope)* result in redirecting users to the Azure Active Directory v2 endpoint (or *acquireTokenPopup(scope)* result on a popup window) where users need to interact with by either confirming their credentials, giving the consent to the required resource, or completing the two factor authentication.

#### Getting a user token silently
The ` acquireTokenSilent` method handles token acquisitions and renewal without any user interaction. After `loginRedirect` (or `loginPopup`) is executed for the first time, `acquireTokenSilent` is the method commonly used to obtain tokens used to access protected resources for subsequent calls - as calls to request or renew tokens are made silently.
`acquireTokenSilent` may fail in some cases – for example, the user's password has expired. Your application can handle this exception in two ways:

1.  Make a call to `acquireTokenRedirect` immediately, which results in prompting the user to sign in. This pattern is commonly used in online applications where there is no unauthenticated content in the application available to the user. The sample generated by this guided setup uses this pattern.

2. Applications can also make a visual indication to the user that an interactive sign-in is required, so the user can select the right time to sign in, or the application can retry `acquireTokenSilent` at a later time. This is commonly used when the user can use other functionality of the application without being disrupted - for example, there is unauthenticated content available in the application. In this case, the user can decide when they want to sign in to access the protected resource, or to refresh the outdated information.

<!--end-collapse-->

## Call the Microsoft Graph API using the token you just obtained

Add the following code to your `app.js` file:

```javascript
/**
 * Call a Web API using an access token.
 * @param {any} endpoint - Web API endpoint
 * @param {any} token - Access token
 * @param {object} responseElement - HTML element used to display the results
 * @param {object} showTokenElement = HTML element used to display the RAW access token
 */
function callWebApiWithToken(endpoint, token, responseElement, showTokenElement) {
    var headers = new Headers();
    var bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    var options = {
        method: "GET",
        headers: headers
    };

    fetch(endpoint, options)
        .then(function (response) {
            var contentType = response.headers.get("content-type");
            if (response.status === 200 && contentType && contentType.indexOf("application/json") !== -1) {
                response.json()
                    .then(function (data) {
                        // Display response in the page
                        console.log(data);
                        responseElement.innerHTML = JSON.stringify(data, null, 4);
                        if (showTokenElement) {
                            showTokenElement.parentElement.classList.remove("hidden");
                            showTokenElement.innerHTML = token;
                        }
                    })
                    .catch(function (error) {
                        showError(endpoint, error);
                    });
            } else {
                response.json()
                    .then(function (data) {
                        // Display response as error in the page
                        showError(endpoint, data);
                    })
                    .catch(function (error) {
                        showError(endpoint, error);
                    });
            }
        })
        .catch(function (error) {
            showError(endpoint, error);
        });
}
```
<!--start-collapse-->

### More information on making a REST call against a protected API

In the sample application created by this guide, the `callWebApiWithToken()` method is used to make an HTTP `GET` request against a protected resource that requires a token and then return the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. For the sample application created by this guide, the resource is the Microsoft Graph API *me* endpoint – which displays the user's profile information.

<!--end-collapse-->

## Add a method to sign out the user

Add the following code to your `app.js` file:

```javascript
/**
 * Sign-out the user
 */
function signOut() {
    userAgentApplication.logout();
}
```
