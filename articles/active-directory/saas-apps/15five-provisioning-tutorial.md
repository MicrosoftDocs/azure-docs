---
title: 'Tutorial: Configure 15Five for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to 15Five.
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

# Tutorial: Configure 15Five for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in 15Five and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to [15Five](https://www.15five.com/pricing/). For important details on what this service does, how it works, and frequently asked questions, see Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID.

## Capabilities supported
> [!div class="checklist"]
> * Create users in 15Five
> * Remove users in 15Five when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and 15Five
> * Provision groups and group memberships in 15Five
> * [Single sign-on](./15five-tutorial.md) to 15Five (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) .
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* [A 15Five tenant](https://www.15five.com/pricing/).
* A user account in 15Five with Admin permissions.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and 15Five](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-15five-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure 15Five to support provisioning with Microsoft Entra ID

Before configuring 15Five for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on 15Five.

1. Sign in to your [15Five Admin Console](https://my.15five.com/). Navigate to **Features > Integrations**.

	:::image type="content" source="media/15five-provisioning-tutorial/integration.png" alt-text="Screenshot of the 15Five admin console. Integrations appears under Features in a menu, and both Features and Integrations are highlighted." border="false":::

2.	Click on **SCIM 2.0**.

	:::image type="content" source="media/15five-provisioning-tutorial/image00.png" alt-text="Screenshot of the Integrations page in the 15Five admin console. Under Tool, S C I M 2.0 is highlighted." border="false":::

3.	Navigate to **SCIM integration > Generate OAuth token**.

	:::image type="content" source="media/15five-provisioning-tutorial/image02.png" alt-text="Screenshot of the S C I M integration page in the 15Five admin console. Generate OAuth token is highlighted." border="false":::

4.	Copy the values for **SCIM 2.0 base URL** and **Access Token**. This value will be entered in the **Tenant URL** and **Secret Token** field in the Provisioning tab of your 15Five application.
	
	:::image type="content" source="media/15five-provisioning-tutorial/image03.png" alt-text="Screen shot of the S C I M integration page. In the Token table, the values next to S C I M 2.0 base U R L and Access token are highlighted." border="false":::

<a name='step-3-add-15five-from-the-azure-ad-application-gallery'></a>

## Step 3: Add 15Five from the Microsoft Entra application gallery

Add 15Five from the Microsoft Entra application gallery to start managing provisioning to 15Five. If you have previously setup 15Five for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 5: Configure automatic user provisioning to 15Five 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in 15Five based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-15five-in-azure-ad'></a>

### To configure automatic user provisioning for 15Five in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **15Five**.

	![The 15Five link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5.	Under the Admin Credentials section, input the **SCIM 2.0 base URL and Access Token** values retrieved earlier in the **Tenant URL** and **Secret Token** fields respectively. Click **Test Connection** to ensure Microsoft Entra ID can connect to 15Five. If the connection fails, ensure your 15Five account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to 15Five**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to 15Five in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in 15Five for update operations. Select the **Save** button to commit any changes.


   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |title|String|
   |emails[type eq "work"].value|String|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |externalId|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:15Five:2.0:User:location|String|
   |urn:ietf:params:scim:schemas:extension:15Five:2.0:User:startDate|String|

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to 15Five**.

11. Review the group attributes that are synchronized from Microsoft Entra ID to 15Five in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in 15Five for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |externalId|String|
      |displayName|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for 15Five, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to 15Five by choosing the desired values in **Scope** in the **Settings** section.

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

* 15Five does not support soft deletes for users.

## Change log

* 06/16/2020 - Added support for enterprise extension attribute "Manager" and custom attributes "Location" and "Start Date" for users.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
