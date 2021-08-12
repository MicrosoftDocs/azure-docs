---
title: 'Tutorial: Configure Tribeloo for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Tribeloo.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: beatrizd

ms.assetid: d1063ef2-5d39-4480-a1e2-f58ebe7f98c3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/07/2021
ms.author: twimmers
---

# Tutorial: Configure Tribeloo for automatic user provisioning

This tutorial describes the steps you need to perform in both Tribeloo and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Tribeloo](https://www.tribeloo.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Tribeloo.
> * Remove users in Tribeloo when they do not require access anymore.
> * Keep user attributes synchronized between Azure AD and Tribeloo.
> * [Single sign-on](tribeloo-tutorial.md) to Tribeloo (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [Tribeloo](https://www.tribeloo.com/) tenant.
* A user account in Tribeloo with Admin permissions.


## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Azure AD and Tribeloo](../app-provisioning/customize-application-attributes.md). 

## Step 2. Configure Tribeloo to support provisioning with Azure AD

Navigate to the [Tribeloo app](https://app.tribeloo.com/) and log as a user with Admin permissions.
1. Using the side menu(1), navigate to **Admin**(2), select **User management**(3)

	![Access User Management](media/tribeloo-provisioning-tutorial/tribeloo-user-management.png)

1. Select the **User provisioning**(1) tab. On this tab, you have access to Tribeloo information that you will have to use to configure the Azure AD integration.
   1. **SCIM base url** (2)
   1. **SCIM Bearer token** (3)
1. Copy these values to the clipboard and paste them in the corresponding Azure AD fields (see Step 5). The AD fields are named **Tenant URL** and **Secret Token** respectively.

	![Tribeloo Provisioning Parameters](media/tribeloo-provisioning-tutorial/tribeloo-provisioning-parameters.png)

1. On the **User Provisioning** tab you can now click the **Enable User provisioning**(1) button to enable user provisioning in Tribeloo.

	![Tribeloo Enable Provisioning](media/tribeloo-provisioning-tutorial/tribeloo-enable-provisioning.png)

## Step 3. Add Tribeloo from the Azure AD application gallery

Add Tribeloo from the Azure AD application gallery to start managing provisioning to Tribeloo. If you have previously setup Tribeloo for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* When assigning users and groups to Tribeloo, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 


## Step 5. Configure automatic user provisioning to Tribeloo 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Tribeloo based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Tribeloo in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Tribeloo**.

	![The Tribeloo link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your Tribeloo **Tenant URL** and **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Tribeloo. If the connection fails , ensure your Tribeloo account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Azure Active Directory Users to Tribeloo**.

1. Review the user attributes that are synchronized from Azure AD to Tribeloo in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Tribeloo for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Tribeloo API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;
   |emails[type eq "work"].value|String|
   |active|Boolean|   
   |displayName|String|
   |name.givenName|String|
   |name.familyName|String|
   |addresses[type eq "work"].formatted|String|

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for Tribeloo, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Tribeloo by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md). 

## Change Log
* 08/12/2021 - Added support for core user attributes **emails[type eq "work"].value** and **addresses[type eq "work"].formatted**.

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)