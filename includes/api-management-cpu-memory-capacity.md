---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 08/27/2024
ms.author: danlep
---

CPU and memory usage reveals consumption of resources by:

+ API Management data plane services, such as request processing, which can include forwarding requests or running a policy.
+ API Management management plane services, such as management actions applied via the Azure portal or Azure Resource Manager, or load coming from the [developer portal](../articles/api-management/api-management-howto-developer-portal.md).
+ Selected operating system processes, including processes that involve cost of TLS handshakes on new connections.
+ Platform updates, such as OS updates on the underlying compute resources for the instance.
+ Number of APIs deployed, regardless of activity, which can consume additional capacity.
