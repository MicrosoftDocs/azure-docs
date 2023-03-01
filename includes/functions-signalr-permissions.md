---
author: Y-Sindo
ms.service: azure-functions
ms.topic: include
ms.date: 03/01/2023
ms.author: zityang
---

You'll need to create a role assignment that provides access to Azure SignalR Service data plane REST APIs. We recommend you to use the built-in role [SignalR Service Owner](../articles/role-based-access-control/built-in-roles.md#signalr-service-owner). Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) aren't sufficient.