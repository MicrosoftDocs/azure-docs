---
title: Create a Routing Appliance
titleSuffix: Azure Virtual Network
description: This guide covers configuration and troubleshooting for Azure Virtual Network routing appliances.
#customer intent: As a network administrator, I want to create a routing appliance in the Azure portal so that I can manage virtual network traffic.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 08/19/2026
ms.topic: how-to
ms.service: azure-virtual-network
ms.custom: references_regions
---

# Create an Azure Virtual Network routing appliance

This article explains how to create an Azure Virtual Network routing appliance in the Azure portal. Azure Virtual Network routing appliances are generally available as of August 4, 2026, and are supported for production workloads.

## Supported regions

Routing appliances are available in the following regions:

- Australia East
- Brazil South
- Brazil Southeast
- Central India
- Central US
- East Asia
- East US
- East US 2
- Germany West Central
- North Central US
- North Europe
- South Central US
- South India
- Southeast Asia
- Spain Central
- Sweden Central
- UK South
- West Central US
- West Europe
- West US
- West US 2
- West US 3

To get started, search for **routing appliance** in the Azure portal's search box, and then select **Azure Virtual Network routing appliances**.

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-1.png" alt-text="Screenshot of a search for routing appliances in the Azure portal.":::

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-2.png" alt-text="Screenshot of the service entry for Azure Virtual Network routing appliances in the Azure portal.":::

## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **resource group**. In the search results, select **Resource groups**.

1. Select **+ Create**.

1. In **Create a resource group**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group name** | Enter **test-rg**. |
    | **Region** | Select **(US) East US**. |

1. Select **Review + create**.

1. Select **Create**.

## Create a virtual network

1. In the portal's search box, enter **virtual network**. In the search results, select **Virtual networks**.

1. Select **+ Create**.

1. In **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg**. |
    | **Instance details** | |
    | **Virtual network name** | Enter **vnet-1**. |
    | **Region** | Select **(US) East US**. |

1. Select **Next**.

1. Select **Next**.

1. In **IP addresses**, select the **default** subnet.

1. In **Edit subnet**, for **Name**, enter **VirtualNetworkApplianceSubnet**.

1. Select **Save**.

1. Select **Review + Create**.

1. Select **Create**.

## Create a routing appliance

1. In the portal's search box, enter **routing appliance**. In the search results, select **Azure Virtual Network routing appliances**.

1. Select **+ Create**.

1. In **Create an Azure Virtual Network routing appliance**, enter or select the following information on the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg**. |
    | **Instance details** | |
    | **Name** | Enter **vnet-appliance**. |
    | **Region** | Select **East US**. |
    | **Capacity** | Select **50 Gbps**. Supported bandwidth tiers are 10, 50, 100, and 200 Gbps. |
    | **Virtual Network** | Select **vnet-1**. |

1. Select **Review + create**.

1. Select **Create**.

The portal creates the routing appliance in a dedicated subnet named `VirtualNetworkApplianceSubnet`. If you create multiple appliance instances, you create them in the same dedicated subnet.

**Optional**: During creation, you can choose a network security group (NSG) and route table for the routing appliance's dedicated subnet.

## Scale and performance

Each routing appliance instance has a fixed bandwidth tier. The tier determines the maximum connection establishment rate and the number of concurrent flows the instance supports:

| Bandwidth tier | Max connections per second | Max concurrent flows |
|----------------|----------------------------|----------------------|
| 10 Gbps        | 100,000                    | 1,000,000            |
| 50 Gbps        | 250,000                    | 2,000,000            |
| 100 Gbps       | 600,000                    | 4,000,000            |
| 200 Gbps       | 1,500,000                  | 8,000,000            |

You can't resize an existing instance. To change the bandwidth tier, delete the appliance and create a new one with the tier you need.

## Monitor the routing appliance

You can view metrics in Azure Monitor as soon as you create the appliance, with no diagnostic configuration required. Select the **Metrics** tab on the routing appliance resource to view bytes sent and received, packets sent and received, inbound and outbound flow counts, and inbound and outbound flow creation rates. You can also set alerts on throughput thresholds, flow counts, and anomalous flow creation rates.

Flow logs with per-flow 5-tuple and rule-match detail aren't available yet.

## Troubleshoot

### Creation fails in a region or with an allocation error

Confirm that you're deploying to one of the supported regions listed earlier in this article. If the request returns a validation error for an unsupported region, choose a supported region. If it returns an allocation failure, capacity isn't currently available in that region for the requested bandwidth tier. Retry with a lower tier, choose another region, or try again later. Also confirm that you didn't reach the limit of two routing appliances per subscription per region.

### Appliance isn't getting traffic as expected

- Verify that user-defined routes use the next hop type **Virtual appliance** and point to the routing appliance's private IP address, and that IP forwarding is enabled on the relevant peerings.
- Verify that network security groups and route tables attached to the appliance subnet, or to the source and destination subnets, match your intended routing and security configuration.
- Use Azure Monitor metrics on the appliance to confirm whether traffic is reaching it. Per-flow logging isn't available yet, so use virtual network flow logs on the workload subnets to validate connectivity and rule matches.
