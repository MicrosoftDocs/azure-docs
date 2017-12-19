---
title: What’s new? Release notes for Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory (Azure AD) including latest release notes, known issues, bug fixes, deprecated functionality and upcoming changes.
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




> Stay up-to-date with what's new in Azure Active Directory by subscribing to our ![RSS](./media/whats-new/feed-icon-16x16.png) [feed](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20in%20azure%20active%20directory%22&locale=en-us).



We are improving Azure Active Directory on an ongoing basis. To enable you to stay up to date with the most recent developments, this topic provides you with information about:

-	The latest releases 
-	Known issues 
-	Bug fixes 
-	Deprecated functionality 
-	Plans for changes 

Please revisit this page regularly as we are updating it on a monthly basis.


## December 2017
 

### Terms of use in the access panel for end users

**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance/Compliance
 
End users now have the ability to go to access panel and view the terms of use that they have previously accepted.

Users can review and see the terms of use that they have accepted. This can be done using the following procedure:

1. Navigate and sign-in to the [MyApps portal](https://myapps.microsoft.com).

2. In upper right corner, click your name and select **Profile** from the drop-down. 

3. On your Profile, click **Review terms of use**. 

4. From there you can review the terms of use you have accepted. 

For more information, see [Azure Active Directory Terms of Use feature (Preview)](https://docs.microsoft.com/azure/active-directory/active-directory-tou)
 
---
 

### New Azure AD sign-in experience

**Type:** New feature  
**Service Category:** Azure AD  
**Product Capability:** User Authentication
 
As part of the journey to converge the Azure AD and Microsoft account identity systems, we have redesigned the UI on both systems so that they have a consistent look and feel. In addition, we have paginated the Azure AD sign-in page so that we collect the user name first, followed by the credential on a second screen.

For more information, see [The new Azure AD Signin Experience is now in Public Preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/08/02/the-new-azure-ad-signin-experience-is-now-in-public-preview/)
 
---
 

### Fewer login prompts: A new “Keep me signed in” experience for Azure AD login

**Type:** New feature  
**Service Category:** Azure AD  
**Product Capability:** User Authentication
 
We have replaced the **Keep me signed in** checkbox on the Azure AD login page with a new prompt that shows up after the user successfully authenticates. 

If a user responds **Yes** to this prompt, the service gives them a persistent refresh token. This is the same behavior as when the user checks the **Keep me signed in** checkbox in the old experience. For federated tenants, this prompt will show after the user successfully authenticates with the federated service.

For more information, see [Fewer login prompts: The new “Keep me signed in” experience for Azure AD is in preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/09/19/fewer-login-prompts-the-new-keep-me-signed-in-experience-for-azure-ad-is-in-preview/) 

---
 

### Add configuration to require the TOU to be expanded prior to accepting.

**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance
 
We have now added an option for admins to require their end users to expand the terms of use prior to accepting the terms.

Select either on or off for Require users to expand the terms of use. If this is set to on, end users will be required to view the terms of use prior to accepting them.

For more information, see [Azure Active Directory Terms of Use feature (Preview)](active-directory-tou.md)
 
---
 

### Scoped activation for eligible role assignments

**Type:** New feature  
**Service Category:** Privileged Identity Management  
**Product Capability:** Privileged Identity Management
 
Scoped activation allows you to activate eligible Azure resource role assignments with less autonomy than the original assignment defaults. For example, you are assigned Owner of a subscription in your tenant. With scoped activation, you can activate Owner for up to five resources contained within the subscription (think Resource Groups, Virtual Machines, etc...). Scoping your activation may reduce the possibility of executing unwanted changes to critical Azure resources.

For more information, see [What is Azure AD Privileged Identity Management?](active-directory-privileged-identity-management-configure.md).
 
---
 

### New federated apps in Azure AD app gallery

**Type:** New feature  
**Service Category:** Enterprise Apps  
**Product Capability:** 3rd Party Integration
 
In December 2017 we have added following new apps in our App gallery with Federation support:

|Name|Integration Type|Description|
|:-- |----------------|:----------|
|EFI Digital StoreFront|SAML 2.0|[Web 2 Print application](https://go.microsoft.com/fwlink/?linkid=861685)|
|Vodeclic|SAML 2.0|[Use Azure AD to manage user access and enable single sign-on with Vodeclic](https://go.microsoft.com/fwlink/?linkid=863522).  Requires an existing Vodeclic account.|
|Accredible|SAML 2.0|[Create, manage and deliver certificates, badges and blockchain credentials](https://go.microsoft.com/fwlink/?linkid=863523)|
|FactSet|SAML 2.0|[Single Sign-on to FactSet's FDSWeb application](https://go.microsoft.com/fwlink/?linkid=863525)|
|MobileIron Azure AD Integration|SAML 2.0|[MobileIron](https://go.microsoft.com/fwlink/?linkid=858027) mission is to enable modern enterprises to secure and manage information as it moves to mobile and to the cloud, while preserving end-user privacy and trust.|
|IMAGE WORKS|SAML 2.0|Use Azure AD to manage user access, provision user accounts, and enable single sign-on with [IMAGE WORKS](https://go.microsoft.com/fwlink/?linkid=863517). Requires an existing IMAGE WORKS subscription.|
|SAML SSO for Bitbucket by resolution GmbH|SAML 2.0|[SSO Bitbucket](https://go.microsoft.com/fwlink/?linkid=863519) delegates authentication to Azure AD, users already logged-in to Azure AD can access Bitbucket directly. Users can be created and updated on-the-fly with data from SAML attributes.|
|SAML SSO for Bamboo by resolution GmbH|SAML 2.0|[SSO Bamboo](https://go.microsoft.com/fwlink/?linkid=863520) delegates authentication to Azure AD, users already logged-in to Azure AD can access Bamboo directly.|
|Communifire|SAML 2.0|[Communifire](https://go.microsoft.com/fwlink/?linkid=861676) is your modern, fully featured social intranet software that supports your employees and your business.|
|MOBI|SAML 2.0|[Centralize, comprehend, and control your entire device ecosystem](https://go.microsoft.com/fwlink/?linkid=863521).|
|Reflektive|2.0|[Reflektive](https://go.microsoft.com/fwlink/?linkid=863518) is a modern platform for Performance Management, Real-Time Feedback, and Goal Setting. We empower employees to drive their own development, so you can be more strategic.|
|CybSafe|OpenID Connect & OAuth|CybSafe is a GCHQ-certified cyber awareness platform. It uses advanced technology and data analytics to demonstrably reduce the human aspect of cyber security and data protection risk.|
|WebHR|OpenID Connect & OAuth|Everyone's Favorite All-in-One Social HR Software. Trusted by over 20,000 companies in 197 countries|
 |Zenegy Azure AD Integration|OpenID Connect & OAuth|With this App you can use your company’s Azure Active Directory credentials to log into Zenegy.|
|Adobe Experience Manager|SAML 2.0|Adobe Experience Manager (AEM), is a comprehensive content management platform solution for building websites, mobile apps and forms - making it easy to manage your marketing content and assets.|

 
---
 

### Approval workflows for Azure AD directory roles

**Type:** Changed feature  
**Service Category:** Privileged Identity Management  
**Product Capability:** Privileged Identity Management
 
Approval workflow for Azure AD directory roles is generally available.

With approval workflow, privileged role administrators can require eligible role members request role activation before they can use the privileged role.
Multiple users and groups may be delegated approval responsibilities
Eligible role members receive notifications when the approval is complete and their role is active

---
 

### Pass-through Authentication - Skype for Business support

**Type:** Changed feature  
**Service Category:** Authentications (Logins)  
**Product Capability:** User Authentication


Pass-through Authentication now supports user sign-ins to Skype for Business client applications that support modern authentication, including Online & Hybrid topologies. 

For more information, see [Skype for Business topologies supported with Modern Authentication](https://technet.microsoft.com/library/mt803262.aspx).
 
---
 

### Updates to Azure Active Directory Privileged Identity Management (PIM) for Azure RBAC (preview)

**Type:** Changed feature  
**Service Category:** PIM  
**Product Capability:** Privileged Identity Management
 
With our Public Preview Refresh of Azure Active Directory Privileged Identity Management (PIM) for Azure RBAC, you can now:

Use Just Enough Administration
Require approval to activate resource roles
Schedule a future activation of a role that requires approval for both AAD and Azure RBAC Roles

 
For more information, see [PIM for Azure resources (Preview)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac)

 
---
 
## November 2017
 
### Retiring ACS



**Type:** Plan for change  
**Service Category:** ACS  
**Product Capability:** Access Control Service 


Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS) will be retired in late 2018.  Further information, including a detailed schedule & high-level migration guidance, will be provided in the next few weeks. In the meantime, leave comments on this page with any questions regarding ACS, and a member of our team will help to answer.

---

### Restrict browser access to the Intune managed browser 


**Type:** Plan for change  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection




With this behavior, you will be able to restrict browser access to Office 365 and other Azure AD-connected cloud apps using the Intune Managed Browser as an approved app. 

This change allows you to configure the following condition for application-based conditional access:

**Client apps:**  Browser

**What is the effect of the change?**

Today, access is blocked when using this condition. When the preview of this behavior is available, all access will require the use of the managed browser application. 

Look for this capability and more in the upcoming blogs and release notes. 

For more information, see [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md).

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Plan for change  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection




The following apps are planned to be added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- [Microsoft Kaizala](https://www.microsoft.com/garage/profiles/kaizala/)

- [Microsoft StaffHub](https://staffhub.office.com/what-it-is)


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)

- [Azure Active Directory app-based conditional access](active-directory-conditional-access-mam.md)


---

### Terms of use support for multiple languages



**Type:** New feature    
**Service Category:** Terms of Use  
**Product Capability:** Governance/Compliance





Administrators can now create new terms of use (TOU) that contains multiple PDF documents. You can tag these PDF documents with a corresponding language. Users that fall in scope are shown the PDF with the matching language based on their preferences. If there is no match, the default language is shown.


---
 

### Realtime password writeback client status



**Type:** New feature  
**Service Category:** SSPR  
**Product Capability:** User Authentication


 

You can now review the status of your on-premises password writeback client. This option is available in the **On-premises integration** section of the **[Password reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset)** page. 

If there are issues with your connection to your on-premises writeback client, you will see an error message that provides you with:

- Information on why you can't connect to your on-premises writeback client 
- A link to documentation that assists you in resolving the issue. 


For more information, see [On-premises integration](active-directory-passwords-how-it-works.md#on-premises-integration).

 
---


### Azure AD app-based conditional access 



 
**Type:** New feature  
**Service Category:** Azure AD  
**Product Capability:** Identity Security & Protection





You can now restrict access to Office 365 and other Azure AD-connected cloud apps to [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement) that support Intune App Protection policies using [Azure AD app-based conditional access](active-directory-conditional-access-mam.md). Intune app protection policies are used to configure and protect company data on these client applications.

By combining [app-based](active-directory-conditional-access-mam.md) with [device-based](active-directory-conditional-access-policy-connected-applications.md) conditional access policies, you have the flexibility to protect data for personal and company devices.

The following conditions and controls are now available for use with app-based conditional access:

**Supported platform condition**

- iOS
- Android

**Client apps condition**

- Mobile apps and desktop clients

**Access control**

- Require approved client app


For more information, see [Azure Active Directory app-based conditional access](active-directory-conditional-access-mam.md).

 
---

### Managing Azure AD devices in the Azure portal



**Type:** New feature  
**Service Category:** Device Registration and Management  
**Product Capability:** Identity Security & Protection

 



You can now find all your devices connected to Azure AD and the device-related activities in one place. There is a new administration experience to manage all your device identities and settings in the Azure portal. In this release you can:

- View all your devices that are available for conditional access in Azure AD

- View properties, including your Hybrid Azure AD joined devices

- Find BitLocker keys for your Azure AD-joined devices, manage your device with Intune and more.

- Manage Azure AD device-related settings


For more information, see [Managing devices using the Azure portal](device-management-azure-portal.md).



 
---

### Support for macOS as device platform for Azure AD conditional access 



**Type:** New feature    
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection 
 

You can now include (or exclude) macOS as device platform condition in your Azure AD conditional access policy. 
With the addition of macOS to the supported device platforms, you can:

- **Enroll and manage macOS devices using Intune** - Similar to other platforms like iOS and Android, a company portal application is available for macOS to do unified enrollments. The new company portal app for macOS enables you to enroll a device with Intune and register it with Azure AD.
 
- **Ensure macOS devices adhere to your organization’s compliance policies defined in Intune** - In the Intune on Azure portal, you can now set up compliance policies for macOS devices. 
  
- **Restrict access to applications in Azure AD to only compliant macOS devices** - Conditional access policy authoring has macOS as a separate device platform option. This option enables you to author macOS specific conditional access policies for the targeted application set in Azure.

For more information, see:

- [Create a device compliance policy for macOS devices with Intune](https://aka.ms/macoscompliancepolicy)
- [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)


 
---

### NPS Extension for Azure MFA 


**Type:** New feature    
**Service Category:** MFA  
**Product Capability:** User Authentication




The Network Policy Server (NPS) extension for Azure MFA adds cloud-based MFA capabilities to your authentication infrastructure using your existing servers. With the NPS extension, you can add phone call, text message, or phone app verification to your existing authentication flow without having to install, configure, and maintain new servers. 

This extension was created for organizations that want to protect VPN connections without deploying the Azure MFA Server. The NPS extension acts as an adapter between RADIUS and cloud-based Azure MFA to provide a second factor of authentication for federated or synced users.


For more information, see [Integrate your existing NPS infrastructure with Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication-nps-extension.md)

 
---

### Restore or permanently remove deleted users


**Type:** New feature    
**Service Category:** User Management  
**Product Capability:** Directory 



In the Azure AD admin center, you can now:

- Restore a deleted user 
- Permanently delete a user 


**To try it out:**

1. In the Azure AD admin center, select [**All users**](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/All users) in the **Manage** section. 

2. From the **Show** list, select **Recently deleted users**. 

4. Select one or more recently deleted users, and then either restore them, or permanently delete them.

 
---

### New approved client apps for Azure AD app-based conditional access

 
**Type:** Changed feature  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection


The following apps have been added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- Microsoft Planner

- Microsoft Azure Information Protection 


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)

- [Azure Active Directory app-based conditional access](active-directory-conditional-access-mam.md)


---

### Ability to 'OR' between controls in a conditional access policy 


**Type:** Changed feature    
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection

 
The ability to 'OR' (Require one of the selected controls) conditional access controls has been released. This  feature enables you to create policies with an **OR** between access controls. For example, you can use this feature to create a policy that requires a user to sign in using multi-factor authentication **OR** to be on a compliant device.

For more information, see [Controls in Azure Active Directory conditional access](active-directory-conditional-access-controls.md).

 
---

### Aggregation of realtime risk events


**Type:** Changed feature    
**Service Category:** Identity Protection  
**Product Capability:** Identity Security & Protection


To improve your administration experience, in Azure AD Identity Protection, all realtime risk events that were originated from the same IP address on a given day are now aggregated for each risk event type. This change limits the volume of risk events shown without any change in the user security.

The underlying realtime detection works each time the user logs in. If you have a sign-in risk security policy setup to MFA or block access, it is still triggered during each risky sign-in.

 
---
 




## October 2017


### Deprecating Azure AD reports


**Type:** Plan for change  
**Service Category:** Reporting  
**Product Capability:** Identity Lifecycle Management  



The Azure portal provides you with:

- A new Azure Active Directory administration console 
- New APIs for activity and security reports
 
Due to these new capabilities, the report APIs under the **/reports** endpoint will be retired on December 10, 2017. 

---

### Automatic sign-in field detection


**Type:** Fixed   
**Service Category:** My Apps  
**Product Capability:** SSO  



Azure Active Directory supports automatic sign-in field detection for applications that render an HTML username and password field.  These steps are documented in [How to automatically capture sign-in fields for an application](application-config-sso-problem-configure-password-sso-non-gallery.md#how-to-manually-capture-sign-in-fields-for-an-application). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](http://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, entering a web URL, and then saving the page.
 
Due to a service issue, this functionality was temporarily disabled for a period of time. The issue has been resolved and the automatic sign-in field detection is available again.

---

### New MFA features


**Type:** New feature  
**Service Category:** MFA  
**Product Capability:** Identity Security & Protection  



Multi-Factor authentication (MFA) is an essential part of protecting your organization. To make credentials more adaptive and the experience more seamless, the following features have been added: 

- Integration of multi-factor challenge results directly into the Azure AD sign-in report, including programmatic access to MFA results

- Deeper integration of the MFA configuration into the Azure AD configuration experience in the Azure portal

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience. Aggregating both features enables you to manage the MFA management portal functionality within the Azure AD experience.

For more information, see [Reference for multi-factor authentication reporting in the Azure portal](active-directory-reporting-activity-sign-ins-mfa.md) 


---

### Introducing terms of use



**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance  



Azure AD terms of use provide you with a simple method to present information to end users. This ensures that users see relevant disclaimers for legal or compliance requirements.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization. 

- Specific terms of use based on a user's attributes (ex. doctors vs nurses or domestic vs international employees, done by dynamic groups). 

- Specific terms of use for accessing high business impact apps, like Salesforce.

For more information, see [Azure Active Directory Terms of Use](active-directory-tou.md).


---

### Enhancements to privileged identity management


**Type:** New feature  
**Service Category:** PIM  
**Product Capability:** Privileged Identity Management  


With Azure Active Directory Privileged Identity Management (PIM), you can now manage, control, and monitor access to Azure Resources (Preview) within your organization to:

- Subscriptions
- Resource groups
- Virtual machines. 

All resources within the Azure portal that leverage the Azure Role Based Access Control (RBAC) functionality can take advantage of all the security and lifecycle management capabilities Azure AD PIM has to offer.

For more information, see [PIM for Azure resources](privileged-identity-management/azure-pim-resource-rbac.md).


---

### Introducing access reviews


**Type:** New feature  
**Service Category:** Access Reviews  
**Product Capability:** Governance  



Access reviews (preview) enable organizations to efficiently manage group memberships and access to enterprise applications: 

- You can recertify guest user access using access reviews of their access to applications and memberships of groups. The insights provided by the access reviews enable reviewers to efficiently decide whether guests should have continued access.

- You can recertify employees access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](active-directory-azure-ad-controls-access-reviews-overview.md).


---

### Hiding third-party applications from My Apps and the Office 365 launcher



**Type:** New feature  
**Service Category:** My Apps  
**Product Capability:** SSO  



You can now better manage apps that show up on your user portals through a new **hide app** property. Hiding apps helps with cases where app tiles are showing up for backend services or duplicate tiles and end up cluttering user's app launchers. The toggle is located on the properties section of the third-party app and is labeled **Visible to user?** You can also hide an app programmatically through PowerShell. 

For more information, see [Hide a third-party application from user's experience in Azure Active Directory](active-directory-coreapps-hide-third-party-app.md). 


**What's available?**

 As part of the transition to the new admin console, 2 new APIs for retrieving Azure AD Activity Logs are available. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk events API in Microsoft Graph.


## September 2017

### Hotfix for Microsoft Identity Manager


**Type:** Changed feature  
**Service Category:** Microsoft Identity Manager  
**Product Capability:** Identity Lifecycle Management  



A hotfix rollup package (build 4.4.1642.0) is available as of September 25, 2017, for Microsoft Identity Manager (MIM) 2016 2016 Service Pack 1 (SP1). This roll-up package:

- Resolves issues and adds improvements
- Is a cumulative update that replaces all MIM 2016 SP1 updates up to build 4.4.1459.0 for Microsoft Identity Manager 2016. 
- Requires you to have **Microsoft Identity Manager 2016 build 4.4.1302.0.** 

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Microsoft Identity Manager 2016 SP1](https://support.microsoft.com/help/4021562). 

---
