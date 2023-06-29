---
title: Azure API Management - Metrics retirement (August 2023)
description: Azure API Management is retiring five legacy metrics as of August 2023. If you monitor your API Management instance using these metrics, you must update your monitoring settings and alert rules to use the Requests metric.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 04/20/2023
ms.author: danlep
---

# Metrics retirements (August 2023)

Azure API Management integrates natively with Azure Monitor and emits metrics every minute, giving customers visibility into the state and health of their APIs. The following five legacy metrics have been deprecated since May 2019 and will no longer be available after 31 August 2023:

* Total Gateway Requests
* Successful Gateway Requests
* Unauthorized Gateway Requests
* Failed Gateway Requests
* Other Gateway Requests

To enable a more granular view of API traffic and better performance, API Management provides a replacement metric named **Requests**. The Requests metric has dimensions that can be used for filtering to replace the legacy metrics and also support more monitoring scenarios. 

From now through 31 August 2023, you can continue to use the five legacy metrics without impact. You can transition to the Requests metric at any point prior to 31 August 2023. 

## Is my service affected by this?

While your service isn't affected by this change, any tool, script, or program that uses the five retired metrics for monitoring or alert rules is affected by this change. You'll be unable to run those tools successfully unless you update the tools.

## What is the deadline for the change?

The five legacy metrics will no longer be available after 31 August 2023.

## Required action

Update any tools that use the five legacy metrics to use equivalent functionality that is provided through the Requests metric filtered on one or more dimensions. For example, filter Requests on the **GatewayResponseCode** or **GatewayResponseCodeCategory** dimension.

> [!NOTE]
> Configure filters on the Requests metric to meet your monitoring and alerting needs. For available dimensions, see [Azure Monitor metrics for API Management](../../azure-monitor/essentials/metrics-supported.md#microsoftapimanagementservice).


|Legacy metric  |Example replacement with Requests metric|
|---------|---------|
|Total Gateway Requests     | Requests        |
|Successful Gateway Requests     | Requests<br/> Filter: GatewayResponseCode = 0-301,304,307        |
|Unauthorized Gateway Requests     |  Requests<br/> Filter: GatewayResponseCode = 401,403,429      |
|Failed Gateway Requests     | Requests<br/> Filter: GatewayResponseCode = 400,500-599               |
|Other Gateway Requests     |  Requests<br/> Filter: GatewayResponseCode = (all other values)      |

## More information

* [Tutorial: Monitor published APIs](../api-management-howto-use-azure-monitor.md)
* [Get API analytics in Azure API Management](../howto-use-analytics.md)
* [Observability in API Management](../observability.md)

## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).
