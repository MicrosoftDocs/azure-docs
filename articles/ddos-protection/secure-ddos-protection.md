---
title: Secure your Azure DDoS Protection deployment
description: Learn how to secure Azure DDoS Protection, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-ddos-protection
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/17/2025
ai-usage: ai-assisted
---

# Secure your Azure DDoS Protection deployment

Azure DDoS Protection provides enhanced DDoS mitigation features to defend against distributed denial-of-service (DDoS) attacks. It automatically tunes to protect your specific Azure resources in a virtual network, with always-on traffic monitoring, adaptive real-time tuning, and layer 3/layer 4 attack mitigation for all public IP resources.

This article provides security recommendations for Azure DDoS Protection. Implementing these recommendations helps you fulfill your security obligations and improves the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Azure DDoS Protection focuses on ensuring comprehensive coverage of your public IP resources, reducing your attack surface, and layering DDoS protection with other Azure security services for defense in depth.

- **Choose the right DDoS Protection tier for your deployment**: Evaluate whether DDoS Network Protection or DDoS IP Protection best fits your environment. DDoS Network Protection covers all public IP resources in a virtual network and includes cost protection, DDoS Rapid Response access, and WAF discounts. DDoS IP Protection is a per-IP model suited for smaller deployments with fewer public IPs. See [About Azure DDoS Protection tier comparison](/azure/ddos-protection/ddos-protection-sku-comparison).

- **Enable DDoS protection on all virtual networks with public IP resources**: Associate a DDoS protection plan with every virtual network that contains public IP addresses. Unprotected virtual networks are exposed to volumetric and protocol attacks without the adaptive tuning and mitigation that DDoS Protection provides. See [Quickstart: Create and configure Azure DDoS Network Protection](/azure/ddos-protection/manage-ddos-protection).

- **Reduce your attack surface with Azure Private Link**: Use Azure Private Link and private endpoints to access PaaS services over a private connection rather than a public IP. Fewer exposed public IPs means fewer targets for DDoS attacks. See [Azure Private Link](/azure/private-link/private-link-overview).

- **Restrict traffic with Network Security Groups**: Apply NSGs on subnets behind DDoS-protected public IPs to allow only required ports and protocols. Use service tags and application security groups for granular filtering. This limits the traffic that reaches your resources even during an attack. See [Network security groups](/azure/virtual-network/network-security-groups-overview).

- **Layer DDoS Protection with Azure Firewall**: Deploy Azure Firewall behind DDoS-protected public IPs for layer 3/layer 4 stateful inspection in addition to DDoS mitigation. Azure Firewall provides threat intelligence filtering and IDPS that complement DDoS Protection's volumetric attack defense. For more on securing Azure Firewall, see [Secure your Azure Firewall deployment](/azure/firewall/secure-firewall).

- **Add layer 7 protection with Web Application Firewall**: DDoS Protection handles layer 3/layer 4 attacks but doesn't inspect application-layer traffic. Deploy Azure WAF on Application Gateway or Azure Front Door to protect against layer 7 attacks such as SQL injection, cross-site scripting, and HTTP floods. For more on securing WAF, see [Secure your Azure Web Application Firewall deployment](/azure/web-application-firewall/secure-web-application-firewall).

- **Protect all public IP resource types**: Ensure that all supported resource types with public IPs are covered, including virtual machines, load balancers, Application Gateways, Azure Bastion hosts, VPN Gateways, and Azure Firewall instances. Review the list of supported resources periodically as your deployment grows. See [Azure DDoS Protection features](/azure/ddos-protection/ddos-protection-features).

- **Use reference architectures for new deployments**: Follow Azure's validated reference architectures that incorporate DDoS Protection, including load-balanced VMs, n-tier applications with WAF, hub-and-spoke topologies, and PaaS web applications with Traffic Manager failover. See [Azure DDoS Protection reference architectures](/azure/ddos-protection/ddos-protection-reference-architectures).

## Identity and access management

Identity and access management for Azure DDoS Protection controls who can create, modify, and associate DDoS protection plans and who can view attack telemetry.

- **Assign the least privilege role for DDoS management**: Use the built-in Network Contributor role for users who need to manage DDoS protection plans. For read-only access, use the Network Reader role. Avoid assigning broader roles like Contributor or Owner when only network management is needed. See [Manage Azure DDoS Protection permissions](/azure/ddos-protection/manage-permissions).

- **Create a custom RBAC role for DDoS operations**: If Network Contributor is too broad, create a custom role that includes only the required DDoS actions: `Microsoft.Network/ddosProtectionPlans/read`, `Microsoft.Network/ddosProtectionPlans/write`, `Microsoft.Network/ddosProtectionPlans/delete`, and `Microsoft.Network/ddosProtectionPlans/join/action`. See [Azure custom roles](/azure/role-based-access-control/custom-roles).

- **Grant the join action for virtual network operations**: Ensure that users who manage virtual networks associated with a DDoS plan have the `Microsoft.Network/ddosProtectionPlans/join/action` permission. Without this permission, virtual network operations fail after DDoS protection is enabled on the network. See [Manage Azure DDoS Protection permissions](/azure/ddos-protection/manage-permissions).

