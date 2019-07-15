---
title: Disable email verification during consumer sign-up in Azure Active Directory B2C | Microsoft Docs
description: A topic demonstrating how to disable email verification during consumer sign-up in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: marsma
ms.subservice: B2C
---

# Disable email verification during consumer sign-up in Azure Active Directory B2C 
When enabled, Azure Active Directory (Azure AD) B2C gives a consumer the ability to sign up for applications by providing an email address and creating a local account. Azure AD B2C ensures valid email addresses by requiring consumers to verify them during the sign-up process. It also prevents a malicious automated process from generating fake accounts for the applications.

Some application developers prefer to skip email verification during the sign-up process and instead have consumers verify the email address later. To support this, Azure AD B2C can be configured to disable email verification. Doing so creates a smoother sign-up process and gives developers the flexibility to differentiate the consumers that have verified their email address from those consumers that have not.

By default, sign-up user flows have email verification turned on. Use the following steps to turn it off:

1. Click **User flows**.
2. Click your user flow (for example, "B2C_1_SiUp") to open it. 
3. Click **Page layouts**.
4. Click **Local account sign-up page**.
5. Click **Email Address** in the **Name** column under the **User attributes** section.
6. Under **Requires verification**, select **No**.
7. Click **Save** at the top of the blade. You're done!

> [!NOTE]
> Disabling email verification in the sign-up process may lead to spam. If you disable the default one, we recommend adding your own verification system.
> 
>
