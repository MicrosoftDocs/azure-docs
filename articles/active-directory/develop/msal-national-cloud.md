---
title: Use MSAL in a national cloud app
description: The Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured web APIs. These web APIs can be Microsoft Graph, other Microsoft APIs, partner web APIs, or your own web API. MSAL supports multiple application architectures and platforms.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/21/2021
ms.author: henrymbugua
ms.reviewer: negoe, nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about how the Microsoft Authentication Library works in national cloud scenarios so I can decide if this platform meets my application development needs.
---

# Use MSAL in a national cloud environment

[National clouds](authentication-national-cloud.md), also known as Sovereign clouds, are physically isolated instances of Azure. These regions of Azure help make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

In addition to the Microsoft worldwide cloud, the Microsoft Authentication Library (MSAL) enables application developers in national clouds to acquire tokens in order to authenticate and call secured web APIs. These web APIs can be Microsoft Graph or other Microsoft APIs.

Including the global Azure cloud, Microsoft Entra ID is deployed in the following national clouds: 

- Azure Government
- Microsoft Azure operated by 21Vianet
- Azure Germany ([Closing on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions))

This guide demonstrates how to sign in to work and school accounts, get an access token, and call the Microsoft Graph API in the [Azure Government cloud](https://azure.microsoft.com/global-infrastructure/government/) environment.

## Azure Germany (Microsoft Cloud Deutschland)

> [!WARNING]
> Azure Germany (Microsoft Cloud Deutschland) will be [closed on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions). Services and applications you choose _not_ to migrate to a region in global Azure before that date will become inaccessible.

If you haven't migrated your application from Azure Germany, follow [Microsoft Entra information for the migration from Azure Germany](/microsoft-365/enterprise/ms-cloud-germany-transition-azure-ad) to get started.

## Prerequisites

Before you start, make sure that you meet these prerequisites.

### Choose the appropriate identities

[Azure Government](/azure/azure-government/) applications can use Microsoft Entra Government identities and Microsoft Entra Public identities to authenticate users. Because you can use any of these identities, decide which authority endpoint you should choose for your scenario:

- Microsoft Entra Public: Commonly used if your organization already has a Microsoft Entra Public tenant to support Microsoft 365 (Public or GCC) or another application.
- Microsoft Entra Government: Commonly used if your organization already has a Microsoft Entra Government tenant to support Office 365 (GCC High or DoD) or is creating a new tenant in Microsoft Entra Government.

After you decide, a special consideration is where you perform your app registration. If you choose Microsoft Entra Public identities for your Azure Government application, you must register the application in your Microsoft Entra Public tenant.

### Get an Azure Government subscription

To get an Azure Government subscription, see [Managing and connecting to your subscription in Azure Government](/azure/azure-government/compare-azure-government-global-azure).

If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

For details about using a national cloud with a particular programming language, choose the tab matching your language:

## [.NET](#tab/dotnet)

You can use MSAL.NET to sign in users, acquire tokens, and call the Microsoft Graph API in national clouds.

The following tutorials demonstrate how to build a .NET Core 2.2 MVC Web app. The app uses OpenID Connect to sign in users with a work and school account in an organization that belongs to a national cloud.

- To sign in users and acquire tokens, follow this tutorial: [Build an ASP.NET Core Web app signing-in users in sovereign clouds with the Microsoft identity platform](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-4-Sovereign#build-an-aspnet-core-web-app-signing-in-users-in-sovereign-clouds-with-the-microsoft-identity-platform).
- To call the Microsoft Graph API, follow this tutorial: [Using the Microsoft identity platform to call the Microsoft Graph API from an ASP.NET Core 2.x web app, on behalf of a user signing-in using their work and school account in Microsoft National Cloud](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-4-Sovereign-Call-MSGraph#using-the-microsoft-identity-platform-to-call-the-microsoft-graph-api-from-an-an-aspnet-core-2x-web-app-on-behalf-of-a-user-signing-in-using-their-work-and-school-account-in-microsoft-national-cloud).

## [JavaScript](#tab/javascript)

To enable your MSAL.js application for sovereign clouds:

- Register your application in a specific portal, depending on the cloud. For more information on how to choose the portal refer [App registration endpoints](authentication-national-cloud.md#app-registration-endpoints)
- Use any of the [samples](https://github.com/Azure-Samples/ms-identity-javascript-tutorial) from the repo with a few changes to the configuration, depending on the cloud, which is mentioned next.
- Use a specific authority, depending on the cloud you registered the application in. For more information on authorities for different clouds, refer to [Microsoft Entra authentication endpoints](authentication-national-cloud.md#azure-ad-authentication-endpoints).
- Calling the Microsoft Graph API requires an endpoint URL specific to the cloud you are using. To find Microsoft Graph endpoints for all the national clouds, refer to [Microsoft Graph and Graph Explorer service root endpoints](/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints).

Here's an example authority:

```json
"authority": "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here"
```

Here's an example of a Microsoft Graph endpoint, with scope:

```json
"endpoint" : "https://graph.microsoft.us/v1.0/me"
"scope": "User.Read"
```

Here's the minimal code for authenticating a user with a sovereign cloud and calling Microsoft Graph:

```javascript
const msalConfig = {
    auth: {
        clientId: "Enter_the_Application_Id_Here",
        authority: "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here",
        redirectUri: "/",
    }
};

// Initialize MSAL
const msalObj = new PublicClientApplication(msalConfig);

// Get token using popup experience
try {
    const graphToken = await msalObj.acquireTokenPopup({
        scopes: ["User.Read"]
    });
} catch(error) {
    console.log(error)
}

// Call the Graph API
const headers = new Headers();
const bearer = `Bearer ${graphToken}`;

headers.append("Authorization", bearer);

fetch("https://graph.microsoft.us/v1.0/me", {
    method: "GET",
    headers: headers
})
```


## [Python](#tab/python)

To enable your MSAL Python application for sovereign clouds:

- Register your application in a specific portal, depending on the cloud. For more information on how to choose the portal refer [App registration endpoints](authentication-national-cloud.md#app-registration-endpoints)
- Use any of the [samples](https://github.com/AzureAD/microsoft-authentication-library-for-python/tree/dev/sample) from the repo with a few changes to the configuration, depending on the cloud, which is mentioned next.
- Use a specific authority, depending on the cloud you registered the application in. For more information on authorities for different clouds, refer [Microsoft Entra authentication endpoints](authentication-national-cloud.md#azure-ad-authentication-endpoints).

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
- Use any of the [samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/tree/dev/msal4j-sdk/src/samples) from the repo with a few changes to the configuration, depending on the cloud, which are mentioned next.
- Use a specific authority, depending on the cloud you registered the application in. For more information on authorities for different clouds, refer [Microsoft Entra authentication endpoints](authentication-national-cloud.md#azure-ad-authentication-endpoints).

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

- [Azure Government](/azure/azure-government/)
- [Microsoft Azure operated by 21Vianet](/azure/china/)
- [Azure Germany (closes on October 29, 2021)](/azure/germany/)
