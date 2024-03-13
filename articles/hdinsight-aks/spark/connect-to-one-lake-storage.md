---
title: Connect to OneLake Storage
description: Learn how to connect to OneLake storage
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# Connect to OneLake Storage

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This tutorial shows how to connect to OneLake with a Jupyter notebook from an Azure HDInsight on AKS cluster.

1. Create an HDInsight on AKS cluster with Apache Spark™. Follow these instructions: Set up clusters in HDInsight on AKS.
1. While providing cluster information, remember your Cluster login Username and Password, as you need them later to access the cluster.
1. Create a user assigned managed identity (UAMI): Create for Azure HDInsight on AKS - UAMI and choose it as the identity in the **Storage** screen.

    :::image type="content" source="./media/connect-to-one-lake-storage/basic-tab.png" alt-text="Screenshot showing cluster basic tab." lightbox="./media/connect-to-one-lake-storage/basic-tab.png":::

1. Give this UAMI access to the Fabric workspace that contains your items. Learn more about Fabric role-based access control (RBAC): [Workspace roles](/fabric/get-started/roles-workspaces) to decide what role is suitable.
   
    :::image type="content" source="./media/connect-to-one-lake-storage/manage-access.png" alt-text="Screenshot showing manage access box." lightbox="./media/connect-to-one-lake-storage/manage-access.png":::
   
1. Navigate to your Lakehouse and find the Name for your workspace and Lakehouse. You can find them in the URL of your Lakehouse or the Properties pane for a file.
1. In the Azure portal, look for your cluster and select the notebook.
    :::image type="content" source="./media/connect-to-one-lake-storage/overview-page.png" alt-text="Screenshot showing cluster overview page." lightbox="./media/connect-to-one-lake-storage/overview-page.png":::

1. Create a new Notebook and select type as **pyspark**.
1. Copy the workspace and Lakehouse names into your notebook and build your OneLake URL for your Lakehouse. Now you can read any file from this file path.
    ```
    fp = 'abfss://' + 'Workspace Name' + '@onelake.dfs.fabric.microsoft.com/' + 'Lakehouse Name' + '/Files/' 
    1df = spark.read.format("csv").option("header", "true").load(fp + "test1.csv") 
    1df.show()
    ``````
1. Try to write some data into the Lakehouse.

    `writecsvdf = df.write.format("csv").save(fp + "out.csv")`
   
1. Test that your data was successfully written by checking in your Lakehouse or by reading your newly loaded file.

## Reference

* Apache, Apache Spark, Spark, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
