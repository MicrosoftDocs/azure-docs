<properties 
	pageTitle="Copy data with Azure Data Factory" 
	description="Learn how to use Copy Activity in Azure Data Factory to copy data from a data source to another data source." 
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
	ms.date="04/02/2015" 
	ms.author="spelluru"/>

# Copy data with Azure Data Factory (Copy Activity)
## Overview
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

To learn more, you can:

- See video [Introducing Azure Data Factory Copy Activity][copy-activity-video]
- See [Get started with Azure Data Factory][adfgetstarted] for a tutorial that shows how to copy data from a Azure blob storage to an Azure SQL Database using the Copy Activity. 
- See [Enable your pipelines to work with on-premises data][use-onpremises-datasources] for a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob storage using the Copy Activity.


## Supported sources and sinks
The Copy Activity supports the following data movement scenarios: 

- Copy data from an Azure Blob to an Azure Blob, Azure Table, Azure SQL Database, On-premises SQL Server, or SQL Server on IaaS.
- Copy data from an Azure SQL Database to an Azure Blob, Azure Table, Azure SQL Database, On-premises SQL Server, SQL Server on IaaS
- Copy data from an Azure Table to an Azure Blob, Azure Table, or Azure SQL Database.
- Copy data from an On-premises SQL Server/SQL Server on IaaS to Azure Blob or Azure SQL Database
- Copy data from an On-premises Oracle database to an Azure blob
- Copy data from an On-premises file system to Azure Blob
 

<table border="1">	
	<tr>
		<th><i>Source/Sink<i></th>
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

	<tr>
		<td><b>On-premises File System</b></td>
		<td>X</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>

	<tr>
		<td><b>On-premises Oracle Database</b></td>
		<td>X</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
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

## Copy Activity - components
Copy activity contains the following components: 

- **Input table**. A table is a dataset that has a schema and is rectangular. The input table component describes input data for the activity that include the following: name of the table, type of the table, and linked service that refers to a data source, which contains the input data.
- **Output table**. The output table describes output data for the activity that include the following: name of the table, type of the table, and the linked service that refers to a data source, which holds the output data.
- **Transformation rules**. The transformation rules specify how input data is extracted from the source and how output data is loaded into sink etc…
 
A copy activity can have one **input table** and one **output table**.

## <a name="CopyActivityJSONSchema"></a>JSON for Copy Activity
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

### source and sink types
For a list of source and sink types and the properties supported by these types, see [Supported Sources and Sinks][msdn-supported-sources-sinks] topic on MSDN Library. 

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

> [AZURE.NOTE] See [Examples for using Copy Activity in Azure Data Factory][copy-activity-examples] for more examples for using the Copy Activity.

## Security
This section includes overall security guidelines and best practices that help establish secure access to data stores for the Copy Activity.

For data stores offering HTTPS connection, choose HTTPS connection for the copy activity to establish secure communication over the network. For example, for **Azure Storage**, use **DefaultEndpointsProtocol=https** is in the connection string.

For **Azure SQL Database**, explicitly request an encrypted connection and do not trust the server certificates to avoid the "man in the middle" attack. To achieve this, use **Encrypt=True** and **TrustServerCertificate=False** in the connection string. See Azure [SQL Database Security Guidelines and Limitations](https://msdn.microsoft.com/library/azure/ff394108.aspx) for details.

For traditional databases such as **SQL Server**, especially when the instances are in an Azure Virtual Machine, enable encrypted connection option by configuring a signed certificate, with **Encrypt=True** and **TrustServerCertificate=False** in the connection string. For more information, see [Enable Encrypted Connections to the Database Engine](https://msdn.microsoft.com/library/ms191192(v=sql.110).aspx) and [Connection String Syntax.](https://msdn.microsoft.com/library/ms254500.aspx).

## Advanced scenarios
- **Column filtering using structure definition**. Depending on the type of the table, it is possible to specify a subset of the columns from the source by specifying fewer columns in the **Structure** definition of the table definition than the ones that exist in the underlying data source.
- **Transformation rules - Column mapping**. Column mapping can be used to specify how columns in source table map to columns in the sink table.
- **Data Type Handling by the Copy Activity**. Explains in which case the data types specified in the Structure section of the Table definition are honored/ignored.
- **Invoke stored procedure for SQL Sink**. When copying data into SQL Server or Azure SQL Database, a user specified stored procedure could be configured and invoked.

See [Advanced Scenarios for using the Copy Activity with Azure Data Factory][copy-activity-advanced] article for details on these scenarios. 

## Walkthroughs
See [Get started with Azure Data Factory][adfgetstarted] for a tutorial that shows how to copy data from a Azure blob storage to an Azure SQL Database using the Copy Activity.
 
See [Enable your pipelines to work with on-premises data][use-onpremises-datasources] for a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob storage using the Copy Activity

## See Also
- [Copy Activity - Examples][copy-activity-examples]
- [Video: Introducing Azure Data Factory Copy Activity][copy-activity-video]
- [Copy Activity topic on MSDN Library][msdn-copy-activity]
- [Advanced Scenarios for using the Copy Activity with Azure Data Factory][copy-activity-advanced]

[msdn-copy-activity]: https://msdn.microsoft.com/library/dn835035.aspx
[msdn-linkedservices]: https://msdn.microsoft.com/library/dn834986.aspx
[msdn-tables-topic]: https://msdn.microsoft.com/library/dn835002.aspx
[msdn-supported-sources-sinks]: https://msdn.microsoft.com/library/dn894007.aspx
[copy-activity-video]: http://azure.microsoft.com/documentation/videos/introducing-azure-data-factory-copy-activity/
[table-valued-parameters]: http://msdn.microsoft.com/library/bb675163.aspx

[copy-activity-video]: http://azure.microsoft.com/documentation/videos/introducing-azure-data-factory-copy-activity/

[adfgetstarted]: data-factory-get-started.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[copy-activity-examples]: data-factory-copy-activity-examples.md

[copy-activity-advanced]: data-factory-copy-activity-advanced.md
[json-script-reference]: http://go.microsoft.com/fwlink/?LinkId=516971
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

[image-data-factory-copy-actvity]: ./media/data-factory-copy-activity/VPNTopology.png
[image-data-factory-column-mapping-1]: ./media/data-factory-copy-activity/ColumnMappingSample1.png
[image-data-factory-column-mapping-2]: ./media/data-factory-copy-activity/ColumnMappingSample2.png
