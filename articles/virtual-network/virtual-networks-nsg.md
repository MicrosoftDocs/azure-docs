<properties 
   pageTitle="What is a Network Security Group (NSG)"
   description="Learn about Network Security Groups (NSG)"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/29/2015"
   ms.author="telmos" />

# What is a Network Security Group (NSG)?

Network Security Groups (NSGs) can be used to filter incoming and outgoing network traffic, in a similar way to firewall appliances. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. The rules of an NSG can be changed at any time, and changes are applied to all associated instances. 

>[AZURE.WARNING] NSGs can only be used in regional VNets. If you are trying to secure endpoints in a deployment without a VNet, or that uses a VNet associated with an affinity group, please see [What is an endpoint Access Control List (ACL)?](./virtual-networks-acl.md). You can also [migrate your VNet to a regional VNet](./virtual-networks-migrate-to-regional-vnet.md).

## How does a network security group work?

A network security group has a *Name*, and is associated to an Azure *Region*. It contains two types of rules, **Inbound** and **Outbound**. The Inbound rules are applied on the incoming packets to a VM and the Outbound rules are applied to the outgoing packets from the VM. The rules are applied at the host where the VM is located. An incoming or outgoing packet has to match an **Allow** rule for it be permitted, if not it will be dropped.

Network security groups are different than endpoint-based ACLs. Endpoint ACLs work only on the public port that is exposed through the input endpoint. An NSG works on one or more VM instances and controls all the traffic that is inbound and outbound on the VM.

>[AZURE.NOTE] Endpoint-based ACLs and network security groups are not supported on the same VM instance. If you want to use an NSG and have an endpoint ACL already in place, first remove the endpoint ACL. For information about how to do this, see [Managing Access Control Lists (ACLs) for Endpoints by using PowerShell](virtual-networks-acl-powershell.md).

### NSG rules

An NSG rule contains the following properties.

|Property|Description|Sample values|
|---|---|---|
|**Description**|Description for the rule|Allow inbound traffic for all VMs in a subnet|
|**Protocol**|Protocol to match for the rule|TCP, UDP, or *|
|**Source port range**|Source port range to match for the rule|80, 100-200, *|
|**Destination port range**|Destination port range to match for the rule|80, 100-200, *|
|**Source address prefix**|Source address prefix or tag to match for the rule|10.10.10.1, 10.10.10.0/24, VIRTUAL_NETWORK|
|**Destination address prefix**|Destination address prefix or tag to match for the rule|10.10.10.1, 10.10.10.0/24, VIRTUAL_NETWORK|
|**Direction**|Direction of traffic to match for the rule|inbound or outbound|
|**Priority**|Priority for the rule. Rules are checked int he order of priority, once a rule applies, no more rules are tested for matching.|10, 100, 65000|
|**Access**|Type of access to apply if the rule matches|allow or deny|

Rules are processed in the order of priority. For example, a rule with a lower priority number (e.g. 100) is processed before rules with a higher priority numbers (e.g. 200). Once a match is found, no more rules are processed.

### Default Tags

Default tags are system-provided identifiers to address a category of IP addresses. You can use default tags in the *source address prefix* and *destination address prefix* properties of any rule. There are three default tags you can use.

- **VIRTUAL_NETWORK -** This default tag denotes all of your network address space. It includes the virtual network address space (CIDR ranges defined in Azure) as well as all connected on-premises address spaces and connected Azure VNets (local networks).

- **AZURE_LOADBALANCER -** This default tag denotes Azure’s Infrastructure load balancer. This will translate to an Azure datacenter IP where Azure’s health probes will originate. This is needed only if the VM or set of VMs associated with the NSG is participating in a load balanced set.

- **INTERNET -** This default tag denotes the IP Address space that is outside the virtual network and reachable by public Internet. This range includes Azure owned public IP space as well.

### Default Rules

An NSG contains default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create. The default rules describe the default settings recommended by the platform. As illustrated by the default rules below, traffic originating and ending in a VNet is allowed both in Inbound and Outbound directions.

While connectivity to the Internet is allowed for Outbound direction, it is by default blocked for Inbound direction. There is a default rule to allow Azure’s load balancer (LB) to probe the health of the VM. You can override this rule if the VM or set of VMs under the NSG do not participate in a load balanced set.

The default rules are:

**Inbound**

| Name                              | Priority | Source IP          | Source Port | Destination IP  | Destination Port | Protocol | Access |
|-----------------------------------|----------|--------------------|-------------|-----------------|------------------|----------|--------|
| ALLOW VNET INBOUND                | 65000    | VIRTUAL_NETWORK    | *           | VIRTUAL_NETWORK | *                | *        | ALLOW  |
| ALLOW AZURE LOAD BALANCER INBOUND | 65001    | AZURE_LOADBALANCER | *           | *               | *                | *        | ALLOW  |
| DENY ALL INBOUND                  | 65500    | *                  | *           | *               | *                | *        | DENY   |

**Outbound**

