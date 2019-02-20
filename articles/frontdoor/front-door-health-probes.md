---
title: Azure Front Door Service - backend health monitoring | Microsoft Docs
description: This article helps you understand how Azure Front Door Service monitors the health of your backends
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# ​​Health probes

In order to determine the health of each backend, each Front Door environment periodically sends a synthetic HTTP/HTTPS request to each of your configured backends. Front Door then uses responses from these probes to determine the "best" backends to which it should route real client requests.


## Supported protocols

Front Door supports sending probes over either HTTP or HTTPS protocols.​ These probes are sent over the same TCP ports configured for routing client requests, and cannot be overridden.

## Health probe responses

| Responses  | Description | 
| ------------- | ------------- |
| Determining Health  |  ​A 200 OK status code indicates the backend is healthy. Everything else is considered a failure. If for any reason (including network failure) a valid HTTP response is not received for a probe, the probe is counted as a failure.|
| Measuring Latency  | Latency is the wall-clock time measured from the moment immediately before we send the probe request to the moment when we receive the last byte of the response. We use a new TCP connection for each request, so this measurement is not biased towards backends with existing warm connections.  |

## How Front Door determines backend health

Azure Front Door Service uses the same three-step process below across all algorithms to determine health.

1. ​Exclude disabled backends.

2. Exclude backends that have health probes errors:
    * ​​​​This selection is done by looking at the last _n_ health probe responses. If at least _x_ are healthy, the backend is considered healthy.

    * _n_ is configured by changing the SampleSize property in load balancing settings.

    * _x_ is configured by changing the SuccessfulSamplesRequired property in load balancing settings.

3. Out of the set of healthy backends in the backend pool, Front Door additionally measures and maintains the latency (round-trip time) for each backend.


## Complete health probe failure

If health probes fail for every backend in a backend pool, then Front Door considers all backends healthy and routes traffic in a round robin distribution across all of them.

Once any backend returns to a healthy state, then Front Door will resume the normal load balancing algorithm.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
