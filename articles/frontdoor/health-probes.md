---
title: Backend health monitoring - Azure Front Door
description: This article helps you understand how Azure Front Door monitors the health of your origins.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/17/2022
ms.author: duau
---

# Health probes

> [!NOTE]
> An *Origin* and a *origin group* in this article refers to the backend and backend pool of the Azure Front Door (classic) configuration.
>

To determine the health and proximity of each backend for a given Azure Front Door environment, each Front Door environment periodically sends a synthetic HTTP/HTTPS request to each of your configured origins. Azure Front Door then uses these responses from the probe to determine the "best" origin to route your client requests. 

> [!WARNING]
> Since each Azure Front Door edge POP emits health probes to your origins, the health probe volume for your origins can be quite high. The number of probes depends on your customer's traffic location and your health probe frequency. If the Azure Front Door edge POP doesn’t receive real traffic from your end users, the frequency of the health probe from the edge POP is decreased from the configured frequency. If there is customer traffic to all the Azure Front Door edge POP, the health probe volume can be high depending on your health probes frequency.
>
> An example to roughly estimate the health probe volume per minute to your origin when using the default probe frequency of 30 seconds. The probe volume on each of your origin is equal to the number of edge POPs times two requests per minute. The probing requests will be less if there is no traffic sent to all of the edge POPs. For a list of edge locations, see [edge locations by region](edge-locations-by-region.md) for Azure Front Door. There could be more than one POP in each edge location. 

> [!NOTE]
> Azure Front Door HTTP/HTTPS probes are sent with `User-Agent` header set with value: `Edge Health Probe`. 

## Supported protocols

Azure Front Door supports sending probes over either HTTP or HTTPS protocols. These probes are sent over the same TCP ports configured for routing client requests, and cannot be overridden.

## Supported HTTP methods for health probes

Azure Front Door supports the following HTTP methods for sending the health probes:

1. **GET:** The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI.
2. **HEAD:** The HEAD method is identical to GET except that the server MUST NOT return a message-body in the response. For new Front Door profiles, by default, the probe method is set as HEAD.

> [!NOTE]
> For lower load and cost on your backends, Front Door recommends using HEAD requests for health probes.

## Health probe responses

| Responses  | Description | 
| ------------- | ------------- |
| Determining Health  | A 200 OK status code indicates the backend is healthy. Everything else is considered a failure. If for any reason (including network failure) a valid HTTP response isn't received for a probe, the probe is counted as a failure.|
| Measuring Latency  | Latency is the wall-clock time measured from the moment immediately before we send the probe request to the moment when we receive the last byte of the response. We use a new TCP connection for each request, so this measurement isn't biased towards backends with existing warm connections.  |

## How Front Door determines backend health

Azure Front Door uses the same three-step process below across all algorithms to determine health.

1. Exclude disabled backends.

1. Exclude backends that have health probes errors:

    * This selection is done by looking at the last _n_ health probe responses. If at least _x_ are healthy, the backend is considered healthy.

    * _n_ is configured by changing the SampleSize property in load-balancing settings.

    * _x_ is configured by changing the SuccessfulSamplesRequired property in load-balancing settings.

1. For the sets of healthy backends in the backend pool, Front Door additionally measures and maintains the latency (round-trip time) for each backend.

> [!NOTE]
> If a single endpoint is a member of multiple backend pools, Azure Front Door optimizes the number of health probes sent to the backend to reduce the load on the backend. Health probe requests will be sent based on the lowest configured sample interval. The health of the endpoint in all pools will be determined by the responses from same health probes.

## Complete health probe failure

If health probes fail for every backend in a backend pool, then Front Door considers all backends unhealthy and routes traffic in a round robin distribution across all of them.

Once any backend returns to a healthy state, then Front Door will resume the normal load-balancing algorithm.

## Disabling health probes

If you have a single backend in your backend pool, you can choose to disable the health probes reducing the load on your application backend. Even if you have multiple backends in the backend pool but only one of them is in enabled state, you can disable health probes.

## Next steps

- Learn how to [create an Front Door profile](create-front-door-portal.md).
- Learn about Azure Front Door [routing architecture](front-door-routing-architecture.md).
