---
title: 'Tutorial: Configure CybSafe for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to CybSafe.
services: active-directory
author: twimmers
writer: twimmers
manager: beatrizd
ms.assetid: 7255fe44-1662-4ae4-9ff3-9492911b7ce0
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/12/2020
ms.author: thwimmer
---

# Tutorial: Configure CybSafe for automatic user provisioning

This tutorial describes the steps you need to perform in both CybSafe and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [CybSafe](https://app.cybsafe.com/login) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in CybSafe
> * Remove users in CybSafe when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and CybSafe
> * Provision groups and group memberships in CybSafe

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [CybSafe](https://app.cybsafe.com/login) Administrator account with an enterprise subscription.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Azure AD and CybSafe](../app-provisioning/customize-application-attributes.md). 

## Step 2. Configure CybSafe to support provisioning with Azure AD

1. The **Tenant URL** for CybSafe is: `https://app.cybsafe.com/scim/v2/`. This value will be entered in the Provisioning tab of your CybSafe application in the Azure portal.
2. Login to [CybSafe](https://app.cybsafe.com/login) with your administrator account.
3. Navigate to [Settings->Identity Management](https://app.cybsafe.com/settings/identity-management). 
4. Click **Generate Token** in the User Provisioning section. This value will be entered in the Provisioning tab of your CybSafe application in the Azure portal.

## Step 3. Add CybSafe from the Azure AD application gallery

Add CybSafe from the Azure AD application gallery to start managing provisioning to CybSafe. If you have previously setup CybSafe for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* When assigning users and groups to CybSafe, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 


## Step 5. Configure automatic user provisioning to CybSafe 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for CybSafe in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

    ![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **CybSafe**.

    ![The CybSafe link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

    ![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

    ![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your CybSafe Tenant URL and Secret Token. Click **Test Connection** to ensure Azure AD can connect to CybSafe. If the connection fails, ensure your CybSafe account has Admin permissions and try again.

    ![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

    ![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to CybSafe**.

9. Review the user attributes that are synchronized from Azure AD to CybSafe in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in CybSafe for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the CybSafe API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;|
   |active|Boolean|
   |displayName|String|
   |title|String|
   |preferredLanguage|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |name.honorificPrefix|String|
   |name.honorificSuffix|String|
   |nickName|String|
   |phoneNumbers[type eq "mobile"].value|String|
   |emails[type eq "work"].value|String|
   |locale|String|
   |timezone|String|
   |userType|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String|
   

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to CybSafe**.

11. Review the group attributes that are synchronized from Azure AD to CybSafe in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in CybSafe for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for filtering|
      |---|---|---|
      |displayName|String|&check;|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for CybSafe, change the **Provisioning Status** to **On** in the **Settings** section.

      ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to CybSafe by choosing the desired values in **Scope** in the **Settings** section.

      ![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

      ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Change log

* 02/15/2021 - User enterprise extension attribute **department**, **division** and **organization** have been added.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)