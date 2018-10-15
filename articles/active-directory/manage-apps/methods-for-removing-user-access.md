---
title: How to remove a user's access to an application | Microsoft Docs
description: Understand how to remove a user's access to an application
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid:
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess

---

# How to remove a user's access to an application

This article helps you to understand how to remove a user's access to an application.

## I want to remove a specific user’s or group’s assignment to an application

To remove a user or group assignment to an application, follow the steps listed in the [Remove a user or group assignment from an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-remove-assignment-azure-portal) article.

.## I want to disable all access to an application for every user

To disable all user sign-ins to an application, follow the steps listed in the [Disable user sign-ins for an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-disable-app-azure-portal) article.

## I want to delete an application entirely

To **delete an application**, follow these instructions:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  Click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  Click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to delete.

7.  Once the application loads, click **Delete** icon from the top application’s **Overview** pane.

## I want to disable all future user consent operations to any application

Disabling user consent for your entire directory prevent end users from consenting to any application. Administrators can still consent on user’s behalves. To learn more about application consent, and why you may or may not wish to do this, read [Understanding user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview#understanding-user-and-admin-consent).

To **disable all future user consent operations in your entire directory**, follow these instructions:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  Click **Users and groups** in the navigation menu.

5.  Click **User settings**.

6.  Disable all future user consent operations by setting the **Users can allow apps to access their data** toggle to **No** and click the **Save** button.


# Next steps
[Managing access to apps](what-is-access-management.md)
