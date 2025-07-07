---
title: Identity model
titleSuffix: An Azure Communication Services article
description: This article describes identities and access tokens.
author: FarrukhGhaffar
manager: cassidyfein
services: azure-communication-services

ms.author: faghaffa
ms.date: 01/02/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
---

# Identity model

Azure Communication Services is an identity-agnostic service, which offers multiple benefits:

- Reuse existing identities from your identity management system and map them with Azure Communication Services identities. 
- Works well with any existing identity system and has no dependency on a specific identity provider.
- Keep your user's data, such as their name, private as you don't need to duplicate it in Azure Communication Services.

Azure Communication Services identity model works with two key concepts.

## User identity / mapping

When you create a user identity via SDK or REST API, Azure Communication Services creates a unique user identifier. You can't use external identifiers such as phone numbers, user/device/application IDs, or user names directly in Azure Communication Services. Instead, you need to use the Communication Services identities and maintain a mapping to your own user ID system as needed.

You can create Azure Communication Service user identities for free. The only charges are incurred when the user consumes communication services such as a chat or a call. How you use your generated Communication Services identity depends on your scenario. For example, you can map an identity 1:1, 1:N, N:1, or N:N, and you can use it for human users or applications. Your end-user can participate in multiple communication sessions, using multiple devices, simultaneously.

Managing a mapping between Azure Communication Services user identities and your own identity system is your responsibility as a developer, and doesn't come built-in. For example, you can add a `CommunicationServicesId` column in your existing user table to store the associated Azure Communication Services identity. A mapping design is described in more detail under [Client-server architecture](#client-server-architecture).

## (Preview) Simplify identity mapping with `customId`

> [!IMPORTANT]  
> This feature is available starting with the Identity SDK version `1.4.0-beta1` and REST API version `2025-03-02-preview`.

> [!NOTE]
> This feature is currently in preview.

Previously, developers were responsible for maintaining a mapping between their own user identity system and Azure Communication Services identities. With the introduction of the `customId` parameter, you can now associate your own user identifiers—such as email addresses or internal user IDs—directly when creating a Communication Services identity.

When you create a user with a `customId`, Azure Communication Services will return the same identity if you call the method again with the same `customId`. This eliminates the need to store and manage the mapping yourself.

This feature is supported in both the SDK and REST API, and is especially useful for scenarios where you want to maintain a consistent identity across sessions, devices, or services without additional storage overhead.

## Access tokens

After you create a user identity, the end-user then needs an access token with specific scopes to participate in communications using chat or calls. For example, only a user with a token of `chat` scope can participate in chat. Only a user with a token of `voip` scope can participate in a VoIP call.

A user can have multiple tokens simultaneously. Azure Communication Services supports multiple token scopes to account for users who require full access vs limited access. Access tokens have the following properties.

| Property | Description |
| --- | --- |
| Subject | The user identity represented by the token. |
| Expiration | An access token is valid for at least 1 hour and up to 24 hours. After it expires, the access token is invalid and can't be used to access the service. To create a token with a custom expiration time, specify the desired validity in minutes (>=60, <1440). By default, the token is valid for 24 hours. We recommend using short lifetime tokens for single meetings and longer lifetime tokens for users who need your application for longer periods of time.|
| Scopes |The scopes define which services (Chat/VoIP) can be accessed with the token.|

An access token is a JSON Web Token (JWT) and has integrity protection. That is, its claims can't be changed without invalidating the access token because then the token signature no longer matches. If communication primitives are used with invalid tokens, access is denied. Even though tokens aren't encrypted or obfuscated, your application shouldn't depend on the token format or its claims. The token format can change and isn't part of the official API contract. Azure Communication Services supports the following scopes for access tokens.

### Chat token scopes

The identity model supports three different chat token scopes. Permissions for each scope are described in the following table.
- `chat`
- `chat.join`
- `chat.join.limited`

