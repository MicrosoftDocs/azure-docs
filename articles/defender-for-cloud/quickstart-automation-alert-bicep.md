---
title: Create a security automation for specific security alerts by using Bicep
description: Learn how to create a Microsoft Defender for Cloud automation to trigger a logic app, which will be triggered by specific Defender for Cloud alerts by using Bicep.
author: schaffererin
services: azure-resource-manager
ms.author: v-eschaffer
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm
ms.date: 03/21/2022
---
# Quickstart: Create an automatic response to a specific security alert using Bicep

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This quickstart describes how to use a Bicep to create a workflow automation that triggers a logic app when specific security alerts are received by Microsoft Defender for Cloud.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For a list of the roles and permissions required to work with Microsoft Defender for Cloud's workflow automation feature, see [workflow automation](workflow-automation.md).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/securitycenter-create-automation-for-alertnamecontains/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains/main.bicep":::

### Relevant resources

- [**Microsoft.Security/automations**](/azure/templates/microsoft.security/automations): The automation that will trigger the logic app, upon receiving a Microsoft Defender for Cloud alert that contains a specific string.
- [**Microsoft.Logic/workflows**](/azure/templates/microsoft.logic/workflows): An empty triggerable Logic App.

For other Defender for Cloud quickstart templates, see these [community contributed templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Security&pageNumber=1&sort=Popular).

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters automationName=<automation-name> logicAppName=<logic-name> logicAppResourceGroupName=<group-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -automationName "<automation-name>" -logicAppName "<logic-name>" -logicAppResourceGroupName "<group-name>"
    ```

    ---

    > [!NOTE]
    > **\<automation-username\>** has a minimum length of 3 characters and a maximum length of 24 characters. **\<logic-name\>** and **\<group-name\>** have a minimum length of 3 characters.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and all of its resources.

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

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
