---
title: Delta lake ETL with data flows
description: This tutorial provides step-by-step instructions for using data flows to transform and analyze data in delta lake
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.topic: conceptual
ms.date: 06/24/2024
---

# Transform data in delta lake using mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).

In this tutorial, you use the data flow canvas to create data flows that allow you to analyze and transform data in Azure Data Lake Storage (ADLS) Gen2 and store it in Delta Lake.

## Prerequisites
* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. You use ADLS storage as a *source* and *sink* data stores. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md) for steps to create one.

The file that we're transforming in this tutorial is MoviesDB.csv, which can be found [here](https://github.com/kromerm/adfdataflowdocs/blob/master/sampledata/moviesDB2.csv). To retrieve the file from GitHub, copy the contents to a text editor of your choice to save locally as a .csv file. To upload the file to your storage account, see [Upload blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md). The examples are referencing a container named 'sample-data'.

## Create a data factory

In this step, you create a data factory and open the Data Factory UX to create a pipeline in the data factory.

1. Open **Microsoft Edge** or **Google Chrome**. Currently, Data Factory UI is supported only in the Microsoft Edge and Google Chrome web browsers.
1. On the left menu, select **Create a resource** > **Integration** > **Data Factory**
1. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**
1. Select the Azure **subscription** in which you want to create the data factory.
1. For **Resource Group**, take one of the following steps:

    a. Select **Use existing**, and select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a resource group. 
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md). 
1. Under **Version**, select **V2**.
1. Under **Location**, select a location for the data factory. Only locations that are supported are displayed in the drop-down list. Data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by the data factory can be in other regions.
1. Select **Create**.
1. After the creation is finished, you see the notice in Notifications center. Select **Go to resource** to navigate to the Data factory page.
1. Select **Author & Monitor** to launch the Data Factory UI in a separate tab.

## Create a pipeline with a data flow activity

In this step, you create a pipeline that contains a data flow activity.

1. On the home page, select **Orchestrate**.

   :::image type="content" source="./media/tutorial-data-flow/orchestrate.png" alt-text="Screenshot that shows the ADF home page.":::

1. In the **General** tab for the pipeline, enter **DeltaLake** for **Name** of the pipeline.
1. In the **Activities** pane, expand the **Move and Transform** accordion. Drag and drop the **Data Flow** activity from the pane to the pipeline canvas.

    :::image type="content" source="media/tutorial-data-flow/activity1.png" alt-text="Screenshot that shows the pipeline canvas where you can drop the Data Flow activity.":::
1. In the **Adding Data Flow** pop-up, select **Create new Data Flow** and then name your data flow **DeltaLake**. Select Finish when done.

    :::image type="content" source="media/tutorial-data-flow/activity2.png" alt-text="Screenshot that shows where you name your data flow when you create a new data flow.":::
1. In the top bar of the pipeline canvas, slide the **Data Flow debug** slider on. Debug mode allows for interactive testing of transformation logic against a live Spark cluster. Data Flow clusters take 5-7 minutes to warm up and users are recommended to turn on debug first if they plan to do Data Flow development. For more information, see [Debug Mode](concepts-data-flow-debug-mode.md).

    :::image type="content" source="media/tutorial-data-flow/dataflow1.png" alt-text="Screenshot that shows where is the Data flow debug slider.":::

## Build transformation logic in the data flow canvas

You generate two data flows in this tutorial. The first data flow is a simple source to sink to generate a new Delta Lake from the movies CSV file. Lastly, you create the flow design that follows to update data in Delta Lake.

:::image type="content" source="media/data-flow/data-flow-tutorial-6.png" alt-text="Final flow":::

### Tutorial objectives

1. Use the MoviesCSV dataset source from the prerequisites, and form a new Delta Lake from it.
1. Build the logic to updated ratings for 1988 movies to '1'.
1. Delete all movies from 1950.
1. Insert new movies for 2021 by duplicating the movies from 1960.

### Start from a blank data flow canvas

