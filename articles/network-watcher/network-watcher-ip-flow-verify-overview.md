---
title: Introduction to IP flow verify
titleSuffix: Azure Network Watcher
description: This page provides an overview of Azure Network Watcher IP flow verify capability.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/04/2022
ms.author: halkazwini
---

# Introduction to Azure Network Watcher IP flow verify 

IP flow verify checks if a packet is allowed or denied to or from a virtual machine. The information consists of direction, protocol, local IP, remote IP, local port, and a remote port. If the packet is denied by a security group, the name of the rule that denied the packet is returned. While any source or destination IP can be chosen, IP flow verify helps administrators quickly diagnose connectivity issues from or to the internet and from or to the on-premises environment.

IP flow verify looks at the rules for all Network Security Groups (NSGs) applied to the network interface, such as a subnet or virtual machine NIC. Traffic flow is then verified based on the configured settings to or from that network interface. IP flow verify is useful in confirming if a rule in a Network Security Group is blocking ingress or egress traffic to or from a virtual machine. Now along with the NSG rules evaluation, the Azure Virtual Network Manager rules will also be evaluated.

[Azure Virtual Network Manager (AVNM)](../virtual-network-manager/overview.md) is a management service that enables users to group, configure, deploy, and manage Virtual Networks globally across subscriptions. AVNM security configuration allows users to define a collection of rules that can be applied to one or more network groups at the global level. These security rules have a higher priority than network security group (NSG) rules. An important difference to note here is that admin rules are a resource delivered by ANM in a central location controlled by governance and security teams, which bubble down to each vnet. NSGs are a resource controlled by the vnet owners, which apply at each subnet or NIC level.

An instance of Network Watcher needs to be created in all regions where you plan to run IP flow verify. Network Watcher is a regional service and can only be run against resources in the same region. The instance used does not affect the results of IP flow verify, as any route associated with the NIC or subnet is still returned.

![1][1]

## Next steps

Visit the following article to learn if a packet is allowed or denied for a specific virtual machine through the portal. [Check if traffic is allowed on a VM with IP Flow Verify using the portal](diagnose-vm-network-traffic-filtering-problem.md)

[1]: ./media/network-watcher-ip-flow-verify-overview/figure1.png

