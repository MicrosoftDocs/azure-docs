---

title: Secure access practices for administrators in Azure AD | Microsoft Docs
description: Ensure that your organization’s administrative access and admin accounts are secure. For system architects and IT pros who configure Azure AD, Azure, and Microsoft Online Services. 
services: active-directory 
keywords: 
author: curtand
manager: daveba
ms.author: curtand
ms.date: 04/30/2020
ms.topic: conceptual
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.custom: it-pro
ms.reviewer: "martincoetzer; MarkMorow"
ms.collection: M365-identity-device-management
---

# Securing privileged access for hybrid and cloud deployments in Azure AD

The security of business assets depends on the integrity of the privileged accounts that administer your IT systems. Cyber-attackers use credential theft attacks to target admin accounts and other privileged access to try to gain access to sensitive data.

For cloud services, prevention and response are the joint responsibilities of the cloud service provider and the customer. For more information about the latest threats to endpoints and the cloud, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/operations/security-intelligence-report). This article can help you develop a roadmap toward closing the gaps between your current plans and the guidance described here.

> [!NOTE]
> Microsoft is committed to the highest levels of trust, transparency, standards conformance, and regulatory compliance. Learn more about how the Microsoft global incident response team mitigates the effects of attacks against cloud services, and how security is built into Microsoft business products and cloud services at [Microsoft Trust Center - Security](https://www.microsoft.com/trustcenter/security) and Microsoft compliance targets at [Microsoft Trust Center - Compliance](https://www.microsoft.com/trustcenter/compliance).

Traditionally, organizational security was focused on the entry and exit points of a network as the security perimeter. However, SaaS apps and personal devices on the Internet have made this approach less effective. In Azure AD, we replace the network security perimeter with authentication in your organization's identity layer, with users assigned to privileged administrative roles in control. Their access must be protected, whether the environment is on-premises, cloud, or a hybrid.

Securing privileged access requires changes to:

* Processes, administrative practices, and knowledge management
* Technical components such as host defenses, account protections, and identity management

Secure your privileged access in a way that is managed and reported in the Microsoft services you care about. If you have on-premises admin accounts, see the guidance for on-premises and hybrid privileged access in Active Directory at [Securing Privileged Access](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access).

> [!NOTE]
> The guidance in this article refers primarily to features of Azure Active Directory that are included in Azure Active Directory Premium plans P1 and P2. Azure Active Directory Premium P2 is included in the EMS E5 suite and Microsoft 365 E5 suite. This guidance assumes your organization already has Azure AD Premium P2 licenses purchased for your users. If you do not have these licenses, some of the guidance might not apply to your organization. Also, throughout this article, the term global administrator (or global admin) means the same thing as “company administrator” or “tenant administrator.”

## Develop a roadmap

Microsoft recommends that you develop and follow a roadmap to secure privileged access against cyber attackers. You can always adjust your roadmap to accommodate your existing capabilities and specific requirements within your organization. Each stage of the roadmap should raise the cost and difficulty for adversaries to attack privileged access for your on-premises, cloud, and hybrid assets. Microsoft recommends the following four roadmap stages. Schedule the most effective and the quickest implementations first. This article can be your guide, based on Microsoft's experiences with cyber-attack incident and response implementation. The timelines for this roadmap are approximations.

![Stages of the roadmap with time lines](./media/directory-admin-roles-secure/roadmap-timeline.png)

* Stage 1 (24-48 hours): Critical items that we recommend you do right away

* Stage 2 (2-4 weeks): Mitigate the most frequently used attack techniques

* Stage 3 (1-3 months): Build visibility and build full control of admin activity

* Stage 4 (six months and beyond): Continue building defenses to further harden your security platform

This roadmap framework is designed to maximize the use of Microsoft technologies that you may have already deployed. Consider tying in to any security tools from other vendors that you have already deployed or are considering deploying.

## Stage 1: Critical items to do right now

![Stage 1 Critical items to do first](./media/directory-admin-roles-secure/stage-one.png)

Stage 1 of the roadmap is focused on critical tasks that are fast and easy to implement. We recommend that you do these few items right away within the first 24-48 hours to ensure a basic level of secure privileged access. This stage of the Secured Privileged Access roadmap includes the following actions:

### General preparation

#### Turn on Azure AD Privileged Identity Management

We recommend that you turn on Azure AD Privileged Identity Management (PIM) in your Azure AD production environment. After you turn on PIM, you’ll receive notification email messages for privileged access role changes. Notifications provide early warning when additional users are added to highly privileged roles.

Azure AD Privileged Identity Management is included in Azure AD Premium P2 or EMS E5. To help you protect access to applications and resources on-premises and in the cloud, sign up for the [Enterprise Mobility + Security free 90-day trial](https://www.microsoft.com/cloud-platform/enterprise-mobility-security-trial). Azure AD Privileged Identity Management and Azure AD Identity Protection monitor security activity using Azure AD reporting, auditing, and alerts.

After you turn on Azure AD Privileged Identity Management:

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that is a global admin of your Azure AD production organization.

2. To select the Azure AD organization where you want to use Privileged Identity Management, select your user name in the upper right-hand corner of the Azure portal.

3. On the Azure portal menu, select **All services** and filter the list for **Azure AD Privileged Identity Management**.

4. Open Privileged Identity Management from the **All services** list and pin it to your dashboard.

Make sure the first person to use PIM in your organization is assigned to the **Security administrator** and **Privileged role administrator** roles. Only privileged role administrators can manage the Azure AD directory role assignments of users. The PIM security wizard walks you through the initial discovery and assignment experience. You can exit the wizard without making any additional changes at this time.

#### Identify and categorize accounts that are in highly privileged roles

After turning on Azure AD Privileged Identity Management, view the users who are in the following Azure AD roles:

* Global administrator
* Privileged role administrator
* Exchange Online administrator
* SharePoint Online administrator

If you don't have Azure AD Privileged Identity Management in your organization, you can use the [PowerShell API](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0). Start with the global admin role because a global admin has the same permissions across all cloud services for which your organization has subscribed. These permissions are granted no matter where they were assigned: in the Microsoft 365 admin center, the Azure portal, or by the Azure AD module for Microsoft PowerShell.

Remove any accounts that are no longer needed in those roles. Then, categorize the remaining accounts that are assigned to admin roles:

* Assigned to administrative users, but also used for non-administrative purposes (for example, personal email)
* Assigned to administrative users and used for administrative purposes only
* Shared across multiple users
* For break-glass emergency access scenarios
* For automated scripts
* For external users

#### Define at least two emergency access accounts

It's possible for a user to be accidentally locked out of their role. For example, if a federated on-premises identity provider isn't available, users can't sign in or activate an existing administrator account. You can prepare for accidental lack of access by storing two or more emergency access accounts.

Emergency access accounts help restrict privileged access within an Azure AD organization. These accounts are highly privileged and aren't assigned to specific individuals. Emergency access accounts are limited to emergency for "break glass" scenarios where normal administrative accounts can't be used. Ensure that you control and reduce the emergency account's usage to only that time for which it's necessary.

Evaluate the accounts that are assigned or eligible for the global admin role. If you don't see any cloud-only accounts using the \*.onmicrosoft.com domain (for "break glass" emergency access), create them. For more information, see [Managing emergency access administrative accounts in Azure AD](directory-emergency-access.md).

#### Turn on multi-factor authentication and register all other highly privileged single-user non-federated admin accounts

Require Azure Multi-Factor Authentication (MFA) at sign-in for all individual users who are permanently assigned to one or more of the Azure AD admin roles: Global administrator, Privileged Role administrator, Exchange Online administrator, and SharePoint Online administrator. Use the guide to enable [Multi-factor Authentication (MFA) for your admin accounts](../authentication/howto-mfa-userstates.md) and ensure that all those users have registered at [https://aka.ms/mfasetup](https://aka.ms/mfasetup). More information can be found under step 2 and step 3 of the guide [Protect access to data and services in Office 365](https://support.office.com/article/Protect-access-to-data-and-services-in-Office-365-a6ef28a4-2447-4b43-aae2-f5af6d53c68e). 

## Stage 2: Mitigate frequently used attacks

![Stage 2 Mitigate frequently used attacks](./media/directory-admin-roles-secure/stage-two.png)

Stage 2 of the roadmap focuses on mitigating the most frequently used attack techniques of credential theft and abuse and can be implemented in approximately 2-4 weeks. This stage of the Secured Privileged Access roadmap includes the following actions.

### General preparation

#### Conduct an inventory of services, owners, and admins

The increase in "bring your own device" and work from home policies and the growth of wireless connectivity make it critical to monitor who is connecting to your network. A security audit can reveal devices, applications, and programs on your network that your organization doesn't support and that represent high risk. For more information, see [Azure security management and monitoring overview](../../security/fundamentals/management-monitoring-overview.md). Ensure that you include all of the following tasks in your inventory process.

* Identify the users who have administrative roles and the services where they can manage.
* Use Azure AD PIM to find out which users in your organization have admin access to Azure AD.
* Beyond the roles defined in Azure AD, Office 365 comes with a set of admin roles that you can assign to users in your organization. Each admin role maps to common business functions, and gives people in your organization permissions to do specific tasks in the [Microsoft 365 admin center](https://admin.microsoft.com). Use the Microsoft 365 admin center to find out which users in your organization have admin access to Office 365, including via roles not managed in Azure AD. For more information, see [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) and [Security practices for Office 365](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-securitycompliance-center).
* Do the inventory in services your organization relies on, such as Azure, Intune, or Dynamics 365.
* Ensure that your accounts that are used for administration purposes:

  * Have working email addresses attached to them
  * Have registered for Azure Multi-Factor Authentication or use MFA on-premises
* Ask users for their business justification for administrative access.
* Remove admin access for those individuals and services that don’t need it.

#### Identify Microsoft accounts in administrative roles that need to be switched to work or school accounts

If your initial global administrators reuse their existing Microsoft account credentials when they began using Azure AD, replace the Microsoft accounts with individual cloud-based or synchronized accounts.

#### Ensure separate user accounts and mail forwarding for global administrator accounts

Personal email accounts are regularly phished by cyber attackers, a risk that makes personal email addresses unacceptable for global administrator accounts. To help separate internet risks from administrative privileges, create dedicated accounts for each user with administrative privileges.

* Be sure to create separate accounts for users to do global admin tasks
* Make sure that your global admins don't accidentally open emails or run programs with their admin accounts
* Be sure those accounts have their email forwarded to a working mailbox

#### Ensure the passwords of administrative accounts have recently changed

Ensure all users have signed into their administrative accounts and changed their passwords at least once in the last 90 days. Also, verify that any shared accounts have had their passwords changed recently.

#### Turn on password hash synchronization

Azure AD Connect synchronizes a hash of the hash of a user's password from on-premises Active Directory to a cloud-based Azure AD organization. You can use password hash synchronization as a backup if you use federation with Active Directory Federation Services (AD FS). This backup can be useful if your on-premises Active Directory or AD FS servers are temporarily unavailable.

Password hash sync enables users to sign in to a service by using the same password they use to sign in to their on-premises Active Directory instance. Password hash sync allows Identity Protection to detect compromised credentials by comparing password hashes with passwords known to be compromised. For more information, see [Implement password hash synchronization with Azure AD Connect sync](../hybrid/how-to-connect-password-hash-synchronization.md).

#### Require multi-factor authentication for users in privileged roles and exposed users

Azure AD recommends that you require multi-factor authentication (MFA) for all of your users. Be sure to consider users who would have a significant impact if their account were compromised (for example, financial officers). MFA reduces the risk of an attack because of a compromised password.

Turn on:

* [MFA using Conditional Access policies](../authentication/howto-mfa-getstarted.md) for all users in your organization.

If you use Windows Hello for Business, the MFA requirement can be met using the Windows Hello sign-in experience. For more information, see [Windows Hello](https://docs.microsoft.com/windows/uwp/security/microsoft-passport).

#### Configure Identity Protection

Azure AD Identity Protection is an algorithm-based monitoring and reporting tool that detects potential vulnerabilities affecting your organization’s identities. You can configure automated responses to those detected suspicious activities, and take appropriate action to resolve them. For more information, see [Azure Active Directory Identity Protection](../active-directory-identityprotection.md).

#### Obtain your Office 365 Secure Score (if using Office 365)

Secure Score looks at your settings and activities for the Office 365 services you’re using and compares them to a baseline established by Microsoft. You’ll get a score based on how aligned you are with security practices. Anyone who has the admin permissions for an Office 365 Business Premium or Enterprise subscription can access the Secure Score at [https://securescore.office.com](https://securescore.office.com/).

#### Review the Office 365 security and compliance guidance (if using Office 365)

The [plan for security and compliance](https://support.office.com/article/Plan-for-security-and-compliance-in-Office-365-dc4f704c-6fcc-4cab-9a02-95a824e4fb57) outlines the approach for an Office 365 customer to configure Office 365 and enable other EMS capabilities. Then, review steps 3-6 of how to [Protect access to data and services in Office 365](https://support.office.com/article/Protect-access-to-data-and-services-in-Office-365-a6ef28a4-2447-4b43-aae2-f5af6d53c68e) and the guide for how to [monitor security and compliance in Office 365](https://support.office.com/article/Monitor-security-and-compliance-in-Office-365-b62f1722-fd39-44eb-8361-da61d21509b6).

#### Configure Office 365 Activity Monitoring (if using Office 365)

Monitor your organization for users who are using Office 365 to identify staff who have an admin account but might not need Office 365 access because they don't sign in to those portals. For more information, see [Activity reports in the Microsoft 365 admin center](https://support.office.com/article/Activity-Reports-in-the-Office-365-admin-center-0d6dfb17-8582-4172-a9a9-aed798150263).

#### Establish incident/emergency response plan owners

Establishing a successful incident response capability requires considerable planning and resources. You must continually monitor for cyber-attacks and establish priorities for incident handling. Collect, analyze, and report incident data to build relationships and establish communication with other internal groups and plan owners. For more information, see [Microsoft Security Response Center](https://technet.microsoft.com/security/dn440717).

#### Secure on-premises privileged administrative accounts, if not already done

If your Azure Active Directory organization is synchronized with on-premises Active Directory, then follow the guidance in [Security Privileged Access Roadmap](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access): This stage includes:

* Creating separate admin accounts for users who need to conduct on-premises administrative tasks
* Deploying Privileged Access Workstations for Active Directory administrators
* Creating unique local admin passwords for workstations and servers

### Additional steps for organizations managing access to Azure

#### Complete an inventory of subscriptions

Use the Enterprise portal and the Azure portal to identify the subscriptions in your organization that host production applications.

#### Remove Microsoft accounts from admin roles

Microsoft accounts from other programs, such as Xbox, Live, and Outlook, shouldn't be used as administrator accounts for your organization's subscriptions. Remove admin status from all Microsoft accounts, and replace with Azure AD (for example, chris@contoso.com) work or school accounts. For admin purposes, depend on accounts that are authenticated in Azure AD and not in other services.

#### Monitor Azure activity

The Azure Activity Log provides a history of subscription-level events in Azure. It offers information about who created, updated, and deleted what resources, and when these events occurred. For more information, see [Audit and receive notifications about important actions in your Azure subscription](../../azure-monitor/platform/quick-audit-notify-action-subscription.md).

### Additional steps for organizations managing access to other cloud apps via Azure AD

#### Configure Conditional Access policies

Prepare Conditional Access policies for on-premises and cloud-hosted applications. If you have users workplace joined devices, get more information from [Setting up on-premises Conditional Access by using Azure Active Directory device registration](../active-directory-device-registration-on-premises-setup.md).

## Stage 3: Take control of admin activity

![Stage 3: take control of admin activity](./media/directory-admin-roles-secure/stage-three.png)

Stage 3 builds on the mitigations from Stage 2 and should be implemented in approximately 1-3 months. This stage of the Secured Privileged Access roadmap includes the following components.

### General preparation

#### Complete an access review of users in administrator roles

More corporate users are gaining privileged access through cloud services, which can lead to unmanaged access. Users today can become global admins for Office 365, Azure subscription administrators, or have admin access to VMs or via SaaS apps.

Your organization should have all employees handle ordinary business transactions as unprivileged users, and then grant admin rights only as needed. Complete access reviews to identify and confirm the users who are eligible to activate admin privileges.

We recommend that you:

1. Determine which users are Azure AD admins, enable on-demand, just-in-time admin access, and role-based security controls.
2. Convert users who have no clear justification for admin privileged access to a different role (if no eligible role, remove them).

#### Continue rollout of stronger authentication for all users

Require highly exposed users to have modern, strong authentication such as Azure MFA or Windows Hello. Examples of highly exposed users include:

* C-suite executives
* High-level managers
* Critical IT and security personnel

#### Use dedicated workstations for administration for Azure AD

Attackers might try to target privileged accounts so that they can disrupt the integrity and authenticity of data. They often use malicious code that alters the program logic or snoops the admin entering a credential. Privileged Access Workstations (PAWs) provide a dedicated operating system for sensitive tasks that is protected from Internet attacks and threat vectors. Separating these sensitive tasks and accounts from the daily use workstations and devices provides strong protection from:

* Phishing attacks
* Application and operating system vulnerabilities
* Impersonation attacks
* Credential theft attacks such as keystroke logging, Pass-the-Hash, and Pass-The-Ticket

By deploying privileged access workstations, you can reduce the risk that admins enter their credentials in a desktop environment that hasn't been hardened. For more information, see [Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations).

#### Review National Institute of Standards and Technology recommendations for handling incidents

The National Institute of Standards and Technology’s (NIST) provides guidelines for incident handling, particularly for analyzing incident-related data and determining the appropriate response to each incident. For more information, see [The (NIST) Computer Security Incident Handling Guide (SP 800-61, Revision 2)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf).

#### Implement Privileged Identity Management (PIM) for JIT to additional administrative roles

For Azure Active Directory, use [Azure AD Privileged Identity Management](../privileged-identity-management/pim-configure.md) capability. Time-limited activation of privileged roles works by enabling you to:

* Activate admin privileges to do a specific task
* Enforce MFA during the activation process
* Use alerts to inform admins about out-of-band changes
* Enable users to keep their privileged access for a pre-configured amount of time
* Allow security admins to:

  * Discover all privileged identities
  * View audit reports
  * Create access reviews to identify every user who is eligible to activate admin privileges

If you’re already using Azure AD Privileged Identity Management, adjust timeframes for time-bound privileges as necessary (for example, maintenance windows).

#### Determine exposure to password-based sign-in protocols (if using Exchange Online)

We recommend you identify every potential user who could be catastrophic to the organization if their credentials were compromised. For those users, put in place strong authentication requirements and use Azure AD Conditional Access to keep them from signing in to their email using username and password. You can block [legacy authentication using Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/block-legacy-authentication), and you can [block basic authentication](https://docs.microsoft.com/exchange/clients-and-mobile-in-exchange-online/disable-basic-authentication-in-exchange-online) through Exchange online.

#### Complete a roles review assessment for Office 365 roles (if using Office 365)

Assess whether all admins users are in the correct roles (delete and reassign according to this assessment).

#### Review the security incident management approach used in Office 365 and compare with your own organization

You can download this report from [Security Incident Management in Microsoft Office 365](https://www.microsoft.com/download/details.aspx?id=54302).

#### Continue to secure on-premises privileged administrative accounts

If your Azure Active Directory is connected to on-premises Active Directory, then follow the guidance in the [Security Privileged Access Roadmap](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access): Stage 2. In this stage, you:

* Deploy Privileged Access Workstations for all administrators
* Require MFA
* Use Just Enough Admin for domain controller maintenance, lowering the attack surface of domains
* Deploy Advanced Threat Assessment for attack detection

### Additional steps for organizations managing access to Azure

#### Establish integrated monitoring

The [Azure Security Center](../../security-center/security-center-intro.md):

* Provides integrated security monitoring and policy management across your Azure subscriptions
* Helps detect threats that may otherwise go unnoticed
* Works with a broad array of security solutions

#### Inventory your privileged accounts within hosted Virtual Machines

You don’t usually need to give users unrestricted permissions to all your Azure subscriptions or resources. Use Azure AD admin roles to grant only the access that your users who need to do their jobs. You can use Azure AD administrator roles to let one admin manage only VMs in a subscription, while another can manage SQL databases within the same subscription. For more information, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).

#### Implement PIM for Azure AD administrator roles

Use Privileged identity Management with Azure AD administrator roles to manage, control, and monitor access to Azure resources. Using PIM protects by lowering the exposure time of privileges and increasing your visibility into their use through reports and alerts. For more information, see [Manage RBAC access to Azure resources with Privileged Identity Management](../../role-based-access-control/pim-azure-resource.md).

#### Use Azure log integrations to send relevant Azure logs to your SIEM systems

Azure log integration enables you to integrate raw logs from your Azure resources to your organization’s existing Security Information and Event Management (SIEM) systems. [Azure log integration](../../security/fundamentals/azure-log-integration-overview.md) collects Windows events from Windows Event Viewer logs and Azure resources from:

* Azure activity Logs
* Azure Security Center alerts
* Azure resource logs

### Additional steps for organizations managing access to other cloud apps via Azure AD

#### Implement user provisioning for connected apps

Azure AD allows you to automate creating and maintaining user identities in cloud apps like Dropbox, Salesforce, and ServiceNow. For more information, see [Automate user provisioning and deprovisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

#### Integrate information protection

Microsoft Cloud App Security allows you to investigate files and set policies based on Azure Information Protection classification labels, enabling greater visibility and control of your cloud data. Scan and classify files in the cloud and apply Azure information protection labels. For more information, see [Azure Information Protection integration](https://docs.microsoft.com/cloud-app-security/azip-integration).

#### Configure Conditional Access

Configure Conditional Access based on a group, location, and application sensitivity for [SaaS apps](https://azure.microsoft.com/overview/what-is-saas/) and Azure AD connected apps. 

#### Monitor activity in connected cloud apps

We recommend using [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) to ensure that user access is also protected in connected applications. This feature secures the enterprise access to cloud apps and secures your admin accounts, allowing you to:

* Extend visibility and control to cloud apps
* Create policies for access, activities, and data sharing
* Automatically identify risky activities, abnormal behaviors, and threats
* Prevent data leakage
* Minimize risk and automated threat prevention and policy enforcement

The Cloud App Security SIEM agent integrates Cloud App Security with your SIEM server to enable centralized monitoring of Office 365 alerts and activities. It runs on your server and pulls alerts and activities from Cloud App Security and streams them into the SIEM server. For more information, see [SIEM integration](https://docs.microsoft.com/cloud-app-security/siem).

## Stage 4: Continue building defenses

![Stage 4: adopt an active security posture](./media/directory-admin-roles-secure/stage-four.png)

Stage 4 of the roadmap should be implemented at six months and beyond. Complete your roadmap to strengthen your privileged access protections from potential attacks that are known today. For the security threats of tomorrow, we recommend viewing security as an ongoing process to raise the costs and reduce the success rate of adversaries targeting your environment.

Securing privileged access is important to establish security assurances for your business assets. However, it should be part of a complete security program that provides ongoing security assurances. This program should include elements such as:

* Policy
* Operations
* Information security
* Servers
* Applications
* PCs
* Devices
* Cloud fabric

We recommend the following practices when you're managing privileged access accounts:

* Ensure that admins are doing their day-to-day business as unprivileged users
* Grant privileged access only when needed, and remove it afterward (just-in-time)
* Keep audit activity logs relating to privileged accounts

For more information on building a complete security roadmap, see [Microsoft cloud IT architecture resources](https://docs.microsoft.com/office365/enterprise/microsoft-cloud-it-architecture-resources). To engage with Microsoft services to help you implement any part of your roadmap, contact your Microsoft representative or see [Build critical cyber defenses to protect your enterprise](https://www.microsoft.com/en-us/microsoftservices/campaigns/cybersecurity-protection.aspx).

This final ongoing stage of the Secured Privileged Access roadmap includes the following components.

### General preparation

#### Review admin roles in Azure AD

Determine if current built-in Azure AD admin roles are still up to date and ensure that users are in only the roles they need. With Azure AD, you can assign separate administrators to serve different functions. For more information, see [Assigning administrator roles in Azure Active Directory](directory-assign-admin-roles.md).

#### Review users who have administration of Azure AD joined devices

For more information, see [How to configure hybrid Azure Active Directory joined devices](../device-management-hybrid-azuread-joined-devices-setup.md).

#### Review members of [built-in Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d)
Skip this step if you're not using Office 365.
‎
#### Validate incident response plan

To improve upon your plan, Microsoft recommends you regularly validate that your plan operates as expected:

* Go through your existing road map to see what was missed
* Based on the postmortem analysis, revise existing or define new practices
* Ensure that your updated incident response plan and practices are distributed throughout your organization


### Additional steps for organizations managing access to Azure 

Determine if you need to [transfer ownership of an Azure subscription to another account](../../cost-management-billing/manage/billing-subscription-transfer.md).
‎

## "Break glass": what to do in an emergency

![Accounts for emergency break glass access](./media/directory-admin-roles-secure/emergency.jpeg)

1. Notify key managers and security officers with information about the incident.

2. Review your attack playbook.

3. Access your "break glass" account username and password combination to sign in to Azure AD.

4. Get help from Microsoft by [opening an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

5. Look at the [Azure AD sign-in reports](../reports-monitoring/overview-reports.md). There might be some time between an event occurring and when it's included in the report.

6. For hybrid environments, if your on-premises infrastructure federated and your AD FS server aren’t available, you can temporarily switch from federated authentication to use password hash sync. This switch reverts the domain federation back to managed authentication until the AD FS server becomes available.

7. Monitor email for privileged accounts.

8. Make sure you save backups of relevant logs for potential forensic and legal investigation.

For more information about how Microsoft Office 365 handles security incidents, see [Security Incident Management in Microsoft Office 365](https://aka.ms/Office365SIM).

## FAQ: Answers for securing privileged access  

**Q:** What do I do if I haven’t implemented any secure access components yet?

**Answer:** Define at least two break-glass account, assign MFA to your privileged admin accounts, and separate user accounts from Global admin accounts.

**Q:** After a breach, what is the top issue that needs to be addressed first?

**Answer:** Be sure you’re requiring the strongest authentication for highly exposed individuals.

**Q:** What happens if our privileged admins have been deactivated?

**Answer:** Create a Global admin account that is always kept up to date.

**Q:** What happens if there's only one global administrator left and they can’t be reached?

**Answer:** Use one of your break-glass accounts to gain immediate privileged access.

**Q:** How can I protect admins within my organization?

**Answer:** Have admins always do their day-to-day business as standard “unprivileged” users.

**Q:** What are the best practices for creating admin accounts within Azure AD?

**Answer:** Reserve privileged access for specific admin tasks.

**Q:** What tools exist for reducing persistent admin access?

**Answer:** Privileged Identity Management (PIM) and Azure AD admin roles.

**Q:** What is the Microsoft position on synchronizing admin accounts to Azure AD?

**Answer:** Tier 0 admin accounts are used only for on-premises AD accounts. Such accounts aren't typically synchronized with Azure AD in the cloud. Tier 0 admin accounts include accounts, groups, and other assets that have direct or indirect administrative control of the on-premises Active Directory forest, domains, domain controllers, and assets.

**Q:** How do we keep admins from assigning random admin access in the portal?

**Answer:** Use non-privileged accounts for all users and most admins. Start by developing a footprint of the organization to determine which few admin accounts should be privileged. And monitor for newly created administrative users.

## Next steps

* [Microsoft Trust Center for Product Security](https://www.microsoft.com/trustcenter/security) – Security features of Microsoft cloud products and services

* [Microsoft Trust Center - Compliance](https://www.microsoft.com/trustcenter/compliance/complianceofferings) – Microsoft’s comprehensive set of compliance offerings for cloud services

* [Guidance on how to do a risk assessment](https://www.microsoft.com/trustcenter/guidance/risk-assessment) - Manage security and compliance requirements for Microsoft cloud services

### Other Microsoft Online Services

* [Microsoft Intune Security](https://www.microsoft.com/trustcenter/security/intune-security) – Intune provides mobile device management, mobile application management, and PC management capabilities from the cloud.

* [Microsoft Dynamics 365 security](https://www.microsoft.com/trustcenter/security/dynamics365-security) – Dynamics 365 is the Microsoft cloud-based solution that unifies customer relationship management (CRM) and enterprise resource planning (ERP) capabilities.
