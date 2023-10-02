---
title: 'Tutorial: Configure Elium for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Elium.
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

# Tutorial: Configure Elium for automatic user provisioning

This tutorial shows how to configure Elium and Microsoft Entra ID to automatically provision and de-provision users or groups to Elium.

> [!NOTE]
> This tutorial describes a connector that's built on top of the Microsoft Entra user Provisioning service. For important details about what this service does and how it works, and for frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>
> This connector is currently in preview. For more information about previews, see [Universal License Terms For Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

## Prerequisites

This tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [An Elium tenant](https://www.elium.com/pricing/)
* A user account in Elium, with admin permissions

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Assigning users to Elium

Microsoft Entra ID uses a concept called *assignments* to determine which users receive access to selected apps. In the context of automatic user provisioning, only the users and groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before you configure and enable automatic user provisioning, decide which users and groups in Microsoft Entra ID need access to Elium. Then, assign those users and groups to Elium by following the steps in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

## Important tips for assigning users to Elium 

We recommend that you assign a single Microsoft Entra user to Elium to test the automatic user-provisioning configuration. More users and groups can be assigned later.

When assigning a user to Elium, you must select a valid, application-specific role (if any are available) in the assignment dialog box. Users who have the **Default Access** role are excluded from provisioning.

## Set up Elium for provisioning

Before configuring Elium for automatic user provisioning with Microsoft Entra ID, you must enable System for Cross-domain Identity Management (SCIM) provisioning on Elium. Follow these steps:

1. Sign in to Elium and go to **My Profile** > **Settings**.

    ![Settings menu item in Elium](media/Elium-provisioning-tutorial/setting.png)

1. In the lower-left corner, under **ADVANCED**, select **Security**.

    ![Security link in Elium](media/Elium-provisioning-tutorial/security.png)

1. Copy the **Tenant URL** and **Secret token** values. You'll use these values later, in corresponding fields in the **Provisioning** tab of your Elium application.

    ![Tenant URL and Secret token fields in Elium](media/Elium-provisioning-tutorial/token.png)

## Add Elium from the gallery

To configure Elium for automatic user provisioning with Microsoft Entra ID, you must also add Elium from the Microsoft Entra application gallery to your list of managed software-as-a-service (SaaS) applications. Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

     ![Microsoft Entra Enterprise applications blade](common/enterprise-applications.png)

1. To add a new application, select **New application** at the top of the pane.

    ![New application link](common/add-new-app.png)

1. In the search box, type **Elium**, select **Elium** in the results list, and then select **Add** to add the application.

    ![Gallery search box](common/search-new-app.png)

## Configure automatic user provisioning to Elium

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and groups in Elium, based on user and group assignments in Microsoft Entra ID.

> [!TIP]
> You might also choose to enable single sign-on for Elium based on Security Assertion Markup Language (SAML) by following the instructions in the [Elium single sign-on tutorial](Elium-tutorial.md). You can configure single sign-on independently of automatic user provisioning, although the two features complement each other.

To configure automatic user provisioning for Elium in Microsoft Entra ID, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

    ![Microsoft Entra Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Elium**.

    ![Applications list in the Enterprise applications blade](common/all-applications.png)

1. Select the **Provisioning** tab.

    ![Provisioning tab in the Enterprise applications blade](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

    ![Automatic setting for Provisioning Mode](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, type **\<tenantURL\>/scim/v2** in the **Tenant URL** field. (The **tenantURL** is the value retrieved earlier from the Elium admin console.) Also type the Elium **Secret token** value in the **Secret Token** field. Finally, select **Test Connection** to verify that Microsoft Entra ID can connect to Elium. If the connection fails, make sure that your Elium account has admin permissions and try again.

    ![Tenant URL and Secret Token fields in Admin Credentials](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who will receive the provisioning error notifications. Then, select the **Send an email notification when a failure occurs** check box.

    ![Notification Email](common/provisioning-notification-email.png)

1. Click **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Elium**.

    ![Synchronize link for mapping Microsoft Entra users to Elium](media/Elium-provisioning-tutorial/usermapping.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to Elium in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Elium for update operations. Select **Save** to commit any changes.

    ![Attribute mappings between Microsoft Entra ID and Elium](media/Elium-provisioning-tutorial/userattribute.png)

1. To configure scoping filters, follow the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Elium, change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status set to On](common/provisioning-toggle-on.png)

1. Define the users and groups that you would like to provision to Elium by selecting the values you want in the **Scope** drop-down list box in the **Settings** section.

    ![Provisioning Scope list box](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

    ![Save button for provisioning configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and groups defined in **Scope** in the **Settings** section. This initial sync process takes longer than later syncs. For more information about the time required for provisioning, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

Use the **Current Status** section to monitor progress and follow links to your provisioning activity report. The provisioning activity report describes all actions performed by the Microsoft Entra provisioning service on Elium. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
