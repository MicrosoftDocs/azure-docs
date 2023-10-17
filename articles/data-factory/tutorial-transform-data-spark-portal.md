---
title: 'Transform data by using Spark in Azure Data Factory '
description: 'This tutorial provides step-by-step instructions for transforming data by using a Spark activity in Azure Data Factory.'
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
author: nabhishek
ms.author: abnarain
ms.date: 01/11/2023
---
# Transform data in the cloud by using a Spark activity in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you use the Azure portal to create an Azure Data Factory pipeline. This pipeline transforms data by using a Spark activity and an on-demand Azure HDInsight linked service. 

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory. 
> * Create a pipeline that uses a Spark activity.
> * Trigger a pipeline run.
> * Monitor the pipeline run.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* **Azure storage account**. You create a Python script and an input file, and you upload them to Azure Storage. The output from the Spark program is stored in this storage account. The on-demand Spark cluster uses the same storage account as its primary storage.  

> [!NOTE]
> HdInsight supports only general-purpose storage accounts with standard tier. Make sure that the account is not a premium or blob only storage account.

* **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).


### Upload the Python script to your Blob storage account
1. Create a Python file named **WordCount_Spark.py** with the following content: 

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
1. Replace *&lt;storageAccountName&gt;* with the name of your Azure storage account. Then, save the file. 
1. In Azure Blob storage, create a container named **adftutorial** if it does not exist. 
1. Create a folder named **spark**.
1. Create a subfolder named **script** under the **spark** folder. 
1. Upload the **WordCount_Spark.py** file to the **script** subfolder. 


### Upload the input file
1. Create a file named **minecraftstory.txt** with some text. The Spark program counts the number of words in this text. 
1. Create a subfolder named **inputfiles** in the **spark** folder. 
1. Upload the **minecraftstory.txt** file to the **inputfiles** subfolder. 

## Create a data factory

Follow the steps in the article [Quickstart: Create a data factory by using the Azure portal](quickstart-create-data-factory.md) to create a data factory if you don't already have one to work with.

## Create linked services
You author two linked services in this section: 
    
- An **Azure Storage linked service** that links an Azure storage account to the data factory. This storage is used by the on-demand HDInsight cluster. It also contains the Spark script to be run. 
- An **on-demand HDInsight linked service**. Azure Data Factory automatically creates an HDInsight cluster and runs the Spark program. It then deletes the HDInsight cluster after the cluster is idle for a preconfigured time. 

### Create an Azure Storage linked service

1. On the home page, switch to the **Manage** tab in the left panel. 

   :::image type="content" source="media/doc-common-process/get-started-page-manage-button.png" alt-text="Screenshot that shows the Manage tab.":::

1. Select **Connections** at the bottom of the window, and then select **+ New**. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/new-connection.png" alt-text="Buttons for creating a new connection":::
1. In the **New Linked Service** window, select **Data Store** > **Azure Blob Storage**, and then select **Continue**. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/select-azure-storage.png" alt-text="Selecting the &quot;Azure Blob Storage&quot; tile":::
1. For **Storage account name**, select the name from the list, and then select **Save**. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/new-azure-storage-linked-service.png" alt-text="Box for specifying the storage account name":::


### Create an on-demand HDInsight linked service

1. Select the **+ New** button again to create another linked service. 
1. In the **New Linked Service** window, select **Compute** > **Azure HDInsight**, and then select **Continue**. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/select-azure-hdinsight.png" alt-text="Selecting the &quot;Azure HDInsight&quot; tile":::
1. In the **New Linked Service** window, complete the following steps: 

   a. For **Name**, enter **AzureHDInsightLinkedService**.
   
   b. For **Type**, confirm that **On-demand HDInsight** is selected.
   
   c. For **Azure Storage Linked Service**, select **AzureBlobStorage1**. You created this linked service earlier. If you used a different name, specify the right name here. 
   
   d. For **Cluster type**, select **spark**.
   
   e. For **Service principal id**, enter the ID of the service principal that has permission to create an HDInsight cluster. 
   
      This service principal needs to be a member of the Contributor role of the subscription or the resource group in which the cluster is created. For more information, see [Create a Microsoft Entra application and service principal](../active-directory/develop/howto-create-service-principal-portal.md). The **Service principal id** is equivalent to the *Application ID*, and a **Service principal key** is equivalent to the value for a *Client secret*.
   
   f. For **Service principal key**, enter the key. 
   
   g. For **Resource group**, select the same resource group that you used when you created the data factory. The Spark cluster is created in this resource group. 
   
   h. Expand **OS type**.
   
   i. Enter a name for **Cluster user name**. 
   
   j. Enter the **Cluster password** for the user. 
   
   k. Select **Finish**. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/azure-hdinsight-linked-service-settings.png" alt-text="HDInsight linked service settings":::

