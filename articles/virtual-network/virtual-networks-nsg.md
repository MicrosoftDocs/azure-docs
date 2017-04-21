---
title: Network security groups in Azure | Microsoft Docs
description: Learn how to isolate and control traffic flow within your virtual networks using the distributed firewall in Azure using Network Security Groups.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn

ms.assetid: 20e850fc-6456-4b5f-9a3f-a8379b052bc9
ms.service: virtual-network
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/11/2016
ms.author: jdial

---
# Filter network traffic with network security groups

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to Azure Virtual Networks (VNet). NSGs can be associated to subnets, individual VMs (classic), or individual network interfaces (NIC) attached to VMs (Resource Manager). When an NSG is associated to a subnet, the rules apply to all resources connected to the subnet. Traffic can further be restricted by also associating an NSG to a VM or NIC.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using both models, but Microsoft recommends that most new deployments use the Resource Manager model.

## NSG resource
NSGs contain the following properties:

| Property | Description | Constraints | Considerations |
| --- | --- | --- | --- |
| Name |Name for the NSG |Must be unique within the region.<br/>Can contain letters, numbers, underscores, periods, and hyphens.<br/>Must start with a letter or number.<br/>Must end with a letter, number, or underscore.<br/>Cannot exceed 80 characters. |Since you may need to create several NSGs, make sure you have a naming convention that makes it easy to identify the function of your NSGs. |
| Region |Azure [region](https://azure.microsoft.com/regions) where the NSG is created. |NSGs can only be associated to resources within the same region as the NSG. |To learn about how many NSGs you can have per region, read the [Azure limits](../azure-subscription-service-limits.md#virtual-networking-limits-classic) article.|
| Resource group |The [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups) the NSG exists in. |Although an NSG exists in a resource group, it can be associated to resources in any resource group, as long as the resource is part of the same Azure region as the NSG. |Resource groups are used to manage multiple resources together, as a deployment unit.<br/>You may consider grouping the NSG with resources it is associated to. |
| Rules |Inbound or outbound rules that define what traffic is allowed or denied. | |See the [NSG rules](#Nsg-rules) section of this article. |

> [!NOTE]
> Endpoint-based ACLs and network security groups are not supported on the same VM instance. If you want to use an NSG and have an endpoint ACL already in place, first remove the endpoint ACL. To learn how to remove an ACL, read the [Managing Access Control Lists (ACLs) for Endpoints by using PowerShell](virtual-networks-acl-powershell.md) article.
> 

### NSG rules
NSG rules contain the following properties:

| Property | Description | Constraints | Considerations |
| --- | --- | --- | --- |
| **Name** |Name for the rule. |Must be unique within the region.<br/>Can contain letters, numbers, underscores, periods, and hyphens.<br/>Must start with a letter or number.<br/>Must end with a letter, number, or underscore.<br/>Cannot exceed 80 characters. |You may have several rules within an NSG, so make sure you follow a naming convention that allows you to identify the function of your rule. |
| **Protocol** |Protocol to match for the rule. |TCP, UDP, or * |Using * as a protocol includes ICMP (East-West traffic only), as well as UDP and TCP, and may reduce the number of rules you need.<br/>At the same time, using * might be too broad an approach, so it's recommended that you use * only when necessary. |
| **Source port range** |Source port range to match for the rule. |Single port number from 1 to 65535, port range (example: 1-65635), or * (for all ports). |Source ports could be ephemeral. Unless your client program is using a specific port, use * in most cases.<br/>Try to use port ranges as much as possible to avoid the need for multiple rules.<br/>Multiple ports or port ranges cannot be grouped by a comma. |
| **Destination port range** |Destination port range to match for the rule. |Single port number from 1 to 65535, port range (example: 1-65535), or \* (for all ports). |Try to use port ranges as much as possible to avoid the need for multiple rules.<br/>Multiple ports or port ranges cannot be grouped by a comma. |
| **Source address prefix** |Source address prefix or tag to match for the rule. |Single IP address (example: 10.10.10.10), IP subnet (example: 192.168.1.0/24), [default tag](#default-tags), or * (for all addresses). |Consider using ranges, default tags, and * to reduce the number of rules. |
| **Destination address prefix** |Destination address prefix or tag to match for the rule. | Single IP address (example: 10.10.10.10), IP subnet (example: 192.168.1.0/24), [default tag](#default-tags), or * (for all addresses). |Consider using ranges, default tags, and * to reduce the number of rules. |
| **Direction** |Direction of traffic to match for the rule. |Inbound or outbound. |Inbound and outbound rules are processed separately, based on direction. |
| **Priority** |Rules are checked in the order of priority. Once a rule applies, no more rules are tested for matching. | Number between 100 and 4096. | Consider creating rules jumping priorities by 100 for each rule to leave space for new rules you might create in the future. |
| **Access** |Type of access to apply if the rule matches. | Allow or deny. | Keep in mind that if an allow rule is not found for a packet, the packet is dropped. |

NSGs contain two sets of rules: Inbound and outbound. The priority for a rule must be unique within each set. 

![NSG rule processing](./media/virtual-network-nsg-overview/figure3.png) 

The previous picture shows how NSG rules are processed.

### Default Tags
Default tags are system-provided identifiers to address a category of IP addresses. You can use default tags in the **source address prefix** and **destination address prefix** properties of any rule. There are three default tags you can use:

* **VirtualNetwork** (Resource Manager) (**VIRTUAL_NETWORK** for classic): This tag includes the virtual network address space (CIDR ranges defined in Azure), all connected on-premises address spaces, and connected Azure VNets (local networks).
* **AzureLoadBalancer** (Resource Manager) (**AZURE_LOADBALANCER** for classic): This tag denotes Azure’s infrastructure load balancer. The tag translates to an Azure datacenter IP where Azure’s health probes originate.
* **Internet** (Resource Manager) (**INTERNET** for classic): This tag denotes the IP address space that is outside the virtual network and reachable by public Internet. The range includes the [Azure owned public IP space](https://www.microsoft.com/download/details.aspx?id=41653).

### Default rules
All NSGs contain a set of default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create. 

The default rules allow and disallow traffic as follows:
- **Virtual network:** Traffic originating and ending in a virtual network is allowed both in inbound and outbound directions.
- **Internet:** Outbound traffic is allowed, but inbound traffic is blocked.
- **Load balancer:** Allow Azure’s load balancer to probe the health of your VMs and role instances. If you are not using a load balanced set you can override this rule.

**Inbound default rules**

| Name | Priority | Source IP | Source Port | Destination IP | Destination Port | Protocol | Access |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AllowVNetInBound |65000 | VirtualNetwork | * | VirtualNetwork | * | * | Allow |
| AllowAzureLoadBalancerInBound | 65001 | AzureLoadBalancer | * | * | * | * | Allow |
| DenyAllInBound |65500 | * | * | * | * | * | Deny |

**Outbound default rules**

| Name | Priority | Source IP | Source Port | Destination IP | Destination Port | Protocol | Access |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AllowVnetOutBound | 65000 | VirtualNetwork | * | VirtualNetwork | * | * | Allow |
| AllowInternetOutBound | 65001 | * | * | Internet | * | * | Allow |
| DenyAllOutBound | 65500 | * | * | * | * | * | Deny |

## Associating NSGs
You can associate an NSG to VMs, NICs, and subnets, depending on the deployment model you are using, as follows:

* **VM (classic only):** Security rules are applied to all traffic to/from the VM. 
* **NIC (Resource Manager only):** Security rules are applied to all traffic to/from the NIC the NSG is associated to. In a multi-NIC VM, you can apply different (or the same) NSG to each NIC individually. 
* **Subnet (Resource Manager and classic):** Security rules are applied to any traffic to/from any resources connected to the VNet.

You can associate different NSGs to a VM (or NIC, depending on the deployment model) and the subnet that a NIC or VM is connected to. Security rules are applied to the traffic, by priority, in each NSG, in the following order:

- **Inbound traffic**

  1. **NSG applied to subnet:** If a subnet NSG has a matching rule to deny traffic, the packet is dropped.

  2. **NSG applied to NIC** (Resource Manager) or VM (classic): If VM\NIC NSG has a matching rule that denies traffic, packets are dropped at the VM\NIC, even if a subnet NSG has a matching rule that allows traffic.

- **Outbound traffic**

  1. **NSG applied to NIC** (Resource Manager) or VM (classic): If a VM\NIC NSG has a matching rule that denies traffic, packets are dropped.

  2. **NSG applied to subnet:** If a subnet NSG has a matching rule that denies traffic, packets are dropped, even if a VM\NIC NSG has a matching rule that allows traffic.

> [!NOTE]
> Although you can only associate a single NSG to a subnet, VM, or NIC; you can associate the same NSG to as many resources as you want.
>

## Implementation
You can implement NSGs in the Resource Manager or classic deployment models using the following tools:

| Deployment tool | Classic | Resource Manager |
| --- | --- | --- |
| Azure portal   | Yes | [Yes](virtual-networks-create-nsg-arm-pportal.md) |
| PowerShell     | [Yes](virtual-networks-create-nsg-classic-ps.md) | [Yes](virtual-networks-create-nsg-arm-ps.md) |
| Azure CLI **V1**   | [Yes](virtual-networks-create-nsg-classic-cli.md) | [Yes](virtual-networks-create-nsg-cli-nodejs.md) |
| Azure CLI **V2**   | No | [Yes](virtual-networks-create-nsg-arm-cli.md) |
| Azure Resource Manager template   | No  | [Yes](virtual-networks-create-nsg-arm-template.md) |

## Planning
Before implementing NSGs, you need to answer the following questions:

1. What types of resources do you want to filter traffic to or from? You can connect resources such as NICs (Resource Manager), VMs (classic), Cloud Services, Application Service Environments, and VM Scale Sets. 
2. Are the resources you want to filter traffic to/from connected to subnets in existing VNets?

For more information on planning for network security in Azure, read the [Cloud services and network security](../best-practices-network-security.md) article. 

## Design considerations
Once you know the answers to the questions in the [Planning](#Planning) section, review the following sections before defining your NSGs:

### Limits
There are limits to the number of NSGs you can have in a subscription and number of rules per NSG. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.

### VNet and subnet design
Since NSGs can be applied to subnets, you can minimize the number of NSGs by grouping your resources by subnet, and applying NSGs to subnets.  If you decide to apply NSGs to subnets, you may find that existing VNets and subnets you have were not defined with NSGs in mind. You may need to define new VNets and subnets to support your NSG design and deploy your new resources to your new subnets. You could then define a migration strategy to move existing resources to the new subnets. 

### Special rules
If you block traffic allowed by the following rules, your infrastructure can't communicate with essential Azure services:

* **Virtual IP of the host node:** Basic infrastructure services such as DHCP, DNS, and health monitoring are provided through the virtualized host IP address 168.63.129.16. This public IP address belongs to Microsoft and is the only virtualized IP address used in all regions for this purpose. This IP address maps to the physical IP address of the server machine (host node) hosting the VM. The host node acts as the DHCP relay, the DNS recursive resolver, and the probe source for the load balancer health probe and the machine health probe. Communication to this IP address is not an attack.
* **Licensing (Key Management Service):** Windows images running in VMs must be licensed. To ensure licensing, a request is sent to the Key Management Service host servers that handle such queries. The request is made outbound through port 1688.

### ICMP traffic
The current NSG rules only allow for protocols *TCP* or *UDP*. There is not a specific tag for *ICMP*. However, ICMP traffic is allowed within a VNet by the AllowVNetInBound default rule, that allows traffic to and from any port and protocol within the VNet.

### Subnets
* Consider the number of tiers your workload requires. Each tier can be isolated by using a subnet, with an NSG applied to the subnet. 
* If you need to implement a subnet for a VPN gateway, or ExpressRoute circuit, do **not** apply an NSG to that subnet. If you do so, cross-VNet or cross-premises connectivity may fail. 
* If you need to implement a network virtual appliance (NVA), connect the NVA to its own subnet and create user-defined routes (UDR) to and from the NVA. You can implement a subnet level NSG to filter traffic in and out of this subnet. To learn more about UDRs, read the [User-defined routes](virtual-networks-udr-overview.md) article.

### Load balancers
* Consider the load balancing and network address translation (NAT) rules for each load balancer used by each of your workloads. NAT rules are bound to a back-end pool that contains NICs (Resource Manager) or VMs/Cloud Services role instances (classic). Consider creating an NSG for each back-end pool, allowing only traffic mapped through the rules implemented in the load balancers. Creating an NSG for each back-end pool guarantees that traffic coming to the back-end pool directly (rather than through the load balancer), is also filtered.
* In classic deployments, you create endpoints that map ports on a load balancer to ports on your VMs or role instances. You can also create your own individual public-facing load balancer through Resource Manager. The destination port for incoming traffic is the actual port in the VM or role instance, not the port exposed by a load balancer. The source port and address for the connection to the VM is a port and address on the remote computer in the Internet, not the port and address exposed by the load balancer.
* When you create NSGs to filter traffic coming through an internal load balancer (ILB), the source port and address range applied are  from the originating computer, not the load balancer. The destination port and address range are those of the destination computer, not the load balancer.

### Other
* Endpoint-based access control lists (ACL) and NSGs are not supported on the same VM instance. If you want to use an NSG and have an endpoint ACL already in place, first remove the endpoint ACL. For information about how to remove an endpoint ACL, see the [Manage endpoint ACLs](virtual-networks-acl-powershell.md) article.
* In Resource Manager, you can use an NSG associated to a NIC for VMs with multiple NICs to enable management (remote access) on a per NIC basis. Associating unique NSGs to each NIC enables separation of traffic types across NICs.
* Similar to the use of load balancers, when filtering traffic from other VNets, you must use the source address range of the remote computer, not the gateway connecting the VNets.
* Many Azure services cannot be connected to VNets. If an Azure resource is not connected to a VNet, you cannot use an NSG to filter traffic to the resource.  Read the documentation for the services you use to determine whether the service can be connected to a VNet.

## Sample deployment
To illustrate the application of the information in this article, consider a common scenario of a two tier application shown in the following picture:

![NSGs](./media/virtual-network-nsg-overview/figure1.png)

As shown in the diagram, the *Web1* and *Web2* VMs are connected to the *FrontEnd* subnet, and the *DB1* and *DB2* VMs are connected to the *BackEnd* subnet.  Both subnets are part of the *TestVNet* VNet. The application components each run within an Azure VM connected to a VNet. The scenario has the following requirements:

1. Separation of traffic between the WEB and DB servers.
2. Load balancing rules forward traffic from the load balancer to all web servers on port 80.
3. Load balancer NAT rules forward traffic coming into the load balancer on port 50001 to port 3389 on the WEB1 VM.
4. No access to the front-end or back-end VMs from the Internet, except requirements 1 and 3.
5. No outbound Internet access from the WEB or DB servers.
6. Access from the FrontEnd subnet is allowed to port 3389 of any web server.
7. Access from the FrontEnd subnet is allowed to port 3389 of any DB server.
8. Access from the FrontEnd subnet is allowed to port 1433 of all DB servers.
9. Separation of management traffic (port 3389) and database traffic (1433) on different NICs in DB servers.

Requirements 1-6 (except requirements 3 and 4) are all confined to subnet spaces. The following NSGs meet the previous requirements, while minimizing the number of NSGs required:

### FrontEnd
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Allow-Inbound-HTTP-Internet | Allow | 100 | Internet | * | * | 80 | TCP |
| Allow-Inbound-RDP-Internet | Allow | 200 | Internet | * | * | 3389 | TCP |
| Deny-Inbound-All | Deny | 300 | Internet | * | * | * | TCP |

**Outbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deny-Internet-All |Deny |100 | * | * | Internet | * | * |

### BackEnd
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deny-Internet-All | Deny | 100 | Internet | * | * | * | * |

**Outbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deny-Internet-All | Deny | 100 | * | * | Internet | * | * |

The following NSGs are created and associated to NICs in the following VMs:

### WEB1
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Allow-Inbound-RDP-Internet | Allow | 100 | Internet | * | * | 3389 | TCP |
| Allow-Inbound-HTTP-Internet | Allow | 200 | Internet | * | * | 80 | TCP |

> [!NOTE]
> The source address range for the previous rules is **Internet**, not the virtual IP address of for the load balancer. The source port is *, not 500001. NAT rules for load balancers are not the same as NSG security rules. NSG security rules are always related to the original source and final destination of traffic, **not** the load balancer between the two. 
> 
> 

### WEB2
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deny-Inbound-RDP-Internet | Deny | 100 | Internet | * | * | 3389 | TCP |
| Allow-Inbound-HTTP-Internet | Allow | 200 | Internet | * | * | 80 | TCP |

### DB servers (Management NIC)
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Allow-Inbound-RDP-Front-end | Allow | 100 | 192.168.1.0/24 | * | * | 3389 | TCP |

### DB servers (Database traffic NIC)
**Inbound rules**

| Rule | Access | Priority | Source address range | Source port | Destination address range | Destination port | Protocol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Allow-Inbound-SQL-Front-end | Allow | 100 | 192.168.1.0/24 | * | * | 1433 | TCP |

Since some of the NSGs are associated to individual NICs, the rules are for resources deployed through Resource Manager. Rules are combined for subnet and NIC, depending on how they are associated. 

## Next steps
* [Deploy NSGs (Resource Manager)](virtual-networks-create-nsg-arm-pportal.md).
* [Deploy NSGs (classic)](virtual-networks-create-nsg-classic-ps.md).
* [Manage NSG logs](virtual-network-nsg-manage-log.md).
* [Troubleshoot NSGs] (virtual-network-nsg-troubleshoot-portal.md)
