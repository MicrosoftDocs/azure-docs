---
title: Azure role assignment integration with Privileged Identity Management - Azure RBAC
description: Learn about the integration of Azure role assignments in Azure role-based access control (Azure RBAC) with Microsoft Entra Privileged Identity Management (PIM).
author: rolyon
ms.service: role-based-access-control
ms.topic: conceptual
ms.date: 11/11/2024
ms.author: rolyon
---

# Azure role assignment integration with Privileged Identity Management

If you have a Microsoft Entra ID P2 or Microsoft Entra ID Governance license, [Microsoft Entra Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure) is integrated into role assignment steps. For example, you can assign roles to users for a limited period of time. You can also make users eligible for role assignments so that they must activate to use the role, such as request approval. Eligible role assignments provide just-in-time access to a role for a limited period of time.

## PIM functionality

You can create eligible role assignments for users, but you can't creat eligible role assignments for applications, service principals, or managed identities because they can't perform the activation steps. You can create eligible role assignments at management group, subscription, and resource group scope, but not at resource scope. This capability is being deployed in stages, so it might not be available yet in your tenant or your interface might look different.

The assignment type options available to you might vary depending or your PIM policy. For example, PIM policy defines whether permanent assignments can be created, maximum duration for time-bound assignments, roles activations requirements (approval, multifactor authentication, or Conditional Access authentication context), and other settings. For more information, see [Configure Azure resource role settings in Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-resource-roles-configure-role-settings).

If you don't want to use the PIM functionality, select the **Active** assignment type and **Permanent** assignment duration options. These settings create a role assignment where the principal always has permissions in the role. 

:::image type="content" source="./media/shared/assignment-type-eligible.png" alt-text="Screenshot of Add role assignment with Assignment type options displayed." lightbox="./media/shared/assignment-type-eligible.png":::

To better understand PIM, you should review the following terms.

| Term or concept | Role assignment category | Description |
| --- | --- | --- |
| eligible | Type | A role assignment that requires a user to perform one or more actions to use the role. If a user has been made eligible for a role, that means they can activate the role when they need to perform privileged tasks. There's no difference in the access given to someone with a permanent versus an eligible role assignment. The only difference is that some people don't need that access all the time. |
| active | Type | A role assignment that doesn't require a user to perform any action to use the role. Users assigned as active have the privileges assigned to the role. |
| activate |  | The process of performing one or more actions to use a role that a user is eligible for. Actions might include performing a multifactor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers. |
| permanent eligible | Duration | A role assignment where a user is always eligible to activate the role. |
| permanent active | Duration | A role assignment where a user can always use the role without performing any actions. |
| time-bound eligible | Duration | A role assignment where a user is eligible to activate the role only within start and end dates. |
| time-bound active | Duration | A role assignment where a user can use the role only within start and end dates. |
| just-in-time (JIT) access |  | A model in which users receive temporary permissions to perform privileged tasks, which prevents malicious or unauthorized users from gaining access after the permissions have expired. Access is granted only when users need it. |
| principle of least privilege access |  | A recommended security practice in which every user is provided with only the minimum privileges needed to accomplish the tasks they're authorized to perform. This practice minimizes the number of Global Administrators and instead uses specific administrator roles for certain scenarios. |

For more information, see [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure).

## How do I list all my PIM role assignments through PowerShell? 

