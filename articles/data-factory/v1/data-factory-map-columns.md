---
title: Mapping dataset columns in Azure Data Factory | Microsoft Docs
description: 'Learn how to map source columns to destination columns.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg


ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 01/10/2018
ms.author: jingwang

robots: noindex
---

# Map source dataset columns to destination dataset columns
> [!NOTE]
> This article applies to version 1 of Data Factory. 

Column mapping can be used to specify how columns specified in the “structure” of source table map to columns specified in the “structure” of sink table. The **columnMapping** property is available in the **typeProperties** section of the Copy activity.

Column mapping supports the following scenarios:

* All columns in the source dataset structure are mapped to all columns in the sink dataset structure.
* A subset of the columns in the source dataset structure is mapped to all columns in the sink dataset structure.

The following are error conditions that result in an exception:

* Either fewer columns or more columns in the “structure” of sink table than specified in the mapping.
* Duplicate mapping.
* SQL query result does not have a column name that is specified in the mapping.

> [!NOTE]
> The following samples are for Azure SQL and Azure Blob but are applicable to any data store that supports rectangular datasets. Adjust dataset and linked service definitions in examples to point to data in the relevant data source.

## Sample 1 – column mapping from Azure SQL to Azure blob
In this sample, the input table has a structure and it points to a SQL table in an Azure SQL database.

```json
{
    "name": "AzureSQLInput",
    "properties": {
        "structure": 
         [
           { "name": "userid"},
           { "name": "name"},
           { "name": "group"}
         ],
        "type": "AzureSqlTable",
        "linkedServiceName": "AzureSqlLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

In this sample, the output table has a structure and it points to a blob in an Azure blob storage.

```json
{
    "name": "AzureBlobOutput",
    "properties":
    {
         "structure": 
          [
                { "name": "myuserid"},
                { "name": "myname" },
                { "name": "mygroup"}
          ],
        "type": "AzureBlob",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/myfolder",
            "fileName":"myfile.csv",
            "format":
            {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        },
        "availability":
        {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

The following JSON defines a copy activity in a pipeline. The columns from source mapped to columns in sink (**columnMappings**) by using the **Translator** property.

```json
{
    "name": "CopyActivity",
    "description": "description", 
    "type": "Copy",
    "inputs":  [ { "name": "AzureSQLInput"  } ],
    "outputs":  [ { "name": "AzureBlobOutput" } ],
    "typeProperties":    {
        "source":
        {
            "type": "SqlSource"
        },
        "sink":
        {
            "type": "BlobSink"
        },
        "translator": 
        {
            "type": "TabularTranslator",
            "ColumnMappings": "UserId: MyUserId, Group: MyGroup, Name: MyName"
        }
    },
   "scheduler": {
          "frequency": "Hour",
          "interval": 1
        }
}
```
**Column mapping flow:**

![Column mapping flow](./media/data-factory-map-columns/column-mapping-flow.png)

## Sample 2 – column mapping with SQL query from Azure SQL to Azure blob
In this sample, a SQL query is used to extract data from Azure SQL instead of simply specifying the table name and the column names in “structure” section. 

```json
{
    "name": "CopyActivity",
    "description": "description", 
    "type": "CopyActivity",
    "inputs":  [ { "name": " AzureSQLInput"  } ],
    "outputs":  [ { "name": " AzureBlobOutput" } ],
    "typeProperties":
    {
        "source":
        {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('SELECT * FROM MyTable WHERE StartDateTime = \\'{0:yyyyMMdd-HH}\\'', WindowStart)"
        },
        "sink":
        {
            "type": "BlobSink"
        },
        "Translator": 
        {
            "type": "TabularTranslator",
            "ColumnMappings": "UserId: MyUserId, Group: MyGroup,Name: MyName"
        }
    },
    "scheduler": {
          "frequency": "Hour",
          "interval": 1
        }
}
```
In this case, the query results are first mapped to columns specified in “structure” of source. Next, the columns from source “structure” are mapped to columns in sink “structure” with rules specified in columnMappings.  Suppose the query returns 5 columns, two more columns than those specified in the “structure” of source.

**Column mapping flow**

![Column mapping flow-2](./media/data-factory-map-columns/column-mapping-flow-2.png)

## Next steps
See the article for a tutorial on using Copy Activity: 

- [Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
