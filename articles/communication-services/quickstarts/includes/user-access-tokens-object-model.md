---
title: include file
description: include file
services: azure-communication-services
author: matthewrobertson
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: marobert
---

## Object model

User Access Tokens enable you to authorize your application's users to connect directly to your Azure Communication Services resource. You generate these tokens on your server, pass them back to your client application, and then use them to initialize the Communication Services client SDKs. To achieve this, you should build a trusted service endpoint that can authenticate your users, and issue user access tokens. This service should maintain a persistent mapping between your application user identities and Azure Communication Services users.

The [CommunicationIdentityClient](../../references/overview.md) class provides all the user and access token related functionality. You instantiate it with a connection string and then use it to manage users, and issue access tokens.

> [!WARNING]
> Tokens are sensitive data, because they grant access to a user's resources. Therefore, it's critical to protect tokens from being compromised. You should create a trusted service endpoint that only issues access tokens to authorized users of your application. If you cache user access tokens to a backing store, it is strongly recommended that you use encryption.

### Access Token Scopes

Scopes allow you to specify the exact Azure Communications Services functionality that a user access token will be able to authorize. Scopes are applied to individual user access tokens. Azure Communication Services supports the following scopes for user access tokens:

| Name                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `chat`                | Grants the ability to participate in a chat                  |
| `voip`                | Grants the ability to make and receive VOIP calls using the calling SDK |
| `pstn`                | Grants the ability to make a PSTN calls using the calling SDK |
| `joinRoom`            | Grants the ability to create or join a group call     |

If you wish to remove a user's ability to access to some specific functionality, you should first [revoke any existing access tokens](#revoke-user-access-tokens) that may include undesired scopes before issuing a new token with a more limited set of scopes.