---
title: 'Quickstart: Create Azure Databricks workspace by using the Azure portal | Microsoft Docs'
description: The quickstart shows how to use the Azure portal to create an Azure Databricks workspace.
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: cgronlun

ms.service: azure-databricks
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: nitinme

---

# Quickstart: Get started with Azure Databricks using the Azure portal

This quickstart shows how to create an Azure Databricks workspace and an Apache Spark cluster within that workspace. You also learn how to access Azure storage from a Databricks Spark cluster. For more information on Azure Databricks, see [What is Azure Databricks?](what-is-azure-databricks.md)

## Log in to the Azure portal

Log in to the [Azure  portal](https://portal.azure.com).

## Create a Databricks workspace

Before you begin with this quickstart, you need to [Create an Azure storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account).

1. Click **+**, click **Data + Analytics**, and then click **Azure Databricks (Preview)**. Under **Azure Databricks**, click **Create**.

    > [!NOTE]
    > Azure Databricks is currently in limited preview. If your Azure subscription is not whitelisted for the preview, you must fill out the [sign up form](https://databricks.azurewebsites.net/).  

2. Under **Azure Databricks Service**, provide the following values:

    ![Create an Azure Databricks workspace](./media/quickstart-create-databricks-workspace-portal/create-databricks-workspace.png "Create an Azure Databricks workspace")

    * For **Workspace name**, provide a name for your Databricks workspace.
    * For **Subscription**, from the drop-down, select your Azure subscription.
    * For **Resource group**, specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../azure-resource-manager/resource-group-overview.md).
    * For **Location**, select **East US 2**. For other available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/).

3. Click **Create**.

## Create an Apache Spark cluster in Databricks

1. In the Azure portal, go to the Databricks workspace that you created, and then click **Initialize Workspace**.

2. You are redirected to the Azure Databricks portal. From the portal, click **Cluster**.

    ![Databricks on Azure](./media/quickstart-create-databricks-workspace-portal/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, provide the values to create a cluster., accept all other default values, and then click .

    ![Create Databricks Spark cluster on Azure](./media/quickstart-create-databricks-workspace-portal/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

    * Enter a name for the cluster.
    * Make sure you select the **Terminate after ___ minutes of activity** checkbox. You must also provide a duration (in minutes) to terminate the cluster if the cluster is not being used. 
    * Click **Create cluster**.

    For more information on creating clusters, see [Create a Spark cluster in Azure Databricks](https://docs.azuredatabricks.net/user-guide/clusters/create.html).

    Once the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

## Access Azure Blob storage from the cluster

In this section, you create a notebook and then configure the notebook to read data from an Azure Blob storage account.

1. In the left pane, click **Workspace**. From the **Workspace** drop-down, click **Create** and then click **Notebook**.

    ![Create notebook in databricks](./media/quickstart-create-databricks-workspace-portal/databricks-create-notebook.png "Create notebook in databricks")

2. In the **Create Notebook** dialog box, enter a name, select **Scala** as the language, and select the Spark cluster that you created earlier.

    ![Create notebook in databricks](./media/quickstart-create-databricks-workspace-portal/databricks-notebook-details.png "Create notebook in databricks")

    Click **Create**.

3. In the following snippet, replace the placeholder values with your Azure storage account name and the storage account access key. Run SHIFT + ENTER to run the code cell. This snippet configures the notebook to read data from an Azure blob storage.

       spark.conf.set("fs.azure.account.key.{YOUR STORAGE ACCOUNT NAME}.blob.core.windows.net", "{YOUR STORAGE ACCOUNT ACCESS KEY}")
    
    For instructions on how to retrieve the storage account key, see [Manage your storage access keys](../storage/common/storage-create-storage-account.md#manage-your-storage-account)

    > [!NOTE]
    > You can also use Azure Data Lake Store with a Spark cluster on Azure Databricks. For instructions, see [Use Data Lake Store with Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-storage.html#azure-data-lake-store).

4. You can now run Spark jobs on the data available in the storage accounts. For more information on how to read different data formats and run jobs, see [Spark data sources](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html).

## Clean up resources

While creating the Spark cluster, if you selected the checkbox **Terminate after ___ minutes of activity**, the cluster will automatically terminate if it has been inactive for the specified time.

If you did not select the checkbox, you must manually terminate the cluster. To do so, from the Azure Databricks workspace, from the left pane, click **Clusters**. For the cluster you want to terminate, move the cursor over the ellipsis under **Actions** column, and click the **Terminate** icon.

![Terminate Databricks cluster](./media/quickstart-create-databricks-workspace-portal/terminate-databricks-cluster.png "Terminate Databricks cluster")

## Next steps

In this article, you created a Spark cluster in Azure Databricks and ran a Spark job using data in Azure storage. You can also look at [Spark data sources](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html) to learn how to import data from other data sources into Azure Databricks. Advance to the next article to learn how to use Azure Data Lake Store with Azure Databricks.

> [!div class="nextstepaction"]
>[Use Data Lake Store with Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-storage.html#azure-data-lake-store)