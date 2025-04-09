---
title: What is a Community?
description: What is a Community?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# What is a Community?

Communities are isolated hub networks that can securely and logically group several Enclaves together for governance, management, and security purposes. A Community Owner can enable other Communities or on-premises networks to connect through Transit Hubs or Endpoints.

## Architecture of a community

![Diagram showing a simplified view of a Community with the community managed resources and three enclaves.](./media/simple-community-managed-resources-three-enclaves.png)

Communities come with the following primary platform-managed and platform-deployed resources:
- Isolated [Azure Virtual WAN](../virtual-wan/virtual-wan-about.md) hub networks. By default, these Communities aren't connected to the rest of the Internet outside of [certain authorized Microsoft services](https://learn.microsoft.com/azure/azure-portal/azure-portal-safelist-urls?tabs=public-cloud).
- [Azure Firewall](../firewall/overview.md). By default, all Communities are deployed with a secure-by-default Azure Firewall in which all Community network traffic is routed through.
- [Log Analytics Workspace](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview.md). By default, all Community resources are integrated into Azure Log Analytics, ensuring all activities within a Community are effectively monitored, logged, and audited, laying the foundation for actionable insights. More specifically, all resources deployed in a Community send their [diagnostic platform logs](https://learn.microsoft.com/azure/azure-monitor/essentials/diagnostic-settings.md) to this Log Analytics Workspace.
- [Azure Storage Account](../storage/common/storage-account-overview.md). By default and for convenience, all Communities are deployed with a Storage Account.  [Learn more about Azure Storage](https://learn.microsoft.com/azure/architecture/guide/technology-choices/storage-options.md).

### Community address space
> [!NOTE]
> `192.168.0.0/16`, `192.0.0.0/8`, `192.128.0.0/9`, or any other range that includes `192.168.x.x` addresses are reserved for the platform to manage enclaves deployed within a Community. Users shouldn't create Communities with any of these address spaces as that would create overlapping conflicts with the platform-managed enclave management IP ranges.

## Community managed resource group
When you create a community, the Azure Virtual Enclaves resource provider also creates and manages a separate resource group called the Community managed resource group. For more details regarding the Community managed resource group, learn more about [Concepts and best practices of Azure Virtual Enclaves](./best-practices.md).

## Template
See [template documentation](./ave-templates.md#community-template)

## Managed Resources
- [Azure Virtual WAN](../virtual-wan/virtual-wan-about.md)
- [Azure Firewall](../firewall/overview.md)
- [Log Analytics Workspace](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview.md)
- [Azure Storage Account](../storage/common/storage-account-overview.md)

## Next Steps
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [What is an Enclave?](./what-enclave.md)
- [Best practices of Azure Virtual Enclaves](./best-practices.md)
- [Tutorial: Create a Community](./1-create-community.md)
