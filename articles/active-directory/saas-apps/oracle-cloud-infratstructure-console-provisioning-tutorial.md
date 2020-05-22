---
title: 'Tutorial: Configure Oracle Cloud Infrastructure Console for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Oracle Cloud Infrastructure Console.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: e22c8746-7638-4a0f-ae08-7db0c477cf52
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2020
ms.author: Zhchia
---

# Tutorial: Configure Oracle Cloud Infrastructure Console for automatic user provisioning

This tutorial describes the steps you need to perform in both Oracle Cloud Infrastructure Console and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Oracle Cloud Infrastructure Console](https://www.oracle.com/cloud/free/?source=:ow:o:p:nav:0916BCButton&intcmp=:ow:o:p:nav:0916BCButton) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Oracle Cloud Infrastructure Console
> * Remove users in Oracle Cloud Infrastructure Console when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Oracle Cloud Infrastructure Console
> * Provision groups and group memberships in Oracle Cloud Infrastructure Console
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/oracle-cloud-tutorial) to Oracle Cloud Infrastructure Console (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* An Oracle Cloud Infrastructure Control [tenant](https://www.oracle.com/cloud/sign-in.html?intcmp=OcomFreeTier&source=:ow:o:p:nav:0916BCButton).
* A user account in Oracle Cloud Infrastructure Control with Admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Oracle Cloud Infrastructure Console](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Oracle Cloud Infrastructure Console to support provisioning with Azure AD

1. Login to Oracle Cloud Infrastructure Console's admin portal. On the top left corner of the screen navigate to **Identity > Federation**.

	![Oracle Admin](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/identity.png)

2. Click on the URL displayed on the page beside Oracle Identity Cloud Service Console.

	![Oracle URL](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/url.png)

3. Click on **Add Identity Provider** to create a new identity provider. Save the IdP id to be used as a part of tenant URL.Click on plus icon beside the **Applications** tab to create an OAuth Client and Grant IDCS Identity Domain Administrator AppRole.

	![Oracle Cloud Icon](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/add.png)

4. Follow the screenshots below to configure your application. Once the configuration is done click on **Save**.

	![Oracle Configuration](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/configuration.png)

	![Oracle Token Issuance Policy](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/token-issuance.png)

5. Under the configurations tab of your application expand the **General Information** option to retrieve the client ID and client secret.

	![Oracle token generation](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/general-information.png)

6. To generate a secret token Base64 encode the client ID and client secret in the format **client ID:Client Secret**. Save the secret token. This value will be entered in the **Secret Token** field in the provisioning tab of your Oracle Cloud Infrastructure Console application in the Azure portal.

## Step 3. Add Oracle Cloud Infrastructure Console from the Azure AD application gallery

Add Oracle Cloud Infrastructure Console from the Azure AD application gallery to start managing provisioning to Oracle Cloud Infrastructure Console. If you have previously setup Oracle Cloud Infrastructure Console for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Oracle Cloud Infrastructure Console, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to Oracle Cloud Infrastructure Console 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Oracle Cloud Infrastructure Console in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Oracle Cloud Infrastructure Console**.

	![The Oracle Cloud Infrastructure Console link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **Tenant URL** in the format `https://<IdP ID>.identity.oraclecloud.com/admin/v1` . For example `https://idcs-0bfd023ff2xx4a98a760fa2c31k92b1d.identity.oraclecloud.com/admin/v1`. Input the secret token value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Oracle Cloud Infrastructure Console. If the connection fails, ensure your Oracle Cloud Infrastructure Console account has admin permissions and try again.

    ![provisioning](./media/oracle-cloud-infratstructure-console-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Oracle Cloud Infrastructure Console**.

9. Review the user attributes that are synchronized from Azure AD to Oracle Cloud Infrastructure Console in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Oracle Cloud Infrastructure Console for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Oracle Cloud Infrastructure Console API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |userName|String|
	  |active|Boolean|
	  |title|String|
	  |emails[type eq "work"].value|String|
	  |preferredLanguage|String|
	  |name.givenName|String|
	  |name.familyName|String|
	  |addresses[type eq "work"].formatted|String|
	  |addresses[type eq "work"].locality|String|
	  |addresses[type eq "work"].region|String|
	  |addresses[type eq "work"].postalCode|String|
	  |addresses[type eq "work"].country|String|
	  |addresses[type eq "work"].streetAddress|String|
	  |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
      |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
	  |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String|
	  |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
	  |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|
	  |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String|
	  |urn:ietf:params:scim:schemas:oracle:idcs:extension:user:User:bypassNotification|Boolean|
	  |urn:ietf:params:scim:schemas:oracle:idcs:extension:user:User:isFederatedUser|Boolean|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Oracle Cloud Infrastructure Console**.

11. Review the group attributes that are synchronized from Azure AD to Oracle Cloud Infrastructure Console in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Oracle Cloud Infrastructure Console for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
	  |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Oracle Cloud Infrastructure Console, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Oracle Cloud Infrastructure Console by choosing the desired values in **Scope** in the **Settings** section.

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
