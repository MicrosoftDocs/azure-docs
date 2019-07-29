---
title: Enabling an Azure AD SSPR pilot
description: In this tutorial, you will enable Azure AD self-service password reset for a pilot group of users

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

# Customer intent: How, as an Azure AD Administrator, do I enable SSPR to complete a pilot roll out.
ms.collection: M365-identity-device-management
---
# Tutorial: Complete an Azure AD self-service password reset pilot roll out

In this tutorial, you will enable a pilot roll out of Azure AD self-service password reset (SSPR) in your organization and test using a non-administrator account.

It is important that any testing of self-service password reset be done with non-administrator accounts. Microsoft manages the password reset policy for administrator accounts and requires the use of stronger authentication methods. This policy does not allow the use of security questions and answers, and requires the use of two methods for reset.

> [!div class="checklist"]
> * Enable self-service password reset
> * Test SSPR as a user

## Prerequisites

* A Global Administrator account

## Enable self-service password reset

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.
1. Browse to **Azure Active Directory** and select **Password reset**.
1. Start with a pilot group by enabling self-service password for a subset of users in your organization.
   * From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose **Selected** and pick a pilot group.
      * Only members of the specific Azure AD group that you choose can use the SSPR functionality. We recommend that you define a group of users and use this setting when you deploy this functionality for a proof of concept. Nesting of security groups is supported here.
      * Ensure the users in the group you picked have been appropriately licensed.
   * Click **Save**
1. On the **Authentication methods** page
   * Set the **Number of methods required to reset** to **1**
   * Choose which **Methods available to users** your organization wants to allow. For this tutorial check the boxes to enable **Email**, **Mobile phone**, **Office phone**, **Mobile app notification (preview)** and **Mobile app code (preview)**.
   * Click **Save**
1. On the **Registration** page
   * Select **Yes** for **Require users to register when signing in**.
   * Set **Number of days before users are asked to reconfirm their authentication information** to **180**.
   * Click **Save**
1. On the **Notifications** page
   * Set **Notify users on password resets** option to **Yes**.
   * Set **Notify all admins when other admins reset their password** to **Yes**.
1. On the **Customization** page
   * Microsoft recommends that you set **Customize helpdesk link** to **Yes** and provide either an email address or web page URL where your users can get additional help from your organization in the **Custom helpdesk email or URL** field.
   * For this tutorial we will leave **Customize helpdesk link** set to **No**.

Self-service password reset is now configured for cloud users in your pilot group.

## Test SSPR as a user

Test self-service password reset using a non-administrator test user that is a member of your pilot group. **Be aware that if you use an account that has any administrator roles assigned to it the authentication methods and number may be different than what you selected as Microsoft manages the administrator policy.**

1. Open a new InPrivate or incognito mode browser window.
1. Using a test user register for self-service password reset using the registration portal located at [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup).
1. Using the same test user browse to the self-service password reset portal [https://aka.ms/sspr](https://aka.ms/sspr) and attempt to reset your password using the information you provided in the previous step.
1. You should be able to successfully reset your password.

## Clean up resources

If you decide you no longer want to use the functionality you have configured as part of this tutorial, make the following change.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** and select **Password reset**.
1. From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose **None**.
1. Click **Save**

## Next steps

In this tutorial, you have enabled Azure AD self-service password reset. Continue on to the next tutorial to see how an on-premises Active Directory Domain Services infrastructure can be integrated into the self-service password reset experience.

> [!div class="nextstepaction"]
> [Enable SSPR on-premises writeback integration](tutorial-enable-writeback.md)
