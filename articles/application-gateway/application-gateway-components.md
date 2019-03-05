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

![application-gateway-components](.\media\application-gateway-components\application-gateway-components.png)

## Frontend IP address

A frontend IP address is the IP address associated with the application gateway. You can configure the application gateway to either have a public IP address or a private IP address, or both. Only one public IP address is supported on an application gateway. Your virtual network and public IP address must be in the same location as your application gateway.

### Static vs dynamic public IP address

The v1 SKU supports static internal IP addresses but does not support static public IP addresses. The VIP can change if the application gateway is stopped and started. The DNS name associated with the application gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the application gateway.

The Application Gateway v2 SKU supports static public IP addresses, as well as static Internal IP addresses. Only one public IP address or one private IP address is supported.

A Frontend IP address is associated to a *listener* after it is created. A listener checks for incoming requests on the Frontend IP address.

## Listeners

Before you start using your application gateway, you must add one or more listeners. A listener is a logical entity that checks for incoming connection requests and accepts the requests if the protocol, port, host and IP address match with the listener configuration. There can be multiple listeners attached to an application gateway and they can be used for the same protocol. After the listener detects incoming requests from the clients, the Application Gateway routes these requests to the backend servers in the backend pool, using the request routing rules that you define for the listener that received the incoming request.

Listeners support the following ports and protocols:

### Ports

This is the port on which the listener is listening for the client request. You can configure ports ranging from 1 to 65502 for V1 SKU and 1 to 65199 for V2 SKU.

### Protocols

Application gateway supports the following four protocols: HTTP, HTTPS, HTTP/2, and WebSocket

When you configure the listener, you need to choose between the HTTP and HTTPS protocols. Application gateway provides native support for the WebSockets and HTTP/2 protocols. You can use WebSockets with both HTTP and HTTPS listeners.

HTTP/2 protocol support is available to clients connecting to application gateway listeners only. The communication to backend server pools is over HTTP/1.1. By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet example shows how you can enable it:

```azurepowershell
$gw = Get-AzApplicationGateway -Name test -ResourceGroupName hm

$gw.EnableHttp2 = $true

Set-AzApplicationGateway -ApplicationGateway $gw
```

Websocket support is enabled by default. There's no user-configurable setting to selectively enable or disable WebSocket support.

You can use an HTTPS listener for SSL termination. An HTTPS listener offloads the encryption and decryption work to your application gateway so that your web servers aren't burdened by that overhead. Your applications are then free to focus on their business logic.

You must deploy at least one SSL server certificate for an HTTPS listener. For more information, see [How to configure SSL termination](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal)

### Custom error pages

Application gateway allows you to create custom error pages instead of displaying default error pages. You can use your own branding and layout using a custom error page. Application gateway can display a custom error page when a request can't reach the backend. For more information, see [Custom error pages for your Application Gateway](https://docs.microsoft.com/azure/application-gateway/custom-error).

### Types of listeners

There are two types of listeners:

- **Basic**: This type of listener listens to a single domain site where it has a single DNS mapping to IP address of the application gateway. This listener configuration is required when you are hosting a single site behind an application gateway.
- **Multi-site**: This listener configuration is required when you configure more than one web application on the same application gateway instance. This allows you to configure a more efficient topology for your deployments by adding up to 100 websites to one application gateway. Each website can be directed to its own backend pool. For example:  For three subdomains — abc.contoso.com, xyz.contoso.com and pqr.contoso.com pointing to the IP address of the application gateway. Create three listeners of the type *multi-site* and configure each listener for the respective port and protocol setting.

After you create a listener, you associate it with a request routing rule that determines how the request received on the listener is to be routed to the backend.

Listeners are processed in the order they are shown. For that reason, if a basic listener matches an incoming request it processes it first. Multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

## Request routing rule

This is the most important component of the application gateway and determines how the traffic on the listener associated with this rule is routed. The rule binds the listener, the back-end server pool, and the backend HTTP settings. It defines which back-end server pool the traffic should be directed to when it hits a particular listener. One listener can be attached to only one rule.

There can be two types of request routing rules:

