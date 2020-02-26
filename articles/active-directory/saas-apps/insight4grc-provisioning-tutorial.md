---
title: 'Tutorial: Configure Insight4GRC for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Insight4GRC.
services: active-directory
documentationcenter: ''
author: Zhchia
writer: Zhchia
manager: beatrizd

ms.assetid: d0eab8a0-571b-4609-96b1-bdbc761a25de
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/04/2020
ms.author: Zhchia
---

# Tutorial: Configure Insight4GRC for automatic user provisioning

This tutorial describes the steps you need to perform in both Insight4GRC and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Insight4GRC](https://www.rsmuk.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Insight4GRC
> * Remove users in Insight4GRC when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Insight4GRC
> * Provision groups and group memberships in Insight4GRC
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/insight4grc-tutorial) to Insight4GRC (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A user account in Insight4GRC with Admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Insight4GRC](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Insight4GRC to support provisioning with Azure AD

Before configuring Insight4GRC for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Insight4GRC.

1. To obtain the bearer token, end-customer needs to contact [support team](mailto:support.ss@rsmuk.com).
2. To obtain the SCIM endpoint URL, you will need to have your Insight4GRC domain name ready as it will be used to construct your SCIM endpoint URL. You can retrieve your Insight4GRC domain name as part of the initial software purchase with Insight4GRC.

## Step 3. Add Insight4GRC from the Azure AD application gallery

Add Insight4GRC from the Azure AD application gallery to start managing provisioning to Insight4GRC. If you have previously setup Insight4GRC for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Insight4GRC, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to Insight4GRC 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Insight4GRC in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Insight4GRC**.

	![The Insight4GRC link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the SCIM endpoint URL in **Tenant URL**. The enpoint URL should be in the format `https://<Insight4GRC Domain Name>.insight4grc.com/public/api/scim/v2 ` where **Insight4GRC Domain Name** is the value retrieved in previous steps. Input the bearer token value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Insight4GRC. If the connection fails, ensure your Insight4GRC account has Admin permissions and try again.

 	![provisioning](./media/insight4grc-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Insight4GRC**.

9. Review the user attributes that are synchronized from Azure AD to Insight4GRC in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Insight4GRC for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Insight4GRC API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |externalId|String|
   |active|Boolean|
   |title|String|
   |name.givenName|String|
   |name.familyName|String|
   |emails[type eq "work"].value|String|
   |phoneNumbers[type eq "work"].value|String|

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Insight4GRC**.

11. Review the group attributes that are synchronized from Azure AD to Insight4GRC in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Insight4GRC for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Insight4GRC, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Insight4GRC by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully.
* Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion.
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
