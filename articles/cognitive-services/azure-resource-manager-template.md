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

You can find the template in [Azure quickstart ARM templates](https://azure.microsoft.com/resources/templates/101-cognitive-services-universalkey/).

:::code language="json" source="~/quickstart-templates/101-cognitive-services-universalkey/azuredeploy.json":::

One Azure resource is defined in the template:
* [Microsoft.CognitiveServices/accounts](https://docs.microsoft.com/azure/templates/microsoft.cognitiveservices/accounts): creates a Cognitive Services resource.

### Deploy the template

# [Azure Portal](#tab/portal)

1. Click the **Deploy to Azure** button.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cognitive-services-universalkey%2Fazuredeploy.json)

2. Enter the following values.

|Value  |Description  |
|---------|---------|
| **Subscription** | Select an Azure subscription. |
| **Resource group** | Select **Create new**, enter a unique name for the resource group, and then click **OK**. |
| **Region** | Select a region.  For example, **East US** |
| **Cognitive Service Name** | Replace with a unique name for your resource. You will need the name in the next section when you validate the deployment. |
| **Sku** | The pricing tier for your resource. |

3. Select **Review + Create**, then **Create**. After the resource has been finished deploying successfully, the **Go to resource** button will become highlighted.


# [Azure CLI](#tab/CLI)

> [!NOTE]
> `az deployment group` create requires Azure CLI version 2.6 or later. To display the version type `az --version`. For more information, see the [documentation](https://docs.microsoft.com/cli/azure/deployment/group).

```azurecli-interactive
read -p "Enter a name for your new resource group:" resourceGroupName &&
read -p "Enter the location (i.e. centralus):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cognitive-services-universalkey/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cognitive-services-universalkey/azuredeploy.json"

$resourceGroupName = "${projectName}ResourceGroup"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```

---


## Validate the deployment

# [Portal](#tab/portal)

When your deployment finishes, you will be able to click the **Go to resource** button to see your new resource. You can also find the resource group by:

1. Selecting **Resource groups** from the left navigation menu.
2. Selecting the resource group name.

# [Azure CLI](#tab/CLI)

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

# [Azure Portal](#tab/portal)

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group containing the resource to be deleted
3. Right-click on the resource group listing. Select **Delete resource group**, and confirm.

# [Azure CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group name, for deletion:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name, for deletion" 
(Remove-AzResourceGroup -Name $resourceGroupName).Name 
Write-Host "Press [ENTER] to continue..." 

```

---

## See also

* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](Welcome.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
