---
title: NAT gateway and availability zones
titleSuffix: Azure NAT Gateway
description: Learn about key concepts and design guidance on deploying Azure NAT Gateway with availability zones.
services: virtual-network
author: alittleton
ms.service: azure-nat-gateway
ms.topic: concept-article
ms.date: 11/04/2025
ms.author: alittleton
#Customer intent: For customers who want to understand how to use NAT gateway with availability zones.
# Customer intent: "As a network architect, I want to understand how to deploy NAT gateway with availability zones, so that I can ensure resilient outbound connectivity for my virtual networks against potential zonal outages."
---

# NAT gateway and availability zones

[Availability zones](../reliability/availability-zones-overview.md) are physically separate groups of data centers within an Azure region.
This article provides information on how NAT Gateway works with availability zones, including zonal and zone-redundant options.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## NAT Gateway SKUs

NAT Gateway offers two different SKUs for either single zone or zone-redundant support. 

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-skus.png" alt-text="Diagram of zonal deployment of NAT gateway.":::

*Figure 1: On the left is a zonal deployment of Standard NAT gateway, on the right is a zone-redundant deployment of StandardV2 NAT gateway.* 

### StandardV2 SKU NAT Gateway - Zone-redundant

StandardV2 SKU NAT Gateway is zone-redundant. When StandardV2 NAT Gateway is deployed, it provides outbound connectivity across multiple availability zones. StandardV2 NAT Gateway can survive a single zone failure. When one availability zone in a region goes down, new connections flow from the remaining healthy zones. To ensure that your architecture is resilient to single zone failures, deploy StandardV2 NAT gateway. StandardV2 NAT gateway must use a StandardV2 Public IP address for its Outbound IP. StandardV2 SKU public IPs are zone-redundant by default and do not require any additional setup to achieve zone-redundancy.

:::image type="content" source="./media/nat-overview/zone-redundant-standard-2.png" alt-text="Diagram of zone-redundant deployment of StandardV2 NAT gateway.":::

*Figure 2: Zone-redundant deployment of StandardV2 NAT gateway.*

## Standard SKU NAT Gateway - Zonal

Standard SKU NAT Gateway is zonal, which means it operates out of a single availability zone. Standard SKU NAT Gateway can either be configured to a specific single zone in a region or to “no zone” in which Azure configures the NAT gateway to a zone for you. When configured to a single zone, NAT Gateway provides outbound connectivity for all subnets from that specific zone. Subnets can contain resources spread across multiple zones such as with zonal virtual machines. If the zone that is associated to that Standard NAT gateway goes down, then outbound connectivity for all virtual machines within those the subnets goes down. This setup doesn’t provide the best method of zone-resiliency.

:::image type="content" source="./media/nat-overview/zonal-standard-1.png" alt-text="Diagram of zonal deployment of Standard NAT gateway.":::

*Figure 3: Zonal deployment of Standard NAT gateway.*

Standard SKU NAT Gateways must be associated with Standard SKU public IPs. The zone property you select for your NAT gateway resource informs the zone property of the public IP address that can be used for outbound connectivity. 

> [!NOTE]
> StandardV2 SKU public IPs can’t be attached to any other resource other than a StandardV2 NAT Gateway.

| NAT Gateway SKU | Availability zones | Public IP requirements |
| --- | --- | --- |
|StandardV2 | Zone-redundant | Must deploy with StandardV2 Public IP |
|Standard | Single-zone | Standard Public IP must be zone-redundant or match same zone as NAT gateway |
|Standard | No zone | Standard Public IP can be from a specific zone, no zone, or zone-redundant |

## Standard NAT Gateway - Zonal vs Nonzonal

You can place your Standard NAT gateway resource in a specific zone for a region. When Standard NAT gateway is deployed to a specific zone, it provides outbound connectivity to the internet explicitly from that zone. NAT gateway resources assigned to an availability zone can be attached to public IP addresses either from the same zone or that are zone redundant. Public IP addresses from a different availability zone or no zone aren't allowed.

NAT gateway can provide outbound connectivity for virtual machines from other availability zones different from itself. The virtual machine’s subnet needs to be associated to the NAT gateway resource to provide outbound connectivity.  

If no zone is selected at the time that the Standard NAT gateway resource is deployed, the NAT gateway is placed in no zone by default. When NAT gateway is placed in no zone, Azure places the resource in a zone for you. There isn't visibility into which zone Azure chooses for your NAT gateway. After NAT gateway is deployed, zonal configurations can't be changed. No zone NAT gateway resources, while still zonal resources can be associated to public IP addresses from a zone, no zone, or that are zone-redundant. 

### Design considerations

StandardV2 NAT Gateway provides a dimension of reliability that Standard does not. StandardV2 is zone-redundant by default, and can survive a single zone failure. StandardV2 NAT Gateway must be deployed with StandardV2 Public IP which is also zone-redundant resource by default. 
When Standard SKU is deployed, if the NAT gateway availability zone goes down, the outbound connectivity across all subnets and all zones will go down.


### Integration of inbound with a standard load balancer  

To learn about integrating a Load balancer and NAT gateway, see the following tutorials for [public load balancer](./tutorial-nat-gateway-load-balancer-public-portal.md) and [internal load balancer](./tutorial-nat-gateway-load-balancer-internal-portal.md). 

## Limitations

* Zones can't be changed, updated, or created for NAT gateway after deployment.
* Standard SKU NAT Gateway can’t be upgraded to StandardV2 SKU NAT Gateway. You must deploy StandardV2 SKU NAT Gateway and replace Standard SKU NAT Gateway to achieve zone-resiliency for architectures using zonal NAT gateways.
* Standard SKU public IPs can’t be used with StandardV2 NAT Gateway. You must re-IP to new StandardV2 SKU public IPs to use StandardV2 NAT Gateway.


## Next steps

* Learn more about [Azure regions and availability zones](../reliability/availability-zones-overview.md)
* Learn more about [Azure NAT Gateway](./nat-overview.md)
* Learn more about [Azure Load balancer](../load-balancer/load-balancer-overview.md)
