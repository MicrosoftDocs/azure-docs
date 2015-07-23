## Specifying Structure Definition for Rectangular Datasets
The structure section in the datasets JSON is an **optional** section for rectangular tables (with rows & columns) and contains a collection of columns for the table. You will use the structure section for either providing type information for type conversions or doing column mapping, the details of which you can find in corresponding sections below.

Each column contains the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| name | Name of the column. | Yes |
| type | Data type of the column. See type conversions section below for more details regarding when should you specify type information | No |
| culture | .NET based Culture to be used when type is specified and is .NET type Datetime or Datetimeoffset. Default is “en-us”. See sample below for type conversion. | No |
| format | Format string to be used when type is specified and is .NET type Datetime or Datetimeoffset. See sample below for type conversion. | No |

The following sample shows the structure section JSON for a table that has three columns userid, name, and lastlogindate.

    "structure": 
    [
        { "name": "userid"},
        { "name": "name"},
        { "name": "lastlogindate"}
    ],

Please use the following guidelines for when to include “structure” information and what to include in “structure” section.

1.	**For structured data sources** that store data schema and type information along with the data itself (sources like SQL, Oracle, Azure table etc.), you should specify the “structure” section only if you want do column mapping of specific source columns to specific columns in sink and their names are not the same (see details in column mapping section below). 

	As mentioned above type information is optional in “structure” section. Since for structured sources type information is already available as part of dataset definition in the data store you should not include type information when you do include “structure” section.
2. **For schema on read data sources** specifically Azure blob you can chose to store data without storing any schema or type information with the data. For these types of data sources you should include “structure” in the following 2 cases:
	1. You want to do column mapping.
	2. When the dataset is a Source in Copy activity you can provide type information in “structure” and data factory will use this type information for conversion to native types for the sink. See [Move Data To and From Azure Blob article](../articles/data-factory/data-factory-azure-blob-connector.md) for more information.

### Supported .NET Based Type Values
Data factory supports the following CLS compliant .NET based type values for providing type information in “structure” for schema on read data sources like Azure blob.

| Type |
| ---- |
| Int16 |
| Int32 |
| Int64 |
| Single | 
| Double |
| Decimal |
| Byte[] |
| Bool |
| String |
| Guid |
| Datetime |
| Datetimeoffset |
| Timespan | 

For Datetime & Datetimeoffset you can also optionally specify “culture” & “format” string to facilitate parsing of your custom Datetime string. See sample for type conversion below.

### Type Conversion Sample
The following sample is for copying data from a Blob to Azure SQL with type conversions.

Suppose the Blob dataset is in CSV format and contains 3 columns. One of them is a datetime column with a custom datetime format using abbreviated French names for day of the week.

You will define the Blob Source dataset as follows along with type definitions for the columns.

	{
	    "name": " AzureBlobInput",
	    "properties":
	    {
	         "structure": 
	          [
	                { "name": "userid", “type”: “Int64”},
	                { "name": "name", “type”: “String},
	                { "name": "lastlogindate", “type”: “Datetime”, “culture”: “fr-fr”, “fomat”: “ddd-MM-YYYY”}
	          ],
	        "type": "AzureBlobLocation",
	        "linkedServiceName": "StorageLinkedService",
	        "typeProperties": {
	            "folderPath": "MyContainer/MySubFolder",
	            "fileName":"MyFile.csv",
	            "format":
	            {
	                "type": "TextFormat",
	                "columnDelimiter": ","
	            }
	        },
	        "external": "true",
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1,
	            "externalData": {
	                "retryInterval": "00:01:00",
	                "retryTimeout": "00:10:00",
	                "maximumRetry": 3
	            }
	        }
	    }
	}

Given the SQL type to .NET type mapping table above you would define the Azure SQL table with the following schema.

| Column Name | SQL Type |
| ----------- | -------- |
| userid | bigint |
| name | text |
| lastlogindate | datetime |

Next you will define the Azure SQL dataset as follows. Note: You do not need to specify “structure” section with type information since the type information is already specified in the underlying data store.

	{
	    "name": "AzureSQLOutput",
	    "properties": {
	        "type": "AzureSqlTableLocation",
	        "linkedServiceName": "AzureSqlLinkedService",
	        "typeProperties": {
	            "tableName": "MyTable"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1,
	        }
	    }
	}

In this case data factory will automatically do the type conversions including the Datetime field with the custom datetime format using the fr-fr culture when moving data from Blob to Azure SQL.


