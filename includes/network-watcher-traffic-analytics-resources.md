---
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: include
ms.date: 06/12/2025    
ms.custom: include file
---
> [!CAUTION]
> Traffic analytics creates and manages [data collection rule (DCR)](/azure/azure-monitor/essentials/data-collection-rule-overview?toc=/azure/network-watcher/toc.json) and [data collection endpoint (DCE)](/azure/azure-monitor/essentials/data-collection-endpoint-overview?toc=/azure/network-watcher/toc.json) resources in the same resource group as the Log Analytics workspace, prefixed with `NWTA`. If you perform any operation on these resources, traffic analytics might not function as expected.