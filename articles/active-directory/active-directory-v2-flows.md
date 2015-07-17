<properties
	pageTitle="v2.0 Endpoint | Microsoft Azure"
	description="The types of apps and scenarios supported by the Azure AD v2.0 Endpoint Public Preview."
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
	ms.date="07/08/2015"
	ms.author="dastrock"/>

# v2.0 Endpoint Preview: Types of Applications
The v2.0 endpoint supports authentication for a variety of modern app architectures, all of which are based on the industry standard auth protocols [OAuth 2.0]() and/or [OpenID Connect]().  This doc briefly describes the types of applications you can build, independent of the language or platform you prefer.  It will help you understand the high level scenarios before you [jump right into the code]().

> [AZURE.NOTE]
	This information applies to the v2.0 endpoint public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## The Basics
Every app that uses the v2.0 endpoint will need to be registered at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** or **Package Identifier** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app]().

Once registered, every app will follow a similar auth pattern:

1. The app directs the end-user to the v2.0 endpoint for sign-in.
2. The user authenticates, entering their username and password or otherwise.
3. The user authorizes the app to act on their behalf, by granting permissions the app requests.
4. The app receives a security token of some sort from the v2.0 endpoint.
5. The app uses the security token to access protected information, or a resource.
6. The resource server validates the security token to ensure access can be granted.
7. The app refreshes the security token periodically.

Each of these seven steps will differ slightly based on the type of app you're building, and we have [open source libraries]() that take care of the details for you.  You can learn more about [permissions, consent, and multi-tenant apps](), or read on to explore some concrete examples.

## Currently Supported Scenarios

### Web Server Apps
For web server apps (.NET, PHP, Java, Ruby, Python, Node, etc) that are accessed through a browser, the v2.0 endpoint supports user sign in using [OpenID Connect]().  In OpenID Connect the web app receives an `id_token`, a security token that verifies the user's identity and provides information about the user in the form of claims:

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

You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference]().

In web server apps, the sign-in authentication flow takes these high level steps:

![Web App Swimlanes Image](./media/active-directory-v2-flows/convergence_scenarios_webapp.png)

The validation of the id_token using a public signing key received from the v2.0 endpoint is sufficient to ensure the user's identity, and set a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try out one of the web app sign-in code samples in our [Getting Started]() section.

In addition to simple sign-in, a web server app might also need to access some other web service such as a REST API.  In this case the web server app can engage in a combined OpenID Connect & OAuth 2.0 auth flow, using the [OAuth 2.0 Authorization Code flow](). This scenario is covered below in the [Web APIs section](), and in our [WebApp-WebAPI Getting Started topic]().

### Web APIs
You can use the v2.0 endpoint to secure web services as well, such as your app's RESTful Web API.  Instead of id_tokens and session cookies, Web APIs use [OAuth 2.0]() access_tokens to secure their data and authenticate incoming requests.  The caller of a Web API appends an access_token in the authorization header of an HTTP request:
```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API can then use the access_token to verify the API caller's identity and extract information about the caller from claims that are encoded in the access_token.  You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference]().

A Web API can give users the power to opt-in/opt-out of certain functionality or data by exposing permissions, otherwise known as [scopes]().  For a calling app to acquire permission to a scope, the user must consent to the scope during an auth flow.  The v2.0 endpoint will take care of asking the user for permission, and recording those permissions in all access_tokens that the Web API receives.  All the Web API needs to worry about is validating the access_tokens it receives on each call and performing the proper authorization checks.

A Web API can receive access_tokens from all types of apps, including web server apps, desktop and mobile apps, single page apps, server side daemons, and even other Web APIs.  As an example, let's look at the complete auth flow for a web server app that calls a Web API.

![Web App Web API Swimlanes Image](./media/active-directory-v2-flows/convergence_scenarios_webapp_webapi.png)

To learn more about authorization_codes, refresh_tokens, and the detailed steps of getting access_tokens, read about the [OAuth 2.0 protocol]().

To learn how to secure a Web API with the v2.0 endpoint and OAuth 2.0 access_tokens, check out the Web API code samples in our [Getting Started section]().


### Native/Installed Apps
Apps that are installed on a device, such as mobile and desktop apps, often need to access backend services or Web APIs that store data and perform various functions on behalf of a user.  These apps can add sign-in and authorization to backend services using the v2.0 endpoint and the [OAuth 2.0 Authorization Code flow]().  

In this auth flow, a the app receives an authorization_code from the v2.0 endpoint upon user sign in, which represents the app's permission to call backend services on behalf of the currently signed-in user.  The app can then exchange the authoriztion_code in the background for an OAuth 2.0 access_token and a refresh_token.  The app can use the access_token to authenticate to Web APIs in HTTP requests, and can use the refresh_token to get new access_tokens when older ones expire.

![Native App Swimlanes Image](./media/active-directory-v2-flows/convergence_scenarios_native.png)

## Current Preview Limitations
These types of apps are not currently supported by the v2.0 endpoint preview, but are on the roadmap to be supported in time for general availability.  Additional limitations and restrictions for the v2.0 endpoint public preview are described in the [v2.0 preview limitations doc]().

### Single Page Apps (Javascript)
Many modern applications have a Single Page App front-end written primarily in javascript and often using a SPA frameworks such as AngularJS, Ember.js, Durandal, etc.  The generally available Azure AD service supports these apps using the [OAuth 2.0 Implicit Flow]() - however, this flow is not yet available in the v2.0 endpoint.  It will be in short order.

If you're anxious to get a SPA working with the v2.0 endpoint, you can implement authentication using the [web server app auth flow]() described above.  But this is not the recommended approach, and documentation for this scenario will be limited.  If you'd like to get a feel for the SPA scenario, you can check out the [generally available Azure AD SPA code sample]().

### Daemons/Server Side Apps
Applications that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the [OAuth 2.0 client credentials flow]().  

This flow is not currently supported by the v2.0 endpoint - which is to say that apps can only get tokens after an interactive user sign-in flow has occurred.  The client credentials flow will be added in the near future.  If you would like to see the client credentials flow in the generally available Azure AD endpoint, check out the [Daemon sample on GitHub]().

### Chained Web APIs (On-Behalf-Of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as Office 365 or the Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the [On-Behalf-Of Flow]().  However, the On-Behalf-Of flow is not currently implemented in the v2.0 endpoint preview.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub]().
