<properties
   pageTitle="Azure Virtual Network (VNet) Plan and Design Guide | Microsoft Azure"
   description="Plan and design virutal networks in Azure"
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
   ms.date="02/05/2016"
   ms.author="telmos" />

# Plan and design Azure Virtual Networks

Creating a VNet to experiment with is easy enough, but chances are, you will deploy multiple VNets over time to support the production needs of your organization. With some planning and design, you will be able to deploy VNets and connect the resources you need more effectively. If you are not familiar with VNets, stop reading this document now and [learn about VNets](virtual-network-overview.md) and [how to deploy](virtual-networks-create-vnet-arm-pportal.md) one before proceeding. 

## Plan

You need to understand how Azure subscriptions, regions, and resources work prior to planning your Azure infrastructure. You can use the list of considerations below as a starting point. Once you understand those considerations, you can start to answer some basic planning questions to gather your design requirements.

### Considerations

Before answering the planning questions below, consider the following:

- Everything you create in Azure is composed of one or more resources. A virtual machine (VM) is a resource, the network adapter interface (NIC) used by a VM is a resource, the public IP address used by a NIC is a resource, the VNet the NIC is connected to is a resource.
- You create resources within an [Azure region](https://azure.microsoft.com/regions/#services) and subscription. And resources can only be connected to a VNet that exists in the same region and subscription they are in. 
- You can connect VNets to each other using one of the [connectivity options](vpn-gateway-cross-premises-options.md) available in Azure. You can connect VNets across regions and subscriptions this way.
- Different resources can be grouped together in [resource groups](resource-group-overview.md/#resource-groups), making it easier to manage the resource as a unit. A resource group can contain resources from multiple regions, as long as the resources belong to the same subscription.

### Define requirements

Use the questions below as a starting point for your Azure network design.	

1. What Azure locations will you use to host VNets?
2. Do you need to provide communication between these Azure locations?
3. Do you need to provide communication between your Azure VNet(s) and your on-premises datacenter(s)?
4. How many IaaS VMs do you need for your solution?
5. Do you need to isolate traffic based on groups of VMs (i.e. front end web servers and backend database servers)?
6. Do you need to control traffic flow using virtual appliances?

## Design

Once you know the answers to the questions in the [Plan](#Plan) section, review the following before defining your VNets.

### Virtual networks (VNets)

VNet and subnets resources help define a security boundary for workloads running in Azure. A VNet is characterized by a collection of address spaces, defined as CIDR blocks. 

>[AZURE.NOTE] Network administrators are familiar with CIDR notation. If you are not familiar with CIDR, [learn more about it](http://whatismyipaddress.com/cidr).

![VNet with multiple subnets](./media/resource-groups-networking/Figure4.png)

VNets contain the following properties.

|Property|Description|Sample values|
|---|---|---|
|**addressSpace**|Collection of address prefixes that make up the VNet in CIDR notation|192.168.0.0/16|
|**subnets**|Collection of subnets that make up the VNet|see [subnets](#Subnets) below.|
|**ipAddress**|IP address assigned to object. This is a read-only property.|104.42.233.77|

### Subnets
A subnet is a child resource of a VNet, and helps define segments of address spaces within a CIDR block, using IP address prefixes. NICs can be added to subnets, and connected to VMs, providing connectivity for various workloads.

Subnets contain the following properties. 

|Property|Description|Sample values|
|---|---|---|
|**addressPrefix**|Single address prefix that make up the subnet in CIDR notation|192.168.1.0/24|
|**networkSecurityGroup**|NSG applied to the subnet|see [NSGs](#Network-Security-Group)|
|**routeTable**|Route table applied to the subnet|see [UDR](#Route-table)|
|**ipConfigurations**|Collection of IP configruation objects used by NICs connected to the subnet|see [UDR](#Route-table)|

### Limits

You need to consider the following limits when designing your VNets. 

[AZURE.INCLUDE [azure-virtual-network-limits.md](../../includes/azure-virtual-network-limits.md)]

>[AZURE.IMPORTANT] Make sure you view all the [limits related to networking services in Azure](../azure-subscription-service-limits/#networking-limits) before designing your solution. Some limits can be increased by opening a support ticket.

### Number of VNets and subscriptions

You should consider creating multiple VNets in the following scenarios:

- **VMs that need to be placed in different Azure locations**. VNets in Azure are regional. They cannot span locations. Therefore you need at least one VNet for each Azure location you want to host VMs in.
- **Workloads that need to be completely isolated from one another**. You can create separate VNets, that even use the same IP address spaces, to isolate different workloads from one another. 
- **Avoid platform limits**. As seen in the [limits](#Limits) section, you cannot have more than 2048 VMs in a single VNet. 

Keep in mind that the limits you see above are per region, per subscription. That means you can use multiple subscriptions to increase the limit of resources you can maintain in Azure. You can use a site-to-stie VPN, or an ExpressRoute circuit, to connect VNets in different subscriptions.

### Subscription and VNet design patterns

The table below shows some common design patterns for using subscriptions and VNets.

|Scenario|Diagram|Pros|Cons|
|---|---|---|---|
|Single subscription, two VNets per app|![Single subscription](./media/virtual-network-vnet-plan-design-arm/figure1.png)|Only one subscription to manage.|Maximum of 25 apps per Azure region. You need more subscriptions after that.|
|One subscription per app, two VNets per app|![Single subscription](./media/virtual-network-vnet-plan-design-arm/figure2.png)|Uses only two VNets per subscription.|Harder to manage when there are too many apps.|
|One subscription per business unit, two VNets per app.|![Single subscription](./media/virtual-network-vnet-plan-design-arm/figure3.png)|Balance between number of subscriptions and VNets.|Maximum of 25 apps per business unit (subscription).|
|One subscription per business unit, two VNets per group of apps.|![Single subscription](./media/virtual-network-vnet-plan-design-arm/figure4.png)|Balance between number of subscriptions and VNets.|Apps must be isolated by using subnets and NSGs.|


### Number of subnets

You should consider multiple subnets in a VNet in the following scenarios:

- **Not enough private IP addresses for all NICs in a subnet**. If your subnet address space does not contain enough IP addresses for the number of NICs in the subnet, you need to create multiple subnets. Keep in mind that Azure reserves 5 private IP addresses from each subnet that cannot be used: the first and last addresses of the address space (for the subnet address, and multicast) and 3 addresses to be used internally (for DHCP and DNS purposes). 
- **Security**. You can use subnets to separate groups of VMs from one another for workloads that have a multi-layer structure, and apply different [network security groups(NSGs)](virtual-networks-nsg.md#subnets) for those subnets.
- **Hybrid connectivity**. You can use VPN gateways and ExpressRoute circuits to [connect](vpn-gateway-cross-premises-options.md) your VNets to one antoher, and to your on-premises datacenter(s). VPN gateways and ExpressRoute circuits require a subnet of their own to be created.
- **Virtual appliances**. You can use a virtual appliance, such as a firewall, WAN accelerator, or VPN gateway in an Azure VNet. When you do so, you need to [route traffic](virtual-networks-udr-overview) to those appliances and isolate them in their own subnet.

### Subnet and NSG design patterns

The table below shows some common design patterns for using subnets.

|Scenario|Diagram|Pros|Cons|
|---|---|---|---|
|Single subnet, NSGs per application layer, per app|![Single subnet](./media/virtual-network-vnet-plan-design-arm/figure5.png)|Only one subnet to manage.|Multiple NSGs necessary to isolate each application.|
|One subnet per app, NSGs per application layer|![Subnet per app](./media/virtual-network-vnet-plan-design-arm/figure6.png)|Fewer NSGs to manage.|Multiple subnets to manage.|
|One subnet per application layer, NSGs per app.|![Subnet per layer](./media/virtual-network-vnet-plan-design-arm/figure7.png)|Balance between number of subnets and NSGs.|Maximum of 100 NSGs. 50 apps if each apps requires 2 distinct NSGs.|
|One subnet per application layer, per app, NSGs per subnet|![Subnet per layer per app](./media/virtual-network-vnet-plan-design-arm/figure8.png)|Possibly smaller number of NSGs.|Multiple subnets to manage.|

## Sample design

|Provide a brief description of the customer scenario|

### Plan
|List sample requirements for the design.|

### Design

|Provide a diagram of the sample design, followed by an explanation of why it looks the way it does and how it meets the requirements.  Information for this comes from your own experience with the Service/Feature, as well as information obtained from engineering, customers (forums), MS services, MVPs, or others.|

## Next steps

- Always include a link to the article that includes the Deploy content 

