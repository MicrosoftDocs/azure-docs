<properties
	pageTitle="Remove a user or group assignment from an enterprise app in Azure Active Directory | Microsoft Azure"
	description="How to remove the access assignment of a user or group from an enterprise app in Azure Active Directory"
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
	ms.date="08/19/2016"
	ms.author="curtand"/>


# Remove a user or group assignment from an enterprise app in Azure Active Directory

It's easy to remove a user or a group from being assigned access to one of your enterprise applications in Azure Active Directory (Azure AD). You must have the appropriate permissions to manage the enterprise app. In the current preview, you must be global admin for the directory.

## How do I remove a user or group assignment?

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **More services**, enter Active Directory in the text box, and then select **Enter**.

3. On the **Azure Active Directory - *directoryname*** blade (that is, the Azure AD blade for the directory you are managing), select **Enterprise apps**.

    ![Opening Enterprise apps](./media/active-directory-coreapps-remove-assignment-user-azure-portal/open-enterprise-apps.png)

4. On the **Enterprise applications** blade, select **All applications**. You'll see a list of the apps you can manage.

  ![Selecting the all applications command](./media/active-directory-coreapps-remove-assignment-user-azure-portal/all-applications.png)

5. On the **Enterprise applications - All apps** blade, select an app.

6. On the ***appname*** blade (that is, the blade with the name of the selected app in the title), select **Users & Groups**.

	![Selecting users or groups](./media/active-directory-coreapps-remove-assignment-user-azure-portal/select-app-users.png)

7. On the ***appname*** **- User & Group Assignment** blade, select one of more users or groups and then select the **Remove** command. Confirm your decision at the prompt.

	![Selecting the Remove command](./media/active-directory-coreapps-remove-assignment-user-azure-portal/remove-users.png)


## Next steps

- [See all of my groups](active-directory-groups-view-azure-portal.md)
- [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)
- [Disable user sign-ins for an enterprise app](active-directory-coreapps-disable-app-azure-portal.md)
- [Allow a user who is not assigned to an enterprise app to sign in using existing credentials](active-directory-coreapps-allow-unassigned-access-azure-portal.md)
- [Change the name or logo of an enterprise app](active-directory-coreapps-change-app-logo-azure-portal.md)
