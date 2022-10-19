---
title: Extensions app in Azure Active Directory B2C  
titleSuffix: Azure AD B2C
description: Restoring the b2c-extensions-app.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 11/02/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Extensions app in Azure AD B2C

When an Azure AD B2C directory is created, an app called **b2c-extensions-app** is automatically created inside the new directory. This app is visible in *App registrations*. It is used by the Azure AD B2C service to store information about users and custom attributes. If the app is deleted, Azure AD B2C will not function correctly and your production environment will be affected.

> [!IMPORTANT]
> Do not delete the **b2c-extensions-app** unless you are planning to immediately delete your tenant. If the app remains deleted for more than 30 days, user information will be permanently lost.

## Verifying that the extensions app is present

To verify that the b2c-extensions-app is present:

1. Inside your Azure AD B2C tenant, click on **All services** in the left-hand navigation menu.
1. Search for and open **App registrations**.
1. Look for an app that begins with **b2c-extensions-app**

## Recover the extensions app

If you accidentally deleted the `b2c-extensions-app`, you have 30 days to recover it.

> [!NOTE]
> An application can only be restored if it has been deleted within the last 30 days. If it has been more than 30 days, data will be permanently lost. For more assistance, file a support ticket.

<!--Hide portal steps until SP bug is fixed
### Recover the extensions app using the Azure portal

1. Sign in to your Azure AD B2C tenant.
2. Search for and open **App registrations**.
1. Select the **Deleted applications** tab and identify the `b2c-extensions-app` from the list of recently deleted applications.
1. Select **Restore app registration**.

You should now be able to [see the restored app](#verifying-that-the-extensions-app-is-present) in the Azure portal.
-->
### Recover the extensions app using Microsoft Graph
To restore the app using Microsoft Graph, you must restore both the application object and the service principal. For more information, see the [Restore deleted item](/graph/api/directory-deleteditems-restore) API.

To restore the application object:
1. Browse to [https://developer.microsoft.com/en-us/graph/graph-explorer](https://developer.microsoft.com/en-us/graph/graph-explorer).
1. Log in to the site as a global administrator for the Azure AD B2C directory that you want to restore the deleted app for. This global administrator must have an email address similar to the following: `username@{yourTenant}.onmicrosoft.com`.
1. Issue an HTTP GET against the URL `https://graph.microsoft.com/v1.0/directory/deleteditems/microsoft.graph.application`. This operation will list all of the applications that have been deleted within the past 30 days. You can also use the URL `https://graph.microsoft.com/v1.0/directory/deletedItems/microsoft.graph.application?$filter=displayName eq 'b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.'` to filter by the app's **displayName** property.
1. Find the application in the list where the name begins with `b2c-extensions-app` and copy its `id` property value.
1. Issue an HTTP POST against the URL `https://graph.microsoft.com/v1.0/directory/deleteditems/{id}/restore`. Replace the `{id}` portion of the URL with the `id` from the previous step.]

To restore the service principal object:
1. Issue an HTTP GET against the URL `https://graph.microsoft.com/v1.0/directory/deleteditems/microsoft.graph.servicePrincipal`. This operation will list all of the service principals that have been deleted within the past 30 days. You can also use the URL `https://graph.microsoft.com/v1.0/directory/deletedItems/microsoft.graph.servicePrincipal?$filter=displayName eq 'b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.'` to filter by the app's **displayName** property.
1. Find the service principal in the list where the name begins with `b2c-extensions-app` and copy its `id` property value.
1. Issue an HTTP POST against the URL `https://graph.microsoft.com/v1.0/directory/deleteditems/{id}/restore`. Replace the `{id}` portion of the URL with the `id` from the previous step.

You should now be able to [see the restored app](#verifying-that-the-extensions-app-is-present) in the Azure portal.
