---
title: 'Tutorial: Create on-demand Hadoop clusters in Azure HDInsight using Data Factory | Microsoft Docs'
description: Learn how to create on-demand Hadoop clusters in HDInsight using Azure Data Factory.
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: spelluru
manager: jhubbard
editor: cgronlun

ms.assetid: 1f3b3a78-4d16-4d99-ba6e-06f7bb185d6a
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: conceptual
ms.date: 05/07/2018
ms.author: spelluru
#Customer intent: As a data worker, I need to create a Hadoop cluster and run Hive jobs on demand

---
# Tutorial: Create on-demand Hadoop clusters in HDInsight using Azure Data Factory
[!INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

In this article, you learn how to create a Hadoop cluster, on demand, in Azure HDInsight using Azure Data Factory. You then use data pipelines in Azure Data Factory to run Hive jobs and delete the cluster. By the end of this tutorial, you learn how to operationalize a big data job run where cluster creation, job run, and cluster deletion is performed on a schedule.

This tutorial covers the following tasks: 

> [!div class="checklist"]
> * Create an Azure storage account
> * Understand Azure Data Factory activity
> * Create a data factory using Azure portal
> * Create a table in Azure SQL database
> * Use Sqoop to export data to Azure SQL database

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0).

## Create an Azure storage account

In this section, you create a storage account that will be used as the default storage for the HDInsight cluster you create on-demand. This storage account also contains the sample HiveQL script (**hivescript.hql**) that you use to simulate a sample Hive job that runs on the cluster.

This section uses an Azure PowerShell script to create the storage account and copy over the required files within the storage account. The Azure PowerShell sample script in this section performs the following tasks:

