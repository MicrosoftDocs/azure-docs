---
title: 'Tutorial: Configure Zscaler Beta for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Zscaler Beta.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Configure Zscaler Beta for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Zscaler Beta and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Zscaler Beta.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>


## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

* A Microsoft Entra tenant
* A Zscaler Beta tenant
* A user account in Zscaler Beta with Admin permissions

> [!NOTE]
> The Microsoft Entra provisioning integration relies on the Zscaler Beta SCIM API, which is available to Zscaler Beta developers for accounts with the Enterprise package.

## Adding Zscaler Beta from the gallery

Before configuring Zscaler Beta for automatic user provisioning with Microsoft Entra ID, you need to add Zscaler Beta from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Zscaler Beta from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **Zscaler Beta**, select **Zscaler Beta** from result panel then click **Add** button to add the application.

	![Zscaler Beta in the results list](common/search-new-app.png)

## Assigning users to Zscaler Beta

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Zscaler Beta. Once decided, you can assign these users and/or groups to Zscaler Beta by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Zscaler Beta

* It is recommended that a single Microsoft Entra user is assigned to Zscaler Beta to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Zscaler Beta, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Zscaler Beta

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Zscaler Beta based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Zscaler Beta, following the instructions provided in the [Zscaler Beta single sign-on tutorial](zscaler-beta-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

> [!NOTE]
> When users and groups are provisioned or de-provisioned we recommend to periodically restart provisioning to ensure that group memberships are properly updated. Doing a restart will force our service to re-evaluate all the groups and update the memberships.  

<a name='to-configure-automatic-user-provisioning-for-zscaler-beta-in-azure-ad'></a>

### To configure automatic user provisioning for Zscaler Beta in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zscaler Beta**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Zscaler Beta**.

	![The Zscaler Beta link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![There is a list of tabs arranged into categories, and titled ZScaler Beta - Provisioning / Enterprise Application. The Provision tab of the Manage category is selected.](./media/zscaler-beta-provisioning-tutorial/provisioning-tab.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![The Automatic mode has been selected from the Provisioning Mode drop-down list. There are fields for Admin Credentials, used to connect to the Zscaler Beta API, and there is a Test Connection button.](./media/zscaler-beta-provisioning-tutorial/provisioning-credentials.png)

1. Under the **Admin Credentials** section, input the **Tenant URL** and **Secret Token** of your Zscaler Beta account as described in Step 6.

1. To obtain the **Tenant URL** and **Secret Token**, navigate to **Administration > Authentication Settings** in the Zscaler Beta portal user interface and click on **SAML** under **Authentication Type**.

	![On Authentication Settings, in the Authentication Profile, the selected Directory Type is Hosted DB, and the selected Authentication Type is SAML.](./media/zscaler-beta-provisioning-tutorial/secret-token-1.png)

	Click on **Configure SAML** to open the **Configuration SAML** options.

	![On Configure SAML, the Enable SAML Auto-Provisioning and the Enable SCIM-Based Provisioning options are selected. The Base URL and Bearer Token text boxes are highlighted.](./media/zscaler-beta-provisioning-tutorial/secret-token-2.png)

	Select **Enable SCIM-Based Provisioning** to retrieve **Base URL** and **Bearer Token**, then save the settings. Copy the **Base URL** to **Tenant URL**, and **Bearer Token**  to **Secret Token**.

1. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Microsoft Entra ID can connect to Zscaler Beta. If the connection fails, ensure your Zscaler Beta account has Admin permissions and try again.

	![On Admin Credentials, the Tenant URL and Secret Token fields have values, and the Test Connection button is highlighted.](./media/zscaler-beta-provisioning-tutorial/test-connection.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![The Notification Email text box is empty, and the Send an email notification when a failure occurs checkbox is cleared.](./media/zscaler-beta-provisioning-tutorial/notification.png)

1. Click **Save**.
 
1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Zscaler Beta**.

	![The Synchronize Microsoft Entra users to ZScalerBeta is selected and enabled.](./media/zscaler-beta-provisioning-tutorial/user-mappings.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to Zscaler Beta in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zscaler Beta for update operations. Select the **Save** button to commit any changes.

	![In the Attribute Mappings section for user attributes, the Active Directory attributes are shown next to the Zscalar Beta attributes they are synchronized with. One pair of attributes is shown as Matching.](./media/zscaler-beta-provisioning-tutorial/user-attribute-mappings.png)

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Zscaler Beta**.

	![The Synchronize Microsoft Entra groups to ZScalerBeta is selected and enabled.](./media/zscaler-beta-provisioning-tutorial/group-mappings.png)

1. Review the group attributes that are synchronized from Microsoft Entra ID to Zscaler Beta in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the groups in Zscaler Beta for update operations. Select the **Save** button to commit any changes.

	![In the Attribute Mappings section for group attributes, the Active Directory attributes are shown next to the Zscalar Beta attributes they are synchronized with. One pair of attributes is shown as Matching.](./media/zscaler-beta-provisioning-tutorial/group-attribute-mappings.png)

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Zscaler Beta, change the **Provisioning Status** to **On** in the **Settings** section.

	![The Provisioning Status is shown and set to On.](./media/zscaler-beta-provisioning-tutorial/provisioning-status.png)

1. Define the users and/or groups that you would like to provision to Zscaler Beta by choosing the desired values in **Scope** in the **Settings** section.

	![The Scope drop-down list is shown, and Sync only assigned users and groups is selected. The other available value is Sync all users and groups.](./media/zscaler-beta-provisioning-tutorial/scoping.png)

1. When you are ready to provision, click **Save**.

	![The Save button at the top of Zscaler Beta - Provisioning is highlighted. There is also a Discard button.](./media/zscaler-beta-provisioning-tutorial/save-provisioning.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Zscaler Beta.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/zscaler-beta-provisioning-tutorial/tutorial-general-01.png
[2]: ./media/zscaler-beta-provisioning-tutorial/tutorial-general-02.png
[3]: ./media/zscaler-beta-provisioning-tutorial/tutorial-general-03.png
