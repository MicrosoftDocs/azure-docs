---
title: Azure Application Gateway configuration overview
description: This article provides information on how to configure the various components in Azure Application Gateway
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 03/20/2019
ms.author: absha

---

# Application Gateway configuration overview

Application gateway comprises of several components that can be configured in different ways for accomplishing different scenarios. This article walks you through how each component is to be configured.

![application-gateway-components](./media/configuration-overview/configuration-overview1.png)

The example image above illustrates configuration of an application with 3 listeners. First two are multi-site listeners for `http://acme.com/*` and `http://fabrikam.com/*`, respectively. Both are listening on port 80. The third listener is a basic listener with end to end SSL termination. 

## Prerequisites

### Azure virtual network and dedicated subnet

Application gateway is a dedicated deployment in your virtual network. Within your virtual network, a dedicated subnet is required for your application gateway. You can have multiple instances of a given application gateway deployment in this subnet. You can also deploy other application gateways in the subnet but you cannot deploy any other resource in the application gateway subnet.  

> [!NOTE]	
> Mixing Standard_v2 and Standard Application Gateway on the same subnet is not supported.

#### Size of the subnet

Application Gateway consumes one private IP address per instance, plus another private IP address if a private frontend IP configuration is configured. In addition, Azure reserves five IP addresses - the first four and last IP address - in each subnet for internal usage. For example, if an application gateway is set to 15 instances and no private frontend IP, then at least 20 IP addresses will be required in the subnet - five IP addresses for internal usage and 15 IP addresses for the 15 instances of the application gateway. Therefore, in this case a /27 subnet size or greater is needed. If you have 27 instances and an IP address for the private frontend IP configuration, then 33 IP addresses will be required - 27 IP addresses for the 27 instances of the application gateway, one IP address for private frontend IP and five IP addresses for internal usage. Therefore, in this case a /26 subnet size or greater is needed.

It is recommended to use at least a /28 subnet size. This gives you 11 usable addresses. If your application load requires more than 10 instances, you should consider a /27 or /26 subnet size.

#### Network Security Groups supported on the Application Gateway subnet

Network Security Groups (NSGs) are supported on the Application Gateway subnet with the following restrictions: 

- Exceptions must be put in for incoming traffic on ports 65503-65534 for the Application Gateway v1 SKU and ports 65200 - 65535 for the v2 SKU. This port-range is required for Azure infrastructure communication. They are protected (locked down) by Azure certificates. Without proper certificates, external entities, including the customers of those gateways, are not able to initiate any changes on those endpoints.

- Outbound internet connectivity can't be blocked. Default outbound rules in the NSG already allow internet connectivity. We recommend that you don't remove the default outbound rules and that you don't create other outbound rules that deny outbound internet connectivity.

- Traffic from the AzureLoadBalancer tag must be allowed.

##### Whitelist Application Gateway access to a few source IPs

This scenario can be done using NSGs on the application gateway subnet. The following restrictions should be put on the subnet in the listed order of priority:

