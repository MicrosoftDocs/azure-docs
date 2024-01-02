---
title: Nested Traffic Manager Profiles in Azure
titleSuffix: Azure Traffic Manager
description: This article explains the 'Nested Profiles' feature of Azure Traffic Manager
services: traffic-manager
author: greg-lindsay
manager: kumud
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/10/2022
ms.author: greglin
ms.custom: template-concept
---

# Nested Traffic Manager profiles

Traffic Manager includes a range of traffic-routing methods that allow you to control how Traffic Manager chooses which endpoint should receive traffic from each end user. For more information, see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

Each Traffic Manager profile specifies a single traffic-routing method. However, there are scenarios that require more sophisticated traffic routing than the routing provided by a single Traffic Manager profile. You can nest Traffic Manager profiles to combine the benefits of more than one traffic-routing method. Nested profiles allow you to override the default Traffic Manager behavior to support larger and more complex application deployments.

To create a nested profile, you add a 'child' profile as an endpoint to a 'parent' profile. Some examples are provided in this article. 

## MinChildEndpoints

When you add a child profile as an endpoint in the parent profile, the **MinChildEndpoints** parameter is created and assigned a default value of **1**. This parameter determines the minimum number of endpoints that must be available in the child profile for it to be healthy. Below this threshold, the parent profile will consider the entire child profile as unavailable, and direct traffic to the other parent profile endpoints.

The following parameters are available in the parent profile:

- **MinChildEndpoints**: The minimum number of healthy child endpoints for the nested profile status to be healthy. 
- **MinChildEndpointsIPv4**: The minimum number of healthy IPv4 child endpoints for the nested profile status to be healthy. 
- **MinChildEndpointsIPv6**: The minimum number of healthy IPv6 child endpoints for the nested profile status to be healthy. 

> [!IMPORTANT]
> There must be at least one IPv4 and one IPv6 endpoint for any nested MultiValue profile. Always configure values for MinChildEndpointsIPv4 and MinChildEndpointsIPv6 based on your multivalue routing mechanism and do not simply use the default values.<br>
> The value of **MinChildEndpoints** must be high enough to allow for all endpoint types to be available. An error message is displayed for values that are too low.

The following examples illustrate how to use nested Traffic Manager profiles in various scenarios.

## Example 1: Combining 'Performance' and 'Weighted' traffic routing

Suppose that you deployed an application in the following Azure regions: West US, West Europe, and East Asia. You use Traffic Manager's 'Performance' traffic-routing method to distribute traffic to the region closest to the user.

![Single Traffic Manager profile][4]

Now, suppose you wish to test an update to your service before rolling it out more widely. You want to use the 'weighted' traffic-routing method to direct a small percentage of traffic to your test deployment. You set up the test deployment alongside the existing production deployment in West Europe.

You cannot combine both 'Weighted' and 'Performance traffic-routing in a single profile. To support this scenario, you create a Traffic Manager profile using the two West Europe endpoints and the 'Weighted' traffic-routing method. Next, you add this 'child' profile as an endpoint to the 'parent' profile. The parent profile still uses the Performance traffic-routing method and contains the other global deployments as endpoints.

The following diagram illustrates this example:

![Nested Traffic Manager profiles][2]

In this configuration, traffic directed via the parent profile distributes traffic across regions normally. Within West Europe, the nested profile distributes traffic to the production and test endpoints according to the weights assigned.

