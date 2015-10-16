<properties 
   pageTitle="What is a Network Security Group (NSG)"
   description="Learn about Network Security Groups (NSG)"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/22/2015"
   ms.author="telmos" />

# What is a Network Security Group (NSG)?

You can use an NSG to control traffic to one or more virtual machine (VM) instances in your virtual network. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. The rules of an NSG can be changed at any time, and changes are applied to all associated instances. 

>[AZURE.WARNING] NSGs can only be used in regional VNets. If you are trying to secure endpoints in a deployment without a VNet, or that uses a VNet associated with an affinity group, please see [What is an endpoint Access Control List (ACL)?](./virtual-networks-acl.md). You can also [migrate your VNet to a regional VNet](./virtual-networks-migrate-to-regional-vnet.md).

![NSGs](./media/virtual-network-nsg-overview/figure1.png)

The figure above shows a virtual network with two subnets, with an NSG associated to each subnet for traffic control.

>[AZURE.NOTE] Endpoint-based ACLs and network security groups are not supported on the same VM instance. If you want to use an NSG and have an endpoint ACL already in place, first remove the endpoint ACL. For information about how to do this, see [Managing Access Control Lists (ACLs) for Endpoints by using PowerShell](virtual-networks-acl-powershell.md).

## How does a network security group work?

Network security groups are different than endpoint-based ACLs. Endpoint ACLs work only on the public port that is exposed through the input endpoint. An NSG works on one or more VM instances and controls all the traffic that is inbound and outbound on the VM.

A network security group has a *Name*, is associated to a *Region*, and has a descriptive label. It contains two types of rules, **Inbound** and **Outbound**. The Inbound rules are applied on the incoming packets to a VM and the Outbound rules are applied to the outgoing packets from the VM. The rules are applied at the host where the VM is located. An incoming or outgoing packet has to match an **Allow** rule for it be permitted, if not it will be dropped.

Rules are processed in the order of priority. For example, a rule with a lower priority number (e.g. 100) is processed before rules with a higher priority numbers (e.g. 200). Once a match is found, no more rules are processed.

A rule specifies the following:

- **Name:** A unique identifier for the rule

- **Type:** Inbound/Outbound

- **Priority:** <You can specify an integer between 100 and 4096>

- **Source IP Address:** CIDR of source IP range

- **Source Port Range:** <integer or range between 0 and 65536>

- **Destination IP Range:** CIDR of the destination IP Range

- **Destination Port Range:** <integer or range between 0 and 65536>

- **Protocol:** <TCP, UDP or ‘*’ is allowed>

- **Access:** Allow/Deny

### Default Rules

An NSG contains default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create. The default rules describe the default settings recommended by the platform. As illustrated by the default rules below, traffic originating and ending in a VNet is allowed both in Inbound and Outbound directions.

While connectivity to the Internet is allowed for Outbound direction, it is by default blocked for Inbound direction. There is a default rule to allow Azure’s load balancer (LB) to probe the health of the VM. You can override this rule if the VM or set of VMs under the NSG does not participate in the load balanced set.

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

### Default Tags

Default tags are system-provided identifiers to address a category of IP addresses. Default tags can be specified in customer defined rules. The default tags are as follows:

- **VIRTUAL_NETWORK -** This default tag denotes all of your network address space. It includes the virtual network address space (IP CIDR in Azure) as well as all connected on-premises address space (Local Networks). This also includes VNet to VNet address spaces.

- **AZURE_LOADBALANCER -** This default tag denotes Azure’s Infrastructure load balancer. This will translate to an Azure datacenter IP where Azure’s health probes will originate. This is needed only if the VM or set of VMs associated with the NSG is participating in a load balanced set.

- **INTERNET -** This default tag denotes the IP Address space that is outside the virtual network and reachable by public Internet. This range includes Azure owned public IP space as well.

### ICMP Traffic

The current NSG rules only allow for protocols *TCP* or *UDP*. There is not a specific tag for *ICMP*. However, ICMP traffic is allowed within a Virtual Network by default through the Inbound VNet rules that allow traffic from/to any port and protocol within the VNet.

## Associating NSGs

You can associate an NSG to VMs, NICs, and subnets. 

- **Associating an NSG to a VM.** When you associate an NSG to a VM, the network access rules in the NSG are applied to all traffic that destined and leaving the VM. 

