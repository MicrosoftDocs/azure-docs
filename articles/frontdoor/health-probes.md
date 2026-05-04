---
title: Health Probes
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door monitors the health of your origins.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 04/30/2026
---

# Health probes

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

> [!NOTE]
> In this article, an *origin* and an *origin group* refer to the backend and backend pool of an Azure Front Door (classic) configuration.
>

To determine the health and proximity of each origin for a given Azure Front Door environment, each Front Door profile periodically sends a synthetic HTTP or HTTPS request to all your configured origins. Front Door then uses responses from the health probe to determine the *best* origin to route your client requests to. 

> [!WARNING]
> Since each Azure Front Door edge location sends health probes to your origins, the health probe volume for your origins can be high. The number of probes depends on your customer's traffic location and your health probe frequency. If the Azure Front Door edge locations don't receive real traffic from your end users, the frequency of the health probe from the edge location decreases from the configured frequency. If there's traffic to all the Azure Front Door edge locations, the health probe volume can be high depending on your health probes frequency.
>
> To roughly estimate the health probe volume per minute to an origin when using the default probe frequency of 30 seconds, multiply the number of edge locations by two requests per minute. The probing requests are fewer if there's no traffic sent to all of the edge locations. For a list of edge locations, see [edge locations by region](edge-locations-by-region.md).

## Supported protocols

Azure Front Door supports sending probes over either HTTP or HTTPS protocols. These probes use the same TCP ports configured for routing client requests, and you can't override them. Front Door HTTP or HTTPS probes include a `User-Agent` header set with the value `Edge Health Probe`.

## Supported HTTP methods for health probes

Azure Front Door supports the following HTTP methods for sending the health probes:

- **GET:** The GET method retrieves whatever information (in the form of an entity) gets identified by the Request-URI.
- **HEAD:** The HEAD method is identical to GET except that the server **MUST NOT** return a message-body in the response. For new Front Door profiles, the probe method is set as HEAD by default.

> [!TIP]
> To lower the load and cost to your origins, use HEAD requests for health probes.

## Health probe responses

| Responses  | Description | 
| ------------- | ------------- |
| Determining health  | A **200 OK** status code indicates the origin is healthy. Any other status code is considered a failure. If for any reason a valid HTTP response isn't received for a probe, the probe is counted as a failure. |
| Measuring latency  | Latency is the wall-clock time measured from the moment immediately before the probe request gets sent to the moment when Front Door receives the last byte of the response. Front Door uses a new TCP connection for each request. The measurement isn't biased towards origins with existing warm connections. |

## How Front Door determines origin health

Azure Front Door uses a three-step process across all algorithms to determine health.

1. Exclude disabled origins.

1. Exclude origins that have health probe errors:

    * Front Door looks at the last _n_ health probe responses. If at least _x_ responses are healthy, the origin is considered healthy.

    * Change the **SampleSize** property in load-balancing settings to set _n_.

    * Change the **SuccessfulSamplesRequired** property in load-balancing settings to set _x_.

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

