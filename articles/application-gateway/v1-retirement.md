---
title: Application Gateway V1 retirement and migration to V2
titleSuffix: Azure Application Gateway
description: Application Gateway V1 is retired. Learn how to migrate remaining V1 deployments to Application Gateway V2.
services: application-gateway
author: MJyot
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 08/26/2026
ms.author: mjyothish
#customer intent: As an IT administrator who's using Application Gateway V1, I want to migrate to Application Gateway V2 before April 28, 2026, so that I can ensure continuous support and benefit from enhanced performance and security features.
---
# Migrate from Application Gateway V1 to V2

**Applies to:** :heavy_check_mark: Application Gateway v1 deployments

Microsoft announced the deprecation of Azure Application Gateway V1 on April 28, 2023. Application Gateway V1 retired on April 28, 2026, and Microsoft no longer supports V1 resources. There's no service-level agreement (SLA) for V1 resources. As Microsoft decommissions the hardware that supports V1, traffic passing through remaining V1 resources can't be guaranteed.

If you still use Application Gateway V1, migrate to [Application Gateway V2](./overview-v2.md) as soon as possible to reduce the risk of traffic disruption.

## Retirement timeline for Application Gateway V1

- Deprecation announcement: April 28, 2023.
- Retirement: April 28, 2026. Remaining Application Gateway V1 deployments can experience traffic disruptions as Microsoft blocks the data path and deletes the resources.

Microsoft will notify you of the timeline for deleting your Application Gateway V1 deployments. After that notification, Microsoft will delete deployments that you don't migrate to Application Gateway V2.

## Required action for Application Gateway V1

Migrate as soon as possible to prevent business impact and take advantage of the improved performance, security, and new features of Application Gateway V2.

## Resources for migration from Application Gateway V1 to V2

- [Migrate Azure Application Gateway and Web Application Firewall from V1 to V2](./migrate-v1-v2.md).
- [Understand pricing for Azure Application Gateway and Web Application Firewall](./understanding-pricing.md).
- Watch the migration video:

   > [!VIDEO 7ed01e33-80a9-4daa-9322-e771f963a2fe]

- [Read the Application Gateway V1 retirement FAQ](./retirement-faq.md).
- Read the blog post [Taking advantage of the new Azure Application Gateway V2](https://azure.microsoft.com/blog/taking-advantage-of-the-new-azure-application-gateway-v2/).
- Work with your Microsoft representatives, such as cloud solution architects (CSAs) or customer success account managers (CSAMs), to plan your migration.
- Ask technical questions in [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) or [email the Application Gateway migration team](mailto:appgatewaymigration@microsoft.com).
- Create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) for further technical help.
