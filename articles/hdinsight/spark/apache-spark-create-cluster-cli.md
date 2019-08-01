---
title: 'Quickstart: Create an Apache Spark cluster in Azure HDInsight with Azure CLI'
description: This quickstart shows how to use Azure CLI to create an Apache Spark cluster in Azure HDInsight.
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: quickstart
ms.date: 06/12/2019
ms.author: hrasheed
#Customer intent: As a developer new to Apache Spark on Azure, I need to see how to create a spark cluster.
---

# Quickstart: Create Apache Spark cluster in Azure HDInsight using Azure CLI

In this quickstart, you learn how to create an Apache Spark cluster in Azure HDInsight using Azure CLI. Apache Spark enables fast data analytics and cluster computing using in-memory processing. The [Azure command-line interface (CLI)](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) is Microsoft's cross-platform command-line experience for managing Azure resources.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Azure CLI. If you haven't installed the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) for steps.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create an Apache Spark cluster

1. Sign in to your Azure subscription. If you plan to use Azure Cloud Shell then simply select **Try it** in the upper-right corner of the code block. Else, enter the command below:

    ```azurecli-interactive
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

2. Set environment variables. The use of variables in this quickstart is based on Bash. Slight variations will be needed for other environments. Replace RESOURCEGROUPNAME, LOCATION, CLUSTERNAME, STORAGEACCOUNTNAME, and PASSWORD in the code snippet below with the desired values. Then enter the CLI commands to set the environment variables.

    ```azurecli-interactive
    export resourceGroupName=RESOURCEGROUPNAME
    export location=LOCATION
    export clusterName=CLUSTERNAME
    export AZURE_STORAGE_ACCOUNT=STORAGEACCOUNTNAME
    export httpCredential='PASSWORD'
    export sshCredentials='PASSWORD'
    
    export AZURE_STORAGE_CONTAINER=$clusterName
    export clusterSizeInNodes=1
    export clusterVersion=3.6
    export clusterType=spark
    export componentVersion=Spark=2.3
    ```

3. Create the resource group by entering the command below:

    ```azurecli-interactive
    az group create \
        --location $location \
        --name $resourceGroupName
    ```

4. Create an Azure storage account by entering the command below:

    ```azurecli-interactive
    az storage account create \
        --name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --https-only true \
        --kind StorageV2 \
        --location $location \
        --sku Standard_LRS
    ```

5. Extract the primary key from the Azure storage account and store it in a variable by entering the command below:

    ```azurecli-interactive
    export AZURE_STORAGE_KEY=$(az storage account keys list \
        --account-name $AZURE_STORAGE_ACCOUNT \
        --resource-group $resourceGroupName \
        --query [0].value -o tsv)
    ```

6. Create an Azure storage container by entering the command below:

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
        --size $clusterSizeInNodes \
        --ssh-password $sshCredentials \
        --ssh-user sshuser \
        --storage-account $AZURE_STORAGE_ACCOUNT \
        --storage-account-key $AZURE_STORAGE_KEY \
        --storage-default-container $AZURE_STORAGE_CONTAINER \
        --version $clusterVersion
    ```

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

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

In this quickstart, you learned how to create an Apache Spark cluster in Azure HDInsight using Azure CLI.  Advance to the next tutorial to learn how to use an HDInsight Spark cluster to run interactive queries on sample data.

> [!div class="nextstepaction"]
> [Run interactive queries on Apache Spark](./apache-spark-load-data-run-query.md)
