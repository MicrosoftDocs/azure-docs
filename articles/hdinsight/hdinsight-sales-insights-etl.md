---
title: 'Tutorial: Create an end-to-end ETL pipeline to derive sales insights in Azure HDInsight'
description: Learn how to use create ETL pipelines with Azure HDInsight to derive insights from sales data by using Spark on-demand clusters and Power BI.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: tutorial
ms.custom: hdinsightactive
ms.date: 03/24/2020
---

# Tutorial: Create an end-to-end data pipeline to derive sales insights in Azure HDInsight

In this tutorial, you'll build an end-to-end data pipeline that performs extract, transform, and load (ETL) operations. The pipeline will use [Apache Spark](./spark/apache-spark-overview.md) and Apache Hive clusters running on Azure HDInsight for querying and manipulating the data. You'll also use technologies like Azure Data Lake Storage Gen2 for data storage, and Power BI for visualization.

This data pipeline combines the data from various stores, removes any unwanted data, appends new data, and loads all this back to your storage to visualize business insights. Read more about ETL pipelines in [Extract, transform, and load (ETL) at scale](./hadoop/apache-hadoop-etl-at-scale.md).

![ETL architecture](./media/hdinsight-sales-insights-etl/architecture.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure CLI. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

* A member of the [Azure built-in role - owner](../role-based-access-control/built-in-roles.md).

* [Power BI Desktop](https://www.microsoft.com/download/details.aspx?id=45331) to visualize business insights at the end of this tutorial.

## Create resources

### Clone the repository with scripts and data

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open Azure Cloud Shell from the top menu bar. Select your subscription for creating a file share if Cloud Shell prompts you.

   ![Open Azure Cloud Shell](./media/hdinsight-sales-insights-etl/hdinsight-sales-insights-etl-click-cloud-shell.png)

1. In the **Select environment** drop-down menu, choose **Bash**.

1. Ensure you're a member of the Azure role [owner](../role-based-access-control/built-in-roles.md). Replace `user@contoso.com` with your account and then enter the command:

    ```azurecli
    az role assignment list \
    --assignee "user@contoso.com" \
    --role "Owner"
    ```

    If no record is returned, you aren't a member and won't be able to complete this tutorial.

1. List your subscriptions entering the command:

    ```azurecli
    az account list --output table
    ```

    Note the ID of the subscription that you'll use for this project.

1. Set the subscription you'll use for this project. Replace `SUBSCRIPTIONID` with the actual value, then enter the command.

    ```azurecli
    subscriptionID="SUBSCRIPTIONID"
    az account set --subscription $subscriptionID
    ```

1. Create a new resource group for the project. Replace `RESOURCEGROUP` with the desired name, then enter the command.

    ```azurecli
    resourceGroup="RESOURCEGROUP"
    az group create --name $resourceGroup --location westus
    ```

1. Download the data and scripts for this tutorial from the [HDInsight sales insights ETL repository](https://github.com/Azure-Samples/hdinsight-sales-insights-etl).  Enter the following command:

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

1. Execute the script. Replace `RESOURCE_GROUP_NAME` and `LOCATION` with the relevant values, then enter the command:

    ```bash
    ./scripts/resources.sh RESOURCE_GROUP_NAME LOCATION
    ```

    The command will deploy the following resources:

    * An Azure Blob storage account. This account will hold the company sales data.
    * An Azure Data Lake Storage Gen2 account. This account will serve as the storage account for both HDInsight clusters. Read more about HDInsight and Data Lake Storage Gen2 in [Azure HDInsight integration with Data Lake Storage Gen2](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/).
    * A user-assigned managed identity. This account gives the HDInsight clusters access to the Data Lake Storage Gen2 account.
    * An Apache Spark cluster. This cluster will be used to clean up and transform the raw data.
    * An Apache Hive [Interactive Query](./interactive-query/apache-interactive-query-get-started.md) cluster. This cluster will allow querying the sales data and visualizing it with Power BI.
    * An Azure virtual network supported by network security group (NSG) rules. This virtual network allows the clusters to communicate and secures their communications.

Cluster creation can take around 20 minutes.

The `resources.sh` script contains the following commands. It isn't required for you to run these commands if you already executed the script in the previous step.

* `az group deployment create` - This command uses an Azure Resource Manager template (`resourcestemplate.json`) to create the specified resources with the desired configuration.

    ```azurecli
    az group deployment create --name ResourcesDeployment \
        --resource-group $resourceGroup \
        --template-file resourcestemplate.json \
        --parameters "@resourceparameters.json"
    ```

* `az storage blob upload-batch` - This command uploads the sales data .csv files into the newly created Blob storage account by using this command:

    ```azurecli
    az storage blob upload-batch -d rawdata \
        --account-name <BLOB STORAGE NAME> -s ./ --pattern *.csv
    ```

The default password for SSH access to the clusters is `Thisisapassword1`. If you want to change the password, go to the `resourcesparameters.json` file and change the password for the `sparksshPassword`, `sparkClusterLoginPassword`, `llapClusterLoginPassword`, and `llapsshPassword` parameters.

### Verify deployment and collect resource information

1. If you want to check the status of your deployment, go to the resource group on the Azure portal. Select **Deployments** under **Settings**. Select the name of your deployment, `ResourcesDeployment`. Here you can see the resources that have successfully deployed and the resources that are still in progress.

1. To view the names of the clusters, enter the following command:

    ```azurecli
    sparkCluster=$(az hdinsight list \
        --resource-group $resourceGroup \
        --query "[?contains(name,'spark')].{clusterName:name}" -o tsv)

    llapCluster=$(az hdinsight list \
        --resource-group $resourceGroup \
        --query "[?contains(name,'llap')].{clusterName:name}" -o tsv)

    echo $sparkCluster
    echo $llapCluster
    ```

1. To view the Azure storage account and access key, enter the following command:

    ```azurecli
    blobStorageName=$(cat resourcesoutputs.json | jq -r '.properties.outputs.blobStorageName.value')

    blobKey=$(az storage account keys list \
        --account-name $blobStorageName \
        --resource-group $resourceGroup \
        --query [0].value -o tsv)

    echo $blobStorageName
    echo $blobKey
    ```

1. To view the Data Lake Storage Gen2 account and access key, enter the following command:

    ```azurecli
    ADLSGen2StorageName=$(cat resourcesoutputs.json | jq -r '.properties.outputs.adlsGen2StorageName.value')

    adlsKey=$(az storage account keys list \
        --account-name $ADLSGen2StorageName \
        --resource-group $resourceGroup \
        --query [0].value -o tsv)

    echo $ADLSGen2StorageName
    echo $adlsKey
    ```

### Create a data factory

Azure Data Factory is a tool that helps automate Azure Pipelines. It's not the only way to accomplish these tasks, but it's a great way to automate the processes. For more information on Azure Data Factory, see the [Azure Data Factory documentation](https://azure.microsoft.com/services/data-factory/).

This data factory will have one pipeline with two activities:

* The first activity will copy the data from Azure Blob storage to the Data Lake Storage Gen 2 storage account to mimic data ingestion.
* The second activity will transform the data in the Spark cluster. The script transforms the data by removing unwanted columns. It also appends a new column that calculates the revenue that a single transaction generates.

To set up your Azure Data Factory pipeline, execute the following command:

```bash
./scripts/adf.sh
```

This script does the following things:

1. Creates a service principal with `Storage Blob Data Contributor` permissions on the Data Lake Storage Gen2 storage account.
1. Obtains an authentication token to authorize POST requests to the [Data Lake Storage Gen2 file system REST API](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/filesystem/create).
1. Fills in the actual name of your Data Lake Storage Gen2 storage account in the `sparktransform.py` and `query.hql` files.
1. Obtains storage keys for the Data Lake Storage Gen2 and Blob storage accounts.
1. Creates another resource deployment to create an Azure Data Factory pipeline, with its associated linked services and activities. It passes the storage keys as parameters to the template file so that the linked services can access the storage accounts correctly.

The Data Factory pipeline is deployed through the following command:

```azurecli-interactive
az group deployment create --name ADFDeployment \
    --resource-group $resourceGroup \
    --template-file adftemplate.json \
    --parameters "@adfparameters.json"
```

## Run the data pipeline

### Trigger the Data Factory activities

The first activity in the Data Factory pipeline that you've created moves the data from Blob storage to Data Lake Storage Gen2. The second activity applies the Spark transformations on the data and saves the transformed .csv files to a new location. The entire pipeline might take a few minutes to finish.

To trigger the pipelines, you can either:

* Trigger the Data Factory pipelines in PowerShell. Replace `DataFactoryName` with the actual Data Factory name, then run the following commands:

    ```powershell
    Invoke-AzDataFactoryV2Pipeline -DataFactory DataFactoryName -PipelineName "CopyPipeline_k8z"
    Invoke-AzDataFactoryV2Pipeline -DataFactory DataFactoryName -PipelineName "sparkTransformPipeline"
    ```

    Or

* Open the data factory and select **Author & Monitor**. Trigger the copy pipeline and then the Spark pipeline from the portal. For information on triggering pipelines through the portal, see [Create on-demand Apache Hadoop clusters in HDInsight using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md#trigger-a-pipeline).

To verify that the pipelines have run, you can take either of the following steps:

* Go to the **Monitor** section in your data factory through the portal.
* In Azure Storage Explorer, go to your Data Lake Storage Gen 2 storage account. Go to the `files` file system, and then go to the `transformed` folder and check its contents to see if the pipeline succeeded.

For other ways to transform data by using HDInsight, see [this article on using Jupyter Notebook](/azure/hdinsight/spark/apache-spark-load-data-run-query).

### Create a table on the Interactive Query cluster to view data on Power BI

1. Copy the `query.hql` file to the LLAP cluster by using SCP. Replace `LLAPCLUSTERNAME` with the actual name, then enter the command:

    ```bash
    scp scripts/query.hql sshuser@LLAPCLUSTERNAME-ssh.azurehdinsight.net:/home/sshuser/
    ```

2. Use SSH to access the LLAP cluster. Replace `LLAPCLUSTERNAME` with the actual name, then enter the command. If you haven't altered the `resourcesparameters.json` file, the password is `Thisisapassword1`.

    ```bash
    ssh sshuser@LLAPCLUSTERNAME-ssh.azurehdinsight.net
    ```

3. Use the following command to run the script:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f query.hql
    ```

This script will create a managed table on the Interactive Query cluster that you can access from Power BI.

### Create a Power BI dashboard from sales data

1. Open Power BI Desktop.
1. Select **Get Data**.
1. Search for **HDInsight Interactive Query cluster**.
1. Paste the URI for your cluster there. It should be in the format `https://LLAPCLUSTERNAME.azurehdinsight.net`.

   Enter `default` for the database.
1. Enter the username and password that you use to access the cluster.

After the data is loaded, you can experiment with the dashboard that you want to create. See the following links to get started with Power BI dashboards:

* [Introduction to dashboards for Power BI designers](https://docs.microsoft.com/power-bi/service-dashboards)
* [Tutorial: Get started with the Power BI service](https://docs.microsoft.com/power-bi/service-get-started)

## Clean up resources

If you're not going to continue to use this application, delete all resources by using the following command so that you aren't charged for them.

```azurecli-interactive
az group delete -n $resourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load (ETL) at scale](./hadoop/apache-hadoop-etl-at-scale.md)
