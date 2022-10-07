---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 03/16/2022
ms.author: danlep
ms.custom: 
---
# Compute platform for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about its underlying resources.

To enhance service capabilities, we're upgrading the API Management compute platform version - the Azure compute resources that host the service - for instances in several [service tiers](api-management-features.md). This article gives you context about the upgrade and the major versions of API Management's compute platform: `stv1` and `stv2`.

We've minimized impacts of this upgrade on your operation of your API Management instance. Upgrades are managed by the platform, and new instances created in service tiers other than the Consumption tier are mostly hosted on the `stv2` platform. However, for existing instances hosted on the `stv1` platform, you have options to trigger migration to the `stv2` platform.

## What are the compute platforms for API Management?

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium<sup>1</sup> |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

<sup>1</sup> Newly created instances in these tiers, created using the Azure portal or specifying API version 2021-01-01-preview or later. Includes some existing instances in Developer and Premium tiers configured with virtual networks or availability zones.

> [!NOTE]
> Currently, the `stv2` platform isn't available in the US Government cloud or in the following Azure regions: China East, China East 2, China North, China North 2.

## How do I know which platform hosts my API Management instance?

Starting with API version `2021-04-01-preview`, the API Management instance exposes a read-only `platformVersion` property that shows this platform information. 

You can find this information using the portal or the API Management [REST API](/rest/api/apimanagement/current-ga/api-management-service/get).

To find the `platformVersion` property in the portal:

1. Go to your API Management instance.
1. On the **Overview** page, select **JSON view**.
1. In **API version**, select a current version such as `2021-08-01` or later.
1. In the JSON view, scroll down to find the `platformVersion` property.

    :::image type="content" source="media/compute-infrastructure/platformversion-property.png" alt-text="platformVersion property in JSON view":::

## How do I migrate to the `stv2` platform? 

The following table summarizes migration options for instances in the different API Management service tiers that are currently hosted on the `stv1` platform. See the linked documentation for detailed steps.

> [!NOTE]
> Check the [`platformVersion` property](#how-do-i-know-which-platform-hosts-my-api-management-instance) before starting migration, and after your configuration change.

|Tier  |Migration options  |
|---------|---------|
|Premium     |  1. Enable [zone redundancy](../availability-zones/migrate-api-mgt.md)<br/> -or-<br/> 2. Create new [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet connection<sup>1</sup><br/> -or-<br/> 3. Update existing [VNet configuration](#update-vnet-configuration)    |   
|Developer     | 1. Create new [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet connection<sup>1</sup><br/>-or-<br/> 2. Update existing [VNet configuration](#update-vnet-configuration)   |   
| Standard | 1. [Change your service tier](upgrade-and-scale.md#change-your-api-management-service-tier) (downgrade to Developer or upgrade to Premium). Follow migration options in new tier.<br/>-or-<br/>2. Deploy new instance in existing tier and migrate configurations<sup>2</sup> |
| Basic | 1. [Change your service tier](upgrade-and-scale.md#change-your-api-management-service-tier) (downgrade to Developer or upgrade to Premium). Follow migration options in new tier<br/>-or-<br/>2. Deploy new instance in existing tier and migrate configurations<sup>2</sup> |
| Consumption | Not applicable |

<sup>1</sup> Use Azure portal or specify API version 2021-01-01-preview or later.
 
<sup>2</sup> Migrate configurations with the following mechanisms: [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md), [Migration script for the developer portal](automate-portal-deployments.md), [APIOps with Azure API Management](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops).

## Update VNet configuration

If you have an existing Developer or Premium tier instance that's connected to a virtual network and hosted on the `stv1` platform, trigger migration to the `stv2` platform by updating the VNet configuration. 

### Prerequisites

* A new or existing virtual network and subnet in the same region and subscription as your API Management instance. The subnet must be different from the one currently used for the instance hosted on the `stv1` platform, and a network security group must be attached.

* A new or existing Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.

To update the existing external or internal VNet configuration using the portal:

1. Navigate to your API Management instance.
1. In the left menu, select **Network** > **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the virtual network, subnet, and IP address resources you want to configure, and select **Apply**.
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

The virtual network configuration is updated, and the instance is migrated to the `stv2` platform. Confirm migration by checking the [`platformVersion` property](#how-do-i-know-which-platform-hosts-my-api-management-instance).

> [!NOTE]
> * Updating the VNet configuration takes from 15 to 45 minutes to complete.
> * The VIP address(es) of your API Management instance will change.


## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about enabling [availability zones](../availability-zones/migrate-api-mgt.md).

