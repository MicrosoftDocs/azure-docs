---
title: Azure security baseline for Azure Lighthouse
description: The Azure Lighthouse security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-lighthouse
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Lighthouse

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](overview.md) to Azure Lighthouse. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Lighthouse. **Controls** not applicable to Azure Lighthouse have been excluded.

To see how Azure Lighthouse completely maps to the Azure Security Benchmark, see the [full Azure Lighthouse security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40234.).

**Guidance**: Not applicable; Azure Lighthouse resources does not support deploying directly into any virtual network, because of this you can not leverage certain networking features with the Azure Lighthouse's resources such as network security groups, route tables, or other network dependent appliances such as an Azure Firewall.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-2: Connect private networks together

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40235.).

**Guidance**: Not applicable; Azure Lighthouse does not expose any endpoints that can be accessed via a private network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-3: Establish private network access to Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40236.).

**Guidance**: Not applicable; Azure Lighthouse does not allow for its resources to be secured to a private network via the Private Link service or Service Endpoints.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-4: Protect applications and services from external network attacks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40237.).

**Guidance**: Not applicable; Azure Lighthouse does not support deploying directly into a virtual network, because of this you can not leverage traditional networking features to prevent denial of service (DDoS) attacks with native Azure network features like DDoS Protection Standard.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40238.).

**Guidance**: Not applicable; Azure Lighthouse does not support deploying into a virtual network and cannot be configured with an IDS or IPS solution for detecting or preventing threats on the network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-6: Simplify network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40239.).

**Guidance**: Not applicable; this recommendation is intended for offerings that can be deployed into Azure Virtual Networks, or have the capability to define groupings of allowed IP ranges for efficient management. Azure Lighthouse does not currently support service tags, or it is not designed to deploy into Azure virtual networks.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-7: Secure Domain Name Service (DNS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40240.).

**Guidance**: Not applicable; Azure Lighthouse does not expose its underlying DNS configurations, these settings are maintained by Microsoft.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40220.).

**Guidance**: Azure Lighthouse uses Azure Active Directory (Azure AD) as the default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:
Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Note: Azure AD supports external identity that allow users without a Microsoft account to sign-in to their applications and resources with their external identity.

- [Tenancy in Azure Active Directory](../../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers) 

- [What is the identity secure score in Azure Active Directory](../../active-directory/fundamentals/identity-secure-score.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40221.).

**Guidance**: Not applicable; Azure Lighthouse doesn't use any identities or manage any secrets for identities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40222.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support SSO for authentication to its resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40223.).

**Guidance**: Not applicable; Azure Lighthouse doesn't provide capability to support strong authentication.

(With PIM integration we have in future this might change, this feature and its documentation is not yet public)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-5: Monitor and alert on account anomalies

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40224.).

**Guidance**: Not applicable; Azure Lighthouse doesn't use any sensitive accounts or there is no account activity logs or logs are not exportable by customers.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-6: Restrict Azure resource access based on conditions

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40225.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support capability of conditional access

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-7: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40226.).

**Guidance**: Not applicable; Azure Lighthouse doesn't allow customer to deploy any persisted data into the running environment.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-8: Secure user access to legacy applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40262.).

**Guidance**: Not applicable; Azure Lighthouse doesn't access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40227.).

**Guidance**: Not applicable; Azure Lighthouse doesn't use any administrative accounts

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40228.).

**Guidance**: Azure Lighthouse uses Azure RBAC to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

Azure Components and Reference model /security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151 

Management Group Access ../../governance/management-groups/overview.md#management-group-access 

Azure subscription administrators ../../cost-management-billing/manage/add-change-subscription-administrator.md

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40229.).

**Guidance**: Azure Lighthouse uses Azure Active Directory (AAD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid. You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Note: Some Azure services support local users and roles which not managed through Azure AD. You will need to manage these users separately.

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overvie)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40230.).

**Guidance**: Azure Lighthouse is integrated with Azure Active Directory to manage its resources. To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](/azure/active-directory/users-groups-roles/directory-emergency-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-5: Automate entitlement management 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40231.).

**Guidance**: Azure Lighthouse is integrated with Azure Active Directory to manage its resources. Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.

- [What are Azure AD access reviews](/azure/active-directory/governance/access-reviews-overview) 

- [What is Azure AD entitlement management](../../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-6: Use privileged access workstations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40232.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support management from a customer workstation.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-7: Follow just enough administration (least privilege principle) 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40233.).

**Guidance**: Azure Lighthouse is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. The privileges you assign to resources through the Azure RBAC should be always limited to what is required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Use built-in roles to allocate permission and only create custom role when required.

What is Azure role-based access control (Azure RBAC) ../../role-based-access-control/overview.md 

- [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-8: Choose approval process for Microsoft support  

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40289.).

**Guidance**: Not applicable; Azure Lighthouse doesn't store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40241.).

**Guidance**: Not applicable; Azure Lighthouse does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40242.).

**Guidance**: Not applicable; Azure Lighthouse does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40243.).

