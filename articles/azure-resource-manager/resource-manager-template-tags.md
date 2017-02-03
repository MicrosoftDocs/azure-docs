---
title: Tag Azure resources in template | Microsoft Docs
description: Shows how to apply tags to resources in an Azure Resource Manager template
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
ms.date: 01/31/2017
ms.author: tomfitz

---
# Tag resources in Azure Resource Manager templates
In an Azure Resource Manager template, you can apply tags to your Azure resources to logically organize them by categories. Each tag consists of a key and a value. For example, you can apply the key "Environment" and the value "Production" to all the resources in production. Without this tag, you may have difficulty after deployment identifying whether a resource is intended for development, test,or production. However, "Environment" and "Production" are just examples. You define the keys and values that make the most sense for organizing your subscription.

The following limitations apply to tags:

* Each resource can have a maximum of 15 tags. 
* The tag name is limited to 512 characters.
* The tag value is limited to 256 characters. 

To tag a resource during deployment, add the `tags` element to the resource you are deploying. Provide the tag name and value.

## Apply literal value to tag name
The following example shows a storage account with two tags that are set to literal values:

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

## Apply object to tag element
You can define an object parameter that stores several tags, and apply that object to the tag element. Each property in the object becomes a separate tag for the resource.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "tagvalues": {
      "type": "object",
      "defaultValue": {
        "Dept": "Finance",
        "Environment": "Production"
      }
    }
  },
  "variables": {
    "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageName')]",
      "location": "[resourceGroup().location]",
      "tags": "[parameters('tagvalues')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  ]
}
```

## Apply JSON string to tag name

To store many values in a single tag, apply a JSON string that represents the values. The entire JSON string is stored as one tag that cannot exceed 256 characters.   

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
        "CostCenter": "{\"Dept\":\"Finance\",\"Environment\":\"Production\"}"
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
* For more information about tags, see [Use tags to organize your Azure resources](resource-group-using-tags.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

