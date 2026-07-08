---
title: What is a community?
description: What is a community?
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# What is a community?

Communities are isolated hub networks that can securely and logically group several [enclaves](./what-enclave.md) together for governance, management, and security purposes. A community owner can enable other communities or on-premises networks to connect through [transit hubs](./what-transit-hub.md) or [community endpoints](./what-community-endpoint.md).

## Architecture of a community

![Diagram showing a simplified view of a community with the community managed resources and three enclaves.](./media/simple-community-managed-resources-three-enclaves.png)


Communities come with the following primary platform-managed and platform-deployed resources:
- Isolated [Azure Virtual WAN](/azure/virtual-wan/virtual-wan-about) hub networks. By default, these communities aren't connected to the rest of the Internet outside of [certain authorized Microsoft services](/azure/azure-portal/azure-portal-safelist-urls?tabs=public-cloud).
- [Azure Firewall](/azure/firewall/overview). By default, all Communities are deployed with a secure-by-default Azure Firewall in which all community network traffic is routed through.
- [Log Analytics Workspace](/azure/azure-monitor/logs/log-analytics-overview). By default, all community resources are integrated into Azure Log Analytics, ensuring all activities within a community are effectively monitored, logged, and audited, laying the foundation for actionable insights. More specifically, all resources deployed in a community send their [diagnostic platform logs](/azure/azure-monitor/essentials/diagnostic-settings) to this Log Analytics Workspace.

### Community address space

Community managers can add one or more address spaces (prefixes between /8 and /16) to an existing community, which is treated as metadata-only updates at the community layer. This action doesn't require the community to be in maintenance mode. Address spaces can't be fully removed if they're already in use—however, an existing range can be replaced by adding a broader address space that fully contains it, preserving allocation continuity and avoiding breaking changes.

When you create new enclaves, Azure Enclave uses an IP address management strategy that always allocates the smallest available community address space that can accommodate the requested enclave size. This approach minimizes fragmentation and preserves larger address ranges for future needs, such as large enclave deployments. For example, allocating a smaller enclave into a smaller fitting address space avoids blocking future allocations that would require a larger contiguous range.

> [!NOTE]
> 
> `192.168.0.0/16` is reserved for the platform to manage enclaves deployed within a community. Users shouldn't create communities with any of these address spaces as that would create overlapping conflicts with the platform-managed enclave management IP ranges.

## Community managed resource group
When you create a community, the Azure Enclave resource provider also creates and manages a separate resource group called the community managed resource group. For more details regarding the community managed resource group, learn more about [Best practices for Azure Enclave](./best-practices.md). 

## Template
See [template documentation](./azure-enclave-templates.md#resource-modules)

## Managed Resources
- [Azure Virtual WAN](/azure/virtual-wan/virtual-wan-about)
- [Azure Firewall](/azure/firewall/overview)
- [Log Analytics Workspace](/azure/azure-monitor/logs/log-analytics-overview)

## Next Steps
- [What is Azure Enclave?](./what-azure-enclave.md)
- [What is an enclave?](./what-enclave.md)
- [Best practices for Azure Enclave](./best-practices.md)
- [Tutorial: Create a community](./1-1-create-community.md)
