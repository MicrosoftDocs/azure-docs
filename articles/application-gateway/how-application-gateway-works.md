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

Application Gateway is a cloud Application Delivery Controller with layer 7 (HTTP) load balancing that enables you to manage the web traffic across your servers. Additionally, it also provides Web Application Firewall (WAF) capabilities that provide centralized protection of your web services from common web exploits and vulnerabilities.

When a client makes an HTTP request to the Application Gateway, it acts as a reverse proxy and forwards the traffic to the backend servers based on your configuration. Additionally, the Application Gateway also monitors the health of its backend servers and ensures that it routes traffic only to healthy backends.

![how-application-gateway-works](.\media\how-application-gateway-works\how-application-gateway-works.png)

## How request is accepted

Before a client sends a request to your Application Gateway, it resolves the Application Gateway's domain name using a Domain Name System (DNS) server. The DNS entry is controlled by Azure, because your Application Gateways are in the azure.com domain. The Azure DNS returns the IP address to the client, which is the *frontend IP address* of the Application Gateway. The Application Gateway accepts incoming traffic on one or more *listeners*. A listener is a process that checks for connection requests. It is configured with a fronted IP address, protocol, and port number for connections from clients to the Application Gateway. If WAF is enabled, Application Gateway checks the request headers and the body (if present) against the *WAF rules* to determine whether the request is a valid request - in which case it will be routed to the backend - or a security threat, in which case the request will be blocked.  

## How request is routed

If the request is found to be valid (or if WAF is not enabled), the *request routing rule* associated with the *listener* is evaluated to determine the *backend pool* to which the request is to be routed. Rules are processed in the order they are listed in the portal. Based on the *request routing rule* configuration, the Application Gateway decides whether to route all the requests on the listener to a specific backend pool or to route them to different backend pools depending on the URL path or to *redirect requests* to another port or external site

Once a *backend* *pool* has been chosen, Application Gateway sends the request to one of the backend servers configured in the pool that is healthy (y.y.y.y). The health of the server is determined by a *health probe*. If the backend pool contains more than one server, Application Gateway uses the round robin algorithm to route the requests between the healthy servers, thus load balancing the requests on the servers.

After a backend server has been determined, Application Gateway opens a new TCP session with the backend server based on the configuration in the *HTTP settings*. The *HTTP settings* is a component that specifies the protocol, port, and other routing-related setting which is required for establishing a new session with the backend server. The port and protocol used in the HTTP settings determine whether the traffic between the Application Gateway and backend servers is encrypted, thus accomplishing end to end SSL, or unencrypted. While sending the original request to the backend server, Application Gateway honors any custom configuration made in the HTTP settings related to overriding the hostname, path,  protocol; maintaining cookie-based session affinity, connection draining, picking the host name from the backend, etc.

The Application gateway also inserts these three default HTTP* headers: x-forwarded-for, x-forwarded-proto, and x-forwarded-port into the request forwarded to the backend.

Once the backend server processes the request and sends an HTTP response with the page content to the Application Gateway, the Application Gateway forwards the response to the client where the page is displayed in the browser.

## Application Load-Balancing Type

You can use the Application Gateway as an internal application load balancer or an Internet-facing application load balancer. An Internet-facing Application Gateway has public IP addresses. The DNS name of an Internet-facing Application Gateway is publicly resolvable to its public IP address. Therefore, Internet-facing Application Gateways can route requests from clients over the Internet.

An internal Application Gateway has only private IP address. The DNS name of an internal Application Gateway is internally resolvable to its private IP address. Therefore, internal load balancers can only route requests from clients with access to the VNET for the Application Gateway.

Note that both Internet-facing and internal Application Gateways route requests to your backend servers using private IP addresses. If  your backend pool resource contains a private IP address, VM NIC configuration, or an internally resolvable address, and if your backend pool is a public endpoint, Application Gateway uses its frontend public IP to reach the server. If you haven't provisioned a frontend public IP address, one is assigned for the outbound external connectivity.

## Next steps

After learning about how Application Gateway works, go to [Application Gateway Components](application-gateway-components.md) to understand its components in more details.
