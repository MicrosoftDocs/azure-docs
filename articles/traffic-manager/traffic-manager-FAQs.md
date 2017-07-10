---
title: Azure Traffic Manager - FAQs | Microsoft Docs
description: This article provides answers to frequently asked questions about Traffic Manager
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: timlt
editor: ''

ms.assetid: 75d5ff9a-f4b9-4b05-af32-700e7bdfea5a
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/15/2017
ms.author: kumud
---

# Traffic Manager Frequently Asked Questions (FAQ)

## Traffic Manager basics

### What IP address does Traffic Manager use?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-overview.md#how-traffic-manager-works), Traffic Manager works at the DNS level. It sends DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager.

Therefore, Traffic Manager does not provide an endpoint or IP address for clients to connect to. Therefore, if you want static IP address for your service, that must be configured at the service, not in Traffic Manager.

### Does Traffic Manager support 'sticky' sessions?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-overview.md#how-traffic-manager-works), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients connect to the service endpoint directly, not through Traffic Manager. Therefore, Traffic Manager does not see the HTTP traffic between the client and the server.

Additionally, the source IP address of the DNS query received by Traffic Manager belongs to the recursive DNS service, not the client. Therefore, Traffic Manager has no way to track individual clients and cannot implement 'sticky' sessions. This limitation is common to all DNS-based traffic management systems and is not specific to Traffic Manager.

### Why am I seeing an HTTP error when using Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-overview.md#how-traffic-manager-works), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager. Traffic Manager does not see HTTP traffic between client and server. Therefore, any HTTP error you see must be coming from your application. For the client to connect to the application, all DNS resolution steps are complete. That includes any interaction that Traffic Manager has on the application traffic flow.

Further investigation should therefore focus on the application.

The HTTP host header sent from the client's browser is the most common source of problems. Make sure that the application is configured to accept the correct host header for the domain name you are using. For endpoints using the Azure App Service, see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../app-service-web/web-sites-traffic-manager-custom-domain-name.md).

### What is the performance impact of using Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-overview.md#how-traffic-manager-works), Traffic Manager works at the DNS level. Since clients connect to your service endpoints directly, there is no performance impact incurred when using Traffic Manager once the connection is established.

