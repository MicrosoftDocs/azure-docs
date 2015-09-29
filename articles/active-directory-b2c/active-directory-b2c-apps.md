<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="The types of applications you can build in the Azure AD B2C preview."
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
	ms.topic="article"
	ms.date="09/28/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Types of Applications

Azure AD B2C supports authentication for a variety of modern app architectures, all of which are based on the industry standard protocols [OAuth 2.0](active-directory-b2c-reference-protocols.md) and/or [OpenID Connect](active-directory-b2c-reference-protocols.md).  This doc briefly describes the types of apps you can build, independent of the language or platform you prefer.  It will help you understand the high level scenarios before you [jump right into the code](active-directory-b2c-overview.md#getting-started).

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## The Basics
Every app that uses Azure AD B2C will need to be registered in your [B2C directory](active-directory-b2c-get-started.md) via the [Azure Preview Portal](https://portal.azure.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-b2c-app-registration.md).

Once registered, the app communicates with Azure AD by sending requests to the Azure AD v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

Each request that is sent to Azure AD B2C specifies a **policy**.  A policy controls the behavior of Azure AD, and allows you to use these endpoints to create a highly customizable set of user experiences.  Some common policies include sign-up policies, sign-in policies, and profile edit policies.  If you are not familiar with polices, you should read about Azure AD B2C's [extensible policy framework](active-directory-b2c-reference-policies.md) before reading on. 

Every app's interaction with the v2.0 endpoint will follow a similar high level pattern:

1. The app directs the end-user to the v2.0 endpoint to execute a [policy](active-directory-b2c-reference-policies.md).
2. The user completes the policy according to the policy definition.
4. The app receives a security token of some sort from the v2.0 endpoint.
5. The app uses the security token to access protected information, or a resource.
6. The resource server validates the security token to ensure access can be granted.
7. The app refreshes the security token periodically.

<!-- TODO: Need a page for libraries to link to -->
Each of these steps will differ slightly based on the type of app you're building, and we have open source libraries that take care of the details for you.

## Web Apps
For web apps (.NET, PHP, Java, Ruby, Python, Node, etc) that are hosted on a server and accessed through a browser, Azure AD B2C supports [OpenID Connect](active-directory-b2c-reference-protocols.md) for all user experiences, including sign-in, sign-up, and profile management.  In Azure AD B2C's implementation of OpenID Connect, your web app initiates these user experiences by issuing authentication requests to Azure AD.  The result of the request is an `id_token`, a security token that represents the user's identity and provides information about the user in the form of claims:

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

You can learn about all of the types of tokens and claims available to an app in the [B2C token reference](active-directory-b2c-reference-tokens.md).

In web apps, each execution of a [policy](active-directory-b2c-reference-policies.md) takes these high level steps:

![Web App Swimlanes Image](./media/active-directory-b2c-apps/webapp.png)

The validation of the id_token using a public signing key received from the Azure AD is sufficient to ensure the user's identity, and set a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try out one of the web app sign-in code samples in our [Getting Started](active-directory-b2c-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might also need to access some backend web service.  In this case the web app can perform a slightly different [OpenID Connect flow](active-directory-b2c-reference-oidc.md), and acquire tokens using authorization codes and refresh tokens. This scenario is depicted below in the [Web APIs section](#web-apis).

<!--, and in our [WebApp-WebAPI Getting Started topic](active-directory-b2c-devquickstarts-web-api-dotnet.md).-->

## Web APIs
You can also use Azure AD B2C to secure web services, such as your app's RESTful Web API.  Web APIs can use OAuth 2.0 to secure their data and authenticate incoming HTTP requests using tokens.  The caller of a Web API appends a token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API can then use the token to verify the API caller's identity and extract information about the caller from claims that are encoded in the token.  You can learn about all of the types of tokens and claims available to an app in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

> [AZURE.NOTE]
	The Azure AD B2C preview currently only supports Web APIs that are accessed by their own, well-known clients.  For instance, your complete app may include an iOS app, and Android app, and a backend Web API.  This architecture is fully supported.  What is not currently supported is allowing a third party client, such as another iOS app, to also access the same web API.  In effect, each component of your complete app must all share a single Application ID.

A Web API can receive tokens from all types of clients, including web apps, desktop and mobile apps, single page apps, server side daemons, and even other Web APIs.  As an example, let's look at the complete flow for a web app that calls a Web API.

![Web App Web API Swimlanes Image](./media/active-directory-b2c-apps/webapi.png)

To learn more about authorization_codes, refresh_tokens, and the detailed steps of getting tokens, read about the [OAuth 2.0 protocol](active-directory-b2c-reference-oauth-code.md).

To learn how to secure a Web API with Azure AD B2C, check out the Web API tutorials in our [Getting Started section](active-directory-b2c-overview.md#getting-started).
	
## Mobile and Native Apps
Apps that are installed on a device, such as mobile and desktop apps, often need to access backend services or Web APIs on behalf of a user.  You can add customized identity management experiences to your native apps and securely call backend services using Azure AD B2C and the [OAuth 2.0 Authorization Code flow](active-directory-b2c-reference-oauth-code.md).  

In this flow, the app executes [policies](active-directory-b2c-reference-policies.md) and receives an authorization_code from Azure AD after the user completes the policy.  The authorization_code represents the app's permission to call backend services on behalf of the currently signed-in user.  The app can then exchange the authoriztion_code in the background for an id_token and a refresh_token.  The app can use the id_token to authenticate to a backend Web API in HTTP requests, and can use the refresh_token to get new id_tokens when older ones expire.

> [AZURE.NOTE]
	The Azure AD B2C preview currently only supports getting id_tokens that are used to access an app's own backend web service.  For instance, your complete app may include an iOS app, and Android app, and a backend Web API.  This architecture is fully supported.  What is not currently supported is allowing your iOS app to access a third party web API using OAuth 2.0 access_tokens.  In effect, each component of your complete app must all share a single Application ID.

![Native App Swimlanes Image](./media/active-directory-b2c-apps/native.png)

## Current Preview Limitations
These types of apps are not currently supported by the Azure AD B2C preview, but are on the roadmap to be supported in time for general availability.  Additional limitations and restrictions for the Azure AD B2C preview are described in the [limitations article](active-directory-b2c-limitations.md).

### Single Page Apps (Javascript)
Many modern apps have a Single Page App front-end written primarily in javascript and often using a SPA frameworks such as AngularJS, Ember.js, Durandal, etc.  The generally available Azure AD service supports these apps using the OAuth 2.0 Implicit Flow - however, this flow is not yet available in Azure AD B2C.  It will be in short order.

### Daemons/Server Side Apps
Apps that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the OAuth 2.0 client credentials flow. 

This flow is not currently supported by Azure AD B2C - which is to say that apps can only get tokens after an interactive user flow has occurred.  The client credentials flow will be added in the near future.

### Web API Chains (On-Behalf-Of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by Azure AD B2C.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as the Azure AD Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the On-Behalf-Of Flow.  However, the On-Behalf-Of flow is not currently implemented in the Azure AD B2C preview.