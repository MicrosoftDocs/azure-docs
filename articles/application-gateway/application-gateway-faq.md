---
title: Frequently asked questions for Application Gateway | Microsoft Docs
description: This page provides answers to frequently asked questions 
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
ms.date: 01/17/2017
ms.author: gwallace

---

# Frequently asked questions for Application Gateway

## General

**Q. What is Application Gateway?**

Microsoft Azure Application Gateway is an Application Delivery Controller (ADC) as a service, offering various layer 7 load balancing capabilities for your applications.

**Q. What features does Application Gateway support?**

Application Gateway supports, Web Application Firewall (WAF), SSL offloading and end to end SSL, cookie affinity, multi site hosting and others. For a full list of supported features visit [Introduction to Application Gateway](application-gateway-introduction.md)

**Q. What is the difference between Application Gateway and Azure Load Balancer?**

Application Gateway is a layer 7 load balancer. This means that Application Gateway deals with web traffic only (HTTP/HTTPS/Websocket). It supports cookie based affinity or round robin for load balancing traffic. It supports advanced application delivery control fetures such as web application firewall. Load Balancer, load balances traffic at layer 4 (TCP/UDP) layer.

**Q. What protocols does Application Gateway support?**

Application Gateway supports HTTP, HTTPS and websocket.

**Q. What resources are supported today as part of backend pool? [Amit] Lets mention NIC, VMSS, public IP, internal IP, FQDN. Lets mention support for websites is not available today. Also mention that we can work across clusters, DC or even outside Azure. We are not tied to Availability Sets either.**

Backend pools can be comprised of NICs, VMSS, public IPs, internal IPs and Fully qualified domain names (FQDN). Support for azure websites is not available today. members of backend pools be across clusters, data center or even outside of azure.

**Q. What regions is the service available in? [Amit] mention mooncake since aws doesn’t have it there**

Application Gateway is available in all regions of public Azure. It is also available in [Azure China](https://www.azure.cn/)

**Q. Is this a dedicated deployment for my subscription or is it shared across customers?**

Application Gateway is a dedicated deployment in your subscription.  

**Q. Is HTTP->HTTPS redirection supported?.**

This is currently not supported.

**Q. Where do I find Application Gateway’s IP and DNS?**

When using a public IP address as an endpoint this information can be found on the public ip address resource. For inertnal IP addresses this can be found on the configuration tab.

**Q. Does the IP or DNS change over the lifetime of the Application Gateway?

The VIP can change if the gateway is stopped.  The DNS address does not change.  For this reason it is recommended to use a CNAME alias and point it to the DNS address of the public IP.

**Q. Does Application Gateway support static IP? [Amit] No – but lets mention static internal IP is supported.**

No, Application Gateway does not support static public IP addresses, but it does support static internal IPs.

**Q. Does Application Gateway support multiple public IPs on the gateway?**

Only one public IP address is supported on an application gateway.

## Configuration

**Q. Is Application Gateway always deployed in a VNet?**

Yes, Application Gateway is always deployed in a virtual network subnet.

**Q. Can Application Gateway talk to instances outside VNet?**

Application Gateway can talk to instances outside of the VNET that it is in, this requires [VNET Peering](../virtual-network/virtual-network-peering-overview.md) or [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

**Q. Can I deploy anything else in Application Gateway subnet?**

No, but you can deploy other appliction gateways in the subnet

**Q. Are NSG supported on Application Gateway subnet?**

Network Security Groups are supported on the Appliction Gateway subnet, but exceptions must be put in for ports 65503-65534 for backend health to work correctly.

**Q. What port are required for Application Gateway to function correctly?**

Ports 65503-65534 must be enabled for backend health.

**Q. What are the limits on Application Gateway? Can I increase these limits?**

**Q. Can I use Application Gateway for both external and internal traffic simultaneously?**

Yes, Application Gateway supports having one internal IP and one external IP per appliction gateway.

**Q. Is VNet peering supported?**

Yes VNET peering is supported and is beneficial for load balancing traffic in other virtual networks.

**Q. Can I talk to on-premises servers if they are connected by ExpressRoute or VPN tunnels?**

Yes, as long as traffic is allowed.

**Q. Can I have one backend pool serving many applications on different ports?**

Micro service architecture is supported. You would need multiple http settings configured to probe on different ports.

**Q. Do custom probes support wildcards/regex on response data?**

Custom probes do not support wildcard or regex on response data.

**Q. What does Host field for custom probes signify?**


## Performance

**Q. How does Application Gateway support High Availability and scalability?**

Application gateway supports having multiple instances (1-10) and supports multiple sizes of instances.

**Q. How many requests per second can Application Gateway support?**

**Q. How to achieve DR scenario across data centers with Application Gateway?**

**Q. Is auto scaling supported?**

No, but Application Gateway has a througput metric that can be used to alert you if a treshold is reched.

**Q. Does manual scale up/down cause downtime?**

There is no downtime, instances are distributed across upgrade domains and fault domains.

**Q. Can I change instance size from medium to large without disruption?**

## SSL Configuration

**Q. What certificates are supported on Application gateway?**

PFX, CER..

**Q. Does Application Gateway also support re-encryption of traffic to the backend?**

Yes, Applicated Gateway supports SSL offload, and end to end SSL which re-encrypts the traffic to the backend.

**Q. Can I configure SLL policy to control SSL Protocol versions?**

Yes, you can configure Application Gateway to deny TLS1.0, TLS1.1, and TLS1.2. SSL 2.0 and 3.0 are already disabled by default.

**Q. Can I configure SSL policy to control cipher suites?**

No, not at this time.

**Q. How many SSL certificates are supported?**

Up to 20 SSL certificates are supported.

**Q. How many authentication certificates for backend re-encryption are supported?**

Up to 5 authentication certificates are supported.

**Q. Does Application Gateway integrate with Azure Key Vault natively?**

No, it is not integrated with Azure Key Vault.

## Web Application Firewall (WAF) Configuration

**Q. Does WAF SKU offer all the features available with Standard SKU?**

Yes, WAF supports all the features in the Standard SKU.

**Q. What is the CRS version Application Gateway supports?**

Application Gateway supports CRS 3.0.

**Q. How do I monitor WAF?**

WAF is monitored through diagnostic logging, more information on diagnostic logging can be found at [Diagnostics Logging and Metrics for Application Gateway](application-gateway-diagnostics.md)

**Q. Does detection mode block traffic?**

No, detection mode only logs traffic.

**Q. How do I customize WAF rules?**

Currently WAF rules are not customizable.

**Q. What rules are currently available?**

WAF currently supports the OWASP top 10 vulnerabilities found here [OWASP top 10 Vulnerabilities](https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)

* Injection

* Broken Authentication and Session Management

* Cross-Site Scripting (XSS)

* Insecure Direct Object References

* Security Misconfiguration

* Sensitive Data Exposure

* Missing Function Level Access Controller

* Cross-Site Request Forgery (CSRF)

* Using Known Vulnerable Components

* Unvalidated Redirects and Forwards

**Q. Does WAF also support DDos prevention?**

## Diagnostics and Logging

**Q. What types of logs are available with Application Gateway? [Amit] mention 3 types of logs. Also mention that we log each request while describing access logs.**

**Q. What is the retention policy on the diagnostics logs?**

**Q. How to get audit logs for Application Gateway?**

**Q. Can I set alerts with Application Gateway?**

**Q. Backend health returns unknown status, what could be causing this?**


