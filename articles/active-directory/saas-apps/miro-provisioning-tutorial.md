---
title: 'Tutorial: Configure Miro for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Miro.
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

# Tutorial: Configure Miro for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Miro and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Miro.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Miro tenant](https://miro.com/pricing/)
* A user account in Miro with Admin permissions.

## Assigning users to Miro

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Miro. Once decided, you can assign these users and/or groups to Miro by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Miro

* It is recommended that a single Microsoft Entra user is assigned to Miro to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Miro, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up Miro for provisioning

To retrieve the needed **Secret Token** contact [Miro Support Team](mailto:support@miro.com). This value will be entered in the Secret Token field in the Provisioning tab of your Miro application.

## Add Miro from the gallery

Before configuring Miro for automatic user provisioning with Microsoft Entra ID, you need to add Miro from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Miro from the Microsoft Entra application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Microsoft Entra ID**.

	![The Microsoft Entra button](common/select-azuread.png)

1. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

1. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

1. In the search box, enter **Miro**, select **Miro** in the search box.
1. Select **Miro** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Miro in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Miro 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Miro based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Miro, following the instructions provided in the [Miro Single sign-on tutorial](./miro-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other.

> [!NOTE]
> To learn more about Miro's SCIM endpoint, refer [this](https://help.miro.com/hc/en-us/articles/360036777814).

<a name='to-configure-automatic-user-provisioning-for-miro-in-azure-ad'></a>

### To configure automatic user provisioning for Miro in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Miro**.

	![The Miro link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input `https://miro.com/api/v1/scim` in **Tenant URL**. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Miro. If the connection fails, ensure your Miro account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

1. Click **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Miro**.

	![Miro User Mappings](media/miro-provisioning-tutorial/usermappings.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to Miro in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Miro for update operations. Select the **Save** button to commit any changes.

	![Miro User Attributes](media/miro-provisioning-tutorial/userattributes.png)

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Miro**.

	![Miro Group Mappings](media/miro-provisioning-tutorial/groupmappings.png)

1. Review the group attributes that are synchronized from Microsoft Entra ID to Miro in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Miro for update operations. Select the **Save** button to commit any changes. Uncheck **Create** and **Delete** under **Target Object Actions** as Miro SCIM API does not support creating and deleting groups.

	![Miro Group Attributes](media/miro-provisioning-tutorial/groupattributes.png)

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Miro, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Miro by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Miro.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* Miro's SCIM endpoint does not allow **Create** and **Delete** operations on groups. It only supports group **Update** operation.

## Troubleshooting Tips

* If experiencing errors with group creation, then it is required to  disable it by unchecking **Create** and **Delete** under **Target Object Actions** as Miro SCIM API does not support creating and deleting groups.

	![Miro Group Tips](media/miro-provisioning-tutorial/groupattributes.png)

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
