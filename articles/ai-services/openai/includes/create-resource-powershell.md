---
title: 'Create and manage Azure OpenAI Service deployments with the Azure PowerShell'
titleSuffix: Azure OpenAI
description: Learn how to use Azure PowerShell to create an Azure OpenAI resource and manage deployments with the Azure OpenAI Service.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 08/28/2023
keywords:
---

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- Access permissions to [create Azure OpenAI resources and to deploy models](../how-to/role-based-access-control.md).
- Azure PowerShell. For more information, see [How to install the Azure PowerShell](/powershell/azure/install-azure-powershell).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repository to contact Microsoft.

## Sign in to the Azure PowerShell

[Sign in](/powershell/azure/authenticate-azureps) to Azure PowerShell or select **Open Cloudshell** in the following steps.

## Create an Azure resource group

To create an Azure OpenAI resource, you need an Azure resource group. When you create a new resource through Azure PowerShell, you can also create a new resource group or instruct Azure to use an existing group. The following example shows how to create a new resource group named _OAIResourceGroup_ with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. The resource group is created in the East US location. 

```azurepowershell-interactive
New-AzResourceGroup -Name OAIResourceGroup -Location eastus
```

## Create a resource

Use the [New-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) command to create an Azure OpenAI resource in the resource group. In the following example, you create a resource named _MyOpenAIResource_ in the _OAIResourceGroup_ resource group. When you try the example, update the code to use your desired values for the resource group and resource name, along with your Azure subscription ID _\<subscriptionID>_.

```azurepowershell-interactive
New-AzCognitiveServicesAccount -ResourceGroupName OAIResourceGroup -Name MyOpenAIResource -Type OpenAI -SkuName S0 -Location eastus
```

## Retrieve information about the resource

After you create the resource, you can use different commands to find useful information about your Azure OpenAI Service instance. The following examples demonstrate how to retrieve the REST API endpoint base URL and the access keys for the new resource.

### Get the endpoint URL

Use the [Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount) command to retrieve the REST API endpoint base URL for the resource. In this example, we direct the command output through the [Select-Object](/powershell/module/microsoft.powershell.utility/select-object) cmdlet to locate the `endpoint` value.

When you try the example, update the code to use your values for the resource group `<myResourceGroupName>` and resource `<myResourceName>`.

```azurepowershell-interactive
Get-AzCognitiveServicesAccount -ResourceGroupName OAIResourceGroup -Name MyOpenAIResource |
  Select-Object -Property endpoint
```

### Get the primary API key

To retrieve the access keys for the resource, use the [Get-AzCognitiveServicesAccountKey](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountkey) command. In this example, we direct the command output through the [Select-Object](/powershell/module/microsoft.powershell.utility/select-object) cmdlet to locate the `Key1` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurepowershell-interactive
Get-AzCognitiveServicesAccountKey -Name MyOpenAIResource -ResourceGroupName OAIResourceGroup |
  Select-Object -Property Key1
```

## Deploy a model

To deploy a model, use the [New-AzCognitiveServicesAccountDeployment](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccountdeployment) command. In the following example, you deploy an instance of the `text-embedding-ada-002` model and give it the name _MyModel_. When you try the example, update the code to use your values for the resource group and resource. You don't need to change the `model-version`, `model-format` or `sku-capacity`, and `sku-name` values. 

```azurepowershell-interactive
$model = New-Object -TypeName 'Microsoft.Azure.Management.CognitiveServices.Models.DeploymentModel' -Property @{
    Name = 'text-embedding-ada-002'
    Version = '2'
    Format = 'OpenAI'
}

$properties = New-Object -TypeName 'Microsoft.Azure.Management.CognitiveServices.Models.DeploymentProperties' -Property @{
    Model = $model
}

$sku = New-Object -TypeName "Microsoft.Azure.Management.CognitiveServices.Models.Sku" -Property @{
    Name = 'Standard'
    Capacity = '1'
}

New-AzCognitiveServicesAccountDeployment -ResourceGroupName OAIResourceGroup -AccountName MyOpenAIResource -Name MyModel -Properties $properties -Sku $sku
```

> [!IMPORTANT]
> When you access the model via the API you will need to refer to the deployment name rather than the underlying model name in API calls. This is one of the [key differences](../how-to/switching-endpoints.md) between OpenAI and Azure OpenAI. OpenAI only requires the model name, Azure OpenAI always requires deployment name, even when using the model parameter. In our docs we often have examples where deployment names is represented as identical to model names to help indicate which model works with a particular API endpoint. Ultimately your deployment names can follow whatever naming convention is best for your use case.

## Delete a model from your resource

You can delete any model deployed from your resource with the [Remove-AzCognitiveServicesAccountDeployment](/powershell/module/az.cognitiveservices/remove-azcognitiveservicesaccountdeployment) command. In the following example, you delete a model named _MyModel_. When you try the example, update the code to use your values for the resource group, resource, and deployed model. 

```azurepowershell-interactive
Remove-AzCognitiveServicesAccountDeployment -ResourceGroupName OAIResourceGroup -AccountName MyOpenAIResource -Name MyModel
```

## Delete a resource

If you want to clean up after these exercises, you can remove your Azure OpenAI resource by deleting the resource through the Azure PowerShell. You can also delete the resource group. If you choose to delete the resource group, all resources contained in the group are also deleted.

To remove the resource group and its associated resources, use the [Remove-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/remove-azcognitiveservicesaccount) command.

If you're not going to continue to use the resources created in these exercises, run the following command to delete your resource group. Be sure to update the example code to use your values for the resource group and resource.

```azurepowershell-interactive
Remove-AzCognitiveServicesAccount -Name MyOpenAIResource -ResourceGroupName OAIResourceGroup
```
