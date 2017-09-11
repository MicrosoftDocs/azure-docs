---
title: Transform data using Spark in Azure Data Factory | Microsoft Docs
description: This tutorial provides step-by-step instructions for transforming data by using Spark Activity in Azure Data Factory.
services: data-factory
documentationcenter: ''
author: shengcmsft
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/10/2017
ms.author: shengc

---

# Tutorial: Transform data in cloud using Spark Activity in Azure Data Factory
Using Azure Data Factory, you can easily operationalize your data transformation or advanced analytics tasks using Spark, Hive, Pig, or MapReduce, etc. on your HDInsight cluster. In addition to that, Data Factory can help you dynamically create HDInsight clusters only when you have tasks to execute and stop and delete the cluster when tasks are done, so you can more effectively manage the powerful and valuable HDInsight computing resource. 

In this tutorial, you create a Data Factory pipeline that performs data transformation using Spark Activity and an on-demand HDInsight linked service. 

> [!div class="checklist"]
> * Author linked services.
> * Author a pipeline that contains a Spark activity.
> * Create a data factory. 
> * Deploy linked services.
> * Deploy the pipeline. 
> * Start a pipeline run.
> * Monitor the pipeline run.


## Prerequisites
* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You create a python script and an input file, and upload them to the Azure storage. The output from the spark program is stored in this storage account. The on-demand Spark cluster uses the same storage account. 
* **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).


### Upload python script to your Blob Storage account
1. Create a python file named **WordCount_Spark.py** with the following content: 

    ```python
    import sys
    from operator import add
    
    from pyspark.sql import SparkSession
    
    def main():
        spark = SparkSession\
            .builder\
            .appName("PythonWordCount")\
            .getOrCreate()
    		
        lines = spark.read.text("wasbs://adftutorial@<storageaccountname>.blob.core.windows.net/spark/inputfiles/minecraftstory.txt").rdd.map(lambda r: r[0])
        counts = lines.flatMap(lambda x: x.split(' ')) \
            .map(lambda x: (x, 1)) \
            .reduceByKey(add)
        counts.saveAsTextFile("wasbs://adftutorial@<storageaccountname>.blob.core.windows.net/spark/outputfiles/wordcount")
        
        spark.stop()
    
    if __name__ == "__main__":
    	main()
    ```
2. Replace **&lt;storageAccountName&gt;** with the name of your Azure Storage account. Then, save the file. 
3. In your Azure Blob Storage, create a container named **adftutorial** if it does not exist. 
4. Create a folder named **spark**.
5. Create a subfolder named **script** under **spark** folder. 
6. Upload the **WordCount_Spark.py** file to the **script** subfolder. 


### Upload the input file
1. Create a file named **minecraftstory.txt** with the following content: 

    ```
    Earlier this spring, 45 schoolgirls in matching uniforms crowded into the computer room at the custard-colored North Thanglong Economic & Technical college on the outskirts of Hanoi, Vietnam. Beyond intermittent ripples of laughter and excitement, the 15- and 16-year-olds stayed focused throughout the day on the hard work at hand: playing Minecraft.
    Together they built 3D models that reimagined the darker corners of their neighborhood as a safer, more functional and more beautiful place for them and their families to inhabit. But this wasn¡¯t just an exercise in imagination. The girls were taking part in the newest project from Block by Block, a program from the United Nations and Mojang, the makers of Minecraft, that uses the power of Minecraft and designs sourced from local residents to improve public spaces around the world.
    Thoughtful, inclusive approaches to urban development like this are becoming more critical as the world¡¯s population increasingly moves to cities. Through a combination of birth rate and rural immigration, Hanoi has nearly doubled its population since the year 2000. And it¡¯s not alone. Cities around the globe are swelling by a total of some 200,000 people per day.
    For the first time in history, the majority of the planet¡¯s population now lives in urban areas. Within a generation, that number will balloon to more than two-thirds of all people. Public space ¡ª from parks to markets and even streets themselves ¡ª is a key indicator of the health and sustainability of cities.
    ```
2. Create a subfolder named `inputfiles` in the `spark` folder. 
3. Upload the `minecraftstory.txt` to the `inputfiles` subfolder. 

## End-to-end workflow
At a high level, this sample involves following steps: 

1. Author linked services.
2. Author a pipeline that contains a Spark activity.
3. Create a data factory. 
4. Deploy linked services.
5. Deploy the pipeline. 
6. Start a pipeline run.
7. Monitor the pipeline run.

## Author linked services
You author two Linked Services in this section: 
	
