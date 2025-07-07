---
title: "Quickstart: Assign an Azure role using an Azure Resource Manager template - Azure RBAC"
description: Learn how to grant access to Azure resources for a user at resource group scope using Azure Resource Manager templates and Azure role-based access control (Azure RBAC).
services: role-based-access-control,azure-resource-manager
author: jenniferf-skc
manager: pmwongera
ms.service: role-based-access-control
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-azurepowershell, devx-track-arm-template
ms.date: 12/01/2023
ms.author: jfields
#Customer intent: As a new user, I want to see how to grant access to resources by using Azure Resource Manager template so that I can start automating role assignment processes.
---

# Quickstart: Assign an Azure role using an ARM template

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this quickstart, you create a resource group and grant a user access to create and manage virtual machines in the resource group. This quickstart uses an Azure Resource Manager template (ARM template) to grant the access.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.authorization%2Frbac-builtinrole-resourcegroup%2Fazuredeploy.json":::

## Prerequisites

To assign Azure roles and remove role assignments, you must have:

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator)
- To assign a role, you must specify three elements: security principal, role definition, and scope. For this quickstart, the security principal is you or another user in your directory, the role definition is [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor), and the scope is a resource group that you specify.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/rbac-builtinrole-resourcegroup/). The template has two parameters and a resources section. In the resources section, notice that it has the three elements of a role assignment: security principal, role definition, and scope.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.authorization/rbac-builtinrole-resourcegroup/azuredeploy.json":::

The resource defined in the template is:

- [Microsoft.Authorization/roleAssignments](/azure/templates/Microsoft.Authorization/roleAssignments)

## Deploy the template

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Determine your email address that is associated with your Azure subscription. Or determine the email address of another user in your directory.

1. Open Azure Cloud Shell for PowerShell.

1. Copy and paste the following script into Cloud Shell.

    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter a resource group name (i.e. ExampleGrouprg)"
    $emailAddress = Read-Host -Prompt "Enter an email address for a user in your directory"
    $location = Read-Host -Prompt "Enter a location (i.e. centralus)"

    $roleAssignmentName = New-Guid
    $principalId = (Get-AzAdUser -Mail $emailAddress).id
    $roleDefinitionId = (Get-AzRoleDefinition -name "Virtual Machine Contributor").id
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.authorization/rbac-builtinrole-resourcegroup/azuredeploy.json"

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -roleDefinitionID $roleDefinitionId -principalId $principalId
    ```

1. Enter a resource group name such as ExampleGrouprg.

1. Enter an email address for yourself or another user in your directory.

1. Enter a location for the resource group such as centralus.

1. If necessary, press Enter to run the New-AzResourceGroupDeployment command.

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a new resource group and the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) command deploys the template to add the role assignment.

    You should see output similar to the following:

    ```azurepowershell
    PS> New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -roleAssignmentName $roleAssignmentName -roleDefinitionID $roleDefinitionId -principalId $principalId

    DeploymentName          : azuredeploy
    ResourceGroupName       : ExampleGrouprg
    ProvisioningState       : Succeeded
    Timestamp               : 5/22/2020 9:01:30 PM
    Mode                    : Incremental
    TemplateLink            :
                              Uri            : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.authorization/rbac-builtinrole-resourcegroup/azuredeploy.json
                              ContentVersion : 1.0.0.0

    Parameters              :
                              Name                  Type                       Value
                              ====================  =========================  ==========
                              roleDefinitionID      String                     9980e02c-c2be-4d73-94e8-173b1dc7cf3c
                              principalId           String                     {principalId}

    Outputs                 :
    DeploymentDebugLogLevel :
    ```

## Review deployed resources

1. In the Azure portal, open the resource group you created.

1. In the left menu, click **Access control (IAM)**.

1. Click the **Role assignments** tab.

1. Verify that the **Virtual Machine Contributor** role is assigned to the user you specified.

   ![New role assignment](./media/quickstart-role-assignments-template/role-assignment-portal.png)

## Clean up resources

To remove the role assignment and resource group you created, follow these steps.

1. Copy and paste the following script into Cloud Shell.

    ```azurepowershell
    $emailAddress = Read-Host -Prompt "Enter the email address of the user with the role assignment to remove"
    $resourceGroupName = Read-Host -Prompt "Enter the resource group name to remove (i.e. ExampleGrouprg)"

    $principalId = (Get-AzAdUser -Mail $emailAddress).id

    Remove-AzRoleAssignment -ObjectId $principalId -RoleDefinitionName "Virtual Machine Contributor" -ResourceGroupName $resourceGroupName
    Remove-AzResourceGroup -Name $resourceGroupName
    ```

1. Enter the email address of the user with the role assignment to remove.

1. Enter the resource group name to remove such as ExampleGrouprg.

1. If necessary, press Enter to run the Remove-AzResourceGroup command.

1. Enter **Y** to confirm that you want to remove the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using Azure PowerShell](tutorial-role-assignments-user-powershell.md)
