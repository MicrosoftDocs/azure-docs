---
title: Add multifactor authentication (MFA) to a customer app
description: Learn how to add multifactor authentication (MFA) to your customer-facing (CIAM) application. For example, add email one-time passcode as a second authentication factor to your CIAM sign-up and sign-in user flows.
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

#Customer intent: As a dev, devops, or it admin, I want to add multifactor authentication to my customer-facing app.
---

# Add multifactor authentication (MFA) to a customer-facing app

[Multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md) (MFA) adds a layer of security to sign-up and sign-in experiences for your customer-facing applications. With MFA, customers need more than just a user name and password to access your resources. As a customer completes your app sign-in experience, they're prompted for a one-time passcode, which is sent to them via email. During the entire process, the customer is presented with sign-in pages that reflect any company branding you've configured.

This article describes how to enforce MFA by creating an Azure AD Conditional Access policy and adding MFA to your sign-up and sign-in user flow.

## Prerequisites

- Create your Azure AD customer tenant. (If you don't have a tenant, you can start a free trial.)
- Register the app in your customer tenant.
- Create a sign-up and sign-in user flow and associate it with your app.
- You need an account with Conditional Access Administrator, Security Administrator, or Global Administrator privileges to configure Conditional Access policies and MFA.

## Create a Conditional Access policy

First, create a Conditional Access policy in your customer tenant that prompts users for MFA when they sign up or sign in to your app. (For more information, see [Common Conditional Access policy: Require MFA for all users](/conditional-access/howto-conditional-access-policy-all-users-mfa)).

1. Sign in to the [Azure portal](https://portal.azure.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Make sure you're using the directory that contains your Azure AD customer tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD customer tenant in the **Directory name** list, and then select **Switch**.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
   1. Under **Exclude**, select any applications that don't require multifactor authentication.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After you confirm your settings using [report-only mode](howto-conditional-access-insights-reporting.md), you can move the **Enable policy** toggle from **Report-only** to **On**.

## Enable email one-time passcode

Enable the email one-time passcode authentication method in your customer tenant for all users.

1. Sign in to the [Azure portal](https://portal.azure.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Make sure you're using the directory that contains your Azure AD customer tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD customer tenant in the **Directory name** list, and then select **Switch**.
1. Browse to **Azure Active Directory** > **Security** > **Authentication Methods** > **Email OTP**.
1. Under **Enable and Target**, turn on the **Enable** toggle.
1. Under **Include**, next to **Target**, select **All users**.

## Enforce multifactor authentication in your user flow

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Make sure you're using the directory that contains your Azure AD customer tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD customer tenant in the **Directory name** list, and then select **Switch**.
1. In the left menu, select **Azure Active Directory**
2. Select **External Identities**.
3. Select **User flows**.
4. Select the user flow for which you want to enable MFA.
5. Select **Properties**.
6. In the **Multifactor authentication** section, select the desired **Type of method**. Then under **MFA enforcement** select an option:

   - **Off** - MFA is never enforced during sign-in, and users aren't prompted to enroll in MFA during sign-up or sign-in.
   - **Always on** - MFA is always required, regardless of your Conditional Access setup. During sign-up, users are prompted to enroll in MFA. During sign-in, if users aren't already enrolled in MFA, they're prompted to enroll.
   - **Conditional** - During sign-up and sign-in, users are prompted to enroll in MFA (both new users and existing users who aren't enrolled in MFA). During sign-in, MFA is enforced only when an active Conditional Access policy evaluation requires it:

        - If the result is an MFA challenge with no risk, MFA is enforced. If the user isn't already enrolled in MFA, they're prompted to enroll.
        - If the result is an MFA challenge due to risk *and* the user isn't enrolled in MFA, sign-in is blocked.

   > [!NOTE]
   > If you select **Conditional**, you'll also need to [add Conditional Access to user flows](conditional-access-user-flow.md) and specify the apps you want the policy to apply to.

1. Select **Save**. MFA is now enabled for this user flow.
