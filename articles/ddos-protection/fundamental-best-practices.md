---
title: Azure DDoS Protection fundamental best practices
description: Learn fundamental best practices for Azure DDoS Protection, including tier selection, security design, scalability, multi-layered defense, monitoring, and response planning.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 03/05/2026
ms.author: abell
# Customer intent: As a security architect, I want to implement best practices for Azure DDoS Protection, so that I can ensure my applications are resilient and secure against denial-of-service attacks while optimizing scalability and minimizing risk.
---

# Azure DDoS Protection fundamental best practices

This article provides best practices for building DDoS-resilient services on Azure. Use this guidance to protect your applications with Azure DDoS Protection across the areas of tier selection, security design, scalability, multi-layered defense, monitoring, testing, and response planning.

## Choose the right protection tier

Azure DDoS Protection offers two tiers to match different protection needs:

- **DDoS IP Protection**: Per-IP protection for a small number of public IP addresses. Best for small deployments that need core DDoS protection without advanced features.
- **DDoS Network Protection**: Enhanced protection for virtual network resources with additional features including DDoS Rapid Response (DRR) support, cost protection guarantees, and web application firewall (WAF) discounts.

Evaluate your requirements based on the number of public IP resources, the need for DDoS Rapid Response support, and cost protection needs. For a detailed comparison of features, limitations, and pricing between the two tiers, see [About Azure DDoS Protection tier comparison](ddos-protection-sku-comparison.md).

## Design for security

Ensure that security is a priority throughout the entire lifecycle of an application, from design and implementation to deployment and operations. Applications can have bugs that allow a relatively low volume of requests to use an excessive amount of resources, resulting in a service outage.

To protect your service on Azure:

- **Understand your application architecture**: Focus on the [five pillars of software quality](/azure/architecture/guide/pillars). Know your typical traffic volumes, the connectivity model between your application and other applications, and the service endpoints exposed to the public internet.
- **Plan for denial of service**: Ensure that an application is resilient enough to handle a denial of service targeted at the application layer, such as HTTP floods.
- **Apply security development practices**: Security and privacy are built into the Azure platform, beginning with the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl). The SDL addresses security at every development phase and ensures that Azure is continually updated to make it even more secure.
- **Follow Azure security baselines**: Review the [Azure security baseline for DDoS Protection](/security/benchmark/azure/baselines/azure-ddos-protection-security-baseline) to align your configuration with the [Microsoft cloud security benchmark](/security/benchmark/azure/overview).

## Design for scalability

Scalability is how well a system can handle increased load. Design your applications to [scale horizontally](/azure/architecture/guide/design-principles/scale-out) to meet the demand of an amplified load, specifically in the event of a DDoS attack. If your application depends on a single instance of a service, it creates a single point of failure. Provisioning multiple instances makes your system more resilient and more scalable.

Consider the following scalability strategies:

- **[Azure App Service](../app-service/overview.md)**: Select an [App Service plan](../app-service/overview-hosting-plans.md) that offers multiple instances. Configure autoscale rules to automatically scale out based on metrics like CPU usage or request count.
- **[Azure Virtual Machines](/azure/virtual-machines/)**: Ensure that your virtual machine architecture includes more than one virtual machine and that each virtual machine is included in an [availability set](/azure/virtual-machines/windows/tutorial-availability-sets). Use [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) for autoscaling capabilities.
- **Caching and load distribution**: Use [Azure Front Door](../frontdoor/front-door-overview.md) for global load balancing, SSL offloading, and caching of static content. Caching reduces the load on backend resources and minimizes the impact of traffic spikes.
- **[Azure Load Balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md)**: Distribute traffic across multiple instances to prevent any single resource from being overwhelmed.

For recommended DDoS protection architectures for common workload types, see [DDoS Protection reference architectures](ddos-protection-reference-architectures.md).

## Implement multi-layered defense

A defense in depth strategy uses multiple layers of security to reduce the risk of a successful attack. Use the built-in capabilities of the Azure platform to implement secure designs for your applications.

### Reduce the attack surface

Reduce your exposure by minimizing the publicly accessible surface area:

