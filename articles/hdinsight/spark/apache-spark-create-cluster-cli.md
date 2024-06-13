---
title: 'Quickstart: Apache Spark clusters with Azure CLI - Azure HDInsight'
description: This quickstart shows how to use Azure CLI to create an Apache Spark cluster in Azure HDInsight.
ms.service: hdinsight
ms.topic: quickstart
ms.date: 11/23/2023
ms.custom: devx-track-azurecli, mode-api
#Customer intent: As a developer new to Apache Spark on Azure, I need to see how to create a Spark cluster.
---

# Quickstart: Create Apache Spark cluster in Azure HDInsight using Azure CLI

In this quickstart, you learn how to create an Apache Spark cluster in Azure HDInsight using the Azure CLI. Azure HDInsight is a managed, full-spectrum, open-source analytics service for enterprises. The Apache Spark framework for HDInsight enables fast data analytics and cluster computing using in-memory processing. The Azure CLI is Microsoft's cross-platform command-line experience for managing Azure resources.

If you're using multiple clusters together, you can create a virtual network, and if you're using a Spark cluster you can use the Hive Warehouse Connector. For more information, see [Plan a virtual network for Azure HDInsight](../hdinsight-plan-virtual-network-deployment.md) and [Integrate Apache Spark and Apache Hive with the Hive Warehouse Connector](../interactive-query/apache-hive-warehouse-connector.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create an Apache Spark cluster

1. Sign in to your Azure subscription. If you plan to use Azure Cloud Shell, select **Try it** in the upper-right corner of the following code block. Else, enter the following command:

    ```azurecli-interactive
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

2. Set environment variables. The use of variables in this quickstart is based on Bash. Slight variations are needed for other environments. Replace RESOURCEGROUPNAME, LOCATION, CLUSTERNAME, STORAGEACCOUNTNAME, and PASSWORD in the following code snippet with the desired values. Then enter the CLI commands to set the environment variables.

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
    export clusterType=spark
    export componentVersion=Spark=2.3
    ```

3. Create the resource group by entering the following command:

    ```azurecli-interactive
    az group create \
        --location $location \
        --name $resourceGroupName
    ```

4. Create an Azure storage account by entering the following command:

    ```azurecli-interactive
    az storage account create \
        --name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --https-only true \
        --kind StorageV2 \
        --location $location \
        --sku Standard_LRS
    ```

5. Extract the primary key from the Azure storage account and store it in a variable by entering the following command:

    ```azurecli-interactive
    export AZURE_STORAGE_KEY=$(az storage account keys list \
        --account-name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --query [0].value -o tsv)
    ```

6. Create an Azure storage container by entering the following command:

    ```azurecli-interactive
    az storage container create \
        --name $AZURE_STORAGE_CONTAINER \
        --account-key $AZURE_STORAGE_KEY \
        --account-name $AZURE_STORAGE_ACCOUNT
    ```

7. Create the Apache Spark cluster by entering the following command:

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

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

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

## Next steps

In this quickstart, you learned how to create an Apache Spark cluster in Azure HDInsight using Azure CLI.  Advance to the next tutorial to learn how to use an HDInsight cluster to run interactive queries on sample data.

> [!div class="nextstepaction"]
> [Run interactive queries on Apache Spark](./apache-spark-load-data-run-query.md)
