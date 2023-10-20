---
title: Create Azure HDInsight - Azure Data Lake Storage Gen2 - Azure CLI
description: Learn how to use Azure Data Lake Storage Gen2 with Azure HDInsight clusters using Azure CLI.
author: yeturis
ms.author: sairamyeturi
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020, devx-track-azurecli
ms.date: 08/21/2023
---

# Create a cluster with Data Lake Storage Gen2 using Azure CLI

To create an HDInsight cluster that uses Data Lake Storage Gen2 for storage, follow these steps.

## Prerequisites

- If you're unfamiliar with Azure Data Lake Storage Gen2, check out the [overview section](hdinsight-hadoop-use-data-lake-storage-gen2.md). 
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To run the CLI script examples, you have three options:
    - Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal (see next section).
    - Use the embedded Azure Cloud Shell via the "Try It" button, located in the top-right corner of each code block.
    - [Install the latest version of the Azure CLI](/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. Sign in to Azure using `az login`, using an account that is associated with the Azure subscription under which you would like to deploy the user-assigned managed identity.Azure CLI. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [delete-cluster-warning](includes/hdinsight-delete-cluster-warning.md)]

You can [download a sample template file](https://github.com/Azure-Samples/hdinsight-data-lake-storage-gen2-templates/blob/master/hdinsight-adls-gen2-template.json) and [download a sample parameters file](https://github.com/Azure-Samples/hdinsight-data-lake-storage-gen2-templates/blob/master/parameters.json). Before using the template and the Azure CLI code snippet below, replace the following placeholders with their correct values:

| Placeholder | Description |
|---|---|
| `<SUBSCRIPTION_ID>` | The ID of your Azure subscription |
| `<RESOURCEGROUPNAME>` | The resource group where you want the new cluster and storage account created. |
| `<MANAGEDIDENTITYNAME>` | The name of the managed identity that will be given permissions on your storage account with Azure Data Lake Storage Gen2. |
| `<STORAGEACCOUNTNAME>` | The new storage account with Azure Data Lake Storage Gen2 that will be created. |
| `<FILESYSTEMNAME>`  | The name of the filesystem that this cluster should use in the storage account. |
| `<CLUSTERNAME>` | The name of your HDInsight cluster. |
| `<PASSWORD>` | Your chosen password for signing in to the cluster using SSH and the Ambari dashboard. |

The code snippet below does the following initial steps:

1. Logs in to your Azure account.
1. Sets the active subscription where the create operations will be done.
1. Creates a new resource group for the new deployment activities.
1. Creates a user-assigned managed identity.
1. Adds an extension to the Azure CLI to use features for Data Lake Storage Gen2.
1. Creates a new storage account with Data Lake Storage Gen2 by using the `--hierarchical-namespace true` flag.

```azurecli
az login
az account set --subscription <SUBSCRIPTION_ID>

# Create resource group
az group create --name <RESOURCEGROUPNAME> --location eastus

# Create managed identity
az identity create -g <RESOURCEGROUPNAME> -n <MANAGEDIDENTITYNAME>

az extension add --name storage-preview

az storage account create --name <STORAGEACCOUNTNAME> \
    --resource-group <RESOURCEGROUPNAME> \
    --location eastus --sku Standard_LRS \
    --kind StorageV2 --hierarchical-namespace true
```

Next, sign in to the portal. Add the new user-assigned managed identity to the **Storage Blob Data Owner** role on the storage account. This step is described in step 3 under [Using the Azure portal](hdinsight-hadoop-use-data-lake-storage-gen2.md).

 > [!IMPORTANT]
 > Ensure that your storage account has the user-assigned identity with **Storage Blob Data Owner** role permissions, otherwise cluster creation will fail.

```azurecli
az deployment group create --name HDInsightADLSGen2Deployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file hdinsight-adls-gen2-template.json \
    --parameters parameters.json
```

## Clean up resources

After you complete the article, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it's not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

Enter all or some of the following commands to remove resources:

```azurecli-interactive
# Remove cluster
az hdinsight delete \
    --name $clusterName \
    --resource-group $resourceGroupName

# Remove storage container
az storage container delete \
    --account-name $AZURE_STORAGE_ACCOUNT \
    --name $AZURE_STORAGE_CONTAINER

# Remove storage account
az storage account delete \
    --name $AZURE_STORAGE_ACCOUNT \
    --resource-group $resourceGroupName

# Remove resource group
az group delete \
    --name $resourceGroupName
```

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
