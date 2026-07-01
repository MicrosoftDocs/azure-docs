---
title: Azure Enclave Pricing
description: Learn how pricing works for Azure Enclave, including enclave charges, platform-managed resources, and workload resources.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 06/08/2026
---

# Azure Enclave pricing

Azure Enclave uses Azure resources to create and operate community and enclave boundaries. You also pay for any workload resources that you deploy inside your enclaves.

> [!IMPORTANT]
> Pricing information in this article is for planning guidance only. Pricing can change and you can review the [latest pricing](https://azure.microsoft.com/pricing/). For an estimate, use the [Azure Enclave pricing calculator](https://aka.ms/ae/calc).

## How billing works

Customers pay for:

- Azure Enclave billable meters, such as enclave usage. Verify current meters and rates on the Azure pricing page or with your billing owner.
- Azure resources managed by Azure Enclave to create and operate community and enclave boundaries.
- Workload resources that you deploy inside enclaves, such as virtual machines, Azure Kubernetes Service, Azure App Service web apps, storage accounts, databases, or other Azure services.

## Platform-managed resources

Azure Enclave deploys and manages resources that support community and enclave boundaries.

Community managed resources can include:

- Managed resource group
- Managed identity
- [Azure Virtual WAN](/azure/virtual-wan/virtual-wan-about)
- Firewall policy and rule collections
- [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview)

Enclave managed resources can include:

- Managed resource group
- [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)
- Subnets
- [Network security groups](/azure/virtual-network/network-security-groups-overview)
- Managed identity
- [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview)
- Optional resources such as [Azure Bastion](/azure/bastion/bastion-overview)

For more information about managed resources, see [What is a community?](./what-community.md), [What is an enclave?](./what-enclave.md), and [What gets deployed](./what-azure-enclave.md#what-gets-deployed).

## Azure Enclave resource types

Azure Enclave resource types help create and connect secure boundaries, including communities, enclaves, community endpoints, enclave endpoints, enclave connections, and transit hubs. Azure infrastructure resources deployed or used by those Azure Enclave resource types can incur separate Azure resource charges.

## Workload resource charges

Resources that you deploy into workload resource groups are billed according to the pricing model for each Azure service. For example, virtual machines, Azure Kubernetes Service, App Service, databases, storage, and monitoring resources each have their own pricing.

For more information about workload resource groups, see [Understand resource groups](./azure-enclave-resource-groups.md).
