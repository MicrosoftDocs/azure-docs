---
title: Effective security rules
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher effective security rules view capability.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/27/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Effective security rules view in Azure Network Watcher

[Network security groups](../virtual-network/network-security-groups-overview.md) can be associated at a subnet level or at a network interface level. When associated at a subnet level, it applies to all virtual machines (VMs) in the virtual network subnet. With effective security rules view in Network Watcher, you can see all inbound and outbound security rules that apply to a virtual machine’s network interface(s). These rules are set by the network security groups that are associated at the virtual machine's subnet level and network interface level. Using effective security rules view, you can assess a virtual machine for network vulnerabilities such as open ports.

In addition to security rules set by network security groups, effective security rules view also shows the security admin rules associated with 
[Azure Virtual Network Manager](../virtual-network-manager/overview.md). Azure Virtual Network Manager is a management service that enables users to group, configure, deploy and manage virtual networks globally across subscriptions. Azure Virtual Network Manager security configuration allows users to define a collection of rules that can be applied to one or more network security groups at the global level. These security rules have a higher priority than network security group rules.

A more extended use case is in security compliance and auditing. You can define a prescriptive set of security rules as a model for security governance in your organization. You can implement a periodic compliance audit in a programmatic way by comparing the prescriptive rules with the effective rules for each of the virtual machines in your network.

In Azure portal, rules are displayed for each network interface and grouped by inbound vs outbound. This provides a simple view into the rules applied to a virtual machine. A download button is provided to easily download all the security rules into a CSV file.

:::image type="content" source="./media/network-watcher-security-group-view-overview/effective-security-rules-inline.png" alt-text="Screenshot of Azure Network Watcher effective security rules in Azure portal." lightbox="./media/network-watcher-security-group-view-overview/effective-security-rules-expanded.png":::

You can select a rule to see associated source and destination prefixes.

:::image type="content" source="./media/network-watcher-security-group-view-overview/security-rule-prefixes.png" alt-text="Screenshot of security rule associated address prefixes.":::

### Next steps

- To learn about Network Watcher, see [What is Azure Network Watcher?](network-watcher-monitoring-overview.md)
- To learn how traffic is evaluated with network security groups, see [How network security groups work](../virtual-network/network-security-group-how-it-works.md).
