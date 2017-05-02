---
title: 'Licensing: Azure AD SSPR | Microsoft Docs'
description: Azure AD self-service password reset licensing requirements
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore

---
# Licensing requirements for Azure AD self-service password reset

In order for Azure AD Password Reset to function, you **must have at least one license assigned in your organization**. We do not enforce per-user licensing on the password reset experience. To maintain compliance with your Microsoft licensing agreement, you need to assign licenses to any users that use premium features.

* **Cloud only users** - Office 365 (O365) any paid SKU, or Azure AD Basic
* **Cloud** and/or **on-premises users** - Azure AD Premium P1 or P2, Enterprise Mobility + Security (EMS), or Secure Productive Enterprise (SPE)

## Licenses required for password writeback

To use password writeback, you must have one of the following licenses assigned in your tenant.

* Azure AD Premium P1
* Azure AD Premium P2
* Enterprise Mobility + Security E3
* Enterprise Mobility + Security E5
* Secure Productive Enterprise E3
* Secure Productive Enterprise E5

> [!NOTE]
> Standalone Office 365 licensing plans **do not support password writeback** and require one of the preceding plans for this functionality to work.

Additional licensing info including costs can be found on the following pages

* [Azure Active Directory Pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Secure Productive Enterprise](https://www.microsoft.com/secure-productive-enterprise/default.aspx)

## Enable group or user-based licensing

Azure AD now supports group-based licensing allowing administrators to assign licenses in bulk to a group of users, rather than assigning them one at a time. [Assign, verify, and resolve problems with licenses](active-directory-licensing-group-assignment-azure-portal.md#step-1-assign-the-required-licenses)

Some Microsoft services are not available in all locations. Before a license can be assigned to a user, the administrator must specify the “Usage location” property on the user. Assignment of licenses can be done under User > Profile > Settings section in the Azure portal. **When using group license assignment, any users without a usage location specified inherit the location of the directory.**

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR

