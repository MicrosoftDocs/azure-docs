---
title: Extensions app in Azure Active Directory B2C | Microsoft Docs
description: Restoring the b2c-extensions-app.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/06/2017
ms.author: marsma
ms.subservice: B2C
---

# Azure AD B2C: Extensions app

When an Azure AD B2C directory is created, an app called `b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.` is automatically created inside the new directory. This app, referred to as the **b2c-extensions-app**, is visible in *App registrations*. It is used by the Azure AD B2C service to store information about users and custom attributes. If the app is deleted, Azure AD B2C will not function correctly and your production environment will be affected.

> [!IMPORTANT]
> Do not delete the b2c-extensions-app unless you are planning to immediately delete your tenant. If the app remains deleted for more than 30 days, user information will be permanently lost.

## Verifying that the extensions app is present

To verify that the b2c-extensions-app is present:

1. Inside your Azure AD B2C tenant, click on **All services** in the left-hand navigation menu.
1. Search for and open **App registrations**.
1. Look for an app that begins with **b2c-extensions-app**

## Recover the extensions app

If you accidentally deleted the b2c-extensions-app, you have 30 days to recover it. You can restore the app using the Graph API:

1. Browse to [https://graphexplorer.azurewebsites.net/](https://graphexplorer.azurewebsites.net/).
1. Log in to the site as a global administrator for the Azure AD B2C directory that you want to restore the deleted app for. This global administrator must have an email address similar to the following: `username@{yourTenant}.onmicrosoft.com`.
1. Issue an HTTP GET against the URL `https://graph.windows.net/myorganization/deletedApplications` with api-version=1.6. This operation will list all of the applications that have been deleted within the past 30 days.
1. Find the application in the list where the name begins with 'b2c-extension-app’ and copy its `objectid` property value.
1. Issue an HTTP POST against the URL `https://graph.windows.net/myorganization/deletedApplications/{OBJECTID}/restore`. Replace the `{OBJECTID}` portion of the URL with the `objectid` from the previous step.

You should now be able to [see the restored app](#verifying-that-the-extensions-app-is-present) in the Azure portal.

> [!NOTE]
> An application can only be restored if it has been deleted within the last 30 days. If it has been more than 30 days, data will be permanently lost. For more assistance, file a support ticket.