- **Basic:** All requests on the associated listener (for example: blog.contoso.com/*) are forwarded to the associated backend pool using the associated HTTP setting.
- **Path-based:** This rule type lets you route the requests on the associated listener to a specific backend pool based on the URL in the request. If the path of the URL in a request matches the path pattern in a path-based rule, the request is routed using that rule. The path pattern is applied only to the path of the URL, not to its query parameters.

If the path of the URL of a request on a listener doesn't match any of the path-based rules, then the request is routed to the *Default* backend pool and the *Default* HTTP Settings.

Rules are processed in the order they're configured. It is recommended that multi-site rules are configured before basic rules to reduce the chance that traffic is routed to the inappropriate backend as the basic rule would match traffic based on port before the multi-site rule being evaluated.

### Redirection support

The request routing rule also allows you to redirect traffic on the application gateway. This is a generic redirection mechanism, so you can redirect from and to any port you define using rules. This can help you enable automatic HTTP to HTTPS redirection to ensure all communication between an application and your users occurs over an encrypted path. You can specify the target listener or external site to the redirection you want. The configuration element also supports options to enable appending the URI path and query string to the redirected URL. You can also choose whether redirection is a temporary (HTTP status code 302) or a permanent redirect (HTTP status code 301). When using a basic rule, the redirect configuration is associated with a source listener and is a global redirect. When a path-based rule is used, the redirect configuration is defined on the URL path map. So it only applies to the specific path area of a site. For more information, see [Redirect traffic on your Application Gateway](https://docs.microsoft.com/azure/application-gateway/redirect-overview).

### HTTP headers

Application gateway inserts x-forwarded-for, x-forwarded-proto, and x-forwarded-port headers into the request forwarded to the backend. The format for x-forwarded-for header is a comma-separated list of IP:port. The valid values for x-forwarded-proto are HTTP or HTTPS. X-forwarded-port specifies the port at which the request reached at the application gateway. Application gateway also inserts X-Original-Host header that contains the original host header with which the request arrived. This header is useful in scenarios like Azure Website integration, where the incoming host header is modified before traffic is routed to the backend.

#### Rewrite HTTP headers

Using the request routing rules you can add, remove, or update HTTP(S) request and response headers while the request and response packets move between the client and backend pools, via the application gateway. The headers can not only be set to static values but also to other headers and important server variables. This will help you accomplish several important use cases, such as extracting IP address of the clients, removing sensitive information about the backend, adding additional security measures, etc. For more information, see [Rewrite HTTP headers on your application gateway](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers).

## HTTP settings

The application gateway routes traffic to the backend servers using the port number, protocol, and other settings specified in this resource.

The backend pools support the following ports and protocols:

### Ports

This is the port that the backend servers are listening to the traffic coming from the Application Gateway. You can configure ports ranging from 1 to 65535.

### Protocols

Application gateway supports both HTTP and HTTPS protocols for routing requests to the backend servers.

If the HTTP protocol is chosen, then traffic flows unencrypted to the backend servers.

In those cases where unencrypted communication to the backend servers is not an acceptable option, you should choose the HTTPS protocol. This setting combined with choosing HTTPS protocol in the listener allows you to enable [end to end SSL](https://docs.microsoft.com/azure/application-gateway/ssl-overview). That allows you to securely transmit sensitive data to the backend encrypted. Each backend server in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication.

You can use several HTTP setting capabilities.

### Cookie-based session affinity

This feature is useful when you want to keep a user session on the same server. By using gateway-managed cookies, the application gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session.

If the application cannot handle cookie-based affinity, then you will not be able to use this capability

### Connection draining

Connection draining helps you achieve graceful removal of backend pool members during planned service updates. This setting can be applied to all members of a backend pool during rule creation. Once enabled, application gateway ensures that all de-registering instances of a backend pool do not receive any new requests while allowing existing requests to complete within a configured time limit. This applies to both backend instances that are explicitly removed from the backend pool by an API call as well as backend instances that are reported as unhealthy as determined by the health probes.

### Override backend path

This feature allows you to override the path in the URL so that the requests for a specific path can be routed to another path. For example, if you intend to route requests for contoso.com/images to default, then enter ‘/’ in this textbox and subsequently attach this HTTP setting to the rule associated with contoso.com/images.

### Pick host name from a backend address

This capability sets the *host* header in the request to the host name of the backend pool using an IP address or fully qualified domain name - FQDN. This is helpful in the scenarios where the domain name of the backend is different from the DNS name of the application, such as in a scenario where Azure App Service is used as the backend. Since Azure App Service is a multi-tenant environment using a shared space with a single IP address, an App Service can be accessed only with the hostnames configured in the custom domain settings. By default, it is *example.azurewebsites.net*. If you want to access your App Service using application gateway with a hostname not registered in App Service or with Application Gateway’s FQDN, you have to override the hostname in the original request to the App Service’s hostname.

### **Host override**

This capability replaces the *host* header in the incoming request on the application gateway to the host name you specify here.

Once you create an HTTP setting, you need to associate it with one or more request routing rules.

## Backend pool

The backend pool is used to route requests to the backend servers, which serve the request. Backend pools can be composed of NICs, virtual machine scale sets, public IP addresses, internal IP addresses, FQDN, and multi-tenant back-ends like Azure App Service. Application gateway backend pool members are not tied to an availability set. Members of backend pools can be across clusters, data centers, or outside of Azure as long as they have IP connectivity. You can create different backend pools for different types of requests. For example, create one backend pool for general requests and other backend pool for requests to the microservices for your application.

After you create a backend pool, you need to associate it with one or more request routing rules. You also need to configure health probes for each backend pool on your application gateway. When a request routing rule condition is met, the application gateway forwards the traffic to the healthy servers (as determined by the health probes) in the corresponding backend pool.

## Health probes

Application gateway by default monitors the health of all resources in its backend pool and automatically removes any resource considered unhealthy from the pool. Application gateway continues to monitor the unhealthy instances and adds them back to the healthy backend pool once they become available and respond to health probes. Application gateway sends the health probes with the same port that is defined in the backend HTTP settings.

In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. Custom probes allow you to have a more granular control over the health monitoring. When using custom probes, you can configure the probe interval, the URL and path to test, and how many failed responses to accept before the back-end pool instance is marked as unhealthy. It's highly recommended that you configure custom probes to monitor health of each backend pool. For more information, see [Monitor health of your Application gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview).

## Next steps

After learning about Application Gateway components, you can:
* [Create an Application Gateway in the Azure portal](quick-create-portal.md)
* [Create an Application Gateway using PowerShell](quick-create-powershell.md)
* [Create an Application Gateway using Azure CLI](quick-create-cli.md).