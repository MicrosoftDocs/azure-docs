---
title: Enable Azure AD Multi-Factor Authentication
description: In this tutorial, you learn how to enable Azure AD Multi-Factor Authentication for a group of users and test the secondary factor prompt during a sign-in event.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 01/29/2023

ms.author: justinha
author: justinha
ms.reviewer: michmcla

ms.collection: M365-identity-device-management

# Customer intent: As an Azure AD Administrator, I want to learn how to enable and use Azure AD Multi-Factor Authentication so that the user accounts in my organization are secured and require an additional form of verification during a sign-in event.
---
# Tutorial: Secure user sign-in events with Azure AD Multi-Factor Authentication

Multi-factor authentication (MFA) is a process in which a user is prompted for additional forms of identification during a sign-in event. For example, the prompt could be to enter a code on their cellphone or to provide a fingerprint scan. When you require a second form of identification, security is increased because this additional factor isn't easy for an attacker to obtain or duplicate.

Azure AD Multi-Factor Authentication and Conditional Access policies give you the flexibility to require MFA from users for specific sign-in events. For an overview of MFA, we recommend watching this video:  [How to configure and enforce multi-factor authentication in your tenant](https://www.youtube.com/watch?v=qNndxl7gqVM).

> [!IMPORTANT]
> This tutorial shows an administrator how to enable Azure AD Multi-Factor Authentication.
>
> If your IT team hasn't enabled the ability to use Azure AD Multi-Factor Authentication, or if you have problems during sign-in, reach out to your Help desk for additional assistance.

In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a Conditional Access policy to enable Azure AD Multi-Factor Authentication for a group of users.
> * Configure the policy conditions that prompt for MFA.
> * Test configuring and using multi-factor authentication as a user.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* A working Azure AD tenant with Azure AD Premium P1 or trial licenses enabled.
    * If you need to, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An account with *Conditional Access Administrator*, *Security Administrator*, or *Global Administrator* privileges. Some MFA settings can also be managed by an *Authentication Policy Administrator*. For more information, see [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).

* A non-administrator account with a password that you know. For this tutorial, we created such an account, named *testuser*. In this tutorial, you test the end-user experience of configuring and using Azure AD Multi-Factor Authentication.
    * If you need information about creating a user account, see [Add or delete users using Azure Active Directory](../fundamentals/add-users-azure-active-directory.md).

* A group that the non-administrator user is a member of. For this tutorial, we created such a group, named *MFA-Test-Group*. In this tutorial, you enable Azure AD Multi-Factor Authentication for this group.
    * If you need more information about creating a group, see [Create a basic group and add members using Azure Active Directory](../fundamentals/active-directory-groups-create-azure-portal.md).

## Create a Conditional Access policy

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

The recommended way to enable and use Azure AD Multi-Factor Authentication is with Conditional Access policies. Conditional Access lets you create and define policies that react to sign-in events and that request additional actions before a user is granted access to an application or service.

:::image type="content" alt-text="Overview diagram of how Conditional Access works to secure the sign-in process" source="media/tutorial-enable-azure-mfa/conditional-access-overview.png" lightbox="media/tutorial-enable-azure-mfa/conditional-access-overview.png":::

Conditional Access policies can be applied to specific users, groups, and apps. The goal is to protect your organization while also providing the right levels of access to the users who need it. 

In this tutorial, we create a basic Conditional Access policy to prompt for MFA when a user signs in to the Azure portal. In a later tutorial in this series, we configure Azure AD Multi-Factor Authentication by using a risk-based Conditional Access policy.

First, create a Conditional Access policy and assign your test group of users as follows:

1. Sign in to the [Azure portal](https://portal.azure.com) by using an account with *global administrator* permissions.

1. Search for and select **Azure Active Directory**. Then select **Security** from the menu on the left-hand side.

1. Select **Conditional Access**, select **+ New policy**, and then select **Create new policy**.
 
   :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select 'New policy' and then select 'Create new policy'." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-menu-new-policy.png":::

1. Enter a name for the policy, such as *MFA Pilot*.

1. Under **Assignments**, select the current value under **Users or workload identities**.
 
   :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select the current value under 'Users or workload identities'." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-menu-users.png":::

1. Under **What does this policy apply to?**, verify that **Users and groups** is selected.

1. Under **Include**, choose **Select users and groups**, and then select **Users and groups**.
 
   :::image type="content" alt-text="A screenshot of the page for creating a new policy, where you select options to specify users and groups." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-menu-select-users-groups.png":::

   Since no one is assigned yet, the list of users and groups (shown in the next step) opens automatically.

1. Browse for and select your Azure AD group, such as *MFA-Test-Group*, then choose **Select**.

   :::image type="content" alt-text="A screenshot of the list of users and groups, with results filtered by the letters M F A, and 'MFA-Test-Group' selected." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-select-mfa-test-group.png":::


We've selected the group to apply the policy to. In the next section, we configure the conditions under which to apply the policy.


## Configure the conditions for multi-factor authentication

Now that the Conditional Access policy is created and a test group of users is assigned, define the cloud apps or actions that trigger the policy. These cloud apps or actions are the scenarios that you decide require additional processing, such as prompting for multi-factor authentication. For example, you could decide that access to a financial application or use of management tools require an additional prompt for authentication.

### Configure which apps require multi-factor authentication

For this tutorial, configure the Conditional Access policy to require multi-factor authentication when a user signs in to the Azure portal.

1. Select the current value under **Cloud apps or actions**, and then under **Select what this policy applies to**, verify that **Cloud apps** is selected.

1. Under **Include**, choose **Select apps**.
 
   Since no apps are yet selected, the list of apps (shown in the next step) opens automatically.

   > [!TIP]
   > You can choose to apply the Conditional Access policy to **All cloud apps** or **Select apps**. To provide flexibility, you can also exclude certain apps from the policy.

1. Browse the list of available sign-in events that can be used. For this tutorial, select **Microsoft Azure Management** so that the policy applies to sign-in events to the Azure portal. Then choose **Select**.

   :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select the app, Microsoft Azure Management, to which the new policy will apply." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-menu-select-apps.png":::

### Configure multi-factor authentication for access

Next, we configure access controls. Access controls let you define the requirements for a user to be granted access. They might be required to use an approved client app or a device that's hybrid-joined to Azure AD. 

In this tutorial, configure the access controls to require multi-factor authentication during a sign-in event to the Azure portal.

1. Under **Access controls**, select the current value under **Grant**, and then select **Grant access**.

   :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select 'Grant' and then select 'Grant access'." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-menu-grant-access.png":::

1. Select **Require multi-factor authentication**, and then choose **Select**.

   :::image type="content" alt-text="A screenshot of the options for granting access, where you select 'Require multi-factor authentication'." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-select-require-mfa.png":::


### Activate the policy

Conditional Access policies can be set to **Report-only** if you want to see how the configuration would affect users, or **Off** if you don't want to the use policy right now. Because a test group of users is targeted for this tutorial, let's enable the policy, and then test Azure AD Multi-Factor Authentication.

1. Under **Enable policy**, select **On**.

   :::image type="content" alt-text="A screenshot of the control that's near the bottom of the web page where you specify whether the policy is enabled." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-conditional-access-enable-policy-on.png":::

1. To apply the Conditional Access policy, select **Create**.

## Test Azure AD Multi-Factor Authentication

Let's see your Conditional Access policy and Azure AD Multi-Factor Authentication in action. 

First, sign in to a resource that doesn't require MFA:

1. Open a new browser window in InPrivate or incognito mode and browse to [https://account.activedirectory.windowsazure.com](https://account.activedirectory.windowsazure.com).
 
   Using a private mode for your browser prevents any existing credentials from affecting this sign-in event.

1. Sign in with your non-administrator test user, such as *testuser*. Be sure to include `@` and the domain name for the user account.

   If this is the first instance of signing in with this account, you're prompted to change the password. However, there's no prompt for you to configure or use multi-factor authentication.

1. Close the browser window.


You configured the Conditional Access policy to require additional authentication for the Azure portal. Because of that configuration, you're prompted to use Azure AD Multi-Factor Authentication or to configure a method if you haven't yet done so. Test this new requirement by signing in to the Azure portal:

1. Open a new browser window in InPrivate or incognito mode and sign in to the [Azure portal](https://portal.azure.com).

1. Sign in with your non-administrator test user, such as *testuser*. Be sure to include `@` and the domain name for the user account.

   You're required to register for and use Azure AD Multi-Factor Authentication.

   :::image type="content" alt-text="A prompt that says 'More information required.' This is a prompt to configure a method of multi-factor authentication for this user." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-browser-prompt-more-info.png":::

1. Select **Next** to begin the process. 

   You can choose to configure an authentication phone, an office phone, or a mobile app for authentication. _Authentication phone_ supports text messages and phone calls, _office phone_ supports calls to numbers that have an extension, and _mobile app_ supports using a mobile app to receive notifications for authentication or to generate authentication codes.

   :::image type="content" alt-text="A prompt that says, 'Additional security verification.' This is a prompt to configure a method of multi-factor authentication for this user. You can choose as the method an authentication phone, an office phone, or a mobile app." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-additional-security-verification-mobile-app.png":::

1. Complete the instructions on the screen to configure the method of multi-factor authentication that you've selected. 

1. Close the browser window, and sign in to the [Azure portal](https://portal.azure.com) again to test the authentication method that you configured. For example, if you configured a mobile app for authentication, you should see a prompt like the following.

   ![To sign in, follow the prompts in your browser and then the prompt on the device that you registered for multi-factor authentication.](media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-browser-prompt.png)

1. Close the browser window.

## Clean up resources

If you no longer want to use the Conditional Access policy that you configured as part of this tutorial, delete the policy by using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Active Directory**, and then select **Security** from the menu on the left-hand side.

1. Select **Conditional Access**, and then select the policy that you created, such as **MFA Pilot**.

1. select **Delete**, and then confirm that you want to delete the policy.

   :::image type="content" alt-text="To delete the Conditional Access policy that you've opened, select Delete which is located under the name of the policy." source="media/tutorial-enable-azure-mfa/tutorial-enable-azure-mfa-delete-policy.png":::

## Next steps

In this tutorial, you enabled Azure AD Multi-Factor Authentication by using Conditional Access policies for a selected group of users. You learned how to:

> [!div class="checklist"]
> * Create a Conditional Access policy to enable Azure AD Multi-Factor Authentication for a group of Azure AD users.
> * Configure the policy conditions that prompt for multi-factor authentication.
> * Test configuring and using multi-factor authentication as a user.

> [!div class="nextstepaction"]
> [Enable password writeback for self-service password reset (SSPR)](./tutorial-enable-sspr-writeback.md)
