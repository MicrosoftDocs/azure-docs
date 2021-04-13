---
title: Availability zone support for Azure API Management
description: Learn how to deploy your Azure API Management service instance so that it is zone redundant.
author: dlepow
ms.topic: how-to
ms.date: 04/02/2021
ms.author: apimpm

---

# Availability zone support for Azure API Management 

This article shows how to enable zone redundancy for your API Management instance using the Azure portal. [Zone redundancy](../availability-zones/az-overview.md#availability-zones) provides resiliency and high availability to a service instance in a specific region. Configuring API Management for zone redundancy is an option in all [Azure regions with availability zones](../availability-zones/az-region#azure-regions-with-availability-zones).

You can also enable zone redundancy using an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-api-management-simple-zones).

API Management also supports [multi-region deployments](api-management-howto-deploy-multi-region.md), which helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline. The combination of availability zones for redundancy within a region, and multi-region deployments to improve service availability in case of a regional outage, helps enhance both the reliability and performance of your API Managment instance.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

## Prerequisites

* If you have not yet created an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md).
* If your API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), ensure that you have a virtual network, subnet, and public IP address configured in the region and subscription used for the API Management instance.

## Configure zone redundancy - portal

In the portal, optionally configure zone redundancy when you add a location to your API Management service, or update the configuration of an existing location.

1. In the Azure portal, navigate to your API Management service and select **Locations** in the menu.
1. Select an existing location, or select **+ Add** in the top bar. The location must [support availability zones](../availability-zones/az-region.md).
1. Select the number of [units](upgrade-and-scale.md) in the location.
1. In **Availability zones**, select one or more zones. The number of units selected must distribute evenly across the availability zones. For example, if you selected 2 units or 4 units, you could select 2 zones.
1. If the API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), configure virtual network settings. Select an existing virtual network, subnet, and public IP address that are available in the location.
1. Select **Apply**.

:::image type="content" source="media/zone-redundancy/add-location-zones.png" alt-text="Enable zone redundancy":::

> [!IMPORTANT]
> If you update the availability zone configuration in a region with network settings, you must provide a different public IP address than the one you set up previously.

> [!NOTE]
> It can take 15 to 45 minutes to apply the change to your API Management instance.

## Next steps

* [How to deploy an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md)
* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](/azure/architecture/framework/resiliency/overview) in Azure.
* 
 
