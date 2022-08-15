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

Azure Front Door's billing model includes several components. Front Door charges a base fee for each profile that you deploy. You're also charged for requests and data transfer based on your usage. This page explains how Front Door pricing works so that you can understand and predict your monthly Azure Front Door bill.

For Azure Front Door pricing information, see the [Azure Front Door pricing page](https://azure.microsoft.com/pricing/details/frontdoor/).

> [!NOTE]
> This article explains how billing works for Azure Front Door Standard and Premium SKUs. For information about Azure Front Door (classic), see the [Azure Front Door pricing page](https://azure.microsoft.com/pricing/details/frontdoor/).

> [!WARNING] <!-- TODO -->
> **Note to reviewers:** The diagrams on this page are rough drafts for content review purposes only. After the article has been reviewed, I'll get the diagrams redrawn by the Azure illustration team.

## Base fees

Each Front Door profile incurs an hourly fee. You're billed for each hour, or partial hour, that your profile is deployed. The rate you're charged depends on the Front Door SKU that you deploy.

You don't pay extra fees for features like response caching, response compression, and the rules engine. If you use Front Door Premium, you also don't pay extra fees for managed WAF rule sets or Private Link origins.

## Request processing and traffic fees

Each request that goes through Front Door incur request processing and traffic fees:

:::image type="content" source="./media/billing/request-components.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to the origin." border="false":::

Each part of the request process is billed separately:

1. Number of requests from client to Front Door
1. Data transfer from Front Door edge to origin
1. Data transfer from origin to Front Door (non-billable)
1. Data transfer from Front Door to client

The following sections describe each of these request components in more detail.

### Number of requests from client to Front Door

Front Door charges a fee for the number of requests that are received at a Front Door edge node for your profile. Front Door identifies requests by using the `Host` header on the HTTP request. If the `Host` header matches one from your Front Door profile, it counts as a request to your profile.

The price is different depending on the geographical region of the Front Door edge node. The price is also different for the Standard and Premium SKUs.

### Data transfer from Front Door edge to origin

Front Door charges for the bytes that are sent from the Front Door edge node to your origin server. The price is different depending on the geographical region of the Front Door edge node.

The price per gigabyte is lower when you have higher volumes of traffic.

### Data transfer from origin to Front Door

When your origin server processes requests, it sends data back to Front Door so that it can be returned to the client. This traffic not billed by Front Door.

If your origin is within Azure, you should determine whether those Azure services might bill you for request processing or outbound traffic. For example, if you use an Azure Storage origin, then Azure Storage might bill you for the read operations that take place to serve the request.

If your origin is outside of Azure, you might incur charges from other network providers.

### Data transfer from Front Door to client

Front Door charges for the bytes that are sent from the Front Door edge node back to the client.

The price is different depending on the geographical region of the Front Door edge node.

## Private Link origins

When you use the Premium SKU, Front Door can [connect to your origin by using Private Link](private-link.md).

Front Door Premium has a higher base fee and request processing fee. You don't pay extra for Private Link traffic compared to traffic that uses an origin's public endpoint.

When you configure a Private Link origin, you select a region for the private endpoint to use. A [subset of Azure regions support Private Link traffic for Front Door](private-link.md#region-availability). If the region you select is different to the region the origin is deployed to, you won't be charged extra for cross-region traffic. However, the request latency will likely be greater.

## Example scenarios

### Example 1: Azure origin, no caching

Contoso hosts their website on Azure App Service, and has deployed Front Door with the standard SKU. They have disabled caching.

Suppose a request from a client is sent to the Contoso website, sending a 1 KB request and receiving a 100 KB response:

:::image type="content" source="./media/billing/scenario-1.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to the origin, without caching or compression." border="false":::

The following billing meters will be incremented:

| Meter | Incremented by |
|-|-|
| Number of requests from client to Front Door | 1 |
| Data transfer from Front Door edge to origin | 1 KB |
| Data transfer from origin to Front Door | *non-billable* |
| Data transfer from Front Door to client | 100 KB |

Azure App Service might charge other fees.

### Example 2: Azure origin, caching and compression enabled

Suppose Contoso updates their Front Door configuration to enable [content compression](front-door-caching.md#file-compression). Now, the same request as in example 1 might be able to be compressed down to 30 KB:

:::image type="content" source="./media/billing/scenario-2.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to the origin, with compression enabled." border="false":::

The following billing meters will be incremented:

| Meter | Incremented by |
|-|-|
| Number of requests from client to Front Door | 1 |
| Data transfer from Front Door edge to origin | 1 KB |
| Data transfer from origin to Front Door | *non-billable* |
| Data transfer from Front Door to client | 30 KB |

Azure App Service might charge other fees.

### Example 3: Request served from cache

Suppose a second request arrives at the same Front Door edge node and a valid cached response is available:

:::image type="content" source="./media/billing/scenario-3.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and being returned from cache." border="false":::

The following billing meters will be incremented:

| Meter | Incremented by |
|-|-|
| Number of requests from client to Front Door | 1 |
| Data transfer from Front Door edge to origin | *none when request is served from cache* |
| Data transfer from origin to Front Door | *none* |
| Data transfer from Front Door to client | 30 KB |

### Example 4: Non-Azure origin

Fabrikam runs an eCommerce site on another cloud provider, and uses Azure Front Door to serve the traffic. They haven't enabled caching or compression.

Suppose a request from a client is sent to the Fabrikam website, sending a 2 KB request and receiving a 350 KB response:

:::image type="content" source="./media/billing/scenario-4.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to an origin outside of Azure." border="false":::

The following billing meters will be incremented:

| Meter | Incremented by |
|-|-|
| Number of requests from client to Front Door | 1 |
| Data transfer from Front Door edge to origin | 2 KB |
| Data transfer from origin to Front Door | *non-billable by Azure* |
| Data transfer from Front Door to client | 350 KB |

The external cloud provider might charge other fees.

### Example 5: Request blocked by web application firewall

When a request is blocked by the web application firewall (WAF), it isn't sent to the origin. However, Front Door charges the request, and also charges to send a response.

Suppose a Front Door profile includes a custom WAF rule to block requests from a specific IP address. The WAF is configured with a custom error response page, which is 1 KB in size. If a client from the blocked IP address sends a 1 KB request:

:::image type="content" source="./media/billing/scenario-5.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door, where the request is blocked by the WAF." border="false":::

The following billing meters will be incremented:

| Meter | Incremented by |
|-|-|
| Number of requests from client to Front Door | 1 |
| Data transfer from Front Door edge to origin | *none* |
| Data transfer from origin to Front Door | *none* |
| Data transfer from Front Door to client | 1 KB |

## Next steps

Learn how to [create an Front Door profile](create-front-door-portal.md).
