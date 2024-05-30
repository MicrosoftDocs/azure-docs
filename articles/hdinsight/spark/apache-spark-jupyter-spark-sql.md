---
title: 'Quickstart: Create Apache Spark cluster using template - Azure HDInsight'
description: This quickstart shows how to use Resource Manager template to create an Apache Spark cluster in Azure HDInsight, and run a Spark SQL query.
ms.date: 09/15/2023
ms.topic: quickstart
ms.service: hdinsight
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
#Customer intent: As a developer new to Apache Spark on Azure, I need to see how to create a Spark cluster and query some data.
---

# Quickstart: Create Apache Spark cluster in Azure HDInsight using ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an [Apache Spark](./apache-spark-overview.md) cluster in Azure HDInsight. You then create a Jupyter Notebook file, and use it to run Spark SQL queries against Apache Hive tables. Azure HDInsight is a managed, full-spectrum, open-source analytics service for enterprises. The Apache Spark framework for HDInsight enables fast data analytics and cluster computing using in-memory processing. Jupyter Notebook lets you interact with your data, combine code with markdown text, and do simple visualizations.

If you're using multiple clusters together, you'll want to create a virtual network, and if you're using a Spark cluster you'll also want to use the Hive Warehouse Connector. For more information, see [Plan a virtual network for Azure HDInsight](../hdinsight-plan-virtual-network-deployment.md) and [Integrate Apache Spark and Apache Hive with the Hive Warehouse Connector](../interactive-query/apache-hive-warehouse-connector.md).

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-spark-linux%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-spark-linux/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.hdinsight/hdinsight-spark-linux/azuredeploy.json":::

Two Azure resources are defined in the template:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

## Deploy the template

1. Select the **Deploy to Azure** button below to sign in to Azure and open the ARM template.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-spark-linux%2Fazuredeploy.json":::

