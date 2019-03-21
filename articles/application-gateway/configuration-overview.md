---
title: Azure Application Gateway configuration overview
description: This article describes how to configure the various components of Azure Application Gateway
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 03/20/2019
ms.author: absha

---

# Application Gateway configuration overview

Azure Application Gateway consists of several components that can be configured in various ways for different scenarios. This article shows you how to configure each component.

![application-gateway-components flow chart](./media/configuration-overview/configuration-overview1.png)

This example image illustrates configuration of an application that has three listeners. The first two are multi-site listeners for `http://acme.com/*` and `http://fabrikam.com/*`, respectively. Both listen on port 80. The third listener is a basic listener that has end-to-end Secure Sockets Layer (SSL) termination.

## Prerequisites

### Azure virtual network and dedicated subnet

An application gateway is a dedicated deployment in your virtual network. Within your virtual network, a dedicated subnet is required for your application gateway. You can have multiple instances of a given application gateway deployment in a subnet. You can also deploy other application gateways in the subnet. But you can't deploy any other resource in the application gateway subnet.  

> [!NOTE]	
> Mixing Standard_v2 and Standard Application Gateway on the same subnet is not supported.

#### Size of the subnet

Application Gateway consumes one private IP address per instance, plus another private IP address if a private frontend IP configuration is configured. Also, Azure reserves the first four and last IP address in each subnet for internal usage. For example, if an application gateway is set to three instances and no private frontend IP, then at least eight IP addresses will be required in the subnet - five IP addresses for internal usage and three IP addresses for the three instances of the application gateway. Therefore, in this case a /29 subnet size or greater is needed. If you have three instances and an IP address for the private frontend IP configuration, then nine IP addresses will be required - three IP addresses for the three instances of the application gateway, one IP address for private frontend IP and five IP addresses for internal usage. Therefore, in this case a /28 subnet size or greater is needed.

As a best practice, use at least a /28 subnet size. This gives you 11 usable addresses. If your application load requires more than 10 instances, you should consider a /27 or /26 subnet size.

#### Network security groups supported on the Application Gateway subnet

Network security groups (NSGs) are supported on the application gateway. But there are several restrictions:

- Exceptions must be put in for incoming traffic on ports 65503-65534 for the Application Gateway v1 SKU and ports 65200-65535 for the v2 SKU. This port-range is required for Azure infrastructure communication. They are protected (locked down) by Azure certificates. External entities, including the customers of those gateways, can't initiate changes on those endpoints without appropriate certificates in place.

- Outbound internet connectivity can't be blocked. Default outbound rules in the NSG already allow internet connectivity. We recommend that you don't remove the default outbound rules and that you don't create other outbound rules that deny outbound internet connectivity.

- Traffic from the **AzureLoadBalancer** tag must be allowed.

##### Whitelist application gateway access to a few source IPs

For this scenario, use NSGs on the application gateway subnet. Put the following restrictions on the subnet in this order of priority:

