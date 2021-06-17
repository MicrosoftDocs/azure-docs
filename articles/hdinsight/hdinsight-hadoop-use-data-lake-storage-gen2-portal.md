---
title: Create Azure HDInsight - Azure Data Lake Storage Gen2 - portal
description: Learn how to use Azure Data Lake Storage Gen2 with Azure HDInsight clusters using the portal.
author: guyhay
ms.author: guyhay
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 09/17/2020
---

# Create a cluster with Data Lake Storage Gen2 using the Azure portal

The Azure portal is a web-based management tool for services and resources hosted in the Microsoft Azure cloud. In this article, you learn how to create Linux-based Azure HDInsight clusters by using the portal. Additional details are available from [Create HDInsight clusters](./hdinsight-hadoop-provision-linux-clusters.md).

[!INCLUDE [delete-cluster-warning](includes/hdinsight-delete-cluster-warning.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To create an HDInsight cluster that uses Data Lake Storage Gen2 for storage, follow these steps to configure a storage account that has a hierarchical namespace.

## Create a user-assigned managed identity

Create a user-assigned managed identity, if you don’t already have one.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the upper-left click **Create a resource**.
1. In the search box, type **user assigned** and click **User Assigned Managed Identity**.
1. Click **Create**.
1. Enter a name for your managed identity, select the correct subscription, resource group, and location.
1. Click **Create**.

For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](hdinsight-managed-identities.md).

:::image type="content" source="./media/hdinsight-hadoop-use-data-lake-storage-gen2/create-user-assigned-managed-identity-portal.png" alt-text="Create a user-assigned managed identity":::

## Create a storage account to use with Data Lake Storage Gen2

Create an storage account to use with Azure Data Lake Storage Gen2.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the upper-left click **Create a resource**.
1. In the search box, type **storage** and click **storage account**.
1. Click **Create**.
1. On the **Create storage account** screen:
    1. Select the correct subscription and resource group.
    1. Enter a name for your storage account with Data Lake Storage Gen2.
    1. Click on the **Advanced** tab.
    1. Click **Enabled** next to **Hierarchical namespace** under **Data Lake Storage Gen2**.
    1. Click **Review + create**.
    1. Click **Create**

For more information on other options during storage account creation, see [Quickstart: Create a storage account for Azure Data Lake Storage Gen2](../storage/blobs/create-data-lake-storage-account.md).

:::image type="content" source="./media/hdinsight-hadoop-use-data-lake-storage-gen2/azure-data-lake-storage-account-create-advanced.png" alt-text="Screenshot showing storage account creation in the Azure portal":::

## Set up permissions for the managed identity on the Data Lake Storage Gen2

Assign the managed identity to the **Storage Blob Data Owner** role on the storage account.

1. In the [Azure portal](https://portal.azure.com), go to your storage account.
1. Select your storage account, then select **Access control (IAM)** to display the access control settings for the account. Select the **Role assignments** tab to see the list of role assignments.

    :::image type="content" source="./media/hdinsight-hadoop-use-data-lake-storage-gen2/portal-access-control.png" alt-text="Screenshot showing storage access control settings":::

1. Select the **+ Add role assignment** button to add a new role.
1. In the **Add role assignment** window, select the **Storage Blob Data Owner** role. Then, select the subscription that has the managed identity and storage account. Next, search to locate the user-assigned managed identity that you created previously. Finally, select the managed identity, and it will be listed under **Selected members**.

    :::image type="content" source="./media/hdinsight-hadoop-use-data-lake-storage-gen2/add-rbac-role3-window.png" alt-text="Screenshot showing how to assign an Azure role":::

1. Select **Save**. The user-assigned identity that you selected is now listed under the selected role.
1. After this initial setup is complete, you can create a cluster through the portal. The cluster must be in the same Azure region as the storage account. In the **Storage** tab of the cluster creation menu, select the following options:

    * For **Primary storage type**, select **Azure Data Lake Storage Gen2**.
    * Under **Primary Storage account**, search for and select the newly created storage account with Data Lake Storage Gen2 storage.

    * Under **Identity**, select the newly created user-assigned managed identity.

        :::image type="content" source="./media/hdinsight-hadoop-use-data-lake-storage-gen2/azure-portal-cluster-storage-gentwo.png" alt-text="Storage settings for using Data Lake Storage Gen2 with Azure HDInsight":::

    > [!NOTE]
    > * To add a secondary storage account with Data Lake Storage Gen2, at the storage account level, simply assign the managed identity created earlier to the new Data Lake Storage Gen2 that you want to add. Please be advised that adding a secondary storage account with Data Lake Storage Gen2 via the "Additional storage accounts" blade on HDInsight isn't supported.
    > * You can enable RA-GRS or RA-ZRS on the Azure Blob storage account that HDInsight uses. However, creating a cluster against the RA-GRS or RA-ZRS secondary endpoint isn't supported.

## Delete the cluster

See [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](./hdinsight-delete-cluster.md).

## Troubleshoot

If you run into issues with creating HDInsight clusters, see [access control requirements](./hdinsight-hadoop-customize-cluster-linux.md#access-control).

## Next steps

You've successfully created an HDInsight cluster. Now learn how to work with your cluster.

### Apache Spark clusters

* [Customize Linux-based HDInsight clusters by using script actions](hdinsight-hadoop-customize-cluster-linux.md)
* [Create a standalone application using Scala](spark/apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](spark/apache-spark-livy-rest-interface.md)
* [Apache Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](spark/apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](spark/apache-spark-machine-learning-mllib-ipython.md)

### Apache Hadoop clusters

* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use MapReduce with HDInsight](hadoop/hdinsight-use-mapreduce.md)

### Apache HBase clusters

* [Get started with Apache HBase on HDInsight](hbase/apache-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for Apache HBase on HDInsight](hbase/apache-hbase-build-java-maven-linux.md)
