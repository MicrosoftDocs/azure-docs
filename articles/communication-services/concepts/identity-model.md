---
title: Identity model
titleSuffix: An Azure Communication Services concept
description: Learn about the identities and access tokens
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
---

# Identity model

Azure Communication Services is an identity-agnostic service. This design offers multiple benefits:

- Reuses existing identities from your identity management system
- Provides flexibility for integration scenarios
- Keeps your identities private in Azure Communication Services

Instead of duplicating information in your system, you'll maintain the mapping relationship that your business case requires. For example, you can map identities 1:1, 1:N, N:1, N:M. External identifiers such as phone numbers, users, devices, applications, and GUIDs can't be used for identity in Azure Communication Services. Access tokens that are generated for an Azure Communication Services identity are used to access primitives such as chat or calling.

## Identity

You can create identities by using the Azure Communication Services Identity library. An identity serves as an identifier in conversations. It's used to create access tokens. The same identity might participate in multiple simultaneous sessions across multiple devices. An identity might have multiple active access tokens at the same time.

The deletion of an identity, resource, or subscription invalidates all of its access tokens. This action also deletes all data that's stored for the identity. A deleted identity can't create new access tokens or access previously stored data (for example, chat messages).

You aren't charged for the number of identities you have. Instead, you're charged for the use of primitives. The number of your identities doesn't have to restrict how you map your application's identities to the Azure Communication Services identities.

With the freedom of mapping comes privacy responsibility. If a user wants to be deleted from your system, then you need to delete all identities that are associated with that user.

Azure Communication Services doesn't provide special identities for anonymous users. It doesn't keep the mapping between the users and identities, and it can't determine whether an identity is anonymous. You can design the identity concept to fit your needs. Our recommendation is to create a new identity for each anonymous user on each application.

Anyone who has a valid access token can access current identity content. For example, users can access chat messages that they sent. The access is restricted only to scopes that are part of the access token. For more information, see the [Access tokens](#access-tokens) section in this article.

### Identity mapping

Azure Communication Services doesn't replicate the functionality of the Azure identity management system. It doesn't provide a way for customers to use customer-specific identities. For example, customers can't use a phone number or email address. Instead, Azure Communication Services provides unique identifiers. You can assign these unique identifiers to your application's identities. Azure Communication Services doesn't store any kind of information that might reveal the real identity of your users.

To avoid duplicating information in your system, plan how to map users from your identity domain to Azure Communication Services identities. You can follow any kind of pattern. For example, you can use 1:1, 1:N, N:1, or M:N. Decide whether a single user is mapped to a single identity or to multiple identities.

When a new identity is created, store its mapping to your application's user or users. Because identities require access tokens to use primitives, the identity needs to be known to your application's user or users.

If you use a relational database to store user information, then you can adjust your design based on your mapping scenario. For scenarios that map 1:1 or N:1, you might want to add a `CommunicationServicesId` column to the table to store your Azure Communication Services identity. In scenarios that use the relationship 1:N or N:M, you might consider creating a separate table in the relational database.

## Access tokens

An access token is a JSON Web Token (JWT) that can be used to get access to Azure Communication Service primitives. An access token that's issued has integrity protection. That is, its claims can't be changed after it's issued. So a manual change of properties such as identity, expiration, or scopes will invalidate the access token. If primitives are used with invalidated tokens, then access will be denied to the primitives.

The properties of an access token are:
* Identity.
* Expiration.
* Scopes.

An access token is valid for a period of time between 1 and 24 hours. After it expires, the access token is invalidated and can't be used to access any primitive.
To generate a token with a custom validity, specify the desired validity period when generating the token. If no custom validity is specified, the token will be valid for 24 hours. 
We recommend using short lifetime tokens for one-off meetings and longer lifetime tokens for agents using the application for longer periods of time.

An identity needs a way to request a new access token from a server-side service. The *scope* parameter defines a nonempty set of primitives that can be used. Azure Communication Services supports the following scopes for access tokens.

|Name|Description|
|---|---|
|Chat|	Grants the ability to participate in a chat|
|VoIP|	Grants the ability to call identities and phone numbers|


To revoke an access token before its expiration time, use the Azure Communication Services Identity library. Token revocation isn't immediate. It takes up to 15 minutes to propagate. The removal of an identity, resource, or subscription revokes all access tokens.

If you want to remove a user's ability to access specific functionality, revoke all access tokens. Then issue a new access token that has a more limited set of scopes.

In Azure Communication Services, a rotation of access keys revokes all active access tokens that were created by using a former access key. All identities lose access to Azure Communication Services, and they must issue new access tokens.

We recommend issuing access tokens in your server-side service and not in the client's application. The reasoning is that issuing requires an access key or Azure AD authentication. Sharing secrets with the client's application isn't recommended for security reasons.

The client application should use a trusted service endpoint that can authenticate your clients. The endpoint should issue access tokens on their behalf. For more information, see [Client and server architecture](./client-and-server-architecture.md).

If you cache access tokens to a backing store, we recommend using encryption. An access token is sensitive data. It can be used for malicious activity if it's not protected. Someone who has an access token can start the SDK and access the API. The accessible API is restricted only based on the scopes that the access token has. We recommend issuing access tokens that have only the required scopes.

## Next steps

* For an introduction to access token management, see [Create and manage access tokens](../quickstarts/identity/access-tokens.md).
* For an introduction to authentication, see [Authenticate to Azure Communication Services](./authentication.md).
* For an introduction to data residency and privacy, see [Region availability and data residency](./privacy.md).
* To learn how to quickly create identities for testing, see the [quick-create identity quickstart](../quickstarts/identity/quick-create-identity.md).
