---
title: MQTT client authentication in Azure Event Grid
description: Learn how the MQTT broker feature in Azure Event Grid authenticates clients by using certificates, Microsoft Entra ID, OAuth 2.0 JSON Web Tokens, and custom webhooks.
ms.topic: concept-article
ms.date: 06/22/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
ms.custom:
  - build-2025
---

# MQTT client authentication in Azure Event Grid

MQTT client authentication is the process by which the MQTT broker feature in Azure Event Grid verifies a client's identity before allowing it to connect and exchange messages. The MQTT broker authenticates clients during the connection handshake. Authentication is a prerequisite for the authorization checks that govern publish and subscribe operations.

The MQTT broker supports several authentication modes, so you can match the method to your client's capabilities, deployment location, and identity provider.

## Certificate-based authentication

You can authenticate clients by using Certificate Authority (CA)-signed certificates or self-signed certificates. The MQTT broker validates the client certificate as part of the mutual TLS (mTLS) connection handshake.

For more information, see [MQTT client authentication using certificates](mqtt-client-certificate-authentication.md).

## Microsoft Entra ID authentication

You can authenticate MQTT clients that have a Microsoft Entra identity by using a Microsoft Entra JSON Web Token (JWT). Azure role-based access control (Azure RBAC) determines whether the client can publish to or subscribe to specific topic spaces. This method suits clients that run in Azure or in environments that can acquire Microsoft Entra tokens.

For more information, see [Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages](mqtt-client-microsoft-entra-token-and-rbac.md).

## OAuth 2.0 JWT authentication

You can authenticate MQTT clients by using JWTs issued by a third-party OpenID Connect (OIDC) identity provider. Use this method for MQTT clients that aren't provisioned in Azure but already have an identity in an external identity provider.

For more information, see [Authenticate a client by using OAuth 2.0 JWT](mqtt-client-custom-jwt.md).

## Custom webhook authentication

Webhook authentication enables external HTTPS endpoints, such as a webhook or an Azure function that you control, to dynamically authenticate MQTT connections. The webhook validates a JWT issued by Microsoft Entra ID and returns the authentication decision to the Event Grid namespace. Use this mode when you need to integrate the MQTT broker with custom authentication systems, third-party identity providers, or enterprise security policies.

The authentication flow works like this:

1. An MQTT client attempts to connect to the Event Grid namespace.
1. Event Grid sends the connection details to the configured webhook.
1. The webhook evaluates the authentication request and returns a response that permits or denies the connection.
1. The webhook can include metadata in the response. Event Grid uses this metadata to authorize subsequent MQTT packets, which provides fine-grained control over topic access and message publishing.

For more information, see [Authenticate with the MQTT broker by using custom webhook authentication](authenticate-with-namespaces-using-webhook-authentication.md).

## Related content

- [Authenticate a client by using a certificate chain](mqtt-certificate-chain-client-authentication.md)
- [Authenticate a client by using a Microsoft Entra ID token](mqtt-client-microsoft-entra-token-and-rbac.md)
- [Authenticate a client by using OAuth 2.0 JWT](mqtt-client-custom-jwt.md)
- [Transport Layer Security with the MQTT broker](mqtt-transport-layer-security-flow.md)
