---
title: Azure resource location in template | Microsoft Docs
description: Shows how to set a location for a resource in an Azure Resource Manager template
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: tomfitz

---
# Set resource location in Azure Resource Manager templates
When deploying a resource, you must provide a location for the resource. Each resource provider supports a set of locations; however, your subscription may not have access to all those locations. This topic shows how to determine the locations that are available to your subscription.

## Determine supported locations

For a complete list of supported locations for each resource type, see [Products available by region](https://azure.microsoft.com/regions/services/). Keep in mind this list might show locations that are not available to your subscription.

To see a customized list of locations that is available to your subscription, use Azure PowerShell or Azure CLI. The following example shows how to use PowerShell to get the locations for a particular resource type (in this case `Microsoft.Web\sites`):

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
```

The following example uses Azure CLI 2.0 (Preview) to get the locations for a particular resource type (in this case `Microsoft.Web\sites`):

```azurecli
az provider show -n Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```

## Set location in template

After determining the supported locations for your resources, you need to set that location in your template. The easiest way to set this value is by creating a resource group in a location that supports the resource types, and then setting each location to `[resourceGroup().location]`. If you deploy the template to a resource group in a different location, you do not need to change any values in the template or in the parameters. 

The following example shows a storage account that is deployed to the same location as the resource group:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"variables": {
      "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
	"resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production"
      },
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": { }
    }
	]
}
```

If you need to hardcode the location in your template, provide the name of one of the supported regions. The following example shows a storage account that is always deployed to North Central US:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[concat('storageloc', uniqueString(resourceGroup().id))]",
      "location": "North Central US",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production"
      },
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": { }
    }
	]
}
```

## Next Steps
* For recommendations about how to create templates, see [Best practices for creating Azure Resource Manager templates](resource-manager-template-best-practices.md).

