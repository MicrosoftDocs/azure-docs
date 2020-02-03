---

title: Best practices for secure admin access - Azure AD | Microsoft Docs
description: Ensure that your organization’s administrative access and admin accounts are secure. For system architects and IT pros who configure Azure AD, Azure, and Microsoft Online Services. 
services: active-directory 
keywords: 
author: curtand
manager: daveba
ms.author: curtand
ms.date: 11/13/2019
ms.topic: article
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.custom: it-pro
ms.reviewer: "martincoetzer; MarkMorow"
ms.collection: M365-identity-device-management
---

# Securing privileged access for hybrid and cloud deployments in Azure AD

The security of most or all business assets in the modern organization depends on the integrity of the privileged accounts that administer and manage IT systems. Malicious actors including cyber-attackers often target admin accounts and other elements of privileged access to attempt to rapidly gain access to sensitive data and systems using credential theft attacks. For cloud services, prevention and response are the joint responsibilities of the cloud service provider and the customer. For more information about the latest threats to endpoints and the cloud, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/operations/security-intelligence-report). This article can help you develop a roadmap toward closing the gaps between your current plans and the guidance described here.

> [!NOTE]
> Microsoft is committed to the highest levels of trust, transparency, standards conformance, and regulatory compliance. Learn more about how the Microsoft global incident response team mitigates the effects of attacks against cloud services, and how security is built into Microsoft business products and cloud services at [Microsoft Trust Center - Security](https://www.microsoft.com/trustcenter/security) and Microsoft compliance targets at [Microsoft Trust Center - Compliance](https://www.microsoft.com/trustcenter/compliance).

<!--## Risk management, incident response, and recovery preparation

A cyber-attack, if successful, can shut down operations not just for a few hours, but in some cases for days or even weeks. The collateral damage, such as legal ramifications, information leaks, and media coverage, could potentially continue for years. To ensure effective company-wide risk containment, cybersecurity and IT pros must align their response and recovery processes. To reduce the risk of business disruption due to a cyber-attack, industry experts recommend you do the following:

* As part of your risk management operations, establish a crisis management team for your organization that is responsible for managing all types of business disruptions.

* Compare your current risk mitigations, incident response, and recovery plan with industry best practices for managing a business disruption before, during, and after a cyber-attack.

* Develop and implement a roadmap for closing the gaps between your current plans and the best practices described in this document.


## Securing privileged access for hybrid and cloud deployments

does the article really start here?-->
For most organizations, the security of business assets depends on the integrity of the privileged accounts that administer and manage IT systems. Cyber-attackers focus on privileged access to infrastructure systems (such as Active Directory and Azure Active Directory) to gain access to an organization’s sensitive data. 

Traditional approaches that focus on securing the entrance and exit points of a network as the primary security perimeter are less effective due to the rise in the use of SaaS apps and personal devices on the Internet. The natural replacement for the network security perimeter in a complex modern enterprise is the authentication and authorization controls in an organization's identity layer.

Privileged administrative accounts are effectively in control of this new "security perimeter." It's critical to protect privileged access, regardless of whether the environment is on-premises, cloud, or hybrid on-premises and cloud hosted services. Protecting administrative access against determined adversaries requires you to take a complete and thoughtful approach to isolating your organization’s systems from risks. 

Securing privileged access requires changes to

* Processes, administrative practices, and knowledge management
* Technical components such as host defenses, account protections, and identity management

This document focuses primarily on creating a roadmap to secure identities and access that are managed or reported in Azure AD, Microsoft Azure, Office 365, and other cloud services. For organizations that have on-premises administrative accounts, see the guidance for on-premises and hybrid privileged access managed from Active Directory at [Securing Privileged Access](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access). 

> [!NOTE] 
> The guidance in this article refers primarily to features of Azure Active Directory that are included in Azure Active Directory Premium plans P1 and P2. Azure Active Directory Premium P2 is included in the EMS E5 suite and Microsoft 365 E5 suite. This guidance assumes your organization already has Azure AD Premium P2 licenses purchased for your users. If you do not have these licenses, some of the guidance might not apply to your organization. Also, throughout this article, the term global administrator (or global admin) is synonymous with “company administrator” or “tenant administrator.”

## Develop a roadmap 

Microsoft recommends that you develop and follow a roadmap to secure privileged access against cyber attackers. You can always adjust your roadmap to accommodate your existing capabilities and specific requirements within your organization. Each stage of the roadmap should raise the cost and difficulty for adversaries to attack privileged access for your on-premises, cloud, and hybrid assets. Microsoft recommends the following four roadmap stages: This recommended roadmap schedules the most effective and the quickest implementations first, based on Microsoft's experiences with cyber-attack incident and response implementation. The timelines for this roadmap are approximate.

![Stages of the roadmap with time lines](./media/directory-admin-roles-secure/roadmap-timeline.png)

* Stage 1 (24-48 hours): Critical items that we recommend you do right away

* Stage 2 (2-4 weeks): Mitigate the most frequently used attack techniques

* Stage 3 (1-3 months): Build visibility and build full control of admin activity

* Stage 4 (six months and beyond): Continue building defenses to further harden your security platform

This roadmap framework is designed to maximize the use of Microsoft technologies that you may have already deployed. You can also take advantage of key current and upcoming security technologies and integrate security tools from other vendors that you have already deployed or are considering deploying. 

## Stage 1: Critical items that we recommend you do right away

![Stage 1 Critical items to do first](./media/directory-admin-roles-secure/stage-one.png)

Stage 1 of the roadmap is focused on critical tasks that are fast and easy to implement. We recommend that you do these few items right away within the first 24-48 hours to ensure a basic level of secure privileged access. This stage of the Secured Privileged Access roadmap includes the following actions:

### General preparation

#### Turn on Azure AD Privileged Identity Management

If you have not already turned on Azure AD Privileged Identity Management (PIM), do so in your production tenant. After you turn on Privileged Identity Management, you’ll receive notification email messages for privileged access role changes. These notifications provide early warning when additional users are added to highly privileged roles in your directory.

Azure AD Privileged Identity Management is included in Azure AD Premium P2 or EMS E5. These solutions help you protect access to applications and resources across the on-premises environment and into the cloud. If you don't already have Azure AD Premium P2 or EMS E5 and wish to evaluate more of the features referenced in this roadmap, sign up for the [Enterprise Mobility + Security free 90-day trial](https://www.microsoft.com/cloud-platform/enterprise-mobility-security-trial). Use these license trials to try Azure AD Privileged Identity Management and Azure AD Identity Protection, to monitor activity using Azure AD advanced security reporting, auditing, and alerts.

After you have turned on Azure AD Privileged Identity Management:

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that is a global admin of your production tenant.

2. To select the tenant where you want to use Privileged Identity Management, select your user name in the upper right-hand corner of the Azure portal.

3. On the Azure portal menu, select **All services** and filter the list for **Azure AD Privileged Identity Management**.

4. Open Privileged Identity Management from the **All services** list and pin it to your dashboard.

The first person to use Azure AD Privileged Identity Management in your tenant is automatically assigned the **Security administrator** and **Privileged role administrator** roles in the tenant. Only privileged role administrators can manage the Azure AD directory role assignments of users. Also, after adding Azure AD Privileged Identity Management, you are shown the security wizard that walks you through the initial discovery and assignment experience. You can exit the wizard without making any additional changes at this time. 

#### Identify and categorize accounts that are in highly privileged roles 

After turning on Azure AD Privileged Identity Management, view the users who are in the directory roles Global administrator, Privileged role administrator, Exchange Online administrator, and SharePoint Online administrator. If you do not have Azure AD PIM in your tenant, you can use the [PowerShell API](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0). Start with the global admin role as this role is generic: a user who is assigned this admin role has the same permissions across all cloud services for which your organization has subscribed, regardless of whether they’ve been assigned this role in the Microsoft 365 admin center, the Azure portal, or by using the Azure AD module for Microsoft PowerShell. 

Remove any accounts that are no longer needed in those roles. Then, categorize the remaining accounts that are assigned to admin roles:

* Individually assigned to administrative users, and can also be used for non-administrative purposes (for example, personal email)
* Individually assigned to administrative users and designated for administrative purposes only
* Shared across multiple users
* For break-glass emergency access scenarios
* For automated scripts
* For external users

#### Define at least two emergency access accounts 

Make sure that you don't get into a situation where they could be inadvertently locked out of the administration of your Azure AD tenant due to an inability to sign in or activate an existing individual user's account as an administrator. For example, if the organization is federated to an on-premises identity provider, that identity provider may be unavailable so users cannot sign in on-premises. You can mitigate the impact of accidental lack of administrative access by storing two or more emergency access accounts in your tenant.

Emergency access accounts help organizations restrict privileged access within an existing Azure Active Directory environment. These accounts are highly privileged and are not assigned to specific individuals. Emergency access accounts are limited to emergency for 'break glass' scenarios where normal administrative accounts cannot be used. Organizations must ensure the aim of controlling and reducing the emergency account's usage to only that time for which it is necessary.

Evaluate the accounts that are assigned or eligible for the global admin role. If you did not see any cloud-only accounts using the *.onmicrosoft.com domain (intended for "break glass" emergency access), create them. For more information, see [Managing emergency access administrative accounts in Azure AD](directory-emergency-access.md).

#### Turn on multi-factor authentication and register all other highly-privileged single-user non-federated admin accounts

Require Azure Multi-Factor Authentication (MFA) at sign-in for all individual users who are permanently assigned to one or more of the Azure AD admin roles: Global administrator, Privileged Role administrator, Exchange Online administrator, and SharePoint Online administrator. Use the guide to enable [Multi-factor Authentication (MFA) for your admin accounts](../authentication/howto-mfa-userstates.md) and ensure that all those users have registered at [https://aka.ms/mfasetup](https://aka.ms/mfasetup). More information can be found under step 2 and step 3 of the guide [Protect access to data and services in Office 365](https://support.office.com/article/Protect-access-to-data-and-services-in-Office-365-a6ef28a4-2447-4b43-aae2-f5af6d53c68e). 

## Stage 2: Mitigate the most frequently used attack techniques

![Stage 2 Mitigate frequently used attacks](./media/directory-admin-roles-secure/stage-two.png)

Stage 2 of the roadmap focuses on mitigating the most frequently used attack techniques of credential theft and abuse and can be implemented in approximately 2-4 weeks. This stage of the Secured Privileged Access roadmap includes the following actions.

### General preparation

#### Conduct an inventory of services, owners, and admins

With the increase in bring-your-own-device (BYOD) and work-from-home policies and the growth of wireless connectivity in businesses, it is critical that you monitor who is connecting to your network. An effective security audit often reveals devices, applications, and programs running on your network that are not supported by IT, and therefore potentially not secure. For more information, see [Azure security management and monitoring overview](../../security/fundamentals/management-monitoring-overview.md). Ensure that you include all of the following tasks in your inventory process. 

* Identify the users who have administrative roles and the services where they can manage.
* Use Azure AD PIM to find out which users in your organization have admin access to Azure AD, including additional roles beyond those listed in Stage 1.
* Beyond the roles defined in Azure AD, Office 365 comes with a set of admin roles that you can assign to users in your organization. Each admin role maps to common business functions, and gives people in your organization permissions to do specific tasks in the [Microsoft 365 admin center](https://admin.microsoft.com). Use the Microsoft 365 admin center to find out which users in your organization have admin access to Office 365, including via roles not managed in Azure AD. For more information, see [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) and [Security best practices for Office 365](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-securitycompliance-center).
* Perform the inventory in other services your organization relies on, such as Azure, Intune, or Dynamics 365.
* Ensure that your admin accounts (accounts that are used for administration purposes, not just users’ day-to-day accounts) have working email addresses attached to them and have registered for Azure MFA or use MFA on-premises.
* Ask users for their business justification for administrative access.
* Remove admin access for those individuals and services that don’t need it.

#### Identify Microsoft accounts in administrative roles that need to be switched to work or school accounts

Sometimes, the initial global administrators for an organization reuse their existing Microsoft account credentials when they began using Azure AD. Those Microsoft accounts should be replaced by individual cloud-based or synchronized accounts. 

#### Ensure separate user accounts and mail forwarding for global administrator accounts 

Global administrator accounts should not have personal email addresses, as personal email accounts are regularly phished by cyber attackers. To help separate internet risks (phishing attacks, unintentional web browsing) from administrative privileges, create dedicated accounts for each user with administrative privileges. 

If you have not already done so, create separate accounts for users to perform global admin tasks, to make sure they do not inadvertently open emails or run programs associated with their admin accounts. Be sure those accounts have their email forwarded to a working mailbox.  

#### Ensure the passwords of administrative accounts have recently changed

Ensure that all users have signed into their administrative accounts and changed their passwords at least once in the last 90 days. Also, ensure that any shared accounts in which multiple users know the password have had their passwords changed recently.

#### Turn on password hash synchronization

Password hash synchronization is a feature used to synchronize hashes of user password hashes from an on-premises Active Directory instance to a cloud-based Azure AD instance. Even if you decide to use federation with Active Directory Federation Services (AD FS) or other identity providers, you can optionally set up password hash synchronization as a backup in case your on-premises infrastructure such as AD or ADFS servers fail or becomes temporarily unavailable. This enables users to sign in to the service by using the same password that they use to sign in to their on-premises AD instance. Also, it allows Identity Protection to detect compromised credentials by comparing those password hashes with passwords known to be compromised, if a user has leveraged their same email address and password on other services not connected to Azure AD.  For more information, see [Implement password hash synchronization with Azure AD Connect sync](../hybrid/how-to-connect-password-hash-synchronization.md).

#### Require multi-factor authentication (MFA) for users in all privileged roles as well as exposed users

Azure AD recommends that you require multi-factor authentication (MFA) for all your users, including administrators and all other users who would have a significant impact if their account was compromised (for example, financial officers). This reduces the risk of an attack due to a compromised password.

Turn on:

* [MFA using Conditional Access policies](../authentication/howto-mfa-getstarted.md) for all users in your organization.

If you use Windows Hello for Business, the MFA requirement can be met using the Windows Hello sign in experience. For more information, see [Windows Hello](https://docs.microsoft.com/windows/uwp/security/microsoft-passport). 

#### Configure Identity Protection 

Azure AD Identity Protection is an algorithm-based monitoring and reporting tool that you can use to detect potential vulnerabilities affecting your organization’s identities. You can configure automated responses to those detected suspicious activities, and take appropriate action to resolve them. For more information, see [Azure Active Directory Identity Protection](../active-directory-identityprotection.md).

#### Obtain your Office 365 Secure Score (if using Office 365)

Secure Score figures out what Office 365 services you’re using (like OneDrive, SharePoint, and Exchange) then looks at your settings and activities and compares them to a baseline established by Microsoft. You’ll get a score based on how aligned you are with best security practices. Anyone who has admin permissions (global admin or a custom administrator role) for an Office 365 Business Premium or Enterprise subscription can access the Secure Score at [https://securescore.office.com](https://securescore.office.com/).

#### Review the Office 365 security and compliance guidance (if using Office 365)

The [plan for security and compliance](https://support.office.com/article/Plan-for-security-and-compliance-in-Office-365-dc4f704c-6fcc-4cab-9a02-95a824e4fb57) outlines the approach for how an Office 365 customer should configure Office 365 and leverage other EMS capabilities. Then, review steps 3-6 of how to [Protect access to data and services in Office 365](https://support.office.com/article/Protect-access-to-data-and-services-in-Office-365-a6ef28a4-2447-4b43-aae2-f5af6d53c68e) and the guide for how to [monitor security and compliance in Office 365](https://support.office.com/article/Monitor-security-and-compliance-in-Office-365-b62f1722-fd39-44eb-8361-da61d21509b6).

#### Configure Office 365 Activity Monitoring (if using Office 365)

You can monitor how people in your organization are using Office 365 services, enabling you to identify users who have an administrative account and who may not need Office 365 access due to not signing into those portals. For more information, see [Activity reports in the Microsoft 365 admin center](https://support.office.com/article/Activity-Reports-in-the-Office-365-admin-center-0d6dfb17-8582-4172-a9a9-aed798150263).

#### Establish incident/emergency response plan owners

Performing incident response effectively is a complex undertaking. Therefore, establishing a successful incident response capability requires substantial planning and resources. It is essential that you continually monitor for cyber-attacks and establish procedures for prioritizing the handling of incidents. Effective methods of collecting, analyzing, and reporting data are vital to build relationships and to establish communication with other internal groups and plan owners. For more information, see [Microsoft Security Response Center](https://technet.microsoft.com/security/dn440717). 

#### Secure on-premises privileged administrative accounts, if not already done

If your Azure Active Directory tenant is synchronized with on-premises Active Directory, then follow the guidance in [Security Privileged Access Roadmap](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access): Stage 1. This includes creating separate admin accounts for users who need to conduct on-premises administrative tasks, deploying Privileged Access Workstations for Active Directory administrators, and creating unique local admin passwords for workstations and servers.

### Additional steps for organizations managing access to Azure

#### Complete an inventory of subscriptions

Use the Enterprise portal and the Azure portal to identify the subscriptions in your organization that host production applications.

#### Remove Microsoft accounts from admin roles

Microsoft accounts from other programs, such as Xbox, Live, and Outlook should not be used as administrator accounts for organizational subscriptions. Remove admin status from all Microsoft accounts, and replace with Azure Active Directory (for example, chris@contoso.com) work or school accounts.

#### Monitor Azure activity

The Azure Activity Log provides a history of subscription-level events in Azure. It offers information about who created, updated, and deleted what resources, and when these events occurred. For more information, see [Audit and receive notifications about important actions in your Azure subscription](../../azure-monitor/platform/quick-audit-notify-action-subscription.md).

### Additional steps for organizations managing access to other cloud apps via Azure AD

#### Configure Conditional Access policies

Prepare Conditional Access policies for on-premises and cloud-hosted applications. If you have users workplace joined devices, get more information from [Setting up on-premises Conditional Access by using Azure Active Directory device registration](../active-directory-device-registration-on-premises-setup.md).


## Stage 3: Build visibility and take full control of admin activity

![Stage 3 take control of admin activity](./media/directory-admin-roles-secure/stage-three.png)

Stage 3 builds on the mitigations from Stage 2 and is designed to be implemented in approximately 1-3 months. This stage of the Secured Privileged Access roadmap includes the following components.

### General preparation

#### Complete an access review of users in administrator roles

More corporate users are gaining privileged access through cloud services, which can lead to an increasing unmanaged platform. This includes users becoming global admins for Office 365, Azure subscription administrators, and users who have admin access to VMs or via SaaS apps. Instead, organizations should have all employees, especially admins, handle day-to-day business transactions as unprivileged users, and only take on admin rights as needed. Since the number of users in admin roles may have grown since initial adoption, complete access reviews to identify and confirm every user who is eligible to activate admin privileges. 

Do the following:

* Determine which users are Azure AD admins, enable on-demand, just-in-time admin access, and role-based security controls.
* Convert users who have no clear justification for admin privileged access to a different role (if no eligible role, remove them).

#### Continue rollout of stronger authentication for all users 

Require C-suite executives, high-level managers, critical IT and security personnel, and other highly-exposed users to have modern, strong authentication, such as Azure MFA or Windows Hello. 

#### Use dedicated workstations for administration for Azure AD

Attackers may attempt to target privileged accounts to gain access to an organization’s data and systems so they can disrupt the integrity and authenticity of data, through malicious code that alters the program logic or snoops the admin entering a credential. Privileged Access Workstations (PAWs) provide a dedicated operating system for sensitive tasks that is protected from Internet attacks and threat vectors. Separating these sensitive tasks and accounts from the daily use workstations and devices provides very strong protection from phishing attacks, application and OS vulnerabilities, various impersonation attacks, and credential theft attacks such as keystroke logging, Pass-the-Hash, and Pass-The-Ticket. By deploying privileged access workstations, you can reduce the risk that admins enter admin credentials except on a desktop environment that has been hardened. For more information, see [Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations).

#### Review National Institute of Standards and Technology recommendations for handling incidents 

The National Institute of Standards and Technology’s (NIST) provides guidelines for incident handling, particularly for analyzing incident-related data and determining the appropriate response to each incident. For more information, see [The (NIST) Computer Security Incident Handling Guide (SP 800-61, Revision 2)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf).

#### Implement Privileged Identity Management (PIM) for JIT to additional administrative roles

For Azure Active Directory, use [Azure AD Privileged Identity Management](../privileged-identity-management/pim-configure.md) capability. Time-limited activation of privileged roles works by enabling you to:

* Activate admin privileges to perform a specific task
* Enforce MFA during the activation process
* Use alerts to inform admins about out-of-band changes
* Enable users to retain certain privileges for a pre-configured amount of time
* Allow security admins to discover all privileged identities, view audit reports, and create access reviews to identify every user who is eligible to activate admin privileges

If you’re already using Azure AD Privileged Identity Management, adjust timeframes for time-bound privileges as necessary (for example, maintenance windows).

#### Determine exposure to password-based sign-in protocols (if using Exchange Online)

In the past, protocols assumed that username/password combinations were embedded in devices, email accounts, phones, and so on. But now with the risk for cyber-attacks in the cloud, we recommend you identify every potential user who, if their credentials were compromised, could be catastrophic to the organization, and exclude them from being able to sign in to their email via username/password by implementing strong authentication requirements and Conditional Access. You can block [legacy authentication using Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/block-legacy-authentication). Please check the details on [how to block basic authentication](https://docs.microsoft.com/exchange/clients-and-mobile-in-exchange-online/disable-basic-authentication-in-exchange-online) through Exchange online. 

#### Complete a roles review assessment for Office 365 roles (if using Office 365)

Assess whether all admins users are in the correct roles (delete and reassign according to this assessment).

#### Review the security incident management approach used in Office 365 and compare with your own organization

You can download this report from [Security Incident Management in Microsoft Office 365](https://www.microsoft.com/download/details.aspx?id=54302).

#### Continue to secure on-premises privileged administrative accounts

If your Azure Active Directory is connected to on-premises Active Directory, then follow the guidance in the [Security Privileged Access Roadmap](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access): Stage 2. This includes deploying Privileged Access Workstations for all administrators, requiring MFA, using Just Enough Admin for DC maintenance, lowering the attack surface of domains, deploying ATA for attack detection.

### Additional steps for organizations managing access to Azure

#### Establish integrated monitoring

The [Azure Security Center](../../security-center/security-center-intro.md) provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that may otherwise go unnoticed, and works with a broad ecosystem of security solutions.

#### Inventory your privileged accounts within hosted Virtual Machines

In most cases, you don’t need to give users unrestricted permissions to all your Azure subscriptions or resources. You can use Azure AD admin roles to segregate duties within your organization and grant only the amount of access to users who need to perform specific jobs. For example, use Azure AD administrator roles to let one admin manage only VMs in a subscription, while another can manage SQL databases within the same subscription. For more information, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).

#### Implement PIM for Azure AD administrator roles

Use Privileged identity Management with Azure AD administrator roles to manage, control, and monitor access to Azure resources. Using PIM protects privileged accounts from cyber-attacks by lowering the exposure time of privileges and increasing your visibility into their use through reports and alerts. For more information, see [Manage RBAC access to Azure resources with Privileged Identity Management](../../role-based-access-control/pim-azure-resource.md).

#### Use Azure log integrations to send relevant Azure logs to your SIEM systems 

Azure log integration enables you to integrate raw logs from your Azure resources to your organization’s existing Security Information and Event Management (SIEM) systems. [Azure log integration](../../security/fundamentals/azure-log-integration-overview.md) collects Windows events from Windows Event Viewer logs, and Azure resources from Azure Activity Logs, Azure Security Center alerts, and Azure Diagnostic logs. 


### Additional steps for organizations managing access to other cloud apps via Azure AD

#### Implement user provisioning for connected apps

Azure AD allows you to automate the creation, maintenance, and removal of user identities in cloud (SaaS) applications such as Dropbox, Salesforce, ServiceNow, and so on. For more information, see [Automate user provisioning and deprovisioning to SaaS applications with Azure AD](../manage-apps/user-provisioning.md).

#### Integrate information protection

MCAS allows you to investigate files and set policies based on Azure Information Protection classification labels, enabling greater visibility and control of your data in the cloud. Scan and classify files in the cloud and apply Azure information protection labels. For more information, see [Azure Information Protection integration](https://docs.microsoft.com/cloud-app-security/azip-integration).

#### Configure Conditional Access

Configure Conditional Access based on a group, location, and application sensitivity for [SaaS apps](https://azure.microsoft.com/overview/what-is-saas/) and Azure AD connected apps. 

#### Monitor activity in connected cloud apps

To ensure users’ access is protected in connected applications as well, we recommend that you leverage [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security). This secures the enterprise access to cloud apps, in addition to securing your admin accounts, by enabling you to:

* Extend visibility and control to cloud apps
* Create policies for access, activities, and data sharing
* Automatically identify risky activities, abnormal behaviors, and threats
* Prevent data leakage
* Minimize risk and automated threat prevention and policy enforcement

The Cloud App Security SIEM agent integrates Cloud App Security with your SIEM server to enable centralized monitoring of Office 365 alerts and activities. It runs on your server and pulls alerts and activities from Cloud App Security and streams them into the SIEM server. For more information, see [SIEM integration](https://docs.microsoft.com/cloud-app-security/siem).

## Stage 4: Continue building defenses to a more proactive security posture

![Stage 4 adopt a proactive security posture](./media/directory-admin-roles-secure/stage-four.png)

Stage 4 of the roadmap builds on the visibility from Stage 3 and is designed to be implemented in six months and beyond. Completing a roadmap helps you develop strong privileged access protections from potential attacks that are currently known and available today. Unfortunately, security threats constantly evolve and shift, so we recommend that you view security as an ongoing process focused on raising the cost and reducing the success rate of adversaries targeting your environment.

Securing privileged access is a critical first step to establishing security assurances for business assets in a modern organization, but it is not the only part of a complete security program that would include elements, such as policy, operations, information security, servers, applications, PCs, devices, cloud fabric, and other components provide ongoing security assurances. 

In addition to managing your privileged access accounts, we recommend you review the following on an ongoing basis:

* Ensure that admins are doing their day-to-day business as unprivileged users.
* Only grant privileged access when needed, and remove it afterward (just-in-time).
* Retain and review audit activity relating to privileged accounts.

For more information on building a complete security roadmap, see [Microsoft cloud IT architecture resources](https://docs.microsoft.com/office365/enterprise/microsoft-cloud-it-architecture-resources). For more information on engaging Microsoft services to assist with any of these topics, contact your Microsoft representative or see [Build critical cyber defenses to protect your enterprise](https://www.microsoft.com/en-us/microsoftservices/campaigns/cybersecurity-protection.aspx).

This final ongoing stage of the Secured Privileged Access roadmap includes the following components.

### General preparation

#### Review admin roles in Azure Active Directory 

Determine if current built-in Azure AD admin roles are still up-to-date and ensure users are only in the roles and delegations that they need for corresponding permissions. With Azure AD, you can designate separate administrators to serve different functions. For more information, see [Assigning administrator roles in Azure Active Directory](directory-assign-admin-roles.md).

#### Review users who have administration of Azure AD joined devices

For more information, see [How to configure hybrid Azure Active Directory joined devices](../device-management-hybrid-azuread-joined-devices-setup.md).

#### Review members of [built-in Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d)
If you are using Office 365.
‎
#### Validate incident response plan

To improve upon your plan, Microsoft recommends you regularly validate that your plan operates as expected:

* Go through your existing road map to see what was missed
* Based on the postmortem analysis, revise existing or define new best practices
* Ensure that your updated incident response plan and best practices are distributed throughout your organization


### Additional steps for organizations managing access to Azure 

Determine if you need to [transfer ownership of an Azure subscription to another account](../../cost-management-billing/manage/billing-subscription-transfer.md).
‎

## "Break glass": what to do in an emergency

![Accounts for emergency break glass access](./media/directory-admin-roles-secure/emergency.jpeg)

1. Notify key managers and security officers with pertinent information regarding the incident.

2. Review your attack playbook. 

3. Access your "break glass" account username/password combination to sign in to Azure AD. 

4. Get help from Microsoft by [opening an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

5. Look at the [Azure AD sign-in reports](../reports-monitoring/overview-reports.md). There may be a lag between an event occurring and when it is included in the report.

6. For hybrid environments, if federated and your AD FS server isn’t available, you may need to temporarily switch from federated authentication to use password hash sync. This reverts the domain federation back to managed authentication until the AD FS server becomes available.

7. Monitor email for privileged accounts.

8. Make sure you save backups of relevant logs for potential forensic and legal investigation.

For more information about how Microsoft Office 365 handles security incidents, see [Security Incident Management in Microsoft Office 365](https://aka.ms/Office365SIM).

## FAQ: Common questions we receive regarding securing privileged access  

**Q:** What do I do if I haven’t implemented any secure access components yet?

**Answer:** Define at least two break-glass account, assign MFA to your privileged admin accounts, and separate user accounts from Global admin accounts.

**Q:** After a breach, what is the top issue that needs to be addressed first?

**Answer:** Be sure you’re requiring the strongest authentication for highly-exposed individuals.

**Q:** What happens if our privileged admins have been deactivated?

**Answer:** Create a Global admin account that is always kept up-to-date.

**Q:** What happens if there is only one global admin left and they can’t be reached? 

**Answer:** Use one of your break-glass accounts to gain immediate privileged access.

**Q:** How can I protect admins within my organization?

**Answer:** Have admins always do their day-to-day business as standard “unprivileged” users.

**Q:** What are the best practices for creating admin accounts within Azure AD?

**Answer:** Reserve privileged access for specific admin tasks.

**Q:** What tools exist for reducing persistent admin access?

**Answer:** Privileged Identity Management (PIM) and Azure AD admin roles.

**Q:** What is the Microsoft position on synchronizing admin accounts to Azure AD?

**Answer:** Tier 0 admin accounts (including accounts, groups, and other assets that have direct or indirect administrative control of the AD forest, domains, or domain controllers, and all assets) are utilized only for on-premises AD accounts and are not typically synchronized for Azure AD for the cloud.

**Q:** How do we keep admins from assigning random admin access in the portal?

**Answer:** Use non-privileged accounts for all users and most admins. Start by developing a footprint of the organization to determine which few admin accounts should be privileged. And monitor for newly-created administrative users.

## Next steps

* [Microsoft Trust Center for Product Security](https://www.microsoft.com/trustcenter/security) – Security features of Microsoft cloud products and services

* [Microsoft Trust Center - Compliance](https://www.microsoft.com/trustcenter/compliance/complianceofferings) – Microsoft’s comprehensive set of compliance offerings for cloud services

* [Guidance on how to perform a risk assessment](https://www.microsoft.com/trustcenter/guidance/risk-assessment) - Manage security and compliance requirements for Microsoft cloud services

### Other Microsoft Online Services

* [Microsoft Intune Security](https://www.microsoft.com/trustcenter/security/intune-security) – Intune provides mobile device management, mobile application management, and PC management capabilities from the cloud.

* [Microsoft Dynamics 365 security](https://www.microsoft.com/trustcenter/security/dynamics365-security) – Dynamics 365 is the Microsoft cloud-based solution that unifies customer relationship management (CRM) and enterprise resource planning (ERP) capabilities.
