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

## Identity model

Azure Communication Services is identity agnostic service. This design has multiple benefits:
- Reuse existing identities from your identity management system
- Flexibility for integration scenarios
- Keeps your identities private to the Azure Communication Services

Instead of duplicating existing information in your system, you will maintain the mapping relationship that is specific to your business case. For example, mapping of identities 1:1, 1:N, N:1, N:M. External identifiers (such as phone numbers, users, devices, applications, GUID) can't be used as Azure Communication Identity. Access tokens generated for Azure Communication Service Identity are used to access primitives such as chat or calling. 

## Identity

Identities are created with Azure Communication Service Administration library and represented with unique GUID. Identity serves as identifier in the conversations and is used for creation of access tokens. The same identity might participate in multiple simultaneous sessions across multiple devices. Single identity can have multiple active access tokens with different set of scopes. Deletion of identity, resource, or subscription causes invalidation of all its access tokens and deletion of all data that are stored for this identity. Deleted identity can’t issue new access tokens and can't retrieve stored data (for example, chat messages). 

You aren't charged by the number of identities you have, but by the usage of primitives. Number of identities don't have to restrict, how to map your application's identities to the Azure Communication Services Identities. With the freedom of mapping comes responsibility in the terms of privacy. When your application's user wants to be deleted from your system, you need to delete all identities, that were associated with that user.

Azure Communication Services doesn't provide special identities for anonymous users. It doesn't keep the mapping between the users and identities, it would not understand whether identity is anonymous. You can design the concept to fit your requirements. Our recommendation is to create new identity for each application's anonymous user. With the possession of the valid access token, can anyone get access to the content, that was generated for that identity and wasn't yet deleted. For example, chat messages sent by the user. The access is restricted only to scopes, that are part of the access token. More details about scopes are in the section *Access Token*.

### Mapping of identities

Azure Communication Services isn't replicating the functionality of IMS. It doesn't provide a way for customers to use customer-specific identities. For example, phone number or email address. Instead it provides unique identifiers, that you can assign to your application's identities. Azure Communication Services doesn't store any kind of information, that might reveal the real identity of your users.

Instead of duplication, you are encouraged to design, how users from your identity domain will be mapped to Azure Communication Service Identities. You can follow any kind of pattern 1:1, 1:N, N:1 or M:N. You can decide whether single user is mapped to single identity or to multiple identities. When new identity is created, you are encouraged to store the mapping of this identity to your application's user or users. As identities require the access tokens for usage of the primitives, the identity needs to be known for your application's user or users.

For example, if you want to have mapping 1:1 and storing users in the *User* table of a relational database, you may add a *CommunicationServicesId* column to store your Azure Communication Services identity. If you want to build 1:N or N:M relationship between application's users and identities, you might consider creating a separate table in relational database.

## Access token

Access token is a JWT token that can be used to get access to Azure Communication Service primitives. Issued access token has integrity protection, it's claims can't be changed after issuing. That is, the manual change of properties such as identity, expiration, or scopes will make the access token invalid. Usage of primitives with invalidated tokens will lead to denial of the access to the primitive. The properties of the access token are: identity, expiration, and scopes. Access token is always valid for 24 hours. After this time access token is invalidated and can’t be used to access any primitive. Identity has to have a way, how to request new access token from server-side service. Scope defines a non-empty set of primitives, that are accessible with the possession of the access token. Azure Communication Services supports the following scopes for access tokens:

|Name|Description|
|---|---|
|Chat|	Grants the ability to participate in a chat|
|VoIP|	Grants the ability to call identities and phone numbers|


If you want to revoke the access token before its expiration, you can use Azure Communication Service Administration library to do so. Revocation of the token isn't immediate and takes up to 15 minutes to propagate. Removal of identity, resource or subscription will cause revocation of all access tokens. If you wish to remove a user's ability to access specific functionality, first revoke all access tokens and then issue a new access token with a more limited set of scopes.
Rotation of access keys of Azure Communication Service will cause revocation of all active access tokens that were created with former access key. All identities will lose access to the Azure Communication Service and are required to issue new access tokens. 

We recommend to issue access tokens in your server-side service and not in the client's application. The reasoning is, that issuing requires access key or to be managed identity. It isn't recommended for security reasons to share the access keys with the client's application. Client application should use trusted service endpoint that can authenticate your clients, and issue access token on their behalf. 

If you cache access tokens to a backing store, it is recommended that you use encryption as it is considered to be sensitive data. More details about the architecture can be found [here](./client-and-server-architecture.md). With the possession of the access token, you can initialize the SDK and get access to the API. The accessible API is restricted only based on scopes, that the access token has. It is recommended to issue access token only with scopes, that are required.