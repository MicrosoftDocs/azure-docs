---
title: Azure Application Gateway Components
description: This article provides information on the various components in Application Gateway
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 02/20/2019
ms.author: absha
---

# Application gateway components

 An application gateway serves as the single point of contact for clients. It distributes incoming application traffic across multiple backend pools, such as Azure VMs, virtual machine scale sets, App Services, or on-premises/external servers. To do this, it uses several components described in this article.

![application-gateway-components](./media/application-gateway-components/application-gateway-components.png)

## Frontend IP address

A frontend IP address is the IP address associated with the application gateway. You can configure the application gateway to either have a public IP address or a private IP address, or both. Only one public IP address or one private IP address is supported. Your virtual network and public IP address must be in the same location as your application gateway.

A Frontend IP address is associated to a *listener* after it is created. 

### Static vs dynamic public IP address

The v1 SKU supports static internal IP addresses but does not support static public IP addresses. The VIP can change if the application gateway is stopped and started. The DNS name associated with the application gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the application gateway.

The Application Gateway v2 SKU supports static public IP addresses, as well as static Internal IP addresses. 

## Listeners

Before you start using your application gateway, you must add one or more listeners. A listener is a logical entity that checks for incoming connection requests and accepts the requests if the protocol, port, host and IP address associated with the request match with the protocol, port, host and IP address associated with the listener configuration. There can be multiple listeners attached to an application gateway and they can be used for the same protocol. After the listener detects incoming requests from the clients, the Application Gateway routes these requests to the members in the backend pool, using the request routing rules that you define for the listener that received the incoming request.

Listeners support the following ports and protocols:

### Ports

This is the port on which the listener is listening for the client request. You can configure ports ranging from 1 to 65502 for V1 SKU and 1 to 65199 for V2 SKU.

### Protocols

Application gateway supports the following four protocols: HTTP, HTTPS, HTTP/2, and WebSocket

