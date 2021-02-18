---
title: 'Tutorial: Configure Snowflake for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Snowflake.
services: active-directory
author: zchia
writer: zchia
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/26/2019
ms.author: zhchia
---

# Tutorial: Configure Snowflake for automatic user provisioning

This tutorial demonstrates the steps that you perform in Snowflake and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users and groups to [Snowflake](https://www.Snowflake.com/pricing/). For important details on what this service does, how it works, and frequently asked questions, see [What is automated SaaS app user provisioning in Azure AD?](../app-provisioning/user-provisioning.md). 

> [!NOTE]
> This connector is currently in public preview. For information about terms of use, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Capabilities supported
> [!div class="checklist"]
> * Create users in Snowflake
> * Remove users in Snowflake when they don't require access anymore
> * Keep user attributes synchronized between Azure AD and Snowflake
> * Provision groups and group memberships in Snowflake
> * Allow [single sign-on](./snowflake-tutorial.md) to Snowflake (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (Application Administrator, Cloud Application Administrator, Application Owner, or Global Administrator)
* [A Snowflake tenant](https://www.Snowflake.com/pricing/)
* A user account in Snowflake with admin permissions

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Azure AD and Snowflake](../app-provisioning/customize-application-attributes.md). 

## Step 2: Configure Snowflake to support provisioning with Azure AD

Before you configure Snowflake for automatic user provisioning with Azure AD, you need to enable System for Cross-domain Identity Management (SCIM) provisioning on Snowflake.

1. Sign in to your Snowflake admin console. Enter the following query in the highlighted worksheet, and then select **Run**.

	![Screenshot of the Snowflake admin console with query and Run button.](media/Snowflake-provisioning-tutorial/image00.png)

2.  A SCIM access token is generated for your Snowflake tenant. To retrieve it, select the link highlighted in the following screenshot.

	![Screenshot of a worksheet in the Snowflake U I with the S C I M access token called out.](media/Snowflake-provisioning-tutorial/image01.png)

3. Copy the generated token value and select **Done**. This value is entered in the **Secret Token** box on the **Provisioning** tab of your Snowflake application in the Azure portal.

	![Screenshot of the Details section, showing the token copied into the text field and the Done option called out.](media/Snowflake-provisioning-tutorial/image02.png)

## Step 3: Add Snowflake from the Azure AD application gallery

Add Snowflake from the Azure AD application gallery to start managing provisioning to Snowflake. If you previously set up Snowflake for single sign-on (SSO), you can use the same application. However, we recommend that you create a separate app when you're initially testing the integration. [Learn more about adding an application from the gallery](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application, or based on attributes of the user or group. If you choose to scope who will be provisioned to your app based on assignment, you can use the [steps to assign users and groups to the application](../manage-apps/assign-user-or-group-access-portal.md). If you choose to scope who will be provisioned based solely on attributes of the user or group, you can [use a scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

Keep these tips in mind:

* When you're assigning users and groups to Snowflake, you must select a role other than Default Access. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the Default Access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add more roles. 

* Start small. Test with a small set of users and groups before rolling out to everyone. When the scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When the scope is set to all users and groups, you can specify an [attribute-based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 


## Step 5: Configure automatic user provisioning to Snowflake 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and groups in Snowflake. You can base the configuration on user and group assignments in Azure AD.

To configure automatic user provisioning for Snowflake in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise applications** > **All applications**.

	![Screenshot that shows the Enterprise applications pane.](common/enterprise-applications.png)

2. In the list of applications, select **Snowflake**.

	![Screenshot that shows a list of applications.](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode drop-down list with the Automatic option called out.](common/provisioning-automatic.png)

5. In the **Admin Credentials** section, enter the SCIM 2.0 base URL and authentication token that you retrieved earlier in the **Tenant URL** and **Secret Token** boxes, respectively. 

   Select **Test Connection** to ensure that Azure AD can connect to Snowflake. If the connection fails, ensure that your Snowflake account has admin permissions and try again.

	![Screenshot that shows boxes for tenant U R L and secret token, along with the Test Connection button.](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Then select the **Send an email notification when a failure occurs** check box.

	![Screenshot that shows boxes for notification email.](common/provisioning-notification-email.png)

7. Select **Save**.

8. In the **Mappings** section, select **Synchronize Azure Active Directory Users to Snowflake**.

9. Review the user attributes that are synchronized from Azure AD to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Snowflake for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |displayName|String|
   |emails[type eq "work"].value|String|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:defaultRole|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:defaultWarehouse|String|

10. In the **Mappings** section, select **Synchronize Azure Active Directory Groups to Snowflake**.

11. Review the group attributes that are synchronized from Azure AD to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Snowflake for update operations. Select the **Save** button to commit any changes.

    |Attribute|Type|
    |---|---|
    |displayName|String|
    |members|Reference|

12. To configure scoping filters, see the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Snowflake, change **Provisioning Status** to **On** in the **Settings** section.

	 ![Screenshot that shows Provisioning Status switched on.](common/provisioning-toggle-on.png)

14. Define the users and groups that you want to provision to Snowflake by choosing the desired values in **Scope** in the **Settings** section. 

    If this option is not available, configure the required fields under **Admin Credentials**, select **Save**, and refresh the page. 

	 ![Screenshot that shows choices for provisioning scope.](common/provisioning-scope.png)

15. When you're ready to provision, select **Save**.

	 ![Screenshot of the button for saving a provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. Subsequent syncs occur about every 40 minutes, as long as the Azure AD provisioning service is running.

## Step 6: Monitor your deployment
After you've configured provisioning, use the following resources to monitor your deployment:

- Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
- Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
- If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. [Learn more about quarantine states](../app-provisioning/application-provisioning-quarantine-status.md).  

## Connector limitations

Snowflake-generated SCIM tokens expire in 6 months. Be aware that you need to refresh these tokens before they expire, to allow the provisioning syncs to continue working. 

## Troubleshooting tips

The Azure AD provisioning service currently operates under particular [IP ranges](../app-provisioning/use-scim-to-provision-users-and-groups.md#ip-ranges). If necessary, you can restrict other IP ranges and add these particular IP ranges to the allow list of your application. That technique will allow traffic flow from the Azure AD provisioning service to your application.

## Change log

* 07/21/2020: Enabled soft-delete for all users (via the active attribute).

## Additional resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What are application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps
* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
