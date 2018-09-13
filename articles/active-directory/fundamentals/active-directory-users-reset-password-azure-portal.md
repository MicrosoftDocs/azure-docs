---

title: How to reset a user's password in Azure Active Directory | Microsoft Docs
description: Reset a user's password using Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman

ms.assetid: fad5624b-2f13-4abc-b3d4-b347903a8f16
ms.service: active-directory
ms.component: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 09/05/2018
ms.author: lizross
ms.reviewer: jeffsta
ms.custom: it-pro

---
# How to: Reset a user's password using Azure Active Directory
You can reset a user's password if the password is forgotten, if the user gets locked out of a device, or if the user never received a password.

>[!Note]
>You can only reset passwords that exist in your Azure AD tenant. That means that if your user is signing in using another email account, such as a Gmail account or a personal Microsoft account, you won't be able to reset the password.

## To reset a password

1. Sign in to the [Azure portal](https://portal.azure.com/) using an account that has permissions to reset a user's password. For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md#available-roles)

2. Select **Azure Active Directory**, select **Users**, search for and select the user that needs the reset, and then select **Reset Password**.

    The **Alain Charon - Profile** page appears with the **Reset password** option.

    ![User's profile page, with Reset password option highlighted](media/active-directory-users-reset-password-azure-portal/user-profile-reset-password-link.png)

3. In the **Reset password** page, select **Reset password**.

    A temporary password is auto-generated for the user.

4. Copy the password and give it to the user. The user will be required to change the password during the next sign-in process.

    >[!Note]
    >The temporary password never expires. That means that whenever the user signs in again, no matter how much time has passed, the password will still work.

## Next steps
After you've reset your user's password, you can perform the following basic processes:

- [Add or delete users](add-users-azure-active-directory.md)

- [Assign roles to users](active-directory-users-assign-role-azure-portal.md)

- [Add or change profile information](active-directory-users-profile-azure-portal.md)

- [Create a basic group and add members](active-directory-groups-create-azure-portal.md)

Or you can perform more complex user scenarios, such as assigning delegates, using policies, and sharing user accounts. For more information about other available actions, see [Azure Active Directory user management documentation](../users-groups-roles/index.yml).
