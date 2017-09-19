---
title: Copy on-premises data to cloud using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from an on-premises data store to Azure cloud by using self-hosted integration runtime in Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/14/2017
ms.author: jingwang

---

# Tutorial: Copy data between on-premises and cloud
In this tutorial, you use Azure PowerShell to create a Data Factory pipeline that copies data from an on-premises SQL Server database to an Azure Blob storage. You create and use a self-hosted integration runtime (IR) of Azure Data Factory, which allows integration of on-premises data stores and cloud data stores.  To learn about using other tools/SDKs to create data factory, see [Quickstarts](quickstart-create-data-factory-dot-net.md). 

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create self-hosted integration runtime
> * Create and encrypt on-prem SQL Server linked service on Self-hosted integration runtime
> * Create Azure Storage linked service.
> * Create SQL Server and Azure Storage datasets.
> * Create a pipeline with a copy activity to move the data.
> * Start a pipeline run.
> * Monitor the pipeline and activity run.

## Prerequisites

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **SQL Server**. You use an on-premises SQL Server database as a **source** data store in this tutorial. 
* **Azure Storage account**. You use the blob storage as a **destination/sink** data store in this tutorial. if you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
* **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

## Create data factory

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this quickstart. If you close and reopen, you need to run the commands again.

    Run the following command, and enter the user name and password that you use to sign in to the Azure portal:
    ```powershell
    Login-AzureRmAccount
    ```
    Run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzureRmSubscription
    ```
    Run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<SubscriptionId>"
    ```
2. Run the **Set-AzureRmDataFactoryV2** cmdlet to create a data factory. Replace place-holders with your own values before executing the command.

    ```powershell
    $resourceGroupName = "<your resource group to create the factory>"
    $dataFactoryName = "<specify the name of data factory to create. It must be globally unique.>"
    $df = Set-AzureRmDataFactoryV2 -ResourceGroupName $resourceGroupName -Location "East US" -Name $dataFactoryName
    ```

    Note the following points:

    * The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

        ```
        Data factory name "<data factory name>" is not available.
        ```

    * To create Data Factory instances, you must be a Contributor or Administrator of the Azure subscription.
    * Currently, Data Factory allows you to create data factory only in the East US and East US 2 region. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

## Create self-hosted IR

In this section, you can create a Self-hosted integration runtime and associate it with an on-prem node (machine).

1. Create a self-hosted integration runtime. Use a unique name in case if another integration runtime with the same name exists.

   ```powershell
   $integrationRuntimeName = "<your integration runtime name>"
   Set-AzureRmDataFactoryV2IntegrationRuntime -Name $integrationRuntimeName -Type SelfHosted -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName
   ```

   Here is the sample output:

   ```json
    Id                : /subscriptions/<subscription ID>/resourceGroups/ADFTutorialResourceGroup/providers/Microsoft.DataFactory/factories/onpremdf0914/integrationruntimes/myonpremirsp0914
    Type              : SelfHosted
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : onpremdf0914
    Name              : myonpremirsp0914
    Description       :
    ```
 ​

2. Run the following command to retrieve status of the created integration runtime.

   ```powershell
   Get-AzureRmDataFactoryV2IntegrationRuntime -name $integrationRuntimeName -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Status
   ```

   Here is the sample output:

   ```json
   Nodes                     : {}
   CreateTime                : 9/14/2017 10:01:21 AM
   InternalChannelEncryption : 
   Version                   : 
   Capabilities              : {}
   ScheduledUpdateDate       : 
   UpdateDelayOffset         : 
   LocalTimeZoneOffset       : 
   AutoUpdate                : 
   ServiceUrls               : {eu.frontend.clouddatahub.net, *.servicebus.windows.net}
   ResourceGroupName         : <ResourceGroup name>
   DataFactoryName           : <DataFactory name>
   Name                      : <Integration Runtime name>
   State                     : NeedRegistration
   ```

