---

title: Azure AD self-service password reset overview | Microsoft Docs
description: What can Azure AD self-service password reset do for your organization? 
services: active-directory
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
# Azure AD self-service password reset for the IT professional

With Azure Active Directory (Azure AD) self-service password reset (SSPR), users can reset their passwords on their own when and where they need to. At the same time, administrators can control how a user's password gets reset. Users no longer need to call a help desk just to reset their password. Azure AD SSPR includes:

* **Self-service password change**: The user knows their password but wants to change it to something new.
* **Self-service password reset**: The user is unable to sign in and wants to reset their password by using one or more of the following validated authentication methods:
   * Send a text message to a validated mobile phone.
   * Make a phone call to a validated mobile or office phone.
   * Send an email to a validated secondary email account.
   * Answer their security questions.
* **Self-service account unlock**: The user is unable to sign in with their password and has been locked out. The user wants to unlock their account without administrator intervention by using their authentication methods.

## Why choose Azure AD SSPR

Azure AD SSPR helps you to:

* **Reduce costs** as help desk assisted password resets typically account for 20% of an IT organization’s support calls. 
* **Improve end-user experiences** and **reduce help desk volume** by giving end users the power to resolve their own password problems. There is no need to call a help desk or open a support request.
* **Drive mobility** as users can reset their passwords from wherever they are.
* **Maintain control** of the security policy. Administrators can continue to enforce the policies they have today.

If you're ready, you can get started with Azure AD SSPR by using our [quick start guidance](active-directory-passwords-getting-started.md). You can quickly give your users to ability to reset their own passwords.

## Azure AD SSPR availability

Azure AD SSPR is available in three tiers depending on your subscription:

* **Azure AD Free**: Cloud-only administrators can reset their own passwords.
* **Azure AD Basic** or any **paid Office 365 subscription**: Cloud-only users can reset their own passwords.
* **Azure AD Premium**: Any user or administrator, including cloud-only, federated, or password synchronized users, can reset their own passwords. On-premises passwords require password writeback to be enabled.

## Azure AD pricing, SLA, updates, and roadmap

More details about licensing, pricing, and future plans can be found on the following sites:

* [Azure AD pricing details](https://azure.microsoft.com/pricing/details/active-directory/)
* [Office 365 pricing](https://products.office.com/compare-all-microsoft-office-products?tab=2)
* [Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)
* [Service Level Agreement for Microsoft Online Services](http://go.microsoft.com/fwlink/?LinkID=272026&clcid=0x409)
* [Azure updates](https://azure.microsoft.com/updates/)
* [Azure roadmap](https://www.microsoft.com/cloud-platform/roadmap-recently-available)

## Next steps

* Are you ready to get started with SSPR? [Set up Azure AD self-service password reset](active-directory-passwords-getting-started.md).
* Plan a successful SSPR deployment to your users by using the guidance found in our [rollout guide](active-directory-passwords-best-practices.md).
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
