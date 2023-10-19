---
title: 'Tutorial: Configure Foodee for automatic user provisioning by using Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and deprovision user accounts to Foodee.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Foodee for automatic user provisioning

This article shows you how to configure Microsoft Entra ID in Foodee and Microsoft Entra ID to automatically provision or deprovision users or groups to Foodee.

> [!NOTE]
> The article describes a connector that's built on top of the Microsoft Entra user Provisioning service. To learn what this service does and how it works, and to get answers to frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>
> This connector is currently in preview. For more information about previews, see [Universal License Terms For Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

## Prerequisites

This tutorial assumes that you've met the following prerequisites:

* A Microsoft Entra tenant
* [A Foodee tenant](https://www.food.ee/about/)
* A user account in Foodee with Admin permissions

## Assign users to Foodee 

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before you configure and enable automatic user provisioning, you should decide which users or groups in Microsoft Entra ID need access to Foodee. After you've made this determination, you can assign these users or groups to Foodee by following the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

## Important tips for assigning users to Foodee 

When you're assigning users, keep the following tips in mind:

* We recommend that you assign only a single Microsoft Entra user to Foodee to test the configuration of automatic user provisioning. You can assign additional users or groups later.

* When you're assigning a user to Foodee, select any valid application-specific role, if it's available, in the **Assignment** pane. Users who have the *Default Access* role are excluded from provisioning.

## Set up Foodee for provisioning

Before you configure Foodee for automatic user provisioning by using Microsoft Entra ID, you need to enable System for Cross-domain Identity Management (SCIM) provisioning in Foodee.

1. Sign in to [Foodee](https://www.food.ee/login/), and then select your tenant ID.

	:::image type="content" source="media/Foodee-provisioning-tutorial/tenant.png" alt-text="Screenshot of the main menu of the Foodee enterprise portal. A tenant id placeholder is visible in the menu." border="false":::

1. Under **Enterprise portal**, select **Single Sign On**.

	![The Foodee Enterprise Portal left-pane menu](media/Foodee-provisioning-tutorial/scim.png)

1. Copy the value in the **API Token** box for later use. You'll enter it in the **Secret Token** box in the **Provisioning** tab of your Foodee application.

	:::image type="content" source="media/Foodee-provisioning-tutorial/token.png" alt-text="Screenshot of a page in the Foodee enterprise portal. An A P I token value is highlighted." border="false":::

## Add Foodee from the gallery

To configure Foodee for automatic user provisioning by using Microsoft Entra ID, you need to add Foodee from the Microsoft Entra application gallery to your list of managed SaaS applications.

To add Foodee from the Microsoft Entra application gallery, do the following:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add a new application, select **New application** at the top of the pane.

	![The New application button](common/add-new-app.png)

1. In the search box, enter **Foodee**, select **Foodee** in the results pane, and then select **Add** to add the application.

	![Foodee in the results list](common/search-new-app.png)

## Configure automatic user provisioning to Foodee 

In this section, you configure the Microsoft Entra provisioning service to create, update, and disable users or groups in Foodee based on user or group assignments in Microsoft Entra ID.

> [!TIP]
> You can also enable SAML-based single sign-on for Foodee by following the instructions in the [Foodee single sign-on tutorial](Foodee-tutorial.md). You can configure single sign-on independent of automatic user provisioning, though these two features complement each other.

Configure automatic user provisioning for Foodee in Microsoft Entra ID by doing the following:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

	![Enterprise applications pane](common/enterprise-applications.png)

1. In the **Applications** list, select **Foodee**.

	![The Foodee link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. In the **Provisioning Mode** drop-down list, select **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

1. Under **Admin Credentials**, do the following:

   a. In the **Tenant URL** box, enter the **https:\//concierge.food.ee/scim/v2** value that you retrieved earlier.

   b. In the **Secret Token** box, enter the **API Token** value that you retrieved earlier.
   
   c. To ensure that Microsoft Entra ID can connect to Foodee, select **Test Connection**. If the connection fails, ensure that your Foodee account has administrator permissions, and then try again.

	![The Test Connection link](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications, and then select the **Send an email notification when a failure occurs** check box.

	![The Notification Email text box](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under **Mappings**, select **Synchronize Microsoft Entra users to Foodee**.

	:::image type="content" source="media/Foodee-provisioning-tutorial/usermapping.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to Foodee is highlighted." border="false":::

1. Under **Attribute Mappings**, review the user attributes that are synchronized from Microsoft Entra ID to Foodee. The attributes that are selected as **Matching** properties are used to match the *user accounts* in Foodee for update operations. 

	:::image type="content" source="media/Foodee-provisioning-tutorial/userattribute.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra ID and Foodee attributes and the matching precedence." border="false":::

1. To commit your changes, select **Save**.
1. Under **Mappings**, select **Synchronize Microsoft Entra groups to Foodee**.

	:::image type="content" source="media/Foodee-provisioning-tutorial/groupmapping.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra groups to Foodee is highlighted." border="false":::

1. Under **Attribute Mappings**, review the user attributes that are synchronized from Microsoft Entra ID to Foodee. The attributes that are selected as **Matching** properties are used to match the *group accounts* in Foodee for update operations.

	:::image type="content" source="media/Foodee-provisioning-tutorial/groupattribute.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra attributes, Foodee attributes, and the matching precedence." border="false":::

1. To commit your changes, select **Save**.
1. Configure the scoping filters. To learn how, refer to the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Foodee, in the **Settings** section, change the **Provisioning Status** to **On**.

	![The Provisioning Status switch](common/provisioning-toggle-on.png)

1. Under **Settings**, in the **Scope** drop-down list, define the users or groups that you want to provision to Foodee.

	![The Provisioning Scope drop-down list](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![The Provisioning Configuration Save button](common/provisioning-configuration-save.png)

The preceding operation starts the initial synchronization of the users or groups that you've defined in the **Scope** drop-down list. The initial sync takes longer to perform than subsequent syncs. For more information, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report. The report describes all actions that are performed by the Microsoft Entra provisioning service on Foodee. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
