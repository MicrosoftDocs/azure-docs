---
title: What’s new? Release notes for Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory (Azure AD) including latest release notes, known issues, bug fixes, deprecated functionality and upcoming changes.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''
featureFlags:
 - clicktale

ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/06/2017
ms.author: markvi
ms.reviewer: dhanyahk

---
# What's new in Azure Active Directory?




> Stay up-to-date with what's new in Azure Active Directory by subscribing to this [feed](https://docs.microsoft.com/api/search/rss?search=%22what%27s%20new%20in%20azure%20active%20directory%3F%22&locale=en-us) in your favorite RSS feed reader.



We are improving Azure Active Directory on an ongoing basis. To enable you to stay up to date with the most recent developments, this topic provides you with information about:

-	The latest releases 
-	Known issues 
-	Bug fixes 
-	Deprecated functionality 
-	Plans for changes 

Please revisit this page regularly as we are updating it on a monthly basis.

## November 2017
 



**Type:** Plan for change  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection


**Restrict browser access to the Intune managed browser** 


With this behavior, you will be able to restrict browser access to Office 365 and other Azure AD-connected cloud apps using the Intune Managed Browser as an approved app. 

This change allows you to configure the following condition for application-based conditional access:

**Client apps:**  Browser

**What is the effect of the change?**

Today, access is blocked when using this condition. When the preview of this behavior is available, all access will require the use of the managed browser application. 

Look for this capability and more in the upcoming blogs and release notes. 

For more information, see [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md).

 
---


 
**Type:** Plan for change  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection


**New approved client apps for Azure AD app-based conditional access**


