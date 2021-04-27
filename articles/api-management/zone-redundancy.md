---
title: Availability zone support for Azure API Management
description: Learn how to improve the resiliency of your Azure API Management service instance in a region by enabling zone redundancy.
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 04/13/2021
ms.author: apimpm
ms.custom: references_regions

---

# Availability zone support for Azure API Management 

This article shows how to enable zone redundancy for your API Management instance by using the Azure portal. [Zone redundancy](../availability-zones/az-overview.md#availability-zones) provides resiliency and high availability to a service instance in a specific Azure region (location). With zone redundancy, the gateway and the control plane of your API Management instance (Management API, developer portal, Git configuration) are replicated across datacenters in physically separated zones, making it resilient to a zone failure. 

API Management also supports [multi-region deployments](api-management-howto-deploy-multi-region.md), which helps reduce request latency perceived by geographically distributed API consumers and improves availability of the gateway component if one region goes offline. The combination of availability zones for redundancy within a region, and multi-region deployments to improve the gateway availability if there is a regional outage, helps enhance both the reliability and performance of your API Management instance.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

## Supported regions

Configuring API Management for zone redundancy is currently supported in the following Azure regions.

* Australia East
* Brazil South
* Canada Central
* Central India
* East US
* East US 2
* France Central
* Japan East
* South Central US
* Southeast Asia
* UK South
* West US 2
* West US 3

## Prerequisites

* If you have not yet created an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md). Select the Premium service tier.
* If your API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), ensure that you set up a virtual network, subnet, and public IP address in any new location where you plan to enable zone redundancy.

## Enable zone redundancy - portal

In the portal, optionally enable zone redundancy when you add a location to your API Management service, or update the configuration of an existing location.

1. In the Azure portal, navigate to your API Management service and select **Locations** in the menu.
1. Select an existing location, or select **+ Add** in the top bar. The location must [support availability zones](#supported-regions).
1. Select the number of scale **[Units](upgrade-and-scale.md)** in the location.
1. In **Availability zones**, select one or more zones. The number of units selected must distribute evenly across the availability zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.
1. If the API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), configure virtual network settings in the location. Select an existing virtual network, subnet, and public IP address that are available in the location.
1. Select **Apply** and then select **Save**.

:::image type="content" source="media/zone-redundancy/add-location-zones.png" alt-text="Enable zone redundancy":::

> [!IMPORTANT]
> The public IP address in the location changes when you enable, add, or remove availability zones. When updating availability zones in a region with network settings, you must configure a different public IP address resource than the one you set up previously.

> [!NOTE]
> It can take 15 to 45 minutes to apply the change to your API Management instance.

## Next steps

* Learn more about [deploying an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md).
* You can also enable zone redundancy using an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-api-management-simple-zones).
* Learn more about [Azure services that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](/azure/architecture/framework/resiliency/overview) in Azure.