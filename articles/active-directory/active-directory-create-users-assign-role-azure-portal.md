<properties
	pageTitle="Assign a user to administrator roles in Azure Active Directory | Microsoft Azure"
	description="Explains how to change user administrative information in Azure Active Directory"
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
	ms.date="08/09/2016"
	ms.author="curtand"/>

# Assign a user to administrator roles in Azure Active Directory

This article explains how to assign an administrative role to a user in Azure Active Directory (Azure AD). For information about adding new users in your organization, see [Add new users to Azure Active Directory](active-directory-create-users-azure-portal.md). Added users don't have administrator permissions by default, but you can assign roles to them at any time.

## Assign a role to a user

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **Browse**, enter User Management in the text box, and then select **Enter**.

    ![Opening user management](./media/active-directory-create-users-assign-role-azure-portal/create-users-user-management.png)

3.  On the **User Management** blade, select **Users**.

    ![Opening the Users blade](./media/active-directory-create-users-assign-role-azure-portal/create-users-open-users-blade.png)

4. On the **User Management - Users** blade, select a user from the list.

5. On the blade for the selected user, select **Administrative role**, and then assign the user to a role from the **Roles** list. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md).

	  ![Assigning a user to a role](./media/active-directory-create-users-assign-role-azure-portal/create-users-assign-role.png)

6. Select **Save**.


## What's next

- [Add a user](active-directory-create-users-azure-portal.md)
- Change a user's work information
- Reset a user's password in the new Azure portal
- Manage user properties
- Delete a user in your Azure AD
