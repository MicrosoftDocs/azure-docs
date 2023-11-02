---
title: Azure Traffic Manager - FAQ
description: This article provides answers to frequently asked questions about Traffic Manager.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/02/2023
ms.author: greglin 
---

# Traffic Manager Frequently Asked Questions (FAQ)

## Traffic Manager basics

### What IP address does Traffic Manager use?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), Traffic Manager works at the Domain Name System (DNS) level. It sends DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager.

Therefore, Traffic Manager doesn't provide an endpoint or IP address for clients to connect to. If you want a static IP address for your service, it must be configured in the service, not in Traffic Manager.

### What types of traffic can be routed using Traffic Manager?
As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), a Traffic Manager endpoint can be any internet facing service hosted inside or outside of Azure. Hence, Traffic Manager can route traffic that originates from the public internet to a set of endpoints that are also internet facing. If you have endpoints that are inside a private network (for example, an internal version of [Azure Load Balancer](../load-balancer/components.md#frontend-ip-configurations)) or have users making DNS requests from such internal networks, then you can't use Traffic Manager to route this traffic.

### Does Traffic Manager support "sticky" sessions?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients connect to the service endpoint directly, not through Traffic Manager. Therefore, Traffic Manager doesn't see the HTTP traffic between the client and the server.

Additionally, the source IP address of the DNS query received by Traffic Manager belongs to the recursive DNS service, not the client. Therefore, Traffic Manager has no way to track individual clients and can't implement 'sticky' sessions. This limitation is common to all DNS-based traffic management systems and isn't specific to Traffic Manager.

### Why am I seeing an HTTP error when using Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager. Traffic Manager doesn't see HTTP traffic between client and server. Therefore, any HTTP error you see must be coming from your application. For the client to connect to the application, all DNS resolution steps are complete. That includes any interaction that Traffic Manager has on the application traffic flow.

Further investigation should therefore focus on the application.

The HTTP host header sent from the client's browser is the most common source of problems. Make sure that the application is configured to accept the correct host header for the domain name you're using. For endpoints using the Azure App Service, see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../app-service/configure-domain-traffic-manager.md).

### How can I resolve a 500 (Internal Server Error) problem when using Traffic Manager?

If your client or application receives an HTTP 500 error while using Traffic Manager, this can be caused by a stale DNS query. To resolve the issue, clear the DNS cache and allow the client to issue a new DNS query.

When a service endpoint is unresponsive, clients and applications that are using that endpoint don't reset until the DNS cache is refreshed. The duration of the cache is determined by the time-to-live (TTL) of the DNS record. For more information, see [Traffic Manager and the DNS cache](traffic-manager-how-it-works.md#traffic-manager-and-the-dns-cache).

Also see the following related FAQs in this article:
- [What is DNS TTL and how does it impact my users?](#what-is-dns-ttl-and-how-does-it-impact-my-users)
- [How high or low can I set the TTL for Traffic Manager responses?](#how-high-or-low-can-i-set-the-ttl-for-traffic-manager-responses)
- [How can I understand the volume of queries coming to my profile?](#how-can-i-understand-the-volume-of-queries-coming-to-my-profile)  

### What is the performance impact of using Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), Traffic Manager works at the DNS level. Since clients connect to your service endpoints directly, there's no performance impact incurred when using Traffic Manager once the connection is established.

Since Traffic Manager integrates with applications at the DNS level, it does require an additional DNS lookup to be inserted into the DNS resolution chain. The impact of Traffic Manager on DNS resolution time is minimal. Traffic Manager uses a global network of name servers, and uses [anycast](https://en.wikipedia.org/wiki/Anycast) networking to ensure DNS queries are always routed to the closest available name server. In addition, caching of DNS responses means that the additional DNS latency incurred by using Traffic Manager applies only to a fraction of sessions.

The Performance method routes traffic to the closest available endpoint. The net result is that the overall performance impact associated with this method should be minimal. Any increase in DNS latency should be offset by lower network latency to the endpoint.

### What application protocols can I use with Traffic Manager?

As explained in [How Traffic Manager Works](../traffic-manager/traffic-manager-how-it-works.md), Traffic Manager works at the DNS level. Once the DNS lookup is complete, clients connect to the application endpoint directly, not through Traffic Manager. Therefore, the connection can use any application protocol. 
 If you select TCP as the monitoring protocol, Traffic Manager's endpoint health monitoring can be done without using any application protocols. If you choose to have the health verified using an application protocol, the endpoint needs to be able to respond to either HTTP or HTTPS GET requests.

### Can I use Traffic Manager with a "naked" domain name?

Yes. To learn how to create an alias record for your domain name apex to reference an Azure Traffic Manager profile, see [Configure an alias record to support apex domain names with Traffic Manager](../dns/tutorial-alias-tm.md).

### Does Traffic Manager consider the client subnet address when handling DNS queries? 

Yes, in addition to the source IP address of the DNS query it receives (which usually is the IP address of the DNS resolver), when performing lookups for Geographic, Performance, and Subnet routing methods, traffic manager also considers the client subnet address if it's included in the query by the resolver making the request on behalf of the end user.  
Specifically, [RFC 7871 – Client Subnet in DNS Queries](https://tools.ietf.org/html/rfc7871) that provides an [Extension Mechanism for DNS (EDNS0)](https://tools.ietf.org/html/rfc2671) which can pass on the client subnet address from resolvers that support it.

### What is DNS TTL and how does it impact my users?

When a DNS query lands on Traffic Manager, it sets a value in the response called time-to-live (TTL). This value, whose unit is in seconds, indicates to DNS resolvers downstream on how long to cache this response. While DNS resolvers aren't guaranteed to cache this result, caching it enables them to respond to any subsequent queries off the cache instead of going to Traffic Manager DNS servers. This impacts the responses as follows:

- a higher TTL reduces the number of queries that land on the Traffic Manager DNS servers, which can reduce the cost for a customer since number of queries served is a billable usage.
- a higher TTL can potentially reduce the time it takes to do a DNS lookup.
- a higher TTL also means that your data doesn't reflect the latest health information that Traffic Manager has obtained through its probing agents.

### How high or low can I set the TTL for Traffic Manager responses?

You can set, at a per profile level, the DNS TTL to be as low as 0 seconds and as high as 2,147,483,647 seconds (the maximum range compliant with [RFC-1035](https://www.ietf.org/rfc/rfc1035.txt)). A TTL of 0 means that downstream DNS resolvers don't cache query responses and all queries are expected to reach the Traffic Manager DNS servers for resolution.

### How can I understand the volume of queries coming to my profile? 

One of the metrics provided by Traffic Manager is the number of queries responded by a profile. You can get this information at a profile level aggregation or you can split it up further to see the volume of queries where specific endpoints were returned. In addition, you can set up alerts to notify you if the query response volume crosses the conditions you have set. For more details, [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).

### When I delete a Traffic Manager profile, what is the amount of time before the name of the profile is available for reuse?

When you delete a Traffic Manager profile, the associated domain name is reserved for a period of time. Other Traffic Manager profiles in the same tenant can immediately reuse the name. However, a different Azure tenant is not able to use the same profile name until the reservation expires. This feature enables you to maintain authority over the namespaces that you deploy, eliminating concerns that the name might be taken by another tenant.

For example, if your Traffic Manager profile name is **label1**, then **label1.trafficmanager.net** is reserved for your tenant even if you delete the profile. Child namespaces, such as **xyz.label1** or **123.abc.label1** are also reserved. When the reservation expires, the name is made available to other tenants. The name associated with a disabled profile is reserved indefinitely. For questions about the length of time a name is reserved, contact your account representative. 

## Traffic Manager Geographic traffic routing method

### What are some use cases where geographic routing is useful?

Geographic routing type can be used in any scenario where an Azure customer needs to distinguish their users based on geographic regions. For example, using the Geographic traffic routing method, you can give users from specific regions a different user experience than those from other regions. Another example is complying with local data sovereignty mandates that require that users from a specific region be served only by endpoints in that region.

### How do I decide if I should use Performance routing method or Geographic routing method?

The key difference between these two popular routing methods is that in Performance routing method your primary goal is to send traffic to the endpoint that can provide the lowest latency to the caller, whereas, in Geographic routing the primary goal is to enforce a geo fence for your callers so that you can deliberately route them to a specific endpoint. The overlap happens since there’s a correlation between geographical closeness and lower latency, although this isn’t always true. There might be an endpoint in a different geography that can provide a better latency experience for the caller and in that case Performance routing sends the user to that endpoint but Geographic routing always sends them to the endpoint you’ve mapped for their geographic region. To further make it clear, consider the following example - with Geographic routing you can make uncommon mappings such as send all traffic from Asia to endpoints in the US and all US traffic to endpoints in Asia. In that case, Geographic routing deliberately does exactly what you have configured it to do and performance optimization isn’t a consideration. 
>[!NOTE]
>There may be scenarios where you might need both performance and geographic routing capabilities, for these scenarios nested profiles can be great choice. For example, you can set up a parent profile with geographic routing where you send all traffic from North America to a nested profile that has endpoints in the US and use performance routing to send those traffic to the best endpoint within that set. 

### What are the regions that are supported by Traffic Manager for geographic routing?

The country/region hierarchy that is used by Traffic Manager can be found [here](traffic-manager-geographic-regions.md). While this page is kept up to date with any changes, you can also programmatically retrieve the same information by using the [Azure Traffic Manager REST API](/rest/api/trafficmanager/). 

### How does traffic manager determine where a user is querying from?

Traffic Manager looks at the source IP of the query (this most likely is a local DNS resolver doing the querying on behalf of the user) and uses an internal IP to region map to determine the location. This map is updated on an ongoing basis to account for changes in the internet. 

### Is it guaranteed that Traffic Manager can correctly determine the exact geographic location of the user in every case?

No, Traffic Manager can’t guarantee that the geographic region we infer from the source IP address of a DNS query always corresponds to the user's location due to the following reasons:

- First, as described in the previous FAQ, the source IP we see is that of a DNS resolver doing the lookup on behalf of the user. While the geographic location of the DNS resolver is a good proxy for the geographic location of the user, it can also be different depending upon the footprint of the DNS resolver service and the specific DNS resolver service a customer has chosen to use. 
As an example, a customer located in Malaysia could specify in their device's settings use a DNS resolver service whose DNS server in Singapore might get picked to handle the query resolutions for that user/device. In that case, Traffic Manager can only see the resolver's IP that corresponds to the Singapore location. Also, see the earlier FAQ regarding client subnet address support on this page.

- Second, Traffic Manager uses an internal map to do the IP address to geographic region translation. While this map is validated and updated on an ongoing basis to increase its accuracy and account for the evolving nature of the internet, there's still the possibility that our information isn't an exact representation of the geographic location of all the IP addresses.

###  Does an endpoint need to be physically located in the same region as the one it's configured with for geographic routing?

No, the location of the endpoint imposes no restrictions on which regions can be mapped to it. For example, an endpoint in US-Central Azure region can have all users from India directed to it.

### Can I assign geographic regions to endpoints in a profile that isn't configured to do geographic routing?

Yes, if the routing method of a profile isn't geographic, you can use the [Azure Traffic Manager REST API](/rest/api/trafficmanager/) to assign geographic regions to endpoints in that profile. In the case of non-geographic routing type profiles, this configuration is ignored. If you change such a profile to geographic routing type at a later time, Traffic Manager can use those mappings.

### Why am I getting an error when I try to change the routing method of an existing profile to Geographic?

All the endpoints under a profile with geographic routing need to have at least one region mapped to it. To convert an existing profile to geographic routing type, you first need to associate geographic regions to all its endpoints using the [Azure Traffic Manager REST API](/rest/api/trafficmanager/) before changing the routing type to geographic. If using portal, first delete the endpoints, change the routing method of the profile to geographic and then add the endpoints along with their geographic region mapping.

### Why is it strongly recommended that customers create nested profiles instead of endpoints under a profile with geographic routing enabled?

A region can be assigned to only one endpoint within a profile if it's using the geographic routing method. If that endpoint isn't a nested type with a child profile attached to it, if that endpoint going unhealthy, Traffic Manager continues to send traffic to it since the alternative of not sending any traffic isn't any better. Traffic Manager doesn't fail over to another endpoint, even when the region assigned is a "parent" of the region assigned to the endpoint that went unhealthy (for example, if an endpoint that has region Spain goes unhealthy, we don't fail over to another endpoint that has the region Europe assigned to it). This is done to ensure that Traffic Manager respects the geographic boundaries that a customer has setup in their profile. To get the benefit of failing over to another endpoint when an endpoint goes unhealthy, it's recommended that geographic regions be assigned to nested profiles with multiple endpoints within it instead of individual endpoints. In this way, if an endpoint in the nested child profile fails, traffic can fail over to another endpoint inside the same nested child profile.

### Are there any restrictions on the API version that supports this routing type?

Yes, only API version 2017-03-01 and newer supports the Geographic routing type. Any older API versions can't be used to created profiles of Geographic routing type or assign geographic regions to endpoints. If an older API version is used to retrieve profiles from an Azure subscription, any profile of Geographic routing type isn't returned. In addition, when using older API versions, any profile returned that has endpoints with a geographic region assignment, doesn't have its geographic region assignment shown.

## Traffic Manager Subnet traffic routing method

### What are some use cases where subnet routing is useful?

Subnet routing allows you to differentiate the experience you deliver for specific sets of users identified by the source IP of their DNS requests IP address. An example would be showing different content if users are connecting to a website from your corporate HQ. Another would be restricting users from certain ISPs to only access endpoints that support only IPv4 connections if those ISPs have subpar performance when IPv6 is used.
Another reason to use Subnet routing method is in conjunction with other profiles in a nested profile set. For example, if you want to use Geographic routing method for geo-fencing your users, but for a specific ISP you want to do a different routing method, you can have a profile withy Subnet routing method as the parent profile and override that ISP to use a specific child profile and have the standard Geographic profile for everyone else.

### How does Traffic Manager know the IP address of the end user?

End-user devices typically use a DNS resolver to do the DNS lookup on their behalf. The outgoing IP of such resolvers is what Traffic Manager sees as the source IP. In addition, Subnet routing method also looks to see if there's EDNS0 Extended Client Subnet (ECS) information that was passed with the request. If ECS information is present, that is the address used to determine the routing. In the absence of ECS information, the source IP of the query is used for routing purposes.

### How can I specify IP addresses when using Subnet routing?

The IP addresses to associate with an endpoint can be specified in two ways. First, you can use the quad dotted decimal octet notation with a start and end addresses to specify the range (for example, 1.2.3.4-5.6.7.8 or 3.4.5.6-3.4.5.6). Second, you can use the CIDR notation to specify the range (for example, 1.2.3.0/24). You can specify multiple ranges and can use both notation types in a range set. A few restrictions apply.

-    You can't overlap address ranges since each IP address needs to be mapped to only a single endpoint
-    The start address can't be more than the end address
-    In the case of the CIDR notation, the IP address before the '/' should be the start address of that range (for example, 1.2.3.0/24 is valid but 1.2.3.4.4/24 is NOT valid)

### How can I specify a fallback endpoint when using Subnet routing?

In a profile with Subnet routing, if you have an endpoint with no subnets mapped to it, any request that doesn’t match with other endpoints are directed to here. It’s highly recommended that you have such a fallback endpoint in your profile since Traffic Manager returns an NXDOMAIN response if a request comes in and it isn’t mapped to any endpoints or if it’s mapped to an endpoint but that endpoint is unhealthy.

### What happens if an endpoint is disabled in a Subnet routing type profile?

In a profile with Subnet routing, if you have an endpoint with that is disabled, Traffic Manager behaves as if that endpoint and the subnet mappings it has doesn’t exist. If a query that would have matched with its IP address mapping is received and the endpoint is disabled, Traffic Manager returns a fallback endpoint (one with no mappings) or if such an endpoint isn’t present, returns an NXDOMAIN response.

## Traffic Manager MultiValue traffic routing method

### What are some use cases where MultiValue routing is useful?

MultiValue routing returns multiple healthy endpoints in a single query response. The main advantage of this is that, if an endpoint is unhealthy, the client has more options to retry without making another DNS call (which might return the same value from an upstream cache). This is applicable for availability-sensitive applications that want to minimize the downtime.
Another use for MultiValue routing method is if an endpoint is "dual-homed" to both IPv4 and IPv6 addresses and you want to give the caller both options to choose from when it initiates a connection to the endpoint.

### How many endpoints are returned when MultiValue routing is used?

You can specify the maximum number of endpoints to be returned and MultiValue returns no more than that many healthy endpoints when a query is received. The maximum possible value for this configuration is 10.

### Will I get the same set of endpoints when MultiValue routing is used?

We can’t guarantee that the same set of endpoints are returned in each query. This is also affected by the fact that some of the endpoints might go unhealthy at which point they won’t be included in the response

## Real User Measurements

### What are the benefits of using Real User Measurements?

When you use performance routing method, Traffic Manager picks the best Azure region for your end user to connect to by inspecting the source IP and EDNS Client Subnet (if passed in) and checking it against the network latency intelligence the service maintains. Real User Measurements enhances this for your end-user base by having their experience contribute to this latency table in addition to ensuring that this table adequately spans the end-user networks from where your end users connect to Azure. This leads to an increased accuracy in the routing of your end user.

### Can I use Real User Measurements with non-Azure regions?

Real User Measurements measures and reports on only the latency to reach Azure regions. If you're using performance-based routing with endpoints hosted in non-Azure regions, you can still benefit from this feature by having increased latency information about the representative Azure region you had selected to be associated with this endpoint.

### Which routing method benefits from Real User Measurements?

The additional information gained through Real User Measurements are applicable only for profiles that use the performance routing method. The Real User Measurements link is available from all the profiles when you view it through the Azure portal.

### Do I need to enable Real User Measurements each profile separately?

No, you only need to enable it once per subscription and all the latency information measured and reported are available to all profiles.

### How do I turn off Real User Measurements for my subscription?

You can stop accruing charges related to Real User Measurements when you stop collecting and sending back latency measurements from your client application. For example, when measurement JavaScript embedded in web pages, you can stop using this feature by removing the JavaScript or by turning off its invocation when the page is rendered.

You can also turn off Real User Measurements by deleting your key. Once you delete the key, any measurements sent to Traffic Manager with that key are discarded.

### Can I use Real User Measurements with client applications other than web pages?

Yes, Real User Measurements is designed to ingest data collected through different type of end-user clients. This FAQ is updated as new types of client applications get supported.

### How many measurements are made each time my Real User Measurements enabled web page is rendered?

When Real User Measurements is used with the measurement JavaScript provided, each page rendering results in six measurements being taken. These are then reported back to the Traffic Manager service. You are charged for this feature based on the number of measurements reported to Traffic Manager service. For example, if the user navigates away from your webpage while the measurements are being taken but before it was reported, those measurements aren't considered for billing purposes.

### Is there a delay before Real User Measurements script runs in my webpage?

No, there's no programmed delay before the script is invoked.

### Can I use Real User Measurements with only the Azure regions I want to measure?

No, each time it's invoked, the Real User Measurements script measures a set of six Azure regions as determined by the service. This set changes between different invocations and when a large number of such invocations happen, the measurement coverage spans across different Azure regions.

### Can I limit the number of measurements made to a specific number?

The measurement JavaScript is embedded within your webpage and you are in complete control over when to start and stop using it. As long as the Traffic Manager service receives a request for a list of Azure regions to be measured, a set of regions is returned.

### Can I see the measurements taken by my client application as part of Real User Measurements?

Since the measurement logic is run from your client application, you are in full control of what happens including seeing the latency measurements. Traffic Manager doesn't report an aggregate view of the measurements received under the key linked to your subscription.

### Can I modify the measurement script provided by Traffic Manager?

While you are in control of what is embedded on your web page, we strongly discourage you from making any changes to the measurement script to ensure that it measures and reports the latencies correctly.

### Will it be possible for others to see the key I use with Real User Measurements?

When you embed the measurement script to a web page, it is possible for others to see the script and your Real User Measurements (RUM) key. But it’s important to know that this key is different from your subscription ID and is generated by Traffic Manager to be used only for this purpose. Knowing your RUM key won’t compromise your Azure account safety.

### Can others abuse my RUM key?

While it's possible for others to use your key to send wrong information to Azure, a few wrong measurements won't change the routing since it's taken into account along with all the other measurements we receive. If you need to change your keys, you can regenerate the key at which point the old key becomes discarded.

### Do I need to put the measurement JavaScript in all my web pages?

Real User Measurements delivers more value as the number of measurements increase. Having said that, it's your decision as to whether you need to put it in all your web pages or a select few. Our recommendation is to start by putting it in your most visited page where a user is expected to stay on that page five seconds or more.

### Can information about my end users be identified by Traffic Manager if I use Real User Measurements?

When the provided measurement JavaScript is used, Traffic Manager has visibility into the client IP address of the end user and the source IP address of the local DNS resolver they use. Traffic Manager uses the client IP address only after having it truncated to not be able to identify the specific end user who sent the measurements.

### Does the webpage measuring Real User Measurements need to be using Traffic Manager for routing?

No, it doesn't need to use Traffic Manager. The routing side of Traffic Manager operates separately from the Real User Measurement part and although it's a great idea to have them both in the same web property, they don't need to be.

### Do I need to host any service on Azure regions to use with Real User Measurements?

No, you don't need to host any server-side component on Azure for Real User Measurements to work. The single pixel image downloaded by the measurement JavaScript and the service running it in different Azure regions is hosted and managed by Azure. 

### Will my Azure bandwidth usage increase when I use Real User Measurements?

As mentioned in the previous answer, the server-side components of Real User Measurements are owned and managed by Azure. This means your Azure bandwidth usage won't increase because you use Real User Measurements. This doesn't include any bandwidth usage outside of what Azure charges. We minimize the bandwidth used by downloading only a single pixel image to measurement the latency to an Azure region. 

## Traffic View

### What does Traffic View do?

Traffic View is a feature of Traffic Manager that helps you understand more about your users and how their experience is. It uses the queries received by Traffic Manager and the network latency intelligence tables that the service maintains to provide you with the following:

- The regions where users reside that are connecting to your endpoints in Azure.
- The volume of users connecting from these regions.
- The Azure regions to which they’re being routed.
- The users' latency experience routing to these Azure regions.

This information is available for you to consume through geographical map overlay and tabular views in the portal in addition to being available as raw data for you to download.

### How can I benefit from using Traffic View?

Traffic View gives you the overall view of the traffic your Traffic Manager profiles receive. In particular, it can be used to understand where your user base connects from and equally importantly what their average latency experience is. You can then use this information to find areas in which you need to focus, for example, by expanding your Azure footprint to a region that can serve those users with lower latency. Another insight you can derive from using Traffic View is to see the patterns of traffic to different regions, which in turn can help you make decisions on increasing or decreasing invent in those regions.

### How is Traffic View different from the Traffic Manager metrics available through Azure monitor?

Azure Monitor can be used to understand at an aggregate level the traffic received by your profile and its endpoints. It also enables you to track the health status of the endpoints by exposing the health check results. When you need to go beyond these and understand your end user's experience connecting to Azure at a regional level, Traffic View can be used to achieve that.

### Does Traffic View use EDNS Client Subnet information?

The DNS queries served by Azure Traffic Manager do consider ECS information to increase the accuracy of the routing. But when creating the data set that shows where the users are connecting from, Traffic View is using only the IP address of the DNS resolver.

### How many days of data does Traffic View use?

Traffic View creates its output by processing the data from the seven days preceding the day before when it’s viewed by you. This is a moving window and the latest data is used each time you visit.

### How does Traffic View handle external endpoints?

When you use external endpoints hosted outside Azure regions in a Traffic Manager profile, you can choose to have it mapped to an Azure region, which is a proxy for its latency characteristics (this is in fact needed if you use performance routing method). If it has this Azure region mapping, that Azure region's latency metrics are used when creating the Traffic View output. If no Azure region is specified, the latency information is empty in the data for those external endpoints.

### Do I need to enable Traffic View for each profile in my subscription?

During the preview period, Traffic View was enabled at a subscription level. As part of the improvements we made before the general availability, you can now enable Traffic View at a profile level, allowing you to have more granular enabling of this feature. By default, Traffic View is disabled for a profile.

>[!NOTE]
>If you enabled Traffic View at a subscription level during the preview time, you now need to re-enable it for each of the profile under that subscription.
 
### How can I turn off Traffic View?

You can turn off Traffic View for any profile using the Portal or REST API. 

### How does Traffic View billing work?

Traffic View pricing is based on the number of data points used to create the output. Currently, the only data type supported is the queries your profile receives. In addition, you're only billed for the processing that was done when you have Traffic View enabled. This means that, if you enable Traffic View for some time period in a month and turn it off during other times, only the data points processed while you had the feature enabled count towards your bill.

## Traffic Manager endpoints

### Can I use Traffic Manager with endpoints from multiple subscriptions?

Using endpoints from multiple subscriptions isn't possible with Azure Web Apps. Azure Web Apps requires that any custom domain name used with Web Apps is only used within a single subscription. It isn't possible to use Web Apps from multiple subscriptions with the same domain name.

For other endpoint types, it's possible to use Traffic Manager with endpoints from more than one subscription. In Resource Manager, endpoints from any subscription can be added to Traffic Manager, as long as the person configuring the Traffic Manager profile has read access to the endpoint. These permissions can be granted using [Azure role-based access control (Azure RBAC role)](../role-based-access-control/role-assignments-portal.md). Endpoints from other subscriptions can be added using [Azure PowerShell](/powershell/module/az.trafficmanager/new-aztrafficmanagerendpoint) or the [Azure CLI](/cli/azure/network/traffic-manager/endpoint#az-network-traffic-manager-endpoint-create).

### Can I use Traffic Manager with Cloud Service 'Staging' slots?

Yes. Cloud Service 'staging' slots can be configured in Traffic Manager as External endpoints. Health checks are still be charged at the Azure Endpoints rate.

### Does Traffic Manager support IPv6 endpoints?

Traffic Manager doesn't currently provide IPv6-addressable name servers. However, Traffic Manager can still be used by IPv6 clients connecting to IPv6 endpoints if the client's recursive DNS server supports IPv4. A client doesn't make DNS request directly to Traffic Manager. Instead, the client uses a recursive DNS service. An IPv6-only client sends requests to the recursive DNS service via IPv6. The recursive service must then be able to contact the Traffic Manager name servers using IPv4. Traffic Manager responds with the DNS name or IP address of the endpoint. 

### Can I use Traffic Manager with more than one Web App in the same region?

Typically, Traffic Manager is used to direct traffic to applications deployed in different regions. However, it can also be used where an application has more than one deployment in the same region. The Traffic Manager Azure endpoints don't permit more than one Web App endpoint from the same Azure region to be added to the same Traffic Manager profile.

### How do I move my Traffic Manager profile's Azure endpoints to a different resource group or subscription?

Azure endpoints that are associated with a Traffic Manager profile are tracked using their resource IDs. When an Azure resource that is being used as an endpoint (for example,  Public IP, Classic Cloud Service, WebApp, or another Traffic Manager profile used in a nested manner) is moved to a different resource group or subscription, its resource ID changes. In this scenario, currently, you must update the Traffic Manager profile by first deleting and then adding back the endpoints to the profile.

For more information, see [To move an endpoint](traffic-manager-manage-endpoints.md#to-move-an-endpoint).

## Traffic Manager endpoint monitoring

### Is Traffic Manager resilient to Azure region failures?

Traffic Manager is a key component of the delivery of highly available applications in Azure.
To deliver high availability, Traffic Manager must have an exceptionally high level of availability and be resilient to regional failure.

By design, Traffic Manager components are resilient to a complete failure of any Azure region. This resilience applies to all Traffic Manager components: the DNS name servers, the API, the storage layer, and the endpoint monitoring service.

In the unlikely event of an outage of an entire Azure region, Traffic Manager is expected to continue to function normally. Applications deployed in multiple Azure regions can rely on Traffic Manager to direct traffic to an available instance of their application.

### How does the choice of resource group location affect Traffic Manager?

Traffic Manager is a single, global service. It isn't regional. The choice of resource group location makes no difference to Traffic Manager profiles deployed in that resource group.

Azure Resource Manager requires all resource groups to specify a location, which determines the default location for resources deployed in that resource group. When you create a Traffic Manager profile, it's created in a resource group. All Traffic Manager profiles use **global** as their location, overriding the resource group default.

### How do I determine the current health of each endpoint?

The current monitoring status of each endpoint, in addition to the overall profile, is displayed in the Azure portal. This information also is available via the Traffic Monitor [REST API](/rest/api/trafficmanager/), [PowerShell cmdlets](/powershell/module/az.trafficmanager), and [cross-platform Azure CLI](/cli/azure/install-classic-cli).

You can also use Azure Monitor to track the health of your endpoints and see a visual representation of them. For more about using Azure Monitor, see the [Azure Monitoring documentation](../azure-monitor/data-platform.md).

### Can I monitor HTTPS endpoints?

Yes. Traffic Manager supports probing over HTTPS. Configure **HTTPS** as the protocol in the monitoring configuration.

Traffic manager can't provide any certificate validation, including:

* Server-side certificates aren't validated
* SNI server-side certificates aren't validated
* Client certificates aren't supported

### Do I use an IP address or a DNS name when adding an endpoint?

Traffic Manager supports adding endpoints using three ways to refer them – as a DNS name, as an IPv4 address and as an IPv6 address. If the endpoint is added as an IPv4 or IPv6 address the query response is of record type A or AAAA, respectively. If the endpoint was added as a DNS name, then the query response is of record type CNAME. Adding endpoints as IPv4 or IPv6 address is permitted only if the endpoint is of type **External**.
All routing methods and monitoring settings are supported by the three endpoint addressing types.

### What types of IP addresses can I use when adding an endpoint?

Traffic Manager allows you to use IPv4 or IPv6 addresses to specify endpoints. There are a few restrictions, which are listed below:

- Addresses that correspond to reserved private IP address spaces aren't allowed. These addresses include those called out in RFC 1918, RFC 6890, RFC 5737, RFC 3068, RFC 2544 and RFC 5771
- The address must not contain any port numbers (you can specify the ports to be used in the profile configuration settings)
- No two endpoints in the same profile can have the same target IP address

### Can I use different endpoint addressing types within a single profile?

No, Traffic Manager doesn't allow you to mix endpoint addressing types within a profile, except for the case of a profile with MultiValue routing type where you can mix IPv4 and IPv6 addressing types

### What happens when an incoming query's record type is different from the record type associated with the addressing type of the endpoints?

When a query is received against a profile, Traffic Manager first finds the endpoint that needs to be returned as per the routing method specified and the health status of the endpoints. It then looks at the record type requested in the incoming query and the record type associated with the endpoint before returning a response based on the table below.

For profiles with any routing method other than MultiValue:

|Incoming query request|     Endpoint type|     Response Provided|
|--|--|--|
|ANY |    A / AAAA / CNAME |    Target Endpoint| 
|A |    A / CNAME |    Target Endpoint|
|A |    AAAA |    NODATA |
|AAAA |    AAAA / CNAME |    Target Endpoint|
|AAAA |    A |    NODATA |
|CNAME |    CNAME |    Target Endpoint|
|CNAME     |A / AAAA |    NODATA |
|

For profiles with routing method set to MultiValue:

|Incoming query request|     Endpoint type |    Response Provided|
|--|--|--|
|ANY |    Mix of A and AAAA |    Target Endpoints|
|A |    Mix of A and AAAA |    Only Target Endpoints of type A|
|AAAA    |Mix of A and AAAA|     Only Target Endpoints of type AAAA|
|CNAME |    Mix of A and AAAA |    NODATA |

### Can I use a profile with IPv4 / IPv6 addressed endpoints in a nested profile?

Yes, you can with the exception that a profile of type MultiValue can't be a parent profile in a nested profile set.

### I stopped a web application endpoint in my Traffic Manager profile but I'm not receiving any traffic even after I restarted it. How can I fix this?

When an Azure web application endpoint is stopped Traffic Manager stops checking its health and restarts the health checks only after it detects that the endpoint has restarted. To prevent this delay, disable and then reenable that endpoint in the Traffic Manager profile after you restart the endpoint.

### Can I use Traffic Manager even if my application doesn't have support for HTTP or HTTPS?

Yes. You can specify TCP as the monitoring protocol and Traffic Manager can initiate a TCP connection and wait for a response from the endpoint. If the endpoint replies to the connection request with a response to establish the connection, within the timeout period, then that endpoint is marked as healthy.

### What specific responses are required from the endpoint when using TCP monitoring?

When TCP monitoring is used, Traffic Manager starts a three-way TCP handshake by sending a SYN request to endpoint at the specified port. It then waits for an SYN-ACK response from the endpoint for a period of time (specified in the timeout settings).

- If an SYN-ACK response is received within the timeout period specified in the monitoring settings, then that endpoint is considered healthy. A FIN or FIN-ACK is the expected response from the Traffic Manager when it regularly terminates a socket.
- If an SYN-ACK response is received after the specified timeout, Traffic Manager responds with an RST to reset the connection.

### How fast does Traffic Manager move my users away from an unhealthy endpoint?

Traffic Manager provides multiple settings that can help you to control the failover behavior of your Traffic Manager profile as follows:

- you can specify that the Traffic Manager probes the endpoints more frequently by setting the Probing Interval at 10 seconds. This ensures that any endpoint going unhealthy can be detected as soon as possible. 
- you can specify how long to wait before a health check request times out (minimum time-out value is 5 sec).
- you can specify how many failures can occur before the endpoint is marked as unhealthy. This value can be low as 0, in which case the endpoint is marked unhealthy as soon as it fails the first health check. However, using the minimum value of 0 for the tolerated number of failures can lead to endpoints being taken out of rotation due to any transient issues that may occur at the time of probing.
- you can specify the time-to-live (TTL) for the DNS response to be as low as 0. Doing so means that DNS resolvers can't cache the response and each new query gets a response that incorporates the most up-to-date health information that the Traffic Manager has.

By using these settings, Traffic Manager can provide failovers under 10 seconds after an endpoint goes unhealthy and a DNS query is made against the corresponding profile.

### How can I specify different monitoring settings for different endpoints in a profile?

Traffic Manager monitoring settings are at a per profile level. If you need to use a different monitoring setting for only one endpoint, it can be done by having that endpoint as a [nested profile](traffic-manager-nested-profiles.md) whose monitoring settings are different from the parent profile.

### How can I assign HTTP headers to the Traffic Manager health checks to my endpoints?

Traffic Manager allows you to specify custom headers in the HTTP(S) health checks it initiates to your endpoints. If you want to specify a custom header, you can do that at the profile level (applicable to all endpoints) or specify it at the endpoint level. If a header is defined at both levels, then the one specified at the endpoint level overrides the profile level 1.
One common use case for this is specifying host headers so that Traffic Manager requests may get routed correctly to an endpoint hosted in a multitenant environment. Another use case of this is to identify Traffic Manager requests from an endpoint's HTTP(S) request logs

### What host header do endpoint health checks use?

If no custom host header setting is provided, the host header used by Traffic Manager is the DNS name of the endpoint target configured in the profile, if that is available.

### What are the IP addresses from which the health checks originate?

See [this article](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) to learn how to retrieve the lists of IP addresses from which Traffic Manager health checks can originate. You can use REST API, Azure CLI, or Azure PowerShell to retrieve the latest list. Review the IPs listed to ensure that incoming connections from these IP addresses are allowed at the endpoints to check its health status.

Example using Azure PowerShell:

```azurepowershell-interactive
$serviceTags = Get-AzNetworkServiceTag -Location eastus
$result = $serviceTags.Values | Where-Object { $_.Name -eq "AzureTrafficManager" }
$result.Properties.AddressPrefixes
```

> [!NOTE]
> Public IP addresses may change without notice. Ensure to retrieve the latest information using the Service Tag Discovery API or downloadable JSON file.

### How many health checks to my endpoint can I expect from Traffic Manager?

The number of Traffic Manager health checks reaching your endpoint depends on the following:

- the value that you have set for the monitoring interval (smaller interval means more requests landing on your endpoint in any given time period).
- the number of locations from where the health checks originate (the IP addresses from where you can expect these checks is listed in the preceding FAQ).

### How can I get notified if one of my endpoints goes down?

One of the metrics provided by Traffic Manager is the health status of endpoints in a profile. You can see this as an aggregate of all endpoints inside a profile (for example, 75% of your endpoints are healthy), or, at a per endpoint level. Traffic Manager metrics are exposed through Azure Monitor and you can use its [alerting capabilities](../azure-monitor/alerts/alerts-metric.md) to get notifications when there's a change in the health status of your endpoint. For more information, see [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).  

## Traffic Manager nested profiles

### How do I configure nested profiles?

Nested Traffic Manager profiles can be configured using both the Azure Resource Manager and the classic Azure REST APIs, Azure PowerShell cmdlets and cross-platform Azure CLI commands. They're also supported via the new Azure portal.

### How many layers of nesting does Traffic Manger support?

You can nest profiles up to 10 levels deep. 'Loops' aren't permitted.

### Can I mix other endpoint types with nested child profiles, in the same Traffic Manager profile?

Yes. There are no restrictions on how you combine endpoints of different types within a profile.

### How does the billing model apply for Nested profiles?

There's no negative pricing impact of using nested profiles.

Traffic Manager billing has two components: endpoint health checks and millions of DNS queries

* Endpoint health checks: There's no charge for a child profile when configured as an endpoint in a parent profile. Monitoring of the endpoints in the child profile is billed in the usual way.
* DNS queries: Each query is only counted once. A query against a parent profile that returns an endpoint from a child profile is counted against the parent profile only.

For full details, see the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).

### Is there a performance impact for nested profiles?

No. There's no performance impact incurred when using nested profiles.

The Traffic Manager name servers traverse the profile hierarchy internally when processing each DNS query. A DNS query to a parent profile can receive a DNS response with an endpoint from a child profile. A single CNAME record is used whether you're using a single profile or nested profiles. There's no need to create a CNAME record for each profile in the hierarchy.

### How does Traffic Manager compute the health of a nested endpoint in a parent profile?

The parent profile doesn't perform health checks on the child directly. Instead, the health of the child profile's endpoints are used to calculate the overall health of the child profile. This information is propagated up the nested profile hierarchy to determine the health of the nested endpoint. The parent profile uses this aggregated health to determine whether the traffic can be directed to the child.

The following table describes the behavior of Traffic Manager health checks for a nested endpoint.

| Child Profile Monitor status | Parent Endpoint Monitor status | Notes |
| --- | --- | --- |
| Disabled. The child profile has been disabled. |Stopped |The parent endpoint state is Stopped, not Disabled. The Disabled state is reserved for indicating that you've disabled the endpoint in the parent profile. |
| Degraded. At least one child profile endpoint is in a Degraded state. |Online: the number of Online endpoints in the child profile is at least the value of MinChildEndpoints.<BR>CheckingEndpoint: the number of Online plus CheckingEndpoint endpoints in the child profile is at least the value of MinChildEndpoints.<BR>Degraded: otherwise. |Traffic is routed to an endpoint of status CheckingEndpoint. If MinChildEndpoints is set too high, the endpoint is always degraded. |
| Online. At least one child profile endpoint is an Online state. No endpoint is in the Degraded state. |See above. | |
| CheckingEndpoints. At least one child profile endpoint is 'CheckingEndpoint'. No endpoints are 'Online' or 'Degraded' |Same as above. | |
| Inactive. All child profile endpoints are either Disabled or Stopped, or this profile has no endpoints. |Stopped | |

## Next steps:

- Learn more about Traffic Manager [endpoint monitoring and automatic failover](../traffic-manager/traffic-manager-monitoring.md).
- Learn more about Traffic Manager [traffic routing methods](../traffic-manager/traffic-manager-routing-methods.md).
