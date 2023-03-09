---
title: Understand Azure Front Door billing
description: Learn how you're billed when you use Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/06/2022
ms.author: jodowns
---

# Understand Azure Front Door billing

Azure Front Door provides a rich set of features for your internet-facing workloads. Front Door helps you to accelerate your application's performance, improves your security, and provides you with tools to inspect and modify your HTTP traffic.

Front Door's billing model includes several components. Front Door charges a base fee for each profile that you deploy. You're also charged for requests and data transfer based on your usage. *Billing meters* collect information about your Front Door usage. Your monthly Azure bill aggregates the billing information across the month and applies the pricing to determine the amount you need to pay.

This article explains how Front Door pricing works so that you can understand and predict your monthly Azure Front Door bill.

For Azure Front Door pricing information, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/).

> [!TIP]
> The Azure pricing calculator helps you to calculate a pricing estimate for your requirements. Use the [pre-created pricing calculator estimate](https://azure.com/e/bdc0d6531fbb4760bf5cdd520af1e4cc?azure-portal=true) as a starting point, and customize it for your own solution.

> [!NOTE]
> This article explains how billing works for Azure Front Door Standard and Premium SKUs. For information about Azure Front Door (classic), see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/).

## Base fees

Each Front Door profile incurs an hourly fee. You're billed for each hour, or partial hour, that your profile is deployed. The rate you're charged depends on the Front Door SKU that you deploy.

A single Front Door profile can contain multiple [endpoints](endpoint.md). You're not billed extra for each endpoint.

