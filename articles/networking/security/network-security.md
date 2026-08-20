---
title: 'Azure Network Security: Firewall, DDoS, WAF'
description: Compare Azure Firewall, Azure DDoS Protection, and Azure Web Application Firewall to choose the right network security service for your workload.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 08/18/2026
ai-usage: ai-assisted
ms.custom: 
    - portfolio-consolidation-2025

#customer intent: As a cloud architect, I want to compare the Azure network security services so that I can choose the right one for my workload.
---

# What is Azure network security?

Azure network security is a set of cloud-native services that protect the data and applications you run in Azure from a broad range of threats and attacks. As you move workloads to the cloud, you need to control which traffic reaches your resources, defend public endpoints from attack, and shield web applications from exploitation—all without deploying and managing your own security appliances.

Azure network security centers on three core services: **Azure Firewall** delivers centralized traffic inspection and filtering across Layers 3 through 7, **Azure DDoS Protection** defends your public IP addresses against distributed denial-of-service attacks, and **Azure Web Application Firewall** protects your web applications from HTTP-layer exploits such as SQL injection and cross-site scripting.

This article introduces each service, compares what they protect and where they sit in the traffic path, and helps you decide which one—or which combination—fits your workload.

:::image type="content" source="./media/network-security/security-services.png" alt-text="Screenshot showing the icons for Azure Firewall, Azure DDoS Protection, and Azure Web Application Firewall.":::

## Which network security service do you need?

Use the following table to map your scenario to the Azure network security service that addresses it. Each service targets a distinct layer of the network stack, and you can combine them for defense in depth.

| Scenario | Service |
|---|---|
| You need to restrict which external FQDNs and URLs your workloads can reach, or inspect east-west traffic between spoke virtual networks. | [Azure Firewall](../design-guide/azure-firewall.md) |
| You need centralized Layers 3-7 traffic inspection with threat intelligence, intrusion detection and prevention (IDPS), or TLS inspection. | [Azure Firewall](../design-guide/azure-firewall.md) |
| You deploy resources with public IP addresses that need SLA-backed protection from volumetric attacks. | [Azure DDoS Protection](../design-guide/ddos.md) |
| You need attack telemetry, rapid response support, or cost protection during DDoS events. | [Azure DDoS Protection](../design-guide/ddos.md) |
| You expose a public-facing web application and need protection from OWASP Top 10 attacks such as SQL injection and cross-site scripting. | [Azure Web Application Firewall](../design-guide/web-application-firewall.md) |
| A compliance framework such as PCI DSS mandates a web application firewall, or you need bot mitigation for your web apps. | [Azure Web Application Firewall](../design-guide/web-application-firewall.md) |

The three services protect different parts of the network stack. The following table compares them on the axes that drive the decision.

| Decision factor | Azure Firewall | Azure DDoS Protection | Azure Web Application Firewall |
|---|---|---|---|
| What it protects | All Azure workloads, at both the network and application level | Public IP addresses and internet-facing endpoints | Public-facing web applications (HTTP/HTTPS) |
| Where it sits in the traffic path | Standalone in a hub subnet, with user-defined routes directing traffic through it (Layers 3-7) | At the Azure network edge, before traffic reaches your resources | At Layer 7, integrated with Application Gateway (regional) or Azure Front Door (global edge) |
| Threat it addresses | Malicious IPs and FQDNs, command-and-control callbacks, DNS exfiltration, and port scanning | Volumetric, protocol, and application-layer DDoS attacks | OWASP Top 10 web exploits: SQL injection, cross-site scripting, and path traversal |

> [!TIP]
> For deeper planning guidance on each service - including SKU selection, placement in your topology, and rule configuration - see the networking design guide companions: [Azure Firewall and traffic inspection](../design-guide/azure-firewall.md), [DDoS protection for Azure networks](../design-guide/ddos.md), and [Web Application Firewall for Azure networks](../design-guide/web-application-firewall.md).

## Factors for choosing a network security service

Choosing the right network security solution for your Azure workloads depends on your specific needs and requirements. Azure provides a variety of network security services that you can use individually or in combination to protect your workloads. Here are some key factors to consider when choosing a network security solution:

