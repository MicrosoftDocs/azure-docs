<properties
	pageTitle="App Model v2.0 Types of apps | Microsoft Azure"
	description="The types of apps and scenarios supported by the Azure AD App Model v2.0 Public Preview."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/11/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Types of apps
The v2.0 app model supports authentication for a variety of modern app architectures, all of which are based on the industry standard protocols [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) and/or [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  This doc briefly describes the types of apps you can build, independent of the language or platform you prefer.  It will help you understand the high level scenarios before you [jump right into the code](active-directory-appmodel-v2-overview.md#getting-started).

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## The Basics
Every app that uses the v2.0 app model will need to be registered at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-v2-app-registration.md).

Once registered, the app communicates with Azure AD my sending requests to the v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

Every app's interaction with the v2.0 endpoint will follow a similar high level pattern:

1. The app directs the end-user to the v2.0 endpoint for sign-in.
2. The user authenticates, entering their username and password or otherwise.
3. The user authorizes the app to act on their behalf, by granting permissions the app requests.
4. The app receives a security token of some sort from the v2.0 endpoint.
5. The app uses the security token to access protected information, or a resource.
6. The resource server validates the security token to ensure access can be granted.
7. The app refreshes the security token periodically.

<!-- TODO: Need a page for libraries to link to -->
Each of these seven steps will differ slightly based on the type of app you're building, and we have open source libraries that take care of the details for you.  You can learn more about [permissions, consent, and scopes](active-directory-v2-scopes.md), or read on to explore some concrete examples.

## Web Apps
For web apps (.NET, PHP, Java, Ruby, Python, Node, etc) that are accessed through a browser, the v2.0 app model supports user sign-in using [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  In OpenID Connect the web app receives an `id_token`, a security token that verifies the user's identity and provides information about the user in the form of claims:

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

You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

In web server apps, the sign-in authentication flow takes these high level steps:

![Web App Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_webapp.png)

The validation of the id_token using a public signing key received from the v2.0 endpoint is sufficient to ensure the user's identity, and set a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try out one of the web app sign-in code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might also need to access some other web service such as a REST API.  In this case the web server app can engage in a combined OpenID Connect & OAuth 2.0 flow, using the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols.md#oauth2-authorization-code-flow). This scenario is covered below in the [Web APIs section](#web-apis), and in our [WebApp-WebAPI Getting Started topic](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

## Web APIs
You can use the v2.0 app model to secure web services as well, such as your app's RESTful Web API.  Instead of id_tokens and session cookies, Web APIs use OAuth 2.0 access_tokens to secure their data and authenticate incoming requests.  The caller of a Web API appends an access_token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API can then use the access_token to verify the API caller's identity and extract information about the caller from claims that are encoded in the access_token.  You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

A Web API can give users the power to opt-in/opt-out of certain functionality or data by exposing permissions, otherwise known as [scopes](active-directory-v2-scopes.md).  For a calling app to acquire permission to a scope, the user must consent to the scope during an flow.  The v2.0 endpoint will take care of asking the user for permission, and recording those permissions in all access_tokens that the Web API receives.  All the Web API needs to worry about is validating the access_tokens it receives on each call and performing the proper authorization checks.

A Web API can receive access_tokens from all types of apps, including web server apps, desktop and mobile apps, single page apps, server side daemons, and even other Web APIs.  As an example, let's look at the complete flow for a web server app that calls a Web API.

![Web App Web API Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_webapp_webapi.png)

To learn more about authorization_codes, refresh_tokens, and the detailed steps of getting access_tokens, read about the [OAuth 2.0 protocol](active-directory-v2-protocols.md#oauth2-authorization-code-flow).

To learn how to secure a Web API with the v2.0 app model and OAuth 2.0 access_tokens, check out the Web API code samples in our [Getting Started section](active-directory-appmodel-v2-overview.md#getting-started).


## Mobile and Native Apps
Apps that are installed on a device, such as mobile and desktop apps, often need to access backend services or Web APIs that store data and perform various functions on behalf of a user.  These apps can add sign-in and authorization to backend services using the v2.0 model and the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols.md#oauth2-authorization-code-flow).  

In this flow, a the app receives an authorization_code from the v2.0 endpoint upon user sign-in, which represents the app's permission to call backend services on behalf of the currently signed-in user.  The app can then exchange the authoriztion_code in the background for an OAuth 2.0 access_token and a refresh_token.  The app can use the access_token to authenticate to Web APIs in HTTP requests, and can use the refresh_token to get new access_tokens when older ones expire.

![Native App Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_native.png)

## Current Preview Limitations
These types of apps are not currently supported by the v2.0 app model preview, but are on the roadmap to be supported in time for general availability.  Additional limitations and restrictions for the v2.0 app model public preview are described in the [v2.0 preview limitations article](active-directory-v2-limitations.md).

### Single Page Apps (Javascript)
Many modern apps have a Single Page App front-end written primarily in javascript and often using a SPA frameworks such as AngularJS, Ember.js, Durandal, etc.  The generally available Azure AD service supports these apps using the [OAuth 2.0 Implicit Flow](active-directory-v2-protocols.md#oauth2-implicit-flow) - however, this flow is not yet available in the v2.0 app model.  It will be in short order.

If you're anxious to get a SPA working with the v2.0 app model, you can implement authentication using the [web server app flow](#web-apps) described above.  But this is not the recommended approach, and documentation for this scenario will be limited.  If you'd like to get a feel for the SPA scenario, you can check out the [generally available Azure AD SPA code sample](active-directory-devquickstarts-angular.md).

### Daemons/Server Side Apps
Apps that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the [OAuth 2.0 client credentials flow](active-directory-v2-protocols.md#oauth2-client-credentials-grant-flow).  

This flow is not currently supported by the v2.0 app model - which is to say that apps can only get tokens after an interactive user sign-in flow has occurred.  The client credentials flow will be added in the near future.  If you would like to see the client credentials flow in the generally available Azure AD service, check out the [Daemon sample on GitHub](https://github.com/AzureADSamples/Daemon-DotNet).

### Chained Web APIs (On-Behalf-Of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 app model.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as Office 365 or the Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the [On-Behalf-Of Flow](active-directory-v2-protocols.md#oauth2-on-behalf-of-flow).  However, the On-Behalf-Of flow is not currently implemented in the v2.0 app model preview.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).
