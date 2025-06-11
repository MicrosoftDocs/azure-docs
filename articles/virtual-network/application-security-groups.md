---
title: Azure application security groups overview
titlesuffix: Azure Virtual Network
description: Learn about the use of application security groups. 
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: allensu
---

# Application security groups

Application security groups enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups. You can reuse your security policy at scale without manual maintenance of explicit IP addresses. The platform handles the complexity of explicit IP addresses and multiple rule sets, allowing you to focus on your business logic. To better understand application security groups, consider the following example:

:::image type="content" source="./media/security-groups/application-security-groups.png" alt-text="Diagram of Application security groups.":::

In the previous picture, *NIC1* and *NIC2* are members of the *AsgWeb* application security group. *NIC3* is a member of the *AsgLogic* application security group. *NIC4* is a member of the *AsgDb* application security group. Though each network interface (NIC) in this example is a member of only one application security group, a network interface can be a member of multiple application security groups, up to the [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). None of the network interfaces have an associated network security group. *NSG1* is associated to both subnets and contains the following rules:

## Allow-HTTP-Inbound-Internet

This rule is needed to allow traffic from the internet to the web servers. Because inbound traffic from the internet is denied by the **DenyAllInbound** default security rule, no extra rule is needed for the *AsgLogic* or *AsgDb* application security groups.

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 100 | Internet | * | AsgWeb | 80 | TCP | Allow |

## Deny-Database-All

Because the **AllowVNetInBound** default security rule allows all communication between resources in the same virtual network, this rule is needed to deny traffic from all resources.

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 120 | * | * | AsgDb | 1433 | Any | Deny |

## Allow-Database-BusinessLogic

This rule allows traffic from the *AsgLogic* application security group to the *AsgDb* application security group. The priority for this rule is higher than the priority for the *Deny-Database-All* rule. As a result, this rule is processed before the *Deny-Database-All* rule, so traffic from the *AsgLogic* application security group is allowed, whereas all other traffic is blocked.

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 110 | AsgLogic | * | AsgDb | 1433 | TCP | Allow |

Network interfaces that are members of the application security group apply the rules that specify it as the source or destination. The rules don't affect other network interfaces. If the network interface isn't a member of an application security group, the rule isn't applied to the network interface, even though the network security group is associated to the subnet.

Application security groups have the following constraints:

- There are limits to the number of application security groups you can have in a subscription, and other limits related to application security groups. For details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

- All network interfaces assigned to an application security group have to exist in the same virtual network that the first network interface assigned to the application security group is in. For example, if the first network interface assigned to an application security group named *AsgWeb* is in the virtual network named *VNet1*, then all subsequent network interfaces assigned to *ASGWeb* must exist in *VNet1*. You can't add network interfaces from different virtual networks to the same application security group.

- If you specify an application security group as the source and destination in a security rule, the network interfaces in both application security groups must exist in the same virtual network. 
    
    - An example would be if *AsgLogic* had network interfaces from *VNet1* and *AsgDb* had network interfaces from *VNet2*. In this case, it would be impossible to assign *AsgLogic* as the source and *AsgDb* as the destination in a rule. All network interfaces for both the source and destination application security groups need to exist in the same virtual network.

> [!TIP]  
> To minimize the number of security rules you need, plan out the application security groups you require. Create rules using service tags or application security groups, rather than individual IP addresses or ranges of IP addresses, whenever possible.

## Next steps

* Learn how to [Create a network security group](tutorial-filter-network-traffic.md).
