---
title: 'Tutorial: Configure Apple School Manager for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Apple School Manager.
services: active-directory
documentationcenter: ''
author: Zhchia
writer: Zhchia
manager: beatrizd

ms.assetid: f006c177-7b35-4af1-84f2-db4a4e2bf96a
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/08/2020
ms.author: Zhchia

---

# Tutorial: Configure Apple School Manager for automatic user provisioning



This tutorial describes the steps you need to perform in both Apple School Manager and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users to [Apple School Manager](https://school.apple.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 

## Capabilities Supported
> [!div class="checklist"]
> * Create users in Apple School Manager
> * Remove users in Apple School Manager when they do not require access anymore
> * Keep specific user attributes synchronized between Azure AD and Apple School Manager

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (for example, Application Administrator, Cloud Application Administrator, Application Owner, or Global Administrator). 
* An Apple School Manager account with the role of Administrator, Site Manager, or People Manager.

> [!NOTE]
> Token transfer to Azure AD and  establishing a successful connection has to be completed in 4 calendar days or the process has to be started again.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Apple School Manager](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes).

## Step 2. Configure Apple School Manager to support provisioning with Azure AD

1. In Apple School Manager, sign in with an account that has the role of Administrator,  Site Manager, or People Manager.
2. Click Settings at the bottom of the sidebar click Data Source below Organization Settings, then click Connect to Data Source.
3. Click Connect next to SCIM, carefully read the warning, click Copy, then click Close.
[The Connect to SCIM window, which provides a token and a Copy button under it.]
Leave this window open to copy the Tenant URL from Apple Business Manager to Azure AD, which is: 'https://federation.apple.com/feeds/school/scim'

	![Apple School Manager](media/appleschoolmanager-provisioning-tutorial/scim-token.png)

> [!NOTE]
> The secret token shouldn’t be shared with anyone other than the Azure AD administrator.

## Step 3. Add Apple School Manager from the Azure AD application gallery

Add Apple School Manager from the Azure AD application gallery to start managing provisioning to Apple School Manager. If you have previously setup Apple School Manager for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app).

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users to Apple School Manager, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

## Step 5. Configure automatic user provisioning to Apple School Manager

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

    ![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Apple School Manager**.

    ![The Apple School Manager in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

    ![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

    ![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM 2.0 base URL and Access Token** values retrieved from Apple School Manager in **Tenant URL** and **Secret Token** respectively.. Click **Test Connection** to ensure Azure AD can connect to Apple School Manager. If the connection fails, ensure your Apple School Manager account has Admin permissions and try again.

    ![Token](common/provisioning-testconnection-tenanturltoken.png)

> [!NOTE]
>If the connection is successful, Apple School Manager shows the SCIM connection as active. This process can take up to 60 seconds for Apple School Manager to reflect the latest connection status.

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

    ![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Apple School Manager**.

9. Review the user attributes that are synchronized from Azure AD to Apple School Manager in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Apple School Manager for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.givenName|String|
   |externalId|String|
   |locale|String|
   |timezone|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Apple School Manager, change the **Provisioning Status** to **On** in the Settings section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Apple School Manager by choosing the desired values in **Scope** in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running.

## Step 6. Monitor your deployment

Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Review SCIM requirements for Apple School Manager](https://support.apple.com/guide/apple-school-manager/apdd88331cd6)
* [How a Person ID is used in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd69e1e48e9)
* [Use SCIM to import users into Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd3ec7b95ad)
* [Resolve SCIM user account conflicts in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd313013d12)
* [Delete Azure AD accounts that appear in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apdaa5798fbe)
* [View SCIM activity in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd1bfd8dfde)
* [Manage existing SCIM token and connections in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apdc9a823611)
* [Disconnect the SCIM connection in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd609be3a61)
* [Manage existing SCIM token and connections in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apdc9a8236e9)
* [Troubleshooting the SCIM connection in Apple School Manager](https://support.apple.com/guide/apple-school-manager/apd403a0f3bd)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
