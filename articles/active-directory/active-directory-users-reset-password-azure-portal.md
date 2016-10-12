<properties
	pageTitle="Reset the password for a user in Azure Active Directory preview | Microsoft Azure"
	description="Explains how to reset the password for a user in Azure Active Directory"
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/12/2016"
	ms.author="curtand"/>

# Reset the password for a user in Azure Active Directory preview

> [AZURE.SELECTOR]
- [Azure portal](active-directory-users-reset-password-azure-portal.md)
- [Azure classic portal](active-directory-create-users-reset-password.md)

This article explains how to delete a user from a directory in Azure Active Directory (Azure AD) preview. [What's in the preview?](active-directory-preview-explainer.md) For information about adding new users in your organization, see [Add new users to Azure Active Directory](active-directory-users-create-azure-portal.md).

## Rest the password for a user

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **More services**, enter **Users and groups** in the text box, and then select **Enter**.

    ![Opening user management](./media/active-directory-users-reset-password-azure-portal/create-users-user-management.png)

3.  On the **Users and groups** blade, select **Users**.

    ![Opening the Users blade](./media/active-directory-users-reset-password-azure-portal/create-users-open-users-blade.png)

4. On the **Users and groups - Users** blade, select a user from the list.

5. On the blade for the selected user, select **Overview**, and then in the command bar, select **Reset password**.

    ![Selecting the Reset password command](./media/active-directory-users-reset-password-azure-portal/create-users-reset-password-command.png)

6. On the **Reset password** blade, select **Reset password**.

## What's next

- [Add a user](active-directory-users-create-azure-portal.md)
- [Assign a user to a role in your Azure AD](active-directory-users-assign-role-azure-portal.md)
- [Change a user's work information](active-directory-users-work-info-azure-portal.md)
- [Manage user profiles](active-directory-users-profile-azure-portal.md)
- [Delete a user in your Azure AD](active-directory-users-delete-user-azure-portal.md)
