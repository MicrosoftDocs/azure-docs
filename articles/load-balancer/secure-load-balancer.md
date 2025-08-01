---
title: Secure your Azure Load Balancer deployment
description: Learn how to secure your Azure Load Balancer deployment with network security controls, access management, monitoring best practices, and DDoS protection.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: conceptual
ms.custom: security
ms.date: 08/01/2025
ai-usage: ai-assisted
---

# Secure your Azure Load Balancer deployment

Azure Load Balancer distributes incoming traffic across healthy virtual machine instances in a backend pool, providing high availability and scalability for your applications. As a critical networking component that handles traffic routing and load distribution, securing your Load Balancer deployment is essential to protect your infrastructure from unauthorized access and ensure reliable service delivery.

This article provides guidance on how to best secure your Azure Load Balancer deployment.

## Network security

Network security for Azure Load Balancer focuses on controlling traffic flow, implementing proper segmentation, and protecting backend resources from unauthorized access. Proper network configuration ensures that only legitimate traffic reaches your applications while maintaining high availability.

* **Use internal Load Balancers for private traffic**: Deploy internal Azure Load Balancers to restrict traffic to backend resources from within specific virtual networks or peered networks without internet exposure. This prevents direct internet access to your backend services. For more information, see [Internal Load Balancer Frontend IP configuration](components.md#frontend-ip-configuration).

* **Implement external Load Balancers with SNAT**: Configure external Load Balancers with Source Network Address Translation (SNAT) to mask backend resource IP addresses and protect them from direct internet exposure while still allowing outbound connectivity.

* **Apply Network Security Groups**: Configure Network Security Groups (NSGs) on backend subnets to control traffic flow and allow access only to trusted ports and IP address ranges. While you can't apply NSGs directly to the Load Balancer, you can control traffic to backend resources. For more information, see [Network Security Groups overview](/azure/virtual-network/network-security-groups-overview).

* **Use Standard Load Balancer for production**: Deploy Standard Load Balancer for production workloads as it's designed to be secure by default and requires explicit network security group rules to allow traffic. Standard Load Balancer is closed to inbound flows unless explicitly permitted, unlike Basic Load Balancer which is open by default.

* **Configure outbound rules carefully**: Review and configure outbound rules for Standard Load Balancers to control outbound NAT behavior and ensure secure outbound connectivity from backend resources.

* **Leverage virtual network integration**: Configure Load Balancer frontend IP addresses within your virtual network infrastructure to maintain network isolation and enable integration with other Azure networking services.

* **Enable DDoS protection**: Configure Azure DDoS Protection on public Load Balancers to protect against distributed denial-of-service attacks and ensure service availability during attack scenarios. For more information, see [Protect your public load balancer with Azure DDoS Protection](tutorial-protect-load-balancer-ddos.md).

* **Allow health probe traffic**: Ensure that health probe traffic from the source IP address 168.63.129.16 is allowed in network security groups and local firewall policies using the AzureLoadBalancer service tag. Blocking this traffic can cause health probes to fail and mark healthy instances as down. For more information, see [Load Balancer health probes](load-balancer-custom-probe-overview.md#probe-source-ip-address).

## Privileged access

Privileged access management for Azure Load Balancer ensures that only authorized users can configure and manage Load Balancer resources while following the principle of least privilege access.

* **Use role-based access control**: Implement Azure role-based access control (RBAC) to grant users only the minimum permissions required for their responsibilities. Assign the Network Contributor role or create custom roles with specific permissions for Load Balancer management. For more information, see [Cross-subscription overview](cross-subscription-overview.md#authorization).

* **Implement cross-subscription access controls**: When using cross-subscription Load Balancer configurations, ensure proper authorization by assigning users to the Network Contributor role or custom roles with appropriate actions on both subscriptions involved in the configuration.

* **Secure administrative access**: Limit administrative access to Load Balancer resources by using privileged access workstations and implementing multi-factor authentication for all administrative activities.

* **Regular access reviews**: Conduct periodic reviews of user permissions and access rights to Load Balancer resources to ensure that access remains appropriate and follows the principle of least privilege.

## Logging and threat detection

Comprehensive logging and monitoring for Azure Load Balancer enables threat detection, performance optimization, and compliance requirements while providing visibility into traffic patterns and security events.

* **Enable Azure Monitor metrics**: Configure Azure Monitor to collect and analyze Load Balancer metrics including data path availability, health probe status, connection counts, and throughput metrics. For more information, see [Monitor Azure Load Balancer](monitor-load-balancer.md).

* **Configure diagnostic settings**: Create diagnostic settings to send Load Balancer metrics to Log Analytics workspaces, storage accounts, or event hubs for analysis and long-term retention. For more information, see [Monitor Azure Load Balancer](monitor-load-balancer.md#creating-a-diagnostic-setting).

* **Use Load Balancer Insights**: Leverage Azure Load Balancer Insights for functional dependency views, metrics dashboards, and connection monitoring to gain comprehensive visibility into Load Balancer performance and health. For more information, see [Using Insights to monitor and configure your Azure Load Balancer](load-balancer-insights.md).

* **Monitor health probe status**: Track health probe metrics to identify backend instance availability issues and ensure proper traffic distribution across healthy endpoints. For more information, see [Load Balancer health probes](load-balancer-custom-probe-overview.md#monitoring).

* **Set up alerting**: Configure alerts in Azure Monitor to notify administrators when Load Balancer metrics exceed defined thresholds or when health probes indicate backend service issues.

* **Enable resource health monitoring**: Use Azure Resource Health to monitor the health status of your Load Balancer and receive notifications about service issues that might affect your deployment.

## Data protection

Data protection for Azure Load Balancer focuses on securing traffic in transit and ensuring that sensitive information remains protected as it flows through the load balancing infrastructure.

* **Enable HTTPS probes for encrypted endpoints**: Configure HTTPS health probes when backend services support encrypted endpoints to maintain security consistency throughout the traffic flow. Standard Load Balancer supports HTTPS probes while Basic Load Balancer only supports TCP and HTTP probes. For more information, see [Load Balancer health probes](load-balancer-custom-probe-overview.md).

* **Implement end-to-end TLS encryption**: Since Load Balancer operates at Layer 4 and doesn't provide TLS termination, implement TLS encryption directly on backend VMs to ensure end-to-end encryption. This approach provides better security and allows for greater scale-out of TLS applications. For more information, see [Load Balancer concepts](concepts.md).

* **Secure backend instance communications**: Ensure that backend instances use encrypted protocols (HTTPS, TLS) for client communications to protect data in transit from network-based attacks such as eavesdropping and man-in-the-middle attacks.

* **Configure secure transfer requirements**: When Load Balancer frontend configurations use public IP addresses, ensure that any associated storage accounts or services require secure transfer (HTTPS) to prevent unencrypted data transmission.

## Asset management

Asset management for Azure Load Balancer involves implementing governance controls, monitoring configurations, and ensuring compliance with organizational security policies. Proper asset management helps maintain security posture and operational visibility.

* **Implement Azure Policy governance**: Use Azure Policy to monitor and enforce security configurations for your Load Balancer resources. Define standard security configurations and use built-in policy definitions to maintain compliance. For more information, see [Create and manage policies](/azure/governance/policy/tutorials/create-and-manage).

* **Create custom policies for specific requirements**: When built-in policies don't meet your needs, create custom Azure Policy definitions using aliases in the 'Microsoft.Network' namespace to audit or enforce specific Load Balancer configurations.

* **Monitor configuration compliance**: Regularly review Load Balancer configurations against your organization's security standards and use Azure Policy to automatically detect and remediate configuration drift.

* **Maintain inventory and documentation**: Keep detailed records of your Load Balancer deployments, their configurations, and their relationships with other Azure resources to support security assessments and compliance reporting.

* **Use resource tags**: Apply consistent resource tags to Load Balancer resources for organization, cost tracking, and security compliance purposes.

## Next steps

- [Azure Well-Architected Framework - Security](/azure/well-architected/security/)
- [Cloud Adoption Framework - Security overview](/azure/cloud-adoption-framework/secure/overview)