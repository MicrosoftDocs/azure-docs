---
title: Create Azure Virtual Desktop workloads
description: Create Azure Virtual Desktop workloads within Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Create Azure Virtual Desktop workloads

When you create an [Admin VM](./deploy-admin-vm-service-catalog.md) in your enclave all resources and hosts within your enclave are reachable through the Admin VM.

For certain enclave owners, the default access pattern surrounding the Admin VM might not satisfy your requirements for various reasons. For example, enclave owners might have requirements that disallow the Azure Bastion service. 

Currently, [Azure Bastion](https://aka.ms/bastion) is the Azure service for secure remote connections using private IP addresses. This is expected behavior for Azure Enclave. However, should enclave owners require an alternative connection method, they can manually deploy a set of Virtual Machines (called Session Hosts in [Azure Virtual Desktop](https://aka.ms/avd)) to access your Enclave. This can be done using native Azure cloud networking resources and Azure Enclave.

## Prerequisites

Create a [community](./what-community.md) and [Enclave](./what-enclave.md).

### Create Azure Virtual Desktop through Azure portal into an Azure Enclave workload
1. [Create a workload](./create-workload-portal.md) with any specified name (for example, `wl-avd-mgmt-pool`).
1. [Deploy Azure Virtual Desktop resources](/azure/virtual-desktop/deploy-azure-virtual-desktop) to the workload resource group (for example, `wl-avd-mgmt-pool`).
   - Create the Azure Virtual Desktop resources using the [Virtual Machine template in the service catalog](./deploy-virtual-machine-service-catalog.md).
   - Alternatively, follow the [Azure Virtual Desktop deployment instructions](/azure/virtual-desktop/deploy-azure-virtual-desktop) to deploy Azure Virtual Desktop. For all steps that deploy Azure resources targeting a Resource group, select the workload resource group (for example, `wl-avd-mgmt-pool`).
1. [Create community endpoint](./create-community-endpoint-portal.md) for necessary URL networking information.
1. [Create enclave endpoint](./create-enclave-endpoint-portal.md) for necessary IP/CIDR/port/protocol rule networking information.
1. [Create the enclave connection](./create-enclave-connection-portal.md) so that you can access the Azure Virtual Desktop service in Azure from specified enclaves.

## References
- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Azure Bastion](https://aka.ms/bastion)
- [Azure Virtual Desktop](https://aka.ms/avd)
- [Azure Support](https://azure.microsoft.com/support/)
