---
title: 'Tutorial: Configure Proxyclick for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Proxyclick.
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

# Tutorial: Configure Proxyclick for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Proxyclick and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Proxyclick.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Proxyclick tenant](https://www.proxyclick.com/pricing)
* A user account in Proxyclick with Admin permissions.

## Add Proxyclick from the gallery

Before configuring Proxyclick for automatic user provisioning with Microsoft Entra ID, you need to add Proxyclick from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Proxyclick from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Proxyclick**, select **Proxyclick** in the search box.
1. Select **Proxyclick** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Proxyclick in the results list](common/search-new-app.png)

## Assigning users to Proxyclick

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Proxyclick. Once decided, you can assign these users and/or groups to Proxyclick by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Proxyclick

* It is recommended that a single Microsoft Entra user is assigned to Proxyclick to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Proxyclick, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Proxyclick 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Proxyclick based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Proxyclick, following the instructions provided in the [Proxyclick single sign-on tutorial](proxyclick-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-proxyclick-in-azure-ad'></a>

### To configure automatic user provisioning for Proxyclick in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Proxyclick**.

	![The Proxyclick link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. To retrieve the **Tenant URL** and **Secret Token** of your Proxyclick account, follow the walkthrough as described in Step 6.

6. Sign in to your [Proxyclick Admin Console](https://app.proxyclick.com/login//?destination=%2Fdefault). Navigate to **Settings** > **Integrations** > **Browse Marketplace**.

	![Proxyclick Settings](media/proxyclick-provisioning-tutorial/proxyclick09.png)

	![Proxyclick Integrations](media/proxyclick-provisioning-tutorial/proxyclick01.png)

	![Proxyclick Marketplace](media/proxyclick-provisioning-tutorial/proxyclick02.png)

	Select **Microsoft Entra ID**. Click **Install now**.

	![Proxyclick Microsoft Entra ID](media/proxyclick-provisioning-tutorial/proxyclick03.png)

	![Proxyclick Install](media/proxyclick-provisioning-tutorial/proxyclick04.png)

	Select **User Provisioning** and click **Start integration**. 

	![Proxyclick User Provisioning](media/proxyclick-provisioning-tutorial/proxyclick05.png)

	The appropriate settings configuration UI should now show up under **Settings** > **Integrations**. Select **Settings** under **Microsoft Entra ID (User Provisioning)**.

	![Proxyclick Create](media/proxyclick-provisioning-tutorial/proxyclick06.png)

	You can find the **Tenant URL** and **Secret Token** here.

	![Proxyclick Create Token](media/proxyclick-provisioning-tutorial/proxyclick07.png)

7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Microsoft Entra ID can connect to Proxyclick. If the connection fails, ensure your Proxyclick account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Proxyclick**.

	![Proxyclick User Mappings](media/proxyclick-provisioning-tutorial/Proxyclick-user-mappings.png)

11. Review the user attributes that are synchronized from Microsoft Entra ID to Proxyclick in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Proxyclick for update operations. Select the **Save** button to commit any changes.

    ![Proxyclick User Attributes](media/proxyclick-provisioning-tutorial/Proxyclick-user-attribute.png)

13. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

14. To enable the Microsoft Entra provisioning service for Proxyclick, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

15. Define the users and/or groups that you would like to provision to Proxyclick by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

16. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Proxyclick.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector Limitations

* Proxyclick requires **emails** and **userName** to have the same source value. Any updates to either attributes will modify the other value.
* Proxyclick does not support provisioning for groups.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
