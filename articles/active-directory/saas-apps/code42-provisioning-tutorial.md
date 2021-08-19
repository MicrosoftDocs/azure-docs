---
title: 'Tutorial: Configure Code42 for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Code42.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: beatrizd

ms.assetid: ddcb950b-3f9a-4ebb-bf78-4ec42d16d52d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/23/2020
ms.author: thwimmer
---

# Tutorial: Configure Code42 for automatic user provisioning

This tutorial describes the steps you need to perform in both Code42 and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Code42](https://www.crashplan.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Code42
> * Remove users in Code42 when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Code42
> * Provision groups and group memberships in Code42
> * [Single sign-on](./code42-tutorial.md) to Code42 (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A Code42 tenant with Identity Management enabled.
* A Code42 user account with [Customer Cloud Admin](https://support.code42.com/Administrator/Cloud/Monitoring_and_managing/Roles_reference#Customer_Cloud_Admin) permission.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Azure AD and Code42](../app-provisioning/customize-application-attributes.md).

## Step 2. Configure Code42 to support provisioning with Azure AD

This section guides you through the steps to configure Azure AD as a provisioning provider in the Identity Management section of Code42's console. Doing so will enable Code42 to securely receive provisioning requests from Azure AD. It is recommended to review [Code42's support documentation](https://support.code42.com/Administrator/Cloud/Configuring/Introduction_to_SCIM_provisioning/How_to_provision_users_to_Code42_from_Azure_AD) before provisioning with Azure AD.

### To create a provisioning provider in Code42's console:

1. Sign in to your Code42 console. Select **Administration** to expand the navigation menu. Select **Settings** then **Identity Management**.
2. Select the **Provisioning** tab. Then expand the **Add provisioning provider** menu and select **Add SCIM provider**.
3. In the **Display name** field, enter a unique name for the provisioning provider. Set the **Authentication credential type** to **OAuth token**. Select **Next** to generate credentials.

> [!NOTE]
>* Keep this window open until prompted for the **Base URL** and **Token** required in the next steps.
>* Alternatively, copy this information to a temporary location for future reference.

## Step 3. Add Code42 from the Azure AD application gallery

Add Code42 from the Azure AD application gallery to start managing provisioning to Code42. If you have previously setup Code42 for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 4. Define who will be in scope for provisioning

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* When assigning users and groups to Code42, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add additional roles.

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).


## Step 5. Configure automatic user provisioning to Code42

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Code42 in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Code42**.

	![The Code42 link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM 2.0 base URL and Access Token** values retrieved earlier from Code42 in **Tenant URL** and **Secret Token** respectively. Click **Test Connection** to ensure Azure AD can connect to Code42. If the connection fails, ensure your Code42 account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Code42**.

9. Review the user attributes that are synchronized from Azure AD to Code42 in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Code42 for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Code42 API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |active|Boolean|
   |title|String|
   |emails[type eq "work"].value|String|
   |name.givenName|String|
   |name.familyName|String|
   |addresses[type eq "work"].locality|String|
   |addresses[type eq "work"].region|String|
   |addresses[type eq "work"].country|String|
   |externalId|String|
   |userType|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Code42**.

11. Review the group attributes that are synchronized from Azure AD to Code42 in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Code42 for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Code42, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Code42 by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running.

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure organization assignments based on SCIM groups in Code42](https://support.code42.com/Administrator/Cloud/Configuring/Introduction_to_SCIM_provisioning/How_to_provision_users_to_Code42_from_Azure_AD#Step_6:_Choose_an_organization_mapping_method)
* [Configure role assignments based on SCIM groups in Code42](https://support.code42.com/Administrator/Cloud/Configuring/Introduction_to_SCIM_provisioning/How_to_provision_users_to_Code42_from_Azure_AD#Step_7:_Configure_role_mapping)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)