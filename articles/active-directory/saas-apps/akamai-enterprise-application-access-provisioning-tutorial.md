---
title: 'Tutorial: Configure Akamai Enterprise Application Access for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Akamai Enterprise Application Access.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: e4eb183a-192f-49e0-8724-549b2f360b8e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/27/2023
ms.author: thwimmer
---

# Tutorial: Configure Akamai Enterprise Application Access for automatic user provisioning

This tutorial describes the steps you need to perform in both Akamai Enterprise Application Access and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Akamai Enterprise Application Access](https://www.akamai.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in Akamai Enterprise Application Access.
> * Remove users in Akamai Enterprise Application Access when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Akamai Enterprise Application Access.
> * Provision groups and group memberships in Akamai Enterprise Application Access
> * [Single sign-on](akamai-tutorial.md) to Akamai Enterprise Application Access (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An administrator account with Akamai [Enterprise Application Access](https://www.akamai.com/products/enterprise-application-access). 


## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Akamai Enterprise Application Access](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-akamai-enterprise-application-access-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Akamai Enterprise Application Access to support provisioning with Microsoft Entra ID

Configure a SCIM directory of type Azure in Akamai Enterprise Center and save the SCIM base URL and the Provisioning key.

1. Sign in to [Akamai Enterprise Center](https://control.akamai.com/apps/zt-ui/#/identity/directories).   

1. In menu, navigate to **Application Access > Identity & Users > Directories**.
1. Select **Add New Directory** (+).
1. Enter a name and description for directory.
1. In **Directory Type** select **SCIM**, and in **SCIM Schema** select **Azure**.
1. Select **Add New Directory**.
1. Open your new directory **Settings** > **General** and copy **SCIM base URL**. Save it for Azure SCIM provisioning in STEP 4.
1. In **Settings** > **General** select **Create Provisioning Key**.
1. Enter a name and description for the key.
1. Copy **Provisioning key** by clicking on the copy to clipboard icon. Save it for Azure SCIM provisioning in STEP 5.
1. In **Login preference Attributes** select either **User principal name** (default) or **Email** to choose for a user a way to log in.
1. Select **Save**.  
     The new SCIM directory appears in the directories list in **Identity & Users** > **Directories**.


<a name='step-3-add-akamai-enterprise-application-access-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Akamai Enterprise Application Access from the Microsoft Entra application gallery

Add Akamai Enterprise Application Access from the Microsoft Entra application gallery to start managing provisioning to Akamai Enterprise Application Access. If you have previously setup Akamai Enterprise Application Access for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Akamai Enterprise Application Access 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-akamai-enterprise-application-access-in-azure-ad'></a>

### To configure automatic user provisioning for Akamai Enterprise Application Access in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Akamai Enterprise Application Access**.

	![Screenshot of the Akamai Enterprise Application Access link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Akamai Enterprise Application Access Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Akamai Enterprise Application Access. If the connection fails, ensure your Akamai Enterprise Application Access account has Admin permissions and try again.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Akamai Enterprise Application Access**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Akamai Enterprise Application Access in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Akamai Enterprise Application Access for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Akamai Enterprise Application Access API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute| Type  |Supported for filtering|Required by Akamai Enterprise Application Access|
   |---|---|---|---|
   |userName| String |&check;|&check;
   |active| Boolean |||
   |displayName| String |||
   |emails[type eq "work"].value| String ||&check;
   |name.givenName| String |||
   |name.familyName| String |||
   |phoneNumbers[type eq "mobile"].value| String|||
   |externalId| String |||


1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Akamai Enterprise Application Access**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Akamai Enterprise Application Access in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Akamai Enterprise Application Access for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Akamai Enterprise Application Access|
   |---|---|---|---|
   |displayName|String|&check;|&check;
   |externalId|String|||
   |members|Reference|||
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Akamai Enterprise Application Access, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Akamai Enterprise Application Access by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Akamai Enterprise Application Access - Getting Started](https://techdocs.akamai.com/eaa/docs/welcome-guide)
* [Configuring Custom Attributes in EAA](https://techdocs.akamai.com/eaa/docs/scim-provisioning-with-azure#step-7-optional-add-a-custom-attribute-in--and-map-it-to-the-scim-attribute-in-your--scim-directory)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