- An Azure Storage Linked Service that links an Azure Storage account to the data factory. This storage is used by the on-demand HDInsight cluster. It also contains the Spark script to be executed. 
- An On-Demand HDInsight Linked Service. Azure Data Factory automatically creates a HDInsight cluster, run the Spark program, and then deletes the HDInsight cluster after it's idle for a pre-configured time. 

### Azure Storage linked service
Create a JSON file using your preferred editor, copy the following JSON definition of an Azure Storage linked service, and then save the file as **MyStorageLinkedService.json**.  

```json
{
    "name": "MyStorageLinkedService",
    "properties": {
      "type": "AzureStorage",
      "typeProperties": {
        "connectionString": {
          "value": "DefaultEndpointsProtocol=https;AccountName=<storageAccountName>;AccountKey=<storageAccountKey>",
          "type": "SecureString"
        }
      }
    }
}
```
Update the &lt;storageAccountName&gt; and &lt;storageAccountKey&gt; with the name and key of your Azure Storage account. 


### On-demand HDInsight linked service
Create a JSON file using your preferred editor, copy the following JSON definition of an Azure HDInsight linked service, and save the file as **MyOnDemandSparkLinkedService.json**.  

```json
{
    "name": "MyOnDemandSparkLinkedService",
    "properties": {
      "type": "HDInsightOnDemand",
      "typeProperties": {
        "clusterSize": 2,
        "clusterType": "spark",
        "timeToLive": "00:15:00",
        "hostSubscriptionId": "<subscriptionID> ",
        "servicePrincipalId": "<servicePrincipalID>",
        "servicePrincipalKey": {
          "value": "<servicePrincipalKey>",
          "type": "SecureString"
        },
        "tenant": "<tenant ID>",
        "clusterResourceGroup": "<resourceGroupofHDICluster>",
        "version": "3.6",
        "osType": "Linux",
        "clusterNamePrefix":"ADFSparkSample",
        "linkedServiceName": {
          "referenceName": "MyStorageLinkedService",
          "type": "LinkedServiceReference"
        }
      }
    }
}
```
Update values for the following properties in the linked service definition: 

- **hostSubscriptionId**. Replace &lt;subscriptionID&gt; with the ID of your Azure subscription. The on-demand HDInsight cluster is created in this subscription. 
- **tenant**. Replace &lt;tenantID&gt; with ID of your Azure tenant. 
- **servicePrincipalId**, **servicePrincipalKey**. Replace &lt;servicePrincipalID&gt; and &lt;servicePrinicalKey&gt; with ID and key of your service principal in the Azure Active Directory. See [create Azure Active Directory application and service principal](../azure-resource-manager/resource-group-create-service-principal-portal.md) for details. 
- **clusterResourceGroup**. Replace &ltresourceGroupOfHDICluster&gt; with the name of the resource group in which the HDInsight cluster needs to be created. 


## Author a pipeline 
In this step, you create a new pipeline with a Spark activity. The activity uses the **word count** sample. Download the contents from this location if you haven't already done so.

Create a JSON file in your preferred editor, copy the following JSON definition of a pipeline definition, and save it as **MySparkOnDemandPipeline.json**. 

```json
{
  "name": "MySparkOnDemandPipeline",
  "properties": {
    "activities": [
      {
        "name": "MySparkActivity",
        "type": "HDInsightSpark",
        "linkedServiceName": {
            "referenceName": "MyOnDemandSparkLinkedService",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
          "rootPath": "adftutorial/spark",
          "entryFilePath": "script/WordCount_Spark.py",
          "getDebugInfo": "Failure",
          "sparkJobLinkedService": {
            "referenceName": "MyStorageLinkedService",
            "type": "LinkedServiceReference"
          }
        }
      }
    ]
  }
}
```

Note the following points: 

- rootPath points to the spark folder of the adftutorial container. 
- entryFilePath points to the WordCount_Spark.py file in the script sub folder of the spark folder. 


## Create data factory 
You have authored linked service and pipeline definitions in JSON files. Now, let’s create a data factory, and deploy the linked Service and pipeline JSON files by using PowerShell cmdlets. Run the following PowerShell commands one by one: 

1. Set variables one by one.

    ```powershell
    $subscriptionID = "<subscription ID>" # Your Azure subscription ID
    $resourceGroupName = "ADFTutorialResourceGroup" # Name of the resource group
    $dataFactoryName = "MyDataFactory09102017" # Globally unique name of the data factory
    $pipelineName = "MySparkOnDemandPipeline" # Name of the pipeline
    $loggingStorageAccountName = "<storageAccountName>" # Name of your Azure Storage account
    $loggingStorageAccountKey = "<storageAccountKey>" # Key of your Azure Storage account     
    ```
