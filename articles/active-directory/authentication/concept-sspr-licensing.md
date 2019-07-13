---
title: License self-service password reset - Azure Active Directory
description: Azure AD self-service password reset licensing requirements

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/11/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Licensing requirements for Azure AD self-service password reset

Azure Active Directory (Azure AD) comes in four editions: Free, Basic, Premium P1, and Premium P2. There are several different features that make up self-service password reset, including change, reset, unlock, and writeback, that are available in the different editions of Azure AD. This article tries to explain the differences. More details of the features included in each Azure AD edition can be found on the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory/).

## Compare editions and features

Azure AD self-service password reset is licensed per user, to maintain compliance organizations are required to assign the appropriate license to their users.

* Self-Service Password Change for cloud users
   * I am a **cloud-only user** and know my password.
      * I would like to **change** my password to something new.
   * This functionality is included in all editions of Azure AD.

* Self-Service Password Reset for cloud users
   * I am a **cloud-only user** and have forgotten my password.
      * I would like to **reset** my password to something I know.
   * This functionality is included in Azure AD Basic, Premium P1 or P2, or Microsoft 365 Business.

* Self-Service Password Reset/Change/Unlock **with on-premises writeback**
   * I am a **hybrid user** my on-premises Active Directory user account is synchronized with my Azure AD account using Azure AD Connect. I would like to change my password, have forgotten my password, or been locked out.
      * I would like to change my password or reset it to something I know, or unlock my account, **and** have that change synchronized back to on-premises Active Directory.
   * This functionality is included in Azure AD Premium P1 or P2, or Microsoft 365 Business.

> [!WARNING]
> Standalone Office 365 licensing plans *don't support "Self-Service Password Reset/Change/Unlock with on-premises writeback"* and require a plan that includes Azure AD Premium P1, Premium P2, or Microsoft 365 Business for this functionality to work.
>

Additional licensing information, including costs, can be found on the following pages:

* [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/)
* [Azure Active Directory features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365 Enterprise](https://www.microsoft.com/microsoft-365/enterprise)
* [Microsoft 365 Business service description](https://docs.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-business-service-description)

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
