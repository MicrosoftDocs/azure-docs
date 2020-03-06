---
title: Enable blob versioning (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable blob versioning

You can enable or disable blob versioning for the storage account at any time by using either the Azure portal or client tools such as PowerShell and Azure CLI. Disabling the feature does not delete existing blobs, snapshots, or versions.

PowerShell example
------------------

A private PowerShell module with support for versioning is shared here. To turn
on versioning:

| Update-AzStorageBlobServiceProperty -ResourceGroupName [resourceGroupName] -StorageAccountName [storageAccountName] -EnableVersioning \$true |
|----------------------------------------------------------------------------------------------------------------------------------------------|


ARM template example
--------------------

Use this template to [deploy a storage account from customer template](../../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template) with versioning property enabled.

-   In the Azure portal, choose **Create a resource**.

-   In **Search the Marketplace**, type **template deployment**, and then press     **ENTER**.

-   Choose **Template deployment**, choose **Create**, and then choose **Build     your own template in the editor**.

-   In the template editor, paste in the following json. Replace the     \<accountName\> placeholder with the name of your storage account.

-   Choose the **Save** button, specify the resource group of the account, and     then choose the **Purchase** button to deploy the template and enable the     change feed.

| {     "\$schema": "[https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json\#](https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json)",     "contentVersion": "1.0.0.0",     "parameters": {},     "variables": {},     "resources": [         {             "type": "Microsoft.Storage/storageAccounts/blobServices",             "apiVersion": "2019-10-19",             "name": "\<accountName\>/default",             "properties": {                 "IsVersioningEnabled": true             }         }     ] } |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