| Name                    | Priority | Source IP       | Source Port | Destination IP  | Destination Port | Protocol | Access |
|-------------------------|----------|-----------------|-------------|-----------------|------------------|----------|--------|
| ALLOW VNET OUTBOUND     | 65000    | VIRTUAL_NETWORK | *           | VIRTUAL_NETWORK | *                | *        | ALLOW  |
| ALLOW INTERNET OUTBOUND | 65001    | *               | *           | INTERNET        | *                | *        | ALLOW  |
| DENY ALL OUTBOUND       | 65500    | *               | *           | *               | *                | *        | DENY   |

## Associating NSGs

You can associate an NSG to VMs, NICs, and subnets, depending on the deployment model you are using.

[learn-about-deployment-models-both-include.md](../../includes/learn-about-deployment-models-both-include.md) 

- **Associating an NSG to a VM (classic deployments only).** When you associate an NSG to a VM, the network access rules in the NSG are applied to all traffic that destined and leaving the VM. 

- **Associating an NSG to a NIC (Resource Manager deployments only).** When you associate an NSG to a NIC, the network access rules in the NSG are applied only to that NIC. That means that in a multi-NIC VM, if an NSG is applied to a single NIC, it does not affect traffic bound to toher NICs. 

- **Associating an NSG to a subnet**. When you associate an NSG to a subnet, the network access rules in the NSG are applied to all the VMs in the subnet. 

You can associate different NSGs to a VM, a NIC used by the VM, and the subnet that NIC is bound to. WHen that happens, all network access rules are applied to the traffic in the following order:

- **Inbound traffic**
	1. Subnet NSG.
	2. NIC NSG (Resource Manager) or VM NIC (classic).
- **Outbound traffic**
	1. NIC NSG (Resource Manager) or VM NIC (classic).
	3. Subnet NSG.

![NSG ACLs](./media/virtual-network-nsg-overview/figure2.png)

>[AZURE.NOTE] Although you can only associate a single NSG to a subnet, VM, or NIC; you can associate the same NSG to as many resources as you want.

## Planning

You need to approach the deployment of NSGs in your Azure infrastructure in teh same way you approach any project, by gathering requirements, understanding the available features, and carefully designing your solution. When planning for filtering traffic, consider the following:

|Requirement|Impact|
|---|---|
|**Network isolation**|VMs and role instances deployed to an Azure VNet automatically can access all subnets in their VNet, and all subnets in any VNet or on-premises network connected to their VNet by a VPN gateway or ExpressRoute circuit. To isolate subnets. To isolate parts of your network, implement NSGs at the subnet level.|
|**Number of subnets**|You can create subnets to represent tiers in your workloads. You also need a subnet for VPN connectivity when deploying a VPN gateway or ExpressROute circuit, and a subnet for your virtual appliances.|
|**Management access to VMs and role instances**|In the Resource Manager deployment model, you can use a NIC level NSG for VMs with multiple NICs to enable management (remote access) by NIC, therefore segregating traffic|
|**Public facing load balancing**|In classic deployments, you can create endpoints that map ports on a load balancer to ports on your VMs. You can also create your own individual public facing load balancer in a Resource Manager deployment. If you are restricting traffic to those VMs by using NSGs, keep in mind that the destination port for the incoming traffic is the actual port in the VM, not the port exposed by the load balancer. Also keep in mind that the source port for the connection to the VM is a port on the remote computer in the Internet, **not** the port exposed by the load balancer.|
|**Internal load balancer (ILB)**|Similar to public facing loab balancers, when you create NSGs to filter traffic coming through an ILB, you need to understand that the source port and address range applied are the ones from the computer originating the call, not the load balancer. And the destination port and address range are related to the computer receiving the traffic, not the load balancer.|
|**Multiple VNets**|Similar to the use of load balancers, when filtering traffic from other VNets, you must use the source address range of the remote computer, not the gateway connecting the VNets.|
|**Access to Azure PaaS services**|Most Azure PaaS services, such as SQL databases, and storage accounts rely on public facing IP addresses.|
 
For more information on planning for network security in Azure, read the [best practices for colud services and network security](best-practices-network-security.md). 

## Design considerations

Once you gathered your requirements and understand how you want to isolate traffic, and the different Azure services your implementation requires, you can start your NSG implementation design. Once your design is done, you are left with a set of NSGs and NSGs rules defined for implementation, and a list of subnets and NICs (or VMs) to associate the NSGs to. 

### Special rules

You need to take into account the special rules listed below. Make sure you do not block traffic allowed by those rules, otherwise your infrastructure will not be able to communicate with essential Azure services.

- **Virtual IP of the Host Node:** Basic infrastructure services such as DHCP, DNS, and Health monitoring are provided through the virtualized host IP address 168.63.129.16. This public IP address belongs to Microsoft and will be the only virtualized IP address used in all regions for this purpose. This IP address maps to the physical IP address of the server machine (host node) hosting the virtual machine. The host node acts as the DHCP relay, the DNS recursive resolver, and the probe source for the load balancer health probe and the machine health probe. Communication to this IP address should not be considered as an attack.

