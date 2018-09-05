---
title: How to add or update a user's profile information in Azure Active Directory | Microsoft Docs
description: Add information to a user's profile, including a profile picture, job-specific information, and some settings using the Azure Active Directory portal.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/05/2018
ms.author: lizross
ms.reviewer: jeffsta
---

# How to: Add or update a user's profile information using the Azure Active Directory portal
Add user profile information, including a profile picture, job-specific information, and some settings using the Azure Active Directory (Azure AD) portal. For more information about adding new users, see [How to add or delete users using the Azure Active Directory portal](add-users-azure-active-directory.md).

## Add or change profile information
As you'll see, there's more information available in a user's profile than what you're able to add during the user's creation. All of this additional information is optional and can be added as needed by your organization.

## To add or change profile information
1. Sign in to the [Azure AD portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Users**, and then select a user. For example, _Alain Charon_.

    The **Alain Charon - Profile** blade appears.

    ![User's profile blade, including editable information](media/active-directory-users-profile-azure-portal/user-profile-all-blade.png)

3. Select **Edit** to optionally add or update the information included in each of the available sections.

    ![User's profile blade, showing the editable areas](media/active-directory-users-profile-azure-portal/user-profile-edit.png)

    - **Profile picture.** Select a thumbnail image for the user's account. This picture appears in the Azure Active Directory portal and on the user's personal pages, such as the myapps.microsoft.com page.

    - **Identity.** Add any account-related information, such as a married last name or a changed user name. 
    
        You might have previously added this information while creating the user. The identity-related information is the only profile information that was available at that time.

    - **Job info.** Add any job-related information, such as the user's job title, department, or manager.

    - **Settings.** Decide whether the user can sign in to the Azure Active Directory tenant. You can also specify the user's global location.

    - **Contact info.** Add any relevant contact information for the user. For example, a street address or a mobile phone number.

    - **Authentication contact info.** Verify this information to make sure there's an active phone number and email address for the user. This information is used by Azure Active Directory to make sure the user is really the user during sign-in.

4. Select **Save**.

    All of your changes are saved for the user.

## Next steps
After you've added your users, you can:

- [Add or delete users](add-users-azure-active-directory.md)

- [Reset a user's password](active-directory-users-reset-password-azure-portal.md)

- [Assign roles to users](active-directory-users-assign-role-azure-portal.md)

- [Create a basic group and add members](active-directory-groups-create-azure-portal.md)
