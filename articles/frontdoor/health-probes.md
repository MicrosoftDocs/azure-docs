---
title: Health Probes
titleSuffix: Azure Front Door
description: Learn how Azure Front Door uses health probes to select healthy origins, measure latency, handle failures, and support HTTP, HTTPS, and gRPC preview probes.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/05/2026
---

# Health probes

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

> [!NOTE]
> In this article, an *origin* and an *origin group* refer to the backend and backend pool of an Azure Front Door (classic) configuration.
>

To determine the health and proximity of each origin for a given Azure Front Door environment, each Front Door profile periodically sends health probes to your configured origins. Front Door then uses responses from the health probe to determine the *best* origin to route your client requests to.

> [!WARNING]
> Each Azure Front Door edge location sends health probes to your origins, so probe volume can be high. The volume depends on where your users send traffic and the configured probe frequency. Front Door reduces probe frequency at edge locations that don't receive real user traffic.
>
> To roughly estimate the health probe volume per minute to an origin when using the default probe frequency of 30 seconds, multiply the number of edge locations by two requests per minute. The probing requests are fewer if there's no traffic sent to all of the edge locations. For a list of edge locations, see [edge locations by region](edge-locations-by-region.md).

## Supported protocols

Azure Front Door supports sending probes over HTTP or HTTPS. These probes use the same TCP ports configured for routing client requests, and you can't override them. Front Door HTTP or HTTPS probes include a `User-Agent` header set with the value `Edge Health Probe`.

### gRPC probes (preview)

During the public preview, Azure Front Door Standard and Premium also support native gRPC health probes for gRPC-enabled origins. Each origin must implement the standard `grpc.health.v1.Health/Check` RPC. HTTP and HTTPS probes remain supported alternatives. For configuration and preview limitations, see [Configure origins and health probes for gRPC](grpc.md#configure-origins-and-health-probes).

## Supported HTTP methods for health probes

Azure Front Door supports the following HTTP methods for sending the health probes:

- **GET:** Requests an endpoint's response, including its response body.
- **HEAD:** Requests response headers without a response body. For new Front Door profiles, the default probe method is HEAD.

> [!TIP]
> To lower the load and cost to your origins, use HEAD requests for health probes.

## Health probe responses

The following response criteria apply to HTTP and HTTPS probes.

| Responses | Description |
| --- | --- |
| Determining health | A **200 OK** status code indicates a healthy origin. Front Door counts any other status code or the absence of a valid HTTP response as a probe failure. |
| Measuring latency | Front Door measures latency from immediately before it sends the probe request until it receives the last byte of the response. It uses a new TCP connection for each request, so existing warm connections don't bias the measurement. |

## How Front Door determines origin health

Azure Front Door uses a three-step process across all algorithms to determine health.

1. Exclude disabled origins.

1. Exclude origins that have health probe errors:

    - Front Door looks at the last *n* health probe responses. If at least *x* responses are healthy, the origin is considered healthy.

    - Change the **SampleSize** property in load-balancing settings to set *n*.

    - Change the **SuccessfulSamplesRequired** property in load-balancing settings to set *x*.

1. For sets of healthy origins in an origin group, Front Door measures and maintains the latency for each origin.

> [!NOTE]
> If a single endpoint is a member of multiple origin groups, Front Door optimizes the number of health probes it sends to the origin to reduce the load on the origin. Front Door sends health probe requests based on the lowest configured sample interval. The responses from the same health probes determine the health of the endpoint in all origin groups.

## Complete health probe failure

If health probes fail for every origin in an origin group, Front Door considers all origins unhealthy and routes traffic in a round robin distribution across all of them. When an origin returns to a healthy state, Front Door resumes the normal load-balancing algorithm.

## Disabling health probes

If your origin group has a single origin, you can disable health probes to reduce the load on your application. If your origin group has multiple origins and more than one origin is enabled, you can't disable health probes.

> [!NOTE]
> If your origin group has only a single origin, the single origin gets few health probes. This condition might lead to a dip in origin health metrics but your traffic isn't impacted.

## Related content

- [Create an Azure Front Door profile](create-front-door-portal.md)
- [Front Door routing architecture](front-door-routing-architecture.md)
