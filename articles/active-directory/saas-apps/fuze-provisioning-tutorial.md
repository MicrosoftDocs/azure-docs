---
title: 'Tutorial: Configure Fuze for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Fuze.
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

# Tutorial: Configure Fuze for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Fuze and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to [Fuze](https://www.fuze.com/). For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Capabilities supported
> [!div class="checklist"]
> * Create users in Fuze
> * Remove users in Fuze when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Fuze
> * [Single sign-on](./fuze-tutorial.md) to Fuze (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* [A Fuze tenant](https://www.fuze.com/).
* A user account in Fuze with Admin permissions.


## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Fuze](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-fuze-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Fuze to support provisioning with Microsoft Entra ID

Before configuring Fuze for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on Fuze. 

1. Start by contacting your Fuze representative for the following required information:

	* List of Fuze Product SKUs currently in use at your company.
	* List of location codes for your company’s locations.
	* List of department codes for your company.

2. You can find these SKUs and codes in your Fuze contract and configuration documents, or by contacting your Fuze representative.

3. Once the requirements are received, your Fuze representative will provide you with the Fuze authentication token that is required to enable the integration. This value will be entered in the Secret Token field in the Provisioning tab of your Fuze application.

<a name='step-3-add-fuze-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Fuze from the Microsoft Entra application gallery

Add Fuze from the Microsoft Entra application gallery to start managing provisioning to Fuze. If you have previously setup Fuze for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.
## Step 5: Configuring automatic user provisioning to Fuze 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Fuze based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-fuze-in-azure-ad'></a>

### To configure automatic user provisioning for Fuze in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Fuze**.

	![The Fuze link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM 2.0 base url and SCIM Authentication Token** value retrieved earlier from the Fuze representative in **Tenant URL** and **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Fuze. If the connection fails, ensure your Fuze account has Admin permissions and try again.

	![Tenant URL Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Fuze**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to Fuze in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Fuze for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |emails[type eq "work"].value|String|
   |active|Boolean|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Fuze, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Fuze by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Connector limitations

* Fuze supports custom SCIM attributes called **Entitlements**. These attributes are only able to be created and not updated. 
* The Fuze SCIM API does not support filtering on the userName attribute. As a result, you may see failures in the logs when trying to sync an existing user who does not have a userName attribute but exists with an email that matches the userPrincipalName in Microsoft Entra ID. 

## Change log

* 06/15/2020 - Rate Limit of integration adjusted to 10 requests/second.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
