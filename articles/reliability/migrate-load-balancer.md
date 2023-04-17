---
title: Migrate Load Balancer to availability zone support 
description: Learn how to migrate Load Balancer to availability zone support.
author: sonmitt
ms.service: azure
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: anaharris
ms.reviewer: 
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance on migrating load balancers to using availability zones.
---
<!-- CHANGE AUTHOR BEFORE PUBLISH -->

# Migrate Load Balancer to availability zone support
 
This guide describes how to migrate Load Balancer from non-availability zone support to availability support. We'll take you through the different options for migration.

A standard load balancer supports extra abilities in regions where availability zones are available. Availability zones configurations are available for both types of Standard load balancer; public and internal. A zone-redundant frontend survives zone failure by using dedicated infrastructure in all the zones simultaneously. One or more availability zones can fail, and the data path survives as long as one zone in the region remains healthy. Additionally, you can pin a frontend to a specific zone. A zonal frontend is served by dedicated infrastructure in a single zone. Regardless of the zonal configuration the backend pool can contain VMs from any zone.

## Prerequisites
- Use Standard SKU for load balancer and Public IP for availability zones support.
- Basic SKU type isn't supported. 
- To create or move this resource, one should have the Network Contributor role or higher.

## Downtime requirements

Downtime is required. All migration scenarios require some level of downtime down to the changing of resources used by the load balancer configurations.

> [!NOTE]
> Existing frontend IP address can't be modified to support availability zones. A new zone-redundant or zonal frontend IP needs to be created and associated with existing load balancer. This operation will change the public IP of the load balancer which will break the connectivity for resources using the old frontend IP address. Make sure to update the load balancing rules to utilize the new frontend public IP. 

## Migration option 1: Enable existing Load Balancer to use availability zones (same region)

Let's say you need to enable an existing load balancer to use availability zones within the same Azure region. For this you won't have to redeploy your load balancer to take advantage of this migration. In order to make your load balancer AZ aware, you'll have to recreate your load balancer's frontend IP configuration using a new zonal/zone-redundant IP and re-associate any existing load balancing rules to the new frontend. Note that this migration will incur downtime as IP is changed and rules are re-associated.

> [!NOTE]
> It isn't required to have a load balancer for each zone, rather having a single load balancer with multiple frontends (zonal or zone redundant) associated to their respective backend pools will serve the purpose. 

As Frontend IP can be either zonal or zone redundant, users need to decide which option to choose based on the requirements. The following are recommendations for each:

| **Frontend IP configuration** | **Recommendation** |
| ----- | ----- |
|Zonal Frontend | We recommend creating zonal frontend when backend is concentrated in a particular zone. For example, if backend instances are pinned to zone 2 then it makes sense to create Frontend IP configuration in availability zone 2. |
| Zone Redundant Frontend | When the resources (VMs, NICs, IP addresses, etc.) inside a backend pool are distributed across zones, then it's recommended to create Zone redundant Frontend. This will provide the high availability and ensure seamless connectivity even if a zone goes down. |

## Migration option 2: Migrate Load Balancer to another region with AZs

Depending on the type of load balancer you have, you'll need to follow different steps. The following sections cover migrating both external and internal load balancers.
### Migrate an Internal Load Balancer

When you create an internal load balancer, a virtual network is configured as the network for the load balancer. A private IP address in the virtual network is configured as the frontend (named as LoadBalancerFrontend by default) for the load balancer. While configuring this FE IP, you can select the availability zones.

Azure internal load balancers can't be moved from one region to another. You must associate the new load balancer to resources in the target region. For the migration, you can use an Azure Resource Manager template to export the existing configuration and virtual network of an internal load balancer. You can then stage the resource in another region by exporting the load balancer and virtual network to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.

- As part of this process, the virtual network configuration of the internal load balancer must be done first before moving the internal load balancer. Ensure to change the virtual network name and target location, rest all parameters such as address prefix and subnets are optional to update. 
- Once VNET is deployed in the target region. Export the internal load balancer template, edit the target load balancer name, target VNET resource ID and other parameters.  
- Load balancing rules, Inbound NAT rules and health probes, can be left as it is unless you want to modify the rules. 
- While deploying Frontend private IP in the subnet, ensure zones are selected as per requirement. 
- Verify all the changes and deploy the template from portal or PowerShell. 

To migrate an internal load balancer to availability zones across regions, see [moving internal Load Balancer across regions](../load-balancer/move-across-regions-internal-load-balancer-portal.md).

#### Migrate a public (external) Load Balancer 

Azure public load balancers can't be moved between regions. To redeploy load balancer to a new region with zones, the most suitable approach is to export the Azure Resource Manager template of the existing public IP address and external load balancer. You can then stage the resources in another region by modifying the template and parameters to match the destination region, and then deploy the template to the new region. 

To migrate a public load balancer to availability zones across regions, see [moving public Load Balancer across regions](../load-balancer/move-across-regions-external-load-balancer-portal.md).

### Limitations
- Zones can't be changed, updated, or created for the resource after creation.
- Resources can't be updated from zonal to zone-redundant or vice versa after creation.

## Next steps

 To learn more about load balancers and availability zones, see:
 
> [!div class="nextstepaction"]
> [Load Balancer and availability zones](../load-balancer/load-balancer-standard-availability-zones.md).
