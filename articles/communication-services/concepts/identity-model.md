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

Azure Communication Services is identity agnostic service which has multiple benefits. It allows you to use already existing identities from your identity management system, it is flexible for integration and and removes the necessity to store any kind of information about your identities outside of your identity management system. Instead of duplicating already existing information in your system, you will maintain the mapping relationship that is specific to your business case (e.g. mapping of identities 1:1, 1:N, N:1, N:M). External identifiers (such as phone numbers, users, devices, applications, GUID) therefore can't be used as Azure Communication Identity. Access tokens generated for Azure Communication Service Identity are used to access primitives such as chat or calling. 

## Identity

Identities are created with Azure Communication Service Administration library and represented with unique GUID. Identity serves as identifier in the conversations and is used for creation of access tokens. The same identity can participate in multiple simultaneous sessions across multiple devices. Single identity can have multiple active access tokens with different set of scopes. Deletion of identity, resource or subscription causes invalidation of all it's access tokens and deletion of all data that were stored for this identity. Deleted identity can’t issue new access tokens and can't retrieve stored data (e.g. chat messages). 

You are not charged by the amount of identities you have, but by the usage of primitives. Therefore you are not restricted in a way, how to represent your application's identities to the Azure Communication Services Identities. With the freedom of mapping comes responsibility in the terms of privacy. When your application's user wants to be deleted from your system, you need to delete all identities, that were associated with that user.

Azure Communication Services do not provide special kind of identities for anonymous users. It does not keep the mapping between the users and identities therefore it would not understand whether identity is anonymous. You can design the concept to fit your requirements. Our recommendation is to create new identity for each application's anonymous user. Owner of the valid access token can get access to the content, that was generated for that identity (e.g. chat messages) and was not deleted. The access is restricted only to scopes, that are part of the access token. More details about scopes are in the section *Access Token*.

### Mapping of identities

Azure Communication Services is not replicating the functionality of identity management system and therefore does not provide a way for customers to use customer specific identities such as phone number or email address. Instead it provides unique identifiers, that you can assign to your application's identities. Azure Communication Services do not store any kind of information, that might reveal the real identity of your users.

Instead of duplication, you are encouraged to design, how users from your identity domain will be mapped to Azure Communication Service Identities. You can follow any kind of pattern 1:1, 1:N, N:1 or M:N. You can decide whether single user is mapped to single identity or to multiple identities. When new identity is created, you are encouraged to store the mapping of this identity to your application's user or users. As identities require the access tokens for usage of the primitives, the identity needs to be known for your application's user or users.

For example, if your users are storing mapping in the *User* table of a relational database, you may want to add a *CommunicationServicesId* column to store your Communication Services identity for mapping 1:1 or N:1. If you want to build 1:N or N:M relationship between application's users and identities, you might consider creating a separate table in relational database.

## Access token

Access token is a JWT token that can be used to get access to Azure Communication Service primitives. Access token has integrity protection, therefore after issuing, access token's claims can't be changed (i.e. change of properties such as identity, expiration or scopes will make the access token invalid). Usage of primitives with invalidated tokens will lead to denial of the access to the primitive. The properties of the access token are: identity, expiration and scopes. Access token is always valid for 24 hours. After this time access token is invalided and can’t be used to access any primitive. You needs to make sure, that identity can request new access token from server-side service. Scope defines a non-empty set of primitives, that are accessible with the possession of the access token. Single identity can have multiple active access tokens with different set of scopes. Azure Communication Services supports the following scopes for access tokens:

|Name|Description|
|---|---|
|Chat|	Grants the ability to participate in a chat|
|VoIP|	Grants the ability to call identities and phone numbers|


If you want to revoke the access token before its expiration, you can use Azure Communication Service Administration library to do so. Revocation of the token is not immediate and takes up to 15 minutes to propagate. Removal of identity, resource or subscription will cause revocation of all access tokens. If you wish to remove a user's ability to access specific functionality, you should first revoke any existing access tokens that may include undesired scopes before issuing a new access token with a more limited set of scopes. 
Rotation of access keys of Azure Communication Service will cause revocation of all active access tokens that were created with former access key. All identities will lose access to the Azure Communication Service and are required to issue new access tokens. 

It is recommended to issue access tokens in your server-side service and not in the client's application. The reasoning is, that issuing requires access key or to be managed identity. It is not recommended for security reasons to share the access keys with the clients application. Client application should use trusted service endpoint that can authenticate your clients, and issue access token on their behalf. 

If you cache access tokens to a backing store, it is strongly recommended that you use encryption as it is consider to be sensitive data. More details about the architecture can be found [here](./client-and-server-architecture.md). With the possession of the access token, you can initialize the SDK and get access to the API. The accessible API is restricted only based on scopes, that the access token has. It is therefore recommended to issue access token only with scopes, that are required.