- **Licensing (Key Management Service):** Windows images running in the virtual machines should be licensed. To do this, a licensing request is sent to the Key Management Service host servers that handle such queries. This will always be on outbound port 1688.

### ICMP traffic

The current NSG rules only allow for protocols *TCP* or *UDP*. There is not a specific tag for *ICMP*. However, ICMP traffic is allowed within a Virtual Network by default through the Inbound VNet rules that allow traffic from/to any port and protocol within the VNet.

### Limits

You need to consider the following limits when designing your NSGs.

|**Description**|**Limit**|
|---|---|
|Number of NSGs you can associate to a subnet, VM, or NIC|1|
|NSGs per region per subscription|100|
|NSG rules per NSG|200|

Make sure you view all the [limits related to networking services in Azure](../azure-subscription-service-limits/#networking-limits) before designing your solution.

### Number of subnets

Consider the number of tiers your workload requires. Each tier can be isolated by using a subnet, with an NSG applied to the subnet. 

If you need to implement a subnet for a VPN gateway, or ExpressRoute circuit, make sure you do **NOT** apply an NSG to that subnet. If you do so, your cross VNet or cross premises connectivity will not work.

If you need to implement a virtual appliance, make sure you deploy the virtual appliance on its own subnet, so that your User Defined Routes (UDRs) can work correctly. You can implement a subnet level NSG to filter traffic in and out of this subnet. Learn more about [how to control traffic flow and use virtual appliances](virtual-networks-udr-overview.md).

### Load balancers

Consider the load balancing rules, and NAT rules, for each load balancer being used by your workload.These rules are bound to a back end pool that contains NICs (Resource Manager deployments) or VMs/role instances (classic deployments). You should create an NSG for each back end pool, allowing only traffic mapped through the rules implemented in the load balancers.

## Sample deployment

Let's consider what NSGs to create to implement in a two tier workload scenario with the following requirements:

1. Separation of traffic between front end (Windows web servers) and back end (SQL database servers).
2. Load balancing rules forwarding traffic to the load balancer to all web servers on port 80.
3. NAT rules forwarding traffic coming in port 50001 on load balancer to port 3389 on only one VM in the front end.
4. No access to the front end or back end VMs from the Internet, with exception of requirement number 1.
5. No access from the front end or back end to the Internet.
5. Access to port 3389 to any web server in the front end, for traffic coming from the front end itself.
6. Access to port 3389 to all SQL Server VMs in the back end from the front end only.
7. Access to port 1433 to all SQL Server VMs in the back end from the front end only.
8. Separation of management traffic (port 3389) and database traffic (1433) on different NICs in the back end VMs.

![NSGs](./media/virtual-network-nsg-overview/figure1.png)

As seen on the diagram above, the separation of tiers can be done by using different subnets. And then you can assign NSGs to each subnet to filter traffic.

You should start your design by looking at the traffic rules for individual subnets. Requirements 1 though 5 are all confined to subnet spaces. Consider the following rules for your implementation.

### NSG for Front end subnet

**Incoming rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|allow HTTP|Allow|100|Internet|*|192.168.1.0/24|80|TCP|
|allow RDP from front end|Allow|110|192.168.1.0/24|*|192.168.1.0/24|3389|TCP|
|deny Internet|Deny|110|192.168.1.0/24|*|192.168.1.0/24|3389|TCP|

**Outgoing rules - Front end subnet**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|deny Internet|Deny|100|\*|\*|Internet|\*|\*|

### NSG for Back end subnet NSG

**Incoming rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|deny Internet|Deny|110|192.168.1.0/24|*|192.168.1.0/24|3389|TCP|

**Outgoing rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|deny Internet|Deny|100|\*|\*|Internet|\*|\*|

### NSG for single VM (NIC) in front end for RDP from Internet

**Incoming rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|allow RDP from Internet|Allow|100|Internet|*|\*|3389|TCP|

>[AZURE.NOTE] Notice how the source address range for this rule is **Internet**, and not the VIP for the load balancer; the source port is **\***, not 500001. Do not get confused between NAT rules/load balancing rules and NSG rules. The NSG rules are always related to the original source and final destination of traffic, **NOT** the load balancer between the two. 

### NSG for management NICs in back end
**Incoming rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|allow RDP from front end|Allow|100|192.168.1.0/24|*|\*|3389|TCP|

### NSG for database access NICs in back end
**Incoming rules**
|Rule|Access|Priority|Source address range|Source port|Destination address range|Destination port|Protocol|
|---|---|---|---|---|---|---|---|
|allow SQL from front end|Allow|100|192.168.1.0/24|*|\*|1433|TCP|

Since some of the NSGs above need to be associated to individual NICs, you need to deploy this scenario as a Resource Manager deployment. Notice how rules are combined for subnet and NIC level, depending on how they need to be applied. 

## Next steps

- [Deploy NSGs in the classic deployment model](virtual-networks-create-nsg-classic-ps.md).
- [Deploy NSGs in Resource Manager](virtual-networks-create-nsg-arm-pportal.md).
- [Manage NSG logs](virtual-network-nsg-manage-log.md).