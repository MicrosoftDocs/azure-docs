---
title: We're Retiring Application Gateway V1 in April 2026
titleSuffix: Azure Application Gateway
description: This article provides a high-level overview of the retirement of Application Gateway V1. 
services: application-gateway
author: MJyot
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 04/30/2026
ms.author: mjyothish
#customer intent: As an IT administrator who's using Application Gateway V1, I want to migrate to Application Gateway V2 before April 28, 2026, so that I can ensure continuous support and benefit from enhanced performance and security features.
---
# Migrate from Application Gateway V1 to V2 by April 28, 2026

**Applies to:** :heavy_check_mark: Application Gateway v1 deployments

We announced the deprecation of Azure Application Gateway V1 on April 28, 2023. Application Gateway V1 is retired as of  *April 28, 2026*. After April 28, 2026, we'll no longer support Application Gateway V1 resources. There's no service-level agreement (SLA) for customers who use this version. As we begin decommissioning the hardware that supports V1, traffic passing through V1 resources will be impacted.

If you use Application Gateway V1,  migrate to [Application Gateway V2](./overview-v2.md) now. Complete it by April 28, 2026.

## Retirement timelines

- Deprecation announcement: April 28, 2023.
- Retirement: April 28, 2026. Any Application Gateway V1 deployments still running will face traffic disruptions as we start the scream tests as part of decommissioning.

We'll inform you about the timeline for deleting your Application Gateway V1 deployments. After that, we'll delete deployments that aren't migrated to Application Gateway V2.

## Required action

Complete the migration as soon as possible to prevent business impact and to take advantage of the improved performance, security, and new features of Application Gateway V2.

## Resources for migration

- For migration instructions, see [Migrate Azure Application Gateway and Web Application Firewall from V1 to V2](./migrate-v1-v2.md).

- For pricing information, see [Understanding pricing for Azure Application Gateway and Web Application Firewall](./understanding-pricing.md).

- To better understand the migration steps, see this video guide:

  > [!VIDEO 7ed01e33-80a9-4daa-9322-e771f963a2fe]

- For FAQ, see [Frequently asked questions about Application Gateway V1 retirement](./retirement-faq.md).

- For the announcement about the capabilities of V2, see the blog post [Taking advantage of the new Azure Application Gateway V2](https://azure.microsoft.com/blog/taking-advantage-of-the-new-azure-application-gateway-v2/).

- If your company or organization partners with Microsoft or works with Microsoft representatives, like cloud solution architects (CSAs) or customer success account managers (CSAMs), work with them for the migration.

- For technical questions, issues, and help, you can get answers from community experts in [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) or [email the Application Gateway migration team](mailto:appgatewaymigration@microsoft.com).

- If you need further technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade).
