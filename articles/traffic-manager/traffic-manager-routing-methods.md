---
title: Azure Traffic Manager - traffic routing methods | Microsoft Docs
description: This articles will help you understand the different traffic routing methods used by Traffic Manager
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: timlt
editor: ''

ms.assetid: db1efbf6-6762-4c7a-ac99-675d4eeb54d0
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/20/2017
ms.author: kumud
---

# Traffic Manager routing methods

Azure Traffic Manager supports three traffic-routing methods to determine how to route network traffic to the various service endpoints. Traffic Manager applies the traffic-routing method to each DNS query it receives. The traffic-routing method determines which endpoint returned in the DNS response.

There are three traffic routing methods available in Traffic Manager:

* **Priority:** Select 'Priority' when you want to use a primary service endpoint for all traffic, and provide backups in case the primary or the backup endpoints are unavailable.
* **Weighted:** Select 'Weighted' when you want to distribute traffic across a set of endpoints, either evenly or according to weights, which you define.
* **Performance:** Select 'Performance' when you have endpoints in different geographic locations and you want end users to use the "closest" endpoint in terms of the lowest network latency.

All Traffic Manager profiles include monitoring of endpoint health and automatic endpoint failover. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md). A single Traffic Manager profile can use only one traffic routing method. You can select a different traffic routing method for your profile at any time. Changes are applied within one minute, and no downtime is incurred. Traffic-routing methods can be combined by using nested Traffic Manager profiles. Nesting enables sophisticated and flexible traffic-routing configurations that meet the needs of larger, complex applications. For more information, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

## Priority traffic-routing method

Often an organization wants to provide reliability for its services by deploying one or more backup services in case their primary service goes down. The 'Priority' traffic-routing method allows Azure customers to easily implement this failover pattern.

![Azure Traffic Manager 'Priority' traffic-routing method][1]

The Traffic Manager profile contains a prioritized list of service endpoints. By default, Traffic Manager sends all traffic to the primary (highest-priority) endpoint. If the primary endpoint is not available, Traffic Manager routes the traffic to the second endpoint. If both the primary and secondary endpoints are not available, the traffic goes to the third, and so on. Availability of the endpoint is based on the configured status (enabled or disabled) and the ongoing endpoint monitoring.

### Configuring endpoints

With Azure Resource Manager, you configure the endpoint priority explicitly using the 'priority' property for each endpoint. This property is a value between 1 and 1000. Lower values represent a higher priority. Endpoints cannot share priority values. Setting the property is optional. When omitted, a default priority based on the endpoint order is used.

## Weighted traffic-routing method
The 'Weighted' traffic-routing method allows you to distribute traffic evenly or to use a pre-defined weighting.

![Azure Traffic Manager 'Weighted' traffic-routing method][2]

In the Weighted traffic-routing method, you assign a weight to each endpoint in the Traffic Manager profile configuration. The weight is an integer from 1 to 1000. This parameter is optional. If omitted, Traffic Managers uses a default weight of '1'.

For each DNS query received, Traffic Manager randomly chooses an available endpoint. The probability of choosing an endpoint is based on the weights assigned to all available endpoints. Using the same weight across all endpoints results in an even traffic distribution. Using higher or lower weights on specific endpoints causes those endpoints to be returned more or less frequently in the DNS responses.

The weighted method enables some useful scenarios:

* Gradual application upgrade: Allocate a percentage of traffic to route to a new endpoint, and gradually increase the traffic over time to 100%.
* Application migration to Azure: Create a profile with both Azure and external endpoints. Adjust the weight of the endpoints to prefer the new endpoints.
* Cloud-bursting for additional capacity: Quickly expand an on-premises deployment into the cloud by putting it behind a Traffic Manager profile. When you need extra capacity in the cloud, you can add or enable more endpoints and specify what portion of traffic goes to each endpoint.

The Resource Manager Azure portal supports the configuration of weighted traffic routing.  You can configure weights using the Resource Manager versions of Azure PowerShell, CLI, and the REST APIs.

It is important to understand that DNS responses are cached by clients and by the recursive DNS servers that the clients use to resolve DNS names. This caching can have an impact on weighted traffic distributions. When the number of clients and recursive DNS servers is large, traffic distribution works as expected. However, when the number of clients or recursive DNS servers is small, caching can significantly skew the traffic distribution.

Common use cases include:

* Development and testing environments
* Application-to-application communications
* Applications aimed at a narrow user-base that share a common recursive DNS infrastructure (for example, employees of company connecting through a proxy)

These DNS caching effects are common to all DNS-based traffic routing systems, not just Azure Traffic Manager. In some cases, explicitly clearing the DNS cache may provide a workaround. In other cases, an alternative traffic-routing method may be more appropriate.

## Performance traffic-routing method

Deploying endpoints in two or more locations across the globe can improve the responsiveness of many applications by routing traffic to the location that is 'closest' to you. The 'Performance' traffic-routing method provides this capability.

