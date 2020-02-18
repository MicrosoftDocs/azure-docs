---
title: 'Tutorial: Create an end-to-end ETL pipeline to derive sales insights'
description: Learn how to use create ETL pipelines with Azure HDInsight to derive insights from sales data by using Spark on-demand clusters and Power BI.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 09/30/2019
ms.author: hrasheed
---
# Tutorial: Create an end-to-end data pipeline to derive sales insights

In this tutorial, you'll build an end-to-end data pipeline that performs extract, transform, and load (ETL) operations. The pipeline will use Apache Spark and Apache Hive clusters running on Azure HDInsight for querying and manipulating the data. You'll also use technologies like Azure Data Lake Storage Gen2 for data storage, and Power BI for visualization.

This data pipeline combines the data from various stores, removes any unwanted data, appends new data, and loads all this back to your storage to visualize business insights. Read more about ETL pipelines in [Extract, transform, and load (ETL) at scale](./hadoop/apache-hadoop-etl-at-scale.md).

![ETL architecture](./media/hdinsight-sales-insights-etl/architecture.png)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

Download [Power BI Desktop](https://www.microsoft.com/download/details.aspx?id=45331) to visualize business insights at the end of this tutorial.

## Create resources

### Clone the repository with scripts and data

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open Azure Cloud Shell from the top menu bar. Select your subscription for creating a file share if Cloud Shell prompts you.

   ![Open Azure Cloud Shell](./media/hdinsight-sales-insights-etl/hdinsight-sales-insights-etl-click-cloud-shell.png)
1. In the **Select environment** drop-down menu, choose **Bash**.
1. Sign in to your Azure account and set the subscription. 
1. Set up the resource group for the project.
   1. Choose a unique name for the resource group.
   1. Run the following code snippet in Cloud Shell to set variables that will be used in later steps:

       ```azurecli-interactive 
       resourceGroup="<RESOURCE GROUP NAME>"
       subscriptionID="<SUBSCRIPTION ID>"
        
       az account set --subscription $subscriptionID
       az group create --name $resourceGroup --location westus
       ```

1. Download the data and scripts for this tutorial from the [HDInsight sales insights ETL repository](https://github.com/Azure-Samples/hdinsight-sales-insights-etl) by entering the following commands in Cloud Shell:

    ```azurecli-interactive 
    git clone https://github.com/Azure-Samples/hdinsight-sales-insights-etl.git
    cd hdinsight-sales-insights-etl
    ```

1. Enter `ls` at the shell prompt to see that the following files and directories have been created:

   ```output
   /salesdata/
   /scripts/
   /templates/
   ```

### Deploy Azure resources needed for the pipeline 

1. Add execute permissions for the `chmod +x scripts/*.sh` script.
1. Use the command `./scripts/resources.sh <RESOURCE_GROUP_NAME> <LOCATION>` to run the script to deploy the following resources in Azure:

   1. An Azure Blob storage account. This account will hold the company sales data.
   2. An Azure Data Lake Storage Gen2 account. This account will serve as the storage account for both HDInsight clusters. Read more about HDInsight and Data Lake Storage Gen2 in [Azure HDInsight integration with Data Lake Storage Gen2](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/).
   3. A user-assigned managed identity. This account gives the HDInsight clusters access to the Data Lake Storage Gen2 account.
   4. An Apache Spark cluster. This cluster will be used to clean up and transform the raw data.
   5. An Apache Hive Interactive Query cluster. This cluster will allow querying the sales data and visualizing it with Power BI.
   6. An Azure virtual network supported by network security group (NSG) rules. This virtual network allows the clusters to communicate and secures their communications. 

Cluster creation can take around 20 minutes.

The `resources.sh` script contains the following command. This command uses an Azure Resource Manager template (`resourcestemplate.json`) to create the specified resources with the desired configuration.

```azurecli-interactive 
az group deployment create --name ResourcesDeployment \
    --resource-group $resourceGroup \
    --template-file resourcestemplate.json \
    --parameters "@resourceparameters.json"
```

The `resources.sh` script also uploads the sales data .csv files into the newly created Blob storage account by using this command:

```
az storage blob upload-batch -d rawdata \
    --account-name <BLOB STORAGE NAME> -s ./ --pattern *.csv
```

The default password for SSH access to the clusters is `Thisisapassword1`. If you want to change the password, go to the `resourcesparameters.json` file and change the password for the `sparksshPassword`, `sparkClusterLoginPassword`, `llapClusterLoginPassword`, and `llapsshPassword` parameters.

### Verify deployment and collect resource information

1. If you want to check the status of your deployment, go to the resource group on the Azure portal. Select **Deployments** under **Settings**. Select the name of your deployment, `ResourcesDeployment`. Here you can see the resources that have successfully deployed and the resources that are still in progress.
1. After the deployment has finished, go to the Azure portal > **Resource groups** > <RESOURCE_GROUP_NAME>.
1. Locate the new Azure storage account that was created for storing the sales files. The name of the storage account begins with `blob` and then contains a random string. Do the following:
   1. Make a note of the storage account name for later use.
   1. Select the name of the Blob storage account.
   1. On the left side of the portal under **Settings**, select **Access keys**.
   1. Copy the string in the **Key1** box and save it for later use.
1. Locate the Data Lake Storage Gen2 account that was created as storage for the HDInsight clusters. This account is located in the same resource group as the Blob storage account, but begins with `adlsgen2`. Do the following:
   1. Make a note of the name of the Data Lake Storage Gen2  account.
   1. Select the name of the Data Lake Storage Gen2 account.
   1. On the left side of the portal, under **Settings**, select **Access keys**.
   1. Copy the string in the **Key1** box and save it for later use.

> [!Note]
> After you know the names of the storage accounts, you can get the account keys by using the following command at the Azure Cloud Shell prompt:
> ```azurecli-interactive
> az storage account keys list \
>    --account-name <STORAGE NAME> \
>    --resource-group $rg \
>    --output table
> ```

### Create a data factory

Azure Data Factory is a tool that helps automate Azure pipelines. It's not the only way to accomplish these tasks, but it's a great way to automate the processes. For more information on Azure Data Factory, see the [Azure Data Factory documentation](https://azure.microsoft.com/services/data-factory/). 

This data factory will have one pipeline with two activities: 

- The first activity will copy the data from Azure Blob storage to the Data Lake Storage Gen 2 storage account to mimic data ingestion.
- The second activity will transform the data in the Spark cluster. The script transforms the data by removing unwanted columns. It also appends a new column that calculates the revenue that a single transaction generates.

To set up your Azure Data Factory pipeline, run the `adf.sh` script:

1. Use `chmod +x adf.sh` to add execute permissions on the file.
1. Use `./adf.sh` to run the script. 

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

- Run the following commands to trigger the Data Factory pipelines in PowerShell: 

    ```powershell
    Invoke-AzDataFactoryV2Pipeline -DataFactory $df -PipelineName "CopyPipeline_k8z" 
    Invoke-AzDataFactoryV2Pipeline -DataFactory $df -PipelineName "sparkTransformPipeline"
    ```

- Open the data factory and select **Author & Monitor**. Trigger the copy pipeline and then the Spark pipeline from the portal. For information on triggering pipelines through the portal, see [Create on-demand Apache Hadoop clusters in HDInsight using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md#trigger-a-pipeline).

To verify that the pipelines have run, you can take either of the following steps:

- Go to the **Monitor** section in your data factory through the portal.
- In Azure Storage Explorer, go to your Data Lake Storage Gen 2 storage account. Go to the `files` file system, and then go to the `transformed` folder and check its contents to see if the pipeline succeeded.

For other ways to transform data by using HDInsight, see [this article on using Jupyter Notebook](/azure/hdinsight/spark/apache-spark-load-data-run-query).

### Create a table on the Interactive Query cluster to view data on Power BI

1. Copy the `query.hql` file to the LLAP cluster by using SCP:

    ```
    scp scripts/query.hql sshuser@<clustername>-ssh.azurehdinsight.net:/home/sshuser/
    ```

2. Use SSH to access the LLAP cluster by using the following command, and then enter your password. If you haven't altered the `resourcesparameters.json` file, the password is `Thisisapassword1`.

    ```
    ssh sshuser@<clustername>-ssh.azurehdinsight.net
    ```

3. Use the following command to run the script:

    ```
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f query.hql
    ```

This script will create a managed table on the Interactive Query cluster that you can access from Power BI. 

### Create a Power BI dashboard from sales data

1. Open Power BI Desktop.
1. Select **Get Data**.
1. Search for **HDInsight Interactive Query cluster**.
1. Paste the URI for your cluster there. It should be in the format `https://<LLAP CLUSTER NAME>.azurehdinsight.net`.

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