The following apps are planned to be added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- [Microsoft Kaizala](https://www.microsoft.com/garage/profiles/kaizala/)

- [Microsoft StaffHub](https://staffhub.office.com/what-it-is)


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)

- [Azure Active Directory app-based conditional access](active-directory-conditional-access-mam.md)


---


**Type:** New feature    
**Service Category:** Terms of Use  
**Product Capability:** Governance/Compliance



**Terms of use support for multiple languages**


Administrators can now create new terms of use (TOU) that contains multiple PDF documents. You can tag these PDF documents with a corresponding language. Users that fall in scope are shown the PDF with the matching language based on their preferences. If there is no match, the default language is shown.


---
 


**Type:** New feature  
**Service Category:** SSPR  
**Product Capability:** User Authentication


**Realtime password writeback client status**
 

You can now review the status of your on-premises password writeback client. This option is available in the **On-premises integration** section of the **[Password reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset)** page. 

If there are issues with your connection to your on-premises writeback client, you will see an error message that provides you with:

- Information on why you can't connect to your on-premises writeback client 
- A link to documentation that assists you in resolving the issue. 


For more information, see [On-premises integration](active-directory-passwords-how-it-works.md#on-premises-integration).

 
---
 
**Type:** New feature  
**Service Category:** Azure AD  
**Product Capability:** Identity Security & Protection



**Azure AD app-based conditional access** 


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



**Type:** New feature  
**Service Category:** Device Registration and Management  
**Product Capability:** Identity Security & Protection

 

**Managing Azure AD devices in the Azure portal**


You can now find all your devices connected to Azure AD and the device-related activities in one place. There is a new administration experience to manage all your device identities and settings in the Azure portal. In this release you can:

- View all your devices that are available for conditional access in Azure AD

- View properties, including your Hybrid Azure AD joined devices

- Find BitLocker keys for your Azure AD-joined devices, manage your device with Intune and more.

- Manage Azure AD device-related settings


For more information, see [Managing devices using the Azure portal](device-management-azure-portal.md).



 
---


**Type:** New feature    
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection 



**Support for macOS as device platform for Azure AD conditional access** 
 

You can now include (or exclude) macOS as device platform condition in your Azure AD conditional access policy. 
With the addition of macOS to the supported device platforms, you can:

- **Enroll and manage macOS devices using Intune** - Similar to other platforms like iOS and Android, a company portal application is available for macOS to do unified enrollments. The new company portal app for macOS enables you to enroll a device with Intune and register it with Azure AD.
 
- **Ensure macOS devices adhere to your organization’s compliance policies defined in Intune** - In the Intune on Azure portal, you can now set up compliance policies for macOS devices. 
  
- **Restrict access to applications in Azure AD to only compliant macOS devices** - Conditional access policy authoring has macOS as a separate device platform option. This option enables you to author macOS specific conditional access policies for the targeted application set in Azure.

For more information, see:

- [Create a device compliance policy for macOS devices with Intune](https://aka.ms/macoscompliancepolicy)
- [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)


 
---


**Type:** New feature    
**Service Category:** MFA  
**Product Capability:** User Authentication


**NPS Extension for Azure MFA** 


The Network Policy Server (NPS) extension for Azure MFA adds cloud-based MFA capabilities to your authentication infrastructure using your existing servers. With the NPS extension, you can add phone call, text message, or phone app verification to your existing authentication flow without having to install, configure, and maintain new servers. 

This extension was created for organizations that want to protect VPN connections without deploying the Azure MFA Server. The NPS extension acts as an adapter between RADIUS and cloud-based Azure MFA to provide a second factor of authentication for federated or synced users.


For more information, see [Integrate your existing NPS infrastructure with Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication-nps-extension.md)

 
---


**Type:** New feature    
**Service Category:** User Management  
**Product Capability:** Directory 


**Restore or permanently remove deleted users**


In the Azure AD admin center, you can now:

- Restore a deleted user 
- Permanently delete a user 


**To try it out:**

1. In the Azure AD admin center, select [**All users**](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/All users) in the **Manage** section. 

2. From the **Show** list, select **Recently deleted users**. 

4. Select one or more recently deleted users, and then either restore them, or permanently delete them.

 
---



 
**Type:** Changed feature  
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection

**New approved client apps for Azure AD app-based conditional access**


The following apps have been added to the list of [approved client apps](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement):

- Microsoft Planner

- Microsoft Azure Information Protection 


For more information, see:

- [Approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement)

- [Azure Active Directory app-based conditional access](active-directory-conditional-access-mam.md)


---



**Type:** Changed feature    
**Service Category:** Conditional Access  
**Product Capability:** Identity Security & Protection


**Ability to 'OR' between controls in a conditional access policy** 
 
The ability to 'OR' (Require one of the selected controls) conditional access controls has been released. This  feature enables you to create policies with an **OR** between access controls. For example, you can use this feature to create a policy that requires a user to sign in using multi-factor authentication **OR** to be on a compliant device.

For more information, see [Controls in Azure Active Directory conditional access](active-directory-conditional-access-controls.md).

 
---



**Type:** Changed feature    
**Service Category:** Identity Protection  
**Product Capability:** Identity Security & Protection

**Aggregation of realtime risk events**

To improve your administration experience, in Azure AD Identity Protection, all realtime risk events that were originated from the same IP address on a given day are now aggregated for each risk event type. This change limits the volume of risk events shown without any change in the user security.

The underlying realtime detection works each time the user logs in. If you have a sign-in risk security policy setup to MFA or block access, it is still triggered during each risky sign-in.

 
---
 

**Type:** Deprecated functionality  
**Service Category:** ACS  
**Product Capability:** Access Control Service 

**Retiring ACS**

Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS) will be retired in late 2018.  Further information, including a detailed schedule & high-level migration guidance, will be provided in the next few weeks. In the meantime, leave comments on this page with any questions regarding ACS, and a member of our team will help to answer.

---


## October 2017

**Type:** Plan for change  
**Service Category:** Reporting  
**Product Capability:** Identity Lifecycle Management  


**Deprecating Azure AD reports**

The Azure portal provides you with:

- A new Azure Active Directory administration console 
- New APIs for activity and security reports
 
Due to these new capabilities, the report APIs under the **/reports** endpoint will be retired on December 10, 2017. 

---

**Type:** Fixed   
**Service Category:** My Apps  
**Product Capability:** SSO  


**Automatic sign-in field detection**


Azure Active Directory supports automatic sign-in field detection for applications that render an HTML username and password field.  These steps are documented in [How to automatically capture sign-in fields for an application](application-config-sso-problem-configure-password-sso-non-gallery.md#how-to-manually-capture-sign-in-fields-for-an-application). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](http://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, entering a web URL, and then saving the page.
 
Due to a service issue, this functionality was temporarily disabled for a period of time. The issue has been resolved and the automatic sign-in field detection is available again.

---

**Type:** New feature  
**Service Category:** MFA  
**Product Capability:** Identity Security & Protection  


**New MFA features**

Multi-Factor authentication (MFA) is an essential part of protecting your organization. To make credentials more adaptive and the experience more seamless, the following features have been added: 

- Integration of multi-factor challenge results directly into the Azure AD sign-in report, including programmatic access to MFA results

- Deeper integration of the MFA configuration into the Azure AD configuration experience in the Azure portal

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience. Aggregating both features enables you to manage the MFA management portal functionality within the Azure AD experience.

For more information, see [Reference for multi-factor authentication reporting in the Azure portal](active-directory-reporting-activity-sign-ins-mfa.md) 


---
**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance  


**Introducing terms of use**

Azure AD terms of use provide you with a simple method to present information to end users. This ensures that users see relevant disclaimers for legal or compliance requirements.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization. 

- Specific terms of use based on a user's attributes (ex. doctors vs nurses or domestic vs international employees, done by dynamic groups). 

- Specific terms of use for accessing high business impact apps, like Salesforce.

For more information, see [Azure Active Directory Terms of Use](active-directory-tou.md).


---
**Type:** New feature  
**Service Category:** PIM  
**Product Capability:** Privileged Identity Management  

**Enhancements to privileged identity management**

With Azure Active Directory Privileged Identity Management (PIM), you can now manage, control, and monitor access to Azure Resources (Preview) within your organization to:

- Subscriptions
- Resource groups
- Virtual machines. 

All resources within the Azure portal that leverage the Azure Role Based Access Control (RBAC) functionality can take advantage of all the security and lifecycle management capabilities Azure AD PIM has to offer.

For more information, see [PIM for Azure resources](privileged-identity-management/azure-pim-resource-rbac.md).


---
**Type:** New feature  
**Service Category:** Access Reviews  
**Product Capability:** Governance  

**Introducing access reviews**


Access reviews (preview) enable organizations to efficiently manage group memberships and access to enterprise applications: 

- You can recertify guest user access using access reviews of their access to applications and memberships of groups. The insights provided by the access reviews enable reviewers to efficiently decide whether guests should have continued access.

- You can recertify employees access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](active-directory-azure-ad-controls-access-reviews-overview.md).


---
**Type:** New feature  
**Service Category:** My Apps  
**Product Capability:** SSO  


**Hiding third-party applications from My Apps and the Office 365 launcher**

You can now better manage apps that show up on your user portals through a new **hide app** property. Hiding apps helps with cases where app tiles are showing up for backend services or duplicate tiles and end up cluttering user's app launchers. The toggle is located on the properties section of the third-party app and is labeled **Visible to user?** You can also hide an app programmatically through PowerShell. 

For more information, see [Hide a third-party application from user's experience in Azure Active Directory](active-directory-coreapps-hide-third-party-app.md). 


**What's available?**

 As part of the transition to the new admin console, 2 new APIs for retrieving Azure AD Activity Logs are available. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk events API in Microsoft Graph.


## September 2017

**Type:** Changed feature  
**Service Category:** Microsoft Identity Manager  
**Product Capability:** Identity Lifecycle Management  


**Hotfix for Microsoft Identity Manager**

A hotfix rollup package (build 4.4.1642.0) is available as of September 25, 2017, for Microsoft Identity Manager (MIM) 2016 2016 Service Pack 1 (SP1). This roll-up package:

- Resolves issues and adds improvements
- Is a cumulative update that replaces all MIM 2016 SP1 updates up to build 4.4.1459.0 for Microsoft Identity Manager 2016. 
- Requires you to have **Microsoft Identity Manager 2016 build 4.4.1302.0.** 

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Microsoft Identity Manager 2016 SP1](https://support.microsoft.com/en-us/help/4021562). 
---
