---
title: Create an Azure AI services resource using Azure PowerShell
titleSuffix: Azure AI services
description: Get started with Azure AI services by using Azure PowerShell commands to create and subscribe to a resource.
services: cognitive-services
author: mgreenegit
manager: nitinme
ms.service: azure-ai-services
keywords: Azure AI services, cognitive intelligence, cognitive solutions, ai services
ms.topic: include
ms.date: 08/29/2022
ms.author: migreene
ms.custom: mode-api, devx-track-azurepowershell
ms.devlang: azurepowershell
---

Use this quickstart to create an Azure AI services resource using [Azure PowerShell](/powershell/azure/install-azure-powershell) commands. After you create the resource, use the keys and endpoint generated for you to authenticate your applications.

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

## Prerequisites

* A valid Azure subscription - [Create one](https://azure.microsoft.com/free/cognitive-services) for free.
* [Azure PowerShell](/powershell/azure/install-azure-powershell)
* [!INCLUDE [contributor-requirement](contributor-requirement.md)]
* [!INCLUDE [terms-azure-portal](terms-azure-portal.md)]

## Install Azure PowerShell and sign in

Install [Azure PowerShell](/powershell/azure/install-azure-powershell). To sign in, run the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command:

```azurepowershell
Connect-AzAccount
```

You can also use the green **Try It** button to run these commands in your browser.

## Create a new Azure AI services resource group

Before you create an Azure AI services resource, you must have an Azure resource group to contain the resource. When you create a new resource, you can either create a new resource group, or use an existing one. This article shows how to create a new resource group.

### Choose your resource group location

To create a resource, you'll need one of the Azure locations available for your subscription. You can retrieve a list of available locations with the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command. Most Azure AI services can be accessed from several locations. Choose the one closest to you, or see which locations are available for the service.

> [!IMPORTANT]
> * Remember your Azure location, as you will need it when calling the Azure AI services resources.
> * The availability of some Azure AI services can vary by region. For more information, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services).

```azurepowershell-interactive
Get-AzLocation | Select-Object -Property Location, DisplayName
```

After you have your Azure location, create a new resource group in Azure PowerShell using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. In the example below, replace the Azure location `westus2` with one of the Azure locations available for your subscription.

```azurepowershell-interactive
New-AzResourceGroup -Name ai-services-resource-group -Location westus2
```

## Create an Azure AI services resource

### Choose a service and pricing tier

When you create a new resource, you'll need to know the kind of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when you create the resource.

[!INCLUDE [SKUs and pricing](sku-pricing.md)]

You can find a list of available Azure AI services "kinds" with the [Get-AzCognitiveServicesAccountType](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccounttype) command:

```azurepowershell-interactive
Get-AzCognitiveServicesAccountType
```

### Add a new resource to your resource group

To create and subscribe to a new Azure AI services resource, use the [New-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) command. This command adds a new billable resource to the resource group you created earlier. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location:

You can create a Standard S0 multi-service resource named `multi-service-resource` with the command below.

```azurepowershell-interactive
New-AzCognitiveServicesAccount -ResourceGroupName ai-services-resource-group -Name multi-service-resource -Type CognitiveServices -SkuName F0 -Location westus2
```

> [!Tip]
> If your subscription doesn't allow you to create an Azure AI services resource, you may need to enable the privilege of that [Azure resource provider](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) using the [Azure portal](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), an [Azure PowerShell command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or an [Azure CLI command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli). If you are not the subscription owner, ask the *Subscription Owner* or someone with a role of *admin* to complete the registration for you or ask for the **/register/action** privileges to be granted to your account.

## Get the keys for your resource

Use the [Get-AzCognitiveServicesAccountKey](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountkey) command to get the keys for your resource.

```azurepowershell-interactive
Get-AzCognitiveServicesAccountKey -Name multi-service-resource -ResourceGroupName ai-services-resource-group
```

[!INCLUDE [environment-variables](environment-variables.md)]

## Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* The cost for a predefined number of transactions. Going above this amount will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

## Get current quota usage for your resource

Use the [Get-AzCognitiveServicesAccountUsage](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountusage) command to get the usage for your resource.

```azurepowershell-interactive
Get-AzCognitiveServicesAccountUsage -ResourceGroupName ai-services-resource-group -Name multi-service-resource
```

## Clean up resources

If you want to clean up and remove an Azure AI services resource, you can delete it or the resource group. Deleting the resource group also deletes any other resources contained in the group.

To remove the resource group and its associated resources, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command.

```azurepowershell-interactive
Remove-AzResourceGroup -Name ai-services-resource-group
```

If you need to recover a deleted resource, see [Recover or purge deleted Azure AI services resources](../../recover-purge-resources.md).
