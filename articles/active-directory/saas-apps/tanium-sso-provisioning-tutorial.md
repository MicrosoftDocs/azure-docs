---
title: 'Tutorial: Configure Tanium SSO for automatic user provisioning with Azure Active Directory'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Tanium SSO.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 967937de3-81c7-4c61-ae7e-7dad6c46411b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/10/2023
ms.author: thwimmer
---

# Tutorial: Configure Tanium SSO for automatic user provisioning

This tutorial describes the steps you need to perform in both Tanium SSO and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Tanium SSO](https://www.tanium.com/) using the Azure AD Provisioning service. These capabilities are supported only for Tanium Cloud customers. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in Tanium SSO.
> * Remove users in Tanium SSO when they do not require access anymore.
> * Keep user attributes synchronized between Azure AD and Tanium SSO.
> * Provision groups and group memberships in Tanium SSO.
> * [Single sign-on](tanium-cloud-sso-tutorial.md) to Tanium SSO (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in Tanium SSO with Admin permissions.

## Step 1. Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Azure AD and Tanium SSO](../app-provisioning/customize-application-attributes.md).

## Step 2. Enable SCIM Provisioning in the Tanium Cloud Management Portal (CMP)

* Follow the steps in the [Tanium Cloud Deployment Guide: Configure SCIM Provisioning](https://docs.tanium.com/cloud/cloud/configuring_identity_providers.html#configure_scim) to enable automatic user provisioning in Tanium Cloud.
* Retain the **Token** and **SCIM API URL** values for later use in configuring Tanium SSO. Copy the entire token string, formatted like `token-\<58 alphanumeric characters\>`.

## Step 3. Add Tanium SSO from the Azure AD application gallery

Add Tanium SSO from the Azure AD application gallery to start managing provisioning to Tanium SSO. If you have previously setup Tanium SSO for SSO you can use the same application. However, it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 5. Configure automatic user provisioning to Tanium SSO 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Tanium based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Tanium SSO in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Tanium SSO**.

	![Screenshot of the Tanium SSO link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Tanium SSO **Tenant URL** and **Secret Token** that you previously retrieved from the Tanium CMP. Click **Test Connection** to ensure Azure AD can connect to Tanium SSO. If the connection fails, ensure that you entered the complete token value, including the `token-` prefix.

	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Tanium SSO**.

1. Review the user attributes that are synchronized from Azure AD to Tanium SSO in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Tanium SSO for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Tanium SSO API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Tanium SSO|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |displayName|String||&check;
   |externalId|String||&check;


1. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Tanium SSO**.

1. Review the group attributes that are synchronized from Azure AD to Tanium SSO in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Tanium SSO for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Tanium SSO|
   |---|---|---|---|
   |displayName|String|&check;|&check;
   |externalId|String||&check;
   |members|Reference||
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for Tanium SSO, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Tanium SSO by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