When the parent profile uses the 'Performance' traffic-routing method, each endpoint must be assigned a location. The location is assigned when you configure the endpoint. Choose the Azure region closest to your deployment. The Azure regions are the location values supported by the Internet Latency Table. For more information, see [Traffic Manager 'Performance' traffic-routing method](traffic-manager-routing-methods.md#performance).

## Example 2: Endpoint monitoring in Nested Profiles

Traffic Manager actively monitors the health of each service endpoint. If an endpoint is unhealthy, Traffic Manager directs users to alternative endpoints to preserve the availability of your service. This endpoint monitoring and failover behavior applies to all traffic-routing methods. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md). Endpoint monitoring works differently for nested profiles. With nested profiles, the parent profile doesn't perform health checks on the child directly. Instead, the health of the child profile's endpoints is used to calculate the overall health of the child profile. This health information is propagated up the nested profile hierarchy. The parent profile uses this aggregated health to determine whether to direct traffic to the child profile. See the [FAQ](traffic-manager-FAQs.md#traffic-manager-nested-profiles) for full details on health monitoring of nested profiles.

Returning to the previous example, suppose the production deployment in West Europe fails. By default, the 'child' profile directs all traffic to the test deployment. If the test deployment also fails, the parent profile determines that the child profile should not receive traffic since all child endpoints are unhealthy. Then, the parent profile distributes traffic to the other regions.

![Nested Profile failover (default behavior)][3]

You might be happy with this arrangement. Or you might be concerned that all traffic for West Europe is now going to the test deployment instead of a limited subset traffic. Regardless of the health of the test deployment, you want to fail over to the other regions when the production deployment in West Europe fails. 

In the scenario below, the **MinChildEndpoints** value is set to 2. Below this threshold, the parent profile considers the entire child profile to be unavailable and directs traffic to the other endpoints:

![Nested Profile failover with 'MinChildEndpoints' = 2][4]

> [!NOTE]
> The 'Priority' traffic-routing method distributes all traffic to a single endpoint. Thus there is little purpose in a MinChildEndpoints setting other than '1' for a child profile.

## Example 3: Prioritized failover regions in 'Performance' traffic routing

The default behavior for the 'Performance' traffic-routing method is when you have endpoints in different geographic locations the end users are routed to the "closest" endpoint in terms of the lowest network latency.

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

## Example 6:  Endpoint monitoring with Multivalue Nested Profiles using IPv4 and IPv6 endpoints

Suppose you have both IPv4 and IPv6 nested children endpoints, and you want to set thresholds for minimum children healthy for both. There are new parameters that will enable you to define the minimum number of these healthy endpoints that are expected for each type. The parameters **Minimum IPv4 endpoints** and **Minimum IPv6 endpoints** will determine the minimum number of healthy endpoints needed for each parameter, in order for the parent to be marked as healthy. 

The default number for the total minimum child endpoints is always 1, and the default number for IPv4 and IPv6 endpoints is 0 to ensure backwards compatibility. 

![Traffic Manager min-child behavior][11]

In this example, the **East US** endpoint is unhealthy, because it doesn't satisfy the requirement to have at least 1 healthy IPv4 endpoint, which is set by the **ipv4-min-child** property. 

## FAQs

* [How do I configure nested profiles?](./traffic-manager-faqs.md#traffic-manager-nested-profiles)

* [How many layers of nesting does Traffic Manger support?](./traffic-manager-faqs.md#how-many-layers-of-nesting-does-traffic-manger-support)

* [Can I mix other endpoint types with nested child profiles, in the same Traffic Manager profile?](./traffic-manager-faqs.md#can-i-mix-other-endpoint-types-with-nested-child-profiles-in-the-same-traffic-manager-profile)

* [How does the billing model apply for Nested profiles?](./traffic-manager-faqs.md#how-does-the-billing-model-apply-for-nested-profiles)

* [Is there a performance impact for nested profiles?](./traffic-manager-faqs.md#is-there-a-performance-impact-for-nested-profiles)

* [How does Traffic Manager compute the health of a nested endpoint in a parent profile?](./traffic-manager-faqs.md#how-does-traffic-manager-compute-the-health-of-a-nested-endpoint-in-a-parent-profile)

## Next steps

Learn more about [Traffic Manager profiles](traffic-manager-overview.md)

Learn how to [create a Traffic Manager profile](./quickstart-create-traffic-manager-profile.md)

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
[11]: ./media/traffic-manager-nested-profiles/figure-11.png