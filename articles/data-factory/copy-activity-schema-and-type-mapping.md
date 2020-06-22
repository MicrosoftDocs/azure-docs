---
title: Schema and type mapping in copy activity 
description: Learn about how copy activity in Azure Data Factory maps schemas and data types from source data to sink data when copying data.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: craigg

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 06/22/2020
ms.author: jingwang

---
# Schema and type mapping in copy activity
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how the Azure Data Factory copy activity does schema mapping and data type mapping from source data to sink data when executing the data copy.

## Schema mapping

### Default mapping

By default, copy activity **map source data to sink by column names**.

schema drift

### Explicit mapping

You can also specify explicit mapping to customize the column/field mapping based on your need. More specifically, copy activity:

1. Read the data from source and determine the source schema
2. Apply explicit column mapping if specified.
3. Write the data to sink

#### Tabular to tabular



#### Hierarchy to tabular



#### Tabular to hierarchy 



#### Parameterize mapping



You can specify the columns to map in copy activity -> `translator` -> `mappings` property. The following properties are supported under `translator` -> `mappings` -> object with `source` and `sink`:

| Property | Description                                                  | Required |
| -------- | ------------------------------------------------------------ | -------- |
| name     | Name of the source or sink column.                           | Yes      |
| ordinal  | Column index. Start with 1. <br>Apply and required when using delimited text without header line. | No       |
| path     | JSON path expression for each field to extract or map. Apply for hierarchical data e.g. MongoDB/REST.<br>For fields under the root object, the JSON path starts with root $; for fields inside the array chosen by `collectionReference` property, JSON path starts from the array element. | No       |
| type     | Data Factory interim data type of the source or sink column. | No       |
| culture  | Culture of the source or sink column. <br>Apply when type is `Datetime` or `Datetimeoffset`. The default is `en-us`. | No       |
| format   | Format string to be used when type is `Datetime` or `Datetimeoffset`. Refer to [Custom Date and Time Format Strings](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings) on how to format datetime. | No       |

The following properties are supported under `translator` -> `mappings` in addition to object with `source` and `sink`:

| Property            | Description                                                  | Required |
| ------------------- | ------------------------------------------------------------ | -------- |
| collectionReference | Supported only when hierarchical data e.g. MongoDB/REST is source.<br>If you want to iterate and extract data from the objects **inside an array field** with the same pattern and convert to per row per object, specify the JSON path of that array to do cross-apply. | No       |

The following example defines a copy activity in a pipeline to copy data from parquet file to Azure SQL Database.

```json
{
    "name": "CopyActivity",
    "type": "Copy",
    "inputs": [{
        "referenceName": "ParquetInput",
        "type": "DatasetReference"
    }],
    "outputs": [{
        "referenceName": "AzureSqlOutput",
        "type": "DatasetReference"
    }],
    "typeProperties": {
        "source": { "type": "ParquetSource" },
        "sink": { "type": "SqlSink" },
        "translator": {
            "type": "TabularTranslator",
            "mappings": [
                {
                    "source": { "name": "UserId" },
                    "sink": { "name": "MyUserId" }
                }, 
                {
                    "source": { "name": "Name" },
                    "sink": { "name": "MyName" }
                }, 
                {
                    "source": { "name": "Group" },
                    "sink": { "name": "MyGroup" }
                }
            ]
        }
    }
}
```

## Data type mapping

Copy activity performs source types to sink types mapping with the following approach: source native type -> Azure Data Factory interim data types --(**type conversion**)--> Azure Data Factory interim data types -> sink native type. It applies for both default column mapping and explicit column mapping.

Copy activity currently supports the following interim data types: Byte[], Boolean, Datetime, DatetimeOffset, Decimal, Double, GUID, Int16, Int32, Int64, Single, String, and Timespan.

The following data type conversions are supported from source to sink.

| Source\Sink | Boolean | Byte[] | Decimal | Date/Time <small>(1)</small> | Float-point <small>(2)</small> | GUID | Integer <small>(3)</small> | String | TimeSpan |
| ----------- | ------- | ------ | ------- | ---------------------------- | ------------------------------ | ---- | -------------------------- | ------ | -------- |
| Boolean     | ✓       |        | ✓       |                              | ✓                              |      | ✓                          | ✓      |          |
| Byte Array  |         | ✓      |         |                              |                                |      |                            | ✓      |          |
| Date/Time   |         |        |         | ✓                            |                                |      |                            | ✓      |          |
| Decimal     | ✓       |        | ✓       |                              | ✓                              |      | ✓                          | ✓      |          |
| Float-point | ✓       |        | ✓       |                              | ✓                              |      | ✓                          | ✓      |          |
| GUID        |         |        |         |                              |                                | ✓    |                            | ✓      |          |
| Integer     | ✓       |        | ✓       |                              | ✓                              |      | ✓                          | ✓      |          |
| String      | ✓       | ✓      | ✓       | ✓                            | ✓                              | ✓    | ✓                          | ✓      | ✓        |
| TimeSpan    |         |        |         |                              |                                |      |                            | ✓      | ✓        |

