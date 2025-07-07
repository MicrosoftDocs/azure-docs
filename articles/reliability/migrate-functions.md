---

title: Migrate Azure Functions to availability zone support
description: Learn how to migrate Azure Functions to availability zone support.
author: nzthiago
ms.service: azure-functions
ms.topic: conceptual
ms.date: 05/08/2025
ms.author: thalme
ms.custom: subject-reliability

---

# Migrate your function app to a zone-redundant plan

Availability zones support for Azure Functions is available on [Premium (Elastic Premium)](../azure-functions/functions-premium-plan.md) and [Dedicated (App Service)](../azure-functions/dedicated-plan.md) plans. A zone-redundant function app plan automatically balances its instances between availability zones for higher availability. This article describes how to migrate to the public multitenant Premium plan with availability zone support. For migration to zone redundancy on Dedicated plans, refer [here](migrate-app-service.md).

## Downtime requirements

Because you can't convert preexisting Premium plans to use availability zones, you must instead migrate your app by creating a side-by-side deployment on a new Premium plan app. Downtime depends on how you choose to redirect traffic during the migration from your old app to your new availability zone-enabled function app. 

Consider HTTP-based functions that use an [Application Gateway](../app-service/networking/app-gateway-with-service-endpoints.md), [custom domain](../app-service/app-service-web-tutorial-custom-domain.md), or [Azure Front Door](../frontdoor/front-door-overview.md). In this case, downtime depends on how long it takes to update those respective services with the new app information. 

You might also be routing traffic to multiple apps at the same time using a service such as [Azure Traffic Manager](../app-service/web-sites-traffic-manager.md). In this scenario, you can only fully switch to the new availability zone-enabled app after everything is deployed and tested fully. 

For message-based functions, you should [write defensive functions](../azure-functions/performance-reliability.md#write-defensive-functions) to ensure messages aren't lost during the migration.

## Migration guidance: Redeployment

To enable an existing function app to use availability zones, you must redeploy your project files to a new function app hosted in an availability zone-enabled Premium plan.

Use these steps to enable availability zones:

1. If you're already hosted in a Premium plan in a [supported region], you can reuse your existing resource group and skip to the next step. Otherwise, create a new resource group in a [supported region].
1. Create a Premium plan in one of the supported regions and the resource group. Ensure the [new Premium plan has zone redundancy enabled](./reliability-functions.md?pivots=premium-plan#create-a-function-app-in-a-zone-redundant-plan).
1. Create a function app in the new Premium plan and deploy your project code to this new app using your desired [deployment method](../azure-functions/functions-deployment-technologies.md).
1. After the new app is up and running successfully with availability zones enabled, you can optionally disable or delete the nonavailability zone app.
 
## Next steps

> [!div class="nextstepaction"]
> [Learn about the Azure Functions Premium plan](../azure-functions/functions-premium-plan.md)

> [!div class="nextstepaction"]
> [Learn about Azure Functions support for availability zone redundancy and disaster recovery](./reliability-functions.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)


[supported region]: ../azure-functions/azure-functions-az-redundancy.md#regional-availability