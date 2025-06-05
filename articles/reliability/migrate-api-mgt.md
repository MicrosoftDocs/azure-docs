---
title: Migrate Azure API Management to availability zones
description: Learn how to migrate your Azure API Management instances to availability zones for zone redundancy.
author: shaunjacob 
ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/09/2025
ms.author: anaharris
ms.custom: subject-reliability

---

# Migrate Azure API Management to availability zone support

The Azure API Management service supports [availability zones](../reliability/availability-zones-overview.md) in both zonal and zone-redundant configurations:

* **Zonal** - the API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone you select within an Azure region.

* **Zone-redundant** - the gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are replicated across two or more physically separated zones within an Azure region. Zone redundancy provides resiliency and high availability to a service instance.

This article describes three scenarios for migrating an API Management instance to availability zones. For more information about configuring API Management for high availability, see [Ensure API Management availability and reliability](../api-management/high-availability.md).

[!INCLUDE [api-management-service-update-behavior](../../includes/api-management-service-update-behavior.md)]

## Prerequisites

* To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](regions-list.md).

* If you don't have an API Management instance, create one by following the [Create a new Azure API Management instance by using the Azure portal](../api-management/get-started-create-service-instance.md) quickstart. Select the **Premium** service tier.

* If you have an existing API Management instance, make sure that it's in the **Premium** tier. If it isn't, [upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).


## Downtime requirements

There are no gateway downtime requirements for any of the migration options.

## Considerations

* When you're migrating an API Management instance that's deployed in an external or internal virtual network to availability zones, you can optionally specify a new public IP address resource. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md).

* Migrating to availability zones or changing the configuration of availability zones triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses).

* By default, API Management sets availability zones automatically to distribute your scale [units](../api-management/upgrade-and-scale.md) and adjust to changes in zone availability in the region. If you select specific zones, make sure the scale units distribute evenly across the zones. For example, if you select two specific zones, you can configure two units, four units, or another multiple of two units. 

    >[!IMPORTANT] 
    >If you select specific zones, your resources will be pinned to those zones. Should all your resources in the selected zones become unavailable, your API Management instance will be unavailable. 

    [!INCLUDE [api-management-az-notes](../../includes/api-management-az-notes.md)]

* If you configured autoscaling for your API Management instance in the primary location, you might need to adjust your autoscale settings after selecting availability zones. If you select specific zones, the number of API Management units in autoscale rules and limits must be a multiple of the number of zones.  

## Existing gateway location not injected in a virtual network 

To migrate an existing location of your API Management instance to availability zones when the instance is not injected in a virtual network:

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be migrated. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit. 

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of API Management instance that's not injected in a virtual network." source ="media/migrate-api-mgt/option-one-not-injected-in-vnet.png":::

## Existing gateway location injected in a virtual network

To migrate an existing location of your API Management instance to availability zones when the instance is currently injected in a virtual network:

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be migrated. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit.

1. In the **Public IP Address** box, optionally select a public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections to migrate existing location of API Management instance that's injected in a virtual network." source ="media/migrate-api-mgt/option-three-stv2-injected-in-vnet.png":::

## New gateway location

To add a new location to your API Management instance and enable availability zones in that location:

1. If your API Management instance is deployed in a virtual network in the primary location, set up a [virtual network](../api-management/api-management-using-with-vnet.md), subnet, and optional public IP address in any new location where you plan to enable availability zones.

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. Select **+ Add** to add a new location. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit.

1. If your API Management instance is deployed in a virtual network, use the boxes under **Network** to select the virtual network, subnet, and optional public IP address that are available in the location.

1. Select **Add**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for adding a new location for an API Management instance with or without a virtual network." source ="media/migrate-api-mgt/option-four-add-new-location.png":::

## Related content

* [Deploy an Azure API Management instance to multiple Azure regions](../api-management/api-management-howto-deploy-multi-region.md)
* [Design review checklist for reliability](/azure/architecture/framework/resiliency/app-design)
- [Azure services with availability zones](availability-zones-service-support.md)
- [Azure regions with availability zones](regions-list.md)
