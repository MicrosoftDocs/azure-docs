---
title: Nested Traffic Manager Profiles | Microsoft Docs
description: This article explains the 'Nested Profiles' feature of Azure Traffic Manager
services: traffic-manager
documentationcenter: ''
author: sdwheeler
manager: carmonm
editor: ''

ms.assetid: f1b112c4-a3b1-496e-90eb-41e235a49609
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/11/2016
ms.author: sewhee

---
# Nested Traffic Manager profiles
Traffic Manager includes a range of traffic-routing methods that allow you to control how Traffic Manager chooses which endpoint should receive traffic from each end user. For more information, see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

Each Traffic Manager profile specifies a single traffic-routing method. However, there are scenarios that require more sophisticated traffic routing than the routing provided by a single Traffic Manager profile. You can nest Traffic Manager profiles to combine the benefits of more than one traffic-routing method. Nested profiles allow you to override the default Traffic Manager behavior to support larger and more complex application deployments.

The following examples illustrate how to use nested Traffic Manager profiles in various scenarios.

## Example 1: Combining 'Performance' and 'Weighted' traffic routing
Suppose that you deployed an application in the following Azure regions: West US, West Europe, and East Asia. You use Traffic Manager's 'Performance' traffic-routing method to distribute traffic to the region closest to the user.

![Single Traffic Manager profile][1]

Now, suppose you wish to test an update to your service before rolling it out more widely. You want to use the 'weighted' traffic-routing method to direct a small percentage of traffic to your test deployment. You set up the test deployment alongside the existing production deployment in West Europe.

You cannot combine both 'Weighted' and 'Performance traffic-routing in a single profile. To support this scenario, you create a Traffic Manager profile using the two West Europe endpoints and the 'Weighted' traffic-routing method. Next, you add this 'child' profile as an endpoint to the 'parent' profile. The parent profile still uses the Performance traffic-routing method and contains the other global deployments as endpoints.

The following diagram illustrates this example:

![Nested Traffic Manager profiles][2]

In this configuration, traffic directed via the parent profile distributes traffic across regions normally. Within West Europe, the nested profile distributes traffic to the production and test endpoints according to the weights assigned.

When the parent profile uses the 'Performance' traffic-routing method, each endpoint must be assigned a location. The location is assigned when you configure the endpoint. Choose the Azure region closest to your deployment. The Azure regions are the location values supported by the Internet Latency Table. For more information, see [Traffic Manager 'Performance' traffic-routing method](traffic-manager-routing-methods.md#performance-traffic-routing-method).

## Example 2: Endpoint monitoring in Nested Profiles
Traffic Manager actively monitors the health of each service endpoint. If an endpoint is unhealthy, Traffic Manager directs users to alternative endpoints to preserve the availability of your service. This endpoint monitoring and failover behavior applies to all traffic-routing methods. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md). Endpoint monitoring works differently for nested profiles. With nested profiles, the parent profile doesn't perform health checks on the child directly. Instead, the health of the child profile's endpoints is used to calculate the overall health of the child profile. This health information is propagated up the nested profile hierarchy. The parent profile this aggregated health to determine whether to direct traffic to the child profile. See the [FAQ](#faq) section of this article for full details on health monitoring of nested profiles.

Returning to the previous example, suppose the production deployment in West Europe fails. By default, the 'child' profile directs all traffic to the test deployment. If the test deployment also fails, the parent profile determines that the child profile should not receive traffic since all child endpoints are unhealthy. Then, the parent profile distributes traffic to the other regions.

![Nested Profile failover (default behavior)][3]

You might be happy with this arrangement. Or you might be concerned that all traffic for West Europe is now going to the test deployment instead of a limited subset traffic. Regardless of the health of the test deployment, you want to fail over to the other regions when the production deployment in West Europe fails. To enable this failover, you can specify the 'MinChildEndpoints' parameter when configuring the child profile as an endpoint in the parent profile. The parameter determines the minimum number of available endpoints in the child profile. The default value is '1'. For this scenario, you set the MinChildEndpoints value to 2. Below this threshold, the parent profile considers the entire child profile to be unavailable and directs traffic to the other endpoints.

The following figure illustrates this configuration:

![Nested Profile failover with 'MinChildEndpoints' = 2][4]

> [!NOTE]
> The 'Priority' traffic-routing method distributes all traffic to a single endpoint. Thus there is little purpose in a MinChildEndpoints setting other than '1' for a child profile.
> 
> 

## Example 3: Prioritized failover regions in 'Performance' traffic routing
The default behavior for the 'Performance' traffic-routing method is designed to avoid over-loading the next nearest endpoint and causing a cascading series of failures. When an endpoint fails, all traffic that would have been directed to that endpoint is evenly distributed to the other endpoints across all regions.

!['Performance' traffic routing with default failover][5]

However, suppose you prefer the West Europe traffic failover to West US, and only direct traffic to other regions when both endpoints are unavailable. You can create this solution using a child profile with the 'Priority' traffic-routing method.

!['Performance' traffic routing with preferential failover][6]

Since the West Europe endpoint has higher priority than the West US endpoint, all traffic is sent to the West Europe endpoint when both endpoints are online. If West Europe fails, its traffic is directed to West US. With the nested profile, traffic is directed to East Asia only when both West Europe and West US fail.

You can repeat this pattern for all regions. Replace all three endpoints in the parent profile with three child profiles, each providing a prioritized failover sequence.

## Example 4: Controlling 'Performance' traffic routing between multiple endpoints in the same region
Suppose the 'Performance' traffic-routing method is used in a profile that has more than one endpoint in a particular region. By default, traffic directed to that region is distributed evenly across all available endpoints in that region.

!['Performance' traffic routing in-region traffic distribution (default behavior)][7]

Instead of adding multiple endpoints in West Europe, those endpoints are enclosed in a separate child profile. The child profile is added to the parent as the only endpoint in West Europe. The settings on the child profile can control the traffic distribution with West Europe by enabling priority-based or weighted traffic routing within that region.

!['Performance' traffic routing with custom in-region traffic distribution][8]

## Example 5: Per-endpoint monitoring settings
Suppose you are using Traffic Manager to smoothly migrate traffic from a legacy on-premises web site to a new Cloud-based version hosted in Azure. For the legacy site, you want to use the home page URI to monitor site health. But for the new Cloud-based version, you are implementing a custom monitoring page (path '/monitor.aspx') that includes additional checks.

![Traffic Manager endpoint monitoring (default behavior)][9]

The monitoring settings in a Traffic Manager profile apply to all endpoints within a single profile. With nested profiles, you use a different child profile per site to define different monitoring settings.

![Traffic Manager endpoint monitoring with per-endpoint settings][10]

## FAQ
### How do I configure nested profiles?
Nested Traffic Manager profiles can be configured using both the Azure Resource Manager and the classic Azure REST APIs, Azure PowerShell cmdlets and cross-platform Azure CLI commands. They are also supported via the new Azure portal. They are not supported in the classic portal.

### How many layers of nesting does Traffic Manger support?
You can nest profiles up to 10 levels deep. 'Loops' are not permitted.

### Can I mix other endpoint types with nested child profiles, in the same Traffic Manager profile?
Yes. There are no restrictions on how you combine endpoints of different types within a profile.

### How does the billing model apply for Nested profiles?
There is no negative pricing impact of using nested profiles.

Traffic Manager billing has two components: endpoint health checks and millions of DNS queries

* Endpoint health checks: There is no charge for a child profile when configured as an endpoint in a parent profile. Monitoring of the endpoints in the child profile are billed in the usual way.
* DNS queries: Each query is only counted once. A query against a parent profile that returns an endpoint from a child profile is counted against the parent profile only.

For full details, see the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).

