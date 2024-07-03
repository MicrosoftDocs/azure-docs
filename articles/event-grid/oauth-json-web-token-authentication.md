---
title: Namespace authentication using JSON Web Tokens
description: This article describes authentication of Azure Event Grid namespaces using JSON Web Tokens.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/21/2024
author: george-guirguis
ms.author: geguirgu
---

# OAuth 2.0 (JSON Web Token) authentication with Azure Event Grid namespaces
This article shows how to authenticate with Azure Event Grid namespace using JSON Web Tokens.

OAuth 2.0 (JSON Web Token) authentication allows clients to authenticate and connect with the MQTT broker using JSON Web Tokens (JWT) issued by any OpenID Connect identity provider, apart from Microsoft Entra ID. MQTT clients can get their token from their identity provider and provide the token in the MQTTv5 or MQTTv3.1.1 CONNECT packets to authenticate with the MQTT broker. This authentication method provides a lightweight, secure, and flexible option for MQTT clients that aren't provisioned in Azure.  

## High-level steps 

To use custom JWT authentication for namespaces, follow these steps: 

1. Create a namespace and configure its subresources.
1. Enable managed identity on your Event Grid namespace. 
1. Create an Azure Key Vault account that hosts the CA certificate that includes your public keys. 
1. Add role assignment in Azure Key Vault for the namespace’s managed identity. 
1. Configure custom authentication settings on your Event Grid namespace 
1. Your clients can connect to the Event Grid namespace using the tokens provided by your identity provider. 


## Next step
For step-by-step instructions, see [Authenticate with MQTT broker using OAuth 2.0 authentication](authenticate-with-namespaces-using-json-web-tokens.md).
