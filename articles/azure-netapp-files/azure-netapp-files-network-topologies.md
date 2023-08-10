---
title: Guidelines for Azure NetApp Files network planning | Microsoft Docs
description: Describes guidelines that can help you design an effective network architecture by using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: ram-kakani
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 07/24/2023
ms.author: ramakk
ms.custom: references_regions
---
# Guidelines for Azure NetApp Files network planning

Network architecture planning is a key element of designing any application infrastructure. This article helps you design an effective network architecture for your workloads to benefit from the rich capabilities of Azure NetApp Files.

Azure NetApp Files volumes are designed to be contained in a special purpose subnet called a [delegated subnet](../virtual-network/virtual-network-manage-subnet.md) within your Azure Virtual Network. Therefore, you can access the volumes directly from within Azure over VNet peering or from on-premises over a Virtual Network Gateway (ExpressRoute or VPN Gateway). The subnet is dedicated to Azure NetApp Files and there's no connectivity to the Internet. 

## Configurable network features  

 In supported regions, you can create new volumes or modify existing volumes to use *Standard* or *Basic* network features. In regions where the Standard network features aren't supported, the volume defaults to using the Basic network features. For more information, see [Configure network features](configure-network-features.md).

* ***Standard***  
    Selecting this setting enables higher IP limits and standard VNet features such as [network security groups](../virtual-network/network-security-groups-overview.md) and [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) on delegated subnets, and additional connectivity patterns as indicated in this article.

