---
title: 'Tutorial: Configure Azure Databricks SCIM Connector for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Azure Databricks SCIM Connector.
services: active-directory
documentationcenter: ''
author: Zhchia
writer: Zhchia
manager: beatrizd

ms.assetid: b16eaf27-4bd1-4509-be2c-9a4f66b6badc
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2020
ms.author: Zhchia
---

# Tutorial: Configure Azure Databricks SCIM Connector for automatic user provisioning

This tutorial describes the steps you need to perform in both Azure Databricks SCIM Connector and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Azure Databricks SCIM Connector](https://databricks.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Azure Databricks SCIM Connector
> * Remove users in Azure Databricks SCIM Connector when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Azure Databricks SCIM Connector
> * Provision groups and group memberships in Azure Databricks SCIM Connector

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* An Azure Databricks account with admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Azure Databricks SCIM Connector](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Azure Databricks SCIM Connector to support provisioning with Azure AD

1. To set up Azure Databricks SCIM provisioning, add it as a resource in your Azure Active Directory tenant and configure it using the settings below.

 	![Azure Databricks setup](./media/azure-databricks-scim-provisioning-connector-provisioning-tutorial/setup.png)

2. To Generate a personal access token in Azure Databricks refer [this](https://docs.microsoft.com/azure/databricks/dev-tools/api/latest/authentication#token-management).

3. Copy the **Token**. This value will be entered in the Secret Token field in the Provisioning tab of your Azure Databricks SCIM Connector application in the Azure portal.

## Step 3. Add Azure Databricks SCIM Connector from the Azure AD application gallery

Add Azure Databricks SCIM Connector from the Azure AD application gallery to start managing provisioning to Azure Databricks SCIM Connector. If you have previously setup Azure Databricks SCIM Connector for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Azure Databricks SCIM Connector, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to Azure Databricks SCIM Connector 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

> [!NOTE]
> To learn more about Azure Databricks' SCIM endpoint, refer [this](https://docs.databricks.com/dev-tools/api/latest/scim.html
).

### To configure automatic user provisioning for Azure Databricks SCIM Connector in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Azure Databricks SCIM Connector**.

	![The Azure Databricks SCIM Connector link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the SCIM endpoint value in **Tenant URL**. The tenant URL should be in the format `https://<region>.azuredatabricks.net/api/2.0/preview/scim` where the **region** can be found in your Azure Databricks home page URL. For example, a SCIM endpoint for **westus** region will be `https://westus.azuredatabricks.net/api/2.0/preview/scim`. Input the token value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Azure Databricks SCIM Connector. If the connection fails, ensure your Azure Databricks SCIM Connector account has Admin permissions and try again.

 	![provisioning](./media/azure-databricks-scim-provisioning-connector-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Azure Databricks SCIM Connector**.

9. Review the user attributes that are synchronized from Azure AD to Azure Databricks SCIM Connector in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Azure Databricks SCIM Connector for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Azure Databricks SCIM Connector API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |displayName|String|
   |active|Boolean|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Azure Databricks SCIM Connector**.

11. Review the group attributes that are synchronized from Azure AD to Azure Databricks SCIM Connector in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Azure Databricks SCIM Connector for update operations. Select the **Save** button to commit any changes.

     |Attribute|Type|
     |---|---|
     |displayName|String|
     |members|Reference|

11. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Azure Databricks SCIM Connector**.

12. To enable the Azure AD provisioning service for Azure Databricks SCIM Connector, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

13. Define the users and/or groups that you would like to provision to Azure Databricks SCIM Connector by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

14. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Troubleshooting tips
* Databricks always converts their username values to lower case when saving to their directory regardless of the capitalization we send to them via SCIM.
* Currently GET requests against Azure Databricks’ SCIM API for users are case sensitive, so if we query for USER@contoso.com it will come up with 0 results as they store it as user@contoso.com.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
