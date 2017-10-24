---
title: Managing Storage in the Azure independent cllouds Using Azure PowerShell | Microsoft Docs
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
ms.date: 10/19/2017
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

The endpoint suffix for each of these environments is different from the Azure Public endpoint. For example, the blob endpoint suffix for Azure Public is **blob.core.windows.net**. For the Government Cloud, the blob endpoint suffix will be **blob.core.usgovcloudapi.net**. To find the endpoint, you need a reference to a storage account. Then you can examine its properties to retrieve the endpoints. 

### Create a storage account 

If you don't already have a storage account in your subscription, you can create a new one. This example uses the Government Cloud.

```powershell
# Get list of locations and select one.
Get-AzureRmLocation | select Location 
$location = "usgovvirginia"

# Create a new resource group.
$resourceGroup = "teststoragerg"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 

# Set the name of the storage account and the SKU name. 
$storageAccountName = "testpshstorage"
$skuName = "Standard_LRS"
    
# Create the storage account.
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName $skuName
```

### Get a reference to a storage account 

If you already have a storage account in your subscription, you can get a reference to it. 

```powershell
$resourceGroup = "myexistingresourcegroup"
$storageAccountName = "myexistingstorageaccount"

$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName 
```

### Retrieve the endpoint information

Now that you have a reference to a storage account, you can examine it to find the endpoint suffix.

```powershell
Write-Host "blob endpoint = " $storageAccount.PrimaryEndPoints.Blob 
```

This shows the blob endpoint is **blob.core.usgovcloudapi.net**, so the suffix for accessing the storage account is **.core.usgovcloudsapi.net**.

## After setting the environment

From here forward, you can use the same PowerShell used to manage your storage accounts and access the data plane as described in the article [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md).

## Clean up resources

If you created a new resource group and a storage account, you can remove all of the assets by removing the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account created and the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

* [Persisting user logins across PowerShell sessions](/powershell/azure/context-persistence)
* [Azure Government storage](../../azure-government/documentation-government-services-storage.md)
* [Connect to Azure Government Cloud with PowerShell](../../azure-government/documentation-government-get-started-connect-with-ps.md)
* [Microsoft Azure Government Developer Guide](../../azure-government/documentation-government-developer-guide.md)
* [Developer Notes for Azure China Applications](https://msdn.microsoft.com/library/azure/dn578439.aspx)
* [Azure Germany Documentation](../../germany/germany-welcome.md)
