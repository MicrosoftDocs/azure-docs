---
title: Configure cross-tenant synchronization
description: Learn how to configure cross-tenant synchronization in Microsoft Entra ID using the Microsoft Entra admin center.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 07/21/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure cross-tenant synchronization

This article describes the steps to configure cross-tenant synchronization using the Microsoft Entra admin center. When configured, Microsoft Entra ID automatically provisions and de-provisions B2B users in your target tenant. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

:::image type="content" source="./media/common/configure-diagram.png" alt-text="Diagram that shows cross-tenant synchronization between source tenant and target tenant." lightbox="./media/common/configure-diagram.png":::

## Learning objectives

By the end of this article, you'll be able to:

- Create B2B users in your target tenant
- Remove B2B users in your target tenant
- Keep user attributes synchronized between your source and target tenants

## Prerequisites

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

- Microsoft Entra ID P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.
- [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) role to configure cross-tenant synchronization.
- [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) or [Application Administrator](../roles/permissions-reference.md#application-administrator) role to assign users to a configuration and to delete a configuration.

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

- Microsoft Entra ID P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.

## Step 1: Plan your provisioning deployment

1. Define how you would like to [structure the tenants in your organization](cross-tenant-synchronization-topology.md).

1. Learn about [how the provisioning service works](../app-provisioning/how-provisioning-works.md).

1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization).

1. Determine what data to [map between tenants](../app-provisioning/customize-application-attributes.md).

## Step 2: Enable user synchronization in the target tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) of the target tenant.
 
1. Browse to **Identity** > **External Identities** > **Cross-tenant access settings**.

1. On the **Organization settings** tab, select **Add organization**.

1. Add the source tenant by typing the tenant ID or domain name and selecting **Add**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/access-settings-organization-add.png" alt-text="Screenshot that shows the Add organization pane to add the source tenant." lightbox="./media/cross-tenant-synchronization-configure/access-settings-organization-add.png":::

1. Under **Inbound access** of the added organization, select **Inherited from default**.

1. Select  the **Cross-tenant sync** tab.

1. Check the **Allow users sync into this tenant** check box.

    :::image type="content" source="../media/external-identities/access-settings-users-sync.png" alt-text="Screenshot that shows the  Cross-tenant sync tab with the Allow users sync into this tenant check box." lightbox="../media/external-identities/access-settings-users-sync.png":::

1. Select **Save**. 

## Step 3: Automatically redeem invitations in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

In this step, you automatically redeem invitations so users from the source tenant don't have to accept the consent prompt. This setting must be checked in both the source tenant (outbound) and target tenant (inbound). For more information, see [Automatic redemption setting](cross-tenant-synchronization-overview.md#automatic-redemption-setting).

1. In the target tenant, on the same **Inbound access settings** page, select the **Trust settings** tab.

1. Check the **Automatically redeem invitations with the tenant** &lt;tenant&gt; check box.

    :::image type="content" source="../media/external-identities/inbound-consent-prompt-setting.png" alt-text="Screenshot that shows the inbound Automatic redemption check box." lightbox="../media/external-identities/inbound-consent-prompt-setting.png":::

1. Select **Save**. 

## Step 4: Automatically redeem invitations in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

In this step, you automatically redeem invitations in the source tenant.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) of the source tenant.

1. Browse to **Identity** > **External Identities** > **Cross-tenant access settings**.

1. On the **Organization settings** tab, select **Add organization**.

1. Add the target tenant by typing the tenant ID or domain name and selecting **Add**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/access-settings-organization-add.png" alt-text="Screenshot that shows the Add organization pane to add the source tenant." lightbox="./media/cross-tenant-synchronization-configure/access-settings-organization-add.png":::

1. Under **Outbound access** for the target organization, select **Inherited from default**.

1. Select  the **Trust settings** tab.

1. Check the **Automatically redeem invitations with the tenant** &lt;tenant&gt; check box.

    :::image type="content" source="../media/external-identities/outbound-consent-prompt-setting.png" alt-text="Screenshot that shows the outbound Automatic redemption check box." lightbox="../media/external-identities/outbound-consent-prompt-setting.png":::

