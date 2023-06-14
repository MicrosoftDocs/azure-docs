---
# Mandatory fields.
title: Service limits
titleSuffix: Azure Digital Twins
description: Chart showing the limits of the Azure Digital Twins service.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/14/2023
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins service limits

The following sections describe the service limits of Azure Digital Twins.

> [!NOTE]
> Some areas of this service have adjustable limits. This is represented in the tables below with the **Adjustable?** column. When the limit can be adjusted, the **Adjustable?** value is **Yes**.
>
> If your business requires raising an adjustable limit or quota above the default limit, you can request additional resources by [opening a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Limits by type

[!INCLUDE [Azure Digital Twins limits](../../includes/digital-twins-limits.md)]

## Working with limits

When a limit is reached, any requests beyond it are throttled by the service, which will result in a 429 error response from these requests.

To manage the throttling, here are some recommendations for working with limits.
* Use retry logic. The [Azure Digital Twins SDKs](concepts-apis-sdks.md) implement retry logic for failed requests, so if you're working with a provided SDK, this functionality is already built-in. Otherwise, consider implementing retry logic in your own application. The service sends back a `Retry-After` header in the failure response, which you can use to determine how long to wait before retrying.
* Use thresholds and notifications to warn about approaching limits. Some of the service limits for Azure Digital Twins have corresponding [metrics](../azure-monitor/essentials/data-platform-metrics.md) that can be used to track usage in these areas. To configure thresholds and set up an alert on any metric when a threshold is approached, see the instructions in [Create a new alert rule](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric). To set up notifications for other limits where metrics aren't provided, consider implementing this logic in your own application code.
* Deploy at scale across multiple instances. Avoid having a single point of failure. Instead of one large graph for your entire deployment, consider sectioning out subsets of twins logically (like by region or tenant) across multiple instances. 
* For modeling recommendations to help you operate within the functional limits, see [Modeling tools and best practices](concepts-models.md#modeling-tools-and-best-practices).

>[!NOTE]
>Azure Digital Twins will automatically scale resources to meet the rate limits described in this article. You may experience throttling before these limits are reached due to internal scaling to adapt to the incoming load. Internal scaling can take anywhere from 5 to 30 minutes, during which time your application may encounter 429 errors.

## Next steps

Learn more about the current release of Azure Digital Twins in the service overview:
* [What is Azure Digital Twins?](overview.md)
