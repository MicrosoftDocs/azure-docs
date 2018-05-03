---
title: Quickstart Azure Multi-Factor Authentication
description: In this quickstart, you will quickly configure Azure Multi-Factor Authentication to protect access to the Azure Portal

ms.service: active-directory
ms.component: authentication
ms.topic: quickstart
ms.date: 04/27/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: richagi

#Customer intent: As an Azure AD Administrator, I want to protect user authentication so I deploy MFA to make sure the user is who they say they are.
---
# Quickstart: Azure Multi-Factor Authentication

In this quickstart, you configure Azure Multi-Factor Authentication (Azure MFA) and create a conditional access policy to require multi-factor authentication when accessing the Azure portal if a member of the pilot group.

## Prerequisites

You need a working Azure AD tenant with at least a trial license enabled. An account with Global Administrator privileges. A standard non-administrator user with a password you know for testing, if you need to create a user see the article [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md)
A pilot group to test with that the non-administrator user is a member of, if you need to create a group see the article [Create a group and add members in Azure Active Directory](../active-directory-groups-create-azure-portal.md)

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.

## Choose verification options

Before enabling Azure Multi-Factor Authentication, organizations must determine what verification options they allow. For the purpose of this quickstart, we enable call to phone and text message to phone.

1. Browse to **Azure Active Directory**, **Users**, **Multi-Factor Authentication**
2. In the new tab that opens browse to **service settings**
3. Under **verification options**, check the following boxes for methods available to users
   * Call to phone
   * Text message to phone
4. Click on **Save**
5. Close the **service settings** tab

## Create conditional access policy

1. Browse to **Azure Active Directory**, **Conditional access**
1. Select **New policy**
1. Name your policy **MFA Pilot**
1. Under **users and groups**, select the **Select users and groups** radio button
    * Select your pilot group created as part of the prerequisites section of this article
    * Click **Done**
1. Under **Cloud apps**, select the **Select apps** radio button
    * Select **Microsoft Azure Management** (This cloud app relates to the Azure portal)
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

* Open a new browser window in InPrivate mode and browse to https://account.activedirectory.windowsazure.com.
   * Log in with the test user created as part of the prerequisites section of this article and note that it should not ask you to complete MFA.
   * Close the browser window
* Open a new browser window in InPrivate mode and browse to https://portal.azure.com.
   * Log in with the test user created as part of the prerequisites section of this article and note that you should now be required to register for and use Azure Multi-Factor Authentication.
   * Close the browser window

## Clean up resources

If you have completed your pilot, you can clean up the resources used in this quickstart by completing the following tasks:

* Delete test user
* Delete pilot group
* Delete the **MFA Pilot** conditional access policy

## Next steps

> [!div class="nextstepaction"]
> [Azure MFA detailed tutorial]