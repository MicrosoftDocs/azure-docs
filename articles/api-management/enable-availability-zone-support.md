---
title: Enable availability support on Azure API Management instances
description: Learn how to enable availability zone support on your Azure API Management instances.
author: dlepow 
ms.service: azure-api-management
ms.topic: how-to
ms.date: 06/26/2025
ms.author: danlep
ms.custom: references_regions, subject-reliability
#Customer intent: As an engineer responsible for business continuity, I want to learn how to enable zone redundancy for my Azure API Management instances. 
---

# Enable availability zone support on Azure API Management instances

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

This how-to guide shows you how to enable and configure availability zones on an API Management instance. 

For more detailed information about reliability features of API Management, such as availability zones, and multi-region deployments, see [Reliability in Azure API Management](../reliability/reliability-api-management.md).

[!INCLUDE [api-management-service-update-behavior](../../includes/api-management-service-update-behavior.md)]

## Prerequisites

* To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](../reliability/regions-list.md).

* If you don't have an API Management instance, create one by following the [Create a new Azure API Management instance by using the Azure portal](../api-management/get-started-create-service-instance.md) quickstart. Select the **Premium** service tier.

* If you have an existing API Management instance, make sure that it's in the **Premium (classic)** tier. If it isn't, [upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

## Default availability zone support

When you create a new API Management instance in the **Premium** tier in a region that supports availability zones, or you [deploy API Management to a new region](api-management-howto-deploy-multi-region.md), availability zones are enabled automatically **by default**. With automatic availability zone support, the Azure API Management platform makes a best-effort attempt to spread your instance's units among the region's availability zones. There's no way to determine which availability zones your units are placed into.

> [!IMPORTANT]
> To ensure the reliability of your API Management gateway, we recommend that you deploy a minimum of three units in each region where you deploy your API Management instances. For details, see [Reliability in API Management](../reliability/reliability-api-management.md).

## Manually configure availability zone support for an existing gateway location

While automatic availability zone configuration is recommended, you can manually configure or update availability zones for an existing location of your API Management instance. There are two configuration options for zone redundancy on an existing location of your API Management instance, depending on whether the instance is injected in a virtual network.

### Gateway not injected in a virtual network

To manually enable zone-redundancy on an existing location of an API Management instance that's not injected in a virtual network:

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](../reliability/reliability-api-management.md).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be enabled. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit. 

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for migrating an existing location of API Management instance that's not injected in a virtual network." source ="media/enable-availability-zone-support/option-one-not-injected-in-vnet.png":::

### Gateway injected in a virtual network

To manually enable zone-redundancy on an existing location of an API Management instance that's injected in a virtual network:

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](../reliability/reliability-api-management.md).

1. Create a new subnet and public IP address in the location to enable to availability zones. Detailed requirements are in the [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. In the **Location** box, select the location to be enabled. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

1. In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit.

1. In the **Public IP Address** box, select a public IP address in the location.

1. Select **Apply**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections to enable existing location of API Management instance (stv2 platform) that's injected in a virtual network." source ="media/enable-zone-redundancy/option-three-stv2-injected-in-vnet.png":::

## New gateway location

To add a new location to your API Management instance and enable zone redundancy in that location:

1. Thoroughly understand all requirements and considerations for enabling zone redundancy in API Management by reading [Reliability in API Management](../reliability/reliability-api-management.md).

1. If your API Management instance is deployed in a virtual network in the primary location, set up a [virtual network](../api-management/api-management-using-with-vnet.md), subnet, and optional public IP address in any new location where you plan to enable availability zones.

1. In the Azure portal, go to your API Management instance.

1. On the **Deployment + infrastructure** menu, select **Locations**.

1. Select **+ Add** to add a new location. The location must support availability zones, as mentioned earlier in the [prerequisites](#prerequisites).

1. In the **Units** box, select the number of scale [units](../api-management/upgrade-and-scale.md) that you want in the location.

In the **Availability zones** box, leave the **Automatic** setting (recommended), or optionally select one or more zones. If you select specific zones, the number of units that you selected must distribute evenly across the availability zones. For example, if you selected three units, you would select three zones so that each zone hosts one unit.

1. If your API Management instance is deployed in a virtual network, use the boxes under **Network** to select the virtual network, subnet, and public IP address that are available in the location.

1. Select **Add**, and then select **Save**.

:::image type="content" alt-text="Screenshot that shows selections for adding a new location for an API Management instance with or without a virtual network." source ="media/enable-zone-redundancy/option-four-add-new-location.png":::

## Related content

- [Reliability in API Management](../reliability/reliability-api-management.md)
- [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management)
- [Design review checklist for reliability](/azure/architecture/framework/resiliency/app-design)
- [Azure services with availability zones](../reliability/availability-zones-service-support.md)
- [Azure regions with availability zones](../reliability/regions-list.md)
