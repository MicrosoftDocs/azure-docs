---
title: 'Tutorial: Configure iPass SmartConnect for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to iPass SmartConnect.
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

# Tutorial: Configure iPass SmartConnect for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in iPass SmartConnect and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to iPass SmartConnect.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* [An iPass SmartConnect tenant](https://www.ipass.com/buy-ipass/).
* A user account in iPass SmartConnect with Admin permissions.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.


## Assigning users to iPass SmartConnect

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to iPass SmartConnect. Once decided, you can assign these users and/or groups to iPass SmartConnect by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to iPass SmartConnect

* It is recommended that a single Microsoft Entra user is assigned to iPass SmartConnect to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to iPass SmartConnect, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup iPass SmartConnect for provisioning

Before configuring iPass SmartConnect for automatic user provisioning with Microsoft Entra ID, you will need to retrieve configuration information from the iPass SmartConnect admin console:

1. To retrieve the bearer token that is needed to authenticate against your iPass SmartConnect SCIM endpoint, refer to the very first time that you set up iPass SmartConnect as this value is only provided then. 
2. If you do not have the bearer token, reach out to [iPass SmartConnect's support team](mailto:help@ipass.com) to retrieve a new one.

## Add iPass SmartConnect from the gallery

To configure iPass SmartConnect for automatic user provisioning with Microsoft Entra ID, you need to add iPass SmartConnect from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add iPass SmartConnect from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **iPass SmartConnect**, select **iPass SmartConnect** in the search box.
1. Select **iPass SmartConnect** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![iPass SmartConnect in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to iPass SmartConnect 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in iPass SmartConnect based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
>  You may also choose to enable SAML-based single sign-on for iPass SmartConnect, following the instructions provided in the [iPass SmartConnect Single sign-on tutorial](ipasssmartconnect-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-ipass-smartconnect-in-azure-ad'></a>

### To configure automatic user provisioning for iPass SmartConnect in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **iPass SmartConnect**.

	![The iPass SmartConnect link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://openmobile.ipass.com/moservices/scim/v1` in **Tenant URL**. Enter the bearer token retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to iPass SmartConnect. If the connection fails, ensure that your iPass SmartConnect account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to iPass SmartConnect**.

	:::image type="content" source="media/ipass-smartconnect-provisioning-tutorial/usermapping.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to iPass SmartConnect is visible." border="false":::

9. Review the user attributes that are synchronized from Microsoft Entra ID to iPass SmartConnect in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in iPass SmartConnect for update operations. Select the **Save** button to commit any changes.

	:::image type="content" source="media/ipass-smartconnect-provisioning-tutorial/userattribute.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra ID and iPass SmartConnect attributes and the matching precedence." border="false":::


10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for iPass SmartConnect, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to iPass SmartConnect by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on iPass SmartConnect.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* iPass SmartConnect only accepts usernames that have their domains registered in the iPass SmartConnect admin console.  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