(1) Date/Time include DateTime and DateTimeOffset

(2) Float-point include Single and Double

(3) Integer include SByte, Byte, Int16, UInt16, Int32, UInt32, Int64, and UInt64

> [!NOTE]
> - Currently data type conversion is supported when copying between tabular data. Hierarchical sources/sinks are not supported.
> - This feature works with the latest dataset model. If you don't see this option from the UI, try creating a new dataset.

The following properties are supported in copy activity mapping (under `translator` section for programmatical authoring):

| Property               | Description                                                  | Required |
| ---------------------- | ------------------------------------------------------------ | -------- |
| typeConversion         | Enable the new data type conversion experience. <br>Default value is false.<br>Note for new pipelines created in ADF authoring UI since late June 2020, this type conversion is enabled by default for the best experience, and you can see the following type conversion settings in copy activity -> mapping tab for applicable scenarios. For pipelines created programmatically, you need to explicitly set `typeConversion` property to true to leverage it. | No       |
| typeConversionSettings | The group of type conversion properties, apply when `typeConversion` is set to `true`. The following properties are all under this group. | No       |
| allowDataLoss          | Allow data truncation when converting source data to sink with different type during copy, e.g. from decimal to integer, from DatetimeOffset to Datetime. <br>Default value is true. | No       |
| treatBooleanAsNumber   | Treat booleans as numbers, e.g. true as 1.<br>Default value is false. | No       |
| dateTimeFormat         | Format string when converting between dates without time zone offset and strings, e.g. "yyyy-MM-dd HH:mm:ss.fff".  Refer to [Custom Date and Time Format Strings](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings) for detailed information. | No       |
| dateTimeOffsetFormat   | Format string when converting between dates with time zone offset and strings, e.g. "yyyy-MM-dd HH:mm:ss.fff zzz".  Refer to [Custom Date and Time Format Strings](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings) for detailed information. | No       |
| timeSpanFormat         | Format string when converting between time periods and strings, e.g. "dd\.hh\:mm".  Refer to [Custom TimeSpan Format Strings](https://docs.microsoft.com/dotnet/standard/base-types/custom-timespan-format-strings) for detailed information. | No       |
| culture                | Culture information to be used when convert types, e.g. "en-us", "fr-fr". | No       |

**Example:**

```json
{
    "name": "CopyActivity",
    "type": "Copy",
    "inputs": [{
        "referenceName": "ParquetInput",
        "type": "DatasetReference"
    }],
    "outputs": [{
        "referenceName": "AzureSqlOutput",
        "type": "DatasetReference"
    }],
    "typeProperties": {
        "source": {
        	"type": "ParquetSource"
        },
        "sink": {
            "type": "SqlSink"
        },
        "translator": {
            "type": "TabularTranslator",
            "typeConversion": true,
            "typeConversionSettings": {
            	"allowDataLoss": true,
              	"treatBooleanAsNumber": true,
              	"dateTimeFormat": "yyyy-MM-dd HH:mm:ss.fff",
              	"dateTimeOffsetFormat": "yyyy-MM-dd HH:mm:ss.fff zzz",
              	"timeSpanFormat": "dd\.hh\:mm",
              	"culture": "en-gb"
            }
        }
	}
}
```

## Legacy models

> [!NOTE]
> The following models to map source columns to sink are still supported as is for backward compatibility. We suggest that you use the new model mentioned earlier, until the Data Factory authoring UI has switched to generating the new model.

### Alternative column mapping (legacy model)

You can specify copy activity -> `translator` -> `columnMappings` to map between tabular-shaped data . In this case, the "structure" section is required for both input and output datasets. Column mapping supports **mapping all or subset of columns in the source dataset "structure" to all columns in the sink dataset "structure"**. The following are error conditions that result in an exception:

- Source data store query result does not have a column name that is specified in the input dataset "structure" section.
- Sink data store (if with pre-defined schema) does not have a column name that is specified in the output dataset "structure" section.
- Either fewer columns or more columns in the "structure" of sink dataset than specified in the mapping.
- Duplicate mapping.

In the following example, the input dataset has a structure, and it points to a table in an on-premises Oracle database.

```json
{
    "name": "OracleDataset",
    "properties": {
        "structure":
         [
            { "name": "UserId"},
            { "name": "Name"},
            { "name": "Group"}
         ],
        "type": "OracleTable",
        "linkedServiceName": {
            "referenceName": "OracleLinkedService",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "SourceTable"
        }
    }
}
```

In this sample, the output dataset has a structure and it points to a table in Salesfoce.

```json
{
    "name": "SalesforceDataset",
    "properties": {
        "structure":
        [
            { "name": "MyUserId"},
            { "name": "MyName" },
            { "name": "MyGroup"}
        ],
        "type": "SalesforceObject",
        "linkedServiceName": {
            "referenceName": "SalesforceLinkedService",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "SinkTable"
        }
    }
}
```

The following JSON defines a copy activity in a pipeline. The columns from source mapped to columns in sink by using the **translator** -> **columnMappings** property.

```json
{
    "name": "CopyActivity",
    "type": "Copy",
    "inputs": [
        {
            "referenceName": "OracleDataset",
            "type": "DatasetReference"
        }
    ],
    "outputs": [
        {
            "referenceName": "SalesforceDataset",
            "type": "DatasetReference"
        }
    ],
    "typeProperties":    {
        "source": { "type": "OracleSource" },
        "sink": { "type": "SalesforceSink" },
        "translator":
        {
            "type": "TabularTranslator",
            "columnMappings":
            {
                "UserId": "MyUserId",
                "Group": "MyGroup",
                "Name": "MyName"
            }
        }
    }
}
```

If you are using the syntax of `"columnMappings": "UserId: MyUserId, Group: MyGroup, Name: MyName"` to specify column mapping, it is still supported as-is.

### Alternative schema mapping (legacy model)

You can specify copy activity -> `translator` -> `schemaMapping` to map between hierarchical-shaped data and tabular-shaped data, e.g. copy from MongoDB/REST to text file and copy from Oracle to Azure Cosmos DB's API for MongoDB. The following properties are supported in copy activity `translator` section:

| Property            | Description                                                  | Required |
| :------------------ | :----------------------------------------------------------- | :------- |
| type                | The type property of the copy activity translator must be set to: **TabularTranslator** | Yes      |
| schemaMapping       | A collection of key-value pairs, which represents the mapping relation **from source side to sink side**.<br/>- **Key:** represents source. For **tabular source**, specify the column name as defined in dataset structure; for **hierarchical source**, specify the JSON path expression for each field to extract and map.<br>- **Value:** represents sink. For **tabular sink**, specify the column name as defined in dataset structure; for **hierarchical sink**, specify the JSON path expression for each field to extract and map. <br>In the case of hierarchical data, for fields under root object, JSON path starts with root $; for fields inside the array chosen by `collectionReference` property, JSON path starts from the array element. | Yes      |
| collectionReference | If you want to iterate and extract data from the objects **inside an array field** with the same pattern and convert to per row per object, specify the JSON path of that array to do cross-apply. This property is supported only when hierarchical data is source. | No       |

**Example: copy from MongoDB to Oracle:**

For example, if you have MongoDB document with the following content:

```json
{
    "id": {
        "$oid": "592e07800000000000000000"
    },
    "number": "01",
    "date": "20170122",
    "orders": [
        {
            "prod": "p1",
            "price": 23
        },
        {
            "prod": "p2",
            "price": 13
        },
        {
            "prod": "p3",
            "price": 231
        }
    ],
    "city": [ { "name": "Seattle" } ]
}
```

and you want to copy it into an Azure SQL table in the following format, by flattening the data inside the array *(order_pd and order_price)* and cross join with the common root info *(number, date, and city)*:

| orderNumber | orderDate | order_pd | order_price | city    |
| ----------- | --------- | -------- | ----------- | ------- |
| 01          | 20170122  | P1       | 23          | Seattle |
| 01          | 20170122  | P2       | 13          | Seattle |
| 01          | 20170122  | P3       | 231         | Seattle |

Configure the schema-mapping rule as the following copy activity JSON sample:

```json
{
    "name": "CopyFromMongoDBToOracle",
    "type": "Copy",
    "typeProperties": {
        "source": {
            "type": "MongoDbV2Source"
        },
        "sink": {
            "type": "OracleSink"
        },
        "translator": {
            "type": "TabularTranslator",
            "schemaMapping": {
                "$.number": "orderNumber",
                "$.date": "orderDate",
                "prod": "order_pd",
                "price": "order_price",
                "$.city[0].name": "city"
            },
            "collectionReference":  "$.orders"
        }
    }
}
```

## Next steps
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
