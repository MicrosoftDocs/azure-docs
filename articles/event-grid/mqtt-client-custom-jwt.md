---
title: OAuth 2.0 JWT authentication
description: Describes OAuth 2.0 JWT authentication and authorization to publish or subscribe to MQTT messages
ms.topic: conceptual
ms.custom: build-2024
ms.date: 04/30/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
---

# OAuth 2.0 JSON Web Token (JWT) authentication and authorization to publish or subscribe to MQTT messages 

You can authenticate MQTT clients with OAuth 2.0 JWT to connect to the Event Grid namespace. You can embed and validate custom claims in the JWT to authorize publish or subscribe permissions to your Event Grid topic spaces.

> [!IMPORTANT]
> This feature is supported only when using the MQTT v5 protocol version.

## Prerequisites
- You need an Event Grid namespace with MQTT enabled. Learn about [creating Event Grid namespace](/azure/event-grid/create-view-manage-namespaces#create-a-namespace)

<a name='authentication-using-azure-ad-jwt'></a>

## Authentication using OAuth 2.0 JWT
You can use the MQTT v5 CONNECT packet to provide the OAuth 2.0 JWT to authenticate your client and the MQTT v5 AUTH packet to refresh the token.  

> [!IMPORTANT]
> If you don't set the CONNECT packet's authentication method to CUSTOM-JWT, you receive an 'invalid issuer' error—even if all other configurations are correct.

In the CONNECT packet, you can provide the required values in the following fields:

|Field  | Value  |
|---------|---------|
|Authentication Method | CUSTOM-JWT |
|Authentication Data | JWT |

In the AUTH packet, you can provide the required values in the following fields:

|Field | Value |
|---------|---------|
| Authentication Method | CUSTOM-JWT |
| Authentication Data | JWT |
| Authentication Reason Code | 25 |
 
Authenticate Reason Code with value 25 signifies reauthentication.

> [!NOTE]
> Audience: `aud` claim must be set to `https://[namespace].ts.eventgrid.azure.net/`. 

## Access permissions
A client using OAuth 2.0 JWT authentication can use client attributes and permissions to limit access to specific topics. 

## Next steps
- See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
- How to [Authenticate with namespaces using JSON Web Tokens](authenticate-with-namespaces-using-json-web-tokens.md)
