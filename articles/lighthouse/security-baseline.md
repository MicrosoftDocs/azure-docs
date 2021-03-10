---
title: Azure security baseline for Azure Lighthouse
description: The Azure Lighthouse security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: lighthouse
ms.topic: conceptual
ms.date: 11/19/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Lighthouse

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Azure Lighthouse. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Lighthouse. **Controls** not applicable to Azure Lighthouse have been excluded.

To see how Azure Lighthouse completely maps to the Azure Security Benchmark, see the [full Azure Lighthouse security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Azure Lighthouse uses Azure Active Directory (Azure AD) as the default identity and access management service. Standardize Azure AD to govern your organization’s identity and access management in:
- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.
- Your organization's resources, such as applications on Azure or your corporate network resources.

With Azure Lighthouse, designated users in a managing tenant have an Azure built-in role which lets them access delegated subscriptions and/or resource groups in a customer's tenant. All built-in roles are currently supported except for Owner or any built-in roles with DataActions permission. The User Access Administrator role is supported only for limited use in assigning roles to managed identities. Custom roles and classic subscription administrator roles are not supported.

- [Tenancy in Azure Active Directory](../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for application](../active-directory/external-identities/identity-providers.md) 

- [What is the identity secure score in Azure Active Directory](../active-directory/fundamentals/identity-secure-score.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

**Guidance**: Azure managed identities can authenticate to Azure services and resources that support Azure AD authentication. Authentication is enabled through pre-defined access grant rules, avoiding hard-coded credentials in source code or configuration files. With Azure Lighthouse, users with the User Access Administrator role on a customer's subscription can create a managed identity in that customer's tenant. While this role is not generally supported with Azure Lighthouse, it can be used in this specific scenario, allowing the users with this permission to assign one or more specific built-in roles to managed identities.

For services that do not support managed identities, use Azure AD to create a service principal with restricted permissions at the resource level instead. Azure Lighthouse allows service principals to access customer resources according to the roles they are granted during the onboarding process. It is recommended to configure service principals with certificate credentials and fall back to client secrets. In both cases, Azure Key Vault can be used in conjunction with Azure managed identities, so that the runtime environment (such as an Azure function) can retrieve the credential from the key vault.

- [Azure managed identities](../active-directory/managed-identities-azure-resources/overview.md)

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps)

- [Use Azure Key Vault for security principal registration](../key-vault/general/authentication.md#authorize-a-security-principal-to-access-key-vault)

- [Create a user who can assign roles to a managed identity in a customer tenant](how-to/deploy-policy-remediation.md#create-a-user-who-can-assign-roles-to-a-managed-identity-in-the-customer-tenant)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Require Multi-Factor Authentication (MFA) for all users in your managing tenant, including users who will have access to delegated customer resources. We suggest that you ask your customers to implement MFA in their tenants as well.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

**Guidance**: Azure AD provides the following data sources: 

-	Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

-	Audit logs - Provides traceability through logs for all changes made through various features in Azure AD. Examples of logged changes audit logs include adding or removing users, apps, groups, roles, and policies.

-	Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

-	Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third-party SIEM systems.

Service providers using Azure Lighthouse can forward Azure AD logs to Azure Sentinel and view/set alerts across tenants to monitor and alert on account anomalies.

- [Audit activity reports in Azure AD](../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [Manage Azure Sentinel workspaces at scale](how-to/manage-sentinel-workspaces.md)

- [Connect data from Azure AD to Azure Sentinel](../sentinel/connect-azure-active-directory.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Azure Lighthouse does not support a conditional access capability for delegated customer resources. In the managing tenant, use Azure AD conditional access for more granular access control based on user-defined conditions, such as requiring user logins from certain IP ranges to using Multi-Factor Authentication (MFA). A granular authentication session management can also be used through Azure AD conditional access policy for different use cases. 

You should require MFA for all users in your managing tenant, including users who will have access to delegated customer resources. We suggest that you ask your customers to implement MFA in their tenants as well.

- [Azure Conditional Access overview](../active-directory/conditional-access/overview.md)

- [Common Conditional Access policies](../active-directory/conditional-access/concept-conditional-access-policy-common.md)

- [Configure authentication session management with Conditional Access](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-1: Protect and limit highly privileged users

**Guidance**: Limit the number of highly privileged user accounts, and protect these accounts at an elevated level. A Global Administrator account is not required to enable and use Azure Lighthouse.

To access tenant-level Activity Log data, an account must be assigned the Monitoring Reader Azure built-in role at root scope (/). Because the Monitoring Reader role at root scope is a broad level of access, we recommend that you assign this role to a service principal account, rather than to an individual user or to a group. This assignment must be performed by a user who has the Global Administrator role with additional elevated access. This elevated access should be added immediately before making the role assignment, then removed when the assignment is complete.

- [Administrator role permissions in Azure AD](../active-directory/roles/permissions-reference.md)

- [Assigning access to monitor tenant-level Activity Log data](how-to/monitor-delegation-changes.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure Lighthouse uses Azure role-based access control (Azure RBAC) to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Be sure to follow the principle of least privilege so that users only have the permissions needed to perform their specific tasks.

Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Management Group Access](../governance/management-groups/overview.md#management-group-access)

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

- [Best practices for defining users and roles for Azure Lighthouse](concepts/tenants-users-roles.md#best-practices-for-defining-users-and-roles)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

**Guidance**: Azure Lighthouse uses Azure Active Directory (Azure AD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid. You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

Customers can review the level of access granted to users in the managing tenant via Azure Lighthouse in the Azure portal. They can remove this access at any time.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Note: that some Azure services support local users and roles which not managed through Azure AD. You will need to manage these users separately.

- [Create an access review of Azure resource roles in Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [Removing access to a delegation](how-to/remove-delegation.md)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Viewing the Service providers page in the Azure portal](how-to/view-manage-service-providers.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

**Guidance**: Azure Lighthouse is integrated with Azure Active Directory to manage its resources. To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../active-directory/roles/security-emergency-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-5: Automate entitlement management 

**Guidance**: Azure Lighthouse is integrated with Azure Active Directory (Azure AD)  to manage its resources. Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.

- [What are Azure AD access reviews](../active-directory/governance/access-reviews-overview.md) 

- [What is Azure AD entitlement management](../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-6: Use privileged access workstations

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Depending on your requirements, you can use highly secured user workstations and/or Azure Bastion for performing administrative tasks with Azure Lighthouse in production environments. Use Azure Active Directory, Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration, including strong authentication, software and hardware baselines, and restricted logical and network access. 

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Azure Lighthouse is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these built-in roles to users, groups, service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. The privileges you assign to resources through the Azure RBAC should be always limited to what is required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically. Use built-in roles to allocate permission and only create custom roles when required.

Azure Lighthouse allows access to delegated customer resources using Azure built-in roles. In most case, you'll want to assign these roles to a group or service principal, rather than to many individual user accounts. This lets you add or remove access for individual users without having to update and republish the plan when your access requirements change.

To delegate customer resources to a managing tenant, a deployment must be done by a non-guest account in the customer's tenant who has the Owner built-in role for the subscription being onboarded (or which contains the resource groups that are being onboarded).

- [Understand tenants, users, and roles in Azure Lighthouse](concepts/tenants-users-roles.md)

- [How to apply the principle of least privilege to Azure Lighthouse](concepts/recommended-security-practices.md#assign-permissions-to-groups-using-the-principle-of-least-privilege)

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Customers' security teams can review activity logs to see activity taken by service providers who use Azure Lighthouse. 

If a service provider wants to allow their security team to review delegated customer resources, the security team's authorizations should include the Reader built-in role.

- [How a customer can review service provider activity](how-to/view-service-provider-activity.md)

- [How to specify roles when onboarding a customer to Azure Lighthouse](how-to/onboard-customer.md#define-roles-and-permissions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: Remove access to resources that have been delegated through Azure Lighthouse once they are no longer needed, so that service providers no longer have access. Access can be removed by either the customer or by the service provider. 

- [Remove access to a delegation](how-to/remove-delegation.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Azure Lighthouse is integrated with Azure Active Directory (Azure AD) for identity and authentication. You can use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Through Azure Lighthouse, you can monitor your customers' Azure resources for potential threats and anomalies. Focus on getting high-quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

Use the Azure Security Center built-in threat detection capability, which is based on monitoring Azure service telemetry and analyzing service logs. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the system and copies the data to your workspace for analysis. 

In addition, use Azure Sentinel to build analytics rules, which hunt threats that match specific criteria across your customer's environment. The rules generate incidents when the criteria are matched, so that you can investigate each incident. Azure Sentinel can also import third-party threat intelligence to enhance its threat detection capability. 

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

- [Azure Security Center security alerts reference guide](../security-center/alerts-reference.md)

- [Create custom analytics rules to detect threats](../sentinel/tutorial-detect-threats-custom.md)

- [Manage Azure Sentinel workspaces at scale](how-to/manage-sentinel-workspaces.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Through Azure Lighthouse, you can use Azure Security Center to alert on certain suspicious activities in the customer tenants you manage, such as an excessive number of failed authentication attempts, and deprecated accounts in the subscription.

Azure Active Directory (Azure AD) provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:
- Sign-in – The sign-in report provides information about the usage of managed applications and user sign-in activities.
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.
- Risky sign-in - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability provides visibility on account anomalies inside the individual resources. 

- [Enhanced services and scenarios with Azure Lighthouse](concepts/cross-tenant-management-experience.md#enhanced-services-and-scenarios)

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md) 

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your Azure Lighthouse resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

With Azure Lighthouse, you can use Azure Monitor Logs in a scalable way across the customer tenants you're managing. Create Log Analytics workspaces directly in the customer tenants so that customer data remains in their tenants rather than being exported into yours. This also allows centralized monitoring of any resources or services supported by Log Analytics, giving you more flexibility on what types of data you monitor.

Customers who have delegated subscriptions for Azure Lighthouse can view Azure Activity log data to see all actions taken. This gives customers full visibility into operations that service providers are performing, along with operations done by users within the customer's own Azure Active Directory (Azure AD) tenant.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md)

- [Monitor delegated resources at scale](how-to/monitor-at-scale.md)

- [View service provider activity](how-to/view-service-provider-activity.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure Activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

With Azure Lighthouse, you can use Azure Monitor Logs in a scalable way across the customer tenants you're managing. Create Log Analytics workspaces directly in the customer tenants so that customer data remains in their tenants rather than being exported into yours. This also allows centralized monitoring of any resources or services supported by Log Analytics, giving you more flexibility on what types of data you monitor.

Customers who have delegated subscriptions for Azure Lighthouse can view Azure Activity log data to see all actions taken. This gives customers full visibility into operations that service providers are performing, along with operations done by users within the customer's own Azure Active Directory (Azure AD) tenant.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [Monitor delegated resources at scale](how-to/monitor-at-scale.md)

- [How customers can view service provider activity](how-to/view-service-provider-activity.md)

- [Manage Azure Sentinel workspaces at scale](how-to/manage-sentinel-workspaces.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-6: Configure log storage retention

**Guidance**: Azure Lighthouse does not currently produce any security-related logs. Customers who want to view service provider activity can configure log retention according to compliance, regulation, and business requirements. 

In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage.

- [Change the data retention period in Log Analytics](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](../storage/common/manage-storage-analytics-logs.md#configure-logging)

- [Azure Security Center alerts and recommendations export](../security-center/continuous-export.md)
configure  and the customer is unable to set any log retention.

- [How a customer can review activity log data for service providers](how-to/view-service-provider-activity.md)

**Azure Security Center monitoring**: Not applicable

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

### PV-1: Establish secure configurations for Azure services 

**Guidance**: Azure Lighthouse supports below service-specific policies that are available in Azure Security Center to audit and enforce configurations of your Azure resources. This can be configured in Azure Security Center or Azure Policy initiatives.

- Allow managing tenant IDs to onboard through Azure Lighthouse

- Audit delegation of scopes to a managing tenant

You can use Azure Blueprints to automate deployment and configuration of services and application environments including Azure Resource Manager templates, Azure RBAC controls, and policies, in a single blueprint definition.

- [Azure Lighthouse Policies](samples/policy-reference.md)

- [Tutorial - Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md) 

- [Azure Blueprints](../governance/blueprints/overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-2: Sustain secure configurations for Azure services

**Guidance**: Azure Lighthouse supports below service-specific policies that are available in Azure Security Center to audit and enforce configurations of your Azure resources. This can be configured in Azure Security Center or Azure Policy initiatives.

- [Azure Lighthouse Policies](samples/policy-reference.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-3: Establish secure configurations for compute resources

**Guidance**: Use Azure Security Center and Azure Policy to establish secure configurations on all compute resources including VMs, containers, and others.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md) 

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

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

-	Use of Azure native and third-party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?bc=%2fsecurity%2fcompass%2fbreadcrumb%2ftoc.json&toc=%2fsecurity%2fcompass%2ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md?bc=%2fazure%2fcloud-adoption-framework%2f_bread%2ftoc.json&toc=%2fazure%2fcloud-adoption-framework%2ftoc.json)

- [Azure Security Benchmark - Asset management](../security/benchmarks/security-controls-v2-incident-response.md)

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
/azure/security/benchmarks/security-controls-v2-logging-threat-detection
-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](../security/benchmarks/security-controls-v2-logging-threat-detection.md)

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