- Use [Azure Private Link](../private-link/private-link-overview.md) to access Azure PaaS services over a private endpoint in your virtual network, eliminating exposure to the public internet.
- Use an allow list to restrict the exposed IP address space and listening ports that aren't needed on load balancers ([Azure Load Balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md) and [Azure Application Gateway](../application-gateway/application-gateway-create-probe-portal.md)).
- Use [network security groups (NSGs)](../virtual-network/network-security-groups-overview.md) to restrict traffic.
- Use [service tags](../virtual-network/network-security-groups-overview.md#service-tags) and [application security groups](../virtual-network/network-security-groups-overview.md#application-security-groups) to simplify creating security rules and configure network security as a natural extension of an application's structure.
- Deploy Azure services in a [virtual network](../virtual-network/virtual-networks-overview.md) whenever possible so that service resources communicate through private IP addresses. Use [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to switch service traffic to use virtual network private addresses as source IP addresses.

### Protect the network layer (L3/L4)

Azure DDoS Protection provides automatic protection against network-layer (L3/L4) volumetric, protocol, and resource-layer attacks. Key capabilities include:

- **Always-on traffic monitoring**: DDoS Protection monitors your application traffic patterns to detect anomalies. Protection activates automatically when traffic exceeds thresholds.
- **Adaptive real-time tuning**: DDoS Protection profiles your application traffic over time and selects the mitigation profile best suited for your service.
- **Azure Firewall integration**: Combine [Azure Firewall](../firewall/overview.md) with DDoS Protection in a virtual network to provide additional network-layer filtering and threat intelligence. For architecture guidance, see [Azure Firewall and DDoS Protection reference architectures](ddos-protection-reference-architectures.md).

### Protect the application layer (L7)

Azure DDoS Protection focuses on network-layer (L3/L4) attacks. For application-layer (L7) attacks like HTTP floods and slowloris, combine DDoS Protection with a web application firewall (WAF):

- Deploy [Azure Web Application Firewall on Azure Front Door](../web-application-firewall/afds/afds-overview.md) or [Azure Application Gateway](../web-application-firewall/ag/ag-overview.md) to protect against L7 attacks.
- Use WAF custom rules for rate limiting to detect and block malicious traffic automatically.
- Enable [bot protection](../web-application-firewall/afds/waf-front-door-policy-configure-bot-protection.md) to block known malicious bots.
- Use [geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md) to restrict traffic from regions where you don't expect legitimate users.

For detailed guidance on application-layer DDoS defense strategies, see [Application DDoS protection](../web-application-firewall/shared/application-ddos-protection.md).

### Integrate with Microsoft Sentinel

Use the [Azure DDoS Solution for Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-network-security-blog/new-azure-ddos-solution-for-microsoft-sentinel/ba-p/3732013) to identify offending DDoS sources, correlate attack data with other security events, and prevent attackers from pivoting to other attack types, such as data exfiltration.

### Protect hybrid environments

If you're connecting an on-premises environment to Azure, minimize exposure of on-premises resources to the public internet. Use the scale and advanced DDoS protection capabilities of Azure by deploying your well-known public entities in Azure. Because these publicly accessible entities are often a target for DDoS attacks, putting them in Azure reduces the impact on your on-premises resources.

## Configure monitoring and alerting

Set up monitoring and alerting to detect DDoS attacks quickly and understand your protection status:

- **Configure metric alerts**: Create alerts on key DDoS Protection metrics, such as *Under DDoS attack or not*, *Inbound packets dropped DDoS*, and *Inbound SYN packets to trigger DDoS mitigation*. Alerts notify you immediately when an attack is detected. For step-by-step instructions, see [Configure Azure DDoS Protection metric alerts](alerts.md).
- **View alerts in Microsoft Defender for Cloud**: DDoS Protection automatically sends mitigation alerts to Microsoft Defender for Cloud when an attack is detected. Use Defender for Cloud to get a unified view of DDoS alerts alongside other security alerts. For more information, see [View Azure DDoS Protection alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md).
- **Enable diagnostic logging**: Enable diagnostic logs to capture DDoS mitigation reports, flow logs, and notifications. Use these logs for post-attack analysis and compliance auditing.
- **Review DDoS Protection telemetry**: Use the metrics and diagnostic logs to understand traffic patterns during attacks and evaluate the effectiveness of mitigation. For detailed monitoring guidance, see [Monitor Azure DDoS Protection](monitor-ddos-protection.md).
- **Monitor application performance**: Use [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview) to monitor your web application and detect performance anomalies. Understanding your application's normal behavior helps you identify degradation during a DDoS attack. For detailed guidance, see [DDoS response strategy](ddos-response-strategy.md).

## Test and validate your protection

Regularly test your DDoS protection to validate that your applications and alerting work as expected during an attack:

- **Run simulation tests**: Use Microsoft-approved testing partners to simulate DDoS attacks against your Azure endpoints. Simulations help validate your protection configuration, alerting setup, and response procedures.
- **Review test results**: After simulation, review DDoS Protection metrics and diagnostic logs to confirm that mitigation policies triggered correctly.

For testing partners, prerequisites, and step-by-step instructions, see [Test through simulations](test-through-simulations.md).

## Plan your DDoS response strategy

Establish a clear response plan before an attack occurs to ensure a fast and effective response:

- **Build a DDoS response team**: Assign team members responsible for coordinating the response to an attack. Include members from networking, application, and operations teams.
- **Engage DDoS Rapid Response (DRR)**: With [DDoS Network Protection](manage-ddos-protection.md), you can engage the [DDoS Rapid Response team](ddos-rapid-response.md) during an active attack for investigation and post-attack analysis.
- **Document and rehearse**: Create runbooks, define escalation paths, and rehearse your response to DDoS attacks. Review and update your response plan regularly.

For detailed guidance on building your response strategy, see [DDoS response strategy](ddos-response-strategy.md).

## Next steps

- [About Azure DDoS Protection tier comparison](ddos-protection-sku-comparison.md)
- [DDoS Protection reference architectures](ddos-protection-reference-architectures.md)
- [Monitor Azure DDoS Protection](monitor-ddos-protection.md)
- [Configure Azure DDoS Protection metric alerts](alerts.md)
- [Test through simulations](test-through-simulations.md)
- [DDoS response strategy](ddos-response-strategy.md)
- [Application DDoS protection](../web-application-firewall/shared/application-ddos-protection.md)
- [DDoS Protection cost optimization](ddos-optimization-guide.md)
