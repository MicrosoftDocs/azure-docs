<properties 
   pageTitle="Nested Traffic Manager Profiles | Microsoft Azure"
   description="This article explains the 'Nested Profiles' feature of Azure Traffic Manager"
   services="traffic-manager"
   documentationCenter=""
   authors="jtuliani"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/25/2016"
   ms.author="jtuliani" />

# Nested Traffic Manager profiles

Traffic Manager includes a range of traffic-routing methods, allowing you to control how Traffic Manager chooses which endpoint should receive traffic from each end user.  These are described in [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md) and they enable Traffic Manager to meet the most common traffic-routing requirements.

Each Traffic Manager profile specifies a single traffic-routing method. However, there are times when more complex applications require more sophisticated traffic routing than can be provided by a single Traffic Manager profile.

To support these complex applications, Traffic Manager allows Traffic Manager profiles to be combined, or *nested*,  allowing the benefits of more than one traffic-routing method to be used by a single application.  Nested profiles enable you to create more flexible and powerful traffic-routing schemes to support the needs of larger, more complex deployments.

In addition, nested profiles allow you to override the default Traffic Manager behavior in certain cases, such as the routing of traffic within a region or during failover when using Performance traffic routing.

The remainder of this page explains, through a sequence of examples, how nested Traffic Manager profiles can be used in a variety of scenarios.  We close with some frequently asked questions about nested profiles

## Example 1: Combining 'Performance' and 'Weighted' traffic routing

Suppose your application is deployed in multiple Azure regions—West US, West Europe, and East Asia. You use Traffic Manager’s ‘Performance’ traffic-routing method to distribute traffic to the region closest to the user.

![Single Traffic Manager profile][1]

Now, suppose you wish to trial an update to your service with a small number of users before rolling it out more widely. For this, you’d like to use the ‘weighted’ traffic-routing method, which can direct a small percentage of traffic to your trial deployment. With a single profile, you cannot combine both ‘Weighted’ and ‘Performance traffic-routing. With Nested Profiles, you can do both.

Here’s how: suppose you want to trial the new deployment in West Europe. You set up the trial deployment alongside the existing production deployment, and you create a Traffic Manager profile using just these two endpoints and the ‘Weighted’ traffic-routing method. You then add this ‘child’ profile as an endpoint to the ‘parent’ profile, which still uses the Performance traffic-routing method, and also contains the other global deployments as endpoints.

The following diagram illustrates this example:

![Nested Traffic Manager profiles][2]

With this arrangement, traffic directed via the parent profile will be distributed across regions as normal. Within West Europe, traffic will be directed between the production and trial deployments according to the weights assigned.

