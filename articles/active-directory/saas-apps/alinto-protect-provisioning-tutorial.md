---
title: 'Tutorial: Configure Alinto Protect for automatic user provisioning with Azure Active Directory'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Alinto Protect.
services: active-directory
author: twimmers
writer: twimmers
manager: beatrizd
ms.assetid: cc47804c-2d00-402f-8aa5-b6155a81d78d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Alinto Protect for automatic user provisioning

This tutorial describes the steps you need to do in both Alinto Protect and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Alinto Protect](https://www.alinto.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Alinto Protect
> * Remove users in Alinto Protect when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Alinto Protect
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to Alinto Protect (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in Alinto Protect with Admin permission

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Azure AD and Alinto Protect](../app-provisioning/customize-application-attributes.md). 

## Step 2. Configure Alinto Protect to support provisioning with Azure AD

Contact [Alinto Protect Support](https://www.alinto.com/contact-email-provider/) to configure Alinto to support provisioning with Azure AD.

## Step 3. Add Alinto Protect from the Azure AD application gallery

Add Alinto Protect from the Azure AD application gallery to start managing provisioning to Alinto Protect. If you have previously setup Alinto Protect for SSO, you can use the same application. However it's recommended you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user and group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5. Configure automatic user provisioning to Alinto Protect 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and groups in Alinto Protect based on user and group assignments in Azure AD.

### To configure automatic user provisioning for Alinto Protect in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Alinto Protect**.

	![The Alinto Protect link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your Alinto Protect Tenant URL as `https://cloud.cleanmail.{Domain}/api/v3/scim2` and corresponding Secret Token obtained from Step 2. Click **Test Connection** to ensure Azure AD can connect to Alinto Protect. If the connection fails, ensure your Alinto Protect account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

	>[!NOTE]
	>In the Tenant URL, **{Domain}** will be the country code top-level domain. For example, if the country is US, then the Tenant URL will be `https://cloud.cleanmail.com/api/v3/scim2`

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Azure Active Directory Users to Alinto Protect**.

1. Review the user attributes that are synchronized from Azure AD to Alinto Protect in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Alinto Protect for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Alinto Protect API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Alinto Protect|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |name.givenName|String||
   |name.familyName|String||
   |externalId|String||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for Alinto Protect, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and groups that you would like to provision to Alinto Protect by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to complete than next cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)