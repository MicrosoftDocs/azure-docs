---
title: 'Tutorial: Configure Smartsheet for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Smartsheet.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd
ms.assetid: na
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/07/2019
ms.author: "jeedes"
---

# Tutorial: Configure Smartsheet for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Smartsheet and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to [Smartsheet](https://www.smartsheet.com/pricing). For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Smartsheet
> * Remove users in Smartsheet when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Smartsheet
> * Single sign-on to Smartsheet (recommended)

> [!NOTE]
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* [A Smartsheet tenant](https://www.smartsheet.com/pricing).
* A user account on a Smartsheet Enterprise or Enterprise Premier plan with System Administrator permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Smartsheet](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Smartsheet to support provisioning with Azure AD

Before configuring Smartsheet for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Smartsheet.

1. Sign in as a **SysAdmin** in the **[Smartsheet portal](https://app.smartsheet.com/b/home)** and navigate to **Account Admin**.

	![Smartsheet Account Admin](media/smartsheet-provisioning-tutorial/smartsheet-accountadmin.png)

2. Go to **Security Controls > User Auto Provisioning > Edit**.

	![Smartsheet Security Controls](media/smartsheet-provisioning-tutorial/smartsheet-securitycontrols.png)

3. Add and validate the email domains for the users that you plan to provision from Azure AD to Smartsheet. Choose **Not Enabled** to ensure that all provisioning actions only originate from Azure AD, and to also ensure that your Smartsheet user list is in sync with Azure AD assignments.

	![Smartsheet User Provisioning](media/smartsheet-provisioning-tutorial/smartsheet-userprovisioning.png)

4. Once validation is complete, you will have to activate the domain. 

	![Smartsheet Activate Domain](media/smartsheet-provisioning-tutorial/smartsheet-activatedomain.png)

5. Generate the **Secret Token** required to configure automatic user provisioning with Azure AD by navigating to **Apps and Integrations**.

	![Smartsheet Install](media/smartsheet-provisioning-tutorial/Smartsheet05.png)

6. Choose **API Access**. Click **Generate new access token**.

	![Smartsheet Install](media/smartsheet-provisioning-tutorial/Smartsheet06.png)

7. Define the name of the API Access Token. Click **OK**.

	![Smartsheet Install](media/smartsheet-provisioning-tutorial/Smartsheet07.png)

8. Copy the API Access Token and save it as this will be the only time you can view it. This is required in the **Secret Token** field in Azure AD.

	![Smartsheet token](media/smartsheet-provisioning-tutorial/Smartsheet08.png)

## Step 3. Add Smartsheet from the Azure AD application gallery

Add Smartsheet from the Azure AD application gallery to start managing provisioning to Smartsheet. If you have previously setup Smartsheet for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Smartsheet, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* To ensure parity in user role assignments between Smartsheet and Azure AD, it is recommended to utilize the same role assignments populated in the full Smartsheet user list. To retrieve this user list from Smartsheet, navigate to **Account Admin > User Management > More Actions > Download User List (csv)**.

* To access certain features in the app, Smartsheet requires a user to have multiple roles. To learn more about user types and permissions in Smartsheet, go to [User Types and Permissions](https://help.smartsheet.com/learning-track/shared-users/user-types-and-permissions).

*  If a user has multiple roles assigned in Smartsheet, you **MUST** ensure that these role assignments are replicated in Azure AD to avoid a scenario where users could lose access to Smartsheet objects permanently. Each unique role in Smartsheet **MUST** be assigned to a different group in Azure AD. The user **MUST** then be added to each of the groups corresponding to roles desired. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

## Step 5. Configure automatic user provisioning to Smartsheet 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Smartsheet based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Smartsheet in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Smartsheet**.

	![The Smartsheet link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **SCIM 2.0 base URL and Access Token** values retrieved earlier from Smartsheet in **Tenant URL** and **Secret Token** respectively.. Click **Test Connection** to ensure Azure AD can connect to Smartsheet. If the connection fails, ensure your Smartsheet account has SysAdmin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Smartsheet**.

9. Review the user attributes that are synchronized from Azure AD to Smartsheet in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Smartsheet for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |title|String|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |phoneNumbers[type eq "work"].value|String|
   |phoneNumbers[type eq "mobile"].value|String|
   |phoneNumbers[type eq "fax"].value|String|
   |externalId|String|
   |roles[primary eq "True"].display|String|
   |roles[primary eq "True"].type|String|
   |roles[primary eq "True"].value|String|
   |roles|String|
   urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|String|


10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Smartsheet, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Smartsheet by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Connector limitations

* Smartsheet does not support soft-deletes. When a user's **active** attribute is set to False, Smartsheet deletes the user permanently.

## Change log

* 06/16/2020 - Added support for enterprise extension attributes "Cost Center", "Division", "Manager" and "Department" for users.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
