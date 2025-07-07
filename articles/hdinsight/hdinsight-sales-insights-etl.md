---
title: 'Tutorial: Create an end-to-end ETL pipeline to derive sales insights in Azure HDInsight'
description: Learn how to create ETL pipelines with Azure HDInsight to derive insights from sales data by using Spark on-demand clusters and Power BI.
ms.service: azure-hdinsight
ms.topic: tutorial
ms.custom: hdinsightactive
author: apurbasroy
ms.author: apsinhar
ms.reviewer: sairamyeturi
ms.date: 06/14/2024
---

# Tutorial: Create an end-to-end data pipeline to derive sales insights in Azure HDInsight

In this tutorial, you build an end-to-end data pipeline that performs extract, transform, and load (ETL) operations. The pipeline uses [Apache Spark](./spark/apache-spark-overview.md) and Apache Hive clusters running on Azure HDInsight for querying and manipulating the data. You also use technologies like Azure Data Lake Storage Gen2 for data storage and Power BI for visualization.

This data pipeline combines data from various stores, removes unwanted data, appends new data, and loads the data back to your storage to visualize business insights. For more information about ETL pipelines, see [Extract, transform, and load at scale](./hadoop/apache-hadoop-etl-at-scale.md).

:::image type="content" source="./media/hdinsight-sales-insights-etl/architecture.png" alt-text="Screenshot that shows extract, transform, and load architecture." border="false":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure CLI, at least version 2.2.0. See [Install the Azure CLI](/cli/azure/install-azure-cli).
* jq, a command-line JSON processor. See the [jq website](https://jqlang.org/).
* A member of the [Azure built-in role: Owner](../role-based-access-control/built-in-roles.md).
* If you use PowerShell to trigger the Azure Data Factory pipeline, you need the [Az PowerShell module](/powershell/azure/).
* [Power BI Desktop](https://aka.ms/pbiSingleInstaller) to visualize business insights at the end of this tutorial.

## Create resources

This section shows you how to create resources.

### Clone the repository with scripts and data

1. Sign in to your Azure subscription. If you plan to use Azure Cloud Shell, select **Try it** in the upper-right corner of the code block. Otherwise, enter the following command:

    ```azurecli-interactive
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription "SUBSCRIPTIONID"
    ```

1. Ensure that you're a member of the Azure role [Owner](../role-based-access-control/built-in-roles.md). Replace `user@contoso.com` with your account, and then enter the command:

    ```azurecli
    az role assignment list \
    --assignee "user@contoso.com" \
    --role "Owner"
    ```

    If a record isn't returned, you aren't a member and can't complete this tutorial.

1. Download the data and scripts for this tutorial from the [HDInsight sales insights ETL repository](https://github.com/Azure-Samples/hdinsight-sales-insights-etl). Enter the following command:

    ```bash
    git clone https://github.com/Azure-Samples/hdinsight-sales-insights-etl.git
    cd hdinsight-sales-insights-etl
    ```

1. Ensure that `salesdata scripts templates` were created. Verify with the following command:

   ```bash
   ls
   ```

### Deploy Azure resources needed for the pipeline

1. Add execute permissions for all the scripts by entering the command:

    ```bash
    chmod +x scripts/*.sh
    ````

1. Set variables for a resource group. Replace `RESOURCE_GROUP_NAME` with the name of an existing or new resource group, and then enter the command:

    ```bash
    RESOURCE_GROUP="RESOURCE_GROUP_NAME"
    ```

1. Run the script. Replace `LOCATION` with the value you want, and then enter the command:

    ```bash
    ./scripts/resources.sh $RESOURCE_GROUP LOCATION
    ```

    If you aren't sure which region to specify, retrieve a list of supported regions for your subscription by using the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    The command deploys the following resources:

    * An Azure Blob Storage account. This account holds the company sales data.
    * A Data Lake Storage Gen2 account. This account serves as the storage account for both HDInsight clusters. Read more about HDInsight and Data Lake Storage Gen2 in [Azure HDInsight integration with Data Lake Storage Gen2](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/).
    * A user-assigned managed identity. This account gives the HDInsight clusters access to the Data Lake Storage Gen2 account.
    * An Apache Spark cluster. This cluster is used to clean up and transform the raw data.
    * An Apache Hive [Interactive Query](./interactive-query/apache-interactive-query-get-started.md) cluster. You can use this cluster to query the sales data and visualize it with Power BI.
    * An Azure virtual network supported by network security group rules. This virtual network allows the clusters to communicate and secures their communications.

Cluster creation can take around 20 minutes.

The default password for Secure Shell (SSH) protocol access to the clusters is `Thisisapassword1`. If you want to change the password, go to the `./templates/resourcesparameters_remainder.json` file and change the password for the `sparksshPassword`, `sparkClusterLoginPassword`, `llapClusterLoginPassword`, and `llapsshPassword` parameters.

### Verify deployment and collect resource information

1. If you want to check the status of your deployment, go to the resource group in the Azure portal. Under **Settings**, select **Deployments**. Then select your deployment. Here you can see the resources that successfully deployed and the resources that are still in progress.

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

Azure Data Factory is a tool that helps automate Azure Pipelines. It's not the only way to accomplish these tasks, but it's a great way to automate the processes. For more information on Data Factory, see the [Data Factory documentation](https://azure.microsoft.com/services/data-factory/).

This data factory has one pipeline with two activities:

* The first activity copies the data from Blob Storage to the Data Lake Storage Gen 2 storage account to mimic data ingestion.
* The second activity transforms the data in the Spark cluster. The script transforms the data by removing unwanted columns. It also appends a new column that calculates the revenue that a single transaction generates.

To set up your Data Factory pipeline, run the following command. You should still be at the `hdinsight-sales-insights-etl` directory.

```bash
BLOB_STORAGE_NAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.blobStorageName.value')
ADLSGEN2STORAGENAME=$(cat resourcesoutputs_storage.json | jq -r '.properties.outputs.adlsGen2StorageName.value')

./scripts/adf.sh $RESOURCE_GROUP $ADLSGEN2STORAGENAME $BLOB_STORAGE_NAME
```

This script takes the following actions:

1. Creates a service principal with `Storage Blob Data Contributor` permissions on the Data Lake Storage Gen2 storage account.
1. Obtains an authentication token to authorize `POST` requests to the [Data Lake Storage Gen2 file system REST API](/rest/api/storageservices/datalakestoragegen2/filesystem/create).
1. Fills in the actual name of your Data Lake Storage Gen2 storage account in the `sparktransform.py` and `query.hql` files.
1. Obtains storage keys for the Data Lake Storage Gen2 and Blob Storage accounts.
1. Creates another resource deployment to create a Data Factory pipeline with its associated linked services and activities. It passes the storage keys as parameters to the template file so that the linked services can access the storage accounts correctly.

## Run the data pipeline

This section shows you how to run the data pipeline.

### Trigger the Data Factory activities

The first activity in the Data Factory pipeline that you created moves the data from Blob Storage to Data Lake Storage Gen2. The second activity applies the Spark transformations on the data and saves the transformed .csv files to a new location. The entire pipeline might take a few minutes to finish.

To retrieve the Data Factory name, enter the following command:

```azurecli
cat resourcesoutputs_adf.json | jq -r '.properties.outputs.factoryName.value'
```

To trigger the pipeline, you have two options. You can:

* Trigger the Data Factory pipeline in PowerShell. Replace `RESOURCEGROUP` and `DataFactoryName` with the appropriate values, and then run the following commands:

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

    Or you can:

* Open the data factory and select **Author & Monitor**. Trigger the `IngestAndTransform` pipeline from the portal. For information on how to trigger pipelines through the portal, see [Create on-demand Apache Hadoop clusters in HDInsight by using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md#trigger-a-pipeline).

To verify that the pipeline has run, take one of the following steps:

* Go to the **Monitor** section in your data factory through the portal.
* In Azure Storage Explorer, go to your Data Lake Storage Gen2 storage account. Go to the `files` file system, and then go to the `transformed` folder. Check the folder contents to see if the pipeline succeeded.

For other ways to transform data by using HDInsight, see [this article on using Jupyter Notebook](/azure/hdinsight/spark/apache-spark-load-data-run-query).

### Create a table on the Interactive Query cluster to view data on Power BI

1. Copy the `query.hql` file to the LLAP cluster by using the secure copy (SCP) command. Enter the command:

    ```bash
    LLAP_CLUSTER_NAME=$(cat resourcesoutputs_remainder.json | jq -r '.properties.outputs.llapClusterName.value')
    scp scripts/query.hql sshuser@$LLAP_CLUSTER_NAME-ssh.azurehdinsight.net:/home/sshuser/
    ```

    Reminder: The default password is `Thisisapassword1`.

1. Use SSH to access the LLAP cluster. Enter the following command:

    ```bash
    ssh sshuser@$LLAP_CLUSTER_NAME-ssh.azurehdinsight.net
    ```

1. Use the following command to run the script:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f query.hql
    ```

    This script creates a managed table on the Interactive Query cluster that you can access from Power BI.

### Create a Power BI dashboard from sales data

1. Open Power BI Desktop.

1. On the menu, go to **Get data** > **More...** > **Azure** > **HDInsight Interactive Query**.

1. Select **Connect**.

1. In the **HDInsight Interactive Query** dialog:
    1. In the **Server** text box, enter the name of your LLAP cluster in the format of `https://LLAPCLUSTERNAME.azurehdinsight.net`.
    1. In the **database** text box, enter **default**.
    1. Select **OK**.

1. In the **AzureHive** dialog:
    1. In the **User name** text box, enter **admin**.
    1. In the **Password** text box, enter **Thisisapassword1**.
    1. Select **Connect**.

1. From **Navigator**, select **sales** or **sales_raw** to preview the data. After the data is loaded, you can experiment with the dashboard that you want to create. To get started with Power BI dashboards, see the following articles:

   * [Introduction to dashboards for Power BI designers](/power-bi/service-dashboards)
   * [Tutorial: Get started with the Power BI service](/power-bi/service-get-started)

## Clean up resources

If you're not going to continue to use this application, delete all resources so that you aren't charged for them.

1. To remove the resource group, enter the command:

    ```azurecli
    az group delete -n $RESOURCE_GROUP
    ```

1. To remove the service principal, enter the commands:

    ```azurecli
    SERVICE_PRINCIPAL=$(cat serviceprincipal.json | jq -r '.name')
    az ad sp delete --id $SERVICE_PRINCIPAL
    ```

## Next step

> [!div class="nextstepaction"]
> [Extract, transform, and load at scale](./hadoop/apache-hadoop-etl-at-scale.md)
