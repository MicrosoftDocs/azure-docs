---
title: What is an Enclave?
description: What is an Enclave?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is an Enclave?

An Enclave is an isolated Virtual Network that is part of a Community in which one or more workloads are hosted. These workloads can be isolated from other Enclaves in the Community. An Enclave Owner can enable other Enclaves to connect to theirs by creating an Endpoint. Endpoints are used by other Enclaves to establish Connections. 

## Architecture of an enclave

Enclaves come with the following primary platform-managed and platform-deployed resources:
- Isolated [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) with [Subnets](../virtual-network/concepts-and-best-practices.md#virtual-network-concepts) you define. By default, these Enclaves aren't connected to the rest of the Internet outside of [certain authorized Microsoft services](https://learn.microsoft.com/azure/azure-portal/azure-portal-safelist-urls.md). Enabling connections is done through the use of platform-managed [Network Security Groups](../virtual-network/network-security-groups-overview.md).
- [Log Analytics Workspace](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview.md). By default, all Enclave resources are integrated into Azure Log Analytics. This integration ensures all activities within a Community and Enclave are effectively monitored, logged, and auditable. You can then use this data to form actionable insights. More specifically, all resources deployed in an Enclave send their [diagnostic platform logs](https://learn.microsoft.com/azure/azure-monitor/essentials/diagnostic-settings.md) to this Log Analytics Workspace.
- [Azure Storage Account](../storage/common/storage-account-overview.md). By default and for convenience, all Enclaves are deployed with a Storage Account that can only be accessed from other hosts within the Enclave.  [Learn more about Azure Storage](https://learn.microsoft.com/azure/architecture/guide/technology-choices/storage-options.md).
- [Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/basic-concepts.md). By default and for convenience, all Enclaves are deployed with Key Vault that can only be accessed from other hosts within the Enclave. [Learn more about how to use Azure Key Vaults](https://learn.microsoft.com/azure/key-vault/general/best-practices.md).
- [Admin Workstations](./understanding-admin-workstations.md) ([Azure Virtual Machines](https://azure.microsoft.com/products/virtual-machines.md)) and [Azure Bastion](../bastion/bastion-overview.md). These resources are created by default for Enclave system administrative access.
- [Private Endpoints](../private-link/private-endpoint-overview.md) and [Private DNS Zones](../dns/private-dns-privatednszone.md). By default and for private networking security, Azure Private DNS Zones, along with certain private DNS records, are created for every new enclave. All platform-managed Enclave resources are configured to use Azure Private Link Service.

![Graphic showing the managed resources deployed with an enclave and the resources deployed by the customer.](./media/communities-and-virtual-enclaves-enclave.svg)

## Enclave managed resource group 
When you create an enclave, the Azure Virtual Enclaves resource provider also creates a resource group which is managed by the Virtual Enclaves service. This managed resource group has a controlled configuration that allows for specific control plane actions. When an enclave is created, Azure places a [deny assignment](../role-based-access-control/deny-assignments.md) to protect resources in the enclave managed resource group.

For more details regarding the Enclave managed resource group, learn more about [Best practices of Azure Virtual Enclaves](./best-practices.md)

### Maintenance mode
Maintenance mode is a feature that allows Enclave Owners to temporarily place their enclaves into a "maintenance mode" state. This mode permits privileged users to make certain changes to the underlying managed resources in an enclave that are normally protected by Deny Assignments. This helps maintain the enclave isolation and network boundary. [Learn more](./maintenance-mode.md).

## Template
See [template documentation](./ave-templates.md#enclave-template)

## Managed Resources
The following resources types are deployed into the Enclave Managed Resource Group:
- [Azure Virtual Network](https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview.md)
- [Subnets](../virtual-network/concepts-and-best-practices.md#virtual-network-concepts)
- [Network Security Groups](../virtual-network/network-security-groups-overview.md)
- [Log Analytics Workspace](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview.md)
- [Azure Storage Account](../storage/common/storage-account-overview.md)
- [Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/basic-concepts.md)
- [Azure Key Vaults](https://learn.microsoft.com/azure/key-vault/general/best-practices.md)
- [Azure Virtual Machine](https://azure.microsoft.com/products/virtual-machines/)
- [Azure Bastion](../bastion/bastion-overview.md)
- [Private Endpoints](../private-link/private-endpoint-overview.md)
- [Private DNS Zones](../dns/private-dns-privatednszone.md)

## Next Steps
- [What is a Workload?](./what-is-a-workload.md)
- [What is the Service Catalog?](./what-is-the-service-catalog.md)
- [What is a Community?](./what-is-a-community.md)
- [Best practices](./best-practices.md)
- [Maintenance mode](./maintenance-mode.md)
- [Tutorial: Create an Enclave](./2-create-enclaves-within-a-community.md)
