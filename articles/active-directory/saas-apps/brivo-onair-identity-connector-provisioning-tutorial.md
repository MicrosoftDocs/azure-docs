---
title: 'Tutorial: Configure Brivo Onair Identity Connector for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Brivo Onair Identity Connector.
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

# Tutorial: Configure Brivo Onair Identity Connector for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Brivo Onair Identity Connector and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Brivo Onair Identity Connector.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Brivo Onair Identity Connector tenant](https://www.brivo.com/lp/quote)
* A user account in Brivo Onair Identity Connector with Senior Administrator permissions.

## Assigning users to Brivo Onair Identity Connector

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Brivo Onair Identity Connector. Once decided, you can assign these users and/or groups to Brivo Onair Identity Connector by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Brivo Onair Identity Connector

* It is recommended that a single Microsoft Entra user is assigned to Brivo Onair Identity Connector to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Brivo Onair Identity Connector, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Brivo Onair Identity Connector for provisioning

1. Sign in to your [Brivo Onair Identity Connector Admin Console](https://acs.brivo.com/login/). Navigate to **Account > Account Settings**.

   ![Brivo Onair Identity Connector Admin Console](media/brivo-onair-identity-connector-provisioning-tutorial/admin.png)

2. Click on **Microsoft Entra ID** tab. On the **Microsoft Entra ID** details page re-enter the password of your senior administrator account. Click on **Submit**.

   ![Brivo Onair Identity Connector azure](media/brivo-onair-identity-connector-provisioning-tutorial/azuread.png)

3. Click on **Copy Token** button and save the **Secret Token**. This value will be entered in the Secret Token field in the Provisioning tab of your Brivo Onair Identity Connector application.

   ![Brivo Onair Identity Connector token](media/brivo-onair-identity-connector-provisioning-tutorial/token.png)

## Add Brivo Onair Identity Connector from the gallery

Before configuring Brivo Onair Identity Connector for automatic user provisioning with Microsoft Entra ID, you need to add Brivo Onair Identity Connector from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Brivo Onair Identity Connector from the Microsoft Entra application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Microsoft Entra ID**.

    ![The Microsoft Entra button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

    ![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

    ![The New application button](common/add-new-app.png)

4. In the search box, enter **Brivo Onair Identity Connector**, select **Brivo Onair Identity Connector** in the search box.
1. Select **Brivo Onair Identity Connector** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
    ![Brivo Onair Identity Connector in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Brivo Onair Identity Connector 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Brivo Onair Identity Connector based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-brivo-onair-identity-connector-in-azure-ad'></a>

### To configure automatic user provisioning for Brivo Onair Identity Connector in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

    ![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Brivo Onair Identity Connector**.

    ![The Brivo Onair Identity Connector link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://scim.brivo.com/ActiveDirectory/v2/` in **Tenant URL**. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Brivo Onair Identity Connector. If the connection fails, ensure your Brivo Onair Identity Connector account has Admin permissions and try again.

    ![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

    ![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Brivo Onair Identity Connector**.

    ![Brivo Onair Identity Connector User Mappings](media/brivo-onair-identity-connector-provisioning-tutorial/user-mappings.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to Brivo Onair Identity Connector in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Brivo Onair Identity Connector for update operations. Select the **Save** button to commit any changes.

    ![Brivo Onair Identity Connector User Attributes](media/brivo-onair-identity-connector-provisioning-tutorial/user-attributes.png)

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Brivo Onair Identity Connector**.

    ![Brivo Onair Identity Connector Group Mappings](media/brivo-onair-identity-connector-provisioning-tutorial/group-mappings.png)

11. Review the group attributes that are synchronized from Microsoft Entra ID to Brivo Onair Identity Connector in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Brivo Onair Identity Connector for update operations. Select the **Save** button to commit any changes.

    ![Brivo Onair Identity Connector Group Attributes](media/brivo-onair-identity-connector-provisioning-tutorial/group-attributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Brivo Onair Identity Connector, change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Brivo Onair Identity Connector by choosing the desired values in **Scope** in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Brivo Onair Identity Connector.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
