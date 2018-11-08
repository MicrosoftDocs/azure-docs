---
title: Disable email verification during consumer sign-up in Azure Active Directory B2C | Microsoft Docs
description: A topic demonstrating how to disable email verification during consumer sign-up in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 2/06/2017
ms.author: davidmu
ms.component: B2C
---

# Disable email verification during consumer sign-up in Azure Active Directory B2C 
When enabled, Azure Active Directory (Azure AD) B2C gives a consumer the ability to sign up for applications by providing an email address and creating a local account. Azure AD B2C ensures valid email addresses by requiring consumers to verify them during the sign-up process. It also prevents a malicious automated process from generating fake accounts for the applications.

Some application developers prefer to skip email verification during the sign-up process and instead have consumers verify the email address later. To support this, Azure AD B2C can be configured to disable email verification. Doing so creates a smoother sign-up process and gives developers the flexibility to differentiate the consumers that have verified their email address from those consumers that have not.

By default, sign-up policies have email verification turned on. Use the following steps to turn it off:

1. Click **Sign-up policies** or **Sign-up or sign-in policies** depending on what you configured for sign-up.
2. Click your policy (for example, "B2C_1_SiUp") to open it. 
3. Click **Edit** at the top of the blade.
4. Click **Page UI Customization**.
5. Click **Local account sign-up page**.
6. Click **Email Address** in the **Name** column under the **Sign-up attributes** section.
7. Toggle the **Require verification** option to **No**.
8. Click **OK** at the bottom until you reach the **Edit policy** blade.
9. Click **Save** at the top of the blade. You're done!

> [!NOTE]
> Disabling email verification in the sign-up process may lead to spam. If you disable the default one, we recommend adding your own verification system.
> 
>