---
title: Partnering with Azure DDoS Protection 
description: "Understand partnering opportunities enabled by Azure DDoS Protection."
ms.service: ddos-protection
ms.custom: ignite-2022
author: AbdullahBell
ms.topic: how-to
ms.date: 10/12/2022
ms.author: abell
---
# Partnering with Azure DDoS Protection
This article describes partnering opportunities enabled by the Azure DDoS Protection. This article is designed to help product managers and business development roles understand the investment paths and provide insight into the partnering value propositions.

## Background
Distributed denial of service (DDoS) attacks are one of the top availability and security concerns voiced by customers moving their applications to the cloud. With extortion and hacktivism being the common motivations behind DDoS attacks, they have been consistently increasing in type, scale, and frequency of occurrence as they're relatively easy and cheap to launch.

Azure DDoS Protection provides countermeasures against the most sophisticated DDoS threats, leveraging the global scale of Azure networking. The service provides enhanced DDoS mitigation capabilities for applications and resources deployed in virtual networks.

Technology partners can protect their customers' resources natively with Azure DDoS Protection to address the availability and reliability concerns due to DDoS attacks.

## Introduction to Azure DDoS Protection
Azure DDoS Protection provides enhanced DDoS mitigation capabilities against Layer 3 and Layer 4 DDoS attacks. The following are the key features of DDoS Protection service.

### Adaptive real-time tuning
For every protected application, Azure DDoS Protection automatically tunes the DDoS mitigation policy thresholds based on the application’s traffic profile patterns. The service accomplishes this customization by using two insights:

- Automatic learning of per-customer (per-IP) traffic patterns for Layer 3 and 4.
- Minimizing false positives, considering that the scale of Azure allows it to absorb a significant amount of traffic.

:::image type="content" source="./media/ddos-protection-partner-onboarding/real-time-tuning.png" alt-text="Diagram of Adaptive real time tuning.":::

### Attack analytics, telemetry, monitoring, and alerting
Azure DDoS Protection identifies and mitigates DDoS attacks without any user intervention.

- If the protected resource is in the subscription covered under Microsoft Defender for Cloud, DDoS Protection automatically sends an alert to Defender for Cloud whenever a DDoS attack is detected and mitigated against the protected application.
- Alternatively, to get notified when there’s an active mitigation for a protected public IP, you can [configure an alert](alerts.md) on the metric Under DDoS attack or not.
- You can additionally choose to create alerts for the other DDoS metrics and [configure attack telemetry](telemetry.md) to understand the scale of the attack, traffic being dropped, attack vectors, top contributors, and other details.

![DDoS metrics](./media/ddos-protection-partner-onboarding/ddos-metrics.png)

### DDoS rapid response (DRR)
DDoS Protection customers have access to [Rapid Response team](ddos-rapid-response.md) during an active attack. DRR can help with attack investigation during an attack and post-attack analysis.

### SLA guarantee and cost protection
DDoS Protection service is covered by a 99.99% SLA, and cost protection provides resource credits for scale-out during a documented attack. For more information, see [SLA for Azure DDoS Protection](https://azure.microsoft.com/support/legal/sla/ddos-protection/v1_0/).

## Featured partner scenarios
The following are key benefits you can derive by integrating with the Azure DDoS Protection:

- Partners' offered services (load balancer, web application firewall, firewall, etc.) to their customers are automatically protected (white labeled) by Azure DDoS Protection in the back end.
- Partners have access to Azure DDoS Protection attack analytics and telemetry that they can integrate with their own products, offering a unified customer experience.  
- Partners have access to DDoS rapid response support even in the absence of Azure rapid response, for DDoS related issues.
- Partners' protected applications are backed by a DDoS SLA guarantee and cost protection in the event of DDoS attacks.

## Technical integration overview
Azure DDoS Protection partnering opportunities are made available via Azure portal, APIs, and CLI/PS.

### Integrate with DDoS Protection
The following steps are required for partners to configure integration with Azure DDoS Protection:
1. Create a DDoS Protection Plan in your desired (partner) subscription. For step-by-step instructions, see [Create a DDoS Protection plan](manage-ddos-protection.md#create-a-ddos-protection-plan).
   > [!NOTE]
   > Only 1 DDoS Protection Plan needs to be created for a given tenant. 
2. Deploy a service with public endpoint in your (partner) subscriptions, such as load balancer, firewalls, and web application firewall. 
3. Enable Azure DDoS Protection on the virtual network of the service that has public endpoints using DDoS Protection Plan created in the first step. For step-by-step instructions, see [Enable DDoS Protection plan](manage-ddos-protection.md#enable-for-an-existing-virtual-network)
   > [!IMPORTANT] 
   > After Azure DDoS Protection is enabled on a virtual network, all public IPs within that virtual network are automatically protected. The origin of these public IPs can be either within Azure (client subscription) or outside of Azure. 
4. Optionally, integrate Azure DDoS Protection telemetry and attack analytics in your application-specific customer-facing dashboard. For more information about using telemetry, see [View and configure DDoS protection telemetry](telemetry.md). 

### Onboarding guides and technical documentation

- [Azure DDoS Protection product page](https://azure.microsoft.com/services/ddos-protection/)
- [Azure DDoS Protection documentation](ddos-protection-overview.md)
- [Azure DDoS Protection API reference](/rest/api/virtualnetwork/ddosprotectionplans)
- [Azure virtual network API reference](/rest/api/virtualnetwork/virtualnetworks)

### Get help

- If you have questions about application, service, or product integrations with Azure DDoS Protection, reach out to the [Azure security community](https://techcommunity.microsoft.com/t5/security-identity/bd-p/Azure-Security).
- Follow discussions on [Stack Overflow](https://stackoverflow.com/tags/azure-ddos/).

### Get to market

- The primary program for partnering with Microsoft is the [Microsoft Partner Network](https://partner.microsoft.com/). 
– Microsoft Graph Security integrations fall into the [MPN Independent Software Vendor (ISV)](https://partner.microsoft.com/saas-solution-guide) track.
- [Microsoft Intelligent Security Association](https://www.microsoft.com/security/business/intelligent-security-association?rtc=1) is the program specifically for Microsoft Security Partners to help enrich your security products and improve customer discoverability of your integrations to Microsoft Security products.

## Next steps
View existing partner integrations:

- [Barracuda WAF-as-a-service](https://www.barracuda.com/waf-as-a-service)
