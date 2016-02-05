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

An Azure virtual network (VNet) is a representation of your own network in the cloud.  It is a logical isolation of the Azure cloud dedicated to your subscription. You can fully control the IP address blocks, DNS settings, security policies, and route tables within this network. You can also further segment your VNet into subnets and launch Azure IaaS virtual machines (VMs). Additonally you can connect the virtual network to your on-premises network using one of the [connectivity options](vpn-gateway-cross-premises-options.md) available in Azure. In essence, you can expand your network to Azure, with complete control on IP address blocks with the benefit of enterprise scale Azure provides.

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

### Limits

You need to consider the following limits when designing your VNets. 

**Resource**| **Default limit (per region, per subscription)** | **Maximum Limit**
--- | --- | ---
VNets per subscription | 50 | 500
DNS Servers per VNet | 9 | 25
VMs per VNet | 2048 | 2048
Network Interfaces (NICs) | 300 | 1000
Network Security Groups (NSG) | 100 | 400
Public IP addresses (dynamic) | 60 | contact support
Reserved public IP addresses (static) | 20 | contact support
Load balancers (internal and internet facing) | 100 | contact support
Load balancer rules per load balancer | 150 | 150
Application gateways | 50 | 50

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

