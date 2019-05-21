---
title: Learn how to integrate with Azure AD B2C using Microsoft Authentication Library (MSAL) 
description: Microsoft Authentication Library (MSAL) enables application developers to integrate with Azure AD B2C and acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third-party Web APIs, or your own Web API.
services: active-directory
documentationcenter: dev-center-name
author: negoe
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/04/2019
ms.author: negoe 
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Integrate Microsoft Authentication Library (MSAL) with Azure Active Directory B2C

Microsoft Authentication Library (MSAL) enables application developers to authenticate users with social and local identities using [Azure Active Directory (Azure AD) B2C](https://docs.microsoft.com/azure/active-directory-b2c/). Azure Active Directory (Azure AD) B2C is an identity management service that enables you to customize and control how customers sign up, sign in, and manage their profiles when using your applications.

Azure Active Directory (Azure AD) B2C also enables you to brand and customize the user interface (UI) of your applications to provide a seamless experience to your customer.

This tutorial demonstrates how to use Microsoft Authentication Library (MSAL) to integrate with Azure Active Directory (Azure AD) B2C.


## Prerequisites

If you haven't already created your own [Azure AD B2C Tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant), create one now. You can use an existing Azure AD B2C tenant. 

## Javascript

Following steps demonstrates how a single-page application can use Azure AD B2C for user sign-up, sign-in, and call a protected web API.

### Step 1: Register your application

To implement authentication, first you need to register your application. To register your app, follow [register your application](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp#step-4-register-your-own-web-application-with-azure-ad-b2c) for detailed steps.

### Steps 2: Download Applications

Download a zip file or clone the sample from GitHub.
>git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git

### Steps 3: Authentication

1. Open the index.html file in the sample.

2. Configure the sample with the application ID and key that you recorded earlier while registering your application. Change the following lines of code by replacing the values with the names of your directory and APIs:

```javascript
// The current application coordinates were pre-registered in a B2C directory.

const msalConfig = {
    auth:{
        clientId: "Enter_the_Application_Id_here",
        authority: "https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>",
        b2cScopes: ["https://<your-tenant-name>.onmicrosoft.com/hello/demo.read"],
        webApi: 'http://localhost:5000/hello',
  };

// create UserAgentApplication instance
const myMSALObj = new UserAgentApplication(msalConfig);
```

The name of the [user flow](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-policies) used in this tutorial is B2C_1_signupsignin1. If you're using a different user flow name, use your user flow name in authority value.


### Configure application to use `b2clogin.com`

You can use `b2clogin.com` in place of `login.microsoftonline.com` as a redirect url, when you set up an identity provider for sign-up and sign-in in your Azure Active Directory (Azure AD) B2C application.

**`b2clogin.com`** i.e 
`https://your-tenant-name.b2clogin.com/your-tenant-guid` is used for following:

- Space consumed in the cookie header by Microsoft services is reduced.
- Your URLs no longer include a reference to Microsoft. For example, 
your Azure AD B2C application probably refers to login.microsoftonline.com


 To use 'b2clogin.com', you need to update the configuration of your application.  

1. Update ValidateAuthority: set the **validateAuthority** property to `false`. When **validateAuthority** is set to false, redirects are allowed to b2clogin.com.

The following example shows how you might set the property:
```javascript
// The current application coordinates were pre-registered in a B2C directory.

const msalConfig = {
    auth:{
        clientId: "Enter_the_Application_Id_here",
        authority: "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_signupsignin1",
        b2cScopes: ["https://contoso.onmicrosoft.com/demoapi/demo.read"],
        webApi: 'https://contosohello.azurewebsites.net/hello',
        validateAuthority: false;

};
// create UserAgentApplication instance
const myMSALObj = new UserAgentApplication(msalConfig);
```

> [!NOTE]
> Your Azure AD B2C application probably refers to login.microsoftonline.com in several places, such as your user flow references and token endpoints. Make sure that your authorization endpoint, token endpoint, and issuer have been updated to use your-tenant-name.b2clogin.com.

Follow this [MSAL JS sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp#single-page-application-built-on-msaljs-with-azure-ad-b2c) on how to use the Microsoft Authentication Library Preview for JavaScript (msal.js) to get an access token and call an API secured by Azure AD B2C.

## Next steps

Learn more about:

- [Custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-overview-custom)
- [User interface customization](https://docs.microsoft.com/azure/active-directory-b2c/customize-ui-overview)