- **Workload type**: Different workloads have different security requirements. For example, web applications might require protection against web attacks, while virtual machines might require protection against network-based attacks.
- **Deployment model**: Azure provides different deployment models for network security services, such as virtual appliances, managed services, and integrated solutions. Choose the model that best fits your needs and requirements.
- **Integration with other Azure services**: Many Azure network security services integrate with other Azure services, such as Azure Monitor, Microsoft Defender for Cloud, and Microsoft Sentinel. Choose a solution that can integrate with your existing Azure services for enhanced security and monitoring.
- **Cost**: Different network security services have different pricing models. Choose a solution that fits your budget and provides the level of protection you need.
- **Compliance requirements**: Depending on your industry and location, you might have specific compliance requirements that your network security solution must meet. Choose a solution that can help you meet these requirements.
- **Scalability**: As your workloads grow, your network security solution should scale with them. Choose a solution that can handle increased traffic and workloads without compromising security.
- **Management and monitoring**: Choose a solution that provides easy management and monitoring capabilities, such as dashboards, alerts, and reporting. This capability helps you identify and respond to security incidents.

## Azure Firewall

[Azure Firewall](../../firewall/overview.md) is a cloud-native, intelligent network firewall service that offers full stateful protection with built-in high availability and unlimited cloud scalability. It provides both network and application-level security for your Azure workloads. As a managed service, you can deploy Azure Firewall in a virtual network, where it integrates with other Azure services like Azure Monitor, Microsoft Defender for Cloud, and Microsoft Sentinel for enhanced security and monitoring.

:::image type="content" source="./media/network-security/firewall.png" alt-text="Diagram showing how Azure Firewall inspects traffic to and from the internet before routing it to its destination.":::

Depending on your needs, select from three Azure Firewall SKUs:

- [**Basic**](../../firewall/basic-features.md): Basic SKU is a cost-effective option for simple firewall solutions in Azure workloads. It provides essential features such as network and application filtering, network address translation, and logging.
- [**Standard**](../../firewall/features.md): Standard SKU is a more advanced option that includes extra features such as DNS proxy and web categories. It's designed for more comprehensive firewall solutions in Azure workloads.
- [**Premium**](../../firewall/premium-features.md): Premium SKU is the most advanced option that includes all the features of the Standard SKU, plus extra features such as TLS inspection, intrusion detection and prevention, and URL filtering. It's designed for the highest level of security and control in Azure workloads.

### Azure Firewall use cases

- **Network security**: Protect your Azure workloads from network-based attacks and unauthorized access.
- **Application security**: Protect your Azure workloads from application-based attacks and vulnerabilities.
- **Intrusion detection and prevention**: Monitor your network for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **TLS inspection**: Inspect and decrypt TLS traffic to detect and block threats hidden in encrypted traffic.
- **URL filtering**: Control access to specific URLs or URL categories based on your organization's policies.

For more information, see [Azure Firewall overview](../../firewall/overview.md).