1. Logs in to Azure.
2. Creates an Azure resource group.
3. Creates an Azure Storage account.
4. Creates a Blob container in the storage account
5. Copies the sample HiveQL script (**hivescript.hql**) the Blob container. The script is available at [https://hditutorialdata.blob.core.windows.net/adfv2hiveactivity/hivescripts/hivescript.hql](https://hditutorialdata.blob.core.windows.net/adfhiveactivity/script/partitionweblogs.hql). The sample script is already available in another public Blob container. The PowerShell script below makes a copy of these files into the Azure Storage account it creates.


**To create a storage account and copy the files using Azure PowerShell:**
> [!IMPORTANT]
> Specify names for the Azure resource group and the Azure storage account that will be created by the script.
> Write down **resource group name**, **storage account name**, and **storage account key** outputted by the script. You need them in the next section.

```powershell
$resourceGroupName = "<Azure Resource Group Name>"
$storageAccountName = "<Azure Storage Account Name>"
$location = "East US 2"

$sourceStorageAccountName = "hditutorialdata"  
$sourceContainerName = "adfv2hiveactivity"

$destStorageAccountName = $storageAccountName
$destContainerName = "adfgetstarted" # don't change this value.

####################################
# Connect to Azure
####################################
#region - Connect to Azure subscription
Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
Login-AzureRmAccount
#endregion

####################################
# Create a resource group, storage, and container
####################################

#region - create Azure resources
Write-Host "`nCreating resource group, storage account and blob container ..." -ForegroundColor Green

New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
New-AzureRmStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $destStorageAccountName `
    -type Standard_LRS `
    -Location $location

$destStorageAccountKey = (Get-AzureRmStorageAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $destStorageAccountName)[0].Value

$sourceContext = New-AzureStorageContext `
    -StorageAccountName $sourceStorageAccountName `
    -Anonymous
$destContext = New-AzureStorageContext `
    -StorageAccountName $destStorageAccountName `
    -StorageAccountKey $destStorageAccountKey

New-AzureStorageContainer -Name $destContainerName -Context $destContext
#endregion

####################################
# Copy files
####################################
#region - copy files
Write-Host "`nCopying files ..." -ForegroundColor Green

$blobs = Get-AzureStorageBlob `
    -Context $sourceContext `
    -Container $sourceContainerName

$blobs|Start-AzureStorageBlobCopy `
    -DestContext $destContext `
    -DestContainer $destContainerName

Write-Host "`nCopied files ..." -ForegroundColor Green
Get-AzureStorageBlob -Context $destContext -Container $destContainerName
#endregion

Write-host "`nYou will use the following values:" -ForegroundColor Green
write-host "`nResource group name: $resourceGroupName"
Write-host "Storage Account Name: $destStorageAccountName"
write-host "Storage Account Key: $destStorageAccountKey"

Write-host "`nScript completed" -ForegroundColor Green
```

**To verify the storage account creation**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **Resource groups** on the left pane.
3. Double-click the resource group name you created in your PowerShell script. Use the filter if you have too many resource groups listed.
4. On the **Resources** tile, you see one resource listed unless you share the resource group with other projects. That resource is the storage account with the name you specified earlier. Click the storage account name.
5. Click the **Blobs** tiles.
6. Click the **adfgetstarted** container. You see a folder called **hivescripts**.
7. Open the folder and make sure it contains the sample script file, **hivescript.hql**.

## Understand the Azure Data Factory activity

[Azure Data Factory](../data-factory/introduction.md) orchestrates and automates the movement and transformation of data. Azure Data Factory can create an HDInsight Hadoop cluster just-in-time to process an input data slice and delete the cluster when the processing is complete. 

In Azure Data Factory, a data factory can have one or more data pipelines. A data pipeline has one or more activities. There are two types of activities:

* [Data Movement Activities](../data-factory/copy-activity-overview.md) - You use data movement activities to move data from a source data store to a destination data store.
* [Data Transformation Activities](../data-factory/transform-data.md). You use data transformation activities to transform/process data. HDInsight Hive Activity is one of the transformation activities supported by Data Factory. You use the Hive transformation activity in this tutorial.

In this article, you configure the Hive activity to create an on-demand HDInsight Hadoop cluster. When the activity runs to process data, here is what happens:

1. An HDInsight Hadoop cluster is automatically created for you just-in-time to process the slice. 

2. The input data is processed by running a HiveQL script on the cluster. In this tutorial, the HiveQL script associated with the hive activity performs the following actions:

    * Uses the existing table (*hivesampletable*) to create another table **HiveSampleOut**.
    * Populates the **HiveSampleOut** table with only specific columns from the original *hivesampletable*.

3. The HDInsight Hadoop cluster is deleted after the processing is complete and the cluster is idle for the configured amount of time (timeToLive setting). If the next data slice is available for processing with in this timeToLive idle time, the same cluster is used to process the slice.  

## Create a data factory

1. Log in to the [Azure portal](https://portal.azure.com/).

2. In the Azure portal, select **Create a resource** > **Data + Analytics** > **Data Factory**.

    ![Azure Data Factory on the portal](./media/hdinsight-hadoop-create-linux-clusters-adf/data-factory-azure-portal.png "Azure Data Factory on the portal")

2. Enter or select the values as shown in the following screenshot:

    ![Create Azure Data Factory using Azure portal](./media/hdinsight-hadoop-create-linux-clusters-adf/create-data-factory-portal.png "Create Azure Data Factory using Azure portal")

    Enter or select the following values:
    
    |Property  |Description  |
    |---------|---------|
    |**Name** |  Enter a name for the data factory. This name must be globally unique.|
    |**Subscription**     |  Select your Azure subscription. |
    |**Resource group**     | Select **Use existing** and then select the resource group you created using the PowerShell script. |
    |**Version**     | Select **V2 (Preview)** |
    |**Location**     | This is automatically set to the location you specified while creating the resource group earlier. For this tutorial, this is set to **East US 2**. |
    

3. Select **Pin to dashboard**, and then select **Create**. You shall see a new tile titled **Submitting deployment** on the portal dashboard. Creating a data factory might take anywhere between 2 to 4 minutes.

    ![Template deployment progress](./media/hdinsight-hadoop-create-linux-clusters-adf/deployment-progress-tile.png "Template deployment progress") 
 
4. Once the data factory is created, the portal shows the overview for the data factory.

    ![Template deployment progress](./media/hdinsight-hadoop-create-linux-clusters-adf/data-factory-portal-overview.png "Template deployment progress")

## Create linked services

In this section, you create 

### Check the data factory output

1. Use the same procedure in the last session to check the containers of the adfgetstarted container. There are two new containers in addition to **adfgetsarted**:

   * A container with name that follows the pattern: `adf<yourdatafactoryname>-linkedservicename-datetimestamp`. This container is the default container for the HDInsight cluster.
   * adfjobs: This container is the container for the ADF job logs.

     The data factory output is stored in **afgetstarted** as you configured in the Resource Manager template.
2. Click **adfgetstarted**.
3. Double-click **partitioneddata**. You see a **year=2014** folder because all the web logs are dated in year 2014.

    ![Azure Data Factory HDInsight on-demand Hive activity pipeline output](./media/hdinsight-hadoop-create-linux-clusters-adf/hdinsight-adf-output-year.png)

    If you drill down the list, you shall see three folders for January, February, and March. And there is a log for each month.

    ![Azure Data Factory HDInsight on-demand Hive activity pipeline output](./media/hdinsight-hadoop-create-linux-clusters-adf/hdinsight-adf-output-month.png)



## Clean up the tutorial

### Delete the blob containers created by on-demand HDInsight cluster
With on-demand HDInsight linked service, an HDInsight cluster is created every time a slice needs to be processed unless there is an existing live cluster (timeToLive); and the cluster is deleted when the processing is done. For each cluster, Azure Data Factory creates a blob container in the Azure blob storage used as the default stroage account for the cluster. Even though HDInsight cluster is deleted, the default blob storage container and the associated storage account are not deleted. This behavior is by design. As more slices are processed, you see many containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The names of these containers follow a pattern: `adfyourdatafactoryname-linkedservicename-datetimestamp`.

Delete the **adfjobs** and **adfyourdatafactoryname-linkedservicename-datetimestamp** folders. The adfjobs container contains job logs from Azure Data Factory.

### Delete the resource group
[Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) is used to deploy, manage, and monitor your solution as a group.  Deleting a resource group deletes all the components inside the group.  

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **Resource groups** on the left pane.
3. Click the resource group name you created in your PowerShell script. Use the filter if you have too many resource groups listed. It opens the resource group in a new blade.
4. On the **Resources** tile, you shall have the default storage account and the data factory listed unless you share the resource group with other projects.
5. Click **Delete** on the top of the blade. Doing so deletes the storage account and the data stored in the storage account.
6. Enter the resource group name to confirm deletion, and then click **Delete**.


## Next steps
In this article, you have learned how to use Azure Data Factory to create on-demand HDInsight cluster to process Hive jobs. To read more:

* [Hadoop tutorial: Get started using Linux-based Hadoop in HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
* [HDInsight documentation](https://azure.microsoft.com/documentation/services/hdinsight/)
* [Data factory documentation](https://azure.microsoft.com/documentation/services/data-factory/)

