---
title: 'Tutorial: Configure New Relic by Organization for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to New Relic by Organization.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 7fd0d976-4f70-4ce5-992e-3ea4ed8e5d60
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/14/2020
ms.author: Zhchia
---

# Tutorial: Configure New Relic by Organization for automatic user provisioning

This tutorial describes the steps you need to perform in both New Relic by Organization and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [New Relic by Organization](https://newrelic.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in New Relic by Organization
> * Remove users in New Relic by Organization when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and New Relic by Organization
> * Provision groups and group memberships in New Relic by Organization
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/new-relic-limited-release-tutorial) to New Relic by Organization (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* One or more accounts at New Relic by Organization that you would like your users to have access to. 

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and New Relic by Organization](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure New Relic by Organization to support provisioning with Azure AD

Work with your account representative or get support at support.newrelic.com to configure SCIM and SSO for your organization. You will need to provide your account representative with:

- Your organization name
- List of New Relic account IDs to associate with the organization

With this information, your account representative creates an organization record for you in our new system and associates your accounts to the organization.

Your account representative provides you with the following information which you will need to configure the New Relic SCIM/SSO application for your identity provider:

- SCIM Endpoint (Tenant URL)
- SCIM bearer token (Secret Token)

The SCIM bearer token allows the provisioning of your users at New Relic, so please keep the value secured. Your account representative will transfer the SCIM bearer token to you in a secure manner.

## Step 3. Add New Relic by Organization from the Azure AD application gallery

Add New Relic by Organization from the Azure AD application gallery to start managing provisioning to New Relic by Organization. If you have previously setup New Relic by Organization for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to New Relic by Organization, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to New Relic by Organization 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for New Relic by Organization in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **New Relic by Organization**.

	![The New Relic link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://scim-provisioning.service.newrelic.com/scim/v2` in Tenant URL. Input the SCIM authentication token value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to New Relic. If the connection fails, ensure your New Relic account has admin permissions and try again.

 	![provisioning](./media/new-relic-by-organization-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to New Relic by Organization**.

9. Review the user attributes that are synchronized from Azure AD to New Relic by Organization in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in New Relic by Organization for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the New Relic by Organization API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |externalId|String|
   |active|Boolean|
   |emails[type eq "work"].value|String|
   |name.givenName|String|
   |name.formatted|String|
   |timezone|String|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to New Relic by Organization**.

11. Review the group attributes that are synchronized from Azure AD to New Relic by Organization in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in New Relic by Organization for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for New Relic by Organization, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to New Relic by Organization by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  


## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
