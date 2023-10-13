---
title: 'Tutorial: Configure GoToMeeting for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure single sign-on between Microsoft Entra ID and GoToMeeting.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Configure GoToMeeting for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in GoToMeeting and Microsoft Entra ID to automatically provision and de-provision user accounts from Microsoft Entra ID to GoToMeeting.

> [!WARNING]
> This provisioning integration is no longer supported. As a result of this, the provisioning functionality of the GoToMeeting application in the Microsoft Entra Enterprise App Gallery will be removed soon. The application's SSO functionality will remain intact. Microsoft is working with GoToMeeting to build a new modernized provisioning integration, but there are no timelines on when this will be completed. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   A Microsoft Entra tenant.
*   A GoToMeeting single  sign-on enabled subscription.
*   A user account in GoToMeeting with Team Admin permissions.

## Assigning users to GoToMeeting

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Microsoft Entra ID is synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Microsoft Entra ID represent the users who need access to your GoToMeeting app. Once decided, you can assign these users to your GoToMeeting app by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to GoToMeeting

*   It is recommended that a single Microsoft Entra user is assigned to GoToMeeting to test the provisioning configuration. Additional users and/or groups may be assigned later.

*   When assigning a user to GoToMeeting, you must select a valid user role. The "Default Access" role does not work for provisioning.

## Enable Automated User Provisioning

This section guides you through connecting your Microsoft Entra ID to GoToMeeting's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in GoToMeeting based on user and group assignment in Microsoft Entra ID.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for GoToMeeting, following the instructions provided in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### To configure automatic user account provisioning:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. If you have already configured GoToMeeting for single sign-on, search for your instance of GoToMeeting using the search field. Otherwise, select **Add** and search for **GoToMeeting** in the application gallery. Select GoToMeeting from the search results, and add it to your list of applications.

1. Select your instance of GoToMeeting, then select the **Provisioning** tab.

1. Set the **Provisioning** Mode to **Automatic**. 

    ![Screenshot of the Provisioning tab for GoToMeeting in Azure portal. Provisioning Mode is set to Automatic and Admin Username, Password and Test Connection are highlighted.](https://user-images.githubusercontent.com/49566142/135871050-9d63861d-7963-47e0-bbdf-0e7c947e0b41.png)


1. Under the Admin Credentials section, click **Authorize** and log into GoToMeeting in pop-up windows that appears
   

1. Select **Test Connection** to ensure Microsoft Entra ID can connect to your GoToMeeting app. If the connection fails, ensure your GoToMeeting account has Team Admin permissions and try the **"Admin Credentials"** step again.


1. Click **Save.**

1. Under the Mappings section, select **Synchronize Microsoft Entra users to GoToMeeting.**

1. In the **Attribute Mappings** section, review the user attributes that are synchronized from Microsoft Entra ID to GoToMeeting. The attributes selected as **Matching** properties are used to match the user accounts in GoToMeeting for update operations. Select the Save button to commit any changes.

1. To enable the Microsoft Entra provisioning service for GoToMeeting, change the **Provisioning Status** to **On** in the Settings section

1. Click **Save.**

It starts the initial synchronization of any users and/or groups assigned to GoToMeeting in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your GoToMeeting app.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](tutorial-list.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Configure Single Sign-on](./citrix-gotomeeting-tutorial.md)
