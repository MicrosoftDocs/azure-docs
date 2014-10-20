<properties title="Copy data with Azure Data Factory" pageTitle="Copy data with Azure Data Factory" description="Learn how to use Copy Activity in Azure Data Factory to copy data from a data source to another data source." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Copy data with Azure Data Factory (Copy Activity)
You can use the **Copy Activity** in a pipeline to copy data from a source to a sink (destination) in a batch. The Copy Activity can be used in the following scenarios:

- Ingress to Windows Azure. In this scenario, data is copied from an on-premises data source (ex: SQL Server) to a Windows Azure data store (ex: Azure blob, Azure table, or Azure SQL Database) for the following sub-scenarios:
	- Collect data in a centralized location on Azure for further processing.
	- Migrate data from on-premises or non-Azure cloud platforms to Azure.
	- Archive or back up data to Azure for cost-effective tiered storage.
- Egress from Windows Azure. In this scenario, data is copied from Azure (ex: Azure blob, Azure table, or Azure SQL Database) to on-premises data marts and data 
- warehouse (ex: SQL Server) for the following sub-scenarios:
	- Transfer data to on-premises due to lack of cloud data warehouse support.
	- Transfer data to on-premises to take advantage of existing on-premises solution or reporting infrastructure.
	- Archive or back up data to on-premises for tiered storage
- Azure-to-Azure copy. In this scenario, the data distributed across Azure data sources is aggregated into a centralized Azure data store. Examples: Azure table to Azure blob, Azure blob to Azure table, Azure Table to Azure SQL, Azure blob to Azure SQL.

See [Get started with Azure Data Factory][adfgetstarted] for a tutorial that shows how to copy data from a Azure blob storage to an Azure SQL Database using the Copy Activity. See [Enable your pipelines to work with on-premises data][use-onpremises-datasources] for a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob storage using the Copy Activity.


## Copy Activity - components
Copy activity contains the following components: 

- **Input table**. A table is a dataset that has a schema and is rectangular. The input table component describes input data for the activity that include the following: name of the table, type of the table, and linked service that refers to a data source, which contains the input data.
- **Output table**. The output table describes output data for the activity that include the following: name of the table, type of the table, and the linked service that refers to a data source, which holds the output data.
- **Transformation rules**. The transformation rules specify query to extract data from source, and how data is moved to sink, batch size etc…
 
A copy activity can have one **input table** and one **output table**.

## JSON for Copy Activity
A pipeline consists of one or more activities. Each activity can have one or more tables as inputs and outputs. The JSON for a pipeline is as follows:
         
	{
		"name": "PipelineName”,
    	"properties": 
    	{
        	"description" : "pipeline description",
        	"activities":
        	[
	
    		],
		}
	}

Activities in the pipelines are defined with in the **activities []** section. Each activity within the activities section has the following top-level structure. The **type** property should be set to **CopyActivity**.
         

	{
		"name": "ActivityName",
		"description": "description", 
		"type": CopyActivity
		"inputs":  [],
		"outputs":  [],
		"transformation":
		{

		},
		policy:
		{
		
		}
	}

<table border="1">	
	<tr>
		<th>Tag</th>
		<th>Descritpion</th>
		<th>Required</th>
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
		<td>Input tables used by the activity.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>outputs</td>
		<td>Output tables used by the activity.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>transformation</td>
		<td>Properties in the transformation is dependent on type.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>policy</td>
		<td>Policies which affect the run-time behavior of the activity.If it is not specified, default values will be used.</td>
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
    			“linkedServiceName”: "MyOnPremisesSQLDB"
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

