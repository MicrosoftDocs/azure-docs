---
title: Check the Last Sync Time property for a storage account 
titleSuffix: Azure Storage
description: Learn how to check the **Last Sync Time** property for a geo-replicated storage account. The **Last Sync Time** property indicates the last time at which all writes from the primary region were successfully written to the secondary region.   
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/16/2019
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Check the Last Sync Time property for a storage account

When you configure a storage account, you can specify that your data is copied to a secondary region that is hundreds of miles from the primary region. Geo-replication offers durability for your data in the event of a significant outage in the primary region, such as a natural disaster. If you additionally enable read access to the secondary region, your data remains available for read operations if the primary region becomes unavailable. You can design your application to switch seamlessly to reading from the secondary region if the primary region is unresponsive.

Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) (preview) both replicate your data asynchronously to a secondary region. For read access to the secondary region, enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). For more information about the various options for redundancy offered by Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

This article describes how to check the **Last Sync Time** property for your storage account so that you can evaluate any discrepancy between the primary and secondary regions.

## About the Last Sync Time property

Because geo-replication is asynchronous, it is possible that data written to the primary region has not yet been written to the secondary region at the time an outage occurs. The **Last Sync Time** property indicates the last time that data from the primary region was written successfully to the secondary region. All writes made to the primary region before the last sync time are available to be read from the secondary location. Writes made to the primary region after the last sync time property may or may not be available for reads yet.

The **Last Sync Time** property is a GMT date/time value.

## Get the Last Sync Time property

You can use PowerShell or Azure CLI to retrieve the value of the **Last Sync Time** property.

# [PowerShell](#tab/azure-powershell)

To get the last sync time for the storage account with PowerShell, install an Azure Storage preview module that supports getting geo-replication stats. For example:

```powershell
Install-Module Az.Storage –Repository PSGallery -RequiredVersion 1.1.1-preview –AllowPrerelease –AllowClobber –Force
```

Then check the storage account's **GeoReplicationStats.LastSyncTime** property. Remember to replace the placeholder values with your own values:

```powershell
$lastSyncTime = $(Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account> `
    -IncludeGeoReplicationStats).GeoReplicationStats.LastSyncTime
```

# [Azure CLI](#tab/azure-cli)

To get the last sync time for the storage account with Azure CLI, check the storage account's **geoReplicationStats.lastSyncTime** property. Use the `--expand` parameter to return values for the properties nested under **geoReplicationStats**. Remember to replace the placeholder values with your own values:

```azurecli-interactive
$lastSyncTime=$(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --expand geoReplicationStats \
    --query geoReplicationStats.lastSyncTime \
    --output tsv)
```

---

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Change the redundancy option for a storage account](redundancy-migration.md)
- [Designing highly available applications using read-access geo-redundant storage](storage-designing-ha-apps-with-ragrs.md)