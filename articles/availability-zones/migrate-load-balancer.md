---
title: Migrate Load Balancer to availability zone support 
description: Learn how to migrate Load Balancer to availability zone support.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: anaharris
ms.reviewer: 
ms.custom: references_regions
CustomerIntent: As a cloud architect/engineer, I need general guidance on migrating load balancers to using availability zones.
---
<!-- CHANGE AUTHOR BEFORE PUBLISH -->

# Migrate Load Balancer to availability zone support
 
This guide describes how to migrate Load Balancer from non-availability zone support to availability support. We'll take you through the different options for migration.

A standard load balancer supports extra abilities in regions where availability zones are available. availability zones configurations are available for both types of Standard load balancer; public and internal. A zone-redundant frontend survives zone failure by using dedicated infrastructure in all the zones simultaneously. Additionally, you can pin a frontend to a specific zone. A zonal frontend is served by dedicated infrastructure in a single zone. Regardless of the zonal configuration the backend pool can contain VMs from any zone.

For a Standard Zone redundant Load Balancer, the traffic is served by a single IP address. A single frontend IP address will survive zone failure. The frontend IP may be used to reach all (non-impacted) backend pool members no matter the zone. One or more availability zones can fail, and the data path survives as long as one zone in the region remains healthy.

You can choose to have a frontend guaranteed to a single zone, which is known as a zonal. This scenario means any inbound or outbound flow is served by a single zone in a region. Your frontend shares fate with the health of the zone. The data path is unaffected by failures in other zones. You can use zonal frontends to expose an IP address per Availability Zone.

## Prerequisites
- Availability zones are supported with Standard SKU for both load balancer and Public IP. 
- Basic SKU type isn't supported. 
- To create or move this resource, one should have the Network Contributor role or higher.

## Downtime requirements

Downtime is required. All migration scenarios require some level of downtime down to the changing of resources used by the load balancer configurations.
## Migration option 1: Enable existing Load Balancer to use availability zones (same region)

Let's say you need to enable an existing load balancer to use availability zones within the same Azure region. You can't just switch an existing Azure load balancer from non-AZ to be AZ aware. However, you won't have to redeploy a load balancer to take advantage of this migration. In order to make your load balancer AZ aware, you'll have to recreate your load balancer's frontend IP configuration using a new zonal/zone-redundant IP and re-associate any existing load balancing rules to the new frontend. Not that this migration will incur downtime as rules are re-associated.

> [!NOTE]
> It isn't required to have a load balancer for each zone, rather having a single load balancer with multiple frontends (zonal or zone redundant) associated to their respective backend pools will serve the purpose. 

As Frontend IP can be either zonal or zone redundant, users need to decide which option to choose based on the requirements. The following are recommendations for each:

| **Frontend IP configuration** | **Recommendation** |
| ----- | ----- |
|Zonal Frontend | We recommend creating zonal frontend when backend is concentrated in a particular zone. For example, if backend instances are pinned to zone 2 then it makes sense to create Frontend IP configuration in Availability zone 2. |
| Zone Redundant Frontend | When the resources (VMs, NICs, IP addresses, etc.) inside a backend pool are distributed across zones, then it's recommended to create Zone redundant Frontend. This will provide the high availability and ensure seamless connectivity even if a zone goes down. |

## Migration option 2: Migrate Load Balancer to another region with AZs

Depending on the type of load balancer you have, you'll need to follow different steps. The following sections cover migrating both external and internal load balancers
### Migrate an Internal Load Balancer

When you create an internal load balancer, a virtual network is configured as the network for the load balancer. A private IP address in the virtual network is configured as the frontend (named as LoadBalancerFrontend by default) for the load balancer. While configuring this FE IP, you can select the availability zones.

Azure internal load balancers can't be moved from one region to another. We must associate the new load balancer to resources in the target region. For the migration, we can you use an Azure Resource Manager template to export the existing configuration and virtual network of an internal load balancer. We can then stage the resource in another region by exporting the load balancer and virtual network to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.

To migrate an internal load balancer to availability zones across regions, see [moving internal Load Balancer across regions](../load-balancer/move-across-regions-internal-load-balancer-portal.md).

#### Migrate a public Load Balancer 

Azure external load balancers can't be moved between regions. We need to associate the new load balancer to resources in the target region.
To redeploy load balancer with the source configuration to a new Zone resilient region, the most suitable approach is to use an Azure Resource Manager template to export the existing configuration external load balancer. You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. 

To migrate an internal load balancer to availability zones across regions, see [moving public Load Balancer across regions](../load-balancer/move-across-regions-external-load-balancer-portal.md).

### Limitations
- Zones can't be changed, updated, or created for the resource after creation.
- Resources can't be updated from zonal to zone-redundant or vice versa after creation.

## Next steps

 To learn more about load balancers and availability zones, check out [Load Balancer and availability zones](../load-balancer/load-balancer-standard-availability-zones.md).
