---
title: Azure DDoS Protection Standard frequent asked questions
description: Frequently asked questions about the Azure DDoS Protection Standard, which helps provide defense against DDoS attacks.
services: virtual-network
documentationcenter: na
author: yitoh
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2020
ms.author: yitoh

---
# Azure DDoS Protection Standard frequent asked questions

This article answers common questions about Azure DDoS Protection Standard. 

## What is a Distributed Denial of Service (DDoS) attack?
Distributed denial of service, or DDoS, is a type of attack where an attacker sends more requests to an application than the application is capable of handling. The resulting effect is resources being depleted, affecting the application’s availability and ability to service its customers. Over the past few years, the industry has seen a sharp increase in attacks, with attacks becoming more sophisticated and larger in magnitude. DDoS attacks can be targeted at any endpoint that is publicly reachable through the Internet.

## What is Azure DDoS Protection Standard service?
Azure DDoS Protection Standard, combined with application design best practices, provides enhanced DDoS mitigation features to defend against DDoS attacks. It is automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. It has several advantages over the basic service, including logging, alerting, and telemetry. See [Azure DDoS Protection Standard overview](ddos-protection-overview.md) for more details. 

## How does pricing work?
DDoS protection plans have a fixed monthly charge of $2,944 per month which covers up to 100 public IP addresses. Protection for additional resources will cost an additional $30 per resource per month. 

Under a tenant, a single DDoS protection plan can be used across multiple subscriptions, so there is no need to create more than one DDoS protection plan.

See [Azure DDoS Protection Standard pricing](https://azure.microsoft.com/pricing/details/ddos-protection/) for more details.

## Is the service zone resilient?
Yes. Azure DDoS Protection is zone-resilient by default.

## How do I configure the service to be zone-resilient?
No customer configuration is necessary to enable zone-resiliency. Zone-resiliency for Azure DDoS Protection resources is available by default and managed by the service itself.

## What about protection at the service layer (layer 7)?
Customers can use Azure DDoS Protection service in combination with a Web Application Firewall (WAF) to for protection both at the network layer (Layer 3 and 4, offered by Azure DDoS Protection Standard) and at the application layer (Layer 7, offered by a WAF). WAF offerings include Azure [Application Gateway WAF SKU](../web-application-firewall/ag/ag-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) as well as third-party web application firewall offerings available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?page=1&search=web%20application%20firewall).

## Are services unsafe in Azure without the service?
Services running on Azure are inherently protected by Azure DDoS Protection Basic that is in place to protect Azure’s infrastructure. However, the protection that safeguards the infrastructure has a much higher threshold than most applications have the capacity to handle, and does not provide telemetry or alerting, so while a traffic volume may be perceived as harmless by the platform, it can be devastating to the application receiving it. 

By onboarding to the Azure DDoS Protection Standard Service, the application gets dedicated monitoring to detect attacks and application specific thresholds. A service will be protected with a profile that is tuned to its expected traffic volume, providing a much tighter defense against DDoS attacks.

## What are the supported protected resource types?
Public IPs in ARM based VNETs are currently the only type of protected resource. PaaS services (multitenant) are not supported at presented. See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md) for more details.

## Are Classic/RDFE protected resources supported?
Only ARM based protected resources are supported in preview. VMs in Classic/RDFE deployments are not supported. Support is not currently planned for Classic/RDFE resources. See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md) for more details.

## Can I protect my PaaS resources using DDoS Protection?
Public IPs attached to multi-tenant, single VIP PaaS services are not supported presently. Examples of unsupported resources include Storage VIPs, Event Hub VIPs and App/Cloud Services applications. See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md) for more details.

## Can I protect my on-premise resources using DDoS Protection?
You need to have the public endpoints of your service associated to a VNet in Azure to be enabled for DDoS protection. Example designs include:
- Web sites (IaaS) in Azure and backend databases in on-prem datacenter. 
- Application Gateway in Azure (DDoS protection enabled on App Gateway/WAF) and websites in on-prem datacenters.

See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md) for more details.

## Can I register a domain outside of Azure and associate that to a protected resource like VM or ELB?
For the Public IP scenarios, DDoS Protection service will support any application regardless of where the associated domain is registered or hosted as long as the associated Public IP is hosted on Azure. 

## Can I manually configure the DDoS policy applied to the VNets/Public IPs?
No, unfortunately policy customization is not available at this moment.

## Can I allowlist/blocklist specific IP addresses?
No, unfortunately manual configuration is not available at this moment.

## How can I test DDoS Protection?
See [testing through simulations](test-through-simulations.md).

## How long does it take for the metrics to load on portal?
The metrics should be visible on portal within 5 minutes. If your resource is under attack, other metrics will start showing up on portal within 5-7 minutes. 

## Does the service store customer data?
No, Azure DDoS protection does not store customer data.
	
