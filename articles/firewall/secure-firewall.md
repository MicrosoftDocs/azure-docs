---
title: Secure your Azure Firewall deployment
description: Learn how to secure Azure Firewall deployments by using network, identity, data protection, monitoring, governance, and recovery best practices.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/11/2026
ai-usage: ai-assisted
---

# Secure your Azure Firewall deployment

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. As a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability, Azure Firewall provides centralized policy enforcement for traffic that enters, leaves, and moves across your Azure networks.

This article provides security recommendations for Azure Firewall. Implementing these recommendations helps you fulfill your security obligations and improves the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md)

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Azure Firewall focuses on secure deployment, centralized inspection, and policy controls that reduce exposure across hub-and-spoke and hybrid networks.

- **Deploy Azure Firewall in a dedicated subnet**: Use the required `AzureFirewallSubnet` with a minimum size of /26, don't deploy other resources in the subnet, and keep workload route tables on workload subnets instead of the firewall subnet unless a documented forced-tunneling design requires firewall-subnet routes. For more information, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

- **Choose the right Azure Firewall SKU**: Azure Firewall is available in three SKUs: Basic for small and medium-sized businesses with throughput up to 250 Mbps, Standard, and Premium. Use Premium when you need advanced security features such as IDPS, TLS inspection, and URL filtering. Use Standard or Premium when you need web categories, which aren't available in Basic. For more information, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

