---
title: 'About zone-redundant virtual network gateway in Azure availability zones'
description: Learn about zone-redundant virtual network gateways in Azure availability zones.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/03/2020
ms.author: cherylmc 
---
# About zone-redundant virtual network gateway in Azure availability zones

This article helps you create a zone-redundant virtual network gateway in Azure availability zones. This brings resiliency, scalability, and higher availability to virtual network gateways. Deploying gateways in Azure availability zones physically and logically separates gateways within a region, while protecting your on-premises network connectivity to Azure from zone-level failures. For information, see  [About zone-redundant virtual network gateways](about-zone-redundant-vnet-gateways.md) and [What are Azure regions and availability zones?](../availability-zones/az-overview.md)

### <a name="zrgw"></a>Zone-redundant gateways

To automatically deploy your virtual network gateways across availability zones, you can use zone-redundant virtual network gateways. With zone-redundant gateways, you can benefit from zone-resiliency to access your mission-critical, scalable services on Azure.

<br>
<br>

![zone-redundant gateways graphic](./media/create-zone-redundant-vnet-gateway/zonered.png)

### <a name="zgw"></a>Zonal gateways

To deploy gateways in a specific zone, you can use zonal gateways. When you deploy a zonal gateway, all instances of the gateway are deployed in the same availability zone.

<br>
<br>

![zonal gateways graphic](./media/create-zone-redundant-vnet-gateway/zonal.png)

## <a name="gwskus"></a>Gateway SKUs

Zone-redundant and zonal gateways are available as gateway SKUs. We have added new virtual network gateway SKUs in Azure AZ regions. These SKUs are similar to the corresponding existing SKUs for ExpressRoute and VPN Gateway, except that they're specific to zone-redundant and zonal gateways. You can identify these SKUs by the "AZ" in the SKU name.

For information about gateway SKUs, see [VPN gateway SKUs](vpn-gateway-about-vpngateways.md#gwsku) and [ExpressRoute gateway SKUs](../expressroute/expressroute-about-virtual-network-gateways.md#gwsku).

## <a name="pipskus"></a>Public IP SKUs

Zone-redundant gateways and zonal gateways both rely on the Azure public IP resource *Standard* SKU. The configuration of the Azure public IP resource determines whether the gateway that you deploy is zone-redundant, or zonal. If you create a public IP resource with a *Basic* SKU, the gateway won't have any zone redundancy, and the gateway resources will be regional.

### <a name="pipzrg"></a>Zone-redundant gateways

When you create a public IP address using the **Standard** public IP SKU without specifying a zone, the behavior differs depending on whether the gateway is a VPN gateway, or an ExpressRoute gateway. 

* For a VPN gateway, the two gateway instances will be deployed in any 2 out of these three zones to provide zone-redundancy. 
* For an ExpressRoute gateway, since there can be more than two instances, the gateway can span across all the three zones.

### <a name="pipzg"></a>Zonal gateways

When you create a public IP address using the **Standard** public IP SKU and specify the Zone (1, 2, or 3), all the gateway instances will be deployed in the same zone.

### <a name="piprg"></a>Regional gateways

When you create a public IP address using the **Basic** public IP SKU, the gateway is deployed as a regional gateway and doesn't have any zone-redundancy built into the gateway.

## <a name="faq"></a>FAQ

### What will change when I deploy these SKUs?

From your perspective, you can deploy your gateways with zone-redundancy. This means that all instances of the gateways will be deployed across Azure availability zones, and each availability zone is a different fault and update domain. This makes your gateways more reliable, available, and resilient to zone failures.

### Can I use the Azure portal?

Yes, you can use the Azure portal to deploy these SKUs. However, you'll see these SKUs only in those Azure regions that have Azure availability zones.

### What regions are available for me to use these SKUs?

These SKUs are available in Azure regions that have Azure availability zones. For more information, see [Azure regions with availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones).

### Can I change/migrate/upgrade my existing virtual network gateways to zone-redundant or zonal gateways?

Migrating your existing virtual network gateways to zone-redundant or zonal gateways is currently not supported. You can, however, delete your existing gateway and re-create a zone-redundant or zonal gateway.

### Can I deploy both VPN and ExpressRoute gateways in same virtual network?

Co-existence of both VPN and ExpressRoute gateways in the same virtual network is supported. However, you should reserve a /27 IP address range for the gateway subnet.

## Next steps

[Create a zone-redundant virtual network gateway](create-zone-redundant-vnet-gateway.md)
