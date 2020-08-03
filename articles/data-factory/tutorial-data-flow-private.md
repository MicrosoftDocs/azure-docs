---
title: Transform data with an Azure Data Factory managed VNet mapping data flow
description:  This tutorial provides step-by-step instructions for using Azure Data Factory to transform data with mapping data flow
author: djpmsft
ms.author: daperlov
ms.reviewer: makromer
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 05/19/2019
---

# Transform data securely using mapping data flows

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction).

In this tutorial, you'll use the Azure Data Factory user interface (UX) to create a pipeline that copies and transforms data **from an Azure Data Lake Storage (ADLS) Gen2 source to an ADLS Gen2 sink (both allowing access to only selected networks)** using mapping data flow in [Azure Data Factory managed Virtual Network](managed-virtual-network-private-endpoint.md). The configuration pattern in this tutorial can be expanded upon when transforming data using mapping data flow.

In this tutorial, you do the following steps:

> [!div class="checklist"]
>
> * Create a data factory.
> * Create a pipeline with a Data Flow activity.
> * Build a mapping data flow with four transformations.
> * Test run the pipeline.
> * Monitor a Data Flow activity

## Prerequisites
* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. You use ADLS storage as a *source* and *sink* data stores. If you don't have a storage account, see [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. **Ensure the Storage account allows access only from 'Selected networks'.** 

The file that we are transforming in this tutorial is MoviesDB.csv, which can be found [here](https://raw.githubusercontent.com/djpmsft/adf-ready-demo/master/moviesDB.csv). To retrieve the file from GitHub, copy the contents to a text editor of your choice to save locally as a .csv file. To upload the file to your storage account, see [Upload blobs with the Azure portal](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal). The examples will be referencing a container named 'sample-data'.

## Create a data factory

In this step, you create a data factory and open the Data Factory UX to create a pipeline in the data factory.

1. Open **Microsoft Edge** or **Google Chrome**. Currently, Data Factory UI is supported only in the Microsoft Edge and Google Chrome web browsers.
2. On the left menu, select **Create a resource** > **Analytics** > **Data Factory**.
3. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**.

   The name of the Azure data factory must be *globally unique*. If you receive an error message about the name value, enter a different name for the data factory. (for example, yournameADFTutorialDataFactory). For naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).

4. Select the Azure **subscription** in which you want to create the data factory.
5. For **Resource Group**, take one of the following steps:

    a. Select **Use existing**, and select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a resource group. 
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md). 
6. Under **Version**, select **V2**.
7. Under **Location**, select a location for the data factory. Only locations that are supported are displayed in the drop-down list. Data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by the data factory can be in other regions.

8. Select **Create**.

9. After the creation is finished, you see the notice in Notifications center. Select **Go to resource** to navigate to the Data factory page.
10. Select **Author & Monitor** to launch the Data Factory UI in a separate tab.

## Create an Azure Integration Runtime in ADF Managed Virtual Network
In this step, you create an Azure Integration Runtime and enable Managed Virtual Network.

1. In ADF portal, go to **Manage Hub** and click **New** to create a new Azure Integration Runtime.
   ![Create new Azure Integration Runtime](./media/tutorial-copy-data-portal-private/create-new-azure-ir.png)
2. Choose to create an **Azure** Integration Runtime.
   ![New Azure Integration Runtime](./media/tutorial-copy-data-portal-private/azure-ir.png)
3. Enable **Virtual Network**.
   ![New Azure Integration Runtime](./media/tutorial-copy-data-portal-private/enable-managed-vnet.png)
4. Select **Create**.

## Create a pipeline with a Data Flow activity

In this step, you'll create a pipeline that contains a Data Flow activity.

1. On the **Let's get started** page, select **Create pipeline**.

   ![Create pipeline](./media/doc-common-process/get-started-page.png)

