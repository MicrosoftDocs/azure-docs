<properties 
   pageTitle="Traffic Manager - traffic routing methods | Microsoft Azure"
   description="This articles will help you understand the different traffic routing methods used by Traffic Manager"
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

# Traffic Manager traffic-routing methods

This page describes the traffic-routing methods supported by Azure Traffic Manager.  These are used to direct end users to the correct service endpoint.

> [AZURE.NOTE] The Azure Resource Manager (ARM) API for Traffic Manager uses different terminology from the Azure Service Management (ASM) API.  This change was introduced following customer feedback to improve clarity and reduce common misunderstandings. In this page, we will use the ARM terminology.  The differences are:

>- In ARM, we use ‘traffic-routing method’ to describe the algorithm use to determine which endpoint a particular end user should be directed to at a particular time.  In ASM, we called this ‘load-balancing method’.

>- In ARM, we use ‘weighted’ to refer to the traffic-routing method that distributes traffic across all available endpoints, based on the weight defined for each endpoint.  In ASM, we called this ‘round-robin’.
>- In ARM, we use ‘priority’ to refer to the traffic-routing method that directs all traffic to the first available endpoint in an ordered list.  In ASM, we called this ‘failover’.

> In all cases, the only differences is in the naming.  There is no difference in functionality.


Azure Traffic Manager supports a number of algorithms to determine how end users are routed to the various service endpoints.  These are called traffic-routing methods.  The traffic-routing method is applied to each DNS query received, to determine which endpoint should be returned in the DNS response.

There are three traffic routing methods available in Traffic Manager:

- **Priority:** Select ‘Priority’ when you want to use a primary service endpoint for all traffic, and provide backups in case the primary or the backup endpoints are unavailable. For more information, see [Priority traffic-routing method](#priority-traffic-routing-method).

- **Weighted:** Select ‘Weighted’ when you want to distribute traffic across a set of endpoints, either evenly or according to weights which you define. For more information, see [Weighted traffic-routing method](#weighted-traffic-routing-method).

- **Performance:** Select ‘Performance’ when you have endpoints in different geographic locations and you want end users to use the "closest" endpoint in terms of the lowest network latency. For more information, see [Performance traffic-routing method](#performance-traffic-routing-method).

> [AZURE.NOTE] All Traffic Manager profiles include continuous monitoring of endpoint health and automatic endpoint failover.  This is supported for all traffic-routing methods.  For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md).

A single Traffic Manager profile can use only one traffic routing method.  You can select a different traffic routing method for your profile at any time.  Changes are applied within 1 minute, and no downtime is incurred.
Traffic-routing methods can be combined by using nested Traffic Manager profiles.  This enables sophisticated and flexible traffic-routing configurations to be created to meet the needs of larger and more complex applications.  For more information, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

## Priority traffic-routing method

Often an organization wants to provide reliability for its services, and does this by providing one or more backup services in case their primary service goes down.  The ‘Priority’ traffic-routing method allows Azure customers to easily implement this failover pattern.

![Azure Traffic Manager ‘Priority’ traffic-routing method][1]

The Traffic Manager profile is configured with a prioritized list of service endpoints.  By default, all end-user traffic is sent to the primary (highest-priority) endpoint. If the primary endpoint is not available (based on the configured endpoint enabled/disabled status and the ongoing endpoint monitoring), users are referred to the second endpoint. If both the primary and secondary endpoints are not available, the traffic goes to the third, and so on.

The configuration of endpoint priorities is carried out differently in the ARM APIs (and new Azure portal) vs the ASM APIs (and classic portal):

- In the ARM APIs, the endpoint priority is configured explicitly, using the ‘priority’ property defined for each endpoint.  This property must take a value between 1 and 1000, where lower values represent a higher priority.  No two endpoints can share the same priority value.  The property is optional, and where omitted a default priority based on the endpoint order is used.

- In the ASM APIs, the endpoint priority is configured implicitly, based on the order in which the endpoints are listed in the profile definition.  You can also configure the failover order in the Azure ‘classic’ portal, on the Configuration page for the profile.

## Weighted traffic-routing method

A common approach to providing both high availability and maximizing service utilization is to provide a set of endpoints, and to distribute traffic across all endpoints, either evenly or with a pre-defined weighting. This is supported by the ‘Weighted’ traffic-routing method.

![Azure Traffic Manager ‘Weighted’ traffic-routing method][2]

In the Weighted traffic-routing method, each endpoint is assigned a weight as part of the Traffic Manager profile configuration.  Each weight is an integer from 1 to 1000. This parameter is optional, if omitted a default weight of ‘1’ is used.
  
End-user traffic is distributed across all available service endpoints (based on the configured endpoint enabled/disabled status and the ongoing endpoint monitoring).  For each DNS query received, an available endpoint is chosen at random, with a probability based on the weight assigned to that endpoint and the other available endpoints.  

Using the same weight across all endpoints results in an even traffic distribution, ideal for creating consistent utilization across a set of identical endpoints. Using higher (or lower) weights on certain endpoints causes those endpoints to be returned more (or less) frequently in the DNS responses, and thus to receive more traffic. This enables a number of useful scenarios:

- Gradual application upgrade: Allocate a percentage of traffic to route to a new endpoint, and gradually increase the traffic over time to 100%.

- Application migration to Azure: Create a profile with both Azure and external endpoints, and specify the weight of traffic that is routed to each endpoint.

- Cloud-bursting for additional capacity: Quickly expand an on-premises deployment into the cloud by putting it behind a Traffic Manager profile. When you need extra capacity in the cloud, you can add or enable more endpoints and specify what portion of traffic goes to each endpoint.

Weighted traffic routing can be configured via the new Azure portal, however weights cannot be configured via the ‘classic’ portal.  It can also be configured via both ARM and ASM using Azure PowerShell, Azure CLI and the Azure REST APIs.

Note: DNS responses are cached, both by clients and by the recursive DNS servers those clients use to make their DNS queries.  It’s important to understand the potential impact of this caching on weighted traffic distributions.  If the number of clients and recursive DNS servers is large, as is the case for typical Internet-facing applications, then traffic distribution works as expected.  However, if the number of clients or recursive DNS servers is small, then this caching can significantly skew the traffic distribution.  Common use cases where this can occur include:

- Development and testing environments
- Application-to-application communications
- Applications aimed at a narrow user based that shares a common recursive DNS infrastructure, e.g. employees of an organization.

These DNS caching effects are common to all DNS-based traffic routing systems, not just Azure Traffic Manager.  In some cases, explicitly clearing the DNS cache may provide a work around.  In other cases, an alternative traffic-routing method may be more appropriate.

## Performance traffic-routing method

The responsiveness of many applications can be improved by deploying endpoints in two or more locations across the globe, and routing end-users to the location that is ‘closest’ to them.  This is the purpose of the ‘Performance’ traffic-routing method.

![Azure Traffic Manager ‘Performance’ traffic-routing method][3]

To maximise responsiveness, the ‘closest’ endpoint is not necessarily closest as measured by geographic distance.  Instead, the ‘Performance’ traffic-routing method determines which endpoint is closest to the end-user as measured by network latency.  This is determined by an Internet Latency Table showing the round trip time between IP address ranges and each Azure data center.

Traffic Manager examines each incoming DNS request, and looks up the source IP address of that request in the Internet Latency Table.  This determines the latency from that IP address to each Azure data center.  Traffic Manager then picks which of the available endpoints (based on the configured endpoint enabled/disabled status and the ongoing endpoint monitoring) has the lowest latency, and returns that endpoint in the DNS response.  The end user is therefore directed to the endpoint that will give them the lowest latency, and hence best performance.

As explained in [How Traffic Manager Works](traffic-manager-how-traffic-manager-works.md), Traffic Manager does not receive DNS queries directly from end users, rather it receives them from the recursive DNS service they are configured to use.  Thus the IP address used to determine the ‘closest’ endpoint is not the end user’s IP address, rather it is the IP address of their recursive DNS service.  In practice, this IP address is a good proxy for the end user for this purpose.

To account for changes in the global Internet and the addition of new Azure regions, Traffic Manager regularly updates the Internet Latency Table it consumes.  However, this cannot take into account real-time variations in performance or load across the Internet.

Performance traffic-routing does not take into account the load on a given service endpoint, although Traffic Manager monitors your endpoints and will not include them in DNS query responses if they are unavailable.

Points to note:

- If your profile contains multiple endpoints in the same Azure region, then traffic directed to that region is distributed evenly across the available endpoints (based on the configured endpoint enabled/disabled status and the ongoing endpoint monitoring).  If you prefer a different traffic distribution within a region, this can be achieved using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- If all enabled endpoints in a given Azure region are degraded (based on the ongoing endpoint monitoring), traffic for those endpoints will be distributed across all other available endpoints that are specified in the profile, and not to the next-closest endpoint(s). This is to help avoid a cascading failure that could potentially occur if the next-closest endpoint becomes overloaded.  If you prefer to define the endpoint failover sequence, this can be achieved using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- When using the Performance traffic routing method with external endpoints or nested endpoints, you will need to specify the location of those endpoints. Choose the Azure region closest to your deployment—the options available are the Azure regions, since those are the locations supported by the Internet Latency Table.

- The algorithm that choses which endpoint to return to a given end user is deterministic, no randomness is involved.  Repeated DNS queries from the same client will be directed to the same endpoint.  However, the Performance traffic-routing method should not be relied upon to always route a given user to a given deployment (which may be required for example if user data for that user is stored in one location only).  This is because when end users travel, they use typically different recursive DNS servers, and so may be routed to a different endpoint.  They may also be affected by updates to the Internet Latency Table.

- When the Internet Latency Table is updated, you may notice that some clients are directed to a different endpoint.  The number of users impacted should be minimal, and reflects a more accurate routing based on current latency data.  These updates are essential to maintain the accuracy of Performance traffic-routing as the Internet continually evolves.


## Next steps

Learn how to develop high-availability applications using [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md)

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md)


<!--Image references-->
[1]: ./media/traffic-manager-routing-methods/priority.png
[2]: ./media/traffic-manager-routing-methods/weighted.png
[3]: ./media/traffic-manager-routing-methods/performance.png