* ***Basic***  
    Selecting this setting enables selective connectivity patterns and limited IP scale as mentioned in the [Considerations](#considerations) section. All the [constraints](#constraints) apply in this setting. 

### Supported regions 

<a name="regions-standard-network-features"></a>Azure NetApp Files *Standard network features* are supported for the following regions:

*   Australia Central
*   Australia Central 2
*   Australia East
*   Australia Southeast
*   Brazil South
*   Canada Central
*   Canada East
*   Central India
*   Central US
*   East Asia
*   East US
*   East US 2
*	France Central
*   Germany North
*   Germany West Central
*   Japan East
*   Japan West
*   Korea Central
*	North Central US
*   North Europe
*   Norway East
*   Norway West 
*   Qatar Central
*   South Africa North
*	South Central US
*   South India 
*   Southeast Asia
*   Sweden Central
*   Switzerland North
*   Switzerland West
*   UAE Central
*   UAE North
*   UK South
*	West Europe
*   West US
*   West US 2
*	West US 3 

<a name="regions-edit-network-features"></a>The option to *[edit network features for existing volumes](configure-network-features.md#edit-network-features-option-for-existing-volumes)* is supported for the following regions:

* Australia Central
* Australia Central 2
* Australia East
* Australia Southeast 
* Brazil South
* Canada Central
* Central India
* East Asia
* East US 
* East US 2 
* France Central 
* Germany North
* Germany West Central 
* Japan East 
* Japan West
* Korea Central
* North Central US
* North Europe 
* Norway East
* Norway West 
* Qatar Central 
* South Africa North
* South India
* Southeast Asia 
* Sweden Central
* Switzerland North 
* Switzerland West 
* UAE Central
* UAE North 
* West Europe 
* West US 
* West US 2  
* West US 3 


## Considerations

You should understand a few considerations when you plan for Azure NetApp Files network.

### Constraints

The following table describes what’s supported for each network features configuration:

|      Features     |      Standard network features     |      Basic network features     |
|---|---|---|
|     Number of IPs in a VNet (including immediately peered VNets) accessing volumes in an Azure NetApp Files hosting VNet    |     [Same standard limits as VMs](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits)    |     1000    |
|     Azure NetApp Files delegated subnets per VNet    |     1    |     1    |
|     [Network Security Groups](../virtual-network/network-security-groups-overview.md) (NSGs) on Azure NetApp Files delegated   subnets    |     Yes    |     No    |
|     [User-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) (UDRs) on Azure NetApp Files delegated subnets    |     Yes    |     No    |
|     Connectivity to [Private Endpoints](../private-link/private-endpoint-overview.md)    |     Yes*    |     No    |
|     Connectivity to [Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)    |     Yes  |     No    |
|     Azure policies (for example, custom naming policies) on the Azure NetApp Files interface    |     No    |     No    |
|     Load balancers for Azure   NetApp Files traffic    |     No    |     No    |
|     Dual stack (IPv4 and   IPv6) VNet    |     No <br> (IPv4 only supported)    |     No <br> (IPv4 only supported)   |
|    Traffic routed via NVA from peered VNet | Yes    | No |

\* Applying Azure network security groups on the private link subnet to Azure Key Vault isn't supported for Azure NetApp Files customer-managed keys. Network security groups don't affect connectivity to Private Link unless Private endpoint network policy is enabled on the subnet. It's recommended to keep this option disabled.

### Supported network topologies

The following table describes the network topologies supported by each network features configuration of Azure NetApp Files. 

|      Topologies     |      Standard network features     |      Basic network features     |
|---|---|---|
|     Connectivity to volume in a local VNet    |     Yes    |     Yes    |
|     Connectivity to volume in a peered VNet (Same region)    |     Yes    |     Yes    |
|     Connectivity to volume in a peered VNet (Cross region or global peering)    |     Yes*    |     No    |
|     Connectivity to a volume over ExpressRoute gateway    |     Yes    |     Yes    |
|     [ExpressRoute (ER) FastPath](../expressroute/about-fastpath.md)    |     Yes    |     No    |
|     Connectivity from on-premises to a volume in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit    |     Yes    |     Yes    |
|     Connectivity from on-premises to a volume in a spoke VNet over VPN gateway    |     Yes    |     Yes    |
|     Connectivity from on-premises to a volume in a spoke VNet over VPN gateway and VNet peering with gateway transit    |     Yes    |     Yes    |
|     Connectivity over Active/Passive VPN gateways    |     Yes    |     Yes    |
|     Connectivity over Active/Active VPN gateways    |     Yes    |     No    |
|     Connectivity over Active/Active Zone Redundant gateways    |     Yes    |     No    |
| Connectivity over Active/Passive Zone Redundant gateways | Yes | Yes |
|     [Connectivity over Virtual WAN (VWAN)](configure-virtual-wan.md)    |    Yes    |     No    |


\* This option will incur a charge on ingress and egress traffic that uses a virtual network peering connection. For more information, see [Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/). For more general information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md). 

## Virtual network for Azure NetApp Files volumes

This section explains concepts that help you with virtual network planning.

### Azure virtual networks

Before provisioning an Azure NetApp Files volume, you need to create an Azure virtual network (VNet) or use one that already exists in your subscription. The VNet defines the network boundary of the volume.  For more information on creating virtual networks, see the [Azure Virtual Network documentation](../virtual-network/virtual-networks-overview.md).

### Subnets

Subnets segment the virtual network into separate address spaces that are usable by the Azure resources in them.  Azure NetApp Files volumes are contained in a special-purpose subnet called a [delegated subnet](../virtual-network/virtual-network-manage-subnet.md). 

Subnet delegation gives explicit permissions to the Azure NetApp Files service to create service-specific resources in the subnet. It uses a unique identifier in deploying the service. In this case, a network interface is created to enable connectivity to Azure NetApp Files.

If you use a new VNet, you can create a subnet and delegate the subnet to Azure NetApp Files by following instructions in [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md). You can also delegate an existing empty subnet that's not delegated to other services.

If the VNet is peered with another VNet, you can't expand the VNet address space. For that reason, the new delegated subnet needs to be created within the VNet address space. If you need to extend the address space, you must delete the VNet peering before expanding the address space.

>[!IMPORTANT]
>The address space size of the Azure NetApp Files VNet should be larger than its delegated subnet. If it is not, Azure NetApp Files volume creation will fail in some scenarios.
>
> It's also recommended that the size of the delegated subnet be at least /25 for SAP workloads and /26 for other workload scenarios.

### UDRs and NSGs

If the subnet has a combination of volumes with the Standard and Basic network features, user-defined routes (UDRs) and network security groups (NSGs) applied on the delegated subnets will only apply to the volumes with the Standard network features.

> [!NOTE]
> Associating NSGs at the network interface level is not supported for the Azure NetApp Files network interfaces.

Configuring UDRs on the source VM subnets with the address prefix of delegated subnet and next hop as NVA isn't supported for volumes with the Basic network features. Such a setting will result in connectivity issues.

> [!NOTE]
> To access an Azure NetApp Files volume from an on-premises network via a VNet gateway (ExpressRoute or VPN) and firewall, configure the route table assigned to the VNet gateway to include the `/32` IPv4 address of the Azure NetApp Files volume listed and point to the firewall as the next hop. Using an aggregate address space that includes the Azure NetApp Files volume IP address will not forward the Azure NetApp Files traffic to the firewall. 

>[!NOTE]
>If you want to configure a UDR route in the VM VNet, to control the routing of packets destined for a VNet-peered Azure NetApp Files standard volume, the UDR prefix must be more specific or equal to the delegated subnet size of the Azure NetApp Files volume. If the UDR prefix is of size greater than the delegated subnet size, it will not be effective. 

## Azure native environments

The following diagram illustrates an Azure-native environment:

:::image type="content" source="../media/azure-netapp-files/azure-netapp-files-network-azure-native-environment.png" alt-text="Diagram depicting Azure native environment setup." lightbox="../media/azure-netapp-files/azure-netapp-files-network-azure-native-environment.png":::

### Local VNet

A basic scenario is to create or connect to an Azure NetApp Files volume from a VM in the same VNet. For VNet 2 in the diagram, Volume 1 is created in a delegated subnet and can be mounted on VM 1 in the default subnet.

### <a name="vnet-peering"></a> VNet peering

If you have other VNets in the same region that need access to each other’s resources, the VNets can be connected using [VNet peering](../virtual-network/virtual-network-peering-overview.md) to enable secure connectivity through the Azure infrastructure. 

Consider VNet 2 and VNet 3 in the diagram above. If VM 1 needs to connect to VM 2 or Volume 2, or if VM 2 needs to connect to VM 1 or Volume 1, then you need to enable VNet peering between VNet 2 and VNet 3. 

Also, consider a scenario where VNet 1 is peered with VNet 2, and VNet 2 is peered with VNet 3 in the same region. The resources from VNet 1 can connect to resources in VNet 2 but can't connect to resources in VNet 3 unless VNet 1 and VNet 3 are peered. 

In the diagram above, although VM 3 can connect to Volume 1, VM 4 can't connect to Volume 2.  The reason for this is that the spoke VNets aren't peered, and _transit routing isn't supported over VNet peering_.

### Global or cross-region VNet peering

The following diagram illustrates an Azure-native environment with cross-region VNet peering. 

:::image type="content" source="../media/azure-netapp-files/azure-native-cross-region-peering.png" alt-text="Diagram depicting Azure native environment setup with cross-region VNet peering." lightbox="../media/azure-netapp-files/azure-native-cross-region-peering.png":::

With Standard network features, VMs are able to connect to volumes in another region via global or cross-region VNet peering. The above diagram adds a second region to the configuration in the [local VNet peering section](#vnet-peering). For VNet 4 in this diagram, an Azure NetApp Files volume is created in a delegated subnet and can be mounted on VM5 in the application subnet.

In the diagram, VM2 in Region 1 can connect to Volume 3 in Region 2. VM5 in Region 2 can connect to Volume 2 in Region 1 via VNet peering between Region 1 and Region 2.

## Hybrid environments

The following diagram illustrates a hybrid environment: 

:::image type="content" source="../media/azure-netapp-files/azure-netapp-files-network-hybrid-environment.png" alt-text="Diagram depicting hybrid networking environment." lightbox="../media/azure-netapp-files/azure-netapp-files-network-hybrid-environment.png":::

In the hybrid scenario, applications from on-premises datacenters need access to the resources in Azure. This is the case whether you want to extend your datacenter to Azure or you want to use Azure native services or for disaster recovery. See [VPN Gateway planning options](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#planningtable) for information on how to connect multiple resources on-premises to resources in Azure through a site-to-site VPN or an ExpressRoute.

In a hybrid hub-spoke topology, the hub VNet in Azure acts as a central point of connectivity to your on-premises network. The spokes are VNets peered with the hub, and they can be used to isolate workloads.

Depending on the configuration, you can connect on-premises resources to resources in the hub and the spokes.

In the topology illustrated above, the on-premises network is connected to a hub VNet in Azure, and there are 2 spoke VNets in the same region peered with the hub VNet.  In this scenario, the connectivity options supported for Azure NetApp Files volumes are as follows:

* On-premises resources VM 1 and VM 2 can connect to Volume 1 in the hub over a site-to-site VPN or ExpressRoute circuit. 
* On-premises resources VM 1 and VM 2 can connect to Volume 2 or Volume 3 over a site-to-site VPN and regional VNet peering.
* VM 3 in the hub VNet can connect to Volume 2 in spoke VNet 1 and Volume 3 in spoke VNet 2.
* VM 4 from spoke VNet 1 and VM 5 from spoke VNet 2 can connect to Volume 1 in the hub VNet.
* VM 4 in spoke VNet 1 can't connect to Volume 3 in spoke VNet 2. Also, VM 5 in spoke VNet2 can't connect to Volume 2 in spoke VNet 1. This is the case because the spoke VNets aren't peered and _transit routing isn't supported over VNet peering_.
* In the above architecture if there's a gateway in the spoke VNet as well, the connectivity to the ANF volume from on-premises connecting over the gateway in the Hub will be lost. By design, preference would be given to the gateway in the spoke VNet and so only machines connecting over that gateway can connect to the ANF volume.

## Next steps

* [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md)
* [Configure network features for an Azure NetApp Files volume](configure-network-features.md) 
* [Virtual network peering](../virtual-network/virtual-network-peering-overview.md)
* [Configure Virtual WAN for Azure NetApp Files](configure-virtual-wan.md)
