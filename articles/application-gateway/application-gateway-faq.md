---
title: Frequently asked questions for Azure Application Gateway
description: This page provides answers to frequently asked questions about Azure Application Gateway
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 3/20/2019
ms.author: victorh
---

# Frequently asked questions for Application Gateway

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## General

### What is Application Gateway?

Azure Application Gateway is an Application Delivery Controller (ADC) as a service, offering various layer 7 load-balancing capabilities for your applications. It offers highly available and scalable service, which is fully managed by Azure.

### What features does Application Gateway support?

Application Gateway supports autoscaling, SSL offloading and end to end SSL, Web Application Firewall, cookie-based session affinity, url path-based routing, multisite hosting, and others. For a full list of supported features, see [Introduction to Application Gateway](application-gateway-introduction.md).

### What is the difference between Application Gateway and Azure Load Balancer?

Application Gateway is a layer 7 load balancer, which means it works with web traffic only (HTTP/HTTPS/WebSocket/HTTP/2). It supports capabilities such as SSL termination, cookie-based session affinity, and round robin for load balancing traffic. Load Balancer load balances traffic at layer 4 (TCP/UDP).

### What protocols does Application Gateway support?

Application Gateway supports HTTP, HTTPS, HTTP/2, and WebSocket.

### How does Application Gateway support HTTP/2?

