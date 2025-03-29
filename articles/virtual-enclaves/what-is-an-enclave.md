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
- Isolated [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview) with [Subnets](https://learn.microsoft.com/en-us/azure/virtual-network/concepts-and-best-practices#virtual-network-concepts) you define. By default, these Enclaves aren't connected to the rest of the Internet outside of [certain authorized Microsoft services](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-safelist-urls?tabs=public-cloud). Enabling connections is done through the use of platform-managed [Network Security Groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview).
- [Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview). By default, all Enclave resources are integrated into Azure Log Analytics. This integration ensures all activities within a Community and Enclave are effectively monitored, logged, and auditable. You can then use this data to form actionable insights. More specifically, all resources deployed in an Enclave send their [diagnostic platform logs](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings) to this Log Analytics Workspace.
- [Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview). By default and for convenience, all Enclaves are deployed with a Storage Account that can only be accessed from other hosts within the Enclave.  [Learn more about Azure Storage](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/storage-options).
- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts). By default and for convenience, all Enclaves are deployed with Key Vault that can only be accessed from other hosts within the Enclave. [Learn more about how to use Azure Key Vaults](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices).
- [Admin Workstations](./understanding-admin-workstations.md) ([Azure Virtual Machines](https://azure.microsoft.com/en-us/products/virtual-machines/)) and [Azure Bastion](https://learn.microsoft.com/en-us/azure/bastion/bastion-overview). These resources are created by default for Enclave system administrative access.
- [Private Endpoints](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview) and [Private DNS Zones](https://learn.microsoft.com/en-us/azure/dns/private-dns-privatednszone). By default and for private networking security, Azure Private DNS Zones, along with certain private DNS records, are created for every new enclave. All platform-managed Enclave resources are configured to use Azure Private Link Service.

![Communities and Virtual Enclaves - Enclave.svg](./media/communities-and-Virtual-Enclaves---Enclave.svg)

## Enclave managed resource group 
When you create an enclave, the Azure Virtual Enclaves resource provider also creates a resource group which is managed by the Virtual Enclaves service. This managed resource group has a controlled configuration that allows for specific control plane actions. When an enclave is created, Azure places a [deny assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments?tabs=azure-portal) to protect resources in the enclave managed resource group.

For more details regarding the Enclave managed resource group, learn more about [Concepts and best practices of Azure Virtual Enclaves](/docs/Concepts/Concepts-and-best-practices)

### Maintenance mode
Maintenance mode is a feature that allows Enclave Owners to temporarily place their enclaves into a "maintenance mode" state. This mode permits privileged users to make certain changes to the underlying managed resources in an enclave that are normally protected by Deny Assignments. This helps maintain the enclave isolation and network boundary. [Learn more](/docs/Concepts/Maintenance-mode).

## Template
See template documentation [here](/docs/Resources/AVE-Templates/#enclave-template)

## Managed Resources
The following resources types are deployed into the Enclave Managed Resource Group:
- [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
- [Subnets](https://learn.microsoft.com/en-us/azure/virtual-network/concepts-and-best-practices#virtual-network-concepts)
- [Network Security Groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview)
- [Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)
- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts)
- [Azure Key Vaults](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [Azure Virtual Machine](https://azure.microsoft.com/en-us/products/virtual-machines/)
- [Azure Bastion](https://learn.microsoft.com/en-us/azure/bastion/bastion-overview)
- [Private Endpoints](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview)
- [Private DNS Zones](https://learn.microsoft.com/en-us/azure/dns/private-dns-privatednszone)

## Next Steps
- [What is a Workload?](./what-is-a-workload.md)
- [What is the Service Catalog?](./what-is-the-service-catalog.md)
- [What is a Community?](./what-is-a-community.md)
- [Concepts and best practices of Azure Virtual Enclaves](./concepts-and-best-practices.md)
- [Maintenance mode](./maintenance-mode.md)
- [Tutorial: Create an Enclave](./2-create-enclaves-within-a-community.md)
