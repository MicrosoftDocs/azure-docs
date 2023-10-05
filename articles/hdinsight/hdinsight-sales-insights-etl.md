---
title: 'Tutorial: Create an end-to-end ETL pipeline to derive sales insights in Azure HDInsight'
description: Learn how to use create ETL pipelines with Azure HDInsight to derive insights from sales data by using Spark on-demand clusters and Power BI.
ms.service: hdinsight
ms.topic: tutorial
ms.custom: hdinsightactive
ms.date: 06/26/2023
---

# Tutorial: Create an end-to-end data pipeline to derive sales insights in Azure HDInsight

In this tutorial, you'll build an end-to-end data pipeline that performs extract, transform, and load (ETL) operations. The pipeline will use [Apache Spark](./spark/apache-spark-overview.md) and Apache Hive clusters running on Azure HDInsight for querying and manipulating the data. You'll also use technologies like Azure Data Lake Storage Gen2 for data storage, and Power BI for visualization.

This data pipeline combines the data from various stores, removes any unwanted data, appends new data, and loads all this back to your storage to visualize business insights. Read more about ETL pipelines in [Extract, transform, and load (ETL) at scale](./hadoop/apache-hadoop-etl-at-scale.md).

:::image type="content" source="./media/hdinsight-sales-insights-etl/architecture.png" alt-text="ETL architecture" border="false":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure CLI - at least version 2.2.0. See [Install the Azure CLI](/cli/azure/install-azure-cli).

* jq, a command-line JSON processor.  See [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/).

* A member of the [Azure built-in role - owner](../role-based-access-control/built-in-roles.md).

* If using PowerShell to trigger the Data Factory pipeline, you'll need the [Az Module](/powershell/azure/).

