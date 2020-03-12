---
title: Delete data from Azure Data Explorer
description: This article describes delete scenarios in Azure Data Explorer, including purge, dropping extents and retention based deletes.
author: orspod
ms.author: orspodek
ms.reviewer: avneraa
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/12/2020
---

# Delete data from Azure Data Explorer

Azure Data Explorer supports various delete scenarios described in this article. 

## Delete using retention policy

Azure Data Explorer automatically deletes data based on the [retention policy](/azure/kusto/management/retentionpolicy). This is the most efficient and hassle-free method of deleting data. Set the retention policy at the database or table level.

Consider a database or table that is set for 90 days of retention. If only 60 days of data are needed, delete the older data as follows:

    ```Kusto
    .alter-merge database <DatabaseName> policy retention softdelete = 60d

    .alter-merge table <TableName> policy retention softdelete = 60d
    ```

## Delete data by dropping extents

[Extent (data shard)](/azure/kusto/management/extents-overview) is the internal structure where data is stored. Each extent can hold up to millions of records. Extents can be deleted individually or as a group using [drop extent(s) commands](/azure/kusto/management/extents-commands#drop-extents). 

### Examples

You can delete all rows in a table or just a specific extent.

* Delete all rows in a table:

    ```Kusto
    .drop extents from TestTable
    ```

* Delete a specific extent:

    ```Kusto
    .drop extent e9fac0d2-b6d5-4ce3-bdb4-dea052d13b42
    ```

## Delete individual rows using purge

> [!NOTE]
> Purge allows you to delete personal data from the device or service and can be used to support your obligations under the GDPR. If you're looking for general information about GDPR, see the [GDPR section of the Service Trust portal](https://servicetrust.microsoft.com/ViewPage/GDPRGetStarted).

[Data purge](/azure/kusto/management/data-purge) can be used for deleting individuals rows. Deletion is *not* immediate and requires significant system resources. Therefore, it is only advised for compliance scenarios.  

