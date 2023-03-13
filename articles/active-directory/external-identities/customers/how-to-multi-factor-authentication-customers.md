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

[Multifactor authentication](/authentication/concept-mfa-howitworks) (MFA) adds a layer of security to your customer-facing applications. With MFA, customers are prompted for a one-time passcode in addition to their username and password when they sign up or sign in to your app. This article describes how to enforce MFA for your customers by creating an Azure AD Conditional Access policy and adding MFA to your sign-up and sign-in user flow.

## Prerequisites

- An Azure AD customer tenant (if you don't have a tenant, you can start a free trial).
- A sign-up and sign-in user flow that has been integrated with your app.
- An app that's registered in your customer tenant, added to a sign-up and sign-in user flow, and updated to point to the user flow for authentication.
- An account with Conditional Access Administrator, Security Administrator, or Global Administrator privileges to configure Conditional Access policies and MFA.

## Create a Conditional Access policy

First, create a Conditional Access policy in your customer tenant that prompts users for MFA when they sign up or sign in to your app. (For more information, see [Common Conditional Access policy: Require MFA for all users](/conditional-access/howto-conditional-access-policy-all-users-mfa)).

1. Sign in to the [Azure portal](https://portal.azure.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.

1. Make sure you're using the directory that contains your Azure AD customer tenant: Select the **Directories + subscriptions** icon in the portal toolbar and find your customer tenant in the list. If it's not the current directory, select **Switch**.

1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.

1. Select **New policy**.

1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.

1. Under **Assignments**, select the link under **Users**.

    a. On the **Include** tab, select **All users**.

    b. On the **Exclude** tab, select **Users and groups** and choose your organization's emergency access or break-glass accounts.

1. Select the link under **Cloud apps or actions**. On the Include tab, do one of the following:

   - Choose **All cloud apps**.

   - Choose **Select apps** and click the link under **Select**. Find your app, select it, and then choose **Select**.

1. Under **Exclude**, select any applications that don't require multifactor authentication.

1. Under **Access controls** select the link under **Grant**. Select **Grant access**, select **Require multifactor authentication**, and then choose **Select**.

1. Confirm your settings and set **Enable policy** to **On**.

1. Select **Create** to create to enable your policy.

## Enable email one-time passcode

Enable the email one-time passcode authentication method in your customer tenant for all users.

1. Sign in to your customer tenant in the [Azure portal](https://portal.azure.com).

1. Browse to **Azure Active Directory** > **Security** > **Authentication Methods**.

1. In the **Method** list, select **Email OTP (Preview)**.

1. Under **Enable and Target**, turn the **Enable** toggle on.

1. Under **Include**, next to **Target**, select **All users**.

1. Select **Save**.

## Test the sign-in

In a private browser, open your application and select **Sign-in**. You should be prompted for an additional authentication method.
 