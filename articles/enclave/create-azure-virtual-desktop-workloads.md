---
title: Create Azure Virtual Desktop workloads
description: Plan Azure Enclave workloads and network connectivity for Azure Virtual Desktop session hosts.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 10/16/2026
---

# Create Azure Virtual Desktop workloads

Use this guide to plan an Azure Virtual Desktop (AVD) session-host workload and its network connectivity in Azure Enclave. For end-to-end AVD deployment steps, including host pools and session hosts, see [Deploy an Azure Virtual Desktop workload in Azure Enclave](./2-3-deploy-virtual-desktop-workload.md). This article focuses on associating the workload resource group and configuring the enclave network path; it doesn't replace the AVD deployment instructions.

An [Admin VM](./deploy-admin-vm-service-catalog.md) is a virtual machine configured to allow administrators to make changes from within the isolated enclave network. Its reachability to other resources depends on the configured network routes and security controls.

Where Azure Bastion is enabled for an enclave, it can provide secure connections to virtual machines by using private IP addresses. If your organization requires another access pattern, you can configure AVD session hosts as an alternative entry point. AVD connectivity still depends on the routes, network security groups, firewall rules, and Enclave endpoint rules in your design.

## Prerequisites

Before you begin:

- Create a [community](./what-community.md) and an [enclave](./what-enclave.md).
- Review the AVD deployment requirements and network destinations for your chosen identity and deployment configuration.
- Decide which resource group will contain the AVD resources and ensure you have permission to create or associate it with a workload.

## Create and associate the workload resource group

1. [Create a workload](./create-workload-portal.md) in the enclave. Use a workload name such as `wl-avd-management`.
1. During workload creation, create or add a workload resource group for your AVD resources. For example, use `wl-rg-avd-sessionhosts` for the workload resource group name. For details, see [Create a workload resource group](./create-workload-portal.md#add-workload-resource-groups).
1. Deploy the AVD components by following [Azure Virtual Desktop deployment guidance](/azure/virtual-desktop/deploy-azure-virtual-desktop). For each deployment step that targets a resource group, use the workload resource group you created (for example, `wl-rg-avd-sessionhosts`). If you follow the [Deploy an Azure Virtual Desktop workload in Azure Enclave](./2-3-deploy-virtual-desktop-workload.md) instructions, review the prerequisites and parameters.

## Configure network connectivity

1. [Create a community endpoint](./create-community-endpoint-portal.md) with rules for the AVD destinations required by your deployment. Check that the selected endpoint rule types and community firewall SKU support those destinations.
1. [Create an enclave endpoint](./create-enclave-endpoint-portal.md) for the required destinations in the enclave. Configure the destination IP addresses or CIDR ranges, ports, and protocols needed by your design.
1. [Create an enclave connection](./create-enclave-connection-portal.md) to establish the configured network path between the enclave and community. Creating the connection alone doesn't guarantee AVD connectivity; validate that the endpoint rules and other network controls allow the required traffic.

## References
- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Azure Bastion](https://aka.ms/bastion)
- [Azure Virtual Desktop](https://aka.ms/avd)
- [Azure Support](https://azure.microsoft.com/support/)
