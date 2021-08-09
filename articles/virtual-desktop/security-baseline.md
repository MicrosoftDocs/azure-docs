---
title: Azure security baseline for Azure Virtual Desktop
description: The Azure Virtual Desktop security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 01/25/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Virtual Desktop

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Azure Virtual Desktop. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Virtual Desktop. **Controls** not applicable to Azure Virtual Desktop have been excluded.

Azure Virtual Desktop service includes the service itself, the Windows 10 Enterprise for multi-session virtual sku as well as FSLogix. For FSLogix-related security recommendations, see the [security baseline for storage](../storage/common/security-baseline.md). The service has an agent running on virtual machines but since the virtual machines are under full control of the customer, follow [security recommendations for compute](../virtual-machines/windows/security-baseline.md)

To see how Azure Virtual Desktop completely maps to the Azure Security Benchmark, see the [full Azure Virtual Desktop security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-1: Implement security for internal traffic

**Guidance**: You must create or use an existing virtual network when you deploy virtual machines to be registered to Azure Virtual Desktop. Ensure that all Azure virtual networks follow an enterprise segmentation principle that aligns to the business risks. Any system that could incur higher risk for the organization should be isolated within its own virtual network and sufficiently secured with either a network security group or Azure Firewall.

Use Adaptive Network Hardening features in Azure Security Center to recommend network security group configurations which limit ports and source IPs with reference to external network traffic rules.

Based on your applications and enterprise segmentation strategy, restrict or allow traffic between internal resources based on network security group rules. For specific well-defined applications (such as a 3-tier app), this can be a highly secure "deny by default, permit by exception" approach. This might not scale well if you have many applications and endpoints interacting with each other. You can also use Azure Firewall in circumstances where central management is required over a large number of enterprise segments or spokes (in a hub/spoke topology)

For the network security groups associated with your virtual machine (that are part of Azure Virtual Desktop) subnets, you must allow outgoing traffic to specific endpoints. 

- [Find out what URLs are required to be allowed access for Azure Virtual Desktop](safe-url-list.md)

- [Adaptive Network Hardening in Azure Security Center](../security-center/security-center-adaptive-network-hardening.md) 

- [Azure Firewall for Azure Virtual Desktop ](../firewall/protect-windows-virtual-desktop.md)

- [How to create a network security group with security rules](../virtual-network/tutorial-filter-network-traffic.md)

 

- [How to deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-2: Connect private networks together

**Guidance**: Use Azure ExpressRoute or Azure virtual private network to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, offer more reliability, faster speeds and lower latencies than typical internet connections. 

For point-to-site and site-to-site virtual private networks, you can connect on-premises devices or networks to a virtual network using any combination of virtual private network options and Azure ExpressRoute.

Use virtual network peering to connect two or more virtual networks together in Azure. Network traffic between peered virtual networks is private and stays on the Azure backbone network.

- [What are the ExpressRoute connectivity models](../expressroute/expressroute-connectivity-models.md) 

- [Azure VPN overview](../vpn-gateway/vpn-gateway-about-vpngateways.md) 

- [Virtual network peering](../virtual-network/virtual-network-peering-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

**Guidance**: Use Azure Firewall to protect applications and services against potentially malicious traffic from the internet and other external locations. Protect your Azure Virtual Desktop resources against attacks from external networks, including distributed denial of service attacks, application specific attacks, unsolicited and potentially malicious internet traffic. Protect your assets against distributed denial of service attacks by enabling DDoS standard protection on your Azure Virtual Networks. Use Azure Security Center to detect misconfiguration risks related to your network related resources.

Azure Virtual Desktop is not intended to run web applications, and does not require you to configure any additional settings or deploy any extra network services to protect it from external network attacks targeting web applications.

- [Azure Firewall Documentation](../firewall/index.yml)

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md) 

- [Azure Security Center recommendations](../security-center/recommendations-reference.md#networking-recommendations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Azure Firewall with threat intelligence based filtering to alert on and optionally block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. When payload inspection is required, you can deploy a third-party intrusion detection or prevention solution from the Azure Marketplace. 

If you have a regulatory or other requirement for intrusion detection or prevention solution usage, ensure that it is always tuned to provide high-quality alerts to your security information and event management (SIEM) solution.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md) 

- [Azure Marketplace includes 3rd party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS) 

- [Microsoft Defender ATP EDR capability](/bs-cyrl-ba/windows/security/threat-protection/microsoft-defender-atp/overview-endpoint-detection-response)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-6: Simplify network security rules

**Guidance**: Use Azure Virtual Network service tags to define network access controls on network security groups or an Azure Firewall configured for your Azure Virtual Desktop resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (For example: WindowsVirtualDesktop) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and using Service Tags](../virtual-network/service-tags-overview.md)

- [Learn more about what is covered by the Azure Virtual Desktop Service Tag here ](safe-url-list.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Azure Virtual Desktop uses Azure Active Directory (Azure AD) as the default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:

- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

- Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Azure AD supports external identities which allow users without a Microsoft account to sign-in to their applications and resources with their external identity.

- [Tenancy in Azure AD](../active-directory/develop/single-and-multi-tenant-apps.md)

- [Use external identity providers for application](../active-directory/external-identities/identity-providers.md)

- [What is the identity secure score in Azure AD](../active-directory/fundamentals/identity-secure-score.md)

- [Specific roles that you need to operate Azure Virtual Desktop ](/azure/virtual-desktop/faq#what-are-the-minimum-admin-permissions-i-need-to-manage-objects)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

**Guidance**: Azure Virtual Desktop supports Azure managed identities for non-human accounts such as services or automation. It is recommended to use Azure managed identity feature instead of creating a more powerful human account to access or execute your resources. 

Azure Virtual Desktop recommends using Azure Active Directory (Azure AD) to create a service principal with restricted permissions at the resource level to configure service principals with certificate credentials and fall back to client secrets. In both cases, Azure Key Vault can be used to in conjunction with Azure managed identities, so that the runtime environment (such as, an Azure Function) can retrieve the credential from the key vault.

- [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps) 

- [Create a service principal with certificates](../active-directory/develop/howto-authenticate-service-principal-powershell.md) 

- [Use Azure Key Vault for security principal registration](../key-vault/general/authentication.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Azure Virtual Desktop uses Azure Active Directory (Azure AD) to provide identity and access management to Azure resources, cloud applications, and on-premises applications. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. This enables single sign-on (SSO) to manage and secure access to your organization’s data and resources on-premises and in the cloud. Connect all your users, applications, and devices to Azure AD for seamless secure access with greater visibility and control.

- [Understand Application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access 

**Guidance**: Azure Virtual Desktop uses Azure Active Directory (Azure AD), which supports strong authentication controls through multifactor authentication and strong passwordless methods.

- Multifactor authentication - Enable Azure AD multifactor authentication and follow Identity and Access Management recommendations from Azure Security Center for some best practices in your multifactor authentication setup. Multifactor authentication can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors.

- Passwordless authentication – Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

Azure Virtual Desktop supports legacy password-based authentication such as Cloud-only accounts (user accounts created directly in Azure) that have a baseline password policy or Hybrid accounts (user accounts from on-premise Azure AD which follow the on-premises password policies). When using password-based authentication, Azure AD provides a password protection capability that prevents users to set passwords that are easy to guess. Microsoft provides a global list of banned passwords that is updated based on telemetry, and customers can augment the list based on their needs (such as branding, cultural references, and so on). This password protection can be used for cloud-only and hybrid accounts.

Authentication based on password credentials alone is susceptible to popular attack methods. For higher security, use strong authentication such as multifactor authentication and a strong password policy. For third-party applications and marketplace services which may have default passwords, you should change them upon the service initial setup.

For administrator and privileged users, ensure the highest level of strong authentication methods are used, followed by rolling out the appropriate strong authentication policy to other users.

- [Introduction to passwordless authentication options for Azure Active Directory](../active-directory/authentication/concept-authentication-passwordless.md) 

- [Azure AD default password policy](../active-directory/authentication/concept-sspr-policy.md#password-policies-that-only-apply-to-cloud-user-accounts) 

- [Eliminate bad passwords using Azure Active Directory Password Protection](../active-directory/authentication/concept-password-ban-bad.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

**Guidance**: Azure Virtual Desktop is integrated with Azure Active Directory (Azure AD) which provides the following data sources:

- Sign in - The sign-in report provides information about the usage of managed applications and user sign in activities.

- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

- Risky sign in - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or a third-party security information and event management (SIEM) systems. Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription. Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in the Azure AD](../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [Alerts in Azure Security Center's threat intelligence protection module](../security-center/alerts-reference.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Azure Virtual Desktop supports conditional access with Azure Active Directory (Azure AD) for a granular access-control based on user-defined conditions. For example, user logins from certain IP ranges could be required to use multifactor authentication for access. 

Additionally, granular authentication session management policy can also be used for different use cases.

- [Azure conditional access overview](../active-directory/conditional-access/overview.md) 

- [Common conditional access policies](../active-directory/conditional-access/concept-conditional-access-policy-common.md) 

- [Configure authentication session management with conditional access](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md) 

- [Azure Virtual Desktop specific conditional access setup info can be found here](set-up-mfa.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure Virtual Desktop uses Azure role-based access-control (Azure RBAC) to isolate access to business-critical systems. Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers, security tools, and system management tools with agents installed on business-critical systems. Attackers who compromise these management and security systems can potentially immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

- [Minimum admin permissions needed to manage Azure Virtual Desktop](/azure/virtual-desktop#what-are-the-minimum-admin-permissions-i-need-to-manage-objects)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

**Guidance**: Azure Virtual Desktop uses Azure Active Directory (Azure AD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid.

Use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Some Azure services support local users and roles which not managed through Azure AD. You will need to manage these users separately.

- [Built-in roles for Azure Virtual Desktop](rbac.md)

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

**Guidance**: Azure Virtual Desktop uses Azure Active Directory (Azure AD) to manage its resources. To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../active-directory/roles/security-emergency-access.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-5: Automate entitlement management 

**Guidance**: Azure Virtual Desktop is integrated with Azure Active Directory (Azure AD) to manage its resources. Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expirations. In additional, dual or multi-stage approvals are also supported.

- [What are Azure AD access reviews](../active-directory/governance/access-reviews-overview.md) 

- [What is Azure AD entitlement management](../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-6: Use privileged access workstations

**Guidance**: Secured and isolated workstations are critically important for the security of sensitive roles, such as, administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks. 

Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstation can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Azure Virtual Desktop is integrated with Azure role-based access-control (Azure RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

The privileges you assign to resources with Azure RBAC should always be limited to the ones as required by the roles. This complements the just in time (JIT) approach of Privileged Identity Management (PIM), with Azure Active Directory (Azure AD), and should be reviewed periodically.

Additionally, use built-in roles to allocate permissions and only create custom roles when required.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) 

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Built-in roles for Azure Virtual Desktop](rbac.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-8: Choose approval process for Microsoft support  

**Guidance**: In support scenarios where Microsoft needs to access customer data, Azure Virtual Desktop supports Customer Lockbox to provide an interface for you to review and approve or reject customer data access requests.

- [Understand Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-1: Discovery, classify and label sensitive data

**Guidance**: Discover, classify, and label your sensitive data so that you can design the appropriate controls. This is to ensure sensitive information is stored, processed, and transmitted securely by the organization's technology systems.

Use Azure Information Protection (and its associated scanning tool) for sensitive information within Office documents on Azure, on-premises, Office 365 and other locations.

You can use Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.

- [Tag sensitive information using Azure Information Protection](/azure/information-protection/what-is-information-protection) 

- [How to implement Azure SQL Data Discovery](../azure-sql/database/data-discovery-and-classification-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### DP-2: Protect sensitive data

**Guidance**: Protect sensitive data by restricting access using Azure Role Based Access Control (Azure RBAC), network-based access controls, and specific controls in Azure services (such as encryption in SQL and other databases).

To ensure consistent access control, all types of access control should be aligned to your enterprise segmentation strategy. The enterprise segmentation strategy should also be informed by the location of sensitive or business critical data and systems.

Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented some default data protection controls and capabilities.

- [Azure Role Based Access Control (RBAC)](../role-based-access-control/overview.md) 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### DP-3: Monitor for unauthorized transfer of sensitive data

**Guidance**: Monitor for unauthorized transfer of data to locations outside of enterprise visibility and control. This typically involves monitoring for anomalous activities (large or unusual transfers) that could indicate unauthorized data exfiltration.

Advanced Threat Protection (ATP) features with both Azure Storage and Azure SQL ATP can alert on anomalous transfer of information, indicating what might be unauthorized transfers of sensitive information.

Azure Information protection (AIP) provides monitoring capabilities for information that has been classified and labeled.

Use data loss prevention solutions, such as the host-based ones, to enforce detective and/or preventative controls to prevent data exfiltration.

- [Enable Azure SQL ATP](../azure-sql/database/threat-detection-overview.md) 

- [Enable Azure Storage ATP](../storage/common/azure-defender-storage-configure.md?tabs=azure-security-center)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Additional permissions might be required for visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

Use Azure Virtual Machine Inventory to automate the collection of information about software on Virtual Machines. Software Name, Version, publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, enable guest-level diagnostics and bring the Windows Event Logs into a Log Analytics Workspace.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md) 

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json)

- [How to enable Azure virtual machine inventory](../automation/automation-tutorial-installed-software.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: Not applicable. Azure Virtual Desktop cannot be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets which are considered high-impact. 

It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

**Guidance**: Use Azure virtual machine Inventory to automate the collection of information about all software on virtual machines. Software Name, Version, Publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, enable guest-level diagnostics and bring the Windows Event Logs into a Log Analytics Workspace.

- [How to enable Azure virtual machine inventory](../automation/automation-tutorial-installed-software.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Use the Azure Security Center built-in threat detection capability and enable Azure Defender (Formally Azure Advanced Threat Protection) for your Azure Virtual Desktop resources. Azure Defender for Azure Virtual Desktop provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your Azure Virtual Desktop resources.

Forward any logs from Azure Virtual Desktop to your security information event management (SIEM) solution which can be used to set up custom threat detections. Ensure you are monitoring different types of Azure assets for potential threats and anomalies. Focus on getting high-quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

- [Threat protection in Azure Security Center](../security-center/azure-defender.md) 

- [Azure Security Center security alerts reference guide](../security-center/alerts-reference.md)

- [Create custom analytics rules to detect threats](../sentinel/tutorial-detect-threats-custom.md) 

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Azure Active Directory (Azure AD) provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other security information and event management (SIEM) or monitoring tools for further sophisticated monitoring and analytics use cases:

- Sign-in – The sign-in report provides information about the usage of managed applications and user sign-in activities.

- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

- Risky sign-in - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts and deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, the Threat Protection module in Azure Security Center  can also collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you to have visibility on account anomalies inside the individual resources.

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md) 

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

**Guidance**: Azure Virtual Desktop does not produce or process domain name service (DNS) query logs. However resources that are registered to the service can produce flow logs.

Enable and collect network security group resource and flow logs, Azure Firewall logs and Web Application Firewall (WAF) logs for security analysis to support incident investigations, threat hunting, and security alert generation. You can send the flow logs to an Azure Monitor Log Analytics workspace and then use Traffic Analytics to provide insights.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md) 

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md) 

- [Azure networking monitoring solutions in Azure Monitor](../azure-monitor/insights/azure-networking-analytics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Activity logs, which are automatically enabled, contain all write operations (PUT, POST, DELETE) for your Azure Virtual Desktop resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, the tools used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party security information event management (SIEM). Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

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

**Guidance**: Ensure you have a process to create high-quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High-quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

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

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

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

### PV-3: Establish secure configurations for compute resources

**Guidance**: Use Azure Security Center and Azure Policy to establish secure configurations on all compute resources including VMs, containers, and others.

You can use custom operating system images or Azure Automation State configuration to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md) 

- [Azure Automation State Configuration Overview](../automation/automation-dsc-overview.md) 

- [Azure Virtual Desktop environment](environment-setup.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-4: Sustain secure configurations for compute resources

**Guidance**: Use Azure Security Center and Azure Policy to regularly assess and remediate configuration risks on your Azure compute resources including virtual machines, containers, and others. In addition, you may use Azure Resource Manager templates, custom operating system images or Azure Automation State Configuration to maintain the security configuration of the operating system required by your organization. The Microsoft virtual machine templates combined with the Azure Automation State Configuration may assist in meeting and maintaining the security requirements.

Azure Marketplace Virtual Machine Images published by Microsoft are managed and maintained by Microsoft.

Azure Security Center can also scan vulnerabilities in container image and performs continuous monitoring of your Docker configuration in containers against Center Internet Security's Docker benchmark. You can use the Azure Security Center recommendations page to view recommendations and remediate issues.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md) 

- [How to create an Azure Virtual Machine from an ARM template](../virtual-machines/windows/ps-template.md) 

- [Azure Automation State Configuration Overview](../automation/automation-dsc-overview.md) 

- [Container security in Security Center](../security-center/container-security.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-5: Securely store custom operating system and container images

**Guidance**: Azure Virtual Desktop allows customers to manage operating system images. Use Azure role-based access control (Azure RBAC) to ensure that only authorized users can access your custom images. Use an Azure Shared Image Gallery you can share your images to different users, service principals, or Active Directory groups within your organization. Store container images in Azure Container Registry and use RBAC to ensure that only authorized users have access.

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md) 

- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md) 

- [Shared Image Gallery overview](../virtual-machines/shared-image-galleries.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-6: Perform software vulnerability assessments

**Guidance**: Azure Virtual Desktop allows you to deploy your own virtual machines and register them to the service as well as have SQL database running in the environment.

Azure Virtual Desktop can use a third-party solution for performing vulnerability assessments on network devices and web applications. When conducting remote scans, do not use a single, perpetual, administrative account. Consider implementing JIT provisioning methodology for the scan account. Credentials for the scan account should be protected, monitored, and used only for vulnerability scanning.

As require, export scan results at consistent intervals and compare the results with previous scans to verify that vulnerabilities have been remediated.

Follow recommendations from Azure Security Center for performing vulnerability assessments on your Azure virtual machines (and SQL servers). Azure Security Center has a built-in vulnerability scanner for virtual machine, container images, and SQL database.

As required, export scan results at consistent intervals and compare the results with previous scans to verify that vulnerabilities have been remediated. When using vulnerability management recommendations suggested by Azure Security Center, you can pivot into the selected solution's portal to view historical scan data.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md) 

- [Integrated vulnerability scanner for virtual machines](../security-center/deploy-vulnerability-assessment-vm.md) 
- [SQL vulnerability assessment](../azure-sql/database/sql-vulnerability-assessment.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-7: Rapidly and automatically remediate software vulnerabilities

**Guidance**: Azure Virtual Desktop doesn't use or require any third-party software. However, Azure Virtual Desktop allows you to deploy your own virtual machines and register them to the service.

Use Azure Automation Update Management or a third-party solution to ensure that the most recent security updates are installed on your Windows Server virtual machines. For Windows virtual machines, ensure Windows Update has been enabled and set to update automatically.

Use a third-party patch management solution for third-party software or System Center Updates Publisher for Configuration Manager.

- [How to configure Update Management for virtual machines in Azure](../automation/update-management/overview.md) 

- [Manage updates and patches for your Azure VMs](../automation/update-management/manage-updates-for-vm.md)

- [Configure Microsoft Endpoint Configuration Manager for Azure Virtual Desktop](configure-automatic-updates.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

**Guidance**: Azure Virtual Desktop does not allow customers to perform their own penetration testing on their Azure Virtual Desktop resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](../security/benchmarks/security-controls-v2-endpoint-security.md).*

### ES-1: Use Endpoint Detection and Response (EDR)

**Guidance**: Azure Virtual Desktop does not provide any specific capabilities for endpoint detection and response (EDR) processes. However resources registered to the service can benefit from endpoint detection and response capabilities. 

Enable endpoint detection and response capabilities for servers and clients and integrate them with security information and event management (SIEM) solutions and Security Operations processes.

Advanced Threat Protection from Microsoft Defender provides Endpoint Detection and Response capabilities, as part of an enterprise endpoint security platform to prevent, detect, investigate, and respond to advanced threats.

- [Microsoft Defender Advanced Threat Protection Overview](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) 

- [Microsoft Defender ATP service for Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints) 

- [Microsoft Defender ATP service for non-Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-endpoints-non-windows)

- [Microsoft Defender ATP for non-persistent virtual desktop infrastructure](/windows/security/threat-protection/microsoft-defender-atp/configure-endpoints-vdi)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### ES-2: Use centrally managed modern anti-malware software

**Guidance**: Protect your Azure Virtual Desktop resources with a centrally managed and modern endpoint anti-malware solution capable of real time and periodic scanning.

Azure Security Center can automatically identify the use of a number of popular anti-malware solutions for your virtual machines and report the endpoint protection running status and make recommendations.

Microsoft Antimalware for Azure Cloud Services is the default anti-malware for Windows virtual machines (VMs). Also, you can use Threat detection with Azure Security Center for data services to detect malware uploaded to Azure Storage accounts.

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md) 

- [Supported endpoint protection solutions](../security-center/security-center-services.md?tabs=features-windows#supported-endpoint-protection-solutions-)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### ES-3: Ensure anti-malware software and signatures are updated

**Guidance**: Ensure anti-malware signatures are updated rapidly and consistently.

Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all virtual machines and/or containers are up to date with the latest signatures.

Microsoft Antimalware will automatically install the latest signatures and engine updates by default.

- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md) 

- [Endpoint protection assessment and recommendations in Azure Security Center](../security-center/security-center-endpoint-protection.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](../security/benchmarks/security-controls-v2-backup-recovery.md).*

### BR-1: Ensure regular automated backups

**Guidance**: Ensure you are backing up systems and data to maintain business continuity after an unexpected event. This should be guidance by any objectives for Recovery Point Objective (RPO) and Recovery Time Objective (RTO).

Enable Azure Backup and configure the backup source (e.g. Azure VMs, SQL Server, HANA databases, or File Shares), as well as the desired frequency and retention period.

For a higher level of redundancy, you can enable geo-redundant storage option to replicate backup data to a secondary region and recover using cross region restore.

- [Enterprise-scale business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/enterprise-scale/business-continuity-and-disaster-recovery) 

- [How to enable Azure Backup](../backup/index.yml) 

- [How to enable cross region restore](../backup/backup-azure-arm-restore-vms.md#cross-region-restore) 

- [How to set up a business continuity and disaster recovery plan in Azure Virtual Desktop](disaster-recovery.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### BR-2: Encrypt backup data

**Guidance**: Ensure your backups are protect against attacks. This should include encryption of the backups to protect against loss of confidentiality.

For regular Azure service backup, backup data is automatically encrypted using Azure platform-managed keys. You can choose to encrypt the backup using customer-managed key. In this case, ensure this customer-managed key in the key vault is also in the backup scope.

Use role-based access control in Azure Backup, Azure Key Vault, or other resources to protect backups and customer-managed keys. Additionally, you can enable advanced security features to require multifactor authentication before backups can be altered or deleted.

Overview of security features in Azure Backup /azure/backup/security-overview 

- [Encryption of backup data using customer-managed keys](../backup/encryption-at-rest-with-cmk.md) 

- [How to backup Key Vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?preserve-view=true&view=azurermps-6.13.0)

- [Security features to help protect hybrid backups from attacks](../backup/backup-azure-security-feature.md#prevent-attacks)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### BR-3: Validate all backups including customer-managed keys

**Guidance**: It is recommended to validate data integrity on backup media on a regular basis by performing a data restoration process to ensure that the backup is properly working.

- [How to recover files from Azure Virtual Machine backup](../backup/backup-azure-restore-files-from-vm.md)

- [Security implementation](../backup/backup-azure-restore-files-from-vm.md#security-implementations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

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

- [Azure Security Benchmark - Identity management](../automation/update-management/overview.md)

- [Azure Security Benchmark - Privileged access](../security/benchmarks/security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high-quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

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
