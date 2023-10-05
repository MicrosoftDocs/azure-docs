---
title: We're retiring Application Gateway V1 SKU in April 2026
titleSuffix: Azure Application Gateway
description: This article provides a high-level overview of the retirement of Application gateway V1 SKUs 
services: application-gateway
author: MJyot
ms.service: application-gateway
ms.topic: how-to
ms.date: 04/19/2023
ms.author: mjyothish
---

# Migrate your Application Gateways from V1 SKU to V2 SKU by April 28, 2026 

**Applies to:** :heavy_check_mark: Application Gateway v1 deployments

We announced the deprecation of Application Gateway V1 on **April 28 ,2023**. Starting from **April 28, 2026**, we are retiring ApplicationGateway v1 SKU. This means that the service is not supported after this date. If you use Application Gateway V1 SKU, start planning your migration to V2 now. Complete it by April 28, 2026, to take advantage of [Application Gateway V2](./overview-v2.md).

## Retirement Timelines 

- Deprecation announcement: April 28 ,2023 

-	No new subscriptions for V1 deployments: July 1,2023 onwards - Application Gateway V1 is no longer available for deployment on subscriptions with out V1 gateways(Refer to [FAQ](./retirement-faq.md#what-is-the-definition-of-a-new-customer-on-application-gateway-v1-sku) for details) from July 1 2023 onwards.

- No new V1 deployments: August 28, 2024 - V1 creation is stopped completely for all customers 28 August 2024 onwards.

- SKU retirement: April 28, 2026 - Any Application Gateway V1 that are in Running status will be stopped. Application Gateway V1s that is not migrated to Application Gateway V2 are informed regarding timelines for deleting them and then force deleted.

## Resources available for migration

- Follow the steps outlined in the [migration script](./migrate-v1-v2.md) to migrate from Application Gateway v1 to v2. Review [pricing](./understanding-pricing.md) before making the transition.

-	If your company/organization has partnered with Microsoft or works with Microsoft representatives (like cloud solution architects (CSAs) or customer success account managers (CSAMs)), please work with them for migration.

## Required action

Start planning your migration to Application Gateway V2 today.

- Make a list of all Application Gateway V1 Sku gateways: On April 28,2023, we sent out emails with subject "Retirement Notice: Transition to Application Gateway V2 by 28 April 2026" to V1 subscription owners. The email provides the Subscription, Gateway Name and Application Gateway V1 resource details. Please use the details to build this list.

- [Learn more](./migrate-v1-v2.md) about migrating your application gateway V1 to V2 SKU. For more information, see [Frequently asked questions about V1 to V2 migration.](./retirement-faq.md#faq-on-v1-to-v2-migration)

- For technical questions, issues, and help get answers from community experts in  [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) or reach out to us at [AppGatewayMigrationTeam](mailto:appgatewaymigration@microsoft.com). If you have a support question and you need technical help, please create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) . 

- Complete the migration as soon as possible to prevent business impact and to take advantage of the improved performance, security, and new features of Application Gateway V2.

Blog: [Take advantage of Application gateway V2](https://azure.microsoft.com/blog/taking-advantage-of-the-new-azure-application-gateway-v2/)

## Next steps
  
  * [Migration Guidance](./migrate-v1-v2.md)
  * [Common questions on Migration](./retirement-faq.md)
  
