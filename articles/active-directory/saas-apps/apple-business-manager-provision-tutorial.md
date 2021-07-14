---

title: 'Tutorial: Configure Apple Business Manager for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Apple Business Manager.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: beatrizd
ms.assetid: 4ad30031-9904-4ac3-a4d2-e8c28d44f319
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/08/2020
ms.author: thwimmer

---

# Tutorial: Configure Apple Business Manager for automatic user provisioning



This tutorial describes the steps you need to perform in both Apple Business Manager and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users to [Apple Business Manager](https://business.apple.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 

## Capabilities Supported
> [!div class="checklist"]
> * Create users in Apple Business Manager
> * Remove users in Apple Business Manager when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Apple Business Manager

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An Apple Business Manager account with the role of Administrator or People Manager.

> [!NOTE]
> Token transfer to Azure AD and  establishing a successful connection has to be completed in 4 calendar days or the process has to be started again.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Azure AD and Apple Business Manager](../app-provisioning/customize-application-attributes.md). 

## Step 2. Configure Apple Business Manager to support provisioning with Azure AD

1. In Apple Business Manager, sign in with an account that has the role of Administrator or People Manager.
2. Click Settings at the bottom of the sidebar click Data Source below Organization Settings, then click Connect to Data Source.
3. Click Connect next to SCIM, carefully read the warning, click Copy, then click Close.
[The Connect to SCIM window, which provides a token and a Copy button under it.]
Leave this window open to copy the Tenant URL from Apple Business Manager to Azure AD, which is: 'https://federation.apple.com/feeds/business/scim'

	![Apple Business Manager](media/applebusinessmanager-provisioning-tutorial/scim-token.png)

> [!NOTE]
> The secret token shouldn’t be shared with anyone other than the Azure AD administrator.

## Step 3. Add Apple Business Manager from the Azure AD application gallery

Add Apple Business Manager from the Azure AD application gallery to start managing provisioning to Apple Business Manager. If you have previously setup Apple Business Manager for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* When assigning users to Apple Business Manager, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

## Step 5. Configure automatic user provisioning to Apple Business Manager

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Apple Business Manager**.

	![The Apple Business Manager in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM 2.0 base URL and Access Token** values retrieved from Apple Business Manager in **Tenant URL** and **Secret Token** respectively.. Click **Test Connection** to ensure Azure AD can connect to Apple Business Manager. If the connection fails, ensure your Apple Business Manager account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

> [!NOTE]
>If the connection is successful, Apple Business Manager shows the SCIM connection as active. This process can take up to 60 seconds for Apple Business Manager to reflect the latest connection status.

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Apple Business Manager**.

9. Review the user attributes that are synchronized from Azure AD to Apple Business Manager in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Apple Business Manager for update operations. Select the **Save** button to commit any changes.

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

11. To enable the Azure AD provisioning service for Apple Business Manager, change the **Provisioning Status** to **On** in the Settings section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Apple Business Manager by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running.

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Review SCIM requirements for Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apdd88331cd6)
* [How a Person ID is used in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd69e1e48e9)
* [Use SCIM to import users into Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd3ec7b95ad)
* [Resolve SCIM user account conflicts in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd313013d12)
* [Delete Azure AD accounts that appear in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apdaa5798fbe)
* [View SCIM activity in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd1bfd8dfde)
* [Manage existing SCIM token and connections in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apdc9a823611)
* [Disconnect the SCIM connection in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd609be3a61)
* [Troubleshooting the SCIM connection in Apple Business Manager](https://support.apple.com/guide/apple-business-manager/apd403a0f3bd/web)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)