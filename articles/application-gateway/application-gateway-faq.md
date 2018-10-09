---
title: Frequently asked questions for Azure Application Gateway
description: This page provides answers to frequently asked questions about Azure Application Gateway
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/6/2018
ms.author: victorh

---

# Frequently asked questions for Application Gateway

## General

**Q. What is Application Gateway?**

Azure Application Gateway is an Application Delivery Controller (ADC) as a service, offering various layer 7 load-balancing capabilities for your applications. It offers highly available and scalable service, which is fully managed by Azure.

**Q. What features does Application Gateway support?**

Application Gateway supports autoscaling, SSL offloading and end to end SSL, Web Application Firewall, cookie-based session affinity, url path-based routing, multi site hosting, and others. For a full list of supported features, see [Introduction to Application Gateway](application-gateway-introduction.md).

**Q. What is the difference between Application Gateway and Azure Load Balancer?**

Application Gateway is a layer 7 load balancer, which means it works with web traffic only (HTTP/HTTPS/WebSocket). It supports capabilities such as SSL termination, cookie-based session affinity, and round robin for load balancing traffic. Load Balancer load balances traffic at layer 4 (TCP/UDP).

**Q. What protocols does Application Gateway support?**

Application Gateway supports HTTP, HTTPS, HTTP/2, and WebSocket.

**Q. How does Application Gateway support HTTP/2?**

HTTP/2 protocol support is available to clients connecting to application gateway listeners only. The communication to backend server pools is over HTTP/1.1. 

By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet example shows how you can enable it:

