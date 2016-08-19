<properties
	pageTitle="Disable user sign-ins for an enterprise app in Azure Active Directory | Microsoft Azure"
	description="How to disable an enterprise application so that no users may sign in to it in Azure Active Directory"
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


# Disable user sign-ins for an enterprise app in Azure Active Directory

It's easy to disable an enterprise application so that no users may sign in to it in Azure Active Directory (Azure AD). You must have the appropriate permissions to manage the enterprise app. In the current preview, you must be global admin for the directory.

## How do I disable user sign-ins?

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **More services**, enter Active Directory in the text box, and then select **Enter**.

3. On the **Azure Active Directory - *directoryname*** blade (that is, the Azure AD blade for the directory you are managing), select **Enterprise apps**.

    ![Opening Enterprise apps](./media/active-directory-coreapps-disable-app-azure-portal/open-enterprise-apps.png)

4. On the **Enterprise applications** blade, select **All applications**. You see a list of the apps you can manage.

  ![Selecting the all applications command](./media/active-directory-coreapps-disable-app-azure-portal/all-applications.png)

5. On the **Enterprise applications - All apps** blade, select an app.

6. On the ***appname*** blade (that is, the blade with the name of the selected app in the title), select **Properties**.

	![Selecting the all applications command](./media/active-directory-coreapps-disable-app-azure-portal/select-app.png)

7. On the ***appname*** **- Properties** blade, select **No** for **Enabled for users to sign-in?**.

8. Select the **Save** command.

## Next steps

- [See all my groups](active-directory-groups-view-azure-portal.md)
- [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)
- [Remove a user or group assignment from an enterprise app](active-directory-coreapps-remove-assignment-user-azure-portal.md)
- [Allow a user who is not assigned to an enterprise app to sign in using existing credentials](active-directory-coreapps-allow-unassigned-access-azure-portal.md)
- [Change the name or logo of an enterprise app](active-directory-coreapps-change-app-logo-azure-portal.md)
