---
title: Create your function app resources in Azure using Bicep
description: Create and deploy to Azure a simple HTTP triggered serverless function using Bicep.
author: ggailey777
ms.author: glenga
ms.date: 03/11/2025
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

You use this file to create these Azure resources:

+ [**microsoft.Insights/components**](/azure/templates/microsoft.insights/components): creates an Application Insights instance for monitoring your app.
+ [**Microsoft.OperationalInsights/workspaces**](/azure/templates/microsoft.operationalinsights/workspaces): creates a workspace required by Application Insights.
+ [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage account, which is required by Functions.
+ [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create a serverless Flex Consumption hosting plan for the function app.
+ [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create a function app.


Deployment considerations:

+ The storage account is used to store important app data, including the application code deployment package. This deployment creates a storage account that is accessed using Microsoft Entra ID authentication and managed identities. Identity access is granted on a least-permissions basis.
+ The Bicep file defaults to creating a C# app that uses .NET 8 in an isolated process. For other languages, use the `functionAppRuntime` and `functionAppRuntimeVersion` parameters to specify the specific language and version on which to run your app. Make sure to select your programming language at the [top](#top) of the article.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    ### [CLI](#tab/CLI)
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
    ### [PowerShell](#tab/PowerShell)

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

### [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

### [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

[!INCLUDE [functions-welcome-page](../../includes/functions-welcome-page.md)]

## Clean up resources

Now that you have deployed a function app and related resources to Azure, can continue to the next step of publishing project code to your app. Otherwise, use these commands to delete the resources, when you no longer need them. 

### [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

### [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

You can also remove resources by using the [Azure portal](https://portal.azure.com). 

## Next steps

You can now deploy a code project to the function app resources you created in Azure. 

You can create, verify, and deploy a code project to your new function app from these local environments:

### [Command prompt](#tab/core-tools)

1. [Create the local code project](./functions-run-local.md#create-your-local-project)
1. [Verify locally](./functions-run-local.md#run-a-local-function)
1. [Publish to Azure](./functions-run-local.md#publish-to-azure)

### [Visual Studio Code](#tab/vs-code)

1. [Create the local code project](./functions-develop-vs-code.md#create-an-azure-functions-project)
1. [Verify locally](./functions-develop-vs-code.md#run-functions-locally)
1. [Publish to Azure](./functions-develop-vs-code.md#deploy-project-files)
 
### [Visual Studio](#tab/vs)

1. [Create the local code project](./functions-develop-vs.md#create-an-azure-functions-project)
1. [Verify locally](./functions-develop-vs.md#run-functions-locally)
1. [Publish to Azure](./functions-develop-vs.md#publish-to-azure)

---

