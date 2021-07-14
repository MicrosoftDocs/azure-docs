---
title: Azure Active Directory security operations for Privileged Identity Management
description: Guidance to establish baselines and use Azure Active Directory Privileged Identity Management (PIM) to monitor and alert on potential issues with accounts that are governed by PIM.
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory security operations for Privileged Identity Management (PIM)

The security of business assets depends on the integrity of the privileged accounts that administer your IT systems. Cyber-attackers use credential theft attacks to target admin accounts and other privileged access accounts to try gaining access to sensitive data.

For cloud services, prevention and response are the joint responsibilities of the cloud service provider and the customer. 

Traditionally, organizational security has focused on the entry and exit points of a network as the security perimeter. However, SaaS apps and personal devices have made this approach less effective. In Azure 
Active Directory (Azure AD), we replace the network security perimeter with authentication in your organization's identity layer. As users are assigned to privileged administrative roles, their access must be protected in on-premises, cloud, and hybrid environments 

You're entirely responsible for all layers of security for your on-premises IT environment. When you use Azure cloud services, prevention and response are joint responsibilities of Microsoft as the cloud service provider and you as the customer. 

* For more information on the shared responsibility model, see [Shared responsibility in the cloud](../../security/fundamentals/shared-responsibility.md).

* For more information on securing access for privileged users, see [Securing Privileged access for hybrid and cloud deployments in Azure AD](../roles/security-planning.md).

* For a wide range of videos, how-to guides, and content of key concepts for privileged identity, visit [Privileged Identity Management documentation](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/). 

Privileged Identity Management (PIM) is an Azure AD service that enables you to manage, control, and monitor access to important resources in your organization. These resources include resources in Azure AD, Azure, and other Microsoft Online Services such as Microsoft 365 or Microsoft Intune. You can use PIM to help mitigate the following risks:

* Identify and minimize the number of people who have access to secure information and resources.

* Detect excessive, unnecessary, or misused access permissions on sensitive resources.

* Reduce the chances of a malicious actor getting access to secured information or resources.

* Reduce the possibility of an unauthorized user inadvertently impacting sensitive resources.

This article provides guidance on setting baselines, auditing sign-ins and usage of privileged accounts, and the source of audit logs you can use to help maintain the integrity of your privilege accounts. 

## Where to look

The log files you use for investigation and monitoring are: 

* [Azure AD Audit logs](../reports-monitoring/concept-audit-logs.md)

* [Sign-in logs](../reports-monitoring/concept-all-sign-ins.md)

* [Microsoft 365 Audit logs](/microsoft-365/compliance/auditing-solutions-overview?view=o365-worldwide) 

* [Azure Key Vault logs](../../key-vault/general/logging.md?tabs=Vault)

In the Azure portal you can view the Azure AD Audit logs and download them as comma-separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Azure AD logs with other tools that allow for greater automation of monitoring and alerting:

* [**Azure Sentinel**](../../sentinel/overview.md) – enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities. 

* [**Azure Monitor**](../../azure-monitor/overview.md) – enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* [**Azure Event Hubs**](../../event-hubs/event-hubs-about.md) **integrated with a SIEM**- [Azure AD logs can be integrated to other SIEMs](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) such as Splunk, ArcSight, QRadar, and Sumo Logic via the Azure Event Hub integration.

* [**Microsoft Cloud App Security**](/cloud-app-security/what-is-cloud-app-security) (MCAS) – enables you to discover and manage apps, govern across apps and resources, and check your cloud apps’ compliance. 

The rest of this article provides recommendations for setting a baseline to monitor and alert on, organized using a tier model. Links to pre-built solutions are listed following the table. You can also build alerts using the preceding tools. The content is organized into the following topic areas of PIM:

* Baselines

* Azure AD role assignment 

* Azure AD role alert settings

* Azure resource role assignment

* Access management for Azure resources

* Elevated access to manage Azure subscriptions

## Baselines

The following are recommended baseline settings:

| What to monitor| Risk level| Recommendation| Roles| Notes |
| - |- |- |- |- |
| Azure AD roles assignment| High| <li>Require justification for activation.<li>Require approval to activate.<li>Set two-level approver process.<li>On activation, require Azure Active Directory Multi-Factor Authentication (MFA).<li>Set maximum elevation duration to 8 hrs.| <li>Privileged Role Administration<li>Global Administrator| A privileged role administrator can customize PIM in their Azure AD organization, including changing the experience for users activating an eligible role assignment. |
| Azure Resource Role Configuration| High| <li>Require justification for activation.<li>Require approval to activate.<li>Set two-level approver process.<li>On activation, require Azure MFA.<li>Set maximum elevation duration to 8 hrs.| <li>Owner<li>Resource Administrator<li>User Access <li>Administrator<li>Global Administrator<li>Security Administrator| Investigate immediately if not a planned change. This setting could enable an attacker access to Azure subscriptions in your environment. |


## Azure AD roles assignment

A privileged role administrator can customize PIM in their Azure AD organization. This includes changing the experience for a user who is activating an eligible role assignment as follows:

* Prevent bad actor to remove Azure MFA requirements to activate privileged access.

* Prevent malicious users bypass justification and approval of activating privileged access.

