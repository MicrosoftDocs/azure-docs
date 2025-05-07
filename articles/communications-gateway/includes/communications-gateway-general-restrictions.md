---
ms.service: azure-communications-gateway
ms.topic: include
ms.date: 01/10/2022
---

The following restrictions apply to all Azure Communications Gateways:

* All traffic must use IPv4.
* All traffic must use TLS 1.2 or greater. Earlier versions aren't supported.
* The number of active calls is limited to 15% of the number of users assigned to Azure Communications Gateway. For the definition of users, see [Plan and manage costs for Azure Communications Gateway](/azure/communications-gateway/plan-and-manage-costs).
* The number of calls being actively transcoded is limited to 5% of the total number of active calls.