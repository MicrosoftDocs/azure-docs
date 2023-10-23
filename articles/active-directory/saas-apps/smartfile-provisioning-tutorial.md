---
title: 'Tutorial: Configure SmartFile for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to SmartFile.
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

# Tutorial: Configure SmartFile for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in SmartFile and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to SmartFile.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* [A SmartFile tenant](https://www.SmartFile.com/pricing/).
* A user account in SmartFile with Admin permissions.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.


## Assigning users to SmartFile

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to SmartFile. Once decided, you can assign these users and/or groups to SmartFile by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to SmartFile

* It is recommended that a single Microsoft Entra user is assigned to SmartFile to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to SmartFile, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup SmartFile for provisioning

Before configuring SmartFile for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on SmartFile and collect additional details needed.

1. Sign into your SmartFile Admin Console. Navigate to the top-right hand corner of the SmartFile Admin Console. Select **Product Key**.

	![SmartFile Admin Console](media/smartfile-provisioning-tutorial/login.png)

2. To generate a bearer token, copy the **Product Key** and **Product Password**. Paste them in a notepad with a colon in between them.
 	
	 ![Screenshot of the Product Key section with the Product Key and Product Password text boxes called out.](media/smartfile-provisioning-tutorial/auth.png)

	![Screenshot of plaintext showing Product Key and Product Password separated by a colon.](media/smartfile-provisioning-tutorial/key.png)

## Add SmartFile from the gallery

To configure SmartFile for automatic user provisioning with Microsoft Entra ID, you need to add SmartFile from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add SmartFile from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SmartFile**, select **SmartFile** in the search box.
1. Select **SmartFile** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![SmartFile in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to SmartFile 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in SmartFile based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for SmartFile, following the instructions provided in the [SmartFile Single sign-on tutorial](SmartFile-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other

<a name='to-configure-automatic-user-provisioning-for-smartfile-in-azure-ad'></a>

### To configure automatic user provisioning for SmartFile in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **SmartFile**.

	![The SmartFile link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5.  Under the **Admin Credentials** section, input `https://<SmartFile sitename>.smartfile.com/ftp/scim` in **Tenant URL**. An example would look like `https://demo1test.smartfile.com/ftp/scim`. Enter the **Bearer token** value (ProductKey:ProductPassword) that you retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to SmartFile. If the connection fails, ensure your SmartFile account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to SmartFile**.

	![SmartFile User Mappings](media/smartfile-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to SmartFile in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in SmartFile for update operations. Select the **Save** button to commit any changes.

	![SmartFile User Attributes](media/smartfile-provisioning-tutorial/userattribute.png)

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to SmartFile**.

	![SmartFile Group Mappings](media/smartfile-provisioning-tutorial/groupmapping.png)

11. Review the group attributes that are synchronized from Microsoft Entra ID to SmartFile in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in SmartFile for update operations. Select the **Save** button to commit any changes.

	![SmartFile Group Attributes](media/smartfile-provisioning-tutorial/groupattribute.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for SmartFile, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to SmartFile by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on SmartFile.

	For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)
	
## Connector limitations

* SmartFile only supports hard deletes. 

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

 [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
