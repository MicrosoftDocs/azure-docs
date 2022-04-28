---
title: Power Query connectors (preview - retired)
titleSuffix: Azure Cognitive Search
description: Import data from different data sources using the Power Query connectors.

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/22/2022
ms.custom: references_regions
---

# Power Query connectors (preview - retired)

> [!IMPORTANT] 
> Power Query connector support was introduced as a **gated public preview** under [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), but is now discontinued. If you have a search solution that uses a Power Query connector, we recommend migration to an alternative solution.

## Migrate by July 22

The Power Query connector preview was announced in May 2021 and will not be moving forward into general availability. The following migration guidance is available for Snowflake and PostgreSQL. If you're using a different connector and need migration instructions, please use the email contact information provided in your preview sign up to request help.

## Migrate a Snowflake data pipeline

This section has the instructions to copy data from Snowflake database to an [Azure Cognitive Search index](search-what-is-an-index.md). There is no process to directly index from Snowflake to Azure Cognitive Search, so this section includes a staging phase of copying the PostgreSQL database contents to Azure Storage blob container and then indexing to an Azure Cognitive Search index from that staging container.

## Prerequisites:

- An Azure Storage account. If you don't have one, [create a Storage account](../storage/common/storage-account-create.md).
- An Azure Data Factory. If you don't have one, [create a Data Factory](../data-factory/quickstart-create-data-factory-portal.md).

These are the end to end steps to configure a [Data Factory pipeline](../data-factory/quickstart-create-data-factory-portal.md) to ingest data from Snowflake database and transform it to index in Azure Cognitive Search.

### Step 1: Retrieve Snowflake database information

