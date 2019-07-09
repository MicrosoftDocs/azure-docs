---
title: Tutorial - Grant a user access to Azure resources using RBAC and Resource Manager template | Microsoft Docs
description: Learn how to grant a user access to Azure resources using role-based access control (RBAC) by using Azure Resource Manager template.
services: role-based-access-control,azure-resource-manager
documentationCenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: role-based-access-control
ms.devlang: ''
ms.topic: tutorial
ms.tgt_pltfrm: ''
ms.workload: identity
ms.date: 05/15/2019
ms.author: rolyon

#Customer intent: As a new user, I want to see how to grant access to resources by using Azure Resource Manager template so that I can start granting access to others.

---

# Tutorial: Grant a user access to Azure resources using RBAC and Resource Manager template

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. In this tutorial, you create a resource group and grant a user access to create and manage virtual machines in the resource group. This tutorial focuses on the process of deploying a Resource Manager template to grant the access. For more information on developing Resource Manager templates, see [Resource Manager documentation](/azure/azure-resource-manager/) and the [template reference](/azure/templates/microsoft.authorization/allversions
).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant access for a user at a resource group scope
> * Validate the deployment
> * Clean up

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To add and remove role assignments, you must have:

* `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner)

## Grant access

The template used in this quickstart is from [Azure quickstart templates](https://azure.microsoft.com/resources/templates/101-rbac-builtinrole-resourcegroup/). More Azure authorization related templates can be found [here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Authorization).

To deploy the template, select **Try it** to open the Azure Cloud shell, and then paste the following PowerShell script into the shell window. To paste the code, right-click the shell window and then select **Paste**.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name that is used to generate Azure resource names"
$emailAddress = Read-Host -Prompt "Enter your email address that is associated with your Azure subscription (used to find the principal ID)"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

$resourceGroupName = "${projectName}rg"
$roleAssignmentName = New-Guid
$principalId = (Get-AzAdUser -Mail $emailAddress).id
$roleDefinitionId = (Get-AzRoleDefinition -name "Virtual Machine Contributor").id
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-rbac-builtinrole-resourcegroup/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -roleAssignmentName $roleAssignmentName -roleDefinitionID $roleDefinitionId -principalId $principalId
```

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the resource group created in the last procedure. The default name is the project name with **rg** appended.
1. Select **Access control (IAM)** from the left menu.
1. Select **Role assignments**. 
1. In **Name**, enter the email address you typed in the last procedure. You shall see the user with the email address has the **Virtual Machine Contributor** role.

## Clean up

To remove the resource group created in the last procedure, select **Try it** to open the Azure Cloud shell, and then paste the following PowerShell script into the shell window.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a same project name you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -Name $resourceGroupName
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using RBAC and Azure PowerShell](tutorial-role-assignments-user-powershell.md)