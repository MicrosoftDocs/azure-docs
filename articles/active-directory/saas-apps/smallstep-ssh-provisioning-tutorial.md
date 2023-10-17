---
title: 'Tutorial: Configure Smallstep SSH for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Smallstep SSH.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 1f37bd8a-4706-4385-b42e-5507912066f1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Smallstep SSH for automatic user provisioning

This tutorial describes the steps you need to perform in both Smallstep SSH and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Smallstep SSH](https://smallstep.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Smallstep SSH
> * Remove users in Smallstep SSH when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Smallstep SSH
> * Provision groups and group memberships in Smallstep SSH
> * Single sign-on to Smallstep SSH (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [Smallstep SSH](https://smallstep.com/sso-ssh/) account.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Smallstep SSH](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-smallstep-ssh-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Smallstep SSH to support provisioning with Microsoft Entra ID

1. Log in to your [Smallstep SSH](https://smallstep.com/sso-ssh/) account.

2. Navigate to the **Users** tab and select **Microsoft Entra ID** as your Identity Provider.

3. On the next page, provide your **Microsoft Entra tenant ID** and allow list to configure OIDC.

4. Under SCIM Details, copy and save your SCIM **Tenant URL** and **Secret Token**. These values will be entered in the **Tenant URL** and **Secret Token** field in the Provisioning tab of your Smallstep SSH application.

>Note! 
>You would need to grant access to your Smallstep managed hosts via Active Directory Groups. For example, you might have a group for your ssh users and one for your sudo users. Learn more about access control in [Microsoft Entra Quickstart](https://smallstep.com/docs/ssh/azure-ad) and [Host Quickstart Guide](https://smallstep.com/docs/ssh/hosts).

<a name='step-3-add-smallstep-ssh-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Smallstep SSH from the Microsoft Entra application gallery

Add Smallstep SSH from the Microsoft Entra application gallery to start managing provisioning to Smallstep SSH. If you have previously setup Smallstep SSH for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Smallstep SSH 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Smallstep SSH based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-smallstep-ssh-in-azure-ad'></a>

### To configure automatic user provisioning for Smallstep SSH in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Smallstep SSH**.

	![The Smallstep SSH link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your Smallstep SSH Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Smallstep SSH. If the connection fails, ensure your Smallstep SSH account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Smallstep SSH**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to Smallstep SSH in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Smallstep SSH for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Smallstep SSH API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported For Filtering|
   |---|---|--|
   |userName|String|&check;|
   |active|Boolean|
   |displayName|String|
   |emails[type eq "work"].value|String|
   |name.givenName|String|
   |name.familyName|String|

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Smallstep SSH**.

11. Review the group attributes that are synchronized from Microsoft Entra ID to Smallstep SSH in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Smallstep SSH for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported For Filtering|
      |---|---|---|
      |displayName|String|&check;|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Smallstep SSH, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Smallstep SSH by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
