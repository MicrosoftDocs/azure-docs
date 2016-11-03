---
title: How Traffic Manager Works | Microsoft Docs
description: This article explains how Azure Traffic Manager works
services: traffic-manager
documentationcenter: ''
author: sdwheeler
manager: carmonm
editor: ''

ms.assetid: a6c9370d-e60d-440f-aa82-b6d3fa5416b0
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/11/2016
ms.author: sewhee

---
# How Traffic Manager works
Azure Traffic Manager enables you to control the distribution of traffic across your application endpoints. An endpoint is any Internet-facing service hosted inside or outside of Azure.

Traffic Manager provides two key benefits:

1. Distribution of traffic according to one of several [traffic-routing methods](traffic-manager-routing-methods.md)
2. [Continuous monitoring of endpoint health](traffic-manager-monitoring.md) and automatic failover when endpoints fail

When a client attempts to connect to a service, it must first resolve the DNS name of the service to an IP address. The client then connects to that IP address to access the service.

**The most important point to understand is that Traffic Manager works at the DNS level.**  Traffic Manager uses DNS to direct clients to specific service endpoints based on the rules of the traffic-routing method. Clients connect to the selected endpoint **directly**. Traffic Manager is not a proxy or a gateway. Traffic Manager does not see the traffic passing between the client and the service.

## Traffic Manager example
Contoso Corp have developed a new partner portal. The URL for this portal is https://partners.contoso.com/login.aspx. The application is hosted in three regions of Azure. To improve availability and maximize global performance, they use Traffic Manager to distribute client traffic to the closest available endpoint.

To achieve this configuration:

* They deploy three instances of their service. The DNS names of these deployments are 'contoso-us.cloudapp.net', 'contoso-eu.cloudapp.net', and 'contoso-asia.cloudapp.net'.
* They then create a Traffic Manager profile, named 'contoso.trafficmanager.net', and configure it to use the 'Performance' traffic-routing method across the three endpoints.
* Finally, they configure their vanity domain name, 'partners.contoso.com', to point to 'contoso.trafficmanager.net', using a DNS CNAME record.

![Traffic Manager DNS configuration][1]

> [!NOTE]
> When using a vanity domain with Azure Traffic Manager, you must use a CNAME to point your vanity domain name to your Traffic Manager domain name. DNS standards do not allow you to create a CNAME at the 'apex' (or root) of a domain. Thus you cannot create a CNAME for 'contoso.com' (sometimes called a 'naked' domain). You can only create a CNAME for a domain under 'contoso.com', such as 'www.contoso.com'. To work around this limitation, we recommend using a simple HTTP redirect to direct requests for 'contoso.com' to an alternative name such as 'www.contoso.com'.
> 
> 

## How clients connect using Traffic Manager
Continuing from the previous example, when a client requests the page https://partners.contoso.com/login.aspx, the client performs the following steps to resolve the DNS name and establish a connection:

![Connection establishment using Traffic Manager][2]

1. The client sends a DNS query to its configured recursive DNS service to resolve the name 'partners.contoso.com'. A recursive DNS service, sometimes called a 'local DNS' service, does not host DNS domains directly. Rather, the client off-loads the work of contacting the various authoritative DNS services across the Internet needed to resolve a DNS name.
2. To resolve the DNS name, the recursive DNS service finds the name servers for the 'contoso.com' domain. It then contacts those name servers to request the 'partners.contoso.com' DNS record. The contoso.com DNS servers return the CNAME record that points to contoso.trafficmanager.net.
3. Next, the recursive DNS service finds the name servers for the 'trafficmanager.net' domain, which are provided by the Azure Traffic Manager service. It then sends a request for the 'contoso.trafficmanager.net' DNS record to those DNS servers.
4. The Traffic Manager name servers receive the request. They choose an endpoint based on:
   
   * The configured state of each endpoint (disabled endpoints are not returned)
   * The current health of each endpoint, as determined by the Traffic Manager health checks. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md).
   * The chosen traffic-routing method. For more information, see [Traffic Manager Routing Methods](traffic-manager-routing-methods.md).
5. The chosen endpoint is returned as another DNS CNAME record. In this case, let us suppose contoso-us.cloudapp.net is returned.
6. Next, the recursive DNS service finds the name servers for the 'cloudapp.net' domain. It contacts those name servers to request the 'contoso-us.cloudapp.net' DNS record. A DNS 'A' record containing the IP address of the US-based service endpoint is returned.
7. The recursive DNS service consolidates the results and returns a single DNS response to the client.
8. The client receives the DNS results and connects to the given IP address. The client connects to the application service endpoint directly, not through Traffic Manager. Since it is an HTTPS endpoint, the client performs the necessary SSL/TLS handshake, and then makes an HTTP GET request for the '/login.aspx' page.

