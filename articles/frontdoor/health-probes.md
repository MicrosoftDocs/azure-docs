---
title: Health probes
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door monitors the health of your origins.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 01/29/2025
ms.author: duau
---

# Health probes

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

> [!NOTE]
> An *origin* and an *origin group* in this article refers to the backend and backend pool of an Azure Front Door (classic) configuration.
>

To determine the health and proximity of each origin for a given Azure Front Door environment, each Front Door profile periodically sends a synthetic HTTP/HTTPS request to all your configured origins. Front Door then uses responses from the health probe to determine the *best* origin to route your client requests to. 

> [!WARNING]
> Since each Azure Front Door edge location is sending health probes to your origins, the health probe volume for your origins can be high. The number of probes depends on your customer's traffic location and your health probe frequency. If the Azure Front Door edge locations don’t receive real traffic from your end users, the frequency of the health probe from the edge location is decreased from the configured frequency. If there's traffic to all the Azure Front Door edge locations, the health probe volume can be high depending on your health probes frequency.
>
> An example to roughly estimate the health probe volume per minute to an origin when using the default probe frequency of 30 seconds. The probe volume on each of your origin is equal to the number of edge locations times two requests per minute. The probing requests are less if there's no traffic sent to all of the edge locations. For a list of edge locations, see [edge locations by region](edge-locations-by-region.md).

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
> If a single endpoint is a member of multiple origin groups, Front Door optimizes the number of health probes sent to the origin to reduce the load on the origin. Health probe requests are sent based on the lowest configured sample interval. The responses from same health probes determine the health of the endpoint in all origin groups.

## Adjusting probe settings for long-starting containers

When you deal with long-starting containers, adjusting the probe settings can prevent premature failure. Increasing the `ProbeTimeout` and `Interval` values gives your containers more time to start before Front Door marks them as unhealthy.

### Values for long-starting containers
- **ProbeTimeout**: Increase the timeout period to 10–30 seconds.
- **Interval**: Set a longer interval (for example, 30–60 seconds) between probes.
- **UnhealthyThreshold**: Increase the number of consecutive failed probes before the container is considered unhealthy (for example, 3-5 retries).

> [!NOTE]
> The values provided for `ProbeTimeout`, `Interval`, and `UnhealthyThreshold` are sample ranges for example purposes. You can adjust these values based on your specific container's startup behavior and requirements.

> [!NOTE] 
> These changes might cause a delay in detecting real failures, so balance these values carefully according to your container's startup behavior.

## Probe interaction during container lifecycle phases

1. **Container Start Phase**: During this phase, the container might not be fully ready to serve traffic. Health probes help detect when a container isn't responding by checking for specific HTTP status codes (for example, `200 OK`). If the probe frequency is too high or the timeout is too short, the container is marked as unhealthy before initialization. Increase probe timeouts or intervals during this phase.

1. **Running Phase**: Once the container is running, probes continue checking for health responses. If health checks consistently return `200 OK`, Front Door keeps the origin in rotation for traffic. If probes consistently fail (for example, due to a container crashing), Front Door marks the origin as unhealthy.

1. **Failure Phase**: If health probes fail for the configured threshold (for example, `UnhealthyThreshold`), the origin is considered unhealthy, and traffic is routed to other healthy origins.

## Complete health probe failure

If health probes fail for every origin in an origin group, then Front Door considers all origins unhealthy and routes traffic in a round robin distribution across all of them.

Once an origin returns to a healthy state, Front Door resumes the normal load-balancing algorithm.

## Disabling health probes

If you have a single origin in your origin group, you can choose to disable health probes to reduce the load on your application. If you have multiple origins in your origin group and more than one of them is in enabled state, you can't disable health probes.

> [!NOTE]
> If there's only a single origin in your origin group, the single origin gets few health probes. This might lead to a dip in origin health metrics but your traffic doesn't get impacted.

## Next steps

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn about [Front Door routing architecture](front-door-routing-architecture.md).