1. Select the source transformation at the top of the data flow editor window, and then select **+ New** next to the **Dataset** property in the **Source settings** window:

   :::image type="content" source="media/tutorial-data-flow-delta-lake/add-new-source-dataset.png" alt-text="Screenshot showing where to add a new source dataset to the data flow.":::

1. Select _Azure Data Lake Storage Gen2_ from the **New dataset** window that appears, and then select **Continue**.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/select-azure-data-lake-storage-gen2.png" alt-text="Screenshot showing where to select Azure Data Lake Storage Gen2 from the New dataset window.":::

1. Choose **DelimitedText** for the dataset type, and select **Continue** again.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/select-dataset-format.png" alt-text="Screenshot showing where to select the format for the dataset.":::

1. Name the dataset “MoviesCSV”, and select **+ New** under **Linked service** to create a new linked service to the file.
1. Provide the details for your storage account created previously in the Prerequisites section, and browse and select the MoviesCSV file that you uploaded there.
1. After adding your linked service, select the **First row as header** checkbox, then select **OK** to add the source.
1. Navigate to the **Projection** tab of the data flow settings window, and then select **Detect data types**.
1. Now select the **+** after the Source in the data flow editor window, and scroll down to select **Sink** under the **Destination** section, adding a new sink to your data flow.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/add-sink.png" alt-text="Screenshot showing where to add a sink destination for the data flow.":::

1. In the **Sink** tab for the sink settings that appear after the sink is added, select **Inline** for the **Sink type**, and then **Delta** for the **Inline dataset type**. Then select your Azure Data Lake Storage Gen2 for the **Linked service**.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/select-sink-details.png" alt-text="Screenshot showing the Sink details for an inline delta dataset.":::

1. Choose a folder name in your storage container where you would like the service to create the Delta Lake.
1. Finally, navigate back the pipeline designer and select **Debug** to execute the pipeline in debug mode with just this data flow activity on the canvas. This generates your new Delta Lake in Azure Data Lake Storage Gen2.
1. Now, from the Factory Resources menu on the left of the screen, select **+** to add a new resource, and then select **Data flow**.

   :::image type="content" source="media/concepts-data-flow-overview/new-data-flow.png" alt-text="Screenshot showing where to create a new data flow in the data factory.":::

1. As previously, select the MoviesCSV file again as a source and then select **Detect data types** again from the **Projection** tab.
1. This time, after creating the source, select the **+** in the data flow editor window, and add a Filter transformation to your source.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/add-filter.png" alt-text="Screenshot showing where to add a Filter condition to the data flow.":::

1. Add a **Filter on** condition in the **Filter settings** window that only allows movie rows matching 1950, 1960, and 1988.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/add-year-filter.png" alt-text="Screenshot showing where to add a filter on the Year column for the dataset.":::

1. Now add a **Derived column** transformation to update ratings for each 1988 movie to '1'.

   :::image type="content" source="media/tutorial-data-flow-delta-lake/derived-column-content.png" alt-text="Screenshot showing where to enter the expression for the derived column.":::

1. `Update, insert, delete, and upsert` policies are created in the alter Row transform. Add an alter row transformation after your derived column.
1. Your alter row policies should look like this.

   :::image type="content" source="media/data-flow/data-flow-tutorial-3.png" alt-text="Alter row":::

1. Now that you set the proper policy for each alter row type, check that the proper update rules were set on the sink transformation

   :::image type="content" source="media/data-flow/data-flow-tutorial-4.png" alt-text="Sink":::

1. Here we're using the Delta Lake sink to your Azure Data Lake Storage Gen2 data lake and allowing inserts, updates, deletes.
1. Note that the key columns are a composite key made up of the Movie primary key column and year column. This is because we created fake 2021 movies by duplicating the 1960 rows. This avoids collisions when looking up the existing rows by providing uniqueness.

### Download completed sample

Here's a [sample solution for the Delta pipeline](https://github.com/kromerm/adfdataflowdocs/blob/master/sampledata/DeltaPipeline.zip) with a data flow for update/delete rows in the lake.

## Related content

Learn more about the [data flow expression language](data-transformation-functions.md).
