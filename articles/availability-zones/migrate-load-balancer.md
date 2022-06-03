---
title: Migrate Load Balancer to availability zone support 
description: Learn how to migrate Load Balancer to availability zone support.
author: mbender-ms
ms.service: azure
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: mbender
ms.reviewer: 
ms.custom: references_regions
---
<!-- CHANGE AUTHOR BEFORE PUBLISH -->

# Migrate Load Balancer to availability zone support
 
This guide describes how to migrate Load Balancer from non-availability zone support to availability support. We'll take you through the different options for migration.

A standard load balancer supports additional abilities in regions where Availability Zones are available. Availability Zones configurations are available for both types of Standard load balancer; public and internal. A zone-redundant frontend survives zone failure by using dedicated infrastructure in all the zones simultaneously. Additionally, you can pin a frontend to a specific zone. A zonal frontend is served by dedicated infrastructure in a single zone. Regardless of the zonal configuration the backend pool can contain VM’s from any zone.

For a Standard Zone redundant Load Balancer, the traffic is served by a single IP address. A single frontend IP address will survive zone failure. The frontend IP may be used to reach all (non-impacted) backend pool members no matter the zone. One or more availability zones can fail, and the data path survives as long as one zone in the region remains healthy.

You can choose to have a frontend guaranteed to a single zone, which is known as a zonal. This scenario means any inbound or outbound flow is served by a single zone in a region. Your frontend shares fate with the health of the zone. The data path is unaffected by failures in other zones. You can use zonal frontends to expose an IP address per Availability Zone.

<!--Provide any general comments or information that would be useful to the customer concerning the AZ migration options they will be considering.-->

## Prerequisites
- AZs are supported with Standard SKU for both load balancer and Public IP. 
- Basic SKU type isn't supported. 
- To create or move this resource, one should have the Network Contributor role or higher.

<!-- List and describe all required prerequisites needed in order to accomplish the migration task. (Supported SKU needed, etc):

* First prereq
* Second,etc.

-->

## Downtime requirements

Downtime is required.

<!--List any downtime requirements for your migration options.-->


<!--In the sections below, provide each option separately. Use the following template for each:-->

## Migration option 1:Enable existing Load Balancer to use Availability Zones (same region)

### When to enable an existing Load Balancer to use Availability Zones (same region) 


### How to enable an existing Load Balancer to use Availability Zones (same region) 
 You can't just switch an existing Azure load balancer from non-AZ to be AZ aware whether it is in the same or different Azure region. However, this also doesn’t imply that we need to redeploy the entire load balancer from scratch. The process of switching to AZs is rather easier when we need to make this change in the same region as compared to another region.
To make this change, we need to create a new Frontend IP configuration with desired AZ option (Zonal or Zone Redundant) and associate it with the existing Load Balancer. This operation will change the Public IP of the load balancer, which will break the connectivity for certain resources using the old IP address. Make sure to update the load balancing rules and configurations to utilize these new public IPs.

:::image type="content" source="media/enable-availability-zones-load-balancer.png" alt-text="Screenshot of Azure Portal showing Availability Zone dropdown menu":::

Note that it isn't required to have a load balancer for each zone, rather having a single load balancer with multiple frontends (zonal or zone redundant) associated to their respective backend pools will serve the purpose. 

As Frontend IP can be either zonal or zone redundant, users need to decide which option to choose based on the requirements.  

**Zonal Frontend** - We recommend creating zonal frontend when backend is concentrated in a particular zone. For example, if backend instances are pinned to zone 2 then it makes sense to create Frontend IP configuration in Availability zone 2.
Zone Redundant Frontend – When the resources (VMs, NICs, IP addresses, etc.) inside a backend pool are distributed across zones, then it's recommended to create Zone redundant Frontend. This will provide the high availability and ensure seamless connectivity even if a zone goes down. 

 For detailed guidance on using Availability Zones for Load balancer, refer to these articles:

Load balance VMs across Zones
Load balance VMs within a zone using a zonal Standard Load Balancer
Quickstart: Create an internal load balancer - Azure portal - Azure Load Balancer | Microsoft Docs

<!-- Need URLs for above-->

<!-- Provide number steps. -->

## Migration option 2: Migrate Load Balancer to another region with AZs

### When to migrate Load Balancer to another region with AZs

### How to migrate Load Balancer to another region with AZs

#### Internal Load Balancer
When you create an internal load balancer, a virtual network is configured as the network for the load balancer. A private IP address in the virtual network is configured as the frontend (named as LoadBalancerFrontend by default) for the load balancer. While configuring this FE IP, you can select the availability zones.

Azure internal load balancers can't be moved from one region to another. We must associate the new load balancer to resources in the target region. For this, we can use an Azure Resource Manager template to export the existing configuration and virtual network of an internal load balancer. We can then stage the resource in another region by exporting the load balancer and virtual network to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.
- As part of this process, the virtual network configuration of the internal load balancer must be done first before moving the internal load balancer. Ensure to change the VNET name and target location, rest all parameters such as address prefix and subnets are optional to update.
- Once VNET is deployed in the target region. Export the internal load balancer template, edit the target load balancer name, target VNET resource ID and other parameters. 
- No need to change the Load balancing rules, Inbound NAT rules and health probes, these can be left as it is unless you want to modify/add more rules.
- While deploying Frontend private IP in the subnet, ensure Zonal or Zone redundant option is selected as per requirement.
- Verify all the changes and deploy the template from portal or PowerShell.

Example:  Frontend IP configuration will resemble the following code when Zone redundant 
:::image type="content" source="media/front-end-ip-json-zone-redundant.png" alt-text="Screenshot of JSON code for zone redundant front end ip":::


For detailed guidance on moving Internal Load Balancer across regions, refer to the following articles:


<!-- Find url for above -->

#### External Load Balancer 

Azure external load balancers can't be moved between regions. We need to associate the new load balancer to resources in the target region.
To redeploy load balancer with the source configuration to a new Zone resilient region, the most suitable approach is to use an Azure Resource Manager template to export the existing configuration external load balancer. You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. 
- First create a new Frontend IP configuration with either Zone Redundant or Zonal option in the target region. 
- Export and update the load balancer template with new location, Frontend IP resource ID, and other parameters depending on the target requirements. Ensure to update the load balancer rules, inbound NAT rules with the new Frontend IP.
- Once the template is ready, deploy it using either Azure portal or programmatically. 
If you have another public IP that's being used for outbound NAT for the load balancer being moved, repeat the process to export and deploy the second outbound public IP to the target region.
Reference Link: Move an Azure external load balancer to another Azure region by using the Azure portal | Microsoft Docs

<!-- find url for above -->
<!-- Provide number steps. -->

### Limitations
- Zones can't be changed, updated, or created for the resource after creation.
- Resources can't be updated from zonal to zone-redundant or vice versa after creation.

## Next steps

<!-- Provide useful URLs here in the following format:
> [!div class="nextstepaction"]
> [Link title](my-page.md).
 -->