![Azure Traffic Manager 'Performance' traffic-routing method][3]

The 'closest' endpoint is not necessarily closest as measured by geographic distance. Instead, the 'Performance' traffic-routing method determines the closest endpoint by measuring network latency. Traffic Manager maintains an Internet Latency Table to track the round-trip time between IP address ranges and each Azure datacenter.

Traffic Manager looks up the source IP address of the incoming DNS request in the Internet Latency Table. Traffic Manager chooses an available endpoint in the Azure datacenter that has the lowest latency for that IP address range, then returns that endpoint in the DNS response.

As explained in [How Traffic Manager Works](traffic-manager-how-traffic-manager-works.md), Traffic Manager does not receive DNS queries directly from clients. Rather, DNS queries come from the recursive DNS service that the clients are configured to use. Therefore, the IP address used to determine the 'closest' endpoint is not the client's IP address, but it is the IP address of the recursive DNS service. In practice, this IP address is a good proxy for the client.


Traffic Manager regularly updates the Internet Latency Table to account for changes in the global Internet and new Azure regions. However, application performance varies based on real-time variations in load across the Internet. Performance traffic-routing does not monitor load on a given service endpoint. However, if an endpoint becomes unavailable, Traffic Manager does not include it in DNS query responses.


Points to note:

* If your profile contains multiple endpoints in the same Azure region, then Traffic Manager distributes traffic evenly across the available endpoints in that region. If you prefer a different traffic distribution within a region, you can use [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).
* If all enabled endpoints in a given Azure region are degraded, Traffic Manager distributes traffic across all other available endpoints instead of the next-closest endpoint. This logic prevents a cascading failure from occurring by not overloading the next-closest endpoint. If you want to define a preferred failover sequence, use [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).
* When using the Performance traffic routing method with external endpoints or nested endpoints, you need to specify the location of those endpoints. Choose the Azure region closest to your deployment. Those locations are the values supported by the Internet Latency Table.
* The algorithm that chooses the endpoint is deterministic. Repeated DNS queries from the same client are directed to the same endpoint. Typically, clients use different recursive DNS servers when traveling. The client may be routed to a different endpoint. Routing can also be affected by updates to the Internet Latency Table. Therefore, the Performance traffic-routing method does not guarantee that a client is always routed to the same endpoint.
* When the Internet Latency Table changes, you may notice that some clients are directed to a different endpoint. This routing change is more accurate based on current latency data. These updates are essential to maintain the accuracy of Performance traffic-routing as the Internet continually evolves.

## Nested Traffic Manager profiles

Traffic Manager includes a range of traffic-routing methods that allow you to control how Traffic Manager chooses which endpoint should receive traffic from each end user. For more information, see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

Each Traffic Manager profile specifies a single traffic-routing method. However, there are scenarios that require more sophisticated traffic routing than the routing provided by a single Traffic Manager profile. You can nest Traffic Manager profiles to combine the benefits of more than one traffic-routing method. Nested profiles allow you to override the default Traffic Manager behavior to support larger and more complex application deployments.

The following examples illustrate how to use nested Traffic Manager profiles in various scenarios.

### Example 1: Combining 'Performance' and 'Weighted' traffic routing

Suppose that you deployed an application in the following Azure regions: West US, West Europe, and East Asia. You use Traffic Manager's 'Performance' traffic-routing method to distribute traffic to the region closest to the user.

![Single Traffic Manager profile][4]

Now, suppose you wish to test an update to your service before rolling it out more widely. You want to use the 'weighted' traffic-routing method to direct a small percentage of traffic to your test deployment. You set up the test deployment alongside the existing production deployment in West Europe.

You cannot combine both 'Weighted' and 'Performance traffic-routing in a single profile. To support this scenario, you create a Traffic Manager profile using the two West Europe endpoints and the 'Weighted' traffic-routing method. Next, you add this 'child' profile as an endpoint to the 'parent' profile. The parent profile still uses the Performance traffic-routing method and contains the other global deployments as endpoints.

The following diagram illustrates this example:

![Nested Traffic Manager profiles][5]

In this configuration, traffic directed via the parent profile distributes traffic across regions normally. Within West Europe, the nested profile distributes traffic to the production and test endpoints according to the weights assigned.

