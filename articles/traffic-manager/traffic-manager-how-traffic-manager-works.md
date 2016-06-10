<properties
   pageTitle="How Traffic Manager Works | Microsoft Azure"
   description="This articles will help you understand how Azure Traffic Manager works"
   services="traffic-manager"
   documentationCenter=""
   authors="jtuliani"
   manager="carmonm"
   editor="tysonn"/>

<tags
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/07/2016"
   ms.author="jonatul"/>

# How Traffic Manager works

Azure Traffic Manager enables you to control how traffic is distributed across your application endpoints.  An endpoint can be any Internet-facing endpoint, hosted in Azure or outside Azure.

Traffic Manager provides two key benefits:

1. Distribution of traffic according to one of several [traffic-routing methods](traffic-manager-routing-methods.md)
2. [Continuous monitoring of endpoint health](traffic-manager-monitoring.md) and automatic failover when endpoints fail

When an end user attempts to connect to a service endpoint, their client (PC, phone, etc) must first resolve the DNS name in that endpoint to an IP address.  The client then connects to that IP address to access the service.

**The most important point to understand is that Traffic Manager works at the DNS level.**  Traffic Manager uses DNS to direct end users to particular service endpoints, based on the chosen traffic-routing method and the current endpoint health.  Clients then connect to the selected endpoint **directly**.  Traffic Manager is not a proxy, and does not see the traffic passing between the client and the service.

## Traffic Manager example

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

## FAQ

### What IP address does Traffic Manager use?

As explained in How Traffic Manager Works, Traffic Manager works at the DNS level.  It uses DNS responses to direct clients to the appropriate service endpoint.  Clients then connect to the service endpoint directly, not through Traffic Manager.

Therefore, Traffic Manager does not provide an endpoint or IP address for clients to connect to.  So if for example a static IP address is required, that must be configured at the service, not in Traffic Manager.

### Does Traffic Manager support ‘sticky’ sessions?

As explained [above](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level.  It uses DNS responses to direct clients to the appropriate service endpoint.  Clients then connect to the service endpoint directly, not through Traffic Manager.  Therefore, Traffic Manager does not see HTTP traffic between client and server, including cookies.

In addition, note that the source IP address of the DNS query received by Traffic Manager is the IP address of the recursive DNS service, not the IP address of the client.

Therefore, Traffic Manager has no way to identify or track individual clients, and therefore cannot implement ‘sticky’ sessions.  This is common to all DNS-based traffic management systems, it is not a restriction of using Traffic Manager.

### I’m seeing an HTTP error when using Traffic Manager…why?

As explained [above](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level.  It uses DNS responses to direct clients to the appropriate service endpoint.  Clients then connect to the service endpoint directly, not through Traffic Manager.

Therefore, Traffic Manager does not see HTTP traffic between client and server, and cannot generate HTTP-level errors.  Any HTTP error you see must be coming from your application.  Since the client is connecting to the application, this also means that DNS resolution including the role of Traffic Manager must have been completed.

Further investigation should therefore focus on the application.

A common problem is that when using Traffic Manager, the ‘host’ HTTP header passed by the browser to the application will show the domain name used in the browser.  This may be the Traffic Manager domain name (e.g. myprofile.trafficmanager.net) if you are using that domain name during testing, or may be the vanity domain CNAME configured to point to the Traffic Manager domain name.  In either case, check that the application is configured to accept this host header.

If your application is hosted in the Azure App Service, please see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../app-service-web/web-sites-traffic-manager-custom-domain-name.md).

### What is the performance impact of using Traffic Manager?

As explained [above](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level.  It uses DNS responses to direct clients to the appropriate service endpoint.  Clients then connect to the service endpoint directly, not through Traffic Manager.

Since clients connect to your service endpoints directly, there is no performance impact incurred when using Traffic Manager once the connection is established.

Since Traffic Manager integrates with applications at the DNS level, it does require an additional DNS lookup to be inserted into the DNS resolution chain (see [Traffic Manager examples](#traffic-manager-example)).  The impact of Traffic Manager on DNS resolution time is minimal.  Traffic Manager uses a global network of name servers, and uses anycast networking to ensure DNS queries are always routed to the closest available name server.  In addition, caching of DNS responses means that the additional DNS latency incurred by using Traffic Manager applies only to a fraction of sessions.

The net result is that the overall performance impact associated with incorporating Traffic Manager into your application should be minimal.  

In addition, where Traffic Manager’s [‘Performance’ traffic-routing method](traffic-manager-routing-methods.md#performance-traffic-routing-method) is used, the increase in DNS latency should be far more than offset by the improvement in performance achieved by routing end users to their closest available endpoint.

### What application protocols can I use with Traffic Manager?
As explained [above](#how-clients-connect-using-traffic-manager), Traffic Manager works at the DNS level.  Once the DNS lookup is complete, clients connect to the application endpoint directly, not through Traffic Manager.  This connection can therefore use any application protocol.

However, Traffic Manager’s endpoint health checks require either an HTTP or HTTPS endpoint.  This can be separate from the application endpoint that clients connect to, by specifying a different TCP port or URI path in the Traffic Manager profile health check settings.

### Can I use Traffic Manager with a ‘naked’ (www-less) domain name?

Not currently.

The DNS CNAME record type is used to create a mapping from one DNS name to another name.  As explained in the [Traffic Manager example](#traffic-manager-example), Traffic Manager requires a DNS CNAME record to map the vanity DNS name (e.g. www.contoso.com) to the Traffic Manager profile DNS name (e.g. contoso.trafficmanager.net).  In addition the Traffic Manager profile itself returns a second DNS CNAME to indicate which endpoint the client should connect to.

The DNS standards do not permit CNAMEs to co-exist with other DNS records of the same type.  Since the apex (or root) of a DNS zone always contains two pre-existing DNS records (the SOA and the authoritative NS records), this means a CNAME record cannot be created at the zone apex without violating the DNS standards.

To work around this issue, we recommend that services using a naked (www-less) domain that want to use Traffic Manager should use an HTTP re-direct to direct traffic from the naked domain to a different URL, which can then use Traffic Manager.  For example, the naked domain ‘contoso.com’ can re-direct users to ‘www.contoso.com’ which can then use Traffic Manager.

Full support for naked domains in Traffic Manager is tracked in our feature backlog.  If you are interested in this feature please register your support by [voting for it on our community feedback site](https://feedback.azure.com/forums/217313-networking/suggestions/5485350-support-apex-naked-domains-more-seamlessly).

## Next steps

Learn more about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

<!--Image references-->
[1]: ./media/traffic-manager-how-traffic-manager-works/dns-configuration.png
[2]: ./media/traffic-manager-how-traffic-manager-works/flow.png

