---
title: Frequently asked questions for Azure Application Gateway | Microsoft Docs
description: This page provides answers to frequently asked questions about Azure Application Gateway
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: d54ee7ec-4d6b-4db7-8a17-6513fda7e392
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/28/2017
ms.author: gwallace

---

# Frequently asked questions for Application Gateway

## General

**Q. What is Application Gateway?**

Azure Application Gateway is an Application Delivery Controller (ADC) as a service, offering various layer 7 load balancing capabilities for your applications. It offers highly available and scalable service, which is fully managed by Azure.

**Q. What features does Application Gateway support?**

Application Gateway supports SSL offloading and end to end SSL, Web Application Firewall, cookie-based session affinity, url path-based routing, multi site hosting, and others. For a full list of supported features visit [Introduction to Application Gateway](application-gateway-introduction.md)

**Q. What is the difference between Application Gateway and Azure Load Balancer?**

Application Gateway is a layer 7 load balancer. This means that Application Gateway deals with web traffic only (HTTP/HTTPS/WebSocket). It supports application load balancing capabilities such as SSL termination, cookie-based session affinity, and round robin for load balancing traffic. Load Balancer, load balances traffic at layer 4 (TCP/UDP).

**Q. What protocols does Application Gateway support?**

Application Gateway supports HTTP, HTTPS, and WebSocket.

**Q. What resources are supported today as part of backend pool?**

Backend pools can be composed of NICs, virtual machine scale sets, public IPs, internal IPs, and fully qualified domain names (FQDN). Support for Azure Web Apps is not available today. Application Gateway backend pool members are not tied to an availability set. Members of backend pools can be across clusters, data centers, or outside of Azure as long as they have IP connectivity.

**Q. What regions is the service available in?**

