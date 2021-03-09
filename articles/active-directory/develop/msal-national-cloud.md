---
title: Use MSAL in a national cloud app | Azure
titleSuffix: Microsoft identity platform
description: The Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured web APIs. These web APIs can be Microsoft Graph, other Microsoft APIs, partner web APIs, or your own web API. MSAL supports multiple application architectures and platforms.
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/22/2019
ms.author: negoe
ms.reviewer: marsma, nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about how the Microsoft Authentication Library works in national cloud scenarios so I can decide if this platform meets my application development needs.
---

# Use MSAL in a national cloud environment

[National clouds](authentication-national-cloud.md), also known as Sovereign clouds, are physically isolated instances of Azure. These regions of Azure help make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

In addition to the Microsoft worldwide cloud, the Microsoft Authentication Library (MSAL) enables application developers in national clouds to acquire tokens in order to authenticate and call secured web APIs. These web APIs can be Microsoft Graph or other Microsoft APIs.

Including the global cloud, Azure Active Directory (Azure AD) is deployed in the following national clouds:  

- Azure Government
- Azure China 21Vianet
- Azure Germany

This guide demonstrates how to sign in to work and school accounts, get an access token, and call the Microsoft Graph API in the [Azure Government cloud](https://azure.microsoft.com/global-infrastructure/government/) environment.

## Prerequisites

Before you start, make sure that you meet these prerequisites.

### Choose the appropriate identities

[Azure Government](../../azure-government/index.yml) applications can use Azure AD Government identities and Azure AD Public identities to authenticate users. Because you can use any of these identities, decide which authority endpoint you should choose for your scenario:

- Azure AD Public: Commonly used if your organization already has an Azure AD Public tenant to support Microsoft 365 (Public or GCC) or another application.
- Azure AD Government: Commonly used if your organization already has an Azure AD Government tenant to support Office 365 (GCC High or DoD) or is creating a new tenant in Azure AD Government.

After you decide, a special consideration is where you perform your app registration. If you choose Azure AD Public identities for your Azure Government application, you must register the application in your Azure AD Public tenant.

### Get an Azure Government subscription

To get an Azure Government subscription, see [Managing and connecting to your subscription in Azure Government](../../azure-government/compare-azure-government-global-azure.md).

If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

For details about using a national cloud with a particular programming language, choose the tab matching your language:

## [.NET](#tab/dotnet)

You can use MSAL.NET to sign in users, acquire tokens, and call the Microsoft Graph API in national clouds.

The following tutorials demonstrate how to build a .NET Core 2.2 MVC Web app. The app uses OpenID Connect to sign in users with a work and school account in an organization that belongs to a national cloud.

- To sign in users and acquire tokens, follow this tutorial: [Build an ASP.NET Core Web app signing-in users in sovereign clouds with the Microsoft identity platform](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-4-Sovereign#build-an-aspnet-core-web-app-signing-in-users-in-sovereign-clouds-with-the-microsoft-identity-platform).
- To call the Microsoft Graph API, follow this tutorial: [Using the Microsoft identity platform to call the Microsoft Graph API from an ASP.NET Core 2.x web app, on behalf of a user signing-in using their work and school account in Microsoft National Cloud](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-4-Sovereign-Call-MSGraph#using-the-microsoft-identity-platform-to-call-the-microsoft-graph-api-from-an-an-aspnet-core-2x-web-app-on-behalf-of-a-user-signing-in-using-their-work-and-school-account-in-microsoft-national-cloud).

## [JavaScript](#tab/javascript)

To enable your MSAL.js application for sovereign clouds:

### Step 1: Register your application

1. Sign in to the <a href="https://portal.azure.us/" target="_blank">Azure portal</a>.

   To find Azure portal endpoints for other national clouds, see [App registration endpoints](authentication-national-cloud.md#app-registration-endpoints).

1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a **Name** for your application. Users of your app might see this name, and you can change it later.
1. Under **Supported account types**, select **Accounts in any organizational directory**.
1. In the **Redirect URI** section, select the **Web** platform and set the value to the application's URL based on your web server. See the next sections for instructions on how to set and obtain the redirect URL in Visual Studio and Node.
1. Select **Register**.
1. On the **Overview** page, note down the **Application (client) ID** value for later use.
    This tutorial requires you to enable the [implicit grant flow](v2-oauth2-implicit-grant-flow.md). 
1. Under **Manage**, select **Authentication**.
1. Under **Implicit grant and hybrid flows**, select **ID tokens** and **Access tokens**. ID tokens and access tokens are required because this app needs to sign in users and call an API.
1. Select **Save**.

### Step 2:  Set up your web server or project

- [Download the project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip) for a local web server, such as Node.

  or

- [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/vsquickstart.zip).

Then skip to [Configure your JavaScript SPA](#step-4-configure-your-javascript-spa) to configure the code sample before running it.

### Step 3: Use the Microsoft Authentication Library to sign in the user

Follow steps in the [JavaScript tutorial](tutorial-v2-javascript-spa.md#create-your-project) to create your project and integrate with MSAL to sign in the user.

### Step 4: Configure your JavaScript SPA

In the `index.html` file created during project setup, add the application registration information. Add the following code at the top within the `<script></script>` tags in the body of your `index.html` file:

```javascript
const msalConfig = {
    auth:{
        clientId: "Enter_the_Application_Id_here",
        authority: "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here",
        }
}

const graphConfig = {
        graphEndpoint: "https://graph.microsoft.us",
        graphScopes: ["user.read"],
}

// create UserAgentApplication instance
const myMSALObj = new UserAgentApplication(msalConfig);
```

In that code:

- `Enter_the_Application_Id_here` is the **Application (client) ID** value for the application that you registered.
- `Enter_the_Tenant_Info_Here` is set to one of the following options:
    - If your application supports **Accounts in this organizational directory**, replace this value with the tenant ID or tenant name (for example, contoso.microsoft.com).
    - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`.

    To find authentication endpoints for all the national clouds, see [Azure AD authentication endpoints](./authentication-national-cloud.md#azure-ad-authentication-endpoints).

    > [!NOTE]
    > Personal Microsoft accounts are not supported in national clouds.

- `graphEndpoint` is the Microsoft Graph endpoint for the Microsoft cloud for US government.

   To find Microsoft Graph endpoints for all the national clouds, see [Microsoft Graph endpoints in national clouds](/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints).

## [Python](#tab/python)

To enable your MSAL Python application for sovereign clouds:

- Register your application in a specific portal, depending on the cloud. For more information on how to choose the portal refer [App registration endpoints](authentication-national-cloud.md#app-registration-endpoints)
- Use any of the [samples](https://github.com/AzureAD/microsoft-authentication-library-for-python/tree/dev/sample) from the repo with a few changes to the configuration, depending on the cloud, which is mentioned next.
- Use a specific authority, depending on the cloud you registered the application in. For more information on authorities for different clouds, refer [Azure AD Authentication endpoints](authentication-national-cloud.md#azure-ad-authentication-endpoints).

    Here's an example authority:

    ```json
    "authority": "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here"
    ```

- Calling the Microsoft Graph API requires an endpoint URL specific to the cloud you are using. To find Microsoft Graph endpoints for all the national clouds, refer to [Microsoft Graph and Graph Explorer service root endpoints](/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints).

    Here's an example of a Microsoft Graph endpoint, with scope:

    ```json
    "endpoint" : "https://graph.microsoft.us/v1.0/me"
    "scope": "User.Read"
    ```

## [Java](#tab/java)

To enable your MSAL for Java application for sovereign clouds:

- Register your application in a specific portal, depending on the cloud. For more information on how to choose the portal refer [App registration endpoints](authentication-national-cloud.md#app-registration-endpoints)
- Use any of the [samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/tree/dev/src/samples) from the repo with a few changes to the configuration, depending on the cloud, which are mentioned next.
- Use a specific authority, depending on the cloud you registered the application in. For more information on authorities for different clouds, refer [Azure AD Authentication endpoints](authentication-national-cloud.md#azure-ad-authentication-endpoints).

Here's an example authority:

```json
"authority": "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here"
```

- Calling the Microsoft Graph API requires an endpoint URL specific to the cloud you are using. To find Microsoft Graph endpoints for all the national clouds, refer to [Microsoft Graph and Graph Explorer service root endpoints](/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints).

Here's an example of a graph endpoint, with scope:

```json
"endpoint" : "https://graph.microsoft.us/v1.0/me"
"scope": "User.Read"
```

## [Objective-C](#tab/objc)

MSAL for iOS and macOS can be used to acquire tokens in national clouds, but it requires additional configuration when creating `MSALPublicClientApplication`.

For instance, if you want your application to be a multi-tenant application in a national cloud (here US Government), you could write:

```objc
MSALAADAuthority *aadAuthority =
                [[MSALAADAuthority alloc] initWithCloudInstance:MSALAzureUsGovernmentCloudInstance
                                                   audienceType:MSALAzureADMultipleOrgsAudience
                                                      rawTenant:nil
                                                          error:nil];

MSALPublicClientApplicationConfig *config =
                [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"
                                                                redirectUri:@"<your-redirect-uri-here>"
                                                                  authority:aadAuthority];

NSError *applicationError = nil;
MSALPublicClientApplication *application =
                [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&applicationError];
```

## [Swift](#tab/swift)

MSAL for iOS and macOS can be used to acquire tokens in national clouds, but it requires additional configuration when creating `MSALPublicClientApplication`.

For instance, if you want your application to be a multi-tenant application in a national cloud (here US Government), you could write:

```swift
let authority = try? MSALAADAuthority(cloudInstance: .usGovernmentCloudInstance, audienceType: .azureADMultipleOrgsAudience, rawTenant: nil)

let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>", redirectUri: "<your-redirect-uri-here>", authority: authority)
if let application = try? MSALPublicClientApplication(configuration: config) { /* Use application */}
```

---

## Next steps

See [National cloud authentication endpoints](authentication-national-cloud.md) for a list of the Azure portal URLs and token endpoints for each cloud.

National cloud documentation:

- [Azure Government](../../azure-government/index.yml)
- [Azure China 21Vianet](/azure/china/)
- [Azure Germany](../../germany/index.yml)