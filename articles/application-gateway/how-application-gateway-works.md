---
title: How Azure Application Gateway Works
description: This article provides information on how to the Application Gateway Works
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 02/20/2019
ms.author: absha
---

# How Application Gateway Works

This article explains how the application gateway accepts the incoming requests and routes them to the backend.

![how-application-gateway-works](./media/how-application-gateway-works/how-application-gateway-works.png)

## How a request is accepted

Before a client sends a request to your application gateway, it resolves the application gateway's domain name using a Domain Name System (DNS) server. The DNS entry is controlled by Azure, because your application gateways are in the azure.com domain. The Azure DNS returns the IP address to the client, which is the *frontend IP address* of the Application Gateway. The application gateway accepts incoming traffic on one or more *listeners*. A listener is a logical entity that checks for connection requests. It is configured with a fronted IP address, protocol, and port number for connections from clients to the application gateway. If Web Application Firewall (WAF) is enabled, Application Gateway checks the request headers and the body (if present) against the *WAF rules* to determine whether the request is a valid request - in which case it will be routed to the backend - or a security threat, in which case the request will be blocked.  

Application gateway can be used as an internal application load balancer or an Internet-facing application load balancer. An Internet-facing application gateway has public IP addresses. The DNS name of an Internet-facing application gateway is publicly resolvable to its public IP address. Therefore, Internet-facing application gateways can route requests from clients over the Internet. Internal application gateways have only private IP address. The DNS name of an internal application gateway is publicly resolvable to its private IP address. Therefore, internal load balancers can only route requests from clients with access to the VNET for the application gateway. Both Internet-facing and internal Application Gateways route requests to your backend servers using private IP addresses. Therefore, your backend servers do not need public IP addresses to receive requests from an internal or an Internet-facing Application Gateway.

## How a request is routed

If the request is found to be valid (or if WAF is not enabled), the *request routing rule* associated with the *listener* is evaluated to determine the *backend pool* to which the request is to be routed. Rules are processed in the order they are listed in the portal. Based on the *request routing rule* configuration, the application gateway decides whether to route all the requests on the listener to a specific backend pool or to route them to different backend pools depending on the URL path or to *redirect requests* to another port or external site

Once a *backend* *pool* has been chosen, application gateway sends the request to one of the backend servers configured in the pool that is healthy (y.y.y.y). The health of the server is determined by a *health probe*. If the backend pool contains more than one server, application gateway uses the round robin algorithm to route the requests between the healthy servers, thus load balancing the requests on the servers.

After a backend server has been determined, application gateway opens a new TCP session with the backend server based on the configuration in the *HTTP settings*. The *HTTP settings* is a component that specifies the protocol, port, and other routing-related setting which is required for establishing a new session with the backend server. The port and protocol used in the HTTP settings determine whether the traffic between the application gateway and backend servers is encrypted, thus accomplishing end to end SSL, or unencrypted. While sending the original request to the backend server, application gateway honors any custom configuration made in the HTTP settings related to overriding the hostname, path,  protocol; maintaining cookie-based session affinity, connection draining, picking the host name from the backend, etc.

An internal Application Gateway has only private IP address. The DNS name of an internal Application Gateway is internally resolvable to its private IP address. Therefore, internal load balancers can only route requests from clients with access to the VNET for the Application Gateway.

Note that both Internet-facing and internal Application Gateways route requests to your backend servers using private IP addresses,if  your backend pool resource contains a private IP address, VM NIC configuration, or an internally resolvable address, and if your backend pool is a public endpoint, Application Gateway uses its frontend public IP to reach the server. If you haven't provisioned a frontend public IP address, one is assigned for the outbound external connectivity.

### Modifications to the request

Application gateway inserts 4 additional headers to all requests before it forwards the requests to the backend. These headers are X-forwarded-for, X-forwarded-proto, X-forwarded-port and X-original-host. The format for x-forwarded-for header is a comma-separated list of IP:port. The valid values for x-forwarded-proto are HTTP or HTTPS. X-forwarded-port specifies the port at which the request reached at the application gateway. X-original-host header contains the original host header with which the request arrived. This header is useful in scenarios like Azure Website integration, where the incoming host header is modified before traffic is routed to the backend. Optionally, if session affinity is enabled, then a gateway managed affinity cookie is inserted. 

You can additionally configure application gateway to modify headers using [Rewrite HTTP headers](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers) or modify URI path using path override setting. But unless configured to do so, all incoming requests are proxied as is to the backend.


## Next steps

After learning about how application gateway works, see [Application gateway components](application-gateway-components.md) to understand its components in more details.