**Guidance**: Not applicable; Azure Lighthouse does not store, process or transmit sensitive data
.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40244.).

**Guidance**: Not applicable; Azure Lighthouse does not store, process or transmit sensitive data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-5: Encrypt sensitive data at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40245.).

**Guidance**: Not applicable; Azure Lighthouse does not itself interact with encrypt sensitive data at rest and thus there are no settings or any required configuration to protect sensitive data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40263.).

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40264.).

**Guidance**: Not applicable; Azure Lighthouse does not allow for automated asset discovery for access by security teams. Thus it cannot be used with any asset inventory and metadata processes.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-3: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40265.).

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40266.).

**Guidance**: Not applicable. The Azure Lighthouse can not be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets which are considered high-impact. It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40267.).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.
- [How to configure Conditional Access to block access to Azure Resources Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40268.).

**Guidance**: Not applicable; Azure Lighthouse is not comprised of any virtual machines or containers which would either expose compute resources or allow customers to install applications on them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40246.).

**Guidance**: Not applicable, Azure Lighthouse does not provide native capabilities to monitor security threats related to its resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-2: Enable threat detection for Azure identity and access management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40247.).

**Guidance**: Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:

Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you have visibility on account anomalies inside the individual resources.

Audit activity reports in the Azure Active Directory
../../active-directory/reports-monitoring/concept-audit-logs.md 

- [Enable Azure Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md) 

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40248.).

**Guidance**: Not applicable, Azure Lighthouse is not intended to deploy into virtual networks, because of this you are unable to enable network security group flow logging, route traffic through a firewall or perform packet captures

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-4: Enable logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40249.).

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your Azure Lighthouse resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../../azure-monitor/platform/platform-logs-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40250.).

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-6: Configure log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40251.).

**Guidance**: Not applicable; Azure Lighthouse does not currently produce any security-related logs, and the customer is unable to set any log retention.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-7: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40252.).

**Guidance**: Not applicable; Azure Lighthouse does not support configuring your own time synchronization sources. The Azure Lighthouse service relies on Microsoft time synchronization sources, and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40253.).

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40254.).

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40255.).

**Guidance**: Ensure you have a process to create high quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40256.).

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40257.).

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40258.).

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40273.).

**Guidance**: Azure Lighthouse supports below service-specific policies that are available in Azure Security Center to audit and enforce configurations of your Azure resources. This can be configured in Azure Security Center or Azure Policy initiatives.

- [Azure Lighthouse Policies](../../lighthouse/samples/policy-reference.md)

You can use Azure Blueprints to automate deployment and configuration of services and application environments including Azure Resources Manager templates, Azure RBAC controls, and policies, in a single blueprint definition.

Working with security policies in Azure Security Center ../../security-center/tutorial-security-policy.md 

Illustration of Guardrails implementation in Enterprise Scale Landing Zone /azure/cloud-adoption-framework/ready/enterprise-scale/architecture#landing-zone-expanded-definition 

- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md) 

- [Azure Blueprints](../../governance/blueprints/overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-2: Sustain secure configurations for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40274.).

**Guidance**: Azure Lighthouse supports below service-specific policies that are available in Azure Security Center to audit and enforce configurations of your Azure resources. This can be configured in Azure Security Center or Azure Policy initiatives.

- [Azure Lighthouse Policies](../../lighthouse/samples/policy-reference.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-3: Establish secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40275.).

**Guidance**: Use Azure Security Center and Azure Policy to establish secure configurations on all compute resources including VMs, containers, and others.

- [How to monitor Azure Security Center recommendations](../../security-center/security-center-recommendations.md) 

- [Security recommendations - a reference guide](../../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-4: Sustain secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40276.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-5: Securely store custom operating system and container images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40277.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-6: Perform software vulnerability assessments

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40278.).

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Lighthouse.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40279.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-8: Conduct regular attack simulation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40280.).

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40259.).

**Guidance**: Not applicable; Azure Lighthouse is not comprised of any virtual machines or containers which would require Endpoint Detection and Response (EDR) protection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-2: Use centrally managed modern anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40260.).

**Guidance**: Not applicable, Azure Lighthouse or its resources do not interact with virtual machines, containers and/or storage which require anti-malware protection. Thus, there is no need for any configuration changes, additional settings or deployment of any extra services to protect it from malware.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40261.).

**Guidance**: Not applicable, Azure Lighthouse is not comprised of any virtual machines or containers which would require anti-malware protection. Thus it does not require you to configure any additional settings or deploy any extra services to protect it from malware.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40269.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support any data backup or have no needs for data backup.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-2: Encrypt backup data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40270.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support any data backup encryption.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40271.).

**Guidance**: Not applicable; Azure Lighthouse doesn't support any data backup

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-4: Mitigate risk of lost keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40272.).

**Guidance**: Not applicable; Azure Lighthouse doesn't manage any keys.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40281.).

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
- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40288.).

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40282.).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40283.).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40284.).

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

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40285.).

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

- [Azure identity management security overview](../fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40286.).

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

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
