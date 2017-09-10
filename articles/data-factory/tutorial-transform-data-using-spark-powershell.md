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
Azure HDInsight is the a fully-managed cloud Apache Hadoop offering provided by Microsoft that gives you optimized open-source analytic clusters. It is a powerful compute resource commonly used for modern data warehousing data transformation and advanced analytics. 

Using Azure Data Factory, you can easily operationalize your data transformation or advanced analytics tasks using Spark, Hive, Pig or MapReduce, etc. on your HDInsight cluster. In addition to that, Data Factory can help you dynamically create HDInsight clusters only when you have tasks to execute and stop and delete the cluster when tasks are done, so you can more effectively manage the powerful and valuable HDInsight computing resource. 

In this tutorial, you create a Data Factory pipeline that performs data transformation using Spark Activity and an on-demand HDInsight linked service. 

## Prerequisites
* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You create a python script and an input file, and upload them to the Azure storage. The output from the spark program is stored in this storage account. The on-demand Spark cluster uses the same storage account. 
* Install **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).


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
2. Replace &lt;storageAccountName&gt; with the name of your Azure Storage account. Then, save the file. 
3. In your Azure Blob Storage, create a container named adftutorial if it does not exist. 
4. Create a folder named Spark.
5. Create a subfolder named Script under Spark folder. 
6. Upload the WordCount_Spark.py file to the Script subfolder. 


### Upload the input file
1. Create a file named **minecraftstory.txt** with the following content: 

    ```
    Earlier this spring, 45 schoolgirls in matching uniforms crowded into the computer room at the custard-colored North Thanglong Economic & Technical college on the outskirts of Hanoi, Vietnam. Beyond intermittent ripples of laughter and excitement, the 15- and 16-year-olds stayed focused throughout the day on the hard work at hand: playing Minecraft.
    Together they built 3D models that reimagined the darker corners of their neighborhood as a safer, more functional and more beautiful place for them and their families to inhabit. But this wasn¡¯t just an exercise in imagination. The girls were taking part in the newest project from Block by Block, a program from the United Nations and Mojang, the makers of Minecraft, that uses the power of Minecraft and designs sourced from local residents to improve public spaces around the world.
    Thoughtful, inclusive approaches to urban development like this are becoming more critical as the world¡¯s population increasingly moves to cities. Through a combination of birth rate and rural immigration, Hanoi has nearly doubled its population since the year 2000. And it¡¯s not alone. Cities around the globe are swelling by a total of some 200,000 people per day.
    For the first time in history, the majority of the planet¡¯s population now lives in urban areas. Within a generation, that number will balloon to more than two-thirds of all people. Public space ¡ª from parks to markets and even streets themselves ¡ª is a key indicator of the health and sustainability of cities.
    ```
2. Create a subfolder named **inputfiles** in the **spark** folder. 
3. Upload the **minecraftstory.txt** to the **inputfiles** subfolder. 

## End-to-end workflow
At a high level, this sample involves following steps: 

1. Author linked services.
2. Authoring a pipeline that contains the Spark activity.
3. Create a new Data Factory and deploy the Linked Services and Pipeline to the Data Factory.
4. Start a pipeline run and monitor the result.

## Author linked services
You author two Linked Services in this section: 
	
- An Azure Storage Linked Service that links an Azure Storage account to the data factory. This storage is used by the on-demand HDInsight cluster. It also contains the Spark scrip to be executed. 
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
- **servicePrincipalId**, **servicePrincipalKey**. Replace &lt;servicePrincipalID&gt; and &lt;servicePrinicalKey&gt; with ID and key of your service prinical in the Azure Active Directory. See [create Azure Active Directory application and service principal](../azure-resource-manager/resource-group-create-service-principal-portal.md) for details. 
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

1. Ser variables.

    ```powershell
    $subscriptionID = "<subscription ID>" # Your Azure subscription ID
    $resourceGroupName = "ADFTutorialResourceGroup" # Name of the resource group
    $dataFactoryName = "MyDataFactory09102017" # Name of the data factory
    $pipelineName = "MySparkOnDemandPipeline" # Name of the pipeline
    $loggingStorageAccountName = "<storageAccountName>" # Name of your Azure Storage account
    $loggingStorageAccountKey = "<storageAccountKey>" # Key of your Azure Storage account     
    ```
2. Login to your Azure account and select your subscription ID.
   
    ```powershell
    Login-AzureRmAccount
    Select-AzureRmSubscription -SubscriptionId $subscriptionID 
    ```  
3. Create the resource group and data factory.

    ```powershell
    New-AzureRmResourceGroup -Name $resourceGroupName -Location "East Us" 
    New-AzureRmDataFactoryV2 -Location EastUS -LoggingStorageAccountName $loggingStorageAccountName -LoggingStorageAccountKey $loggingStorageAccountKey -Name $dataFactoryName -ResourceGroupName $resourceGroupName
    ```
4. Deploy the linked service and pipeline definitions. 
       
    ```powershell
    df = Get-AzureRmDataFactoryV2 -ResourceGroupName $rgName -Name $dfName
    New-AzureRmDataFactoryV2LinkedService -DataFactory $df -Name "MyStorageLinkedService" -File "MyStorageLinkedService.json"
    New-AzureRmDataFactoryV2LinkedService -DataFactory $df -Name "MyOnDemandSparkLinkedService" -File "MyOnDemandSparkLinkedService.json"
    New-AzureRmDataFactoryV2Pipeline -dataFactory $df -Name $plName -File "MySparkOnDemandPipeline.json"
    ```

## Start and monitor pipeline run  
1. Start a pipeline run.

    ```powershell
    $runId = New-AzureRmDataFactoryV2PipelineRun -dataFactory $df -PipelineName $pipelineName 
    ```
2. Get the status of the pipeline run. 

    ```powershell
    Get-AzureRmDataFactoryV2ActivityRun -dataFactory $df -PipelineName $pipelineName -PipelineRunId $runId -RunStartedAfter "…" -RunStartedBefore "…"
    ```