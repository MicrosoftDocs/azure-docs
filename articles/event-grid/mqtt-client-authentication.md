---
title: 'Azure Event Grid Namespace MQTT client authentication'
description: 'Describes how MQTT clients are authenticated and mTLS connection is established when a client connects to Azure Event Grid’s MQTT broker feature.'
ms.topic: concept-article
ms.date: 05/01/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
# Customer intent: I want to learn about different types of authentication that MQTT broker in Azure Event Grid supports.
ms.custom:
  - build-2025
---

# Client authentication

Azure Event Grid's MQTT broker supports the following authentication modes. 

- Certificate-based authentication
- Microsoft Entra ID authentication
- OAuth 2.0 (JSON Web Token) authentication
- Customer Webhook authentication 

## Certificate-based authentication
You can use Certificate Authority (CA) signed certificates or self-signed certificates to authenticate clients. For more information, see [MQTT Client authentication using certificates](mqtt-client-certificate-authentication.md).

## Microsoft Entra ID authentication
You can authenticate MQTT clients with Microsoft Entra JWT to connect to Event Grid namespace. You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Microsoft Entra identity, to publish or subscribe access to specific topic spaces. For more information, see [Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages](mqtt-client-microsoft-entra-token-and-rbac.md). 

## OAuth 2.0 JWT authentication 
You can authenticate MQTT clients using JSON Web Tokens (JWT) issued by any third-party OpenID Connect (OIDC) identity provider. This authentication method provides a lightweight, secure, and flexible option for MQTT clients that aren't provisioned in Azure. For more information, see [Authenticate client using OAuth 2.0 JWT](mqtt-client-custom-jwt.md). 

## Custom Webhook Authentication  
Webhook authentication allows external HTTP endpoints (webhooks or functions) to authenticate MQTT connections dynamically. This method uses Entra ID JWT (JSON Web Tokens)  validation to ensure secure access. When a device or client attempts to connect, Event Grid transmits relevant connection details to the configured webhook. The webhook is responsible for evaluating the authentication request and returning a response that determines whether the connection is permitted. Additionally, the webhook can enrich the response with metadata that Event Grid will use to authorize subsequent MQTT packets, ensuring fine-grained control over actions such as topic access and message publishing. This approach enables seamless integration with custom authentication systems, identity providers, and enterprise security policies. For more information, see [Authenticate with the MQTT broker by using custom webhook authentication](authenticate-with-namespaces-using-webhook-authentication.md).

## Related content
- Learn how to [authenticate clients using certificate chain](mqtt-certificate-chain-client-authentication.md)
- Learn how to [authenticate client using Microsoft Entra ID token](mqtt-client-azure-ad-token-and-rbac.md)
- Learn how to [authenticate client using OAuth 2.0 JWT](mqtt-client-custom-jwt.md) 
- See [Transport layer security with MQTT broker](mqtt-transport-layer-security-flow.md)