| What to monitor| Risk level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Alert on Add changes to privileged account permissions| High| Azure AD Audit logs| Category = Role Management<br>-and-<br>Activity Type – Add eligible member (permanent) <br>-and-<br>Activity Type – Add eligible member (eligible) <br>-and-<br>Status = Success/failure<br>-and-<br>Modified properties = Role.DisplayName| Monitor and always alert for any changes to privileged role administrator and global administrator. <li>This can be an indication an attacker is trying to gain privilege to modify role assignment settings<li> If you don’t have a defined threshold, alert on 4 in 60 minutes for users and 2 in 60 minutes for privileged accounts. |
| Alert on bulk deletion changes to privileged account permissions| High| Azure AD Audit logs| Category = Role Management<br>-and-<br>Activity Type – Remove eligible member (permanent) <br>-and-<br>Activity Type – Remove eligible member (eligible) <br>-and-<br>Status = Success/failure<br>-and-<br>Modified properties = Role.DisplayName| Investigate immediately if not a planned change. This setting could enable an attacker access to Azure subscriptions in your environment. |
| Changes to PIM settings| High| Azure AD Audit Log| Service = PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity Type = Update role setting in PIM<br>-and-<br>Status Reason = MFA on activation disabled (example)| Monitor and always alert for any changes to Privileged Role Administrator and Global Administrator. <li>This can be an indication an attacker already gained access able to modify to modify role assignment settings<li>One of these actions could reduce the security of the PIM elevation and make it easier for attackers to acquire a privileged account. |
| Approvals and deny elevation| High| Azure AD Audit Log| Service = Access Review<br>-and-<br>Category = UserManagement<br>-and-<br>Activity Type = Request Approved/Denied<br>-and-<br>Initiated actor = UPN| All elevations should be monitored. Log all elevations as this could give a clear indication of timeline for an attack. |
| Alert setting changes to disabled.| High| Azure AD Audit logs| Service =PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity Type = Disable PIM Alert<br>-and-<br>Status = Success /Failure| Always alert. <li>Helps detect bad actor removing alerts associated with Azure MFA requirements to activate privileged access.<li>Helps detect suspicious or unsafe activity. |


For more information on identifying role setting changes in the Azure AD Audit log, see [View audit history for Azure AD roles in Privileged Identity Management](../privileged-identity-management/pim-how-to-use-audit-log.md). 

## Azure resource role assignment

Monitoring Azure resource role assignments provides visibility into activity and activations for resources roles. These might be misused to create an attack surface to a resource. As you monitor for this type of activity, you are trying to detect:

* Query role assignments at specific resources

* Role assignments for all child resources

* All active and eligible role assignment changes

| What to monitor| Risk level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Audit Alert Resource Audit log for Privileged account activities| High| In PIM, under Azure Resources, Resource Audit| Action : Add eligible member to role in PIM completed (time bound) <br>-and-<br>Primary Target <br>-and-<br>Type User<br>-and-<br>Status = Succeeded<br>| Always alert. Helps detect bad actor adding eligible roles to manage all resources in Azure. |
| Audit Alert Resource Audit for Disable Alert| Medium| In PIM, under Azure Resources, Resource Audit| Action : Disable Alert<br>-and-<br>Primary Target : Too many owners assigned to a resource<br>-and-<br>Status = Succeeded| Helps detect bad actor disabling alerts from Alerts pane which can bypass malicious activity being investigated |
| Audit Alert Resource Audit for Disable Alert| Medium| In PIM, under Azure Resources, Resource Audit| Action : Disable Alert<br>-and-<br>Primary Target : Too many permanent owners assigned to a resource<br>-and-<br>Status = Succeeded| Prevent bad actor from disable alerts from Alerts pane which can bypass malicious activity being investigated |
| Audit Alert Resource Audit for Disable Alert| Medium| In PIM, under Azure Resources, Resource Audit| Action : Disable Alert<br>-and-<br>Primary Target Duplicate role created<br>-and-<br>Status = Succeeded| Prevent bad actor from disable alerts from Alerts pane which can bypass malicious activity being investigated |


For more information on configuring alerts and auditing Azure resource roles, see:

* [Configure security alerts for Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-configure-alerts.md)

* [View audit report for Azure resource roles in Privileged Identity Management (PIM)](../privileged-identity-management/azure-pim-resource-rbac.md)

## Access management for Azure resources and subscriptions

Users or members of a group assigned to the Owner or User Access Administrator subscriptions roles, and Azure AD Global administrators that enabled subscription management in Azure AD have Resource administrator permissions by default. These administrators can assign roles, configure role settings, and review access using Privileged Identity Management (PIM) for Azure resources. 

A user who has Resource administrator permissions can manage PIM for Resources. The risk this introduces that you must monitor for and mitigate, is that the capability can be used to allow bad actors to have privileged access to Azure subscription resources, such as virtual machines or storage accounts.

| What to monitor| Risk level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Elevations| High| Azure AD, under Manage, Properties| Periodically review setting.<br>Access management for Azure resources| Global administrators can elevate by enabling Access management for Azure resources.<br>Verify bad actors have not gained permissions to assign roles in all Azure subscriptions and management groups associated with Active Directory. |


For more information see [Assign Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-assign-roles.md)

## Next steps
See these security operations guide articles:

[Azure AD security operations overview](security-operations-introduction.md)

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)
 
[Security operations for infrastructure](security-operations-infrastructure.md)