1. Go to [Snowflake](https://app.snowflake.com/) and type your Snowflake account. Snowflake account looks like: *https://<account_name>.snowflakecomputing.com*. Then introduce your Snowflake user and password.
1. Once logged on, go to the left pane and copy the following values that will be used in the Data Factory Snowflake Linked Service setup in [Step 2](#step-2-configure-snowflake-linked-service):
   - From **Data**, select **Databases** and copy the name of the database you will use as source to index.
   - From **Admin**, select **Users & Roles** and copy the name of the user you will utilize to connect to the database. Make sure that the user has enough privileges to read from the database of your choice.
   - From **Admin**, select **Accounts** and copy **LOCATOR** value of the account.
   - From the Snowflake URL (similar to  `https://app.snowflake.com/<region_name>/xy12345/organization)` copy the region name. Example: From URL  `https://app.snowflake.com/south-central-us.azure/xy12345/organization`, the region name is *south-central-us.azure*.
   - From **Admin**, select **Warehouses** and copy the name of the warehouse associated with the database you will use as source.


### Step 2: Configure Snowflake Linked Service

1. Logon with your Azure account to [Azure Data Factory Studio](https://ms-adf.azure.com/).
1. Select your Data Factory and select **Continue**.
1. In the left pane, click the **Manage** icon.
1. Under **Linked services** click **New**.
1. In the right pane, in the Data store search, type *Snowflake*. Click **Snowflake** icon and select **Continue**.
1. Fill out the **New linked service** form with the data retrieved in [Step 1](#step-1-retrieve-snowflake database information). Keep in mind that **Account name** is formed with Snowflake account **LOCATOR** value and the region. Example: *xy56789south-central-us.azure*.
1. After completed, at the bottom, click **Test connection**. 
1. When successful, click **Create**.

### Step 3: Configure Snowflake Dataset
1. In the left pane, select **Author** icon.
1. Click **Datasets** and "**…**". Select **New dataset**.
1. Search for *Snowflake* data store and select **Snowflake** icon. Click **Continue**.
1. In the **Set Properties** form:
   - Select the **Linked Service** created in [Step 2](#step-2-configure-snowflake-linked-service).
   - Select the **Table** you would like to import and click on **OK**.
5. Click on **Save**.

### Step 4: Create a new index in Azure Cognitive Search

[Create a new index](https://docs.microsoft.com/rest/api/searchservice/create-index) in your Azure Cognitive Search service with the same schema as the one you have currently configured for your Snowflake data.
Keep in mind that you can copy the index schema from the Azure Portal, by selecting the Azure Cognitive Search service index you currently are using for the Snowflake Power Connector and clicking on **Index Definition (JSON)**. You can then select all the content and copy to the body of your new index request.


### Step 5: Configure Azure Cognitive Search Linked Service

1. Under **Linked services**, click **New**.
1. Fill out the **New linked service** form:
   - Choose the Azure subscription where your Azure Cognitive Search service resides.
   - Choose the Azure Cognitive Search service where your Power Query connector indexer lives.
3. Click **Create**.


### Step 6: Configure Azure Cognitive Search Dataset
1. In the left pane, select **Author** icon. 
1. Click **Datasets** and "**…**". Select **New dataset**.
1. Look for *search* data store and select **Azure Search** icon. Click **Continue**.
1. In the Set properties form:
   - Select the Linked service recently created as part of [Step 5](#step-5-configure-azure-cognitive-search-linked-service).
   - Choose the search index that you created as part of [Step 4](#step-4-create-a-new-index-in-azure-cognitive-search).
   - Click **OK**.
1. Click **Save**.


### Step 7: Configure Azure Blob Storage Linked Service
1. In the left pane, click **Manage** icon.
1. Under **Linked services**, click **New**.
1. In the right pane, in the Data store search, type *Storage*. Click **Azure Blob Storage** icon and select **Continue**.
1. Fill out the **New linked service** form:
   - Choose the Authentication type: SAS URI. Only this method can be used to import data from Snowflake into Azure Blob Storage.
   - [Generate a SAS URL](../cognitive-services/Translator/document-translation/create-sas-tokens.md) for the storage account you will be using for staging and copy the Blob SAS URL to SAS URL field.
5. Click on **Create**.


### Step 8: Configure Storage dataset
1. In the left pane, select **Author** icon. 
1. Click **Datasets** and "**…**" . Select **New dataset**.
1. Search for *storage* data store and select **Azure Blob Storage** icon. Click **Continue**.
1. Select **DelimitedText format** and click **Continue**.
1. In **Set Properties** form:
   - Select the linked service created in [Step 7](#step-7-configure-azure-blob-storage-linked-service)
   - Choose the container that will be the sink for the staging process.
   - In **Row delimiter**, select *Line feed (\n)*.
   - Check **First row as a header** box.
   - Click **Save**.

### Step 9: Configure Pipeline
1. In the left pane, select **Author** icon. 
1. Click **Pipelines** and "**…**" . Select **New pipeline**.
1. Create and configure the [Data Factory activities](..data-factory/concepts-pipelines-activities.md) that will be part of the pipeline:

   **a) Configure staging activity to copy from Snowflake to Azure Storage container**
   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.
   - In the **General** tab, leave the default values, unless you need to customize the execution.
   - In the **Source** tab, select your Snowflake table. Leave the remaining options with the default values.
   - In the **Sink** tab:
     - Select the *Storage DelimitedText* dataset. 
     - In **File Extension**, add *.csv*.
     - Leave the remaining options with the default values. 
   - Click on **Save**.
 
  **b) Configure activity to index from Azure Storage Blob**
   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.
   - In the **General** tab, leave the default values, unless you need to customize the execution.
   - In the **Source** tab:
      - Select the *Storage* source dataset.
      - In the **File path type** select *Wildcard file path*.
      - Leave all remaining fields with default values.
   - In the **Sink** tab, select your Azure Cognitive Search index. Leave the remaining options with the default values.
   - Click on **Save**.

### Step 10: Configure Activity order 

1. In the Pipeline canvas editor, click on the little green square in front of the Pipeline activity that copies data from Snowflake to Azure Blob Storage and drag to the activity that Indexes from Storage Account to Azure Cognitive Search to provide the execution order. 
1. Click on **Save**.

### Step 11: Add a Pipeline trigger
1. Click on [Add trigger](../data-factory/how-to-create-schedule-trigger.md) to schedule the pipeline run and select **New/Edit**.
1. From the **Choose trigger** dropdown, select **New**.
1. Review the trigger options to run the pipeline and click on **OK** when completing selection of the desired options. Then click on **Save**.
1. Click on **Publish**.


## Migrate a PostgreSQL data pipeline

This section has the instructions to copy data from PostgreSQL database to an [Azure Cognitive Search index](search-what-is-an-index.md). There is no process to directly index from PostgreSQL to Azure Cognitive Search, so this section includes a staging phase of copying the PostgreSQL database contents to Azure Storage blob container and then indexing to an Azure Cognitive Search index from that staging container.

## Prerequisites:

- An Azure Storage account. If you don't have one, [create a Storage account](../storage/common/storage-account-create.md).
- An Azure Data Factory. If you don't have one, [create a Data Factory](../data-factory/quickstart-create-data-factory-portal.md).

These are the end to end steps to configure a [Data Factory pipeline](../data-factory/quickstart-create-data-factory-portal.md) to ingest data from PostgreSQL database and transform it to index in Azure Cognitive Search.

### Step 1: Configure PostgreSQL Linked Service

1. Logon with your Azure account to [Azure Data Factory Studio](https://ms-adf.azure.com/).
1. Choose your Data Factory and select **Continue**.
1. In the left pane, click on the **Manage** icon.
1. Under **Linked services** click on **New**.
1. In the right pane, in the Data store search, type *PostgreSQL*. Then click on the **PostgreSQL** icon that represents where your PostgreSQL database is located (Azuere or other) and select Continue. In this example, PostgreSQL database is located in Azure.
1. Fill out the **New linked service** form:
   - In **Account selection method** select **Enter manually** button.
   - From your Azure Database for PostgreSQL Overview page in the [Azure portal](https://portal.azure.com/) copy the following values in their respective field:
     - Server name to Fully qualified domain name.
     - Admin username to user name.
   - Add the respective database name.
   - Add the username password.
   - Click on **Create**.

### Step 2: Configure PostgreSQL Dataset

1. In the left pane, select **Author** icon. 
1. Click on **Datasets** and "**…**" . Select **New dataset**.
1. Search for *postgresql* data store and select **Azure Blob Storage** icon. Click on **Continue**.
1. Fill out the **Set properties** form:
- Choose the PostgreSQL Linked Service created in [Step 1](link to step 1).
- Select the table you would like to import/index.
- Click on **OK**.
5. Click on **Save**.


### Step 3: Create a new index in Azure Cognitive Search

Create a new index in your Azure Cognitive Search service with the same schema as the one you have currently configured for your PostgreSQL data according to Create Index (Azure Cognitive Search REST API) | Microsoft Docs. 
Note: You can copy the index schema from the Azure Portal, by selecting your Azure Cognitive Search service and from the indexes tab selecting the index you currently are using and clicking on Index Definition (JSON). Select all the content and copy.



### Step 4: Configure Azure Cognitive Search Linked Service

Under Linked services click on New
Fill out the New linked service form:
Choose the Azure subscription where your Azure Cognitive Search service resides.
Choose the Azure Cognitive Search service where your Power Query connector indexer lives.
Click on Create.

### Step 5: Configure Azure Cognitive Search Dataset

In the left pane, select Author icon. Then click on Datasets and "…" .
Select New dataset.
Search for search data store and select Azure Search icon. Click on Continue.
In the Set properties form:
Select the Linked service recently created for Azure Cognitive Search
Choose the index that you created as part of [Step 3] (pointer)
Click OK.
Click Save.


## Step 6: Configure Azure Blob Storage Linked Service

In the left pane, click on the Manage icon.
Under Linked services click on New.
In the right pane, in the Data store search, type Storage. Then click on the Azure Blob Storage icon and select Continue.
Fill out the New linked service:
Leave Connect via integration runtime default value (AutoResolveIntegrationRuntime).
Choose the Authentication type: SAS URI. Only this method can be used to import data from Snowflake into Azure Blob Storage.
[Generate a SAS URL](Generate shared access signature (SAS) tokens for containers and blobs with Microsoft Storage Explorer - Azure Cognitive Services | Microsoft Docs) for the storage account you will be using for staging and copy the Blob SAS URL to SAS URL field.
Click on Create.


## Step 7: Configure Storage dataset
In the left pane, select Author icon. Then click on Datasets and "…" .
Select New dataset.
Search for storage data store and select Azure Blob Storage icon. Click on Continue.
Select DelimitedText format and click on Continue.
In Row delimiter, select Line feed (\n)
Check First row as a header box.
Click on Save.

## Step 8: Configure Pipeline
In the left pane, select Author icon. Then click on Pipelines and "…" .
Click on New pipeline.
Create and configure the Data Factory Activities that will be part of the pipeline:
A) Configure staging activity to copy from Snowflake to Azure Storage container
Expand Move & transform and drag and drop Copy Data activity to the blank pipeline editor canvas.
In the General tab, leave the default values, unless you need to customize the execution.
In the Source tab, select your PostgreSQL table or query. Leave the remaining options with the default values.
In the Sink tab:
Select the Storage DelimitedText PostgreSQL dataset. ----(mention the step it was configured on)----
Add .csv as File Extension
Leave the remaining options with the default values. Click on Save.
B) Configure activity to index from Azure Storage Blob
Expand Move & transform and drag and drop Copy Data activity to the blank pipeline editor canvas.
In the General tab, leave the default values, unless you need to customize the execution.
In the Source tab:
Select the Storage source dataset.
In the File path type select Wildcard file path.
Leave all remaining fields with default values.
In the Sink tab, select your Azure Cognitive Search index. Leave the remaining options with the default values.
Click on Save.

## Step 9: Configure Activity order 

In the Pipeline canvas editor, click on the little green square in front of the Pipeline Activity that copies data from Snowflake to Azure Blob Storage and drag to the Activity that Indexes from Storage Account to Azure Cognitive Search to provide the execution order. 
Click on Save.

## Step 10: Add a Pipeline trigger
Click on [Add trigger](https://docs.microsoft.com/en-us/azure/data-factory/how-to-create-schedule-trigger?tabs=data-factory) to schedule the pipeline run and select New/Edit.
From the Choose trigger dropdown, select New.
Review the trigger options to run the pipeline and click on OK when choosing the desired options. 
Click on Save.
Click on Publish.

## Legacy content for Power Query connector preview

A Power Query connector is used with a search indexer to automate data ingestion from a variety of data sources, including those on other cloud providers. It uses [Power Query](/power-query/power-query-what-is-power-query) to retrieve the data. 

Data sources supported in the preview include:

+ Amazon Redshift
+ Elasticsearch
+ PostgreSQL
+ Salesforce Objects
+ Salesforce Reports
+ Smartsheet
+ Snowflake

### Supported functionality

Power Query connectors are used in indexers. An indexer in Azure Cognitive Search is a crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that adds data to an index. Indexers provide a convenient way for users to index content from their data source without having to write their own crawler or push model.

Indexers that reference Power Query data sources have the same level of support for skillsets, schedules, high water mark change detection logic, and most parameters that other indexers support.

### Prerequisites

Before you start pulling data from one of the supported data sources, you'll want to make sure you have all your resources set up.

+ Azure Cognitive Search service in a [supported region](#regional-availability).

+ [Register for the preview](https://aka.ms/azure-cognitive-search/indexer-preview). This feature must be enabled on the backend.

+ Azure Blob Storage account, used as an intermediary for your data. The data will flow from your data source, then to Blob Storage, then to the index. This requirement only exists with the initial gated preview.

### Regional availability

The preview is only available on search services in the following regions:

+ Central US
+ East US
+ East US 2
+ North Central US
+ North Europe
+ South Central US
+ West Central US
+ West Europe
+ West US
+ West US 2

### Preview limitations

This section describes the limitations that are specific to the current version of the preview.

+ Pulling binary data from your data source is not supported in this version of the preview. 

+ [Debug sessions](cognitive-search-debug-session.md) are not supported at this time.

### Getting started using the Azure portal

The Azure portal provides support for the Power Query connectors. By sampling data and reading metadata on the container, the Import data wizard in Azure Cognitive Search can create a default index, map source fields to target index fields, and load the index in a single operation. Depending on the size and complexity of source data, you could have an operational full text search index in minutes.

 The following video shows how to set up a Power Query connector in Azure Cognitive Search.
 
> [!VIDEO https://www.youtube.com/embed/uy-l4xFX1EE]

#### Step 1 – Prepare source data

Make sure your data source contains data. The Import data wizard reads metadata and performs data sampling to infer an index schema, but it also loads data from your data source. If the data is missing, the wizard will stop and return and error. 

#### Step 2 – Start Import data wizard

After you're approved for the preview, the Azure Cognitive Search team will provide you with an Azure portal link that uses a feature flag so that you can access the  Power Query connectors. Open this page and start the start the wizard from the command bar in the Azure Cognitive Search service page by selecting **Import data**.

:::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

#### Step 3 – Select your data source

There are a few data sources that you can pull data from using this preview. All data sources that use Power Query will include a "Powered By Power Query" on their tile. 
Select your data source. 

:::image type="content" source="media/search-power-query-connectors/power-query-import-data.png" alt-text="Screenshot of the Select a data source page." border="true":::

Once you've selected your data source, select **Next: Configure your data** to move to the next section.

#### Step 4 – Configure your data

Once you've selected your data source, you'll configure your connection. Each data source will require different information. For a few data sources, the Power Query documentation provides additional details on how to connect to your data. 

+ [PostgreSQL](/power-query/connectors/postgresql)
+ [Salesforce Objects](/power-query/connectors/salesforceobjects)
+ [Salesforce Reports](/power-query/connectors/salesforcereports)

Once you've provided your connection credentials, select **Next**.

#### Step 5 – Select your data

The import wizard will preview various tables that are available in your data source. In this step you'll check one table that contains the data you want to import into your index.

:::image type="content" source="media/search-power-query-connectors/power-query-preview-data.png" alt-text="Screenshot of data preview." border="true":::

Once you've selected your table, select **Next**.

#### Step 6 – Transform your data (Optional)

Power Query connectors provide you with a rich UI experience that allows you to manipulate your data so you can send the right data to your index. You can remove columns, filter rows, and much more. 

It's not required that you transform your data before importing it into Azure Cognitive Search.

:::image type="content" source="media/search-power-query-connectors/power-query-transform-your-data.png" alt-text="Screenshot of Transform your data page." border="true":::

For more information about transforming data with Power Query, look at [Using Power Query in Power BI Desktop](/power-query/power-query-quickstart-using-power-bi). 

Once you're done transforming your data, select **Next**.

#### Step 7 – Add Azure Blob storage

The Power Query connector preview currently requires you to provide a blob storage account. This step only exists with the initial gated preview. This blob storage account will serve as temporary storage for data that moves from your data source to an Azure Cognitive Search index.

We recommend providing a full access storage account connection string:
 
```JSON
{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }
```

You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Settings > Access keys (for Azure Resource Manager storage accounts).

After you've provided a data source name and connection string, select “Next: Add cognitive skills (Optional)”. 

#### Step 8 – Add cognitive skills (Optional)

[AI enrichment](cognitive-search-concept-intro.md) is an extension of indexers that can be used to make your content more searchable.

This is an optional step for this preview. When complete, select **Next: Customize target index**.

#### Step 9 – Customize target index

On the Index page, you should see a list of fields with a data type and a series of checkboxes for setting index attributes. The wizard can generate a fields list based on metadata and by sampling the source data.

You can bulk-select attributes by clicking the checkbox at the top of an attribute column. Choose Retrievable and Searchable for every field that should be returned to a client app and subject to full text search processing. You'll notice that integers are not full text or fuzzy searchable (numbers are evaluated verbatim and are often useful in filters).

Review the description of index attributes and language analyzers for more information.

Take a moment to review your selections. Once you run the wizard, physical data structures are created and you won't be able to edit most of the properties for these fields without dropping and recreating all objects.

:::image type="content" source="media/search-power-query-connectors/power-query-index.png" alt-text="Screenshot of Create your index page." border="true":::

When complete, select **Next: Create an Indexer**.

#### Step 10 – Create an indexer

The last step creates the indexer. Naming the indexer allows it to exist as a standalone resource, which you can schedule and manage independently of the index and data source object, created in the same wizard sequence.

The output of the Import data wizard is an indexer that crawls your data source and imports the data you selected into an index on Azure Cognitive Search.

When creating the indexer, you can optionally choose to run the indexer on a schedule and add change detection. To add change detection, designate a 'high water mark' column.

:::image type="content" source="media/search-power-query-connectors/power-query-indexer-configuration.png" alt-text="Screenshot of Create your indexer page." border="true":::

Once you've finished filling out this page select **Submit**.

### High Water Mark Change Detection policy

This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated.

#### Requirements

+ All inserts specify a value for the column.
+ All updates to an item also change the value of the column.
+ The value of this column increases with each insert or update.

### Unsupported column names

Field names in an Azure Cognitive Search index have to meet certain requirements. One of these requirements is that some characters such as "/" are not allowed. If a column name in your database does not meet these requirements, the index schema detection will not recognize your column as a valid field name and you won't see that column listed as a suggested field for your index. Normally, using [field mappings](search-indexer-field-mappings.md) would solve this problem but field mappings are not supported in the portal.

To index content from a column in your table that has an unsupported field name, rename the column during the "Transform your data" phase of the import data process. For example, you can rename a column named "Billing code/Zip code" to "zipcode". By renaming the column, the index schema detection will recognize it as a valid field name and add it as a suggestion to your index definition.

## Next steps

This article explained how to pull data using the Power Query connectors. Because this preview feature is discontinued, it also explains how to migrate existing solutions to a supported scenario. 

To learn more about indexers, see [Indexers in Azure Cognitive Search](search-indexer-overview.md).
