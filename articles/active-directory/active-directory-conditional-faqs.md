---
title: Azure Active Directory Conditional Access FAQ | Microsoft Docs
description: 'Frequently asked questions about conditional access '
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 14f7fc83-f4bb-41bf-b6f1-a9bb97717c34
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2017
ms.author: markvi

---
# Azure Active Directory Conditional Access FAQ

## Which applications work with conditional access policies?

**A:** Please see [Applications and browsers that use conditional access rules in Azure Active Directory](active-directory-conditional-access-supported-apps.md).

---

## Are conditional access policies enforced for B2B collaboration and guest users?
**A:** Policies are enforced for B2B collaboration users. However, in some cases, a user might not be able to satisfy the policy requirement if, for example, an organization does not support multi-factor authentication. 
The policy is currently not enforced for SharePoint guest users. The guest relationship is maintained within SharePoint. Guest users accounts are not subject to access polices at the authentication server. Guest access can be managed at SharePoint.

---

## Does a SharePoint Online policy also apply to OneDrive for Business?
**A:** Yes.

---

## Why can’t I set a policy on client apps, like Word or Outlook?
**A:** A conditional access policy sets requirements for accessing a service and is enforced when authentication happens to that service. The policy is not set directly on a client application; instead, it is applied when it calls into a service. For example, a policy set on SharePoint applies to clients calling SharePoint and a policy set on Exchange applies to Outlook.

--- 

## Does a conditional access policy apply to service accounts?
**A:** Conditional access policies apply to all user accounts. This includes user accounts used as service accounts. In many cases, a service account that runs unattended is not able to satisfy a policy. This is, for example the case, when MFA is required. In these cases, services accounts can be excluded from a policy, using conditional access policy management settings. Learn more about applying a policy to users here.

---

## Are Graph APIs available to configure configure conditional access policies?
**A:** not yet. 

---

## Q: What is the default exclusion policy for unsupported device platforms?

**A:** At the present time, conditional access policies are selectively enforced on users on iOS and Android devices. Applications on other device platforms are, by default, unaffected by the conditional access policy for iOS and Android devices. Tenant admin may, however, choose to override the global policy to disallow access to users on unsupported platforms.

---

## Q: How do conditional access policies work for Microsoft Teams?  

**A:** Microsoft Teams relies heavily on Exchange Online and SharePoint Online for core productivity scenarios such as meetings, calendars, and files. Conditional access policies set up for these cloud apps apply to Teams during the sign-in experience.

Microsoft Teams is also supported separately as a Cloud App in Azure AD Conditional Access policies and CA policy set up for this cloud app will apply to Teams during the sign-in experience. 
Microsoft Teams desktop clients for Windows and Mac support modern authentication, which brings sign-on based on the Azure Active Directory Authentication Library (ADAL) to Microsoft Office client applications across platforms. 

--- 