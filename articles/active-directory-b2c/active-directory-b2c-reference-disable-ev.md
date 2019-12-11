---
title: Disable email verification during customer sign-up
titleSuffix: Azure AD B2C
description: Learn how to disable email verification during customer sign-up in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: marsma
ms.subservice: B2C
---

# Disable email verification during customer sign-up in Azure Active Directory B2C

By default, Azure Active Directory B2C (Azure AD B2C) verifies your customer's email address for local accounts (accounts for users who sign up with email address or username). Azure AD B2C ensures valid email addresses by requiring customers to verify them during the sign-up process. It also prevents a malicious actors from using automated processes to generate fraudulent accounts in your applications.

Some application developers prefer to skip email verification during the sign-up process and instead have customers verify their email address later. To support this, Azure AD B2C can be configured to disable email verification. Doing so creates a smoother sign-up process and gives developers the flexibility to differentiate customers that have verified their email address from customers that have not.

Follow these steps to disable email verification:

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Use the **Directory + subscription** filter in the top menu to select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to disable email verification. For example, *B2C_1_signinsignup*.
1. Select **Page layouts**.
1. Select **Local account sign-up page**.
1. Under **User attributes**, select **Email Address**.
1. In the **REQUIRES VERIFICATION** drop down, select **No**.
1. Select **Save**. Email verification is now disabled for this user flow.

> [!WARNING]
> Disabling email verification in the sign-up process may lead to spam. If you disable the default Azure AD B2C-provided email verification, we recommend that you implement a replacement verification system.
