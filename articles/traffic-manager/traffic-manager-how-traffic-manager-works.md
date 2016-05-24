<properties
   pageTitle="How Traffic Manager Works | Microsoft Azure"
   description="This articles will help you understand how Azure Traffic Manager works"
   services="traffic-manager"
   documentationCenter=""
   authors="jonatul"
   manager="carmonm"
   editor="tysonn"/>

<tags
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/25/2016"
   ms.author="jonatul"/>

# How Traffic Manager Works

Azure Traffic Manager enables you to control how traffic is distributed across your application endpoints.  An endpoint can be any Internet-facing endpoint, hosted in Azure or outside Azure.

Traffic Manager provides two key benefits:

1. Distribution of traffic according to one of several [traffic-routing methods](traffic-manager-routing-methods.md)
2. [Continuous monitoring of endpoint health](traffic-manager-monitoring.md) and automatic failover when endpoints fail

When an end user attempts to connect to a service endpoint, their client (PC, phone, etc) must first resolve the DNS name in that endpoint to an IP address.  The client then connects to that IP address to access the service.

**The most important point to understand is that Traffic Manager works at the DNS level.**  Traffic Manager uses DNS to direct end users to particular service endpoints, based on the chosen traffic-routing method and the current endpoint health.  Clients then connect to the selected endpoint **directly**.  Traffic Manager is not a proxy, and does not see the traffic passing between the client and the service.

## Traffic Manager Example

Contoso Corp have developed a new partner portal.  The URL for this portal will be https://partners.contoso.com/login.aspx.  The application is hosted in Azure, and to improve availability and maximize global performance, they wish to deploy the application to 3 regions worldwide and use Traffic Manager to distribute end users to their closest available endpoint.

To achieve this configuration:

- They deploy 3 instances of their service.  The DNS names of these deployments are ‘contoso-us.cloudapp.net’, ’contoso-eu.cloudapp.net’, and ‘contoso-asia.cloudapp.net’.
- They then create a Traffic Manager profile, named ‘contoso.trafficmanager.net’, which is configured to use the ‘Performance’ traffic-routing method across the 3 endpoints named above.
- Finally, they configure their vanity domain, ‘partners.contoso.com’ to point to ‘contoso.trafficmanager.net’, using a DNS CNAME record.

![Traffic Manager DNS configuration][1]

> [AZURE.NOTE] When using a vanity domain with Azure Traffic Manager, you must use a CNAME to point your vanity domain name to your Traffic Manager domain name.

> Due to a restriction of the DNS standards, a CNAME cannot be created at the ‘apex’ (or root) of a domain.  Thus you cannot create a CNAME for ‘contoso.com’ (sometimes called a ‘naked’ domain).  You can only crate a CNAME for a domain under ‘contoso.com’, such as ‘www.contoso.com’.

> Thus you cannot use Traffic Manager directly with a naked domain.  To work around this, we recommend using a simple HTTP re-direct to direct requests for ‘contoso.com’ to an alternative name such as ‘www.contoso.com’.

## How clients connect using Traffic Manager

When an end user requests the page https://partners.contoso.com/login.aspx (as described in the above example), their client performs the following steps to resolve the DNS name and establish a connection.

![Connection establishment using Traffic Manager][2]

1.	The client (PC, phone, etc) make a DNS query for ‘partners.contoso.com’ to its configured recursive DNS service.  (A recursive DNS service, sometimes called a ‘local DNS’ service, does not host DNS domains directly.  Rather, it is used by the client to off-load the work of contacting the various authoritative DNS services across the Internet needed to resolve a DNS name.)
2.	The recursive DNS service now resolves the ‘partners.contoso.com’ DNS name. Firstly, the recursive DNS service finds the name servers for the ‘contoso.com’ domain.  It then contacts those name servers to request the ‘partners.contoso.com’ DNS record.  The CNAME to contoso.trafficmanager.net is returned.
3.	The recursive DNS service now finds the name servers for the ‘trafficmanager,net’ domain, which are provided by the Azure Traffic Manager service.  It contacts those name servers to request the ‘contoso.trafficmanager.net’ DNS record.
4.	The Traffic Manager name servers receive the request.  They then choose which endpoint should be returned, based on:
a.	The enabled/disabled state of each endpoint (disabled endpoints are not returned)
b.	The current health of each endpoint, as determined by the Traffic Manager health checks.  For more information, see Traffic Manager Endpoint Monitoring.
c.	The chosen traffic-routing method.  For more information, see Traffic Manager Traffic-Routing Methods.
5.	The chosen endpoint is returned as another DNS CNAME record, in this case, let us suppose contoso-us.cloudapp.net is returned.
6.	The recursive DNS service now finds the name servers for the ‘cloudapp.net’ domain.  It contacts those name servers to request the ‘contoso-us.cloudapp.net’ DNS record.  A DNS ‘A’ record containing the IP address of the US-based service endpoint is returned.
7.	The recursive DNS service returns the consolidated results of the above sequence of name resolutions to the client.
8.	The client receives the DNS results from the recursive DNS service, and connects to the given IP address.  Note that it connects to the application service endpoint directly, not through Traffic Manager.  Since it is an HTTPS endpoint, it performs the necessary SSL/TLS handshake, and then makes an HTTP GET request for the ‘/login.aspx’ page.

Note that the recursive DNS service will cache the DNS responses it receives, as will the DNS client on the end-user’s device.  This enables subsequent DNS queries to be answered more quickly, by using data from the cache rather than querying other name servers.  The duration of the cache is determined by the ‘time-to-live’ (TTL) property of each DNS record.  Shorter values result in faster cache expiry and thus more round-trips to the Traffic Manager name servers; longer values mean in can take longer to direct traffic away from a failed endpoint.  Traffic Manager allows you to configure the TTL used in Traffic Manager DNS responses, enabling you to choose the value that best balances the needs of your application.

## Next Steps

Learn more about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

<!--Image references-->
[1]: ./media/traffic-manager-how-traffic-manager-works/dns-configuration.png
[2]: ./media/traffic-manager-how-traffic-manager-works/flow.png