* [Power BI Desktop](https://aka.ms/pbiSingleInstaller) to visualize business insights at the end of this tutorial.

## Create resources

### Clone the repository with scripts and data

1. Log in to your Azure subscription. If you plan to use Azure Cloud Shell, then select **Try it** in the upper-right corner of the code block. Else, enter the command below:

    ```azurecli-interactive
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

1. Ensure you're a member of the Azure role [owner](../role-based-access-control/built-in-roles.md). Replace `user@contoso.com` with your account and then enter the command:

    ```azurecli
    az role assignment list \
    --assignee "user@contoso.com" \
    --role "Owner"
    ```

    If no record is returned, you aren't a member and won't be able to complete this tutorial.

1. Download the data and scripts for this tutorial from the [HDInsight sales insights ETL repository](https://github.com/Azure-Samples/hdinsight-sales-insights-etl). Enter the following command:

    ```bash
    git clone https://github.com/Azure-Samples/hdinsight-sales-insights-etl.git
    cd hdinsight-sales-insights-etl
    ```

1. Ensure `salesdata scripts templates` have been created. Verify with the following command:

   ```bash
   ls
   ```

### Deploy Azure resources needed for the pipeline

1. Add execute permissions for all of the scripts by entering:

    ```bash
    chmod +x scripts/*.sh
    ````

1. Set variable for resource group. Replace `RESOURCE_GROUP_NAME` with the name of an existing or new resource group, then enter the command:

    ```bash
    RESOURCE_GROUP="RESOURCE_GROUP_NAME"
    ```

1. Execute the script. Replace `LOCATION` with a desired value, then enter the command:

    ```bash
    ./scripts/resources.sh $RESOURCE_GROUP LOCATION
    ```

    If you're not sure which region to specify, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    The command will deploy the following resources:

    * An Azure Blob storage account. This account will hold the company sales data.
    * An Azure Data Lake Storage Gen2 account. This account will serve as the storage account for both HDInsight clusters. Read more about HDInsight and Data Lake Storage Gen2 in [Azure HDInsight integration with Data Lake Storage Gen2](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/).
    * A user-assigned managed identity. This account gives the HDInsight clusters access to the Data Lake Storage Gen2 account.
    * An Apache Spark cluster. This cluster will be used to clean up and transform the raw data.
    * An Apache Hive [Interactive Query](./interactive-query/apache-interactive-query-get-started.md) cluster. This cluster will allow querying the sales data and visualizing it with Power BI.
    * An Azure virtual network supported by network security group (NSG) rules. This virtual network allows the clusters to communicate and secures their communications.

Cluster creation can take around 20 minutes.

The default password for SSH access to the clusters is `Thisisapassword1`. If you want to change the password, go to the `./templates/resourcesparameters_remainder.json` file and change the password for the `sparksshPassword`, `sparkClusterLoginPassword`, `llapClusterLoginPassword`, and `llapsshPassword` parameters.

### Verify deployment and collect resource information

1. If you want to check the status of your deployment, go to the resource group on the Azure portal. Under **Settings**, select **Deployments**, then your deployment. Here you can see the resources that have successfully deployed and the resources that are still in progress.

1. To view the names of the clusters, enter the following command:

    ```bash
    SPARK_CLUSTER_NAME=$(cat resourcesoutputs_remainder.json | jq -r '.properties.outputs.sparkClusterName.value')
    LLAP_CLUSTER_NAME=$(cat resourcesoutputs_remainder.json | jq -r '.properties.outputs.llapClusterName.value')

    echo "Spark Cluster" $SPARK_CLUSTER_NAME
    echo "LLAP cluster" $LLAP_CLUSTER_NAME
    ```

1. To view the Azure storage account and access key, enter the following command:

    ```azurecli
    BLOB_STORAGE_NAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.blobStorageName.value')

    blobKey=$(az storage account keys list \
        --account-name $BLOB_STORAGE_NAME \
        --resource-group $RESOURCE_GROUP \
        --query [0].value -o tsv)

    echo $BLOB_STORAGE_NAME
    echo $BLOB_KEY
    ```

1. To view the Data Lake Storage Gen2 account and access key, enter the following command:

    ```azurecli
    ADLSGEN2STORAGENAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.adlsGen2StorageName.value')

    ADLSKEY=$(az storage account keys list \
        --account-name $ADLSGEN2STORAGENAME \
        --resource-group $RESOURCE_GROUP \
        --query [0].value -o tsv)

    echo $ADLSGEN2STORAGENAME
    echo $ADLSKEY
    ```

### Create a data factory

Azure Data Factory is a tool that helps automate Azure Pipelines. It's not the only way to accomplish these tasks, but it's a great way to automate the processes. For more information on Azure Data Factory, see the [Azure Data Factory documentation](https://azure.microsoft.com/services/data-factory/).

This data factory will have one pipeline with two activities:

* The first activity will copy the data from Azure Blob storage to the Data Lake Storage Gen 2 storage account to mimic data ingestion.
* The second activity will transform the data in the Spark cluster. The script transforms the data by removing unwanted columns. It also appends a new column that calculates the revenue that a single transaction generates.

To set up your Azure Data Factory pipeline, execute the  command below.  You should still be at the `hdinsight-sales-insights-etl` directory.

```bash
BLOB_STORAGE_NAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.blobStorageName.value')
ADLSGEN2STORAGENAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.adlsGen2StorageName.value')

./scripts/adf.sh $RESOURCE_GROUP $ADLSGEN2STORAGENAME $BLOB_STORAGE_NAME
```

This script does the following things:

1. Creates a service principal with `Storage Blob Data Contributor` permissions on the Data Lake Storage Gen2 storage account.
1. Obtains an authentication token to authorize POST requests to the [Data Lake Storage Gen2 file system REST API](/rest/api/storageservices/datalakestoragegen2/filesystem/create).
1. Fills in the actual name of your Data Lake Storage Gen2 storage account in the `sparktransform.py` and `query.hql` files.
1. Obtains storage keys for the Data Lake Storage Gen2 and Blob storage accounts.
1. Creates another resource deployment to create an Azure Data Factory pipeline, with its associated linked services and activities. It passes the storage keys as parameters to the template file so that the linked services can access the storage accounts correctly.

## Run the data pipeline

### Trigger the Data Factory activities

The first activity in the Data Factory pipeline that you've created moves the data from Blob storage to Data Lake Storage Gen2. The second activity applies the Spark transformations on the data and saves the transformed .csv files to a new location. The entire pipeline might take a few minutes to finish.

To retrieve the Data Factory name, enter the following command:

```azurecli
cat resourcesoutputs_adf.json | jq -r '.properties.outputs.factoryName.value'
```

To trigger the pipeline, you can either:

* Trigger the Data Factory pipeline in PowerShell. Replace `RESOURCEGROUP`, and `DataFactoryName` with the appropriate values, then run the following commands:

    ```powershell
    # If you have multiple subscriptions, set the one to use
    # Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

    $resourceGroup="RESOURCEGROUP"
    $dataFactory="DataFactoryName"

    $pipeline =Invoke-AzDataFactoryV2Pipeline `
        -ResourceGroupName $resourceGroup `
        -DataFactory $dataFactory `
        -PipelineName "IngestAndTransform"

    Get-AzDataFactoryV2PipelineRun `
        -ResourceGroupName $resourceGroup  `
        -DataFactoryName $dataFactory `
        -PipelineRunId $pipeline
    ```

    Re-execute `Get-AzDataFactoryV2PipelineRun` as needed to monitor progress.

    Or

* Open the data factory and select **Author & Monitor**. Trigger the `IngestAndTransform` pipeline from the portal. For information on triggering pipelines through the portal, see [Create on-demand Apache Hadoop clusters in HDInsight using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md#trigger-a-pipeline).

To verify that the pipeline has run, you can take either of the following steps:

* Go to the **Monitor** section in your data factory through the portal.
* In Azure Storage Explorer, go to your Data Lake Storage Gen 2 storage account. Go to the `files` file system, and then go to the `transformed` folder and check its contents to see if the pipeline succeeded.

For other ways to transform data by using HDInsight, see [this article on using Jupyter Notebook](/azure/hdinsight/spark/apache-spark-load-data-run-query).

### Create a table on the Interactive Query cluster to view data on Power BI

1. Copy the `query.hql` file to the LLAP cluster by using SCP. Enter the command:

    ```bash
    LLAP_CLUSTER_NAME=$(cat resourcesoutputs_remainder.json | jq -r '.properties.outputs.llapClusterName.value')
    scp scripts/query.hql sshuser@$LLAP_CLUSTER_NAME-ssh.azurehdinsight.net:/home/sshuser/
    ```

    Reminder: The default password is `Thisisapassword1`.

1. Use SSH to access the LLAP cluster. Enter the command:

    ```bash
    ssh sshuser@$LLAP_CLUSTER_NAME-ssh.azurehdinsight.net
    ```

1. Use the following command to run the script:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f query.hql
    ```

    This script will create a managed table on the Interactive Query cluster that you can access from Power BI.

### Create a Power BI dashboard from sales data

1. Open Power BI Desktop.

1. From the menu, navigate to **Get data** > **More...** > **Azure** > **HDInsight Interactive Query**.

1. Select **Connect**.

1. From the **HDInsight Interactive Query** dialog:
    1. In the **Server** text box, enter the name of your LLAP cluster in the format of `https://LLAPCLUSTERNAME.azurehdinsight.net`.
    1. In the **database** text box, enter `default`.
    1. Select **OK**.

1. From the **AzureHive** dialog:
    1. In the **User name** text box, enter `admin`.
    1. In the **Password** text box, enter `Thisisapassword1`.
    1. Select **Connect**.

1. From **Navigator**, select `sales`, and/or `sales_raw` to preview the data. After the data is loaded, you can experiment with the dashboard that you want to create. See the following links to get started with Power BI dashboards:

* [Introduction to dashboards for Power BI designers](/power-bi/service-dashboards)
* [Tutorial: Get started with the Power BI service](/power-bi/service-get-started)

## Clean up resources

If you're not going to continue to use this application, delete all resources by using the following command so that you aren't charged for them.

1. To remove the resource group, enter the command:

    ```azurecli
    az group delete -n $RESOURCE_GROUP
    ```

1. To remove the service principal, enter the commands:

    ```azurecli
    SERVICE_PRINCIPAL=$(cat serviceprincipal.json | jq -r '.name')
    az ad sp delete --id $SERVICE_PRINCIPAL
    ```

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load (ETL) at scale](./hadoop/apache-hadoop-etl-at-scale.md)