When the parent profile uses the 'Performance' traffic-routing method, each endpoint must be assigned a location. The location is assigned when you configure the endpoint. Choose the Azure region closest to your deployment. The Azure regions are the location values supported by the Internet Latency Table. For more information, see [Traffic Manager 'Performance' traffic-routing method](traffic-manager-routing-methods.md#performance-traffic-routing-method).

### Example 2: Endpoint monitoring in Nested Profiles

Traffic Manager actively monitors the health of each service endpoint. If an endpoint is unhealthy, Traffic Manager directs users to alternative endpoints to preserve the availability of your service. This endpoint monitoring and failover behavior applies to all traffic-routing methods. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md). Endpoint monitoring works differently for nested profiles. With nested profiles, the parent profile doesn't perform health checks on the child directly. Instead, the health of the child profile's endpoints is used to calculate the overall health of the child profile. This health information is propagated up the nested profile hierarchy. The parent profile uses this aggregated health to determine whether to direct traffic to the child profile. See the [FAQ](#faq) section of this article for full details on health monitoring of nested profiles.

Returning to the previous example, suppose the production deployment in West Europe fails. By default, the 'child' profile directs all traffic to the test deployment. If the test deployment also fails, the parent profile determines that the child profile should not receive traffic since all child endpoints are unhealthy. Then, the parent profile distributes traffic to the other regions.

![Nested Profile failover (default behavior)][6]

You might be happy with this arrangement. Or you might be concerned that all traffic for West Europe is now going to the test deployment instead of a limited subset traffic. Regardless of the health of the test deployment, you want to fail over to the other regions when the production deployment in West Europe fails. To enable this failover, you can specify the 'MinChildEndpoints' parameter when configuring the child profile as an endpoint in the parent profile. The parameter determines the minimum number of available endpoints in the child profile. The default value is '1'. For this scenario, you set the MinChildEndpoints value to 2. Below this threshold, the parent profile considers the entire child profile to be unavailable and directs traffic to the other endpoints.

The following figure illustrates this configuration:

![Nested Profile failover with 'MinChildEndpoints' = 2][7]

> [!NOTE]
> The 'Priority' traffic-routing method distributes all traffic to a single endpoint. Thus there is little purpose in a MinChildEndpoints setting other than '1' for a child profile.

### Example 3: Prioritized failover regions in 'Performance' traffic routing

The default behavior for the 'Performance' traffic-routing method is designed to avoid over-loading the next nearest endpoint and causing a cascading series of failures. When an endpoint fails, all traffic that would have been directed to that endpoint is evenly distributed to the other endpoints across all regions.

!['Performance' traffic routing with default failover][8]

However, suppose you prefer the West Europe traffic failover to West US, and only direct traffic to other regions when both endpoints are unavailable. You can create this solution using a child profile with the 'Priority' traffic-routing method.

!['Performance' traffic routing with preferential failover][9]

Since the West Europe endpoint has higher priority than the West US endpoint, all traffic is sent to the West Europe endpoint when both endpoints are online. If West Europe fails, its traffic is directed to West US. With the nested profile, traffic is directed to East Asia only when both West Europe and West US fail.

You can repeat this pattern for all regions. Replace all three endpoints in the parent profile with three child profiles, each providing a prioritized failover sequence.

### Example 4: Controlling 'Performance' traffic routing between multiple endpoints in the same region

Suppose the 'Performance' traffic-routing method is used in a profile that has more than one endpoint in a particular region. By default, traffic directed to that region is distributed evenly across all available endpoints in that region.

!['Performance' traffic routing in-region traffic distribution (default behavior)][10]

Instead of adding multiple endpoints in West Europe, those endpoints are enclosed in a separate child profile. The child profile is added to the parent as the only endpoint in West Europe. The settings on the child profile can control the traffic distribution with West Europe by enabling priority-based or weighted traffic routing within that region.

!['Performance' traffic routing with custom in-region traffic distribution][11]

### Example 5: Per-endpoint monitoring settings

Suppose you are using Traffic Manager to smoothly migrate traffic from a legacy on-premises web site to a new Cloud-based version hosted in Azure. For the legacy site, you want to use the home page URI to monitor site health. But for the new Cloud-based version, you are implementing a custom monitoring page (path '/monitor.aspx') that includes additional checks.

![Traffic Manager endpoint monitoring (default behavior)][12]

The monitoring settings in a Traffic Manager profile apply to all endpoints within a single profile. With nested profiles, you use a different child profile per site to define different monitoring settings.

![Traffic Manager endpoint monitoring with per-endpoint settings][13]

## Next steps

Learn how to develop high-availability applications using [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md)

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md)

<!--Image references-->
[1]: ./media/traffic-manager-routing-methods/priority.png
[2]: ./media/traffic-manager-routing-methods/weighted.png
[3]: ./media/traffic-manager-routing-methods/performance.png
[4]: ./media/traffic-manager-nested-profiles/figure-1.png
[5]: ./media/traffic-manager-nested-profiles/figure-2.png
[6]: ./media/traffic-manager-nested-profiles/figure-3.png
[7]: ./media/traffic-manager-nested-profiles/figure-4.png
[8]: ./media/traffic-manager-nested-profiles/figure-5.png
[9]: ./media/traffic-manager-nested-profiles/figure-6.png
[10]: ./media/traffic-manager-nested-profiles/figure-7.png
[11]: ./media/traffic-manager-nested-profiles/figure-8.png
[12]: ./media/traffic-manager-nested-profiles/figure-9.png
[13]: ./media/traffic-manager-nested-profiles/figure-10.png

