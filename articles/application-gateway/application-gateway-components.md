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

# Application Gateway Components

 An Application Gateway serves as the single point of contact for clients. It distributes incoming application traffic across multiple backend pools, such as Azure VMs, VMSS, App Services or on-premises/external servers. To do this, it utilizes several components described below:

![application-gateway-components](.\media\application-gateway-components\application-gateway-components.png)

## Frontend IP

Fronted IP is the IP (Internet Protocol) address associated with the Application Gateway. You can configure the Application Gateway to either have a Public IP or a Private IP or both. Only one public IP address is supported on an application gateway. Your virtual network and public IP address must be in the same location as your Application Gateway.

### Static vs Dynamic Public IP

The v1 SKU supports static internal IPs but does not support static Public IPs. The VIP can change if the application gateway is stopped and started. The DNS name associated with the application gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the application gateway.

The Application Gateway v2 SKU supports static public IPs and well as Internal IPs. Only one public IP address is supported on an application gateway.

After creating a Frontend IP, it is associated to *listeners* which check for incoming requests on the Frontend IP.

## Listeners

Before you start using your Application Gateway, you must add one or more listeners. A listener is a process using which the Application Gateway checks for the incoming connection requests, using the protocol and port that you configure. After the listener detects incoming requests from the clients, the Application Gateway routes these requests to the backend servers in the backend pool, using the request routing rules that you define for the listener that received the incoming request.

Listeners support the following ports and protocols:

### Ports

This is the port on which the listener is listening to the client request. The following range is allowed for the port configuration: 1-65535

### Protocols

Application Gateway supports the following 4 protocols: HTTP, HTTPS, HTTP/2, Websocket

While configuring the listener, you need to choose between HTTP and HTTPS protocol. Application Gateway provides native support for WebSockets and HTTP/2 protocols. You can use WebSockets with both HTTP and HTTPS listeners. 

HTTP/2 protocol support is available to clients connecting to application gateway listeners only. The communication to backend server pools is over HTTP/1.1. By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet example shows how you can enable it:

