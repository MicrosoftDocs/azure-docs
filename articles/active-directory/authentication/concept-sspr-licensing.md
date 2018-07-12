---
title: License self-service password reset - Azure Active Directory
description: Azure AD self-service password reset licensing requirements

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: article
ms.date: 01/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

---
# Licensing requirements for Azure AD self-service password reset

In order for Azure Active Directory (Azure AD) password reset to function, you *must have at least one license assigned in your organization* for that user. A proper license is required if a user benefits directly or indirectly from any feature covered by that license.

* **Cloud-only users**: Office 365 any paid SKU, or Azure AD Basic
* **Cloud** or **on-premises users**: Azure AD Premium P1 or P2, Enterprise Mobility + Security (EMS), or Microsoft 365

## Licensing requirements for password writeback

**Self-Service Password Reset/Change/Unlock with on-premises writeback is a premium feature of Azure AD**. For more information about licensing, see the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

To use password writeback, you must have one of the following licenses assigned on your tenant:

* Azure AD Premium P1
* Azure AD Premium P2
* Enterprise Mobility + Security E3 or A3
* Enterprise Mobility + Security E5 or A5
* Microsoft 365 E3 or A3
* Microsoft 365 E5 or A5
* Microsoft 365 F1

> [!WARNING]
> Standalone Office 365 licensing plans *don't support password writeback* and require that you have one of the preceding plans for this functionality to work.
>

Additional licensing information, including costs, can be found on the following pages:

* [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Azure Active Directory features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365 Enterprise](https://www.microsoft.com/microsoft-365/enterprise)

## Enable group or user-based licensing

Azure AD now supports group-based licensing. Administrators can assign licenses in bulk to a group of users, rather than assigning them one at a time. For more information, see [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses).

Some Microsoft services are not available in all locations. Before a license can be assigned to a user, the administrator must specify the **Usage location** property on the user. Assignment of licenses can be done under the **User** > **Profile** > **Settings** section in the Azure portal. *When you use group license assignment, any users without a usage location specified inherit the location of the directory.*

## Next steps

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)
