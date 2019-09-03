---
title: 'Tutorial: Analyze Apache Spark data using Power BI in Azure HDInsight '
description: Tutorial - Use Microsoft Power BI to visualize Apache Spark data stored HDInsight clusters  
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,mvc
ms.topic: tutorial
ms.date: 05/16/2019

#custom intent: As a developer new to Apache Spark and to Apache Spark in Azure HDInsight, I want to learn how to virtualize Spark data in BI tools.
---

# Tutorial: Analyze Apache Spark data using Power BI in HDInsight

In this tutorial, you learn how to use [Microsoft Power BI](https://powerbi.microsoft.com/) to visualize data in an Apache Spark cluster in [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/).

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Visualize Spark data using Power BI

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Complete the article [Tutorial: Load data and run queries on an Apache Spark cluster in Azure HDInsight](./apache-spark-load-data-run-query.md).

* [Power BI Desktop](https://powerbi.microsoft.com/en-us/desktop/).

* Optional: [Power BI trial subscription](https://app.powerbi.com/signupredirect?pbi_source=web).

## Verify the data

The [Jupyter Notebook](https://jupyter.org/) that you created in the [previous tutorial](apache-spark-load-data-run-query.md) includes code to create an `hvac` table. This table is based on the CSV file available on all HDInsight Spark clusters at `\HdiSamples\HdiSamples\SensorSampleData\hvac\hvac.csv`. Use the following procedure to verify the data.

1. From the Jupyter notebook, paste the following code, and then press **SHIFT + ENTER**. The code verifies the existence of the tables.

    ```PySpark
    %%sql
    SHOW TABLES
    ```

    The output looks like:

    ![Show tables in Spark](./media/apache-spark-use-bi-tools/show-tables.png)

    If you closed the notebook before starting this tutorial, `hvactemptable` is cleaned up, so it's not included in the output.  Only Hive tables that are stored in the metastore (indicated by **False** under the **isTemporary** column) can be accessed from the BI tools. In this tutorial, you connect to the **hvac** table that you created.

2. Paste the following code in an empty cell, and then press **SHIFT + ENTER**. The code verifies the data in the table.

    ```PySpark
    %%sql
    SELECT * FROM hvac LIMIT 10
    ```

    The output looks like:

    ![Show rows from hvac table in Spark](./media/apache-spark-use-bi-tools/select-limit.png)

3. From the **File** menu on the notebook, select **Close and Halt**. Shut down the notebook to release the resources.

## Visualize the data

In this section, you use Power BI to create visualizations, reports, and dashboards from the Spark cluster data.

### Create a report in Power BI Desktop

The first steps in working with Spark are to connect to the cluster in Power BI Desktop, load data from the cluster, and create a basic visualization based on that data.

> [!NOTE]  
> The connector demonstrated in this article is currently in preview. Provide any feedback you have through the [Power BI Community](https://community.powerbi.com/) site or [Power BI Ideas](https://ideas.powerbi.com/forums/265200-power-bi-ideas).

1. Open Power BI Desktop. Close the start up splash screen if it opens.

2. From the **Home** tab, navigate to **Get Data** > **More..**.

    ![Get data into Power BI Desktop from HDInsight Apache Spark](./media/apache-spark-use-bi-tools/hdinsight-spark-power-bi-desktop-get-data.png "Get data into Power BI from Apache Spark BI")

3. Enter `Spark` in the search box, select **Azure HDInsight Spark**, and then select **Connect**.

    ![Get data into Power BI from Apache Spark BI](./media/apache-spark-use-bi-tools/apache-spark-bi-import-data-power-bi.png "Get data into Power BI from Apache Spark BI")

4. Enter your cluster URL (in the form `mysparkcluster.azurehdinsight.net`) in the **Server** text box.

5. Under **Data connectivity mode**, select **DirectQuery**. Then select **OK**.

    You can use either data connectivity mode with Spark. If you use DirectQuery, changes are reflected in reports without refreshing the entire dataset. If you import data, you must refresh the data set to see changes. For more information on how and when to use DirectQuery, see [Using DirectQuery in Power BI](https://powerbi.microsoft.com/documentation/powerbi-desktop-directquery-about/).

6. Enter the HDInsight login account information, then select **Connect**. The default account name is *admin*.

7. Select the `hvac` table, wait to see a preview of the data, and then select **Load**.

    ![Spark cluster user name and password](./media/apache-spark-use-bi-tools/apache-spark-bi-select-table.png "Spark cluster user name and password")

    Power BI Desktop has the information it needs to connect to the Spark cluster and load data from the `hvac` table. The table and its columns are displayed in the **Fields** pane.

8. Visualize the variance between target temperature and actual temperature for each building:

    1. In the **VISUALIZATIONS** pane, select **Area Chart**.

    2. Drag the **BuildingID** field to **Axis**, and drag the **ActualTemp** and **TargetTemp** fields to **Value**.

        ![Create Spark data visualizations using Apache Spark BI](./media/apache-spark-use-bi-tools/apache-spark-bi-add-value-columns.png "Create Spark data visualizations using Apache Spark BI")

        The diagram looks like:

        ![Create Spark data visualizations using Apache Spark BI](./media/apache-spark-use-bi-tools/apache-spark-bi-area-graph-sum.png "Create Spark data visualizations using Apache Spark BI")

        By default the visualization shows the sum for **ActualTemp** and **TargetTemp**. Select the down arrow next to **ActualTemp** and **TragetTemp** in the Visualizations pane, you can see **Sum** is selected.

    3. Select the down arrows next to **ActualTemp** and **TragetTemp** in the Visualizations pane, select **Average** to get an average of actual and target temperatures for each building.

        ![Create Spark data visualizations using Apache Spark BI](./media/apache-spark-use-bi-tools/apache-spark-bi-average-of-values.png "Create Spark data visualizations using Apache Spark BI")

        Your data visualization shall be similar to the one in the screenshot. Move your cursor over the visualization to get tool tips with relevant data.

        ![Create Spark data visualizations using Apache Spark BI](./media/apache-spark-use-bi-tools/apache-spark-bi-area-graph.png "Create Spark data visualizations using Apache Spark BI")

9. Navigate to **File** > **Save**, enter the name `BuildingTemperature` for the file, then select **Save**.

### Publish the report to the Power BI Service (optional)

The Power BI service allows you to share reports and dashboards across your organization. In this section, you first publish the dataset and the report. Then, you pin the report to a dashboard. Dashboards are typically used to focus on a subset of data in a report; you have only one visualization in your report, but it's still useful to go through the steps.

1. Open Power BI Desktop.
2. From the **Home** tab, click **Publish**.

    ![Publish from Power BI Desktop](./media/apache-spark-use-bi-tools/apache-spark-bi-publish.png "Publish from Power BI Desktop")

2. Select a workspace to publish your dataset and report to, then click **Select**. In the following image, the default **My Workspace** is selected.

    ![Select workspace to publish dataset and report to](./media/apache-spark-use-bi-tools/apache-spark-bi-select-workspace.png "Select workspace to publish dataset and report to") 

3. After the publishing is succeeded, click **Open 'BuildingTemperature.pbix' in Power BI**.

    ![Publish success, click to enter credentials](./media/apache-spark-use-bi-tools/apache-spark-bi-publish-success.png "Publish success, click to enter credentials") 

4. In the Power BI service, click **Enter credentials**.

    ![Enter credentials in Power BI service](./media/apache-spark-use-bi-tools/apache-spark-bi-enter-credentials.png "Enter credentials in Power BI service")

5. Click **Edit credentials**.

    ![Edit credentials in Power BI service](./media/apache-spark-use-bi-tools/apache-spark-bi-edit-credentials.png "Edit credentials in Power BI service")

6. Enter the HDInsight login account information, and then click **Sign in**. The default account name is *admin*.

    ![Sign in to Spark cluster](./media/apache-spark-use-bi-tools/apache-spark-bi-sign-in.png "Sign in to Spark cluster")

7. In the left pane, go to **Workspaces** > **My Workspace** > **REPORTS**, then click **BuildingTemperature**.

    ![Report listed under reports in left pane](./media/apache-spark-use-bi-tools/apache-spark-bi-service-left-pane.png "Report listed under reports in left pane")

    You should also see **BuildingTemperature** listed under **DATASETS** in the left pane.

    The visual you created in Power BI Desktop is now available in the Power BI service. 

8. Hover your cursor over the visualization, and then click the pin icon on the upper right corner.

    ![Report in the Power BI service](./media/apache-spark-use-bi-tools/apache-spark-bi-service-report.png "Report in the Power BI service")

9. Select "New dashboard", enter the name `Building temperature`, then click **Pin**.

    ![Pin to new dashboard](./media/apache-spark-use-bi-tools/apache-spark-bi-pin-dashboard.png "Pin to new dashboard")

10. In the report, click **Go to dashboard**. 

Your visual is pinned to the dashboard - you can add other visuals to the report and pin them to the same dashboard. For more information about reports and dashboards, see [Reports in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-reports/) and [Dashboards in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-dashboards/).

## Clean up resources

After you complete the tutorial, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

To delete a cluster, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](../hdinsight-delete-cluster.md).

## Next steps

In this tutorial, you learned how to use [Microsoft Power BI](https://powerbi.microsoft.com/) to visualize data in an Apache Spark cluster in [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/). Advance to the next article to see how the data you registered in Spark can be pulled into a BI analytics tool such as Power BI.

> [!div class="nextstepaction"]
> [Run an Apache Spark streaming job](apache-spark-eventhub-streaming.md)