---
title: Use MSAL.js with Azure AD B2C
titleSuffix: Microsoft identity platform
description: Microsoft Authentication Library for JavaScript (MSAL.js) enables applications to work with Azure AD B2C and acquire tokens to call secured web APIs. These web APIs can be Microsoft Graph, other Microsoft APIs, web APIs from others, or your own web API.
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 06/05/2020
ms.author: negoe
ms.reviewer: nacanuma
ms.custom: aaddev
# Customer intent: As an application developer, I want to learn how MSAL.js can be used with Azure AD B2C for
# authentication and authorization in my organization's web apps and web APIs that my customers log in to and use.
---

# Use Microsoft Authentication Library for JavaScript to work with Azure AD B2C

[Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js) enables JavaScript developers to authenticate users with social and local identities using [Azure Active Directory B2C](../../active-directory-b2c/overview.md) (Azure AD B2C).

By using Azure AD B2C as an identity management service, you can customize and control how your customers sign up, sign in, and manage their profiles when they use your applications. Azure AD B2C also enables you to brand and customize the UI that your application displays during the authentication process.

The following sections demonstrate how to:

- Protect a Node.js web API
- Support sign-in in a single-page application (SPA) and call *that* protected web API
- Enable password reset support

## Prerequisites

If you haven't already, create an [Azure AD B2C tenant](../../active-directory-b2c/tutorial-create-tenant.md).

## Node.js web API

The following steps demonstrate how a **web API** can use Azure AD B2C to protect itself and expose selected scopes to a client application.

MSAL.js for Node is currently in development. For more information, see the [roadmap](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki#roadmap) on GitHub. We currently recommend using [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad), an authentication library for Node.js developed and supported by Microsoft.

### Step 1: Register your application

To protect your web API with Azure AD B2C, you first need to register it. See [Register your application](../../active-directory-b2c/add-web-application.md) for detailed steps.

### Step 2: Download the sample application

Download the sample as a zip file, or clone it from GitHub:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

### Step 3: Configure authentication

1. Open the `config.js` file in the sample.

2. Configure the sample with the application credentials that you obtained earlier while registering your application. Change the following lines of code by replacing the values with the names of your clientID, host, tenantId and policy name.

```JavaScript
const clientID = "<Application ID for your Node.js web API - found on Properties page in Azure portal e.g. 93733604-cc77-4a3c-a604-87084dd55348>";
const b2cDomainHost = "<Domain of your B2C host eg. fabrikamb2c.b2clogin.com>";
const tenantId = "<your-tenant-ID>.onmicrosoft.com"; // Alternatively, you can use your Directory (tenant) ID (GUID)
const policyName = "<Name of your sign in / sign up policy, e.g. B2C_1_signupsignin1>";
```

For more information, check out this [Node.js B2C web API sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi).

## JavaScript SPA

The following steps demonstrate how a **single-page application** can use Azure AD B2C to sign up, sign in, and call a protected web API.

### Step 1: Register your application

To implement authentication, you first need to register your application. See [Register your application](../../active-directory-b2c/tutorial-register-applications.md) for detailed steps.

### Step 2: Download the sample application

Download the code sample's [.ZIP archive](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/archive/master.zip) or clone the GitHub repository:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
```

### Step 3: Configure authentication

There are two points of interest in configuring your application:

- Configure API endpoint and exposed scopes
- Configure authentication parameters and token scopes

1. Open the *apiConfig.js* file in the sample.

2. Configure the sample with the parameters that you obtained earlier while registering your web API. Change the following lines of code by replacing the values with the address of your web API and exposed scopes.

   ```javascript
    // The current application coordinates were pre-registered in a B2C tenant.
    const apiConfig = {
        b2cScopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"], //API scopes you exposed during api registration
        webApi: "https://fabrikamb2chello.azurewebsites.net/hello"
    };
   ```

1. Open the *authConfig.js* file in the sample.

1. Configure the sample with the parameters that you obtained earlier while registering your single-page application. Change the following lines of code by replacing the values with your ClientId, authority metadata and token request scopes.

   ```javascript
    // Config object to be passed to Msal on creation.
    const msalConfig = {
        auth: {
            clientId: "e760cab2-b9a1-4c0d-86fb-ff7084abd902",
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_signupsignin1",
            validateAuthority: false
        },
        cache: {
            cacheLocation: "localStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false // Set this to "true" to save cache in cookies
        }
    };

    // Add here scopes for id token to be used at the MS Identity Platform endpoint
    const loginRequest = {
        scopes: ["openid", "profile"],
    };
   ```

For more information, check out this [JavaScript B2C single-page application sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

## Support password reset

In this section, you extend your single-page application to use the Azure AD B2C password reset user flow. Although MSAL.js doesn't currently support multiple user flows or custom policies natively, you're able to use the library to handle common use cases like password reset.

The following steps assume you've already followed the steps in the preceding [JavaScript SPA](#javascript-spa) section.

### Step 1: Define the authority string for password reset user flow

1. First, create an object where you store your authority URIs:

    ```javascript
        const b2cPolicies = {
            names: {
                signUpSignIn: "b2c_1_susi",
                forgotPassword: "b2c_1_reset"
            },
            authorities: {
                signUpSignIn: {
                    authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi",
                },
                forgotPassword: {
                    authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_reset",
                },
            },
        }
    ```

1. Next, initialize your MSAL object with the `signInSignUp` policy as default (see the preceding code snippet). When a user attempts to login, they're presented with the following screen:

    :::image type="content" source="media/msal-b2c-overview/user-journey-01-signin.png" alt-text="Sign-in screen displayed by Azure AD B2C":::

### Step 2: Catch and handle authentication errors in your login method

When a user selects **Forgot password**, your application throws an error which you should catch in your code, and then handle by presenting the appropriate user flow. In this case, the `b2c_1_reset` password reset flow.

1. Extend your sign-in method as follows:

    ```javascript
    function signIn() {
      myMSALObj.loginPopup(loginRequest)
        .then(loginResponse => {
            console.log("id_token acquired at: " + new Date().toString());

            if (myMSALObj.getAccount()) {
              updateUI();
            }

        }).catch(function (error) {
          console.log(error);

          // error handling
          if (error.errorMessage) {
            // check for forgot password error
            if (error.errorMessage.indexOf("AADB2C90118") > -1) {

              //call login method again with the password reset user flow
              myMSALObj.loginPopup(b2cPolicies.authorities.forgotPassword)
                .then(loginResponse => {
                  console.log(loginResponse);
                  window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
                })
            }
          }
        });
    }
    ```

1. The preceding code snippet shows you how to show the password reset screen after catching the error with the code `AADB2C90118`.

    After resetting their password, the user is returned back to the application to sign in again.

    :::image type="content" source="media/msal-b2c-overview/user-journey-02-password-reset.png" alt-text="Password reset flow screens showed by Azure AD B2C" border="false":::

    For more information about error codes and handling exceptions, see [MSAL error and exception codes](msal-handling-exceptions.md).

## Next steps

Learn more about these Azure AD B2C concepts:

- [User flows](../../active-directory-b2c/tutorial-create-user-flows.md)
- [Custom policies](../../active-directory-b2c/custom-policy-get-started.md)
- [UX customization](../../active-directory-b2c/custom-policy-configure-user-input.md)