1. Select **Save**. 

## Step 5: Create a configuration in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, browse to **Identity** > **External Identities** > **Cross-tenant synchronization**.

1. Select **Configurations**.

1. At the top of the page, select **New configuration**.

1. Provide a name for the configuration and select **Create**.

    It can take up to 15 seconds for the configuration that you just created to appear in the list.

1. Select **Refresh** to retrieve the latest list of configurations. 

## Step 6: Test the connection to the target tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, in the configuration list, select your configuration. 

    :::image type="content" source="./media/cross-tenant-synchronization-configure/configuration-select.png" alt-text="Screenshot that shows the Cross-tenant synchronization Configurations page and a new configuration." lightbox="./media/cross-tenant-synchronization-configure/configuration-select.png":::

1. Select **Get started**.

1. Set the **Provisioning Mode** to **Automatic**.

1. Under the **Admin Credentials** section, change the **Authentication Method** to **Cross Tenant Synchronization Policy**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-policy.png" alt-text="Screenshot that shows the Provisioning page with the Cross Tenant Synchronization Policy selected." lightbox="./media/cross-tenant-synchronization-configure/provisioning-policy.png":::

1. In the **Tenant Id** box, enter the tenant ID of the target tenant.

1. Select **Test Connection** to test the connection.

    You should see a message that the supplied credentials are authorized to enable provisioning. If the test connection fails, see [Troubleshooting tips](#troubleshooting-tips) later in this article.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-test-connection-success.png" alt-text="Screenshot that shows a testing connection notification." lightbox="./media/cross-tenant-synchronization-configure/provisioning-test-connection-success.png":::

1. Select **Save**.

    Mappings and Settings sections appear.

1. Close the **Provisioning** page.

## Step 7: Define who is in scope for provisioning

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

The Microsoft Entra provisioning service allows you to define who will be provisioned in one or both of the following ways:

- Based on assignment to the configuration
- Based on attributes of the user

Start small. Test with a small set of users before rolling out to everyone. When the scope for provisioning is set to assigned users and groups, you can control it by assigning one or two users to the configuration. You can further refine who is in scope for provisioning by creating attribute-based scoping filters, described in the [next step](#step-8-optional-define-who-is-in-scope-for-provisioning-with-scoping-filters).

1. In the source tenant, select **Provisioning** and expand the **Settings** section.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-settings-edit.png" alt-text="Screenshot of the Provisioning page that shows the Settings section with the Scope and Provisioning Status options." lightbox="./media/cross-tenant-synchronization-configure/provisioning-settings-edit.png":::

1. In the **Scope** list, select whether to synchronize all users in the source tenant or only users assigned to the configuration.

    It's recommended that you select **Sync only assigned users and groups** instead of **Sync all users and groups**. Reducing the number of users in scope improves performance.

1. Select **Save**.


1. On the configuration page, select **Users and groups**.

    For cross-tenant synchronization to work, at least one internal user must be assigned to the configuration.

1. Select **Add user/group**.

1. On the **Add Assignment** page, under **Users and groups**, select **None Selected**.

1. On the **Users and groups** pane, search for and select one or more internal users or groups you want to assign to the configuration.

    If you select a group to assign to the configuration, only users that are direct members in the group will be in scope for provisioning. You can select a static group or a dynamic group. The assignment doesn't cascade to nested groups.

1. Select **Select**.

1. Select **Assign**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/users-and-groups.png" alt-text="Screenshot that shows the Users and groups page with a user assigned to the configuration." lightbox="./media/cross-tenant-synchronization-configure/users-and-groups.png":::

    For more information, see [Assign users and groups to an application](../manage-apps/assign-user-or-group-access-portal.md).

## Step 8: (Optional) Define who is in scope for provisioning with scoping filters

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Regardless of the value you selected for **Scope** in the previous step, you can further limit which users are synchronized by creating attribute-based scoping filters.

1. In the source tenant, select **Provisioning** and expand the **Mappings** section.

1. Select **Provision Microsoft Entra users**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-mappings.png" alt-text="Screenshot that shows the Provisioning page with the Mappings section expanded." lightbox="./media/cross-tenant-synchronization-configure/provisioning-mappings.png":::

1. Under **Source Object Scope**, select **All records**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-scope.png" alt-text="Screenshot that shows the Attribute Mapping page with the Source Object Scope." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-scope.png":::

1. On the **Source Object Scope** page, select **Add scoping filter**.

1. Add any scoping filters to define which users are in scope for provisioning. 

    To configure scoping filters, refer to the instructions provided in [Scoping users or groups to be provisioned with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization).

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-scoping-filter.png" alt-text="Screenshot that shows the Add Scoping Filter page with sample filter." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-scoping-filter.png":::

1. Select **Ok** and **Save** to save any changes.

    If you added a filter, you'll see a message that saving your changes will result in all assigned users and groups being resynchronized. This may take a long time depending on the size of your directory.

1. Select **Yes** and close the **Attribute Mapping** page.

## Step 9: Review attribute mappings

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Attribute mappings allow you to define how data should flow between the source tenant and target tenant. For information on how to customize the default attribute mappings, see [Tutorial - Customize user provisioning attribute-mappings for SaaS applications in Microsoft Entra ID](../app-provisioning/customize-application-attributes.md).

1. In the source tenant, select **Provisioning** and expand the **Mappings** section.

1. Select **Provision Microsoft Entra users**.

1. On the **Attribute Mapping** page, scroll down to review the user attributes that are synchronized between tenants in the **Attribute Mappings** section.

    The first attribute, alternativeSecurityIdentifier, is an internal attribute used to uniquely identify the user across tenants, match users in the source tenant with existing users in the target tenant, and ensure that each user only has one account. The matching attribute cannot be changed. Attempting to change the matching attribute or adding additional matching attributes will result in a `schemaInvalid` error. 

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping.png" alt-text="Screenshot of the Attribute Mapping page that shows the list of Microsoft Entra attributes." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping.png":::

1. Select the **Member (userType)** attribute.

1. Review the **Constant Value** setting for the **userType** attribute.

    This setting defines the type of user that will be created in the target tenant and can be one of the values in the following table. By default, users will be created as external member (B2B collaboration users). For more information, see [Properties of a Microsoft Entra B2B collaboration user](../external-identities/user-properties.md).

    | Constant Value | Description |
    | --- | --- |
    | **Member** | Default. Users will be created as external member (B2B collaboration users) in the target tenant. Users will be able to function as any internal member of the target tenant. |
    | **Guest** | Users will be created as external guests (B2B collaboration users) in the target tenant. |

    > [!NOTE]
    > If the the B2B user already exists in the target tenant then **Member (userType)** will not changed to **Member**, unless the **Apply this mapping** setting is set to **Always**.
    
    The user type you choose has the following limitations for apps or services (but aren't limited to):
    
    [!INCLUDE [user-type-workload-limitations-include](../includes/user-type-workload-limitations-include.md)]

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-member.png" alt-text="Screenshot of the Edit Attribute page that shows the Member attribute." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-member.png":::

1. On the **Attribute Mapping** page, select the **showInAddressList** attribute.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-showinaddresslist.png" alt-text="Screenshot of the Edit Attribute page that shows the showInAddressList attribute." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-showinaddresslist.png":::

    If you want the synchronized users to appear in the global address list of the target tenant for people search scenarios, you must set **Mapping type** to **Constant** and **Constant Value** to **True**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-showinaddresslist-peoplesearch.png" alt-text="Screenshot of the Edit Attribute page that shows the showInAddressList attribute with setting for people search." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-showinaddresslist-peoplesearch.png":::

1. If you want to define any transformations, on the **Attribute Mapping** page, select the attribute you want to transform, such as **displayName**.

1. Set the **Mapping type** to **Expression**.

1. In the **Expression** box, enter the transformation expression. For example with the display name, you can do the following:

    - Flip the first name and last name and add a comma in between.
    - Add the domain name in parentheses at the end of the display name.

    For examples, see [Reference for writing expressions for attribute mappings in Microsoft Entra ID](../app-provisioning/functions-for-customizing-application-data.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json#examples).

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-displayname-expression.png" alt-text="Screenshot of the Edit Attribute page that shows the displayName attribute with the Expression box." lightbox="./media/cross-tenant-synchronization-configure/provisioning-attribute-mapping-displayname-expression.png":::

## Step 10: Specify additional provisioning settings

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, select **Provisioning** and expand the **Settings** section.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-settings-edit.png" alt-text="Screenshot of the Provisioning page that shows the Settings section with the Scope and Provisioning Status options." lightbox="./media/cross-tenant-synchronization-configure/provisioning-settings-edit.png":::

1. Check the **Send an email notification when a failure occurs** check box.

1. In the **Notification Email** box, enter the email address of a person or group who should receive provisioning error notifications.

    Email notifications are sent within 24 hours of the job entering quarantine state. For custom alerts, see [Understand how provisioning integrates with Azure Monitor logs](../app-provisioning/application-provisioning-log-analytics.md).

1. To prevent accidental deletion, select **Prevent accidental deletion** and specify a threshold value.

    For more information, see [Enable accidental deletions prevention in the Microsoft Entra provisioning service](../app-provisioning/accidental-deletions.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization).

1. Select **Save** to save any changes.

## Step 11: Test provision on demand

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Now that you have a configuration, you can test on-demand provisioning with one of your users.

1. In the source tenant, browse to **Identity** > **External Identities** > **Cross-tenant synchronization**.

1. Select **Configurations** and then select your configuration.

1. Select **Provision on demand**.

1. In the **Select a user or group** box, search for and select one of your test users.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provision-on-demand.png" alt-text="Screenshot of the Provision on demand page that shows a test user selected." lightbox="./media/cross-tenant-synchronization-configure/provision-on-demand.png":::

1. Select **Provision**.

    After a few moments, the **Perform action** page appears with information about the provisioning of the test user in the target tenant.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provision-on-demand-provision.png" alt-text="Screenshot of the Perform action page that shows the test user and list of modified attributes." lightbox="./media/cross-tenant-synchronization-configure/provision-on-demand-provision.png":::

    If the user isn't in scope, you'll see a page with information about why test user was skipped.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provision-on-demand-provision-skipped.png" alt-text="Screenshot of the Determine if user is in scope page that shows information about why test user was skipped." lightbox="./media/cross-tenant-synchronization-configure/provision-on-demand-provision-skipped.png":::

    On the **Provision on demand** page, you can view details about the provision and have the option to retry.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provision-on-demand-provision-details.png" alt-text="Screenshot of the Provision on demand page that shows details about the provision." lightbox="./media/cross-tenant-synchronization-configure/provision-on-demand-provision-details.png":::

1. In the target tenant, verify that the test user was provisioned.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provision-on-demand-users-target.png" alt-text="Screenshot of the Users page of the target tenant that shows the test user provisioned." lightbox="./media/cross-tenant-synchronization-configure/provision-on-demand-users-target.png":::

1. If all is working as expected, assign additional users to the configuration.

    For more information, see [On-demand provisioning in Microsoft Entra ID](../app-provisioning/provision-on-demand.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization).

## Step 12: Start the provisioning job

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

The provisioning job starts the initial synchronization cycle of all users defined in **Scope** of the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

1. In the source tenant, browse to **Identity** > **External Identities** > **Cross-tenant synchronization**.

1. Select **Configurations** and then select your configuration.

1. On the **Overview** page, review the provisioning details.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/configuration-overview-provisioning.png" alt-text="Screenshot of the Configurations Overview page that lists provisioning details." lightbox="./media/cross-tenant-synchronization-configure/configuration-overview-provisioning.png":::

1. Select **Start provisioning** to start the provisioning job.

## Step 13: Monitor provisioning

![Icon for the source tenant.](./media/common/icon-tenant-source.png) ![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Source and target tenants**

Once you've started a provisioning job, you can monitor the status.

1. In the source tenant, on the **Overview** page, check the progress bar to see the status of the provisioning cycle and how close it's to completion. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md).

    If provisioning seems to be in an unhealthy state, the configuration will go into quarantine. For more information, see [Application provisioning in quarantine status](../app-provisioning/application-provisioning-quarantine-status.md).

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-job-start.png" alt-text="Screenshot of the Configurations Overview page that shows the status of the provisioning cycle." lightbox="./media/cross-tenant-synchronization-configure/provisioning-job-start.png":::

1. Select **Provisioning logs** to determine which users have been provisioned successfully or unsuccessfully. By default, the logs are filtered by the service principal ID of the configuration. For more information, see [Provisioning logs in Microsoft Entra ID](../reports-monitoring/concept-provisioning-logs.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json).

    :::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-logs.png" alt-text="Screenshot of the Provisioning logs page that lists the log entries and their status." lightbox="./media/cross-tenant-synchronization-configure/provisioning-logs.png":::

1. Select **Audit logs** to view all logged events in Microsoft Entra ID. For more information, see [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md).

    :::image type="content" source="./media/cross-tenant-synchronization-configure/audit-logs-source.png" alt-text="Screenshot of the Audit logs page that lists the log entries and their status." lightbox="./media/cross-tenant-synchronization-configure/audit-logs-source.png":::

    You can also view audit logs in the target tenant.

1. In the target tenant, select **Users** > **Audit logs** to view logged events for user management.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/audit-logs-users-target.png" alt-text="Screenshot of the Audit logs page in the target tenant that lists the log entries for user management." lightbox="./media/cross-tenant-synchronization-configure/audit-logs-users-target.png":::

## Step 14: Configure leave settings

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

Even though users are being provisioned in the target tenant, they still might be able to remove themselves. If users remove themselves and they are in scope, they'll be provisioned again during the next provisioning cycle. If you want to disallow the ability for users to remove themselves from your organization, you must configure the **External user leave settings**.

1. In the target tenant, browse to **Identity** > **External Identities** > **External collaboration settings**.

1. Under **External user leave settings**, choose whether to allow external users to leave your organization themselves.

This setting also applies to B2B collaboration and B2B direct connect, so if you set **External user leave settings** to **No**, B2B collaboration users and B2B direct connect users can't leave your organization themselves. For more information, see [Leave an organization as an external user](../external-identities/leave-the-organization.md#more-information-for-administrators).

## Troubleshooting tips

#### Delete a configuration

Follows these steps to delete a configuration on the **Configurations** page.

1. In the source tenant, browse to **Identity** > **External Identities** > **Cross-tenant synchronization**.

1. On the **Configurations** page, add a check mark next to the configuration you want to delete.

1. Select **Delete** and then **OK** to delete the configuration.

    :::image type="content" source="./media/cross-tenant-synchronization-configure/configurations-delete.png" alt-text="Screenshot of the Configurations page showing how to delete a configuration." lightbox="./media/cross-tenant-synchronization-configure/configurations-delete.png":::

#### Symptom - Test connection fails with AzureDirectoryB2BManagementPolicyCheckFailure

When configuring cross-tenant synchronization in the source tenant and you test the connection, it fails with the following error message:

```
You appear to have entered invalid credentials. Please confirm you are using the correct information for an administrative account.
Error code: AzureDirectoryB2BManagementPolicyCheckFailure
Details: Policy permitting auto-redemption of invitations not configured.
```

:::image type="content" source="./media/cross-tenant-synchronization-configure/provisioning-test-connection-error.png" alt-text="Screenshot that shows the error when test connection fails with AzureDirectoryB2BManagementPolicyCheckFailure." lightbox="./media/cross-tenant-synchronization-configure/provisioning-test-connection-error.png":::

**Cause**

This error indicates the policy to automatically redeem invitations in both the source and target tenants wasn't set up.

**Solution**

Follow the steps in [Step 3: Automatically redeem invitations in the target tenant](#step-3-automatically-redeem-invitations-in-the-target-tenant) and [Step 4: Automatically redeem invitations in the source tenant](#step-4-automatically-redeem-invitations-in-the-source-tenant). 

#### Symptom - Automatic redemption check box is disabled

When configuring cross-tenant synchronization, the **Automatic redemption** check box is disabled.

:::image type="content" source="./media/cross-tenant-synchronization-configure/consent-prompt-setting-disabled.png" alt-text="Screenshot that shows the Automatic redemption check box as disabled." lightbox="./media/cross-tenant-synchronization-configure/consent-prompt-setting-disabled.png":::

**Cause**

Your tenant doesn't have a Microsoft Entra ID P1 or P2 license.

**Solution**

You must have Microsoft Entra ID P1 or P2 to configure trust settings.

#### Symptom - Recently deleted user in the target tenant is not restored

After soft deleting a synchronized user in the target tenant, the user isn't restored during the next synchronization cycle. If you try to soft delete a user with on-demand provisioning and then restore the user, it can result in duplicate users.

**Cause**

Restoring a previously soft-deleted user in the target tenant isn't supported.

**Solution**

Manually restore the soft-deleted user in the target tenant. For more information, see [Restore or remove a recently deleted user using Microsoft Entra ID](../fundamentals/users-restore.md).

#### Symptom - Users are skipped because SMS sign-in is enabled on the user
Users are skipped from synchronization. The scoping step includes the following filter with status false: "Filter external users.alternativeSecurityIds EQUALS 'None'"

**Cause**

If SMS sign-in is enabled for a user, they will be skipped by the provisioning service.

**Solution**

Disable SMS Sign-in for the users. The script below shows how you can disable SMS Sign-in using PowerShell. 

```powershell
##### Disable SMS Sign-in options for the users

#### Import module
Install-Module Microsoft.Graph.Users.Actions
Install-Module Microsoft.Graph.Identity.SignIns
Import-Module Microsoft.Graph.Users.Actions

Connect-MgGraph -Scopes "User.Read.All", "Group.ReadWrite.All", "UserAuthenticationMethod.Read.All","UserAuthenticationMethod.ReadWrite","UserAuthenticationMethod.ReadWrite.All"

##### The value for phoneAuthenticationMethodId is 3179e48a-750b-4051-897c-87b9720928f7

$phoneAuthenticationMethodId = "3179e48a-750b-4051-897c-87b9720928f7"

#### Get the User Details

$userId = "objectid_of_the_user_in_Azure_AD"

#### validate the value for SmsSignInState

$smssignin = Get-MgUserAuthenticationPhoneMethod -UserId $userId

{
    if($smssignin.SmsSignInState -eq "ready"){   
      #### Disable Sms Sign-In for the user is set to ready
       
      Disable-MgUserAuthenticationPhoneMethodSmsSignIn -UserId $userId -PhoneAuthenticationMethodId $phoneAuthenticationMethodId
      Write-Host "SMS sign-in disabled for the user" -ForegroundColor Green
    }
    else{
    Write-Host "SMS sign-in status not set or found for the user " -ForegroundColor Yellow
    }

}

##### End the script
```

#### Symptom - Users fail to provision with error "AzureActiveDirectoryForbidden"

Users in scope fail to provision. The provisioning logs details include the following error message:

```
Guest invitations not allowed for your company. Contact your company administrator for more details.
```

**Cause**

This error indicates the Guest invite settings in the target tenant are configured with the most restrictive setting: "No one in the organization can invite guest users including admins (most restrictive)".

**Solution**

Change the Guest invite settings in the target tenant to a less restrictive setting. For more information, see [Configure external collaboration settings](../external-identities/external-collaboration-settings-configure.md).

## Next steps

- [Tutorial: Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)
- [Managing user account provisioning for enterprise apps in the Azure portal](../app-provisioning/configure-automatic-user-provisioning-portal.md)
- [What is single sign-on in Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
