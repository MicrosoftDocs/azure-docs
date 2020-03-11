---
title: Delete data from Azure Data Explorer (Kusto)
description: This article describes bulk delete scenarios in Azure Data Explore, including purge and retention based deletes.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Delete data from Azure Data Explorer (Kusto)

Azure Data Explorer supports three main delete approaches described in this article.

## Expiration using retention policy    
Azure Data Explorer automatically deletes data based on the [retention policy](https://docs.microsoft.com/azure/kusto/concepts/retentionpolicy) that can be defined on the database level and/or the table level. This is the most efficient and hassle-free method of deleting data.      

## Dropping extents
[Extent (data shard)](https://docs.microsoft.com/en-us/azure/kusto/management/extents-overview) is the internal structure where data is stored. Each extent can hold from one to millions of records. Extents can be deleted individually or as a group using [drop extent/s commands](https://docs.microsoft.com/en-us/azure/kusto/management/extents-commands#drop-extents) 

Here is an example for deleting all rows in a table:

```Kusto
.drop extents from TestTable
```

Here is an example of deleting a specific extent:
```Kusto
.drop extent e9fac0d2-b6d5-4ce3-bdb4-dea052d13b42
```

## Delete individual rows using purge
[Data purge](https://docs.microsoft.com/en-us/azure/kusto/concepts/data-purge) allows for deleting individuals rows and is designed to allow compliance with GDPR requirements. Please note that the deletion is *not* immediate and requires significant system resources, thus it is only advised to be used for compliance scenarios.    

