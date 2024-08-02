---
title: Migrate Azure API Management to availability zones
description: Learn how to migrate your Azure API Management instances to availability zones for zone redundancy.
author: shaunjacob 
ms.service: api-management
ms.topic: how-to
ms.date: 07/07/2022
ms.author: anaharris
ms.custom: references_regions, subject-reliability

---

# Migrate Azure API Management to availability zones

The Azure API Management service supports [zone redundancy](../reliability/availability-zones-overview.md), which provides resiliency and high availability to a service instance in a specific Azure region. With zone redundancy, the gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are replicated across datacenters in physically separated zones, so they're resilient to a zone failure.

This article describes four options for migrating an API Management instance to availability zones. For background about configuring API Management for high availability, see [Ensure API Management availability and reliability](../api-management/high-availability.md).

## Prerequisites

* To configure API Management for zone redundancy, your instance must be in one of the [Azure regions that support availability zones](availability-zones-service-support.md#azure-regions-with-availability-zone-support).

* If you don't have an API Management instance, create one by following the [Create a new Azure API Management instance by using the Azure portal](../api-management/get-started-create-service-instance.md) quickstart. Select the Premium service tier.

* If you have an existing API Management instance, make sure that it's in the Premium tier. If it isn't, [upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

* If your API Management instance is deployed (injected) in an [Azure virtual network](../api-management/api-management-using-with-vnet.md), check the version of the [compute platform](../api-management/compute-infrastructure.md) (`stv1` or `stv2`) that hosts the service.

## Downtime requirements

There are no downtime requirements for any of the migration options.

## Considerations

* Changes can take 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

* When you're migrating an API Management instance that's deployed in an external or internal virtual network to availability zones, you must specify a new public IP address resource. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md).

* Migrating to availability zones or changing the configuration of availability zones triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-the-ip-addresses).

* When you're enabling availability zones in a region, you configure API Management scale [units](../api-management/upgrade-and-scale.md) that you can distribute evenly across the zones. For example, if you configure two zones, you can configure two units, four units, or another multiple of two units.

  Adding units incurs additional costs. For details, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

* If you configured autoscaling for your API Management instance in the primary location, you might need to adjust your autoscale settings after enabling zone redundancy. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

## Existing gateway location not injected in a virtual network

To migrate an existing location of your API Management instance to availability zones when the instance is not injected in a virtual network:

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be migrated. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of API Management instance that's not injected in a virtual network." source ="media/migrate-api-mgt/option-one-not-injected-in-vnet.png":::

## Existing gateway location (stv1 platform) injected in a virtual network

To migrate an existing location of your API Management instance to availability zones when the instance is currently injected in a virtual network and is currently hosted on the `stv1` platform, use the following steps. Migrating to availability zones also migrates the instance to the `stv2` platform.

1. Create a new subnet and public IP address in the location to migrate to availability zones. Detailed requirements are in the [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be migrated. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. In the respective boxes under **Network**, select the new subnet and new public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of an API Management instance that's injected in a virtual network." source ="media/migrate-api-mgt/option-two-injected-in-vnet.png":::

## Existing gateway location (stv2 platform) injected in a virtual network

To migrate an existing location of your API Management instance to availability zones when the instance is currently injected in a virtual network and is already hosted on the `stv2` platform:

1. Create a new subnet and public IP address in the location to migrate to availability zones. Detailed requirements are in the [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be migrated. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. In the **Public IP Address** box, select the new public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of an API Management instance (stv2 platform) that's injected in a virtual network." source ="media/migrate-api-mgt/option-three-stv2-injected-in-vnet.png":::

## New gateway location

To add a new location to your API Management instance and enable availability zones in that location:

1. If your API Management instance is deployed in a virtual network in the primary location, set up a [virtual network](../api-management/api-management-using-with-vnet.md?tabs=stv2), subnet, and public IP address in any new location where you plan to enable zone redundancy.

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. Select **+ Add** to add a new location. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. If your API Management instance is deployed in a virtual network, use the boxes under **Network** to select the virtual network, subnet, and public IP address that are available in the location.

1. Select **Add**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for adding a new location for an API Management instance with or without a virtual network." source ="media/migrate-api-mgt/option-four-add-new-location.png":::

## Related content

* [Deploy an Azure API Management instance to multiple Azure regions](../api-management/api-management-howto-deploy-multi-region.md)
* [Design review checklist for reliability](/azure/architecture/framework/resiliency/app-design)
* [Azure services and regions that support availability zones](availability-zones-service-support.md)
