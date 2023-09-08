---
title: Health probes
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door monitors the health of your origins.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/15/2023
ms.author: duau
---

# Health probes

> [!NOTE]
> An *origin* and an *origin group* in this article refers to the backend and backend pool of an Azure Front Door (classic) configuration.
>

To determine the health and proximity of each origin for a given Azure Front Door environment, each Front Door profile periodically sends a synthetic HTTP/HTTPS request to all your configured origins. Front Door then uses responses from the health probe to determine the *best* origin to route your client requests to. 

> [!WARNING]
> Since each Azure Front Door edge location is sending health probes to your origins, the health probe volume for your origins can be quite high. The number of probes depends on your customer's traffic location and your health probe frequency. If the Azure Front Door edge locations doesn’t receive real traffic from your end users, the frequency of the health probe from the edge location is decreased from the configured frequency. If there is traffic to all the Azure Front Door edge locations, the health probe volume can be high depending on your health probes frequency.
>
> An example to roughly estimate the health probe volume per minute to an origin when using the default probe frequency of 30 seconds. The probe volume on each of your origin is equal to the number of edge locations times two requests per minute. The probing requests will be less if there is no traffic sent to all of the edge locations. For a list of edge locations, see [edge locations by region](edge-locations-by-region.md).

## Supported protocols

Azure Front Door supports sending probes over either HTTP or HTTPS protocols. These probes are sent over the same TCP ports configured for routing client requests, and can't be overridden. Front Door HTTP/HTTPS probes are sent with `User-Agent` header set with value: `Edge Health Probe`.

## Supported HTTP methods for health probes

Azure Front Door supports the following HTTP methods for sending the health probes:

1. **GET:** The GET method means retrieve whatever information (in the form of an entity) gets identified by the Request-URI.
2. **HEAD:** The HEAD method is identical to GET except that the server **MUST NOT** return a message-body in the response. For new Front Door profiles, by default, the probe method is set as HEAD.

> [!TIP]
> To lower the load and cost to your origins, Front Door recommends using HEAD requests for health probes.

## Health probe responses

| Responses  | Description | 
| ------------- | ------------- |
| Determining health  | A **200 OK** status code indicates the origin is healthy. Any other status code is considered a failure. If for any reason a valid HTTP response isn't received for a probe, the probe is counted as a failure. |
| Measuring latency  | Latency is the wall-clock time measured from the moment immediately before the probe request gets sent to the moment when Front Door receives the last byte of the response. Front Door uses a new TCP connection for each request. The measurement isn't biased towards origins with existing warm connections. |

## How Front Door determines origin health

Azure Front Door uses a three-step process across all algorithms to determine health.

1. Exclude disabled origins.

1. Exclude origins that have health probes errors:

    * This selection is done by looking at the last _n_ health probe responses. If at least _x_ are healthy, the origin is considered healthy.

    * _n_ is configured by changing the **SampleSize** property in load-balancing settings.

    * _x_ is configured by changing the **SuccessfulSamplesRequired** property in load-balancing settings.

1. For sets of healthy origins in an origin group, Front Door measures and maintains the latency for each origin.

> [!NOTE]
> If a single endpoint is a member of multiple origin groups, Front Door will optimize the number of health probes sent to the origin to reduce the load on the origin. Health probe requests will be sent based on the lowest configured sample interval. The health of the endpoint in all origin groups will be determined by the responses from same health probes.

## Complete health probe failure

If health probes fail for every origin in an origin group, then Front Door considers all origins unhealthy and routes traffic in a round robin distribution across all of them.

Once an origin returns to a healthy state, Front Door resumes the normal load-balancing algorithm.

## Disabling health probes

If you have a single origin in your origin group, you can choose to disable health probes to reduce the load on your application. If you have multiple origins in your origin group and more than one of them is in enabled state, you can't disable health probes.

## Next steps

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn about [Front Door routing architecture](front-door-routing-architecture.md).
