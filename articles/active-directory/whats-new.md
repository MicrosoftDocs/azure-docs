---
title: What's new? Release notes for Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory (Azure AD), such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''
featureFlags:
 - clicktale

ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2018
ms.author: markvi
ms.reviewer: dhanyahk

---
# What's new in Azure Active Directory?


> Stay up to date with what's new in Azure Active Directory (Azure AD) by subscribing to the [![RSS](./media/whats-new/feed-icon-16x16.png)](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20in%20azure%20active%20directory%22&locale=en-us) [feed](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20in%20azure%20active%20directory%22&locale=en-us).



Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

-	The latest releases
-	Known issues
-	Bug fixes
-	Deprecated functionality
-	Plans for changes

This page is updated monthly, so revisit it regularly.



## February 2018
 

### Improved navigation for managing users and groups

**Type:** Plan for change  
**Service category:** Directory Management  
**Product capability:** Directory
 

The navigation experience for managing users and groups has been streamlined. You can now navigate from the directory overview directly to the list of all users, with easier access to the list of deleted users. You can also navigate from the directory overview directly to the list of all groups, with easier access to group management settings. And also from the directory overview page, you can search for a user, group, enterprise application, or app registration.
 

---


### Availability of sign-ins and audit reports in Microsoft Azure operated by 21Vianet (Azure China 21Vianet)

**Type:** New feature  
**Service category:** Sovereign Clouds  
**Product capability:** Monitoring & Reporting
 

Azure AD Activity log reports are now available in Microsoft Azure operated by 21Vianet (Azure China 21Vianet) instances. The following logs are included:

- **Sign-ins activity logs**  - Includes all the sign-ins logs associated with your tenant.

- **Self service Password Audit Logs** - Includes all the SSPR audit logs.

- **Directory Management Audit logs** - Includes all the directory management related audit logs like User management, App Management, and others.

With these logs, you can gain insights into how your environment is doing. The provided data enables you to:

- Determine how your apps and services are utilized by your users.

- Troubleshoot issues preventing your users from getting their work done.

For more information about how to use these reports, see [Azure Active Directory reporting](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-azure-portal).
 

---


### Use "Report Reader" role (non-admin role) to view Azure AD Activity Reports

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 

As part of customers feedback to enable non-admin roles to have access to Azure AD activity logs, we have enabled the ability for users who are in the "Report Reader" role to access Sign-ins and Audit activity within the Azure Portal as well as using our Graph APIs. 

For more information, how to use these reports, see [Azure Active Directory reporting](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-azure-portal). 

---
 


### EmployeeID claim available as user attribute and user identifier

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 

You can configure **EmployeeID** as the User identifier and User attribute for member users and B2B guests in SAML-based sign-on applications from the Enterprise application UI.

For more information, see [Customizing claims issued in the SAML token for enterprise applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).
 

---


### Simplified Application Management using Wildcards in Azure AD Application Proxy

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** User Authentication
 

To make application deployment easier and reduce your administrative overhead, we now support the ability to publish applications using wildcards. To publish a wildcard application, you can follow the standard application publishing flow, but use a wildcard in the internal and external URLs.

For more information, see [Wildcard applications in the Azure Active Directory application proxy](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-application-proxy-wildcard)

 

---
 
### New cmdlets to support configuration of Application Proxy

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Platform
 

The latest release of the AzureAD PowerShell Preview module contains new cmdlets that allows customers to configure Application Proxy Applications using PowerShell.

The new cmdlets are: 

- Get-AzureADApplicationProxyApplication
- Get-AzureADApplicationProxyApplicationConnectorGroup
- Get-AzureADApplicationProxyConnector
- Get-AzureADApplicationProxyConnectorGroup
- Get-AzureADApplicationProxyConnectorGroupMembers
- Get-AzureADApplicationProxyConnectorMemberOf
- New-AzureADApplicationProxyApplication
- New-AzureADApplicationProxyConnectorGroup
- Remove-AzureADApplicationProxyApplication
- Remove-AzureADApplicationProxyApplicationConnectorGroup
- Remove-AzureADApplicationProxyConnectorGroup
- Set-AzureADApplicationProxyApplication
- Set-AzureADApplicationProxyApplicationConnectorGroup
- Set-AzureADApplicationProxyApplicationCustomDomainCertificate
- Set-AzureADApplicationProxyApplicationSingleSignOn
- Set-AzureADApplicationProxyConnector
- Set-AzureADApplicationProxyConnectorGroup


 

