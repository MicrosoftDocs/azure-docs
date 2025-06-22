---
title: Create your function app resources in Azure using Bicep
description: Create and deploy to Azure a simple HTTP triggered serverless function using Bicep.
author: ggailey777
ms.author: glenga
ms.date: 03/17/2025
ms.topic: quickstart
ms.service: azure-functions
zone_pivot_groups: programming-languages-set-functions
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create and deploy Azure Functions resources using Bicep

In this article, you use Bicep to create a function app in a Flex Consumption plan in Azure, along with its required Azure resources. The function app provides a serverless execution context for your function code executions. The app uses Microsoft Entra ID with managed identities to connect to other Azure resources.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

After you create the function app, you can deploy your Azure Functions project code to that app. A final code deployment step is outside the scope of this quickstart article.

## Prerequisites

### Azure account

Before you begin, you must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Review the Bicep file

The Bicep file used in this quickstart is from an [Azure Quickstart Template](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/function-app-flex-managed-identities/main.bicep":::

This deployment file creates these Azure resources needed by a function app that securely connects to Azure services:

[!INCLUDE [functions-azure-resources-list](../../includes/functions-azure-resources-list.md)]

[!INCLUDE [functions-deployment-considerations-infra](../../includes/functions-deployment-considerations-infra.md)]

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    ### [Azure CLI](#tab/azure-cli)
    ::: zone pivot="programming-language-csharp"  
    ```azurecli
    az group create --name exampleRG --location <SUPPORTED_REGION>
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters functionAppRuntime=dotnet-isolated functionAppRuntimeVersion=8.0
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-java"  
    ```azurecli
    az group create --name exampleRG --location <SUPPORTED_REGION>
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters functionAppRuntime=java functionAppRuntimeVersion=17
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-javascript,programming-language-typescript"  
    ```azurecli
    az group create --name exampleRG --location <SUPPORTED_REGION>
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters functionAppRuntime=node functionAppRuntimeVersion=20
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-python"  
    ```azurecli
    az group create --name exampleRG --location <SUPPORTED_REGION>
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters functionAppRuntime=python functionAppRuntimeVersion=3.11
    ```
    ::: zone-end 
    ::: zone pivot="programming-language-powershell"  
    ```azurecli
    az group create --name exampleRG --location <SUPPORTED_REGION>
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters functionAppRuntime=powerShell functionAppRuntimeVersion=7.4
    ```
    ::: zone-end 
    ### [Azure PowerShell](#tab/azure-powershell)

    ::: zone pivot="programming-language-csharp"  
    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location <SUPPORTED_REGION>
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -functionAppRuntime "dotnet-isolated" -functionAppRuntimeVersion "8.0"
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-java"  
    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location <SUPPORTED_REGION>
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -functionAppRuntime "java" -functionAppRuntimeVersion "17"
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-javascript,programming-language-typescript" 
    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location <SUPPORTED_REGION>
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -functionAppRuntime "node" -functionAppRuntimeVersion "20"
    ``` 
    ::: zone-end  
    ::: zone pivot="programming-language-python"  
    ```azurepowershell  
    New-AzResourceGroup -Name exampleRG -Location <SUPPORTED_REGION>
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -functionAppRuntime "python" -functionAppRuntimeVersion "3.11"
    ```  
    ::: zone-end 
    ::: zone pivot="programming-language-powershell" 
    ```azurepowershell  
    New-AzResourceGroup -Name exampleRG -Location <SUPPORTED_REGION>
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -functionAppRuntime "powershell" -functionAppRuntimeVersion "7.4"
    ``` 
    ::: zone-end 

    ---

    In this example, replace `<SUPPORTED_REGION>` with a region that [supports the Flex Consumption plan](./flex-consumption-how-to.md#view-currently-supported-regions). 

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use Azure CLI or Azure PowerShell to validate the deployment.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource list --resource-group exampleRG
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

[!INCLUDE [functions-welcome-page](../../includes/functions-welcome-page.md)]

## Clean up resources

[!INCLUDE [functions-cleanup-resources-infra](../../includes/functions-cleanup-resources-infra.md)]

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]

