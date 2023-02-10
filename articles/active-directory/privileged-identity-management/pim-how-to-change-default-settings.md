---
title: Configure Azure AD role settings in PIM - Azure Active Directory
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
ms.date: 01/27/2023
ms.author: amsliu
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Configure Azure AD role settings in Privileged Identity Management

In Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, role settings define role assignment properties: MFA and approval requirements for activation, assignment maximum duration, notification settings, and more. Use the following steps to configure role settings and setup the approval workflow to specify who can approve or deny requests to elevate privilege.

You need to have Global Administrator or Privileged Role Administrator role to manage PIM role settings for Azure AD Role. Role settings are defined per role: all assignments for the same role follow the same role settings. Role settings of one role are independent from role settings of another role.

PIM role settings are also known as “PIM Policies”.


## Open role settings

Follow these steps to open the settings for an Azure AD role.

1. [Sign in to Azure AD](https://aad.portal.azure.com/) 

1. Select **Azure AD Privileged Identity Management -> Azure AD Roles -> Roles**. On this page you can see list of Azure AD roles available in the tenant, including built-in and custom roles.
    :::image type="content" source="media/pim-how-to-change-default-settings/role-settings.png" alt-text="Screenshot of the list of Azure AD roles available in the tenant, including built-in and custom roles." lightbox="media/pim-how-to-change-default-settings/role-settings.png":::

1. Select the role whose settings you want to configure.

1. Select **Role settings**. On the Role settings page you can view current PIM role settings for the selected role.

    :::image type="content" source="media/pim-how-to-change-default-settings/role-settings-edit.png" alt-text="Screenshot of the role settings page with options to update assignment and activation settings." lightbox="media/pim-how-to-change-default-settings/role-settings-edit.png":::

1.	Select Edit to update role settings.

1.	Once finished, select Update.

## Role settings 

### Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that an activation request for a role assignment remains active before it expires. This value can be from one to 24 hours.

### On activation, require multi-factor authentication 

You can require users who are eligible for a role to prove who they are using Azure AD Multi-Factor Authentication before they can activate. Multi-factor authentication ensures that the user is who they say they are with reasonable certainty. Enforcing this option protects critical resources in situations when the user account might have been compromised.

User may not be prompted for multi-factor authentication if they authenticated with strong credential or provided multi-factor authentication earlier in this session.

For more information, see [Multifactor authentication and Privileged Identity Management](pim-how-to-require-mfa.md).

### On activation, require Azure AD Conditional Access authentication context (Public Preview)

You can require users who are eligible for a role to satisfy Conditional Access policy requirements: use specific authentication method enforced through Authentication Strengths, elevate the role from Intune compliant device, comply with Terms of Use, and more. 

To enforce this requirement, you need to:

1.	Create Conditional Access authentication context.
1.	Configure Conditional Access policy that would enforce requirements for this authentication context.
1.	Configure authentication context in PIM settings for the role.

:::image type="content" source="media/pim-how-to-change-default-settings/role-settings-page.png" alt-text="Screenshot of the Edit role setting Attribute Definition Administrator page." lightbox="media/pim-how-to-change-default-settings/role-settings-page.png":::

To learn more about Conditional Access authentication context, see [Conditional Access: Cloud apps, actions, and authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context).

### Require justification on activation

You can require users to enter a business justification when they activate the eligible assignment.

### Require ticket information on activation

You can require users to enter a support ticket number when they activate the eligible assignment. This is information-only field and correlation with information in any ticketing system is not enforced.

### Require approval to activate

You can require approval for activation of eligible assignment. Approver doesn’t have to have any roles. When using this option, you have to select at least one approver (we recommend to select at least two approvers), there are no default approvers.

To learn more about approvals, see [Approve or deny requests for Azure AD roles in Privileged Identity Management](azure-ad-pim-approval-workflow.md).

### Assignment duration

You can choose from two assignment duration options for each assignment type (eligible and active) when you configure settings for a role. These options become the default maximum duration when a user is assigned to the role in Privileged Identity Management.

You can choose one of these **eligible** assignment duration options:

| Setting | Description |
| --- | --- |
| Allow permanent eligible assignment | Resource administrators can assign permanent eligible assignment. |
| Expire eligible assignment after | Resource administrators can require that all eligible assignments have a specified start and end date. |

And, you can choose one of these **active** assignment duration options:

| Setting | Description |
| --- | --- |
| Allow permanent active assignment | Resource administrators can assign permanent active assignment. |
| Expire active assignment after | Resource administrators can require that all active assignments have a specified start and end date. |

> [!NOTE]
> All assignments that have a specified end date can be renewed by Global admins and Privileged role admins. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

### Require multi-factor authentication on active assignment

You can require that administrator provides multi-factor authentication when they create an active (as opposed to eligible) assignment. Privileged Identity Management can't enforce multi-factor authentication when the user uses their role assignment because they are already active in the role from the time that it is assigned.

Administrator may not be prompted for multi-factor authentication if they authenticated with strong credential or provided multi-factor authentication earlier in this session.

### Require justification on active assignment

You can require that users enter a business justification when they create an active (as opposed to eligible) assignment.

In the **Notifications** tab on the role settings page, Privileged Identity Management enables granular control over who receives notifications and which notifications they receive.

-	**Turning off an email**</br>
You can turn off specific emails by clearing the default recipient check box and deleting any other recipients.
-	**Limit emails to specified email addresses**</br>
You can turn off emails sent to default recipients by clearing the default recipient check box. You can then add other email addresses as recipients. If you want to add more than one email address, separate them using a semicolon (;).
-	**Send emails to both default recipients and more recipients**</br>
You can send emails to both default recipient and another recipient by selecting the default recipient checkbox and adding email addresses for other recipients.
-	**Critical emails only**</br>
For each type of email, you can select the check box to receive critical emails only. What this means is that Privileged Identity Management will continue to send emails to the specified recipients only when the email requires an immediate action. For example, emails asking users to extend their role assignment will not be triggered while emails requiring admins to approve an extension request will be triggered.

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

For more information about managing role settings through PIM, see [Role settings and PIM](/graph/api/resources/privilegedidentitymanagementv3-overview#role-settings-and-pim). For examples of updating rules, see [Use PIM APIs in Microsoft Graph to update Azure AD rules](/graph/how-to-pim-update-rules).

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Configure security alerts for Azure AD roles in Privileged Identity Management](pim-how-to-configure-security-alerts.md)
