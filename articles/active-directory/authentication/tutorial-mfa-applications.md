---
title: Enabling an Azure Multi-Factor Authentication pilot
description: In this tutorial, you will enable Azure AD Multi-Factor Authentication for a pilot group of users

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 07/11/2018

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

# Customer intent: As an Azure AD Administrator, I want to enhance user authentication with MFA to make sure the user is who they say they are.
ms.collection: M365-identity-device-management
---
# Tutorial: Complete an Azure Multi-Factor Authentication pilot roll out

In this tutorial, you walk you through configuring a Conditional Access policy enabling Azure Multi-Factor Authentication (Azure MFA) when logging in to the Azure portal. The policy is deployed to and tested on a specific group of pilot users. Deployment of Azure MFA using Conditional Access provides significant flexibility for organizations and administrators compared to the traditional enforced method.

> [!div class="checklist"]
> * Enable Azure Multi-Factor Authentication
> * Test Azure Multi-Factor Authentication

## Prerequisites

* A working Azure AD tenant with at least a trial license enabled.
* An account with Global Administrator privileges.
* A non-administrator test user with a password you know for testing, if you need to create a user see the article [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md).
* A pilot group to test with that the non-administrator user is a member of, if you need to create a group see the article [Create a group and add members in Azure Active Directory](../active-directory-groups-create-azure-portal.md).

## Enable Azure Multi-Factor Authentication

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**
1. Select **New policy**
1. Name your policy **MFA Pilot**
1. Under **Users and groups**, select the **Select users and groups** radio button
    * Select your pilot group created as part of the prerequisites section of this article
    * Click **Done**
1. Under **Cloud apps**, select the **Select apps** radio button
    * The cloud app for the Azure portal is **Microsoft Azure Management**
    * Click **Select**
    * Click **Done**
1. Skip the **Conditions** section
1. Under **Grant**, make sure the **Grant access** radio button is selected
    * Check the box for **Require multi-factor authentication**
    * Click **Select**
1. Skip the **Session** section
1. Set the **Enable policy** toggle to **On**
1. Click **Create**

## Test Azure Multi-Factor Authentication

To prove that your Conditional Access policy works, you test logging in to a resource that should not require MFA and then to the Azure portal that requires MFA.

1. Open a new browser window in InPrivate or incognito mode and browse to [https://account.activedirectory.windowsazure.com](https://account.activedirectory.windowsazure.com).
   * Log in with the test user created as part of the prerequisites section of this article and note that it should not ask you to complete MFA.
   * Close the browser window.
2. Open a new browser window in InPrivate or incognito mode and browse to [https://portal.azure.com](https://portal.azure.com).
   * Log in with the test user created as part of the prerequisites section of this article and note that you should now be required to register for and use Azure Multi-Factor Authentication.
   * Close the browser window.

## Clean up resources

If you decide you no longer want to use the functionality you have configured as part of this tutorial, make the following change.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select the Conditional Access policy you created.
1. Click **Delete**.

## Next steps

In this tutorial, you have enabled Azure Multi-Factor Authentication. Continue on to the next tutorial to see how Azure Identity Protection can be integrated into the self-service password reset and Multi-Factor Authentication experiences.

> [!div class="nextstepaction"]
> [Evaluate risk at sign in](tutorial-risk-based-sspr-mfa.md)
