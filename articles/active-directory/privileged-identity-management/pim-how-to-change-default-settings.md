---
title: Configure Azure AD role settings in PIM - Azure AD | Microsoft Docs
description: Learn how to configure Azure AD role settings in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 11/12/2021
ms.author: amsliu
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Configure Azure AD role settings in Privileged Identity Management

A privileged role administrator can customize Privileged Identity Management (PIM) in their Azure Active Directory (Azure AD) organization, including changing the experience for a user who is activating an eligible role assignment. For information on the PIM events that trigger notifications and which administrators receive them, see [Email notifications in Privileged Identity Management](pim-email-notifications.md#notifications-for-azure-ad-roles)

## Open role settings

Follow these steps to open the settings for an Azure AD role.

1. Sign in to [Azure portal](https://portal.azure.com/) with a user in the [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) role.

1. Open **Azure AD Privileged Identity Management** &gt; **Azure AD roles** &gt; **Role settings**.

    ![Role settings page listing Azure AD roles](./media/pim-how-to-change-default-settings/role-settings.png)

1. Select the role whose settings you want to configure.

    ![Role setting details page listing several assignment and activation settings](./media/pim-how-to-change-default-settings/role-settings-page.png)

1. Select **Edit** to open the Role settings page.

    ![Edit role settings page with options to update assignment and activation settings](./media/pim-how-to-change-default-settings/role-settings-edit.png)

    On the Role setting pane for each role, there are several settings you can configure.

## Assignment duration

You can choose from two assignment duration options for each assignment type (eligible and active) when you configure settings for a role. These options become the default maximum duration when a user is assigned to the role in Privileged Identity Management.

You can choose one of these **eligible** assignment duration options:

| Setting | Description |
| --- | --- |
| Allow permanent eligible assignment | Global admins and Privileged role admins can assign permanent eligible assignment. |
| Expire eligible assignment after | Global admins and Privileged role admins can require that all eligible assignments have a specified start and end date. |

And, you can choose one of these **active** assignment duration options:

| Setting | Description |
| --- | --- |
| Allow permanent active assignment | Global admins and Privileged role admins can assign permanent active assignment. |
| Expire active assignment after | Global admins and Privileged role admins can require that all active assignments have a specified start and end date. |

> [!NOTE]
> All assignments that have a specified end date can be renewed by Global admins and Privileged role admins. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

## Require multifactor authentication

Privileged Identity Management provides enforcement of Azure AD Multi-Factor Authentication on activation and on active assignment.

### On activation

You can require users who are eligible for a role to prove who they are using Azure AD Multi-Factor Authentication before they can activate. Multifactor authentication ensures that the user is who they say they are with reasonable certainty. Enforcing this option protects critical resources in situations when the user account might have been compromised.

To require multifactor authentication to activate the role assignment, select the **On activation, require Azure MFA** option in the Activation tab of **Edit role setting**.

### On active assignment

This option requires admins must complete a multifactor authentication before creating an active (as opposed to eligible) role assignment. Privileged Identity Management can't enforce multifactor authentication when the user uses their role assignment because they are already active in the role from the time that it is assigned.

To require multifactor authentication when creating an active role assignment, select the **Require Azure Multi-Factor Authentication on active assignment** option in the Assignment tab of **Edit role setting**.

For more information, see [Multifactor authentication and Privileged Identity Management](pim-how-to-require-mfa.md).

## Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that an activation request for a role assignment remains active before it expires. This value can be from one to 24 hours.

## Require justification

You can require that users enter a business justification when they activate. To require justification, check the **Require justification on active assignment** box or the **Require justification on activation** box.

## Require ticket information on activation

If your organization uses a ticketing system to track help desk items or change requests for your environment, you can select the **Require ticket information on activation** box to require the elevation request to contain the name of the ticketing system (optional, if your organization uses multiple systems) and the ticket number that prompted the need for role activation.

## Require approval to activate

If setting multiple approvers, approval completes as soon as one of them approves or denies. You can't force approval from a second or subsequent approver. To require approval to activate a role, follow these steps.

1. Check the **Require approval to activate** check box.

1. Select **Select approvers**.

    ![Select a user or group pane to select approvers](./media/pim-resource-roles-configure-role-settings/resources-role-settings-select-approvers.png)

1. Select at least one user and then click **Select**. Select at least one approver. If no specific approvers are selected, Privileged Role Administrators and Global Administrators become the default approvers.
   > [!Note]
   > An approver does not have to have an Azure AD administrative role themselves. They can be a regular user, such as an IT executive.

1. Select **Update** to save your changes.

## Manage role settings through Microsoft Graph

To manage settings for Azure AD roles through Microsoft Graph, use the [unifiedRoleManagementPolicy resource type and related methods](/graph/api/resources/unifiedrolemanagementpolicy).

In Microsoft Graph, role settings are referred to as rules and they're assigned to Azure AD roles through container policies. Each Azure AD role is assigned a specific policy object. You can retrieve all policies that are scoped to Azure AD roles and for each policy, retrieve the associated collection of rules through an `$expand` query parameter. The syntax for the request is as follows:

```http
GET https://graph.microsoft.com/v1.0/policies/roleManagementPolicies?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole'&$expand=rules
```

Rules are grouped into containers. The containers are further broken down into rule definitions that are identified by unique IDs for easier management. For example, a **unifiedRoleManagementPolicyEnablementRule** container exposes three rule definitions identified by the following unique IDs.

+ `Enablement_Admin_Eligibility` - Rules that apply for admins to carry out operations on role eligibilities. For example, whether justification is required, and whether for all operations (for example, renewal, activation, or deactivation) or only for specific operations.
+ `Enablement_Admin_Assignment` - Rules that apply for admins to carry out operations on role assignments. For example, whether justification is required, and whether for all operations (for example, renewal, deactivation, or extension) or only for specific operations.
+ `Enablement_EndUser_Assignment` - Rules that apply for principals to enable their assignments. For example, whether multifactor authentication is required.


To update these rule definitions, use the [update rules API](/graph/api/unifiedrolemanagementpolicyrule-update). For example, the following request specifies an empty **enabledRules** collection, therefore deactivating the enabled rules for a policy, such as multifactor authentication, ticketing information and justification.

```http
PATCH https://graph.microsoft.com/v1.0/policies/roleManagementPolicies/DirectoryRole_cab01047-8ad9-4792-8e42-569340767f1b_70c808b5-0d35-4863-a0ba-07888e99d448/rules/Enablement_EndUser_Assignment
{
    "@odata.type": "#microsoft.graph.unifiedRoleManagementPolicyEnablementRule",
    "id": "Enablement_EndUser_Assignment",
    "enabledRules": [],
    "target": {
        "caller": "EndUser",
        "operations": [
            "all"
        ],
        "level": "Assignment",
        "inheritableSettings": [],
        "enforcedSettings": []
    }
}
```

You can retrieve the collection of rules that are applied to all Azure AD roles or a specific Azure AD role through the [unifiedroleManagementPolicyAssignment resource type and related methods](/graph/api/resources/unifiedrolemanagementpolicyassignment). For example, the following request uses the `$expand` query parameter to retrieve the rules that are applied to an Azure AD role identified by **roleDefinitionId** or **templateId** `62e90394-69f5-4237-9190-012177145e10`.

```http
GET https://graph.microsoft.com/v1.0/policies/roleManagementPolicyAssignments?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole' and roleDefinitionId eq '62e90394-69f5-4237-9190-012177145e10'&$expand=policy($expand=rules)
```

For more information about managing role settings through PIM, see [Role settings and PIM](/graph/api/resources/privilegedidentitymanagementv3-overview#role-settings-and-pim).

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Configure security alerts for Azure AD roles in Privileged Identity Management](pim-how-to-configure-security-alerts.md)
