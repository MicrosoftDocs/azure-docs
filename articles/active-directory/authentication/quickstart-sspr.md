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
> This quickstart shows an administrator how to enable self-service password reset. If you're an end user already registered for self-service password reset and need to get back into your account, go to https://aka.ms/sspr.
>
> If your IT team hasn't enabled the ability to reset your own password, reach out to your helpdesk for additional assistance.

## Prerequisites

* A working Azure AD tenant with at least a trial license enabled.
    * If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An account with Global Administrator privileges.
* A non-administrator test user with a password you know, such as *testuser*.
    * If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md).
* A pilot group to test with that the non-administrator test user is a member of, such as *SSPR-Test-Group*.
    * If you need to create a group, see how to [Create a group and add members in Azure Active Directory](../active-directory-groups-create-azure-portal.md).

## Enable self-service password reset

[View this process as a video on YouTube](https://youtu.be/Pa0eyqjEjvQ)

1. In the Azure portal menu or from the **Home** page, select **Azure Active Directory** and then choose **Password reset**.

1. On the **Properties** page under the option for **Self Service Password Reset Enabled**, choose **Selected**.
1. Choose **Select group**, then select your pilot group created as part of the prerequisites section of this article, such as *SSPR-Test-Group*. When ready, select **Save**.
1. On the **Authentication methods** page, make the following choices and then choose **Save**:
    * Number of methods required to reset: **1**
    * Methods available to users:
        * **Mobile app code**
        * **Email**

    > [!div class="mx-imgBorder"]
    > ![Choosing authentication methods for SSPR][Authentication]

4. From the **Registration** page, make the following choices and then choose **Save**:
   * Require users to register when they sign in: **Yes**
   * Set the number of days before users are asked to reconfirm their authentication information: **365**

## Test self-service password reset

Now lets test your SSPR configuration with a test user that's part of the group you selected in the previous section, such as *testuser*. Since Microsoft enforces strong authentication requirements for Azure administrator accounts, testing using an administrator account may change the outcome. For more information regarding the administrator password policy, see our [password policy](concept-sspr-policy.md) article.

1. Open a new browser window in InPrivate or incognito mode, and browse to [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup).
2. Sign in with a non-administrator test user, such as *testuser*, and register your authentication phone.
3. Once complete, select the button marked **Looks good** and close the browser window.
4. Open a new browser window in InPrivate or incognito mode, and browse to [https://aka.ms/sspr](https://aka.ms/sspr).
5. Enter your non-administrator test users' User ID, such as *testuser*, the characters from the CAPTCHA, and then select **Next**.
6. Follow the verification steps to reset your password.

## Clean up resources

To disable self-service password reset, search for and select **Azure Active Directory** in the Azure portal. Select **Password Reset**, and then choose **None** under **Self Service Password Reset Enabled**. When ready, select **Save**.

## Next steps

In this quickstart, you learned how to configure self-service password reset for your cloud-only users. To find out how to complete a more detailed roll out, continue to our roll out guide.

> [!div class="nextstepaction"]
> [Roll out self-service password reset](howto-sspr-deployment.md)

[Authentication]: ./media/quickstart-sspr/sspr-authentication-methods.png "Azure AD authentication methods available and the quantity required"

<!-- INTERNAL LINKS -->
[register-sspr]: ../user-help/active-directory-passwords-reset-register.md
[reset-password]: ../user-help/active-directory-passwords-update-your-own-password.md