- **Enable threat intelligence-based filtering**: Configure threat intelligence-based filtering to alert on traffic from known malicious IP addresses, FQDNs, and URLs. Use Standard or Premium when you need alert and deny mode, because Basic supports alert mode only. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md) and [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

- **Implement IDPS for advanced threat detection**: Use Azure Firewall Premium intrusion detection and prevention system (IDPS) to detect and block malicious network activity based on Microsoft-managed signatures. Tune signature actions to reduce false positives and deny high-confidence threats. For more information, see [Azure Firewall Premium features](premium-features.md#idps).

- **Configure DNS proxy functionality**: Enable DNS proxy so clients and Azure Firewall use consistent name resolution for FQDN-based rules. This DNS configuration reduces the risk of rule bypass or connection failures caused by different DNS answers. For more information, see [Azure Firewall DNS Proxy details](dns-details.md).

- **Use managed rule targets for Azure and Microsoft services**: Use service tags in network rules and FQDN tags in application rules instead of manually maintaining IP address ranges and service endpoint lists. For TCP or UDP protocols that need domain-based filtering, use FQDN filtering in network rules and enable DNS proxy. For more information, see [Overview of Azure Firewall service tags](service-tags.md), [FQDN tags overview for Azure Firewall](fqdn-tags.md), and [Azure Firewall FQDN filtering in network rules](fqdn-filtering-network-rules.md).

- **Use forced tunneling for hybrid environments**: Configure forced tunneling when internet-bound traffic must route through on-premises security appliances or centralized inspection paths. Enable the management network interface and `AzureFirewallManagementSubnet` so firewall management traffic stays separate from customer traffic. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

- **Enable TLS inspection for encrypted traffic**: Use Azure Firewall Premium TLS inspection to inspect encrypted outbound and east-west traffic where your security policy requires it. Store and manage the required certificates in Azure Key Vault. For more information, see [Azure Firewall Premium certificates](premium-certificates.md).

- **Evaluate explicit proxy for controlled HTTP/S egress**: Use Azure Firewall explicit proxy (preview) when you can configure applications to send outbound HTTP/S traffic directly to the firewall private IP address without a user-defined route. Use application rules for explicit proxy traffic, and use a proxy auto-configuration (PAC) file when you need centrally managed client proxy settings. For more information, see [Azure Firewall explicit proxy (preview)](explicit-proxy.md).

- **Enable web categories**: Use web categories to control access to categories of websites, such as social networking or gambling, that don't meet your acceptable use policy. Web categories reduce administrative overhead compared to maintaining allow and deny lists of individual FQDNs. For more information, see [Azure Firewall web categories](web-categories.md).

- **Plan SNAT capacity for outbound scale**: Add multiple public IP addresses or integrate with Azure NAT Gateway when you need more SNAT ports for high-volume outbound workloads. Don't use NAT Gateway with secured virtual hub firewalls. Use NAT Gateway V2 when you need zone-redundant SNAT with a zone-redundant firewall. For more information, see [Scale SNAT ports with Azure NAT Gateway](integrate-with-nat-gateway.md) and [Integrate Azure Firewall with NAT Gateway V2](integrate-with-nat-gateway-v2.md).

## Identity and access management

Identity and access management for Azure Firewall controls who can administer firewall resources, modify Firewall Policy, and automate management-plane operations.

- **Use Microsoft Entra ID for management-plane access**: Require administrators and automation identities to authenticate through Microsoft Entra ID when they manage Azure Firewall through the Azure portal, Azure Resource Manager, Azure CLI, or PowerShell. For more information, see [About roles and permissions for Azure Firewall](roles-permissions.md).

- **Assign least-privilege Azure RBAC roles**: Scope built-in roles such as Network Contributor to the specific firewall, firewall policy, resource group, or management group that administrators need to manage. Avoid broad Owner or Contributor assignments when network-only permissions are sufficient. For more information, see [About Azure Firewall roles and permissions](roles-permissions.md).

- **Create custom roles for firewall-policy-only access**: Use custom Azure RBAC roles when administrators need to edit Firewall Policy but shouldn't manage virtual networks, public IP addresses, route tables, or other network resources. For more information, see [Azure custom roles](../role-based-access-control/custom-roles.md).

- **Use Privileged Identity Management for elevation**: Make high-impact roles eligible rather than permanently active. Require approval, justification, multifactor authentication, and time-bound activation for role activations that grant write access to Azure Firewall, Firewall Policy, public IP addresses, and virtual network resources — such as Network Contributor and any custom firewall administrator roles. For more information, see [Privileged Identity Management integration with Azure RBAC](../role-based-access-control/pim-integration.md).

- **Require Conditional Access for admin sessions**: Apply Conditional Access policies that require multifactor authentication and compliant devices for identities that can create, modify, or delete Azure Firewall instances, Firewall Policies, public IP addresses, route tables, and the hub virtual networks the firewall depends on. For more information, see [Require MFA for Azure management](/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt).

- **Limit service principal permissions for automation**: Assign automation identities only the permissions required to deploy, export, or update firewall resources and policies, and scope those assignments as narrowly as possible. Prefer managed identities when supported by your automation platform. For more information, see [About roles and permissions for Azure Firewall](roles-permissions.md).

- **Separate duties across administrator tiers**: Design a tiered administrator model where DevOps teams can request or deploy application changes but can't directly modify shared security policy, and security administrators approve or manage Firewall Policy. Use role assignments, custom roles, and deployment pipelines to enforce separation of duties. For more information, see [About roles and permissions for Azure Firewall](roles-permissions.md).

## Data protection

Data protection for Azure Firewall focuses on protecting inspected traffic, configuration data, certificates, and logs that can contain sensitive network information.

- **Implement TLS inspection with proper certificate management**: Store the TLS inspection intermediate CA certificate in Azure Key Vault and grant the firewall managed identity only the required secret permissions. Use the Key Vault access policy model for this integration, because Azure Firewall doesn't support Azure RBAC authorization for retrieving TLS inspection certificates. For more information, see [Azure Firewall Premium certificates](premium-certificates.md).

- **Restrict access to encrypted protocols**: Configure firewall rules to allow encrypted protocols (such as HTTPS) and block or restrict plaintext ports where business requirements allow. Combining rule collections with priorities and processing order helps enforce these decisions predictably. For more information, see [Azure Firewall rule processing logic](rule-processing.md).

- **Use URL filtering for granular control**: Apply URL filtering to control complete URLs rather than only FQDNs when you need precise allow or deny decisions for web traffic. This filtering helps block malicious paths hosted on otherwise legitimate domains. For more information, see [Azure Firewall Premium features](premium-features.md#url-filtering).

- **Restrict access to diagnostic data**: Treat Azure Firewall logs as sensitive because they can contain source and destination IP addresses, URLs, ports, and rule decisions. Use RBAC on Log Analytics workspaces, storage accounts, and event hubs that receive firewall diagnostics. For more information, see [Monitor Azure Firewall logs and metrics](monitor-firewall.md).

## Logging and monitoring

Logging and monitoring for Azure Firewall provide visibility into traffic flows, policy decisions, threats, performance, and configuration changes for investigation and response.

- **Enable Azure Firewall diagnostic logging**: Configure diagnostic settings to send Azure Firewall logs and metrics to a Log Analytics workspace, storage account, or event hub. Capture network rule, application rule, NAT rule, threat intelligence, IDPS, DNS proxy, internal FQDN resolution failure, top flow, and flow trace logs as appropriate for your deployment. For more information, see [Monitor Azure Firewall logs and metrics](monitor-firewall.md).

- **Use resource-specific structured logs**: Send Azure Firewall logs to resource-specific Log Analytics tables such as `AZFWApplicationRule`, `AZFWNetworkRule`, `AZFWNatRule`, `AZFWThreatIntel`, `AZFWIdpsSignature`, and `AZFWDnsQuery` instead of relying only on the legacy `AzureDiagnostics` table. Resource-specific tables improve query performance, schema discovery, and table-level access control. For more information, see [Monitor Azure Firewall logs and metrics](monitor-firewall.md#resource-specific-mode).

- **Integrate with Microsoft Sentinel for threat detection**: Connect Azure Firewall logs to Microsoft Sentinel so security operations teams can correlate firewall events with identity, endpoint, and workload signals. Use analytics rules and workbooks to detect malware and suspicious traffic patterns. For more information, see [Detect malware with Azure Firewall and Microsoft Sentinel](detect-malware-with-sentinel.md).

- **Use Security Copilot for IDPS investigations**: When your organization uses Microsoft Security Copilot, enable the Azure Firewall integration to investigate IDPS detections across firewalls by using structured IDPS logs in Log Analytics and appropriate RBAC permissions. For more information, see [Azure Firewall integration in Microsoft Security Copilot](firewall-copilot.md).

- **Monitor threat intelligence alerts**: Create alerts and operational processes for threat intelligence hits so analysts can quickly investigate traffic to or from known malicious sources. Use automation for high-confidence indicators when response actions are well tested. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md).

- **Configure performance monitoring and alerting**: Monitor throughput, latency, firewall health, SNAT port utilization, and rule hit counts by using Azure Monitor. Alert on capacity or availability thresholds before users experience application outages. For more information, see [Best practices for Azure Firewall performance](firewall-best-practices.md).

- **Monitor Resource Health for firewall availability**: Use Azure Resource Health with Azure Firewall metrics so operations teams can detect platform degradation, investigate service health events, and receive notifications when firewall availability is affected. For more information, see [Resource Health overview](/azure/service-health/resource-health-overview).

- **Review policy analytics and rule changes**: Use Policy Analytics to identify unused rules and overly broad rules. Use rule set change tracking to detect unexpected configuration changes. Regular reviews reduce rule sprawl and improve policy effectiveness. For more information, see [Azure Firewall Policy Analytics](policy-analytics.md) and [Track Azure Firewall rule set changes](rule-set-change-tracking.md).

- **Use Azure Firewall Workbook for analysis**: Deploy and review Azure Firewall Workbook dashboards to analyze events, rules, threats, and trends across multiple firewalls from a single Azure portal experience. For more information, see [Azure Firewall Workbook](firewall-workbook.md).

- **Set log retention for investigations and compliance**: Configure retention periods based on incident response, audit, and regulatory needs. Store long-term archives in protected storage when operational workspaces use shorter retention. For more information, see [Monitor Azure Firewall logs and metrics](monitor-firewall.md).

## Compliance and governance

Compliance and governance for Azure Firewall help you maintain consistent policy, inventory, and security baselines across subscriptions, regions, and network architectures.

- **Use Azure Policy for configuration enforcement**: Assign built-in and custom Azure Policy definitions to audit or enforce requirements such as threat intelligence, diagnostic settings, allowed SKUs, and availability zone deployment. For more information, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

- **Maintain resource inventory with Azure Resource Graph**: Query Azure Firewall, Firewall Policy, public IP, route table, and diagnostic setting resources across subscriptions to identify coverage gaps and configuration drift. Use saved queries or dashboards for recurring reviews. For more information, see [Azure Resource Graph overview](../governance/resource-graph/overview.md).

- **Apply consistent tags to firewall resources**: Use tags for ownership, environment, cost center, data classification, and criticality so teams can govern firewall resources and related policies consistently. Enforce required tags with Azure Policy. For more information, see [Use Azure Policy to enforce tagging rules and conventions](../azure-resource-manager/management/tag-policies.md).

- **Centralize policy with Azure Firewall Manager**: Use Azure Firewall Manager to manage firewall policies across secured virtual hubs and hub virtual networks from a centralized control plane. This centralized management helps reduce inconsistent rules across subscriptions and regions. For more information, see [What is Azure Firewall Manager?](../firewall-manager/overview.md)

- **Use policy hierarchy and inheritance for hub-and-spoke**: Structure parent and child Firewall Policies so global security requirements inherit to regional or application-specific policies while allowing controlled local exceptions. This model supports consistent governance in large hub-and-spoke deployments. For more information, see [Azure Firewall Manager policy overview](../firewall-manager/policy-overview.md).

- **Associate DDoS Protection with secured hub virtual networks**: Use Azure Firewall Manager to associate Azure DDoS Protection plans with hub virtual networks that contain Azure Firewall. DDoS Protection doesn't support Virtual WAN hubs, so use the association for virtual network hub designs. For more information, see [Configure Azure DDoS Protection Plan using Azure Firewall Manager](../firewall-manager/configure-ddos.md).

- **Review compliance certifications**: Review Azure Firewall audit scope against your regulatory requirements and organizational standards. Use the authoritative compliance offering list when you assess whether Azure Firewall is in scope for a required audit. For more information, see [Azure Firewall certifications](compliance-certifications.md).

- **Standardize deployment through infrastructure as code**: Deploy Azure Firewall and Firewall Policy by using Bicep, ARM templates, Terraform, or approved pipelines so teams review changes consistently and keep deployments repeatable and auditable. For more information, see [Bicep deployment for Azure Firewall](deploy-bicep.md).

## Backup and recovery

Backup and recovery for Azure Firewall focus on preserving Firewall Policy as the source of truth and designing resilient deployments that teams can restore or fail over during outages.

- **Manage Firewall Policy as infrastructure as code**: Define and version Firewall Policy in Bicep, ARM templates, or Terraform stored in a source-controlled repository. Treat that repository as the source of truth. Use policy export as a bootstrap or point-in-time snapshot, not as the ongoing source of truth. For more information, see [Export template in the Azure portal](../azure-resource-manager/templates/export-template-portal.md).

- **Deploy Azure Firewall across Availability Zones**: Use zone-redundant deployments in supported regions to improve resilience to datacenter-level failures. Include zone requirements in deployment standards and Azure Policy assignments. For more information, see [Deploy Azure Firewall with Availability Zones using Azure PowerShell](deploy-availability-zone-powershell.md).

- **Plan multiregion firewall deployment for disaster recovery**: Deploy Azure Firewall and aligned policies in paired or strategically selected regions for workloads that require regional disaster recovery. Ensure you can recreate route tables, public IPs, diagnostics, and policy assignments in the secondary region. For more information, see [Use Azure Firewall to route a hub-and-spoke topology across multiple hubs](firewall-multi-hub-spoke.md).

- **Use parent and child Firewall Policy hierarchy for recovery**: Keep global rules in parent policies and regional or workload rules in child policies so recovered environments inherit required controls consistently. This policy structure reduces manual rule reconstruction during recovery. For more information, see [Azure Firewall Manager rule hierarchy](../firewall-manager/rule-hierarchy.md).

- **Test failover procedures regularly**: Validate that routing, DNS, load balancing, monitoring, and security rules work when traffic moves to a secondary hub or region. Include security operations teams in drills so alerting and incident response processes continue during failover. For more information, see [Azure Firewall best practices](firewall-best-practices.md).

- **Plan recovery capacity around autoscale behavior**: Standard and Premium Azure Firewall deployments scale out automatically, but scale-out can take several minutes after traffic increases. Monitor throughput and plan failover traffic so recovery events don't exceed the capacity available during the scale-out window. For more information, see [Azure Firewall performance](firewall-performance.md).

## Next steps

- [Azure Firewall overview](overview.md)
- [Azure Firewall best practices](firewall-best-practices.md)
- [Azure Firewall Premium features](premium-features.md)
- [Monitor Azure Firewall logs and metrics](monitor-firewall.md)
- [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md)
- [Secure your Virtual Network deployment](../virtual-network/secure-virtual-network.md)
- [What is Azure network security?](../networking/security/network-security.md)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
