---
title: 'Tutorial: Configure Connecter for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Connecter.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 6e60505a-f8c8-46f6-8e6f-525e7c8416b7
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/24/2023
ms.author: thwimmer
---

# Tutorial: Configure Connecter for automatic user provisioning

This tutorial describes the steps you need to perform in both Connecter and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users to [Connecter](https://www.designconnected.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in Connecter.
> * Remove users in Connecter when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Connecter.
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to Connecter (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An admin account for Connecter Server's [Team Portal](https://teamwork.connecterapp.com/)

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Connecter](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-connecter-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Connecter to support provisioning with Microsoft Entra ID

### Roles

There are two main roles involved in the configuration:

1. **Team Portal admin** - the sole administrator of everything connected with user and permissions management in Connecter Server. Can be changed by the Connecter Server Subscription owner from here.
1. Microsoft Entra admin - a person that has full access to the administrative backend of Microsoft Entra ID and can install new services.

### Step-by-step guide
#### Actions that must be done by the Team Portal admin:
1. Log in to Connecter's [Team Portal](https://teamwork.connecterapp.com/).
1. Select your team.
1. Click on the **Features tab**.

	![Screenshot of navigating to features tab.](media/connecter-provisioning-tutorial/feature-tab.png)

6. *Optional*: If you would like to select a workspace that your team members will be automatically added to when they are synchronized from Microsoft Entra ID select the **Workspace configuration** action and select the workspace and the permissions.

	![Screenshot of selecting workspace configuration.](media/connecter-provisioning-tutorial/workspace-configuration.png)

7. Click on the **Authenticate** button. This will open the sign-in page. Sign in with your **Microsoft Entra admin** account to add Connecter to your enterprise applications.

	![Screenshot of Microsoft Entra admin sign-in page.](media/connecter-provisioning-tutorial/azure-sign-in-page.png)


8. Click on **Get SCIM token**.
9. Use the button to copy the token to your clipboard and save it for future purpose.

<a name='step-3-add-connecter-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Connecter from the Microsoft Entra application gallery

Add Connecter from the Microsoft Entra application gallery to start managing provisioning to Connecter. If you have previously setup Connecter for SSO you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users before rolling out to everyone. When scope for provisioning is set to assigned users, you can control this by assigning one or two users to the app. When scope is set to all users, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Connecter 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-connecter-in-azure-ad'></a>

### To configure automatic user provisioning for Connecter in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Connecter**.

	![Screenshot of the Connecter link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Connecter Tenant URL as `https://teamwork.connecterapp.com/scim/v2` and corresponding Secret Token obtained from step 2. Click **Test Connection** to ensure Microsoft Entra ID can connect to Connecter. If the connection fails, ensure your Connecter account has Admin permissions and try again.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Connecter**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Connecter in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Connecter for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Connecter API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Connecter|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||
   |displayName|String||&check;
   |externalId|String||
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Connecter, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users that you would like to provision to Connecter by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

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
