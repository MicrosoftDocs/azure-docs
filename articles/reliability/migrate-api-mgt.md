---
title: Migrate Azure API Management to availability zone support
description: Learn how to migrate your Azure API Management instances to availability zone support.
author: shaunjacob 
ms.service: api-management
ms.topic: how-to
ms.date: 07/07/2022
ms.author: anaharris
ms.custom: references_regions, subject-reliability

---

# Migrate Azure API Management to availability zone support

This guide describes how to enable availability zone support for your API Management instance. The API Management service supports [Zone redundancy](../reliability/availability-zones-overview.md), which provides resiliency and high availability to a service instance in a specific Azure region. With zone redundancy, the gateway and the control plane of your API Management instance (Management API, developer portal, Git configuration) are replicated across datacenters in physically separated zones, making it resilient to a zone failure.

In this article, we'll take you through the different options for availability zone migration. For background about configuring API Management for high availability, see [Ensure API Management availability and reliability](../api-management/high-availability.md).

## Prerequisites

* To configure API Management for zone redundancy, your instance must be in one of the Azure regions with [availability zone support](availability-zones-service-support.md#azure-regions-with-availability-zone-support).

* If you haven't yet created an API Management service instance, see [Create an API Management service instance](../api-management/get-started-create-service-instance.md). Select the Premium service tier.

* API Management service must be in the Premium tier. If it isn't, you can [upgrade](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier) to the Premium tier.

* If your API Management instance is deployed (injected) in a [Azure virtual network (VNet)](../api-management/api-management-using-with-vnet.md), check the version of the [compute platform](../api-management/compute-infrastructure.md) (stv1 or stv2) that hosts the service.

## Downtime requirements

There are no downtime requirements for any of the migration options.

## Considerations

* Changes can take from 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

* When migrating an API Management deployed in an external or internal virtual network to availability zones, a new public IP address resource must be specified. In an internal VNet, the public IP address is used only for management operations, not for API requests. Learn more about [IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md). 

* Migrating to availability zones or changing the availability zone configuration will trigger a public [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-the-ip-addresses).

* When enabling availability zones in a region, you configure a number of API Management scale [units](../api-management/upgrade-and-scale.md) that can be distributed evenly across the zones. For example, if you configure 2 zones, you could configure 2 units, 4 units, or another multiple of 2 units. Adding units incurs additional costs. For details, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

* If you've configured autoscaling for your API Management instance in the primary location, you might need to adjust your autoscale settings after enabling zone redundancy. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

## Option 1: Migrate existing location of API Management instance, not injected in VNet

Use this option to migrate an existing location of your API Management instance to availability zones when it’s not injected (deployed) in a virtual network.

1.	In the Azure portal, navigate to your API Management service.

1.	Select **Locations** in the menu, and then select the location to be migrated. The location must [support availability zones](#prerequisites).

1.	Select the number of scale [Units](../api-management/upgrade-and-scale.md) desired in the location.

1.	In **Availability zones**, select one or more zones. The number of units selected must be distributed evenly across the availability zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.

1.	Select **Apply**, and then select **Save**.

     :::image type="content" alt-text="Screenshot of how to migrate existing location of API Management instance not injected in VNet." source ="media/migrate-api-mgt/option-one-not-injected-in-vnet.png":::
    


## Option 2: Migrate existing location of API Management instance (stv1 platform), injected in  VNet

Use this option to migrate an existing location of your API Management instance to availability zones when it is currently injected (deployed) in a virtual network. The following steps are needed when the API Management instance is currently hosted on the stv1 platform. Migrating to availability zones will also migrate the instance to the stv2 platform.

1.	Create a new subnet and public IP address in location to migrate to availability zones. Detailed requirements are in [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1.	In the Azure portal, navigate to your API Management service.

1.	Select **Locations** in the menu, and then select the location to be migrated. The location must [support availability zones](#prerequisites).

1.	Select the number of scale [Units](../api-management/upgrade-and-scale.md) desired in the location.

1.	In **Availability zones**, select one or more zones. The number of units selected must be distributed evenly across the availability zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.

1.	Select the new subnet and new public IP address in the location. 

1.	Select **Apply**, and then select **Save**.


     :::image type="content" alt-text="Screenshot of how to migrate existing location of API Management instance injected in VNet." source ="media/migrate-api-mgt/option-two-injected-in-vnet.png":::

## Option 3: Migrate existing location of API Management instance (stv2 platform), injected in VNet

Use this option to migrate an existing location of your API Management instance to availability zones when it is currently injected (deployed) in a virtual network. The following steps are used when the API Management instance is already hosted on the stv2 platform.

1.	Create a new subnet and public IP address in location to migrate to availability zones. Detailed requirements are in [virtual networking guidance](../api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites).

1.	In the Azure portal, navigate to your API Management service.

1.	Select **Locations** in the menu, and then select the location to be migrated. The location must [support availability zones](#prerequisites).

1.	Select the number of scale [Units](../api-management/upgrade-and-scale.md) desired in the location.

1.	In **Availability zones**, select one or more zones. The number of units selected must be distributed evenly across the availability zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.

1.	Select the new public IP address in the location. 

1.	Select **Apply**, and then select **Save**.

     :::image type="content" alt-text="Screenshot of how to migrate existing location of API Management instance (stv2 platform) injected in VNet." source ="media/migrate-api-mgt/option-three-stv2-injected-in-vnet.png":::

## Option 4. Add new location for API Management instance (with or without VNet) with availability zones

Use this option to add a new location to your API Management instance and enable availability zones in that location. 

If your API Management instance is deployed in a virtual network in the primary location, ensure that you set up a [virtual network](../api-management/api-management-using-with-vnet.md?tabs=stv2), subnet, and public IP address in any new location where you plan to enable zone redundancy.

1.	In the Azure portal, navigate to your API Management service.

1.	Select **+ Add** in the top bar to add a new location. The location must [support availability zones](#prerequisites).

1.	Select the number of scale [Units](../api-management/upgrade-and-scale.md) desired in the location.

1.	In **Availability zones**, select one or more zones. The number of units selected must be distributed evenly across the availability zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.

1. If your API Management instance is deployed in a [virtual network](../api-management/api-management-using-with-vnet.md?tabs=stv2), select the virtual network, subnet, and public IP address that are available in the location. 

1. Select **Add**, and then select **Save**.

     :::image type="content" alt-text="Screenshot of how to add new location for API Management instance with or without VNet." source ="media/migrate-api-mgt/option-four-add-new-location.png":::

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [Deploying an Azure API Management service instance to multiple Azure regions](../api-management/api-management-howto-deploy-multi-region.md).

> [!div class="nextstepaction"]
> [Building for reliability](/azure/architecture/framework/resiliency/app-design) in Azure.

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)

