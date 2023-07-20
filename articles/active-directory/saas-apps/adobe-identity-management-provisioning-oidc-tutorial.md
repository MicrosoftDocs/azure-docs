---
title: 'Tutorial: Configure Adobe Identity Management (OIDC) for automatic user provisioning with Azure Active Directory'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Adobe Identity Management (OIDC).
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: baa54168-d23a-49d8-94d1-28476138cd90
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Adobe Identity Management (OIDC) for automatic user provisioning

This tutorial describes the steps you need to perform in both Adobe Identity Management (OIDC) and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to Adobe Identity Management (OIDC) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Adobe Identity Management (OIDC)
> * Disable users in Adobe Identity Management (OIDC) when they do not require access anymore
> * Keep user attributes synchronized between Azure AD and Adobe Identity Management (OIDC)
> * Provision groups and group memberships in Adobe Identity Management (OIDC)
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to Adobe Identity Management (OIDC) (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A federated directory in the [Adobe Admin Console](https://adminconsole.adobe.com/) with verified domains.
* Review the [adobe documentation](https://helpx.adobe.com/enterprise/admin-guide.html/enterprise/using/add-azure-sync.ug.html) on user provisioning 

> [!NOTE]
> If your organization uses the User Sync Tool or a UMAPI integration, you must first pause the integration. Then, add Azure AD automatic provisioning to automate user management from the Azure portal. Once Azure AD automatic provisioning is configured and running, you can completely remove the User Sync Tool or UMAPI integration.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Azure AD and Adobe Identity Management (OIDC)](../app-provisioning/customize-application-attributes.md). 

## Step 2. Configure Adobe Identity Management (OIDC) to support provisioning with Azure AD

1. Login to [Adobe Admin Console](https://adminconsole.adobe.com/). Navigate to **Settings > Directory Details > Sync**. 

1. Click **Add Sync**.

    ![Add](media/adobe-identity-management-provisioning-tutorial/add-sync.png)

1. Select **Sync users from Microsoft Azure** and click **Next**.

    ![Screenshot that shows 'Sync users from Microsoft Azure Active Directory' selected.](media/adobe-identity-management-provisioning-tutorial/sync-users.png)

1. Copy and save the **Tenant URL** and the **Secret token**. These values will be entered in the **Tenant URL** and **Secret Token** fields in the Provisioning tab of your Adobe Identity Management (OIDC) application in the Azure portal.

    ![Sync](media/adobe-identity-management-provisioning-tutorial/token.png)

## Step 3. Add Adobe Identity Management (OIDC) from the Azure AD application gallery

Add Adobe Identity Management (OIDC) from the Azure AD application gallery to start managing provisioning to Adobe Identity Management (OIDC). If you have previously setup Adobe Identity Management (OIDC) for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5. Configure automatic user provisioning to Adobe Identity Management (OIDC) 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Adobe Identity Management (OIDC) in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

    ![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Adobe Identity Management (OIDC)**.

    ![The Adobe Identity Management (OIDC) link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

    ![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

    ![Provisioning tab automatic](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Adobe Identity Management (OIDC) Tenant URL and Secret Token retrieved earlier from Step 2. Click **Test Connection** to ensure Azure AD can connect to Adobe Identity Management (OIDC). If the connection fails, ensure your Adobe Identity Management (OIDC) account has Admin permissions and try again.

    ![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

    ![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Adobe Identity Management (OIDC)**.

1. Review the user attributes that are synchronized from Azure AD to Adobe Identity Management (OIDC) in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Adobe Identity Management (OIDC) for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Adobe Identity Management (OIDC) API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Adobe Identity Management (OIDC)
   |---|---|---|---|
   |userName|String|&check;|&check;   
   |active|Boolean||
   |emails[type eq "work"].value|String||
   |addresses[type eq "work"].country|String||
   |name.givenName|String||
   |name.familyName|String||
   |urn:ietf:params:scim:schemas:extension:Adobe:2.0:User:emailAliases|String||

1. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Adobe Identity Management (OIDC)**.

1. Review the group attributes that are synchronized from Azure AD to Adobe Identity Management (OIDC) in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Adobe Identity Management (OIDC) for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for filtering|Required by Adobe Identity Management (OIDC)
      |---|---|---|---|
      |displayName|String|&check;|&check;
      |members|Reference||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for Adobe Identity Management (OIDC), change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Adobe Identity Management (OIDC) by choosing the desired values in **Scope** in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
