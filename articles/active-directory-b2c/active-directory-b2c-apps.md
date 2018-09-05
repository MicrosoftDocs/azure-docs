---
title: Applications types that can be used in Azure Active Directory B2C | Microsoft Docs
description: Learn about the types of applications you can use in the Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/13/2018
ms.author: davidmu
ms.component: B2C

---
# Applications types that can be used in Active Directory B2C

Azure Active Directory (Azure AD) B2C supports authentication for a variety of modern application architectures. All of them are based on the industry standard protocols [OAuth 2.0](active-directory-b2c-reference-protocols.md) or [OpenID Connect](active-directory-b2c-reference-protocols.md). This document describes the types of applications that you can build, independent of the language or platform you prefer. It also helps you understand the high-level scenarios before you start building applications.

Every application that uses Azure AD B2C must be registered in your [Azure AD B2C tenant](active-directory-b2c-get-started.md) by using the [Azure Portal](https://portal.azure.com/). The application registration process collects and assigns values, such as:

* An **Application ID** that uniquely identifies your application.
* A **Redirect URI** that can be used to direct responses back to your application.

Each request that is sent to Azure AD B2C specifies a **policy**. A policy controls the behavior of Azure AD. You can also use these endpoints to create a highly customizable set of user experiences. Common policies include sign-up, sign-in, and profile-edit policies. If you are not familiar with policies, you should read about the Azure AD B2C [extensible policy framework](active-directory-b2c-reference-policies.md) before you continue.

The interaction of every application follows a similar high-level pattern:

1. The application directs the user to the v2.0 endpoint to execute a [policy](active-directory-b2c-reference-policies.md).
2. The user completes the policy according to the policy definition.
3. The application receives a security token from the v2.0 endpoint.
4. The application uses the security token to access protected information or a protected resource.
5. The resource server validates the security token to verify that access can be granted.
6. The application periodically refreshes the security token.

These steps can differ slightly based on the type of application you're building.

## Web applications

For web applications (including .NET, PHP, Java, Ruby, Python, and Node.js) that are hosted on a server and accessed through a browser, Azure AD B2C supports [OpenID Connect](active-directory-b2c-reference-protocols.md) for all user experiences. This includes sign-in, sign-up, and profile management. In the Azure AD B2C implementation of OpenID Connect, your web application initiates these user experiences by issuing authentication requests to Azure AD. The result of the request is an `id_token`. This security token represents the user's identity. It also provides information about the user in the form of claims:

```
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

Learn more about the types of tokens and claims available to an application in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

In a web application, each execution of a [policy](active-directory-b2c-reference-policies.md) takes these high-level steps:

1. The user browses to the web application.
2. The web application redirects the user to Azure AD B2C indicating the policy to execute.
3. The user completes policy.
4. Azure AD B2C returns an `id_token` to the browser.
5. The `id_token` is posted to the redirect URI.
6. The `id_token` is validated and a session cookie is set.
7. A secure page is returned to the user.

Validation of the `id_token` by using a public signing key that is received from Azure AD is sufficient to verify the identity of the user. This also sets a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web application sign-in code samples in our [Getting started section](active-directory-b2c-overview.md).

In addition to facilitating simple sign-in, a web server application might also need to access a back-end web service. In this case, the web application can perform a slightly different [OpenID Connect flow](active-directory-b2c-reference-oidc.md) and acquire tokens by using authorization codes and refresh tokens. This scenario is depicted in the following [Web APIs section](#web-apis).

## Web APIs

You can use Azure AD B2C to secure web services such as your application's RESTful web API. Web APIs can use OAuth 2.0 to secure their data, by authenticating incoming HTTP requests using tokens. The caller of a web API appends a token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The web API can then use the token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the token. Learn more about the types of tokens and claims available to an app in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

> [!NOTE]
> Azure AD B2C currently supports only web APIs that are accessed by their own well-known clients. For instance, your complete app may include an iOS application, an Android application, and a back-end web API. This architecture is fully supported. Allowing a partner client, such as another iOS application, to access the same web API is not currently supported. All of the components of your complete application must share a single application ID.
>
>

A web API can receive tokens from many types of clients, including web applications, desktop and mobile applications, single page applications, server-side daemons, and other web APIs. Here's an example of the complete flow for a web application that calls a web API:

1. The web application executes a policy and the user completes the user experience.
2. Azure AD B2C returns an `access_token` and an authorization code to the browser.
3. The browser posts the `access_token` and authorization code to the redirect URI.
4. The web server validates the `access token` and sets a session cookie.
5. The `access_token` is provided to Azure AD B2C with the authorization code, application client ID, and credentials.
6. The `access_token` and `refresh_token` are returned to the web server.
7. The web API is called with the `access_token` in an authorization header.
8. The web API validates the token.
9. Secure data is returned to the web server.

To learn more about authorization codes, refresh tokens, and the steps for getting tokens, read about the [OAuth 2.0 protocol](active-directory-b2c-reference-oauth-code.md).

To learn how to secure a web API by using Azure AD B2C, check out the web API tutorials in our [Getting started section](active-directory-b2c-overview.md).

## Mobile and native applications

Applications that are installed on devices, such as mobile and desktop applications, often need to access back-end services or web APIs on behalf of users. You can add customized identity management experiences to your native applications and securely call back-end services by using Azure AD B2C and the [OAuth 2.0 authorization code flow](active-directory-b2c-reference-oauth-code.md).  

In this flow, the application executes [policies](active-directory-b2c-reference-policies.md) and receives an `authorization_code` from Azure AD after the user completes the policy. The `authorization_code` represents the application's permission to call back-end services on behalf of the user who is currently signed in. The application can then exchange the `authorization_code` in the background for an `id_token` and a `refresh_token`.  The application can use the `id_token` to authenticate to a back-end web API in HTTP requests. It can also use the `refresh_token` to get a new `id_token` when an older one expires.

> [!NOTE]
> Azure AD B2C currently supports only tokens that are used to access an application's own back-end web service. For instance, your complete application may include an iOS application, an Android application, and a back-end web API. This architecture is fully supported. Allowing your iOS application to access a partner web API by using OAuth 2.0 access tokens is not currently supported. All of the components of your complete application must share a single application ID.
>
>

## Current limitations

Azure AD B2C does not currently support the following types of apps, but they are on the roadmap. 

### Daemons/server-side applications

Applications that contain long-running processes or that operate without the presence of a user also need a way to access secured resources such as web APIs. These applications can authenticate and get tokens by using the application's identity (rather than a user's delegated identity) and by using the OAuth 2.0 client credentials flow. Client credential flow is not the same as on-behalf-flow and on-behalf-flow should not be used for server-to-server authentication.

Although client credential flow is not currently supported by Azure AD B2C, you can set up client credential flow using Azure AD. An Azure AD B2C tenant shares some functionality with Azure AD enterprise tenants.  The client credential flow is supported using the Azure AD functionality of the Azure AD B2C tenant. 

To set up client credential flow, see [Azure Active Directory v2.0 and the OAuth 2.0 client credentials flow](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-client-creds). A successful authentication results in the receipt of a token formatted so that it can be used by Azure AD as described in [Azure AD token reference](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims).


### Web API chains (on-behalf-of flow)

Many architectures include a web API that needs to call another downstream web API, where both are secured by Azure AD B2C. This scenario is common in native clients that have a Web API back-end. This then calls a Microsoft online service such as the Azure AD Graph API.

This chained web API scenario can be supported by using the OAuth 2.0 JWT bearer credential grant, also known as the on-behalf-of flow.  However, the on-behalf-of flow is not currently implemented in the Azure AD B2C.
