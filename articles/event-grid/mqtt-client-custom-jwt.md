---
title: Microsoft Entra Custom JWT authentication
description: Describes custom JWT authentication authentication and authorization to publish or subscribe MQTT messages
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# Microsoft Entra Custom JWT authentication and authorization to publish or subscribe MQTT messages

You can authenticate MQTT clients with Custom JWT to connect to Event Grid namespace.  you can embed and validate custom claims in the JWT token to authorize publish or subscribe permissions to your Event Grid topic spaces.

> [!IMPORTANT]
> - This feature is supported only when using MQTT v5 protocol version

## Prerequisites
- You need an Event Grid namespace with MQTT enabled.  Learn about [creating Event Grid namespace](/azure/event-grid/create-view-manage-namespaces#create-a-namespace)

<a name='authentication-using-azure-ad-jwt'></a>

## Authentication using Microsoft Entra JWT
You can use the MQTT v5 CONNECT packet to provide the Custom JWT token to authenticate your client, and you can use the MQTT v5 AUTH packet to refresh the token.  

> [!IMPORTANT]
> - If you don't set the CONNECT packet's authentication method to CUSTOM-JWT, you'll receive an “invalid issuer” error—even if all other configurations are correct.

In CONNECT packet, you can provide required values in the following fields:

|Field  | Value  |
|---------|---------|
|Authentication Method | CUSTOM-JWT |
|Authentication Data | JWT token |

In AUTH packet, you can provide required values in the following fields:

|Field | Value |
|---------|---------|
| Authentication Method | CUSTOM-JWT |
| Authentication Data | JWT token |
| Authentication Reason Code | 25 |
 
Authenticate Reason Code with value 25 signifies reauthentication.

> [!NOTE]
> - Audience: “aud” claim must be set to "https://eventgrid.azure.net/".

## Access permissions
A client using Custom JWT authentication can use client attributes and permissions to limit access to specific topics.

## Next steps
- See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
- How too [Authenticate with namespaces using JSON Web Tokens](authenticate-with-namespaces-using-json-web-tokens.md)