2. Launch **PowerShell**. Keep Azure PowerShell open until the end of this quickstart. If you close and reopen, you need to run the commands again.

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
3. Create the resource group: ADFTutorialResourceGroup, and the data factory named `$dataFactoryName`. The name of the data factory must be globally unique. 

    ```powershell
    New-AzureRmResourceGroup -Name $resourceGroupName -Location "East Us" 
    ```
4. Create the data factory. 

    ```powershell
     $df = New-AzureRmDataFactoryV2 -Location EastUS -LoggingStorageAccountName $loggingStorageAccountName -LoggingStorageAccountKey $loggingStorageAccountKey -Name $dataFactoryName -ResourceGroupName $resourceGroupName
    ```

    Execute the following command to see the output: 

    ```powershell
    $df
    ```
5. Switch to the folder where you created JSON files, and run the following command to deploy an Azure Storage linked service: 
       
    ```powershell
    New-AzureRmDataFactoryV2LinkedService -DataFactory $df -Name "MyStorageLinkedService" -File "MyStorageLinkedService.json"
    ```
6. Run the following command to deploy an on-demand Spark linked service: 
       
    ```powershell
    New-AzureRmDataFactoryV2LinkedService -DataFactory $df -Name "MyOnDemandSparkLinkedService" -File "MyOnDemandSparkLinkedService.json"
    ```
7. Run the following command to deploy a pipeline: 
       
    ```powershell
    New-AzureRmDataFactoryV2Pipeline -dataFactory $df -Name $pipelineName -File "MySparkOnDemandPipeline.json"
    ```
    
## Start and monitor pipeline run  

1. Start a pipeline run. It also captures the pipeline run ID for future monitoring.

    ```powershell
    $runId = New-AzureRmDataFactoryV2PipelineRun -dataFactory $df -PipelineName $pipelineName  -Parameters @{ dummy = "b"}
    ```
2. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
    while ($True) {
        $run = Get-AzureRmDataFactoryV2PipelineRun -DataFactory $df -RunId $runId -ErrorAction Stop
        Write-Host  "Pipeline run status: " $run.Status -foregroundcolor "Yellow"

        if ($run.Status -eq "InProgress") {
            Start-Sleep -Seconds 300
        }
        else {
            $run
            break
        }
    }
    ```  

    Here is the output of the sample run: 

    ```json
    Pipeline run status:  InProgress
    Pipeline run status:  InProgress
    Pipeline run status:  Succeeded

    Key                  : 35792305-f328-41ce-8e15-b964bc24f2d4
    Timestamp            : 9/10/2017 10:38:39 PM
    RunId                : 35792305-f328-41ce-8e15-b964bc24f2d4
    DataFactoryName      : MyDataFactory09102017
    PipelineName         : MySparkOnDemandPipeline
    Parameters           : {}
    ParametersCount      : 0
    ParameterNames       : {}
    ParameterNamesCount  : 0
    ParameterValues      : {}
    ParameterValuesCount : 0
    RunStart             : 9/10/2017 10:25:55 PM
    RunEnd               : 9/10/2017 10:38:39 PM
    DurationInMs         : 763623
    Status               : Succeeded
    Message              :
    ```

3. Run the following command: 

    ```powershell
    Get-AzureRmDataFactoryV2ActivityRun -dataFactory $df -PipelineName $pipelineName -PipelineRunId $runId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(10)
    ```
    
    Here is the sample output: 

    ```json
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : MyDataFactory09102017
    ActivityName      : MySparkActivity
    Timestamp         : 9/10/2017 10:38:36 PM
    PipelineRunId     : 35792305-f328-41ce-8e15-b964bc24f2d4
    PipelineName      : MySparkOnDemandPipeline
    Input             : {rootPath, entryFilePath, getDebugInfo, sparkJobLinkedService}
    Output            : {clusterInUse, jobId, ExecutionProgress}
    LinkedServiceName :
    ActivityStart     : 9/10/2017 10:25:59 PM
    ActivityEnd       : 9/10/2017 10:38:36 PM
    Duration          :
    Status            : Succeeded
    Error             : {errorCode, message, failureType, target}
    ```

4. Confirm that a folder named `outputfiles` is created in the `spark` folder of adftutorial container with the output from the spark program. 