---
title: Azure security baseline for Microsoft Azure Peering Service
description: The Microsoft Azure Peering Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: peering-service
ms.topic: conceptual
ms.date: 04/09/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Microsoft Azure Peering Service

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Microsoft Azure Peering Service. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Microsoft Azure Peering Service.

> [!NOTE]
> **Controls** not applicable to Microsoft Azure Peering Service, or for which the responsibility is Microsoft's, have been excluded. To see how Microsoft Azure Peering Service completely maps to the Azure Security Benchmark, see the **[full Microsoft Azure Peering Service security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines)**.

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Peering Service does not offer native intrusion detection or prevention services. Customers should follow security best practices, such as using threat intelligence-based filtering from Azure Firewall to alert and block traffic from and to known-malicious IP addresses and domains, as applicable to their business requirements. These IP addresses and domains are sourced from the Microsoft Threat-Intelligence feed. 

In cases where payload inspection is required, deploy a third-party intrusion detection or prevention systems (IDS/IPS), with payload inspection capabilities, from the Azure Marketplace.  
Alternately, use a host-based endpoint detection and response (EDR) solution in conjunction with (or instead of) network-based intrusion detection or prevention systems.  

If you have a regulatory requirement to utilize an intrusion detection or intrusion prevention system, ensure that it is always tuned to consume or provide high-quality alerts. 

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [Azure Marketplace includes third party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS)

