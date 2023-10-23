---
title: 'Quickstart: Create Apache Spark cluster using Bicep - Azure HDInsight'
description: This quickstart shows how to use Bicep to create an Apache Spark cluster in Azure HDInsight, and run a Spark SQL query.
author: apurbasroy
ms.author: apsinhar
ms.date: 09/15/2023
ms.topic: quickstart
ms.service: hdinsight
ms.custom: subject-armqs, mode-arm, devx-track-bicep
#Customer intent: As a developer new to Apache Spark on Azure, I need to see how to create a Spark cluster and query some data.
---

# Quickstart: Create Apache Spark cluster in Azure HDInsight using Bicep

In this quickstart, you use Bicep to create an [Apache Spark](./apache-spark-overview.md) cluster in Azure HDInsight. You then create a Jupyter Notebook file, and use it to run Spark SQL queries against Apache Hive tables. Azure HDInsight is a managed, full-spectrum, open-source analytics service for enterprises. The Apache Spark framework for HDInsight enables fast data analytics and cluster computing using in-memory processing. Jupyter Notebook lets you interact with your data, combine code with markdown text, and do simple visualizations.

If you're using multiple clusters together, you'll want to create a virtual network, and if you're using a Spark cluster you'll also want to use the Hive Warehouse Connector. For more information, see [Plan a virtual network for Azure HDInsight](../hdinsight-plan-virtual-network-deployment.md) and [Integrate Apache Spark and Apache Hive with the Hive Warehouse Connector](../interactive-query/apache-hive-warehouse-connector.md).

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-spark-linux/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.hdinsight/hdinsight-spark-linux/main.bicep":::

Two Azure resources are defined in the Bicep file:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters clusterName=<cluster-name> clusterLoginUserName=<cluster-username> sshUserName=<ssh-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -clusterName "<cluster-name>" -clusterLoginUserName "<cluster-username>" -sshUserName "<ssh-username>"
    ```

    ---

    You need to provide values for the parameters:

    * Replace **\<cluster-name\>** with the name of the HDInsight cluster to create.
    * Replace **\<cluster-username\>** with the credentials used to submit jobs to the cluster and to log in to cluster dashboards. The username has a minimum length of two characters and a maximum length of 20 characters. It must consist of digits, upper or lowercase letters, and/or the following special characters: (!#$%&\'()-^_`{}~).').
    * Replace **\<ssh-username\>** with the credentials used to remotely access the cluster. The username has a minimum length of two characters. It must consist of digits, upper or lowercase letters, and/or the following special characters: (%&\'^_`{}~). It cannot be the same as the cluster username.

    You'll be prompted to enter the following:

    * **clusterLoginPassword**, which must be at least 10 characters long and must contain at least one digit, one uppercase letter, one lowercase letter, and one non-alphanumeric character except single-quote, double-quote, backslash, right-bracket, full-stop. It also must not contain three consecutive characters from the cluster username or SSH username.
    * **sshPassword**, which must be 6-72 characters long and must contain at least one digit, one uppercase letter, and one lowercase letter. It must not contain any three consecutive characters from the cluster login name.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

If you run into an issue with creating HDInsight clusters, it could be that you don't have the right permissions to do so. For more information, see [Access control requirements](../hdinsight-hadoop-customize-cluster-linux.md#access-control).

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

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

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/jupyter-spark-kernel-status.png " alt-text="Screenshot showing that the kernel is ready." border="true":::

    When you start the notebook for the first time, the kernel performs some tasks in the background. Wait for the kernel to be ready.

1. Paste the following code in an empty cell, and then press **SHIFT + ENTER** to run the code. The command lists the Hive tables on the cluster:

    ```sql
    %%sql
    SHOW TABLES
    ```

    When you use a Jupyter Notebook file with your HDInsight cluster, you get a preset `spark` session that you can use to run Hive queries using Spark SQL. `%%sql` tells Jupyter Notebook to use the preset `spark` session to run the Hive query. The query retrieves the top 10 rows from a Hive table (**hivesampletable**) that comes with all HDInsight clusters by default. The first time you submit the query, Jupyter will create a Spark application for the notebook. It takes about 30 seconds to complete. Once the Spark application is ready, the query is executed in about a second and produces the results. The output looks like:

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-get-started-hive-query.png " alt-text="Screenshot that shows an Apache Hive query in HDInsight." border="true":::

    Every time you run a query in Jupyter, your web browser window title shows a **(Busy)** status along with the notebook title. You also see a solid circle next to the **PySpark** text in the top-right corner.

1. Run another query to see the data in `hivesampletable`.

    ```sql
    %%sql
    SELECT * FROM hivesampletable LIMIT 10
    ```

    The screen should refresh to show the query output.

    :::image type="content" source="./media/apache-spark-jupyter-spark-sql/hdinsight-spark-get-started-hive-query-output.png " alt-text="Screenshot that shows Hive query output in HDInsight." border="true":::

1. From the **File** menu on the notebook, select **Close and Halt**. Shutting down the notebook releases the cluster resources, including Spark application.

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you learned how to create an Apache Spark cluster in HDInsight and run a basic Spark SQL query. Advance to the next tutorial to learn how to use an HDInsight cluster to run interactive queries on sample data.

> [!div class="nextstepaction"]
> [Run interactive queries on Apache Spark](./apache-spark-load-data-run-query.md)
