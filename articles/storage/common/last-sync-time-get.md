---
title: Check the Last Sync Time property for a storage account 
titleSuffix: Azure Storage
description: Learn how to check the Last Sync Time property for a geo-replicated storage account. The Last Sync Time property indicates the last time at which all writes from the primary region were successfully written to the secondary region.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: how-to
ms.date: 07/20/2023
ms.author: shaas
ms.reviewer: artek
ms.subservice: storage-common-concepts
---

# Check the Last Sync Time property for a storage account

When you configure a storage account, you can specify that your data is copied to a secondary region that is hundreds of miles from the primary region. Geo-replication offers durability for your data in the event of a significant outage in the primary region, such as a natural disaster. If you additionally enable read access to the secondary region, your data remains available for read operations if the primary region becomes unavailable. You can design your application to switch seamlessly to reading from the secondary region if the primary region is unresponsive.

Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) both replicate your data asynchronously to a secondary region. For read access to the secondary region, enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). For more information about the various options for redundancy offered by Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

This article describes how to check the **Last Sync Time** property for your storage account so that you can evaluate any discrepancy between the primary and secondary regions.

## About the Last Sync Time property

Because geo-replication is asynchronous, it is possible that data written to the primary region has not yet been written to the secondary region at the time an outage occurs. The **Last Sync Time** property indicates the most recent time that data from the primary region is guaranteed to have been written to the secondary region. For accounts that have a hierarchical namespace, the same **Last Sync Time** property also applies to the metadata managed by the hierarchical namespace, including ACLs. All data and metadata written prior to the last sync time  is available on the secondary, while data and metadata written after the last sync time may not have been written to the secondary, and may be lost. Use this property in the event of an outage to estimate the amount of data loss you may incur by initiating an account failover.

The **Last Sync Time** property is a GMT date/time value.

## Get the Last Sync Time property

You can use PowerShell or Azure CLI to retrieve the value of the **Last Sync Time** property.

# [PowerShell](#tab/azure-powershell)

To get the last sync time for the storage account with PowerShell, install version 1.11.0 or later of the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module. Then check the storage account's **GeoReplicationStats.LastSyncTime** property. Remember to replace the placeholder values with your own values:

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
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
