---
title: We're retiring Application Gateway V1 SKU in April 2026
description: This article provides a high-level overview of the retirement of Application gateway V1 SKUs 
services: application-gateway
author: MJyot
ms.service: application-gateway
ms.topic: how-to
ms.date: 04/19/2023
ms.author: mjyothish
---

# Migrate your Application Gateways from v1 SKU to v2 SKU by April 28, 2026 

**Applies to:** :heavy_check_mark: Application Gateway v1 deployments

We announced the deprecation of Application Gateway v1 on **April 28 ,2023**. Starting from **April 28, 2026**, we will be retiring ApplicationGateway v1 SKU. This means that the service will no longer be supported after this date. If you use Application Gateway V1 SKU, start planning your migration to V2 now. Complete it by April 28, 2026, to take advantage of [Application Gateway V2](./overview-v2.md).

## Retirement Timelines 
**v1 deprecation                     :  April 28 ,2023**

**v1 create stopped for new subscriptions: July 1,2023**

**v1 create stopped for existing subscriptions: August 28, 2024**

**v1 retirement                      : April 28 ,2026**

Application Gateway V1 will no longer be available for new sign-ups or subscriptions from July 1 2023. So customers who didn't have V1 SKU in their subscriptions in the month of June 2023 can no longer create AppGw V1 from July 2023.

V1 creation will be stopped for all customers on 28 August 2024.

On April 28, 2026, Any AppGw V1 that is still running will be stopped. AppGw V1 that is not migrated to AppGw V2 will be informed regarding timelines for deleting them and subsequently force deleted.


## Resources available for migration
- Follow the steps outlined in the [migration script](./migrate-v1-v2.md) to migrate from AppGw v1 to v2. Please review the [pricing](./understanding-pricing.md) before making the transition.

-	If your company/organization has partnered with Microsoft or works with Microsoft representatives (like cloud solution architects (CSAs) or customer success account managers (CSAMs)), please work with them for additional resources for migration.

## Required action

Start planning your migration to Application Gateway V2, today.

- Make a list of all Application Gateway V1's: On April 28,2023, we sent out emails with subject " Retirement Notice: Transition to Application Gateway V2 by 28 April 2026 " to V1 subscription owners. The email provides the subscription, Gateway Name and Application Gateway V1 Resource details in it. Please use them to build this list.

- [Learn more](./migrate-v1-v2.md) about migrating your application gateway V1 to V2 SKU. For more information, see [Frequently asked questions about V1 to V2 migration.](./migrate-v1-v2.md#common-questions)

- For technical questions, issues, and help get answers from community experts in  [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) or reach out to us at [AppGatewayMigrationTeam](mailto:appgatewaymigration@microsoft.com). If you have a support question and you need technical help, please create a [support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) . 

- Complete the migration as soon as possible to prevent business impact and to take advantage of the improved performance, security, and new features of Application Gateway V2.

Blog: [Take advantage of Application gateway V2](https://azure.microsoft.com/blog/taking-advantage-of-the-new-azure-application-gateway-v2/)

## Common questions on Retirement

### What is the official date Application Gateway V1 is cut off from creation?

New Customers will not be able to create v1 from 1 July 2023. However, any existing V1 customers can continue to create resources until August 2024 and manage V1 resources until the retirement date of 28 April 2026.

### What happens to existing Application Gateway V1 after 28 April 2026?

Once the deadline arrives V1 gateways will not be supported.Any V1 SKU resources that are still active will be stopped, and force deleted.

### What is the definition of a new customer on Application Gateway V1 SKU?

Customers who did not have Application Gateway V1 SKU in their subscriptions in the month of June 2023 are considered as new customers. These customers won’t be able to create new V1 gateways from 1 July 2023.

### What is the definition of an existing customer on Application Gateway V1 SKU?

Customers who had active or stopped but allocated Application Gateway V1 SKU in their subscriptions in the month of June 2023, are considered existing customers. These customers get until August 28, 2024 to create new V1 application gateways and until April 28,2026 to migrate their V1 gateways to V2.

### Does this migration plan affect any of my existing workloads that run on Application Gateway V1 SKU?

Until April 28, 2026, existing Application Gateway V1 deployments will be supported. After April 28, 2026, any V1 SKU resources that are still active will be stopped, and force deleted.

### What happens to my V1 application gateways if I don’t plan on migrating soon?

On April 28, 2026, the V1 gateways will be fully retired and any active AppGateway V1 will be stopped & deleted. To prevent business impact, we highly recommend starting to plan your migration at the earliest and complete it before April 28, 2026.

### How do I migrate my application gateway V1 to V2 SKU?

If you have an Application Gateway V1, Migration from v1 to v2 can be currently done in two stages:
- Stage 1: Migrate the configuration - Detailed instruction for Migrating the configuration can be found here.
- Stage 2: Migrate the client traffic -Client traffic migration varies depending on your specific environment. High level guidelines on traffic migration are provided here.

### Can Microsoft migrate this data for me?

No, Microsoft cannot migrate user's data on their behalf. Users must do the migration themselves by using the self-serve options provided.

### What is the time required for migration?

Planning and execution of migration greatly depends on the complexity of the deployment and could take couple of months.

### How do I report an issue?

Post your issues and questions about migration to our [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) for AppGateway, with the keyword V1Migration. We recommend posting all your questions on this forum. If you have a support contract, you're welcome to log a [support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) as well.

## Next steps
  
  * [Migration Guidance](./migrate-v1-v2.md)
  
