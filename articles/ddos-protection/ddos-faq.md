---
title: Azure DDoS Protection Standard frequent asked questions
description: Learn how the Azure DDoS Protection Standard, when combined with application design best practices, provides defense against DDoS attacks.
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
Azure DDoS Protection Standard, combined with application design best practices, provides enhanced DDoS mitigation features to defend against DDoS attacks. It is automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. It has several advantages over the basic service, including logging, alerting, and telemetry. See [Azure DDoS Protection Standard overview](ddos-protection-overview.md). 

## What about protection at the service layer (layer 7)?
Customers can use Azure DDoS Protection service in combination with [Application Gateway WAF SKU](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview) to for protection both at the network layer (Layer 3 and 4, offered by Azure DDoS Protection Service) and at the application layer (Layer 7, offered by Application Gateway WAF SKU).

## Are services unsafe in Azure without the service?
Services running on Azure are inherently protected by Azure DDoS Protection Basic that is in place to protect Azure’s infrastructure. However, the protection that safeguards the infrastructure has a much higher threshold than most applications have the capacity to handle, and does not provide telemetry or alerting, so while a traffic volume may be perceived as harmless by the platform, it can be devastating to the application receiving it. 

By onboarding to the Azure DDoS Protection Standard Service, the application gets dedicated monitoring to detect attacks and application specific thresholds. A service will be protected with a profile that is tuned to its expected traffic volume, providing a much tighter defense against DDoS attacks.

## What are the supported protected resource types?
Public IPs in ARM based VNETs are currently the only type of protected resource. PaaS services (multitenant) are not supported at presented. See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md).

## Are Classic/RDFE protected resources supported?
Only ARM based protected resources are supported in preview. VMs in Classic/RDFE deployments are not supported. Support is not currently planned for Classic/RDFE resources. See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md).

## Can I protect my on-premise resources using DDoS Protection?
You need to have the public endpoints of your service associated to a VNet in Azure to be enabled for DDoS protection. Example designs include:
- Web sites (IaaS) in Azure and backend databases in on-prem datacenter. 
- Application Gateway in Azure (DDoS protection enabled on App Gateway/WAF) and websites in on-prem datacenters.

See [Azure DDoS Protection Standard reference architectures](ddos-protection-reference-architectures.md).

## Can I register a domain outside of Azure and associate that to a protected resource like VM or ELB?
For the Public IP scenarios, DDoS Protection service will support any application regardless of where the associated domain is registered or hosted as long as the associated Public IP is hosted on Azure. 

## Can I manually configure the DDoS policy applied to the VNets/Public IPs?
No, policy customization is not available at this moment.

## Can I allowlist/bloclist specific IP addresses?
No, manual configuration is not available at this moment.

## How can I test DDoS Protection?
See [testing through simulations](test-through-simulations.md).

## How long does it take for the metrics to load on portal?
The metrics should be visible on portal within 5 minutes. If your resource is under attack, other metrics will start showing up on portal within 5-7 minutes. 
	