- **Associating an NSG to a NIC.** When you associate an NSG to a NIC, the network access rules in the NSG are applied only to that NIC. That means that in a multi-NIC VM, if an NSG is applied to a single NIC, it does not affect traffic bound to toher NICs. 

- **Associating an NSG to a Subnet**. When you associate an NSG to a subnet, the network access rules in the NSG are applied to all the VMs in the subnet. 

You can associate different NSGs to a VM, a NIC used by the VM, and the subnet that NIC is bound to. WHen that happens, all network access rules are applied to the traffic in the following order:

- **Inbound traffic**
	1. Subnet NSG.
	2. NIC NSG.
	3. VM NSG.
- **Outbound traffic**
	1. VM NSG.
	2. NIC NSG.
	3. Subnet NSG.

![NSG ACLs](./media/virtual-network-nsg-overview/figure2.png)

>[AZURE.NOTE] Although you can only associate a single NSG to a subnet, VM, or NIC; you can associate the same NSG to as many resources as you want.

## Design considerations

You must understand how VMs communicate with infrastructure services, and PaaS services hosted in Azure when designing your NSGs. Most Azure PaaS services, such as SQL databases and storage, can only be accessed through a public facing Internet address. The same is true for load balancing probes.

A common scenario in Azure is the segregation of VMs and PaaS roles in subnets based on whether these objects required access to the internet or not. In such scenario, you might have a subnet with VMs or role instances that require access to Azure Paas services, such as SQL databases and storage, but that do not require any inbound or outbound communication to the public Internet. 

Imagine the following NSG rule for such a scenario:

| Name | Priority | Source IP | Source Port | Destination IP | Destination Port | Protocol | Access |
|------|----------|-----------|-------------|----------------|------------------|----------|--------|
|NO INTERNET|100| VIRTUAL_NETWORK|&#42;|INTERNET|&#42;|TCP|DENY| 

Since the rule is denying all access from the virtual network to the Internet, VMs will not be able to access any Azure PaaS service that requires a public Internet endpoint, such as SQL databases. 

Instead of using a deny rule, consider using a rule to allow access from the virtual network to the Internet, but deny access from the Internet to the virtual network, as shown below:

| Name | Priority | Source IP | Source Port | Destination IP | Destination Port | Protocol | Access |
|------|----------|-----------|-------------|----------------|------------------|----------|--------|
|TO INTERNET|100| VIRTUAL_NETWORK|&#42;|INTERNET|&#42;|TCP|ALLOW|
|FROM INTERNET|110| INTERNET|&#42;|VIRTUAL_NETWORK|&#42;|TCP|DENY| 

>[AZURE.WARNING] Azure uses a special subnet referred to as the **Gateway** subnet to handle VPN gateway to other VNets and on-premises networks. Associating an NSG to this subnet will cause your VPN gateway to stop functioning as expected. Do NOT associate NSGs to gateway subnets!

You also need to take into account the special rules listed below. Make sure you do not block traffic allowed by those rules, otherwise your infrastructure will not be able to communicate with essential Azure services.

- **Virtual IP of the Host Node:** Basic infrastructure services such as DHCP, DNS, and Health monitoring are provided through the virtualized host IP address 168.63.129.16. This public IP address belongs to Microsoft and will be the only virtualized IP address used in all regions for this purpose. This IP address maps to the physical IP address of the server machine (host node) hosting the virtual machine. The host node acts as the DHCP relay, the DNS recursive resolver, and the probe source for the load balancer health probe and the machine health probe. Communication to this IP address should not be considered as an attack.

- **Licensing (Key Management Service):** Windows images running in the virtual machines should be licensed. To do this, a licensing request is sent to the Key Management Service host servers that handle such queries. This will always be on outbound port 1688.

## Limits

You need to consider the following limits when designing your NSGs.

|**Description**|**Limit**|
|---|---|
|Number of NSGs you can associate to a subnet, VM, or NIC|1|
|NSGs per region per subscription|100|
|NSG rules per NSG|200|

Make sure you view all the [limits related to networking services in Azure](../azure-subscription-service-limits/#networking-limits) before designing your solution.

## Next steps

- [Deploy NSGs in the classic deployment model](virtual-networks-create-nsg-classic-ps.md).
- [Deploy NSGs in Resource Manager](virtual-networks-create-nsg-arm-pportal.md).