1. In the **Properties** pane for the pipeline, enter **TransformMovies** for **Name** of the pipeline.
1. In the factory top bar, slide the **Data Flow debug** slider on. Debug mode allows for interactive testing of transformation logic against a live Spark cluster. Data Flow clusters take 5-7 minutes to warm up and users are recommended to turn on debug first if they plan to do Data Flow development. For more information, see [Debug Mode](https://docs.microsoft.com/azure/data-factory/concepts-data-flow-debug-mode).

    ![Data Flow debug](media/tutorial-data-flow-private/dataflow-debug.png)
1. In the **Activities** pane, expand the **Move and Transform** accordion. Drag and drop the **Data Flow** activity from the pane to the pipeline canvas.

1. In the **Adding data flow** pop-up, select **Create new Data Flow** and then select **Mapping Data Flow**. Click **OK** when done.

    ![Mapping Data Flow](media/tutorial-data-flow-private/mapping-dataflow.png)

1. Name your data flow **TransformMovies** in Properties pane.

## Build transformation logic in the data flow canvas

Once you create your Data Flow, you'll be automatically sent to the data flow canvas. In this step, you'll build a data flow that takes the moviesDB.csv in ADLS storage and aggregates the average rating of comedies from 1910 to 2000. You'll then write this file back to the ADLS storage.

### Add the source transformation

In this step, you set up Azure Data Lake Storage Gen2 as source.

1. In the data flow canvas, add a source by clicking on the **Add Source** box.

1. Name your source **MoviesDB**. Click on **New** to create a new source dataset.

1. Choose **Azure Data Lake Storage Gen2**. Click Continue.

1. Choose **DelimitedText**. Click Continue.

1. Name your dataset **MoviesDB**. In the linked service dropdown, choose **New**.

1. In the linked service creation screen, name your ADLS gen2 linked service **ADLSGen2** and specify your authentication method. Then enter your connection credentials. In this tutorial, we're using Account key to connect to our storage account. 

1. Make sure you enable **Interactive Authoring**. It might take around 1 minute to be enabled.

    ![Interactive authoring](./media/tutorial-data-flow-private/interactive-authoring.png)

1. Select **Test connection**, it should fail because the Storage Account does not enable access into it without the creation and approval of a Private Endpoint. In the error message, you should see a link to create a **private endpoint** that you can follow to create a managed private endpoint. *An alternative is to go directly to the Manage tab and follow instructions in [this section](#create-a-managed-private-endpoint) to create a managed private endpoint*

1. Keep the dialog box open, and then go to your Storage Account selected above.

1. Follow instructions in [this section](#approval-of-a-private-link-in-storage-account) to approve the private link.

1. Go back to the dialog box. **Test connection** again and select **Create** to deploy the linked service.

1. Once you're back at the dataset creation screen, enter where your file is located under the **File path** field. In this tutorial, the file moviesDB.csv is located in container sample-data. As the file has headers, check **First row as header**. Select **From connection/store** to import the header schema directly from the file in storage. Click OK when done.

    ![Source path](media/tutorial-data-flow-private/source-file-path.png)

1. If your debug cluster has started, go to the **Data Preview** tab of the source transformation and click **Refresh** to get a snapshot of the data. You can use data preview to verify your transformation is configured correctly.

    ![Data preview](media/tutorial-data-flow-private/data-preview.png)

#### Create a managed private endpoint

In case you did not click into the hyperlink when testing the connection above, follow the following path. Now you need to create a managed private endpoint that you will connect to the linked service created above.

1. Go to the Manage tab.
> [!NOTE]
> Manage tab may not be available for all data factory instances. If you do not see it, you can still access Private Endpoints through '**Author**' tab --> '**Connections**' --> '**Private Endpoint**'
1. Go to the Managed private endpoints section.
1. Select **+ New** under Managed private endpoints.

    ![New Managed private endpoint](./media/tutorial-data-flow-private/new-managed-private-endpoint.png) 

1. Select the Azure Data Lake Storage Gen2 tile from the list and select **Continue**.
1. Enter the name of the Storage Account you created above.
1. Select **Create**.
1. You should see after waiting some seconds that the private link created needs an approval.
1. Select the Private Endpoint that you created above. You can see a hyperlink that will lead you to approve the Private Endpoint at the Storage Account level.

    ![Manage private endpoint](./media/tutorial-data-flow-private/manage-private-endpoint.png) 

#### Approval of a private link in storage account

1. In the Storage Account, go to **Private endpoint connections** under Settings section.

1. Tick the Private endpoint you created above and select **Approve**.

    ![Approve private endpoint](./media/tutorial-data-flow-private/approve-private-endpoint.png)

1. Add a description and click **yes**.
1. Go back to the **Managed private endpoints** section of the **Manage** tab in Azure Data Factory.
1. It should take around 1 minute to get the approval reflected for your private endpoint.

### Add the filter transformation

1. Next to your source node on the data flow canvas, click on the plus icon to add a new transformation. The first transformation you're adding is a **Filter**.

    ![Add filter](media/tutorial-data-flow-private/add-filter.png)
1. Name your filter transformation **FilterYears**. Click on the expression box next to **Filter on** to open the expression builder. Here you'll specify your filtering condition.

    ![Filter years](media/tutorial-data-flow-private/filter-years.png)
1. The data flow expression builder lets you interactively build expressions to use in various transformations. Expressions can include built-in functions, columns from the input schema, and user-defined parameters. For more information on how to build expressions, see [Data Flow expression builder](https://docs.microsoft.com/azure/data-factory/concepts-data-flow-expression-builder).

    * In this tutorial, you want to filter movies of genre comedy that came out between the years 1910 and 2000. As year is currently a string, you need to convert it to an integer using the ```toInteger()``` function. Use the greater than or equals to (>=) and less than or equals to (<=) operators to compare against literal year values 1910 and 200-. Union these expressions together with the and (&&) operator. The expression comes out as:

        ```toInteger(year) >= 1910 && toInteger(year) <= 2000```

    * To find which movies are comedies, you can use the ```rlike()``` function to find pattern 'Comedy' in the column genres. Union the rlike expression with the year comparison to get:

        ```toInteger(year) >= 1910 && toInteger(year) <= 2000 && rlike(genres, 'Comedy')```

    * If you've a debug cluster active, you can verify your logic by clicking **Refresh** to see expression output compared to the inputs used. There's more than one right answer on how you can accomplish this logic using the data flow expression language.

        ![Filter expression](media/tutorial-data-flow-private/filter-expression.png)

    * Click **Save and Finish** once you're done with your expression.

1. Fetch a **Data Preview** to verify the filter is working correctly.

    ![Filter Data Preview](media/tutorial-data-flow-private/filter-data.png)

### Add the aggregate transformation

1. The next transformation you'll add is an **Aggregate** transformation under **Schema modifier**.

    ![Add aggregate](media/tutorial-data-flow-private/add-aggregate.png)
1. Name your aggregate transformation **AggregateComedyRatings**. In the **Group by** tab, select **year** from the dropdown to group the aggregations by the year the movie came out.

    ![Aggregate group](media/tutorial-data-flow-private/group-by-year.png)
1. Go to the **Aggregates** tab. In the left text box, name the aggregate column **AverageComedyRating**. Click on the right expression box to enter the aggregate expression via the expression builder.

    ![Aggregate column name](media/tutorial-data-flow-private/name-column.png)
1. To get the average of column **Rating**, use the ```avg()``` aggregate function. As **Rating** is a string and ```avg()``` takes in a numerical input, we must convert the value to a number via the ```toInteger()``` function. This is expression looks like:

    ```avg(toInteger(Rating))```

    Click **Save and Finish** when done.

    ![Save aggregate](media/tutorial-data-flow-private/save-aggregate.png)
1. Go to the **Data Preview** tab to view the transformation output. Notice only two columns are there, **year** and **AverageComedyRating**.

### Add the sink transformation

1. Next, you want to add a **Sink** transformation under **Destination**.

    ![Add sink](media/tutorial-data-flow-private/add-sink.png)
1. Name your sink **Sink**. Click **New** to create your sink dataset.

    ![Create sink](media/tutorial-data-flow-private/create-sink.png)
1. In the New dataset page, choose **Azure Data Lake Storage Gen2**. Click Continue.

1. In the Select format page, choose **DelimitedText**. Click Continue.

1. Name your sink dataset **MoviesSink**. For linked service, choose the same ADLSGen2 linked service you created for source transformation. Enter an output folder to write your data to. In this tutorial, we're writing to folder 'output' in container 'sample-data'. The folder doesn't need to exist beforehand and can be dynamically created. Set **First row as header** as true and select **None** for **Import schema**. Click OK.

    ![Sink path](media/tutorial-data-flow-private/sink-file-path.png)

Now you've finished building your data flow. You're ready to run it in your pipeline.

## Running and monitoring the Data Flow

You can debug a pipeline before you publish it. In this step, you're going to trigger a debug run of the data flow pipeline. While data preview doesn't write data, a debug run will write data to your sink destination.

1. Go to the pipeline canvas. Click **Debug** to trigger a debug run.

1. Pipeline debug of Data Flow activities uses the active debug cluster but still take at least a minute to initialize. You can track the progress via the **Output** tab. Once the run is successful, click on the eyeglasses icon for run details.

1. In the Details page, you can see the number of rows and time spent in each transformation step.

    ![Monitoring run](media/tutorial-data-flow-private/run-details.png)
1. Click on a transformation to get detailed information about the columns and partitioning of the data.

If you followed this tutorial correctly, you should have written 83 rows and 2 columns into your sink folder. You can verify the data is correct by checking your blob storage.

## Summary

In this tutorial, you'll used the Azure Data Factory user interface (UX) to create a pipeline that copies and transforms data **from an Azure Data Lake Storage (ADLS) Gen2 source to an ADLS Gen2 sink (both allowing access to only selected networks)** using mapping data flow in [Azure Data Factory managed Virtual Network](managed-virtual-network-private-endpoint.md).
