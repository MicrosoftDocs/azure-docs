---
title: Use MSAL with Azure Active Directory B2CLearn | Azure
titleSuffix: Microsoft identity platform
description: Microsoft Authentication Library for JavaScript (MSAL.js) enables applications to work with Azure AD B2C and acquire tokens to call secured Web APIs. These web APIs can be Microsoft Graph, other Microsoft APIs, web APIs from others, or your own web API.
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/16/2019
ms.author: negoe 
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about Microsoft Authentication Library so that I can decide if this platform meets my application development needs and requirements.
---

# Use Microsoft Authentication Library for JavaScript to work with Azure Active Directory B2C

[Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js) enables JavaScript developers to authenticate users with social and local identities using [Azure Active Directory B2C (Azure AD B2C)](https://docs.microsoft.com/azure/active-directory-b2c/). By using Azure AD B2C as an identity management service, you can customize and control how customers sign up, sign in, and manage their profiles when they use your applications.

Azure AD B2C also enables you to brand and customize the UI of your applications during the authentication process in order to provide a seamless experience to your customers.

This article demonstrates how to use MSAL.js to work with Azure AD B2C and summarizes key points that you should be aware of. For a complete discussion and tutorial, please consult [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/overview).

## Prerequisites

If you haven't already created your own [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant), start with creating one now (you also can use an existing Azure AD B2C tenant if you have one already).

This demonstration contains two parts:

- how to protect a web API.
- how to register a single-page application to authenticate and call *that* web API.

## Node.js Web API

> [!NOTE]
> At this moment, MSAL.js for Node is still in development (see the [roadmap](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki#roadmap)). In the meantime, we suggest using [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad), an authentication library for Node.js developed and supported by Microsoft.

The following steps demonstrate how a **web API** can use Azure AD B2C to protect itself and expose selected scopes to a client application.

### Step 1: Register your application

To protect your web API with Azure AD B2C, you first need to register it. See [Register your application](https://docs.microsoft.com/azure/active-directory-b2c/add-web-application?tabs=applications) for detailed steps.

### Step 2: Download the sample application

Download the sample as a zip file, or clone it from GitHub:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

### Step 3: Configure authentication

1. Open the `config.js` file in the sample.

2. Configure the sample with the application credentials that you obtained earlier while registering your application. Change the following lines of code by replacing the values with the names of your clientID, host, tenantId and policy name.

```JavaScript
const clientID = "<Application ID for your Node.js Web API - found on Properties page in Azure portal e.g. 93733604-cc77-4a3c-a604-87084dd55348>";
const b2cDomainHost = "<Domain of your B2C host eg. fabrikamb2c.b2clogin.com>";
const tenantId = "<your-tenant-ID>.onmicrosoft.com"; // Alternatively, you can use your Directory (tenant) ID (GUID)
const policyName = "<Name of your sign in / sign up policy, e.g. B2C_1_signupsignin1>";
```

For more information, check out this [Node.js B2C web API sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi).

---

## JavaScript SPA

The following steps demonstrate how a **single-page application** can use Azure AD B2C to sign up, sign in, and call a protected web API.

### Step 1: Register your application

To implement authentication, you first need to register your application. See [Register your application](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications) for detailed steps.

### Step 2: Download the sample application

Download the sample as a zip file, or clone it from GitHub:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
```

### Step 3: Configure authentication

There are two points of interest in configuring your application:

- Configure API endpoint and exposed scopes
- Configure authentication parameters and token scopes

1. Open the `apiConfig.js` file in the sample.

2. Configure the sample with the parameters that you obtained earlier while registering your web API. Change the following lines of code by replacing the values with the address of your web API and exposed scopes.

   ```javascript
    // The current application coordinates were pre-registered in a B2C tenant.
    const apiConfig = {
        b2cScopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"], //API scopes you exposed during api registration
        webApi: "https://fabrikamb2chello.azurewebsites.net/hello" 
    };
   ```

3. Open the `authConfig.js` file in the sample.

4. Configure the sample with the parameters that you obtained earlier while registering your single-page application. Change the following lines of code by replacing the values with your ClientId, authority metadata and token request scopes.

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

---

## Next steps

Learn more about:
- [User flows](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows)
- [Custom policies](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started)
- [UX customization](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-configure-user-input)
