---
title: Transform data using a mapping data flow
description:  This tutorial provides step-by-step instructions for using Azure Data Factory to transform data with mapping data flow
author: whhender
ms.author: whhender
ms.reviewer: makromer
ms.subservice: data-flows
ms.topic: tutorial
ms.date: 04/18/2025

#customer intent: As a data factory user, I want to know the basics of creating a data flow so that I can apply these principals to my own data and begin using Data Factory for our workflows.

---

# Tutorial: Transform data using mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this tutorial, you use the Azure Data Factory user interface (UX) to create a pipeline that copies and transforms data from an Azure Data Lake Storage (ADLS) Gen2 source to an ADLS Gen2 sink using mapping data flow. The configuration pattern in this tutorial can be expanded upon when transforming data using mapping data flow

This tutorial is meant for mapping data flows in general. Data flows are available both in Azure Data Factory and Synapse Pipelines. If you're new to data flows in Azure Synapse Pipelines, follow [Data Flow using Azure Synapse Pipelines](../synapse-analytics/concepts-data-flow-overview.md).

In this tutorial, you do the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a Data Flow activity.
> * Build a mapping data flow with four transformations.
> * Test run the pipeline.
> * Monitor a Data Flow activity

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure Data Lake Storage Gen2 account**. You use ADLS storage as a *source* and *sink* data stores. If you don't have a storage account, see [Create an Azure storage account](../storage/blobs/create-data-lake-storage-account.md) for steps to create one.
* **Download MoviesDB.csv [here](https://raw.githubusercontent.com/djpmsft/adf-ready-demo/master/moviesDB.csv).** To retrieve the file from GitHub, copy the contents to a text editor of your choice to save locally as a .csv file. [Upload the file to your storage account](../storage/blobs/storage-quickstart-blobs-portal.md) in a container named 'sample-data'.

## Create a data factory

In this step, you create a data factory and open the Data Factory UX to create a pipeline in the data factory.

1. Open **Microsoft Edge** or **Google Chrome**. Currently, Data Factory UI is supported only in the Microsoft Edge and Google Chrome web browsers.
1. On the top menu, select **Create a resource** > **Analytics** > **Data Factory** :

   :::image type="content" source="./media/doc-common-process/new-azure-data-factory-menu.png" alt-text="Data Factory selection in the &quot;New&quot; pane":::

1. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**.

   The name of the Azure data factory must be *globally unique*. If you receive an error message about the name value, enter a different name for the data factory. (for example, yournameADFTutorialDataFactory). For naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).

    :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="New data factory error message for duplicate name.":::
1. Select the Azure **subscription** in which you want to create the data factory.
1. For **Resource Group**, take one of the following steps:

    1. Select **Use existing**, and select an existing resource group from the drop-down list.

    1. Select **Create new**, and enter the name of a resource group.

    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).
1. Under **Version**, select **V2**.
1. Under **Region**, select a location for the data factory. Only locations that are supported are displayed in the drop-down list. Data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by the data factory can be in other regions.
1. Select **Review + Create** and then select **Create**.
1. After the creation is finished, you see the notice in Notifications center. Select **Go to resource** to navigate to the Data factory page.
1. Select **Launch studio** to launch the Data Factory studio in a separate tab.

## Create a pipeline with a Data Flow activity

In this step, you create a pipeline that contains a Data Flow activity.

1. On the home page of Azure Data Factory, select **Orchestrate**.

   :::image type="content" source="./media/tutorial-data-flow/orchestrate.png" alt-text="Screenshot that shows the Azure Data Factory home page.":::

1. Now a window is open for a new pipeline. In the **General** tab for the pipeline properties, enter **TransformMovies** for **Name** of the pipeline.
1. In the **Activities** pane, expand the **Move and Transform** accordion. Drag and drop the **Data Flow** activity from the pane to the pipeline canvas.

    :::image type="content" source="media/tutorial-data-flow/activity.png" alt-text="Screenshot that shows the pipeline canvas where you can drop the Data Flow activity.":::

1. Name your data flow activity **DataFlow1**.

1. In the top bar of the pipeline canvas, slide the **Data Flow debug** slider on. Debug mode allows for interactive testing of transformation logic against a live Spark cluster. Data Flow clusters take 5-7 minutes to warm up and users are recommended to turn on debug first if they plan to do Data Flow development. For more information, see [Debug Mode](concepts-data-flow-debug-mode.md).

    :::image type="content" source="media/tutorial-data-flow/dataflow-debug.png" alt-text="Screenshot that shows the switch to turn on the dataflow debug.":::

## Build transformation logic in the data flow canvas

In this step, you build a data flow that takes the moviesDB.csv in ADLS storage and aggregates the average rating of comedies from 1910 to 2000. You then write this file back to the ADLS storage.

