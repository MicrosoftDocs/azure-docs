<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to build apps directly using the protocols supported by the Azure AD B2C preview."
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
	ms.date="09/22/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Authentication Protocols

Azure AD B2C provides identity-as-a-service for your apps by supporting two industry standard protocols, OpenID Connect and OAuth 2.0.  While the service is standards compliant, there can be subtle differences between any two implementations of these protocols.  The information here will be useful if you choose to write your code by directly sending & handling HTTP requests, rather than using one of our open source libraries.  We reccommend you read the brief information on this page before diving into the details of each specific protocol, but if you are familiar with Azure AD B2C already you can go straight to [the protocol reference guides](#protocols).

<!-- TODO: Need link to libraries above -->

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]
	
## The Basics
Every app that uses Azure AD B2C will need to be registered your B2C directory in the [Azure Portal](https://portal.azure.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** or **Package Identifier** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-b2c-app-registration.md).

Once registered, the  app communicates with Azure AD by sending requests to the v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

In nearly all OAuth & OpenID Connect flows, there are four parties involved in the exchange:

![OAuth 2.0 Roles](./media/active-directory-b2c-reference-protocols/protocols_roles.png)

- The **Authorization Server** is the Azure AD v2.0 Endpoint.  It is responsible for ensuring the user's identity, granting and revoking access to resources, and issuing tokens.  It is also known as the identity provider - it securely handles anything to do with the user's information, their access, and the trust relationships between parties in an flow.
- The **Resource Owner** is typically the end-user.  It is the party that owns the data, and has the power to allow third parties to access that data, or resource.
- The **OAuth Client** is your app, identified by its Application Id.  It is usually the party that the end-user interacts with, and it requests tokens from the authorization server.  The client must be granted permission to access the resource by the resource owner.
- The **Resource Server** is where the resource or data resides.  It trusts the Authorization Server to securely authenticate and authorize the OAuth Client, and uses Bearer access_tokens to ensure that access to a resource can be granted.

## Policies

Arguably, Azure AD B2C **policies** are the most important feature of the service.  Azure AD B2C extends the standard OAuth 2.0 and OpenID Connect protocols by introducing policies, which allow Azure AD B2C to perform much more than simple authentication and authorization.
Policies fully describe consumer identity experiences such as sign up, sign in or profile editing.  They can be defined in an admininstrative UI, and executed by using a special query parameter in HTTP authentication requests.  Policies are not a standard feature of OAuth 2.0
and OpenID Connect, so you should take the time to understand them.  For more information, read the [Azure AD B2C policy reference guide](active-directory-b2c-reference-policies.md).


## Tokens
Azure AD B2C's implementation of OAuth 2.0 and OpenID Connect make extensive use of bearer tokens, including bearer tokens represented as JWTs. A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your  app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Further details of different types of tokens used in Azure AD B2C is available in [the Azure AD token reference](active-directory-b2c-reference-tokens.md).

## Protocols

If you're ready to see some example requests, get started with one of the below tutorials.  Each one corresponds to a particular authentication scenario.  If you need help determining which is the right flow for you,
check out [the types of apps you can build with Azure AD B2C](active-directory-b2c-apps.md).

- [Build Mobile and Native Application with OAuth 2.0](active-directory-b2c-reference-oauth-code.md)
- [Build Web Apps with Open ID Connect](active-directory-b2c-reference-oidc.md)
- Build Single Page Apps with the OAuth 2.0 Implicit Flow (coming soon)
- Build Daemons or Server Side Processes with the OAuth 2.0 Client Credentials Flow (coming soon)
- Get tokens using a username & password with the OAuth 2.0 Resource Owner Password Credentials Flow (coming soon)
- Get tokens in a Web API with the OAuth 2.0 On Behalf Of Flow (coming soon)

<!-- [Call the Azure AD Graph API using the OAuth 2.0 Client Credentials Flow](active-directory-reference-graph.md) -->
