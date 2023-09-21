---
title: 'Tutorial: Configure Cleanmail Swiss for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Cleanmail Swiss.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 1281f790-7f6d-4558-bb31-015f92ae579d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/10/2023
ms.author: thwimmer
---

# Tutorial: Configure Cleanmail Swiss for automatic user provisioning

This tutorial describes the steps you need to do in both Cleanmail Swiss and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users to [Cleanmail](https://www.alinto.com/fr) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Cleanmail
> * Remove users in Cleanmail Swiss when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Cleanmail
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to Cleanmail Swiss (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in Cleanmail Swiss with Admin permission

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who is in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Cleanmail](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-cleanmail-swiss-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Cleanmail Swiss to support provisioning with Microsoft Entra ID

Contact [Cleanmail Swiss Support](https://www.alinto.com/contact-email-provider/) to configure Cleanmail Swiss to support provisioning with Microsoft Entra ID.

<a name='step-3-add-cleanmail-swiss-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Cleanmail Swiss from the Microsoft Entra application gallery

Add Cleanmail Swiss from the Microsoft Entra application gallery to start managing provisioning to Cleanmail. If you have previously setup Cleanmail Swiss for SSO, you can use the same application. However it's recommended you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who is in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who is provisioned based on assignment to the application and or based on attributes of the user. If you choose to scope who is provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users to the application. If you choose to scope who is provisioned based solely on attributes of the user, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users before rolling out to everyone. When the scope for provisioning is set to assigned users, you can control this by assigning one or two users to the app instance. When scope is set to all users, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Cleanmail Swiss 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users in Cleanmail Swiss based on user assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-cleanmail-swiss-in-azure-ad'></a>

### To configure automatic user provisioning for Cleanmail Swiss in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Cleanmail**.

	![Screenshot of the Cleanmail Swiss link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your Cleanmail Swiss Tenant URL as `https://cloud.cleanmail.ch/api/v3/scim2` and corresponding Secret Token obtained from Step 2. Click **Test Connection** to ensure Microsoft Entra ID can connect to Cleanmail. If the connection fails, ensure your Cleanmail Swiss account has Admin permissions and try again.

	![Screenshot of the token.](common/provisioning-testconnection-tenanturltoken.png)
	
1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of notification email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Cleanmail**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Cleanmail Swiss in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Cleanmail Swiss for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you need to ensure that the Cleanmail Swiss API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Cleanmail|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |name.givenName|String||
   |name.familyName|String||
   |externalId|String||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Cleanmail, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of provisioning status toggled on.](common/provisioning-toggle-on.png)

1. Define the users that you would like to provision to Cleanmail Swiss by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of provisioning scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of saving provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users defined in **Scope** in the **Settings** section. The initial cycle takes longer to complete than next cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

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
