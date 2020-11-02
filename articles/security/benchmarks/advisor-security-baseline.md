---
title: Azure security baseline for Azure Advisor
description: The Azure Advisor security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: advisor
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Advisor

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](overview.md) to Azure Advisor. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Advisor. **Controls** not applicable to Azure Advisor have been excluded.

To see how Azure Advisor completely maps to the Azure Security Benchmark, see the [full Azure Advisor security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39534.).

**Guidance**: Azure Advisor does not support deploying directly into a virtual network, because of this you can not leverage certain networking features with the offering's resources such as network security groups, route tables, or other network dependent appliances such as an Azure Firewall.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-2: Connect private networks together

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39535.).

**Guidance**: Not applicable; Azure Advisor is not designed to deploy into or be secured to a private network, this control is intended to describe network connectivity and does not apply.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-3: Establish private network access to Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39536.).

**Guidance**: Not applicable; Azure Advisor is not designed to deploy into or be secured to a virtual network for access.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-4: Protect applications and services from external network attacks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39537.).

**Guidance**: Not applicable; Azure Advisor does not expose any endpoints to external networks which need to be secured by conventional network protections.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39538.).

**Guidance**: Not applicable; Azure Advisor does not support deploying into a virtual network and cannot be configured with an IDS or IPS solution for detecting or preventing threats on the network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-6: Simplify network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39539.).

**Guidance**: Not applicable; 

Azure Advisor does not currently support service tags or representing its public IP range as a grouping of service IPs for reference in network security rules.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-7: Secure Domain Name Service (DNS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39540.).

**Guidance**: Not applicable; This control is intended for offerings that expose DNS configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39520.).

**Guidance**: Azure Advisor uses Azure Active Directory (Azure AD) as the default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:
Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Note: Azure AD supports external identity that allow users without a Microsoft account to sign-in to their applications and resources with their external identity.

- [Tenancy in Azure Active Directory](../../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers) 

- [What is the identity secure score in Azure Active Directory](../../active-directory/fundamentals/identity-secure-score.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-2: Manage application identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39521.).

**Guidance**: Not applicable; Azure Advisor doesn't use any identities or manage any secrets for identities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39522.).

**Guidance**: Not applicable; Azure Advisor doesn't support SSO for authentication to its resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39523.).

**Guidance**: Azure Advisor uses Azure Active Directory that supports strong authentication controls through multi-factor authentication (MFA), and strong passwordless methods.
Multi-factor authentication - Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors.

Passwordless authentication – Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of the strong authentication method are used, followed by rolling out the appropriate strong authentication policy to other users.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-5: Monitor and alert on account anomalies

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39524.).

**Guidance**: Azure Advisor is integrated with Azure Active Directory in which provides the following data sources:
Sign-ins - The sign-ins report provides information about the usage of managed applications and user sign-in activities.

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third party SIEM systems.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription.

Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in the Azure Active Directory](../../active-directory/reports-monitoring/concept-audit-logs.md) 

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins) 

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk) 

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md) 

- [Alerts in Azure Security Center's threat intelligence protection module](../../security-center/alerts-reference.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-6: Restrict Azure resource access based on conditions

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39525.).

**Guidance**: Not applicable; Azure Advisor doesn't support capability of conditional access.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-7: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39526.).

**Guidance**: Not applicable; Azure Advisor doesn't allow customer to deploy any persisted data into the running environment.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-8: Secure user access to legacy applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39562.).

**Guidance**: Not applicable; Azure Advisor doesn't access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39527.).

**Guidance**: Not applicable; Azure Advisor doesn't use any administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39528.).

**Guidance**: Azure Advisor use Azure RBAC to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

Azure Components and Reference model /security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151 

Management Group Access ../../governance/management-groups/overview.md#management-group-access 

Azure subscription administrators ../../cost-management-billing/manage/add-change-subscription-administrator.md

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-3: Review and reconcile user access regularly

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39529.).

**Guidance**: Azure Advisor uses Azure Active Directory (AAD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid. You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Note: Some Azure services support local users and roles which not managed through Azure AD. You will need to manage these users separately.

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overvie)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-4: Set up emergency access in Azure AD

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39530.).

**Guidance**: Not applicable; Azure Advisor doesn't support emergency accounts or doesn't need emergency accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-5: Automate entitlement management 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39531.).

**Guidance**: Not applicable; Azure Advisor doesn't support any automation on account or role management.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-6: Use privileged access workstations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39532.).

**Guidance**: Not applicable; Azure Advisor doesn't support management from a customer workstation.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-7: Follow just enough administration (least privilege principle) 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39533.).

**Guidance**: Azure Advisor is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. The privileges you assign to resources through the Azure RBAC should be always limited to what is required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Use built-in roles to allocate permission and only create custom role when required.

What is Azure role-based access control (Azure RBAC) ../../role-based-access-control/overview.md 

- [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-8: Choose approval process for Microsoft support  

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39589.).

**Guidance**: Not applicable; Azure Advisor doesn't store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39541.).

**Guidance**: Not applicable; Azure Advisor does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39542.).