There is no single PowerShell cmdlet that would list both the eligible and active timebound role assignments which are both supported by PIM.
To list your eligible role assignments, use the [Get-AzRoleEligibilitySchedule](/powershell/module/az.resources/get-azroleeligibilityschedule) command. 
To list your active role assignments, use the [Get-AzRoleAssignmentSchedule](/powershell/module/az.resources/get-azroleassignmentschedule) command
For information about how scopes are constructed, see [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

See this example to list role assignments that are supported by PIM functionalities in a subscription and it's child scopes, which includes role assignments of type active timebound, eligible permanent, and eligible timebound, use the following commands. The `Where-Object` condition filters out active permanent role assignments that are available with Azure RBAC functionality today without PIM.

Pre-requisites to using PowerShell: [Azure PowerShell](/powershell/azure/install-azure-powershell). 
[Sign in to Azure PowerShell interactively](/powershell/azure/authenticate-interactive).

```powershell
Get-AzRoleAssignmentSchedule -Scope /subscriptions/<subscriptionId> | Where-Object {$_.EndDateTime -ne $null }
Get-AzRoleEligibilitySchedule -Scope /subscriptions/<subscriptionId> 
```

## How do I convert all my role assignments supported by PIM to be supported by Azure RBAC system only? 

### Option 1 - Conversion through UI

1. Filter for PIM role assignments:
In the Role assignment tab in the Access control (IAM) blade, you can group and sort by State, and look for role assignments that are not of the type "Active Permanent"

2. For each role assignment that is not of the State "Active Permanent", you can click on the State hyperlink to edit their Assignment type and Assignment duration. See details here https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal#edit-assignment-(preview)
If you don't want to leverage PIM capability, convert the role assignment by selecting Assignment type as Active and Assignment duration as Permanent and click save. This conversion may take a few moments. You cannot make conversions for role assignments at higher scopes. 

3. Do this for all the scopes you wish to convert PIM role assignments for.

### Option 2 - Conversion through PowerShell

There is no API or cmdlet to directly convert role assignments to a different state or type, so instead you can do the following steps:

1. Retrieve and save the list of all of your PIM role assignment in a secure location. See list all your PIM role assignment in the section above.
Note - this is important because this conversion requires for deletion of the PIM role assignment first before creating the same role assignment copy in the Azure RBAC system, so make sure the list of all of your PIM role assignments are saved in a secure location first before the deletion to prevent any data loss

2. Remove your eligible role assignments
The follow example shows how you can remove an eligible role assignment

    ```powershell
    $guid = New-guid
    New-AzRoleEligibilityScheduleRequest -Name $guid -Scope <Scope> -PrincipalId <PrincipalId> -RoleDefinitionId <RoleDefinitionId> -RequestType AdminRemove
    ```
  
3. Remove your active timebound role assignments
The follow example shsows how you can remove an active timebound role assignment

    ```powershell
    $guid = New-guid
    New-AzRoleAssignmentScheduleRequest -Name $guid -Scope <Scope> -PrincipalId <PrincipalId> -RoleDefinitionId <RoleDefinitionId> -RequestType AdminRemove
    ```

4. Create Active Permanent role assignments with Azure RBAC for every eligile role assignment
The following example shows how to create an active permanent role assignment with Azure RBAC

    ```powershell
    foreach($RA in $RAs)
    {
        $result = Get-AzRoleAssignment -ObjectId $RA.PrincipalId -RoleDefinitionName $RA.RoleDefinitionDisplayName -Scope $RA.Scope;
        if($result -eq $null) {
        New-AzRoleAssignment -ObjectId $RA.PrincipalId -RoleDefinitionName $RA.RoleDefinitionDisplayName -Scope $RA.Scope
        }
    }
    ```

## How do I stop my users from creating PIM role assignments?

You can use Azure Policy to block creation of PIM role assignments. For more information, see [What is Azure Policy?](/azure/governance/policy/overview).

Here is an example policy that blocks the creation of PIM role assignments except for a specific list of identities to can receive them. Additional parameters and checks can be added for other allow lists. See PIM resource properties:
[RoleEligibilityScheduleRequest](https://learn.microsoft.com/en-us/rest/api/authorization/role-eligibility-schedule-requests/get?view=rest-authorization-2020-10-01&tabs=HTTP)
[RoleAssignmentScheduleRequest](https://learn.microsoft.com/en-us/rest/api/authorization/role-assignment-schedule-requests/get?view=rest-authorization-2020-10-01&tabs=HTTP)

```json
{
  "properties": {
    "displayName": "Block eligible and active timebound role assignment creation except for allowed principal ids",
    "policyType": "Custom",
    "mode": "All",
    "metadata": {
      "createdBy": "aaaaaaaa-bbbb-cccc-1111-222222222222",
      "createdOn": "2024-11-05T02:31:25.1246591Z",
      "updatedBy": "aaaaaaaa-bbbb-cccc-1111-222222222222",
      "updatedOn": "2024-11-06T07:58:17.1699721Z"
    },
    "version": "1.0.0",
    "parameters": {
      "allowedPrincipalIds": {
        "type": "Array",
        "metadata": {
          "displayName": "Allowed Principal IDs",
          "description": "A list of principal IDs that can receive PIM role assignments."
        },
        "defaultValue": []
      }
    },
    "policyRule": {
      "if": {
        "anyof": [
          {
            "allOf": [
              {
                "field": "type",
                "equals": "Microsoft.Authorization/roleEligibilityScheduleRequests"
              },
              {
                "not": {
                  "field": "Microsoft.Authorization/roleEligibilityScheduleRequests/principalId",
                  "in": "[parameters('allowedPrincipalIds')]"
                }
              }
            ]
          },
          {
            "allOf": [
              {
                "field": "type",
                "equals": "Microsoft.Authorization/roleAssignmentScheduleRequests"
              },
              {
                "not": {
                  "field": "Microsoft.Authorization/roleAssignmentScheduleRequests/principalId",
                  "in": "[parameters('allowedPrincipalIds')]"
                }
              }
            ]
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    },
    "versions": [
      "1.0.0"
    ]
  },
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4ef/providers/Microsoft.Authorization/policyDefinitions/1aaaaaa1-2bb2-3cc3-4dd4-5eeeeeeeeee5",
  "type": "Microsoft.Authorization/policyDefinitions",
  "name": "1aaaaaa1-2bb2-3cc3-4dd4-5eeeeeeeeee5",
  "systemData": {
    "createdBy": "test1@contoso.com",
    "createdByType": "User",
    "createdAt": "2024-11-05T02:31:25.0836273Z",
    "lastModifiedBy": "test1@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2024-11-06T07:58:17.1651655Z"
  }
}
```

For information about how to assign an Azure Policy with parameters, see [Tutorial: Create and manage policies to enforce compliance](/azure/governance/policy/tutorials/create-and-manage#assign-a-policy).

## Next steps

- [Delegate Azure access management to others](delegate-role-assignments-overview.md)
- [Steps to assign an Azure role](role-assignments-steps.md)
