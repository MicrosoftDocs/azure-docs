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

**Q. What protocols does Application Gateway support?**

Application Gateway supports HTTP, HTTPS and websocket.

**Q. What resources are supported today as part of backend pool? [Amit] Lets mention NIC, VMSS, public IP, internal IP, FQDN. Lets mention support for websites is not available today. Also mention that we can work across clusters, DC or even outside Azure. We are not tied to Availability Sets either.**

Backend pools can be comprised of NICs, VMSS, public IPs, internal IPs and Fully qualified domain names (FQDN). Support for azure websites is not available today. members of backend pools be across clusters, data center or even outside of azure.

**Q. What regions is the service available in? [Amit] mention mooncake since aws doesn’t have it there**

Application Gateway is available in all regions of public Azure. It is also available in [Azure China](https://www.azure.cn/)

**Q. Is this a dedicated deployment for my subscription or is it shared across customers?**

**Q. Is HTTP->HTTPS redirection supported?.**

This is currently not supported.

**Q. Where do I find Application Gateway’s IP and DNS?**

**Q. Does the IP or DNS change over the lifetime of the Application Gateway? [Amit] mention vip may change on stop and start and DNS never changes. Also that we recommend using CNAMEs**

**Q. Does Application Gateway support static IP? [Amit] No – but lets mention static internal IP is supported.**

No, Application Gateway does not support static public IP addresses, but it does support static internal IPs.

**Q. Does Application Gateway support multiple public IPs on the gateway?**

Only one public IP address is supported on an application gateway.

## Configuration

**Q. Is Application Gateway always deployed in a VNet?**

Yes, Application Gateway is always deployed in a virtual network subnet.

**Q. Can Application Gateway talk to instances outside VNet?**

Application Gateway can talk to instances outside of the VNET that it is in, this requires [VNET Peering](../virtual-network/virtual-network-peering-overview.md) or [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

**Q. Can I deploy anything else in Application Gateway subnet? [Amit] no but mention we can deploy other app gws in the same subnet**

**Q. Are NSG supported on Application Gateway subnet?**

**Q. What port are required for Application Gateway to function correctly?**

**Q. What are the limits on Application Gateway? Can I increase these limits?**

**Q. Can I use Application Gateway for both external and internal traffic simultaneously?**

**Q. Is VNet peering supported?**

**Q. Can I talk to on-premises servers if they are connected by ExpressRoute or VPN tunnels?**

**Q. Can I have one backend pool serving many applications on different ports? [Amit] Yes – mention they would need multiple http settings to probe on different ports. Micro service architecture is supported.**

**Q. Do custom probes support wildcards/regex on response data?**

**Q. What does Host field for custom probes signify?**


## Performance

**Q. How does Application Gateway support High Availability and scalability?**

**Q. How many requests per second can Application Gateway support?**

**Q. How to achieve DR scenario across data centers with Application Gateway?**

**Q. Is auto scaling supported? [Amit] mention no but also point to Metrics logs which can give them alerts once a threshold is breached.**

**Q. Does manual scale up/down cause downtime? [Amit] mention no downtime but also that instances are distributed across UD/FD.**

**Q. Can I change instance size from medium to large without disruption?**

## SSL Configuration

**Q. What certificates are supported on Application gateway?**

**Q. Does Application Gateway also support re-encryption of traffic to the backend?**

**Q. Can I configure SLL policy to control SSL Protocol versions?**

**Q. Can I configure SSL policy to control cipher suites?**

**Q. How many SSL certificates are supported?**

**Q. How many authentication certificates for backend re-encryption are supported?**

**Q. Does Application Gateway integrate with Azure Key Vault natively?**

## Web Application Firewall (WAF) Configuration

**Q. Does WAF SKU offer all the features available with Standard SKU?**

**Q. What is the CRS version Application Gateway supports?**

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


