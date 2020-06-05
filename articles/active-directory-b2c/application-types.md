---
title: Application types supported by Azure AD B2C
titleSuffix: Azure AD B2C
description: Learn about the types of applications you can use with Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/24/2019
ms.author: mimart
ms.subservice: B2C

---
# Application types that can be used in Active Directory B2C

Azure Active Directory B2C (Azure AD B2C) supports authentication for a variety of modern application architectures. All of them are based on the industry standard protocols [OAuth 2.0](protocols-overview.md) or [OpenID Connect](protocols-overview.md). This article describes the types of applications that you can build, independent of the language or platform you prefer. It also helps you understand the high-level scenarios before you start building applications.

Every application that uses Azure AD B2C must be registered in your [Azure AD B2C tenant](tutorial-create-tenant.md) by using the [Azure portal](https://portal.azure.com/). The application registration process collects and assigns values, such as:

* An **Application ID** that uniquely identifies your application.
* A **Reply URL** that can be used to direct responses back to your application.

Each request that is sent to Azure AD B2C specifies a **user flow** (a built-in policy) or a **custom policy** that controls the behavior of Azure AD B2C. Both policy types enable you to create a highly customizable set of user experiences.

The interaction of every application follows a similar high-level pattern:

1. The application directs the user to the v2.0 endpoint to execute a [policy](user-flow-overview.md).
2. The user completes the policy according to the policy definition.
3. The application receives a security token from the v2.0 endpoint.
4. The application uses the security token to access protected information or a protected resource.
5. The resource server validates the security token to verify that access can be granted.
6. The application periodically refreshes the security token.

These steps can differ slightly based on the type of application you're building.

## Web applications

For web applications (including .NET, PHP, Java, Ruby, Python, and Node.js) that are hosted on a server and accessed through a browser, Azure AD B2C supports [OpenID Connect](protocols-overview.md) for all user experiences. In the Azure AD B2C implementation of OpenID Connect, your web application initiates user experiences by issuing authentication requests to Azure AD. The result of the request is an `id_token`. This security token represents the user's identity. It also provides information about the user in the form of claims:

```json
// Partial raw id_token
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtyaU1QZG1Cd...

// Partial content of a decoded id_token
{
    "name": "John Smith",
    "email": "john.smith@gmail.com",
    "oid": "d9674823-dffc-4e3f-a6eb-62fe4bd48a58"
    ...
}
```

Learn more about the types of tokens and claims available to an application in the [Azure AD B2C token reference](tokens-overview.md).

In a web application, each execution of a [policy](user-flow-overview.md) takes these high-level steps:

1. The user browses to the web application.
2. The web application redirects the user to Azure AD B2C indicating the policy to execute.
3. The user completes policy.
4. Azure AD B2C returns an `id_token` to the browser.
5. The `id_token` is posted to the redirect URI.
6. The `id_token` is validated and a session cookie is set.
7. A secure page is returned to the user.

Validation of the `id_token` by using a public signing key that is received from Azure AD is sufficient to verify the identity of the user. This process also sets a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web application sign-in code samples in our [Getting started section](overview.md).

In addition to facilitating simple sign-in, a web server application might also need to access a back-end web service. In this case, the web application can perform a slightly different [OpenID Connect flow](openid-connect.md) and acquire tokens by using authorization codes and refresh tokens. This scenario is depicted in the following [Web APIs section](#web-apis).

## Web APIs

You can use Azure AD B2C to secure web services such as your application's RESTful web API. Web APIs can use OAuth 2.0 to secure their data, by authenticating incoming HTTP requests using tokens. The caller of a web API appends a token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The web API can then use the token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the token. Learn more about the types of tokens and claims available to an app in the [Azure AD B2C token reference](tokens-overview.md).

A web API can receive tokens from many types of clients, including web applications, desktop and mobile applications, single page applications, server-side daemons, and other web APIs. Here's an example of the complete flow for a web application that calls a web API:

1. The web application executes a policy and the user completes the user experience.
2. Azure AD B2C returns an (OpenID Connect) `id_token` and an authorization code to the browser.
3. The browser posts the `id_token` and authorization code to the redirect URI.
4. The web server validates the `id_token` and sets a session cookie.
5. The web server asks Azure AD B2C for an `access_token` by providing it with the authorization code, application client ID, and client credentials.
6. The `access_token` and `refresh_token` are returned to the web server.
7. The web API is called with the `access_token` in an authorization header.
8. The web API validates the token.
9. Secure data is returned to the web application.

To learn more about authorization codes, refresh tokens, and the steps for getting tokens, read about the [OAuth 2.0 protocol](authorization-code-flow.md).

To learn how to secure a web API by using Azure AD B2C, check out the web API tutorials in our [Getting started section](overview.md).

## Mobile and native applications

Applications that are installed on devices, such as mobile and desktop applications, often need to access back-end services or web APIs on behalf of users. You can add customized identity management experiences to your native applications and securely call back-end services by using Azure AD B2C and the [OAuth 2.0 authorization code flow](authorization-code-flow.md).

In this flow, the application executes [policies](user-flow-overview.md) and receives an `authorization_code` from Azure AD after the user completes the policy. The `authorization_code` represents the application's permission to call back-end services on behalf of the user who is currently signed in. The application can then exchange the `authorization_code` in the background for an `access_token` and a `refresh_token`.  The application can use the `access_token` to authenticate to a back-end web API in HTTP requests. It can also use the `refresh_token` to get a new `access_token` when an older one expires.

## Current limitations

### Unsupported application types

#### Daemons/server-side applications

Applications that contain long-running processes or that operate without the presence of a user also need a way to access secured resources such as web APIs. These applications can authenticate and get tokens by using the application's identity (rather than a user's delegated identity) and by using the OAuth 2.0 client credentials flow. Client credential flow is not the same as on-behalf-flow and on-behalf-flow should not be used for server-to-server authentication.

Although the OAuth 2.0 client credentials grant flow is not currently directly supported by the Azure AD B2C authentication service, you can set up client credential flow using Azure AD and the Microsoft identity platform /token endpoint for an application in your Azure AD B2C tenant. An Azure AD B2C tenant shares some functionality with Azure AD enterprise tenants.

To set up client credential flow, see [Azure Active Directory v2.0 and the OAuth 2.0 client credentials flow](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-client-creds). A successful authentication results in the receipt of a token formatted so that it can be used by Azure AD as described in [Azure AD token reference](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims).

For instructions on registering a management application, see [Manage Azure AD B2C with Microsoft Graph](microsoft-graph-get-started.md).

#### Web API chains (on-behalf-of flow)

Many architectures include a web API that needs to call another downstream web API, where both are secured by Azure AD B2C. This scenario is common in native clients that have a Web API back-end and calls a Microsoft online service such as the Microsoft Graph API.

This chained web API scenario can be supported by using the OAuth 2.0 JWT bearer credential grant, also known as the on-behalf-of flow.  However, the on-behalf-of flow is not currently implemented in the Azure AD B2C.

### Faulted apps

Do not edit Azure AD B2C applications in these ways:

- On other application management portals such as the [Application Registration Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
- Using Graph API or PowerShell.

If you edit the Azure AD B2C application outside of the Azure portal, it becomes a faulted application and is no longer usable with Azure AD B2C. Delete the application and create it again.

To delete the application, go to the [Application Registration Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and delete the application there. In order for the application to be visible, you need to be the owner of the application (and not just an admin of the tenant).

## Next steps

Find out more about the built-in policies provided by [User flows in Azure Active Directory B2C](user-flow-overview.md).