Note that when the parent profile uses the ‘Performance’ traffic-routing method, the location of each endpoint must be known.  For nested endpoints, as for external endpoints, this location must be specified as part of the endpoint configuration.  Choose the Azure region closest to your deployment—the options available are the Azure regions, since those are the locations supported by the Internet Latency Table.  For further details, see [Traffic Manager ‘Performance’ traffic-routing method](traffic-manager-routing-methods.md#performance-traffic-routing-method).

## Example 2: Endpoint monitoring in Nested Profiles

Traffic Manager actively monitors the health of each service endpoint.  If an endpoint is determined to be unhealthy, Traffic Manager will direct users to alternative endpoints instead, thereby preserving the overall availability of your service. This endpoint monitoring and failover behavior applies to all traffic-routing methods.  See [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md) for further details.

For nested profiles, some special endpoint monitoring rules apply. Where a parent profile is configured with a child profile as a nested endpoint, the parent doesn’t perform health checks on the child directly. Instead, the health of the child profile’s endpoints is used to calculate the overall health of the child profile, and this information is propagated up the nested profile hierarchy to determine the health of the nested endpoint within the parent profile.  This determines whether the parent profile will direct traffic to the child.  Full details of exactly how the health of the nested endpoint in the parent profile is calculated from the health of the child profile is given [below](#faq).

Returning to Example 1, suppose the production deployment in West Europe fails. By default, the ‘child’ profile will direct all traffic to the trial deployment. If that also fails, the parent profile will determine that since all child endpoints are unhealthy, the child profile should not receive traffic and it will failover all West Europe traffic to the other regions.

![Nested Profile failover (default behavior)][3]

You might be happy with this arrangement, or you might be concerned that the Trial deployment shouldn’t be used as a failover for all West Europe traffic--you’d rather failover to the other regions if the production deployment in West Europe fails, *regardless* of the health of the trial deployment. This is also possible: when configuring the child profile as an endpoint in the parent profile, you can specify the ‘MinChildEndpoints’ parameter, which determines the minimum number of endpoints that must be available in the child profile. Below this threshold (which defaults to 1), the parent profile will consider the entire child profile as unavailable, and direct traffic to the other parent profile endpoints instead.

The example below illustrates: with MinChildEndpoints set to 2, if either deployment in West Europe fails, the parent profile will determine that the child profile should not receive traffic and users will be directed to the other regions.

![Nested Profile failover with ‘MinChildEndpoints’ = 2][4]

Note that when the child profile uses the ‘Priority’ traffic-routing method, all traffic to that child is received by a single endpoint. Thus there is little value in a MinChildEndpoints setting other than ‘1’ in this case.

## Example 3: Prioritized failover regions in 'Performance' traffic routing

With a single profile using 'Performance' traffic routing, if an endpoint (e.g. West Europe) fails, all traffic that would have been directed to that endpoint is instead distributed across the other endpoints, across all regions.  This is the default behavior for the ‘Performance’ traffic-routing method, designed to avoid over-loading the next nearest endpoint and causing a cascading series of failures.

![‘Performance’ traffic routing with default failover][5]

However, suppose you prefer the West Europe traffic fail over to West US by preference, and only direct elsewhere if both of those endpoints are unavailable. You can do this by creating a child profile which uses the ‘Priority’ traffic-routing method, as shown:

!['Performance' traffic routing with preferential failover][6]

Since the West Europe endpoint has higher priority than the West US endpoint, all traffic will be sent to the West Europe endpoint when both are online.  If West Europe fails, its traffic is directed to West US.  Only if West US also fails would West Europe traffic be directed to East Asia.

You can repeat this pattern for all regions, replacing all 3 endpoints in the parent profile with 3 child profiles, each providing a prioritized failover sequence.

## Example 4: Controlling 'Performance' traffic routing between multiple endpoints in the same region

Suppose the ‘Performance’ traffic-routing method is used in a profile that has more than one endpoint in a particular region, say West US.  By default, traffic directed to that region will be distributed evenly across all available endpoints in that region.

![‘Performance’ traffic routing in-region traffic distribution (default behavior)][7]

This default can be changed using nested Traffic Manager profiles.  Instead of adding multiple endpoints in West US, those endpoints can be enclosed in a separate child profile, and the child profile added to the parent as the only endpoint in West US.  The settings on the child profile can then be used to control the traffic distribution with West US, enabling (for example) priority-based or weighted traffic routing within that region.

![‘Performance’ traffic routing with custom in-region traffic distribution][8]

## Example 5: Per-endpoint monitoring settings

Suppose you are using Traffic Manager to smoothly migrate traffic between a legacy on-premises web site and a new Cloud-based version hosted on Azure.  For the legacy site, you want to use the home page (path ‘/’) to monitor site health, but for the new Cloud-based version you are implementing a custom monitoring page that includes additional checks (path ‘/monitor.aspx’).

![Traffic Manager endpoint monitoring (default behavior)][9]

The monitoring settings in a Traffic Manager profile apply to all endpoints within the profile, which means you’d previously have had to use the same path on both sites.  With nested Traffic Manager profiles, you can now use a child profile per site to define different monitoring settings per site:

![Traffic Manager endpoint monitoring with per-endpoint settings][10]

## FAQ

### How do I configure nested profiles?

Nested Traffic Manager profiles can be configured using both Azure Resource Manager (ARM) and Azure Service Management (ASM) REST APIs, PowerShell cmdlets and cross-platform Azure CLI commands. They are also supported via the Azure portal, however they are not supported in the ‘classic’ portal.

### How many layers of nesting does Traffic Manger support?
You can nest profiles up to 10 levels deep.  ‘Loops’ are not permitted.

### Can I mix other endpoint types with nested child profiles, in the same Traffic Manager profile?

Yes. There are no restrictions on how you combine endpoints of different types within a profile.

### How does the billing model apply for Nested profiles?

There is no negative pricing impact of using nested profiles.

Traffic Manager billing has two components: endpoint health checks and millions of DNS queries (for full details, see our [pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).) Here’s how this applies to Nested profiles:

- Endpoint health checks: There is no charge for a child profile when configured as an endpoint in a parent profile. Endpoints in the child profile that are monitoring the underlying services are billed in the usual way.

- DNS queries: each query is only counted once. A query against a parent profile that returns an endpoint from a child profile is billed against the parent profile only.

### Is there a performance impact for nested profiles?

No, there is no performance impact incurred when using nested profiles.

The Traffic Manager name servers will traverse the profile hierarchy internally when processing each DNS query, so a DNS query to a parent profile can receive a DNS response with an endpoint from a child profile.

Thus only a single CNAME record is used, the same as when using a single Traffic Manager profile. A chain of CNAME records, one for each profile in the hierarchy, is **not** required, and thus no performance penalty is incurred.

### How does Traffic Manager compute the health of a nested endpoint in a parent profile, based on the health of the child profile?

Where a parent profile is configured with a child profile as a nested endpoint, the parent doesn’t perform health checks on the child directly. Instead, the health of the child profile’s endpoints is used to calculate the overall health of the child profile, and this information is propagated up the nested profile hierarchy to determine the health of the nested endpoint within the parent profile.  This determines whether the parent profile will direct traffic to the child.

The following table describes the behavior of Traffic Manager health checks for a nested endpoint in a parent profile pointing to a child profile.

|Child Profile Monitor status|Parent Endpoint Monitor status|Notes|
|---|---|---|
|Disabled. The child profile has been disabled by the user.|Stopped|The parent endpoint state is Stopped, not Disabled. The Disabled state is reserved for indicating that you have disabled the endpoint in the parent profile.|
|Degraded. At least one child profile endpoint is in a Degraded state.|Online: the number of Online endpoints in the child profile is at least the value of MinChildEndpoints. CheckingEndpoint: the number of Online plus CheckingEndpoint endpoints in the child profile is at least the value of MinChildEndpoints. Degraded: otherwise.|Traffic is routed to an endpoint of status CheckingEndpoint. If MinChildEndpoints is set too high, the endpoint will always be degraded.|
|Online. At least one child profile endpoint is an Online state and none are in the Degraded state.|See above.||
|CheckingEndpoints. At least one child profile endpoint is ‘CheckingEndpoint’; none are ‘Online’ or ‘Degraded’|Same as above.||
|Inactive. All child profile endpoints are either Disabled or Stopped, or this is a profile with no endpoints|Stopped||


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