**Guidance**: Not applicable; Azure Advisor does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39543.).

**Guidance**: Not applicable; Azure Advisor does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39544.).

**Guidance**: Not applicable; Azure Advisor does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-5: Encrypt sensitive data at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39545.).

**Guidance**: Not applicable; Azure Advisor does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39563.).

**Guidance**: Not applicable; The Azure Security Center 'Security Reader' role does not provide risk visibility for Azure Advisor

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-2: Ensure security team has access to asset inventory and metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39564.).

**Guidance**: Not applicable; Azure Advisor does not allow for automated asset discovery for access by security teams. Thus it cannot be used with any asset inventory and metadata processes.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-3: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39565.).

**Guidance**: Not applicable; Azure Advisor does not have assets under management that the customer can configure.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-4: Ensure security of asset lifecycle management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39566.).

**Guidance**: Not applicable; customer can not use Azure Advisor capabilities to inventory and manage assets.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39567.).

**Guidance**: Not applicable; Azure Advisor does not provide capabilities to customers to limit their users' ability to access Azure Resource Manager. The customer should restrict this access with other means or methods.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-6: Use only approved applications in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39568.).

**Guidance**: Not applicable; Azure Advisor is not comprised of any virtual machines or containers which would either expose compute resources or allow customers to install applications on them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39546.).

**Guidance**: Not applicable; Azure Advisor does not currently produce customer facing resource logs that can be used for threat detection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-2: Enable threat detection for Azure identity and access management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39547.).

**Guidance**: Not applicable; Azure Advisor does not produce any logs related to identity and access management.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-3: Enable logging for Azure network activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39548.).

**Guidance**: Not applicable; Azure Advisor either does not: support integrating with networks, or does not expose its network-related activities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-4: Enable logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39549.).

**Guidance**: Not applicable; Azure Advisor does not produce or expose any logs related to its resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-5: Centralize security log management and analysis

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39550.).

**Guidance**: Not applicable; Azure Advisor does not produce or process any security related logs which would need to be collected centrally for management or analysis.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-6: Configure log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39551.).

**Guidance**: Azure Advisor does not currently produce any security-related logs, and the customer is unable to set any log retention.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-7: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39552.).

**Guidance**: Azure Advisor does not support configuring your own time synchronization sources. The Azure Advisor service relies on Microsoft time synchronization sources, and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39553.).

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness. Check that your service offering is included in the incident response process, as applicable.

- [Implement security across the enterprise environment](https://aka.ms/AzSec4) 

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39554.).

**Guidance**: Set up security incident contact information in Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs.

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md) 

Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39555.).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The
severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39556.).

**Guidance**: Build out an incident response guide for your organization. Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../../security-center/security-center-planning-and-operations-guide.md) 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process) 

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39557.).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (such as, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39558.).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.
- [How to configure Workflow Automation and Logic Apps](../../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39573.).

**Guidance**: Not applicable; Azure Advisor doesn't have any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-2: Sustain secure configurations for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39574.).

**Guidance**: Not applicable; Azure Advisor doesn't have any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-3: Establish secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39575.).

**Guidance**: Not applicable; Azure Advisor doesn't have any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-4: Sustain secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39576.).

**Guidance**: Not applicable; Azure Advisor doesn't have any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-5: Securely store custom operating system and container images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39577.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-6: Perform software vulnerability assessments

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39578.).

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Advisor.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39579.).

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Advisor.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-8: Conduct regular attack simulation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39580.).

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.

Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../fundamentals/pen-testing.md)  Penetration

- [Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39559.).

**Guidance**: Not applicable; Azure Advisor is not comprised of any virtual machines or containers which would require Endpoint Detection and Response (EDR) protection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-2: Use centrally managed modern anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39560.).

**Guidance**: Microsoft Antimalware for Azure Cloud Services is the default anti-malware for Windows virtual machines (VMs). For Linux VMs, use third party antimalware solution. Also, you can use Azure Security Center's Threat detection for data services to detect malware uploaded to Azure Storage accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39561.).

**Guidance**: Microsoft Antimalware for Azure Cloud Services is the default anti-malware for Windows virtual machines (VMs). For Linux VMs, use third party antimalware solution. Also, you can use Azure Security Center's Threat detection for data services to detect malware uploaded to Azure Storage accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39569.).

**Guidance**: Not applicable; Azure Advisor uses Cosmos DB as the data storage with a TTL of 24 hours.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-2: Encrypt backup data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39570.).

**Guidance**: Not applicable; Azure Advisor doesn't support any data backup encryption.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39571.).

**Guidance**: Not applicable; Azure Advisor doesn't support any data backup and doesn't include customer managed keys.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-4: Mitigate risk of lost keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39572.).

**Guidance**: Not applicable; Azure Advisor doesn't manage any keys.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39581.).

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
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39588.).

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
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39582.).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39583.).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](https://aka.ms/AzSec1)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](https://aka.ms/AzSec2)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](https://aka.ms/AzSec3)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39584.).

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39585.).

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

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure identity management security overview](../fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39586.).

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

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](https://aka.ms/AzSec11)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
