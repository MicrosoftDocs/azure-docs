---
title: "Quickstart: Assign an Azure role using Bicep - Azure RBAC"
description: Learn how to grant access to Azure resources for a user at resource group scope using Bicep and Azure role-based access control (Azure RBAC).
services: role-based-access-control,azure-resource-manager
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.workload: identity
ms.date: 06/30/2022
ms.author: rolyon
#Customer intent: As a new user, I want to see how to grant access to resources using Bicep so that I can start automating role assignment processes.
---

# Quickstart: Assign an Azure role using Bicep

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this quickstart, you create a resource group and grant a user access to create and manage virtual machines in the resource group. This quickstart uses Bicep to grant the access.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

To assign Azure roles and remove role assignments, you must have:

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner).
- To assign a role, you must specify three elements: security principal, role definition, and scope. For this quickstart, the security principal is you or another user in your directory, the role definition is [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor), and the scope is a resource group that you specify.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/rbac-builtinrole-resourcegroup/). The Bicep file has two parameters and a resources section. In the resources section, notice that it has the three elements of a role assignment: security principal, role definition, and scope.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.authorization/rbac-builtinrole-resourcegroup/main.bicep":::

The resource defined in the Bicep file is:

- [Microsoft.Authorization/roleAssignments](/azure/templates/Microsoft.Authorization/roleAssignments)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters roleDefinitionID=9980e02c-c2be-4d73-94e8-173b1dc7cf3c principalId=<principal-id>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -roleDefinitionID "9980e02c-c2be-4d73-94e8-173b1dc7cf3c" -principalId "<principal-id>"
    ```

    ---

> [!NOTE]
> Replace **\<principal-id\>** with the principal ID assigned to the role.

 When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az role assignment list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzRoleAssignment -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to remove the role assignment. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

Use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using Azure PowerShell](tutorial-role-assignments-user-powershell.md)