- **Restrict DDoS plan creation to authorized personnel**: Limit the ability to create DDoS protection plans to a small set of administrators. A single DDoS Network Protection plan can cover multiple subscriptions and regions, so unnecessary plan creation leads to uncontrolled costs. Use Azure Policy or role assignments to enforce this restriction. See [About Azure DDoS Protection tier comparison](/azure/ddos-protection/ddos-protection-sku-comparison).

- **Use Microsoft Entra Conditional Access for management operations**: Require multifactor authentication and compliant devices when administrators access the Azure portal or Azure Resource Manager APIs to manage DDoS protection plans. This prevents unauthorized modifications even if credentials are compromised. See [Microsoft Entra Conditional Access](/azure/active-directory/conditional-access/overview).

## Data protection

Data protection for Azure DDoS Protection covers securing the telemetry, mitigation logs, and flow data that the service generates during attack detection and mitigation.

- **Secure Log Analytics workspaces that receive DDoS data**: DDoS diagnostic logs, mitigation flow logs, and mitigation reports can contain source IP addresses, port information, and protocol details. Restrict access to the Log Analytics workspace that receives this data using workspace-level RBAC. See [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access).

- **Encrypt diagnostic log storage**: If you archive DDoS diagnostic logs to an Azure Storage account, enable storage encryption with customer-managed keys for full control over the encryption lifecycle. By default, Azure Storage encrypts data at rest with Microsoft-managed keys, but customer-managed keys provide additional control. See [Azure Storage encryption](/azure/storage/common/storage-service-encryption).

- **Restrict access to mitigation flow log data**: DDoS mitigation flow logs contain per-flow details including source and destination IPs, ports, and protocols for traffic processed during an attack. Limit access to this data to your security operations team using RBAC on the diagnostic settings destination. See [View and configure DDoS diagnostic logging](/azure/ddos-protection/ddos-view-diagnostic-logs).

- **Secure Event Hubs used for log streaming**: If you stream DDoS logs to Event Hubs for SIEM integration (such as Splunk or Microsoft Sentinel), use managed identities for authentication and restrict the Event Hubs namespace with network rules. See [Authorize access with Microsoft Entra ID](/azure/event-hubs/authorize-access-azure-active-directory).

## Logging and monitoring

Logging and monitoring for Azure DDoS Protection ensures that you have visibility into attack events, mitigation actions, and traffic baselines, enabling rapid detection and response.

- **Enable diagnostic settings on all protected public IPs**: Configure diagnostic settings to send DDoSProtectionNotifications, DDoSMitigationFlowLogs, and DDoSMitigationReports to a Log Analytics workspace. These logs provide critical details about attack timing, traffic volume, attack vectors, and mitigation effectiveness. See [View and configure DDoS diagnostic logging](/azure/ddos-protection/ddos-view-diagnostic-logs).

- **Configure metric alerts for the "Under DDoS attack or not" signal**: Create an Azure Monitor metric alert on the "Under DDoS attack or not" metric for every protected public IP address. This metric transitions to 1 when an attack is detected and triggers immediate notification to your security team. See [Configure Azure DDoS Protection metric alerts](/azure/ddos-protection/alerts).

- **Deploy enriched alert templates**: Use the provided ARM templates to deploy alerts that include traffic analytics, attack details, and availability information. These enriched alerts provide context beyond the basic attack notification, including dropped packet counts and resource availability status. See [Configure Azure DDoS Protection diagnostic alert templates](/azure/ddos-protection/ddos-diagnostic-alert-templates).

- **Enforce diagnostic logging with Azure Policy**: Assign the built-in policy "Public IP addresses should have resource logs enabled for Azure DDoS Protection" to audit or automatically deploy diagnostic settings across your environment. This prevents gaps where new public IPs are deployed without logging. See [Azure DDoS Protection policy reference](/azure/ddos-protection/policy-reference).

- **Stream logs to Microsoft Sentinel for correlation**: Forward DDoS diagnostic logs to Microsoft Sentinel to correlate DDoS attack data with other security events. This helps identify whether a DDoS attack is a diversion tactic covering more targeted intrusions. See [Monitor Azure DDoS Protection](/azure/ddos-protection/monitor-ddos-protection).

- **Monitor mitigation reports for attack analysis**: Review both incremental (every 5 minutes during an attack) and post-mitigation reports. These reports include attack vectors, traffic statistics, drop reasons, and top source countries and ASNs, which inform defensive tuning and incident response. See [View and configure DDoS diagnostic logging](/azure/ddos-protection/ddos-view-diagnostic-logs).

- **Enroll in DDoS Rapid Response for critical workloads**: If you use DDoS Network Protection, engage the DDoS Rapid Response (DRR) team during active attacks for specialized investigation and post-attack analysis. Create a severity A support request when mitigation is ineffective or when an attack causes severe performance degradation. See [Azure DDoS Rapid Response](/azure/ddos-protection/ddos-rapid-response).

