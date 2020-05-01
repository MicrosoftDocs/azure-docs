---
title: 'Tutorial: Configure Samanage for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Samanage.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 62d0392f-37d4-436e-9aff-22f4e5b83623
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/13/2020
ms.author: Zhchia
---

# Tutorial: Configure Samanage for automatic user provisioning
This tutorial describes the steps you need to perform in both Samanage and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Samanage](https://www.samanage.com/pricing/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Migrate to the new Samange application

If you have an existing integration with Samanage, please see the section below about up coming changes. If you're setting up Samanage for the first time, you can skip this section and move to **Capabilities supported**.

#### What's changing?
* Changes on the Azure AD side: The authorization method to provision users in Samange has historically been **Basic auth**. Soon you will see the authorization method changed to **Long lived secret token**.


#### What do I need to do to migrate my existing custom integration to the new application?
If you have an existing Samanage integration with valid admin credentials, **no action is required**. We automatically migrate customers to the new application. This process is done completely behind the scenes. If the existing credentials expire, or if you need to authorize access to the application again, you need to generate a long-lived secret token. To generate a new token, refer to Step 2 of this article.


#### How can I tell if my application has been migrated? 
When your application is migrated, in the **Admin Credentials** section, the **Admin Username** and **Admin Password** fields will be replaced with a single **Secret Token** field.

## Capabilities supported
> [!div class="checklist"]
> * Create users in Samanage
> * Remove users in Samanage when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Samanage
> * Provision groups and group memberships in Samanage
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/samanage-tutorial) to Samanage (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [Samanage tenant](https://www.samanage.com/pricing/) with the Professional package.
* A user account in Samanage with admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Samanage](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Samanage to support provisioning with Azure AD

To generate a secret token for authentication refer [this](https://help.samanage.com/s/article/Tutorial-Tokens-Authentication-for-API-Integration-1536721557657).

## Step 3. Add Samanage from the Azure AD application gallery

Add Samanage from the Azure AD application gallery to start managing provisioning to Samanage. If you have previously setup Samanage for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Samanage, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to Samanage 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Samanage in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Samanage**.

	![The Samanage link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://api.samanage.com` in **Tenant URL**.  Input the secret token value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Samanage. If the connection fails, ensure your Samanage account has Admin permissions and try again

	![provisioning](./media/samanage-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Samanage**.

9. Review the user attributes that are synchronized from Azure AD to Samanage in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Samanage for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Samanage API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

      ![Samange User mappings](./media/samanage-provisioning-tutorial/user-attributes.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Samanage**.

11. Review the group attributes that are synchronized from Azure AD to Samanage in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Samanage for update operations. Select the **Save** button to commit any changes.

      ![Samange Group mappings](./media/samanage-provisioning-tutorial/group-attributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Samanage, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Samanage by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).

## Connector limitations

If you select the **Sync all users and groups** option and configure a value for the Samanage **roles** attribute, the value under the **Default value if null (is optional)** box must be expressed in the following format:

- {"displayName":"role"}, where role is the default value you want.

## Change log

* 04/22/2020 - Updated authorization method from basic auth to long lived secret token.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
