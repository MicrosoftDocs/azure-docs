---
title: What is Azure network security?
description: Overview of Azure network security
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: overview
ms.date: 06/24/2025
ms.custom: ai-usage
---

# What is Azure network security?

Network security is a critical aspect of cloud computing, as it protects the data and applications that run on the cloud from various threats and attacks. Azure provides a comprehensive set of network security solutions that enable you to design, deploy, and manage secure and resilient networks in the cloud.

:::image type="content" source="./media/network-security/security-services.png" alt-text="Screenshot showing the icons for Azure Firewall, Azure DDoS Protection, and Azure Web Application Firewall.":::

One of the guiding principles of Azure network security is the [Zero Trust model](/security/zero-trust/zero-trust-overview), which assumes that no network or device is inherently secure or trustworthy. Instead, every request and connection should be verified and validated based on data, identity, and context. The Zero Trust model helps you to prevent unauthorized access, limit lateral movement, and reduce the attack surface of your networks.

## Choosing a solution

Choosing the right network security solution for your Azure workloads depends on your specific needs and requirements. Azure provides a variety of network security services that can be used individually or in combination to protect your workloads. Here are some key factors to consider when choosing a network security solution:

- **Workload type**: Different workloads have different security requirements. For example, web applications may require protection against web attacks, while virtual machines may require protection against network-based attacks.
- **Deployment model**: Azure provides different deployment models for network security services, such as virtual appliances, managed services, and integrated solutions. Choose the model that best fits your needs and requirements.
- **Integration with other Azure services**: Many Azure network security services integrate with other Azure services, such as Azure Monitor, Azure Security Center, and Microsoft Sentinel. Choose a solution that can easily integrate with your existing Azure services for enhanced security and monitoring.
- **Cost**: Different network security services have different pricing models. Choose a solution that fits your budget and provides the level of protection you need.
- **Compliance requirements**: Depending on your industry and location, you may have specific compliance requirements that your network security solution must meet. Choose a solution that can help you meet these requirements.
- **Scalability**: As your workloads grow, your network security solution should be able to scale with them. Choose a solution that can handle increased traffic and workloads without compromising security.
- **Management and monitoring**: Choose a solution that provides easy management and monitoring capabilities, such as dashboards, alerts, and reporting. This will help you to quickly identify and respond to security incidents.

## Azure Firewall

[Azure Firewall](../../firewall/overview.md) is a cloud-native, intelligent network firewall service that offers full stateful protection with built-in high availability and unlimited cloud scalability. It provides both network and application-level security for your Azure workloads. As a managed service, Azure Firewall can be deployed in a virtual network and integrates seamlessly with other Azure services like Azure Monitor, Azure Security Center, and Microsoft Sentinel for enhanced security and monitoring.

:::image type="content" source="./media/network-security/firewall.png" alt-text="Diagram showing how Azure Firewall inspects traffic to and from the internet before routing it to its destination.":::

Depending on your needs, you can select from three Azure Firewall SKUs:

- [**Basic**](../../firewall/basic-features.md): Basic SKU is a cost-effective option for simple firewall solutions in Azure workloads. It provides essential features such as network and application filtering, network address translation, and logging.
- [**Standard**](../../firewall/features.md): Standard SKU is a more advanced option that includes extra features such as DNS proxy and web categories. It's designed for more comprehensive firewall solutions in Azure workloads.
- [**Premium**](../../firewall/premium-features.md): Premium SKU is the most advanced option that includes all the features of the Standard SKU, plus extra features such as TLS inspection, intrusion detection and prevention, and URL filtering. It's designed for the highest level of security and control in Azure workloads.

### Use cases

- **Network security**: Protect your Azure workloads from network-based attacks and unauthorized access.
- **Application security**: Protect your Azure workloads from application-based attacks and vulnerabilities.
- **Intrusion detection and prevention**: Monitor your network for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **TLS inspection**: Inspect and decrypt TLS traffic to detect and block threats hidden in encrypted traffic.
- **URL filtering**: Control access to specific URLs or URL categories based on your organization's policies.

For more information, see [Azure Firewall overview](../../firewall/overview.md).

## Azure DDoS Protection

[Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md) is a service that provides enhanced DDoS mitigation features to defend against DDoS attacks. It's automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network or public IP address resources, and it requires no application or resource changes. 

- **IP protection**: Azure DDoS IP Protection provides protection for your Azure resources that are assigned a public IP address. It protects against volumetric, protocol, and application layer attacks.

    :::image type="content" source="./media/network-security/ip-protection.png" alt-text="Diagram illustrating Azure DDoS Protection applied to a resource with a public IP address.":::

- **Network protection**: Azure DDoS Network Protection provides protection for your Azure resources in a virtual network that are assigned a public IP address. It has extra features such as DDoS Rapid Response support, cost protection, and WAF discounts. 

    :::image type="content" source="./media/network-security/network-protection.png" alt-text="Diagram illustrating Azure DDoS Protection enabled at the virtual network level for a hub-and-spoke topology.":::