- **Establish a DDoS response team and runbook**: Create a dedicated response team with defined roles and escalation procedures before an attack occurs. Document how to engage DRR, which metrics and logs to review, and how to communicate status to stakeholders. See [Azure DDoS Protection response strategy](/azure/ddos-protection/ddos-response-strategy).

## Compliance and governance

Compliance and governance for Azure DDoS Protection helps ensure consistent protection across your organization and alignment with regulatory and architectural requirements.

- **Enforce DDoS protection on virtual networks with Azure Policy**: Assign the built-in policy "Virtual networks should be protected by Azure DDoS Protection" with the Modify effect to automatically enable DDoS protection on noncompliant virtual networks, or use the Audit effect to report gaps. See [Azure DDoS Protection policy reference](/azure/ddos-protection/policy-reference).

- **Centralize DDoS protection under a single plan**: Use a single DDoS Network Protection plan across multiple subscriptions and regions to maintain consistent protection and simplify management. A single plan can cover up to 100 protected public IPs (with overage charges beyond that). Consolidating plans prevents configuration drift and uncontrolled costs. See [About Azure DDoS Protection tier comparison](/azure/ddos-protection/ddos-protection-sku-comparison).

- **Inventory all public IP addresses and their protection status**: Maintain a current inventory of all public IP resources across your subscriptions and verify that each is associated with a DDoS protection plan. Use Azure Resource Graph queries to identify unprotected public IPs. See [Azure DDoS Protection optimization guide](/azure/ddos-protection/ddos-optimization-guide).

- **Enable cost protection for DDoS Network Protection**: Register for cost protection to receive data-transfer and application scale-out service credits when a documented DDoS attack causes resource scaling. This safeguards your budget against unexpected costs during attacks. See [Azure DDoS Protection features](/azure/ddos-protection/ddos-protection-features).

- **Conduct regular DDoS simulation testing**: Validate your DDoS protection configuration and response procedures by running simulation tests through approved testing partners. Testing reveals misconfigurations, measures actual mitigation effectiveness, and trains your response team. See [Test through simulations](/azure/ddos-protection/test-through-simulations).

- **Review and optimize DDoS costs quarterly**: Evaluate whether each protected public IP still requires protection and whether IP Protection or Network Protection is more cost-effective for your current deployment. Remove unnecessary public IPs and consider Private Link or CDN consolidation to reduce your protected IP count. See [Azure DDoS Protection optimization guide](/azure/ddos-protection/ddos-optimization-guide).

## Backup and recovery

Backup and recovery for Azure DDoS Protection focuses on maintaining service availability and protection continuity during attacks and regional failures.

- **Design multi-region architectures with DDoS protection at each region**: Deploy resources in multiple Azure regions with DDoS protection enabled on virtual networks in each region. Use Azure Traffic Manager or Azure Front Door for failover so that if one region is overwhelmed by an attack, traffic routes to a healthy region. See [Azure DDoS Protection reference architectures](/azure/ddos-protection/ddos-protection-reference-architectures).

- **Use autoscaling to absorb attack traffic**: Configure Virtual Machine Scale Sets or App Service autoscaling rules to scale out during traffic spikes caused by DDoS attacks. While DDoS Protection mitigates most attack traffic, some legitimate traffic increase and pass-through traffic during mitigation ramp-up require additional capacity. See [Azure DDoS Protection fundamental best practices](/azure/ddos-protection/fundamental-best-practices).

- **Distribute workloads behind load balancers**: Place application instances behind Azure Load Balancer, Application Gateway, or Azure Front Door to distribute traffic across multiple instances and availability zones. This reduces the impact of any single point of failure during an attack. See [Azure DDoS Protection fundamental best practices](/azure/ddos-protection/fundamental-best-practices).

- **Plan for DDoS Protection plan recovery**: A DDoS protection plan can't be moved between subscriptions or resource groups. If you need to recover or restructure your plan, you must delete and recreate it, then reassociate your virtual networks. Document your current plan-to-VNet associations and RBAC assignments so they can be restored quickly. See [Quickstart: Create and configure Azure DDoS Network Protection](/azure/ddos-protection/manage-ddos-protection).

- **Include DDoS scenarios in your disaster recovery drills**: Test that your failover mechanisms work correctly when a DDoS attack targets your primary region. Verify that secondary-region virtual networks also have DDoS protection enabled and that monitoring and alerting are configured identically. See [Azure DDoS Protection response strategy](/azure/ddos-protection/ddos-response-strategy).

## Next steps

- [Azure DDoS Protection overview](/azure/ddos-protection/ddos-protection-overview)
- [Azure DDoS Protection fundamental best practices](/azure/ddos-protection/fundamental-best-practices)
- [Azure DDoS Protection features](/azure/ddos-protection/ddos-protection-features)
- [Monitor Azure DDoS Protection](/azure/ddos-protection/monitor-ddos-protection)
- [Secure your Virtual Network deployment](/azure/virtual-network/secure-virtual-network)
- [What is Azure network security?](../networking/security/network-security.md)
