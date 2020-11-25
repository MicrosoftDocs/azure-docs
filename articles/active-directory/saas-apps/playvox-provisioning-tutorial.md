---
title: 'Tutorial: Configure Playvox for automatic user provisioning by using Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Playvox.
services: active-directory
documentationcenter: ''
author: Zhchia
writer: Zhchia
manager: beatrizd

ms.assetid: c31c20ab-f6cd-40e1-90ad-fa253ecbc0f8
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/18/2020
ms.author: Zhchia
---

# Tutorial: Configure Playvox for automatic user provisioning

This tutorial describes the steps to follow in both Playvox and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users or groups to [Playvox](https://www.playvox.com) by using the Azure AD Provisioning service. For important details on what this service does and how it works, and for frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Capabilities supported
> [!div class="checklist"]
> * Create users in Playvox.
> * Remove users in Playvox when they don't need access anymore.
> * Keep user attributes synchronized between Azure AD and Playvox.

## Prerequisites

The scenario in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).
* A user account in Azure AD with [permission](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A user account in [Playvox](https://www.playvox.com) with Super Admin permissions.

## Step 1: Plan your provisioning deployment

1. Learn [how the provisioning service works](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).

2. Determine who will be [in scope for provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).

3. Determine what data to [map between Azure AD and Playvox](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes).

## Step 2: Configure Playvox to support provisioning by using Azure AD

1. Log in to the Playvox admin console and go to **Settings > API Keys**.

2. Select **Create API Key**.

    ![Partial screenshot showing the location of the Create API Key button in the Playvox user interface.](media/playvox-provisioning-tutorial/create.png)

3. Enter a meaningful name for the API key, and then select **Save**. After the API key is generated, select **Close**.

4. On the API key that you created, select the **Details** icon.

    ![[Partial screenshot showing the location of the Details icon, which is a magnifying glass, in the Playvox user interface.](media/playvox-provisioning-tutorial/api.png)

5. Copy and save the **BASE64 KEY** value. You'll enter this value in the **Secret Token** field in the **Provisioning** tab of your Playvox application in the Azure portal.

    ![Screenshot of the Details API Key message box, with the BASE64 KEY value highlighted.](media/playvox-provisioning-tutorial/token.png)

## Step 3: Add Playvox from the Azure AD application gallery

To start to manage provisioning to Playvox, add Playvox to your Azure AD tenant from the application gallery. So learn more, see [Quickstart: Add an application to your Azure Active Directory (Azure AD) tenant](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app).

If you've previously set up Playvox for single sign-on (SSO), you can use the same application. However, we recommend that you create a separate app when testing the integration initially.  

## Step 4: Define who will be in scope for provisioning

You use the Azure AD provisioning service to scope who will be provisioned based on assignment to the application or based on attributes of the user or group. To scope who will be provisioned to your app based on assignment, see [Manage user assignment for an app in Azure Active Directory](../manage-apps/assign-user-or-group-access-portal.md) to learn how to assign users or groups to the application. To scope who will be provisioned based solely on attributes of the user or group, use a scoping filter as described in [Attribute-based application provisioning with scoping filters](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts).

Remember these points:

* When assigning users to Playvox, you must select a role other than **Default Access**. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If Default Access is the only role available on the application, you can [update the application manifest](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add other roles.

* Start small. Test with a small set of users or groups before rolling out to everyone. When provisioning scope is based on assigned users or groups, you can control the size of the set by assigning only one or two users or groups to the app. When provisioning scope includes all users and groups, you can specify an [attribute-based scoping filter](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts) to limit the size of your test set.

## Step 5: Configure automatic user provisioning to Playvox

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users or groups, based on user or group assignments in Azure AD.

To configure automatic user provisioning for Playvox in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, and then select **All applications**.

    ![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Playvox**.

    ![The Playvox link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

    ![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

    ![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the Admin Credentials section, enter your Playvox **Tenant URL** as

    * `https://{tenant}.playvox.com/scim/v1`

    Enter the **Secret Token** as retrieved earlier in Step 2. Select **Test Connection** to ensure that Azure AD can connect to Playvox. If the connection fails, make sure your Playvox account has Admin permissions and try again.

    ![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

    ![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Playvox**.

9. Review the user attributes that are synchronized from Azure AD to Playvox in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Playvox for update operations. If you choose to change the [matching target attribute](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes), you will need to ensure that the Playvox API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for Filtering|
   |---|---|---|
   |userName|String|&check;|
   |active|Boolean|
   |displayName|String|
   |emails[type eq "work"].value|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |externalId|String|

10. To configure scoping filters, refer to the instructions in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Playvox, change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users or groups that you'd like to provision to Playvox by choosing the values you want in **Scope**, in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

13. When you're ready to provision, select **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running.

## Step 6: Monitor your deployment

After you've configured provisioning, use the following methods to monitor your deployment:

* Use the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion.
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
