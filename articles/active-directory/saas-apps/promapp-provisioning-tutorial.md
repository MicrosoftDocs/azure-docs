---
title: 'Tutorial: Configure Promapp for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Promapp.
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

# Tutorial: Configure Promapp for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Promapp and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Promapp.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Promapp tenant](https://www.promapp.com/licensing/)
* A user account in Promapp with Admin permissions.

## Assigning users to Promapp

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Promapp. Once decided, you can assign these users and/or groups to Promapp by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Promapp

* It is recommended that a single Microsoft Entra user is assigned to Promapp to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Promapp, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Promapp for provisioning

1. Sign in to your [Promapp Admin Console](https://freetrial.promapp.com/axelerate/Login.aspx). Under the user name navigate to **My Profile**.

	![Promapp Admin Console](media/promapp-provisioning-tutorial/admin.png)

2.	Under **Access Tokens** click on the **Create Token** button.

	![Promapp Add SCIM](media/promapp-provisioning-tutorial/addtoken.png)

3.	Provide any name in the **Description** field and select **Scim** from the **Scope** dropdown menu. Click on the save icon.

	![Promapp Add Name](media/promapp-provisioning-tutorial/addname.png)

4.	Copy the access token and save it as this will be the only time you can view it. This value will be entered in the Secret Token field in the Provisioning tab of your Promapp application.

	![Promapp Create Token](media/promapp-provisioning-tutorial/token.png)

## Add Promapp from the gallery

Before configuring Promapp for automatic user provisioning with Microsoft Entra ID, you need to add Promapp from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Promapp from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Promapp**, select **Promapp** in the search box.
1. Select **Promapp** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Promapp in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Promapp 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Promapp based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Promapp by following the instructions provided in the [Promapp Single sign-on tutorial](./promapp-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

<a name='to-configure-automatic-user-provisioning-for-promapp-in-azure-ad'></a>

### To configure automatic user provisioning for Promapp in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Promapp**.

	![The Promapp link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://api.promapp.com/api/scim` in **Tenant URL**. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Promapp. If the connection fails, ensure your Promapp account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Promapp**.

	![Promapp User Mappings](media/promapp-provisioning-tutorial/usermappings.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to Promapp in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Promapp for update operations. Select the **Save** button to commit any changes.

	![Promapp User Attributes](media/promapp-provisioning-tutorial/userattributes.png)

11. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Microsoft Entra provisioning service for Promapp, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

13. Define the users and/or groups that you would like to provision to Promapp by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

14. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Promapp.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
