---
title: Introduction to IP flow verify in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher IP flow verify capability
services: network-watcher
documentationcenter: na
author: damendo
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 11/30/2017
ms.author: damendo
---

# Introduction to IP flow verify in Azure Network Watcher

IP flow verify checks if a packet is allowed or denied to or from a virtual machine. The information consists of direction, protocol, local IP, remote IP, local port, and remote port. If the packet is denied by a security group, the name of the rule that denied the packet is returned. While any source or destination IP can be chosen, IP flow verify helps administrators quickly diagnose connectivity issues from or to the internet and from or to the on-premises environment.

IP flow verify looks at the rules for all Network Security Groups (NSGs) applied to the network interface, such as a subnet or virtual machine NIC. Traffic flow is then verified based on the configured settings to or from that network interface. IP flow verify is useful in confirming if a rule in a Network Security Group is blocking ingress or egress traffic to or from a virtual machine.

An instance of Network Watcher needs to be created in all regions that you plan to run IP flow verify. Network Watcher is a regional service and can only be ran against resources in the same region. The instance used does not affect the results of IP flow verify, as any route associated with the NIC or subnet is still be returned.

![1][1]

## Next steps

Visit the following article to learn if a packet is allowed or denied for a specific virtual machine through the portal. [Check if traffic is allowed on a VM with IP Flow Verify using the portal](diagnose-vm-network-traffic-filtering-problem.md)

[1]: ./media/network-watcher-ip-flow-verify-overview/figure1.png