You don't pay extra fees to use features like [traffic acceleration](front-door-traffic-acceleration.md), [response caching](front-door-caching.md), [response compression](front-door-caching.md#file-compression), the [rules engine](front-door-rules-engine.md), [Front Door's inherent DDoS protection](front-door-ddos.md), and [custom web application firewall (WAF) rules](web-application-firewall.md#custom-rules). If you use Front Door Premium, you also don't pay extra fees to use [managed WAF rule sets](web-application-firewall.md#managed-rules) or [Private Link origins](private-link.md).

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

Front Door charges a fee for the number of requests that are received at a Front Door edge location for your profile. Front Door identifies requests by using the `Host` header on the HTTP request. If the `Host` header matches one from your Front Door profile, it counts as a request to your profile.

The price is different depending on the geographical region of the Front Door edge location that serves the request. The price is also different for the Standard and Premium SKUs.

### Data transfer from Front Door edge to origin

Front Door charges for the bytes that are sent from the Front Door edge location to your origin server. The price is different depending on the geographical region of the Front Door edge location that serves the request. The location of the origin doesn't affect the price.

The price per gigabyte is lower when you have higher volumes of traffic.

If the request can be served from the Front Door edge location's cache, Front Door doesn't send any request to the origin server, and you aren't billed for this component.

### Data transfer from origin to Front Door

When your origin server processes a request, it sends data back to Front Door so that it can be returned to the client. This traffic is not billed by Front Door, even if the origin is in a different region to the Front Door edge location for the request.

If your origin is within Azure, the data egress from the Azure origin to Front Door isn't charged. However, you should determine whether those Azure services might bill you to process your requests.

If your origin is outside of Azure, you might incur charges from other network providers.

### Data transfer from Front Door to client

Front Door charges for the bytes that are sent from the Front Door edge location back to the client. The price is different depending on the geographical region of the Front Door edge location that serves the request.

If a response is compressed, Front Door only charges for the compressed data.

## Private Link origins

When you use the Premium SKU, Front Door can [connect to your origin by using Private Link](private-link.md).

Front Door Premium has a higher base fee and request processing fee. You don't pay extra for Private Link traffic compared to traffic that uses an origin's public endpoint.

When you configure a Private Link origin, you select a region for the private endpoint to use. A [subset of Azure regions support Private Link traffic for Front Door](private-link.md#region-availability). If the region you select is different to the region the origin is deployed to, you won't be charged extra for cross-region traffic. However, the request latency will likely be greater.

## Cross-region traffic

Some of the Front Door billing meters have different rates depending on the location of the Front Door edge location that processes a request. Usually, [the Front Door edge location that processes a request is the one that's closest to the client](front-door-traffic-acceleration.md#select-the-front-door-edge-location-for-the-request-anycast), which helps to reduce latency and maximize performance.

Front Door charges for traffic from the edge location to the origin. Traffic is charged at different rates depending on the location of the Front Door edge location. If your origin is in a different Azure region, you aren't billed extra for inter-region traffic.

## Example scenarios

### Example 1: Azure origin without caching

Contoso hosts their website on Azure App Service, which runs in the West US region. Contoso has deployed Front Door with the standard SKU. They have disabled caching.

Suppose a request from a client in California is sent to the Contoso website, sending a 1 KB request and receiving a 100 KB response:

:::image type="content" source="./media/billing/scenario-1.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to the origin, without caching or compression." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | North America |
| Data transfer from Front Door edge to origin | 1 KB | North America |
| Data transfer from Front Door to client | 100 KB | North America |

Azure App Service might charge other fees.

### Example 2: Azure origin with compression enabled

Suppose Contoso updates their Front Door configuration to enable [content compression](front-door-caching.md#file-compression). Now, the same response as in example 1 might be able to be compressed down to 30 KB:

:::image type="content" source="./media/billing/scenario-2.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to the origin, with compression enabled." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | North America  |
| Data transfer from Front Door edge to origin | 1 KB | North America |
| Data transfer from Front Door to client | 30 KB | North America |

Azure App Service might charge other fees.

### Example 3: Request served from cache

Suppose a second request arrives at the same Front Door edge location and a valid cached response is available:

:::image type="content" source="./media/billing/scenario-3.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and being returned from cache." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | North America |
| Data transfer from Front Door edge to origin | *none when request is served from cache* | |
| Data transfer from Front Door to client | 30 KB | North America |

### Example 4: Cross-region traffic

Suppose a request to Contoso's website comes from a client in Australia, and can't be served from cache:

:::image type="content" source="./media/billing/scenario-4.png" alt-text="Diagram of traffic flowing from the client in Australia to Azure Front Door and to the origin." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | Australia |
| Data transfer from Front Door edge to origin | 1 KB | Australia |
| Data transfer from Front Door to client | 30 KB | Australia |

### Example 5: Non-Azure origin

Fabrikam runs an eCommerce site on another cloud provider. Their site is hosted in Europe. They Azure Front Door to serve the traffic. They haven't enabled caching or compression.

Suppose a request from a client is sent to the Fabrikam website from a client in New York. The client sends a 2 KB request and receives a 350 KB response:

:::image type="content" source="./media/billing/scenario-5.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door and to an origin outside of Azure." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | North America |
| Data transfer from Front Door edge to origin | 2 KB | North America |
| Data transfer from Front Door to client | 350 KB | North America |

The external cloud provider might charge other fees.

### Example 6: Request blocked by web application firewall

When a request is blocked by the web application firewall (WAF), it isn't sent to the origin. However, Front Door charges the request, and also charges to send a response.

Suppose a Front Door profile includes a custom WAF rule to block requests from a specific IP address in South America. The WAF is configured with a custom error response page, which is 1 KB in size. If a client from the blocked IP address sends a 1 KB request:

:::image type="content" source="./media/billing/scenario-6.png" alt-text="Diagram of traffic flowing from the client to Azure Front Door, where the request is blocked by the WAF." border="false":::

The following billing meters are incremented:

| Meter | Incremented by | Billing region |
|-|-|-|
| Number of requests from client to Front Door | 1 | South America |
| Data transfer from Front Door edge to origin | *none* | South America |
| Data transfer from Front Door to client | 1 KB | South America |

## Next steps

Learn how to [create an Front Door profile](create-front-door-portal.md).
