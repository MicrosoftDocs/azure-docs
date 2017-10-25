---
title: Managing Storage in the Azure independent clouds Using Azure PowerShell | Microsoft Docs
description: Managing Storage in the China Cloud, Government Cloud, and Germany Cloud Using Azure PowerShell
services: storage
documentationcenter: na
author: robinsh
manager: timlt

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2017
ms.author: robinsh
---

# Managing Storage in the Azure independent clouds using PowerShell

Most people use Azure Public Cloud for their global Azure deployment. There are also some independent deployments of Microsoft Azure for reasons of sovereignty and so on. These independent deployments are referred to as "environments." The following list details the available environments:

* [Azure Government Cloud](https://azure.microsoft.com/features/gov/)
* [Azure China Cloud operated by 21Vianet in China](http://www.windowsazure.cn/)
* [Azure Germany Cloud](../../germany/germany-welcome.md)

## Using an independent cloud 

To use Azure Storage with one of the independent clouds available in Azure, you need to connect to that cloud instead of Azure Public. 

The differences using one of these clouds versus Azure Public are as follows: 

* You must specify the *environment* to which to connect.
* You must determine the available regions.
* You need the endpoint suffix, which is different from Azure Public.

The examples require Azure PowerShell module version 4.4.0 or later. In a PowerShell window, run `Get-Module -ListAvailable AzureRM` to find the version. If nothing is listed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

## Log in to Azure

Run the [Get-AzureEnvironment](/powershell/module/azure/Get-AzureRmEnvironment) cmdlet to see the available Azure environments:
   
```powershell
Get-AzureRmEnvironment
```

Sign in to your account that has access to the cloud to which you want to connect and set the environment. This example shows how to use the Azure Government Cloud.   

```powershell
Login-AzureRmAccount –Environment AzureUSGovernment
```

To access the China Cloud, use **AzureChinaCloud**. To access the German Cloud, use **AzureGermanCloud**.

## Endpoint suffix

The endpoint suffix for each of these environments is different from the Azure Public endpoint. For example, the blob endpoint suffix for Azure Public is **blob.core.windows.net**. For the Government Cloud, the blob endpoint suffix is **blob.core.usgovcloudapi.net**. 

### Get endpoint using Get-AzureRMEnvironment 

Retrieve the endpoint suffix using [Get-AzureRMEnvironment](/powershell/module/azurerm.profile/get-azurermenvironment). The endpoint is the *StorageEndpointSuffix* property of the environment. The following code snippets show how to do this. All of these commands return something like "core.cloudapp.net" or "core.cloudapi.de", etc. Append this to the storage service to access that service. For example, "queue.core.cloudapi.de" will access the queue service in Germany Cloud.

This code snippet retrieves all of the environments and the endpoint suffix for each one.

```powershell
Get-AzureRmEnvironment | select Name, StorageEndpointSuffix 
```

This code snippet retrieves all of the properties for the specified environment -- in this instance, Germany Cloud. This will return a list of properties; look for **StorageEndpointSuffix** in the list.

```powershell
Get-AzureRmEnvironment -Name AzureGermanCloud 
```

To retrieve just the storage endpoint suffix property, retrieve the specific cloud and ask for just that one property.

```powershell
$environment = Get-AzureRmEnvironment -Name AzureGermanCloud
Write-Host "Storage EndPoint Suffix = " $environment.StorageEndpointSuffix 
```

### Get endpoint from a storage account

You can also examine the properties of a storage account to retrieve the endpoints. This can be helpful if you are already using a storage account in your PowerShell script; you can just retrieve the endpoint you need. 

```powershell
# Get a reference to the storage account.
$resourceGroup = "myexistingresourcegroup"
$storageAccountName = "myexistingstorageaccount"
$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName 
  # Output the endpoints.
Write-Host "blob endpoint = " $storageAccount.PrimaryEndPoints.Blob 
Write-Host "files endpoint = " $storageAccount.PrimaryEndPoints.File
Write-Host "queue endpoint = " $storageAccount.PrimaryEndPoints.Queue
Write-Host "table endpoint = " $storageAccount.PrimaryEndPoints.Table
```

For a storage account in the Government Cloud, this returns the following: 

```
blob endpoint = http://myexistingstorageaccount.blob.core.usgovcloudapi.net/
files endpoint = http://myexistingstorageaccount.files.core.usgovcloudapi.net/
queue endpoint = http://myexistingstorageaccount.queue.core.usgovcloudapi.net/
table endpoint = http://myexistingstorageaccount.table.core.usgovcloudapi.net/
```

## After setting the environment

From here going forward, you can use the same PowerShell used to manage your storage accounts and access the data plane as described in the article [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md).

## Clean up resources

If you created a new resource group and a storage account, you can remove all of the assets by removing the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account created and the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

* [Persisting user logins across PowerShell sessions](/powershell/azure/context-persistence)
* [Azure Government storage](../../azure-government/documentation-government-services-storage.md)
s* [Microsoft Azure Government Developer Guide](../../azure-government/documentation-government-developer-guide.md)
* [Developer Notes for Azure China Applications](https://msdn.microsoft.com/library/azure/dn578439.aspx)
* [Azure Germany Documentation](../../germany/germany-welcome.md)