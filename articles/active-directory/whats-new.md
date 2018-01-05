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
ms.date: 12/19/2017
ms.author: markvi
ms.reviewer: dhanyahk

---
# What's new in Azure Active Directory?




> Stay up to date with what's new in Azure Active Directory (Azure AD) by subscribing to our [![RSS](./media/whats-new/feed-icon-16x16.png)](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20in%20azure%20active%20directory%22&locale=en-us) [feed](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20in%20azure%20active%20directory%22&locale=en-us).



Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this topic provides you with information about:

-	The latest releases
-	Known issues
-	Bug fixes
-	Deprecated functionality
-	Plans for changes

Please revisit this page regularly. It's updated on a monthly basis.


## December 2017
 

### Terms of use in the Access Panel

**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance/compliance
 
You now can go to the Access Panel and view the terms of use that you previously accepted.

Follow these steps:

1. Go to the [MyApps portal](https://myapps.microsoft.com), and sign in.

2. In the upper-right corner, select your name, and then select **Profile** from the list. 

3. On your Profile, select **Review terms of use**. 

4. Now you can review the terms of use you accepted. 

For more information, see the [Azure Active Directory Terms of use feature (preview)](https://docs.microsoft.com/azure/active-directory/active-directory-tou)
 
---
 

### New Azure AD sign-in experience

**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** User authentication
 
The Azure AD and Microsoft account identity system user interfaces were redesigned so that they have a consistent look and feel. In addition, the Azure AD sign-in page collects the user name first, followed by the credential on a second screen.

For more information, see [The new Azure AD sign-in experience is now in public preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/08/02/the-new-azure-ad-signin-experience-is-now-in-public-preview/)
 
---
 

### Fewer sign-in prompts: A new "keep me signed in" experience for Azure AD sign-in

**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** User authentication
 
The **Keep me signed in** check box on the Azure AD sign-in page was replaced with a new prompt that shows up after you successfully authenticate. 

If you respond **Yes** to this prompt, the service gives you a persistent refresh token. This is the same behavior as when you selected the **Keep me signed in** check box in the old experience. For federated tenants, this prompt shows after you successfully authenticate with the federated service.

For more information, see [Fewer sign-in prompts: The new "keep me signed in" experience for Azure AD is in preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/09/19/fewer-login-prompts-the-new-keep-me-signed-in-experience-for-azure-ad-is-in-preview/) 

---
 

### Add configuration to require the terms of use to be expanded prior to accepting

**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance
 
An option for administrators requires their users to expand the terms of use prior to accepting the terms.

Select either **On** or **Off** to require users to expand the terms of use. The **On** setting requires users to view the terms of use prior to accepting them.

For more information, see the [Azure AD terms of use feature (preview)](active-directory-tou.md).
 
---
 

### Scoped activation for eligible role assignments

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
You can use scoped activation to activate eligible Azure resource role assignments with less autonomy than the original assignment defaults. An example is if you're assigned as the owner of a subscription in your tenant. With scoped activation, you can activate the owner role for up to five resources contained within the subscription (such as Resource Groups, Virtual Machines). Scoping your activation might reduce the possibility of executing unwanted changes to critical Azure resources.

For more information, see [What is Azure AD Privileged Identity Management?](active-directory-privileged-identity-management-configure.md).
 
---
 

### New federated apps in the Azure AD app gallery

**Type:** New feature  
**Service category:** Enterprise apps  
**Product capability:** Third-party integration
 
In December 2017, the following new apps with federation support were added in the app gallery.

|Name|Integration type|Description|
|:-- |----------------|:----------|
|EFI Digital StoreFront|SAML 2.0|[Web 2 Print application](https://go.microsoft.com/fwlink/?linkid=861685).|
|Vodeclic|SAML 2.0|[Use Azure AD to manage user access and enable single sign-on with Vodeclic](https://go.microsoft.com/fwlink/?linkid=863522).  Requires an existing Vodeclic account.|
|Accredible|SAML 2.0|[Create, manage, and deliver certificates, badges, and blockchain credentials](https://go.microsoft.com/fwlink/?linkid=863523).|
|FactSet|SAML 2.0|[Single sign-on to FactSet's FDSWeb application](https://go.microsoft.com/fwlink/?linkid=863525).|
|MobileIron Azure AD integration|SAML 2.0|[MobileIron](https://go.microsoft.com/fwlink/?linkid=858027) enables modern enterprises to secure and manage information as it moves to mobile and to the cloud while preserving privacy and trust.|
|IMAGE WORKS|SAML 2.0|Use Azure AD to manage user access, provision user accounts, and enable single sign-on with [IMAGE WORKS](https://go.microsoft.com/fwlink/?linkid=863517). Requires an existing IMAGE WORKS subscription.|
|SAML SSO for Bitbucket by resolution GmbH|SAML 2.0|[SSO Bitbucket](https://go.microsoft.com/fwlink/?linkid=863519) delegates authentication to Azure AD. Users already signed in to Azure AD can access Bitbucket directly. Users can be created and updated on the fly with data from SAML attributes.|
|SAML SSO for Bamboo by resolution GmbH|SAML 2.0|[SSO Bamboo](https://go.microsoft.com/fwlink/?linkid=863520) delegates authentication to Azure AD. Users already signed in to Azure AD can access Bamboo directly.|
|Communifire|SAML 2.0|[Communifire](https://go.microsoft.com/fwlink/?linkid=861676) is a modern, fully featured social intranet software that supports employees and business.|
|MOBI|SAML 2.0|[Centralize, comprehend, and control your entire device ecosystem](https://go.microsoft.com/fwlink/?linkid=863521).|
|Reflektive|SAML 2.0|[Reflektive](https://go.microsoft.com/fwlink/?linkid=863518) is a modern platform for performance management, real-time feedback, and goal setting. |
|CybSafe|OpenID Connect & OAuth|This GCHQ-certified cyber-awareness platform uses advanced technology and data analytics to reduce the human aspect of cyber security and data protection risk.|
|WebHR|OpenID Connect & OAuth|This social human resources software is trusted by over 20,000 companies in 197 countries.|
 |Zenegy Azure AD Integration|OpenID Connect & OAuth|With this app, you can use your company's Azure AD credentials to sign in to Zenegy.|
|Adobe Experience Manager|SAML 2.0|You can use this comprehensive content management platform solution to build websites, mobile apps, and forms to manage your marketing content and assets.|

 
---
 

### Approval workflows for Azure AD directory roles

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
Approval workflow for Azure AD directory roles is generally available.

With approval workflow, privileged-role administrators can require eligible-role members to request role activation before they can use the privileged role. Multiple users and groups can be delegated approval responsibilities Eligible role members receive notifications when approval is complete and their role is active.

---
 

### Pass-through authentication: Skype for Business support

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User authentication


Pass-through authentication now supports user sign-ins to Skype for Business client applications that support modern authentication, including online and hybrid topologies. 

For more information, see [Skype for Business topologies supported with modern authentication](https://technet.microsoft.com/library/mt803262.aspx).
 
---
 

### Updates to Azure AD Privileged Identity Management for Azure RBAC (preview)

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
With the Public Preview Refresh of Azure AD Privileged Identity Management (PIM) for Azure Role-Based Access Control (RBAC), you can now:

* Use Just Enough Administration.
* Require approval to activate resource roles.
* Schedule a future activation of a role that requires approval for both Azure AD and Azure RBAC roles.

 
For more information, see [Privileged Identity Management for Azure resources (preview)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac)

 
---
 
## November 2017
 
### Retiring the Access Control service



**Type:** Plan for change  
**Service category:** Access Control service  
**Product capability:** Access Control service 


 Azure Active Directory Access Control (also known as the Access Control service) will be retired in late 2018. More information that includes a detailed schedule and high-level migration guidance will be provided in the next few weeks. Leave comments on this page with any questions in regard to the Access Control service, and a member of our team will answer them.

---

### Restrict browser access to the Intune Managed Browser 


**Type:** Plan for change  
**Service category:** Conditional access  
**Product capability:** Identity security and protection




You can restrict browser access to Office 365 and other Azure AD-connected cloud apps by using the Intune Managed Browser as an approved app. 

This change allows you to configure the following condition for application-based conditional access:

**Client apps:** Browser

**What is the effect of the change?**

Today, access is blocked when you use this condition. When the preview is available, all access will require the use of the managed browser application. 

Look for this capability and more information in upcoming blogs and release notes. 

For more information, see [Conditional access in Azure AD](active-directory-conditional-access-azure-portal.md).

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Plan for change  
**Service category:** Conditional access  
**Product capability:** Identity security and protection




The following apps are planned to be added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- [Microsoft Kaizala](https://www.microsoft.com/garage/profiles/kaizala/)
- [Microsoft StaffHub](https://staffhub.office.com/what-it-is)


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)
- [Azure AD app-based conditional access](active-directory-conditional-access-mam.md)


---

### Terms-of-use support for multiple languages



**Type:** New feature    
**Service category:** Terms of use  
**Product capability:** Governance/compliance





Administrators now can create new terms of use that contain multiple PDF documents. You can tag these PDF documents with a corresponding language. Users are shown the PDF with the matching language based on their preferences. If there is no match, the default language is shown.


---
 

### Real-time password writeback client status



**Type:** New feature  
**Service category:** Self-service password reset  
**Product capability:** User authentication


 

You now can review the status of your on-premises password writeback client. This option is available in the "On-premises integration" section of the [Password reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset) page. 

If there are issues with your connection to your on-premises writeback client, you see an error message that provides you with:

- Information on why you can't connect to your on-premises writeback client.
- A link to documentation that assists you in resolving the issue. 


For more information, see [on-premises integration](active-directory-passwords-how-it-works.md#on-premises-integration).

 
---


### Azure AD app-based conditional access 



 
**Type:** New feature  
**Service category:** Azure AD  
**Product capability:** Identity security and protection





You now can restrict access to Office 365 and other Azure AD-connected cloud apps to [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement) that support Intune app protection policies by using [Azure AD app-based conditional access](active-directory-conditional-access-mam.md). Intune app protection policies are used to configure and protect company data on these client applications.

By combining [app-based](active-directory-conditional-access-mam.md) with [device-based](active-directory-conditional-access-policy-connected-applications.md) conditional access policies, you have the flexibility to protect data for personal and company devices.

The following conditions and controls are now available for use with app-based conditional access:

**Supported platform condition**

- iOS
- Android

**Client apps condition**

- Mobile apps and desktop clients

**Access control**

- Require approved client app


For more information, see [Azure AD app-based conditional access](active-directory-conditional-access-mam.md).

 
---

### Manage Azure AD devices in the Azure portal



**Type:** New feature  
**Service category:** Device registration and management  
**Product capability:** Identity security and protection

 



You now can find all your devices connected to Azure AD and the device-related activities in one place. There is a new administration experience to manage all your device identities and settings in the Azure portal. In this release, you can:

- View all your devices that are available for conditional access in Azure AD.
- View properties, which includes your hybrid Azure AD-joined devices.
- Find BitLocker keys for your Azure AD-joined devices, manage your device with Intune, and more.
- Manage Azure AD device-related settings.

For more information, see [Manage devices by using the Azure portal](device-management-azure-portal.md).



 
---

### Support for macOS as a device platform for Azure AD conditional access 



**Type:** New feature    
**Service category:** Conditional access  
**Product capability:** Identity security and protection 
 

You now can include (or exclude) macOS as a device platform condition in your Azure AD conditional access policy. With the addition of macOS to the supported device platforms, you can:

- **Enroll and manage macOS devices by using Intune:** Similar to other platforms like iOS and Android, a company portal application is available for macOS to do unified enrollments. The new company portal app for macOS enables you to enroll a device with Intune and register it with Azure AD.
- **Ensure macOS devices adhere to your organization's compliance policies defined in Intune:** In Intune on the Azure portal, you now can set up compliance policies for macOS devices. 
- **Restrict access to applications in Azure AD to only compliant macOS devices:** Conditional access policy authoring has macOS as a separate device platform option. This option enables you to author macOS-specific conditional access policies for the targeted application set in Azure.

For more information, see:

- [Create a device compliance policy for macOS devices with Intune](https://aka.ms/macoscompliancepolicy)
- [Conditional access in Azure AD](active-directory-conditional-access-azure-portal.md)


 
---

### Network Policy Server extension for Azure MFA 


**Type:** New feature    
**Service category:** MFA  
**Product capability:** User authentication




The Network Policy Server extension for Azure Multi-Factor Authentication adds cloud-based multi-factor authentication capabilities to your authentication infrastructure by using your existing servers. With the Network Policy Server extension, you can add phone call, text message, or phone app verification to your existing authentication flow without having to install, configure, and maintain new servers. 

This extension was created for organizations that want to protect virtual private network connections without deploying the Azure Multi-Factor Authentication Server. The Network Policy Server extension acts as an adapter between RADIUS and cloud-based Azure Multi-Factor Authentication to provide a second factor of authentication for federated or synced users.


For more information, see [Integrate your existing Network Policy Server infrastructure with Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication-nps-extension.md).

 
---

### Restore or permanently remove deleted users


**Type:** New feature    
**Service category:** User management  
**Product capability:** Directory 



In the Azure AD admin center, you can now:

- Restore a deleted user. 
- Permanently delete a user.


**To try it out:**

1. In the Azure AD admin center, select [**All users**](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/All users) in the **Manage** section. 

2. From the **Show** list, select **Recently deleted users**. 

3. Select one or more recently deleted users, and then either restore them or permanently delete them.

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Changed feature  
**Service category:** Conditional access  
**Product capability:** Identity security and protection


The following apps were added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- Microsoft Planner
- Azure Information Protection 


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)
- [Azure AD app-based conditional access](active-directory-conditional-access-mam.md)


---

### Use "OR" between controls in a conditional access policy 


**Type:** Changed feature    
**Service category:** Conditional Access  
**Product capability:** Identity security and protection

 
You now can use "OR" (require one of the selected controls) for conditional access controls. You can use this feature to create policies with "OR" between access controls. For example, you can use this feature to create a policy that requires a user to sign in by using multi-factor authentication "OR" to be on a compliant device.

For more information, see [Controls in Azure AD conditional access](active-directory-conditional-access-controls.md).

 
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
 
Due to these new capabilities, the report APIs under the **/reports** endpoint were retired on December 10, 2017. 

---

### Automatic sign-in field detection


**Type:** Fixed   
**Service category:** My Apps  
**Product capability:** Single sign-on  



Azure AD supports automatic sign-in field detection for applications that render an HTML user name and password field. These steps are documented in [How to automatically capture sign-in fields for an application](application-config-sso-problem-configure-password-sso-non-gallery.md#how-to-manually-capture-sign-in-fields-for-an-application). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](http://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, enter a web URL, and then save the page.
 
Due to a service issue, this functionality was temporarily disabled for a period of time. The issue was resolved, and the automatic sign-in field detection is available again.

---

### New multi-factor authentication features


**Type:** New feature  
**Service category:** Multi-factor authentication  
**Product capability:** Identity security and protection  



Multi-factor authentication (MFA) is an essential part of protecting your organization. To make credentials more adaptive and the experience more seamless, the following features were added: 

- Multi-factor challenge results are directly integrated into the Azure AD sign-in report, which includes programmatic access to MFA results.
- The MFA configuration is more deeply integrated into the Azure AD configuration experience in the Azure portal.

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience. You now can manage the MFA management portal functionality within the Azure AD experience.

For more information, see [Reference for multi-factor authentication reporting in the Azure portal](active-directory-reporting-activity-sign-ins-mfa.md) 


---

### Terms of use



**Type:** New feature  
**Service category:** Terms of use  
**Product capability:** Governance  



You can use Azure AD terms of use to present information such as relevant disclaimers for legal or compliance requirements to users.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization
- Specific terms of use based on a user's attributes (for example, doctors vs. nurses or domestic vs. international employees, done by dynamic groups)
- Specific terms of use for accessing high-impact business apps, like Salesforce

For more information, see [Azure AD terms of use](active-directory-tou.md).


---

### Enhancements to privileged identity management


**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management  


With Azure AD Privileged Identity Management, you now can manage, control, and monitor access to Azure Resources (preview) within your organization to:

- Subscriptions
- Resource groups
- Virtual machines 

All resources within the Azure portal that use the Azure RBAC functionality can take advantage of all the security and lifecycle management capabilities that Azure AD Privileged Identity Management has to offer.

For more information, see [Privileged Identity Management for Azure resources](privileged-identity-management/azure-pim-resource-rbac.md).


---

### Access reviews


**Type:** New feature  
**Service category:** Access reviews  
**Product capability:** Governance  



Organizations can use access reviews (preview) to efficiently manage group memberships and access to enterprise applications: 

- You can recertify guest user access by using access reviews of their access to applications and memberships of groups. Reviewers can efficiently decide whether to allow guests continued access based on the insights provided by the access reviews.
- You can recertify employee access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](active-directory-azure-ad-controls-access-reviews-overview.md).


---

### Hide third-party applications from My Apps and the Office 365 app launcher



**Type:** New feature  
**Service category:** My Apps  
**Product capability:** Single sign-on  



You now can better manage apps that show up on your users' portals through a new **hide app** property. You can hide apps to help in cases where app tiles show up for back-end services or duplicate tiles and clutter users' app launchers. The toggle is located on the properties section of the third-party app and is labeled **Visible to user?** You also can hide an app programmatically through PowerShell. 

For more information, see [Hide a third-party application from a user's experience in Azure AD](active-directory-coreapps-hide-third-party-app.md). 


**What's available?**

 As part of the transition to the new admin console, two new APIs for retrieving Azure AD activity logs are available. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports now can be accessed through the Identity Protection risk events API in Microsoft Graph.


## September 2017

### Hotfix for Microsoft Identity Manager


**Type:** Changed feature  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity lifecycle management  



A hotfix roll-up package (build 4.4.1642.0) is available as of September 25, 2017, for Microsoft Identity Manager 2016 Service Pack 1. This roll-up package:

- Resolves issues and adds improvements.
- Is a cumulative update that replaces all Microsoft Identity Manager 2016 Service Pack 1 updates up to build 4.4.1459.0 for Microsoft Identity Manager 2016. 
- Requires you to have Microsoft Identity Manager 2016 build 4.4.1302.0. 

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Microsoft Identity Manager 2016 Service Pack 1](https://support.microsoft.com/help/4021562). 

---
