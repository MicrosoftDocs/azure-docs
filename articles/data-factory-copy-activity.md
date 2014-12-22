<properties title="Copy data with Azure Data Factory" pageTitle="Copy data with Azure Data Factory" description="Learn how to use Copy Activity in Azure Data Factory to copy data from a data source to another data source." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Copy data with Azure Data Factory (Copy Activity)
You can use the **Copy Activity** in a pipeline to copy data from a source to a sink (destination) in a batch. The Copy Activity can be used in the following scenarios:

- **Ingress to Azure**. In this scenario, data is copied from an on-premises data source (ex: SQL Server) to a Azure data store (ex: Azure blob, Azure table, or Azure SQL Database) for the following sub-scenarios:
	- Collect data in a centralized location on Azure for further processing.
	- Migrate data from on-premises or non-Azure cloud platforms to Azure.
	- Archive or back up data to Azure for cost-effective tiered storage.
- **Egress from Azure**. In this scenario, data is copied from Azure (ex: Azure blob, Azure table, or Azure SQL Database) to on-premises data marts and data warehouse (ex: SQL Server) for the following sub-scenarios:
	- Transfer data to on-premises due to lack of cloud data warehouse support.
	- Transfer data to on-premises to take advantage of existing on-premises solution or reporting infrastructure.
	- Archive or back up data to on-premises for tiered storage
- **Azure-to-Azure copy**. In this scenario, the data distributed across Azure data sources is aggregated into a centralized Azure data store. Examples: Azure table to Azure blob, Azure blob to Azure table, Azure Table to Azure SQL, Azure blob to Azure SQL.

See [Get started with Azure Data Factory][adfgetstarted] for a tutorial that shows how to copy data from a Azure blob storage to an Azure SQL Database using the Copy Activity. See [Enable your pipelines to work with on-premises data][use-onpremises-datasources] for a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob storage using the Copy Activity.


## Copy Activity - components
Copy activity contains the following components: 

- **Input table**. A table is a dataset that has a schema and is rectangular. The input table component describes input data for the activity that include the following: name of the table, type of the table, and linked service that refers to a data source, which contains the input data.
- **Output table**. The output table describes output data for the activity that include the following: name of the table, type of the table, and the linked service that refers to a data source, which holds the output data.
- **Transformation rules**. The transformation rules specify how input data is extracted from the source and how output data is loaded into sink etc…
 
A copy activity can have one **input table** and one **output table**.

## JSON for Copy Activity
A pipeline consists of one or more activities. Activities in the pipelines are defined with in the **activities []** section. The JSON for a pipeline is as follows:
         
	{
		"name": "PipelineName",
		"properties": 
    	{
        	"description" : "pipeline description",
        	"activities":
        	[
	
    		]
		}
	}

Each activity within the **activities** section has the following top-level structure. The **type** property should be set to **CopyActivity**. The Copy Activity can have only one input table and one output table.
         

	{
		"name": "ActivityName",
		"description": "description", 
		"type": "CopyActivity",
		"inputs":  [],
		"outputs":  [],
		"transformation":
		{

		},
		"policy":
		{
		
		}
	}

The following table describes the tags used with an activity section. 

<table border="1">	
	<tr>
		<th align="left">Tag</th>
		<th align="left">Descritpion</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>name</td>
		<td>Name of the activity.</td>
		<td>Y</td>
	</tr>	

	<tr>
		<td>description</td>
		<td>Text describing what the activity is used for.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>type</td>
		<td>Specifies the type of the activity. <br/><br/>The <b>type</b> should be set to <b>CopyActivity</b>.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>inputs</td>
		<td>Input tables used by the activity.  Specify only one input table for the Copy Activity.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>outputs</td>
		<td>Output tables used by the activity.  Specify only one output table for the Copy Activity.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>transformation</td>
		<td>Properties in the transformation is dependent on type.  The <b>Copy Activity</b> requires you to specify a <b>source</b> and a <b>sink</b> section within the <b>transformation</b> section. More details are provided later in this article. </td>
		<td>Y</td>
	</tr>

	<tr>
		<td>policy</td>
		<td>Policies which affect the run-time behavior of the activity. If it is not specified, default values will be used.</td>
		<td>N</td>
	</tr>


</table>

See [JSON Scripting Reference][json-script-reference] for detailed information about JSON properties/tags.

## Copy Activity - example
In this example, an input table and an output table are defined and the tables are used in a Copy Activity within a pipeline that copies data from an on-premises SQL Server database to an Azure blob.

