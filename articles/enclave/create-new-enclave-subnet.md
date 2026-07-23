---
title: Create new subnet within an enclave Virtual Network
titleSuffix: Azure Enclave
description: Create new subnet within an enclave Virtual Network.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ms.date: 9/30/2025
---

# Create new subnet within an enclave Virtual Network

This guides you through replacing the existing Azure Enclave enclave virtual network subnet `AzureVirtualEnclaveSubnet` with a replacement `AzureVirtualEnclaveSubnet` subnet and a new subnet of your choice. This is an important step to perform early after the enclave is created so there are no resources attached to the existing subnet. An existing subnet can't be deleted until there are no resources attached to it.

> [!NOTE]
> * You aren't able to resize a virtual network with existing connections. [Official Docs](/azure/virtual-network/virtual-network-manage-subnet?tabs=azure-portal#change-subnet-settings). If you need to resize an existing subnet you need to move any connected devices out first, resize, then move them back.
> * Remember when sizing your subnets that five IP addresses per subnet are reserved by Azure. See [official documentation](/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

## Size Table Reference
The subnet size determines how many usable IP addresses are in the subnet.

| Subnet Size | Useable IPs |
| -------- | -------- |
| /29 | 3  |
| /28 | 11 |
| /27 | 27 |
| /26 | 59 |
| /25 | 123 |
| /24 | 251 |

## Detailed subnet creation steps
Change the subnets in the enclave by selecting `Manage` on the left side and then `Subnet` to manage existing subnets or create new subnets.

![Screenshot showing the enclave submet management page.](./media/enclave-subnet-management.png)

## Subnet delegation
When you create a new subnet in the enclave virtual network, you can delegate the subnet to an Azure service. Subnet delegation designates the subnet for use by a specific service (for example, a service that must inject its own resources into the subnet) and grants that service the permissions it needs to manage its service-specific resources in the subnet. Set the delegation when you create or manage the subnet through the enclave's **Manage** > **Subnet** experience, so the delegation is recorded in the enclave's authoritative configuration.

> [!NOTE]
> 
> Azure reserves five IP addresses per subnet, and a delegated subnet is dedicated to its delegated service. Size delegated subnets accordingly. See the Size Table Reference.

## Enclave authority over the virtual network
Azure Enclave is the authoritative management plane for the enclave virtual network. It creates the virtual network, its subnets, and the routing and configuration that connect the virtual network to enclave connection management. Because the enclave owns this state, create and change subnets only through the enclave's Manage experience.

> [!WARNING]
> 
> Don't perform operations directly against the enclave virtual network. Direct changes cause the virtual network to drift out of Azure Enclave management, which can break enclave connection management (including, but not limited to, enclave endpoints, enclave connections, and enclave subnet features). After the virtual network drifts, the enclave can no longer reliably reconcile it and might require you to re-deploy the enclave through an ARM template with specific properties to synchronize the enclave properties to match the enclave virtual network.

Operations to avoid performing directly on the enclave virtual network include, but aren't limited to, the following examples:
- Adding, deleting, resizing, or delegating subnets outside of the enclave experience.
- Changing the virtual network address space.
- Editing route tables, network security group associations, or peerings.
- Other virtual network-level edits.

## Supported direct operation: DNS servers
Modifying the DNS servers on the enclave virtual network is supported and doesn't cause the enclave to drift out of management. You can set custom DNS servers on the enclave virtual network to provide name resolution for your workloads. Apart from DNS server settings, use the Azure Enclave management experience for all virtual network and subnet changes.
Create new subnet within an enclave Virtual Network.