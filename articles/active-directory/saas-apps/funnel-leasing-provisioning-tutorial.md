---
title: 'Tutorial: Configure Funnel Leasing for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Funnel Leasing.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 320d5135-3833-4a65-9fc5-7e50709dd6ff
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/02/2023
ms.author: thwimmer
---

# Tutorial: Configure Funnel Leasing for automatic user provisioning

This tutorial describes the steps you need to perform in both Funnel Leasing and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users to [Funnel Leasing](https://funnelleasing.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in Funnel Leasing.
> * Remove users in Funnel Leasing when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Funnel Leasing.
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to Funnel Leasing (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A live community in Funnel or at least a confirmation that all the required configuration is done on the Funnel side in preparation for a go-live date.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Funnel Leasing](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-funnel-leasing-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Funnel Leasing to support provisioning with Microsoft Entra ID
Contact your Funnel Account Manager and let them know you want to enable Microsoft Entra user provisioning, they will provide an authentication Bearer token.

<a name='step-3-add-funnel-leasing-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Funnel Leasing from the Microsoft Entra application gallery

Add Funnel Leasing from the Microsoft Entra application gallery to start managing provisioning to Funnel Leasing. If you have previously setup Funnel Leasing for SSO you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users to the application. If you choose to scope who will be provisioned based solely on attributes of the user, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users before rolling out to everyone. When scope for provisioning is set to assigned users, you can control this by assigning one or two users to the app. When scope is set to all users, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Funnel Leasing 

This section guides you through connecting your Microsoft Entra ID to Funnel's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Funnel based on user assignment in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-funnel-leasing-in-azure-ad'></a>

### To configure automatic user provisioning for Funnel Leasing in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Funnel**.

	![Screenshot of the Funnel Leasing link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input `https://nestiolistings.com/scim/v2` as the **Tenant URL** and the **Secret Token** retrieved earlier from your Funnel Account Manager (the authentication Bearer token). Click **Test Connection** to ensure Microsoft Entra ID can connect to Funnel. If the connection fails, ensure you have a valid authentication token with your Funnel Account Manager.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Funnel Leasing**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Funnel Leasing in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Funnel Leasing for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Funnel Leasing API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Funnel Leasing|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |title|String||
   |emails[type eq "work"].value|String||&check;
   |name.givenName|String||&check;
   |name.familyName|String||&check;
   |phoneNumbers[type eq "work"].value|String||
   |phoneNumbers[type eq "mobile"].value|String||
   |externalId|String||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Funnel Leasing, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users that you would like to provision to Funnel Leasing by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Role and Group Mappings
To associate an Azure user to a Funnel role, or an Azure user to a Funnel employee group, Funnel uses a custom mapping functionality.

- Which Azure fields are used?
    
    For role mappings, Funnel looks at the SCIM `title` attribute by default. This SCIM attribute is mapped to the `jobTitle` Azure user attribute by default.
    
    For group mappings, Funnel looks at the SCIM `userType` attribute by default. This SCIM attribute is mapped to the `department` Azure user attribute by default.
    
    If you want to change which fields are used, you can edit the **Attribute Mappings** section and map your desired fields to `title` and `userType`.

- Which values are used?
    
    For initial setup, determine every value that you want to use for role and group mappings. Provide these values to your Funnel Account Manager to set up the configuration in Funnel.
    
    For example, if you want to set the `jobTitle` field with an `agent` value, you will need to tell your Funnel Account Manager which Funnel role this value should be mapped. 
    
    If you need to update or add new values in the future, you will need to notify your Funnel Account Manager.

- How do I associate a user to several roles and groups?
    
    It is not possible to associate a user to several Funnel roles, but it is possible to associate a user to several Funnel employee groups.
    
    To associate a user to several Funnel employee groups, you will need to specify multiple values in the `department` user attribute (or whichever attribute you mapped to `userType`).
    Each value will need to be separated by a delimiter. By default the `-` character is used as the delimiter. To use another delimiter, you will need to notify your Funnel account manager.

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
