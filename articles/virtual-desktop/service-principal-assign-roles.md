---
title: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals - Azure Virtual Desktop
description: Learn how to assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals by using the Azure portal, Azure CLI, or Azure PowerShell.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 12/20/2023
---

# Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals

Several Azure Virtual Desktop features require you to assign Azure role-based access control (Azure RBAC) roles or Microsoft Entra roles to one of the Azure Virtual Desktop service principals. Features that you need to assign a role to an Azure Virtual Desktop service principal include:

- [App attach](app-attach-setup.md) (when using Azure Files and your session hosts joined to Microsoft Entra ID).
- [Autoscale](autoscale-scaling-plan.md).
- [Session host update](session-host-update.md)
- [Start VM on Connect](start-virtual-machine-connect.md).

> [!TIP]
> You can find which role or roles you need to assign to which service principal in the article for each feature. For a list of all the available Azure RBAC roles created specifically for Azure Virtual Desktop, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md). To learn more about Azure RBAC, see [Azure RBAC documentation](../role-based-access-control/index.yml) or for Microsoft Entra roles, see [Microsoft Entra roles documentation](/entra/identity/role-based-access-control/).

Depending on when you registered the *Microsoft.DesktopVirtualization* resource provider, the service principal names begin with either *Azure Virtual Desktop* or *Windows Virtual Desktop*. Also, if you previously used both Azure Virtual Desktop classic and Azure Virtual Desktop (Azure Resource Manager), you see apps with the same name. You can make sure you're assigning roles to the correct service principal by checking its application ID. The application ID for each service principal is in the following table:

| Service principal | Application ID |
|--|--|
| :::no-loc text="Azure Virtual Desktop":::<br />:::no-loc text="Windows Virtual Desktop"::: | 9cdead84-a844-4324-93f2-b2e6bb768d07 |
| :::no-loc text="Azure Virtual Desktop Client":::<br />:::no-loc text="Windows Virtual Desktop Client"::: | a85cf173-4192-42f8-81fa-777a763e6e2c |
| :::no-loc text="Azure Virtual Desktop ARM Provider":::<br />:::no-loc text="Windows Virtual Desktop ARM Provider"::: | 50e95039-b200-4007-bc97-8d5790743a63 |

This article shows you how to assign Azure RBAC roles or Microsoft Entra roles to the correct Azure Virtual Desktop service principals by using the Azure portal, Azure CLI, or Azure PowerShell. 

## Prerequisites

Before you can assign a role to an Azure Virtual Desktop service principal, you need to meet the following prerequisites:

- To assign Azure RBAC roles, you must have the `Microsoft.Authorization/roleAssignments/write` permission to an Azure subscription in order to assign roles on that subscription. This permission is part of the [Owner](../role-based-access-control/built-in-roles.md) or [User Access Administrator](../role-based-access-control/built-in-roles.md) built in roles.

