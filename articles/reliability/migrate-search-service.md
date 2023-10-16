---

title: Migrate Azure Cognitive Search to availability zone support 
description: Learn how to migrate Azure Cognitive Search to availability zone support.
author: mattmsft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/01/2022
ms.author: magottei
ms.reviewer: mcarter
ms.custom: references_regions, subject-reliability

---

# Migrate Azure Cognitive Search to availability zone support

This guide describes how to migrate Azure Cognitive Search from non-availability zone support to availability support.

Azure Cognitive Search services can take advantage of availability support [in regions that support availability zones](../search/search-reliability.md#availability-zones). Services with [two or more replicas](../search/search-capacity-planning.md) in these regions created after availability support was enabled can automatically utilize availability zones. Each replica will be placed in a different availability zone within the region. If you have more replicas than availability zones, the replicas will be distributed across availability zones as evenly as possible.

If a search service was created before availability zone support was enabled in its region, the search service must be recreated to take advantage of availability zone support.

## Prerequisites

The following are the current requirements/limitations for enabling availability zone support:

- The search service must be in [a region that supports availability zones](../search/search-reliability.md#availability-zones)
- The search service must be created after availability zone support was enabled in its region.
- The search service must have [at least two replicas](../search/search-reliability.md#high-availability)

## Downtime requirements

Downtime will be dependent on how you decide to carry out the migration. Migration will consist of a side-by-side deployment where you'll create a new search service. Downtime will depend on how you choose to redirect traffic from your old search service to your new availability zone enabled search service. For example, if you're using [Azure Front Door](../frontdoor/front-door-overview.md), downtime will be dependent on the time it takes to update Azure Front Door with your new search service's information. Alternatively, you can route traffic to multiple search services at the same time using [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md).

## Migration guidance: Recreate your search service

### When to recreate your search service

If you created your search service in a region that supports availability zones before this support was enabled, you'll need to recreate the search service.

### How to recreate your search service

1. [Create a new search service](../search/search-create-service-portal.md) in the same region as the old search service. This region should [support availability zones on or after the current date](../search/search-reliability.md#availability-zones). 

   >[!IMPORTANT]
   >The [free and basic tiers do not support availability zones](../search/search-sku-tier.md#feature-availability-by-tier), and so they should not be used.
1. Add at [least two replicas to your new search service](../search/search-capacity-planning.md#add-or-reduce-replicas-and-partitions). Once the search service has at least two replicas, it automatically takes advantage of availability zone support.
1. Migrate your data from your old search service to your new search service by rebuilding of all your search indexes from your old service.

To rebuild all of your search indexes:
   - Rebuild indexes from an external data source if one is available.
1. Redirect traffic from your old search service to your new search service. This may require updates to your application that uses the old search service.
>[!TIP]
>Services such as [Azure Front Door](../frontdoor/front-door-overview.md) and [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) help simplify this process.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to create and deploy ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)

> [!div class="nextstepaction"]
> [Learn about high availability in Azure Cognitive Search](../search/search-reliability.md)
