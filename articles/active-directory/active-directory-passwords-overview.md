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

Azure Active Directory (Azure AD) self-service password reset (SSPR) allows users to reset their passwords on their own when and where they need to, while allowing administrators control of how their password gets reset. Users no longer need to call the help desk just to reset their password.

* **Self-service password change** – User knows their password but wants to change it to something new.
* **Self-service password reset** – User is unable to sign in, and wants to reset their password using one or more of the following validated authentication methods.
   * Text message to a validated mobile phone
   * Phone call to a validated mobile or office phone
   * Email to a validated secondary email account
   * Answers to their security questions
* **Self-service account unlock** – User is unable to sign in with their password has been locked out and would like to unlock their account without administrator intervention using their authentication methods.

## Why choose Azure AD self-service password reset

* **Reduce costs** as helpdesk assisted password resets typically account for 20% of an IT organization’s support calls. 
* **Improve end-user experiences** and **reduce helpdesk volume** by giving end users the power to resolve their own password issues at once without calling a helpdesk or opening a support request.
* **Drive mobility** as users can reset their passwords from wherever they are.
* **Maintain control** of security policy. Administrators can continue to enforce the policies they have today.

If you are ready, you can get started with Azure AD SSPR using our [quick start guidance](active-directory-passwords-getting-started.md) and quickly have your users resetting their own passwords.

## Azure AD self-service password reset availability

Azure AD self-service password reset is available in three tiers depending on your subscription.

* **Azure AD Free** – Cloud-only administrators can reset their own passwords.
* **Azure AD Basic** or any **Paid Office 365 Subscription** – Cloud-only users can reset their own passwords.
* **Azure AD Premium** – Any user or administrator, including cloud-only, federated, or password synchronized users, can reset their own passwords. On-premises passwords require password writeback to be enabled.

## Azure AD pricing, SLA, updates, and roadmap

More detail about licensing, pricing, and future plans can be found in the sites that follow.

* [**Azure AD Pricing Details**](https://azure.microsoft.com/pricing/details/active-directory/)
* [**Office 365 Pricing**](https://products.office.com/compare-all-microsoft-office-products?tab=2)
* [**Azure Service Level Agreements**](https://azure.microsoft.com/support/legal/sla/)
* [**Service Level Agreement for Microsoft Online Services**](http://go.microsoft.com/fwlink/?LinkID=272026&clcid=0x409)
* [**Azure Updates**](https://azure.microsoft.com/updates/)
* [**Azure Roadmap**](https://www.microsoft.com/cloud-platform/roadmap-recently-available)

## Next steps

* Are you ready to get started with SSPR? [Setup Azure AD self service password reset](active-directory-passwords-getting-started.md).
* Plan a successful SSPR deployment to your users using the guidance found in our [**rollout guide**](active-directory-passwords-best-practices.md).
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).