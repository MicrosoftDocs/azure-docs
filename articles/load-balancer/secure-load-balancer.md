---
title: Secure your Azure Load Balancer deployment
description: Learn how to secure Azure Load Balancer, with best practices for protecting your deployment.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: best-practice
ms.custom: horz-security
ms.date: 05/11/2026
ai-usage: ai-assisted
---

# Secure your Azure Load Balancer deployment

Azure Load Balancer provides Layer 4 load balancing capabilities to distribute incoming and outbound traffic among healthy backend instances. Because Load Balancer operates at the transport layer, you must combine it with network controls, identity controls, monitoring, and workload-level encryption to secure the full deployment.

This article provides security recommendations for Azure Load Balancer. Implementing these recommendations helps you fulfill your security obligations and improves the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

> [!IMPORTANT]
> Basic Load Balancer was retired on September 30, 2025. Existing Basic Load Balancers remain operational but are unsupported and not covered by SLA guarantees. Upgrade to Standard Load Balancer as soon as possible. For more information, see [Upgrading from Basic Load Balancer - Guidance](load-balancer-basic-upgrade-guidance.md).

## Network security

Network security for Azure Load Balancer focuses on limiting inbound exposure, controlling outbound connectivity, validating backend health, and integrating with other Azure network security services.

- **Use Standard Load Balancer SKU**: Deploy Standard Load Balancer for production workloads. Standard Load Balancer follows a secure-by-default model with closed inbound connections, supports availability zones, and provides a 99.99% SLA. Basic Load Balancer was retired on September 30, 2025, and shouldn't be used for new deployments. See [Azure Load Balancer overview](load-balancer-overview.md).

- **Implement network security groups on subnets and network interfaces**: Apply network security groups (NSGs) to backend subnets and network interfaces to explicitly permit only required ports, protocols, and source IP ranges. Standard Load Balancer doesn't allow inbound flows until an NSG explicitly permits the traffic. See [Azure Load Balancer security baseline](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline#network-security).

- **Allow Azure Load Balancer health probe traffic**: Ensure that NSGs, user-defined routes, and local firewall policies allow health probe traffic from IP address 168.63.129.16. Blocked probes cause healthy backend instances to be removed from rotation and can create avoidable outages. See [Azure Load Balancer health probes](load-balancer-custom-probe-overview.md).

- **Use internal load balancer for private workloads**: Deploy an internal load balancer with private frontend IP addresses when the service doesn't need direct internet exposure. Use virtual network peering, VPN, ExpressRoute, Azure Firewall, or private access patterns to control who can reach the frontend. See [Azure Load Balancer components](components.md#frontend-ip-configurations).

- **Protect public load balancers with Azure DDoS Protection**: Enable Azure DDoS Network Protection on the virtual network that hosts public load balancers. DDoS Protection provides enhanced DDoS mitigation and detection capabilities that monitor endpoints for threats and signs of abuse. See [Protect your public load balancer with Azure DDoS Protection](tutorial-protect-load-balancer-ddos.md).

- **Use explicit outbound connectivity**: Don't rely on default outbound access. Default outbound access retired on September 30, 2025, so use Azure NAT Gateway for predictable outbound IP addresses, or configure explicit Standard Load Balancer outbound rules when NAT Gateway isn't appropriate. See [Outbound connections in Azure](load-balancer-outbound-connections.md) and [Azure NAT Gateway overview](../nat-gateway/nat-overview.md).

- **Configure appropriate distribution mode**: Select the distribution mode that fits your application and security requirements. Use the default 5-tuple hash for most workloads, and use session persistence only when the application requires it because persistence can create uneven distribution and reduce resiliency. See [Azure Load Balancer distribution modes](distribution-mode-concepts.md).

