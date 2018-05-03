---
title: Quickstart Self-service password reset quickstart
description: In this quickstart, you will quickly configure Azure AD self-service password reset to allow users to reset their own passwords

ms.service: active-directory
ms.component: authentication
ms.topic: quickstart
ms.date: 04/27/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

#Customer intent: As an Azure AD Administrator, I want to protect user authentication so I deploy SSPR so that when users have trouble signing-in they can reset their passwords using something they know.
---
# Quickstart: Self-service password reset

Self-service password reset (SSPR) offers a simple means for IT administrators to empower users to reset or unlock their passwords or accounts. The system includes detailed reporting that tracks when users access the system, along with notifications to alert you to misuse or abuse.

## Prerequisites

You need a working Azure AD tenant with at least a trial license enabled. An account with Global Administrator privileges. 
A standard non-administrator user with a password you know for testing, if you need to create a user see the article [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md)
A pilot group to test with that the non-administrator user is a member of, if you need to create a group see the article [Create a group and add members in Azure Active Directory](../active-directory-groups-create-azure-portal.md)

## Enable SSPR for your Azure AD tenant

1. From your existing Azure AD tenant, on the **Azure Portal** under **Azure Active Directory** select **Password reset**.

2. From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose **Selected**
    1. From **Select group**, choose your pilot group created as part of the prerequisites section of this article
    1. Click **Save**

3. From the **Authentication methods** page, choose the following:
   * **Number of methods required to reset**: 1
   * **Methods available to users**: 
      * **Mobile phone**
      * **Office phone**
   * Click **Save**
                  
    ![Authentication][Authentication]

4. From the **Registration** page, choose the following:
   * Require users to register when they sign in: **Yes**
   * Set the number of days before users are asked to reconfirm their authentication information: **365**

At this point, you have configured SSPR for your Azure AD tenant. Your users can now use the instructions found in the articles [Register for self-service password reset](../active-directory-passwords-reset-register.md) and [Reset or change your password](../active-directory-passwords-update-your-own-password.md) to update their password without administrator intervention. You can stop here if you're cloud-only. Or you can continue to the next section to configure the synchronization of passwords to an on-premises Active Directory domain.

> [!TIP]
> Test SSPR with a user rather than an administrator, because Microsoft enforces strong authentication requirements for Azure administrator accounts. For more information regarding the administrator password policy, see our [password policy](concept-sspr-policy.md#administrator-password-policy-differences) article.

## Clean up resources

It's easy to disable self-service password reset. Open your Azure AD tenant and go to **Password Reset** > **Properties**, and then select **None** under **Self Service Password Reset Enabled**.

## Next steps

In this quickstart, you’ve learned how to configure self-service password reset for your users. To complete these steps, continue to the Azure portal:

> [!div class="nextstepaction"]
> [Enable self-service password reset](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset)

[Authentication]: ./media/quickstart-sspr/sspr-authentication-methods.png "Azure AD authentication methods available and the quantity required"
[Policy]: ./media/quickstart-sspr/password-policy.png "On-premises password Group Policy set to 0 days"
