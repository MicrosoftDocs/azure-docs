<properties
	pageTitle="App Model v2.0 Protocols | Microsoft Azure"
	description="The protocols supported by the Azure AD v2.0 app model public preview."
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
	ms.date="11/10/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Protocols - OAuth 2.0 & OpenID Connect

The v2.0 app model provides identity-as-a-service for your apps by supporting industry standard protocols, OpenID Connect and OAuth 2.0.  While the service is standard compliant, there can be subtle differences between any two implementations of these protocols.  The information here will be useful if you choose to write your code by directly sending & handling HTTP requests, rather than using one of our open source libraries.
<!-- TODO: Need link to libraries above -->

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## The Basics
Every app that uses the v2.0 app model will need to be registered at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** or **Package Identifier** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-v2-app-registration.md).

Once registered, the  app communicates with Azure AD my sending requests to the v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

In nearly all OAuth & OpenID Connect flows, there are four parties involved in the exchange:

![OAuth 2.0 Roles](../media/active-directory-v2-flows/protocols_roles.png)

- The **Authorization Server** is the v2.0 Endpoint.  It is responsible for ensuring the user's identity, granting and revoking access to resources, and issuing tokens.  It is also known as the identity provider - it securely handles anything to do with the user's information, their access, and the trust relationships between parties in an flow.
- The **Resource Owner** is typically the end-user.  It is the party that owns the data, and has the power to allow third parties to access that data, or resource.
- The **OAuth Client** is your app, identified by its Application Id.  It is usually the party that the end-user interacts with, and it requests tokens from the authorization server.  The client must be granted permission to access the resource by the resource owner.
- The **Resource Server** is where the resource or data resides.  It trusts the Authorization Server to securely authenticate and authorize the OAuth Client, and uses Bearer access_tokens to ensure that access to a resource can be granted.


## Tokens
The v2.0 app model's implementation of OAuth 2.0 and OpenID Connect make extensive use of bearer tokens, including bearer tokens represented as JWTs. A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your  app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Further details of different types of tokens used in the v2.0 app model is available in [the v2.0 app model token reference](active-directory-v2-tokens.md).

## Protocols

If you're ready to see some example requests, get started with one of the below tutorials.  Each one corresponds to a particular authentication scenario.  If you need help determining which is the right flow for you,
check out [the types of apps you can build with app model v2.0](active-directory-v2-flows.md).

- [Build Mobile and Native Application with OAuth 2.0](active-directory-v2-protocols-oauth-code.md)
- [Build Web Apps with Open ID Connect](active-directory-v2-protocols-oidc.md)
- [Build Single Page Apps with the OAuth 2.0 Implicit Flow](active-directory-v2-protocols-implicit.md)
- Build Daemons or Server Side Processes with the OAuth 2.0 Client Credentials Flow (coming soon)
- Get tokens in a Web API with the OAuth 2.0 On Behalf Of Flow (coming soon)

<!-- - Get tokens using a username & password with the OAuth 2.0 Resource Owner Password Credentials Flow (coming soon) --> 
<!-- [Call the Azure AD Graph API using the OAuth 2.0 Client Credentials Flow](active-directory-reference-graph.md) -->