---
title: "Quickstart: Add an Azure role assignment using Azure Resource Manager template - Azure RBAC"
description: Learn how to grant access to Azure resources for a user at resource group scope using Azure Resource Manager templates and Azure role-based access control (Azure RBAC).
services: role-based-access-control,azure-resource-manager
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.topic: quickstart
ms.custom: subject-armqs
ms.workload: identity
ms.date: 05/21/2020
ms.author: rolyon

#Customer intent: As a new user, I want to see how to grant access to resources by using Azure Resource Manager template so that I can start automating role assignment processes.

---

# Quickstart: Add an Azure role assignment using Azure Resource Manager template

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this quickstart, you create a resource group and grant a user access to create and manage virtual machines in the resource group. This quickstart focuses on the process of deploying a Resource Manager template to grant the access.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To add role assignments, you must have:

* `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner)

## Create a role assignment

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-rbac-builtinrole-resourcegroup/).

:::code language="json" source="~/quickstart-templates/101-rbac-builtinrole-resourcegroup/azuredeploy.json":::

### Deploy the template

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Determine your email address that is associated with your Azure subscription. Or determine the email address of another user in your directory.

1. Open Azure Cloud Shell for PowerShell.

1. Copy and paste the following script into Cloud Shell.

    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter a resource group name (i.e. ExampleGrouprg)"
    $emailAddress = Read-Host -Prompt "Enter an email address for a user in your directory"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    
    $roleAssignmentName = New-Guid
    $principalId = (Get-AzAdUser -Mail $emailAddress).id
    $roleDefinitionId = (Get-AzRoleDefinition -name "Virtual Machine Contributor").id
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-rbac-builtinrole-resourcegroup/azuredeploy.json"
    
    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -roleAssignmentName $roleAssignmentName -roleDefinitionID $roleDefinitionId -principalId $principalId
    ```

1. Enter values for resource group name, email address, and location.

## Review deployed resources

1. Open the resource group you created.

1. In the left menu, click **Access control (IAM)**.

1. Click the **Role assignments** tab.

1. Verify the **Virtual Machine Contributor** role was assigned to the specified user.

   ![New role assignment](./media/quickstart-role-assignments-template/role-assignment-portal.png)

## Clean up resources

To remove the role assignment and resource group you created, follow these steps.

1. Copy and paste the following script into Cloud Shell.

    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter a resource group name (i.e. ExampleGrouprg)"
    $emailAddress = Read-Host -Prompt "Enter an email address for a user in your directory"
    
    $principalId = (Get-AzAdUser -Mail $emailAddress).id
    Remove-AzRoleAssignment -ObjectId $principalId -RoleDefinitionName "Virtual Machine Contributor" -ResourceGroupName $resourceGroupName
    
    Remove-AzResourceGroup -Name $resourceGroupName
    ```
    
1. Enter the resource group name.

1. Enter **Y** to confirm that you want to remove the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using Azure PowerShell](tutorial-role-assignments-user-powershell.md)