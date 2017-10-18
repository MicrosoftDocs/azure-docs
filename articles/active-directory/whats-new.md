---
title: What's new in Azure Active Directory | Microsoft Docs
description: What's new in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/17/2017
ms.author: markvi
ms.reviewer: dhanyahk

---
# What's new in Azure Active Directory

## September 2017

**Type:** Changed feature  
**Service Category:** Microsoft Identity Manager  
**Product Capability:** Identity Lifecycle Management  


A hotfix rollup package (build 4.4.1642.0) is available as of September 25, 2017, for Microsoft Identity Manager (MIM) 2016 2016 Service Pack 1 (SP1). This roll-up package resolves issues and adds improvements.  This is a cumulative update that replaces all MIM 2016 SP1 updates up to build 4.4.1459.0 for Microsoft Identity Manager 2016. To apply this update, you must have Microsoft Identity Manager 2016 build 4.4.1302.0.  Read more at 

https://support.microsoft.com/en-us/help/4021562 

---

## October 2017

**Type:** Fixed (bug fixes)  
**Service Category:** My Apps  
**Product Capability:** SSO  


Azure Active Directory supports automatic sign-in field detection for any application which renders an HTML username and password field.  These steps are documented at How to automatically capture sign-in fields for an application. This capability can be found by adding a “Non-Gallery” application from “Enterprise Applications” at http://aad.portal.azure.com, subsequently configuring the “Single Sign-on” mode on this new application to “Password-based Single Sign-on”, entering a web URL, and then saving the page.
 
Due to a service issue, this functionality was temporarily disabled for a period of time. The issue has been resolved and the automatic sign-in field detection is available again.



---
**Type:** New feature  
**Service Category:** Terms of Use  
**Product Capability:** Governance  


Azure AD Terms of Use provides a simple method organizations can use to present information to end users. This ensures users see relevant disclaimers for legal or compliance requirements.

 

Azure AD Terms of Use can be used in the following scenarios:+

General terms of use for all users in your organization. 
Specific terms of use based on a user's attributes (ex. doctors vs nurses or domestic vs international employees, done by dynamic groups). 
Specific terms of use for accessing high business impact apps, like Salesforce.
Read more at https://docs.microsoft.com/en-us/azure/active-directory/active-directory-tou


---
**Type:** New feature  
**Service Category:** PIM  
**Product Capability:** Privileged Identity Management  


With Azure Active Directory Privileged Identity Management (PIM), you can now manage, control, and monitor access to Azure Resources (Preview) within your organization. This includes Subscriptions, Resource Groups, and even Virtual Machines. Any resource within the Azure portal that leverages the Azure Role Based Access Control (RBAC) functionality can take advantage of all the great security and lifecycle management capabilities Azure AD PIM has to offer, and some great new features we plan to bring to Azure AD roles soon.

 

Read more at https://docs.microsoft.com/en-us/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac


---
**Type:** New feature  
**Service Category:** Access Reviews  
**Product Capability:** Governance  


What's new in Azure AD?

 

 

Access reviews (preview) enable organizations to efficiently manage group memberships and access to enterprise applications. 

You can recertify guest user access, using access reviews of their access to applications and memberships of groups, with insights that enable reviewers to efficiently decide whether guests should have continued access.

You can recertify employees access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

Learn more at https://docs.microsoft.com/en-us/azure/active-directory/active-directory-azure-ad-controls-access-reviews-overview


---
**Type:** New feature  
**Service Category:** My Apps  
**Product Capability:** SSO  


Ability to hide third party applications from My Apps and the Office 365 launcher


Customers can now better manage apps that show up on their user portals through a new hide app property. This helps with cases where app tiles are showing up for backend services or duplicate tiles and end up cluttering user's app launchers. The toggle is located on the properties section of the third-party app and is labeled "Visible to user?". The app can also be hidden programmatically through PowerShell. Learn more at:
https://docs.microsoft.com/en-us/azure/active-directory/active-directory-coreapps-hide-third-party-app 



 



---
**Type:** Plan for change  
**Service Category:** Reporting  
**Product Capability:** Identity Lifecycle Management  


Description: Deprecating Azure AD reports (beta version) APIs  under “https://graph.windows.net/<tenant-name>/reports/” node


With the general availability of the new Azure Active Directory Administration console and new APIs now available for both activity and security reports, the report APIs under "/reports" endpoint will be retired on December 10th , 2017. 



What's available?

 As part of the transition to the new admin console, we have made available 2 new APIs for retrieving Azure AD Activity Logs. The new set of APIs provide richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk events API in Microsoft Graph.


---
