---
title: How Azure Traffic Manager works
description: This article helps you understand how Traffic Manager routes traffic for high performance and availability of your web applications.
services: traffic-manager
author: greg-lindsay
manager: kumud
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/14/2023
ms.author: greglin
ms.custom: template-concept
---

# How Traffic Manager Works

Azure Traffic Manager enables you to control the distribution of traffic across your application endpoints. An endpoint is any Internet-facing service hosted inside or outside of Azure.

Traffic Manager provides two key benefits:

- Distribution of traffic according to one of several [traffic-routing methods](traffic-manager-routing-methods.md)
- [Continuous monitoring of endpoint health](traffic-manager-monitoring.md) and automatic failover when endpoints fail

When a client attempts to connect to a service, it must first resolve the DNS name of the service to an IP address. The client then connects to that IP address to access the service.

**The most important point to understand is that Traffic Manager works at the DNS level which is at the Application layer (Layer-7).**  Traffic Manager uses DNS to direct clients to specific service endpoints based on the rules of the traffic-routing method. Clients connect to the selected endpoint **directly**. Traffic Manager is not a proxy or a gateway. Traffic Manager does not see the traffic passing between the client and the service.

Traffic Manager uses profiles to control traffic to your cloud services or website endpoints. For more information about profiles, see [Manage an Azure Traffic Manager profile](traffic-manager-manage-profiles.md).

## Traffic Manager example

Contoso Corp have developed a new partner portal. The URL for this portal is `https://partners.contoso.com/login.aspx`. The application is hosted in three regions of Azure. To improve availability and maximize global performance, they use Traffic Manager to distribute client traffic to the closest available endpoint.

To achieve this configuration, they complete the following steps:

1. Deploy three instances of their service. The DNS names of these deployments are 'contoso-us.cloudapp.net', 'contoso-eu.cloudapp.net', and 'contoso-asia.cloudapp.net'.
2. Create a Traffic Manager profile, named 'contoso.trafficmanager.net', and configure it to use the 'Performance' traffic-routing method across the three endpoints.
3. Configure their vanity domain name, 'partners.contoso.com', to point to 'contoso.trafficmanager.net', using a DNS CNAME record.

> [!IMPORTANT]
> Only one Azure [tenant ID] can own a given root traffic manager DNS name. Attempting to use a name that is already in use will display an error. In the following example, the root DNS name is **contoso**. Also, if a profile is created using a dot-separated name, such as **partners.contoso.trafficmanager.net**, then **contoso.trafficmanager.net** is automatically reserved.

![Traffic Manager DNS configuration][1]

> [!NOTE]
> When using a vanity domain with Azure Traffic Manager, you must use a CNAME to point your vanity domain name to your Traffic Manager domain name. DNS standards don't allow you to create a CNAME at the 'apex' (or root) of a domain. Thus you cannot create a CNAME for 'contoso.com' (sometimes called a 'naked' domain). You can only create a CNAME for a domain under 'contoso.com', such as 'www.contoso.com'. To work around this limitation, we recommend hosting your DNS domain on [Azure DNS](../dns/dns-overview.md) and using [Alias records](../dns/tutorial-alias-tm.md) to point to your traffic manager profile. Alternatively you can use a simple HTTP redirect to direct requests for 'contoso.com' to an alternative name such as 'www.contoso.com'.

### How clients connect using Traffic Manager

Continuing from the previous example, when a client requests the page `https://partners.contoso.com/login.aspx`, the client performs the following steps to resolve the DNS name and establish a connection:

![Connection establishment using Traffic Manager][2]

1. The client sends a DNS query to its configured recursive DNS service to resolve the name 'partners.contoso.com'. A recursive DNS service, sometimes called a 'local DNS' service, does not host DNS domains directly. Rather, the client off-loads the work of contacting the various authoritative DNS services across the Internet needed to resolve a DNS name.
2. To resolve the DNS name, the recursive DNS service finds the name servers for the 'contoso.com' domain. It then contacts those name servers to request the 'partners.contoso.com' DNS record. The contoso.com DNS servers return the CNAME record that points to contoso.trafficmanager.net.
3. Next, the recursive DNS service finds the name servers for the 'trafficmanager.net' domain, which are provided by the Azure Traffic Manager service. It then sends a request for the 'contoso.trafficmanager.net' DNS record to those DNS servers.
4. The Traffic Manager name servers receive the request. They choose an endpoint based on:

    - The configured state of each endpoint (disabled endpoints are not returned)
    - The current health of each endpoint, as determined by the Traffic Manager health checks. For more information, see [Traffic Manager Endpoint Monitoring](traffic-manager-monitoring.md).
    - The chosen traffic-routing method. For more information, see [Traffic Manager Routing Methods](traffic-manager-routing-methods.md).