### Output table JSON
The following JSON script defines an output table: **MyDemoBlob**, which refers to an Azure blob: **MyBlob** in the blob folder: **MySubFolder** in the blob container: **MyContainer**.
         
	{
   		"name": "MyDemoBlob",
	    "properties":
    	{
    		"location":
    		{
        		"type": "AzureBlobLocation",
        		"blobPath": "MyContainer/MySubFolder",
        		"blobName": "MyBlob"
        		“linkedServiceName”: " MyAzureStorage",
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
         
	New-AzureDataFactoryTable -ResourceGroupName ADF -Name MyDemoBlob -DataFactoryName CopyFactory –File <Filepath>

See [Cmdlet Reference][cmdlet-reference] for details about Data Factory cmdlets. 

### Pipeline (with Copy Activity) JSON
In this example, a pipeline: **CopyActivityPipeline** is defined with the following properties: 

- The **type** property is set to **CopyActivity**.
- **MyOnPremTable** is specified as the input (**inputs** tag).
- **MyAzureBlob** is specified as the output (**outputs** tag)
- **Transformation** section contains two sub sections: **source** and **sink**. The type for source is set to **SqlSource** and the type for sink is set to **BlobSink**. The **sqlReaderQuery** defines the transformation (projection) to be performed on the source. For details about all the properties, see Developer Reference.

         
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
						"outputs":  [ { "name": “MyAzureBlob” } ],
						"transformation":
	    				{
							"source":
							{
								"type": "SqlSource",
                    			"sqlReaderQuery": "select * from MyTable"
							},
							"sink":
							{
                        		"type": "BlobSink",
                        		"writeBatchSize": 1000000,
                        		"writeBatchTimeout": “01:00:00”
							}
	    				},
      				}
        		]
    		}
		}


 The following sample Azure PowerShell command uses the **New-AzureDataFactoryPipeline** that uses a JSON file that contains the script above to create a pipeline (**CopyActivityPipeline**) in an Azure data factory: **CopyFactory**.
         
		New-AzureDataFactoryPipeline -ResourceGroupName ADF -Name CopyactivityPipeline –DataFactoryName CopyFactory –File <Filepath>

## Supported inputs and outputs
The following table lists the sources and sinks supported by the Copy Activity. 

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
		<td></td>
		<td></td>
	</tr>


	<tr>
		<td><b>On-premises SQL Server</b></td>
		<td>X</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>

	<tr>
		<td><b>SQL Server on IaaS</b></td>
		<td>X</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>

</table>

For SQL on Infrastructure-as-a-Service (IaaS), Azure and Amazon as IaaS providers are supported. The following network and VPN topologies are supported. Note that Data Management Gateway is required for case #2 and #3, while not needed for case #1. For details about Data Management Gateway, see [Enable your pipelines to access on-premises data][use-onpremises-datasources].

1.	VM with public DNS name and static public port : private port mapping
2.	VM with public DNS name without SQL endpoint exposed
3.	Virtual network
	<ol type='a'>
	<li>Azure Cloud VPN with following topology at the end of the list. </li>	
	<li>VM with onpremises-to-cloud site-to-site VPN using Azure Virtual Network.</li>
	<li>Amazon VPC (Virutal Private Cloud).</li>
	</ol>  
	![Data Factory with Copy Activity][image-data-factory-copy-actvity]

### Source and sink types
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

#### BlobSource

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>BlobSourceTreatEmptyAsNull</td>
		<td>Specifies whether to treat null or empty string as null value.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N</td>
	</tr>

	<tr>
		<td>BlobSourceSkipHeaderLineCount</td>
		<td>Indicate how many lines need be skipped.</td>
		<td>Integer from 0 to Max.</td>
		<td>N</td>
	</tr>

</table>


#### AzureTableSource

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>AzureTableSourceQuery</td>
		<td>Use the custom query to read data.</td>
		<td>Azure table query string.<br/>Sample: “ColumnA eq ValueA”</td>
		<td>N</td>
	</tr>

	<tr>
		<td>AzureTableSourceIgnoreTableNotFound</td>
		<td>Indicate whether swallow the exception of table not exist.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N</td>
	</tr>

</table>

#### AzureTableSource

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>AzureTableSourceQuery</td>
		<td>Use the custom query to read data.</td>
		<td>Azure table query string.<br/>Sample: “ColumnA eq ValueA”</td>
		<td>N</td>
	</tr>

	<tr>
		<td>AzureTableSourceIgnoreTableNotFound</td>
		<td>Indicate whether swallow the exception of table not exist.</td>
		<td>TRUE<br/>FALSE</td>
		<td>N</td>
	</tr>

</table>

</table>

#### SqlSource

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>sqlReaderQuery</td>
		<td>Use the custom query to read data.</td>
		<td>SQL query string.<br/><br/> For example: “Select * from MyTable”.<br/><br/> If not specified, select <columns defined in structure> from MyTable” query.</td>
		<td>N</td>
	</tr>

</table>

#### AzureTableSink

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>azureTableDefaultPartitionKeyValue</td>
		<td>Default partition key value that can be used by the sink.</td>
		<td>A string value.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>azureTablePartitionKeyName</td>
		<td>User specified column name, whose column values are used as partition key.<br/><br/> If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key.</td>
		<td>A column name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>azureTableRowKeyName</td>
		<td>User specified column name, whose column values are used as row key.<br/><br/>If not specified, use a GUID for each row.</td>
		<td>A column name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>azureTableInsertType</td>
		<td>The mode to insert data into Azure table.</td>
		<td>“merge”<br/><br/>“replace”</td>
		<td>N</td>
	</tr>

	<tr>
		<td>writeBatchSize</td>
		<td>Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit.</td>
		<td>Integer from 1 to 100 (unit = Row Count)</td>
		<td>N<br/><br/>(Default = 100)</td>
	</tr>

	<tr>
		<td>writeBatchTimeout</td>
		<td>Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit</td>
		<td>(Unit = timespan)<br/><br/>Sample: “00:20:00” (20 minutes)</td>
		<td>N<br/><br/>(Default to storage client default timeout value 90 sec)</td>
	</tr>