```azurepowershell
$gw = Get-AzureRmApplicationGateway -Name test -ResourceGroupName hm

$gw.EnableHttp2 = $true

Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

Websocket support is enabled by default. There's no user-configurable setting to selectively enable or disable WebSocket support.

You can use an HTTPS listener for SSL termination which will offload the work of encryption and decryption to your Application Gateway so that your web servers could be unburdened from costly encryption and decryption overhead and your applications can focus on their business logic. You must deploy at least one SSL server certificate for an HTTPS listener. For more information, see [how to configure SSL termination](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal)

### Custom error pages

Application Gateway allows you to create custom error pages instead of displaying default error pages. You can use your own branding and layout using a custom error page. Application gateway can display a custom error page when a request can't reach the backend. For more information, see [Custom error pages for your Application Gateway](https://docs.microsoft.com/azure/application-gateway/custom-error)

### Types of Listeners

There are two types of listeners:

- **Basic**: This type of listener listens to a single domain site where it has a single DNS mapping to IP address of the Application Gateway. This listener configuration is required when you are hosting a single site behind an Application gateway
- **Multi-site**: This listener configuration is required when you are configuring more than one web application on the same application gateway instance. This allows you to configure a more efficient topology for your deployments by adding up to 100 websites to one application gateway. Each website can be directed to its own backend pool. For example:  For three subdomains — abc.alpha.com, xyz.alpha.com and pqr.alpha.com pointing to the IP Address of the Application Gateway. Create 3 listeners of the type ‘multi-site’ and configure each listener for the respective port and protocol setting. 

After creating a listener, you associate it with a request routing rule which determines how the request received on the listener is to be routed to the backend.

Listeners are processed in the order they are shown. For that reason if a basic listener matches an incoming request it processes it first. Multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

## Request routing rule

This is the most important component of the Application Gateway and determines how the traffic on the listener associated with this rule is to be routed. The rule binds the listener, the back-end server pool and the backend HTTP Settings and defines which back-end server pool the traffic should be directed to when it hits a particular listener. One listener can be attached to only one rule.

There can be two types of request routing rules:

- **Basic:** All requests on the associated listener (eg: blog.contoso.com/*) are forwarded to the associated backend pool using the associated HTTP setting.
- **Path-based:** This type of rule provides you the ability to route the requests on the associated listener to a specific backend pool based on the URL in the request. If the path of the URL in a request matches the path pattern in a path-based rule, the request is routed using that rule. The path pattern is applied only to the path of the URL, not to its query parameters. 

If the path of the URL of a request on a listener does not match any of the path-based rules, then the request is routed to the *Default* backend pool and the *Default* HTTP Settings.

Rules are processed in the order they are configured. It is recommended that multi-site rules are configured before basic rules to reduce the chance that traffic is routed to the inappropriate backend as the basic rule would match traffic based on port before the multi-site rule being evaluated.

### Redirection Support

The request routing rule also allows you to redirect traffic on the Application Gateway. This is a generic redirection mechanism, so you can redirect from and to any port you define using rules. This can help you enable automatic HTTP to HTTPS redirection to ensure all communication between application and your users occurs over an encrypted path. You can specify the target listener or external site to which redirection is desired. The configuration element also supports options to enable appending the URI path and query string to the redirected URL. You can also choose whether redirection is a temporary (HTTP status code 302) or a permanent redirect (HTTP status code 301). When using a basic rule, the redirect configuration is associated with a source listener and is a global redirect. When a path-based rule is used, the redirect configuration is defined on the URL path map. So it only applies to the specific path area of a site. For more information, see [Redirect traffic on your Application Gateway](https://docs.microsoft.com/azure/application-gateway/redirect-overview).

### HTTP Headers

Application Gateway inserts x-forwarded-for, x-forwarded-proto, and x-forwarded-port headers into the request forwarded to the backend. The format for x-forwarded-for header is a comma-separated list of IP:Port. The valid values for x-forwarded-proto are http or https. X-forwarded-port specifies the port at which the request reached at the application gateway. Application Gateway also inserts X-Original-Host header that contains the original Host header with which the request arrived. This header is useful in scenarios like Azure Website integration, where the incoming host header is modified before traffic is routed to the backend.

#### Rewrite HTTP headers

Using the request routing rules you can add, remove, or update HTTP(S) request and response headers while the request and response packets move between the client and backend pools, via the Application Gateway. The headers can not only be set to static values but also to other headers and important server variables. This will help you accomplish several important use cases, such as extracting IP address of the clients, removing sensitive information about the backend, adding additional security measures, etc. For more information, see[Rewrite HTTP headers on your Application Gateway](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers)

## HTTP Settings

The Application Gateway routes traffic to the backend servers using the port number, protocol and other settings specified in this resource. 

The backend pools support the following ports and protocols:

### Ports

This is the port on which the backend servers are listening to the traffic coming from the Application Gateway. The following range is allowed for the port configuration: 1-65535

### Protocols

Application Gateway supports both HTTP and HTTPS protocols for routing requests to the backend servers.

If HTTP protocol is chosen, then traffic flows unencrypted to the backend servers. 

In those cases where unencrypted communication to the backend servers is not an acceptable option, you should choose HTTPS protocol. This setting combined with choosing HTTPS protocol in the listener will allow you to enable [end to end SSL](https://docs.microsoft.com/azure/application-gateway/ssl-overview). That will allow you to securely transmit sensitive data to the backend encrypted. Each backend server in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication.

Using the HTTP Setting you can leverage several capabilities:

### Cookie-based session affinity

This feature is useful when you want to keep a user session on the same server. By using gateway-managed cookies, the Application Gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session.

If the application cannot handle cookie-based affinity, then you will not be able to use this capability

### Connection draining

Connection draining helps you achieve graceful removal of backend pool members during planned service updates. This setting can be applied to all members of a backend pool during rule creation. Once enabled, Application Gateway ensures that all deregistering instances of a backend pool do not receive any new request while allowing existing requests to complete within a configured time limit. This applies to both backend instances that are explicitly removed from the backend pool by an API call as well as backend instances that are reported as unhealthy as determined by the health probes.

### Override backend path

This feature allows you to override the path in the URL so that the requests for a specific path can be routed to another path. For example, if you intend to route requests for contoso.com/images to default, then enter ‘/’ in this textbox and subsequently attach this HTTP setting to the rule associated with contoso.com/images.

### Pick host name from a backend address

This capability sets the *host* header in the request to the host name of the backend pool (IP or FQDN). This is helpful in the scenarios where the domain name of the backend is different from the DNS name of the application, such as in a scenario where Azure App Service is used as backend. This is because since Azure App Service is a multi-tenant environment using a shared space with a single IP address, an App Service can be accessed only with the hostnames configured in the custom domain settings. By default, it is “example.azurewebsites.net” and if you want to access your App Service using Application Gateway with a hostname not registered in App Service or with Application Gateway’s FQDN, you have to override the hostname in the original request to the App Service’s hostname.

### **Host override**

This capability replaces the *host* header in the incoming request on the Application Gateway to the host name you specify here. 

Once you create an HTTP Setting, you need to associate it with one or more request routing rules.

## Backend Pool

The backend pool is used to route requests to the backend servers which will be serving the request. Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. Application Gateway backend pool members are not tied to an availability set. Members of backend pools can be across clusters, data centers, or outside of Azure as long as they have IP connectivity. You can create different backend pools for different types of requests. For example, create one backend pool for general requests and other backend pool for requests to the microservices for your application.

After creating a backend pool you need to associate it with one or more request routing rules. You also need to configure health probes for each backend pool on your Application Gateway. When a request routing rule condition is met, the Application Gateway forwards the traffic to the healthy servers (as determined by the health probes) in the corresponding backend pool.

## Health probes

Azure Application Gateway by default monitors the health of all resources in its back-end pool and automatically removes any resource considered unhealthy from the pool. Application Gateway continues to monitor the unhealthy instances and adds them back to the healthy back-end pool once they become available and respond to health probes. Application gateway sends the health probes with the same port that is defined in the back-end HTTP settings.

In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. Custom probes allow you to have a more granular control over the health monitoring. When using custom probes, you can configure the probe interval, the URL and path to test, and how many failed responses to accept before marking the back-end pool instance as unhealthy. It is highly recommended that you configure custom probes to monitor health of each backend pool. For more information, see [Monitor health of your Application gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview)

## Next steps

After learning about Application Gateway components, you [can create an Application Gateway in the Azure portal](quick-create-portal.md) or a [create an Application Gateway using PowerShell](quick-create-powershell.md) or [create an Application Gateway using Azure CLI](quick-create-cli.md).