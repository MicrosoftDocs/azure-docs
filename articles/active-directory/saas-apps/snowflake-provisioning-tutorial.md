---
title: 'Tutorial: Configure Snowflake for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and deprovision user accounts to Snowflake.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Snowflake for automatic user provisioning

This tutorial demonstrates the steps that you perform in Snowflake and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and deprovision users and groups to [Snowflake](https://www.Snowflake.com/pricing/). For important details on what this service does, how it works, and frequently asked questions, see [What is automated SaaS app user provisioning in Microsoft Entra ID?](../app-provisioning/user-provisioning.md). 

## Capabilities supported

> [!div class="checklist"]
>
> * Create users in Snowflake
> * Remove users in Snowflake when they don't require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Snowflake
> * Provision groups and group memberships in Snowflake
> * Allow [single sign-on](./snowflake-tutorial.md) to Snowflake (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (Application Administrator, Cloud Application Administrator, Application Owner, or Global Administrator)
* [A Snowflake tenant](https://www.Snowflake.com/pricing/)
* At least one user in Snowflake with the **ACCOUNTADMIN** role.

## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Snowflake](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-snowflake-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Snowflake to support provisioning with Microsoft Entra ID

Before you configure Snowflake for automatic user provisioning with Microsoft Entra ID, you need to enable System for Cross-domain Identity Management (SCIM) provisioning on Snowflake.

1. Sign in to Snowflake as an administrator and execute the following from either the Snowflake worksheet interface or SnowSQL.

   ```
   use role accountadmin;
   
    create role if not exists aad_provisioner;
    grant create user on account to role aad_provisioner;
    grant create role on account to role aad_provisioner;
   grant role aad_provisioner to role accountadmin;
    create or replace security integration aad_provisioning
        type = scim
        scim_client = 'azure'
        run_as_role = 'AAD_PROVISIONER';
    select system$generate_scim_access_token('AAD_PROVISIONING');
   ```

1. Use the ACCOUNTADMIN role.

    ![Screenshot of a worksheet in the Snowflake UI with the SCIM access token called out.](media/Snowflake-provisioning-tutorial/step-2.png)

1. Create the custom role AAD_PROVISIONER. All users and roles in Snowflake created by Microsoft Entra ID will be owned by the scoped down AAD_PROVISIONER role.

    ![Screenshot showing the custom role.](media/Snowflake-provisioning-tutorial/step-3.png)

1. Let the ACCOUNTADMIN role create the security integration using the AAD_PROVISIONER custom role.

    ![Screenshot showing the security integrations.](media/Snowflake-provisioning-tutorial/step-4.png)

1. Create and copy the authorization token to the clipboard and store securely for later use. Use this token for each SCIM REST API request and place it in the request header. The access token expires after six months and a new access token can be generated with this statement.

    ![Screenshot showing the token generation.](media/Snowflake-provisioning-tutorial/step-5.png)

<a name='step-3-add-snowflake-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Snowflake from the Microsoft Entra application gallery

Add Snowflake from the Microsoft Entra application gallery to start managing provisioning to Snowflake. If you previously set up Snowflake for single sign-on (SSO), you can use the same application. However, we recommend that you create a separate app when you're initially testing the integration. [Learn more about adding an application from the gallery](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application, or based on attributes of the user or group. If you choose to scope who will be provisioned to your app based on assignment, you can use the [steps to assign users and groups to the application](../manage-apps/assign-user-or-group-access-portal.md). If you choose to scope who will be provisioned based solely on attributes of the user or group, you can [use a scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

Keep these tips in mind:

* When you're assigning users and groups to Snowflake, you must select a role other than Default Access. Users with the Default Access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the Default Access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add more roles.

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 5: Configure automatic user provisioning to Snowflake

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and groups in Snowflake. You can base the configuration on user and group assignments in Microsoft Entra ID.

To configure automatic user provisioning for Snowflake in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

    ![Screenshot that shows the Enterprise applications pane.](common/enterprise-applications.png)

1. In the list of applications, select **Snowflake**.

   ![Screenshot that shows a list of applications.](common/all-applications.png)

1. Select the **Provisioning** tab.

   ![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. Set **Provisioning Mode** to **Automatic**.

    ![Screenshot of the Provisioning Mode drop-down list with the Automatic option called out.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, enter the SCIM 2.0 base URL and authentication token that you retrieved earlier in the **Tenant URL** and **Secret Token** boxes, respectively.
    >[!NOTE]
    >The Snowflake SCIM endpoint consists of the Snowflake account URL appended with `/scim/v2/`. For example, if your Snowflake account name is `acme` and your Snowflake account is in the `east-us-2` Azure region, the **Tenant URL** value is `https://acme.east-us-2.azure.snowflakecomputing.com/scim/v2`.

   Select **Test Connection** to ensure that Microsoft Entra ID can connect to Snowflake. If the connection fails, ensure that your Snowflake account has admin permissions and try again.

    ![Screenshot that shows boxes for tenant URL and secret token, along with the Test Connection button.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Then select the **Send an email notification when a failure occurs** check box.

    ![Screenshot that shows boxes for notification email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Snowflake**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Snowflake for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |displayName|String|
   |emails[type eq "work"].value|String|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |externalId|String|

    >[!NOTE]
    >Snowflake supported custom extension user attributes during SCIM provisioning:
    >* DEFAULT_ROLE
    >* DEFAULT_WAREHOUSE
    >* DEFAULT_SECONDARY_ROLES
    >* SNOWFLAKE NAME AND LOGIN_NAME FIELDS TO BE DIFFERENT

    > How to set up Snowflake custom extension attributes in Microsoft Entra SCIM user provisioning is explained [here](https://community.snowflake.com/s/article/HowTo-How-to-Set-up-Snowflake-Custom-Attributes-in-Azure-AD-SCIM-for-Default-Roles-and-Default-Warehouses).

1. In the **Mappings** section, select **Synchronize Microsoft Entra groups to Snowflake**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Snowflake for update operations. Select the **Save** button to commit any changes.

    |Attribute|Type|
    |---|---|
    |displayName|String|
    |members|Reference|

1. To configure scoping filters, see the instructions in the      [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Snowflake, change **Provisioning Status** to **On** in the **Settings** section.

    ![Screenshot that shows Provisioning Status switched on.](common/provisioning-toggle-on.png)

1. Define the users and groups that you want to provision to Snowflake by choosing the desired values in **Scope** in the **Settings** section. 

    If this option is not available, configure the required fields under **Admin Credentials**, select **Save**, and refresh the page. 

    ![Screenshot that shows choices for provisioning scope.](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

    ![Screenshot of the button for saving a provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. Subsequent syncs occur about every 40 minutes, as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment

After you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. [Learn more about quarantine states](../app-provisioning/application-provisioning-quarantine-status.md).  

## Connector limitations

Snowflake-generated SCIM tokens expire in 6 months. Be aware that you need to refresh these tokens before they expire, to allow the provisioning syncs to continue working.

## Troubleshooting tips

The Microsoft Entra provisioning service currently operates under particular [IP ranges](../app-provisioning/use-scim-to-provision-users-and-groups.md#ip-ranges). If necessary, you can restrict other IP ranges and add these particular IP ranges to the allowlist of your application. That technique will allow traffic flow from the Microsoft Entra provisioning service to your application.

## Change log

* 07/21/2020: Enabled soft-delete for all users (via the active attribute).
* 10/12/2022: Updated Snowflake SCIM Configuration.

## Additional resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What are application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