</table>

#### SqlSink

<table border="1">	
	<tr>
		<th align="left">Supported property</th>
		<th align="left">Description</th>
		<th align="left">Allowed values</th>
		<th align="left">Required</th>
	</tr>	

	<tr>
		<td>SqlWriterStoredProcedureName</td>
		<td>User specified stored procedure name to upsert (update/insert) data into the target table.</td>
		<td>A stored procedure name.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>SqlWriterTableType</td>
		<td>User specified table type name to be used in the above stored procedure.</td>
		<td>A table type name.</td>
		<td>N</td>
	</tr>

</table>

## Transformation rules
###Column mapping
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
				“structure”:
            		{ name: "userid", type: "String"},
            		{ name: "name", type: "String"},
            		{ name: "group", type: "Decimal"}
				"location":
				{
  					"type": "OnPremisesSqlServerTableLocation",
  					"tableName": "MyTable",
  					“linkedServiceName”: "MyOnPremisesSQLDB"
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
    		“structure”:
        	    { name: "myuserid", type: "String"},
        	    { name: "mygroup", type: "String"},
        	    { name: "myname", type: "Decimal"}
			"location":
    		{
    	    	"type": "AzureBlobLocation",
		        "blobPath": "MyContainer/MySubFolder",
				"blobName": "MyBlobName"
    	    	“linkedServiceName”: "MyLinkedService",
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

In this sample, an activity in a pipeline is defined as follows. The columns from source mapped to columns in sink (**columnMappings**) by using **Translator** property.

##### Sample – Define Column mapping

	{
		"name": "CopyActivity",
		"description": "description", 
		"type": "CopyActivity",
		"inputs":  [ { "name": "MyOnPremTable"  } ],
		"outputs":  [ { "name": “MyDemoBlob” } ],
		"transformation":
		{
			"source":
			{
				"type": "SqlSource",
    		},
			"sink":
			{
            	"type": "BlobSink",
                "writeBatchSize": 1000000,
                "writeBatchTimeout": “01:00:00”
			}
			"Translator": 
			{
      			"type": "TabularTranslator",
      			"ColumnMappings": "UserId: MyUserId, Group: MyGroup, Name: MyName"
    		}
		},
	}

![Column Mapping][image-data-factory-column-mapping-1]

##### Sample 2 – column mapping with SQL query from SQL Server to Azure blob
In this sample, a SQL query (vs. table in the previous sample) is used to extract data from an on-premises SQL Server and columns from query results are mapped to source artifact and then to destination artifact. For the purpose of this sample, the query returns 5 columns.

	{
		"name": "CopyActivity",
		"description": "description", 
		"type": "CopyActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": “OutputBlobDA” } ],
		"transformation":
		{
			"source":
			{
				"type": "SqlSource",
    			"sqlReaderQuery": " Select * from Person where $$creationDate > ‘MM/dd/yyyy HH:mm:ss.fffffff zzz’"
			},
			"sink":
			{
            	"type": "BlobSink",
                "writeBatchSize": 1000000,
                "writeBatchTimeout": “01:00:00”
			}
			"Translator": 
			{
      			"type": "TabularTranslator",
      			"ColumnMappings": "UserId: MyUserId, Group: MyGroup,Name: MyName"
    		}
		},
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
		<td><p>When transferring from <b>BlobSource</b> to <b>BlobSink</b>, there is no type transformation. Types defined in <b>Structure</b> section of table definition are ignored.  For destinations other than <b>BlobSink</b>, data types defined in <b>Structure</b> section of Table definition will be honored.</p>
		<p>
		If the <b>Structure</b> is not specified in table definition, type handling depends on the <b>format</b> property of <b>BlobSink</b>:
		</p>
		<ul>
			<li> <b>TextFormat:</b> all column types are treated as string, and all column names are set as "Prop_<0-N>"</li> 
			<li><b>AvroFormat:</b> use the built-in column types and names in Avro file.</li> 
			<li><b>JsonFormat:</b> all column types are treated as string, and use the built-in column names in Json file.</li>
		</ul>
		</td>
	</tr>

</table>

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
