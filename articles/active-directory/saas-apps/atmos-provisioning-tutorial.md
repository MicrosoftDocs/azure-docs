---
title: 'Tutorial: Configure Atmos for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Atmos.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 769b98d7-009f-44ed-8569-a5acc52d7552
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/14/2023
ms.author: thwimmer
---

# Tutorial: Configure Atmos for automatic user provisioning

This tutorial describes the steps you need to do in both Atmos and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Atmos](https://www.axissecurity.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Atmos.
> * Remove users in Atmos when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Atmos.
> * Provision groups and group memberships in Atmos.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A user account in [Axis Security](https://www.axissecurity.com) with Admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Atmos](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-atmos-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Atmos to support provisioning with Microsoft Entra ID

1. Log in to the Axis Management Console.
1. Navigate to **Settings**-> **Identity Providers** screen.
1. Hover over the **Azure Identity Provider** and select **edit**.
1. Navigate to **Advanced Settings**.
1. Navigate to **User Auto-Provisioning (SCIM)**. 
1. Click **Generate new token**.
1. Copy the **SCIM Service Provider Endpoint** and **SCIM Provisioning Token** and paste them into a text editor. You need them for Step 5.

<a name='step-3-add-atmos-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Atmos from the Microsoft Entra application gallery

Add Atmos from the Microsoft Entra application gallery to start managing provisioning to Atmos. If you have previously setup Atmos for SSO, you can use the same application. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope provisioning based on assignment to the application and or based on attributes of the user / group. If you choose to scope provisioning to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope provisioning based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Atmos 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and groups in Atmos based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-atmos-in-azure-ad'></a>

### To configure automatic user provisioning for Atmos in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Atmos**.

	![Screenshot of the Atmos link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, paste the **SCIM Service Provider Endpoint** obtained from the Axis SCIM configuration (step 2) in Tenant URL, and paste the **SCIM Provisioning Token** obtained from the Axis SCIM configuration (step 2) in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Atmos. If the connection fails, contact Axis to check your account setup.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Atmos**.

1. Review the synchronized user attributes from Microsoft Entra ID to Atmos, in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Atmos for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you need to ensure that the Atmos API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Atmos|
   |---|---|---|---|
   |userName|String|&check;|&check;|   
   |active|Boolean|||
   |displayName|String||&check;|
   |emails[type eq "work"].value|String||| 
   |name.givenName|String|||
   |name.familyName|String|||
   |externalId|String|||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|||

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Atmos**.

1. Review the synchronized group attributes from Microsoft Entra ID to Atmos, in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Atmos for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for filtering|Required by Atmos|
      |---|---|---|---|
      |displayName|String|&check;|&check;      
      |members|Reference||
      |externalId|String||&check;

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Atmos, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and groups that you would like to provision to Atmos by choosing the appropriate values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to execute than next cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
