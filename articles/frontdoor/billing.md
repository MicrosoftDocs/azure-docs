---
title: Understand Azure Front Door billing
description: Learn how you're billed when you use Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 08/13/2022
ms.author: jodowns
---

# Understand Azure Front Door billing

Azure Front Door's billing model includes several components. You are charged a base fee for each Front Door profile that you deploy. You are also charged for requests and data transfer based on your usage. This page explains how Front Door pricing works so that you can understand and predict your monthly Azure Front Door bill.

For Azure Front Door pricing information, see the [Azure Front Door pricing page](https://azure.microsoft.com/pricing/details/frontdoor/).

> [!NOTE]
> This article explains how billing works for Azure Front Door Standard and Premium SKUs. For information about Azure Front Door (classic), see the [Azure Front Door pricing page](https://azure.microsoft.com/pricing/details/frontdoor/).

## Base fees

Each Front Door profile incurs an hourly fee. You're billed for each hour, or partial hour, that your profile is deployed. The rate you're charged depends on the Front Door SKU that you deploy.

## Request processing and traffic fees

<!-- TODO -->

## Number of requests from client to Front Door

<!-- TODO -->

## Data transfer from Front Door to origin

<!-- TODO -->

## Data transfer from origin to Front Door

<!-- TODO -->

## Data transfer from Front Door to client

<!-- TODO -->

## Private Link origins

When you use the Premium SKU, Front Door can [connect to your origin by using Private Link](private-link.md).

Front Door Premium has a higher base fee and request processing fee. You don't pay extra for Private Link traffic compared to normal traffic.

When you configure a Private Link origin, you select a region for the private endpoint to use. A [subset of Azure regions support Private Link traffic for Front Door](private-link.md#region-availability). If the region you select is different to the region the origin is deployed to, you won't be charged extra for cross-region traffic. However, the request latency will likely be greater.

## Example scenarios

### Example 1: Azure origin, no caching

<!-- TODO -->

### Example 2: Azure origin, caching and compression enabled

<!-- TODO -->

### Example 3: Request served from cache

<!-- TODO -->

### Example 4: Non-Azure origin

<!-- TODO -->

## Next steps

Learn how to [create an Front Door profile](create-front-door-portal.md).