| Capability / Token scope | `chat` | `chat.join` | `chat.join.limited` |
| --- |--- | --- | --- |
| Create chat thread | Y | N | N |
| Update chat thread with ID | Y | N | N |
| Delete chat thread with ID | Y | N | N |
| Add participant to a chat thread | Y | Y | N |
| Remove participant from a chat thread | Y | Y | N |
| Get chat threads | Y | Y | Y |
| Get chat thread with ID | Y | Y | Y |
| Get ReadReceipt | Y | Y | Y |
| Create ReadReceipt | Y | Y | Y |
| Create message for chat thread with ID | Y | Y | Y |
| Get message with message ID | Y | Y | Y |
| Update your own message with message ID | Y | Y | Y |
| Delete your own message with message ID | Y | Y | Y |
| Send typing indicator | Y | Y | Y |
| Get participant for thread ID | Y | Y | Y |

### VoIP token scopes

The identity model supports two VoIP token scopes. Permissions for each scope are described in the following table.
- `voip`
- `voip.join`

| Capability / Token scope | `voip` | `voip.join` |
| --- | --- | --- |
| Start a VoIP call | Y | N |
| Start a VoIP call in Virtual Rooms, when the user is already invited to the Room | Y | Y |
| Join an InProgress VoIP call | Y | Y |
| Join an InProgress VoIP call in Virtual Rooms, when the user is already invited to the Room | Y | Y |
| All other in-call operations such as mute/unmute, screen share, and so on | Y | Y |
| All other in-call operations such as mute/unmute, screen share, and so on, in Virtual Rooms | Determined by user role | Determined by user role |

You can use the `voip.join` scope together with [Rooms](./rooms/room-concept.md) to create a scheduled call. In this scenario, only invited users get access and users are prohibited from creating any other calls.

### Revoke or update access token
- Azure Communication Services Identity library can be used to revoke an access token before its expiration time. Token revocation isn't immediate. It can take up to 15 minutes to propagate.
- Deleting an identity, resource, or subscription revokes all access tokens.
- If you want to remove a user's ability to access specific functionality, revoke all access tokens for the user. Then issue a new access token that has a more limited set of scopes.
- Rotation of access keys revokes all active access tokens that were created by using a former access key. So all identities lose access to Azure Communication Services and need new access tokens.

## Client-server architecture

Create and manage user access tokens through a trusted service and not create tokens in your client application. You need the connection string or Microsoft Entra credentials to create user access tokens. Remember to protect the credentials, passing them to a client would risk leaking the secret. Failure to properly manage access tokens can result in extra charges on your resource when tokens are dispensed freely and misused by someone else.

If you cache access tokens to a backing store, we recommend encrypting the tokens. An access token gives access to sensitive data and can be used for malicious activity if it isn't protected. Anyone with a user's access token can access that user's chat data or participate in calls impersonating the user.

Make sure to include only those scopes in the token that your client application needs in order to follow the security principle of least privilege.

:::image type="content" source="./media/architecture-identity.png" alt-text="Diagram that shows the user access token architecture." border="false":::

1. A user starts the client application.
1. The client application contacts your identity management service.
1. The identity management service authenticates the application user. You can skip authentication for scenarios where the user is anonymous, but be careful to then add other protective measures such as throttling and CORS to your service to mitigate token abuse.
1. Create or find a Communication Services identity for the user.
   1. _Stable identity scenario:_ Your identity management service maintains a mapping between application identities and Communication Services identities. (Application identities include your users and other addressable objects, like services or bots.) If the application identity is new, a new Communication identity is created and a mapping is stored.
   1. _Ephemeral identity scenario:_ The identity management service creates a new Communication identity. In this scenario, the same user ends up with a different Communication identity for each session.
1. The identity management service issues a user access token for the applicable identity and returns it to the client application.

Azure App Service or Azure Functions are two alternatives for operating the identity management service. These services scale easily and have built-in features to [authenticate](../../app-service/overview-authentication-authorization.md) users. They're integrated with [OpenID](../../app-service/configure-authentication-provider-openid-connect.md) and third-party identity providers like [Facebook](../../app-service/configure-authentication-provider-facebook.md).

## Next steps

* To issue tokens, see [Create and manage access tokens for end users](../quickstarts/identity/access-tokens.md).
* For an introduction to authentication, see [Authenticate to Azure Communication Services](./authentication.md).
* To read about data residency and privacy, see [Region availability and data residency](./privacy.md).
* For a full sample of a simple identity management service, see [Trusted service tutorial](../tutorials/trusted-service-tutorial.md).
* For a more advanced identity management sample which integrates with Entra ID and Microsoft Graph, see [Authentication service hero sample](../samples/trusted-auth-sample.md).
