---
title: 'Tutorial: Configure PureCloud by Genesys for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to PureCloud by Genesys.
services: active-directory
documentationcenter: ''
author: Zhchia
writer: Zhchia
manager: beatrizd

ms.assetid: 5f04b88b-117e-40da-a15c-e3732b240d5d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/05/2020
ms.author: Zhchia
---

# Tutorial: Configure PureCloud by Genesys for automatic user provisioning

This tutorial describes the steps you need to perform in both PureCloud by Genesys and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [PureCloud by Genesys](https://www.genesys.com) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in PureCloud by Genesys
> * Remove users in PureCloud by Genesys when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and PureCloud by Genesys
> * Provision groups and group memberships in PureCloud by Genesys
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/purecloud-by-genesys-tutorial) to PureCloud by Genesys (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A PureCloud [organization](https://help.mypurecloud.com/?p=81984).
* A User with [permissions](https://help.mypurecloud.com/?p=24360) to create an Oauth Client.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and PureCloud by Genesys](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure PureCloud by Genesys to support provisioning with Azure AD

1. Create an [Oauth Client](https://help.mypurecloud.com/?p=188023) configured in your PureCloud organization.
2. Generate a token [with your oauth client](https://developer.mypurecloud.com/api/rest/authorization/use-client-credentials.html).
3. If you are wanting to automatically provision Group membership within PureCloud, you must [create Groups](https://help.mypurecloud.com/?p=52397) in PureCloud with an identical name to the group in Azure AD.

## Step 3. Add PureCloud by Genesys from the Azure AD application gallery

Add PureCloud by Genesys from the Azure AD application gallery to start managing provisioning to PureCloud by Genesys. If you have previously setup PureCloud by Genesys for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to PureCloud by Genesys, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to PureCloud by Genesys 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for PureCloud by Genesys in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **PureCloud by Genesys**.

	![The PureCloud by Genesys link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your PureCloud by Genesys API URL and Oauth Token in the **Tenant URL** and **Secret Token** fields respectively. The API URL will be be structured as `{{API Url}}/api/v2/scim/v2`, using the API URL for your PureCloud region from the [PureCloud Developer Center](https://developer.mypurecloud.com/api/rest/index.html). Click **Test Connection** to ensure Azure AD can connect to PureCloud by Genesys. If the connection fails, ensure your PureCloud by Genesys account has Admin permissions and try again.

 	![provisioning](./media/purecloud-by-genesys-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to PureCloud by Genesys**.

9. Review the user attributes that are synchronized from Azure AD to PureCloud by Genesys in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in PureCloud by Genesys for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the PureCloud by Genesys API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

     |Attribute|Type|
     |---|---|
     |userName|String|
	 |active|Boolean|
	 |displayName|String|
	 |emails[type eq "work"].value|String|
	 |title|String|
	 |phoneNumbers[type eq "mobile"].value|String|
	 |phoneNumbers[type eq "work"].value|String|
	 |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
     |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to PureCloud by Genesys**.

11. Review the group attributes that are synchronized from Azure AD to PureCloud by Genesys in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in PureCloud by Genesys for update operations. Select the **Save** button to commit any changes. PureCloud by Genesys does not support group creation or deletion and only supports updating of groups.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for PureCloud by Genesys, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to PureCloud by Genesys by choosing the desired values in **Scope** in the **Settings** section.

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
