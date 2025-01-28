---
title: 'Azure Event Grid Namespace MQTT client authentication'
description: 'Describes how MQTT clients are authenticated and mTLS connection is established when a client connects to Azure Event Grid’s MQTT broker feature.'
ms.topic: concept-article
ms.date: 01/27/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
# Customer intent: I want to learn about different types of authentication that MQTT broker in Azure Event Grid supports. 
---

# Client authentication

Azure Event Grid's MQTT broker supports the following authentication modes. 

- Certificate-based authentication
- Microsoft Entra ID authentication
- Custom JWT authentication

## Certificate-based authentication
You can use Certificate Authority (CA) signed certificates or self-signed certificates to authenticate clients. For more information, see [MQTT Client authentication using certificates](mqtt-client-certificate-authentication.md).

## Microsoft Entra ID authentication
You can authenticate MQTT clients with Microsoft Entra JWT to connect to Event Grid namespace. You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Microsoft Entra identity, to publish or subscribe access to specific topic spaces. For more information, see [Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages](mqtt-client-microsoft-entra-token-and-rbac.md). 

## Custom JWT authentication
You can authenticate MQTT clients  using JSON Web Tokens (JWT) issued by any third-party OpenID Connect (OIDC) identity provider. This authentication method provides a lightweight, secure, and flexible option for MQTT clients that aren't provisioned in Azure. For more information, see [authenticate client using custom JWT](mqtt-client-custom-jwt.md)

## Related content
- Learn how to [authenticate clients using certificate chain](mqtt-certificate-chain-client-authentication.md)
- Learn how to [authenticate client using Microsoft Entra ID token](mqtt-client-azure-ad-token-and-rbac.md)
- Learn how to [authenticate client using custom JWT](mqtt-client-custom-jwt.md)
- See [Transport layer security with MQTT broker](mqtt-transport-layer-security-flow.md)
