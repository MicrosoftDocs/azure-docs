---
title: Create or update Azure custom roles using Bicep - Azure RBAC
description: Learn how to create or update Azure custom roles using Bicep and Azure role-based access control (Azure RBAC).
services: role-based-access-control,azure-resource-manager
author: schaffererin
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 05/19/2022
ms.author: v-eschaffer 
ms.custom: devx-track-azurepowershell

#Customer intent: As an IT admin, I want to create custom and/or roles using Bicep so that I can start automating custom role processes.
---

# Create or update Azure custom roles using Bicep

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own [custom roles](custom-roles.md). This article describes how to create or update a custom role using Bicep.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

To create a custom role, you specify a role name, role permissions, and where the role can be used. In this article, you create a role named _Custom Role - RG Reader_ with resource permissions that can be assigned at a subscription scope or lower.

## Prerequisites

To create a custom role, you must have permissions to create custom roles, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator).

You also must have an active Azure subscription. If you don't have one, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this article is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-role-def). The Bicep file has four parameters and a resources section. The four parameters are:

- Array of actions with a default value of `["Microsoft.Resources/subscriptions/resourceGroups/read"]`.
- Array of `notActions` with an empty default value.
- Role name with a default value of `Custom Role - RG Reader`.
- Role description with a default value of `Subscription Level Deployment of a Role Definition`.

The scope where this custom role can be assigned is set to the current subscription.

:::code language="bicep" source="~/quickstart-templates/subscription-deployments/create-role-def/main.bicep":::

The resource defined in the Bicep file is:

- [Microsoft.Authorization/roleDefinitions](/azure/templates/Microsoft.Authorization/roleDefinitions)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az deployment sub create --name demoSubDeployment --location eastus --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzSubscriptionDeployment -Name demoSubDeployment -Location eastus -TemplateFile ./main.bicep
    ```

    ---

 When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to verify that the custom role was created.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Update a custom role

Similar to creating a custom role, you can update an existing custom role using Bicep. To update a custom role, you need to specify the role you want to update.

Here are the changes you would need to make to the previous Bicep file to update the custom role:

- Include the role ID as a parameter.

    ```bicep
    ...
    @description('ID of the role definition')
    param roleDefName string = '<ID-name>'
    ...

    ```

- Include the role ID parameter in the role definition.

    ```bicep
    ...
    resource roleDef 'Microsoft.Authorization/roleDefinitions@2018-07-01' = {
        name: '[parameters('roleDefName')]'
        properties : {
        ...
    ```

Then, use Azure CLI or Azure PowerShell to deploy the updated Bicep file.

# [CLI](#tab/CLI)

```azurecli-interactive
az deployment group create --resource-group exampleRG --template-file main.bicep --roleDefName=<role-name>
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
New-AzDeployment -ResourceGroupName exampleRG -Location eastus -TemplateFile ./main.bicep -roleDefName "<role-name>"
```

---

> [!NOTE]
> Replace **\<actions\>** with . Replace **\<role-name\>** with

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

- [Understand Azure role definitions](role-definitions.md)
- [Bicep documentation](../azure-resource-manager/bicep/overview.md)
