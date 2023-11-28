---
title: Use PowerShell to manage data in Azure independent clouds
titleSuffix: Azure Storage
description: Managing Storage in the China Cloud, Government Cloud, and German Cloud Using Azure PowerShell.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: how-to
ms.date: 12/04/2019
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-azurepowershell
---

# Managing Storage in the Azure independent clouds using PowerShell

Most people use Azure Public Cloud for their global Azure deployment. There are also some independent deployments of Microsoft Azure for reasons of sovereignty and so on. These independent deployments are referred to as "environments." The following list details the independent clouds currently available.

- [Azure Government Cloud](https://azure.microsoft.com/features/gov/)
- [Azure German Cloud](../../germany/germany-welcome.md)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Using an independent cloud

To use Azure Storage in one of the independent clouds, you connect to that cloud instead of Azure Public. To use one of the independent clouds rather than Azure Public:

- You specify the *environment* to which to connect.
- You determine and use the available regions.
- You use the correct endpoint suffix, which is different from Azure Public.

The examples require Azure PowerShell module Az version 0.7 or later. In a PowerShell window, run `Get-Module -ListAvailable Az` to find the version. If nothing is listed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

## Log in to Azure

Run the [Get-AzEnvironment](/powershell/module/az.accounts/get-azenvironment) cmdlet to see the available Azure environments:

```powershell
Get-AzEnvironment
```

Sign in to your account that has access to the cloud to which you want to connect and set the environment. This example shows how to sign into an account that uses the Azure Government Cloud.

```powershell
Connect-AzAccount –Environment AzureUSGovernment
```

To access the China Cloud, use the environment **AzureChinaCloud**. To access the German Cloud, use **AzureGermanCloud**.

At this point, if you need the list of locations to create a storage account or another resource, you can query the locations available for the selected cloud using [Get-AzLocation](/powershell/module/az.resources/get-azlocation).

```powershell
Get-AzLocation | select Location, DisplayName
```

The following table shows the locations returned for the German cloud.

|Location | Display Name |
|----|----|
| `germanycentral` | Germany Central|
| `germanynortheast` | Germany Northeast |

## Endpoint suffix

The endpoint suffix for each of these environments is different from the Azure Public endpoint. For example, the blob endpoint suffix for Azure Public is **blob.core.windows.net**. For the Government Cloud, the blob endpoint suffix is **blob.core.usgovcloudapi.net**.

### Get endpoint using Get-AzEnvironment

Retrieve the endpoint suffix using [Get-AzEnvironment](/powershell/module/az.accounts/get-azenvironment). The endpoint is the *StorageEndpointSuffix* property of the environment.

The following code snippets show how to retrieve the endpoint suffix. All of these commands return something like "core.cloudapp.net" or "core.cloudapi.de", etc. Append the suffix to the storage service to access that service. For example, "queue.core.cloudapi.de" will access the queue service in German Cloud.

This code snippet retrieves all of the environments and the endpoint suffix for each one.

```powershell
Get-AzEnvironment | select Name, StorageEndpointSuffix 
```

This command returns the following results.

| Name| StorageEndpointSuffix|
|----|----|
| AzureChinaCloud | core.chinacloudapi.cn|
| AzureCloud | core.windows.net |
| AzureGermanCloud | core.cloudapi.de|
| AzureUSGovernment | core.usgovcloudapi.net |

To retrieve all of the properties for the specified environment, call **Get-AzEnvironment** and specify the cloud name. This code snippet returns a list of properties; look for **StorageEndpointSuffix** in the list. The following example is for the German Cloud.

```powershell
Get-AzEnvironment -Name AzureGermanCloud
```

The results are similar to the following values:

|Property Name|Value|
|----|----|
| Name | `AzureGermanCloud` |
| EnableAdfsAuthentication | `False` |
| ActiveDirectoryServiceEndpointResourceI | `http://management.core.cloudapi.de/` |
| GalleryURL | `https://gallery.cloudapi.de/` |
| ManagementPortalUrl | `https://portal.microsoftazure.de/` |
| ServiceManagementUrl | `https://manage.core.cloudapi.de/` |
| PublishSettingsFileUrl| `https://manage.microsoftazure.de/publishsettings/index` |
| ResourceManagerUrl | `http://management.microsoftazure.de/` |
| SqlDatabaseDnsSuffix | `.database.cloudapi.de` |
| **StorageEndpointSuffix** | `core.cloudapi.de` |
| ... | ... |

To retrieve just the storage endpoint suffix property, retrieve the specific cloud and ask for just that one property.

```powershell
$environment = Get-AzEnvironment -Name AzureGermanCloud
Write-Host "Storage EndPoint Suffix = " $environment.StorageEndpointSuffix
```

This command returns the following information:

`Storage Endpoint Suffix = core.cloudapi.de`

### Get endpoint from a storage account

You can also examine the properties of a storage account to retrieve the endpoints:

```powershell
# Get a reference to the storage account.
$resourceGroup = "myexistingresourcegroup"
$storageAccountName = "myexistingstorageaccount"
$storageAccount = Get-AzStorageAccount `
  -ResourceGroupName $resourceGroup `
  -Name $storageAccountName 
  # Output the endpoints.
Write-Host "blob endpoint = " $storageAccount.PrimaryEndPoints.Blob 
Write-Host "file endpoint = " $storageAccount.PrimaryEndPoints.File
Write-Host "queue endpoint = " $storageAccount.PrimaryEndPoints.Queue
Write-Host "table endpoint = " $storageAccount.PrimaryEndPoints.Table
```

For a storage account in the Government Cloud, this command returns the following output:

```
blob endpoint = http://myexistingstorageaccount.blob.core.usgovcloudapi.net/
file endpoint = http://myexistingstorageaccount.file.core.usgovcloudapi.net/
queue endpoint = http://myexistingstorageaccount.queue.core.usgovcloudapi.net/
table endpoint = http://myexistingstorageaccount.table.core.usgovcloudapi.net/
```

## After setting the environment

You can now use PowerShell to manage your storage accounts and access blob, queue, file, and table data. For more information, see [Az.Storage](/powershell/module/az.storage).

## Clean up resources

If you created a new resource group and a storage account for this exercise, you can remove both assets by deleting the resource group. Deleting the resource group deletes all resources contained within the group.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Next steps

- [Persisting user logins across PowerShell sessions](/powershell/azure/context-persistence)
- [Azure Government storage](../../azure-government/compare-azure-government-global-azure.md)
- [Microsoft Azure Government Developer Guide](../../azure-government/documentation-government-developer-guide.md)
- [Application Developer Notes for Azure operated by 21Vianet](https://msdn.microsoft.com/library/azure/dn578439.aspx)
- [Azure Germany Documentation](../../germany/germany-welcome.md)
