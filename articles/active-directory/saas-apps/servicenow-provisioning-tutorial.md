---
title: 'Tutorial: Configure ServiceNow for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to ServiceNow.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 4d6f06dd-a798-4c22-b84f-8a11f1b8592a
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2019
ms.author: zchia
---

# Tutorial: Configure ServiceNow for automatic user provisioning

The tutorial demonstrate the steps to be performed in ServiceNow and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to [ServiceNow](https://www.servicenow.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


<img src="media/servicenow-provisioning-tutorial/ServiceNowLogo.png" width="100">


## Capabilities Supported
* Create users in ServiceNow
* Remove users in ServiceNow when they do not require access anymore
* Keep user attributes sunchronized between Azure AD and ServiceNow
* Provision groups and group memberships in ServiceNow

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [ServiceNow instance](https://www.servicenow.com/) of Calgary or higher
* A [ServiceNow Express instance](https://www.servicenow.com/) of Helsinki or higher
* A user account in ServiceNow with the following permissions:

## 1. Plan your provisioning deployment
1. Learn about how provisioning the provisioning service works
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts)
3. Determine what data to [map between Azure AD and ServiceNow](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## 2. Configure ServiceNow to support provisioning with Azure AD

1. Sign in to your [TestApp Admin Console](https://www.Leapsome.com/app/#/login). Navigate to **Settings > Admin Settings**.

	![TestApp Admin Console](media/Leapsome-provisioning-tutorial/leapsome-admin-console.png)

2.	Navigate to **Integrations > SCIM User provisioning**.

	![TestApp Add SCIM](media/Leapsome-provisioning-tutorial/leapsome-add-scim.png)

3.	Copy the **SCIM Authentication Token**. This value will be entered in the Secret Token field in the Provisioning tab of your TestApp application in the Azure portal.

	![TestApp Create Token](media/Leapsome-provisioning-tutorial/leapsome-create-token.png)

## 3. Add ServiceNow from the Azure AD application gallery

Add ServiceNow from the Azure AD application gallery to start managing provisioning to ServiceNow. If you have previously setup ServiceNow for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## 4. Assign users to ServiceNow 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. 

#### Important tips for assigning users to ServiceNow
* When assigning users and groups to ServiceNow, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users / groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## 5. Configure automatic user provisioning to ServiceNow 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for TestApp , following the instructions provided in the [TestApp Single sign-on tutorial](Leapsome-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other

### To configure automatic user provisioning for ServiceNow in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **ServiceNow**.

	![The ServiceNow link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your ServiceNow admin credentials and username. Click **Test Connection** to ensure Azure AD can connect to ServiceNow. If the connection fails, ensure your ServiceNow account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to ServiceNow**.

	![TestApp User Mappings](media/Leapsome-provisioning-tutorial/Leapsome-user-mappings.png)

9. Review the user attributes that are synchronized from Azure AD to ServiceNow in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in ServiceNow for update operations. Select the **Save** button to commit any changes.

	![TestApp User Attributes](media/Leapsome-provisioning-tutorial/Leapsome-user-attributes.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to ServiceNow**.

	![TestApp Group Mappings](media/Leapsome-provisioning-tutorial/Leapsome-group-mappings.png)

11. Review the group attributes that are synchronized from Azure AD to ServiceNow in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in ServiceNow for update operations. Select the **Save** button to commit any changes.

	![TestApp Group Attributes](media/Leapsome-provisioning-tutorial/Leapsome-group-attributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for ServiceNow, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to ServiceNow by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## 6. Monitor your deployment
Once you've configured provisioing, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the progress bar to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarnatine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Troubleshooting Tips
* **InvalidLookupReference:** When provisioning certain attributes such as Department and Location in ServiceNow, the values must already exist in a reference table in ServiceNow. For example, you may have 2 locations (Seattle, Los Angelas) and 3 departments (Sales, Finance, Marketing) in the **insert table name** table in ServiceNow. If you attempt to provision a user wher his deparment is "Sales" and location is "Seattle" he will be provisioned successfully. If you attempt to provision a user with department "Sales" and location "LA" the user won't be provisioned. The location LA must either be added to the reference table in ServiceNow or the user attribute in Azure AD must be updated to match the format in ServiceNow. 
* **EntryJoiningPropertyValueIsMissing:** Review your [attribute mappings](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) to identify the matching attribute. This value must be present on the user or group you're attempting to provision. 
* Review the [ServiceNow SOAP API](https://docs.servicenow.com/bundle/newyork-application-development/page/integrate/web-services-apis/reference/r_DirectWebServiceAPIFunctions.html) to understand any requirements or limitations (e.g. format to specify country code for a user )
* Describe how to configure referential attributes
* Some ServiceNow deployments require whitelisting IP ranges for the Azure AD provisioning service. The reserved IP ranges for the Azure AD provisioning service can be found [here](https://www.microsoft.com/download/details.aspx?id=56519) under "AzureActiveDirectoryDomainServices."

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
