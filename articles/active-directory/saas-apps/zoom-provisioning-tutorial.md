---
title: 'Tutorial: Configure Zoom for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Zoom.
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
ms.date: 06/3/2019
ms.author: Zhchia
---

# Tutorial: Configure Zoom for automatic user provisioning

This tutorial describes the steps you need to perform in both Zoom and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [Zoom](https://zoom.us/pricing/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Zoom
> * Remove users in Zoom when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Zoom
> * [Single sign-on](https://docs.microsoft.com/azure/active-directory/saas-apps/zoom-tutorial) to Zoom (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* [A Zoom tenant](https://zoom.us/pricing).
* A user account in Zoom with Admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
2. Determine who will be in [scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).
3. Determine what data to [map between Azure AD and Zoom](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes). 

## Step 2. Configure Zoom to support provisioning with Azure AD

1. Sign in to your [Zoom Admin Console](https://zoom.us/signin). Navigate to **Advanced > Zoom for Developers** in the left navigation pane.

	![Zoom Integrations](media/zoom-provisioning-tutorial/zoom01.png)

2. Navigate to **Manage** in the top-right corner of the page. 

	![Zoom Install](media/zoom-provisioning-tutorial/zoom02.png)

3. Navigate to your created Azure AD app. 
	
	![Zoom App](media/zoom-provisioning-tutorial/zoom03.png)

4. Select **App Credentials** in the left navigation pane.

	![Zoom App](media/zoom-provisioning-tutorial/zoom04.png)

5. Copy and save the **JWT Token**. This value will be entered in the **Secret Token** field in the Provisioning tab of your Zoom application in the Azure portal. If you need a new non-expiring token, you will need to reconfigure the expiration time which will auto generate a new token. 

	![Zoom Install](media/zoom-provisioning-tutorial/zoom05.png)

## Step 3. Add Zoom from the Azure AD application gallery

Add Zoom from the Azure AD application gallery to start managing provisioning to Zoom. If you have previously setup Zoom for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 

* When assigning users and groups to Zoom, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add additional roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts). 


## Step 5. Configure automatic user provisioning to Zoom 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Zoom in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Zoom**.

	![The Zoom link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, enter `https://api.zoom.us/scim` in **Tenant URL**. Input the **JWT Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Zoom. If the connection fails, ensure your Zoom account has Admin permissions and try again.

 	![Zoom provisioning](./media/zoom-provisioning-tutorial/provisioning.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Zoom**.

9. Review the user attributes that are synchronized from Azure AD to Zoom in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zoom for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Zoom API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |active|Boolean|
   |name.givenName|String|
   |name.familyName|String|
   |emails[type eq "work"]|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Zoom, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Zoom by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Connector limitations
* Zoom only allows a maximum of 9,999 basic users today.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
