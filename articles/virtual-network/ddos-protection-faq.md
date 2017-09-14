---
title: Frequently asked question about DDoS Protection service | Microsoft Docs
description: Get answers to frequently asked question about DDoS Protection service.
services: virtual-network
documentationcenter: na
author: kumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: kumud

---
# Frequently asked question about DDoS Protection service 

This article addresses some common questions about DDoS Protection service enabled in Azure on a virtual network.

## DDoS Protection Service basics

### What is a Distributed Denial of Service (DDoS) attack? 

Distributed denial of service, or DDoS, is a type of attack where an attacker sends more requests to an application than the application is capable of handling. The resulting effect is resources being depleted, affecting the application’s availability and ability to service its customers. Over the past few years, the industry has seen a sharp increase in attacks, with attacks becoming more sophisticated and larger in magnitude. DDoS attack can be targeted at any endpoint that is publicly reachable through the Internet.

### What is Azure DDoS Protection service?

Azure DDoS Protection Service is a new Azure Networking service, aimed at protecting publicly accessible endpoints from Distributed Denial of Service (DDoS) attacks. DDoS attacks are one of the largest availability threats that face cloud services today. The intent of a DDoS attack is to exhaust the application's resources rendering the application unavailable to its customers. Azure DDoS Protection Service provides always-on network flow monitoring of the protected endpoints, and when a DDoS attack is detected, automatically applies mitigating to ensure only legitimate traffic reaches the service. Azure DDoS protection provides customers with the peace of mind that their services are protected from the impacts of DDoS attacks. 

### What about protection at the service layer (layer 7)?

Customers can use Azure DDoS Protection service in combination with [Application Gateway](https://azure.microsoft.com/services/application-gateway/) WAF SKU to achieve complete protection both at the network layer (Layer 3 and 4, offered by Azure DDoS Protection Service) and at the application layer (Layer 7, offered by Application Gateway WAF SKU).

###  Are services unsafe in Azure without the service? 

Services running on Azure are inherently protected by the defense that is in place to protect Azure’s infrastructure. However, the protection that safeguards the infrastructure has a much higher threshold than most applications have the capacity to handle, and does not provide telemetry or alerting, so while a traffic volume may be perceived as harmless by the platform, it can be devastating to the application receiving it. By subscribing to the Azure DDoS Protection Service, the application gets dedicated monitoring to detect attacks and application-specific thresholds. A service is protected with a profile that is tuned to its expected traffic volume, providing a much tighter defense against DDoS attacks. 

### How do I get started?

Visit the DDoS Protection documentation to get started. This content provides overview and configuration information for all the DDoS features. You need to [register for the service](http://aka.ms/ddosprotection) during the limited preview to get the DDoS Protection service enabled for your subscription. You are contacted by the Azure DDoS team upon registration to guide you through the enablement process.

### Are there any pre-requisites to register for the service?

No, there are no pre-requisites to register for DDoS Protection service. However, DDoS Protection does not work with Classic VMs as they are not typically deployed in a virtual network.

### Where is the service available today?  

The service is currently available US East, US West, US Central, and UK South. Global expansion takes place early in the preview period.

### What is the SLA offered by Azure DDoS Protection service?

Details of the DDoS Protection service SLA will be announced at GA. During preview, there is no SLA offered for this service.

## Configuration

### What types of attacks does DDoS Protection service help stop?

DDoS Protection service protects your resources against the most common and frequently occurring DDoS attacks including network-based volumetric attacks and protocol attacks. When combined with [Application Gateway WAF](https://azure.microsoft.com/services/application-gateway/) SKU, you get protection against application layer attacks as well.

### What are the supported protected resource types during the preview?

Public IPs are currently the only type of protected resource. Known Public IP attachments are VMs, NVAs, application gateways, Service Fabric. Other Public IP attachments may be supported in the future.

### Are classic protected resources supported? 

Only Azure Resource Manager based protected resources are supported in preview. VMs in classic deployments are not supported. Support is not currently planned for classic resources.

### Can I register a domain outside of Azure and associate that to a protected resource like VM or external load balancer?

For the Public IP scenarios, DDoS Protection service supports any application regardless of where the associated domain is registered or hosted as long as the associated Public IP is hosted on Azure. 

### Can I protect my PaaS resources using DDoS Protection?

Public IPs attached to multi-tenant, single VIP PaaS services are not supported during preview. Examples of unsupported resources include Storage VIPs, Event Hub VIPs, and Cloud Services applications. 

### How can I test DDoS Protection?

We do not advise customers to simulate their own DDoS attacks during preview. Instead, customers can use the support channel to request a DDoS attack simulation executed by Azure Networking. An Engineer contacts you to arrange the details of the DDoS attack (ports, protocols, target IPs) and arrange a time to schedule the test.

### What else can I do to protect against DDoS attacks?

Azure offers a number of inherent platform capabilities to protect against the effects or likelihood that a DDoS attack impacts your site. You can use the following references:

- [Azure Network Security blog post](https://azure.microsoft.com/blog/azure-network-security/)
- [Network Security Best Practices](https://docs.microsoft.com/azure/best-practices-network-security)

## Attack mitigation and response

### Do I get notified when a DDoS attack happens? 

Yes, you can configure attack notification on DDoS Protection service metrics via Azure Monitor. For more information, see the Azure DDoS Protection telemetry guide.

### How quickly do I get an attack notification?

Azure DDoS Protection service notifies you of an attack within a few minutes of attack detection when notifications are enabled via Azure Monitor metrics.

### How long is attack telemetry stored? 

Metric data in Azure Monitor for DDoS Protection is currently retained for 30 days.

### Can I retain my own history of past attacks?

Yes, by configuring logging on DDoS Protection telemetry, you can write the logs to available options for future analysis. For more information, see the Azure DDoS Protection telemetry guide.

### How can I contact Microsoft during an active attack?

You can create a support incident via Azure Support Center in the Azure portal. There is drop down options for DDoS Protection both under the Networking and Security topics.

## Billing

### What is the cost of signing up for the service? 

DDoS Protection is available in preview. During this period, there is no charge associated with usage of this service.   

DDoS Protection service will have a fixed monthly price plus data processing fee.  This price includes protection for 100 resources and a discounted rate for Application Gateway WAF. The fixed price applies for any protected resource type across all customer's subscriptions that have a virtual network where DDoS Protection is enabled.   
DDoS Protection is enabled at the virtual network level.  All protected resource types within the virtual network are automatically protected when DDoS Protection is enabled on the virtual network. The WAF discount applies to Application Gateway WAF instances deployed into protected virtual networks. 
  
Customers are contacted with updated pricing information 30 days prior to the start of General Availability (GA).   
See the Azure DDoS Protection service pricing page for up-to-date pricing information. 

## Next steps

- Learn more about how [DDoS Protection](ddos-protection-how-works.md) works.
- Learn more about [DDoS Protection telemetry](ddos-protection-telemetry.md).