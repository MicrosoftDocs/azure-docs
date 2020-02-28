---
title: 'Tutorial: Create an Apache Kafka REST proxy enabled cluster in HDInsight using Azure CLI'
description: Learn how to perform Apache Kafka operations using a Kafka REST proxy on Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: tutorial
ms.date: 02/27/2020
---

# Tutorial: Create an Apache Kafka REST proxy enabled cluster in HDInsight using Azure CLI

In this tutorial, you learn how to create an Apache Kafka [REST proxy enabled](./rest-proxy.md) cluster in Azure HDInsight using Azure command-line interface (CLI). Azure HDInsight is a managed, full-spectrum, open-source analytics service for enterprises. Apache Kafka is an open-source, distributed streaming platform. It's often used as a message broker, as it provides functionality similar to a publish-subscribe message queue. Kafka REST Proxy enables you to interact with your Kafka cluster via a [REST API](https://docs.microsoft.com/rest/api/hdinsight-kafka-rest-proxy/) over HTTP. The Azure CLI is Microsoft's cross-platform command-line experience for managing Azure resources.

The Apache Kafka API can only be accessed by resources inside the same virtual network. You can access the cluster directly using SSH. To connect other services, networks, or virtual machines to Apache Kafka, you must first create a virtual network and then create the resources within the network. For more information, see [Connect to Apache Kafka using a virtual network](./apache-kafka-connect-vpn-gateway.md).

In this tutorial, you learn:

> [!div class="checklist"]
> * Prerequisites for Kafka REST proxy
> * Create an Apache Kafka cluster using Azure CLI

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An application registered with Azure AD. The client applications that you write to interact with the Kafka REST proxy will use this application's ID and secret to authenticate to Azure. For more information, see [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

