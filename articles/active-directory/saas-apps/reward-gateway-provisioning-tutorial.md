---
title: 'Tutorial: Configure Reward Gateway for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Reward Gateway.
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

# Tutorial: Configure Reward Gateway for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Reward Gateway and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Reward Gateway.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>
> This connector is currently in public preview. For more information about previews, see [Universal License Terms For Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* A [Reward Gateway tenant](https://www.rewardgateway.com/).
* A user account in Reward Gateway with Admin permissions.

## Assigning users to Reward Gateway 

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Reward Gateway. Once decided, you can assign these users and/or groups to Reward Gateway by following the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).


## Important tips for assigning users to Reward Gateway 

* It is recommended that a single Microsoft Entra user is assigned to Reward Gateway  to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Reward Gateway, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Reward Gateway  for provisioning
Before configuring Reward Gateway for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on Reward Gateway.

1. Sign in to your [Reward Gateway Admin Console](https://rewardgateway.photoshelter.com/login/). Click **Integrations**.

	![Screenshot of the Reward Gateway Admin Console with the Integrations option called out.](media/reward-gateway-provisioning-tutorial/image00.png)

2.	Select **My Integration**.

	![Screenshot of the two Integrations options with the My Integrations option called out.](media/reward-gateway-provisioning-tutorial/image001.png)

3.	Copy the values of **SCIM URL (v2)** and **OAuth Bearer Token**. These values will be entered in the Tenant URL and Secret Token field in the Provisioning tab of your Reward Gateway application.

	![Screenshot of the My Integrations panel with the OAuth Bearer Token text box called out.](media/reward-gateway-provisioning-tutorial/image03.png)

## Add Reward Gateway from the gallery

To configure Reward Gateway for automatic user provisioning with Microsoft Entra ID, you need to add Reward Gateway from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Reward Gateway from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Reward Gateway**, select **Reward Gateway** in the search box.
1. Select **Reward Gateway** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Reward Gateway in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Reward Gateway  

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Reward Gateway based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Reward Gateway, following the instructions provided in the [Reward Gateway  Single sign-on tutorial](reward-gateway-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-reward-gateway-in-azure-ad'></a>

### To configure automatic user provisioning for Reward Gateway in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Reward Gateway**.

	![The Reward Gateway link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM URL (v2)** and **OAuth Bearer Token** values retrieved earlier in **Tenant URL** and **Secret Token** respectively. Click **Test Connection** to ensure Microsoft Entra ID can connect to reward gateway. If the connection fails, ensure your reward gateway account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Reward Gateway**.

	![Screenshot of the Mappings section with the Synchronize Microsoft Entra users to Reward Gateway option called out.](media/reward-gateway-provisioning-tutorial/user-mappings.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to Reward Gateway in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Reward Gateway for update operations. Select the **Save** button to commit any changes.

	![Screenshot of the Attribute Mappings section with six mappings displayed.](media/reward-gateway-provisioning-tutorial/user-attributes.png)

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Reward Gateway, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Reward Gateway by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Reward Gateway.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

Reward Gateway does not support group provisioning currently.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

[Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
