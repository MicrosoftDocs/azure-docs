---
title: Identity model
titleSuffix: An Azure Communication Services concept
description: Learn about the identities and access tokens
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 10/26/2020
ms.topic: conceptual
ms.service: azure-communication-services
---

# Identity model

Azure Communication Services is an identity agnostic service. This design has multiple benefits:
- Reuses existing identities from your identity management system
- Provides flexibility for integration scenarios
- Keeps your identities private to Azure Communication Services

Instead of duplicating existing information in your system, you'll maintain the mapping relationship that your business case requires. For example, you can map identities 1:1, 1:N, N:1, N:M. External identifiers such as phone numbers, users, devices, applications, and GUID can't be used for identity in Azure Communication Services. Access tokens generated for Azure Communication Services identity are used to access primitives such as chat or calling. 

## Identity

You can create identities by using the Azure Communication Services administration library. Identity serves as an identifier in conversations. It's used to create access tokens. The same identity might participate in multiple simultaneous sessions across multiple devices. Identity might have multiple active access tokens at the same time. 

The deletion of an identity, resource, or subscription invalidates all of its access tokens. This action also deletes all data that's stored for the identity. A deleted identity can't create new access tokens or access previously stored data (for example, chat messages). 

You aren't charged for the number of identities you have. Instead, you're charged for the use of primitives. The number your identities doesn't have to restrict how you map your application's identities to the Azure Communication Services identities. 

With the freedom of mapping comes privacy responsibility. If a user wants to be deleted from your system, then you need to delete all identities that are associated with that user.

Azure Communication Services doesn't provide special identities for anonymous users. It doesn't keep the mapping between the users and identities, and it can't determine whether an identity is anonymous. You can design the identity concept to fit your needs. Our recommendation is to create a new identity for each application's anonymous user. Anyone who has a valid access token can access current identity content. For example, users can access chat messages that they sent. The access is restricted only to scopes that are part of the access token. For more information, see the [Access tokens](#access-tokens) section in this article.

### Identity mapping

Azure Communication Services doesn't replicate the functionality of the Azure instance metadata service. It doesn't provide a way for customers to use customer-specific identities. For example, customers can't use a phone number or email address. Instead, Azure Communication Services provides unique identifiers. You can assign these unique identifiers to your application's identities. Azure Communication Services doesn't store any kind of information that might reveal the real identity of your users.

To avoid duplicating information in your system, plan how to map users from your identity domain to Azure Communication Services identities. You can follow any kind of pattern. For example, you can use 1:1, 1:N, N:1, or M:N. Decide whether a single user is mapped to a single identity or to multiple identities. 

When a new identity is created, store its mapping to your application's user or users. Because identities require access tokens to use primitives, the identity needs to be known to your application's user or users.

If you use a relational database to store user information, then you can adjust your plan based on your mapping scenario. For scenarios that map 1:1 or N:1, you might want to add a `CommunicationServicesId` column to the table to store your Azure Communication Services identity. In scenarios that use the relationship 1:N or N:M, you might consider creating a separate table in the relational database.

## Access tokens

An access token is a JSON Web Token (JWT) that can be used to get access to Azure Communication Service primitives. An access token that's issued has integrity protection. That is, its claims can't be changed after it's issued. So a manual change of properties such as identity, expiration, or scopes will invalidate the access token. If primitives are used with invalidated tokens, access will be denied to the primitives. 

The properties of an access token are:
* Identity.
* Expiration.
* Scopes.

An access token is always valid for 24 hours. After it expires, the access token is invalidated and can't be used to access any primitive. 

The identity needs a way to request a new access token from a server-side service. The *scope* parameter defines a nonempty set of primitives that can be used. Azure Communication Services supports the following scopes for access tokens:

|Name|Description|
|---|---|
|Chat|	Grants the ability to participate in a chat|
|VoIP|	Grants the ability to call identities and phone numbers|


If you want to revoke the access token before its expiration, you can use Azure Communication Service Administration library to do so. Revocation of the token isn't immediate and takes up to 15 minutes to propagate. Removal of identity, resource, or subscription will cause revocation of all access tokens. If you wish to remove a user's ability to access specific functionality, revoke all access tokens. Then issue a new access token with a more limited set of scopes.

Rotation of access keys of Azure Communication Service will cause revocation of all active access tokens that were created with former access key. All identities will lose access to the Azure Communication Service and are required to issue new access tokens. 

We recommend issuing access tokens in your server-side service and not in the client's application. The reasoning is, that issuing requires access key or to be managed identity. It isn't recommended for security reasons to share the access keys with the client's application. Client application should use trusted service endpoint that can authenticate your clients, and issue access token on their behalf. More details about the architecture can be found [here](./client-and-server-architecture.md).

If you cache access tokens to a backing store, we recommend using encryption. Access token is sensitive data and can be used to malicious activity if it's not protected. With the possession of the access token, you can initialize the SDK and get access to the API. The accessible API is restricted only based on scopes, that the access token has. We recommend issuing access tokens only with scopes, that are required.

## Next steps

* For an introduction to access token management, see [Create and manage access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens).
* For an introduction to authentication, see [Authenticate to Azure Communication Services](https://docs.microsoft.com/azure/communication-services/concepts/authentication).
* For an introduction to data residency and privacy, see [Region availability and data residency](https://docs.microsoft.com/azure/communication-services/concepts/privacy).