---
title: Hide an application from user's experience in Azure Active Directory | Microsoft Docs
description: How to hide an application from user's experience in Azure Active Directory access panels or Office 365 launchers.
services: active-directory
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 11/05/2018
ms.author: barbkess
ms.reviewer: kasimpso

---

# Hide an application from user's experience in Azure Active Directory

If you have an application that you do not want to show on users’ access panels or Office 365 launchers, there are options to hide this app tile.  The following two options are available for hiding applications from user's app launchers.

- Hide a third-party application from users access panels and Office 365 app launchers
- Hide all Office 365 applications from users access panels

By hiding the application, users still have permissions to the application, but will not see them appear on their app launchers. You must have the appropriate permissions to manage the enterprise application, and you must be a global admin for the directory.


## Hiding an application from user's end user experiences
You can use the steps below, depending on your situation, to hide applications from the access panel.

### Hide a third-party application from the user
Use the following steps to hide an application from a user's access panel and Office 365 application launcher.

1.	Sign in to the [Azure portal](https://portal.azure.com) as the global administrator for your directory.
2.	Select **Azure Active Directory**.
3.	Select **Enterprise applications**. The **Enterprise applications - All applications** blade opens.
4.	Under **Application Type**, select **Enterprise Applications**, if it is not already selected.
5.	Search for the application you want to hide, and click the application.  The applicaion's overview opens.
6.	Click **Properties**. 
7.	For the **Visible to users?** question, click **No**.
8.	Click **Save**.


### How do I hide Office 365 applications from user's access panel?

Use the following steps to hide all Office 365 applications from the access panel. These apps will still be visible in the Office 365 portal.

1.	Sign in to the [Azure portal](https://portal.azure.com) as a global administrator for your directory.
2.	Select **Azure Active Directory**.
3.	Select **User settings**.
4.	Under **Enterprise applications**, click **Manage how end users launch and view their applications.**
5.	For the **Users can only see Office 365 apps in the Office 365 portal** setting, click **Yes**.
6.	Click **Save**.


## Next steps
* [See all my groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Assign a user or group to an enterprise app](assign-user-or-group-access-portal.md)
* [Remove a user or group assignment from an enterprise app](remove-user-or-group-access-portal.md)
* [Change the name or logo of an enterprise app](change-name-or-logo-portal.md)

