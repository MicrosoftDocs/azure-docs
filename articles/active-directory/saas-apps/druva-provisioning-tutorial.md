---
title: 'Tutorial: Configure Druva for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Druva.
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

# Tutorial: Configure Druva for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Druva and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Druva.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* [A Druva tenant](https://www.druva.com/products/pricing-plans/).
* A user account in Druva with Admin permissions.

## Assigning users to Druva

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Druva. Once decided, you can assign these users and/or groups to Druva by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Druva

* It is recommended that a single Microsoft Entra user is assigned to Druva to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Druva, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Druva for provisioning

Before configuring Druva for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on Druva.

1. Sign in to your [Druva Admin Console](https://console.druva.com). Navigate to **Druva** > **inSync**.

    ![Druva Admin Console](media/druva-provisioning-tutorial/menubar.png)

2. Navigate to **Manage** > **Deployments** > **Users**.

    :::image type="content" source="media/druva-provisioning-tutorial/manage.png" alt-text="Screenshot of the Druva admin console. Manage is highlighted, and the Manage menu is visible. In that menu, under Deployments, Users is highlighted." border="false":::

3. Navigate to **Settings**. Click **Generate Token**.

    :::image type="content" source="media/druva-provisioning-tutorial/settings.png" alt-text="Screenshot of a page in the Druva admin console. Settings is highlighted, and the Settings tab is open. The Generate token button is highlighted." border="false":::

4. Copy the **Auth token** value. This value will be entered in the **Secret Token** field in the Provisioning tab of your Druva application.

    :::image type="content" source="media/druva-provisioning-tutorial/auth.png" alt-text="Screenshot of the Create token page in the Druva admin console. A link labeled Copy Token is available for copying the Auth token value." border="false":::

## Add Druva from the gallery

To configure Druva for automatic user provisioning with Microsoft Entra ID, you need to add Druva from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Druva from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Druva**, select **Druva** in the search box.
1. Select **Druva** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
    ![Druva in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Druva 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Druva based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Druva, following the instructions provided in the [Druva Single sign-on tutorial](druva-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-druva-in-azure-ad'></a>

### To configure automatic user provisioning for Druva in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

    ![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Druva**.

    ![The Druva link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

    ![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

    ![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input `https://apis.druva.com/insync/scim` in **Tenant URL**. Input the **Auth token** value in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Druva. If the connection fails, ensure your Druva account has Admin permissions and try again.

    ![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications, and select **Send an email notification when a failure occurs**.

    ![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Druva**.

    ![Druva User Mappings](media/druva-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to Druva in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Druva for update operations. Select the **Save** button to commit any changes.

    ![Druva User Attributes](media/druva-provisioning-tutorial/userattribute.png)


10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Druva, change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Druva by choosing the desired values in **Scope** in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

    This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Druva.

    For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* Druva requires **email** as a mandatory attribute. 

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
