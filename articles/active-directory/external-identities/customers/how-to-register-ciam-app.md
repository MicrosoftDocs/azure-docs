---
title: How-to - Register an app in Azure AD for customers
description: Learn about how to register an app in the customer tenant.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/02/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to register an app on the Azure portal.
---
# Register your app in the customer tenant

Azure AD for customers enables your organization to manage customers’ identities, and securely control access to your public facing applications and APIs. Applications where your customers can buy your products, subscribe to your services, or access their account and data.  Your customers only need to sign in on a device or a web browser once and have access to all your applications you granted them permissions.

Azure AD for customers supports authentication for various modern application architectures, for example Web app or Single-page app. The interaction of each application type with the customer tenant is different, therefore, you must specify the type of application you want to register.

In this article, you’ll learn how to register an application in your customer tenant.

## Prerequisites

- An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your Azure AD for customers tenant. If you don't already have one, sign up for a [free trial](https://aka.ms/ciam-hub-free-trial).

## Choose your app type

# [Single-page app (SPA)](#tab/spa)
## How to register your Single-page app?

[!INCLUDE [register app](../customers/includes/register-app/register-client-app-common.md)]

[!INCLUDE [add platform url](../customers/includes/register-app/add-platform-redirect-url-spa-common.md)] 

[!INCLUDE [add about redirect URI](../customers/includes/register-app/about-redirect-url.md)]  

### Add delegated permissions
This app signs in users. You can add delegated permissions to it, by following the steps below:

[!INCLUDE [grant permision for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)] 

### If you want to call an API follow the steps below (optional):
[!INCLUDE [grant permisions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

If you'd like to learn how to expose the permissions by adding a link, go to the [Web API](how-to-register-ciam-app.md?tabs=webapi) section.

## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
- [Sign in users in a sample vanilla JavaScript single-page app](how-to-single-page-app-vanillajs-sample-sign-in.md) 

# [Web app](#tab/webapp)
## How to register your Web app?

[!INCLUDE [register app](../customers/includes/register-app/register-client-app-common.md)]

[!INCLUDE [add platform url](../customers/includes/register-app/add-platform-redirect-url-web-app-common.md)] 

[!INCLUDE [add about redirect URI](../customers/includes/register-app/about-redirect-url.md)] 

### Add delegated permissions
This app signs in users. You can add delegated permissions to it, by following the steps below:

[!INCLUDE [grant permission for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)] 

[!INCLUDE [add a client secret](../customers/includes/register-app/add-app-client-secret.md)]

### If you want to call an API follow the steps below (optional):
[!INCLUDE [grant permissions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
- [Sign in users in a sample Node.js web app](how-to-web-app-node-sample-sign-in.md) 

# [Web API](#tab/webapi)
## How to register your Web API?

[!INCLUDE [register app](../customers/includes/register-app/register-api-app.md)]

### Expose permissions
This API needs to expose permissions, which a client needs to acquire to call it:

[!INCLUDE [expose permissions](../customers/includes/register-app/add-api-scopes.md)]

### If you want to add app roles follow the steps below (optional):

App roles enable the client app to obtain an access token as themselves. This is common when the client app isn't signing-in a user:
[!INCLUDE [configure app roles](../customers/includes/register-app/add-app-role.md)]

## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md) 

# [Desktop or Mobile app](#tab/desktopmobileapp)
## How to register your Desktop or Mobile app?

[!INCLUDE [register app](../customers/includes/register-app/register-client-app-common.md)]

[!INCLUDE [add platform url](../customers/includes/register-app/add-platform-redirect-url-mobile-desktop-common.md)]

[!INCLUDE [grant permission for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)]

### If you want to call an API follow the steps below (optional):
[!INCLUDE [grant permissions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
- [Sign in users in a sample Electron desktop app](how-to-desktop-app-electron-sample-sign-in.md) 

# [Daemon app](#tab/daemonapp)
## How to register your Daemon app?

[!INCLUDE [register daemon app](../customers/includes/register-app/register-daemon-app.md)]

### If you want to call an API follow the steps below (optional):
[!INCLUDE [register daemon app](../customers/includes/register-app/grant-api-permissions-app-permissions.md)]

## Next steps
 
- Learn more about a [daemon app that calls a web API in the daemon's name](/azure/active-directory/develop/authentication-flows-app-scenarios#daemon-app-that-calls-a-web-api-in-the-daemons-name)
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
