---
# Mandatory fields.
title: Service limits
titleSuffix: Azure Digital Twins
description: Chart showing the limits of the Azure Digital Twins service.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 04/08/2021
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins service limits

These are the service limits of Azure Digital Twins.

> [!NOTE]
> Some areas of this service have adjustable limits. This is represented in the tables below with the *Adjustable?* column. When the limit can be adjusted, the *Adjustable?* value is *Yes*.
>
> If your business requires raising an adjustable limit or quota above the default limit, you can request additional resources by [opening a support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Limits by type

[!INCLUDE [Azure Digital Twins limits](../../includes/digital-twins-limits.md)]

## Working with limits

When a limit is reached, the service throttles additional requests. This will result in a 429 error response from these requests.

To manage this, here are some recommendations for working with limits.
* **Use retry logic.** The [Azure Digital Twins SDKs](how-to-use-apis-sdks.md) implement retry logic for failed requests, so if you are working with a provided SDK, this is already built-in. Otherwise, consider implementing retry logic in your own application. The service sends back a `Retry-After` header in the failure response, which you can use to determine how long to wait before retrying.
* **Use thresholds and notifications to warn about approaching limits.** Some of the service limits for Azure Digital Twins have corresponding [metrics](troubleshoot-metrics.md) that can be used to track usage in these areas. To configure thresholds and set up an alert on any metric when a threshold is approached, see the instructions in [*Troubleshooting: Set up alerts*](troubleshoot-alerts.md). To set up notifications for other limits where metrics aren't provided, consider implementing this logic in your own application code.

## Next steps

Learn more about the current release of Azure Digital Twins in the service overview:
* [*Overview: What is Azure Digital Twins?*](overview.md)
