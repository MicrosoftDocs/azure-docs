---
title: 'Tutorial: Configure 8x8 for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to 8x8.
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

# Tutorial: Configure 8x8 for automatic user provisioning

This tutorial describes the steps you need to perform in both 8x8 Admin Console and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [8x8](https://www.8x8.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 

## Capabilities supported
> [!div class="checklist"]
> * Create users in 8x8
> * Deactivate users in 8x8 when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and 8x8
> * [Single sign-on](./8x8virtualoffice-tutorial.md) to 8x8 (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An 8x8 X series subscription of any level.
* An 8x8 user account with administrator permission in [Admin Console](https://vo-cm.8x8.com).
* [Single Sign-On with Microsoft Entra ID](./8x8virtualoffice-tutorial.md) has already been configured.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and 8x8](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-8x8-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure 8x8 to support provisioning with Microsoft Entra ID

This section guides you through the steps to configure 8x8 to support provisioning with Microsoft Entra ID.

### To configure a user provisioning access token in 8x8 Admin Console:

1. Sign in to [Admin Console](https://admin.8x8.com). Select **Identity and Security**.

   [ ![Screenshot showing the 8x8 Admin Console.](./media/8x8-provisioning-tutorial/8x8-identity-and-security.png) ](./media/8x8-provisioning-tutorial/8x8-identity-and-security.png#lightbox)

2. In the **User Provisioning Integration (SCIM)** pane, click the toggle to enable and then click **Save**.

   [ ![Screenshot showing the Identity and Security page of the Admin Console with a callout over the user provisioning integration slider.](./media/8x8-provisioning-tutorial/8x8-enable-user-provisioning.png) ](./media/8x8-provisioning-tutorial/8x8-enable-user-provisioning.png#lightbox)

3. Copy the **8x8 URL** and **8x8 API Token** values. These values will be entered in the **Tenant URL** and **Secret Token** fields respectively in the Provisioning tab of your 8x8 application.

   [ ![Screenshot showing the Identity and Security page of the Admin Console with callout over token fields.](./media/8x8-provisioning-tutorial/8x8-copy-url-token.png) ](./media/8x8-provisioning-tutorial/8x8-copy-url-token.png#lightbox)

<a name='step-3-add-8x8-from-the-azure-ad-application-gallery'></a>

## Step 3: Add 8x8 from the Microsoft Entra application gallery

Add 8x8 from the Microsoft Entra application gallery to start managing provisioning to 8x8. If you have previously setup 8x8 for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. This is the simpler option and is used by most people.

If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 5: Configure automatic user provisioning to 8x8 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in 8x8 based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-8x8-in-azure-ad'></a>

### To configure automatic user provisioning for 8x8 in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot showing the Enterprise applications blade](./media/8x8-provisioning-tutorial/enterprise-applications.png)

	![Screenshot showing the All applications blade](./media/8x8-provisioning-tutorial/all-applications.png)

1. In the applications list, select **8x8**.

	![Screenshot showing the 8x8 link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab. Click on **Get started**.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

   ![Screenshot showing the Get started blade](./media/8x8-provisioning-tutorial/get-started.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, copy the **8x8 URL** from Admin Console into **Tenant URL**. Copy the **8x8 API Token** from Admin Console into **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to 8x8. If the connection fails, ensure your 8x8 account has Admin permissions and try again.

	![Screenshot shows the Admin Credentials dialog box, where you can enter your Tenant U R L and Secret Token.](./media/8x8-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot showing the Notification Email field.](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Provision Microsoft Entra users**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to 8x8 in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in 8x8 for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the 8x8 API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Notes|
   |---|---|---|
   |userName|String|Sets both Username and Federation ID|
   |externalId|String||
   |active|Boolean||
   |title|String||
   |emails[type eq "work"].value|String||
   |name.givenName|String||
   |name.familyName|String||
   |phoneNumbers[type eq "mobile"].value|String|Personal Contact Number|
   |phoneNumbers[type eq "work"].value|String|Personal Contact Number|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||
   |urn:ietf:params:scim:schemas:extension:8x8:1.1:User:site|String|Cannot be updated after user creation|
   |locale|String|Not mapped by default|
   |timezone|String|Not mapped by default|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for 8x8, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to 8x8 by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
