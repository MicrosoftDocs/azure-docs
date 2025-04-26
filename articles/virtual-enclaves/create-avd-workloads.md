---
title: Create Azure Virtual Desktop Workloads
description: Create Azure Virtual Desktop workloads within Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create Azure Virtual Desktop (AVD) Workloads

By default, all enclaves are created with [Admin Workstation Virtual Machines](./understanding-admin-vm.md). This means that all resources and hosts within an enclave are reachable through the Admin Workstation.

For certain Enclave Owners, the default access pattern surrounding the Admin Workstation might not satisfy their requirements for various reasons. For example, Enclave Owners might have requirements that disallow the Azure Bastion service. 

Currently, [Azure Bastion](https://aka.ms/bastion) is the Azure Cloud's first-party service for secure remote connections using private IP addresses. This is expected behavior for Azure Virtual Enclaves. However, should Enclave Owners require an alternative connection method, they can manually deploy a fleet of Virtual Machines (called Session Hosts in [Azure Virtual Desktop](https://aka.ms/avd)) to access their Enclave. This can be done using native Azure cloud networking resources and Azure Virtual Enclaves.

## Prerequisites

Create a [Community](./what-community.md) and [Enclave](./what-enclave.md).

### Create AVD through Azure portal into an AVE Workload
1. [Create a Workload](./create-workload-portal.md) with any specified name (for example, `wl-avd-mgmt-pool`)
2. [Deploy AVD resources](../virtual-desktop/deploy-azure-virtual-desktop.md) to the Workload RG (for example, `wl-avd-mgmt-pool`)
   - Create the AVD resources using the [Remote App VM template in the Service Catalog](./deploy-remoteapp-vm-service-catalog.md)
   - Alternatively, follow the [AVD deployment instructions](../virtual-desktop/deploy-azure-virtual-desktop.md) to deploy Azure Virtual Desktop. For all steps that deploy Azure resources targeting a Resource group, select the Workload RG (for example, `wl-avd-mgmt-pool`)
3. [Create Community Endpoint](./create-community-endpoint-portal.md) for necessary URL networking information
4. [Create Enclave Endpoint](./create-enclave-endpoint-portal.md) for necessary IP/CIDR/port/protocol rule networking information
5. [Create the Enclave Connection](./create-enclave-connection-portal.md) so that the customer can access the AVD service in Azure from specified Enclaves

## References
- [What is an Enclave?](./what-enclave.md)
- [What is a Workload?](./what-workload.md)
- [Azure Bastion](https://aka.ms/bastion)
- [Azure Virtual Desktop](https://aka.ms/avd)
- [Azure Support](https://azure.microsoft.com/support/)
