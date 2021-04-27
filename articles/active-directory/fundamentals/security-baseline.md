---
title: Azure security baseline for Azure Active Directory
description: The Azure Active Directory security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: active-directory
ms.topic: conceptual
ms.date: 04/07/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Active Directory

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../../security/benchmarks/overview.md) to Azure Active Directory. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Active Directory. 

> [!NOTE]
> **Controls** not applicable to Azure Active Directory, or for which the responsibility is Microsoft's, have been excluded from this baseline. To see how Azure Active Directory completely maps to the Azure Security Benchmark, see the [full Azure Active Directory security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-6: Simplify network security rules

**Guidance**: Use Azure Virtual Network Service Tags to define network access controls on network security groups or Azure Firewall configured for your Azure Active Directory resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name, like 'AzureActiveDirectory' in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

- [Understand and using Service Tags](../../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Use Azure Active Directory (Azure AD) as the default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in: 
- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications. 
- Your organization's resources, such as applications on Azure or your corporate network resources. 
 

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture. 

Azure AD supports external identity that allows users without a Microsoft account to sign in to their applications and resources with their external identity. 

- [Tenancy in Azure Active Directory](../develop/single-and-multi-tenant-apps.md)

- [How to create and configure an Azure AD instance](active-directory-access-create-new-tenant.md)

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers)

