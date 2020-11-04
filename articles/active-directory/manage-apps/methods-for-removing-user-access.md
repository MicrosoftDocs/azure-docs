---
title: How to remove a user's access to an application in Azure Active Directory
description: Understand how to remove a user's access to an application in Azure Active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 11/02/2020
ms.author: kenwith
---

# How to remove a user's access to an application

This article helps you to understand how to remove a user's access to an application.

## I want to remove a specific user’s or group’s assignment to an application

To remove a user or group assignment to an application, follow the steps listed in the [Remove a user or group assignment from an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-remove-assignment-azure-portal) article.

## I want to disable all access to an application for every user

To disable all user sign-ins to an application, follow the steps listed in the [Disable user sign-ins for an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-disable-app-azure-portal) article.

## I want to delete an application entirely

The [Quickstart Series on Application Management](delete-application-portal.md) includes guidance on deleting an application from your Azure Active Directory tenant.

## I want to disable all future user consent operations to any application

Disabling user consent for your entire directory prevent end users from consenting to any application. Administrators can still consent on user’s behalf. For more information about application consent, and why you may or may not wish to do this, read [Understanding user and admin consent](../develop/howto-convert-app-to-be-multi-tenant.md#understand-user-and-admin-consent). See also, [Permissions and consent](../develop/v2-permissions-and-consent.md).

To **disable all future user consent operations in your entire directory**, follow these instructions:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** 

3.  Click **Enterprise applications** in the navigation menu.

5.  Click **User settings**.

6.  Set the **Users can allow apps to access company data on their behalf** toggle to **No** and click the Save button.


## Next steps

[Managing access to apps](what-is-access-management.md)
