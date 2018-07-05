---
title: Enabling an Azure Multi-Factor Authentication pilot
description: In this tutorial, you will enable Azure AD Multi-Factor Authentication for a pilot group of users

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 05/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

# Customer intent: How, as an Azure AD Administrator, do I enable MFA to complete a pilot roll out.
---
# Tutorial: Complete an Azure Multi-Factor Authentication pilot roll out

In this tutorial, you will enable a pilot roll out of Azure Multi-Factor Authentication (Azure MFA), to protect user authentication, in your organization and test using a non-administrator account.

> [!div class="checklist"]
> * Enable Azure Multi-Factor Authentication
> * Test Azure Multi-Factor Authentication

## Prerequisites

* A Global Administrator account

## Enable Azure Multi-Factor Authentication

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.
1. Browse to **Azure Active Directory**, **Conditional access**
1. Select **New policy**
1. Provide a meaningful name for your policy
1. Under **users and groups**
   * On the **Include** tab, select the **All users** radio button
   * RECOMMENDED: On the **Exclude** tab, check the box for **Users and groups** and choose a group to be used for exclusions when users do not have access to their authentication methods.
   * Click **Done**
1. Under **Cloud apps**, select the **All cloud apps** radio button
   * OPTIONALLY: On the **Exclude** tab, choose cloud apps that your organization does not require MFA for.
   * Click **Done**
1. Under **Conditions** section
   * OPTIONALLY: If you have enabled Azure Identity Protection, you can choose to evaluate sign-in risk as part of the policy.
   * OPTIONALLY: If you have configured trusted locations or named locations, you can specify to include or exclude those locations from the policy.
1. Under **Grant**, make sure the **Grant access** radio button is selected
    * Check the box for **Require multi-factor authentication**
    * Click **Select**
1. Skip the **Session** section
1. Set the **Enable policy** toggle to **On**
1. Click **Create**

## Test Azure Multi-Factor Authentication

To prove that your conditional access policy works, you test logging in to a resource that should not require MFA and then to the Azure portal that requires MFA.

1. Open a new browser window in InPrivate or incognito mode and browse to [https://account.activedirectory.windowsazure.com](https://account.activedirectory.windowsazure.com).
   * Log in with the test user created as part of the prerequisites section of this article and note that it should not ask you to complete MFA.
   * Close the browser window
2. Open a new browser window in InPrivate or incognito mode and browse to [https://portal.azure.com](https://portal.azure.com).
   * Log in with the test user created as part of the prerequisites section of this article and note that you should now be required to register for and use Azure Multi-Factor Authentication.
   * Close the browser window

## Clean up resources

If you decide you no longer want to use the functionality you have configured as part of this tutorial, make the following change.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory**, **Conditional access**
1. Select the conditional access policy you created 

## Next steps

In this tutorial, you have enabled Azure Multi-Factor Authentication. Continue on to the next tutorial to see how Azure Identity Protection can be integrated into the self-service password reset and Multi-Factor Authentication experiences.

> [!div class="nextstepaction"]
> [Evaluate risk at sign in](tutorial-risk-based-sspr-mfa.md)