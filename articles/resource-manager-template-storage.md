<properties
   pageTitle="Resource Manager template for storage | Microsoft Azure"
   description="Shows the resource manager schema for storage accounts."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/23/2015"
   ms.author="tomfitz"/>

# Storage - template schema

Creates a storage account.

## Schema

To create a storage account, add the following schema to the resources section of your template.

    {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2015-06-15",
        "name": string,
        "location": string,
        "properties": 
        {
        	"accountType": string
        }
    }

## Values

The following tables describe the values you need to set in the schema.

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| type | enum | Yes | **Microsoft.Storage/storageAccounts** | The resource type to create. |
| apiVersion | enum | Yes | **2015-06-15** <br /> **2015-05-01-preview** | The API version to use for creating the resource. | 
| name | string | Yes | Between 3 and 24 characters, only numbers and lower-case letters  | The name of the storage account to create. The name must be unique across all of Azure. Consider using the uniqueString function with your naming convention. |
| properties | object | Yes |  | An object that specifies the type of storage account to create.


| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| accountType | string | Yes | **Standard_LRS**<br />**Standard_ZRS**<br />**Standard_GRS**<br />**Standard_RAGRS**<br />**Premium_LRS** | The type of storage account. |


	
	
## Examples

The following example deploys a storage account with a unique name based on the resource group id.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.Storage/storageAccounts",
                "apiVersion": "2015-06-15",
                "name": "[concat('ExampleStorage', uniqueString(resourceGroup().id))]",
		         "location": "[resourceGroup().location]",
        	     "properties": 
        	     {
        		      "accountType": "Standard_LRS"
        	     }
	        }
	    ],
	    "outputs": {}
    }
