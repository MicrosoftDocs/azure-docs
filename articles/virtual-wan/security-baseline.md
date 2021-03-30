---
title: Azure security baseline for Virtual WAN
description: The Virtual WAN security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 11/24/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Virtual WAN

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Microsoft Azure Virtual
WAN. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Virtual
WAN. **Controls** not applicable to Virtual
WAN have been excluded.

To see how Virtual
WAN completely maps to the Azure Security Benchmark, see the [full Virtual
WAN security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-1: Implement security for internal traffic

**Guidance**: Microsoft Azure Virtual WAN provides custom routing capabilities and offers encryption for your ExpressRoute traffic. All route management is provided by the virtual hub router, which also enables transit connectivity between virtual networks. Encrypting your ExpressRoute traffic with Virtual WAN provides an encrypted transit between the on-premises networks and Azure virtual networks over ExpressRoute, without going over the public internet or using public IP addresses. 

- [ExpressRoute traffic encryption](virtual-wan-about.md#encryption)

- [Use Private Link in Virtual WAN](howto-private-link.md)

- [Custom routing scenarios](scenario-any-to-any.md)

- [Custom route table documentation](how-to-virtual-hub-routing.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-2: Connect private networks together 

**Guidance**: Microsoft Azure ExpressRoute offers private connectivity to Azure Virtual WAN. As the ExpressRoute connections do not go over the public internet, ExpressRoute offers more reliability, faster speeds and lower latencies than typical internet connections. You can also use a virtual private network to connect to Azure through either Site-to-site (S2S) VPN or Point-to-site (P2S) VPN.

- [ExpressRoute in Virtual WAN](virtual-wan-expressroute-portal.md)

- [Site to Site VPN overview](virtual-wan-site-to-site-portal.md)

- [Point to Site VPN overview](virtual-wan-point-to-site-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### NS-4: Protect applications and services from external network attacks

**Guidance**: Virtual WAN does not expose any endpoints to external networks which require them to be secured with conventional network protections. You are free to protect resources in Spoke Virtual Networks (any virtual network connected to a virtual hub) using virtual network protection services. 

Use Azure Firewall to protect applications and services against potentially malicious traffic from the Internet and other external locations. 

Choose Azure-provided DDoS Protection to protect your assets against attacks on your Azure Virtual Networks. Use Azure Security Center to detect misconfigurations risks related to your network-related resources.

- [Azure Firewall Documentation](../firewall/index.yml)

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md) 

- [Azure Security Center recommendations](../security-center/recommendations-reference.md#recs-networking)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Virtual WAN is a Microsoft-managed service. It does not offer native intrusion detection or intrusion prevention capabilities. However, there are security capabilities provided to Virtual WAN through Azure Firewall to enable a unified point of policy control. You can create an Azure Firewall policy and link the policy to a Virtual WAN hub to allow the existing Virtual WAN hub to function as a secured virtual hub, with the required Azure Firewall resources deployed.

- [Configure Azure Firewall in a Virtual WAN hub](howto-firewall.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-6: Simplify network security rules

**Guidance**: Simplify network security rules by leveraging Virtual Network service tags to define network access controls on network security groups or Azure Firewall. Service tags can be used in place of specific IP addresses when creating security rules. By specifying the service tag name in the source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and use service tags](../virtual-network/service-tags-overview.md)

- [Understand and use application security groups](../virtual-network/network-security-groups-overview.md#application-security-groups)

- [Azure Firewall Documentation](../firewall/index.yml)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-7: Secure Domain Name Service (DNS)

**Guidance**: Secure DNS capabilities are provided to Virtual WAN with Azure Firewall. Configure Azure Firewall to act as a DNS proxy which becomes an intermediary for DNS requests from client virtual machines to a DNS server. For custom DNS server configurations, enable DNS proxy to avoid a DNS resolution mismatch, and enable fully qualified domain name filtering in the network rules. 

- [Azure Firewall Documentation](../firewall/index.yml)

- [Azure Firewall DNS Settings](../firewall/dns-settings.md)

- [Use Azure Firewall as a DNS Forwarder with Private Link](https://github.com/adstuart/azure-privatelink-dns-azurefirewall)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Azure Active Directory (Azure AD) is the default identity and access management service for Azure services. including Virtual WAN. Standardize Azure AD to govern your organization’s identity and access management in:

- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machines (Linux and Windows), Azure Key Vault, platform as a service (PaaS), and software as a service (SaaS) applications.
- Your organization's resources, such as applications on Azure or your corporate network resources

Secure Azure AD as a high priority in your organization’s cloud security practice. Assess your identity and security posture with the security score feature from Security Center to gauge how closely your configuration matches Microsoft's best practice recommendations. As necessary, implement Microsoft’s best practice recommendations for improvements to your security posture.

Azure AD also supports external identities, which allow users without a Microsoft account to sign in to their applications and resources with their external identity. 

Review information on using Azure AD in Point-to-Site VPN scenarios at the referenced links.

- [Create an Azure Active Directory (AD) tenant for P2S OpenVPN protocol connections](openvpn-azure-ad-tenant-multi-app.md)

- [Configure Azure Active Directory authentication for User VPN](virtual-wan-point-to-site-azure-ad.md)

- [Tenancy in Azure Active Directory](../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Currently, Azure Active Directory (Azure AD) authentication is provided through integration with Virtual WAN Point-to-site VPN.

Azure Active Directory (Azure AD) is the default identity and access management service for Azure services. Azure AD supports strong authentication controls with multifactor authentication, and strong passwordless methods.

Azure AD recommends the following for strong authentication controls:

- Multifactor authentication - Enable Azure AD multifactor authentication and follow Identity and Access Management recommendations in Azure Security Center for security best practices. Enforce multifactor authentication on all, select users or at per-user level based on sign in conditions and risk factors

- Passwordless authentication – Three passwordless authentication options are available. These include, Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards

Ensure the highest level of the strong authentication method are used for administrator and privileged users, followed by a roll-out of a strong authentication policy to other users.

- [How to enable MFA in P2S VPN for Virtual WAN](openvpn-azure-ad-mfa.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication for VPN users (point-to-site) with using Azure AD authentication. Configure multifactor authentication on a per user basis, or leverage multifactor authentication with Conditional Access. Conditional Access allows for finer-grained control over how a second factor should be promoted. It can allow assignment of multifactor authentication to only VPN, and exclude other applications tied to the Azure AD tenant. 

Note that Azure AD authentication is only available for gateways using OpenVPN protocol and clients running Windows.

- [What is Conditional Access](../active-directory/conditional-access/overview.md)

- [Configure Azure Active Directory authentication for User VPN](virtual-wan-point-to-site-azure-ad.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

**Guidance**: Site-to-site VPN in Virtual WAN uses pre-shared keys (PSK) which are discovered, created and managed by the customer in their Azure Key Vault. Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

For GitHub, you can use native secret scanning feature to identify credentials or other form of secrets within the code.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html) 

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure Virtual WAN uses Azure role-based access controls (Azure RBAC) to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers, security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-4: Encrypt sensitive information in transit

**Guidance**: Use Point-to-site VPN, Site-to-site VPN and Encrypted Express Route with Virtual WAN for your connectivity requirements. VPN encryption protects data in transit from 'out of band' attacks (such as, traffic capture) to ensure that attackers cannot read or modify the data. 

- [Point-to-site VPN](virtual-wan-point-to-site-portal.md)

- [Site-to-site VPN](virtual-wan-site-to-site-portal.md)

- [Encrypted ExpressRoute](vpn-over-expressroute.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. With that, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (root management group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production. Azure Virtual WAN also supports Azure Resource Manager-based resource deployments with which you can export asset templates. 

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json)

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Use Azure Monitor to create rules to trigger alerts when a non-approved service is detected. Virtual WAN brings together many networking, security, and routing functionalities to provide a single operational interface. Virtual WAN VPN gateways, ExpressRoute gateways, and Azure Firewall have logging and metrics available through Azure Monitor. 
 

- [Virtual WAN Logs and Metrics](logs-metrics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Point-to-site VPN with Virtual WAN is integrated with Azure Active Directory (Azure AD). Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel, SIEM or monitoring tools for more sophisticated threat monitoring and analytics use cases. These are:

- Sign in – The sign in report provides information about the usage of managed applications and user sign in activities.
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD, such as, adding or removing users, apps, groups, roles and policies.
- Risky sign in - A risky sign in is an indicator for a sign in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Use Azure Security Center to create alerts on certain suspicious activities such as excessive number of failed authentication attempts including deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, use Threat Protection module from Security Center to collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you have visibility on account anomalies inside the individual resources.

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

- [Configure Azure Firewall in a Virtual WAN hub](howto-firewall.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Point-to-site VPN with Virtual WAN is integrated with Azure Active Directory (Azure AD). Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel, SIEM or monitoring tools for more sophisticated threat monitoring and analytics use cases. These are:

- Sign in – The sign in report provides information about the usage of managed applications and user sign in activities.
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD, such as, adding or removing users, apps, groups, roles and policies.
- Risky sign in - A risky sign in is an indicator for a sign in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Use Azure Security Center to create alerts on certain suspicious activities such as excessive number of failed authentication attempts including deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, use Threat Protection module from Security Center to collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you have visibility on account anomalies inside the individual resources.

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

- [Configure Azure Firewall in a Virtual WAN hub](howto-firewall.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-3: Enable logging for Azure network activities

**Guidance**: Monitor Azure Virtual WAN with Azure Monitor. Virtual WAN brings together many networking, security, and routing functionalities to provide a single operational interface. Virtual WAN VPN gateways, ExpressRoute gateways, and Azure Firewall have logging and metrics available through Azure Monitor. Activity log entries are collected by default and can be viewed in the Azure portal. You can use Azure activity logs
(formerly known as operational logs and audit logs) to view all operations submitted to your Azure subscription.

A variety of diagnostic logs are also available for Virtual WAN, and can be configured for the Virtual WAN resource with Azure portal.  You can choose to send to Log Analytics, stream to an event hub, or to simply archive to a storage account. 
 

- [Virtual WAN Logs and Metrics](logs-metrics.md)

- [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Azure Activity logs, enabled automatically, contain all write operations (PUT, POST, DELETE) for your Azure Virtual WAN resources except read (GET) operations. Activity logs can be used to find an error during troubleshooting or to monitor how a user in your organization modified a resource.

Enable Azure resource logs for Virtual WAN. You can use Azure Security Center and Azure Policy to enable resource logs and log data collecting. These logs can be critical for later investigating security incidents and performing forensic exercises.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md) 

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

**Guidance**: Enable security logging for Virtual WAN with Azure Monitor. Virtual WAN brings together many networking, security, and routing functionalities to provide a single operational interface. Virtual WAN VPN gateways, ExpressRoute gateways, and Azure Firewall have logging and metrics available through Azure Monitor. Activity log entries are collected by default and can be viewed in the Azure portal. You can use Azure activity logs
(formerly known as operational logs and audit logs) to view all operations submitted to your Azure subscription. 

A variety of diagnostic logs are also available for Virtual WAN, and can be configured for the Virtual WAN resource with Azure portal. Send to Log Analytics, stream to an event hub, or to simply archive to a storage account. In addition, enable and onboard data to Azure Sentinel or a third-party Security Information and Event Management solution. 
 

- [Virtual WAN Logs and Metrics](logs-metrics.md)

- [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md)

Azure Virtual WAN security is provided through Azure Firewall. 

- [Azure Firewall Documentation](../firewall/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### LT-6: Configure log storage retention

**Guidance**: Configure your log retention according to your compliance, regulation, and business requirements. In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage.

- [Change the data retention period in Log Analytics](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](../storage/common/manage-storage-analytics-logs.md#configure-logging)

- [Azure Security Center alerts and recommendations export](../security-center/continuous-export.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

**Guidance**: Ensure you have a process to create high quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md).*

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](../security/benchmarks/security-controls-v2-endpoint-security.md).*

### ES-1: Use Endpoint Detection and Response (EDR)

**Guidance**: Customers are not explicitly allowed to configure Endpoint Detection and Response settings. However, the Virtual Machines used in the Azure Virtual WAN offering do use these capabilities. Learn more about these general capabilities at the referenced links. 

- [Microsoft Defender Advanced Threat Protection Overview](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection)

- [Microsoft Defender ATP service for Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints)

- [Microsoft Defender ATP service for non-Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-endpoints-non-windows)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](../security/benchmarks/security-controls-v2-governance-strategy.md).*

### GS-1: Define asset management and data protection strategy 

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?bc=%2fsecurity%2fcompass%2fbreadcrumb%2ftoc.json&toc=%2fsecurity%2fcompass%2ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md?bc=%2fazure%2fcloud-adoption-framework%2f_bread%2ftoc.json&toc=%2fazure%2fcloud-adoption-framework%2ftoc.json)

- [Azure Security Benchmark - Asset management](../security/benchmarks/security-controls-v2-asset-management.md)

- [Azure Security Benchmark - Data Protection](../security/benchmarks/security-controls-v2-data-protection.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](../security/benchmarks/security-controls-v2-network-security.md)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](../security/benchmarks/security-controls-v2-identity-management.md)

- [Azure Security Benchmark - Privileged access](../security/benchmarks//security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:

- [Azure Security Benchmark - Logging and threat detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md)

- [Azure Security Benchmark - Incident response](../security/benchmarks/security-controls-v2-incident-response.md)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)