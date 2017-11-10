---
title: 'Licensing: Azure AD SSPR | Microsoft Docs'
description: Azure AD self-service password reset licensing requirements
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2017
ms.author: joflore
ms.custom: it-pro

---
# Licensing requirements for Azure AD self-service password reset

In order for Azure Active Directory (Azure AD) password reset to function, you *must have at least one license assigned in your organization*. We don't enforce per-user licensing on the password reset experience. To maintain compliance with your Microsoft licensing agreement, you need to assign licenses to any users that use premium features.

* **Cloud-only users**: Office 365 any paid SKU, or Azure AD Basic
* **Cloud** and/or **on-premises users**: Azure AD Premium P1 or P2, Enterprise Mobility + Security (EMS), or Secure Productive Enterprise (SPE)

## Licenses required for password writeback

To use password writeback, you must have one of the following licenses assigned on your tenant:

* Azure AD Premium P1
* Azure AD Premium P2
* Enterprise Mobility + Security E3
* Enterprise Mobility + Security E5
* Microsoft 365 (Plan E3)
* Microsoft 365 (Plan E5)

> [!WARNING]
> Standalone Office 365 licensing plans *don't support password writeback* and require that you have one of the preceding plans for this functionality to work.

Additional licensing information, including costs, can be found on the following pages:

* [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Azure Active Directory features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365](https://www.microsoft.com/microsoft-365/enterprise)

## Enable group or user-based licensing

Azure AD now supports group-based licensing. This allows administrators to assign licenses in bulk to a group of users, rather than assigning them one at a time. For more information, see [Assign, verify, and resolve problems with licenses](active-directory-licensing-group-assignment-azure-portal.md#step-1-assign-the-required-licenses).

Some Microsoft services are not available in all locations. Before a license can be assigned to a user, the administrator must specify the **Usage location** property on the user. Assignment of licenses can be done under the **User** > **Profile** > **Settings** section in the Azure portal. *When you use group license assignment, any users without a usage location specified inherit the location of the directory.*

## Next steps

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](active-directory-passwords-reset-register.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

