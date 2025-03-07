---
title: How an application gateway works
description: This article provides information about how an application gateway accepts incoming requests and routes them to the backend.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 05/01/2024
ms.author: greglin
---

# How an application gateway works

This article explains how an [application gateway](overview.md) accepts incoming requests and routes them to the backend.

![How an application gateway accepts a request](./media/how-application-gateway-works/how-application-gateway-works.png)

## How an application gateway accepts a request

1. Before a client sends a request to an application gateway, it resolves the domain name of the application gateway by using a Domain Name System (DNS) server. Azure controls the DNS entry because all application gateways are in the azure.com domain.

2. The Azure DNS returns the IP address to the client, which is the frontend IP address of the application gateway.

3. The application gateway accepts incoming traffic on one or more listeners. A listener is a logical entity that checks for connection requests. It's configured with a frontend IP address, protocol, and port number for connections from clients to the application gateway.

4. If a web application firewall (WAF) is in use, the application gateway checks the request headers and the body, if present, against WAF rules. This action determines if the request is valid request or a security threat. If the request is valid, it's routed to the backend. If the request isn't valid and WAF is in Prevention mode, it's blocked as a security threat. If it's in Detection mode, the request is evaluated and logged, but still forwarded to the backend server.

Azure Application Gateway can be used as an internal application load balancer or as an internet-facing application load balancer. An internet-facing application gateway uses public IP addresses. The DNS name of an internet-facing application gateway is publicly resolvable to its public IP address. As a result, internet-facing application gateways can route client requests from the internet.

Internal application gateways use only private IP addresses. If you're using a Custom or [Private DNS zone](../dns/private-dns-overview.md), the domain name should be internally resolvable to the private IP address of the Application Gateway. Therefore, internal load-balancers can only route requests from clients with access to a virtual network for the application gateway.

## How an application gateway routes a request

If a request is valid and not blocked by WAF, the application gateway evaluates the request routing rule that's associated with the listener. This action determines which backend pool to route the request to.

Based on the request routing rule, the application gateway determines whether to route all requests on the listener to a specific backend pool, route requests to different backend pools based on the URL path, or redirect requests to another port or external site.
> [!NOTE]
> Rules are processed in the order they're listed in the portal for v1 SKU. 

When the application gateway selects the backend pool, it sends the request to one of the healthy backend servers in the pool (y.y.y.y). The health of the server is determined by a health probe. If the backend pool contains multiple servers, the application gateway uses a round-robin algorithm to route the requests between healthy servers. This load balances the requests on the servers.

After the application gateway determines the backend server, it opens a new TCP session with the backend server based on HTTP settings. HTTP settings specify the protocol, port, and other routing-related settings that are required to establish a new session with the backend server.

The port and protocol used in HTTP settings determine whether the traffic between the application gateway and backend servers is encrypted (thus accomplishing end-to-end TLS) or is unencrypted.

When an application gateway sends the original request to the backend server, it honors any custom configuration made in the HTTP settings related to overriding the hostname, path, and protocol. This action maintains cookie-based session affinity, connection draining, host-name selection from the backend, and so on.

 > [!NOTE]
> If the backend pool:
> - **Is a public endpoint**, the application gateway uses its frontend public IP to reach the server. If there isn't a frontend public IP address, one is assigned for the outbound external connectivity.
> - **Contains an internally resolvable FQDN or a private IP address**, the application gateway routes the request to the backend server by using its instance private IP addresses.
> - **Contains an external endpoint or an externally resolvable FQDN**, the application gateway routes the request to the backend server by using its frontend public IP address. If the subnet contains [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), the application gateway will route the request to the service via its private IP address. DNS resolution is based on a private DNS zone or custom DNS server, if configured, or it uses the default Azure-provided DNS. If there isn't a frontend public IP address, one is assigned for the outbound external connectivity.

### Backend server DNS resolution

When a backend pool's server is configured with a Fully Qualified Domain Name (FQDN), Application Gateway performs a DNS lookup to get the domain name's IP address(es). The IP value is stored in your application gateway's cache to enable it to reach the targets faster when serving incoming requests.

The Application Gateway retains this cached information for the period equivalent to that DNS record's TTL (time to live) and performs a fresh DNS lookup once the TTL expires. If a gateway detects a change in IP address for its subsequent DNS query, it will start routing the traffic to this updated destination. In case of problems such as the DNS lookup failing to receive a response or the record no longer exists, the gateway continues to use the last-known-good IP address(es). This ensures minimal impact on the data path.

> [!IMPORTANT]
>  * When using custom DNS servers with Application Gateway's Virtual Network, it is important that all servers respond consistently with the same DNS values. When an instance of your Application Gateway issues a DNS query, it uses the value from the server that responds first.
>  * Users of on-premises custom DNS servers must ensure connectivity to Azure DNS through [Azure DNS Private Resolver](../dns/private-resolver-hybrid-dns.md) (recommended) or a DNS forwarder VM when using a Private DNS zone for Private endpoint.

### Modifications to the request

Application gateway inserts six additional headers to all requests before it forwards the requests to the backend. These headers are x-forwarded-for, x-forwarded-port, x-forwarded-proto, x-original-host, x-original-url, and x-appgw-trace-id. The format for x-forwarded-for header is a comma-separated list of IP:port.

The valid values for x-forwarded-proto are HTTP or HTTPS. X-forwarded-port specifies the port where the request reached the application gateway. X-original-host header contains the original host header with which the request arrived. This header is useful in Azure website integration, where the incoming host header is modified before traffic is routed to the backend. If session affinity is enabled as an option, then it adds a gateway-managed affinity cookie.

X-appgw-trace-id is a unique guid generated by application gateway for each client request and presented in the forwarded request to the backend pool member.  The guid consists of 32 alphanumeric characters presented without dashes (for example: ac882cd65a2712a0fe1289ec2bb6aee7). This guid can be used to correlate a request received by application gateway and initiated to a backend pool member via the transactionId property in [Diagnostic Logs](application-gateway-diagnostics.md#diagnostic-logging).

You can configure application gateway to modify request and response headers and URL by using [Rewrite HTTP headers and URL](rewrite-http-headers-url.md) or to modify the URI path by using a path-override setting. However, unless configured to do so, all incoming requests are proxied to the backend.

## Next steps

- [Learn about application gateway components](application-gateway-components.md)
- Review [Azure Application Gateway features](features.md)
