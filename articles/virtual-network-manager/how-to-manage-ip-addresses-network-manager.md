---
title: Manage IP addresses with Azure Virtual Network Manager
description: Learn how to manage IP addresses with Azure Virtual Network Manager by creating and assigning IP address pools to your virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/17/2024
#customer intent: As a network administrator, I want to learn how to manage IP addresses with Azure Virtual Network Manager so that I can create and assign IP address pools to my virtual networks.
---

# Manage IP addresses with Azure Virtual Network Manager

Azure Virtual Network Manager allows you to manage IP addresses by creating and assigning IP address pools to your virtual networks. This article shows you how to create and assign IP address pools to your virtual networks with IP address management (IPAM) in Azure Virtual Network Manager.

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An existing network manager instance. If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).
- To manage IP addresses in your network manager, you have the **Network Contributor** role with [role-based access control](../role-based-access-control/quickstart-assign-role-user-portal.md) Classic Admin/legacy authorization isn't supported.

## Create an IP address pool

In this step, you create an IP address pool for your virtual network.

1. In the Azure portal, search for and select **Network managers**.
2. Select your network manager instance.
3. In the left menu, select **IP address pools** under **IP address management**.
4. Select **+ Create** or **Create** to create a new IP address pool.
5. In the **Create an IP address pool** window, enter the following information:
    | Field | Description |
    | --- | --- |
    | **Name** | Enter a name for the IP address pool. |
    | **Description** | Enter a description for the IP address pool. |
    | **Parent pool** | For creating a **root pool**, leave default of **None**. For creating a **child pool**, select the parent pool. |

6. Select **Next** or the **IP addresses** tab.
7. Under **Starting address**, enter the IP address range for the pool.
8. Select **Review + create** and then **Create** to create the IP address pool.

## Associate a virtual network with an IP address pool

In this step, you associate a virtual network with an IP address pool from the **Allocations** settings page in the IP address pool. From this page, you can allocate address spaces to a child pool, an existing resource with CIDRs, and a static CIDR block. 

1. Browse to your IP address pool.
2. Select **Allocate** or **Allocations** under **Settings**.
3. In the **Allocations** window, select **+ Create**>**Associate resources**. The **Associate resources** option allocates a CIDR to an existing virtual network.
4. In the **Select resources** window, select the virtual networks you want to associate with the IP address pool and then choose **Select**.

## Create static CIDR blocks for a pool

In this step, you create a static CIDR block for a pool. This is helpful for allocating a space that is outside of Azure or Azure resources that aren't supported by IPAM. For example, you can allocate a CIDR in the pool to the address space that you in your on-premises environment. Likewise, you can also use this for a space that is used by your VWAN hub or Azure VMware Private Cloud.

1. Browse to your IP address pool.
2. Select **Allocate** or **Allocations** under **Settings**.
3. In the **Allocations** window, select **+ Create**>**Allocate static CIDRs**. The **Allocate static CIDRs** option allocates a CIDR to an address space that isn't currently in use within Azure or is part of Azure resources not yet supported by the IPAM service. For example, this can be a CIDR that is used by your on-premises environment or a VWAN hub.

## Review allocation usage

In this step, you review the allocation usage of the IP address pool. This helps you understand how the CIDRs are being used in the pool, along with the percentage of the pool that is allocated and the compliance status of the pool.

1. Browse to your IP address pool.
2. Select **Allocations** under **Settings**.
3. In the **Allocations** window, you can review all of the statistics for the address pool including:
   
    | Field | Description |
    | --- | --- |
    | **Address Space** | The address space that is allocated to the pool. |
    | **Address count** | The number of addresses that are allocated to the pool. |
    | **IP usage** | The number of IP addresses that are actively being consumed by resources. |
    | **IP allocation** | The set of IP addresses that are allocated from the pool for potential use. |

4. For each allocation, you can see the following:
   
    | Field | Description |
    | --- | --- |
    | **Name** | The name of the allocation. |
    | **Address space** | The address space that is allocated to the pool. |
    | **Address count** | The number of addresses that are allocated to the pool. |
    | **IP allocation** | The set of IP addresses that are allocated from the pool for potential use. |
    | **IP usage** | The number of IP addresses that are actively being consumed by resources. |
    | **Compliancy** | The status of the allocation to the pool. |

## Delegating permissions for IP address management

In this step, you delegate permissions to other users to manage IP address pools in your network manager. This allows you to control access to the IP address pools and ensure that only authorized users can manage the pools.

1. Browse to your IP address pool.
2. In the left menu, select **Access control (IAM)**.

You can also give permission to use an IPAM pool to other users. This is useful when you want to let your users create a virtual network and make sure the virtual network that they create won't have overlap CIDRs.
To do so, in IAM, add a role assignment of “IPAM Pool Contributor” and assign access. 

:::image type="content" source="media/how-to-manage-ip-addresses/ip-address-pool-allocation-statistics-thumb.png" alt-text="Screenshot of ip address allocations page with resource allocations and statistics of ip address pool." lightbox="media/how-to-manage-ip-addresses/ip-address-pool-allocation-statistics.png":::

## Create a Vnet with a non-overlapping CIDR range

In this step, you create a VNet with a non-overlapping CIDR range by allowing IPAM to automatically provide a non-overlapping CIDR.

1. In the Azure portal, search for and select **Virtual Network**.
2. Select **+ Create**.
3. 


Instead of specifying a specific CIDR, you can choose to let IPAM to automatically provide a non-overlapping CIDR. You can do so by choosing an IPAM pool and the size for the VNet as shown below.