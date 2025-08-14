---
title: Secure your Azure Load Balancer deployment
description: Learn how to secure Azure Load Balancer, with best practices for protecting your deployment.
author: 
ms.author: 
ms.service: azure-load-balancer
ms.topic: conceptual
ms.custom: horz-security
ms.date: 08/13/2025
ai-usage: ai-assisted
---

# Secure your Azure Load Balancer deployment

Azure Load Balancer provides Layer 4 load balancing capabilities to distribute incoming traffic among healthy backend instances. When deploying this service, it's important to follow security best practices to protect data, configurations, and infrastructure.

This article provides guidance on how to best secure your Azure Load Balancer deployment.

## Network security

Network security is foundational for Azure Load Balancer as it controls traffic flow and access to backend resources. Standard Load Balancer follows a secure-by-default approach with closed inbound connections.

- **Use Standard Load Balancer SKU**: Deploy Standard Load Balancer instead of Basic SKU for enhanced security with closed-by-default inbound connections and zero trust network security model. See [Azure Load Balancer overview](load-balancer-overview.md).

- **Implement network security groups on subnets**: Apply network security groups to backend subnets and network interfaces to explicitly permit allowed traffic and restrict access to trusted ports and IP address ranges. See [Azure security baseline for Azure Load Balancer](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline#network-security).

- **Allow Azure Load Balancer health probe traffic**: Ensure that network security groups and local firewall policies allow traffic from IP address 168.63.129.16 to enable health probes to reach backend instances. See [Azure Load Balancer health probe](load-balancer-custom-probe-overview.md).

- **Use internal load balancer for private workloads**: Deploy internal load balancer with private frontend IP addresses to isolate backend resources from direct internet exposure and allow traffic only from within virtual networks or peered networks. See [Internal Load Balancer Frontend IP configuration](components.md#frontend-ip-configuration).

- **Protect public load balancers with Azure DDoS Protection**: Enable Azure DDoS Protection Standard for public load balancers to provide advanced protection with detection capabilities that monitor endpoints for threats and signs of abuse. See [Protect your public load balancer with Azure DDoS Protection](tutorial-protect-load-balancer-ddos.md).

- **Configure outbound rules with manual port allocation**: Use outbound rules with manual port allocation instead of default allocation to prevent SNAT exhaustion and connection failures. See [Outbound rules Azure Load Balancer](outbound-rules.md).

## Identity and access management

Access control for Azure Load Balancer focuses on managing who can configure and modify load balancer resources and settings through Azure's role-based access control system.

- **Implement Azure role-based access control**: Assign appropriate Azure roles to users and groups for load balancer management, using built-in roles like Network Contributor or creating custom roles with specific permissions. See [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles).

- **Use least privilege access**: Grant users the minimum permissions necessary to perform their tasks, avoiding broad administrative roles when specific load balancer operations are sufficient. See [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview).

- **Secure backend resource access**: Configure appropriate authentication and authorization for backend pool resources including virtual machines and application services that receive load-balanced traffic. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

- **Enable managed identity for backend services**: Use Azure managed identities for backend services to eliminate the need for storing credentials in code or configuration files. See [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview).

## Data protection

Azure Load Balancer operates at Layer 4 and does not store customer data, but implementing proper data protection measures for traffic and configurations is essential for comprehensive security.

- **Implement end-to-end encryption**: Configure TLS/SSL termination on backend instances rather than the load balancer, as Load Balancer operates at Layer 4 and does not provide SSL termination capabilities. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

- **Use Application Gateway for HTTP/HTTPS workloads**: Deploy Azure Application Gateway instead of Load Balancer for HTTP/HTTPS applications that require SSL/TLS termination and web application firewall capabilities. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

- **Protect backend data stores**: Implement encryption at rest and in transit for backend databases and storage systems that receive traffic through the load balancer. See [Azure security baseline for Azure Load Balancer](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline).

- **Secure configuration data**: Protect load balancer configuration information and rules from unauthorized access through proper Azure RBAC implementation and change management processes. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md).

## Logging and monitoring

Comprehensive monitoring and logging capabilities help detect security threats, performance issues, and provide visibility into load balancer operations and traffic patterns.

- **Enable diagnostic settings**: Configure diagnostic settings to send load balancer metrics and logs to Azure Monitor Logs, Storage Account, or Event Hub for analysis and alerting. See [Monitor Azure Load Balancer](monitor-load-balancer.md#creating-a-diagnostic-setting).

- **Use Azure Monitor Insights**: Deploy Load Balancer Insights to access pre-configured dashboards, functional dependency views, and metrics visualization for proactive monitoring. See [Using Insights to monitor and configure your Azure Load Balancer](load-balancer-insights.md).

- **Configure health probe monitoring**: Implement comprehensive health probes to monitor backend instance health and configure appropriate intervals and thresholds for accurate health detection. See [Manage health probes for Azure Load Balancer](manage-probes-how-to.md).

- **Monitor connection metrics**: Track key metrics including Data Path Availability, Health Probe Status, and SYN Count to identify potential security threats and performance issues. See [Standard load balancer diagnostics with metrics, alerts, and resource health](load-balancer-standard-diagnostics.md#multi-dimensional-metrics).

- **Enable VNet flow logs**: Configure virtual network flow logs to analyze traffic patterns flowing through the load balancer and identify potential security threats or anomalous behavior. See [Monitor Azure Load Balancer](monitor-load-balancer.md#analyzing-load-balancer-traffic-with-vnet-flow-logs).

- **Set up security alerts**: Create Azure Monitor alerts for security-relevant events such as failed health probes, unusual traffic patterns, or configuration changes. See [Monitor Azure Load Balancer](monitor-load-balancer.md).

## Compliance and governance

Governance controls ensure consistent security configuration and compliance with organizational policies and regulatory requirements across load balancer deployments.

- **Implement Azure Policy controls**: Deploy Azure Policy definitions to audit and enforce load balancer security configurations, including SKU requirements and network security group associations. See [Azure security baseline for Azure Load Balancer](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline#asset-management).

- **Use resource tagging**: Apply consistent tags to load balancer resources for governance, cost management, and security compliance tracking. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#azure-policies).

- **Enforce naming conventions**: Establish and enforce consistent naming conventions for load balancer resources to improve security management and operational clarity. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md).

- **Implement change management**: Establish formal change management processes for load balancer configuration modifications to prevent unauthorized changes and maintain security posture. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#azure-policies).

- **Monitor compliance status**: Use Microsoft Defender for Cloud to monitor compliance with security baselines and receive recommendations for improving load balancer security configurations. See [Azure security baseline for Azure Load Balancer](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline).

## Backup and recovery

Azure Load Balancer configurations should be protected through proper backup and disaster recovery planning to ensure business continuity and rapid restoration capabilities.

- **Document load balancer configurations**: Maintain comprehensive documentation of load balancer rules, health probes, and backend pool configurations for disaster recovery and compliance purposes. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer).

- **Use Infrastructure as Code**: Deploy load balancers using Azure Resource Manager templates, Bicep, or Terraform to enable consistent, repeatable deployments and version-controlled configuration management. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md).

- **Implement multi-region deployment**: Deploy load balancers across multiple Azure regions with appropriate backend resources to ensure availability during regional outages. See [Business continuity and disaster recovery considerations](/azure/cloud-adoption-framework/scenarios/app-platform/azure-red-hat-enterprise-linux/business-continuity-disaster-recovery#design-considerations).

- **Plan backend resource recovery**: Ensure comprehensive backup and recovery plans for backend virtual machines and applications that receive traffic through the load balancer. See [Backup cloud and on-premises workloads to cloud](/azure/backup/guidance-best-practices#governance-considerations).

- **Test disaster recovery procedures**: Regularly test load balancer failover scenarios and backend resource recovery to validate business continuity plans and recovery time objectives. See [Securely govern your cloud estate](/azure/cloud-adoption-framework/secure/govern#availability-governance).

## Service-specific security

Azure Load Balancer has unique security considerations related to traffic distribution algorithms, session persistence, and integration with other Azure networking services.

- **Configure appropriate distribution mode**: Select the optimal distribution mode (5-tuple, 2-tuple, or 3-tuple hash) based on security requirements, considering that session persistence can create uneven load distribution. See [Azure Load Balancer distribution modes](distribution-mode-concepts.md).

- **Enable TCP reset for better security**: Configure TCP reset on load balancing rules to send bidirectional TCP reset packets on idle timeout, providing clearer connection state information to applications. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md#enable-tcp-resets).

- **Secure floating IP configurations**: When using floating IP for high availability scenarios, ensure proper configuration of loopback interfaces in guest operating systems and implement appropriate security controls. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md#configure-loop-back-interface-when-setting-up-floating-ip).

- **Implement Gateway Load Balancer security**: For network virtual appliances, separate trusted and untrusted traffic on different tunnel interfaces and increase MTU limits to prevent packet drops from VXLAN headers. See [Azure Load Balancer Best Practices](load-balancer-best-practices.md#implement-gateway-load-balancer-configuration-best-practices).

- **Integrate with Azure Firewall**: Route traffic through Azure Firewall when using internal load balancers for additional security inspection and threat protection capabilities. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

- **Use NAT Gateway for outbound connectivity**: Deploy Azure NAT Gateway for predictable outbound IP addresses and enhanced security compared to default outbound access IP mechanisms. See [Tutorial: Protect your public load balancer with Azure DDoS Protection](tutorial-protect-load-balancer-ddos.md#create-nat-gateway).

## Learn more

- [Azure security baseline for Azure Load Balancer](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline)
- [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer)
- [Azure Load Balancer documentation](/azure/load-balancer/)
