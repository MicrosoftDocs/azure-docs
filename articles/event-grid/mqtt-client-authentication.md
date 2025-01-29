---
title: 'Azure Event Grid Namespace MQTT client authentication'
description: 'Describes how MQTT clients are authenticated and mTLS connection is established when a client connects to Azure Event Grid’s MQTT broker feature.'
ms.topic: concept-article
ms.date: 01/21/2025
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
# Customer intent: I want to learn about different types of authentication that MQTT broker in Azure Event Grid supports. 
---

# Client authentication

Azure Event Grid's MQTT broker supports the following authentication modes. 

- Certificate-based authentication
- Microsoft Entra ID authentication 

## Certificate-based authentication
You can use Certificate Authority (CA) signed certificates or self-signed certificates to authenticate clients. For more information, see [MQTT Client authentication using certificates](mqtt-client-certificate-authentication.md).

## Microsoft Entra ID authentication
You can authenticate MQTT clients with Microsoft Entra JWT to connect to Event Grid namespace. You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Microsoft Entra identity, to publish or subscribe access to specific topic spaces. For more information, see [Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages](mqtt-client-microsoft-entra-token-and-rbac.md). 

## Related content
- Learn how to [authenticate clients using certificate chain](mqtt-certificate-chain-client-authentication.md)
- Learn how to [authenticate client using Microsoft Entra ID token](mqtt-client-azure-ad-token-and-rbac.md)
- See [Transport layer security with MQTT broker](mqtt-transport-layer-security-flow.md)
