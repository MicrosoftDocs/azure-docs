---
title: 'Four steps to a strong identity foundation with Azure Active Directory'
description: This topic describes four steps hybrid identity customers can take to build a strong identity foundation.
services: active-directory
author: martincoetzer
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/20/2019
ms.subservice: hybrid
ms.author: martinco
ms.collection: M365-identity-device-management
---

# Four steps to a strong identity foundation with Azure Active Directory

Managing access to apps and data can no longer rely on the traditional network security boundary strategies such as perimeter networks and firewalls because of the rapid movement of apps to the cloud. Now organizations must trust their identity solution to control who and what has access to the organization's apps and data. More organizations are allowing employees to bring their own devices to work and use their devices from anywhere they can connect to the Internet. Ensuring those devices are compliant and secure has become an important consideration in the identity solution an organization chooses to implement. In today's digital workplace, [identity is the primary control plane](https://www.microsoft.com/security/technology/identity-access-management?rtc=1) of any organization moving to the cloud.

In adopting an Azure Active Directory (Azure AD) hybrid identity solution, organizations gain access to premium features that unlock productivity through automation, delegation, self-service, and single sign-on capabilities. It allows your workers to access company resources from wherever they need to do their work while allowing your IT team to govern that access by ensuring that the right people have the right access to the right resources to establish secure productivity.

Based on our learnings, this checklist of best practices will help you quickly deploy recommended actions to build a *strong* identity foundation in your organization:

* Connect to apps easily
* Establish one identity for every user automatically
* Empower your users securely
* Operationalize your insights

## Step 1 - Connect to apps easily

By connecting your apps with Azure AD, you can improve end-user productivity and security by enabling single sign-on (SSO) and do user provisioning. By managing your apps in a single place, Azure AD, you can minimize administrative overhead and achieve a single point of control for your security and compliance policies.

This section covers your options for managing user access to apps, enabling secure remote access to internal apps, and the benefits of migrating your apps to Azure AD.

### Make apps available to your users seamlessly

Azure AD enables administrators to [add applications](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal) to the Enterprise applications gallery in the [Azure portal](https://portal.azure.com/). Adding applications to the Enterprise applications gallery makes it easier for you to configure applications to use Azure AD as your identity provider. It also lets you manage user access to the application with conditional access policies and configure single sign-on (SSO) to applications so that users don't have to enter their passwords repeatedly and are automatically signed into both on-premises and cloud-based applications.

Once applications are added to the Azure AD gallery, users can see apps that are assigned to them and search and request other apps as needed. Azure AD provides [several methods](https://docs.microsoft.com/azure/active-directory/manage-apps/end-user-experiences) for users to access their apps:

* Access panel/My Apps
* Office 365 app launcher
* Direct sign-on to federated apps
* Direct sign-on links

To learn more about user access to apps, see **Step 3 -- Empower Your Users** in this article.

### Migrate apps from Active Directory Federation Services to Azure AD

Migrating single sign-on configuration from Active Directory Federation Services (ADFS) to Azure AD enables additional capabilities on security, a more consistent manageability, and collaboration. For optimal results, we recommend that you migrate your apps from AD FS to Azure AD. Bringing your application authentication and authorization to Azure AD provides you with the following benefits:

* Managing cost
* Managing risk
* Increasing productivity
* Addressing compliance and governance

To learn more, see the [Migrating Your Applications to Azure Active Directory](https://aka.ms/migrateapps/whitepaper) whitepaper.

### Enable secure remote access to apps

[Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-application-proxy) provides a simple solution for organizations to publish on-premises apps to the cloud for remote users who need access to internal apps in a secure manner. After a single sign-on to Azure AD, users can access both cloud and on-premises applications through external URLs or an internal application portal.

Azure AD Application Proxy offers the following benefits:

* Extending Azure AD to on-premises resources
  * Cloud-scale security and protection
  * Features like conditional access and Multi-Factor Authentication that are easy to enable
* No components in the perimeter network such as VPN and traditional reverse proxy solutions
* No inbound connections required
* Single sign-on (SSO) across devices, resources, and apps in the cloud and on-premises
* Empowers end users to be productive anytime and anywhere

### Discover Shadow IT with Microsoft Cloud App Security

In modern enterprises, IT departments are often not aware of all the cloud applications that are used by the users to do their work. When IT admins are asked how many cloud apps they think their employees use, on average they say 30 or 40. In reality, the average is over 1,000 separate apps being used by employees in your organization. 80% of employees use non-sanctioned apps that no one has reviewed and may not be compliant with your security and compliance policies.

[Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) (MCAS) can help you identify useful apps that are popular with users that IT may sanction and add to the Enterprise applications gallery so that users benefit from capabilities such as SSO and conditional access.

*"**Cloud App Security** helps us ensure that our people are properly using our cloud and SaaS applications, in ways that support the foundational security policies that help protect Accenture."* --- [John Blasi, Managing Director, Information Security, Accenture](https://customers.microsoft.com/story/accenture-professional-services-cloud-app-security)

In addition to detecting shadow IT, MCAS can also determine the risk level of apps, prevent unauthorized access to corporate data, possible data leakage, and other security risks inherent in the applications.

## Step 2 - Establish one identity for every user automatically

Bringing on-premises and cloud-based directories together in an Azure AD hybrid identity solution will allow you to reuse your existing on-premises Active Directory investment by provisioning your existing identities in the cloud. The solution synchronizes on-premises identities with Azure AD, while IT keeps the on-premises Active Directory running with any existing governance solutions as the primary source of truth for identities. Microsoft's Azure AD hybrid identity solution spans on-premises and cloud-based capabilities, creating a common user identity for authentication and authorization to all resources regardless of their location.

Integrating your on-premises directories with Azure AD makes your users more productive and prevents users from using multiple accounts across apps and services by providing a common identity for accessing both cloud and on-premises resources. Using multiple accounts is a pain point for end users and IT alike. From an end-user perspective, having multiple accounts means having to remember multiple passwords. To avoid this, many users reuse the same password for each account, which is bad from a security perspective. From an IT perspective, reuse often leads to more password resets and helpdesk costs along with the end-user complaints.

Azure AD Connect is the tool that is used for to sync your on-premises identities to Azure AD, which can then be used to access cloud applications. Once the identities are in Azure AD, they can provision to SaaS applications like Salesforce or Concur.

In this section, we list recommendations for providing high availability, modern authentication for the cloud, and reducing your on-premises footprint.

> [!NOTE]
> If you want to learn more about Azure AD Connect, see [What is Azure AD Connect Sync?](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-whatis)

### Set up a staging server for Azure AD Connect and keep it up-to-date

Azure AD Connect plays a key role in the provisioning process. If the Sync Server goes offline for any reason, changes to on-premises won't be updated in the cloud and cause access issues to users. It's important to define a failover strategy that allows administrators to quickly resume synchronization after the sync server goes offline.

To provide high availability in the event your primary Azure AD Connect server goes offline, it's recommended that you deploy a separate [staging server](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-staging-server) for Azure AD Connect. Deploying a  server allows the administrator to "promote" the staging server to production by a simple configuration switch. Having a standby server configured in staging mode also allows you to test and deploy new configuration changes and introduce a new server if decommissioning the old one.

> [!TIP]
> Azure AD Connect is updated on a regular basis. Therefore, it's strongly recommended that you keep the staging server current in order to take advantage of the performance improvements, bug fixes, and new capabilities that each new version provides.

### Enable cloud authentication

Organizations with on-premises Active Directory should extend their directory to Azure AD using Azure AD Connect and configure the appropriate authentication method. [Choosing the correct authentication method](https://docs.microsoft.com/azure/security/azure-ad-choose-authn) for your organization is the first step in your journey of moving apps to the cloud. It's a critical component since it controls access to all cloud data and resources.

The simplest and recommended method for enabling cloud authentication for on-premises directory objects in Azure AD is to enable [Password Hash Synchronization](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-password-hash-synchronization) (PHS). Alternatively, some organizations may consider enabling [Pass-through Authentication](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-pta-quick-start) (PTA).

Whether you choose PHS or PTA, don't forget to enable [Seamless Single Sign-on](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sso) to allow users to access cloud apps without constantly entering their username and password in the app when using Windows 7 and 8 devices on your corporate network. Without single sign-on, users must remember application-specific passwords and sign into each application. Likewise, IT staff needs to create and update user accounts for each application such as Office 365, Box, and Salesforce. Users need to remember their passwords, plus spend the time to sign into each application. Providing a standardized single sign-on mechanism to the entire enterprise is crucial for best user experience, reduction of risk, ability to report, and governance.

For organizations already using AD FS or another on-premises authentication provider, moving to Azure AD as your identity provider can reduce complexity and improve availability. Unless you have specific use cases for using federation, we recommend migrating from federated authentication to either PHS and Seamless SSO or PTA and Seamless SSO to enjoy the benefits of a reduced on-premises footprint and the flexibility the cloud offers with improved user experiences. For more information, see [Migrate from federation to password hash synchronization for Azure Active Directory](https://docs.microsoft.com/azure/active-directory/hybrid/plan-migrate-adfs-password-hash-sync).

### Enable automatic deprovisioning of accounts

Enabling automated provisioning and deprovisioning to your applications is the best strategy for governing the lifecycle of identities across multiple systems. Azure AD supports [automated, policy-based provisioning and deprovisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/configure-automatic-user-provisioning-portal) of user accounts to a variety of popular SaaS applications such as ServiceNow and Salesforce, and others that implement the [SCIM 2.0 protocol](https://docs.microsoft.com/azure/active-directory/manage-apps/use-scim-to-provision-users-and-groups). Unlike traditional provisioning solutions, which require custom code or manual uploading of CSV files, the provisioning service is hosted in the cloud, and features pre-integrated connectors that can be set up and managed using the Azure portal. A key benefit of automatic deprovisioning is that it helps secure your organization by instantly removing users' identities from key SaaS apps when they leave the organization.

To learn more about automatic user account provisioning and how it works, see [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).

## Step 3 - Empower your users securely

In today's digital workplace, it's important to balance security with productivity. However, end users often push back on security measures that slow their productivity and access to cloud apps. To help address this, Azure AD provides self-service capabilities that enable users to remain productive while minimizing administrative overhead.

This section lists recommendations for removing friction from your organization by empowering your users while remaining vigilant.

### Enable Self-Service Password Reset for all users

Azure's [self-service password reset](https://docs.microsoft.com/azure/active-directory/authentication/quickstart-sspr) (SSPR) offers a simple means for IT administrators to allow users to reset and unlock their passwords or accounts without administrator intervention. The system includes detailed reporting that tracks when users access the system, along with notifications to alert you to misuse or abuse.

By default, Azure AD unlocks accounts when it performs a password reset. However, when you enable Azure AD Connect [integration on-premises](https://docs.microsoft.com/azure/active-directory/authentication/concept-sspr-howitworks#on-premises-integration), you also have the option to separate those two operations, which enable users to unlock their account without having to reset the password.

### Ensure all users are registered for MFA and SSPR

Azure provides reports that can be used by you and your organization to ensure users are registered for MFA and SSPR. Users who haven't registered may need to be educated on the process.

The MFA [sign-ins report](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-reporting) includes information about MFA usage and gives you insights into how MFA is working in your organization. Having access to sign-in activity (and audits and risk events) for Azure AD is crucial for troubleshooting, usage analytics, and forensics investigations.

Likewise, the [Self-service Password Management report](https://docs.microsoft.com/azure/active-directory/authentication/howto-sspr-reporting) can be used to determine who has (or hasn't) registered for SSPR.

### Self-service app management

Before your users can self-discover applications from their access panel, you need to enable [self-service application access](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-manage-self-service-access) to any applications that you wish to allow users to self-discover and request access to. Self-service application access is a great way to allow users to self-discover applications and optionally allow the business group to approve access to those applications. You can allow the business group to manage the credentials assigned to those users for [Password Single-Sign On Applications](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-password-sso-gallery#configure-password-sso-for-an-azure-ad-gallery-app) right from their access panels.

### Self-service group management

Assigning users to applications is best mapped when using groups, because they allow great flexibility and ability to manage at scale:

* Attribute-based using dynamic group membership
* Delegation to app owners

Azure AD provides the ability to manage access to resources using security groups and Office 365 groups. These groups can be managed by a group owner who can approve or deny membership requests and delegate control of group membership. Known as [self-service group management](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-self-service-management), this feature saves time by allowing group owners who aren't assigned an administrative role to create and manage groups without having to rely on administrators to handle their requests.

## Step 4 - Operationalize your insights

Auditing and logging of security-related events and related alerts are essential components of an efficient strategy to ensure that users remain productive and your organization is secure. Security logs and reports can help answer question such as:

* Are you using what you're paying for?
* Is there anything suspicious or malicious happening in my tenant?
* Who was impacted during a security incident?

Security logs and reports provide you with an electronic record of suspicious activities and help you detect patterns that may indicate attempted or successful external penetration of the network, and internal attacks. You can use auditing to monitor user activity, document regulatory compliance, do forensic analysis, and more. Alerts provide notifications of security events.

### Assign least privileged admin roles for operations

As you think about your approach to operations, there are a couple levels of administration to consider. The first level places the burden of administration on your global administrator(s). Always using the global administrator role, might be appropriate for smaller companies. But for larger organizations with help desk personnel and administrators responsible for specific tasks, assigning the role of global administrator can be a security risk since it provides those individuals with the ability to manage tasks that are above and beyond what they should be capable of doing.

In this case, you should consider the next level of administration. Using Azure AD, you can designate end users as "limited administrators" who can manage tasks in less-privileged roles. For example, you might assign your help desk personnel the [security reader](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#security-reader) role to provide them with the ability to manage security-related features with read-only access. Or perhaps it makes sense to assign the [authentication administrator](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#authentication-administrator) role to individuals to give them the ability to reset non-password credentials or read and configure Azure Service Health.

To learn more, see [Administrator role permissions in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).

### Monitor hybrid components (Azure AD Connect sync, AD FS) using Azure AD Connect Health

Azure AD Connect and AD FS are critical components that can potentially break lifecycle management and authentication and ultimately lead to outages. Therefore, you should deploy Azure AD Connect Health for monitoring and reporting of these components.

To learn more, go read [Monitor AD FS using Azure AD Connect Health](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-health-adfs).

### Use Azure Monitor to collect data logs for analytics

[Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) is a unified monitoring portal for all Azure AD logs, which provides deep insights, advanced analytics, and smart machine learning. With Azure Monitor, you can consume metrics and logs within the portal and via APIs to gain more visibility into the state and performance of your resources. It enables a single pane of glass experience within the portal while enabling a wide range of product integrations via APIs and data export options that support traditional third-party SIEM systems. Azure Monitor also gives you the ability to configure alert rules to get notified or to take automated actions on issues impacting your resources.

![Azure Monitor](./media/four-steps/image1.png)

### Create custom dashboards for your leadership and your day to day

Organizations that don't have a SIEM solution can download the [Power BI Content Pack](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-power-bi-content-pack) for Azure AD. The Power BI content pack contains pre-built reports to help you understand how your users adopt and use Azure AD features, which allows you to gain insights into all the activities within your directory. You can also create your own [custom dashboard](https://docs.microsoft.com/power-bi/service-dashboards) and share with your leadership team to report on day-to-day activities. Dashboards are a great way to monitor your business and see all of your most important metrics at a glance. The visualizations on a dashboard may come from one underlying dataset or many, and from one underlying report or many. A dashboard combines on-premises and cloud data, providing a consolidated view regardless of where the data lives.

![Power BI custom dashboard](./media/four-steps/image2.png)

### Understand your support call drivers

When you implement a hybrid identity solution as outlined in this article, you should ultimately notice a reduction in your support calls. Common issues such as forgotten passwords and account lockouts are mitigated by implementing Azure's self-service password reset, while enabling self-service application access allows users to self-discover and request access to applications without relying on your IT staff.

If you don't observe a reduction in support calls, we recommend that you analyze your support call drivers in an attempt to confirm if SSPR or self-service application access has been configured correctly or if there are any other new issues that can be systematically addressed.

*"In our digital transformation journey, we needed a reliable identity and access management provider to facilitate seamless yet secure integration between us, partners and cloud service providers, for an effective ecosystem; Azure AD was the best option offering us the needed capabilities and visibility that enabled us to detect and respond to risks."* --- [Yazan Almasri, Global Information Security Director, Aramex](https://customers.microsoft.com/story/aramex-azure-active-directory-travel-transportation-united-arab-emirates-en)

### Monitor your usage of apps to drive insights

In addition to discovering Shadow IT, monitoring app usage across your organization using [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) can help your organization as you move to take full advantage of the promise of cloud applications. It can help keep you in control of your assets through improved visibility into activity and increase the protection of critical data across cloud applications. Monitoring app usage in your organization using MCAS can help you answer the following questions:

* What unsanctioned apps are employees using to store data in?
* Where and when is sensitive data being stored in the cloud?
* Who is accessing sensitive data in the cloud?

*"With Cloud App Security, we can quickly spot anomalies and take action."* --- [Eric LePenske, Senior Manager, Information Security, Accenture](https://customers.microsoft.com/story/accenture-professional-services-cloud-app-security)

## Summary

There are many aspects to implementing a hybrid Identity solution, but this four-step checklist will help you quickly accomplish an identity infrastructure that will enable users to be more productive and secure.

* Connect to apps easily
* Establish one identity for every user automatically
* Empower your users securely
* Operationalize your insights

We hope this document is a useful roadmap to establishing a strong identity foundation for your organization.

## Identity checklist

We recommend that you print the following checklist for reference as you begin your journey to a more solid identity foundation in your organization.

### Today

|Done?|Item|
|:-|:-|
||Pilot Self- Service Password Reset (SSPR) for a group|
||Monitor hybrid components using Azure AD Connect Health|
||Assign least privileged admin roles for operation|
||Discover Shadow IT with Microsoft Cloud App Security|
||Use Azure Monitor to collect data logs for analysis|

### Next two weeks

|Done?|Item|
|:-|:-|
||Make an app available for your users|
||Pilot Azure AD provisioning for a SaaS app of choice|
||Setup a staging server for Azure AD Connect and keep it up-to-date|
||Start migrating apps from ADFS to Azure AD|
||Create custom dashboards for your leadership and your day to day|

### Next month

|Done?|Item|
|:-|:-|
||Monitor your usage of apps to drive insights|
||Pilot secure remote access to apps|
||Ensure all users are registered for MFA and SSPR|
||Enable cloud authentication|

### Next three months

|Done?|Item|
|:-|:-|
||Enable self-service app management|
||Enable self-service group management|
||Monitor your usage of apps to drive insights|
||Understand your support call drivers|

## Next steps

Learn how you can increase your secure posture using the capabilities of Azure Active Directory and this five-step checklist - [Five steps to securing your identity infrastructure](https://aka.ms/securitysteps).

Learn how the identity features in Azure AD can help you accelerate your transition to cloud governed management by providing the solutions and capabilities that allow organizations to quickly adopt and move more of their identity management from traditional on-premises systems to Azure AD - [How Azure AD Delivers Cloud Governed Management for On-Premises Workloads](https://aka.ms/cloudgoverned).