The recursive DNS service caches the DNS responses it receives. The DNS resolver on the client device also caches the result. Caching enables subsequent DNS queries to be answered more quickly by using data from the cache rather than querying other name servers. The duration of the cache is determined by the 'time-to-live' (TTL) property of each DNS record. Shorter values result in faster cache expiry and thus more round-trips to the Traffic Manager name servers. Longer values mean that it can take longer to direct traffic away from a failed endpoint. Traffic Manager allows you to configure the TTL used in Traffic Manager DNS responses, enabling you to choose the value that best balances the needs of your application.

## FAQ
### What IP address does Traffic Manager use?
As explained in How Traffic Manager Works, Traffic Manager works at the DNS level. It sends DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager.

Therefore, Traffic Manager does not provide an endpoint or IP address for clients to connect to. Therefore, if you want static IP address for your service, that must be configured at the service, not in Traffic Manager.

### Does Traffic Manager support 'sticky' sessions?
As explained [previously](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients connect to the service endpoint directly, not through Traffic Manager. Therefore, Traffic Manager does not see the HTTP traffic between the client and the server.

Additionally, the source IP address of the DNS query received by Traffic Manager belongs to the recursive DNS service, not the client. Therefore, Traffic Manager has no way to track individual clients and cannot implement 'sticky' sessions. This limitation is common to all DNS-based traffic management systems and is not specific to Traffic Manager.

### Why am I seeing an HTTP error when using Traffic Manager?
As explained [previously](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level. It uses DNS responses to direct clients to the appropriate service endpoint. Clients then connect to the service endpoint directly, not through Traffic Manager. Traffic Manager does not see HTTP traffic between client and server. Therefore, any HTTP error you see must be coming from your application. For the client to connect to the application, all DNS resolution steps are complete. That includes any interaction that Traffic Manager has on the application traffic flow.

Further investigation should therefore focus on the application.

The HTTP host header sent from the client's browser is the most common source of problems. Make sure that the application is configured to accept the correct host header for the domain name you are using. For endpoints using the Azure App Service, see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../app-service-web/web-sites-traffic-manager-custom-domain-name.md).

### What is the performance impact of using Traffic Manager?
As explained [previously](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level. Since clients connect to your service endpoints directly, there is no performance impact incurred when using Traffic Manager once the connection is established.

Since Traffic Manager integrates with applications at the DNS level, it does require an additional DNS lookup to be inserted into the DNS resolution chain (see [Traffic Manager examples](#traffic-manager-example)). The impact of Traffic Manager on DNS resolution time is minimal. Traffic Manager uses a global network of name servers, and uses [anycast](https://en.wikipedia.org/wiki/Anycast) networking to ensure DNS queries are always routed to the closest available name server. In addition, caching of DNS responses means that the additional DNS latency incurred by using Traffic Manager applies only to a fraction of sessions.

The Performance method routes traffic to the closest available endpoint. The net result is that the overall performance impact associated with this method should be minimal. Any increase in DNS latency should be offset by lower network latency to the endpoint.

### What application protocols can I use with Traffic Manager?
As explained [previously](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level. Once the DNS lookup is complete, clients connect to the application endpoint directly, not through Traffic Manager. Therefore the connection can use any application protocol. However, Traffic Manager's endpoint health checks require either an HTTP or HTTPS endpoint. The endpoint for a health check can be different than the application endpoint that clients connect to.

### Can I use Traffic Manager with a 'naked' domain name?
No. The DNS standards do not permit CNAMEs to co-exist with other DNS records of the same name. The apex (or root) of a DNS zone always contains two pre-existing DNS records; the SOA and the authoritative NS records. This means a CNAME record cannot be created at the zone apex without violating the DNS standards.

As explained in the [Traffic Manager example](#traffic-manager-example), Traffic Manager requires a DNS CNAME record to map the vanity DNS name. For example, you map www.contoso.com to the Traffic Manager profile DNS name contoso.trafficmanager.net. Additionally, the Traffic Manager profile returns a second DNS CNAME to indicate which endpoint the client should connect to.

To work around this issue, we recommend using an HTTP redirect to direct traffic from the naked domain name to a different URL, which can then use Traffic Manager. For example, the naked domain 'contoso.com' can redirect users to the CNAME 'www.contoso.com' that points to the Traffic Manager DNS name.

Full support for naked domains in Traffic Manager is tracked in our feature backlog. You can register your support for this feature request by [voting for it on our community feedback site](https://feedback.azure.com/forums/217313-networking/suggestions/5485350-support-apex-naked-domains-more-seamlessly).

## Next steps
Learn more about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

<!--Image references-->
[1]: ./media/traffic-manager-how-traffic-manager-works/dns-configuration.png
[2]: ./media/traffic-manager-how-traffic-manager-works/flow.png