**Assumptions**
The following Azure Data Factory artifacts are referenced in sample JSON scripts that follows:

* Resource group named **ADF**.
* An Azure data factory named **CopyFactory**.
* A linked service named **MyOnPremisesSQLDB** that points to an on-premises SQL Server database.
* A linked service named **MyAzureStorage** that points an Azure blob storage.

### Input table JSON
The following JSON script defines an input table that refers to a SQL table: **MyTable** in an on-premises SQL Server database that the **MyOnPremisesSQLDB** linked service defines. Note that **name** is the name of the Azure Data Factory table and **tableName** is the name of the SQL table in a SQL Server database.

         
	{
		"name": "MyOnPremTable",
    	"properties":
   		{
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

The following sample Azure PowerShell command uses the **New-AzureDataFactoryTable** that uses a JSON file that contains the script above to create a table (**MyOnPremTable**) in an Azure data factory: **CopyFactory**.
         
	New-AzureDataFactoryTable -ResourceGroupName ADF –Name MyOnPremTable –DataFactoryName CopyFactory –File <Filepath>\MyOnPremTable.json.

See [Cmdlet Reference][cmdlet-reference] for details about Data Factory cmdlets. 

### Output table JSON
The following JSON script defines an output table: **MyDemoBlob**, which refers to an Azure blob: **MyBlob** in the blob folder: **MySubFolder** in the blob container: **MyContainer**.
         
	{
   		"name": "MyDemoBlob",
	    "properties":
    	{
    		"location":
    		{
        		"type": "AzureBlobLocation",
        		"folderPath": "MyContainer/MySubFolder",
        		"fileName": "MyBlob",
        		"linkedServiceName": "MyAzureStorage",
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

The following sample Azure PowerShell command uses the **New-AzureDataFactoryTable** that uses a JSON file that contains the script above to create a table (**MyDemoBlob**) in an Azure data factory: **CopyFactory**.
         
	New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName CopyFactory –File <Filepath>


### Pipeline (with Copy Activity) JSON
In this example, a pipeline: **CopyActivityPipeline** is defined with the following properties: 

- The **type** property is set to **CopyActivity**.
- **MyOnPremTable** is specified as the input (**inputs** tag).
- **MyAzureBlob** is specified as the output (**outputs** tag)
- **Transformation** section contains two sub sections: **source** and **sink**. The type for source is set to **SqlSource** and the type for sink is set to **BlobSink**. The **sqlReaderQuery** defines the transformation (projection) to be performed on the source. For details about all the properties, see [JSON Scripting Reference][json-script-reference].

         
		{
		    "name": "CopyActivityPipeline",
    		"properties":
    		{
				"description" : "This is a sample pipeline to copy data from SQL Server to Azure Blob",
        		"activities":
        		[
      				{
						"name": "CopyActivity",
						"description": "description", 
						"type": "CopyActivity",
						"inputs":  [ { "name": "MyOnPremTable"  } ],
						"outputs":  [ { "name": "MyAzureBlob" } ],
						"transformation":
	    				{
							"source":
							{
								"type": "SqlSource",
                    			"sqlReaderQuery": "select * from MyTable"
							},
							"sink":
							{
                        		"type": "BlobSink"
							}
	    				}
      				}
        		]
    		}
		}


 The following sample Azure PowerShell command uses the **New-AzureDataFactoryPipeline** that uses a JSON file that contains the script above to create a pipeline (**CopyActivityPipeline**) in an Azure data factory: **CopyFactory**.
         
		New-AzureDataFactoryPipeline -ResourceGroupName ADF –DataFactoryName CopyFactory –File <Filepath>

## Supported inputs and outputs
The above example used SqlSource as the source and BlobSink as the sink in the transformation section. The following table lists the sources and sinks supported by the Copy Activity. 

<table border="1">	
	<tr>
		<th><i>Sink/Source<i></th>
		<th>Azure Blob</th>
		<th>Azure Table</th>
		<th>Azure SQL Database</th>
		<th>On-premises SQL Server</th>
		<th>SQL Server on IaaS</th>
	</tr>	

	<tr>
		<td><b>Azure Blob</b></td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
	</tr>

	<tr>
		<td><b>Azure Table</b></td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
		<td></td>
		<td></td>
	</tr>	

	<tr>
		<td><b>Azure SQL Database</b></td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
		<td>X</td>
	</tr>


	<tr>
		<td><b>On-premises SQL Server</b></td>
		<td>X</td>
		<td></td>
		<td>X</td>
		<td></td>
		<td></td>
	</tr>

	<tr>
		<td><b>SQL Server on IaaS</b></td>
		<td>X</td>
		<td></td>
		<td>X</td>
		<td></td>
		<td></td>
	</tr>

</table>


The following table lists source types and sink types that can be used in a JSON file for a pipeline that contains a Copy Activity.


<table border="1">	
	<tr>
		<th></th>
		<th align="left">Source type</th>
		<th align="left">Sink type</th>
	</tr>	

	<tr>
		<td><b>Azure Blob</b></td>
		<td>BlobSource</td>
		<td>BlobSink</td>
	</tr>

	<tr>
		<td><b>Azure Table</b></td>
		<td>AzureTableSource</td>
		<td>AzureTableSink</td>
	</tr>

	<tr>
		<td><b>Azure SQL Database</b></td>
		<td>SqlSource</td>
		<td>SqlSink</td>
	</tr>

	<tr>
		<td><b>On-permises SQL Server</b></td>
		<td>SqlSource</td>
		<td>SqlSink</td>
	</tr>

	<tr>
		<td><b>SQL on IaaS</b></td>
		<td>SqlSource</td>
		<td>SqlSink</td>
	</tr>
</table>

The following table lists the properties supported by these sources and sinks.

<table border="1">

	<tr>
	<th align="left">Source/Sink</th>
	<th align="left">Supported property</th>
	<th align="left">Description</th>
	<th align="left">Allowed values</th>
	<th align="left">Required</th>
	</tr>

	<tr>
		<tr>
		<td><b>BlobSource</b></td>
		<td>BlobSourceTreatEmptyAsNull</td>
		<td>Specifies whether to treat null or empty string as null value.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N</td>
		</tr>
	</tr>

	<tr>
		<td></td>
		<td>BlobSourceSkipHeaderLineCount</td>
		<td>Indicate how many lines need be skipped.</td>
		<td>Integer from 0 to Max.</td>
		<td>N</td>
	</tr>

	<tr>
		<td><b>AzureTableSource</b></td>
		<td>AzureTableSourceQuery</td>
		<td>Use the custom query to read data.</td>
		<td>Azure table query string.<br/>Sample: “ColumnA eq ValueA”</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>AzureTableSourceIgnoreTableNotFound</td>
		<td>Indicate whether to ignore the exception: “table does not exist”.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N</td>
	</tr>


	<tr>
		<td><b>SqlSource</b></td>
		<td>sqlReaderQuery</td>
		<td>Use the custom query to read data.</td>
		<td>SQL query string.<br/><br/> For example: “Select * from MyTable”.<br/><br/> If not specified, select <columns defined in structure> from MyTable” query.</td>
		<td>N</td>
	</tr>


	<tr>
		<td><b>BlobSink</b></td>
		<td>BlobWriterAddHeader</td>
		<td>Specifies whether to add header of column definitions.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N<br/><br/>(Default is FALSE)</td>
	</tr>

	<tr>
		<td><b>AzureTableSink</b></td>
		<td>azureTableDefaultPartitionKeyValue</td>
		<td>Default partition key value that can be used by the sink.</td>
		<td>A string value.</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>azureTablePartitionKeyName</td>
		<td>User specified column name, whose column values are used as partition key.<br/><br/> If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key.</td>
		<td>A column name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>azureTableRowKeyName</td>
		<td>Column values of specified column name to be used as a row key.<br/><br/>If not specified, a GUID is used for each row.</td>
		<td>A column name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>azureTableInsertType</td>
		<td>The mode to insert data into Azure table.</td>
		<td>“merge”<br/><br/>“replace”</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>writeBatchSize</td>
		<td>Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit.</td>
		<td>Integer from 1 to 100 (unit = Row Count)</td>
		<td>N<br/><br/>(Default = 100)</td>
	</tr>

	<tr>
		<td></td>
		<td>writeBatchTimeout</td>
		<td>Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit</td>
		<td>(Unit = timespan)<br/><br/>Sample: “00:20:00” (20 minutes)</td>
		<td>N<br/><br/>(Default to storage client default timeout value 90 sec)</td>
	</tr>

	<tr>
		<td><b>SqlSink</b></td>
		<td>SqlWriterStoredProcedureName</td>
		<td>Specifies the name of the stored procedure name to upsert (update/insert) data into the target table.</td>
		<td>A stored procedure name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td></td>
		<td>SqlWriterTableType</td>
		<td>Specifies the table type to be used in the above stored procedure.</td>
		<td>A table type name.</td>
		<td>N</td>
	</tr>
</table>

### SQL on Infrastructure-as-a-Service (IaaS)
For SQL on IaaS, Azure as IaaS provider is supported. The following network and VPN topologies are supported. Note that Data Management Gateway is required for case #2 and #3, while not needed for case #1. For details about Data Management Gateway, see [Enable your pipelines to access on-premises data][use-onpremises-datasources].

1.	VM with public DNS name and static public port : private port mapping
2.	VM with public DNS name without SQL endpoint exposed
3.	Virtual network
	<ol type='a'>
	<li>Azure Cloud VPN with following topology at the end of the list. </li>	
	<li>VM with onpremises-to-cloud site-to-site VPN using Azure Virtual Network.</li>	
	</ol>  
	![Data Factory with Copy Activity][image-data-factory-copy-actvity]

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

#### Sample 1 – column mapping from SQL Server to Azure blob
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

if you don't specify a **fileName** for an **input table**, all files/blobs from the input folder (**folderPath**) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input. See the sample files in the [tutorial][adf-tutorial] for examples.

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

In this sample, an activity in a pipeline is defined as follows. The columns from source mapped to columns in sink (**columnMappings**) by using **Translator** property.

##### Sample – Define Column mapping

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

##### Sample 2 – column mapping with SQL query from SQL Server to Azure blob
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
				"SqlReaderQuery": "$$Text.Format('SELECT * FROM MyTable WHERE StartDateTime = \\'{0:yyyyMMdd-HH}\\'', Time.AddHours(SliceStart, 0))"
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

#### Data Type Handling by the Copy Activity

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
		<td>When transferring from <b>BlobSource</b> to <b>BlobSink</b>, there is no type transformation. Types defined in <b>Structure</b> section of table definition are ignored.  For destinations other than <b>BlobSink</b>, data types defined in <b>Structure</b> section of Table definition will be honored.<br/><br/>
		If the <b>Structure</b> is not specified in table definition, type handling depends on the <b>format</b> property of <b>BlobSink</b>:
		<ul>
			<li> <b>TextFormat:</b> all column types are treated as string, and all column names are set as "Prop_<0-N>"</li> 
			<li><b>AvroFormat:</b> use the built-in column types and names in Avro file.</li> 
			<li><b>JsonFormat:</b> all column types are treated as string, and use the built-in column names in Json file.</li>
		</ul>
		</td>
	</tr>

	<tr>
		<td>BlobSink</td>
		<td>Data types defined in <b>Structure</b> section of input Table definition are ignored.  Data types defined on the underlying input data store will be used.  Columns will be specified as nullable for Avro serialization.</td>
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

## Invoke stored procedure for SQL Sink
When copy data into SQL Server or Azure SQL Database, a user specified stored procedure could be configured and invoked. 
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
	        "SqlWriterStoredProcedureName": "spOverwriteMarketing"
	    }

3. In your database, define the stored procedure with the same name as **SqlWriterStoredProcedureName**. It handles input data from your specified source, and insert into the output table. Notice that the parameter name of the stored procedure should be the same as the **tableName** defined in Table JSON file.

    	CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY
    	AS
	    BEGIN
	        INSERT [dbo].[Marketing](ProfileID, State)
	        SELECT * FROM @Marketing
	    END

4. In your database, define the table type with the same name as **SqlWriterTableType**. Notice that the schema of the table type should be same as the schema returned by your input data.

		CREATE TYPE [dbo].[MarketingType] AS TABLE(
    	    [ProfileID] [varchar](256) NOT NULL,
    	    [State] [varchar](256) NOT NULL,
    	)

The stored procedure feature takes advantage of Table-Valued Parameters. You can learn more information about Table-Valued Parameters from [here]( http://msdn.microsoft.com/en-us/library/bb675163(v=vs.110).aspx)

## Walkthroughs
See [Get started with Azure Data Factory][adfgetstarted] for a tutorial that shows how to copy data from a Azure blob storage to an Azure SQL Database using the Copy Activity.
 
See [Enable your pipelines to work with on-premises data][use-onpremises-datasources] for a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob storage using the Copy Activity



[adfgetstarted]: ../data-factory-get-started
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[json-script-reference]: http://go.microsoft.com/fwlink/?LinkId=516971
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

[image-data-factory-copy-actvity]: ./media/data-factory-copy-activity/VPNTopology.png
[image-data-factory-column-mapping-1]: ./media/data-factory-copy-activity/ColumnMappingSample1.png
[image-data-factory-column-mapping-2]: ./media/data-factory-copy-activity/ColumnMappingSample2.png
