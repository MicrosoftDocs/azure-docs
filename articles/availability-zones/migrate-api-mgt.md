---
title: Migrate Azure API Management to availability zone support
description: Learn how to migrate your Azure API Management instances to availability zone support.
author: anaharris-ms
ms.service: api-management
ms.topic: how-to
ms.date: 06/01/2022
ms.author: anaharris
ms.custom: references_regions

---

# Migrate Azure API Management to availability zone support

This guide describes how to enable availability zone support for your API Management instance. The API Management service supports [Zone redundancy](../availability-zones/az-overview.md#availability-zones), which provides resiliency and high availability to a service instance in a specific Azure region. With zone redundancy, the gateway and the control plane of your API Management instance (Management API, developer portal, Git configuration) are replicated across datacenters in physically separated zones, making it resilient to a zone failure.

In this article, we'll take you through the different options for availability zone migration.

## Prerequisites

* To configure API Management for zone redundancy, your instance must be in one of the following regions:
    
    * Australia East
    * Brazil South
    * Canada Central
    * Central India
    * Central US
    * East Asia
    * East US
    * East US 2
    * France Central
    * Germany West Central
    * Japan East
    * Korea Central (*)
    * North Europe
    * Norway East (*)
    * South Africa North (*)
    * South Central US
    * Southeast Asia
    * Switzerland North
    * UK South
    * West Europe
    * West US 2
    * West US 3

    > [!IMPORTANT]
    > The regions with * against them have restrictive access in an Azure subscription to enable availability zone support. Please work with your Microsoft sales or customer representative.

* Your instance must be in the Premium tier of API Management. Other SKUs such as Standard aren't supported.
* If you haven't yet created an API Management service instance, see [Create an API Management service instance](../api-management/get-started-create-service-instance.md). Select the Premium service tier.
* If your API Management instance is deployed in a [Azure virtual network (VNet)](../api-management/api-management-using-with-vnet.md), ensure that you set up a virtual network, subnet, and public IP address in any new location where you plan to enable zone redundancy.

> [!NOTE]
> If you've configured [autoscaling](../api-management/api-management-howto-autoscale.md) for your API Management instance in the primary location, you may need to adjust your autoscale settings after enabling zone redundancy. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

## Downtime requirements

There are no downtime requirements for any of the migration options.

## Migration for API Management in a VNet

This option is for deployments that are in an Azure virtual network (VNet) that doesn't support availability zones. The option requires you to create a new subnet and public IP address for your API Management service. The procedure will change the service configuration and migrate your API management instance to one that is running on the new VMSS architecture that supports availability zones.

Once you've completed the required steps, the API Management service will migrate to VMSS. You'll then own the public IP address, which will remain the same for this service as long as required.

### Considerations for migrating API Management in a VNet

The public IP address in the location will change, but it must be pre-created in the same subscription and attached to the API Management instance. Another consideration is that there's some administrative overhead of creating a new subnet and allowing the IP in the firewall.

### How to migrate API Management in a VNet

To migrate to availability zone support by using manual configuration:

1. Create new subnet (can be in same VNET as long as address space is available).

1. Create a public IP address in your subscription (Standard SKU. Create in same subscription as the subnet).

1. Allow-list the public IP address in your system, wherever the current API management public IP address is allow-listed.  

1. In the Azure portal, change the subnet and provide the public IP address to your existing API Management service. Or, you can use an ARM template that uses *apiVersion=2021-01-01-preview* or above. For more information about using an ARM template, see [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-simple-zones).

1. After the service has been moved to new subnet, you can then enable availability zones for your API Management service.

## Migration for API Management not in a VNet

This option is for deployments that aren't on a VNET.

In the Azure portal, you can enable zone redundancy when you add a location to your API Management service, or when you update the configuration of an existing location. When you enable zone redundancy, you're migrating the API Management instance to one that is running on the new VMSS architecture. The legacy systems will then give up hosting the workload on its own infrastructure and move it to the new ARM based infrastructure that supports availability zones. This change is permanent. Even if the resource is changed to Standard tier, the service will remain on VMSS and ARM.

### Considerations for migrating API Management not in a VNet

The public IP address in the location changes when you enable, add, or remove availability zones. When updating availability zones in a region with network settings, you must configure a different public IP address resource than the one you set up previously.  You'll also need to allow the new IP address on your firewall or other devices, as needed.

> [!NOTE]
> It can take 15 to 45 minutes to apply the change to your API Management instance.

### How to migrate API Management not in a VNet

To enable zone redundancy in the Azure portal:

1. In the Azure portal, navigate to your API Management service and select **Locations** in the menu.
1. Select an existing location, or select **+ Add** in the top bar. The location must [support availability zones](#prerequisites).
1. Select the number of scale **[Units](../api-management/upgrade-and-scale.md)** in the location.
1. In **Availability zones**, select one or more zones. The number of units selected must distribute evenly across the availability zones. For example, if you selected three units, select three zones so that each zone hosts one unit.
1. If you deploy your API Management instance in a [virtual network](../api-management/api-management-using-with-vnet.md), select an existing virtual network, subnet, and public IP address that are available in the location. For an existing location, the virtual network and subnet must be configured from the Virtual Network blade.
1. Select **Apply** and then select **Save**.

:::image type="content" source="../api-management/media/zone-redundancy/add-location-zones.png" alt-text="Enable zone redundancy":::


## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [deploying an Azure API Management service instance to multiple Azure regions](../api-management/api-management-howto-deploy-multi-region.md).

> [!div class="nextstepaction"]
> [building for reliability](/azure/architecture/framework/resiliency/app-design) in Azure.

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)