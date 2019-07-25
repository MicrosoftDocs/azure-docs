---
title: Learn how applications can interoperate with Azure AD B2C by using Microsoft Authentication Library 
description: Microsoft Authentication Library (MSAL) enables applications to interoperate with Azure AD B2C and acquire tokens to call secured Web APIs. These web APIs can be Microsoft Graph, other Microsoft APIs, web APIs from others, or your own web API.
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
#Customer intent: As an application developer, I want to learn about Microsoft Authentication Library so that I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Use Microsoft Authentication Library to interoperate with Azure Active Directory B2C

Microsoft Authentication Library (MSAL) enables application developers to authenticate users with social and local identities by using [Azure Active Directory B2C (Azure AD B2C)](https://docs.microsoft.com/azure/active-directory-b2c/). Azure AD B2C is an identity management service. By using it, you can customize and control how customers sign up, sign in, and manage their profiles when they use your applications.

Azure AD B2C also enables you to brand and customize the UI of your applications to provide a seamless experience to your customers.

This tutorial demonstrates how to use MSAL to interoperate with Azure AD B2C.

## Prerequisites

If you haven't already created your own [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant), create one now. You also can use an existing Azure AD B2C tenant.

## JavaScript

The following steps demonstrate how a single-page application can use Azure AD B2C to sign up, sign in, and call a protected web API.

### Step 1: Register your application

To implement authentication, you first need to register your application. See [Register your application](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp#step-4-register-your-own-web-application-with-azure-ad-b2c) for detailed steps.

### Step 2: Download the sample application

Download the sample as a zip file, or clone it from GitHub:

```
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
```

### Step 3: Configure authentication

1. Open the **index.html** file in the sample.

1. Configure the sample with the application ID and key that you recorded earlier while registering your application. Change the following lines of code by replacing the values with the names of your directory and APIs:

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

The name of the [user flow](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-policies) in this tutorial is **B2C_1_signupsignin1**. If you're using a different user flow name, set the **authority** value to that name.

### Step 4: Configure your application to use `b2clogin.com`

You can use `b2clogin.com` in place of `login.microsoftonline.com` as a redirect URL. You do so in your Azure AD B2C application when you set up an identity provider for sign-up and sign-in.

Use of `b2clogin.com` in the context of `https://your-tenant-name.b2clogin.com/your-tenant-guid` has the following effects:

- Microsoft services consume less space in the cookie header.
- Your URLs no longer include a reference to Microsoft. For example, your Azure AD B2C application probably refers to `login.microsoftonline.com`.

 To use `b2clogin.com`, you need to update the configuration of your application.  

- Set the **validateAuthority** property to `false`, so that redirects using `b2clogin.com` can occur.

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
> Your Azure AD B2C application probably refers to `login.microsoftonline.com` in several places, such as your user flow references and token endpoints. Make sure that your authorization endpoint, token endpoint, and issuer have been updated to use `your-tenant-name.b2clogin.com`.

Follow [this MSAL JavaScript sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp#single-page-application-built-on-msaljs-with-azure-ad-b2c) on how to use the MSAL Preview for JavaScript (MSAL.js). The sample gets an access token and calls an API secured by Azure AD B2C.

## Next steps

Learn more about:

- [Custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-overview-custom)
- [User interface customization](https://docs.microsoft.com/azure/active-directory-b2c/customize-ui-overview)