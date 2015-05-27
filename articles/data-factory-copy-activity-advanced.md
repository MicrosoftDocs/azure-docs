<properties 
	pageTitle="Advanced scenarios for using the Copy Activity in Azure Data Factory" 
	description="Describes advanced scenarios for using the Copy Activity in Azure Data Factory." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="spelluru"/>

# Advanced scenarios for using the Copy Activity in Azure Data Factory 
## Overview
You can use the **Copy Activity** in a pipeline to copy data from a source to a sink (destination) in a batch. This topic describes the advanced scenarios that the Copy Activity supports. For a detailed overview of the Copy Activity and core scenarios that it supports, see [Copy data with Azure Data Factory][adf-copyactivity]. 


## Column filtering using structure definition
Depending on the type of Table, it is possible to specify a subset of the columns from the source by specifying fewer columns in the **Structure** definition of the table definition than the ones that exist in the underlying data source. The following table provides information about column filtering logic for different types of table. 

<table>

	<tr>
		<th align="left">Type of the table</th>
		<th align="left">Column filtering logic</th>
	<tr>

	<tr>
		<td>AzureBlobLocation</td>
		<td>The <b>Structure</b> definition in the table JSON must match the structure of the blob.  To select a subset of the columns, use the column mapping feature described in the next section: Transformation Rules – Column Mapping.</td>
	<tr>

	<tr>
		<td>AzureSqlTableLocation and OnPremisesSqlServerTableLocation</td>
		<td align="left">
			If the property <b>SqlReaderQuery</b> is specified as part of Copy Activity definition, <b>Structure</b> definition of the table should align with the columns selected in the query.<br/><br/>
			If the property <b>SqlReaderQuery</b> is not specified, the Copy Activity will automatically construct a SELECT query based on the columns specified in the <b>Structure</b> definition of the table definition.
		</td>
	<tr>

	<tr>
		<td>AzureTableLocation</td>
		<td>
			The <b>Structure</b> section in the table definition can contain full set or a subset of the columns in the underlying Azure Table.
		</td>
	<tr>

</table> 

## Transformation rules - Column mapping
Column mapping can be used to specify how columns in source table map to columns in the sink table. It supports the following scenarios:

- Mapping all columns in source table “structure” to destination table “structure”.
- A subset of the columns in source table “structure” are mapped to all destination table “structure”.

It does not support the following and throw an exception: 

- Either fewer columns or more columns in destination.
- Duplicate mapping.
- SQL query result does not have a column name

Specially, while copying data between two Azure Blobs, Copy Activity would mostly treat it as a direct binary data copy, unless the following 3 scenarios are met:


1. If the input and output tables have different format, Copy Activity will do format conversion;
2. If the input table is specified as a folder which may contain multiple files and output table is specified as a file, Copy Activity will merge the files under source folder into one single sink file;
3. If the "columnMapping" is specified, Copy Activity will do the corresponding data transformation.


### Sample 1 – column mapping from SQL Server to Azure blob
In this sample, the **input table** is defined as follows. The input table has a structure and it points to a SQL table in a SQL Server database.
         
		{
		    "name": "MyOnPremTable",
    		"properties":
    		{
				"structure": 
				[
            		{ "name": "userid", "type": "String"},
            		{ "name": "name", "type": "String"},
            		{ "name": "group", "type": "Decimal"}
				],
				"location":
				{
					"type": "OnPremisesSqlServerTableLocation",
					"tableName": "MyTable",
					"linkedServiceName": "MyOnPremisesSQLDB"
				},
				"availability":	
				{
    				"frequency": "Hour",
    				"interval": 1
				}
     		}
		}

In this sample, the **output table** is defined as follows. The output table has a structure and it points to a blob in an Azure blob storage.
         
		
	{
		"name": "MyDemoBlob",
		"properties":
		{
    		"structure":
			[
        	    { "name": "myuserid", "type": "String"},
        	    { "name": "mygroup", "type": "String"},
        	    { "name": "myname", "type": "Decimal"}
			],
			"location":
    		{
    	    	"type": "AzureBlobLocation",
		        "folderPath": "MyContainer/MySubFolder",
				"fileName": "MyBlobName",
    	    	"linkedServiceName": "MyLinkedService",
    	    	"format":
    	    	{
    	        	"type": "TextFormat",
		            "columnDelimiter": ",",
    		        "rowDelimiter": ";",
    		        "EscapeChar": "$",
    		        "NullValue": "NaN"
    		    }
			},
			"availability":
			{
    			"frequency": "Hour",
    			"interval": 1
			}
		}
	}	

