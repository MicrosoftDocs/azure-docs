---
title: Traffic routing methods to origin
titleSuffix: Azure Front Door
description: This article explains the four different traffic routing methods used by Azure Front Door to origin.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/08/2022
ms.author: duau
---

# Traffic routing methods to origin

Azure Front Door supports four different traffic routing methods to determine how your HTTP/HTTPS traffic is distributed between different origins. When user requests reach the Front Door edge locations, the configured routing method gets applied to ensure requests are forwarded to the best backend resource.

> [!NOTE]
> An *Origin* and a *origin group* in this article refers to the backend and backend pool of the Azure Front Door (classic) configuration.
>

The four traffic routing methods are:

* **[Latency](#latency):** The latency-based routing ensures that requests are sent to the lowest latency origins acceptable within a sensitivity range. In other words, requests get sent to the nearest set of origins in respect to network latency.

* **[Priority](#priority):** A priority can be set to your origins when you want to configure a primary origin to service all traffic. The secondary origin can be a backup in case the primary origin becomes unavailable.

* **[Weighted](#weighted):** A weighted value can be assigned to your origins when you want to distribute traffic across a set of origins evenly or according to the weight coefficients. Traffic gets distributed by the weight value if the latencies of the origins are within the acceptable latency sensitivity range in the origin group.

* **[Session Affinity](#affinity):** You can configure session affinity for your frontend hosts or domains to ensure requests from the same end user gets sent to the same origin.

> [!NOTE]
> **Endpoint name** in Azure Front Door Standard and Premium tier is called **Frontend host** in Azure Front Door (classic).
>

All Front Door configurations have backend health monitoring and automated instant global failover. For more information, see [Front Door backend monitoring](front-door-health-probes.md). Azure Front Door can be used with a single routing method. Depending on your application needs, you can combine multiple routing methods to build an optimal routing topology.

> [!NOTE]
> When you use the [Front Door rules engine](front-door-rules-engine.md), you can configure a rule to [override route configurations](front-door-rules-engine-actions.md#route-configuration-overrides) in Azure Front Door Standard and Premium tier or [override the backend pool](front-door-rules-engine-actions.md#route-configuration-overrides) in Azure Front Door (classic) for a request. The origin group or backend pool set by the rules engine overrides the routing process described in this article.

## Overall decision flow

The following diagram shows the overall decision flow:

:::image type="content" source="./media/routing-methods/routing.png" alt-text="Diagram explaining how origins are selected based on priority, latency and weight settings in Azure Front Door." lightbox="./media/routing-methods/routing-expanded.png":::

The decision steps are:

1. **Available origins:** Select all origins that are enabled and returned healthy (200 OK) for the health probe.
   - *Example: Suppose there are six origins A, B, C, D, E, and F, and among them C is unhealthy and E is disabled. The list of available origins is A, B, D, and F.*
1. **Priority:** The top priority origins among the available ones are selected.
   - *Example: Suppose origin A, B, and D have priority 1 and origin F has a priority of 2. Then, the selected origins will be A, B, and D.*
1. **Latency signal (based on health probe):** Select the origins within the allowable latency range from the Front Door environment where the request arrived. This signal is based on the latency sensitivity setting on the origin group, as well as the latency of the closer origins.
   - *Example: Suppose Front Door has measured the latency from the environment where the request arrived to origin A at 15 ms, while the latency for B is 30 ms and D is 60 ms away. If the origin group's latency sensitivity is set to 30 ms, then the lowest latency pool consists of origins A and B, because D is beyond 30 ms away from the closest origin that is A.*
1. **Weights:** Lastly, Azure Front Door will round robin the traffic among the final selected group of origins in the ratio of weights specified.
   - *Example: If origin A has a weight of 3 and origin B has a weight of 7, then the traffic will be distributed 3/10 to origins A and 7/10 to origin B.*

If session affinity is enabled, then the first request in a session follows the flow listed above. Subsequent requests are sent to the origin selected in the first request.

## <a name = "latency"></a>Lowest latencies based traffic-routing

Deploying origins in two or more locations across the globe can improve the responsiveness of your applications by routing traffic to the destination that is 'closest' to your end users. Latency is the default traffic-routing method for your Front Door configuration. This routing method forwards requests from your end users to the closest origin behind Azure Front Door. This routing mechanism combined with the anycast architecture of Azure Front Door ensures that each of your end users gets the best performance based on their location.

The 'closest' origin isn't necessarily closest as measured by geographic distance. Instead, Azure Front Door determines the closest origin by measuring network latency. Read more about [Azure Front Door routing architecture](front-door-routing-architecture.md). 

Each Front Door environment measures the origin latency separately. This means that different users in different locations are routed to the origin with the best performance for that environment.

>[!NOTE]
> By default, the latency sensitivity property is set to 0 ms. With this setting the request is always forwarded to the fastest available origins and weights on the origin don't take effect unless two origins have the same network latency.
>

## <a name = "priority"></a>Priority-based traffic-routing

Often an organization wants to provide high availability for their services by deploying more than one backup service in case the primary one goes down. Across the industry, this type of topology is also referred to as Active/Standby or Active/Passive deployment. The *Priority* traffic-routing method allows you to easily implement this failover pattern.

The default Azure Front Door contains an equal priority list of origins. By default, Azure Front Door sends traffic only to the top priority origins (lowest value in priority) as the primary set of origins. If the primary origins aren't available, Azure Front Door routes the traffic to the secondary set of origins (second lowest value for priority). If both the primary and secondary origins aren't available, the traffic goes to the third, and so on. Availability of the origin is based on the configured status of enabled or disabled and the ongoing origin health status as determined by the health probes.

### Configuring priority for origins

Each origin in your origin group of the Azure Front Door configuration has a property called *Priority*, which can be a number between 1 and 5. With Azure Front Door, you can configure the origin priority explicitly using this property for each origin. This property is a value between 1 and 5. The lower the value the higher the priority. Origins can share the same priority values.

## <a name = "weighted"></a>Weighted traffic-routing method

The *Weighted* traffic-routing method allows you to distribute traffic evenly or to use a pre-defined weighting.

In the weighted traffic-routing method, you assign a weight to each origin in the Azure Front Door configuration of your origin group. The weight is an integer ranging from 1 to 1000. This parameter uses a default weight of **50**.

With the list of available origins that have an acceptable latency sensitivity, the traffic gets distributed with a round-robin mechanism using the ratio of weights specified. If the latency sensitivity gets set to 0 milliseconds, then this property doesn't take effect unless there are two origins with the same network latency. 

The weighted method enables some useful scenarios:

* **Gradual application upgrade**: Provides a percentage of traffic to route to a new origin, and gradually increase the traffic over time to bring it at par with other origins.
* **Application migration to Azure**: Create an origin group with both Azure and external origins. Adjust the weight of the origins to prefer the new origins. You can gradually set this up starting with having the new origins disabled, then assigning them the lowest weights, slowly increasing it to levels where they take most traffic. Then finally disabling the less preferred origins and removing them from the group.  
* **Cloud-bursting for additional capacity**: Quickly expand an on-premises deployment into the cloud by putting it behind Front Door. When you need extra capacity in the cloud, you can add or enable more origins and specify what portion of traffic goes to each origin.

## <a name = "affinity"></a>Session affinity

By default, without session affinity, Azure Front Door forwards requests originating from the same client to different origins. Certain stateful applications or in certain scenarios when ensuing requests from the same user prefers the same origin to process the initial request. The cookie-based session affinity feature is useful when you want to keep a user session on the same origin. When you use managed cookies with SHA256 of the origin URL as the identifier in the cookie, Azure Front Door can direct ensuing traffic from a user session to the same origin for processing.

Session affinity can be enabled the origin group level in Azure Front Door Standard and Premium tier and front end host level in Azure Front Door (classic) for each of your configured domains (or subdomains). Once enabled, Azure Front Door adds a cookie to the user's session. The cookies are called ASLBSA and ASLBSACORS. Cookie-based session affinity allows Front Door to identify different users even if behind the same IP address, which in turn allows a more even distribution of traffic between your different origins.

The lifetime of the cookie is the same as the user's session, as Front Door currently only supports session cookie. 

> [!NOTE]
> Regardless of where it is configured, session affinity is remembered through the browser session cookie at the domain level. Subdomains under the same wildcard domain can share the session affinity so long as the same user browser send requests for the same origin resource. 
>
> Public proxies may interfere with session affinity. This is because establishing a session requires Front Door to add a session affinity cookie to the response, which cannot be done if the response is cacheable as it would disrupt the cookies of other clients requesting the same resource. To protect against this, session affinity will **not** be established if the origin sends a cacheable response when this is attempted. If the session has already been established, it does not matter if the response from the origin is cacheable.
>
> Session affinity will be established in the following circumstances beyond the standard non-cacheable scenarios:
> - The response must include the `Cache-Control` header of *no-store*.
> - If the response contains an `Authorization` header, it must not be expired.
> - The response is an HTTP 302 status code.

## Next steps

- Learn how to [create an Azure Front Door](quickstart-create-front-door.md).
- Learn [how Azure Front Door works](front-door-routing-architecture.md).
