---
title: Register an app in Microsoft Entra ID for customers
description: Learn about how to register an app in the customer tenant.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/12/2023

ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to register an app on the Microsoft Entra admin center.
---
# Register your app in the customer tenant

Microsoft Entra ID for customers enables your organization to manage customers’ identities, and securely control access to your public facing applications and APIs. Applications where your customers can buy your products, subscribe to your services, or access their account and data.  Your customers only need to sign in on a device or a web browser once and have access to all your applications you granted them permissions.

To enable your application to sign in with External ID for customers, you need to register your app with External ID for customers. The app registration establishes a trust relationship between the app and External ID for customers.
During app registration, you specify the redirect URI. The redirect URI is the endpoint to which users are redirected by External ID for customers after they authenticate. The app registration process generates an application ID, also known as the client ID, that uniquely identifies your app.

External ID for customers supports authentication for various modern application architectures, for example web app or single-page app. The interaction of each application type with the customer tenant is different, therefore, you must specify the type of application you want to register.

In this article, you learn how to register an application in your customer tenant.

## Prerequisites

- An Azure account that has an active subscription. <a href="https://azure.microsoft.com/free/?WT.mc_id=A261C142F" target="_blank">Create an account for free</a>.
- Your Microsoft Entra ID for customers tenant. If you don't already have one, sign up for a <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">free trial</a>.

## Choose your app type

# [Single-page app (SPA)](#tab/spa)
## Register your Single-page app

External ID for customers supports authentication for Single-page apps (SPAs).

The following steps show you how to register your SPA in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../../roles/permissions-reference.md#application-developer).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 

1. Browse to **Identity** > **Applications** > **App registrations**.

1. Select **+ New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:
    
    1. In the **Name** section, enter a meaningful application name that is displayed to users of the app, for example *ciam-client-app*.
    
    1. Under **Supported account types**, select **Accounts in this organizational directory only**.
	
	1. Under **Redirect URI (optional)**, select **Single-page application (SPA)** and then, in the URL box, enter `http://localhost:3000/`.

1. Select **Register**.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

[!INCLUDE [add about redirect URI](../customers/includes/register-app/about-redirect-url.md)]  

### Grant delegated permissions
This app signs in users. You can add delegated permissions to it, by following the steps below:

[!INCLUDE [grant permission for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)] 

### Grant API permissions (optional):

If your SPA needs to call an API, you must grant your SPA API permissions so it can call the API. You must also [register the web API](how-to-register-ciam-app.md?tabs=webapi) that you need to call. 

[!INCLUDE [grant permissions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

If you'd like to learn how to expose the permissions by adding a link, go to the [Web API](how-to-register-ciam-app.md?tabs=webapi) section.

# [Web app](#tab/webapp)
## Register your Web app

External ID for customers supports authentication for web apps.

The following steps show you how to register your web app in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../../roles/permissions-reference.md#application-developer). 

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 

1. Browse to **Identity** > **Applications** > **App registrations**.

1. Select **+ New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:
    
    1. In the **Name** section, enter a meaningful application name that is displayed to users of the app, for example *ciam-client-app*.
    
    1. Under **Supported account types**, select **Accounts in this organizational directory only**.
	
	1. Under **Redirect URI (optional)**, select **Web** and then, in the URL box, enter a URL such as, `http://localhost:3000/`.

1. Select **Register**.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

[!INCLUDE [add about redirect URI](../customers/includes/register-app/about-redirect-url.md)] 

### Add delegated permissions
This app signs in users. You can add delegated permissions to it, by following the steps below:

[!INCLUDE [grant permission for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)] 

### Create a client secret 
[!INCLUDE [add a client secret](../customers/includes/register-app/add-app-client-secret.md)]

### Grant API permissions (optional)

If your web app needs to call an API, you must grant your web app API permissions so it can call the API. You must also [register the web API](how-to-register-ciam-app.md?tabs=webapi) that you need to call.

[!INCLUDE [grant permissions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

# [Web API](#tab/webapi)
## Register your Web API


[!INCLUDE [register app](../customers/includes/register-app/register-api-app.md)]

### Expose permissions

[!INCLUDE [expose permissions](../customers/includes/register-app/add-api-scopes.md)]

### Add app roles

[!INCLUDE [configure app roles](../customers/includes/register-app/add-app-role.md)]

# [Desktop or Mobile app](#tab/desktopmobileapp)
## Register your Desktop or Mobile app

The following steps show you how to register your app in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../../roles/permissions-reference.md#application-developer). 

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 

1. Browse to **Identity** > **Applications** > **App registrations**.

1. Select **+ New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:
    
    1. In the **Name** section, enter a meaningful application name that is displayed to users of the app, for example *ciam-client-app*.
    
    1. Under **Supported account types**, select **Accounts in this organizational directory only**.
	
	1. Under **Redirect URI (optional)**, select the **Mobile and desktop applications** option and then, in the URL box, enter a URI with a unique scheme. For example, Electron desktop app's redirect URI looks something similar to `http://localhost` while that of a .NET Multi-platform App UI (MAUI) looks similar to `msal{ClientId}://auth`. 

1. Select **Register**.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

### Add delegated permissions
[!INCLUDE [grant permission for signing in users](../customers/includes/register-app/grant-api-permission-sign-in.md)]

### Grant API permissions (optional)

If your mobile app needs to call an API, you must grant your mobile app API permissions so it can call the API. You must also [register the web API](how-to-register-ciam-app.md?tabs=webapi) that you need to call.
[!INCLUDE [grant permissions for calling an API](../customers/includes/register-app/grant-api-permission-call-api.md)] 

# [Daemon app](#tab/daemonapp)
## Register your Daemon app

[!INCLUDE [register daemon app](../customers/includes/register-app/register-daemon-app.md)]

### Grant API permissions

A daemon app signs-in as itself using the [OAuth 2.0 client credentials flow](../../develop/v2-oauth2-client-creds-grant-flow.md). You grant application permissions (app roles), which is required by apps that authenticate as themselves. You must also [register the web API](how-to-register-ciam-app.md?tabs=webapi) that your daemon app needs to call. 

[!INCLUDE [register daemon app](../customers/includes/register-app/grant-api-permissions-app-permissions.md)]

# [Microsoft Graph API](#tab/graphapi)
## Register a Microsoft Graph API application
[!INCLUDE [register client app](../customers/includes/register-app/register-client-app-common.md)]

### Grant API Access to your application
[!INCLUDE [grant api access to app](../customers/includes/register-app/grant-api-access-app.md)]

### Create a client secret 
[!INCLUDE [add app client secret](../customers/includes/register-app/add-app-client-secret.md)]

---

[!INCLUDE [find the application ID](../customers/includes/register-app/find-application-id.md)] 

## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
