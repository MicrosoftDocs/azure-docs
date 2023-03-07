---
title: Add multi-factor authentication (MFA) to a customer app
description: Learn how to add multi-factor authentication (MFA) to your customer-facing (CIAM) application. For example, add email one-time passcode as a second authentication factor to your CIAM sign-up and sign-in user flows.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/06/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to add multi-factor authentication to my customer-facing app.
---

# Add multi-factor authentication (MFA) to a customer-facing app

[Azure AD Multi-Factor Authentication](../active-directory/authentication/concept-mfa-howitworks.md) (MFA) adds a layer of security to sign-up and sign-in experiences for your customer-facing applications. With MFA, customers need more than just a user name and password to access your resources. As a customer completes your app sign-in experience, they'll be prompted for a one-time passcode, which is sent to them via email. During the entire process, the customer is presented with sign-in pages that reflect any company branding you've configured.

This article describes how to enforce MFA by creating an Azure AD Conditional Access policy and adding MFA to your sign-up and sign-in user flow.

## Prerequisites

Register your app.
Create a sign-up and sign-in user flow and associate it with your app.

## Set multifactor authentication

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Make sure you're using the directory that contains your Azure AD customer tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD customer tenant in the **Directory name** list, and then select **Switch**.
1. In the left menu, select **Azure Active Directory**
2. Select **External Identities**.
3. Select **User flows**.
4. Select the user flow for which you want to enable MFA.
5. Select **Properties**.
6. In the **Multifactor authentication** section, select the desired **Type of method**. Then under **MFA enforcement** select an option:

   - **Off** - MFA is never enforced during sign-in, and users are not prompted to enroll in MFA during sign-up or sign-in.
   - **Always on** - MFA is always required, regardless of your Conditional Access setup. During sign-up, users are prompted to enroll in MFA. During sign-in, if users aren't already enrolled in MFA, they're prompted to enroll.
   - **Conditional** - During sign-up and sign-in, users are prompted to enroll in MFA (both new users and existing users who aren't enrolled in MFA). During sign-in, MFA is enforced only when an active Conditional Access policy evaluation requires it:

        - If the result is an MFA challenge with no risk, MFA is enforced. If the user isn't already enrolled in MFA, they're prompted to enroll.
        - If the result is an MFA challenge due to risk *and* the user is not enrolled in MFA, sign-in is blocked.

   > [!NOTE]
   > If you select **Conditional**, you'll also need to [add Conditional Access to user flows](conditional-access-user-flow.md) and specify the apps you want the policy to apply to.

1. Select **Save**. MFA is now enabled for this user flow.