- [What is the identity secure score in Azure Active Directory](identity-secure-score.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-2: Manage application identities securely and automatically

**Guidance**: Use Managed Identity for Azure Resources for non-human accounts such as services or automation, it is recommended to use Azure-managed identity feature instead of creating a more powerful human account to access or execute your resources. You can natively authenticate to Azure services/resources that supports Azure Active Directory (Azure AD) authentication through pre-defined access grant rule without using credential hard coded in source code or configuration files. You cannot assign Azure managed identities to Azure AD resources but Azure AD is the mechanism to authenticate with managed identities assigned to other service's resources.

- [Managed Identity for Azure Resources](../managed-identities-azure-resources/overview.md)

- [Services that support Managed Identity for Azure Resources](../managed-identities-azure-resources/services-support-managed-identities.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Use Azure Active Directory to provide identity and access management to Azure resources, cloud applications, and on-premises applications. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. This enables single sign-on (SSO) to manage and secure access to your organization’s data and resources on-premises and in the cloud. Connect all your users, applications, and devices to the Azure AD for seamless, secure access and greater visibility and control.

 
- [Understand Application SSO with Azure AD](../manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Use Azure Active Directory to support strong authentication controls through multi-factor authentication (MFA), and strong passwordless methods.
- Multi-factor authentication - Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors.
- Passwordless authentication - Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of the strong authentication method is used, followed by rolling out the appropriate strong authentication policy to other users.

Azure AD supports Legacy password-based authentication such as Cloud-only accounts (user accounts created directly in Azure AD) that have a baseline password policy or Hybrid accounts (user accounts that come from on-premises Active Directory) that will follow the on-premises password policies. When using password-based authentication, Azure AD provides a password protection capability that prevents users from setting passwords that are easy to guess. Microsoft provides a global list of banned passwords that is updated based on telemetry, and customers can augment the list based on their needs (e.g. branding, cultural references, etc.). This password protection can be used for cloud-only and hybrid accounts.

Authentication based on password credentials alone is susceptible to popular attack methods. For higher security, use strong authentication such as MFA and a strong password policy. For third-party applications and marketplace services that may have default passwords, you should change them upon the service initial setup.

 
- [How to deploy Azure AD MFA](../authentication/howto-mfa-getstarted.md) 

 

 
- [Introduction to passwordless authentication options for Azure Active Directory](../authentication/concept-authentication-passwordless.md) 

 

 
- [Azure AD default password policy](https://docs.microsoft.com/azure/active-directory/authentication/concept-sspr-policy#password-policies-that-only-apply-to-cloud-user-accounts)

- [Eliminate bad passwords using Azure AD Password Protection](../authentication/concept-password-ban-bad.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-5: Monitor and alert on account anomalies

**Guidance**: Azure Active Directory provides the following data sources:

 
- Sign-ins - The sign-ins report provides information about the usage of managed applications and user sign-in activities.

 
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

 
- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

 
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

 

These data sources can be integrated with Azure Monitor, Azure Sentinel or third-party SIEM systems.

 

 
Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription.

 

 
Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

 

 
- [Audit activity reports in the Azure Active Directory](../reports-monitoring/concept-audit-logs.md) 

 

 
- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins) 

 

 
- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk) 

 

 
- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md) 

 

 
- [Alerts in Azure Security Center's threat intelligence protection module](../../security-center/alerts-reference.md) 

 

 
- [How to integrate Azure Activity Logs into Azure Monitor](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Use Azure Active Directory (Azure AD) Conditional Access for a more granular access control based on user-defined conditions, such as user logins from certain IP ranges will need to use MFA for login. Granular authentication session management policy can also be used for different use cases.

 
- [Azure AD Conditional Access overview](../conditional-access/overview.md) 

 

 
- [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md) 

 

 
- [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IM-8: Secure user access to legacy applications

**Guidance**: Ensure you have modern access controls and session monitoring for legacy applications and the data they store and process. While VPNs are commonly used to access legacy applications, they often have only basic access control and limited session monitoring.

 
Azure AD Application Proxy enables you to publish legacy on-premises applications to remote users with SSO while explicitly validating trustworthiness of both remote users and devices with Azure AD Conditional Access.

 

 
Alternatively, Microsoft Cloud App Security is a Cloud Access Security Broker (CASB) service that can provide controls for monitoring user’s application sessions and blocking actions (for both legacy on-premises applications and cloud software as a service (SaaS) applications).

 

 
- [Azure Active Directory Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy#what-is-application-proxy) 

 

 
- [Microsoft Cloud App Security best practices](/cloud-app-security/best-practices)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

**Guidance**: The most critical built-in roles are Azure AD are Global Administrator and the Privileged Role Administrator, as users assigned to these two roles can delegate administrator roles:

- Global Administrator: Users with this role have access to all administrative features in Azure AD, as well as services that use Azure AD identities.

- Privileged Role Administrator: Users with this role can manage role assignments in Azure AD, as well as within Azure AD Privileged Identity Management (PIM). In addition, this role allows management of all aspects of PIM and administrative units.

You may have other critical roles that need to be governed if you use custom roles with certain privileged permissions assigned. And you may also want to apply similar controls to the administrator account of critical business assets.

Azure AD has highly privileged accounts: the users and service principals that are directly or indirectly assigned to, or eligible for, the Global Administrator or Privileged Role Administrator roles, and other highly privileged roles in Azure AD and Azure.

Limit the number of highly privileged accounts and protect these accounts at an elevated level because users with this privilege can directly or indirectly read and modify every resource in your Azure environment.

You can enable just-in-time (JIT) privileged access to Azure resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT grants temporary permissions to perform privileged tasks only when users need it. PIM can also generate security alerts when there is suspicious or unsafe activity in your Azure AD organization.

- [Administrator role permissions in Azure AD](/azure/active-directory/users-groups-roles/directory-assign-admin-roles) 

- [Use Azure Privileged Identity Management security alerts](../privileged-identity-management/pim-how-to-configure-security-alerts.md) 

- [Securing privileged access for hybrid and cloud deployments in Azure AD](/azure/active-directory/users-groups-roles/directory-admin-roles-secure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Use Azure Active Directory Privileged Identity Management and Multi-factor authentication to restrict administrative access to business critical systems.

- [Privileged Identity Management approval of role activation requests](../privileged-identity-management/azure-ad-pim-approval-workflow.md)

- [Multi-factor authentication and Conditional Access](../conditional-access/howto-conditional-access-policy-admin-mfa.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-3: Review and reconcile user access regularly

**Guidance**: Review user account access assignments regularly to ensure the accounts and their access are valid, especially focused on the highly privileged roles including Global Administrator and Privileged Role Administrator. You can use Azure Active Directory (Azure AD) access reviews to review group memberships, access to enterprise applications, and role assignments, both for Azure AD roles and Azure roles. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

- [Create an access review of Azure AD roles in Privileged Identity Management (PIM)](../privileged-identity-management/pim-how-to-start-security-review.md)

- [Create an access review of Azure resource roles in Privileged Identity Management (PIM)](../privileged-identity-management/pim-resource-roles-start-access-review.md)

- [How to use Azure AD identity and access reviews](../governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-4: Set up emergency access in Azure AD

**Guidance**: To prevent being accidentally locked out of your Azure AD
organization, set up an emergency access account for access when normal
administrative accounts cannot be used. Emergency access accounts are usually
highly privileged, and they should not be assigned to specific individuals.
Emergency access accounts are limited to emergency or "break glass"'
scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password,
certificate, or smart card) for emergency access accounts are kept secure and
known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](/azure/active-directory/users-groups-roles/directory-emergency-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-5: Automate entitlement management 

**Guidance**: Use Azure AD entitlement management features to automate
access request workflows, including access assignments, reviews, and
expiration. Dual or multi-stage approval is also supported.

- [What is Azure AD entitlement management](../governance/entitlement-management-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-6: Use privileged access workstations

**Guidance**: Secured, isolated workstations are critically important for
the security of sensitive roles like administrators, developers, and critical
service operators. Use highly secured user workstations and/or Azure Bastion
for administrative tasks. Use Azure Active Directory, Microsoft Defender
Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure
and managed user workstation for administrative tasks. The secured workstations
can be centrally managed to enforce secured configuration including strong
authentication, software and hardware baselines, restricted logical and network
access.

- [Securing devices as part of privileged access](/security/compass/privileged-access-devices)

- [Privileged access implementation](/security/compass/privileged-access-deployment)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Customers can configure their Azure Active Directory (Azure AD) deployment for least
privilege, by assigning users to the roles with the minimum permissions needed
for users to complete their administrative tasks.

- [Administrator role permissions in Azure AD](../roles/permissions-reference.md)

- [Assign administrative roles in Azure AD](../roles/manage-roles-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PA-8: Choose approval process for Microsoft support  

**Guidance**: Azure Active Directory doesn't support customer lockbox. Microsoft may
work with customers through non-lockbox methods for approval to access customer
data.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-2: Protect sensitive data

**Guidance**: Consider the following guidance for implementing protection of your sensitive data:

- **Isolation:** A directory is the data boundary by which the Azure Active Directory (Azure AD) services
store and process data for a customer. 
Customers should determine where they want most of their Azure AD Customer
Data to reside by setting the Country property in their directory.

- **Segmentation:** The global administrator's role has full
control of all directory data, and the rules that govern access and processing
instructions. A directory may be segmented into administrative units, and
provisioned with users and groups to be managed by administrators of those
units, Global administrators may delegate responsibility to other principles in
their organization by assigning them to pre-defined roles or custom roles they
can create.

 
- **Access:** Permissions can be applied at a user,
group, role, application, or device. The
assignment may be permanent or temporal per Privileged Identity Management
configuration. 
  
- **Encryption:** Azure AD encrypts
all data at rest or in transit. The
offering does not allow customers to encrypt directory data with their own
encryption key. 

To determine how their selected country maps to the physical location of their directory see the 'Where is your data located article'.

- [Where your data is located article](https://www.microsoft.com/trust-center/privacy/data-location)

As the customer uses various Azure AD tools, features, and applications that interact with their directory, use the article Azure Active Directory – Where is your data located?

- [Where is your data located dashboard](https://msit.powerbi.com/view?r=eyJrIjoiYzEyZTc5OTgtNTdlZS00ZTVkLWExN2ItOTM0OWU4NjljOGVjIiwidCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsImMiOjV9)

- [Azure AD roles documentation](/azure/active-directory/roles/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### DP-4: Encrypt sensitive information in transit

**Guidance**: To complement access controls,
data in transit should be protected against ‘out of band’ attacks (e.g. traffic
capture) using encryption to ensure that attackers cannot easily read or modify
the data.

Azure AD supports data encryption in
transit with TLS v1.2 or greater.

While this is optional for traffic on private networks,
this is critical for traffic on external and public networks. For HTTP traffic,
ensure that any clients connecting to your Azure resources can negotiate TLS
v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for
Windows) instead of an unencrypted protocol. Obsoleted SSL, TLS, and SSH
versions and protocols, and weak ciphers should be disabled.

By default, Azure provides encryption for data in
transit between Azure data centers.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit) 

- [Information on TLS Security](/security/engineering/solving-tls1-problem) 

- [Double encryption for Azure data in transit](https://docs.microsoft.com/azure/security/fundamentals/double-encryption#data-in-transit)

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

- [Overview of Azure Management Groups](../../governance/management-groups/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Active Directory (Azure AD) Conditional Access to limit users' ability to interact with Azure AD via the Azure portal by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Use the Azure Active Directory (Azure AD) Identity Protection built-in threat detection capability for your Azure AD resources. 
 
 
 

 
Azure AD produces activity logs that are often used for threat detection and threat hunting. Azure AD sign-in logs provide a record of authentication and authorization activity for users, services, and apps. Azure AD audit logs track changes made to an Azure AD tenant, including changes that improve or diminish security posture.

- [What is Azure Active Directory Identity Protection?](../identity-protection/overview-identity-protection.md)

- [Connect Azure AD Identity Protection data to Azure Sentinel](../../sentinel/connect-azure-ad-identity-protection.md)

- [Connect Azure Active Directory data to Azure Sentinel](../../sentinel/connect-azure-active-directory.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Azure Active Directory (Azure AD) provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases: 
- Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities. 
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies. 
- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 
- Risky users - A risky user is an indicator for a user account that might have been compromised. 

Identity Protection risk detections are enabled by default and require no onboarding process. The granularity or risk data is determined by license SKU. 

- [Audit activity reports in the Azure Active Directory](../reports-monitoring/concept-audit-logs.md)  

- [Enable Azure Identity Protection](../identity-protection/overview-identity-protection.md)  

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-4: Enable logging for Azure resources

**Guidance**: Azure Active Directory (Azure AD) produces activity logs. Unlike some Azure services, Azure AD does not make a distinction between activity and resource logs. Activity logs are automatically available in the Azure AD section of the Azure portal, and can be exported to Azure Monitor, Azure Event Hubs, Azure Storage, SIEMs, and other locations.
 
- Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.  
 
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.  
 
 

Azure AD also provides security-related logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases: 
- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Risky users - A risky user is an indicator for a user account that might have been compromised. 

Identity Protection risk detections are enabled by default and require no onboarding process. The granularity or risk data is determined by license SKU. 

 
- [Activity and security reports in Azure Active Directory](../reports-monitoring/overview-reports.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-5: Centralize security log management and analysis

**Guidance**: We recommend the following guidelines when customers want to centralize their security logs for easier threat hunting and security posture analysis:
 
- Centralize logging storage and analysis to enable correlation. For each log source within Azure AD, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.  
 
- Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.  
 
- In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.  
 

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.  
 

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings)   
 

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### LT-6: Configure log storage retention

**Guidance**: Ensure that any storage accounts or Log Analytics workspaces used for storing Azure Active Directory sign-in logs, audit logs, and risk data logs has the log retention period set according to your organization's compliance regulations.

In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage.

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)  

- [Storing resource logs in an Azure Storage Account](/azure/azure-monitor/platform/resource-logs-collect-storage)

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

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-3: Detection and analysis – create incidents based on high-quality alerts 

**Guidance**: Ensure you have a process to create high-quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High-quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-4: Detection and analysis – investigate an incident

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

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](https://docs.microsoft.com/azure/security-center/tutorial-security-incident#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

**Guidance**: Microsoft identity and access management solutions help IT
protect access to applications and resources across on-premises and in the
cloud. It is important that organizations follow security best practices to
ensure their Identity and access management implementation is secure and more
resilient to attacks. 

Based on your Identity and access management implementation
strategy your organization should follow the Microsoft best practice guidance
to secure your identity infrastructure. 

Organizations that collaborate with external partners should
additionally assess and implement appropriate governance, security, and compliance
configurations to reduce security risk and protect sensitive resources.

- [Azure Identity Management and access control security best practices](../../security/fundamentals/identity-management-best-practices.md)

- [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md)

- [Securing external collaboration in Azure Active Directory and Microsoft 365](secure-external-access-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PV-2: Sustain secure configurations for Azure services

**Guidance**: Microsoft Secure Score provides organizations
a measurement of their security posture and recommendations that can help
protect organizations from threats. It is recommended that organizations
routinely review their Secure Score for suggested improvement actions to
improve their identity security posture. 

- [What is the identity secure score in Azure Active Directory?](identity-secure-score.md)

- [Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../../security/fundamentals/pen-testing.md)

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
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption)
 

 
- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../../security/fundamentals/encryption-overview.md) 

 
- [Cloud Adoption Framework - Azure data security and encryption best practices](../../security/fundamentals/data-encryption-best-practices.md) 

 
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

- [Azure network security overview](../../security/fundamentals/network-overview.md)

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

- [Azure identity management security overview](../../security/fundamentals/identity-management-overview.md)

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