---
 

### New cmdlets to support configuration of groups

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Platform
 

The latest release of the AzureAD PowerShell module contains cmdlets to manage groups in Azure AD. These cmdlets were previously available in the AzureADPreview module and are now added to the AzureAD module

The Group cmdlets that are now release for General Availability are: 

- Get-AzureADMSGroup
- New-AzureADMSGroup
- Remove-AzureADMSGroup
- Set-AzureADMSGroup
- Get-AzureADMSGroupLifecyclePolicy
- New-AzureADMSGroupLifecyclePolicy
- Remove-AzureADMSGroupLifecyclePolicy
- Add-AzureADMSLifecyclePolicyGroup
- Remove-AzureADMSLifecyclePolicyGroup
- Reset-AzureADMSLifeCycleGroup   
- Get-AzureADMSLifecyclePolicyGroup
 

---
 
### A new release of Azure AD Connect is available

**Type:** New feature  
**Service category:** AD Sync  
**Product capability:** Platform
 

Azure AD Connect is the preferred tool to synchronize data between Azure AD and on premises data sources, including Windows Server Active Directory and LDAP.

**Important**
 
This build introduces schema and sync rule changes. The Azure AD Connect Synchronization Service triggers a Full Import and Full Synchronization steps after an upgrade. For information on how to change this behavior, see [How to defer full synchronization after upgrade](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-upgrade-previous-version#how-to-defer-full-synchronization-after-upgrade).

This release has the following updates and changes:

**Fixed issues**

- Fix timing window on background tasks for Paritition Filtering page when switching to next page.
- Fixed a bug that caused Access violation during the ConfigDB custom action.
- Fixed a bug to recover from sql connection timeout.
- Fixed a bug where certificates with SAN wildcards fail pre-req check.
- Fixed a bug which causes miiserver.exe crash during AAD connector export.
- Fixed a bug which bad password attempt logged on DC when running AAD connect wizard to change configuration

**New features and improvements**

- For GDPR, we are required to indicate the kinds of customer data that are shared with Microsoft (telemetry, health, etc.), have links to detailed online documentation, and provide a way to you to change your preferences.  This check-in adds the following:
    - Data sharing and privacy notification on the clean install EULA page.

    - Data sharing and privacy notification on the upgrade page.

    - A new additional task **Privacy Settings** where the user can change their preferences.
 
- Application telemetry - Administrators can switch this class of data on/off.

- Azure AD Health data - Administrators must visit the health portal to control their health settings. Once the service policy has been changed, the agents will read and enforce it.

- Added device writeback configuration actions and a progress bar for page initialization.

- Improved general diagnostics with HTML report and full data collection in a ZIP-Text / HTML Report.

- Improved reliability of auto upgrade and added additional telemetry to ensure the health of the server can be determined.

- Restrict permissions available to privileged accounts on AD Connector account. For new installations, the wizard restricts the permissions that privileged accounts have on the MSOL account after creating the MSOL account. The changes affect express installations and custom installations with Auto-Create account.

- Changed the installer to not require SA privilege on clean install of AADConnect.

- New utility to troubleshoot synchronization issues for a specific object. Currently, the utility checks for the following:

    - UserPrincipalName mismatch between synchronized user object and the user account in Azure AD Tenant.
  
    - If the object is filtered from synchronization due to domain filtering
  
    - If the object is filtered from synchronization due to organizational unit (OU) filtering

- New utility to synchronize the current password hash stored in the on-premises Active Directory for a specific user account. The utility does not require a password change. 
 

---
 

### Applications supporting Intune App Protection policies added for use with Azure AD application-based conditional access

**Type:** Changed feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 

We have added more applications that support application-based conditional access. Now, you can get access to Office 365 and other Azure AD-connected cloud apps using these approved client apps.

The following applications will be added by the end of February 

- Microsoft PowerBI

- Microsoft Launcher

- Microsoft Invoicing

For more information, see:

- [Approved client app requirement](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement)
- [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam)

 

---
 

### Terms of Use update to mobile experience 

**Type:** Changed feature  
**Service category:** Terms of Use  
**Product capability:** Governance
 

When the terms of use are displayed, you can now click **Having trouble viewing? Click here**. Clicking this link opens the terms of use natively on your device. Regardless of the font size in the document or the screen size of device, you can zoom and read the document as needed. 
 

---
 
## January 2018
 

### New Federated Apps available in Azure AD App gallery 

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 

In January 2018, the following new apps with federation support were added in the App gallery :

[IBM OpenPages](https://go.microsoft.com/fwlink/?linkid=864698), [OneTrust Privacy Management Software](https://go.microsoft.com/fwlink/?linkid=861660), [Dealpath](https://go.microsoft.com/fwlink/?linkid=863526), [IriusRisk Federated Directory](https://go.microsoft.com/fwlink/?linkid=864699) and [Fidelity NetBenefits](https://go.microsoft.com/fwlink/?linkid=864701).

For a complete overview of all available tutorials, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial).
 

---
 


### Sign-in with additional risk detected

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 

The insight you get for a detected risk event is tied to your Azure AD subscription. With the Azure AD Premium P2 edition, you get the most detailed information about all underlying detections.

With the Azure AD Premium P1 edition, detections that are not covered by your license appear as the risk event Sign-in with additional risk detected.

For more information, see [Azure Active Directory risk events](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-risk-events).
 

---

### Hide Office 365 applications from end user's access panels

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** SSO
 

You can now better manage how Office 365 applications show up on your user's access panels through a new user setting. This option is helpful for reducing the amount of apps in a user's access panels if you prefer to only show Office apps in the Office portal. The setting is located in the **User Settings** and is labeled **Users can only see Office 365 apps in the Office 365 portal**.
 

For more information, see [Hide an application from user's experience in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-hide-third-party-app).

---
 


### Seamless sign into apps enabled for Password SSO directly from app's URL 

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** SSO
 

The My Apps browser extension is now available via a convenient tool that gives you the My Apps single-sign on capability as a shortcut in your browser. After installing user's will see a waffle icon in their browser that provides them quick access to apps. Users can now take advantage of:

- The ability to directly sign in to password-SSO based apps from the app’s login page
- Launch any app using the quick search feature
- Shortcuts to recently used apps from the extension
- The extension is available for Edge, Chrome and Firefox.
 
For more information, see [My Apps Secure Sign-in Extension](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction#my-apps-secure-sign-in-extension).

---

### Azure AD administration experience in Azure classic portal has been retired

**Type:** Deprecated   
**Service category:** Azure AD  
**Product capability:** Directory
 

As of January 8, 2018, the Azure AD administration experience in the Azure classic portal has been retired. This took place in conjunction with the retirement of the Azure classic portal itself. Going forward, you should use the [Azure AD admin center](https://aad.portal.azure.com) for all your portal-based administration of Azure AD.
 
---

### The PhoneFactor web portal has been retired

**Type:** Deprecated  
**Service category:** Azure AD  
**Product capability:** Directory
 

As of January 8, 2018, the PhoneFactor web portal has been retired. This portal was used for the administration of MFA server, but those functions have been moved into the Azure portal at portal.azure.com. 

The MFA configuration is located at: **Azure Active Directory \> MFA Server**
 
---
 
### Deprecate Azure AD reports


**Type:** Deprecated  
**Service category:** Reporting  
**Product capability:** Identity Lifecycle Management  


With the general availability of the new Azure Active Directory Administration console and new APIs now available for both activity and security reports, the report APIs under "/reports" endpoint have been retired as of end of December 31, 2017.


**What's available?**

As part of the transition to the new admin console, we have made 2 new APIs available for retrieving Azure AD Activity Logs. The new set of APIs provide richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk events API in Microsoft Graph.

For more information, see:

- [Get started with the Azure Active Directory reporting API](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-getting-started-azure-portal)

- [Get started with Azure Active Directory Identity Protection and Microsoft Graph](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-graph-getting-started)


---


## December 2017
 

### Terms of use in the Access Panel

**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance/Compliance
 
You now can go to the Access Panel and view the terms of use that you previously accepted.

Follow these steps:

1. Go to the [MyApps portal](https://myapps.microsoft.com), and sign in.

2. In the upper-right corner, select your name, and then select **Profile** from the list. 

3. On your **Profile**, select **Review terms of use**. 

4. Now you can review the terms of use you accepted. 

For more information, see the [Azure AD terms of use feature (preview)](https://docs.microsoft.com/azure/active-directory/active-directory-tou).
 
---
 

### New Azure AD sign-in experience

**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** User authentication
 
The Azure AD and Microsoft account identity system UIs were redesigned so that they have a consistent look and feel. In addition, the Azure AD sign-in page collects the user name first, followed by the credential on a second screen.

For more information, see [The new Azure AD sign-in experience is now in public preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/08/02/the-new-azure-ad-signin-experience-is-now-in-public-preview/).
 
---
 

### Fewer sign-in prompts: A new "keep me signed in" experience for Azure AD sign-in

**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** User authentication
 
The **Keep me signed in** check box on the Azure AD sign-in page was replaced with a new prompt that shows up after you successfully authenticate. 

If you respond **Yes** to this prompt, the service gives you a persistent refresh token. This behavior is the same as when you selected the **Keep me signed in** check box in the old experience. For federated tenants, this prompt shows after you successfully authenticate with the federated service.

For more information, see [Fewer sign-in prompts: The new "keep me signed in" experience for Azure AD is in preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/09/19/fewer-login-prompts-the-new-keep-me-signed-in-experience-for-azure-ad-is-in-preview/). 

---
 

### Add configuration to require the terms of use to be expanded prior to accepting

**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance/Compliance
 
An option for administrators requires their users to expand the terms of use prior to accepting the terms.

Select either **On** or **Off** to require users to expand the terms of use. The **On** setting requires users to view the terms of use prior to accepting them.

For more information, see the [Azure AD terms of use feature (preview)](https://docs.microsoft.com/azure/active-directory/active-directory-tou).
 
---
 

### Scoped activation for eligible role assignments

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
You can use scoped activation to activate eligible Azure resource role assignments with less autonomy than the original assignment defaults. An example is if you're assigned as the owner of a subscription in your tenant. With scoped activation, you can activate the owner role for up to five resources contained within the subscription (such as resource groups and virtual machines). Scoping your activation might reduce the possibility of executing unwanted changes to critical Azure resources.

For more information, see [What is Azure AD Privileged Identity Management?](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure).
 
---
 

### New federated apps in the Azure AD app gallery

**Type:** New feature  
**Service category:** Enterprise apps  
**Product capability:** 3rd Party Integration
 
In December 2017, the following new apps with federation support were added in the app gallery:

[Accredible](https://go.microsoft.com/fwlink/?linkid=863523), Adobe Experience Manager, [EFI Digital StoreFront](https://go.microsoft.com/fwlink/?linkid=861685), [Communifire](https://go.microsoft.com/fwlink/?linkid=861676)
CybSafe, [FactSet](https://go.microsoft.com/fwlink/?linkid=863525), [IMAGE WORKS](https://go.microsoft.com/fwlink/?linkid=863517), [MOBI](https://go.microsoft.com/fwlink/?linkid=863521), [MobileIron Azure AD integration](https://go.microsoft.com/fwlink/?linkid=858027), [Reflektive](https://go.microsoft.com/fwlink/?linkid=863518), [SAML SSO for Bamboo by resolution GmbH](https://go.microsoft.com/fwlink/?linkid=863520), [SAML SSO for Bitbucket by resolution GmbH](https://go.microsoft.com/fwlink/?linkid=863519), [Vodeclic](https://go.microsoft.com/fwlink/?linkid=863522), WebHR, Zenegy Azure AD Integration.

For a complete overview of all available tutorials, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial).

 
---
 

### Approval workflows for Azure AD directory roles

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
Approval workflow for Azure AD directory roles is generally available.

With approval workflow, privileged-role administrators can require eligible-role members to request role activation before they can use the privileged role. Multiple users and groups can be delegated approval responsibilities. Eligible role members receive notifications when approval is finished and their role is active.

---
 

### Pass-through authentication: Skype for Business support

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User authentication


Pass-through authentication now supports user sign-ins to Skype for Business client applications that support modern authentication, which includes online and hybrid topologies. 

For more information, see [Skype for Business topologies supported with modern authentication](https://technet.microsoft.com/library/mt803262.aspx).
 
---
 

### Updates to Azure AD Privileged Identity Management for Azure RBAC (preview)

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
With the public preview refresh of Azure AD Privileged Identity Management (PIM) for Azure Role-Based Access Control (RBAC), you can now:

* Use Just Enough Administration.
* Require approval to activate resource roles.
* Schedule a future activation of a role that requires approval for both Azure AD and Azure RBAC roles.

 
For more information, see [Privileged Identity Management for Azure resources (preview)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac).

 
---
 
## November 2017
 
### Access Control service retirement



**Type:** Plan for change  
**Service category:** Access Control service  
**Product capability:** Access Control service 


 Azure Active Directory Access Control (also known as the Access Control service) will be retired in late 2018. More information that includes a detailed schedule and high-level migration guidance will be provided in the next few weeks. You can leave comments on this page with any questions about the Access Control service, and a team member will answer them.

---

### Restrict browser access to the Intune Managed Browser 


**Type:** Plan for change  
**Service category:** Conditional access  
**Product capability:** Identity security and protection




You can restrict browser access to Office 365 and other Azure AD-connected cloud apps by using the Intune Managed Browser as an approved app. 

You now can configure the following condition for application-based conditional access:

**Client apps:** Browser

**What is the effect of the change?**

Today, access is blocked when you use this condition. When the preview is available, all access will require the use of the managed browser application. 

Look for this capability and more information in upcoming blogs and release notes. 

For more information, see [Conditional access in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal).

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Plan for change  
**Service category:** Conditional access  
**Product capability:** Identity security and protection




The following apps are planned to be added to the list of [approved client apps](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement):

- [Microsoft Kaizala](https://www.microsoft.com/garage/profiles/kaizala/)
- [Microsoft StaffHub](https://staffhub.office.com/what-it-is)


For more information, see:

- [Approved client app requirement](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement)
- [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam)


---

### Terms-of-use support for multiple languages



**Type:** New feature    
**Service category:** Terms of use  
**Product capability:** Governance/Compliance





Administrators now can create new terms of use that contain multiple PDF documents. You can tag these PDF documents with a corresponding language. Users are shown the PDF with the matching language based on their preferences. If there is no match, the default language is shown.


---
 

### Real-time password writeback client status



**Type:** New feature  
**Service category:** Self-service password reset  
**Product capability:** User authentication


 

You now can review the status of your on-premises password writeback client. This option is available in the **On-premises integration** section of the [Password reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset) page. 

If there are issues with your connection to your on-premises writeback client, you see an error message that provides you with:

- Information on why you can't connect to your on-premises writeback client.
- A link to documentation that assists you in resolving the issue. 


For more information, see [on-premises integration](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-how-it-works#on-premises-integration).

 
---


### Azure AD app-based conditional access 



 
**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** Identity security and protection





You now can restrict access to Office 365 and other Azure AD-connected cloud apps to [approved client apps](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement) that support Intune app protection policies by using [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam). Intune app protection policies are used to configure and protect company data on these client applications.

By combining [app-based](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam) with [device-based](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-policy-connected-applications) conditional access policies, you have the flexibility to protect data for personal and company devices.

The following conditions and controls are now available for use with app-based conditional access:

**Supported platform condition**

- iOS
- Android

**Client apps condition**

- Mobile apps and desktop clients

**Access control**

- Require approved client app


For more information, see [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam).

 
---

### Manage Azure AD devices in the Azure portal



**Type:** New feature  
**Service category:** Device registration and management  
**Product capability:** Identity security and protection

 



You now can find all your devices connected to Azure AD and the device-related activities in one place. There is a new administration experience to manage all your device identities and settings in the Azure portal. In this release, you can:

- View all your devices that are available for conditional access in Azure AD.
- View properties, which include your hybrid Azure AD-joined devices.
- Find BitLocker keys for your Azure AD-joined devices, manage your device with Intune, and more.
- Manage Azure AD device-related settings.

For more information, see [Manage devices by using the Azure portal](https://docs.microsoft.com/azure/active-directory/device-management-azure-portal).



 
---

### Support for macOS as a device platform for Azure AD conditional access 



**Type:** New feature    
**Service category:** Conditional access  
**Product capability:** Identity security and protection 
 

You now can include (or exclude) macOS as a device platform condition in your Azure AD conditional access policy. With the addition of macOS to the supported device platforms, you can:

- **Enroll and manage macOS devices by using Intune.** Similar to other platforms like iOS and Android, a company portal application is available for macOS to do unified enrollments. You can use the new company portal app for macOS to enroll a device with Intune and register it with Azure AD.
- **Ensure macOS devices adhere to your organization's compliance policies defined in Intune.** In Intune on the Azure portal, you now can set up compliance policies for macOS devices. 
- **Restrict access to applications in Azure AD to only compliant macOS devices.** Conditional access policy authoring has macOS as a separate device platform option. Now you can author macOS-specific conditional access policies for the targeted application set in Azure.

For more information, see:

- [Create a device compliance policy for macOS devices with Intune](https://aka.ms/macoscompliancepolicy)
- [Conditional access in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal)


 
---

### Network Policy Server extension for Azure Multi-Factor Authentication 


**Type:** New feature    
**Service category:**  Multi-factor authentication  
**Product capability:** User authentication




The Network Policy Server extension for Azure Multi-Factor Authentication adds cloud-based multi-factor authentication capabilities to your authentication infrastructure by using your existing servers. With the Network Policy Server extension, you can add phone call, text message, or phone app verification to your existing authentication flow. You don't have to install, configure, and maintain new servers. 

This extension was created for organizations that want to protect virtual private network connections without deploying the Azure Multi-Factor Authentication Server. The Network Policy Server extension acts as an adapter between RADIUS and cloud-based Azure Multi-Factor Authentication to provide a second factor of authentication for federated or synced users.


For more information, see [Integrate your existing Network Policy Server infrastructure with Azure Multi-Factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-nps-extension).

 
---

### Restore or permanently remove deleted users


**Type:** New feature    
**Service category:** User management  
**Product capability:** Directory 



In the Azure AD admin center, you can now:

- Restore a deleted user. 
- Permanently delete a user.


**To try it out:**

1. In the Azure AD admin center, select [All users](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/All) in the **Manage** section. 

2. From the **Show** list, select **Recently deleted users**. 

3. Select one or more recently deleted users, and then either restore them or permanently delete them.

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Changed feature  
**Service category:** Conditional access  
**Product capability:** Identity security and protection


The following apps were added to the list of [approved client apps](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement):

- Microsoft Planner
- Azure Information Protection 


For more information, see:

- [Approved client app requirement](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#approved-client-app-requirement)
- [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam)


---

### Use "OR" between controls in a conditional access policy 


**Type:** Changed feature    
**Service category:** Conditional access  
**Product capability:** Identity security and protection

 
You now can use "OR" (require one of the selected controls) for conditional access controls. You can use this feature to create policies with "OR" between access controls. For example, you can use this feature to create a policy that requires a user to sign in by using multi-factor authentication "OR" to be on a compliant device.

For more information, see [Controls in Azure AD conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-controls).

 
---

### Aggregation of real-time risk events


**Type:** Changed feature    
**Service category:** Identity protection  
**Product capability:** Identity security and protection


In Azure AD Identity Protection, all real-time risk events that originated from the same IP address on a given day are now aggregated for each risk event type. This change limits the volume of risk events shown without any change in user security.

The underlying real-time detection works each time the user signs in. If you have a sign-in risk security policy set up to multi-factor authentication or block access, it is still triggered during each risky sign-in.

 
---
 




## October 2017


### Deprecate Azure AD reports


**Type:** Plan for change  
**Service category:** Reporting  
**Product capability:** Identity Lifecycle Management  



The Azure portal provides you with:

- A new Azure AD administration console.
- New APIs for activity and security reports.
 
Due to these new capabilities, the report APIs under the /reports endpoint were retired on December 10, 2017. 

---

### Automatic sign-in field detection


**Type:** Fixed   
**Service category:** My Apps  
**Product capability:** Single sign-on  



Azure AD supports automatic sign-in field detection for applications that render an HTML user name and password field. These steps are documented in [How to automatically capture sign-in fields for an application](https://docs.microsoft.com/azure/active-directory/application-config-sso-problem-configure-password-sso-non-gallery#how-to-manually-capture-sign-in-fields-for-an-application). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](http://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, enter a web URL, and then save the page.
 
Due to a service issue, this functionality was temporarily disabled. The issue was resolved, and the automatic sign-in field detection is available again.

---

### New multi-factor authentication features


**Type:** New feature  
**Service category:** Multi-factor authentication  
**Product capability:** Identity security and protection  



Multi-factor authentication (MFA) is an essential part of protecting your organization. To make credentials more adaptive and the experience more seamless, the following features were added: 

- Multi-factor challenge results are directly integrated into the Azure AD sign-in report, which includes programmatic access to MFA results.
- The MFA configuration is more deeply integrated into the Azure AD configuration experience in the Azure portal.

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience. Now you can manage the MFA management portal functionality within the Azure AD experience.

For more information, see [Reference for MFA reporting in the Azure portal](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-activity-sign-ins-mfa). 


---

### Terms of use



**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance/Compliance  



You can use Azure AD terms of use to present information such as relevant disclaimers for legal or compliance requirements to users.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization
- Specific terms of use based on a user's attributes (for example, doctors vs. nurses or domestic vs. international employees, done by dynamic groups)
- Specific terms of use for accessing high-impact business apps, like Salesforce

For more information, see [Azure AD terms of use](https://docs.microsoft.com/azure/active-directory/active-directory-tou).


---

### Enhancements to Privileged Identity Management


**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management  


With Azure AD Privileged Identity Management, you can manage, control, and monitor access to Azure resources (preview) within your organization to:

- Subscriptions
- Resource groups
- Virtual machines 

All resources within the Azure portal that use the Azure RBAC functionality can take advantage of all the security and lifecycle management capabilities that Azure AD Privileged Identity Management has to offer.

For more information, see [Privileged Identity Management for Azure resources](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac).


---

### Access reviews


**Type:** New feature  
**Service category:** Access reviews  
**Product capability:** Governance/Compliance  



Organizations can use access reviews (preview) to efficiently manage group memberships and access to enterprise applications: 

- You can recertify guest user access by using access reviews of their access to applications and memberships of groups. Reviewers can efficiently decide whether to allow guests continued access based on the insights provided by the access reviews.
- You can recertify employee access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](https://docs.microsoft.com/azure/active-directory/active-directory-azure-ad-controls-access-reviews-overview).


---

### Hide third-party applications from My Apps and the Office 365 app launcher



**Type:** New feature  
**Service category:** My Apps  
**Product capability:** Single sign-on  



You now can better manage apps that show up on your users' portals through a new **hide app** property. You can hide apps to help in cases where app tiles show up for back-end services or duplicate tiles and clutter users' app launchers. The toggle is in the **Properties** section of the third-party app and is labeled **Visible to user?** You also can hide an app programmatically through PowerShell. 

For more information, see [Hide a third-party application from a user's experience in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-hide-third-party-app). 


**What's available?**

 As part of the transition to the new admin console, two new APIs for retrieving Azure AD activity logs are available. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports now can be accessed through the Identity Protection Risk Events API in Microsoft Graph.


## September 2017

### Hotfix for Identity Manager


**Type:** Changed feature  
**Service category:** Identity Manager  
**Product capability:** Identity lifecycle management  



A hotfix roll-up package (build 4.4.1642.0) is available as of September 25, 2017, for Identity Manager 2016 Service Pack 1. This roll-up package:

- Resolves issues and adds improvements.
- Is a cumulative update that replaces all Identity Manager 2016 Service Pack 1 updates up to build 4.4.1459.0 for Identity Manager 2016. 
- Requires you to have Identity Manager 2016 build 4.4.1302.0. 

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Identity Manager 2016 Service Pack 1](https://support.microsoft.com/help/4021562). 

---
