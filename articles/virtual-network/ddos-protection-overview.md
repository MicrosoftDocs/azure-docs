---
title: Azure DDoS Protection Standard Overview | Microsoft Docs
description: Learn about the Azure DDoS Protection service.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/13/2017
ms.author: jdial

---
# Azure DDoS Protection Standard overview

Distributed denial of service (DDoS) attacks are one of the largest availability and security concerns facing customers moving their applications to the cloud. A DDoS attack attempts to exhaust an application’s resources, making the application unavailable to legitimate users. DDoS attacks can be targeted at any endpoint that is publicly reachable through the Internet.

Azure DDoS Protection, combined with application design best practices, provide defense against DDoS attacks. Azure DDos Protection provides the following service tiers: 

- **Azure DDoS Protection Basic**: Automatically enabled as part of the Azure platform, at no additional charge. Always-on traffic monitoring and real-time mitigation of common network-level attacks provides the same defenses utilized by Microsoft’s online services. The entire scale of Azure’s global network can be used to distribute and mitigate attack traffic across regions. Protection is provided for IPv4 and IPv6 Azure [public IP addresses](virtual-network-public-ip-address.md).
- **Azure DDoS Protection Standard** Provides additional mitigation capabilities tuned specifically to Azure Virtual Network resources. It is simple to enable, and requires no application changes. Protection policies are tuned through dedicated traffic monitoring and machine learning algorithms and applied to public IP addresses associated to resources deployed in virtual networks, such as Azure Load Balancer, Azure Application Gateway, and Azure Service Fabric instances. Real-time telemetry is available through Azure Monitor views during an attack and for history. Application layer protections can be added through [Application Gateway Web Application Firewall](https://azure.microsoft.com/services/application-gateway). Protection is provided for IPv4 Azure [public IP addresses](virtual-network-public-ip-address.md). 

![Azure DDoS Protection Standard](./media/ddos-protection-overview/ddos-protection-overview-fig2.png)

> [!IMPORTANT]
> Azure DDoS Protection Standard is currently in preview. Protection is provided for any Azure resource that has an Azure public IP address associated to it, such as virtual machines, load balancers, and application gateways. You need to [register](http://aka.ms/ddosprotection) for the service before you can enable DDoS Protection Standard for your subscription. After registering, the Azure DDoS team conacts you and guides you through the enablement process. DDoS Protection Standard is available in the East US, East US 2, West US, West Central US, North Europe, West Europe, Japan West, Japan East, East Asia, and Southeast Asia regions only. During preview, you are not charged for using the service.

We encourage you to try DDoS Protection Standard, in development, test, or production environments. Use the following resources to provide feedback on your experiences:
- [Azure DDoS Protection on the Microsoft Azure Forum](https://feedback.azure.com/forums/905032-azure-ddos-protection). 
- [Azure DDoS Protection on the MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azureddosprotection)
- [Azure DDos Protection on Stack Overflow](https://stackoverflow.com/tags/azure-ddos/info)

For support issues, you can [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md). While DDoS Protection Standard is in preview, support is provided on a best-effort basis.

## Types of DDoS attacks that DDoS Protection Standard mitigates

DDoS Protection Standard can mitigate these types of attacks:

- **Volumetric attacks**: The attack's goal is to flood the network layer with a substantial amount of seemingly legitimate traffic. It includes UDP floods, amplification floods, and other spoofed-packet floods. DDoS Protection Standard mitigates these potential multi-gigabyte attacks by absorbing and scrubbing them, leveraging Azure’s global network scale, automatically. 
- **Protocol attacks**: These attacks render a target inaccessible by exploiting a weakness in the layer 3 and layer 4 protocol stack. It includes, SYN flood attacks, reflection attacks, and other protocol attacks. DDoS Protection Standard mitigates these attacks, differentiating between malicious and legitimate traffic, by interacting with the client and blocking malicious traffic. 
- **Application layer attacks**: These attacks target web application packets to disrupt the transmission of data between hosts. It includes HTTP protocol violations, SQL injection, cross-site scripting, and other layer 7 attacks. Use the Azure [Application Gateway web application firewall](../application-gateway/application-gateway-web-application-firewall-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), with DDoS Protection Standard, to provide defense against these attacks. 

DDoS Protection Standard protects resources in a virtual network including public IP addresses associated with virtual machines, load balancers, and application gateways. When coupled with the Application Gateway web application firewall, DDoS Protection Standard can provide full layer 3 to layer 7 mitigation capability.

## DDoS Protection Standard features

![DDoS functionality](./media/ddos-protection-overview/ddos-overview-fig1.png)

DDoS Protection Standard features include: 

- **Native platform integration:** Natively integrated into Azure and includes configuration through the Azure portal and PowerShell. DDoS Protection Standard understands your resources and resource configuration.
- **Always-on traffic monitoring:** Your application traffic patterns are monitored 24 hour a day, 7 days a week, looking for indicators of DDoS attacks. Mitigation is performed when protection policies are exceeded.
- **Turn-key protection:** Simplified configuration immediately protects all resources on a virtual network as soon as DDoS Protection Standard is enabled. No intervention or user definition is required. DDoS Protection Standard instantly and automatically mitigates the attack, once it is detected.
- **Adaptive tuning:** Intelligent traffic profiling learns your application’s traffic over time, and selects and updates the profile that is the most suitable for your service. The profile adjusts as traffic changes over time.
- **Layer 3 to layer 7 protection:** Provides full stack DDoS protection, when used with an application gateway.
- **Extensive mitigation scale:** Over 60 different attack types can be mitigated, with global capacity, to protect against the largest known DDoS attacks. 
- **Attack metrics:** Summarized metrics from each attack are accessible through Azure Monitor.
- **Attack alerting:** Alerts can be configured at the start and stop of an attack, and over the attack’s duration, using built-in attack metrics. Alerts integrate into your operational software like Microsoft Operations Management Suite, Splunk, Azure Storage, Email, and the Azure portal.
- **Cost guarantee:** Data-transfer and application scale-out service credits for documented DDoS attacks.

## DDoS Protection Standard mitigation

Microsoft’s DDoS Protection service monitors actual traffic utilization and constantly compares it against the thresholds defined in the DDoS Policy. When that traffic threshold is exceeded, then DDoS mitigation is initiated automatically. When traffic returns below the threshold, the mitigation is removed.

During mitigation, traffic sent to the protected resource is redirected by the DDoS Protection service and several checks are performed. These checks generally perform the following functions:

- Ensure packets conform to Internet specifications and are not malformed.
- Interact with the client to determine if the traffic is potentially a spoofed packet (e.g: SYN Auth or SYN Cookie or by dropping a packet for the source to retransmit it).
- Rate-limit packets, if no other enforcement method can be performed.

The DDoS protection blocks attack traffic and forwards remaining traffic to its intended destination. Within a few minutes of attack detection, you are notified using Azure Monitor metrics. By configuring logging on DDoS Protection Standard telemetry, you can write the logs to available options for future analysis. Metric data in Azure Monitor for DDoS Protection Standard is currently retained for 30 days.

We do not advise customers to simulate their own DDoS attacks. Instead, customers can use the support channel to request a DDoS attack simulation executed by Azure Networking. An engineer will contact you to arrange the details of the DDoS attack (ports, protocols, target IPs) and arrange a time to schedule the test.

## Next steps

- Learn more about managing DDoS Protection Standard using [Azure PowerShell](ddos-protection-manage-ps.md) or the [Azure portal](ddos-protection-manage-portal.md).