> [!div class="nextstepaction"]
> [Get started: Deploy and configure Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

## Azure DDoS Protection

[Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md) provides enhanced DDoS mitigation features to defend against DDoS attacks. It's automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network or public IP address resources, and it requires no application or resource changes. 

- **IP protection**: Azure DDoS IP Protection protects your Azure resources that have a public IP address. It protects against volumetric, protocol, and application layer attacks.

    :::image type="content" source="./media/network-security/ip-protection.png" alt-text="Diagram illustrating Azure DDoS Protection applied to a resource with a public IP address.":::

- **Network protection**: Azure DDoS Network Protection protects your Azure resources in a virtual network that have a public IP address. It has extra features such as DDoS Rapid Response support, cost protection, and WAF discounts. 

    :::image type="content" source="./media/network-security/network-protection.png" alt-text="Diagram illustrating Azure DDoS Protection enabled at the virtual network level for a hub-and-spoke topology.":::

### Azure DDoS Protection use cases

- **Protection against DDoS attacks**: Protect your Azure resources from DDoS attacks, including volumetric, protocol, and application layer attacks.
- **Cost protection**: Protect your Azure resources from unexpected costs due to DDoS attacks.
- **Rapid response**: Get rapid response support from Azure DDoS experts during a DDoS attack.

For more information, see [Azure DDoS Protection overview](../../ddos-protection/ddos-protection-overview.md).

> [!div class="nextstepaction"]
> [Get started: Configure Azure DDoS Protection](../../ddos-protection/manage-ddos-protection.md)

## Azure Web Application Firewall

[Azure Web Application Firewall](../../web-application-firewall/overview.md) (WAF) is a web application firewall that provides centralized protection to your web applications from common exploits and vulnerabilities. WAF uses rules to monitor HTTP requests and responses, and it can block or allow traffic based on the rules you define. 

:::image type="content" source="./media/network-security/web-application-firewall.png" alt-text="Diagram showing Azure Web Application Firewall on Azure Application Gateway and Azure Front Door, allowing valid requests and blocking web attacks.":::

WAF is available in two deployment options:

- [**Azure Application Gateway WAF**](../../web-application-firewall/ag/ag-overview.md): Azure Application Gateway is a web traffic (OSI Layer 7) load balancer that manages traffic to your web applications.
- [**Azure Front Door WAF**](../../web-application-firewall/afds/afds-overview.md): Azure Front Door is a scalable and secure entry point for fast delivery of your global applications. It offers SSL offload, application acceleration, and global load balancing with instant failover.

### Azure Web Application Firewall use cases

- **Protection against web attacks**: Protect your web applications from common exploits and vulnerabilities, such as SQL injection and cross-site scripting (XSS).
- **Centralized management**: Manage your web application firewall rules and policies from a single location.
- **Integration with Azure services**: Integrate WAF with other Azure services, such as Azure Application Gateway and Azure Front Door, for enhanced security and performance.
- **Custom rules**: Create custom rules to meet your specific security requirements and policies.
- **Bot protection**: Protect your web applications from malicious bots and automated attacks.

For more information, see [Azure Web Application Firewall overview](../../web-application-firewall/overview.md).

> [!div class="nextstepaction"]
> [Get started with Web Application Firewall on Application Gateway](../../web-application-firewall/ag/ag-overview.md)

## Manage network security in the Azure portal

The Azure portal provides a unified experience for [managing your network security services](https://portal.azure.com/#view/Microsoft_Azure_HybridNetworking/FirewallManagerMenuBlade/~/overviewReact).

:::image type="content" source="./media/network-security/portal-hub.png" alt-text="Screenshot of the network security selection experience in the Azure portal.":::

### Common network security scenarios

The Network Security hub currently supports the following deployment options:

- **Secured hub-and-spoke virtual network**: Deploy an Azure Firewall in a virtual network designated as a hub. Connect this hub virtual network to multiple spoke virtual networks by using virtual network peering. Use an Azure Firewall policy to define the rules and configurations for the Azure Firewall. This deployment model is ideal for organizations seeking to centralize network security and management in one location.

- **Protect Virtual WANs at scale**: Deploy an Azure Firewall in an Azure Virtual WAN secured hub. Use an Azure Firewall policy with the Azure Firewall, and connect the secured hub to multiple branch offices and remote users. This deployment model is ideal for organizations that use Azure Virtual WAN to connect multiple branch offices and remote users to Azure resources.

- **Zero Trust for web applications**: Use Azure Application Gateway with an Azure Web Application Firewall (WAF) policy to safeguard regional web applications against common exploits and vulnerabilities. Customize the WAF policy to address the specific security needs of your web applications.

- **Deliver cloud content securely**: Use Azure Front Door with an Azure Web Application Firewall (WAF) policy to protect and optimize the delivery of your global web applications. This deployment model ensures secure and efficient application performance while allowing you to customize the WAF policy to address specific security needs.

## Related content

- [Azure Firewall and traffic inspection](../design-guide/azure-firewall.md): Plan SKU selection, hub placement, and rule configuration for centralized traffic inspection.
- [DDoS protection for Azure networks](../design-guide/ddos.md): Compare DDoS protection tiers and choose the right level for your workloads.
- [Web Application Firewall for Azure networks](../design-guide/web-application-firewall.md): Compare WAF on Application Gateway and Azure Front Door for HTTP-layer protection.
- [Azure Firewall documentation](../../firewall/overview.md)
- [Azure DDoS Protection documentation](../../ddos-protection/ddos-protection-overview.md)
- [Azure Web Application Firewall documentation](../../web-application-firewall/overview.md)
- [Zero Trust model](/security/zero-trust/zero-trust-overview)