```
$gw = Get-AzureRmApplicationGateway -Name test -ResourceGroupName hm
$gw.EnableHttp2 = $true
Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

**Q. What resources are supported today as part of backend pool?**

Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure Web Apps. Application Gateway backend pool members are not tied to an availability set. Members of backend pools can be across clusters, data centers, or outside of Azure as long as they have IP connectivity.

**Q. What regions is the service available in?**

Application Gateway is available in all regions of global Azure. It is also available in [Azure China](https://www.azure.cn/) and [Azure Government](https://azure.microsoft.com/overview/clouds/government/)

**Q. Is this a dedicated deployment for my subscription or is it shared across customers?**

Application Gateway is a dedicated deployment in your virtual network.

**Q. Is HTTP->HTTPS redirection supported?**

Redirection is supported. See [Application Gateway redirect overview](application-gateway-redirect-overview.md) to learn more.

**Q. In what order are listeners processed?**

Listeners are processed in the order they are shown. For that reason if a basic listener matches an incoming request it processes it first.  Multi-site listeners should be configured before a basic listener to ensure traffic is routed to the correct back-end.

**Q. Where do I find Application Gateway’s IP and DNS?**

When using a public IP address as an endpoint, this information can be found on the public IP address resource or on the Overview page for the application gateway in the portal. For internal IP addresses, this can be found on the Overview page.

**Q. Does the IP or DNS name change over the lifetime of the Application Gateway?**

The VIP can change if the application gateway is stopped and started. The DNS name associated with the application gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the application gateway.

**Q. Does Application Gateway support static IP?**

Yes, the Application Gateway V2 SKU does support static public IP addresses. The V1 SKU supports static internal IPs.

**Q. Does Application Gateway support multiple public IPs on the gateway?**

Only one public IP address is supported on an application gateway.

**Q. How large should I make my subnet for Application Gateway?**

Application Gateway consumes one private IP address per instance, plus another private IP address if a private frontend IP configuration is configured. Also, Azure reserves the first four and last IP address in each subnet for internal usage.
For example, if an application gateway is set to three instances and no private frontend IP, then a /29 subnet size or greater is needed. In this case, the application gateway uses three IP addresses. If you have three instances and an IP address for the private frontend IP configuration, then a /28 subnet size or greater is needed as four IP addresses are required.

**Q. Does Application Gateway support x-forwarded-for headers?**

Yes, Application Gateway inserts x-forwarded-for, x-forwarded-proto, and x-forwarded-port headers into the request forwarded to the backend. The format for x-forwarded-for header is a comma-separated list of IP:Port. The valid values for x-forwarded-proto are http or https. X-forwarded-port specifies the port at which the request reached at the application gateway.

Application Gateway also inserts X-Original-Host header that contains the original Host header with which the request arrived. This header is useful in scenarios like Azure Website integration, where the incoming host header is modified before traffic is routed to the backend.

**Q. How long does it take to deploy an Application Gateway? Does my Application Gateway still work when being updated?**

New Application Gateway V1 SKU deployments can take up to 20 minutes to provision. Changes to instance size/count are not disruptive, and the gateway remains active during this time.

V2 SKU deployments can take about five to six minutes to provision.

## Configuration

**Q. Is Application Gateway always deployed in a virtual network?**

Yes, Application Gateway is always deployed in a virtual network subnet. This subnet can only contain Application Gateways.

**Q. Can Application Gateway communicate with instances outside its virtual network?**

Application Gateway can communicate with instances outside of the virtual network that it is in, as long as there is IP connectivity. If you plan to use internal IPs as backend pool members, then it requires [VNET Peering](../virtual-network/virtual-network-peering-overview.md) or [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

**Q. Can I deploy anything else in the application gateway subnet?**

No, but you can deploy other application gateways in the subnet.

**Q. Are Network Security Groups supported on the application gateway subnet?**

Network Security Groups are supported on the application gateway subnet with the following restrictions:

* Exceptions must be put in for incoming traffic on ports 65503-65534 for the Application Gateway V1 SKU and ports 65200 - 65535 for the V2 SKU. This port-range is required for Azure infrastructure communication. They are protected (locked down) by Azure certificates. Without proper certificates, external entities, including the customers of those gateways, will not be able to initiate any changes on those endpoints.

* Outbound internet connectivity can't be blocked.

* Traffic from the AzureLoadBalancer tag must be allowed.

**Q. Are user-defined routes supported on the application gateway subnet?**

User-defined routes (UDRs) are supported on the application gateway subnet, as long as they do not alter the end-to-end request/response communication.

For example, you can set up a UDR in the application gateway subnet to point to a firewall appliance for packet inspection, but you must ensure that the packet can reach its intended destination post inspection. Failure to do so might result in incorrect health probe or traffic routing behavior. This includes learned routes or default 0.0.0.0/0 routes propagated by ExpressRoute or VPN Gateways in the virtual network.

**Q. What are the limits on Application Gateway? Can I increase these limits?**

See [Application Gateway Limits](../azure-subscription-service-limits.md#application-gateway-limits) to view the limits.

**Q. Can I use Application Gateway for both external and internal traffic simultaneously?**

Yes, Application Gateway supports having one internal IP and one external IP per application gateway.

**Q. Is VNet peering supported?**

Yes, VNet peering is supported and is beneficial for load balancing traffic in other virtual networks.

**Q. Can I talk to on-premises servers when they are connected by ExpressRoute or VPN tunnels?**

Yes, as long as traffic is allowed.

**Q. Can I have one backend pool serving many applications on different ports?**

Micro service architecture is supported. You would need multiple http settings configured to probe on different ports.

**Q. Do custom probes support wildcards/regex on response data?**

Custom probes do not support wildcard or regex on response data. 

**Q. How are rules processed?**

Rules are processed in the order they are configured. It is recommended that multi-site rules are configured before basic rules to reduce the chance that traffic is routed to the inappropriate backend as the basic rule would match traffic based on port prior to the multi-site rule being evaluated.

**Q. What does the Host field for custom probes signify?**

Host field specifies the name to send the probe to. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This value is different from VM host name and is in format \<protocol\>://\<host\>:\<port\>\<path\>.

**Q. Can I whitelist Application Gateway access to a few source IPs?**

This scenario can be done using NSGs on the application gateway subnet. The following restrictions should be put on the subnet in the listed order of priority:

* Allow incoming traffic from source IP/IP range.

* Allow incoming requests from all sources to ports 65503-65534 for [backend health communication](application-gateway-diagnostics.md). This port range is required for Azure infrastructure communication. They are protected (locked down) by Azure certificates. Without proper certificates, external entities, including the customers of those gateways, will not be able to initiate any changes on those endpoints.

* Allow incoming Azure Load Balancer probes (AzureLoadBalancer tag) and inbound virtual network traffic (VirtualNetwork tag) on the [NSG](../virtual-network/security-overview.md).

* Block all other incoming traffic with a Deny all rule.

* Allow outbound traffic to the internet for all destinations.

**Q. Can the same port be used for both public and private facing listeners?**

No, this is not supported.

## Performance

**Q. How does Application Gateway support high availability and scalability?**

The Application Gateway V1 SKU supports high availability scenarios when you have two or more instances deployed. Azure distributes these instances across update and fault domains to ensure that all instances do not fail at the same time. The V1 SKU supports scalability by adding multiple instances of the same gateway to share the load.

The V2 SKU automatically ensures that new instances are spread across fault domains and update domains. If zone redundancy is chosen, the newest instances are also spread across availability zones to offer zonal failure resiliency.

**Q. How do I achieve DR scenario across data centers with Application Gateway?**

Customers can use Traffic Manager to distribute traffic across multiple Application Gateways in different datacenters.

**Q. Is autoscaling supported?**

Yes, the Application Gateway V2 SKU supports autoscaling. For more information, see [Autoscaling and Zone-redundant Application Gateway (Public Preview)](application-gateway-autoscaling-zone-redundant.md).

**Q. Does manual scale up/down cause downtime?**

There is no downtime, instances are distributed across upgrade domains and fault domains.

**Q. Does Application Gateway support connection draining?**

Yes. You can configure connection draining to change members within a backend pool without disruption. This will allow existing connections to continue to be sent to their previous destination until either that connection is closed or a configurable timeout expires. Connection draining only waits for current in-flight connections to complete. Application Gateway is not aware of application session state.

**Q. What are application gateway sizes?**

Application Gateway is currently offered in three sizes: **Small**, **Medium**, and **Large**. Small instance sizes are intended for development and testing scenarios.

You can create up to 50 application gateways per subscription, and each application gateway can have up to 10 instances each. Each application gateway can consist of 20 http listeners. For a complete list of application gateway limits, see [Application Gateway service limits](../azure-subscription-service-limits.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#application-gateway-limits).

The following table shows an average performance throughput for each application gateway instance with SSL offload enabled:

| Average back-end page response size | Small | Medium | Large |
| --- | --- | --- | --- |
| 6 KB |7.5 Mbps |13 Mbps |50 Mbps |
| 100 KB |35 Mbps |100 Mbps |200 Mbps |

> [!NOTE]
> These values are approximate values for an application gateway throughput. The actual throughput depends on various environment details, such as average page size, location of back-end instances, and processing time to serve a page. For exact performance numbers, you should run your own tests. These values are only provided for capacity planning guidance.

**Q. Can I change instance size from medium to large without disruption?**

Yes, Azure distributes instances across update and fault domains to ensure that all instances do not fail at the same time. Application Gateway supports scaling by adding multiple instances of the same gateway to share the load.

## SSL Configuration

**Q. What certificates are supported on Application Gateway?**

Self-Signed certs, CA certs, and wild-card certs are supported. EV certs are not supported.

**Q. What are the current cipher suites supported by Application Gateway?**

The following are the current cipher suites supported by Application Gateway. See [Configure SSL policy versions and cipher suites on Application Gateway](application-gateway-configure-ssl-policy-powershell.md) to learn how to customize SSL options.

- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_CBC_SHA
- TLS_DHE_RSA_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_AES_256_GCM_SHA384
- TLS_RSA_WITH_AES_128_GCM_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA256
- TLS_RSA_WITH_AES_128_CBC_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA
- TLS_RSA_WITH_AES_128_CBC_SHA
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_3DES_EDE_CBC_SHA
- TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA

**Q. Does Application Gateway also support re-encryption of traffic to the backend?**

Yes, Application Gateway supports SSL offload, and end to end SSL, which re-encrypts the traffic to the backend.

**Q. Can I configure SSL policy to control SSL Protocol versions?**

Yes, you can configure Application Gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are already disabled by default and are not configurable.

**Q. Can I configure cipher suites and policy order?**

Yes, [configuration of cipher suites](application-gateway-ssl-policy-overview.md) is supported. When defining a custom policy, at least one of the following cipher suites must be enabled. Application gateway uses SHA256 to for backend management.

* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_256_CBC_SHA256
* TLS_RSA_WITH_AES_128_CBC_SHA256

**Q. How many SSL certificates are supported?**

Up to 20 SSL certificates are supported.

**Q. How many authentication certificates for backend re-encryption are supported?**

Up to 10 authentication certificates are supported with a default of 5.

**Q. Does Application Gateway integrate with Azure Key Vault natively?**

No, it is not integrated with Azure Key Vault.

## Web Application Firewall (WAF) Configuration

**Q. Does the WAF SKU offer all the features available with the Standard SKU?**

Yes, WAF supports all the features in the Standard SKU.

**Q. What is the CRS version Application Gateway supports?**

Application Gateway supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229) and CRS [3.0](application-gateway-crs-rulegroups-rules.md#owasp30).

**Q. How do I monitor WAF?**

WAF is monitored through diagnostic logging, more information on diagnostic logging can be found at [Diagnostics Logging and Metrics for Application Gateway](application-gateway-diagnostics.md)

**Q. Does detection mode block traffic?**

No, detection mode only logs traffic, which triggered a WAF rule.

**Q. How do I customize WAF rules?**

Yes, WAF rules are customizable, for more information on how to customize them see [Customize WAF rule groups and rules](application-gateway-customize-waf-rules-portal.md)

**Q. What rules are currently available?**

WAF currently supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229) and [3.0](application-gateway-crs-rulegroups-rules.md#owasp30), which provide baseline security against most of the top 10 vulnerabilities identified by the Open Web Application Security Project (OWASP) found here [OWASP top 10 Vulnerabilities](https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)

* SQL injection protection

* Cross site scripting protection

* Common Web Attacks Protection such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion attack

* Protection against HTTP protocol violations

* Protection against HTTP protocol anomalies such as missing host user-agent and accept headers

* Prevention against bots, crawlers, and scanners

 * Detection of common application misconfigurations (that is, Apache, IIS, etc.)

**Q. Does WAF also support DDoS prevention?**

Yes. You can enable DDos protection on the VNet where the application gateway is deployed. This ensures that the application gateway VIP is also protected using the Azure DDos Protection service.

## Diagnostics and Logging

**Q. What types of logs are available with Application Gateway?**

There are three logs available for Application Gateway. For more information on these logs and other diagnostic capabilities, see [Backend health, diagnostics logs, and metrics for Application Gateway](application-gateway-diagnostics.md).

- **ApplicationGatewayAccessLog** - The access log contains each request submitted to the application gateway frontend. The data includes the caller's IP, URL requested, response latency, return code, bytes in and out. Access log is collected every 300 seconds. This log contains one record per instance of an application gateway.
- **ApplicationGatewayPerformanceLog** - The performance log captures performance information on per instance basis including total request served, throughput in bytes, total requests served, failed request count, healthy and unhealthy back-end instance count.
- **ApplicationGatewayFirewallLog** - The firewall log contains requests that are logged through either detection or prevention mode of an application gateway that is configured with web application firewall.

**Q. How do I know if my backend pool members are healthy?**

You can use the PowerShell cmdlet `Get-AzureRmApplicationGatewayBackendHealth` or verify health through the portal by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

**Q. What is the retention policy on the diagnostics logs?**

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Log Analytics. See [Application Gateway Diagnostics](application-gateway-diagnostics.md) for more details.

**Q. How do I get audit logs for Application Gateway?**

Audit logs are available for Application Gateway. In the portal, click **Activity Log** in the menu blade of an application gateway to access the audit log. 

**Q. Can I set alerts with Application Gateway?**

Yes, Application Gateway does support alerts. Alerts are configured on metrics. See [Application Gateway Metrics](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics#metrics) to learn more about Application Gateway metrics. To learn more about alerts, see [Receive alert notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md).

**Q. How do I analyze traffic statistics for Application Gateway?**

You can view and analyze Access logs via a number of mechanisms such as Azure Log Analytics, Excel, Power BI etc.

We have also published a Resource Manager template that installs and runs the popular [GoAccess](https://goaccess.io/) log analyzer for Application Gateway Access Logs. GoAccess provides valuable HTTP traffic statistics such as Unique Visitors, Requested Files, Hosts, Operating Systems, Browsers, HTTP Status codes and more. For more details, please see the [Readme file in the Resource Manager template folder in GitHub](https://aka.ms/appgwgoaccessreadme).

**Q. Backend health returns unknown status, what could be causing this status?**

The most common reason is access to the backend is being blocked by an NSG or custom DNS. See [Backend health, diagnostics logging, and metrics for Application Gateway](application-gateway-diagnostics.md) to learn more.

## Next Steps

To learn more about Application Gateway see [What is Azure Application Gateway?](overview.md)
