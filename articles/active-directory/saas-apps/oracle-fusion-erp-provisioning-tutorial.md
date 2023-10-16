---
title: 'Tutorial: Configure Oracle Fusion ERP for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Oracle Fusion ERP.
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

# Tutorial: Configure Oracle Fusion ERP for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Oracle Fusion ERP and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Oracle Fusion ERP.

> [!NOTE]
>  This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* An [Oracle Fusion ERP tenant](https://www.oracle.com/applications/erp/).
* A user account in Oracle Fusion ERP with Admin permissions.

## Assign Users to Oracle Fusion ERP 
Microsoft Entra ID uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Oracle Fusion ERP. Once decided, you can assign these users and/or groups to Oracle Fusion ERP by following the instructions here:
 
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md) 

 ## Important tips for assigning users to Oracle Fusion ERP 

 * It is recommended that a single Microsoft Entra user is assigned to Oracle Fusion ERP to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Oracle Fusion ERP, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.

## Set up Oracle Fusion ERP for provisioning

Before configuring Oracle Fusion ERP for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on Oracle Fusion ERP.

1. Sign in to your [Oracle Fusion ERP Admin Console](https://cloud.oracle.com/sign-in)

2. Click the Navigator on the top-left top corner. Under **Tools**, select **Security Console**.

	:::image type="content" source="media/oracle-fusion-erp-provisioning-tutorial/login.png" alt-text="Screenshot of the Navigator page in the Oracle Fusion E R P admin console. Tools and Security console are highlighted." border="false":::

3. Navigate to **Users**.
	
	:::image type="content" source="media/oracle-fusion-erp-provisioning-tutorial/user.png" alt-text="Screenshot of a panel in the Oracle Fusion E R P admin console. The Users item is highlighted." border="false":::

4. Save the username and password for the admin user account which you will use to log into the Oracle Fusion ERP admin console. These values need to be entered in the **Admin Username** and **Password** fields in the Provisioning tab of your Oracle Fusion ERP application.

## Add Oracle Fusion ERP from the gallery

To configure Oracle Fusion ERP for automatic user provisioning with Microsoft Entra ID, you need to add Oracle Fusion ERP from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Oracle Fusion ERP from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Oracle Fusion ERP**, select **Oracle Fusion ERP** in the results panel.

	![Oracle Fusion ERP in the results list](common/search-new-app.png)

 ## Configure automatic user provisioning to Oracle Fusion ERP 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Oracle Fusion ERP based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Oracle Fusion ERP by following the instructions provided in the [Oracle Fusion ERP Single sign-on tutorial](oracle-fusion-erp-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other.

> [!NOTE]
> To learn more about Oracle Fusion ERP's SCIM endpoint, refer to [REST API for Common Features in Oracle Applications Cloud](https://docs.oracle.com/en/cloud/saas/applications-common/23b/farca/index.html).

<a name='to-configure-automatic-user-provisioning-for-fuze-in-azure-ad'></a>

### To configure automatic user provisioning for Fuze in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Oracle Fusion ERP**.

	![The Oracle Fusion ERP link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://ejlv.fa.em2.oraclecloud.com/hcmRestApi/scim/` in **Tenant URL**. Enter the admin user name and password retrieved earlier into the **Admin Username** and **Password** fields. Click on **Test connection** between Microsoft Entra ID and Oracle Fusion ERP. 

	:::image type="content" source="media/oracle-fusion-erp-provisioning-tutorial/admin.png" alt-text="Screenshot of the Admin credentials section. A Test connection button and fields for a Tenant U R L, admin username, and admin password are visible." border="false":::

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Oracle Fusion ERP**.

	:::image type="content" source="media/oracle-fusion-erp-provisioning-tutorial/user-mapping.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to Oracle Fusion E R P is visible." border="false":::

9. Review the user attributes that are synchronized from Microsoft Entra ID to Oracle Fusion ERP in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Oracle Fusion ERP for update operations. Select the **Save** button to commit any changes.

	:::image type="content" source="media/oracle-fusion-erp-provisioning-tutorial/user-attribute.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra ID and Oracle Fusion E R P attributes and the matching precedence." border="false":::

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Oracle Fusion ERP**.

	![Oracle Fusion ERP Group Mappings](media/oracle-fusion-erp-provisioning-tutorial/groupmappings.png)

11. Review the group attributes that are synchronized from Microsoft Entra ID to Oracle Fusion ERP in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Oracle Fusion ERP for update operations. Select the **Save** button to commit any changes.

	![Oracle Fusion ERP Group Attributes](media/oracle-fusion-erp-provisioning-tutorial/groupattributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Oracle Fusion ERP, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Oracle Fusion ERP by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Oracle Fusion ERP.

	For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* Oracle Fusion ERP only supports Basic Authentication for their SCIM endpoint.
* Oracle Fusion ERP does not support group provisioning.
* Roles in Oracle Fusion ERP are mapped to groups in Microsoft Entra ID. To assign roles to users in Oracle Fusion ERP from Microsoft Entra ID, you will need to assign users to the desired Microsoft Entra groups that are named after roles in Oracle Fusion ERP.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