- **Enable TCP reset for clearer connection handling**: Configure TCP reset on load-balancing rules so clients and backend applications receive bidirectional TCP reset packets on idle timeout. Clear connection state helps applications recover faster and reduces ambiguous half-open connections. See [Azure Load Balancer best practices](load-balancer-best-practices.md#enable-tcp-resets).

- **Secure floating IP and Gateway Load Balancer designs**: When you use floating IP for high-availability scenarios, configure loopback interfaces correctly and apply host firewall controls. For Gateway Load Balancer and network virtual appliances, separate trusted and untrusted traffic on different tunnel interfaces and account for VXLAN header overhead. See [Azure Load Balancer best practices](load-balancer-best-practices.md).

- **Integrate inspection services when needed**: Azure Load Balancer is a Layer 4 service and doesn't inspect application payloads. Route traffic through Azure Firewall, network virtual appliances, Application Gateway, or Azure Front Door when you need firewalling, web application firewall, or Layer 7 inspection. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

## Identity and access management

Identity and access management for Azure Load Balancer controls who can create, update, delete, and review load balancer resources, rules, probes, frontend IPs, backend pools, and outbound connectivity.

- **Use Microsoft Entra ID for management-plane access**: Require administrators to authenticate with Microsoft Entra ID when using the Azure portal, Azure CLI, Azure PowerShell, or Azure Resource Manager APIs. Apply Conditional Access controls such as multifactor authentication, compliant device requirements, and sign-in risk policies for privileged networking roles. See [Microsoft Entra Conditional Access](/entra/identity/conditional-access/overview).

- **Implement Azure role-based access control**: Assign Azure RBAC roles to users, groups, managed identities, and automation accounts that manage load balancers. Use built-in roles such as Network Contributor only where the full network-management scope is required. See [What is Azure role-based access control?](../role-based-access-control/overview.md).

- **Use least privilege access**: Avoid broad Owner or Contributor assignments for routine load balancer operations. Create custom roles when operators need only specific permissions for load balancer read, write, rule, probe, or backend pool operations. See [Azure custom roles](../role-based-access-control/custom-roles.md).

- **Use Privileged Identity Management for elevated access**: Make high-impact roles eligible instead of permanently assigned by using Microsoft Entra Privileged Identity Management (PIM). Require approval, multifactor authentication, justification, and time-bound activation for roles that can change production load balancers. See [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure).

- **Separate duties for networking and workload teams**: Limit who can change load-balancing rules, inbound NAT rules, outbound rules, backend pool membership, and probe settings. Separation of duties reduces the risk that a single compromised identity can both expose a service and change the workload behind it. See [Azure RBAC best practices](../role-based-access-control/best-practices.md).

- **Audit management-plane changes**: Monitor Azure Activity Log events for load balancer configuration changes, role assignments, and diagnostic setting changes. Alert on unexpected updates to frontend IP configurations, rule mappings, outbound rules, or backend pool membership. See [Monitor Azure Load Balancer](monitor-load-balancer.md).

## Data protection

Data protection for Azure Load Balancer focuses on protecting traffic handled by backend workloads and protecting configuration and telemetry because Load Balancer doesn't store customer application data.

- **Encrypt application traffic end to end**: Azure Load Balancer operates at Layer 4 and doesn't terminate TLS or inspect payloads. Configure TLS on the backend application or on a Layer 7 service in front of the backend so traffic remains encrypted where required. See [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer#security).

- **Use the right service for TLS termination**: If your HTTP or HTTPS workload requires TLS termination, certificate management, URL routing, or web application firewall inspection, use Azure Application Gateway or Azure Front Door instead of relying on Load Balancer for those functions. See [Azure Load Balancer overview](load-balancer-overview.md).

- **Protect backend secrets and certificates**: Store TLS certificates, private keys, and application secrets used by backend instances in Azure Key Vault. Use managed identities for backend workloads instead of embedding secrets in scripts, templates, or VM extensions. See [Azure Key Vault overview](/azure/key-vault/general/overview).

- **Secure diagnostic data destinations**: Load balancer metrics, flow logs, and archived diagnostics can include IP addresses, ports, and topology details. Restrict access to Log Analytics workspaces, storage accounts, and Event Hubs that receive diagnostics, and use customer-managed keys for storage accounts when your compliance requirements call for them. See [Azure Storage encryption](../storage/common/storage-service-encryption.md).

- **Avoid exposing sensitive topology in names and tags**: Don't include secrets, internal project names, or sensitive network details in load balancer names, rule names, public IP DNS labels, or resource tags. These values can appear in logs, exports, alerts, and access reviews. See [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md).

## Logging and monitoring

Logging and monitoring for Azure Load Balancer provides visibility into availability, health probes, traffic patterns, and configuration changes so teams can detect security and reliability issues quickly.

- **Enable diagnostic settings**: Configure diagnostic settings to send load balancer metrics and supported logs to a Log Analytics workspace, storage account, or Event Hubs for analysis and retention. See [Monitor Azure Load Balancer](monitor-load-balancer.md#creating-a-diagnostic-setting).

- **Use Azure Monitor Insights**: Deploy Load Balancer Insights to view preconfigured dashboards, functional dependency diagrams, resource health, and metrics for proactive monitoring. See [Use Insights to monitor and configure Azure Load Balancer](load-balancer-insights.md).

- **Configure health probe monitoring**: Implement health probes that accurately represent application readiness, not just host availability. Monitor probe status so backend failures, firewall blocks, and application outages are detected before users are affected. See [Manage health probes for Azure Load Balancer](manage-probes-how-to.md).

- **Monitor connection and availability metrics**: Track metrics such as Data Path Availability, Health Probe Status, SYN Count, SNAT Connection Count, and Allocated SNAT Ports. Use alerts to identify failed backends, anomalous connection spikes, or outbound port exhaustion. See [Standard Load Balancer diagnostics with metrics, alerts, and resource health](load-balancer-standard-diagnostics.md#multi-dimensional-metrics).

- **Enable virtual network flow logs**: Configure virtual network flow logs to analyze traffic patterns around backend subnets and identify suspicious or unexpected flows. Forward logs to your security information and event management (SIEM) system for correlation with workload and identity events. See [Monitor Azure Load Balancer](monitor-load-balancer.md#analyzing-load-balancer-traffic-with-vnet-flow-logs).

- **Set up security and operations alerts**: Create Azure Monitor alerts for failed health probes, low data path availability, unusual traffic increases, SNAT exhaustion indicators, and unexpected Activity Log changes. Include runbook links and owner information in alert actions. See [Monitor Azure Load Balancer](monitor-load-balancer.md).

## Compliance and governance

Compliance and governance for Azure Load Balancer helps ensure consistent, supportable, and auditable configurations across subscriptions, regions, and environments.

- **Implement Azure Policy controls**: Use Azure Policy to audit and enforce load balancer requirements such as Standard SKU usage, diagnostic settings, tagging, and NSG associations on backend subnets. See [Azure Load Balancer security baseline](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline#asset-management).

- **Standardize deployment with infrastructure as code**: Deploy load balancers, public IPs, rules, probes, backend pools, and outbound configurations with ARM templates, Bicep, or other approved infrastructure-as-code pipelines. Version-controlled templates reduce drift and provide evidence for compliance reviews. See [Create a public load balancer using Bicep](quickstart-load-balancer-standard-public-bicep.md) and [Create a public load balancer using an ARM template](quickstart-load-balancer-standard-public-template.md).

- **Use resource tagging**: Apply consistent tags for workload owner, data classification, environment, business criticality, and disaster recovery tier. Tags support cost management, compliance tracking, incident routing, and ownership reviews. See [Azure resource naming and tagging decision guide](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide).

- **Review unsupported and legacy configurations**: Inventory Basic Load Balancers, implicit outbound dependencies, unmanaged public IPs, and missing diagnostics. Prioritize migration to Standard Load Balancer, NAT Gateway or explicit outbound rules, and monitored configurations. See [Upgrade from Basic to Standard Load Balancer](load-balancer-basic-upgrade-guidance.md).

- **Control changes through approved workflows**: Require change review for frontend IPs, inbound rules, NAT rules, outbound rules, backend pool membership, probe paths, and idle timeout settings. Use Azure Activity Log and deployment history to validate that changes came from approved identities and pipelines. See [Azure Resource Manager deployment history](../azure-resource-manager/templates/deployment-history.md).

## Backup and recovery

Backup and recovery for Azure Load Balancer focuses on preserving the configuration, documenting dependencies, and designing resilient topologies that keep traffic flowing during instance, zone, or regional failures.

- **Export and version the load balancer configuration**: Export the Standard Load Balancer configuration as an ARM template or Bicep file and store it in source control. Capture frontend IP configurations, public IP resources, backend pools, load-balancing rules, inbound NAT rules, outbound rules, health probes, and dependencies so you can restore or recreate the deployment quickly. See [Export templates in the Azure portal](../azure-resource-manager/templates/export-template-portal.md) and [Export templates with Azure CLI](../azure-resource-manager/templates/export-template-cli.md).

- **Document the topology before changes**: Record frontend IP addresses, DNS names, backend pool members, rule-to-probe mappings, NAT mappings, outbound connectivity design, NSG dependencies, route tables, and owning teams before planned changes. Current documentation reduces recovery time when a rollback or regional rebuild is needed. See [Azure Load Balancer components](components.md).

- **Use cross-region load balancer for multi-region failover**: Deploy Cross-region Load Balancer, also known as Global Load Balancer, when you need a single global frontend that distributes traffic across regional load balancers. Pair it with regional health monitoring and tested failover procedures. See [Cross-region load balancer](cross-region-overview.md) and [Deploy a cross-region load balancer using an ARM template](tutorial-deploy-cross-region-load-balancer-template.md).

- **Use zone-redundant frontends for availability zone resilience**: Use Standard Load Balancer with zone-redundant frontend IP configurations where availability zones are supported. Standard SKU includes built-in support for zone redundancy, and a zone-redundant frontend helps keep the data path available if a zone fails. See [Azure Load Balancer best practices](load-balancer-best-practices.md#design-for-high-availability-and-disaster-recovery).

- **Distribute backend pools across zones**: Place backend instances in multiple availability zones by using Virtual Machine Scale Sets or zonal virtual machines. Zone-redundant backend pools reduce the chance that a single zone failure removes all healthy instances from rotation. See [Migrate Load Balancer to availability zone support](/azure/reliability/migrate-load-balancer).

- **Configure health probes for automatic in-region failover**: Health probes determine which backend instances receive traffic. Configure probes against application-ready endpoints, choose appropriate intervals and thresholds, and test probe behavior during maintenance so traffic automatically fails over to healthy instances within the region. See [Manage health probes for Azure Load Balancer](manage-probes-how-to.md).

- **Test failover regularly**: Exercise instance, zone, and regional failover scenarios on a defined schedule. Validate that probes remove unhealthy instances, Cross-region Load Balancer or DNS routing sends traffic to the secondary region, outbound connectivity still works, and monitoring alerts reach the right responders. See [Azure Load Balancer best practices](load-balancer-best-practices.md).

## Next steps

- [Azure Load Balancer overview](load-balancer-overview.md)
- [Azure Load Balancer best practices](load-balancer-best-practices.md)
- [Monitor Azure Load Balancer](monitor-load-balancer.md)
- [Azure Load Balancer security baseline](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline)
- [Upgrade from Basic to Standard Load Balancer](load-balancer-basic-upgrade-guidance.md)
- [What is Azure network security?](../networking/security/network-security.md)
