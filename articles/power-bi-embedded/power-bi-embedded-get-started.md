<properties
   pageTitle="Get stated with Microsoft Power BI Embedded preview"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

# Get stated with Microsoft Power BI Embedded preview

**Microsoft Power BI Embedded** is an Azure service which enables application developers to add interactive Power BI reports into their own applications. **Power BI Embedded** is works with existing applications without the need to redesign those applications or change the way their users log in.

To learn more about Power BI Embedded, see [What is Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md).

![](media\power-bi-embedded-get-started\introduction.png)

## Creating a workspace collection
A **Workspace Collection** is the top level Azure resource and a container for the content that will be embedded. A workspace collection can be created two ways:

   -	Manually using the Azure Portal
   -	Programmatically using the ARM APIs

Let’s walk through the steps to build a **Workspace Collection** using the Azure Portal.

   1.	Open and sign into the Azure Portal
    ```
    [http://portal.azure.com](http://portal.azure.com)
    ```
   2.	Click **+ New** on the top panel.

   ![](media\power-bi-embedded-get-started\create-workspace-1.png)

   3.	Under **Data + Analytics** click **Power BI Embedded**.
   4.	On the creation blade, enter the required information:

   ![](media\power-bi-embedded-get-started\create-workspace-2.png)

  **Workspace Collection Name**

  - Globally unique name that you wish to use to refer to your **Workspace Collection**.

  - Names of **Workspace Collections** can be publicly visible and should not contain private information.

  **Subscription**

  - The Azure subscription this **Workspace Collection** will be associated with.

  **Resource Group**

  - The Azure resource group this **Workspace Collection** will be associated with. Choose an existing resource group or create a new one.

  **Location**

  - The physical datacenter location as the where this **Workspace Collection** and all of its content will be stored.

  **Pricing**

  - See [Power BI Embedded pricing](http://go.microsoft.com/fwlink/?LinkID=760527).

5.Click **create**.

The **Workspace Collection** will take a few moments to provision. When it is completed you will be taken to the Workspace Collection Blade.

   ![](media\power-bi-embedded-get-started\create-workspace-3.png)

This blade contains the information that you will need to call the APIs needed to create workspaces and deploy content to them.

**Access Keys**

One of the most important pieces of information needed for calling the Power BI REST APIs are the **Access Keys**. These are used to generate the **app tokens** that are used to authenticate your API requests. To view your access keys, click **Access Keys** on the settings blade. For more about **app tokens**, see [How does app token flow work](power-bi-embedded-get-started-sample.md#key-flow).

   ![](media\power-bi-embedded-get-started\access-keys.png)

You will notice that you have two keys.

   ![](media\power-bi-embedded-get-started\access-keys-2.png)

Copy these keys and store them securely in your application. It is very important that you treat these keys as if you would a password as them will provide access to all the content in your workspace collection.

While two keys are listed, only one key is needed at a time. The second key is provided in order to allow for periodically regenerating the keys without interrupting access to the service.

## Writing your first report

Now that you have created an instance of Power BI for your application you will need to create some Power BI datasets and the reports that you wish to embed. These can be created by using the **Power BI Desktop** tool. To learn more about downloading the Power BI desktop for free, please see the following: [Power BI desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/). Or, to quickly get started, you can download the sample [Profit and Loss Data Modeling and Analysis] PBIX (http://go.microsoft.com/fwlink/?LinkId=780547).

Once you install **Power BI Desktop**, you can then create your first dataset and report following the instructions here: [Getting started with Power BI Desktop](https://powerbi.microsoft.com/en-us/documentation/powerbi-desktop-getting-started).

With Power BI Desktop, when you connect to your data source, it is always possible to import a copy of the data into the Power BI Desktop. For some data sources, an alternative approach is available: connect directly to the data source using **DirectQuery**.

> [AZURE.NOTE] At this stage of the preview, only DirectQuery is supported in Power BI Embedded when wanting to show the latest data from your data source. These data sources must be accessible from the cloud. Datasets using import can be used with Power BI Embedded but cannot be refreshed.

The differences between selecting **Import** and **DirectQuery** are the following:

**Import** – the selected tables and columns are imported into Power BI Desktop. As you create or interact with a visualization, Power BI Desktop uses the imported data. You must refresh the data, which imports the full data set again, to see any changes that occurred to the underlying data since the initial import or the most recent refresh.

**DirectQuery** – no data is imported or copied into Power BI Desktop. The selected tables and columns appear in your Power BI Desktop **Fields** list. As you create or interact with a visualization, Power BI Desktop queries the underlying data source, which means you’re always viewing current data.

Many data modeling and data transformations are available when using **DirectQuery**, though with some limitations. When creating or interacting with a visualization, the underlying source must be queried and the time necessary to refresh the visualization is dependent on the performance of the underlying data source. When the data necessary to service the request has recently been requested, Power BI Desktop uses recent data to reduce the time required to display the visualization. Selecting **Refresh** from the **Home** ribbon will ensure all visualizations are refreshed with current data.

**Benefits of using DirectQuery**

There are two primary benefits to using **DirectQuery**:

   -	**DirectQuery** lets you build visualizations over very large datasets, where it otherwise would be unfeasible to first import all of the data.
   -	Underlying data changes can require a refresh of data, and for some reports, the need to display current data can require large data transfers, making re-importing data unfeasible. By contrast, **DirectQuery** reports always use current data.

**Limitations of DirectQuery**

   There are currently a few limitations to using **DirectQuery**:

   -	All tables must come from a single database
   -	If the Query Editor query is overly complex an error will occur. To remedy the error you must: delete the problematic step in Query Editor, or Import the data instead of using **DirectQuery**.
   -	Relationship filtering is limited to a single direction, rather than both directions.
   -	You cannot change the data type of a column.
   -	By default, limitations are placed on DAX expressions allowed in measures; see the following paragraph for more information.

To ensure that queries sent to the underlying data source have acceptable performance, limitations are imposed on measures by default. Advanced users can choose to bypass this limitation by selecting **File > Options** and then **Settings > Options > DirectQuery**, then selecting the option *Allow unrestricted measures in DirectQuery mode**. When that option is selected, any DAX expression that is valid for a measure can be used. Users must be aware, however, that some expressions that perform very well when the data is imported may result in very slow queries to the backend source when in DirectQuery mode.

After you save the work that you have done in the Power BI Desktop a PBIX file will be created. This file contains both your dataset and report. It is this file that you will programmatically deploy to your workspaces using the **Import API** on of the Power BI REST APIs. You can use additional APIs to change the server and database that your dataset is pointing and set a service account credential that the dataset will use to connect to your database.

## Next Steps
In the previous steps, you created a workspace collection and your first report and dataset. Now it is time to learn how to write code for **Power BI Embedded**. To help you get started, we created a sample web app. To get start with the sample web app, please go to [Get stated with sample](power-bi-embedded-get-started-sample.md). The sample shows you how to:

  -	Provision content
      - Create Workspace
      - Import PBIX
      - Update connection strings and set credentials for your datasets.

  -	Embed content
    - Securely embed a report

## See Also
- [Get stated with sample](power-bi-embedded-get-started-sample.md)
- [What is Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md)
- [Getting started with Power BI Desktop](https://powerbi.microsoft.com/en-us/documentation/powerbi-desktop-getting-started)
- [Power BI desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/)
- [Power BI Embedded pricing](http://go.microsoft.com/fwlink/?LinkID=760527)
