---
title: IP flow verify overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher IP flow verify to check if traffic is allowed or denied to and from your Azure virtual machines (VMs).
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 09/28/2023

#CustomerIntent: As an Azure administrator, I want learn about IP flow verify so I can use it to check the security rules applied on the VMs to confirm if traffic is allowed or denied.
---

# IP flow verify overview

IP flow verify is a feature in Azure Network Watcher that you can use to check if a packet is allowed or denied to or from an Azure virtual machine based on the configured security and admin rules. It helps you to troubleshoot virtual machine connectivity issues by checking network security group (NSG) rules and Azure Virtual Network Manager admin rules. It's a quick and simple tool to diagnose connectivity issues to or from other Azure resources, the internet and on-premises environment.

IP flow verify looks at the rules of all network security groups applied to a virtual machine's network interface, whether the network security group is associated to the virtual machine's subnet or network interface. It additionally, looks at the Azure Virtual Network Manager rules applied to the virtual network of the virtual machine.

IP flow verify uses traffic direction, protocol, local IP, remote IP, local port, and remote port to test security and admin rules that apply to the virtual machine's network interface.

:::image type="content" source="./media/ip-flow-verify-overview/ip-flow-verify-portal.png" alt-text="Screenshot of IP flow verify in the Azure portal." lightbox="./media/ip-flow-verify-overview/ip-flow-verify-portal.png":::

IP flow verify returns **Access denied** or **Access allowed**, the name of the security rule that denies or allows the traffic, and the network security group with a link to it so you can edit it if you need to. It doesn't provide a link if a default security rule is denying or allowing the traffic. For more information, see [Default security rules](../virtual-network/network-security-groups-overview.md?toc=/azure/network-watcher/toc.json#default-security-rules).

:::image type="content" source="./media/ip-flow-verify-overview/access-denied.png" alt-text="Screenshot of IP flow verify result in the Azure portal.":::

## Considerations

- You must have a Network Watcher instance in the Azure subscription and region of the virtual machine. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).
- You must have the necessary permissions to access the feature. For more information, see [RBAC permissions required to use Network Watcher capabilities](required-rbac-permissions.md).
- IP flow verify only tests TCP and UDP rules, to test ICMP traffic rules, use [NSG diagnostics](network-watcher-network-configuration-diagnostics-overview.md).
- IP flow verify only tests security and admin rules applied to a virtual machine's network interface, to test rules applied to virtual machine scale sets, use [NSG diagnostics](network-watcher-network-configuration-diagnostics-overview.md).

## Next step

To learn how to use IP flow verify, continue to:

> [!div class="nextstepaction"]
> [Diagnose a virtual machine network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md)
