---
title: Create collections for My Apps portals
description: Use My Apps collections to Customize My Apps pages for a simpler My Apps experience for your users. Organize applications into groups with separate tabs.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/02/2021
ms.author: jomondi
ms.collection: M365-identity-device-management
ms.reviewer: lenalepa
ms.custom: enterprise-apps

#customer intent: As an admin, I want to enable and create collections for My Apps portal in Azure AD so that I can create a simpler My Apps experience for users.
---

# Create collections on the My Apps portal

Your users can use the My Apps portal to view and start the cloud-based applications they have access to. By default, all the applications a user can access are listed together on a single page. To better organize this page for your users, if you have an Azure AD Premium P1 or P2 license you can set up collections. With a collection, you can group together applications that are related (for example, by job role, task, or project) and display them on a separate tab. A collection essentially applies a filter to the applications a user can already access, so the user sees only those applications in the collection that have been assigned to them.

> [!NOTE]
> This article covers how an admin can enable and create collections. For information for the end user about how to use the My Apps portal and collections, see [Access and use collections](https://support.microsoft.com/account-billing/organize-apps-using-collections-in-the-my-apps-portal-2dae6b8a-d8b0-4a16-9a5d-71ed4d6a6c1d).

## Prerequisites

To create collections on the My Apps portal, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Create a collection

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To create a collection, you must have an Azure AD Premium P1 or P2 license.

1. Sign in to the [Azure portal](https://portal.azure.com) as an admin with an Azure AD Premium P1 or P2 license.

2. Go to **Azure Active Directory** > **Enterprise Applications**.

3. Under **Manage**, select **App launchers**.

4. Select **New collection**. In the **New collection** page, enter a **Name** for the collection (we recommend not using "collection" in the name. Then enter a **Description**.

5. Select the **Applications** tab. Select **+ Add application**, and then in the **Add applications** page, select all the applications you want to add to the collection, or use the **Search** box to find applications.

   ![Add an application to the collection](media/acces-panel-collections/add-applications.png)

6. When you're finished adding applications, select **Add**. The list of selected applications appears. You can use the arrows to change the order of applications in the list.

7. Select the **Owners** tab. Select **+ Add users and groups**, and then in the **Add users and groups** page, select the users or groups you want to assign ownership to. When you're finished selecting users and groups, choose **Select**.

8. Select the **Users and groups** tab. Select **+ Add users and groups**, and then in the **Add users and groups** page, select the users or groups you want to assign the collection to. Or use the **Search** box to find users or groups. When you're finished selecting users and groups, choose **Select**.

9. Select **Review + Create**. The properties for the new collection appear.

> [!NOTE]
> Admin collections are managed through the [Azure portal](https://portal.azure.com), not from [My Apps portal](https://myapps.microsoft.com). For example, if you assign users or groups as an owner, then they can only manage the collection through the Azure portal.

> [!NOTE]
> There is a known issue with Office apps in collections. If you already have at least one Office app in a collection and want to add more, follow these steps: 
> 1. Select the collection you'd like to manage, then select the **Applications** tab.
> 2. Remove all Office apps from the collection but do not save the changes.
> 3. Select **+ Add application**.
> 4. In the **Add applications** page, select all the Office apps you want to add to the collection (including the ones that you removed in step 2).
> 5. When you're finished adding applications, select **Add**. The list of selected applications appears. You can use the arrows to change the order of applications in the list.
> 5. Select **Save** to apply the changes.

## View audit logs

The Audit logs record My Apps collections operations, including collection creation end-user actions. The following events are generated from My Apps:

* Create admin collection
* Edit admin collection
* Delete admin collection
* Self-service application adding (end user)
* Self-service application deletion (end user)

You can access audit logs in the [Azure portal](https://portal.azure.com) by selecting **Azure Active Directory** > **Enterprise Applications** > **Audit logs** in the Activity section. For **Service**, select **My Apps**.

## Get support for My Account pages

From the My Apps page, a user can select **My account** > **View account** to open their account settings. On the Azure AD **My Account** page, users can manage their security info, devices, passwords, and more. They can also access their Office account settings.

In case you need to submit a support request for an issue with the Azure AD account page or the Office account page, follow these steps so your request is routed properly:

* For issues with the **Azure AD "My Account"** page, open a support request from within the Azure portal. Go to **Azure portal** > **Azure Active Directory** > **New support request**.

* For issues with the **Office "My account"** page, open a support request from within the Microsoft 365 admin center. Go to **Microsoft 365 admin center** > **Support**.

## Next steps

[End-user experiences for applications in Azure Active Directory](end-user-experiences.md)
