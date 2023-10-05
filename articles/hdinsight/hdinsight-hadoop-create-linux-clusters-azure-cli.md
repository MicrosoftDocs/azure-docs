---
title: Create Apache Hadoop clusters using Azure CLI - Azure HDInsight
description: Learn how to create Azure HDInsight clusters using the cross-platform Azure CLI.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, devx-track-azurecli
ms.date: 10/19/2022
---

# Create HDInsight clusters using the Azure CLI

[!INCLUDE [selector](includes/hdinsight-create-linux-cluster-selector.md)]

The steps in this document walk-through creating a HDInsight 4.0 cluster using the Azure CLI.

[!INCLUDE [delete-cluster-warning](includes/hdinsight-delete-cluster-warning.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a cluster

1. Log in to your Azure subscription. If you plan to use Azure Cloud Shell, then select **Try it** in the upper-right corner of the code block. Else, enter the command below:

    ```azurecli-interactive
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

2. Set environment variables. The use of variables in this article is based on Bash. Slight variations will be needed for other environments. See [az-hdinsight-create](/cli/azure/hdinsight#az-hdinsight-create) for a complete list of possible parameters for cluster creation.

    |Parameter | Description |
    |---|---|
    |`--workernode-count`| The number of worker nodes in the cluster. This article uses the variable `clusterSizeInNodes` as the value passed to `--workernode-count`. |
    |`--version`| The HDInsight cluster version. This article uses the variable `clusterVersion` as the value passed to `--version`. See also: [Supported HDInsight versions](./hdinsight-component-versioning.md#supported-hdinsight-versions).|
    |`--type`| Type of HDInsight cluster, like: hadoop, interactivehive, hbase, kafka, spark, rserver, mlservices.  This article uses the variable `clusterType` as the value passed to `--type`. See also: [Cluster types and configuration](./hdinsight-hadoop-provision-linux-clusters.md#cluster-type).|
    |`--component-version`|The versions of various Hadoop components, in space-separated versions in 'component=version' format. This article uses the variable `componentVersion` as the value passed to `--component-version`. See also: [Hadoop components](./hdinsight-component-versioning.md).|

    Replace `RESOURCEGROUPNAME`, `LOCATION`, `CLUSTERNAME`, `STORAGEACCOUNTNAME`, and `PASSWORD` with the desired values. Change values for the other variables as desired. Then enter the CLI commands.

    ```azurecli-interactive
    export resourceGroupName=RESOURCEGROUPNAME
    export location=LOCATION
    export clusterName=CLUSTERNAME
    export AZURE_STORAGE_ACCOUNT=STORAGEACCOUNTNAME
    export httpCredential='PASSWORD'
    export sshCredentials='PASSWORD'

    export AZURE_STORAGE_CONTAINER=$clusterName
    export clusterSizeInNodes=1
    export clusterVersion=4.0
    export clusterType=hadoop
    export componentVersion=Hadoop=3.1
    ```

3. [Create the resource group](/cli/azure/group#az-group-create) by entering the command below:

    ```azurecli-interactive
    az group create \
        --location $location \
        --name $resourceGroupName
    ```

    For a list of valid locations, use the `az account list-locations` command, and then use one of the locations from the `name` value.

4. [Create an Azure Storage account](/cli/azure/storage/account#az-storage-account-create) by entering the command below:

    ```azurecli-interactive
    # Note: kind BlobStorage is not available as the default storage account.
    az storage account create \
        --name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --https-only true \
        --kind StorageV2 \
        --location $location \
        --sku Standard_LRS
    ```

5. [Extract the primary key from the Azure Storage account](/cli/azure/storage/account/keys#az-storage-account-keys-list) and store it in a variable by entering the command below:

    ```azurecli-interactive
    export AZURE_STORAGE_KEY=$(az storage account keys list \
        --account-name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --query [0].value -o tsv)
    ```

6. [Create an Azure Storage container](/cli/azure/storage/container#az-storage-container-create) by entering the command below:

    ```azurecli-interactive
    az storage container create \
        --name $AZURE_STORAGE_CONTAINER \
        --account-key $AZURE_STORAGE_KEY \
        --account-name $AZURE_STORAGE_ACCOUNT
    ```

7. [Create the HDInsight cluster](/cli/azure/hdinsight#az-hdinsight-create) by entering the following command:

    ```azurecli-interactive
    az hdinsight create \
        --name $clusterName \
        --resource-group $resourceGroupName \
        --type $clusterType \
        --component-version $componentVersion \
        --http-password $httpCredential \
        --http-user admin \
        --location $location \
        --workernode-count $clusterSizeInNodes \
        --ssh-password $sshCredentials \
        --ssh-user sshuser \
        --storage-account $AZURE_STORAGE_ACCOUNT \
        --storage-account-key $AZURE_STORAGE_KEY \
        --storage-container $AZURE_STORAGE_CONTAINER \
        --version $clusterVersion
    ```

    > [!IMPORTANT]  
    > HDInsight clusters come in various types, which correspond to the workload or technology that the cluster is tuned for. There is no supported method to create a cluster that combines multiple types, such as HBase on one cluster.

    It may take several minutes for the cluster creation process to complete. Usually around 15.

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

Now that you've successfully created an HDInsight cluster using the Azure CLI, use the following to learn how to work with your cluster:

### Apache Hadoop clusters

* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use MapReduce with HDInsight](hadoop/hdinsight-use-mapreduce.md)

### Apache HBase clusters

* [Get started with Apache HBase on HDInsight](hbase/apache-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for Apache HBase on HDInsight](hbase/apache-hbase-build-java-maven-linux.md)