* An Azure AD security group with your registered application as a member. This security group will be used to control which applications are allowed to interact with the REST proxy. For more information on creating Azure AD groups, see [Create a basic group and add members using Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

* Azure CLI. Ensure you have at least version 2.0.79. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Create an Apache Kafka cluster

1. Sign in to your Azure subscription.

    ```azurecli
    az login
    
    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

1. Set environment variables. The use of variables in this tutorial is based on Bash. Slight variations will be needed for other environments.

    |Variable | Description |
    |---|---|
    |resourceGroupName|Replace RESOURCEGROUPNAME with the name for your new resource group.|
    |location|Replace LOCATION with a region where the cluster will be created. For a list of valid locations, use the `az account list-locations` command|
    |clusterName|Replace CLUSTERNAME with a globally unique name for your new cluster.|
    |storageAccount|Replace STORAGEACCOUNTNAME with a name for your new storage account.|
    |httpPassword|Replace PASSWORD with a password for the cluster login, **admin**.|
    |sshPassword|Replace PASSWORD with a password for the secure shell username, **sshuser**.|
    |securityGroupName|Replace SECURITYGROUPNAME with the client AAD security group name for Kafka Rest Proxy. The variable will be passed to the `--kafka-client-group-name` parameter for `az-hdinsight-create`.|
    |securityGroupID|Replace SECURITYGROUPID with the client AAD security group ID for Kafka Rest Proxy. The variable will be passed to the `--kafka-client-group-id` parameter for `az-hdinsight-create`.|
    |storageContainer|Storage container the cluster will use, leave as-is for this tutorial. This variable will be set with the name of the cluster.|
    |workernodeCount|Number of worker nodes in the cluster, leave as-is for this tutorial. To guarantee high availability, Kafka requires a minimum of 3 worker nodes|
    |clusterType|Type of HDInsight cluster, leave as-is for this tutorial.|
    |clusterVersion|HDInsight cluster version, leave as-is for this tutorial. Kafka Rest Proxy requires a minimum cluster version of 4.0.|
    |componentVersion|Kafka version, leave as-is for this tutorial. Kafka Rest Proxy requires a minimum component version of 2.1.|

    Update the variables with desired values. Then enter the CLI commands to set the environment variables.

    ```azurecli
    export resourceGroupName=RESOURCEGROUPNAME
    export location=LOCATION
    export clusterName=CLUSTERNAME
    export storageAccount=STORAGEACCOUNTNAME
    export httpPassword='PASSWORD'
    export sshPassword='PASSWORD'
    export securityGroupName=SECURITYGROUPNAME
    export securityGroupID=SECURITYGROUPID

    export storageContainer=$(echo $clusterName | tr "[:upper:]" "[:lower:]")
    export workernodeCount=3
    export clusterType=kafka
    export clusterVersion=4.0
    export componentVersion=kafka=2.1
    ```

1. [Create the resource group](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create) by entering the command below:

    ```azurecli
     az group create \
        --location $location \
        --name $resourceGroupName
    ```

1. [Create an Azure Storage account](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create) by entering the command below:

    ```azurecli
    # Note: kind BlobStorage is not available as the default storage account.
    az storage account create \
        --name $storageAccount \
        --resource-group $resourceGroupName \
        --https-only true \
        --kind StorageV2 \
        --location $location \
        --sku Standard_LRS
    ```

1. [Extract the primary key](https://docs.microsoft.com/cli/azure/storage/account/keys?view=azure-cli-latest#az-storage-account-keys-list) from the Azure Storage account and store it in a variable by entering the command below:

    ```azurecli
    export storageAccountKey=$(az storage account keys list \
        --account-name $storageAccount \
        --resource-group $resourceGroupName \
        --query [0].value -o tsv)
    ```

1. [Create an Azure Storage container](https://docs.microsoft.com/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-create) by entering the command below:

    ```azurecli
    az storage container create \
        --name $storageContainer \
        --account-key $storageAccountKey \
        --account-name $storageAccount
    ```

1. [Create the HDInsight cluster](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-create). Before entering the command, note the following parameters:

    1. Required parameters for Kafka clusters:

        |Parameter | Description|
        |---|---|
        |--type|The value must be **Kafka**.|
        |--workernode-data-disks-per-node|The number of data disks to use per worker node. HDInsight Kafka is only supported with data disks. This tutorial uses a value of **2**.|

    1. Required parameters for Kafka REST proxy:

        |Parameter | Description|
        |---|---|
        |--kafka-management-node-size|The size of the node. This tutorial uses the value **Standard_D4_v2**.|
        |--kafka-client-group-id|The client AAD security group ID for Kafka Rest Proxy. The value is passed from the variable **$securityGroupID**.|
        |--kafka-client-group-name|The client AAD security group name for Kafka Rest Proxy. The value is passed from the variable **$securityGroupName**.|
        |--version|The HDInsight cluster version must be at least 4.0. The value is passed from the variable **$clusterVersion**.|
        |--component-version|The Kafka version must be at least 2.1. The value is passed from the variable **$componentVersion**.|
    
        If you would like to create the cluster without REST proxy, eliminate `--kafka-management-node-size`, `--kafka-client-group-id`, and `--kafka-client-group-name` from the `az hdinsight create` command.

    1. If you have an existing virtual network, add the parameters `--vnet-name` and `--subnet`, and their values.

    Enter the following command to create the cluster:

    ```azurecli
    az hdinsight create \
        --name $clusterName \
        --resource-group $resourceGroupName \
        --type $clusterType \
        --component-version $componentVersion \
        --http-password $httpPassword \
        --http-user admin \
        --location $location \
        --ssh-password $sshPassword \
        --ssh-user sshuser \
        --storage-account $storageAccount \
        --storage-account-key $storageAccountKey \
        --storage-container $storageContainer \
        --version $clusterVersion \
        --workernode-count $workernodeCount \
        --workernode-data-disks-per-node 2 \
        --kafka-management-node-size "Standard_D4_v2" \
        --kafka-client-group-id $securityGroupID \
        --kafka-client-group-name "$securityGroupName"
    ```

    It may take several minutes for the cluster creation process to complete. Usually around 15.

## Clean up resources

After you complete the article, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it's not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

Enter all or some of the following commands to remove resources:

```azurecli
# Remove cluster
az hdinsight delete \
    --name $clusterName \
    --resource-group $resourceGroupName

# Remove storage container
az storage container delete \
    --account-name $storageAccount  \
    --name $storageContainer

# Remove storage account
az storage account delete \
    --name $storageAccount  \
    --resource-group $resourceGroupName

# Remove resource group
az group delete \
    --name $resourceGroupName
```

## Next steps

Now that you've successfully created an Apache Kafka REST proxy enabled cluster in Azure HDInsight using Azure CLI, use Python code to interact with the REST proxy:

> [!div class="nextstepaction"]
> [Create sample application](./rest-proxy.md#client-application-sample)