### Is there a performance impact for nested profiles?
No. There is no performance impact incurred when using nested profiles.

The Traffic Manager name servers traverse the profile hierarchy internally when processing each DNS query. A DNS query to a parent profile can receive a DNS response with an endpoint from a child profile. A single CNAME record is used whether you are using a single profile or nested profiles. There is no need to create a CNAME record for each profile in the hierarchy.

### How does Traffic Manager compute the health of a nested endpoint in a parent profile?
The parent profile doesn't perform health checks on the child directly. Instead, the health of the child profile's endpoints are used to calculate the overall health of the child profile. This information is propagated up the nested profile hierarchy to determine the health of the nested endpoint. The parent profile uses this aggregated health to determine whether the traffic can be directed to the child.

The following table describes the behavior of Traffic Manager health checks for a nested endpoint.

| Child Profile Monitor status | Parent Endpoint Monitor status | Notes |
| --- | --- | --- |
| Disabled. The child profile has been disabled. |Stopped |The parent endpoint state is Stopped, not Disabled. The Disabled state is reserved for indicating that you have disabled the endpoint in the parent profile. |
| Degraded. At least one child profile endpoint is in a Degraded state. |Online: the number of Online endpoints in the child profile is at least the value of MinChildEndpoints.<BR>CheckingEndpoint: the number of Online plus CheckingEndpoint endpoints in the child profile is at least the value of MinChildEndpoints.<BR>Degraded: otherwise. |Traffic is routed to an endpoint of status CheckingEndpoint. If MinChildEndpoints is set too high, the endpoint is always degraded. |
| Online. At least one child profile endpoint is an Online state. No endpoint is in the Degraded state. |See above. | |
| CheckingEndpoints. At least one child profile endpoint is 'CheckingEndpoint'. No endpoints are 'Online' or 'Degraded' |Same as above. | |
| Inactive. All child profile endpoints are either Disabled or Stopped, or this profile has no endpoints. |Stopped | |

## Next steps
Learn more about [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md)

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md)

<!--Image references-->
[1]: ./media/traffic-manager-nested-profiles/figure-1.png
[2]: ./media/traffic-manager-nested-profiles/figure-2.png
[3]: ./media/traffic-manager-nested-profiles/figure-3.png
[4]: ./media/traffic-manager-nested-profiles/figure-4.png
[5]: ./media/traffic-manager-nested-profiles/figure-5.png
[6]: ./media/traffic-manager-nested-profiles/figure-6.png
[7]: ./media/traffic-manager-nested-profiles/figure-7.png
[8]: ./media/traffic-manager-nested-profiles/figure-8.png
[9]: ./media/traffic-manager-nested-profiles/figure-9.png
[10]: ./media/traffic-manager-nested-profiles/figure-10.png

