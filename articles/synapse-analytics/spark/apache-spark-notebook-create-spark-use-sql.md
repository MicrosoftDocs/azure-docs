---
title: 'Quickstart: Create a Spark pool in Azure Synapse Analytics'
description: This quickstart shows how to use the web tools to create an Apache Spark pool in Azure Synapse Analytics, and run a Spark SQL query.
author: euangMS
ms.author: euang 
ms.reviewer: euang
ms.service: sql-data-warehouse
ms.subservice: design
ms.topic: quickstart
ms.date: 09/15/2019

#Customer intent: As a developer new to Apache Spark on Azure, I need to see how to create a Spark pool and query some data.
---

# Quickstart: Create Apache Spark pool in Synapse Analytics using web tools

Learn how to create Apache Spark pool in Azure Synapse Analytics, and how to run Spark SQL queries against files and tables. Apache Spark enables fast data analytics and cluster computing using in-memory processing. For information on Spark on Synapse Analytics, see [Overview: Apache Spark on Azure Synapse Analytics](apache-spark-overview.md).

In this quickstart, you use the Synapse Analytics tools to create a Spark pool and then connect to a Spark pool created from that template. <!---For more information on using Data Lake Storage Gen2, see the following article:--->

<!--- TODO: >> [!IMPORTANT]
> TODO Need a link to a Gen 2 Storage in Synapse Analytics article
--->
> [!IMPORTANT]  
> Billing for Spark instances is prorated per minute, whether you are using them or not. Be sure to shutdown your Spark instance after you have finished using it, or set a short timeout. For more information, see the [Clean up resources](#clean-up-resources) section of this article.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a Synapse Analytics Spark pool

<!---If you do not already have a Synapse Analytics workspace created, go to

> [!IMPORTANT]
> TODO Need a link to a create a workspace article
--->

1. In the Azure portal, select the correct Synapse Analytics workspace. 

    ![Synapse Analytics on Azure portal](./media/apache-spark-notebook-create-spark-use-sql/create-spark-pool-template.png "Synapse Analytics on Azure portal")
2. From the toolbar, select **New Spark pool**
3. Under **Basics**, provide the following values:
    |Property  |Description  |
    |---------|---------|
    |**Spark pool name**     | Give a name to your Synapse Analytics Spark pool. The pool name used for this quickstart is **myspark201911**.|
    |**Node size**     | From the drop-down, select a node size to be used for all the nodes in the pool. 
    |**Autoscale**| If enabled, your Spark pool will automatically scale up and down based on the amount of activity|
    |**Number of nodes**| This sets the minimum and maximum node count for pool. If auto scale is enabled, the pool node count will not grow to be greater than the maximum|
    ![Create Synapse Analytics Spark pool template basic configurations](./media/apache-spark-notebook-create-spark-use-sql/azure-portal-create-spark-pool-template-basics.png "Create Spark pool in Synapse Analytics the Basic configurations")

    Select **Next** to continue to the **Additional settings** page.
4. Under **Additional Settings**, provide the following values:
    |Property  |Description  |
    |---------|---------|
    **Autopause**| If enabled, the Spark pools created from this template will automatically pause after a specified amount of idle time.
    **Number of minutes idle**| The amount of time before a pool will autopause

     ![Create Synapse Analytics Spark pool configurations](./media/apache-spark-notebook-create-spark-use-sql/create-spark-pool-template-additional.png "Create Spark pool in Synapse Analytics the additional settings")

     Select **Next** to continue to the **Tags** page. 
5. Select **Next** to continue to the **Summary** page.

6. On **Summary**, select **Create**. Creation of Spark pool template should be fast, in the order of seconds.

If you have problems creating Synapse Analytics Spark pools, it could be permissions-related. For more information, see...?
> [!IMPORTANT]
> TODO: Need an article here about permissions to create, edit, delete Spark pools

## Create a notebook

A Notebook is an interactive environment that supports various programming languages. The notebook allows you to interact with your data, combine code with markdown text and perform simple visualizations,

1. From the Azure portal view for the Synapse Analytics workspace you want to use, select launch workspace.
2. Once Synapse Analytics Studio has launched select **Analyze** then hover over the **Notebooks** entry. Select the ellipsis **...**
3. From there select **Create Notebook**

   A new notebook is created and opened with an automatically generated name.

4. Rename the notebook, selecting it in the navigation view, selecting the ellipsis and then selecting **Rename**.

   The notebook can be named anything you want, ours is named "Seattle Safety".

5. Press **Publish All** on the toolbar.

6. If there is only one Spark pool in your workspace, then it will be selected by default. Use the drop-down to select the correct Spark pool if none is selected.

7. The default language will be "Pyspark", we are going to use a mix of Pyspark and Spark SQL so the default choice is fine.

8. We are going to use the [Seattle Safety Data](https://azure.microsoft.com/en-us/services/open-datasets/catalog/seattle-safety-data/) from the Azure Open Datasets portfolio.

> [!IMPORTANT]
> There may be additional charges associated with using one of these datasets.

9. Retrieve the data from Azure Open Datasets and save it to a temporary table in Spark. Enter the following code in the first cell of the "Seattle Safety" notebook to ingest the data:

```Python
from azureml.opendatasets import SeattleSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety_df = SeattleSafety(start_date=start_date, end_date=end_date)
safety_df = safety.to_spark_dataframe()
safety_df.registerTempTable("seattlesafety")
```

10. Now run the cell, running the cell can be accomplished by,
    a. Pressing **SHIFT + ENTER**
    b. Pressing the blue play icon to the left of the cell
    c. Selecting the **Run all** button on the toolbar

11. If the pool instance is not already running, it will be automatically started. You can see the status of the pool instance below the cell you are running and also on the status panel at the bottom of the notebook. Depending on the size of pool, starting should take 2-5 minutes.

Once the code has finished running, there will be information below the cell on how long it took to run. In the output cell, you should see the activity steps of the code and a job status view.

 ![Output from executing a cell](./media/apache-spark-notebook-create-spark-use-sql/load-datasets-output-cell.png "Output from the Spark job to load the Open datasets data ")

## Run Spark SQL statements

SQL (Structured Query Language) is the most common and widely used language for querying and defining data. Spark SQL functions as an extension to Apache Spark for processing structured data, using the familiar SQL syntax.

1. Paste the following code in an empty cell, and then run the code. The command lists the tables on the pool:

    ```sql
    %%sql
    SHOW TABLES
    ```

    When you use a Notebook with your Synapse Analytics Spark pool, you get a preset `sqlContext` that you can use to run queries using Spark SQL. `%%sql` tells the Notebook to use the preset `sqlContext` to run the query. The query retrieves the top 10 rows from a system table that comes with all Synapse Analytics Spark pools by default. It takes about 30 seconds to get the results. The output looks like: 

    ![Query in Synapse Analytics Spark](./media/apache-spark-notebook-create-spark-use-sql/spark-get-started-query.png "Query in Synapse Analytics Spark")

    Every time you run a query in a notebook, the status directly under the cell shows that the query is running. The play icon to the left of the cell will also change to a stop icon.

2. Run another query to see the data in `seattlesafety`.

    ```sql
    %%sql
    SELECT * FROM seattlesafety LIMIT 10
    ```

    The code will produce two output cells, one that contains data results the other, which shows the job view.

    By default the results view shows a grid, but there is a view switcher underneath the grid that allows the view to switch between grid and graph views.

    ![Query output in Synapse Analytics Spark](./media/apache-spark-notebook-create-spark-use-sql/spark-get-started-query-chart-output.png "Query output in Synapse Analytics Spark")

3. Select **chart option** from the view switcher.
4. In the **keys** list drag "category" in and remove any other fields.
5. In the values list, make sure "status" is the only field there.
6. Change the **Aggregation** to "COUNT".
7. For **Display Type** select "Bar chart".
8. Select **Apply**.

## Clean up resources

Synapse Analytics saves your data in Azure Storage or Azure Data Lake Storage. You can safely let a Spark instance shut down when it is not in use. You are charged for an Synapse Analytics Spark pool as long as it is running, even when it is not in use. Since the charges for the pool are many times more than the charges for storage, it makes economic sense to let Spark instances shut down when they are not in use. If you plan to work on the tutorial listed in [Next steps](#next-steps) immediately, you might want to keep the Spark instance.

To ensure the Spark instance is shut down, end any connected sessions(notebooks), the pool will then shut down then the **idle time** specified in the Spark pool is reached.

## Next steps

In this quickstart, you learned how to create a Synapse Analytics Spark pool and run a basic Spark SQL query.