3. Run the following command to retrieve authentication keys to register the self-hosted integration runtime with Data Factory service in the cloud. Copy one of the keys for registering the self-hosted integration runtime.

   ```powershell
   Get-AzureRmDataFactoryV2IntegrationRuntimeKey -Name $integrationRuntimeName -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName | ConvertTo-Json
   ```

   Here is the sample output: 

   ```json
   {
       "AuthKey1":  "IR@8437c862-d6a9-4fb3-87dd-7d4865a9e845@ab1@eu@VDnzgySwUfaj3pfSUxpvfsXXXXXXx4GHiyF4wboad0Y=",
       "AuthKey2":  "IR@8437c862-d6a9-4fb3-85dd-7d4865a9e845@ab1@eu@sh+k/QNJGBltXL46vXXXXXXXXOf/M1Gne5aVqPtbweI="
   }
   ```

4. [Download](https://www.microsoft.com/download/details.aspx?id=39717) the Self-hosted integration runtime on a local windows machine, and use the Authentication Key obtained in the previous step to manually register the self-hosted integration runtime. 

   ![Register integration runtime](media/tutorial-hybrid-copy-powershell/register-integration-runtime.png)

   You see the following message when the self-hosted integration runtime is registered successfully: 

   ![Registered successfully](media/tutorial-hybrid-copy-powershell/registered-successfully.png)

   You see the following page when the node is connected to the cloud service: 
    
   ![Node is connected](media/tutorial-hybrid-copy-powershell/node-is-connected.png)

## Create linked services 

### Create Azure Storage Linked Service (destination/ sink)

1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADFv2Tutorial** folder with the following content: (Create the folder ADFv2Tutorial if it does not already exist.)

    > [!IMPORTANT]
    > Replace &lt;accountname&gt; and &lt;accountkey&gt; with the name and key of your Azure Storage account.

   ```json
	{
		"properties": {
			"type": "AzureStorage",
			"typeProperties": {
				"connectionString": { 
					"type": "SecureString",
					"value": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
				}
			}
		},
		"name": "AzureStorageLinkedService"
	}
   ```

2. In **Azure PowerShell**, switch to the **ADFv2Tutorial ** folder.

   Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**. The cmdlets used in this tutorial take values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can pass the **DataFactory** object returned by the Set-AzureRmDataFactoryV2 cmdlet without typing ResourceGroupName and DataFactoryName each time you run a cmdlet.

   ```powershell
   Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $ResourceGroupName -Name "AzureStorageLinkedService" -File ".\AzureStorageLinkedService.json"
   ```

   Here is a sample output:

    ```json
    LinkedServiceName : AzureStorageLinkedService
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : onpremdf0914
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureStorageLinkedService
    ```

### Create and encrypt SQL Server linked service (source)

1. Create a JSON file named **SqlServerLinkedService.json** in **C:\ADFv2Tutorial** folder with the following content:  

   > [!IMPORTANT]
   > Replace &lt;servername&gt;, &lt;databasename&gt;, &lt;username&gt;@&lt;servername&gt; and &lt;password&gt; with values of your SQL Server before saving the file.
   > Replace &lt;integration runtime name&gt; with the name of your integration runtime. 

	```json
	{
		"properties": {
			"type": "SqlServer",
			"typeProperties": {
				"connectionString": {
					"type": "SecureString",
					"value": "Server=<servername>;Database=<databasename>;User ID=<username>;Password=<password>;Timeout=60"
				}
			},
			"connectVia": {
				"type": "integrationRuntimeReference",
				"referenceName": "<integration runtime name>"
			}
		},
		"name": "SqlServerLinkedService"
	}
   ```
2. To encrypt the sensitive data from the JSON payload on the on-premise self-hosted integration runtime, we can run **New-AzureRmDataFactoryV2LinkedServiceEncryptCredential** and pass on the above JSON payload. This encryption ensures the credentials are encrypted using Data Protection Application Programming Interface (DPAPI) and stored on the self-hosted integration runtime node locally. The output payload can be redirected to another JSON file (in this case 'encryptedLinkedService.json') which contains encrypted credentials. 

    Replace &lt;integration runtime name&gt; with the name of your integration runtime before running the command.

   ```powershell
   New-AzureRmDataFactoryV2LinkedServiceEncryptCredential -DataFactoryName $dataFactoryName -ResourceGroupName $ResourceGroupName -IntegrationRuntimeName <integration runtime name> -File ".\SQLServerLinkedService.json" > encryptedSQLServerLinkedService.json
   ```

3. Run the following command by using JSON from the previous step to create the **SqlServerLinkedService**:

   ```powershell
   Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $ResourceGroupName -Name "EncryptedSqlServerLinkedService" -File ".\encryptedSqlServerLinkedService.json" 
   ```


## Create datasets

### Prepare on-premises SQL Server for the tutorial

In this step, you create input and output datasets that represent input and output data for the copy operation (On-premises SQL Server database => Azure blob storage). Before creating datasets, do the following steps (detailed steps follows the list):

- Create a table named **emp** in the SQL Server Database you added as a linked service to the data factory and insert a couple of sample entries into the table.
- Create a blob container named **adftutorial** in the Azure blob storage account you added as a linked service to the data factory.


1. In the database you specified for the on-premises SQL Server linked service (**SqlServerLinkedService**), use the following SQL script to create the **emp** table in the database.

   ```sql   
     CREATE TABLE dbo.emp
     (
         ID int IDENTITY(1,1) NOT NULL,
         FirstName varchar(50),
         LastName varchar(50),
         CONSTRAINT PK_emp PRIMARY KEY (ID)
     )
     GO
   ```

2. Insert some sample into the table:

   ```sql
     INSERT INTO emp VALUES ('John', 'Doe')
     INSERT INTO emp VALUES ('Jane', 'Doe')
   ```



### Create dataset for source SQL Database

1. Create a JSON file named **SqlServerDataset.json** in the **C:\ADFv2Tutorial** folder, with the following content:  

    ```json
    {
       "properties": {
    		"type": "SqlServerTable",
    		"typeProperties": {
    			"tableName": "dbo.emp"
    		},
    		"structure": [
    			 {
                    "name": "ID",
                    "type": "String"
                },
                {
                    "name": "FirstName",
                    "type": "String"
                },
                {
                    "name": "LastName",
                    "type": "String"
                }
    		],
    		"linkedServiceName": {
    			"referenceName": "EncryptedSqlServerLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	},
    	"name": "SqlServerDataset"
    }
    ```

2. To create the dataset: **SqlServerDataset**, run the **Set-AzureRmDataFactoryV2Dataset** cmdlet.

    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactory $df -Name "SqlServerDataset" -File ".\SqlServerDataset.json"
    ```

    Here is the sample output:

    ```json
    DatasetName       : SqlServerDataset
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : onpremdf0914
    Structure         : {"name": "ID" "type": "String", "name": "FirstName" "type": "String", "name": "LastName" "type": "String"}
    Properties        : Microsoft.Azure.Management.DataFactory.Models.SqlServerTableDataset
    ```

### Create dataset for sink Azure Blob Storage

1. Create a JSON file named **AzureBlobDataset.json** in the **C:\ADFv2Tutorial** folder, with the following content: 

    > [!IMPORTANT]
    > This sample code assumes that you have a container named **adftutorial** in the Azure Blob Storage.

    ```json
    {
        "properties": {
    		"type": "AzureBlob",
    		"typeProperties": {
    			"folderPath": "adftutorial/fromonprem",
    			"format": {
    				"type": "TextFormat"
    			}
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureStorageLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	},
    	"name": "AzureBlobDataset"
    }
    ```

2. To create the dataset: **AzureBlobDataset**, run the **Set-AzureRmDataFactoryV2Dataset** cmdlet.

    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactory $df -Name "AzureBlobDataset" -File ".\AzureBlobDataset.json"
    ```

    Here is the sample output:

    ```json
    DatasetName       : AzureBlobDataset
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : onpremdf0914
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureBlobDataset
    ```

## Create pipelines

### Create pipeline "SqlServerToBlobPipeline"

1. Create a JSON file named **SqlServerToBlobPipeline.json** in the **C:\ADFv2Tutorial ** folder, with the following content:

    ```json
    {
       "name": "SQLServerToBlobPipeline",
        "properties": {
            "activities": [       
    			{
    				"type": "Copy",
    				"typeProperties": {
    					"source": {
    						"type": "SqlSource"
    					},
    					"sink": {
    						"type":"BlobSink"
    					}
    				},
    				"name": "CopySqlServerToAzureBlobActivity",
    				"inputs": [
    					{
    						"referenceName": "SqlServerDataset",
    						"type": "DatasetReference"
    					}
    				],
    				"outputs": [
    					{
    						"referenceName": "AzureBlobDataset",
    						"type": "DatasetReference"
    					}
    				]
    			}
    		]
    	}
    }
    ```

2. To create the pipeline: **SQLServerToBlobPipeline**, Run the **Set-AzureRmDataFactoryV2Pipeline** cmdlet.

    ```powershell
    Set-AzureRmDataFactoryV2Pipeline -DataFactory $df -Name "SQLServerToBlobPipeline" -File ".\SQLServerToBlobPipeline.json"
    ```

    Here is the sample output:

    ```json
    PipelineName      : SQLServerToBlobPipeline
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : onpremdf0914
    Activities        : {CopySqlServerToAzureBlobActivity}
    Parameters        :  
    ```



## Start and monitor pipeline run

1. Start a pipeline run for "SQLServerToBlobPipeline" pipeline and capture the pipeline run ID for future monitoring.  

    ```powershell
    $runId = Invoke-AzureRmDataFactoryV2PipelineRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName 'SQLServerToBlobPipeline'
    ```

2. Run the following script to continuously check the run status of pipeline "**SQLServerToBlobPipeline**", and print out the final result.

    ```powershell
    while ($True) {
        $result = Get-AzureRmDataFactoryV2ActivityRun -DataFactory $df -PipelineRunId $runId -PipelineName 'SQLServerToBlobPipeline' -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)

        if (($result | Where-Object { $_.Status -eq "InProgress" } | Measure-Object).count -ne 0) {
            Write-Host "Pipeline run status: In Progress" -foregroundcolor "Yellow"
            Start-Sleep -Seconds 30
        }
        else {
            Write-Host "Pipeline 'SQLServerToBlobPipeline' run finished. Result:" -foregroundcolor "Yellow"
            $result
            break
        }
    } 
    ```

    Here is the output of the sample run:

    ```jdon
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    ActivityName      : copy
    PipelineRunId     : 4ec8980c-62f6-466f-92fa-e69b10f33640
    PipelineName      : SQLServerToBlobPipeline
    Input             :  
    Output            :  
    LinkedServiceName : 
    ActivityRunStart  : 9/13/2017 1:35:22 PM
    ActivityRunEnd    : 9/13/2017 1:35:42 PM
    DurationInMs      : 20824
    Status            : Succeeded
    Error             : {errorCode, message, failureType, target}
    ```

3. You can get the run ID of pipeline "**SQLServerToBlobPipeline**", and check the detailed activity run result as the following.

    ```powershell
    Write-Host "Pipeline 'SQLServerToBlobPipeline' run result:" -foregroundcolor "Yellow"
    ($result | Where-Object {$_.ActivityName -eq "CopySqlServerToAzureBlobActivity"}).Output.ToString()
    ```

    Here is the output of the sample run:

    ```json
    {
      "dataRead": 36,
      "dataWritten": 24,
      "rowsCopied": 2,
      "copyDuration": 4,
      "throughput": 0.01,
      "errors": []
    }
    ```
4. Connect to your sink Azure Blob storage and confirm that data has been copied from Azure SQL Database properly.

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create Self-hosted integration runtime
> * Create and encrypt on-prem SQL Server linked service on Self-hosted integration runtime
> * Create Azure Storage linked service.
> * Create SQL Server and Azure Storage datasets.
> * Create a pipeline with a copy activity to move the data.
> * Start a pipeline run.
> * Monitor the pipeline and activity run.

See [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) article for a list of data stores supported by Azure Data Factory as sources and sinks.