> [!NOTE]
> Azure HDInsight limits the total number of cores that you can use in each Azure region that it supports. For the on-demand HDInsight linked service, the HDInsight cluster is created in the same Azure Storage location that's used as its primary storage. Ensure that you have enough core quotas for the cluster to be created successfully. For more information, see [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md). 

## Create a pipeline

1. Select the **+** (plus) button, and then select **Pipeline** on the menu.

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/new-pipeline-menu.png" alt-text="Buttons for creating a new pipeline":::
1. In the **Activities** toolbox, expand **HDInsight**. Drag the **Spark** activity from the **Activities** toolbox to the pipeline designer surface. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/drag-drop-spark-activity.png" alt-text="Dragging the Spark activity":::
1. In the properties for the **Spark** activity window at the bottom, complete the following steps: 

   a. Switch to the **HDI Cluster** tab.
   
   b. Select **AzureHDInsightLinkedService** (which you created in the previous procedure). 
        
   :::image type="content" source="./media/tutorial-transform-data-spark-portal/select-hdinsight-linked-service.png" alt-text="Specifying the HDInsight linked service":::
1. Switch to the **Script/Jar** tab, and complete the following steps: 

   a. For **Job Linked Service**, select **AzureBlobStorage1**.
   
   b. Select **Browse Storage**.

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/specify-spark-script.png" alt-text="Specifying the Spark script on the &quot;Script/Jar&quot; tab":::
   
   c. Browse to the **adftutorial/spark/script** folder, select **WordCount_Spark.py**, and then select **Finish**.      

1. To validate the pipeline, select the **Validate** button on the toolbar. Select the **>>** (right arrow) button to close the validation window. 
    
   :::image type="content" source="./media/tutorial-transform-data-spark-portal/validate-button.png" alt-text="&quot;Validate&quot; button":::
1. Select **Publish All**. The Data Factory UI publishes entities (linked services and pipeline) to the Azure Data Factory service. 
    
   :::image type="content" source="./media/tutorial-transform-data-spark-portal/publish-button.png" alt-text="&quot;Publish All&quot; button":::


## Trigger a pipeline run
Select **Add Trigger** on the toolbar, and then select **Trigger Now**. 

:::image type="content" source="./media/tutorial-transform-data-spark-portal/trigger-now-menu.png" alt-text="&quot;Trigger&quot; and &quot;Trigger Now&quot; buttons":::

## Monitor the pipeline run

1. Switch to the **Monitor** tab. Confirm that you see a pipeline run. It takes approximately 20 minutes to create a Spark cluster. 
   
1. Select **Refresh** periodically to check the status of the pipeline run. 

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/monitor-tab.png" alt-text="Tab for monitoring pipeline runs, with &quot;Refresh&quot; button":::

1. To see activity runs associated with the pipeline run, select **View Activity Runs** in the **Actions** column.

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/pipeline-run-succeeded.png" alt-text="Pipeline run status"::: 

   You can switch back to the pipeline runs view by selecting the **All Pipeline Runs** link at the top.

   :::image type="content" source="./media/tutorial-transform-data-spark-portal/activity-runs.png" alt-text="&quot;Activity Runs&quot; view":::

## Verify the output
Verify that the output file is created in the spark/otuputfiles/wordcount folder of the adftutorial container. 

:::image type="content" source="./media/tutorial-transform-data-spark-portal/verity-output.png" alt-text="Location of the output file":::

The file should have each word from the input text file and the number of times the word appeared in the file. For example: 

```
(u'This', 1)
(u'a', 1)
(u'is', 1)
(u'test', 1)
(u'file', 1)
```

## Next steps
The pipeline in this sample transforms data by using a Spark activity and an on-demand HDInsight linked service. You learned how to: 

> [!div class="checklist"]
> * Create a data factory. 
> * Create a pipeline that uses a Spark activity.
> * Trigger a pipeline run.
> * Monitor the pipeline run.

To learn how to transform data by running a Hive script on an Azure HDInsight cluster that's in a virtual network, advance to the next tutorial: 

> [!div class="nextstepaction"]
> [Tutorial: Transform data using Hive in Azure Virtual Network](tutorial-transform-data-hive-virtual-network-portal.md).
