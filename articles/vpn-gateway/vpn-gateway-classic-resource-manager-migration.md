---
title: Migrate VPN gateways from Classic to Resource Manager
titleSuffix: Azure VPN Gateway
description: Learn about migrating VPN Gateway resources from the classic deployment model to the Resource Manager deployment model.
services: vpn-gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/21/2023
ms.author: cherylmc

---
# VPN Gateway classic to Resource Manager migration

VPN gateways can now be migrated from the classic deployment model to [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). For more information, see [Resource Manager deployment model](../azure-resource-manager/management/overview.md). In this article, we discuss how to migrate from classic deployments to the Resource Manager model. 

VPN gateways are migrated as part of VNet migration from classic to Resource Manager. This migration is done one VNet at a time. There aren't additional requirements in terms of tools or prerequisites to migrate. Migration steps are identical to the existing VNet migration and are documented at [IaaS resources migration page](../virtual-machines/migration-classic-resource-manager-ps.md). 

There isn't a data path downtime during migration and thus existing workloads continue to function without the loss of on-premises connectivity during migration. The public IP address associated with the VPN gateway doesn't change during the migration process. This implies that you won't need to reconfigure your on-premises router once the migration is completed.  

The Resource Manager model is different from the classic model and is composed of virtual network gateways, local network gateways and connection resources. These represent the VPN gateway itself, the local-site representing on premises address space and connectivity between the two respectively. Once migration is completed, your gateways won't be available in the classic model and all management operations on virtual network gateways, local network gateways, and connection objects must be performed using the Resource Manager model.

## Supported scenarios

Most common VPN connectivity scenarios are covered by classic to Resource Manager migration. The supported scenarios include:

* Point-to-site connectivity
* Site-to-site connectivity with VPN Gateway connected to on premises location
* VNet-to-VNet connectivity between two VNets using VPN gateways
* Multiple VNets connected to same on-premises location
* Multi-site connectivity
* Forced tunneling enabled VNets

Scenarios that aren't supported include:  

* VNet with both an ExpressRoute gateway and a VPN gateway isn't currently supported.
* Transit scenarios where VM extensions are connected to on-premises servers. Transit VPN connectivity limitations are detailed in the next sections.

> [!NOTE]
> CIDR validation in the Resource Manager model is stricter than the one in the classic model. Before migrating, ensure that classic address ranges given conform to valid CIDR format before beginning the migration. CIDR can be validated using any common CIDR validators. VNet or local sites with invalid CIDR ranges when migrated result in a failed state.
> 

## VNet-to-VNet connectivity migration

VNet-to-VNet connectivity in the classic deployment model was achieved by creating a local site representation of the connected VNet. Customers were required to create two local sites that represented the two VNets which needed to be connected together. These were then connected to the corresponding VNets using IPsec tunnel to establish connectivity between the two VNets. This model has manageability challenges, since any address range changes in one VNet must also be maintained in the corresponding local site representation. In the Resource Manager model, this workaround is no longer needed. The connection between the two VNets can be directly achieved using 'Vnet2Vnet' connection type in the Connection resource. 

:::image type="content" source="./media/vpn-gateway-migration/vnet-vnet-migration.png" alt-text="Diagram showing VNet-to-VNet migration." lightbox="./media/vpn-gateway-migration/vnet-vnet-migration.png":::

During VNet migration, we detect that the connected entity to the current VNet's VPN gateway is another VNet. We ensure that once migration of both VNets is completed, you no longer see two local sites representing the other VNet. The classic model of two VPN gateways, two local sites, and two connections between them is transformed to the Resource Manager model with two VPN gateways and two connections of type Vnet2Vnet.

## Transit VPN connectivity

You can configure VPN gateways in a topology such that on-premises connectivity for a VNet is achieved by connecting to another VNet that is directly connected to on-premises. This is transit VPN connectivity, where instances in first VNet are connected to on-premises resources via transit to the VPN gateway in the connected VNet that's directly connected to on-premises. To achieve this configuration in classic deployment model, you need to create a local site that has aggregated prefixes representing both the connected VNet and on-premises address space. This representational local site is then connected to the VNet to achieve transit connectivity. The classic model also has similar manageability challenges since any change in the on-premises address range must also be maintained on the local site representing the aggregate of VNet and on-premises. Introduction of BGP support in Resource Manager supported gateways simplifies manageability, since the connected gateways can learn routes from on-premises without manual modification to prefixes.

:::image type="content" source="./media/vpn-gateway-migration/transit.png" alt-text="Diagram showing transit routing scenario." lightbox="./media/vpn-gateway-migration/transit.png":::

Since we transform VNet-to-VNet connectivity without requiring local sites, the transit scenario loses on-premises connectivity for the VNet that is indirectly connected to on-premises. The loss of connectivity can be mitigated in the following two ways, after migration is completed: 

* Enable BGP on VPN gateways that are connected together and to the on-premises location. Enabling BGP restores connectivity without any other configuration changes since routes are learned and advertised between VNet gateways. Note that the BGP option is only available on Standard and higher SKUs.
* Establish an explicit connection from affected VNet to the local network gateway that represents the on-premises location. This would also require changing configuration on the on-premises router to create and configure the IPsec tunnel.

## Next steps

After learning about VPN gateway migration support, go to [platform-supported migration of IaaS resources from classic to Resource Manager](../virtual-machines/migration-classic-resource-manager-ps.md) to get started.