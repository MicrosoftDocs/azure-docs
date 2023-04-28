---
title: Azure Traffic Manager - traffic routing methods
description: This article helps you understand the different traffic routing methods used by Traffic Manager
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/30/2022
ms.author: greglin
ms.custom: template-concept
---

# Traffic Manager routing methods

Azure Traffic Manager supports six traffic-routing methods to determine how to route network traffic to the various service endpoints. For any profile, Traffic Manager applies the traffic-routing method associated to it to each DNS query it receives. The traffic-routing method determines which endpoint is returned in the DNS response.

The following traffic routing methods are available in Traffic Manager:

* **[Priority](#priority-traffic-routing-method):** Select **Priority** routing when you want to have a primary service endpoint for all traffic. You can provide multiple backup endpoints in case the primary or one of the backup endpoints is unavailable.
* **[Weighted](#weighted):** Select **Weighted** routing when you want to distribute traffic across a set of endpoints based on their weight. Set the weight the same to distribute evenly across all endpoints.
* **[Performance](#performance):** Select **Performance** routing when you have endpoints in different geographic locations and you want end users to use the "closest" endpoint for the lowest network latency.
* **[Geographic](#geographic):** Select **Geographic** routing to direct users to specific endpoints (Azure, External, or Nested) based on where their DNS queries originate from geographically. With this routing method, it enables you to be in compliance with scenarios such as data sovereignty mandates, localization of content & user experience and measuring traffic from different regions.
* **[Multivalue](#multivalue):** Select **MultiValue** for Traffic Manager profiles that can only have IPv4/IPv6 addresses as endpoints. When a query is received for this profile, all healthy endpoints are returned.
* **[Subnet](#subnet):** Select **Subnet** traffic-routing method to map sets of end-user IP address ranges to a specific endpoint. When a request is received, the endpoint returned will be the one mapped for that request’s source IP address. 


All Traffic Manager profiles have health monitoring and automatic failover of endpoints. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md). Within a Traffic Manager profile, you can only configure one traffic routing method at a time. You can select a different traffic routing method for your profile at any time. Your changes will be applied within a minute without any downtime. You can combine traffic routing methods by using nested Traffic Manager profiles. Nesting profiles allows for sophisticated traffic-routing configurations that meet the needs of larger and complex applications. For more information, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

## Priority traffic-routing method

Often an organization wants to provide reliability for their services. To do so, they deploy one or more backup services in case their primary goes down. The 'Priority' traffic-routing method allows Azure customers to easily implement this failover pattern.

![Azure Traffic Manager 'Priority' traffic-routing method](media/traffic-manager-routing-methods/priority.png)

The Traffic Manager profile contains a prioritized list of service endpoints. By default, Traffic Manager sends all traffic to the primary (highest-priority) endpoint. If the primary endpoint isn't available, Traffic Manager routes the traffic to the second endpoint. In a situation where the primary and secondary endpoints aren't available, the traffic goes to the third, and so on. Availability of the endpoint is based on the configured status (enabled or disabled) and the ongoing endpoint monitoring.

### Configuring endpoints

With Azure Resource Manager, you configure the endpoint priority explicitly using the 'priority' property for each endpoint. This property is a value between 1 and 1000. A lower value represents a higher priority. Endpoints can't share priority values. Setting the property is optional. When omitted, a default priority based on the endpoint order is used.

## <a name = "weighted"></a>Weighted traffic-routing method
The 'Weighted' traffic-routing method allows you to distribute traffic evenly or to use a pre-defined weighting.

![Azure Traffic Manager 'Weighted' traffic-routing method](media/traffic-manager-routing-methods/weighted.png)

In the Weighted traffic-routing method, you assign a weight to each endpoint in the Traffic Manager profile configuration. The weight is an integer from 1 to 1000. This parameter is optional. If omitted, Traffic Managers uses a default weight of '1'. The higher weight, the higher the priority.

For each DNS query received, Traffic Manager randomly chooses an available endpoint. The probability of choosing an endpoint is based on the weights assigned to all available endpoints. Using the same weight across all endpoints results in an even traffic distribution. Using higher or lower weights on specific endpoints causes those endpoints to be returned more or less frequently in the DNS responses.

The weighted method enables some useful scenarios:

* Gradual application upgrade: Given a percentage of traffic to route to a new endpoint, and gradually increase the traffic over time to 100%.
* Application migration to Azure: Create a profile with both Azure and external endpoints. Adjust the weight of the endpoints to prefer the new endpoints.
* Cloud-bursting for more capacity: Quickly expand an on-premises deployment into the cloud by putting it behind a Traffic Manager profile. When you need extra capacity in the cloud, you can add or enable more endpoints and specify what portion of traffic goes to each endpoint.

You can configure weights using the Azure portal, Azure PowerShell, CLI, or the REST APIs.

A point to remember is that DNS responses get cached by clients. They're also cached by the recursive DNS servers that the clients use to resolve DNS names. This caching can have an effect on weighted traffic distributions. When the number of clients and recursive DNS servers is large, traffic distribution works as expected. However, when the number of clients or recursive DNS servers is small, caching can significantly skew the traffic distribution.

Common use cases include:

* Development and testing environments
* Application-to-application communications
* Applications aimed at a narrow user-base that share a common recursive DNS infrastructure (for example, employees of company connecting through a proxy)

These DNS caching effects are common to all DNS-based traffic routing systems, not just Azure Traffic Manager. In some cases, explicitly clearing the DNS cache may provide a workaround. If that doesn't work, an alternative traffic-routing method may be more appropriate.

## <a name = "performance"></a>Performance traffic-routing method

Deploying endpoints in two or more locations across the globe can improve the responsiveness of your applications. With the 'Performance' traffic-routing method, you can route traffic to the location that is 'closest' to you.

![Azure Traffic Manager 'Performance' traffic-routing method](media/traffic-manager-routing-methods/performance.png)

The 'closest' endpoint isn't necessarily closest as measured by geographic distance. Instead, the 'Performance' traffic-routing method determines the closest endpoint by measuring network latency. Traffic Manager maintains an Internet Latency Table to track the round-trip time between IP address ranges and each Azure datacenter.

Traffic Manager looks up the source IP address of the incoming DNS request in the Internet Latency Table. Traffic Manager then chooses an available endpoint in the Azure datacenter that has the lowest latency for that IP address range. Then Traffic Manager returns that endpoint in the DNS response.

As explained in [How Traffic Manager Works](traffic-manager-how-it-works.md), Traffic Manager doesn't receive DNS queries directly from clients. Instead, DNS queries come from the recursive DNS service that the clients are configured to use. As such, the IP address used to determine the 'closest' endpoint isn't the client's IP address, but it's the IP address of the recursive DNS service. This IP address is a good proxy for the client.


Traffic Manager regularly updates the Internet Latency Table to account for changes in the global Internet and new Azure regions. However, application performance varies based on real-time variations in load across the Internet. Performance traffic-routing doesn't monitor load on a given service endpoint. If an endpoint becomes unavailable, Traffic Manager won't include it in the DNS query responses.


Points to note:

* If your profile contains multiple endpoints in the same Azure region, then Traffic Manager distributes traffic evenly across the available endpoints in that region. If you prefer a different traffic distribution within a region, you can use [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).
* If all enabled endpoints in the closest Azure region are degraded, Traffic Manager moves traffic to the endpoints in the next closest Azure region. If you want to define a preferred failover sequence, use [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).
* When using the Performance traffic routing method with external endpoints or nested endpoints, you need to specify the location of those endpoints. Choose the Azure region closest to your deployment. Those locations are the values supported by the Internet Latency Table.
* The algorithm that chooses the endpoint is deterministic. Repeated DNS queries from the same client are directed to the same endpoint. Typically, clients use different recursive DNS servers when traveling. The client may be routed to a different endpoint. Routing can also be affected by updates to the Internet Latency Table. That's why the Performance traffic-routing method doesn't guarantee that a client is always routed to the same endpoint.
* When the Internet Latency Table changes, you may notice that some clients are directed to a different endpoint. This routing change is more precise based on current latency data. These updates are essential to maintain the accuracy of Performance traffic-routing as the Internet continually evolves.

## <a name = "geographic"></a>Geographic traffic-routing method

Traffic Manager profiles can be configured to use the Geographic routing method so that users get directed to specific endpoints: Azure, External, or Nested. Matching is based on the geographic location that the DNS query originates from. With this routing method, it enables you to be in compliance with data sovereignty mandates, localization of content & user experience and measuring traffic from different regions.
When a profile is configured for geographic routing, each endpoint associated with that profile needs to have a set of geographic regions assigned to it. A geographic region can be at following levels of granularity 
- World– any region
- Regional Grouping – for example, Africa, Middle East, Australia/Pacific etc. 
- Country/Region – for example, Ireland, Peru, Hong Kong SAR etc. 
- State/Province – for example, USA-California, Australia-Queensland, Canada-Alberta etc. (note: this granularity level is supported only for states / provinces in Australia, Canada, and USA).

When a region or a set of regions is assigned to an endpoint, any requests from those regions get routed only to that endpoint. Traffic Manager uses the source IP address of the DNS query to determine the region from where a user is querying from. Commonly found as the IP address of the local DNS resolver making the query for the user.  

![Azure Traffic Manager 'Geographic' traffic-routing method](./media/traffic-manager-routing-methods/geographic.png)

Traffic Manager reads the source IP address of the DNS query and decides which geographic region it's originating from. It then looks to see if there's an endpoint that has this geographic region mapped to it. This lookup starts at the lowest granularity level (first at the State/Province where it's supported, next at the Country/Region level) and goes all the way up to the highest level, which is **World**. The first match found using this traversal is chosen as the endpoint to return in the query response. When a query matches with a Nested type endpoint, an endpoint within that child profile is returned, based on its routing method. The following points are applicable to this behavior:

- A geographic region can be mapped only to one endpoint in a Traffic Manager profile when the routing type is Geographic Routing. This restriction ensures that routing of users is deterministic, and customers can enable scenarios that require unambiguous geographic boundaries.
- If a user’s region is listed under two different endpoints’ geographic mapping, Traffic Manager selects the endpoint with the lowest granularity. Traffic Manager won't consider routing requests from that region to the other endpoint. For example, consider a Geographic Routing type profile with two endpoints - Endpoint1 and Endpoint2. Endpoint1 is configured to receive traffic from Ireland and Endpoint2 is configured to receive traffic from Europe. If a request originates from Ireland, it's always routed to Endpoint1.
- Since a region can be mapped only to one endpoint, Traffic Manager returns a response whether the endpoint is healthy or not.

    >[!IMPORTANT]
    >It is strongly recommended that customers using the geographic routing method associate it with the Nested type endpoints that has child profiles containing at least two endpoints within each.
- If an endpoint match is found and that endpoint is in the **Stopped** state, Traffic Manager returns a NODATA response. In this case, no further lookups are made higher up in the geographic region hierarchy. This behavior is also applicable for nested endpoint types when the child profile is in the **Stopped** or **Disabled** state.
- If an endpoint displays a **Disabled** status, it won’t be included in the region matching process. This behavior is also applicable for nested endpoint types when the endpoint is in the **Disabled** state.
- If a query is coming from a geographic region that has no mapping in that profile, Traffic Manager returns a NODATA response. That's why we strongly recommended that you use geographic routing with one endpoint. Ideally of type Nested with at least two endpoints within the child profile, with the region **World** assigned to it. This configuration also ensures that any IP addresses that aren't map to a region are handled.

As explained in [How Traffic Manager Works](traffic-manager-how-it-works.md), Traffic Manager doesn't receive DNS queries directly from clients. DNS queries come from the recursive DNS service that the clients are configured to use. That's why the IP address used to determine the region isn't the client's IP address, but rather the IP address of the recursive DNS service. This IP address is a good proxy for the client.

### FAQs

* [What are some use cases where geographic routing is useful?](./traffic-manager-faqs.md#what-are-some-use-cases-where-geographic-routing-is-useful)

* [How do I decide if I should use Performance routing method or Geographic routing method?](./traffic-manager-faqs.md#how-do-i-decide-if-i-should-use-performance-routing-method-or-geographic-routing-method)

* [What are the regions that are supported by Traffic Manager for geographic routing?](./traffic-manager-faqs.md#what-are-the-regions-that-are-supported-by-traffic-manager-for-geographic-routing)

* [How does traffic manager determine where a user is querying from?](./traffic-manager-faqs.md#how-does-traffic-manager-determine-where-a-user-is-querying-from)

* [Is it guaranteed that Traffic Manager can correctly determine the exact geographic location of the user in every case?](./traffic-manager-faqs.md#is-it-guaranteed-that-traffic-manager-can-correctly-determine-the-exact-geographic-location-of-the-user-in-every-case)

* [Does an endpoint need to be physically located in the same region as the one it's configured with for geographic routing?](./traffic-manager-faqs.md#does-an-endpoint-need-to-be-physically-located-in-the-same-region-as-the-one-its-configured-with-for-geographic-routing)

* [Can I assign geographic regions to endpoints in a profile that isn't configured to do geographic routing?](./traffic-manager-faqs.md#can-i-assign-geographic-regions-to-endpoints-in-a-profile-that-isnt-configured-to-do-geographic-routing)

* [Why am I getting an error when I try to change the routing method of an existing profile to Geographic?](./traffic-manager-faqs.md#why-am-i-getting-an-error-when-i-try-to-change-the-routing-method-of-an-existing-profile-to-geographic)

* [Why is it strongly recommended that customers create nested profiles instead of endpoints under a profile with geographic routing enabled?](./traffic-manager-faqs.md#why-is-it-strongly-recommended-that-customers-create-nested-profiles-instead-of-endpoints-under-a-profile-with-geographic-routing-enabled)

* [Are there any restrictions on the API version that supports this routing type?](./traffic-manager-faqs.md#are-there-any-restrictions-on-the-api-version-that-supports-this-routing-type)

## <a name = "multivalue"></a>Multivalue traffic-routing method
The **Multivalue** traffic-routing method allows you to get multiple healthy endpoints in a single DNS query response. This configuration enables the caller to do client-side retries with other endpoints in case a returned endpoint being unresponsive. This pattern can increase the availability of a service and reduce the latency associated with a new DNS query to obtain a healthy endpoint. MultiValue routing method works only if all the endpoints of type ‘External’ and are specified as IPv4 or IPv6 addresses. When a query is received for this profile, all healthy endpoints are returned and are subject to a configurable maximum return count.

### FAQs

* [What are some use cases where MultiValue routing is useful?](./traffic-manager-faqs.md#what-are-some-use-cases-where-multivalue-routing-is-useful)

* [How many endpoints are returned when MultiValue routing is used?](./traffic-manager-faqs.md#how-many-endpoints-are-returned-when-multivalue-routing-is-used)

* [Will I get the same set of endpoints when MultiValue routing is used?](./traffic-manager-faqs.md#will-i-get-the-same-set-of-endpoints-when-multivalue-routing-is-used)

## <a name = "subnet"></a>Subnet traffic-routing method
The **Subnet** traffic-routing method allows you to map a set of end-user IP address ranges to specific endpoints in a profile. If Traffic Manager receives a DNS query for that profile, it will inspect the source IP address of that request. It will then determine which endpoint it's mapped to and will return that endpoint in the query response. In most cases, the source IP address is the DNS resolver that is used by the caller.

The IP address to be mapped to an endpoint can be specified as CIDR ranges (for example, 1.2.3.0/24) or as an address range (for example, 1.2.3.4-5.6.7.8). The IP ranges associated with an endpoint need to be unique within that profile. The address range can't have an overlap with the IP address set of a different endpoint in the same profile.
If you define an endpoint with no address range, then it functions as a fallback and takes traffic from any remaining subnets. If no fallback endpoint is included, Traffic Manager sends a NODATA response for any undefined ranges. It's highly recommended you define a fallback endpoint to ensure all possible IP ranges are specified across your endpoints.

Subnet routing can be used to deliver a different experience for users connecting from a specific IP space. For example, you can make all requests from your corporate office be routed to a different endpoint. This routing method is especially useful if you're trying to test an internal only version of your app. Another scenario is if you want to provide a different experience to users connecting from a specific ISP (For example, block users from a given ISP).

### FAQs

* [What are some use cases where subnet routing is useful?](./traffic-manager-faqs.md#what-are-some-use-cases-where-subnet-routing-is-useful)

* [How does Traffic Manager know the IP address of the end user?](./traffic-manager-faqs.md#how-does-traffic-manager-know-the-ip-address-of-the-end-user)

* [How can I specify IP addresses when using Subnet routing?](./traffic-manager-faqs.md#how-can-i-specify-ip-addresses-when-using-subnet-routing)

* [How can I specify a fallback endpoint when using Subnet routing?](./traffic-manager-faqs.md#how-can-i-specify-a-fallback-endpoint-when-using-subnet-routing)

* [What happens if an endpoint is disabled in a Subnet routing type profile?](./traffic-manager-faqs.md#what-happens-if-an-endpoint-is-disabled-in-a-subnet-routing-type-profile)


## Next steps

Learn how to develop high-availability applications using [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md)