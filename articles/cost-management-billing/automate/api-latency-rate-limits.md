---
title: Cost Management API latency and rate limits
titleSuffix: Azure Cost Management + Billing
description: This article explains why the Cost Management API has latency and rate limits.
author: bandersmsft
ms.author: banders
ms.date: 05/19/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Cost Management API latency and rate limits

We recommend that you call the Cost Management APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn't provide more data. Instead, it creates increased load. To learn more about how often data changes and how data latency is handled, see [Understand cost management data](../costs/understand-cost-mgt-data.md).

## Error code 429 - Call count has exceeded rate limits

To enable a consistent experience for all Cost Management subscribers, Cost Management APIs are rate limited. When you reach the limit, you receive the HTTP status code `429: Too many requests`. The current throughput limits for the APIs are as follows:

- 30 calls per minute - It's done per scope, per user, or application.
- 200 calls per minute - It's done per tenant, per user, or application.

## Next steps

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).