---
title: Change the name or logo of an enterprise app in Azure Active Directory | Microsoft Docs
description: How to change the name or logo for a custom enterprise app in Azure Active Directory
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/28/2017
ms.author: barbkess
ms.reviewer: asteen
ms.custom: it-pro
---
# Change the name or logo of an enterprise app in Azure Active Directory
It's easy to change the name or logo for a custom enterprise application in Azure Active Directory (Azure AD). You must have the appropriate permissions to make these changes, and you must be the creator of the custom app.

## How do I change an enterprise app's name or logo?
1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
2. Select **All services**, enter **Azure Active Directory** in the text box, and then select **Enter**.
3. On the **Azure Active Directory - *directoryname*** pane (that is, the Azure AD pane for the directory you are managing), select **Enterprise applications**.

    ![Opening Enterprise apps](./media/change-name-or-logo-portal/open-enterprise-apps.png)
4. On the **Enterprise applications** pane, select **All applications**. You see a list of the apps you can manage.
5. On the **Enterprise applications - All applications** pane, select an app.
6. On the ***appname*** pane (that is, the pane with the name of the selected app in the title), select **Properties**.

    ![Selecting the properties command](./media/change-name-or-logo-portal/select-app.png)
7. On the ***appname*** **- Properties** pane, browse for a file to use as a new logo, or edit the app name, or both.

    ![Changing the app logo or nameproperties command](./media/change-name-or-logo-portal/change-logo.png)
8. Select the **Save** command.

## Next steps
* [See all of my groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Assign a user or group to an enterprise app](assign-user-or-group-access-portal.md)
* [Remove a user or group assignment from an enterprise app](remove-user-or-group-access-portal.md)
* [Disable user sign-ins for an enterprise app](disable-user-sign-in-portal.md)
