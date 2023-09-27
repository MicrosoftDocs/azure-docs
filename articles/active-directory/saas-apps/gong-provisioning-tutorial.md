---
title: 'Tutorial: Configure Gong for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Gong.
services: active-directory
documentationcenter: ''
author: twimmers
writer: Thwimmer
manager: jeedes

ms.assetid: 6c8285d3-4f35-4325-9adb-d1a44668a03a
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.devlang: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: Thwimmer
---

# Tutorial: Configure Gong for automatic user provisioning

This tutorial describes the steps you need to perform in both Gong and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Gong](https://www.gong.io/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Gong.
> * Remove users in Gong when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Gong.
> * Provision groups and group memberships in Gong.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A user account in Gong with **Technical Administrator** privilege.


## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Gong](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-gong-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Gong to support provisioning with Microsoft Entra ID

1. Go to your company settings page > **PEOPLE** area > **Team Member Provisioning**.
1. Select **Microsoft Entra ID** as the provisioning source.
1. To assign data capture, workspace, and permission settings to Microsoft Entra groups:
    1. In the **Assign settings** area, click **ADD ASSIGNMENT**.
    1. Give the assignment a name. 
    1. In the **Microsoft Entra groups** area, select the Microsoft Entra group you want to define the settings for.
    1. In the **Data capture** area, select the home workspace and the data capture settings for people that belong to this group.
    1. In the **Workspaces and permissions** area, set the permissions profile for other workspaces in your org. 
    1. In the **Update settings** area, define how settings can be managed for this assignment:
        * Select **Manual editing** to manage data capture and permission settings for users in this assignment in Gong. 
          After you create the assignment: if you make changes to group settings in Microsoft Entra ID, they will not be pushed to Gong. However, you can edit the group settings manually in Gong.
        * (Recommended) Select **Automatic updates** to give Microsoft Entra ID Governance over data capture and permission settings in Gong. 
          Define data capture and permission settings in Gong only when creating an assignment. Thereafter, other changes will only be applied to users in groups with this assignment when pushed from Microsoft Entra ID.
    1. Click **ADD ASSIGNMENT**.
1. For org's that don't have assignments (step 3), select the permission profile to apply to for automatically provisioned users.

	[More information on permission profiles](https://help.gong.io/hc/en-us/articles/360028568911#UUID-34baef91-0aba-1295-4032-ff49102cb182).

1. In the **Manager's provisioning settings** area:
    1. Select **Notify direct managers with recorded teams when a new team member is imported** to keep your team managers in the loop.
    1. Select **Managers can turn data capture on or off for their team** to give your team managers some autonomy.

    > [!TIP]
    > For more information, see "What are Manager's provisioning settings" in the [FAQ for team member provisioning](https://help.gong.io/hc/en-us/articles/360042352912#UUID-0d3df83a-44d1-11b9-ddf5-3ec649c2f594) article.
1. Click **Update** to save your settings.

> [!NOTE]
> If you later change the provisioning source from Microsoft Entra ID and then want to return to Microsoft Entra ID  provisioning, you will need to re-authenticate to Microsoft Entra ID .

<a name='step-3-add-gong-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Gong from the Microsoft Entra application gallery

Add Gong from the Microsoft Entra application gallery to start managing provisioning to Gong. If you have previously setup Gong for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Gong 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Gong based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-gong-in-azure-ad'></a>

### To configure automatic user provisioning for Gong in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Gong**.

	![The Gong link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, click on Authorize, make sure that you enter your Gong account's Admin credentials. Click **Test Connection** to ensure Microsoft Entra ID can connect to Gong. If the connection fails, ensure your Gong account has Admin permissions and try again.

   ![Token](media/gong-provisioning-tutorial/gong-authorize.png)
   
1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Gong**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Gong in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Gong for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Gong API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

    |Attribute|Type|Supported for filtering|Required by Gong|
    |---|---|---|---|
    |userName|String|&check;|&check;
    |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|String|| 
    |active|Boolean||
    |title|String|| 
    |emails[type eq "work"].value|String||&check; 
    |name.givenName|String||&check;
    |name.familyName|String||&check;
    |phoneNumbers[type eq "work"].value|String||
    |externalId|String||
    |locale|String|| 
    |timezone|String||
    |urn:ietf:params:scim:schemas:extension:Gong:2.0:User:stateOrProvince|String|| 
    |urn:ietf:params:scim:schemas:extension:Gong:2.0:User:country|String||
          
1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Gong**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Gong in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Gong for update operations. Select the **Save** button to commit any changes.

    |Attribute|Type|Supported for filtering|Required by Gong|
    |---|---|---|---|
    |displayName|String|&check;|&check;
    |members|Reference||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Gong, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Gong by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Change Log
* 03/23/2022 - Added support for **Group Provisioning**.
* 04/21/2022 - **emails[type eq "work"].value** has been marked as required attribute.

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
