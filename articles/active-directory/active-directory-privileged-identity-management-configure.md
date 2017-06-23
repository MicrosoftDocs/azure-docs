---
title: Configure Azure AD Privileged Identity Management | Microsoft Docs
description: A topic that explains what Azure AD Privileged Identity Management is and how to use PIM to improve your cloud security.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: c548ed2e-06e3-4eaf-a63d-0f02ee72da25
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: billmath
ms.custom: pim ; H1Hack27Feb2017
---

# What is Azure AD Privileged Identity Management?
With Azure Active Directory (AD) Privileged Identity Management, you can manage, control, and monitor access within your organization. This includes access to resources in Azure AD and other Microsoft online services like Office 365 or Microsoft Intune.  

> [!NOTE]
> Privileged Identity Management is available only with the Premium P2 edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).

Organizations want to minimize the number of people who have access to secure information or resources, because that reduces the chance of a malicious user getting that access. However, users still need to carry out privileged operations in Azure, Office 365, or SaaS apps. Organizations give users privileged access in Azure AD without monitoring what those users are doing with their admin privileges. Azure AD Privileged Identity Management helps to resolve this risk.  

Azure AD Privileged Identity Management helps you:  

* See which users are Azure AD administrators
* Enable on-demand, "just in time" administrative access to Microsoft Online Services like Office 365 and Intune
* Get reports about administrator access history and changes in administrator assignments
* Get alerts about access to a privileged role

Azure AD Privileged Identity Management can manage the built-in Azure AD organizational roles, including (but not limited to):  

* Global Administrator
* Billing Administrator
* Service Administrator  
* User Administrator
* Password Administrator

## Just in time administrator access
Historically, you could assign a user to an admin role through the Azure classic portal or Windows PowerShell. As a result, that user becomes a **permanent admin**, always active in the assigned role. Azure AD Privileged Identity Management introduces the concept of an **eligible admin**. Eligible admins should be users that need privileged access now and then, but not every day. The role is inactive until the user needs access, then they complete an activation process and become an active admin for a predetermined amount of time.

## Enable Privileged Identity Management for your directory
You can start using Azure AD Privileged Identity Management in the [Azure portal](https://portal.azure.com/).

> [!NOTE]
> You must be a global administrator with an organizational account (for example, @yourdomain.com), not a Microsoft account (for example, @outlook.com), to enable Azure AD Privileged Identity Management for a directory.

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your directory.
2. If your organization has more than one directory, select your username in the upper right-hand corner of the Azure portal. Select the directory where you will use Azure AD Privileged Identity Management.
3. Select **More services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application opens.

If you're the first person to use Azure AD Privileged Identity Management in your directory, then the [security wizard](active-directory-privileged-identity-management-security-wizard.md) walks you through the initial assignment experience. After that you automatically become the first **Security administrator** and **Privileged role administrator** of the directory.

Only a privileged role administrator can manage access for other administrators. You can [give other users the ability to manage in PIM](active-directory-privileged-identity-management-how-to-give-access-to-pim.md).

## Privileged Identity Management dashboard
Azure AD Privileged Identity Manager provides a dashboard that gives you important information such as:

* Alerts that point out opportunities to improve security
* The number of users who are assigned to each privileged role  
* The number of eligible and permanent admins
* Ongoing access reviews

![PIM dashboard - screenshot][2]

## Privileged role management
With Azure AD Privileged Identity Management, you can manage the administrators by adding or removing permanent or eligible administrators to each role.

![PIM add/remove administrators - screenshot][3]

## Configure the role activation settings
Using the [role settings](active-directory-privileged-identity-management-how-to-change-default-settings.md) you can configure the eligible role activation properties including:

* The duration of the role activation period
* The role activation notification
* The information a user needs to provide during the role activation process  

![PIM settings - administrator activation - screenshot][4]

Note that in the image, the buttons for **Multi-Factor Authentication** are disabled. For certain, highly privileged roles, we require MFA for heightened protection.

## Role activation
To [activate a role](active-directory-privileged-identity-management-how-to-activate-role.md), an eligible admin requests a time-bound "activation" for the role. The activation can be requested using the **Activate my role** option in Azure AD Privileged Identity Management.

An admin who wants to activate a role needs to initialize Azure AD Privileged Identity Management in the Azure portal.

Role activation is customizable. In the PIM settings, you can determine the length of the activation and what information the admin needs to provide to activate the role.

![PIM administrator request role activation - screenshot][5]

## Review role activity
There are two ways to track how your employees and admins are using privileged roles. The first option is using [audit history](active-directory-privileged-identity-management-how-to-use-audit-log.md). The audit history logs track changes in privileged role assignments and role activation history.

![PIM activation history - screenshot][6]

The second option is to set up regular [access reviews](active-directory-privileged-identity-management-how-to-start-security-review.md). These access reviews can be performed by and assigned reviewer (like a team manager) or the employees can review themselves. This is the best way to monitor who still requires access, and who no longer does.

## Azure AD PIM at subscription expiration
Prior to reaching general availability Azure AD PIM was in preview and there were no license checks for a tenant to preview Azure AD PIM.  Now that Azure AD PIM has reached general availability, a trial or paid subscription must be present in the tenant to continue using PIM after December 2016.  If your organization does not purchase Azure AD Premium P2 or your subscription expires, then Azure AD PIM will no longer be available in your tenant.  You can read more in the [Azure AD PIM subscription requirements](./privileged-identity-management/subscription-requirements.md)

## Next steps
[!INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png
[2]: ./media/active-directory-privileged-identity-management-configure/PIM_Dash.png
[3]: ./media/active-directory-privileged-identity-management-configure/PIM_AddRemove.png
[4]: ./media/active-directory-privileged-identity-management-configure/PIM_RoleActivationSettings.png
[5]: ./media/active-directory-privileged-identity-management-configure/PIM_RequestActivation.png
[6]: ./media/active-directory-privileged-identity-management-configure/PIM_ActivationHistory.png