- [Microsoft Defender ATP EDR capability](/windows/security/threat-protection/microsoft-defender-atp/overview-endpoint-detection-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Maintain an inventory of the user accounts with administrative access to the control plane (such as, Azure portal) of your Microsoft Azure Peering Service resources.

Use the Identity and Access control (IAM) pane in the Azure portal for your subscription to configure Azure role-based access control (Azure RBAC). The roles are applied to users, groups, service principals, and managed identities in Azure Active Directory (Azure AD).

- [Add or remove Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-2: Manage application identities securely and automatically

**Guidance**: Managed identities are not supported for Peering Service. For services that do not support managed identities like Peering Service, use Azure Active Directory (Azure AD) to create a service principal with restricted permissions at the resource level instead. 

- [Azure managed identities](../active-directory/managed-identities-azure-resources/overview.md)

- [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps)

- [Create a service principal with certificates](../active-directory/develop/howto-authenticate-service-principal-powershell.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Microsoft Azure Peering Service uses Azure Active Directory (Azure AD) to provide identity and access management to Azure resources. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. 

Use single sign-on to manage and secure access to your organization’s data and resources on-premises and in the cloud. Connect all your users, applications, and devices to the Azure AD for seamless, secure access and greater visibility and control.

- [Understand Application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Enable multifactor authentication with Azure Active Directory (Azure AD) and follow Identity and Access Management recommendations from Azure Security Center.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-5: Monitor and alert on account anomalies

**Guidance**: Use Privileged Identity Management (PIM) with Azure Active Directory (Azure AD) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Use conditional access with Azure Active Directory (Azure AD) for more granular access control based on user-defined conditions, such as requiring user logins from certain IP ranges to use multifactor authentication. A granular authentication session management can also be used through Azure AD conditional access policy for different use cases. 

- [Azure Conditional Access overview](../active-directory/conditional-access/overview.md)

- [Common Conditional Access policies](../active-directory/conditional-access/concept-conditional-access-policy-common.md)

- [Configure authentication session management with Conditional Access](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-7: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner within Azure DevOps to identify credentials used within the code. Credential Scanner also encourages moving discovered credentials to more secure locations such as Azure Key Vault.

For GitHub, you can use native secret scanning feature to identify credentials or other form of secrets within the code.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

**Guidance**: Limit the number of highly privileged user accounts, and protect these accounts at an elevated level. 

The most critical built-in roles in Azure Active Directory (Azure AD) are Global Administrator and the Privileged Role Administrator, because users assigned to these two roles can delegate administrator roles. 

With these privileges, users can directly or indirectly read and modify every resource in your Azure environment:

- Global Administrator / Company Administrator: Users with this role have access to all administrative features in Azure AD, as well as services that use Azure AD identities.

- Privileged Role Administrator: Users with this role can manage role assignments in Azure AD, as well as within Azure AD Privileged Identity Management (PIM). In addition, this role allows management of all aspects of PIM and administrative units.

There may be other critical roles that need to be governed if you use custom roles with certain privileged permissions assigned to them. Apply similar controls to the administrator account of critical business assets.  

Enable just-in-time (JIT) privileged access to Azure resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT grants temporary permissions to perform privileged tasks only when users need it. PIM can also generate security alerts when there is suspicious or unsafe activity in your Azure AD organization.

- [Administrator role permissions in Azure AD](/azure/active-directory/users-groups-roles/directory-assign-admin-roles)

- [Use Azure Privileged Identity Management security alerts](../active-directory/privileged-identity-management/pim-how-to-configure-security-alerts.md)

- [Securing privileged access for hybrid and cloud deployments in Azure AD](/azure/active-directory/users-groups-roles/directory-admin-roles-secure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Isolate access to business-critical systems by restricting accounts which have been granted privileged access to the subscriptions and management groups they belong to. 

Restrict access to the management, identity, and security systems that have administrative access to your business critical assets, such as Active Directory Domain Controllers (DC), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets. 

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control. 

Ensure to assign separate privileged accounts that are distinct from the standard user accounts used for email, browsing, and productivity tasks.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Management Group Access](https://docs.microsoft.com/azure/governance/management-groups/overview#management-group-access)

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-3: Review and reconcile user access regularly

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [Find Azure AD activity reports](../active-directory/reports-monitoring/howto-find-activity-reports.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-4: Set up emergency access in Azure AD

**Guidance**: Set up an emergency account for access, when the regular administrative accounts are unavailable, to prevent being accidentally locked out of your Azure Active Directory (Azure AD) organization. Emergency access accounts may contain higher-level privileges and should not be assigned to specific individuals. Limit emergency access accounts to emergency or 'break glass' scenarios.

Ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them in emergent situations.

- [Manage emergency access accounts in Azure AD](/azure/active-directory/users-groups-roles/directory-emergency-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-5: Automate entitlement management 

**Guidance**: Use Azure Active Directory (Azure AD) entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.

- [What are Azure Active Directory (Azure AD) access reviews](../active-directory/governance/access-reviews-overview.md)

- [What is Azure Active Directory (Azure AD) entitlement management](../active-directory/governance/entitlement-management-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-6: Use privileged access workstations

**Guidance**: Use a Privileged Access Workstation (PAW) with  multifactor authentication from Azure Active Directory (Azure AD), enabled to log into and configure your Azure Sentinel-related resources.

- [Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [Planning a cloud-based Azure AD multifactor authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Azure role-based access control (Azure RBAC) allows you to manage Azure resource access through role assignments. You can assign these roles to users, group service principals, and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell, and the Azure portal.

The privileges you assign to resources through Azure RBAC should always be limited to what is required by the roles. Limited privileges complement the just in time (JIT) approach of Azure Active Directory (Azure AD) Privileged Identity Management (PIM), and those privileges should be reviewed periodically.

Use built-in roles to allocate permission and only create custom role when required.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Ensure that security teams have access to a continuously updated inventory of assets on Azure. Security teams often need this inventory to evaluate their organization's potential exposure to emerging risks, and as an input to continuously security improvements. 

The Azure Security Center inventory feature and Azure Resource Graph can query for and discover all resources  in your subscriptions, including Azure services, applications, and network resources.  

Logically organize assets according to your organization’s taxonomy using Tags as well as other metadata in Azure (Name, Description, and Category).  

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md)

- [For more information about tagging assets, see the resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### AM-3: Use only approved Azure services

**Guidance**: Microsoft Azure Peering Service supports Azure Resource Manager based deployments and configuration enforcement using Azure Policy in the 'Microsoft.Peering/peerings' namespace. Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Ensure you are monitoring different types of Azure assets for potential threats and anomalies. Focus on getting high-quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

Use the Azure Security Center built-in threat detection capability, which is based on monitoring Azure service telemetry and analyzing service logs. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the system and copies the data to your workspace for analysis. 

In addition, use Azure Sentinel to build analytics rules, which hunt threats that match  specific criteria across your environment. The rules generate incidents when the criteria are matched, so that you can investigate each incident. Azure Sentinel can also import third-party threat intelligence to enhance its threat detection capability. 

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

- [Azure Security Center security alerts reference guide](../security-center/alerts-reference.md)

- [Create custom analytics rules to detect threats](../sentinel/tutorial-detect-threats-custom.md)

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Azure Active Directory (Azure AD) provides user logs that can be viewed with Azure AD reporting or integrated with Azure Monitor. These logs can also be integrated with Azure Sentinel or other security information and event management (SIEM) solution or monitoring tools for more sophisticated monitoring and analytics use cases:

- Sign-in – The sign-in report provides information about the usage of managed applications and user sign-in activities

- Audit logs - Provides traceability through logs for all changes made by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies

- Risky sign-in - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account

- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised

Azure Security Center can also alert on certain suspicious activities such as an excessive number of failed authentication attempts by deprecated accounts in a subscription. In addition to the basic security hygiene monitoring, the Threat Protection module in Security Center can also collect additional in-depth security alerts from individual Azure compute resources (such as virtual machines, containers, app service), data resources (such as SQL DB and storage), and Azure service layers. This capability allows you to see account anomalies inside the individual resources.

- [Audit activity reports in Azure AD](../active-directory/reports-monitoring/concept-audit-logs.md)

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-3: Enable logging for Azure network activities

**Guidance**: Configure connection telemetry to provides insight into the connectivity between your connection location and the

Microsoft network via Microsoft Azure Peering Service.

- [Configure connection telemetry](measure-connection-telemetry.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-4: Enable logging for Azure resources

**Guidance**: Enable Azure Activity Log and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archival 

Activity logs provide insight into the operations that were performed on your Azure ExpressRoute resources at the control plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your  resources.

- [Azure Activity log](/azure/azure-monitor/platform/activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-5: Centralize security log management and analysis

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-6: Configure log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure resources according to your organization's compliance regulations.

- [How to set log retention parameters](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-2: Preparation – setup incident notification

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-3: Detection and analysis – create incidents based on high-quality alerts 

**Guidance**: Ensure you have a process to create high-quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High-quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-4: Detection and analysis – investigate an incident

**Guidance**: Ensure analysts can query and use diverse data sources, as they investigate potential incidents to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

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

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](https://docs.microsoft.com/azure/security-center/tutorial-security-incident#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

**Guidance**: Define security guardrails for infrastructure and DevOps teams by making it easy to securely configure the Azure services they use. 

Start your security configuration of Azure services with the service baselines   in the Azure Security Benchmark and customize as needed for your organization. 

Use Azure Security Center to configure Azure Policy to audit and enforce configurations of your Azure resources. 

You can use Azure Blueprints to automate deployment and configuration of services and application environments, including Azure Resource Manager  templates, Azure RBAC controls, and policies, in a single blueprint definition.

- [Illustration of guardrails implementation in enterprise-scale landing zone](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture#landing-zone-expanded-definition)

- [Working with security policies in Azure Security Center](../security-center/tutorial-security-policy.md)

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Blueprints](../governance/blueprints/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PV-2: Sustain secure configurations for Azure services

**Guidance**: Not applicable;  this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third-party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### GS-2: Define enterprise segmentation strategy 

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### GS-3: Define security posture management strategy

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### GS-4: Align organization roles, responsibilities, and accountabilities

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

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

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### GS-6: Define identity and privileged access strategy

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-benchmark-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-benchmark-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

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

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
