---
title: How to restrict your app to a set of users  | Microsoft Docs 
description: Learn how to restrict access to your apps registered in Azure AD to selected set of users.
services: active-directory
documentationcenter: ''
author: kkrishna
manager: beatrizd
editor: ''
ms.assetid: 8e976d06-1f02-460b-b76c-99aa33892533
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 9/5/2018
ms.author: kkrishna
ms.reviewer: ''
ms.custom: aaddev
#Customer intent: As an application developer, I want to restrict an application that I have registred in Azure AD to a select set of users available in my Azure AD tenant
---
# How to restrict your app to a set of users

Applications registered in an Azure Active Directory (Azure AD) tenant are by default available to all users of the tenant who authenticate successfully.

Similarly, in case of a [multi-tenant](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant) app, all users in the Azure AD tenant where this app is provisioned will be able to access this application once they successfully authenticate in their respective tenant.

Tenant administrators and developers often have requirements where an app is to be restricted to a certain set of users. Developers can accomplish the same by using popular authorization patterns like Role Based Access Control (RBAC), but this approach requires a significant amount of work on part of the developer.

Azure AD allows Tenant administrators and developers to restrict an app to a specific set of users or security groups in the tenant.

## This option only works with the following application types

1. Applications configured for Federated Single Sign-on with SAML-based Authentication

1. Application Proxy applications that use Azure Active Directory Pre-Authentication

1. Applications built directly on the Azure AD application platform that use OAuth2.0/OpenID Connect Authentication after a user or admin has consented to that application.
     >This feature is available for Web App/Api and Enterprise applications only. Apps that are registered as [Native](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) cannot be restricted to a set of users or security groups in the tenant.

## Quickstart: Restrict your app to a set of users

### Update the app's properties to enable user assignment

1. Open the [**Azure portal**](https://portal.azure.com/) and sign-in as a **Global Administrator.**

1. On the top bar, click on the signed-in account. Under **Directory**, select the Azure AD tenant where the app will be registered.

1. In the navigation on the left, select **Azure Active Directory**. If Azure Active Directory is not available in the navigation pane, then follow the following steps
    * Click **All services** at the top of the main left-hand navigation menu.
    * Type in **Azure Active Directory** in the filter search box and select the **Azure Active Directory** item from the result.

1. In the **Azure Active Directory** pane, click on **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

1. Click **All Applications** to view a list of all your applications.

    > If you do not see the application you want show up here, use the variousf ilters at the top of the **All Applications List** to restrict the list or scroll down the list to locate your application.

1. Select the application you want to assign a user or security group to from the list.

1. In the application's **Overview** page, click **Properties** from the application’s left-hand navigation menu.

1. Locate the setting **User assignment required?** and flip it to **Yes**. When this option is set to yes, then users must first be assigned to this application before being able to access it.

1. Press the **Save** on top to save this configuration change.

### Assign users and groups to this app

1. Now click the **Users and Groups** pane in the application’s left-hand navigation menu.

1. Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

1. Click the **Users and groups** selector from the **Add Assignment** pane. A list of users and security groups will be shown along with a textbox to search and locate a certain user or group. This screen allows you to select multiple users and groups in one go.

1. Once you are done selecting the users and groups, press the **Select** button on bottom to move to the next part.

1. Press the **Assign** button on the bottom to finish the assignments os users and groups to the app.