If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, **folderPath** uses Year, Month, and Day from from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2014-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2014/10/20 and the fileName is set to 08.csv. 

  	"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
    "fileName": "{Hour}.csv",
    "partitionedBy": 
    [
    	{ "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
        { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
        { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
        { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
    ],

#### Sample – Define Column mapping
In this sample, an activity in a pipeline is defined as follows. The columns from source mapped to columns in sink (**columnMappings**) by using **Translator** property.

	{
		"name": "CopyActivity",
		"description": "description", 
		"type": "CopyActivity",
		"inputs":  [ { "name": "MyOnPremTable"  } ],
		"outputs":  [ { "name": "MyDemoBlob" } ],
		"transformation":
		{
			"source":
			{
				"type": "SqlSource"
    		},
			"sink":
			{
            	"type": "BlobSink"
			},
			"Translator": 
			{
      			"type": "TabularTranslator",
      			"ColumnMappings": "UserId: MyUserId, Group: MyGroup, Name: MyName"
    		}
		}
	}

![Column Mapping][image-data-factory-column-mapping-1]

### Sample 2 – column mapping with SQL query from SQL Server to Azure blob
In this sample, a SQL query (vs. table in the previous sample) is used to extract data from an on-premises SQL Server and columns from query results are mapped to source artifact and then to destination artifact. For the purpose of this sample, the query returns 5 columns.

	{
		"name": "CopyActivity",
		"description": "description", 
		"type": "CopyActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": "OutputBlobDA" } ],
		"transformation":
		{
			"source":
			{
				"type": "SqlSource",
				"SqlReaderQuery": "$$Text.Format('SELECT * FROM MyTable WHERE StartDateTime = \\'{0:yyyyMMdd-HH}\\'', SliceStart)"
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
		}
	}

![Column Mapping 2][image-data-factory-column-mapping-2]

## Data Type Handling by the Copy Activity

The data types specified in the Structure section of the Table definition is only honored for **BlobSource**.  The table below describes how data types are handled for other types of source and sink.

<table>	
	<tr>
		<th align="left">Source/Sink</th>
		<th align="left">Data Type Handling logic</th>
	</tr>	

	<tr>
		<td>SqlSource</td>
		<td>Data types defined in <b>Structure</b> section of table definition are ignored.  Data types defined on the underlying SQL database will be used for data extraction during copy activity.</td>
	</tr>

	<tr>
		<td>SqlSink</td>
		<td>Data types defined in <b>Structure</b> section of table definition are ignored.  The data types on the underlying source and destination will be compared and implicit type conversion will be done if there are type mismatches.</td>
	</tr>

	<tr>
		<td>BlobSource</td>
		<td>When transferring from <b>BlobSource</b> to <b>BlobSink</b>, there is no type transformation; data types defined in <b>Structure</b> section of table definition are ignored.  For destinations other than <b>BlobSink</b>, data types defined in <b>Structure</b> section of table definition will be honored.<br/><br/>
		If the <b>Structure</b> is not specified in table definition, type handling depends on the <b>format</b> property of <b>BlobSource</b> table:
		<ul>
			<li> <b>TextFormat:</b> all column types are treated as string, and all column names are set as "Prop_<0-N>"</li> 
			<li><b>AvroFormat:</b> use the built-in column types and names in Avro file.</li> 
			<li><b>JsonFormat:</b> all column types are treated as string, and use the built-in column names in Json file.</li>
		</ul>
		</td>
	</tr>

	<tr>
		<td>BlobSink</td>
		<td>Data types defined in <b>Structure</b> section of Table definition are ignored.  Data types defined on the underlying input data store will be used.  Columns will be specified as nullable for Avro serialization.</td>
	</tr>

	<tr>
		<td>AzureTableSource</td>
		<td>Data types defined in <b>Structure</b> section of Table definition are ignored.  Data types defined on the underlying Azure Table will be used.</td>
	</tr>

	<tr>
		<td>AzureTableSink</td>
		<td>Data types defined in <b>Structure</b> section of Table definition are ignored.  Data types defined on the underlying input data store will be used.</td>
	</tr>

</table>

**Note:** Azure Table only support a limited set of data types, please refer to [Understanding the Table Service Data Model][azure-table-data-type].

## Invoke stored procedure for SQL Sink
When copying data into SQL Server or Azure SQL Database, a user specified stored procedure could be configured and invoked with additional parameters. 
### Example
1. Define the JSON of output Table as follows (take Azure SQL Database table as an example):

    	{
    		"name": "MyAzureSQLTable",
    		"properties":
    		{
    			"location":
    			{
    				"type": "AzureSqlTableLocation",
    				"tableName": "Marketing",
    				"linkedServiceName": "AzureSqlLinkedService"
    			},
    			"availability":
    			{
    				"frequency": "Hour",
    				"interval": 1
    			}
    		}
    	}

2. Define the **SqlSink** section in copy activity JSON as follows. To call a stored procedure while insert data, both **SqlWriterStoredProcedureName** and **SqlWriterTableType** properties are needed.

		"sink":
	    {
			"type": "SqlSink",
	        "SqlWriterTableType": "MarketingType",
		    "SqlWriterStoredProcedureName": "spOverwriteMarketing",	
			"storedProcedureParameters":
					{
                    	"stringData": 
						{
                        	"value": "str1"		
						}
                    }
	    }

3. In your database, define the stored procedure with the same name as **SqlWriterStoredProcedureName**. It handles input data from your specified source, and insert into the output table. Notice that the parameter name of the stored procedure should be the same as the **tableName** defined in Table JSON file.

		CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @stringData varchar(256)
		AS
		BEGIN
			DELETE FROM [dbo].[Marketing] where ProfileID = @stringData
    		INSERT [dbo].[Marketing](ProfileID, State)
    		SELECT * FROM @Marketing
		END


4. In your database, define the table type with the same name as **SqlWriterTableType**. Notice that the schema of the table type should be same as the schema returned by your input data.

		CREATE TYPE [dbo].[MarketingType] AS TABLE(
    	    [ProfileID] [varchar](256) NOT NULL,
    	    [State] [varchar](256) NOT NULL,
    	)

The stored procedure feature takes advantage of [Table-Valued Parameters][table-valued-parameters].

## Specify encoding for text files
Though UTF-8 encoding is quite popular, often time text files in Azure Blob follow other encodings due to historical reasons. The **encodingName** property allows you to specify the encoding by code page name for tables of TextFormat type. For the list of valid encoding names, see: Encoding.EncodingName Property. For example: windows-1250 or shift_jis. The default value is: UTF-8. See [Encoding class](https://msdn.microsoft.com/library/system.text.encoding(v=vs.110).aspx) for valid encoding names.  

## See Also

- [Examples for using Copy Activity][copy-activity-examples]
- [Copy data with Azure Data Factory][adf-copyactivity]
- [Copy Activity - JSON Scripting Reference](https://msdn.microsoft.com/library/dn835035.aspx)
- [Video: Introducing Azure Data Factory Copy Activity][copy-activity-video]


[copy-activity-video]: http://azure.microsoft.com/documentation/videos/introducing-azure-data-factory-copy-activity/
[table-valued-parameters]: http://msdn.microsoft.com/library/bb675163.aspx


[adfgetstarted]: data-factory-get-started.md
[adf-copyactivity]: data-factory-copy-activity.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[copy-activity-examples]: data-factory-copy-activity-examples.md

[json-script-reference]: http://go.microsoft.com/fwlink/?LinkId=516971
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456
[azure-table-data-type]: https://msdn.microsoft.com/en-us/library/azure/dd179338.aspx

[image-data-factory-copy-actvity]: ./media/data-factory-copy-activity/VPNTopology.png
[image-data-factory-column-mapping-1]: ./media/data-factory-copy-activity/ColumnMappingSample1.png
[image-data-factory-column-mapping-2]: ./media/data-factory-copy-activity/ColumnMappingSample2.png
