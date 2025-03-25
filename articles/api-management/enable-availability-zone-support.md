---
title: Enable availability support on Azure API Management instances
description: Learn how to enable availability zone support on your Azure API Management instances.
author: shaunjacob 
ms.service: azure-api-management
ms.topic: how-to
ms.date: 11/13/2024
ms.author: anaharris
ms.custom: references_regions, subject-reliability
#Customer intent: As an engineer responsible for business continuity, I want to learn how to enable zone redundancy for my Azure API Management instances. 
---

# Enable availability zone support on Azure API Management instances

The Azure API Management service supports [availability zones](../reliability/availability-zones-overview.md) in both zonal and zone-redundant configurations:

* **Zonal** - the API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone you select within an Azure region.

    > [!NOTE] 
    > Pinning to a single zone doesn’t increase resiliency. To improve resiliency, you need to explicitly deploy resources into multiple zones (zone-redundancy). 

* **Zone-redundant** - the gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are replicated across two or more physically separated zones within an Azure region. Zone redundancy provides resiliency and high availability to a service instance.

This article describes four scenarios for migrating an API Management instance to availability zones. For more information about configuring API Management for high availability, see [Ensure API Management availability and reliability](../api-management/high-availability.md).

## Prerequisites

* To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](regions-list.md).

* If you don't have an API Management instance, create one by following the [Create a new Azure API Management instance by using the Azure portal](../api-management/get-started-create-service-instance.md) quickstart. Select the Premium service tier.

* If you have an existing API Management instance, make sure that it's in the Premium tier. If it isn't, [upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

* If your API Management instance is deployed (injected) in an [Azure virtual network](../api-management/api-management-using-with-vnet.md), check the version of the [compute platform](../api-management/compute-infrastructure.md) (`stv1` or `stv2`) that hosts the service.

## Downtime requirements

There are no downtime requirements for any of the configuration options.

## Existing gateway location not injected in a virtual network

To enable zone-redundancy on an existing location of an API Management instance that's not injected in a virtual network:

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](/azure/reliability/reliability-api-management).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be enabled. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of API Management instance that's not injected in a virtual network." source ="media/enable-zone-redundancy/option-one-not-injected-in-vnet.png":::

## Existing gateway location (stv1 platform) injected in a virtual network

To enable zone redundancy on an existing location of your API Management instance that's currently injected in a virtual network and is currently hosted on the `stv1` platform, use the following steps:

>[!NOTE] 
Enabling availability zones automatically enables the instance to the `stv2` compute platform.

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](/azure/reliability/reliability-api-management).

1. Create a new subnet and optional public IP address in the location to enable to availability zones. Detailed requirements are in the [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be enabled. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. In the respective boxes under **Network**, select the new subnet and optional public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of an API Management instance that's injected in a virtual network." source ="media/enable-zone-redundancy/option-two-injected-in-vnet.png":::

## Existing gateway location (stv2 platform) injected in a virtual network

To enable zone redundancy for an existing location of your API Management instance thats currently injected in a virtual network and is already hosted on the `stv2` platform:

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be enabled. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. In the **Public IP Address** box, optionally select a public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections to enable existing location of API Management instance (stv2 platform) that's injected in a virtual network." source ="media/enable-zone-redundancy/option-three-stv2-injected-in-vnet.png":::

## New gateway location

To add a new location to your API Management instance and enable zone redundancy in that location:

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](/azure/reliability/reliability-api-management).

1. If your API Management instance is deployed in a virtual network in the primary location, set up a [virtual network](../api-management/api-management-using-with-vnet.md?tabs=stv2), subnet, and optional public IP address in any new location where you plan to enable availability zones.

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. Select **+ Add** to add a new location. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, select one or more zones. The number of units that you selected must be distributed evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.

1. If your API Management instance is deployed in a virtual network, use the boxes under **Network** to select the virtual network, subnet, and optional public IP address that are available in the location.

1. Select **Add**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for adding a new location for an API Management instance with or without a virtual network." source ="media/enable-zone-redundancy/option-four-add-new-location.png":::

## Related content

* [Reliability in API Management](/azure/reliability/reliability-api-management)
* [Design review checklist for reliability](/azure/architecture/framework/resiliency/app-design)
- [Azure services with availability zones](availability-zones-service-support.md)
- [Azure regions with availability zones](regions-list.md)
