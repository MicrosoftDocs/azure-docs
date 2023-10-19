---
title: 'Tutorial: Configure Cisco Umbrella User Management for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Cisco Umbrella User Management.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 1aa20f40-19ec-4213-9a3b-5eb2bcdd9bbd
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Cisco Umbrella User Management for automatic user provisioning

This tutorial describes the steps you need to perform in both Cisco Umbrella User Management and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Cisco Umbrella User Management](https://umbrella.cisco.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Cisco Umbrella User Management
> * Remove users in Cisco Umbrella User Management when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Cisco Umbrella User Management
> * Provision groups and group memberships in Cisco Umbrella User Management

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A [Cisco Umbrella subscription](https://signup.umbrella.com).
* A user account in Cisco Umbrella with full admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Cisco Umbrella User Management](../app-provisioning/customize-application-attributes.md).

<a name='step-2-import-objectguid-attribute-via-azure-ad-connect-optional'></a>

## Step 2: Import ObjectGUID attribute via Microsoft Entra Connect (Optional)
If your endpoints are running AnyConnect or the Cisco Secure Client version 4.10 MR5 or earlier, you will need to synchronize the ObjectGUID attribute for user identity attribution. You will need to reconfigure any Umbrella policy on groups after importing groups from Microsoft Entra ID.

> [!NOTE]
> The on-premises Umbrella AD Connector should be turned off before importing the ObjectGUID attribute.

When using Microsoft Entra Connect, the ObjectGUID attribute of users is not synchronized from on-premises AD to Microsoft Entra ID by default. To synchronize this attribute, enable the optional **Directory Extension attribute sync** and select the objectGUID attributes for users.

   ![Microsoft Entra Connect wizard Optional features page](./media/cisco-umbrella-user-management-provisioning-tutorial/active-directory-connect-directory-extension-attribute-sync.png)

> [!NOTE]
> The search under **Available Attributes** is case sensitive.

   ![Screenshot that shows the "Directory extensions" selection page](./media/cisco-umbrella-user-management-provisioning-tutorial/active-directory-connect-directory-extensions.png)

> [!NOTE]
> This step is not required if all your endpoints are running Cisco Secure Client or AnyConnect version 4.10 MR6 or higher.

<a name='step-3-configure-cisco-umbrella-user-management-to-support-provisioning-with-azure-ad'></a>

## Step 3: Configure Cisco Umbrella User Management to support provisioning with Microsoft Entra ID

1. Log in to [Cisco Umbrella dashboard](https://login.umbrella.com). Navigate to **Deployments** > **Core Identities** > **Users and Groups**.


1. Expand the Microsoft Entra card and click on the **API Keys page**.

   ![Api](./media/cisco-umbrella-user-management-provisioning-tutorial/keys.png)

1. Expand the Microsoft Entra card on the API Keys page and click on **Generate Token**.

   ![Generate](./media/cisco-umbrella-user-management-provisioning-tutorial/token.png)

1. The generated token will be displayed only once. Copy and save the URL and the token. These values will be entered in the **Tenant URL** and **Secret Token** fields respectively in the Provisioning tab of your Cisco Umbrella User Management application.


<a name='step-4-add-cisco-umbrella-user-management-from-the-azure-ad-application-gallery'></a>

## Step 4: Add Cisco Umbrella User Management from the Microsoft Entra application gallery

Add Cisco Umbrella User Management from the Microsoft Entra application gallery to start managing provisioning to Cisco Umbrella User Management. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 5: Define who will be in scope for provisioning

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 6: Configure automatic user provisioning to Cisco Umbrella User Management

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Cisco Umbrella User Management based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-cisco-umbrella-user-management-in-azure-ad'></a>

### To configure automatic user provisioning for Cisco Umbrella User Management in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Cisco Umbrella User Management**.

	![The Cisco Umbrella User Management link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Cisco Umbrella User Management Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Cisco Umbrella User Management. If the connection fails, ensure your Cisco Umbrella User Management account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Cisco Umbrella User Management**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Cisco Umbrella User Management in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Cisco Umbrella User Management for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Cisco Umbrella User Management API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for Filtering|
   |---|---|---|
   |userName|String|&check;|
   |externalId|String|
   |active|Boolean|
   |displayName|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |urn:ietf:params:scim:schemas:extension:ciscoumbrella:2.0:User:nativeObjectId|String|

> [!NOTE]
> If you have imported the objectGUID attribute for users via Microsoft Entra Connect (refer Step 2), add a mapping from objectGUID to urn:ietf:params:scim:schemas:extension:ciscoumbrella:2.0:User:nativeObjectId.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Cisco Umbrella User Management**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Cisco Umbrella User Management in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Cisco Umbrella User Management for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for Filtering|
      |---|---|---|
      |displayName|String|&check;|
      |externalId|String|
      |members|Reference|
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Cisco Umbrella User Management, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Cisco Umbrella User Management by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 7: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Connector Limitations
* Cisco Umbrella User Management supports provisioning a maximum of 200 groups. Any groups beyond this number that are in scope may not be provisioned to Cisco Umbrella.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