Application Gateway is available in all regions of public Azure. It is also available in [Azure China](https://www.azure.cn/) and [Azure Government](https://azure.microsoft.com/en-us/overview/clouds/government/)

**Q. Is this a dedicated deployment for my subscription or is it shared across customers?**

Application Gateway is a dedicated deployment in your virtual network.

**Q. Is HTTP->HTTPS redirection supported?**

This is currently not supported.

**Q. Where do I find Application Gateway’s IP and DNS?**

When using a public IP address as an endpoint, this information can be found on the public IP address resource or on the Overview page for the Application Gateway in the portal. For internal IP addresses, this can be found on the Overview page.

**Q. Does the IP or DNS change over the lifetime of the Application Gateway?**

The VIP can change if the gateway is stopped and started by the customer. The DNS associated with Application Gateway does not change over the lifecycle of the gateway. For this reason, it is recommended to use a CNAME alias and point it to the DNS address of the Application Gateway.

**Q. Does Application Gateway support static IP?**

No, Application Gateway does not support static public IP addresses, but it does support static internal IPs.

**Q. Does Application Gateway support multiple public IPs on the gateway?**

Only one public IP address is supported on an Application Gateway.

**Q. Does Application Gateway support x-forwarded-for headers?**

Yes, Application Gateway inserts x-forwarded-for, x-forwarded-proto, and x-forwarded-port headers into the request forwarded to the backend. The format for x-forwarded-for header is a comma-separated list of IP:Port. The valid values for x-forwarded-proto are http or https. X-forwarded-port specifies the port at which the request reached at the Application Gateway.

## Configuration

**Q. Is Application Gateway always deployed in a virtual network?**

Yes, Application Gateway is always deployed in a virtual network subnet. This subnet can only contain Application Gateways.

**Q. Can Application Gateway talk to instances outside its virtual network?**

Application Gateway can talk to instances outside of the virtual network that it is in as long as there is IP connectivity. If you plan to use internal IPs as backend pool members, then it requires [VNET Peering](../virtual-network/virtual-network-peering-overview.md) or [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

**Q. Can I deploy anything else in the Application Gateway subnet?**

No, but you can deploy other application gateways in the subnet

**Q. Are Network Security Groups supported on the Application Gateway subnet?**

Network Security Groups are supported on the Application Gateway subnet with the following restrictions:

* Exceptions must be put in for ports 65503-65534 for backend health to work correctly.

* Outbound internet connectivity should not be blocked.

* Traffic from the AzureLoadBalancer tag must be allowed.

**Q. What are the limits on Application Gateway? Can I increase these limits?**

Visit [Application Gateway Limits](../azure-subscription-service-limits.md#application-gateway-limits) to view the limits.

**Q. Can I use Application Gateway for both external and internal traffic simultaneously?**

Yes, Application Gateway supports having one internal IP and one external IP per Application Gateway.

**Q. Is VNet peering supported?**

Yes, VNet peering is supported and is beneficial for load balancing traffic in other virtual networks.

**Q. Can I talk to on-premises servers if they are connected by ExpressRoute or VPN tunnels?**

Yes, as long as traffic is allowed.

**Q. Can I have one backend pool serving many applications on different ports?**

Micro service architecture is supported. You would need multiple http settings configured to probe on different ports.

**Q. Do custom probes support wildcards/regex on response data?**

Custom probes do not support wildcard or regex on response data.

**Q. What does the Host field for custom probes signify?**

Host field specifies the name to send the probe to. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This value is different from VM host name and is in format \<protocol\>://\<host\>:\<port\>\<path\>.

**Q. Can I whitelist Application Gateway access to a few source IPs?**

This can be done using NSGs on Application Gateway subnet. The following restrictions should be put on the subnet in the listed order of priority:

* Allow incoming traffic from source IP/IP range.

* Allow incoming requests from all sources to ports 65503-65534 for [backend health communication](application-gateway-diagnostics.md).

* Allow incoming Azure Load Balancer probes (AzureLoadBalancer tag) and inbound virtual network traffic (VirtualNetwork tag) on the [NSG](../virtual-network/virtual-networks-nsg.md).

* Block all other incoming traffic with a Deny all rule.

* Allow outbound traffic to the internet for all destinations.

## Performance

**Q. How does Application Gateway support high availability and scalability?**

Application Gateway supports high availability scenarios if you have more than 2 instances deployed. Azure distributes these instances across update and fault domains to ensure that all instances do not fail at the same time. Application Gateway supports scalability by adding multiple instances of the same gateway to share the load.

**Q. How do I achieve DR scenario across data centers with Application Gateway?**

Customers can use Traffic Manager to distribute traffic across multiple Application Gateways in different datacenters.

**Q. Is auto scaling supported?**

No, but Application Gateway has a throughput metric that can be used to alert you if a threshold is reached. Manually adding instances or changing size does not restart the gateway and does not impact existing traffic.

**Q. Does manual scale up/down cause downtime?**

There is no downtime, instances are distributed across upgrade domains and fault domains.

**Q. Can I change instance size from medium to large without disruption?**

Yes, Azure distributes instances across update and fault domains to ensure that all instances do not fail at the same time. Application Gateway supports scalability by adding multiple instances of the same gateway to share the load.

## SSL Configuration

**Q. What certificates are supported on Application Gateway?**

Self signed certs, CA certs, and wild-card certs are supported. EV certs are not supported.

**Q. What are the current cipher suites supported by Application Gateway?**

The following are the current cipher suites supported in order of priority.

TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384_P384

TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256_P256

TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P256

TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256

TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P256

TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256

TLS_RSA_WITH_AES_256_GCM_SHA384

TLS_RSA_WITH_AES_128_GCM_SHA256

TLS_RSA_WITH_AES_256_CBC_SHA256

TLS_RSA_WITH_AES_128_CBC_SHA256

TLS_RSA_WITH_AES_256_CBC_SHA

TLS_RSA_WITH_AES_128_CBC_SHA

TLS_RSA_WITH_3DES_EDE_CBC_SHA

**Q. Does Application Gateway also support re-encryption of traffic to the backend?**

Yes, Applicated Gateway supports SSL offload, and end to end SSL, which re-encrypts the traffic to the backend.

**Q. Can I configure SSL policy to control SSL Protocol versions?**

Yes, you can configure Application Gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are already disabled by default and are not configurable.

**Q. Can I configure SSL policy to control cipher suites?**

No, not currently.

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

Yes, WAF rules are customizable, for more information on how to customize them visit [Customize WAF rule groups and rules](application-gateway-customize-waf-rules-portal.md)

**Q. What rules are currently available?**

WAF currently supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229) and [3.0](application-gateway-crs-rulegroups-rules.md#owasp30), which provide baseline security against most of the top 10 vulnerabilities identified by the Open Web Application Security Project (OWASP) found here [OWASP top 10 Vulnerabilities](https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)

* SQL injection protection

* Cross site scripting protection

* Common Web Attacks Protection such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion attack

* Protection against HTTP protocol violations

* Protection against HTTP protocol anomalies such as missing host user-agent and accept headers

* Prevention against bots, crawlers, and scanners

* Detection of common application misconfigurations (i.e. Apache, IIS, etc.)

**Q. Does WAF also support DDoS prevention?**

No, WAF does not provide DDoS prevention.

## Diagnostics and Logging

**Q. What types of logs are available with Application Gateway?**

There are three logs available for Application Gateway. For more information on these logs and other diagnostic capabilities, visit [Backend health, diagnostics logging and metrics for Application Gateway](application-gateway-diagnostics.md).

- **ApplicationGatewayAccessLog** - This log contains each request submitted to the Application Gateway frontend. The data includes the caller's IP, URL requested, response latency, return code, bytes in and out. Access log is collected every 300 seconds. This log contains one record per instance of Application Gateway.
- **ApplicationGatewayPerformanceLog** - This log captures performance information on per instance basis including total request served, throughput in bytes, total requests served, failed request count, healthy and unhealthy back-end instance count.
- **ApplicationGatewayFirewallLog** - This log contains requests that are logged through either detection or prevention mode of an application gateway that is configured with web application firewall.

**Q. How do I know if my backend pool members are healthy?**

You can use the PowerShell cmdlet `Get-AzureRmApplicationGatewayBackendHealth` or verify health through the portal by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

**Q. What is the retention policy on the diagnostics logs?**

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Log Analytics. Visit [Application Gateway Diagnostics](application-gateway-diagnostics.md) for more details.

**Q. How do I get audit logs for Application Gateway?**

Audit logs are available for Application Gateway. In the portal, click **Activity Log** in the menu blade of an Application Gateway to access the audit log. 

**Q. Can I set alerts with Application Gateway?**

Yes, Application Gateway does support alerts, alerts are configured off metrics.  Application Gateway currently has a metric of "throughput", which can be configured to alert. To learn more about alerts, visit [Receive alert notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md).

**Q. Backend health returns unknown status, what could be causing this?**

The most common reason is access to the backend is being blocked by an NSG or custom DNS. Visit [Backend health, diagnostics logging, and metrics for Application Gateway](application-gateway-diagnostics.md) to learn more.

## Next Steps

To learn more about Application Gateway visit [Introduction to Application Gateway](application-gateway-introduction.md).