- To assign Microsoft Entra roles, you must have the [Privileged Role Administrator](/entra/identity/role-based-access-control/permissions-reference#privileged-role-administrator) or [Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator) role.

- If you want to use Azure PowerShell or Azure CLI locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module or [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Assign an Azure RBAC role to an Azure Virtual Desktop service principal

To assign an [Azure RBAC role](../role-based-access-control/overview.md) to an Azure Virtual Desktop service principal, select the relevant tab for your scenario and follow the steps. In these examples, the scope of the role assignment is an Azure subscription, but you need to use the scope and the role required by each feature.

# [Azure portal](#tab/portal)

Here's how to assign an Azure RBAC role to an Azure Virtual Desktop service principal scoped to a subscription using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter *Microsoft Entra ID* and select the matching service entry.

1. On the Overview page, in the search box for **Search your tenant**, enter the application ID for the service principal you want to assign from the earlier table.

1. In the results, select the matching enterprise application for the service principal you want to assign, starting either **Azure Virtual Desktop** or **Windows Virtual Desktop**.

1. Under properties, make a note of the **name** and the **object ID**. The object ID correlates to the application ID, and is unique to your tenant.

1. Go back to the search box, enter *Subscriptions* and select the matching service entry.

1. Select the subscription you want to add the role assignment to.

1. Select **Access control (IAM)**, then select **+ Add** followed by **Add role assignment**.

1. Select the role you want to assign to the Azure Virtual Desktop service principal, then select **Next**.

1. Ensure **Assign access to** is set to **Microsoft Entra user, group, or service principal**, then select **Select members**.

1. Enter the name of the enterprise application you made a note of earlier.

1. Select the matching entry from the results, then select **Select**. If you have two entries with the same name, select them both for now.

1. Review the list of members in the table. If you have two entries, remove the entry that doesn't match the object ID you made a note of earlier.

1. Select **Next**, then select **Review + assign** to complete the role assignment.

# [Azure PowerShell](#tab/powershell)

Here's how to assign an Azure RBAC role to an Azure Virtual Desktop service principal scoped to a subscription using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Find the ID of the subscription you want to add the role assignment to by listing all that are available to you with the following command:

   ```azurepowershell
   Get-AzSubscription
   ```

3. Store the subscription ID in a variable by running the following command, replacing the subscription ID in this example with your own:

   ```azurepowershell
   $subId = "<SubscriptionID>"
   ```

4. Assign the role to an Azure Virtual Desktop service principal by running the following command, replacing the value for the `RoleDefinitionName` parameter with the name of the role you need to assign, and the `ApplicationId` parameter with application ID of the service principal you want to assign from the earlier table. This example assigns the *Desktop Virtualization Power On Off Contributor* role to the *Azure Virtual Desktop* service principal on the subscription:

   ```azurepowershell
   $parameters = @{
       RoleDefinitionName = "Desktop Virtualization Power On Off Contributor"
       ApplicationId = "9cdead84-a844-4324-93f2-b2e6bb768d07"
       Scope = "/subscriptions/$subId"
   }
   
   New-AzRoleAssignment @parameters
   ```

   Your output should be similar to the following example:

   ```output
   RoleAssignmentName : c5221262-d1fa-4d32-9d60-8bd86f618d20
   RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/c5221262-d1fa-4d32-9d60-8bd86f618d20
   Scope              : /subscriptions/00000000-0000-0000-0000-000000000000
   DisplayName        : Azure Virtual Desktop
   SignInName         : 
   RoleDefinitionName : Desktop Virtualization Power On Off Contributor
   RoleDefinitionId   : 40c5ff49-9181-41f8-ae61-143b0e78555e
   ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
   ObjectType         : ServicePrincipal
   CanDelegate        : False
   Description        : 
   ConditionVersion   : 
   Condition          :
   ```

# [Azure CLI](#tab/cli)

Here's how to assign an Azure RBAC role to an Azure Virtual Desktop service principal scoped to a subscription using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Find the ID of the subscription you want to add the role assignment to by listing all that are available to you with the following command:

   ```azurecli
   az account list --output table
   ```

3. Store the value for **SubscriptionId** in a variable by running the following command, replacing the subscription ID in this example with your own:

   ```azurecli
   subId=00000000-0000-0000-0000-000000000000
   ```

4. Assign the role to an Azure Virtual Desktop service principal by running the following command, replacing the value for the `role` parameter with the name of the role you need to assign, and the `assignee` parameter with application ID of the service principal you want to assign from the earlier table. This example assigns the *Desktop Virtualization Power On Off Contributor* role to the *Azure Virtual Desktop* service principal on the subscription:

   ```azurecli
   az role assignment create \
       --assignee "9cdead84-a844-4324-93f2-b2e6bb768d07" \
       --role "Desktop Virtualization Power On Off Contributor" \
       --scope "/subscriptions/$subId"
   ```

   Your output should be similar to the following example:

   ```output
   {
     "condition": null,
     "conditionVersion": null,
     "createdBy": null,
     "createdOn": "2023-06-22T13:50:22.978226+00:00",
     "delegatedManagedIdentityResourceId": null,
     "description": null,
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/a211100e-aa52-4f8d-aac9-ad0833f969d0",
     "name": "a211100e-aa52-4f8d-aac9-ad0833f969d0",
     "principalId": "00000000-0000-0000-0000-000000000000",
     "principalType": "ServicePrincipal",
     "roleDefinitionId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleDefinitions/40c5ff49-9181-41f8-ae61-143b0e78555e",
     "scope": "/subscriptions/00000000-0000-0000-0000-000000000000",
     "type": "Microsoft.Authorization/roleAssignments",
     "updatedBy": "effe20b0-5afb-4e68-a5d7-f8ef9873a070",
     "updatedOn": "2023-06-22T13:50:23.335229+00:00"
   }
   ```

---

## Assign a Microsoft Entra role to an Azure Virtual Desktop service principal

To assign a Microsoft Entra role to an Azure Virtual Desktop service principal, select the relevant tab for your scenario and follow the steps. In these examples, the scope of the role assignment is an Azure subscription, but you need to use the scope and the role required by each feature.

Here's how to assign a Microsoft Entra role to an Azure Virtual Desktop service principal scoped to a tenant using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter *Microsoft Entra ID* and select the matching service entry.

1. Select **Roles and administrators**.

1. Search for and select the name of the role you want to assign. If you want to assign a custom role, see [Create a custom role](/entra/identity/role-based-access-control/custom-create) to create it first.

1. Select **Add assignments**.

1. In the search box, enter the application ID for the service principal you want to assign from the earlier table, for example **9cdead84-a844-4324-93f2-b2e6bb768d07**.

1. Check the box next to the matching entry, then select **Add** to complete the role assignment.

## Next steps

Learn more about the [built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).
