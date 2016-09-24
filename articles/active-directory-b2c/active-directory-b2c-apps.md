<properties
	pageTitle="Azure AD B2C | Microsoft Azure"
	description="The types of applications you can build in the Azure Active Directory B2C."
	services="active-directory-b2c"
	documentationCenter=""
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="07/22/2016"
	ms.author="dastrock"/>

# Azure Active Directory B2C: Types of applications

Azure Active Directory (Azure AD) B2C supports authentication for a variety of modern app architectures. All of them are based on the industry standard protocols [OAuth 2.0](active-directory-b2c-reference-protocols.md) or [OpenID Connect](active-directory-b2c-reference-protocols.md). This document briefly describes the types of apps that you can build, independent of the language or platform you prefer. It also helps you understand the high-level scenarios before you [start building applications](active-directory-b2c-overview.md#getting-started).

## The basics
Every app that uses Azure AD B2C must be registered in your [B2C directory](active-directory-b2c-get-started.md) via the [Azure Portal](https://portal.azure.com/). The app registration process collects and assigns a few values to your app:

- An **Application ID** that uniquely identifies your app.
- A **Redirect URI** that can be used to direct responses back to your app.
- Any other scenario-specific values. For more details, learn how to [register an app](active-directory-b2c-app-registration.md).

After the app is registered, it communicates with Azure AD by sending requests to the Azure AD v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

Each request that is sent to Azure AD B2C specifies a **policy**. A policy controls the behavior of Azure AD. You can also use these endpoints to create a highly customizable set of user experiences. Common policies include sign-up, sign-in, and profile-edit policies. If you are not familiar with policies, you should read about the Azure AD B2C [extensible policy framework](active-directory-b2c-reference-policies.md) before you continue.

The interaction of every app with a v2.0 endpoint follows a similar high-level pattern:

1. The app directs the user to the v2.0 endpoint to execute a [policy](active-directory-b2c-reference-policies.md).
2. The user completes the policy according to the policy definition.
4. The app receives some kind of security token from the v2.0 endpoint.
5. The app uses the security token to access protected information or a protected resource.
6. The resource server validates the security token to verify that access can be granted.
7. The app periodically refreshes the security token.

<!-- TODO: Need a page for libraries to link to -->
These steps can differ slightly based on the type of app you're building. Open source libraries can address the details for you.

## Web apps
For web apps (including .NET, PHP, Java, Ruby, Python, and Node.js) that are hosted on a server and accessed through a browser, Azure AD B2C supports [OpenID Connect](active-directory-b2c-reference-protocols.md) for all user experiences. This includes sign-in, sign-up, and profile management. In the Azure AD B2C implementation of OpenID Connect, your web app initiates these user experiences by issuing authentication requests to Azure AD. The result of the request is an `id_token`. This security token represents the user's identity. It also provides information about the user in the form of claims:

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

Learn more about the types of tokens and claims available to an app in the [B2C token reference](active-directory-b2c-reference-tokens.md).

In a web app, each execution of a [policy](active-directory-b2c-reference-policies.md) takes these high-level steps:

![Web App Swimlanes Image](./media/active-directory-b2c-apps/webapp.png)

Validation of the `id_token` by using a public signing key that is received from Azure AD is sufficient to verify the identity of the user. This also sets a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web app sign-in code samples in our [Getting started section](active-directory-b2c-overview.md#getting-started).

In addition to facilitating simple sign-in, a web server app might also need to access a back-end web service. In this case, the web app can perform a slightly different [OpenID Connect flow](active-directory-b2c-reference-oidc.md) and acquire tokens by using authorization codes and refresh tokens. This scenario is depicted in the following [Web APIs section](#web-apis).

<!--, and in our [WebApp-WebAPI Getting started topic](active-directory-b2c-devquickstarts-web-api-dotnet.md).-->

## Web APIs
You can use Azure AD B2C to secure web services such as your app's RESTful web API. Web APIs can use OAuth 2.0 to secure their data, by authenticating incoming HTTP requests using tokens. The caller of a web API appends a token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The web API can then use the token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the token. Learn more about the types of tokens and claims available to an app in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

> [AZURE.NOTE]
	Azure AD B2C currently supports only web APIs that are accessed by their own well-known clients. For instance, your complete app may include an iOS app, an Android app, and a back-end web API. This architecture is fully supported. Allowing a partner client, such as another iOS app, to access the same web API is not currently supported. All of the components of your complete app must share a single application ID.

A web API can receive tokens from many types of clients, including web apps, desktop and mobile apps, single page apps, server-side daemons, and other web APIs. Here's an example of the complete flow for a web app that calls a web API:

![Web App Web API Swimlanes Image](./media/active-directory-b2c-apps/webapi.png)

To learn more about authorization codes, refresh tokens, and the steps for getting tokens, read about the [OAuth 2.0 protocol](active-directory-b2c-reference-oauth-code.md).

To learn how to secure a web API by using Azure AD B2C, check out the web API tutorials in our [Getting started section](active-directory-b2c-overview.md#getting-started).

## Mobile and native apps
Apps that are installed on devices, such as mobile and desktop apps, often need to access back-end services or web APIs on behalf of users. You can add customized identity management experiences to your native apps and securely call back-end services by using Azure AD B2C and the [OAuth 2.0 authorization code flow](active-directory-b2c-reference-oauth-code.md).  

In this flow, the app executes [policies](active-directory-b2c-reference-policies.md) and receives an `authorization_code` from Azure AD after the user completes the policy. The `authorization_code` represents the app's permission to call back-end services on behalf of the user who is currently signed in. The app can then exchange the `authorization_code` in the background for an `id_token` and a `refresh_token`.  The app can use the `id_token` to authenticate to a back-end web API in HTTP requests. It can also use the `refresh_token` to get a new `id_token` when an older one expires.

> [AZURE.NOTE]
	Azure AD B2C currently supports only tokens that are used to access an app's own back-end web service. For instance, your complete app may include an iOS app, an Android app, and a back-end web API. This architecture is fully supported. Allowing your iOS app to access a partner web API by using OAuth 2.0 access tokens is not currently supported. All of the components of your complete app must share a single application ID.

![Native App Swimlanes Image](./media/active-directory-b2c-apps/native.png)

## Current limitations
Azure AD B2C does not currently support the following types of apps, but they are on the roadmapy. Additional limitations and restrictions related to Azure AD B2C are described in [Limitations and restrictions](active-directory-b2c-limitations.md).

### Single page apps (JavaScript)
Many modern apps have a single-page app front end written primarily in JavaScript. They often use a framework such as AngularJS, Ember.js, or Durandal. The generally available Azure AD service supports these apps by using the OAuth 2.0 implicit flow. However, this flow is not yet available in Azure AD B2C.

### Daemons/server-side apps
Apps that contain long-running processes or that operate without the presence of a user also need a way to access secured resources such as web APIs. These apps can authenticate and get tokens by using the app's identity (rather than a user's delegated identity) and by using the OAuth 2.0 client credentials flow.

This flow is not currently supported by Azure AD B2C. These apps can get tokens only after an interactive user flow has occurred.

### Web API chains (on-behalf-of flow)
Many architectures include a web API that needs to call another downstream web API, where both are secured by Azure AD B2C. This scenario is common in native clients that have a Web API back-end. This then calls a Microsoft online service such as the Azure AD Graph API.

This chained web API scenario can be supported by using the OAuth 2.0 JWT bearer credential grant, also known as the on-behalf-of flow.  However, the on-behalf-of flow is not currently implemented in the Azure AD B2C.