1. Allow incoming traffic from source IP/IP range.
2. Allow incoming requests from all sources to ports 65503-65534 for [back-end health communication](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics). This port range is required for Azure infrastructure communication. These ports are protected (locked down) by Azure certificates. Without proper certificates, external entities can't initiate changes on those endpoints.
3. Allow incoming Azure Load Balancer probes (AzureLoadBalancer tag) and inbound virtual network traffic (VirtualNetwork tag) on the [network security group](https://docs.microsoft.com/azure/virtual-network/security-overview).
4. Block all other incoming traffic by using a deny-all rule.
5. Allow outbound traffic to the internet for all destinations.

#### User-defined routes supported on the application gateway subnet

In case of v1 SKU, User-defined routes (UDRs) are supported on the application gateway subnet, as long as they do not alter the end-to-end request/response communication. For example, you can set up a UDR in the application gateway subnet to point to a firewall appliance for packet inspection, but you must ensure that the packet can reach its intended destination post inspection. Failure to do so might result in incorrect health probe or traffic routing behavior. This includes learned routes or default 0.0.0.0/0 routes propagated by ExpressRoute or VPN Gateways in the virtual network.

For the v2 SKU, UDRs on the application gateway subnet aren't supported. For more information, see [Autoscaling and zone-redundancy for Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant#known-issues-and-limitations).

> [!NOTE]
> Using UDRs on the application gateway subnet will cause the health status in the [backend health view](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics#back-end-health) to be shown as **Unknown** and will also result in failue of generation of application gateway logs and metrics. It is recommended you do not use UDRs on application gateway subnet to be able to view the backend health, logs and metrics.

## Frontend IP

You can configure the application gateway to have a public IP address, a private IP address, or both. A public IP is required when you're hosting a back end that must be accessed by clients over the internet via an internet-facing virtual IP (VIP). Public IP is not required for an internal endpoint that's not exposed to the Internet. That's also known as an internal load-balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line-of-business applications that aren't exposed to the internet. It's also useful for services and tiers within a multi-tier applications within a security boundary that's not exposed to the internet but still require round-robin load distribution, session stickiness, or SSL termination.

Only one public IP address or one private IP address is supported. You choose the front-end IP when you create the Application Gateway.

- For a public IP, you can choose to create a new public IP or use an existing public IP in the same location as the application gateway. If you create a new public IP address, the IP address type that you select (static or dynamic) can't be changed later. For more information, see [Static vs dynamic public IP](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-components#static-vs-dynamic-public-ip-address).

- For a private IP, you can specify a private IP address from the subnet in which the application gateway is created. If you don't specify the IP address, an arbitrary IP address will be automatically selected from the subnet. For more information, see [Create an application gateway with an internal load balancer (ILB)](https://docs.microsoft.com/azure/application-gateway/application-gateway-ilb-arm).

A front-end IP is associated to a *listener*, which checks for incoming requests on the front-end IP.

## Listeners

A listener is a logical entity that checks for incoming connection requests by using the port, protocol, host, and  IP address. Therefore, when you configure the listener, you need to enter values for thye port, protocol, host, and  IP address that are same as the corresponding values in the incoming request on the gateway

When you create an application gateway by using the Azure portal, you also create a default listener by choosing the protocol and port for the listener. You can also choose whether you want to enable HTTP2 support on the listener. After you create the application gateway is created, you can edit the setting of that default listener(*appGatewayHttpListener*/*appGatewayHttpsListener*) or create new listeners.

### Listener type

When you create a new listener, you can choose between [basic or multi-site listener](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#types-of-listeners).

- If you're hosting a single site behind an application gateway, choose basic listener. Learn [how to create an application gateway with a basic listener](https://docs.microsoft.com/azure/application-gateway/quick-create-portal).

- If you're configuring more than one web application or multiple subdomains of the same parent domain on the same application gateway instance, choose multi-site listener. For multi-site listener, you must also enter a host name. This is because Application Gateway relies on HTTP 1.1 host headers to host more than one website on the same public IP address and port.

#### Order of processing listeners

In case of v1 SKUs, listeners are processed in the order they are shown. For that reason if a basic listener matches an incoming request it processes it first. Therefore, multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

In case of v2 SKUs, multi-site listeners are processed before basic listeners.

### Front-end IP

Choose the front-end IP that you plan to associate with this listener. The listener will listen to incoming requests on this IP.

### Front-end port

Choose the front-end port. You can select an existing port or create a new one. Choose any value from the [allowed range of ports](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#ports). You can use not only use well-known ports such as 80 and 443 but any allowed custom port that suitable. A port can be used for public-facing listeners or private-facing listeners.

### Protocol

You need to choose between HTTP and HTTPS protocol.

- If you choose HTTP, the traffic between the client and application gateway will flow unencrypted.

- Choose HTTPS if you want [SSL termination](https://docs.microsoft.com/azure/application-gateway/overview#secure-sockets-layer-ssl-terminationl) or [end-to-end SSL encryption](https://docs.microsoft.com/azure/application-gateway/ssl-overview). For HTTPS, the traffic between the client and application gateway will be encrypted and the SSL connection will be terminated at the application gateway. If you want end-to-end SSL encryption, you must choose HTTPS protocol and configure the *back-end HTTP setting*. This will ensure that the traffic is re-encrypted when it travels from the application gateway to the back end.

  To configure SSL termination and end-to-end SSL encryption, you must add a certificate to the listener to enable the Application Gateway to derive a symmetric key as per the SSL protocol specification. The symmetric key is used to encrypt and decrypt the traffic sent to the gateway. The gateway certificate must be in the Personal Information Exchange (PFX) file format. This format lets you export the private key that the application gateway needs to encrypt and decrypt traffic.

#### Supported certificates

See [certificates supported for SSL termination](https://docs.microsoft.com/azure/application-gateway/ssl-overview#certificates-supported-for-ssl-termination).

### Additional protocol support

#### HTTP2 support

HTTP/2 protocol support is available to clients that connect to application gateway listeners only. The communication to back-end server pools is over HTTP/1.1. By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet shows how to enable this:

```azurepowershell
$gw = Get-AzureRmApplicationGateway -Name test -ResourceGroupName hm

$gw.EnableHttp2 = $true

Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

#### Websocket support

Websocket support is enabled by default. There's no user-configurable setting to enable or disable WebSocket support. You can use WebSockets with both HTTP and HTTPS listeners.

### Custom error page

Custom error pages can be defined at the global level as well as the listener level. But creating global-level custom error pages from the Azure portal is currently not supported. You can configure a custom error page for a 403 WAF error or a 502 maintenance page at the listener level. You must also specify a publicly accessible blob URL for the given error status code. For more information, see [Create Application Gateway custom error pages](https://docs.microsoft.com/azure/application-gateway/custom-error).

![Application Gateway error codes](https://docs.microsoft.com/azure/application-gateway/media/custom-error/ag-error-codes.png)

To configure a global custom error page, see [Azure PowerShell configuration](https://docs.microsoft.com/azure/application-gateway/custom-error#azure-powershell-configuration) 

### SSL policy

You can centralize SSL certificate management and reduce encryption-decryption overhead from a back-end server farm. This centralized SSL handling also lets you specify a central SSL policy that's suited to your security requirements. You can choose from default, predefined and custom SSL policy.

You can configure SSL policy to control SSL protocol versions. You can configure application gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are disabled by default and aren't configurable. For more information, see [Application Gateway SSL policy overview](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-policy-overview).

After you create a listener, you associate it with a request routing rule. That rule determines how requests that are received on the listener are routed to the back end.

## Request routing rule

When you create the application gateway by using the Azure portal, you create a default rule (*rule1*). This rulebinds the default listener (*appGatewayHttpListener*) with the default back-end pool (*appGatewayBackendPool*) and default back-end HTTP settings (*appGatewayBackendHttpSettings*). After you create the application gateway, you can edit the settings of the default rule or create new rules.

### Rule type

When you create a rule, you choose between [basic or path-based](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#request-routing-rule).

- Choose basic listener if you want to forward all requests on the associated listener (for example, blog.contoso.com/*)to a single back-end pool.
- Choose path-based listener if you want to route requests with specific URL paths to specific backend pools. The path pattern is applied only to the path of the URL, not to its query parameters.

#### Order of processing rules

In case of v1 SKUs, matching of pattern of the incoming request is processed in the order in which the paths are listed in the URL path map of the path-based rule. For that reason, if a request matches the pattern in two or more paths in the URL path map, then the path which is listed first will be matched and the request will be forwarded to the backend associated with that path.

In case of v2 SKUs, an exact match holds higher priority over the order in which the paths are listed in the URL path map. For that reason, if a request matches the pattern in two or more paths, then the request will be forwarded to the backend associated with that path that matches exactly with the request. If the path in the incoming request does not exactly match any path in the URL path map, then matching of pattern of the incoming request is processed in the order in which the paths are listed in the URL path map of the path-based rule.

### Associated listener

You need to associate a listener to the rule so that the *request routing rule* that's associated with the listener is evaluated to determine the *back-end pool* to route the request to.

### Associated back-end pool

Associate the back-end pool that contains the back-end targets that will serve the request that the listener receives.

 - For a basic rule, only one back-end pool is allowed, because all the requests on the associated listener will be forwarded to that back-end pool.

 - For a path-based rule, add multiple back-end pools that correspond to each URL path. The requests that match the URL path that's entered will be forwarded to the corresponding back-end pool. Also, add a default back-end pool, because requests that don't match any URL path that are entered in the rule will be forwarded to that pool.

### Associated back-end HTTP setting

Add a back-end HTTP setting for each rule. The requests will be routed from the application gateway to the back-end targets by using the port number, protocol, and other information that's specified in this setting.

- In case of a basic rule, only one back-end HTTP setting is allowed. This is because all requests on the associated listener will be forwarded to the corresponding back-end targets by using this HTTP setting.

Add a backend HTTP setting for each rule. The requests will be routed from the Application Gateway to the backend targets using the port number, protocol and other settings specified in this setting. In case of a basic rule, only one backend HTTP setting is allowed since all the requests on the associated listener will be forwarded to the corresponding backend targets using this HTTP setting. In case of a path-based rule, add multiple backend HTTP settings corresponding to each URL path. The requests which match the URL path entered here, will be forwarded to the corresponding backend targets using the HTTP settings corresponding to each URL path. Also, add a default HTTP setting since the requests which do not match any URL path entered in this rule will be forwarded to the default backend pool using the default HTTP setting.

### Redirection setting

If the redirection is configured for a basic rule, all requests on the associated listener are redirected to the redirection target. This is global redirection. If the redirection is configured for a path-based rule, the requests only on a specific site area, for example a shopping cart area denoted by /cart/*, will be redirected to the redirection target. This is path-based redirection.

For more information about the redirection capability, see [Application Gateway redirect overview](https://docs.microsoft.com/azure/application-gateway/redirect-overview).

- #### Redirection type

  Choose type of redirection required from: Permanent(301), Temporary(307), Found(302) or See other(303).

- #### Redirection target

  Choose another listener or an external site as redirection target.

  - ##### Listener

    Choosing listener as the redirection target helps redirect from one listener to another listener on the gateway. This setting is required when you want to enable HTTP to HTTPS redirection. In other words, it's used to redirect traffic from the source listener that check for incoming HTTP requests to the destination listener that checks for incoming HTTPS requests. You can also choose to include the query string and path in the original request in the request that's forwarded to the redirection target.

    ![application-gateway-components](./media/configuration-overview/configure-redirection.png)

    For more information about HTTP-to-HTTPS redirection, see: 
    - [HTTP-to-HTTP redirection using the Azure portal](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-portal)
    - [HTTP-to-HTTP redirection using PowerShell](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-powershell)
    - [HTTP to HTTP redirection using the Azure CLI](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-cli)

  - ##### External site

    Choose external site when you want to redirect the traffic on the listener that's associated with this rule to an external site. You can choose to include the query string from original request in the request that's forwarded to the redirection target. You can't forward the path to the external site that was in the original request.

    For more information about redirection, see:
    - [Redirect traffic to an external site by using PowerShell](https://docs.microsoft.com/azure/application-gateway/redirect-external-site-powershell)
    - [Redirect traffic to an external site by using the CLI](https://docs.microsoft.com/azure/application-gateway/redirect-external-site-cli)

#### Rewrite the HTTP header setting

This capability lets you add, remove, or update HTTP request and response headers while the request and response packets move between the client and back-end pools.  You can only configure this capability through PowerShell. Portal and CLI support is not yet available. For more information, see 

 - [Rewrite HTTP headers overview](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers)
 - [Configure HTTP header rewrite](https://docs.microsoft.com/azure/application-gateway/add-http-header-rewrite-rule-powershell#specify-your-http-header-rewrite-rule-configuration)

## HTTP settings

The application gateway routes traffic to the back-end servers using the configuration specified in this component. Once you create an HTTP setting, you need to associate it with one or more request routing rules.

### Cookie-based affinity

This feature is useful when you want to keep a user session on the same server. By using gateway-managed cookies, the application gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session. If the application can't handle cookie-based affinity, you can't use this feature. To use cookie-based session affinity, make sure that the clients support cookies.

### Connection draining

Connection draining helps you gracefully remove back-end pool members during planned service updates. You can apply this setting to all members of a back-end pool during rule creation. This setting ensures that all de-registering instances of a back-end pool don't receive any new requests while allowing existing requests to complete within a configured time limit. It applies to back-end instances that are explicitly removed from the backend pool by an API call. It also applies to back-end instances that are reported as *unhealthy* by the health probes.

### Protocol

Application gateway supports both HTTP and HTTPS for routing requests to the back-end servers. If you choose HTTP, traffic flows unencrypted to the back-end servers. In those cases where unencrypted communication to the back-end servers is not acceptable, choose HTTPS.

This setting combined with HTTPS in the listener supports [end-to-end SSL](https://docs.microsoft.com/azure/application-gateway/ssl-overview). That allows you to securely transmit sensitive data to the back-end encrypted. Each back-end server in the back-end pool that has end-to-end SSL enabled must be configured with a certificate to allow secure communication.

### Port

This is the port where the back-end servers listen to traffic that comes from the application gateway. You can configure ports ranging from 1 to 65535.

### Request timeout

This setting is the number of seconds that the application gateway waits to receive a response from the back-end pool before it returns a "connection timed out" error message.

### Override backend path

This setting allows you to configure an optional custom forwarding path to use when the request is forwarded to the back end. This will copy any part of the incoming path that matches the custom path that's specified in the **override backend path** field to the forwarded path. See the following table to understand how the capability works.

- When the HTTP setting is attached to a basic request routing rule:

  | Original request  | Override backend path | Request forwarded to backend |
  | ----------------- | --------------------- | ---------------------------- |
  | /home/            | /override/            | /override/home/              |
  | /home/secondhome/ | /override/            | /override/home/secondhome/   |

- When the HTTP setting is attached to a path-based request routing rule:

  | Original request           | Path rule       | Override backend path | Request forwarded to backend |
  | -------------------------- | --------------- | --------------------- | ---------------------------- |
  | /pathrule/home/            | /pathrule*      | /override/            | /override/home/              |
  | /pathrule/home/secondhome/ | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /home/                     | /pathrule*      | /override/            | /override/home/              |
  | /home/secondhome/          | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /pathrule/home/            | /pathrule/home* | /override/            | /override/                   |
  | /pathrule/home/secondhome/ | /pathrule/home* | /override/            | /override/secondhome/        |

### Use for app service

This is a UI shortcut that selects the two required settings for the Azure App Service back end. It enables *pick host name from back-end address* and creates a new custom probe. (The reason for the first of these is explained in the section for [Pick host name from back-end address](#Pick-host-name-from-back-end-address) setting section of this article.) A new probe is created, and the the probe header is picked from back end member’s address.

### Use custom probe

This setting is used to associate a [custom probe](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#custom-health-probe) with this HTTP setting. You can associate only one custom probe with an HTTP setting. If you don't explicitly associate a custom probe, the [default probe](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#default-health-probe-settings) will be used to monitor the health of the back end. We recommend that you create a custom probe to have greater control over the health monitoring of your back ends.

> [!NOTE]	
> The custom probe doesn't monitor the health of the back-end pool unless the corresponding HTTP setting is explicitly associated with a listener.

### Pick host name from back-end address

This capability dynamically sets the *host* header in the request to the host name of the back-end pool by using an IP address or fully qualified domain name (FQDN).

This feature is helpful when the domain name of the back end is different from the DNS name of the application gateway, and the back end relies on a specific host header or SNI extension to resolve to the correct endpoint. 

An example case is multi-tenant services as the back end. App Service is a multi-tenant service that uses a shared space with a single IP address. So, an app service can only be accessed through the hostnames that are configured in the custom domain settings. 

By default, the custom domain name is *example.azurewebsites.net*. If you want to access your app service by using an application gateway with either a hostname that's not explicitly registered in the app service or with the appplication gateway’s FQDN, you have to override the hostname in the original request to the app service’s hostname. To this, you enable the **pick host name from backend address** setting.

If you own a custom domain and have mapped the existing custom DNS name to the app service, you don't need to enable this setting.

> [!NOTE]	
> This setting is not required for App Service Environment for PowerApps, which is a dedicated deployment.

### Host name override

This capability replaces the *host* header in the incoming request on the application gateway with the host name that you specify. For example, if www\.contoso.com is specified in the **Host name** setting, the original request https://appgw.eastus.cloudapp.net/path1 is changed to https://www.contoso.com/path1 when the request is forwarded to the backend server.

## Back-end pool

A back-end pool can be pointed to four types of backend members: a specific virtual machine, a virtual machine scale set, an IP address/FQDN, or an app service. Each back-end pool can point to multiple members of the same type. Pointing members of different types in the same back-end pool is not supported.

After you create a back-end pool, you need to associate it with one or more request-routing rules. You must also configure health probes for each back-end pool on your application gateway. When a request-routing rule condition is met, the application gateway forwards the traffic to the healthy servers (as determined by the health probes) in the corresponding backend pool.

## Health probes

An application gateway monitors the health of all the resources in its back end by default. But we strongly recommend that you create a custom probe for each back-end HTTP setting, so you have greater control over health monitoring. To learn how to configure a custom health probe, see [Custom health probe settings](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#custom-health-probe-settings).

> [!NOTE]	
> After you create a custom health probe, you need to associate it to a back-end HTTP setting. A custom probe won't monitor the health of the back-end pool unless the corresponding HTTP setting is explicitly associated with a listener.

## Next steps

Now that you know about Application Gateway components, you can:

- [Create an application gateway in the Azure portal](quick-create-portal.md)
- [Create an application gateway by using PowerShell](quick-create-powershell.md)
- [Create an application gateway by using the Azure CLI](quick-create-cli.md)
