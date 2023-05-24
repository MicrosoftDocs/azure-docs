---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

Log Analytics workspaces offer a high degree of reliability without any design decisions. Conditions where a temporary loss of access to the workspace can result in data loss are often mitigated by features of other Azure Monitor components such as data buffering with the Azure Monitor agent.

The reliability situations to consider for Log Analytics workspaces are availability of the workspace and protection of collected data in the rare case of failure of an Azure datacenter or region. There is currently no standard feature for failover between workspaces in different regions, but there are strategies that you can use if you have particular requirements for availability or compliance.

Some availability features require a dedicated cluster. Since this requires a commitment of at least 500 GB per day from all workspaces in the same region, reliability will not typically be your primary criteria for including dedicated clusters in your design.

### Design checklist

> [!div class="checklist"]
> - 
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| | |