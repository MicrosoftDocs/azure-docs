---
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: include
ms.date: 04/12/2023
ms.author: jianleishen
---
## Specifying structure definition for rectangular datasets
The structure section in the datasets JSON is an **optional** section for rectangular tables (with rows & columns) and contains a collection of columns for the table. You will use the structure section for either providing type information for type conversions or doing column mappings. The following sections describe these features in detail. 

Each column contains the following properties:

| Property | Description | Required |
| --- | --- | --- |
| name |Name of the column. |Yes |
| type |Data type of the column. See type conversions section below for more details regarding when should you specify type information |No |
| culture |.NET based culture to be used when type is specified and is .NET type Datetime or Datetimeoffset. Default is “en-us”. |No |
| format |Format string to be used when type is specified and is .NET type Datetime or Datetimeoffset. |No |

The following sample shows the structure section JSON for a table that has three columns userid, name, and lastlogindate.

```json
"structure": 
[
    { "name": "userid"},
    { "name": "name"},
    { "name": "lastlogindate"}
],
```

Please use the following guidelines for when to include “structure” information and what to include in the **structure** section.

* **For structured data sources** that store data schema and type information along with the data itself (sources like SQL Server, Oracle, Azure table etc.), you should specify the “structure” section only if you want do column mapping of specific source columns to specific columns in sink and their names are not the same (see details in column mapping section below). 

    As mentioned above, the type information is optional in “structure” section. For structured sources, type information is already available as part of dataset definition in the data store, so you should not include type information when you do include the “structure” section.
* **For schema on read data sources (specifically Azure blob)**  you can choose to store data without storing any schema or type information with the data. For these types of data sources you should include “structure” in the following 2 cases:
  * You want to do column mapping.
  * When the dataset is a source in a Copy activity, you can provide type information in “structure” and data factory will use this type information for conversion to native types for the sink. See [Move data to and from Azure Blob](../data-factory-azure-blob-connector.md) article for more information.

### Supported .NET-based types
Data factory supports the following CLS compliant .NET based type values for providing type information in “structure” for schema on read data sources like Azure blob.

* Int16
* Int32 
* Int64
* Single
* Double
* Decimal
* Byte[]
* Bool
* String 
* Guid
* Datetime
* Datetimeoffset
* Timespan 

For Datetime & Datetimeoffset you can also optionally specify “culture” & “format” string to facilitate parsing of your custom Datetime string. See sample for type conversion below.