See [HTTP/2 Support](https://docs.microsoft.com/azure/application-gateway/configuration-overview#http2-support) to learn how Application gateway supports HTTP/2 protocol.

### What resources are supported today as part of backend pool?

See [supported backend resources](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#backend-pool) to learn which resources are supported by Application gateway.

### What regions is the service available in?

Application Gateway is available in all regions of global Azure. It is also available in [Azure China 21Vianet](https://www.azure.cn/) and [Azure Government](https://azure.microsoft.com/overview/clouds/government/)

### Is this a dedicated deployment for my subscription or is it shared across customers?

Application Gateway is a dedicated deployment in your virtual network.

### Is HTTP->HTTPS redirection supported?

Redirection is supported. See [Application Gateway redirect overview](application-gateway-redirect-overview.md) to learn more.

### In what order are listeners processed?

See [order of processing listeners](https://docs.microsoft.com/azure/application-gateway/configuration-overview#order-of-processing-listeners).

### Where do I find Application Gateway’s IP and DNS?

When using a public IP address as an endpoint, this information can be found on the public IP address resource or on the Overview page for the application gateway in the portal. For internal IP addresses, this can be found on the Overview page.

### What is Keep-Alive timeout and TCP idle timeout setting on Application Gateway?

Keep-Alive timeout on v1 SKU is 120 sec. Keep-Alive timeout on v2 SKU is 75 sec. TCP idle timeout is 4-min default on the frontend VIP of Application Gateway.

### Does the IP or DNS name change over the lifetime of the Application Gateway?

The VIP can change if the application gateway is stopped and started. The DNS name associated with the application gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the application gateway.

### Does Application Gateway support static IP?

Yes, the Application Gateway v2 SKU does support static public IP addresses. The v1 SKU supports static internal IPs.

### Does Application Gateway support multiple public IPs on the gateway?

Only one public IP address is supported on an application gateway.

### How large should I make my subnet for Application Gateway?

See [Application Gateway subnet size considerations](https://docs.microsoft.com/azure/application-gateway/configuration-overview#size-of-the-subnet) to understand the subnet size required for your deployment.

### Q. Can I deploy more than one Application Gateway resource to a single subnet?

Yes, in addition to having multiple instances of a given Application Gateway deployment, you can provision another unique Application Gateway resource to an existing subnet that contains a different Application Gateway resource.

Mixing Standard_v2 and Standard Application Gateway on the same subnet is not supported.

### Does Application Gateway support x-forwarded-for headers?

Yes. See [modifications to request](https://docs.microsoft.com/azure/application-gateway/how-application-gateway-works#modifications-to-the-request) to learn about the x-forwarded-for headers supported by Application Gateway.

### How long does it take to deploy an Application Gateway? Does my Application Gateway still work when being updated?

New Application Gateway v1 SKU deployments can take up to 20 minutes to provision. Changes to instance size/count are not disruptive, and the gateway remains active during this time.

V2 SKU deployments can take about five to six minutes to provision.

### Can Exchange server be used as backend with Application Gateway?

No, Application Gateway does not support email protocols such as SMTP, IMAP and POP3. 

## Performance

### How does Application Gateway support high availability and scalability?

The Application Gateway v1 SKU supports high availability scenarios when you have two or more instances deployed. Azure distributes these instances across update and fault domains to ensure that all instances do not fail at the same time. The v1 SKU supports scalability by adding multiple instances of the same gateway to share the load.

The v2 SKU automatically ensures that new instances are spread across fault domains and update domains. If zone redundancy is chosen, the newest instances are also spread across availability zones to offer zonal failure resiliency.

### How do I achieve DR scenario across data centers with Application Gateway?

Customers can use Traffic Manager to distribute traffic across multiple Application Gateways in different datacenters.

### Is autoscaling supported?

Yes, the Application Gateway v2 SKU supports autoscaling. For more information, see [Autoscaling and Zone-redundant Application Gateway (Public Preview)](application-gateway-autoscaling-zone-redundant.md).

### Does manual scale up/down cause downtime?

There is no downtime. Instances are distributed across upgrade domains and fault domains.

### Does Application Gateway support connection draining?

Yes. You can configure connection draining to change members within a backend pool without disruption. This allows existing connections to continue to be sent to their previous destination until either that connection is closed or a configurable timeout expires. Connection draining only waits for current in-flight connections to complete. Application Gateway is not aware of application session state.

### Can I change instance size from medium to large without disruption?

Yes, Azure distributes instances across update and fault domains to ensure that all instances do not fail at the same time. Application Gateway supports scaling by adding multiple instances of the same gateway to share the load.

## Configuration

### Is Application Gateway always deployed in a virtual network?

Yes, Application Gateway is always deployed in a virtual network subnet. This subnet can only contain Application Gateways. See [virtual network and subnet requirements](https://docs.microsoft.com/azure/application-gateway/configuration-overview#azure-virtual-network-and-dedicated-subnet) to understand the subnet considerations for Application Gateway.

### Can Application Gateway communicate with instances outside of the virtual network it is in or outside of the subscription it is in?

Application Gateway can communicate with instances outside of the virtual network that it is in or outside of the subscription it is in, as long as there is IP connectivity. If you plan to use internal IPs as backend pool members, then it requires [VNET Peering](../virtual-network/virtual-network-peering-overview.md) or [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

### Can I deploy anything else in the application gateway subnet?

No, but you can deploy other application gateways in the subnet.

### Are Network Security Groups supported on the application gateway subnet?

See [Network Security Groups restrictions on the Application Gateway subnet](https://docs.microsoft.com/azure/application-gateway/configuration-overview#network-security-groups-supported-on-the-application-gateway-subnet) learn about the Network Security Groups supported on the application gateway subnet.

### Are user-defined routes supported on the application gateway subnet?

See [user-defined routes restrictions](https://docs.microsoft.com/azure/application-gateway/configuration-overview#user-defined-routes-supported-on-the-application-gateway-subnet) to learn about the user-defined routes supported on the application gateway subnet.

### What are the limits on Application Gateway? Can I increase these limits?

See [Application Gateway Limits](../azure-subscription-service-limits.md#application-gateway-limits) to view the limits.

### Can I use Application Gateway for both external and internal traffic simultaneously?

Yes, Application Gateway supports having one internal IP and one external IP per application gateway.

### Is VNet peering supported?

Yes, VNet peering is supported and is beneficial for load balancing traffic in other virtual networks.

### Can I talk to on-premises servers when they are connected by ExpressRoute or VPN tunnels?

Yes, as long as traffic is allowed.

### Can I have one backend pool serving many applications on different ports?

Micro service architecture is supported. You would need multiple http settings configured to probe on different ports.

### Do custom probes support wildcards/regex on response data?

Custom probes do not support wildcard or regex on response data.

### How are rules processed?

See [Order of processing rules](https://docs.microsoft.com/azure/application-gateway/configuration-overview#order-of-processing-rules) to understand how routing rules are processes in Application Gateway.

### What does the Host field for custom probes signify?

Host field specifies the name to send the probe to. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This value is different from VM host name and is in format \<protocol\>://\<host\>:\<port\>\<path\>.

### Can I whitelist Application Gateway access to a few source IPs?

Yes. See [restrict access to specific source IPs](https://docs.microsoft.com/azure/application-gateway/configuration-overview#whitelist-application-gateway-access-to-a-few-source-ips) to understand how to ensure that only whitelisted source IPs can access the Application Gateway.

### Can the same port be used for both public and private facing listeners?

No, this is not supported.

## Configuration - SSL

### What certificates are supported on Application Gateway?

Self-Signed certs, CA certs, EV certs, and wild-card certs are supported.

### What are the current cipher suites supported by Application Gateway?

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

### Does Application Gateway also support re-encryption of traffic to the backend?

Yes, Application Gateway supports SSL offload, and end to end SSL, which re-encrypts the traffic to the backend.

### Can I configure SSL policy to control SSL Protocol versions?

Yes, you can configure Application Gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are already disabled by default and are not configurable.

### Can I configure cipher suites and policy order?

Yes, [configuration of cipher suites](application-gateway-ssl-policy-overview.md) is supported. When defining a custom policy, at least one of the following cipher suites must be enabled. Application gateway uses SHA256 to for backend management.

* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_256_CBC_SHA256
* TLS_RSA_WITH_AES_128_CBC_SHA256

### How many SSL certificates are supported?

Up to 100 SSL certificates are supported.

### How many authentication certificates for backend re-encryption are supported?

Up to 10 authentication certificates are supported with a default of 5.

### Does Application Gateway integrate with Azure Key Vault natively?

No, it is not integrated with Azure Key Vault.

### How to configure HTTPS listeners for .com and .net sites? 

For multiple domain-based (host-based) routing, you can create multi-site listeners, choose HTTPS as the protocol in listener configuration and associate the listeners with the routing rules. For more details, see [hosting multiple sites with Application Gateway](https://docs.microsoft.com/azure/application-gateway/multiple-site-overview). 

## Configuration - Web Application Firewall (WAF)

### Does the WAF SKU offer all the features available with the Standard SKU?

Yes, WAF supports all the features in the Standard SKU.

### What is the CRS version Application Gateway supports?

Application Gateway supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229) and CRS [3.0](application-gateway-crs-rulegroups-rules.md#owasp30).

### How do I monitor WAF?

WAF is monitored through diagnostic logging, more information on diagnostic logging can be found at [Diagnostics Logging and Metrics for Application Gateway](application-gateway-diagnostics.md)

### Does detection mode block traffic?

No, detection mode only logs traffic, which triggered a WAF rule.

### Can I customize WAF rules?

Yes, WAF rules are customizable. For more information, see [Customize WAF rule groups and rules](application-gateway-customize-waf-rules-portal.md)

### What rules are currently available

WAF currently supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229) and [3.0](application-gateway-crs-rulegroups-rules.md#owasp30), which provide baseline security against most of the top 10 vulnerabilities identified by the Open Web Application Security Project (OWASP) found here [OWASP top 10 Vulnerabilities](https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)

* SQL injection protection

* Cross site scripting protection

* Common Web Attacks Protection such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion attack

* Protection against HTTP protocol violations

* Protection against HTTP protocol anomalies such as missing host user-agent and accept headers

* Prevention against bots, crawlers, and scanners

* Detection of common application misconfigurations (that is, Apache, IIS, etc.)

### Does WAF also support DDoS prevention?

Yes. You can enable DDos protection on the VNet where the application gateway is deployed. This ensures that the application gateway VIP is also protected using the Azure DDos Protection service.

## Diagnostics and Logging

### What types of logs are available with Application Gateway?

There are three logs available for Application Gateway. For more information on these logs and other diagnostic capabilities, see [Backend health, diagnostics logs, and metrics for Application Gateway](application-gateway-diagnostics.md).

* **ApplicationGatewayAccessLog** - The access log contains each request submitted to the application gateway frontend. The data includes the caller's IP, URL requested, response latency, return code, bytes in and out. Access log is collected every 300 seconds. This log contains one record per instance of an application gateway.
* **ApplicationGatewayPerformanceLog** - The performance log captures performance information on per instance basis including total request served, throughput in bytes, total requests served, failed request count, healthy and unhealthy back-end instance count.
* **ApplicationGatewayFirewallLog** - The firewall log contains requests that are logged through either detection or prevention mode of an application gateway that is configured with web application firewall.

### How do I know if my backend pool members are healthy?

You can use the PowerShell cmdlet `Get-AzApplicationGatewayBackendHealth` or verify health through the portal by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

### What is the retention policy on the diagnostics logs?

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Azure Monitor logs. See [Application Gateway Diagnostics](application-gateway-diagnostics.md) for more details.

### How do I get audit logs for Application Gateway?

Audit logs are available for Application Gateway. In the portal, click **Activity Log** on the menu blade of an application gateway to access the audit log. 

### Can I set alerts with Application Gateway?

Yes, Application Gateway does support alerts. Alerts are configured on metrics. See [Application Gateway Metrics](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics#metrics) to learn more about Application Gateway metrics. To learn more about alerts, see [Receive alert notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md).

### How do I analyze traffic statistics for Application Gateway?

You can view and analyze Access logs via several mechanisms such as Azure Monitor logs, Excel, Power BI etc.

We have also published a Resource Manager template that installs and runs the popular [GoAccess](https://goaccess.io/) log analyzer for Application Gateway Access Logs. GoAccess provides valuable HTTP traffic statistics such as Unique Visitors, Requested Files, Hosts, Operating Systems, Browsers, HTTP Status codes and more. For more details, please see the [Readme file in the Resource Manager template folder in GitHub](https://aka.ms/appgwgoaccessreadme).

### Backend health returns unknown status, what could be causing this status?

The most common reason is access to the backend is blocked by an NSG, custom DNS, or you have a UDR on the application gateway subnet. See [Backend health, diagnostics logging, and metrics for Application Gateway](application-gateway-diagnostics.md) to learn more.

## Next Steps

To learn more about Application Gateway see [What is Azure Application Gateway?](overview.md)
