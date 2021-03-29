---
title: 'Azure Front Door Standard/Premium (Preview) Health probe monitoring'
description: This article helps you understand how Azure Front Door monitors the health of your backend.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# Azure Front Door Standard/Premium (Preview) Health probe monitoring

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door periodically sends an HTTP or HTTPS request to each of your backend. These requests allow Azure Front Door to determine the health of each endpoint in the backend pool. Front Door then uses these responses from the probe to determine the "best" backend resources to route your client requests. 

> [!WARNING]
> Since Front Door has many edge environments globally, health probe volume for your backends can be quite high - ranging from 25 requests every minute to as high as 1200 requests per minute, depending on the health probe frequency configured. With the default probe frequency of 30 seconds, the probe volume on your backend should be about 200 requests per minute.

## Supported protocols

Front Door supports sending probes over either HTTP or HTTPS protocols.​ These probes are sent over the same TCP ports configured for routing client requests, and cannot be overridden.

## Supported HTTP methods for health probes

Front Door supports the following HTTP methods for sending the health probes:

* **GET:** The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI.
* **HEAD:** The HEAD method is identical to GET except that the server MUST NOT return a message-body in the response. For new Front Door profiles, by default, the probe method is set as HEAD.

> [!NOTE]
> For lower load and cost on your backends, Front Door recommends using HEAD requests for health probes.

## Health probe responses

| Responses  | Description | 
| ------------- | ------------- |
| Determining Health  |  ​A 200 OK status code indicates the backend is healthy. Everything else is considered a failure. If for any reason (including network failure) a valid HTTP response isn't received for a probe, the probe is counted as a failure.|
| Measuring Latency  | Latency is the wall-clock time measured from the moment immediately before we send the probe request to the moment when we receive the last byte of the response. We use a new TCP connection for each request, so this measurement isn't biased towards backends with existing warm connections.  |

## How Front Door determines backend health

Azure Front Door uses the same three-step process below across all algorithms to determine health.

1. Exclude disabled backends.

1. Exclude backends that have health probes errors:

    * This selection is done by looking at the last _n_ health probe responses. If at least _x_ are healthy, the backend is considered healthy.

    * _n_ is configured by changing the SampleSize property in load-balancing settings.

    * _x_ is configured by changing the SuccessfulSamplesRequired property in load-balancing settings.

1. For the sets of healthy backends in the backend pool, Front Door additionally measures and maintains the latency (round-trip time) for each backend.


## Complete health probe failure

If health probes fail for every backend in a backend pool, then Front Door considers all backends healthy and routes traffic in a round robin distribution across all of them.

Once any backend returns to a healthy state, then Front Door will resume the normal load-balancing algorithm.

## Disabling health probes

If you have a single backend in your backend pool or only one backend is active in a backend pool, then you can choose to disable the health probes. By doing so, you'll reduce the load on your application backend.

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
