---
title: Azure Front Door - traffic routing methods | Microsoft Docs
description: This article helps you understand the different traffic routing methods used by Front Door
services: front-door
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/14/2021
ms.author: duau
---

# Front Door routing methods

Azure Front Door supports different kinds of traffic-routing methods to determine how to route your HTTP/HTTPS traffic to different service endpoints. When your client requests reaching Front Door, the configured routing method gets applied to ensure the requests are forwarded to the best backend instance. 

There are four traffic routing methods available in Front Door:

* **[Latency](#latency):** The latency-based routing ensures that requests are sent to the lowest latency backends acceptable within a sensitivity range. Basically, your user requests are sent to the "closest" set of backends in respect to network latency.
* **[Priority](#priority):** You can assign priorities to your backends when you want to configure a primary backend to service all traffic. The secondary backend can be a backup in case the primary backend becomes unavailable.
* **[Weighted](#weighted):** You can assign weights to your backends when you want to distribute traffic across a set of backends evenly or according to the weight coefficients. Traffic is distributed as per weights if the latencies of the backends are within the acceptable latency sensitivity range in the backend pool.
* **[Session Affinity](#affinity):** You can configure session affinity for your frontend hosts or domains to ensure requests from the same end user gets sent to the same backend.

All Front Door configurations include monitoring of backend health and automated instant global failover. For more information, see [Front Door Backend Monitoring](front-door-health-probes.md). Your Front Door can work based off of a single routing method. But depending on your application needs, you can also combine multiple routing methods to build an optimal routing topology.

## <a name = "latency"></a>Lowest latencies based traffic-routing

Deploying backends in two or more locations across the globe can improve the responsiveness of your applications by routing traffic to the destination that is 'closest' to your end users. The default traffic-routing method for your Front Door configuration forwards requests from your end users to the closest backend of the Front Door environment that received the request. Combined with the Anycast architecture of Azure Front Door, this approach ensures that each of your end users get maximum performance personalized based on their location.

The 'closest' backend isn't necessarily closest as measured by geographic distance. Instead, Front Door determines the closest backends by measuring network latency. Read more about [Front Door's routing architecture](front-door-routing-architecture.md). 

Below is the overall decision flow:

| Available backends | Priority | Latency signal (based on health probe) | Weights |
|-------------| ----------- | ----------- | ----------- |
| First, select all backends that are enabled and returned healthy (200 OK) for the health probe. If there are six backends A, B, C, D, E, and F, and among them C is unhealthy and E is disabled. The list of available backends is A, B, D, and F.  | Next, the top priority backends among the available ones are selected. If backend A, B, and D have priority 1 and backend F has a priority of 2. Then, the selected backends will be A, B, and D.| Select the backends with latency range (least latency & latency sensitivity in ms specified). If backend A is 15 ms, B is 30 ms and D is 60 ms away from the Front Door environment where the request landed, and latency sensitivity is 30 ms, then the lowest latency pool consist of backend A and B, because D is beyond 30 ms away from the closest backend that is A. | Lastly, Front Door will round robin the traffic among the final selected pool of backends in the ratio of weights specified. Say, if backend A has a weight of 5 and backend B has a weight of 8, then the traffic will be distributed in the ratio of 5:8 among backends A and B. |

>[!NOTE]
> By default, the latency sensitivity property is set to 0 ms, that is, request is always forwarded to the fastest available backend and weights on the backends will not take effect unless two backends have the same network latency.

## <a name = "priority"></a>Priority-based traffic-routing

Often an organization wants to provide high availability for their services by deploying more than one backup service in case the primary one goes down. Across the industry, this topology is also referred to as Active/Standby or Active/Passive deployment topology. The 'Priority' traffic-routing method allows Azure customers to easily implement this failover pattern.

Your default Front Door contains an equal priority list of backends. By default, Front Door sends traffic only to the top priority backends (lowest value for priority) that is, the primary set of backends. If the primary backends aren't available, Front Door routes the traffic to the secondary set of backends (second lowest value for priority). If both the primary and secondary backends aren't available, the traffic goes to the third, and so on. Availability of the backend is based on the configured status (enabled or disabled) and the ongoing backend health status as determined by the health probes.

### Configuring priority for backends

Each backend in your backend pool of the Front Door configuration has a property called 'Priority', which can be a number between 1 and 5. With Azure Front Door, you configure the backend priority explicitly using this property for each backend. This property is a value between 1 and 5. Lower values represent a higher priority. Backends can share priority values.

## <a name = "weighted"></a>Weighted traffic-routing method
The 'Weighted' traffic-routing method allows you to distribute traffic evenly or to use a pre-defined weighting.

In the Weighted traffic-routing method, you assign a weight to each backend in the Front Door configuration of your backend pool. The weight is an integer from 1 to 1000. This parameter uses a default weight of '50'.

With the list of available backends that have an acceptable latency sensitivity, the traffic gets distributed with a round-robin mechanism using the ratio of weights specified. If the latency sensitivity gets set to 0 milliseconds, then this property doesn't take effect unless there are two backends with the same network latency. 

The weighted method enables some useful scenarios:

* **Gradual application upgrade**: Gives a percentage of traffic to route to a new backend, and gradually increase the traffic over time to bring it at par with other backends.
* **Application migration to Azure**: Create a backend pool with both Azure and external backends. Adjust the weight of the backends to prefer the new backends. You can gradually set this up starting with having the new backends disabled, then assigning them the lowest weights, slowly increasing it to levels where they take most traffic. Then finally disabling the less preferred backends and removing them from the pool.  
* **Cloud-bursting for additional capacity**: Quickly expand an on-premises deployment into the cloud by putting it behind Front Door. When you need extra capacity in the cloud, you can add or enable more backends and specify what portion of traffic goes to each backend.

## <a name = "affinity"></a>Session Affinity
By default, without session affinity, Front Door forwards requests originating from the same client to different backends. Some stateful applications or in certain scenarios ensuing requests from the same user prefers the same backend that processed the initial request. The cookie-based session affinity feature is useful when you want to keep a user session on the same backend. Using managed cookies, Azure Front Door can direct ensuing traffic from a user session to the same backend for processing.

Session affinity can be enabled at a frontend host level that is for each of your configured domains (or subdomains). Once enabled, Front Door adds a cookie to the user's session. Cookie-based session affinity allows Front Door to identify different users even if behind the same IP address, which in turn allows a more even distribution of traffic between your different backends.

The lifetime of the cookie is the same as the user's session, as Front Door currently only supports session cookie. 

> [!NOTE]
> Public proxies may interfere with session affinity. This is because establishing a session requires Front Door to add a session affinity cookie to the response, which cannot be done if the response is cacheable as it would disrupt the cookies of other clients requesting the same resource. To protect against this, session affinity will **not** be established if the backend sends a cacheable response when this is attempted. If the session has already been established, it does not matter if the response from the backend is cacheable.
> Session affinity will be established in the following circumstances, **unless** the response has an HTTP 304 status code:
> - The response has specific values set for the ```Cache-Control``` header that prevents caching, such as "private" or no-store".
> - The response contains an ```Authorization``` header that has not expired.
> - The response has an HTTP 302 status code.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