1. Enter or select the following values:

    |Property |Description |
    |---|---|
    |Subscription|From the drop-down list, select the Azure subscription that's used for the cluster.|
    |Resource group|From the drop-down list, select your existing resource group, or select **Create new**.|
    |Location|The value will autopopulate with the location used for the resource group.|
    |Cluster Name|Enter a globally unique name. For this template, use only lowercase letters, and numbers.|
    |Cluster Login User Name|Provide the username, default is `admin`.|
    |Cluster Login Password|Provide a password. The password must be at least 10 characters in length and must contain at least one digit, one uppercase, and one lower case letter, one non-alphanumeric character (except characters ```' ` "```). |
    |Ssh User Name|Provide the username, default is `sshuser`.|
    |Ssh Password|Provide the password.|

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/resource-manager-template-spark.png " alt-text="Create Spark cluster in HDInsight using Azure Resource Manager template." border="true":::

1. Review the **TERMS AND CONDITIONS**. Then select **I agree to the terms and conditions stated above**, then **Purchase**. You'll receive a notification that your deployment is in progress. It takes about 20 minutes to create a cluster.

If you run into an issue with creating HDInsight clusters, it could be that you don't have the right permissions to do so. For more information, see [Access control requirements](../hdinsight-hadoop-customize-cluster-linux.md#access-control).

## Review deployed resources

Once the cluster is created, you'll receive a **Deployment succeeded** notification with a **Go to resource** link. Your Resource group page will list your new HDInsight cluster and the default storage associated with the cluster. Each cluster has an [Azure Storage](../hdinsight-hadoop-use-blob-storage.md), an [Azure Data Lake Storage Gen1](../hdinsight-hadoop-use-data-lake-storage-gen1.md), or an [`Azure Data Lake Storage Gen2`](../hdinsight-hadoop-use-data-lake-storage-gen2.md) dependency. It's referred as the default storage account. HDInsight cluster and its default storage account must be colocated in the same Azure region. Deleting clusters doesn't delete the storage account dependency. It's referred as the default storage account. The HDInsight cluster and its default storage account must be colocated in the same Azure region. Deleting clusters doesn't delete the storage account.

## Create a Jupyter Notebook file

[Jupyter Notebook](https://jupyter.org/) is an interactive notebook environment that supports various programming languages. You can use a Jupyter Notebook file to interact with your data, combine code with markdown text, and perform simple visualizations.

1. Open the [Azure portal](https://portal.azure.com).

2. Select **HDInsight clusters**, and then select the cluster you created.

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/azure-portal-open-hdinsight-cluster.png" alt-text="Open HDInsight cluster in the Azure portal." border="true":::

3. From the portal, in **Cluster dashboards** section, select **Jupyter Notebook**. If prompted, enter the cluster login credentials for the cluster.

   :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-open-jupyter-interactive-spark-sql-query.png " alt-text="Open Jupyter Notebook to run interactive Spark SQL query." border="true":::

4. Select **New** > **PySpark** to create a notebook.

   :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-create-jupyter-interactive-spark-sql-query.png " alt-text="Create a Jupyter Notebook file to run interactive Spark SQL query." border="true":::

   A new notebook is created and opened with the name Untitled(Untitled.pynb).

## Run Apache Spark SQL statements

SQL (Structured Query Language) is the most common and widely used language for querying and transforming data. Spark SQL functions as an extension to Apache Spark for processing structured data, using the familiar SQL syntax.

1. Verify the kernel is ready. The kernel is ready when you see a hollow circle next to the kernel name in the notebook. Solid circle denotes that the kernel is busy.

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/jupyter-spark-kernel-status.png " alt-text="Kernel status" border="true"::: alt-text="Kernel status." border="true":::

    When you start the notebook for the first time, the kernel performs some tasks in the background. Wait for the kernel to be ready.

1. Paste the following code in an empty cell, and then press **SHIFT + ENTER** to run the code. The command lists the Hive tables on the cluster:

    ```sql
    %%sql
    SHOW TABLES
    ```

    When you use a Jupyter Notebook file with your HDInsight cluster, you get a preset `spark` session that you can use to run Hive queries using Spark SQL. `%%sql` tells Jupyter Notebook to use the preset `spark` session to run the Hive query. The query retrieves the top 10 rows from a Hive table (**hivesampletable**) that comes with all HDInsight clusters by default. The first time you submit the query, Jupyter will create a Spark application for the notebook. It takes about 30 seconds to complete. Once the Spark application is ready, the query is executed in about a second and produces the results. The output looks like:

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-get-started-hive-query.png " alt-text="Apache Hive query in HDInsight." border="true":::y in HDInsight" border="true":::

    Every time you run a query in Jupyter, your web browser window title shows a **(Busy)** status along with the notebook title. You also see a solid circle next to the **PySpark** text in the top-right corner.

1. Run another query to see the data in `hivesampletable`.

    ```sql
    %%sql
    SELECT * FROM hivesampletable LIMIT 10
    ```

    The screen shall refresh to show the query output.

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-get-started-hive-query-output.png " alt-text="Hive query output in HDInsight." border="true":::Insight" border="true":::

1. From the **File** menu on the notebook, select **Close and Halt**. Shutting down the notebook releases the cluster resources, including Spark application.

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

From the Azure portal, navigate to your cluster, and select **Delete**.

:::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-azure-portal-delete-cluster.png " alt-text="Azure portal delete an HDInsight cluster." border="true":::sight cluster" border="true":::

You can also select the resource group name to open the resource group page, and then select **Delete resource group**. By deleting the resource group, you delete both the HDInsight cluster, and the default storage account.

## Next steps

In this quickstart, you learned how to create an Apache Spark cluster in HDInsight and run a basic Spark SQL query. Advance to the next tutorial to learn how to use an HDInsight cluster to run interactive queries on sample data.

> [!div class="nextstepaction"]
> [Run interactive queries on Apache Spark](./apache-spark-load-data-run-query.md)