1. In the panel below the canvas, go to the **Settings** of your data flow activity and select **New**, located beside data flow field. This opens the dataflow canvas.

    :::image type="content" source="media/tutorial-data-flow/open-data-flow-from-pipeline.png" alt-text="Screenshot showing how to open the data flow editor from the pipeline editor.":::

1. In the **Properties** pane under **General**, name your data flow: **TransformMovies**.

1. In the data flow canvas, add a source by selecting the **Add Source** box.

    :::image type="content" source="media/tutorial-data-flow/dataflow.png" alt-text="Screenshot that shows the Add Source box.":::

1. Name your source **MoviesDB**. Select **New** to create a new source dataset.

    :::image type="content" source="media/tutorial-data-flow/dataflow-source.png" alt-text="Screenshot that shows where you select New after you name your source.":::

1. Choose **Azure Data Lake Storage Gen2**. Select Continue.

    :::image type="content" source="media/tutorial-data-flow/select-adls.png" alt-text="Screenshot that shows where is the Azure Data Lake Storage Gen2 tile.":::

1. Choose **DelimitedText**. Select Continue.

    :::image type="content" source="media/tutorial-data-flow/select-delimited.png" alt-text="Screenshot that shows the DelimitedText tile.":::

1. Name your dataset **MoviesDB**. In the linked service dropdown, choose **New**.

    :::image type="content" source="media/tutorial-data-flow/new-linked-service.png" alt-text="Screenshot that shows the Linked service dropdown list.":::

1. In the linked service creation screen, name your ADLS gen2 linked service **ADLSGen2** and specify your authentication method. Then enter your connection credentials. In this tutorial, we're using Account key to connect to our storage account. You can select **Test connection** to verify your credentials were entered correctly. Select Create when finished.

    :::image type="content" source="media/tutorial-data-flow/create-linked-service.png" alt-text="Screenshot of the pane to create a new linked service for Azure Data Lake Storage.":::

1. Once you're back at the dataset creation screen, enter where your file is located under the **File path** field. In this tutorial, the file moviesDB.csv is located in container sample-data. As the file has headers, check **First row as header**. Select **From connection/store** to import the header schema directly from the file in storage. Select OK when done.

    :::image type="content" source="media/tutorial-data-flow/source-linked-service.png" alt-text="Screenshot of the pane to create a dataset.":::

1. If your debug cluster has started, go to the **Data Preview** tab of the source transformation and select **Refresh** to get a snapshot of the data. You can use data preview to verify your transformation is configured correctly.

    :::image type="content" source="media/tutorial-data-flow/dataflow-first-preview.png" alt-text="Screenshot that shows where you can preview your data to verify your transformation is configured correctly.":::

1. Next to your source node on the data flow canvas, select the plus icon to add a new transformation. The first transformation you're adding is a **Filter**.

    :::image type="content" source="media/tutorial-data-flow/dataflow-add-filter.png" alt-text="Screenshot of the data flow canvas.":::

1. Name your filter transformation **FilterYears**. Select the expression box next to **Filter on** and then **Open expression builder**. Here you specify your filtering condition.

    :::image type="content" source="media/tutorial-data-flow/filter.png" alt-text="Screenshot that shows the Filter on expression box.":::

1. The data flow expression builder lets you interactively build expressions to use in various transformations. Expressions can include built-in functions, columns from the input schema, and user-defined parameters. For more information on how to build expressions, see [Data Flow expression builder](concepts-data-flow-expression-builder.md).

    In this tutorial, you want to filter movies of genre comedy that came out between the years 1910 and 2000. As year is currently a string, you need to convert it to an integer using the `toInteger()` function. Use the greater than or equals to (>=) and less than or equals to (<=) operators to compare against literal year values 1910 and 2000. Union these expressions together with the and (&&) operator. The expression comes out as:

    `toInteger(year) >= 1910 && toInteger(year) <= 2000`

    To find which movies are comedies, you can use the `rlike()` function to find pattern 'Comedy' in the column genres. Union the `rlike` expression with the year comparison to get:

    `toInteger(year) >= 1910 && toInteger(year) <= 2000 && rlike(genres, 'Comedy')`

    If you have a debug cluster active, you can verify your logic by selecting **Refresh** to see expression output compared to the inputs used. There's more than one right answer on how you can accomplish this logic using the data flow expression language.

    :::image type="content" source="media/tutorial-data-flow/filter-espression-builder.png" alt-text="Screenshot of the filter expression builder.":::

    Select **Save and Finish** once you're done with your expression.

1. Fetch a **Data Preview** to verify the filter is working correctly.

    :::image type="content" source="media/tutorial-data-flow/filter-data-preview.png" alt-text="Screenshot that shows the Data Preview that you fetched.":::

1. The next transformation you'll add is an **Aggregate** transformation under **Schema modifier**.

    :::image type="content" source="media/tutorial-data-flow/aggregate.png" alt-text="Screenshot that shows the Aggregate schema modifier.":::

