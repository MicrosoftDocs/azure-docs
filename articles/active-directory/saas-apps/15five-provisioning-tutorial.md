---
title: 'Tutorial: Configure 15Five for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to 15Five.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: a276c004-9f71-4efc-8cca-1f615760249f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2019
ms.author: zhchia
---

# Tutorial: Configure 15Five for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in 15Five and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to [15Five](https://www.15five.com/pricing/). For important details on what this service does, how it works, and frequently asked questions, see Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory.

> [!NOTE]
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Capabilities supported
> [!div class="checklist"]
> * Create users in 15Five
> * Remove users in 15Five when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and 15Five
> * Provision groups and group memberships in 15Five
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/15five-tutorial) to 15Five (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) .
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* [A 15Five tenant](https://www.15five.com/pricing/).
* A user account in 15Five with Admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and 15Five](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure 15Five to support provisioning with Azure AD

Before configuring 15Five for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on 15Five.

1. Sign in to your [15Five Admin Console](https://my.15five.com/). Navigate to **Features > Integrations**.

	![15Five Admin Console](media/15five-provisioning-tutorial/integration.png)

2.	Click on **SCIM 2.0**.

	![15Five Admin Console](media/15five-provisioning-tutorial/image00.png)

3.	Navigate to **SCIM integration > Generate OAuth token**.

	![15Five Add SCIM](media/15five-provisioning-tutorial/image02.png)

4.	Copy the values for **SCIM 2.0 base URL** and **Access Token**. This value will be entered in the **Tenant URL** and **Secret Token** field in the Provisioning tab of your 15Five application in the Azure portal.
	
	![15Five Add SCIM](media/15five-provisioning-tutorial/image03.png)

## Step 3. Add 15Five from the Azure AD application gallery

Add 15Five from the Azure AD application gallery to start managing provisioning to 15Five. If you have previously setup 15Five for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to 15Five, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).

## Step 5. Configure automatic user provisioning to 15Five 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in 15Five based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for 15Five in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **15Five**.

	![The 15Five link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5.	Under the Admin Credentials section, input the **SCIM 2.0 base URL and Access Token** values retrieved earlier in the **Tenant URL** and **Secret Token** fields respectively. Click **Test Connection** to ensure Azure AD can connect to 15Five. If the connection fails, ensure your 15Five account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to 15Five**.

9. Review the user attributes that are synchronized from Azure AD to 15Five in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in 15Five for update operations. Select the **Save** button to commit any changes.


   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |title|String|
   |emails[type eq "work"].value|String|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |externalId|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:15Five:2.0:User:location|String|
   |urn:ietf:params:scim:schemas:extension:15Five:2.0:User:startDate|String|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to 15Five**.

11. Review the group attributes that are synchronized from Azure AD to 15Five in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in 15Five for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |externalId|String|
      |displayName|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for 15Five, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to 15Five by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running.

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  
	
## Connector limitations

* 15Five does not support soft deletes for users.

## Change log

* 06/16/2020 - Added support for enterprise extension attribute "Manager" and custom attributes "Location" and "Start Date" for users.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
