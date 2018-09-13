---
title: Azure virtual network interface endpoints | Microsoft Docs
description: Learn how to enable direct access to Azure resources from a virtual network using interface endpoints.
services: virtual-network
documentationcenter: na
author: malop
manager: narayan
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/15/2018
ms.author: malop
ms.custom:

---

# Virtual Network Interface Endpoints

Virtual Network (VNet) interface endpoints allows Azure services to be deployed in your virtual network and privately communicate using private IP addresses within the virtual network and on premises.

This feature is available for the following Azure services:

- **[Azure SQL Database](../sql-database/sql-database-vnet-service-endpoint-rule-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)**: Available in preview on US West Central region.

For the most up-to-date notifications, check the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

## Key benefits

Interface endpoints provide the following benefits:

- **Private connectivity for your Azure service resources**: With interface endpoints, Azure service resources can be deployed into your virtual network, allowing your workloads to connect privately to resources inside the virtual network.
- **Direct connectivity from on premises for your Azure service resources**: Today, traffic to services exposed using public IP addresses are follow a public route. Interface endpoints provides direct connectivity using the private route to Azure services. 
- **Security configuration simplified**: You no longer need extensive IP firewall rules to secure outbound traffic to Azure service resources. For traffic comming from on premises and workloads on virtual networks, security rules are clean and simple within predictable private IP addresses. There is no additional overhead to maintaining firewall rules for traffic within trusted boundaries.

Image here 
## Capabilities

Deploying services using interface endpoints provides the following capabilities:

- Workloads within the virtual network can communicate with Azure service resources privately, through private IP addresses. Example, a virtual machine can connect to a SQL DB server using private IP address only in the virtual network.
- On-premises resources can access resources in a virtual network using private IP addresses over a [Site-to-Site VPN (VPN Gateway)](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#s2smulti) or [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Service instances in a virtual network are fully managed by the Azure service, to monitor health of the instances, and provide required scale, based on load.
- Service instances are deployed into a subnet in a virtual network. Interface endpoints accepts inbound traffic only, the Azure service resource cannot generate or initiate traffic within the virtual network.
- Optionally, services might require a [delegated subnet](virtual-network-manage-subnet#add-a-subnet) as an explicit identifier that a subnet can host a particular service.

## Limitations

- The feature is available only to virtual networks deployed through the Azure Resource Manager deployment model.
- Azure service resource and virtual network must be located on the same region.
- Private DNS record is required in most Azure service resources, for virtual network using a custom DNS, a new DNS record is required in order to make requests using the private IP address.
- Traffic from peered virtual networks is not supported
- An interface endpoint requires a subnet for deployment, network security groups and route table is not supported on the interface endpoint subnet.

## Configuration

- The virtual network where the interface endpoint is configured can be in the same or different subscription than the Azure service resource. For more information on permissions required for setting up endpoints and securing Azure services, see [Provisioning](#Provisioning).
- You need a subnet within your virtual network to deploy Azure service resources using interface endpoints. When using the service API, the subnet will need to be [delegated](virtual-network-for-azure-services.md#deploy-azure-services-into-virtual-networks) to a particular service, this indicator is required to authorized the creation of interface endpoints on your virtual network. Learn how to create a [delegated subnet](virtual-network-manage-subnet#add-a-subnet). 

## Provisioning

Interface endpoints can be configured on virtual networks independently, by a user with write access to a virtual network. To secure Azure service resources to a VNet, the user must have permission to *Microsoft.Network/JoinServicetoaSubnet* for the subnets being added. This permission is included in the built-in service administrator roles, by default and can be modified by creating custom roles.

Learn more about [built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Virtual networks and Azure service resources can be in the same or different subscriptions. If the virtual network and Azure service resources are in different subscriptions, the resources must be under the same Active Directory (AD) tenant. 

## Pricing and limits

During preview, there is no additional charge for using interface endpoints. pricing details will be determinated at GA timeframe. 

## Next steps

- Learn how to [create a delegated subnet on your virtual network ](virtual-network-manage-subnet#add-a-subnet)
- Learn how to [deploy an Azure SQL Database server to a virtual network](../sql-database/sql-database-vnet-service-endpoint-rule-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- Learn about [Azure service integration in virtual networks](virtual-network-for-azure-services.md)

