---
title: Quickstart - Azure AD self-service password reset
description: In this quickstart, you learn how to configure Azure AD self-service password reset to allow users to reset their own passwords and reduce IT department overhead.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: quickstart
ms.date: 12/10/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sahenry

# Customer intent: As an Azure AD Administrator, I want to protect user authentication and reduce IT department overhead by deploying self-service password reset (SSPR) so that users can reset their own passwords when they have problems.
ms.collection: M365-identity-device-management
---
# Quickstart: Configure Azure Active Directory self-service password reset

In this quickstart, you configure Azure Active Directory (AD) self-service password reset (SSPR) to enable users to reset their passwords or unlock their accounts. With SSPR, users can reset their own credentials without helpdesk or administrator assistance. This ability lets users regain access to their account without waiting for additional support.

> [!IMPORTANT]
> This quickstart shows an administrator how to enable self-service password reset. If your IT team hasn't already enabled the ability to reset your own password, reach out to your helpdesk for additional assistance.
>
> If your IT has enabled password reset, you first need to [register for self-service password reset][register-sspr] and then learn how to [reset your work or school password][reset-password]. If you're not already registered for self-service password reset, reach out to your helpdesk for additional assistance.

## Prerequisites

* A working Azure AD tenant with at least a trial license enabled.
    * If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An account with Global Administrator privileges.
* A non-administrator test user with a password you know.
    * If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md).
* A pilot group to test with that the non-administrator test user is a member of.
    * If you need to create a group, see how to [Create a group and add members in Azure Active Directory](../active-directory-groups-create-azure-portal.md).

## Enable self-service password reset

[View this process as a video on YouTube](https://youtu.be/Pa0eyqjEjvQ)

1. From your existing Azure AD tenant, from the Azure portal menu or from the **Home** page, select **Azure Active Directory**. Then, select **Password reset**.

2. From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose **Selected**.
    * From **Select group**, choose your pilot group created as part of the prerequisites section of this article.
    * Click **Save**.

3. From the **Authentication methods** page, make the following choices:
   * Number of methods required to reset: **1**
   * Methods available to users:
      * **Email**
      * **Mobile app code (preview)**
   * Click **Save**.

     ![Choosing authentication methods for SSPR][Authentication]

4. From the **Registration** page, make the following choices:
   * Require users to register when they sign in: **Yes**
   * Set the number of days before users are asked to reconfirm their authentication information: **365**

## Test self-service password reset

Now lets test your SSPR configuration with a test user. Since Microsoft enforces strong authentication requirements for Azure administrator accounts, testing using an administrator account may change the outcome. For more information regarding the administrator password policy, see our [password policy](concept-sspr-policy.md) article.

1. Open a new browser window in InPrivate or incognito mode, and browse to [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup).
2. Sign in with a non-administrator test user, and register your authentication phone.
3. Once complete, click the button marked **looks good** and close the browser window.
4. Open a new browser window in InPrivate or incognito mode, and browse to [https://aka.ms/sspr](https://aka.ms/sspr).
5. Enter your non-administrator test users' User ID, the characters from the CAPTCHA, and then click **Next**.
6. Follow the verification steps to reset your password

## Clean up resources

It's easy to disable self-service password reset. Open your Azure AD tenant and go to **Properties** > **Password Reset**, and then select **None** under **Self Service Password Reset Enabled**.

## Next steps

In this quickstart, you’ve learned how to quickly configure self-service password reset for your cloud-only users. To find out how to complete a more detailed roll out, continue to our roll out guide.

> [!div class="nextstepaction"]
> [Roll out self-service password reset](howto-sspr-deployment.md)

[Authentication]: ./media/quickstart-sspr/sspr-authentication-methods.png "Azure AD authentication methods available and the quantity required"

<!-- INTERNAL LINKS -->
[register-sspr]: ../user-help/active-directory-passwords-reset-register.md
[reset-password]: ../user-help/active-directory-passwords-update-your-own-password.md