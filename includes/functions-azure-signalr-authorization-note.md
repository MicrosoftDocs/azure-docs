---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/29/2024
ms.author: glenga
---

For optimal security, your function app should use managed idenities when connecting to the Azure SignalR service instead of using a connection string, which contains a shared secret key. For more information, see [Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities](../articles/azure-signalr/signalr-howto-authorize-managed-identity.md#azure-signalr-service-bindings-in-azure-functions). 