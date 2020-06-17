---
title: "Quickstart: Create an Azure Cognitive Services using ARM templates | Microsoft Docs"
description: Get started with using an Azure Resource Manager template to deploy a Cognitive Services resource.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 06/15/2020
ms.author: aahi
ms.custom: subject-armqs
---

# Create a Cognitive Services resource Using an Azure Resource Manager template

Use this article to create and deploy a Cognitive Services resource, using an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview). An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. If you want to learn more about developing Resource Manager templates, see [Resource Manager documentation](https://docs.microsoft.com/azure/azure-resource-manager/) and the [template reference](https://docs.microsoft.com/azure/templates).

## Prerequisites 

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)

## Create a Cognitive Services resource.

### Review the template

You can find the template in [Azure quickstart ARM templates](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cognitive-services-universalkey/).

:::code language="json" source="~/quickstart-templates/101-cognitive-services-universalkey/azuredeploy.json":::

One Azure resource is defined in the template:
* [Microsoft.CognitiveServices/accounts](https://docs.microsoft.com/azure/templates/microsoft.cognitiveservices/accounts): creates a Cognitive Services resource.

### Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a Cognitive Services resource.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cognitive-services-universalkey%2Fazuredeploy.json)

2. Select or enter the following values.

* **Subscription**: select an Azure subscription.
* **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
* **Region**: select a region.  For example, **East US**.
* **Cognitive Service Name**: enter a name for your resource, which must be unique. You will need the name in the next section when you validate the deployment.
* **Sku**: The pricing tier for your resource. 
* **I agree to the terms and conditions stated above**: Select.

3. Select **Create**. After the resource has been deployed successfully, you will get a notification.

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use Azure PowerShell, REST API, or the Azure CLI. See [Deploy templates](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-powershell) for more information.

## Validate the deployment

You can either use the Azure portal to check your Cognitive Services resource, or use the following Azure CLI and PowerShell scripts.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group where the Cognitive Services resource exists:" &&
read resourceGroupName &&
az cognitiveservices account list -g $resourceGroupName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name where your Cognitive Services resource exists" 
(Get-AzResource -ResourceType "Microsoft.CognitiveServices/accounts" -ResourceGroupName $resourceGroupName).Name 
Write-Host "Press [ENTER] to continue..." 
```

---


## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group containing the resource to be deleted
3. Right-click on the resource group listing. Select **Delete resource group**, and confirm.

## See also

* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](Welcome.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
