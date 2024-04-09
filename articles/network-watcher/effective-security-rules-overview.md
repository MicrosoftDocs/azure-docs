---
title: Effective security rules overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher's effective security rules feature, which provides visibility into security and admin rules applied to a network interface.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 09/15/2023
#CustomerIntent: As an Azure administrator, I want to see the effective security rules applied to an Azure virtual machine (VM) instead of checking each network security group that applies to the VM.
---

# Effective security rules overview

Effective security rules view is a feature in Azure Network Watcher that you can use to view the aggregated inbound and outbound rules applied to a network interface. It provides visibility into security and admin rules applied to a network interface. You can use this feature to troubleshoot connectivity issues and to audit security and compliance of your Azure network resources.

You can define a prescriptive set of security rules as a model for security governance in your organization. Then, you can implement a periodic compliance audit in a programmatic way by comparing the prescriptive rules with the effective rules for each of the virtual machines in your network.

The effective security rules applied to a network interface are an aggregation of the rules that exist in the network security group associated to a network interface and the subnet the network interface is in. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md?toc=%2Fazure%2Fnetwork-watcher%2Ftoc.json) and [How network security groups filter network traffic](../virtual-network/network-security-group-how-it-works.md?toc=%2Fazure%2Fnetwork-watcher%2Ftoc.json). Additionally, the effective security rules include the admin rules that are applied to the virtual network using the Azure Virtual Network Manager. For more information, see [Azure Virtual Network Manager](../virtual-network-manager/overview.md?toc=%2Fazure%2Fnetwork-watcher%2Ftoc.json).

## Effective security rules in the Azure portal

In Azure portal, rules are displayed for each network interface and grouped by inbound vs outbound. A download button is available to easily download all the security rules into a CSV file.

:::image type="content" source="./media/effective-security-rules-overview/effective-security-rules-inline.png" alt-text="Screenshot of Azure Network Watcher effective security rules in Azure portal." lightbox="./media/effective-security-rules-overview/effective-security-rules-expanded.png":::

You can select a rule to see associated source and destination prefixes.

:::image type="content" source="./media/effective-security-rules-overview/security-rule-prefixes.png" alt-text="Screenshot of security rule associated address prefixes.":::

## Next step

To learn how to use effective security rules, continue to:

> [!div class="nextstepaction"]
> [View details of a security rule](diagnose-vm-network-traffic-filtering-problem.md#view-details-of-a-security-rule)