---
title: Quickstart - Create an Azure Analysis Services server resource by using Bicep
description: Quickstart showing how to an Azure Analysis Services server resource by using a Bicep file.
ms.date: 03/08/2022
ms.topic: quickstart
ms.service: analysis-services
ms.author: jgao
author: mumian
tags: azure-resource-manager, bicep
ms.custom: devx-track-bicep
#Customer intent: As a BI developer who is new to Azure, I want to use Azure Analysis Services to store and manage my organizations data models.
---

# Quickstart: Create a server - Bicep

This quickstart describes how to create an Analysis Services server resource in your Azure subscription by using [Bicep](../azure-resource-manager/bicep/overview.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

* **Azure subscription**: Visit [Azure Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) to create an account.
* **Microsoft Entra ID**: Your subscription must be associated with a Microsoft Entra tenant. And, you need to be signed in to Azure with an account in that Microsoft Entra ID. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure quickstart templates](https://azure.microsoft.com/resources/templates/analysis-services-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.analysisservices/analysis-services-create/main.bicep":::

A single [Microsoft.AnalysisServices/servers](/azure/templates/microsoft.analysisservices/servers) resource with a firewall rule is defined in the Bicep file.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serverName=<analysis-service-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serverName "<analysis-service-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<analysis-service-name\>** with a unique analysis service name.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal or Azure PowerShell to verify the resource group and server resource was created.

```azurepowershell-interactive
Get-AzAnalysisServicesServer -Name <analysis-service-name>
```

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and the server resource.

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

In this quickstart, you used a Bicep file to create a new resource group and an Azure Analysis Services server resource. After you've created a server resource by using the template, consider the following:

> [!div class="nextstepaction"]
> [Quickstart: Configure server firewall - Portal](analysis-services-qs-firewall.md)
