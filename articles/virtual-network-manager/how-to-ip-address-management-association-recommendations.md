---
title: Manage IPAM Pool Recommendations for Virtual Networks
titleSuffix: Azure Virtual Network Manager
description: Discover how to associate virtual networks to IPAM pools efficiently using Azure Virtual Network Manager. Use recommendations to manage address spaces and optimize your network setup.
#customer intent: As a network administrator, I want to understand how to use the Pool Association Recommendation Blade so that I can efficiently associate virtual networks with IPAM pools.
author: mbender-ms
ms.service: azure-virtual-network-manager
ms.author: mbender
ms.reviewer: mbender
ms.date: 11/05/2025
ms.topic: how-to
---

# Manage IPAM Pool Recommendations for Virtual Networks

The IP Address Management (IPAM) Pool Association Recommendation feature in Azure Virtual Network Manager (AVNM) helps you efficiently manage and organize your virtual network address spaces. This feature analyzes your unmanaged virtual networks and recommends the most appropriate IPAM pools for association based on address space compatibility and availability.

Use pool association recommendations to:

- Automatically identify the best IPAM pools for your virtual networks
- Associate multiple virtual networks to pools in bulk operations
- Optimize IP address space allocation across your network infrastructure
- Reduce manual configuration time and potential errors

This article shows you how to access, review, and implement pool association recommendations through the Azure portal interface.

## Prerequisites

Before you begin, ensure that you have:
- An Azure subscription with appropriate permissions
- Azure Virtual Network Manager configured for your scope
- At least one IPAM pool created in your network manager
- One or more unmanaged virtual networks in your scope

### Review the pool association recommendations

To review the pool association recommendations for your unmanaged virtual networks, follow these steps:

1. Sign in to the Azure portal.
1. Navigate to your network manager instance.
1. Select the IP Address Management dropdown from the left-hand menu, then select **Pool Association Recommendation**.
1. You see a list of unmanaged virtual networks along with recommended IPAM pools for association.

The possible recommendation outcomes are:

- **Single pool recommended** - A single pool recommended containing the entire address space of the virtual network
- **Two pools recommended** - Two pools recommended, one to contain the entire IPv4 space, and the second to contain the entire IPv6 space, of the dual-stack virtual network
- **No pools recommended** - No pools recommended and instead a **Create Pool** link to create a pool that can contain the virtual network's space

### Associate Virtual Network

To associate virtual networks to the recommended IPAM pools, follow these steps:

1. Select the virtual networks you want to associate with the recommended IPAM pools. This can be done individually or by bulk selection using the checkbox in the table header.
    1. You can select up to 100 virtual networks to associate in bulk.
1. After selecting your desired virtual networks' pool recommendations, select **Associate** in the top left hand corner. If the association request doesn't overlap with other concurrent requests, it succeeds and displays a success message in your notifications.

### Observe new associations

After initiating the association process, follow these steps to monitor the progress and verify the new associations:

- The page automatically refreshes when the batch of associations finishes.
- After the refresh, go to the **IP address pools** page to see your pool's updated IP allocation and available IP addresses.

### Change pool recommendations

To change the pool recommendation for a specific unmanaged virtual network, use the following steps:

1. In the **Pool association recommendation** window, select the pool recommendation you want to change from the table.
1. In the **Edit Recommended Pool(s)** window, select new pool association from the list. Choose one option for each IP version. 
1. Select **Save** to apply your changes.

### Filter recommendations

You can filter the recommendations you see by using one or more of the following criteria:

- Search for a specific virtual network
- Resource group
- Subscription ID
- Location
- Management group
  - At the parent management group level
- Recommended pools
  - Use this filter to view only unmanaged virtual networks that have valid pool recommendations, or those that don't.

### Views

The Pool Association Recommendation window provides different views based on whether the virtual network is single stack or dual stack. 

The single stack view displays recommendations for IPv4 or IPv6 virtual networks, while the dual stack view allows you to see and manage recommendations for both IP versions.

:::image type="content" source="media/how-to-ip-address-management-association-recommendations/dual-stack-recommended-pools-selection.png" alt-text="Screenshot of dual stack recommended pools selection window with virtual network chosen.":::

### Next steps

> [!div class="nextstepaction"]
> [Manage IP addresses with Azure Virtual Network Manager](how-to-manage-ip-addresses-network-manager.md)