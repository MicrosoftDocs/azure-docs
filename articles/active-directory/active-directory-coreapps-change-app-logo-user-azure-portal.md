<properties
	pageTitle="Change the name or logo of an enterprise app in Azure Active Directory | Microsoft Azure"
	description="How to change the name or logo for a custom enterprise app in Azure Active Directory"
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

# Change the name or logo of an enterprise app in Azure Active Directory

It's easy to change the name or logo for a custom enterprise application in Azure Active Directory (Azure AD). You must have the appropriate permissions to make these changes. In the current preview, you must be the creator of the custom app.

## How do I change an enterprise app's name or logo?

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **More services**, enter Active Directory in the text box, and then select **Enter**.

3. On the **Azure Active Directory - *directoryname*** blade (that is, the Azure AD blade for the directory you are managing), select **Enterprise apps**.

  ![Opening Enterprise apps](./media/active-directory-coreapps-change-app-logo-azure-portal/open-enterprise-apps.png)

4. On the **Enterprise applications** blade, select **All applications**. You'll see a list of the apps you can manage.

  ![Selecting the all applications command](./media/active-directory-coreapps-change-app-logo-azure-portal/all-applications.png)

5. On the **Enterprise applications - All apps** blade, select an app.

6. On the ***appname*** blade (that is, the blade with the name of the selected app in the title), select **Properties**.

	![Selecting the properties command](./media/active-directory-coreapps-change-app-logo-azure-portal/select-app.png)

7. On the ***appname*** **- Properties** blade, browse for a file to use as a new logo, or edit the app name, or both.

	![Changing the app logo or nameproperties command](./media/active-directory-coreapps-change-app-logo-azure-portal/change-logo.png)

8. Select the **Save** command.

## Next steps

- [See all of my groups](active-directory-groups-view-azure-portal.md)
- [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)
- [Remove a user or group assignment from an enterprise app](active-directory-coreapps-remove-assignment-user-azure-portal.md)
- [Disable user sign-ins for an enterprise app](active-directory-coreapps-disable-app-azure-portal.md)
- [Allow a user who is not assigned to an enterprise app to sign in using existing credentials](active-directory-coreapps-allow-unassigned-access-azure-portal.md)
