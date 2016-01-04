<properties
   pageTitle="Resource Manager template for storage | Microsoft Azure"
   description="Shows the resource manager schema for storage accounts."
   services="azure-resource-manager,storage"
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
   ms.date="10/25/2015"
   ms.author="tomfitz"/>

# Storage account - template schema

Creates a storage account.

## Schema format

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
| name | string | Yes | Between 3 and 24 characters, only numbers and lower-case letters  | The name of the storage account to create. The name must be unique across all of Azure. Consider using the [uniqueString](resource-group-template-functions.md#uniquestring) function with your naming convention as shown in the example below. |
| location | string | Yes | To determine valid regions, see [supported regions](resource-manager-supported-services.md#supported-regions).  | The region to host the storage account. |
| properties | object | Yes | (shown below) | An object that specifies the type of storage account to create.

### properties object

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| accountType | string | Yes | **Standard_LRS**<br />**Standard_ZRS**<br />**Standard_GRS**<br />**Standard_RAGRS**<br />**Premium_LRS** | The type of storage account. The permitted values correspond to Standard Locally Redundant, Standard Zone Redundant, Standard Geo-Redundant, Standard Read-Access Geo-Redundant, and Premium Locally Redundant. For information about these account types, see [Azure Storage replication](./storage/storage-redundancy.md ). |

	
## Examples

The following example deploys a Standard Locally Redundant storage account with a unique name based on the resource group id.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.Storage/storageAccounts",
                "apiVersion": "2015-06-15",
                "name": "[concat('storage', uniqueString(resourceGroup().id))]",
		         "location": "[resourceGroup().location]",
        	     "properties": 
        	     {
        		      "accountType": "Standard_LRS"
        	     }
	        }
	    ],
	    "outputs": {}
    }

## Next steps

- For general information about storage, see [Introduction to Microsoft Azure Storage](./storage/storage-introduction.md).
- For example templates that use a new storage account with a Virtual Machine, see [Deploy a simple Linux VM](https://azure.microsoft.com/documentation/templates/101-simple-linux-vm/) or [Deploy a simple Windows VM](https://azure.microsoft.com/documentation/templates/101-simple-windows-vm/).
