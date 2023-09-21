---
title: 'Tutorial: Configure NordPass for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to NordPass.
services: active-directory
documentationcenter: ''
author: twimmers
writer: Thwimmer
manager: jeedes

ms.assetid: ad92f598-f6f6-4ee4-8de4-a488d4e07126
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.devlang: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: Thwimmer
---

# Tutorial: Configure NordPass for automatic user provisioning

This tutorial describes the steps you need to perform in both NordPass and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users to [NordPass](https://nordpass.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in NordPass.
> * Remove users in NordPass when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and NordPass.
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to NordPass.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in NordPass with Admin permissions.


## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and NordPass](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-nordpass-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure NordPass to support provisioning with Microsoft Entra ID
1. Log in to [NordPass Admin Panel](https://panel.nordpass.com).
1. Navigate to **Settings > User provisioning** and select **Get Credentials**.
1. In the new window, you will see admin credentials:

	![NordPass Admin Credentials](media/nordpass-provisioning-tutorial/nordpass-admin-credentials.png)

1. Copy and save the **Tenant Url** and **Secret Token** that you see in the new window.This value will be entered in the **Tenant Url** and **Secret Token** field in the Provisioning tab of your NordPass application.

<a name='step-3-add-nordpass-from-the-azure-ad-application-gallery'></a>

## Step 3: Add NordPass from the Microsoft Entra application gallery

Add NordPass from the Microsoft Entra application gallery to start managing provisioning to NordPass. If you have previously setup NordPass for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users to the application. If you choose to scope who will be provisioned based solely on attributes of the user, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users before rolling out to everyone. When scope for provisioning is set to assigned users , you can control this by assigning one or two users to the app. When scope is set to all users , you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to NordPass 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users in NordPass based on user assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-nordpass-in-azure-ad'></a>

### To configure automatic user provisioning for NordPass in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **NordPass**.

	![The NordPass link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your NordPass Tenant URL and corresponding **Secret Token** which was retrieved earlier. Click **Test Connection** to ensure Microsoft Entra ID can connect to NordPass. If the connection fails, ensure your NordPass account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to NordPass**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to NordPass in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in NordPass for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the NordPass API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by NordPass|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |externalId|String||&check;

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for NordPass, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users that you would like to provision to NordPass by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md). 

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
