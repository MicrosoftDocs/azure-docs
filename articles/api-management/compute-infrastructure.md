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

We've minimized impacts of this upgrade on your operation of your API Management instance. Upgrades are mostly managed by the platform. However, you can trigger migration to the `stv2` platform by updating configurations in certain service tiers.

## What are the compute platforms for API Management?

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | [Virtual machine scale sets](../virtual-machine-scale-sets/overview.md) | Developer<sup>1</sup>, Premium<sup>2</sup> |
| `stv1` |  Single-tenant v1 | [Cloud Service (classic)](../cloud-services/cloud-services-choose-me.md) |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  [App service](../app-service/overview.md) |  Consumption |

<sup>1</sup> Instances configured with external or internal virtual network using API version `2021-01-01-preview` or later. 

<sup>2</sup > Instances configured with availability zones, or with external or internal virtual network using API version `2021-01-01-preview` or later.

## How do I know which platform hosts my API Management instance?

Starting with API version `2021-04-01-preview`, the API Management instance exposes a read-only `platformVersion` property that shows this platform information. 

You can find this information using the portal or the API Management REST API.

To find the `platformVersion` property in the portal:

1. Go to your API Management instance.
1. On the **Overview** page, select **JSON view**.
1. In **API version**, select a current version such as `2021-08-01` or later.
1. In the JSON view, scroll down to find the `platformVersion` property.

    :::image type="content" source="media/compute-infrastructure/platformversion property.png" alt-text="platformVersion property in JSON view":::

## How do I migrate to the `stv2` platform? 

The following table summarizes migration options for instances in the different API Management service tiers. See the linked documentation for detailed steps.

> [!NOTE]
> Migration to the `stv2` platform is not reversible.

|Tier  |Migration options  |
|---------|---------|
|Premium     |  1. Enable [zone redundancy](zone-redundancy.md)<br/> -or-<br/> 2. Inject in [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet<br/> -or-<br/> 3. Update existing [VNet configuration](#update-vnet-configuration)    |   
|Developer     | 1. Inject in [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet<br/>-or-<br/> 2. Update existing [VNet configuration](#update-vnet-configuration)   |   
| Standard | Not supported<sup>1</sup> |
| Basic | Not supported<sup>1</sup>  |
| Consumption | Not available |

<sup>1</sup> We recommend a redeployment to the Developer or Premium service tier and migration of configuration with the following mechanisms: [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md), [Migration script for the developer portal](automate-portal-deployments.md), [APIOps with Azure API Management](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops).

## Update VNet configuration

If you have an existing Developer or Premium tier instance that's connected to a virtual network and hosted on the `stv1` platform, migrate to the `stv2` platform by updating the VNet configuration. 

### Prerequisites

* A new or existing virtual network and subnet in the same region and subscription as your API Management instance.

* A new or existing Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.

To update the existing external or internal VNet configuration using the portal:

1. Navigate to your API Management instance.
1. In the left menu, select **Network** > **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the virtual network, subnet, and IP address resources you want to configure, and select **Apply**.
1. Select **Save**.

The virtual network configuration is updated, and the instance is migrated to the `stv2` platform. Confirm migration by checking the [`platformVersion` property](#how-do-i-know-which-platform-hosts-my-api-management-instance).

> [!NOTE]
> * Updating the VNet configuration takes from 15 to 45 minutes to complete.
> * The VIP address(es) of your API Management instance will change.


## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about [zone redundancy](zone-redundancy.md).

