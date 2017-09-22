---
title: Azure DDoS Protection Standard Overview | Microsoft Docs
description: Learn about the Azure DDoS Protection service.
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
ms.date: 09/22/2017
ms.author: kumud

---
# Azure DDoS Protection Standard overview

>[!IMPORTANT]
>Azure DDoS Protection Standard is currently in preview. A limited number of Azure resources support DDoS Protection Standard, and in a select number of regions. You need to [register for the service](http://aka.ms/ddosprotection) during the limited preview to get DDoS Protection Standard enabled for your subscription. You are contacted by the Azure DDoS team upon registration to guide you through the enablement process. DDoS Protection Standard is available in US East, US West, and US Central regions. During preview, you are not charged for using the service.

Azure DDoS Protection combined with application design best practices together provide defense against these attacks. These two service tiers are provided: 

- **Azure DDoS Protection Basic** - is already automatically enabled as part of the Azure platform at no additional charge. Always on traffic monitoring and real time mitigation of common network level attacks provides the same defenses utilized by Microsoft’s online services.  The entire scale of Azure’s global network can be used to distribute and mitigate attack traffic across regions. 
- **Azure DDoS Protection Standard** - provides additional mitigation capabilities tuned specifically to Virtual Network resources. It is simple to enable and requires no application changes. Protection policies are tuned through dedicated traffic monitoring and machine learning algorithms and applied to public IPs associated with Virtual Network resources such as Load Balancer, Application Gateway, and Service Fabric instances.  Real time telemetry is available through Azure Monitor views during an attack and for history. Application layer protections can be added through Application Gateway Web Application Firewall. 

![Azure DDoS Protection Standard](./media/ddos-protection-overview/ddos-protection-overview-fig2.png)

Distributed Denial of Service (DDoS), is a type of attack where an attacker sends more requests to an application than the application is capable of handling. The resulting effect is depletion of resources, affecting the application’s availability and ability to service its customers. 

Over the past few years, attacks have increased sharply, with attacks becoming more sophisticated and larger in magnitude. DDoS attacks are one of the largest availability threats that face cloud services today. The intent of a DDoS attack is to exhaust the application's resources rendering the application unavailable to its customers. DDoS attacks can be targeted at any endpoint that is publicly reachable through the Internet.

DDoS Protection Standard provides always-on network flow monitoring of the protected endpoints, and when a DDoS attack is detected, automatically applies mitigation to ensure only legitimate traffic reaches the service. DDoS Protection Standard provides customers with the peace of mind that their services are protected from the impacts of DDoS attacks.

DDoS Protection Standard on the virtual network has two main benefits:

- It simplifies the provisioning of protected resources in a single bulk operation and automatically protects additional resource types as they are supported.
- Protecting all the public IP resources on a virtual network ensures that an attack against one public IP in a virtual network cannot impact another public IP in a virtual network since all public IPs are protected.

For development and test scenarios, you are welcome to try DDoS Protection Standard and use these resources to provide feedback on your experiences:
- [Azure DDoS Protection on the Microsoft Azure Forum](https://feedback.azure.com/forums/905032-azure-ddos-protection). 
- [Azure DDoS Protection on the MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azureddosprotection)
- [Azure DDos Protection on Stack Overflow](https://stackoverflow.com/tags/azure-ddos/info)

For support issues, you can [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md).

## Types of DDoS attacks

Services running on Azure are inherently protected by the defense that is in place to protect Azure’s infrastructure. However, the protection that safeguards the infrastructure has a much higher threshold than most applications have the capacity to handle, and does not provide telemetry or alerting, so while a traffic volume may be perceived as harmless by the platform, it can be devastating to the application receiving it. 

By enabling DDoS Protection Standard, the application gets dedicated monitoring to detect attacks and application-specific thresholds. A service is protected with a profile that is tuned to its expected traffic volume, providing a much tighter defense against DDoS attacks.

DDoS Protection Standard can mitigate these types of attacks:

- **Volumetric attacks** -  flood the network layer with substantial amount of seemingly legitimate traffic, and include, but are not limited to, ICMP floods, UDP floods, amplification flood and more. 
- **Protocol attacks** - also known as state exhaustion attacks target the connection state tables in firewalls, web application servers, and other infrastructure components. Includes but not limited to, SYN flood attacks, reflection attacks, and other protocol attacks. 
- **Application layer attacks** - can be mitigated by using DDoS Protection Standard in combination with [Application Gateway](https://azure.microsoft.com/services/application-gateway/) WAF SKU to achieve complete protection both at the network layer and application layer.

DDoS Protection Standard protects resources in a virtual network including Public IPs associated with VMs, internal load balancers, and application gateways. When coupled with the Application Gateway WAF SKU, DDoS Protection Standard can provide full L3 to L7 mitigation capability.

## How DDoS Protection Standard works

![DDoS functionality](./media/ddos-protection-overview/ddos-overview-fig1.png)

DDoS Protection Standard features include: 

- **Native platform integration:** DDoS Protection Standard is natively integrated into Azure and includes configuration through the Azure portal and PowerShell. DDoS Protection Standard understands your resources and resource configuration.
- **Always-on traffic monitoring:** Your application traffic patterns are monitored 24x7, looking for indicators of DDoS attacks. Mitigation is performed when protection policies are exceeded.
- **Turn-key protection:** Simplified configuration immediately protects all resources on a virtual network as soon as DDoS Protection Standard is enabled. No intervention or user definition is required - DDoS Protection Standard instantly and automatically mitigates the attack once it has been detected.
- **Adaptive tuning:** Intelligent traffic profiling learns your application’s traffic over time, and selects and updates the profile that is the most suitable for your service. The profile adjusts as traffic changes over time.
- **L3 to L7 Protection with an application gateway:** Application Gateway WAF features providing full stack DDoS protection.
- **Extensive mitigation scale:** Over 60 different attack types can be mitigated with global capacity to protect against the largest known DDoS attacks. 
- **Attack metrics:** Summarized metrics from each attack are accessible through Azure Monitor.
- **Attack alerting:** Alerts can be configured at the start and stop of an attack, and over the attack’s duration using built-in attack metrics. Alerts integrate into your operational software like OMS, Splunk, Azure Storage, Email, and Azure portal.
- **Cost guarantee:** Data-transfer and application scale-out service credits for documented DDoS attacks.

## DDoS Protection Standard mitigation

During mitigation, traffic towards the protected resource is redirected through one or more Azure regional DDoS SDNs that exist across the globe. As traffic passes through the DDoS SDN, several checks are performed. These checks generally perform the following function:

- Ensure packets conform to Internet specifications and are not malformed.
- Interact with the client to determine if it is potentially a spoofed packet (e.g: SYN Auth or SYN Cookie or by dropping a packet for the source to retransmit it).
- Rate-limit packets if no other enforcement method can be performed.

The DDoS SDN blocks attack traffic and forward remaining traffic to intended destination. Within a few minutes of attack detection, you are notified using Azure Monitor metrics. By configuring logging on DDoS Protection Standard telemetry, you can write the logs to available options for future analysis. Metric data in Azure Monitor for DDoS Protection Standard is currently retained for 30 days.

We do not advise customers to simulate their own DDoS attacks during preview. Instead, customers can use the support channel to request a DDoS attack simulation executed by Azure Networking. An Engineer will contact you to arrange the details of the DDoS attack (ports, protocols, target IPs) and arrange a time to schedule the test.

## Protected resources

A protected resource is a public IP attached to other resources. Public IPs are currently the only type of protected resource. Known public IP attachments are VMs, NVAs, application gateways, and Service Fabric. For the public IP scenarios, DDoS Protection supports any application regardless of where the associated domain is registered or hosted as long as the associated public IP is hosted on Azure.

Public IPs attached to multi-tenant, single VIP PaaS services are not supported during preview. Examples of unsupported resources include Storage VIPs, Event Hub VIPs, and Cloud Services applications.

## Traffic baselines, monitoring, and DDoS SDN

When DDoS Protection Standard is enabled on a virtual network, as you deploy new protected resource types on the virtual network, they are added to DDoS Protection Standard. Traffic pattern baselines are developed for the protected resources attached to the virtual network. The traffic baseline learns normal traffic bandwidth for each protected resource for every hour and day of the week. This baseline is used as the source of a DDoS policy that is installed for a protected resource.

Microsoft’s DDoS SDN monitors actual traffic utilization and constantly compares it against the thresholds defined in the DDoS Policy. When that traffic threshold is exceeded, then DDoS mitigation is initiated. When traffic goes below the threshold, the mitigation is removed.

## Next steps

- Learn more about managing DDoS Protection Standard using [Azure PowerShell](ddos-protection-manage-ps.md) or the [Azure portal](ddos-protection-manage-portal.md).