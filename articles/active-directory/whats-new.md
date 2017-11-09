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

**Type:** Deprecated functionality  
**Service Category:** ACS  
**Product Capability:** Access Control Service 

<a name="acs-retirement"></a>

Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS) is being retired in late 2018.  Further information, including a detailed schedule & high level migration guidance, will provided in the next few weeks. In the meantime, please leave comments on this page with any questions regarding ACS, and a member of our team will reach out to help answer.

---


## October 2017

**Type:** Plan for change  
**Service Category:** Reporting  
**Product Capability:** Identity Lifecycle Management  


**Deprecating Azure AD reports (beta version) APIs  under the  `https://graph.windows.net/<tenant-name>/reports/` node**

The Azure portal provides you with:

- A new Azure Active Directory administration console 
- New APIs for activity and security reports
 
Due to these new capabilities, the report APIs under the **/reports** endpoint will be retired on December 10, 2017. 

---

**Type:** Fixed   
**Service Category:** My Apps  
**Product Capability:** SSO  


Azure Active Directory supports automatic sign-in field detection for applications that render an HTML username and password field.  These steps are documented in [How to automatically capture sign-in fields for an application](application-config-sso-problem-configure-password-sso-non-gallery.md#how-to-manually-capture-sign-in-fields-for-an-application). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](http://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, entering a web URL, and then saving the page.
 
Due to a service issue, this functionality was temporarily disabled for a period of time. The issue has been resolved and the automatic sign-in field detection is available again.

---

**Type:** New feature  
**Service Category:** MFA  
**Product Capability:** Identity Security & Protection  


In the world we live in, multi-Factor authentication (MFA) is an essential part of protecting your organization. The identity team at Microsoft is evolving multi-factor authentication to make credentials more adaptive and the experience more seamless. Today I’m happy to announce two important steps in this journey: 

- Integration of multi-factor challenge results directly into the Azure AD sign-in report, including programmatic access to MFA results

- Deeper integration of MFA configuration into the core Azure AD configuration experience in the Azure portal

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience, allowing you to manage the MFA Management portal functionality within the Azure AD experience.

For more information, see [Reference for multi-factor authentication reporting in the Azure portal](active-directory-reporting-activity-sign-ins-mfa.md) 


---
**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance  


**Azure AD terms of use** provides you with a simple method to present information to end users. This ensures that users see relevant disclaimers for legal or compliance requirements.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization. 

- Specific terms of use based on a user's attributes (ex. doctors vs nurses or domestic vs international employees, done by dynamic groups). 

- Specific terms of use for accessing high business impact apps, like Salesforce.

For more information, see [Azure Active Directory Terms of Use](active-directory-tou.md).


---
**Type:** New feature  
**Service Category:** PIM  
**Product Capability:** Privileged Identity Management  


With Azure Active Directory Privileged Identity Management (PIM), you can now manage, control, and monitor access to Azure Resources (Preview) within your organization. This includes subscriptions, resource groups, and even virtual machines. All resources within the Azure portal that leverage the Azure Role Based Access Control (RBAC) functionality can take advantage of all the great security and lifecycle management capabilities Azure AD PIM has to offer, and some great new features we plan to bring to Azure AD roles soon.

For more information, see [PIM for Azure resources](privileged-identity-management/azure-pim-resource-rbac.md).


---
**Type:** New feature  
**Service Category:** Access Reviews  
**Product Capability:** Governance  


Access reviews (preview) enable organizations to efficiently manage group memberships and access to enterprise applications: 

- You can recertify guest user access using access reviews of their access to applications and memberships of groups. The insights provided by the access reviews enable reviewers to efficiently decide whether guests should have continued access.

- You can recertify employees access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](active-directory-azure-ad-controls-access-reviews-overview.md).


---
**Type:** New feature  
**Service Category:** My Apps  
**Product Capability:** SSO  


**Ability to hide third party applications from My Apps and the Office 365 launcher**

You can now better manage apps that show up on your user portals through a new **hide app** property. This helps with cases where app tiles are showing up for backend services or duplicate tiles and end up cluttering user's app launchers. The toggle is located on the properties section of the third-party app and is labeled **Visible to user?**. You can also hide an app programmatically through PowerShell. 

For more information, see [Hide a third-party application from user's experience in Azure Active Directory](active-directory-coreapps-hide-third-party-app.md). 


**What's available?**

 As part of the transition to the new admin console, we have made 2 new APIs for retrieving Azure AD Activity Logs available. The new set of APIs provide richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk events API in Microsoft Graph.


## September 2017

**Type:** Changed feature  
**Service Category:** Microsoft Identity Manager  
**Product Capability:** Identity Lifecycle Management  


A hotfix rollup package (build 4.4.1642.0) is available as of September 25, 2017, for Microsoft Identity Manager (MIM) 2016 2016 Service Pack 1 (SP1). This roll-up package:

- Resolves issues and adds improvements
- Is a cumulative update that replaces all MIM 2016 SP1 updates up to build 4.4.1459.0 for Microsoft Identity Manager 2016. 
- Requires you to have **Microsoft Identity Manager 2016 build 4.4.1302.0.** 

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Microsoft Identity Manager 2016 SP1](https://support.microsoft.com/en-us/help/4021562). 

---