You explicitly specify the choice between the HTTP and HTTPS protocols in the listener configuration. The [support for the WebSockets and HTTP/2 protocols](https://docs.microsoft.com/azure/application-gateway/overview#websocket-and-http2-traffic) is provided natively. [Websocket support](https://docs.microsoft.com/azure/application-gateway/application-gateway-websocket) is enabled by default. There's no user-configurable setting to selectively enable or disable WebSocket support. You can use WebSockets with both HTTP and HTTPS listeners. HTTP/2 protocol support is available to clients connecting to application gateway listeners only. The communication to backend server pools is over HTTP/1.1. By default, HTTP/2 support is disabled. You can choose to enable it.

You can use an HTTPS listener for SSL termination. An HTTPS listener offloads the encryption and decryption work to your application gateway so that your web servers aren't burdened by that overhead. Your applications are then free to focus on their business logic.

### Custom error pages

Application gateway allows you to create custom error pages instead of displaying default error pages. You can use your own branding and layout using a custom error page. Application gateway can display a custom error page when a request can't reach the backend. For more information, see [Custom error pages for your Application Gateway](https://docs.microsoft.com/azure/application-gateway/custom-error).

### Types of listeners

There are two types of listeners:

- **Basic**: This type of listener listens to a single domain site where it has a single DNS mapping to IP address of the application gateway. This listener configuration is required when you are hosting a single site behind an application gateway.
- **Multi-site**: This listener configuration is required when you configure more than one web application on the same application gateway instance. This allows you to configure a more efficient topology for your deployments by adding up to 100 websites to one application gateway. Each website can be directed to its own backend pool. For example:  For three subdomains — abc.contoso.com, xyz.contoso.com and pqr.contoso.com pointing to the IP address of the application gateway. Create three listeners of the type *multi-site* and configure each listener for the respective port and protocol setting. For more information, see [Multiple site hosting](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-app-overview).

After you create a listener, you associate it with a request routing rule that determines how the request received on the listener is to be routed to the backend.

Listeners are processed in the order they are shown. For that reason, if a basic listener matches an incoming request it processes it first. Multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

## Request routing rule

This is the most important component of the application gateway and determines how the traffic on the listener associated with this rule is routed. The rule binds the listener, the back-end server pool, and the backend HTTP settings. Once a request is accepted by a listener, the request routing rule determines whether the request is to be forwarded to the backend or redirected elsewhere. If the request is determined to be forwarded to the backend, the request routing rule defines which back-end server pool  should it be forwarded to. Additionally, the request routing rule also determines if the headers in the request are to be rewritten. One listener can be attached to only one rule.

There can be two types of request routing rules:

- **Basic:** All requests on the associated listener (for example: blog.contoso.com/*) are forwarded to the associated backend pool using the associated HTTP setting.
- **Path-based:** This rule type lets you route the requests on the associated listener to a specific backend pool based on the URL in the request. If the path of the URL in a request matches the path pattern in a path-based rule, the request is routed using that rule. The path pattern is applied only to the path of the URL, not to its query parameters. If the path of the URL of a request on a listener doesn't match any of the path-based rules, then the request is routed to the *Default* backend pool and the *Default* HTTP Settings. For more information, see [URL based routing](https://docs.microsoft.com/azure/application-gateway/url-route-overview).

### Redirection support

The request routing rule also allows you to redirect traffic on the application gateway. This is a generic redirection mechanism, so you can redirect from and to any port you define using rules. You can choose the redirection target to be another listener (which can help enable automatic HTTP to HTTPS redirection) or an external site, choose the redirection to be temporary or permanent, or choose appending the URI path and query string to the redirected URL. For more information, see [Redirect traffic on your Application Gateway](https://docs.microsoft.com/azure/application-gateway/redirect-overview).

#### Rewrite HTTP headers

Using the request routing rules you can add, remove, or update HTTP(S) request and response headers while the request and response packets move between the client and backend pools, via the application gateway. The headers can not only be set to static values but also to other headers and important server variables. This will help you accomplish several important use cases, such as extracting IP address of the clients, removing sensitive information about the backend, adding additional security measures, etc. For more information, see [Rewrite HTTP headers on your application gateway](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers).

## HTTP settings

The application gateway routes traffic to the backend servers (specified in the request routing rule to which the HTTP settings are attached) using the port number, protocol, and other settings specified in this component. The port and protocol used in the HTTP settings determine whether the traffic between the application gateway and backend servers is encrypted, thus accomplishing end to end SSL, or unencrypted. This component is also used to:  determine whether a user session is to be kept on the same server by using the [cookie-based session affinity](https://docs.microsoft.com/azure/application-gateway/overview#session-affinity), accomplish graceful removal of backend pool members using [connection draining](https://docs.microsoft.com/azure/application-gateway/overview#connection-draining), associate custom probe to monitor the backend health, set the request timeout interval, override host name and path in the request and provide one-click ease to specify backend setting for App service backend. 

## Backend pool

The backend pool is used to route requests to the backend servers, which serve the request. Backend pools can be composed of NICs, virtual machine scale sets, public IP addresses, internal IP addresses, FQDN, and multi-tenant back-ends like Azure App Service. Application gateway backend pool members are not tied to an availability set. Application Gateway can communicate with instances outside of the virtual network that it is in, therefore, the members of the backend pools can be across clusters, data centers, or outside of Azure, as long as there is IP connectivity. If you plan to use internal IPs as backend pool members, then it requires [VNET Peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) or [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). VNet peering is supported and is beneficial for load-balancing traffic in other virtual networks. The application gateway can also communicate with to on-premises servers when they are connected by ExpressRoute or VPN tunnels, as long as traffic is allowed.

You can create different backend pools for different types of requests. For example, create one backend pool for general requests and other backend pool for requests to the microservices for your application.

## Health probes

Application gateway by default monitors the health of all resources in its backend pool and automatically removes any resource considered unhealthy from the pool. It continues to monitor the unhealthy instances and adds them back to the healthy backend pool once they become available and respond to health probes. In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. Custom probes allow you to have a more granular control over the health monitoring. When using custom probes, you can configure the probe interval, the URL and path to test, and how many failed responses to accept before the back-end pool instance is marked as unhealthy. It's highly recommended that you configure custom probes to monitor health of each backend pool. For more information, see [Monitor health of your Application gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview).

## Next steps

After learning about Application Gateway components, you can:
* [Create an Application Gateway in the Azure portal](quick-create-portal.md)
* [Create an Application Gateway by using Azure PowerShell](quick-create-powershell.md)
* [Create an Application Gateway by using the Azure CLI](quick-create-cli.md)