1. Allow incoming traffic from source IP/IP range.
2. Allow incoming requests from all sources to ports 65503-65534 for [backend health communication](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics). This port range is required for Azure infrastructure communication. They are protected (locked down) by Azure certificates. Without proper certificates, external entities, including the customers of those gateways, will not be able to initiate any changes on those endpoints.
3. Allow incoming Azure Load Balancer probes (AzureLoadBalancer tag) and inbound virtual network traffic (VirtualNetwork tag) on the [NSG](https://docs.microsoft.com/azure/virtual-network/security-overview).
4. Block all other incoming traffic with a Deny all rule.
5. Allow outbound traffic to the internet for all destinations.

#### User-defined routes supported on the Application Gateway subnet

In case of v1 SKU, User-defined routes (UDRs) are supported on the application gateway subnet, as long as they do not alter the end-to-end request/response communication. For example, you can set up a UDR in the application gateway subnet to point to a firewall appliance for packet inspection, but you must ensure that the packet can reach its intended destination post inspection. Failure to do so might result in incorrect health probe or traffic routing behavior. This includes learned routes or default 0.0.0.0/0 routes propagated by ExpressRoute or VPN Gateways in the virtual network.

In case of v2 SKU, UDRs on the application gateway subnet are not supported. For more information, see [Autoscaling and Zone-redundant Application Gateway (Public Preview)](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant#known-issues-and-limitations).

> [!NOTE]
> Using UDRs on the application gateway subnet will cause the health status in the [backend health view](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics#back-end-health) to be shown as **Unknown** and will also result in failue of generation of application gateway logs and metrics. It is recommended you do not use UDRs on application gateway subnet to be able to view the backend health, logs and metrics.

## Frontend IP

You can configure the application gateway to either have a public IP address or a private IP address, or both. Public IP is required when you are hosting a backend that is required to be accessed by clients over the internet via an Internet-facing VIP. Public IP is not required for an internal endpoint that is not exposed to the Internet, also known as an internal load balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line-of-business applications that are not exposed to the Internet. It's also useful for services and tiers within a multi-tier application that sit in a security boundary that is not exposed to the Internet but still require round-robin load distribution, session stickiness, or Secure Sockets Layer (SSL) termination.

Only one public IP address or one private IP address is supported. You choose the frontend IP while creating the Application Gateway. 

- In case of a Public IP, you can choose to create a new public IP or use an existing public IP in the same location as the Application Gateway. If you create a new public IP address, the IP address type selected (static or dynamic) cannot be changed later. For more information, see [Static vs Dynamic Public IP](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#static-vs-dynamic-public-ip) 

- In case of a private IP, you can choose to specify a private IP address from the subnet in which the Application Gateway is created. If not specified explicitly, an arbitrary IP address will be automatically selected from the subnet. For more information, see [Create an application gateway with an internal load balancer (ILB) endpoint.](https://docs.microsoft.com/azure/application-gateway/application-gateway-ilb-arm)

A Frontend IP is associated to *listener* which checks for incoming requests on the Frontend IP.

## Listeners

A listener is a logical entity which checks for the incoming connection requests, using the port, protocol, host and  IP address. Therefore, when you configure the listener you need to enter those values of port, protocol, host and  IP address which are same as the corresponding values in the incoming request on the gateway. When you create an application gateway using the Azure portal, you also create a default listener by choosing the protocol and port for the listener. You can additionally choose whether you want to enable HTTP2 support on the listener. Once the Application Gateway is created, you can edit the setting of this default listener(*appGatewayHttpListener*/*appGatewayHttpsListener*) and/or create new listeners.

### Listener type

You can choose between [basic or multi-site listener](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#types-of-listeners) while creating a new listener. 

- If you are hosting a single site behind an Application gateway, choose basic listener. Learn [how to create an application gateway with basic listener](https://docs.microsoft.com/azure/application-gateway/quick-create-portal).

- If you are configuring more than one web application or multiple subdomains of the same parent domain on the same application gateway instance, then choose multi-site listener. For multi-site listener, you will additionally need to enter a host name. This is because Application Gateway relies on HTTP 1.1 host headers to host more than one website on the same public IP address and port.

#### Order of processing listeners

In case of v1 SKUs, listeners are processed in the order they are shown. For that reason if a basic listener matches an incoming request it processes it first. Therefore, multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

In case of v2 SKUs, multi-site listeners are processed before basic listeners.

### Frontend IP

Choose the frontend IP that you intend to associate with this listener. The listener will be listening to the incoming request on this IP.

### Frontend Port

Choose the frontend port. You can choose from the existing ports or create a new one. You can choose any value from the [allowed range of ports](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#ports). This allows you to not only use well-known ports such as 80 and 443 but any allowed custom port suitable for your use. One port can either be used for public facing listeners or private facing listeners.

### Protocol

You need to choose between HTTP and HTTPS protocol. 

- If you choose HTTP, the traffic between the client and application gateway will flow unencrypted.

- Choose HTTPS if you are interested in [Secure Sockets Layer (SSL) termination](https://docs.microsoft.com/azure/application-gateway/overview#secure-sockets-layer-ssl-terminationl) or [end to end SSL encryption](https://docs.microsoft.com/azure/application-gateway/ssl-overview). If you choose HTTPS, the traffic between the client and application gateway will be encrypted and the SSL connection will be terminated at the application gateway.  If you want end to end SSL encryption, you will additionally need to choose HTTPS protocol while configuring *backend HTTP setting*. This will ensure that the traffic is re-encrypted when it travels from the Application Gateway to the backend.

  To configure Secure Sockets Layer (SSL) termination and end to end SSL encryption, a certificate is required to be added to the listener so as to enable the Application Gateway to derive a symmetric key as per SSL protocol specification. The symmetric key is then used to encrypt and decrypt the traffic sent to the gateway. The gateway certificate needs to be in Personal Information Exchange (PFX) format. This file format allows you to export the private key that is required by the application gateway to perform the encryption and decryption of traffic. 

#### Supported certificates

See [certificates supported for SSL termination](https://docs.microsoft.com/azure/application-gateway/ssl-overview#certificates-supported-for-ssl-termination).

### Additional protocol support

#### HTTP2 support

HTTP/2 protocol support is available to clients connecting to application gateway listeners only. The communication to backend server pools is over HTTP/1.1. By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet example shows how you can enable it:

```azurepowershell
$gw = Get-AzureRmApplicationGateway -Name test -ResourceGroupName hm

$gw.EnableHttp2 = $true

Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

#### Websocket support

Websocket support is enabled by default. There's no user-configurable setting to selectively enable or disable WebSocket support. You can use WebSockets with both HTTP and HTTPS listeners. 

### Custom Error Page

Custom error pages can be defined at the global level as well as the listener level, however, creating global level custom error pages from the Azure portal is currently not supported. You can configure a custom error page for a 403 WAF error or a 502 maintenance page at the listener level. You also need to specify a publicly accessible blob URL for the given error status code. For more information, see [Create custom error page](https://docs.microsoft.com/azure/application-gateway/custom-error).

![Application Gateway error codes](https://docs.microsoft.com/azure/application-gateway/media/custom-error/ag-error-codes.png)

To configure a global custom error page, use [Azure PowerShell for configuration](https://docs.microsoft.com/azure/application-gateway/custom-error#azure-powershell-configuration) 

### SSL Policy

You can centralize SSL certificate management and reduce encryption and decryption overhead from a back-end server farm. This centralized SSL handling also lets you specify a central SSL policy that's suited to your organizational security requirements.  You can choose between default, predefined and custom SSL policy. 

You can configure SSL policy to control SSL Protocol versions. You can configure application gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are already disabled by default and are not configurable. For more information, see [Application Gateway SSL policy overview](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-policy-overview).

After creating a listener, you associate it with a request routing rule which determines how the request received on the listener is to be routed to the backend.

## Request routing rule

While creating the application gateway using the Azure portal, you create a default rule (*rule1*), which binds the default listener (*appGatewayHttpListener*) with the default backend pool (*appGatewayBackendPool*) and default backend HTTP settings (*appGatewayBackendHttpSettings*). Once the application gateway is created, you can edit the setting of this default rule and/or create new rules.

### Rule type

You can choose between [basic or path-based rule](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#request-routing-rule) while creating a new rule. 

- If you want to forward all requests on the associated listener (eg: blog.contoso.com/*) to a single backend pool, choose basic listener. 
- Choose path-based listener if you want to route requests with specific URL path to specific backend pools. The path pattern is applied only to the path of the URL, not to its query parameters.


#### Order of processing rules

In case of v1 SKUs, matching of pattern of the incoming request is processed in the order in which the paths are listed in the URL path map of the path-based rule. For that reason, if a request matches the pattern in two or more paths in the URL path map, then the path which is listed first will be matched and the request will be forwarded to the backend associated with that path.

In case of v2 SKUs, an exact match holds higher priority over the order in which the paths are listed in the URL path map. For that reason, if a request matches the pattern in two or more paths, then the request will be forwarded to the backend associated with that path that matches exactly with the request. If the path in the incoming request does not exactly match any path in the URL path map, then matching of pattern of the incoming request is processed in the order in which the paths are listed in the URL path map of the path-based rule.

### Associated listener

You need to associate a listener to the rule so that the *request routing rule* associated with the *listener* is evaluated to determine the *backend pool* to which the request is to be routed.

### Associated backend Pool

Associate the backend pool containing the backend targets which will serve the requests received by the listener. In case of a basic rule, only one backend pool is allowed since all the requests on the associated listener will be forwarded to this backend pool. In case of a path-based rule, add multiple backend pools corresponding to each URL path. The requests which match the URL path entered here, will be forwarded to the corresponding backend pool. Also, add a default backend pool since the requests which do not match any URL path entered in this rule will be forwarded to it.

### Associated backend HTTP setting

Add a backend HTTP setting for each rule. The requests will be routed from the Application Gateway to the backend targets using the port number, protocol and other settings specified in this setting. In case of a basic rule, only one backend HTTP setting is allowed since all the requests on the associated listener will be forwarded to the corresponding backend targets using this HTTP setting. In case of a path-based rule, add multiple backend HTTP settings corresponding to each URL path. The requests which match the URL path entered here, will be forwarded to the corresponding backend targets using the HTTP settings corresponding to each URL path. Also, add a default HTTP setting since the requests which do not match any URL path entered in this rule will be forwarded to the default backend pool using the default HTTP setting.

### Redirection setting

If the redirection is configured for a basic rule, all the requests on the associated  listener will be redirected to the redirection target, thereby enabling global redirection. If the redirection is configured for a path-based rule, the requests only on a specific site area, for example a shopping cart area denoted by /cart/*, will be redirected to the redirection target, thereby enabling path-based redirection. 

For information about the redirection capability, see [Redirection overview](https://docs.microsoft.com/azure/application-gateway/redirect-overview).

- #### Redirection type

  Choose type of redirection required from: Permanent(301), Temporary(307), Found(302) or See other(303).

- #### Redirection target

  You can choose between another listener or an external site as redirection target. 

  - ##### Listener

    Choosing listener as the redirection target helps in redirecting from one listener to another listener on the gateway. This setting is required when you want to enable HTTP to HTTPS redirection, i.e., redirect traffic from the source listener checking for the incoming HTTP requests to the destination listener checking for the incoming HTTPS requests. You can also choose the query string and path in the original request to be included in the request forwarded to the redirection target.![application-gateway-components](./media/configuration-overview/configure-redirection.png)

    For more information on HTTP to HTTPS redirection, see [HTTP to HTTP redirection using portal](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-portal), [HTTP to HTTP redirection using PowerShell](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-powershell), [HTTP to HTTP redirection using CLI](https://docs.microsoft.com/azure/application-gateway/redirect-http-to-https-cli)

  - ##### External site

    Choose external site when you want to redirect the traffic on the listener associated with thus rule to be redirected to an external site. You can choose the query string in the original request to be included in the request forwarded to the redirection target. You cannot forward the path in the original request to the external site.

    For more information on redirection to external site, see [redirect traffic to external site using PowerShell](https://docs.microsoft.com/azure/application-gateway/redirect-external-site-powershell) and [https://docs.microsoft.com/azure/application-gateway/redirect-external-site-cli](https://docs.microsoft.com/azure/application-gateway/redirect-external-site-cli)

#### Rewrite HTTP header setting

This capability allows you to add, remove, or update HTTP request and response headers while the request and response packets move between the client and backend pools.    You can configure this capability only through PowerShell. Portal and CLI support is not available yet. For more information, see [Rewrite HTTP headers](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers) overview and [Configure HTTP header rewrite](https://docs.microsoft.com/azure/application-gateway/add-http-header-rewrite-rule-powershell#specify-your-http-header-rewrite-rule-configuration).

## HTTP settings

The application gateway routes traffic to the backend servers using the configuration specified in this component. Once you create an HTTP setting, you need to associate it with one or more request routing rules.

### Cookie based affinity

This feature is useful when you want to keep a user session on the same server. By using gateway-managed cookies, the application gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session. If the application cannot handle cookie-based affinity, then you will not be able to use this capability. To use cookie-based session affinity, you should ensure that the clients must support cookies. 

### Connection draining

Connection draining helps you achieve graceful removal of backend pool members during planned service updates. This setting can be applied to all members of a backend pool during rule creation. Once enabled, application gateway ensures that all de-registering instances of a backend pool do not receive any new requests while allowing existing requests to complete within a configured time limit. This applies to both backend instances that are explicitly removed from the backend pool by an API call as well as backend instances that are reported as unhealthy as determined by the health probes.

### Protocol

Application gateway supports both HTTP and HTTPS protocols for routing requests to the backend servers. If the HTTP protocol is chosen, then traffic flows unencrypted to the backend servers. In those cases where unencrypted communication to the backend servers is not an acceptable option, you should choose the HTTPS protocol. This setting combined with choosing HTTPS protocol in the listener allows you to enable [end to end SSL](https://docs.microsoft.com/azure/application-gateway/ssl-overview). That allows you to securely transmit sensitive data to the backend encrypted. Each backend server in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication.

### Port

This is the port that the backend servers are listening to the traffic coming from the Application Gateway. You can configure ports ranging from 1 to 65535.

### Request timeout

The number of seconds the application gateway waits to receive response from the backend pool before returning a "Connection timed out" error.

### Override backend path

This setting allows you to configure an optional custom forwarding path to use when the request is forwarded to the backend. This will copy any part of the incoming path that matches to the custom path specified in the **override backend path** field to the forwarded path. See the table below to understand how the capability works.

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

### Use for App service

This is a UI shortcut which selects the two required settings for App service backend - enables pick host name from backend address and creates a new custom probe. The reason why former is done is explained in the section for **pick host name from backend address** setting. A new probe is created where the probe header is also picked from backend member’s address.

### Use custom probe

This setting is used to associate a [custom probe](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#custom-health-probe) with this HTTP setting. You can associate only one custom probe with an HTTP setting. If you don't explicitly associate a custom probe, then [default probe](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#default-health-probe-settings) will be used to monitor the health of the backend. It is recommended that you create a custom probe to have more granular control over the health monitoring of your backends.

> [!NOTE]	
> Custom probe will not begin monitoring the health of the backend pool unless the corresponding HTTP setting is explicitly associated with a listener.

### Pick host name from backend address

This capability dynamically sets the *host* header in the request to the host name of the backend pool using an IP address or fully qualified domain name (FQDN). This is helpful in the scenarios where the domain name of the backend is different from the DNS name of the application gateway and the backend relies on a specific host header or SNI extension to resolve to the correct endpoint, such as in case of multi-tenant services as the backend. Since App service is a multi-tenant service using a shared space with a single IP address, an App service can be accessed only with the hostnames configured in the custom domain settings. By default, the custom domain name is *example.azurewebsites.net*. Therefore, if you want to access your App service using application gateway with either a hostname not explicitly registered in App service or with Application gateway’s FQDN, you have to override the hostname in the original request to the App service’s hostname, by enabling **pick host name from backend address** setting.

If you own a custom domain and have mapped the existing custom DNS name to the App service, then you do not need to enable this setting.

> [!NOTE]	
> This setting is not required for App Service Environment (ASE) since ASE is a dedicated deployment. 

### Host name override

This capability replaces the *host* header in the incoming request on the application gateway to the host name you specify here. For example, if www\.contoso.com is specified as the **Host name** setting, the original request https://appgw.eastus.cloudapp.net/path1 will be changed to https://www.contoso.com/path1 when the request is forwarded to the backend server. 

## Backend pool

A backend pool can be pointed to four types of backend members: a specific virtual machine, virtual machine scale set, an IP address/FQDN or an app service. Each backend pool can point to multiple members of the same type. Pointing members of different types in the same backend pool is not supported. 

After you create a backend pool, you need to associate it with one or more request routing rules. You also need to configure health probes for each backend pool on your application gateway. When a request routing rule condition is met, the application gateway forwards the traffic to the healthy servers (as determined by the health probes) in the corresponding backend pool.

## Health probes

Even though application gateway monitors health of all the resources in its backend by default, it is highly recommended you create a custom probe for each backend HTTP setting so as to have a more granular control over the health monitoring. To learn how to configure custom health probe, see [Custom health probe settings](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#custom-health-probe-settings).

> [!NOTE]	
> Once you create a custom health probe, you need to associate it to a backend HTTP setting. Custom probe will not begin monitoring the health of the backend pool unless the corresponding HTTP setting is explicitly associated with a listener.

## Next steps

After learning about Application Gateway components, you can:

- [Create an Application Gateway in the Azure portal](quick-create-portal.md)
- [Create an Application Gateway using PowerShell](quick-create-powershell.md)
- [Create an Application Gateway using Azure CLI](quick-create-cli.md)