Since Traffic Manager integrates with applications at the DNS level, it does require an additional DNS lookup to be inserted into the DNS resolution chain. The impact of Traffic Manager on DNS resolution time is minimal. Traffic Manager uses a global network of name servers, and uses [anycast](https://en.wikipedia.org/wiki/Anycast) networking to ensure DNS queries are always routed to the closest available name server. In addition, caching of DNS responses means that the additional DNS latency incurred by using Traffic Manager applies only to a fraction of sessions.

The Performance method routes traffic to the closest available endpoint. The net result is that the overall performance impact associated with this method should be minimal. Any increase in DNS latency should be offset by lower network latency to the endpoint.

### What application protocols can I use with Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-overview.md#how-traffic-manager-works), Traffic Manager works at the DNS level. Once the DNS lookup is complete, clients connect to the application endpoint directly, not through Traffic Manager. Therefore, the connection can use any application protocol. 
 If you select TCP as the monitoring protocol, Traffic Manager's endpoint health monitoring can be done without using any application protocols. If you choose to have the health verified using an application protocol, the endpoint needs to be able to respond to either HTTP or HTTPS GET requests.

### Can I use Traffic Manager with a 'naked' domain name?

No. The DNS standards do not permit CNAMEs to co-exist with other DNS records of the same name. The apex (or root) of a DNS zone always contains two pre-existing DNS records; the SOA and the authoritative NS records. This means a CNAME record cannot be created at the zone apex without violating the DNS standards.

Traffic Manager requires a DNS CNAME record to map the vanity DNS name. For example, you map www.contoso.com to the Traffic Manager profile DNS name contoso.trafficmanager.net. Additionally, the Traffic Manager profile returns a second DNS CNAME to indicate which endpoint the client should connect to.

To work around this issue, we recommend using an HTTP redirect to direct traffic from the naked domain name to a different URL, which can then use Traffic Manager. For example, the naked domain 'contoso.com' can redirect users to the CNAME 'www.contoso.com' that points to the Traffic Manager DNS name.

Full support for naked domains in Traffic Manager is tracked in our feature backlog. You can register your support for this feature request by [voting for it on our community feedback site](https://feedback.azure.com/forums/217313-networking/suggestions/5485350-support-apex-naked-domains-more-seamlessly).

### Does Traffic Manager consider the client subnet address when handling DNS queries? 
No, currently Traffic Manager considers only the source IP address of the DNS query it receives, which usually is the IP address of the DNS resolver, when performing lookups for Geographic and Performance routing methods.  
Specifically, [RFC 7871 – Client Subnet in DNS Queries](https://tools.ietf.org/html/rfc7871) that provides an [Extension Mechanism for DNS (EDNS0)](https://tools.ietf.org/html/rfc2671) which can pass on the client subnet address from resolvers that support it to DNS servers is currently not supported in Traffic Manager. You can register your support for this feature request through our [community feedback site](https://feedback.azure.com/forums/217313-networking).


### What is DNS TTL and how does it impact my users?

When a DNS query lands on Traffic Manager, it sets a value in the response called time-to-live (TTL). This value, whose unit is in seconds, indicates to DNS resolvers downstream on how long to cache this response. While DNS resolvers are not guaranteed to cache this result, caching it enables them to respond to any subsequent queries off the cache instead of going to Traffic Manager DNS servers. This impacts the responses as follows:
- a higher TTL reduces the number of queries that land on the Traffic Manager DNS servers, which can reduce the cost for a customer since number of queries served is a billable usage.
- a higher TTL can potentially reduce the time it takes to do a DNS lookup.
- a higher TTL also means that your data does not reflect the latest health information that Traffic Manager has obtained through its probing agents.

### How high or low can I set the TTL for Traffic Manager responses?

You can set, at a per profile level, the DNS TTL to be as low as 0 seconds and as high as 2,147,483,647 seconds (the maximum range compliant with [RFC-1035](https://www.ietf.org/rfc/rfc1035.txt )). A TTL of 0 means that downstream DNS resolvers do not cache query responses and all queries are expected to reach the Traffic Manager DNS servers for resolution.

## Traffic Manager Geographic traffic routing method

### What are some use cases where geographic routing is useful? 
Geographic routing type can be used in any scenario where an Azure customer needs to distinguish their users based on geographic regions. For example, using the Geographic traffic routing method, you can give users from specific regions a different user experience than those from other regions. Another example is complying with local data sovereignty mandates that require that users from a specific region be served only by endpoints in that region.

### What are the regions that are supported by Traffic Manager for geographic routing? 
The country/region hierarchy that is used by Traffic Manager can be found [here](traffic-manager-geographic-regions.md). While this page is kept up-to-date with any changes, you can also programmatically retrieve the same information by using the [Azure Traffic Manager REST API](https://docs.microsoft.com/rest/api/trafficmanager/). 

### How does traffic manager determine where a user is querying from? 
Traffic Manager looks at the source IP of the query (this most likely is a local DNS resolver doing the querying on behalf of the user) and uses an internal IP to region map to determine the location. This map is updated on an ongoing basis to account for changes in the internet. 

### Is it guaranteed that Traffic Manager can correctly determine the exact geographic location of the user in every case?
No, Traffic Manager cannot guarantee that the geographic region we infer from the source IP address of a DNS query will always correspond to the user’s location due to the following reasons: 

- First, as described in the previous FAQ, the source IP address we see is that of a DNS resolver doing the lookup on behalf of the user. While the geographic location of the DNS resolver is a good proxy for the geographic location of the user, it can also be different depending upon the footprint of the DNS resolver service and the specific DNS resolver service a customer has chosen to use. 
As an example, a customer located in Malaysia could specify in their device’s settings use a DNS resolver service whose DNS server in Singapore might get picked to handle the query resolutions for that user/device. In that case, Traffic Manager can only see the resolver’s IP address that corresponds to the Singapore location. Also, see the earlier FAQ regarding client subnet address support on this page.

- Second, Traffic Manager uses an internal map to do the IP address to geographic region translation. While this map is validated and updated on an ongoing basis to increase its accuracy and account for the evolving nature of the internet, there is still the possibility that our information is not an exact representation of the geographic location of all the IP addresses.


###  Does an endpoint need to be physically located in the same region as the one it is configured with for geographic routing? 
No, the location of the endpoint imposes no restrictions on which regions can be mapped to it. For example, an endpoint in US-Central Azure region can have all users from India directed to it.

### Can I assign geographic regions to endpoints in a profile that is not configured to do geographic routing? 

Yes, if the routing method of a profile is not geographic, you can use the [Azure Traffic Manager REST API](https://docs.microsoft.com/rest/api/trafficmanager/) to assign geographic regions to endpoints in that profile. In the case of non-geographic routing type profiles, this configuration is ignored. If you change such a profile to geographic routing type at a later time, Traffic Manager can use those mappings.


### Why am I getting an error when I try to change the routing method of an existing profile to Geographic?

All the endpoints under a profile with geographic routing need to have at least one region mapped to it. To convert an existing profile to geographic routing type, you first need to associate geographic regions to all its endpoints using the [Azure Traffic Manager REST API](https://docs.microsoft.com/rest/api/trafficmanager/) before changing the routing type to geographic. If using portal, first delete the endpoints, change the routing method of the profile to geographic and then add the endpoints along with their geographic region mapping. 


###  Why is it strongly recommended that customers create nested profiles instead of endpoints under a profile with geographic routing enabled? 

A region can be assigned to only one endpoint within a profile if its using geographic routing type. If that endpoint is not a nested type with a child profile attached to it, if that endpoint going unhealthy, Traffic Manager continues to send traffic to it since the alternative of not sending any traffic isn’t any better. Traffic Manager does not failover to another endpoint, even when the region assigned is a “parent” of the region assigned to the endpoint that went unhealthy (for example, if an endpoint that has region Spain goes unhealthy, we will not failover to another endpoint that has the region Europe assigned to it). This is done to ensure that Traffic Manager respects the geographic boundaries that a customer has setup in their profile. To get the benefit of failing over to another endpoint when an endpoint goes unhealthy, it is recommended that geographic regions be assigned to nested profiles with multiple endpoints within it instead of individual endpoints. In this way, if an endpoint in the nested child profile fails, traffic can failover to another endpoint inside the same nested child profile.

### Are there any restrictions on the API version that supports this routing type?

Yes, only API version 2017-03-01 and newer supports the Geographic routing type. Any older API versions cannot be used to created profiles of Geographic routing type or assign geographic regions to endpoints. If an older API version is used to retrieve profiles from an Azure subscription, any profile of Geographic routing type is not returned. In addition, when using older API versions, any profile returned that has endpoints with a geographic region assignment, does not have its geographic region assignment shown.



## Traffic Manager endpoints

### Can I use Traffic Manager with endpoints from multiple subscriptions?

Using endpoints from multiple subscriptions is not possible with Azure Web Apps. Azure Web Apps requires that any custom domain name used with Web Apps is only used within a single subscription. It is not possible to use Web Apps from multiple subscriptions with the same domain name.

For other endpoint types, it is possible to use Traffic Manager with endpoints from more than one subscription. In Resource Manager, endpoints from any subscription can be added to Traffic Manager, as long as the person configuring the Traffic Manager profile has read access to the endpoint. These permissions can be granted using [Azure Resource Manager role-based access control (RBAC)](../active-directory/role-based-access-control-configure.md).


### Can I use Traffic Manager with Cloud Service 'Staging' slots?

Yes. Cloud Service 'staging' slots can be configured in Traffic Manager as External endpoints. Health checks are still be charged at the Azure Endpoints rate. Because the External endpoint type is in use, changes to the underlying service are not picked up automatically. With external endpoints, Traffic Manager cannot detect when the Cloud Service is stopped or deleted. Therefore, the Traffic Manager continues billing for health checks until the endpoint is disabled or deleted.

### Does Traffic Manager support IPv6 endpoints?

Traffic Manager does not currently provide IPv6-addressible name servers. However, Traffic Manager can still be used by IPv6 clients connecting to IPv6 endpoints. A client does not make DNS requests directly to Traffic Manager. Instead, the client uses a recursive DNS service. An IPv6-only client sends requests to the recursive DNS service via IPv6. Then the recursive service should be able to contact the Traffic Manager name servers using IPv4.

Traffic Manager responds with the DNS name of the endpoint. To support an IPv6 endpoint, a DNS AAAA record pointing the endpoint DNS name to the IPv6 address must exist. Traffic Manager health checks only support IPv4 addresses. The service needs to expose an IPv4 endpoint on the same DNS name.

### Can I use Traffic Manager with more than one Web App in the same region?

Typically, Traffic Manager is used to direct traffic to applications deployed in different regions. However, it can also be used where an application has more than one deployment in the same region. The Traffic Manager Azure endpoints do not permit more than one Web App endpoint from the same Azure region to be added to the same Traffic Manager profile.

##  Traffic Manager endpoint monitoring

### Is Traffic Manager resilient to Azure region failures?

Traffic Manager is a key component of the delivery of highly available applications in Azure.
To deliver high availability, Traffic Manager must have an exceptionally high level of availability and be resilient to regional failure.

By design, Traffic Manager components are resilient to a complete failure of any Azure region. This resilience applies to all Traffic Manager components: the DNS name servers, the API, the storage layer, and the endpoint monitoring service.

In the unlikely event of an outage of an entire Azure region, Traffic Manager is expected to continue to function normally. Applications deployed in multiple Azure regions can rely on Traffic Manager to direct traffic to an available instance of their application.

### How does the choice of resource group location affect Traffic Manager?

Traffic Manager is a single, global service. It is not regional. The choice of resource group location makes no difference to Traffic Manager profiles deployed in that resource group.

Azure Resource Manager requires all resource groups to specify a location, which determines the default location for resources deployed in that resource group. When you create a Traffic Manager profile, it is created in a resource group. All Traffic Manager profiles use **global** as their location, overriding the resource group default.

### How do I determine the current health of each endpoint?

The current monitoring status of each endpoint, in addition to the overall profile, is displayed in the Azure portal. This information also is available via the Traffic Monitor [REST API](https://msdn.microsoft.com/library/azure/mt163667.aspx), [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125941.aspx), and [cross-platform Azure CLI](../cli-install-nodejs.md).

Azure does not provide historical information about past endpoint health or the ability to raise alerts about changes to endpoint health.

### Can I monitor HTTPS endpoints?

Yes. Traffic Manager supports probing over HTTPS. Configure **HTTPS** as the protocol in the monitoring configuration.

Traffic manager cannot provide any certificate validation, including:

* Server-side certificates are not validated
* SNI server-side certificates are not supported
* Client certificates are not supported

### Can I use Traffic Manager even if my application does not have support for HTTP or HTTPS?

Yes. You can specify TCP as the monitoring protocol and Traffic Manager can initiate a TCP connection and wait for a response from the endpoint. If the endpoint replies to the connection request with a response to establish the connection, within the timeout period, then that endpoint is marked as healthy.

### What specific responses are required from the endpoint when using TCP monitoring?

When TCP monitoring is used, Traffic Manager starts a three-way TCP handshake by sending a SYN request to endpoint at the specified port. It then waits for a period of time (as specified in the timeout settings) for a response from the endpoint. If the endpoint responds to the SYN request with a SYN-ACK response within the timeout period specified in the monitoring settings, then that endpoint is considered healthy. If the SYN-ACK response is received, the Traffic Manager resets the connection by responding back with a RST.

### How fast does Traffic Manager move my users away from an unhealthy endpoint?

Traffic Manager provides multiple settings that can help you to control the failover behavior of your Traffic Manager profile as follows:
- you can specify that the Traffic Manager probes the endpoints more frequently by setting the Probing Interval at 10 seconds. This ensures that any endpoint going unhealthy can be detected as soon as possible. 
- you can specify how long to wait before a health check request times out (minimum time out value is 5 sec).
- you can specify how many failures can occur before the endpoint is marked as unhealthy. This value can be low as 0, in which case the endpoint is marked unhealthy as soon as it fails the first health check. However, using the minimum value of 0 for the tolerated number of failures can lead to endpoints being taken out of rotation due to any transient issues that may occur at the time of probing.
- you can specify the time-to-live (TTL) for the DNS response to be as low as 0. Doing so means that DNS resolvers cannot cache the response and each new query gets a response that incorporates the most up-to-date health information that the Traffic Manager has.

By using these settings, Traffic Manager can provide failovers under 10 seconds after an endpoint goes unhealthy and a DNS query is made against the corresponding profile.

### How can I specify different monitoring settings for different endpoints in a profile?

Traffic Manager monitoring settings are at a per profile level. If you need to use a different monitoring setting for only one endpoint, it can be done by having that endpoint as a [nested profile](traffic-manager-nested-profiles.md) whose monitoring settings are different from the parent profile.

### What host header do endpoint health checks use?

Traffic Manager uses host headers in HTTP and HTTPS health checks. The host header used by Traffic Manager is the name of the endpoint target configured in the profile. The value used in the host header cannot be specified separately from the target property.

### What are the IP addresses from which the health checks originate?

The following list contains the IP addresses from which Traffic Manager health checks can originate. You may use this list to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status.

* 40.68.30.66
* 40.68.31.178
* 137.135.80.149
* 137.135.82.249
* 23.96.236.252
* 65.52.217.19
* 40.87.147.10
* 40.87.151.34
* 13.75.124.254
* 13.75.127.63
* 52.172.155.168
* 52.172.158.37
* 104.215.91.84
* 13.75.153.124
* 13.84.222.37
* 23.101.191.199
* 23.96.213.12
* 137.135.46.163
* 137.135.47.215
* 191.232.208.52
* 191.232.214.62
* 13.75.152.253
* 104.41.187.209
* 104.41.190.203

### How many health checks to my endpoint can I expect from Traffic Manager?

The number of Traffic Manager health checks reaching your endpoint depends on the following:
- the value that you have set for the monitoring interval (smaller interval means more requests landing on your endpoint in any given time period).
- the number of locations from where the health checks originate (the IP addresses from where you can expect these checks is listed in the preceding FAQ).

## Traffic Manager nested profiles

### How do I configure nested profiles?

Nested Traffic Manager profiles can be configured using both the Azure Resource Manager and the classic Azure REST APIs, Azure PowerShell cmdlets and cross-platform Azure CLI commands. They are also supported via the new Azure portal. They are not supported in the classic portal.

### How many layers of nesting does Traffic Manger support?

You can nest profiles up to 10 levels deep. 'Loops' are not permitted.

### Can I mix other endpoint types with nested child profiles, in the same Traffic Manager profile?

Yes. There are no restrictions on how you combine endpoints of different types within a profile.

### How does the billing model apply for Nested profiles?

There is no negative pricing impact of using nested profiles.

Traffic Manager billing has two components: endpoint health checks and millions of DNS queries

* Endpoint health checks: There is no charge for a child profile when configured as an endpoint in a parent profile. Monitoring of the endpoints in the child profile is billed in the usual way.
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

## Next steps:
- Learn more about Traffic Manager [endpoint monitoring and automatic failover](../traffic-manager/traffic-manager-monitoring.md).
- Learn more about Traffic Manager [traffic routing methods](../traffic-manager/traffic-manager-routing-methods.md).