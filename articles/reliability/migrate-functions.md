---

title: Migrate Azure Functions to availability zone support
description: Learn how to migrate Azure Functions to availability zone support.
author: nzthiago
ms.service: azure-functions
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: thalme
ms.custom: references_regions, subject-reliability

---

# Migrate your function app to a zone-redundant plan

Availability zones support for Azure Functions is available on [Premium (Elastic Premium)](../azure-functions/functions-premium-plan.md) and [Dedicated (App Service)](../azure-functions/dedicated-plan.md) plans. A zone-redundant function app plan automatically balances its instances between availability zones for higher availability. This article describes how to migrate to the public multi-tenant Premium plan with availability zone support. For migration to zone redundancy on Dedicated plans, refer [here](migrate-app-service.md).

## Downtime requirements

Downtime will be dependent on how you decide to carry out the migration. Since you can't convert pre-existing Premium plans to use availability zones, migration will consist of a side-by-side deployment where you'll create new Premium plans. Downtime will depend on how you choose to redirect traffic from your old to your new availability zone enabled function app. For example, for HTTP based functions if you're using an [Application Gateway](../app-service/networking/app-gateway-with-service-endpoints.md), a [custom domain](../app-service/app-service-web-tutorial-custom-domain.md), or [Azure Front Door](../frontdoor/front-door-overview.md), downtime will be dependent on the time it takes to update those respective services with your new app's information. Alternatively, you can route traffic to multiple apps at the same time using a service such as [Azure Traffic Manager](../app-service/web-sites-traffic-manager.md) and only fully cutover to your new availability zone enabled apps when everything is deployed and fully tested. You can also [write defensive functions](../azure-functions/performance-reliability.md#write-defensive-functions) to ensure messages are not lost during the migration for non-HTTP functions.

## Migration guidance: Redeployment

If you want your function app to use availability zones, redeploy your app into a newly created availability zone enabled Premium function app plan.

## How to redeploy

The following steps describe how to enable availability zones.

1. If you're already using the Premium SKU and are in one of the [supported regions](../azure-functions/azure-functions-az-redundancy.md#regional-availability), you can move on to the next step. Otherwise, you should create a new resource group in one of the supported regions.
1. Create a Premium plan in one of the supported regions and the resource group. Ensure the [new Premium plan has zone redundancy enabled](./reliability-functions.md#create-a-zone-redundant-premium-plan-and-function-app).
1. Create and deploy your function apps into the new Premium plan using your desired [deployment method](../azure-functions/functions-deployment-technologies.md).
1. After testing and enabling the new function apps, you can optionally disable or delete your previous non-availability zone apps.
 
## Next steps

> [!div class="nextstepaction"]
> [Learn about the Azure Functions Premium plan](../azure-functions/functions-premium-plan.md)

> [!div class="nextstepaction"]
> [Learn about Azure Functions support for availability zone redundancy and disaster recovery](./reliability-functions.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)