1. Name your aggregate transformation **AggregateComedyRatings**. In the **Group by** tab, select **year** from the dropdown to group the aggregations by the year the movie came out.

    :::image type="content" source="media/tutorial-data-flow/aggregate-step.png" alt-text="Screenshot that shows the year option in the Group by tab under Aggregate Settings.":::

1. Go to the **Aggregates** tab. In the left text box, name the aggregate column **AverageComedyRating**. Select the right expression box to enter the aggregate expression via the expression builder.

    :::image type="content" source="media/tutorial-data-flow/aggregate-function.png" alt-text="Screenshot that shows the year option in the Aggregates tab under Aggregate Settings.":::

1. To get the average of column **Rating**, use the ```avg()``` aggregate function. As **Rating** is a string and ```avg()``` takes in a numerical input, we must convert the value to a number via the ```toInteger()``` function. This is expression looks like:

    `avg(toInteger(Rating))`

    Select **Save and Finish** when done.

    :::image type="content" source="media/tutorial-data-flow/aggregate-finished-function.png" alt-text="Screenshot that shows the saved expression.":::

1. Go to the **Data Preview** tab to view the transformation output. Notice only two columns are there, **year** and **AverageComedyRating**.

    :::image type="content" source="media/tutorial-data-flow/average-comedy-rating-preview.png" alt-text="Screenshot that shows the aggregate preview.":::

1. Next, you want to add a **Sink** transformation under **Destination**.

    :::image type="content" source="media/tutorial-data-flow/create-sink-step.png" alt-text="Screenshot that shows where to add a sink transformation under Destination.":::

1. Name your sink **Sink**. Select **New** to create your sink dataset.

    :::image type="content" source="media/tutorial-data-flow/select-sink-linked-service.png" alt-text="Screenshot that shows where you can name your sink and create a new sink dataset.":::

1. Choose **Azure Data Lake Storage Gen2**. Select Continue.

    :::image type="content" source="media/tutorial-data-flow/select-adls.png" alt-text="Screenshot that shows the Azure Data Lake Storage Gen2 tile you can choose.":::

1. Choose **DelimitedText**. Select Continue.

    :::image type="content" source="media/tutorial-data-flow/select-delimited.png" alt-text="Screenshot of the pane to select a dataset type.":::

1. Name your sink dataset **MoviesSink**. For linked service, choose the ADLS gen2 linked service you created in step 6. Enter an output folder to write your data to. In this tutorial, we're writing to folder 'output' in container 'sample-data'. The folder doesn't need to exist beforehand and can be dynamically created. Set **First row as header** as true and select **None** for **Import schema**. Select Finish.

    :::image type="content" source="media/tutorial-data-flow/sink-properties.png" alt-text="Screenshot of the sink creation page with first row as header selected.":::

Now you've finished building your data flow. You're ready to run it in your pipeline.

## Running and monitoring the Data Flow

You can debug a pipeline before you publish it. In this step, you're going to trigger a debug run of the data flow pipeline. While data preview doesn't write data, a debug run writes data to your sink destination.

1. Go to the pipeline canvas. Select **Debug** to trigger a debug run.

    :::image type="content" source="media/tutorial-data-flow/select-debug.png" alt-text="Screenshot that shows the pipeline canvas with Debug highlighted.":::

1. Pipeline debug of Data Flow activities uses the active debug cluster but still take at least a minute to initialize. You can track the progress via the **Output** tab. Once the run is successful, hover over the run and select the eyeglasses icon to open the monitoring pane.

    :::image type="content" source="media/tutorial-data-flow/select-glasses.png" alt-text="Screenshot of the completed pipeline status, with the output actions highlighted.":::

1. In the monitoring pane, select the **Stages** button to see the number of rows and time spent in each transformation step.

    :::image type="content" source="media/tutorial-data-flow/select-stages.png" alt-text="Screenshot that shows the monitoring pane with the Stages button highlighted.":::

    :::image type="content" source="media/tutorial-data-flow/data-flow-stages.png" alt-text="Screenshot of the monitoring pane where you can see the number of rows and time spent in each transformation step.":::

1. Select a transformation to get detailed information about the columns and partitioning of the data.

    :::image type="content" source="media/tutorial-data-flow/review-stage.png" alt-text="Screenshot of the monitoring transformation pane.":::

If you followed this tutorial correctly, you should have written 83 rows and 2 columns into your sink folder. You can verify the data is correct by checking your blob storage.

## Related content

The pipeline in this tutorial runs a data flow that aggregates the average rating of comedies from 1910 to 2000 and writes the data to ADLS. You learned how to:

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a Data Flow activity.
> * Build a mapping data flow with four transformations.
> * Test run the pipeline.
> * Monitor a Data Flow activity

Learn more about the [data flow expression language](data-transformation-functions.md).