### Use cases

- **Protection against DDoS attacks**: Protect your Azure resources from DDoS attacks, including volumetric, protocol, and application layer attacks.
- **Cost protection**: Protect your Azure resources from unexpected costs due to DDoS attacks.
- **Rapid response**: Get rapid response support from Azure DDoS experts in the event of a DDoS attack.

For more information, see [Azure DDoS Protection overview](../../ddos-protection/ddos-protection-overview.md).

## Azure Web Application Firewall

[Azure Web Application Firewall](../../web-application-firewall/overview.md) (WAF) is a web application firewall that provides centralized protection to your web applications from common exploits and vulnerabilities. WAF uses rules to monitor HTTP requests and responses, and it can block or allow traffic based on the rules you define. 

:::image type="content" source="./media/network-security/web-application-firewall.png" alt-text="Diagram illustrating Azure Web Application Firewall applied to both Azure Application Gateway and Azure Front Door, allowing valid requests and blocking web attacks.":::

WAF is available in two deployment options:

- [**Azure Application Gateway WAF**](../../web-application-firewall/ag/ag-overview.md): Azure Application Gateway is a web traffic (OSI layer 7) load balancer that enables you to manage traffic to your web applications.
- [**Azure Front Door WAF**](../../web-application-firewall/afds/afds-overview.md): Azure Front Door is a scalable and secure entry point for fast delivery of your global applications. It offers SSL offload, application acceleration, and global load balancing with instant failover.

### Use cases
- **Protection against web attacks**: Protect your web applications from common exploits and vulnerabilities, such as SQL injection and cross-site scripting (XSS).
- **Centralized management**: Manage your web application firewall rules and policies from a single location.
- **Integration with Azure services**: Integrate WAF with other Azure services, such as Azure Application Gateway and Azure Front Door, for enhanced security and performance.
- **Custom rules**: Create custom rules to meet your specific security requirements and policies.
- **Bot protection**: Protect your web applications from malicious bots and automated attacks.

For more information, see [Azure Web Application Firewall overview](../../web-application-firewall/overview.md).

## Azure portal experience

The Azure portal provides a unified experience for [managing your network security services](https://ms.portal.azure.com/?Microsoft_Azure_HybridNetworking_clientoptimizations=false&feature.customportal=false&exp.azureportal_assettypevariant-microsoft_azure_hybridnetworking-firewallmanager=netsechubexpon&feature.unifiedCopilot=true&exp.azureportal_assettypevariant-microsoft_azure_hybridnetworking-firewallpolicy=netsechubexpon&exp.azureportal_assettypevariant-microsoft_azure_hybridnetworking-networksecurity=netsechubexpon&exp.AzurePortal_netsechubexpon=true&exp.AzurePortal_isRecMenuItemVisible=true&exp.AzurePortal_reactOverviewFwmExp=true&exp.AzurePortal_ddosInlineCtaVisible=true&Microsoft_Azure_HybridNetworking=flight12#view/Microsoft_Azure_HybridNetworking/FirewallManagerMenuBlade/~/overviewReact). You can easily create and manage your network security services from a single location, and you can also view the status and health of your services.

:::image type="content" source="media/network-security/portal-hub.png" alt-text="Screenshot of the network security selection experience in the Azure portal.":::

### Common network security scenarios

The Network Security hub currently supports the following deployment options:

- **Secured hub-and-spoke virtual network**: Deploy an Azure Firewall in a virtual network designated as a hub. This hub virtual network can connect to multiple spoke virtual networks using virtual network peering. The Azure Firewall is associated with an Azure Firewall policy that defines the rules and configurations for the firewall. This deployment model is ideal for organizations seeking to centralize network security and management in one location.

- **Protect Virtual WANs at scale**: Deploy an Azure Firewall in an Azure Virtual WAN secured hub. The Azure Firewall is associated with an Azure Firewall policy, and the secured hub is connected to multiple branch offices and remote users. This deployment model is ideal for organizations using Azure Virtual WAN to connect multiple branch offices and remote users to Azure resources.

- **Zero Trust for web applications**: Use Azure Application Gateway with an Azure Web Application Firewall (WAF) policy to safeguard regional web applications against common exploits and vulnerabilities. Customize the WAF policy to address the specific security needs of your web applications effectively.

- **Deliver cloud content securely**: Use Azure Front Door with an Azure Web Application Firewall (WAF) policy to protect and optimize the delivery of your global web applications. This deployment model ensures secure and efficient application performance while allowing you to customize the WAF policy to address specific security needs.

## Next steps

Learn more about the different features and capabilities of each Azure network security service:

> [!div class="nextstepaction"]
> [Azure network security documentation](index.yml)
