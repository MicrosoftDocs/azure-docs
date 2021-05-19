---
title: Enable Azure Active Directory self-service password reset
description: In this tutorial, you learn how to enable Azure Active Directory self-service password reset for a group of users and test the password reset process.
services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 04/21/2021
ms.author: justinha
author: justinha
ms.reviewer: rhicock
ms.collection: M365-identity-device-management
# Customer intent: As an Azure AD Administrator, I want to learn how to enable and use self-service password reset so that my end-users can unlock their accounts or reset their passwords through a web browser.
---

# Tutorial: Enable users to unlock their account or reset passwords using Azure Active Directory self-service password reset

Azure Active Directory (Azure AD) self-service password reset (SSPR) gives users the ability to change or reset their password, with no administrator or help desk involvement. If Azure AD locks a user's account or they forget their password, they can follow prompts to unblock themselves and get back to work. This ability reduces help desk calls and loss of productivity when a user can't sign in to their device or an application. We recommend this video on [How to enable and configure SSPR in Azure AD](https://www.youtube.com/watch?v=rA8TvhNcCvQ). We also have a video for IT administrators on [resolving the six most common end-user error messages with SSPR](https://www.youtube.com/watch?v=9RPrNVLzT8I).

> [!IMPORTANT]
> This tutorial shows an administrator how to enable self-service password reset. If you're an end user already registered for self-service password reset and need to get back into your account, go to the [Microsoft Online password reset](https://passwordreset.microsoftonline.com/) page.
>
> If your IT team hasn't enabled the ability to reset your own password, reach out to your helpdesk for additional assistance.

In this tutorial you learn how to:

> [!div class="checklist"]
> * Enable self-service password reset for a group of Azure AD users
> * Set up authentication methods and registration options
> * Test the SSPR process as a user

## Prerequisites

To finish this tutorial, you need the following resources and privileges:

* A working Azure AD tenant with at least an Azure AD free or trial license enabled. In the Free tier, SSPR only works for cloud users in Azure AD. Password change is supported in the Free tier, but password reset is not. 
    * For later tutorials in this series, you'll need an Azure AD Premium P1 or trial license for on-premises password writeback.
    * If needed, [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An account with *Global Administrator* privileges.
* A non-administrator user with a password you know, like *testuser*. You'll test the end-user SSPR experience using this account in this tutorial.
    * If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../fundamentals/add-users-azure-active-directory.md).
* A group that the non-administrator user is a member of, likes *SSPR-Test-Group*. You'll enable SSPR for this group in this tutorial.
    * If you need to create a group, see [Create a basic group and add members using Azure Active Directory](../fundamentals/active-directory-groups-create-azure-portal.md).

## Enable self-service password reset

Azure AD lets you enable SSPR for *None*, *Selected*, or *All* users. This granular ability lets you choose a subset of users to test the SSPR registration process and workflow. When you're comfortable with the process and the time is right to communicate the requirements with a broader set of users, you can select a group of users to enable for SSPR. Or, you can enable SSPR for everyone in the Azure AD tenant.

> [!NOTE]
> Currently, you can only enable one Azure AD group for SSPR using the Azure portal. As part of a wider deployment of SSPR, Azure AD supports nested groups. Make sure that the users in the group(s) you choose have the appropriate licenses assigned. There's currently no validation process of these licensing requirements.

In this tutorial, set up SSPR for a set of users in a test group. Use the *SSPR-Test-Group* and provide your own Azure AD group as needed:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account with *global administrator* permissions.
1. Search for and select **Azure Active Directory**, then select **Password reset** from the menu on the left side.
1. From the **Properties** page, under the option *Self service password reset enabled*, select **Select group**
1. Browse for and select your Azure AD group, like *SSPR-Test-Group*, then choose *Select*.

    [![Select a group in the Azure portal to enable for self-service password reset](media/tutorial-enable-sspr/enable-sspr-for-group-cropped.png)](media/tutorial-enable-sspr/enable-sspr-for-group.png#lightbox)

1. To enable SSPR for the select users, select **Save**.

## Select authentication methods and registration options

When users need to unlock their account or reset their password, they're prompted for another confirmation method. This extra authentication factor makes sure that Azure AD finished only approved SSPR events. You can choose which authentication methods to allow, based on the registration information the user provides.

1. From the menu on the left side of the **Authentication methods** page, set the **Number of methods required to reset** to *1*.

    To improve security, you can increase the number of authentication methods required for SSPR.

1. Choose the **Methods available to users** that your organization wants to allow. For this tutorial, check the boxes to enable the following methods:

    * *Mobile app notification*
    * *Mobile app code*
    * *Email*
    * *Mobile phone*

    You can enable other authentication methods, like *Office phone* or *Security questions*, as needed to fit your business requirements.

1. To apply the authentication methods, select **Save**.

Before users can unlock their account or reset a password, they must register their contact information. Azure AD uses this contact information for the different authentication methods set up in the previous steps.

An administrator can manually provide this contact information, or users can go to a registration portal to provide the information themselves. In this tutorial, set up Azure AD to prompt the users for registration the next time they sign in.

1. From the menu on the left side of the **Registration** page, select *Yes* for **Require users to register when signing in**.
1. Set **Number of days before users are asked to reconfirm their authentication information** to *180*.

    It's important to keep the contact information up to date. If outdated contact information exists when an SSPR event starts, the user may not be able to unlock their account or reset their password.

1. To apply the registration settings, select **Save**.

## Set up notifications and customizations

To keep users informed about account activity, you can set up Azure AD to send email notifications when an SSPR event happens. These notifications can cover both regular user accounts and admin accounts. For admin accounts, this notification provides another layer of awareness when a privileged administrator account password is reset using SSPR. Azure AD will notify all global admins when someone uses SSPR on an admin account.

1. From the menu on the left side of the **Notifications** page, set up the following options:

   * Set **Notify users on password resets** option to *Yes*.
   * Set **Notify all admins when other admins reset their password** to *Yes*.

1. To apply the notification preferences, select **Save**.

If users need more help with the SSPR process, you can customize the "Contact your administrator" link. The user can select this link in the SSPR registration process and when they unlock their account or resets their password. To make sure your users get the support needed, we highly recommend you provide a custom helpdesk email or URL.

1. From the menu on the left side of the **Customization** page, set **Customize helpdesk link** to *Yes*.
1. In the **Custom helpdesk email or URL** field, provide an email address or web page URL where your users can get more help from your organization, like *https:\//support.contoso.com/*
1. To apply the custom link, select **Save**.

## Test self-service password reset

With SSPR enabled and set up, test the SSPR process with a user that's part of the group you selected in the previous section, like *Test-SSPR-Group*. The following example uses the *testuser* account. Provide your own user account. It's part of the group you enabled for SSPR in the first section of this tutorial.

> [!NOTE]
> When you test self-service password reset, use a non-administrator account. By default, Azure AD enables self-service password reset for admins. They're required to use two authentication methods to reset their password. For more information, see [Administrator reset policy differences](concept-sspr-policy.md#administrator-reset-policy-differences).

1. To see the manual registration process, open a new browser window in InPrivate or incognito mode, and browse to *https:\//aka.ms/ssprsetup*. Azure AD will direct users to this registration portal when they sign in next time.
1. Sign in with a non-administrator test user, like *testuser*, and register your authentication methods contact information.
1. Once finished, select the button marked **Looks good** and close the browser window.
1. Open a new browser window in InPrivate or incognito mode, and browse to *https:\//aka.ms/sspr*.
1. Enter your non-administrator test users' account information, like *testuser*, the characters from the CAPTCHA, and then select **Next**.

    ![Enter user account information to reset the password](media/tutorial-enable-sspr/password-reset-page.png)

1. Follow the verification steps to reset your password. When finished, you'll receive an email notification that your password was reset.

## Clean up resources

In a later tutorial in this series, you'll set up password writeback. This feature writes password changes from Azure AD SSPR back to an on-premises AD environment. If you want to continue with this tutorial series to set up password writeback, don't disable SSPR now.

If you no longer want to use the SSPR functionality you have set up as part of this tutorial, set the SSPR status to **None** using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Active Directory**, then select **Password reset** from the menu on the left side.
1. From the **Properties** page, under the option *Self service password reset enabled*, select **None**.
1. To apply the SSPR change, select **Save**.

## FAQs

This section explains common questions from administrators and end-users who try SSPR:

- Why do federated users wait up to 2 minutes after they see **Your password has been reset** before they can use passwords that are synchronized from on-premises?

  For federated users whose passwords are synchronized, the source of authority for the passwords is on-premises. As a result, SSPR updates only the on-premises passwords. Password hash synchronization back to Azure AD is scheduled for every 2 minutes.

- When a newly created user who is pre-populated with SSPR data such as phone and email visits the SSPR registration page, **Don’t lose access to your account!** appears as the title of the page. Why don't other users who have SSPR data pre-populated see the message?

  A user who sees **Don’t lose access to your account!** is a member of SSPR/combined registration groups that are configured for the tenant. Users who don’t see **Don’t lose access to your account!** were not part of the SSPR/combined registration groups.

- When some users go through SSPR process and reset their password, why don't they see the password strength indicator?

  Users who don’t see weak/strong password strength have synchronized password writeback enabled. Since SSPR can’t determine the password policy of the customer’s on-premises environment, it cannot validate password strength or weakness. 

## Next steps

In this tutorial, you enabled Azure AD self-service password reset for a selected group of users. You learned how to:

> [!div class="checklist"]
> * Enable self-service password reset for a group of Azure AD users
> * Set up authentication methods and registration options
> * Test the SSPR process as a user

> [!div class="nextstepaction"]
> [Enable Azure AD Multi-Factor Authentication](./tutorial-enable-azure-mfa.md)