5. The chosen endpoint is returned as another DNS CNAME record. In this case, let us suppose contoso-eu.cloudapp.net is returned.
6. Next, the recursive DNS service finds the name servers for the 'cloudapp.net' domain. It contacts those name servers to request the 'contoso-eu.cloudapp.net' DNS record. A DNS 'A' record containing the IP address of the EU-based service endpoint is returned.
7. The recursive DNS service consolidates the results and returns a single DNS response to the client.
8. The client receives the DNS results and connects to the given IP address. The client connects to the application service endpoint directly, not through Traffic Manager. Since it is an HTTPS endpoint, the client performs the necessary SSL/TLS handshake, and then makes an HTTP GET request for the '/login.aspx' page.

#### Traffic Manager and the DNS cache

The recursive DNS service caches the DNS responses it receives. The DNS resolver on the client device also caches the result. Caching enables subsequent DNS queries to be answered more quickly by using data from the cache rather than querying other name servers. The duration of the cache is determined by the 'time-to-live' (TTL) property of each DNS record. Shorter values result in faster cache expiry and thus more round-trips to the Traffic Manager name servers. Longer values mean that it can take longer to direct traffic away from a failed endpoint. Traffic Manager allows you to configure the TTL used in Traffic Manager DNS responses to be as low as 0 seconds and as high as 2,147,483,647 seconds (the maximum range compliant with [RFC-1035](https://www.ietf.org/rfc/rfc1035.txt)), enabling you to choose the value that best balances the needs of your application.

## FAQs

* [What IP address does Traffic Manager use?](./traffic-manager-faqs.md#what-ip-address-does-traffic-manager-use)

* [What types of traffic can be routed using Traffic Manager?](./traffic-manager-faqs.md#what-types-of-traffic-can-be-routed-using-traffic-manager)

* [Does Traffic Manager support "sticky" sessions?](./traffic-manager-faqs.md#does-traffic-manager-support-sticky-sessions)

* [Why am I seeing an HTTP error when using Traffic Manager?](./traffic-manager-faqs.md#why-am-i-seeing-an-http-error-when-using-traffic-manager)

* [How can I resolve a 500 (Internal Server Error) problem when using Traffic Manager?](./traffic-manager-faqs.md#how-can-i-resolve-a-500-internal-server-error-problem-when-using-traffic-manager)

* [What is the performance impact of using Traffic Manager?](./traffic-manager-faqs.md#what-is-the-performance-impact-of-using-traffic-manager)

* [What application protocols can I use with Traffic Manager?](./traffic-manager-faqs.md#what-application-protocols-can-i-use-with-traffic-manager)

* [Can I use Traffic Manager with a "naked" domain name?](./traffic-manager-faqs.md#can-i-use-traffic-manager-with-a-naked-domain-name)

* [Does Traffic Manager consider the client subnet address when handling DNS queries?](./traffic-manager-faqs.md#does-traffic-manager-consider-the-client-subnet-address-when-handling-dns-queries)

* [What is DNS TTL and how does it impact my users?](./traffic-manager-faqs.md#what-is-dns-ttl-and-how-does-it-impact-my-users)

* [How high or low can I set the TTL for Traffic Manager responses?](./traffic-manager-faqs.md#how-high-or-low-can-i-set-the-ttl-for-traffic-manager-responses)

* [How can I understand the volume of queries coming to my profile?](./traffic-manager-faqs.md#how-can-i-understand-the-volume-of-queries-coming-to-my-profile)

## Next steps

Learn more about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

<!--Image references-->
[1]: ./media/traffic-manager-how-traffic-manager-works/dns-configuration.png
[2]: ./media/traffic-manager-how-traffic-manager-works/flow.png
