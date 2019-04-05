---
title: How Azure Application Gateway works
description: This article provides information on how to the Application Gateway Works
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 02/20/2019
ms.author: absha
---

# How Azure Application Gateway works

This article explains how an application gateway accepts the incoming requests and routes them to the backend.

![how-application-gateway-works](./media/how-application-gateway-works/how-application-gateway-works.png)

## How an application gateway accepts a request

1. Before a client sends a request to an application gateway, it resolves the domain name of the application gateway by using a Domain Name System (DNS) server. Azure controls the DNS entry because all application gateways are in the azure.com domain.

2. The Azure DNS returns the IP address to the client, which is the frontend IP address of the application gateway.

3. The application gateway accepts incoming traffic on one or more listeners. A listener is a logical entity that checks for connection requests. It's configured with a fronted IP address, protocol, and port number for connections from clients to the application gateway.

4. If a web application firewall (WAF) is enabled, the application gateway checks the request headers and the body, if present, against WAF rules to determine if the request is valid request (if so, it's then routed to the backend) or a security threat, in which case the request is blocked.  

Azure Application Gateway can be used as an internal application load-balancer or as an internet-facing application load-balancer. An internet-facing application gateway uses public IP addresses. The DNS name of an internet-facing application gateway is publicly resolvable to its public IP address. As a result, internet-facing application gateways can route client requests to the internet.

Internal application gateways use only private IP addresses. The DNS name of an internal application gateway is publicly resolvable to its private IP address. Therefore, internal load balancers can only route requests from clients with access to an Azure VNet for the application gateway.

Both internet-facing and internal-application gateways route requests to backend servers using private IP addresses. Backend servers don't need public IP addresses to receive requests from an internal or an internet-facing application gateway.

## How an application gateway routes a request

- If a request is found to be valid (or if WAF isn't enabled), the request routing rule associated with the listener is evaluated to determine which backend pool to route the request to.

- Rules are processed in the order they are listed in the portal. Based on the request routing rule, the application gateway determines whether to route all requests on the listener to a specific backend pool, route them to different backend pools depending on the URL path, or redirect requests to another port or external site.

- When a backend pool is selected, the application gateway sends the request to one of the healthy backend servers configured in the pool (y.y.y.y). The health of the server is determined by a health prob*. If the backend pool contains multiple servers, the application gateway uses a round-robin algorithm to route the requests between healthy servers. This load balances the requests on the servers.

- After the application gateway determines the backend server, it opens a new TCP session with the backend server based on the configuration in HTTP settings. HTTP settings specify the protocol, port, and other routing-related settings that are required to establish a new session with the backend server.

- The port and protocol used in HTTP settings determine whether the traffic between the application gateway and backend servers is encrypted. This establishes end-to-end, or unencrypted, SSL.

- When an application gateway sends the original request to the backend server, it honors any custom configuration made in the HTTP settings related to overriding the hostname, path, and protocol. This maintains cookie-based session affinity, connection draining, selecting the host name from the backend, and so on.

- An internal application gateway uses only private IP addresses. The DNS name of an internal application gateway is resolvable to its private IP address. As a result, internal load-balancers can only route requests from clients with access to the VNet for the application gateway.

    [!NOTE] Both internet-facing and internal application gateways route requests to backend servers by using private IP addresses. This happens if  your backend pool resource contains a private IP address, VM NIC configuration, or an internally resolvable address. If your backend pool is a public endpoint, Application Gateway uses its frontend public IP to reach the server. If you don't provide a frontend public IP address, one is assigned for the outbound external connectivity.

### Modifications to the request

Application Gateway inserts four additional headers to all requests before it forwards the requests to the backend. These headers are x-forwarded-for, x-forwarded-proto, x-forwarded-port, and x-original-host. The format for x-forwarded-for header is a comma-separated list of IP:port.

The valid values for x-forwarded-proto are HTTP or HTTPS. X-forwarded-port specifies the port where the request reached the application gateway. X-original-host header contains the original host header with which the request arrived. This header is useful in scenarios like Azure website integration, where the incoming host header is modified before traffic is routed to the backend. If session affinity is enabled as an option, then a gateway-managed affinity cookie is added.

Also, you can configure application gateway to modify headers by using [Rewrite HTTP headers](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers) or modify the URI path by using a path override setting. However, unless configured to do so, all incoming requests are proxied as they are to the backend.

## Next steps

For more information, see [Application Gateway components](application-gateway-components.md).
