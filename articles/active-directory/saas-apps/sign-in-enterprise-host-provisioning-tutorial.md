---
title: 'Tutorial: Configure Sign In Enterprise for automatic host provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision hosts from Microsoft Entra ID to Sign In Enterprise.
services: active-directory
author: twimmers
writer: twimmers
manager: beatrizd
ms.assetid: 9032d0da-f472-4e8d-a14d-d84f472411ee
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/27/2023
ms.author: thwimmer
---

# Tutorial: Configure Sign In Enterprise for automatic host provisioning

This tutorial describes the steps you need to perform in both Sign In Enterprise and Microsoft Entra ID to configure automatic host provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions hosts and host groups to [Sign In Enterprise](https://signinenterprise.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).


## Supported capabilities
> [!div class="checklist"]
> * Create hosts in Sign In Enterprise.
> * Provision host groups and their memberships in Sign In Enterprise.
> * Mark hosts as invisible in Sign In Enterprise that are unassigned from the application.
> * Delete host groups that are unassigned from the application.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in Sign In Enterprise with Admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Sign In Enterprise](../app-provisioning/customize-application-attributes.md).

## Step 2: Gather SCIM Host Provisioning information from Sign In Enterprise

1. Click on the gear icon in the top-right corner of your Sign In Enterprise account.
1. Click **Preferences**.
1. In the **General tab**, scroll down until you get to the **SCIM Host Provisioning** section. You will then need to copy both the URL and the Token, which will be needed in Step 5 below.

<a name='step-3-add-sign-in-enterprise-host-provisioning-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Sign In Enterprise Host Provisioning from the Microsoft Entra application gallery

Add Sign In Enterprise Host Provisioning from the Microsoft Entra application gallery to start managing provisioning to Sign In Enterprise. If you have previously setup Sign In Enterprise for SSO you can't use the same application.  It's required that you create a separate app for Sign In Enterprise Host Provisioning. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Sign In Enterprise.

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-sign-in-enterprise-host-provisioning-in-azure-ad'></a>

### To configure automatic user provisioning for Sign In Enterprise Host Provisioning in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Sign In Enterprise Host Provisioning**.

	![Screenshot of the Sign In Enterprise Host Provisioning link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Sign In Enterprise Tenant URL and Token you copied in Step 2. Click **Test Connection** to ensure Microsoft Entra ID can connect to Sign In Enterprise. If the connection fails, ensure your and try again.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Provision Microsoft Entra users**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Sign In Enterprise Host Provisioning in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Sign In Enterprise Host Provisioning for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Sign In Enterprise Host Provisioning API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Sign In Enterprise Host Provisioning|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||
   |emails[type eq "work"].value|String||&check;
   |name.givenName|String||&check;
   |name.familyName|String||&check;
   |phoneNumbers[type eq "work"].value|String||
   |phoneNumbers[type eq "mobile"].value|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||
   |emails[type eq "other"].value|String||

1. Under the **Mappings** section, select **Provision  Microsoft Entra groups**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Sign In Enterprise in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Sign In Enterprise for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Sign In Enterprise Host Provisioning|
   |---|---|---|---|
   |displayName|String|&check;|&check;
   |members|Reference||
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Sign In Enterprise Host Provisioning, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Sign In Enterprise by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
