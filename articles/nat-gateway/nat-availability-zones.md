---
title: NAT gateway and availability zones
titleSuffix: Azure NAT Gateway
description: Key concepts and design guidance on using NAT gateway with availability zones.
services: virtual-network
author: asudbring
ms.service: nat-gateway
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: allensu
---

# NAT gateway and availability zones
NAT gateway is a zonal resource, which means it can be deployed and operate out of individual availability zones. With zone isolation scenarios, you can align your zonal NAT gateway resources with zonally designated IP based resources, such as virtual machines, to provide zone resiliency against outages. Review this document to understand key concepts and fundamental design guidance. 

:::image type="content" source="./media/nat-availability-zones/zonal-nat-gateway.png" alt-text="Diagram of zonal deployment of NAT gateway.":::

*Figure 1: Zonal deployment of NAT gateway.*

NAT gateway can either be designated to a specific zone within a region or to ‘no zone’. Which zone property you select for your NAT gateway resource will inform the zone property of the public IP address that can be used for outbound connectivity as well. 

## NAT gateway has built in resiliency

Virtual networks and their subnets are regional. Subnets aren't restricted to a zone. While NAT gateway is a zonal resource, it's a highly resilient and reliable method by which to connect outbound to the internet from virtual network subnets. NAT gateway uses [software defined networking](/azure-stack/hci/concepts/software-defined-networking) to operate as a fully managed and distributed service. NAT gateway infrastructure has built in redundancy. It can survive multiple infrastructure component failures. Availability zones build on this resiliency with zone isolation scenarios for NAT gateway. 

## Zonal

You can place your NAT gateway resource in a specific zone for a region. When NAT gateway is deployed to a specific zone, it will provide outbound connectivity to the internet explicitly from that zone. The public IP address or prefix configured to NAT gateway must match the same zone. NAT gateway resources with public IP addresses from a different zone, zone-redundancy or with no zone aren't allowed.

NAT gateway can provide outbound connectivity for virtual machines from other availability zones different from itself. The virtual machine’s subnet needs to be configured to the NAT gateway resource to provide outbound connectivity. Additionally, multiple subnets can be configured to the same NAT gateway resource. 

While virtual machines in subnets from different availability zones can all be configured to a single zonal NAT gateway resource, this configuration doesn't provide the most effective method for ensuring zone-resiliency against zonal outages. For more information on how to safeguard against zonal outages, see [Design considerations](#design-considerations) later in this article.

## Non-zonal
If no zone is selected at the time that the NAT gateway resource is deployed, then it's placed in ‘no zone’ by default. When NAT gateway is placed in **no zone**, Azure places the resource in a zone for you. You won't have visibility into which zone Azure chooses for your NAT gateway. After NAT gateway is deployed, zonal configurations can't be changed. **No zone** NAT gateway resources, while still zonal resources can be associated to public IP addresses from a zone, no zone, or that are zone-redundant. 

## Design considerations

Now that you understand the zone-related properties for NAT gateway, see the following design considerations to help you design for highly resilient outbound connectivity from Azure virtual networks.  

### Single zonal NAT gateway resource for zone-spanning resources 

A single zonal NAT gateway resource can be configured to either a subnet that contains virtual machines that span across multiple availability zones or to multiple subnets with different zonal virtual machines. When this type of deployment is configured, NAT gateway will provide outbound connectivity to the internet for all subnet resources from the specific zone it's located. If the zone that NAT gateway is deployed in goes down, then outbound connectivity across all virtual machine instances associated with the NAT gateway will also go down. This set up doesn't provide the best method of zone-resiliency.

:::image type="content" source="./media/nat-availability-zones/single-nat-gw-zone-spanning-subnet.png" alt-text="Diagram of single zonal NAT gateway resource.":::

*Figure 2: Single zonal NAT gateway resource for multi-zone spanning resources doesn't provide an effective method of zone-resiliency against outages.*

### Zonal NAT gateway resource for each zone in a region to create zone-resiliency 

A zonal promise for zone isolation scenarios exists when a virtual machine instance using a NAT gateway resource is in the same zone as the NAT gateway resource and its public IP addresses. The pattern you want to use for zone isolation is creating a "zonal stack" per availability zone. This "zonal stack" consists of virtual machine instances, a NAT gateway resource with public IP addresses or prefix on a subnet all in the same zone.

:::image type="content" source="./media/nat-availability-zones/multiple-zonal-nat-gateways.png" alt-text="Diagram of zonal isolation by creating zonal stacks.":::

*Figure 3: Zonal isolation by creating zonal stacks with the same zone NAT gateway, public IPs, and virtual machines provides the best method of ensuring zone resiliency against outages.*

> [!NOTE]
> Creating zonal stacks for each availability zone within a region is the most effective method for building zone-resiliency against outages for NAT gateway. However, ths configuration only safeguards the remaining availability zones where the outage did **not** take place. With this configuration, failure of outbound connectivity from a zone outage is isolated to the specific zone affected. The outage won't affect the other zonal stacks where other NAT gateways are deployed with their own subnets and zonal public IPs. 



### Integration of inbound with a standard load balancer  

If your scenario requires inbound endpoints, you have two options:

| Option | Pattern | Example | Pro | Con |
|---|---|---|---|---|
| (1) | **Align** the inbound endpoints with the respective **zonal stacks** you're creating for outbound. | Create a standard load balancer with a zonal frontend. | Same failure model for inbound and outbound. Simpler to operate. | Individual IP addresses per zone may need to be masked by a common DNS name. |
| (2) | **Overlay** the zonal stacks with a cross-zone inbound endpoint. | Create a standard load balancer with a zone-redundant front-end. | Single IP address for inbound endpoint. | Varying models for inbound and outbound. More complex to operate. |

> [!NOTE]
> Note that zonal configuration for a load balancer works differently from NAT gateway. The load balancer's availability zone selection is synonymous with its frontend IP configuration's zone selection. For public load balancers, if the public IP in the Load balancer's frontend is zone redundant then the load balancer is also zone-redundant. If the public IP in the load balancer's frontend is zonal, then the load balancer will also be designated to the same zone.

## Limitations

* Zones can't be changed, updated, or created for NAT gateway after deployment.

## Next steps

* Learn more about [Azure regions and availability zones](../availability-zones/az-overview.md)
* Learn more about [Azure NAT Gateway](./nat-overview.md)
* Learn more about [Azure Load balancer](../load-balancer/load-balancer-overview.md)
