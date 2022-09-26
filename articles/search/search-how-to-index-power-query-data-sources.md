---
title: Power Query connectors (preview - retired)
titleSuffix: Azure Cognitive Search
description: Import data from different data sources using the Power Query connectors.

author: gmndrg
ms.author: gimondra
manager: liamca

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/27/2022
ms.custom: references_regions
---

# Power Query connectors (preview - retired)

> [!IMPORTANT] 
> Power Query connector support was introduced as a **gated public preview** under [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), but is now discontinued. If you have a search solution that uses a Power Query connector, please migrate to an alternative solution.

## Migrate by November 28

The Power Query connector preview was announced in May 2021 and won't be moving forward into general availability. The following migration guidance is available for Snowflake and PostgreSQL. If you're using a different connector and need migration instructions, please use the email contact information provided in your preview sign up to request help or open a ticket with Azure Support.

## Prerequisites

- An Azure Storage account. If you don't have one, [create a storage account](../storage/common/storage-account-create.md).
- An Azure Data Factory. If you don't have one, [create a Data Factory](../data-factory/quickstart-create-data-factory-portal.md). See [Data Factory Pipelines Pricing](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) before implementation to understand the associated costs. Also, check [Data Factory pricing through examples](../data-factory/pricing-concepts.md).

## Migrate a Snowflake data pipeline

This section explains how to copy data from a Snowflake database to an [Azure Cognitive Search index](search-what-is-an-index.md). There's no process for directly indexing from Snowflake to Azure Cognitive Search, so this section includes a staging phase that copies database content to an Azure Storage blob container. You'll then index from that staging container using a [Data Factory pipeline](../data-factory/quickstart-create-data-factory-portal.md).

### Step 1: Retrieve Snowflake database information

1. Go to [Snowflake](https://app.snowflake.com/) and sign in to your Snowflake account. A Snowflake account looks like *https://<account_name>.snowflakecomputing.com*.

1. Once you're signed in, collect the following information from the left pane. You'll use this information in the next step:

   - From **Data**, select **Databases** and copy the name of the database source.
   - From **Admin**, select **Users & Roles** and copy the name of the user. Make sure the user has read permissions.
   - From **Admin**, select **Accounts** and copy the **LOCATOR** value of the account.
   - From the Snowflake URL, similar to `https://app.snowflake.com/<region_name>/xy12345/organization)`. copy the region name. For example, in `https://app.snowflake.com/south-central-us.azure/xy12345/organization`, the region name is `south-central-us.azure`.
   - From **Admin**, select **Warehouses** and copy the name of the warehouse associated with the database you'll use as the source.

### Step 2: Configure Snowflake Linked Service

1. Sign in to [Azure Data Factory Studio](https://ms-adf.azure.com/) with your Azure account.

1. Select your data factory and then select **Continue**.

1. From the left menu, select the **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="Screenshot showing how to choose the Manage icon in Azure Data Factory to configure Snowflake Linked Service.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "snowflake". Select the **Snowflake** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/snowflake-icon.png" alt-text="Screenshot showing how to choose Snowflake tile in new Linked Service data store." border="true":::

1. Fill out the **New linked service** form with the data you collected in the previous step. The **Account name** includes a **LOCATOR** value and the region (for example: `xy56789south-central-us.azure`).
  
   :::image type="content" source="media/search-power-query-connectors/new-linked-service-snowflake-form.png" alt-text="Screenshot showing how to fill out Snowflake Linked Service form.":::

1. After the form is completed, select **Test connection**.

1. If the test is successful, select **Create**.

### Step 3: Configure Snowflake Dataset

1. From the left menu, select the **Author** icon.

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset in Azure Data Factory for Snowflake.":::

1. On the right pane, in the data store search, enter "snowflake". Select the **Snowflake** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-snowflake.png" alt-text="Screenshot showing how to choose Snowflake from data source for Dataset.":::

1. In **Set Properties**:
   - Select the Linked Service you created in [Step 2](#step-2-configure-snowflake-linked-service).
   - Select the table that you would like to import, and then select **OK**.

   :::image type="content" source="media/search-power-query-connectors/set-snowflake-properties.png" alt-text="Screenshot showing how to configure dataset properties for Snowflake.":::

1. Select **Save**.

### Step 4: Create a new index in Azure Cognitive Search

[Create a new index](/rest/api/searchservice/create-index) in your Azure Cognitive Search service with the same schema as the one you have currently configured for your Snowflake data.

You can repurpose the index you're currently using for the Snowflake Power Connector. In the Azure portal, find the index and then select **Index Definition (JSON)**. Select the definition and copy it to the body of your new index request.

   :::image type="content" source="media/search-power-query-connectors/snowflake-index.png" alt-text="Screenshot showing how to copy existing Azure Cognitive Search index JSON configuration for existing Snowflake index.":::

### Step 5: Configure Azure Cognitive Search Linked Service

1. From the left menu, select **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="Screenshot showing how to choose the Manage icon in Azure Data Factory to add a new linked service.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory for Cognitive Search.":::

1. On the right pane, in the data store search, enter "search". Select the **Azure Search** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/linked-service-search-new.png" alt-text="Screenshot showing how to choose New Linked Search in Azure Data Factory to import from Snowflake.":::

1. Fill out the **New linked service** values:

   - Choose the Azure subscription where your Azure Cognitive Search service resides.
   - Choose the Azure Cognitive Search service that has your Power Query connector indexer.
   - Select **Create**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service-search.png" alt-text="Screenshot showing how to choose New Linked Search Service in Azure Data Factory with its properties to import from Snowflake.":::

### Step 6: Configure Azure Cognitive Search Dataset

1. From the left menu, select **Author** icon.

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option for Cognitive Search.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "search". Select the **Azure Search** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-search.png" alt-text="Screenshot showing how to choose an Azure Cognitive Search service for a Dataset in Azure Data Factory to use as sink.":::

1. In **Set properties**:
   - Select the Linked service recently created in [Step 5](#step-5-configure-azure-cognitive-search-linked-service).
   - Choose the search index that you created in [Step 4](#step-4-create-a-new-index-in-azure-cognitive-search).
   - Select **OK**.

     :::image type="content" source="media/search-power-query-connectors/set-search-snowflake-properties.png" alt-text="Screenshot showing how to choose New Search Linked Service in Azure Data Factory for Snowflake.":::

1. Select **Save**.

### Step 7: Configure Azure Blob Storage Linked Service

1. From the left menu, select **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="Screenshot showing how to choose the Manage icon in Azure Data Factory to link a new service.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory to assign a storage account.":::

1. On the right pane, in the data store search, enter "storage". Select the **Azure Blob Storage** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service-blob.png" alt-text="Screenshot showing how to choose New Linked Blob Storage Service to use as sink for Snowflake in Azure Data Factory.":::

1. Fill out the **New linked service** values:

   - Choose the Authentication type: SAS URI. Only this authentication type can be used to import data from Snowflake into Azure Blob Storage.
   - [Generate a SAS URL](../cognitive-services/Translator/document-translation/create-sas-tokens.md) for the storage account you'll be using for staging. Paste the Blob SAS URL into the SAS URL field.
   - Select **Create**.

     :::image type="content" source="media/search-power-query-connectors/sas-url-storage-linked-service-snowflake.png" alt-text="Screenshot showing how to fill out New Linked Search Service form in Azure Data Factory with its properties to import from SnowFlake.":::

### Step 8: Configure Storage dataset

1. From the left menu, select **Author** icon.

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset for storage in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "storage". Select the **Azure Blob Storage** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-blob-storage.png" alt-text="Screenshot showing how to choose a new blob storage data store in Azure Data Factory for staging.":::

1. Select **DelimitedText** format and select **Continue**.

1. In **Set Properties**:
   - Under **Linked service**, select the linked service created in [Step 7](#step-7-configure-azure-blob-storage-linked-service).
   - Under **File path**, choose the container that will be the sink for the staging process and select **OK**.

     :::image type="content" source="media/search-power-query-connectors/set-delimited-text-properties.png" alt-text="Screenshot showing how to configure properties for storage dataset for Snowflake in Azure Data Factory.":::

   - In **Row delimiter**, select *Line feed (\n)*.
   - Check **First row as a header** box.
   - Select **Save**.

     :::image type="content" source="media/search-power-query-connectors/delimited-text-snowflake-save.png" alt-text="Screenshot showing how to save a DelimitedText configuration to be used as sink for Snowflake." border="true":::

### Step 9: Configure Pipeline

1. From the left menu, select **Author** icon. 

1. Select **Pipelines**, and then select the Pipelines Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-pipelines.png" alt-text="Screenshot showing how to choose the Author icon and Pipelines option to configure Pipeline for Snowflake data transformation.":::

1. Select **New pipeline**.

   :::image type="content" source="media/search-power-query-connectors/new-pipeline.png" alt-text="Screenshot showing how to choose a new Pipeline in Azure Data Factory to create for Snowflake data ingestion.":::

1. Create and configure the [Data Factory activities](../data-factory/concepts-pipelines-activities.md) that copy from Snowflake to Azure Storage container:

   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.

      :::image type="content" source="media/search-power-query-connectors/drag-and-drop-snowflake-copy-data.png" alt-text="Screenshot showing how to drag and drop a Copy data activity in Pipeline canvas to copy data from Snowflake.":::

   - Open the **General** tab. Accept the default values unless you need to customize the execution.

   - In the **Source** tab, select your Snowflake table. Leave the remaining options with the default values.

      :::image type="content" source="media/search-power-query-connectors/source-snowflake.png" alt-text="Screenshot showing how to configure the Source in a pipeline to import data from Snowflake.":::

   - In the **Sink** tab:

      - Select *Storage DelimitedText* dataset created in [Step 8](#step-8-configure-storage-dataset).
      - In **File Extension**, add *.csv*.
      - Leave the remaining options with the default values. 

         :::image type="content" source="media/search-power-query-connectors/delimited-text-sink.png" alt-text="Screenshot showing how to configure the sink in a Pipeline to move the data to Azure Storage from Snowflake.":::

   - Select **Save**.

1. Configure the activities that copy from Azure Storage Blob to a search index:

   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.

      :::image type="content" source="media/search-power-query-connectors/index-from-storage-activity.png" alt-text="Screenshot showing how to drag and drop a Copy data activity in Pipeline canvas to index from Storage.":::

   - In the **General** tab, accept the default values, unless you need to customize the execution.

   - In the **Source** tab:

      - Select *Storage DelimitedText* dataset created in [Step 8](#step-8-configure-storage-dataset).
      - In the **File path type** select *Wildcard file path*.
      - Leave all remaining fields with default values.

      :::image type="content" source="media/search-power-query-connectors/source-snowflake.png" alt-text="Screenshot showing how to configure the Source in a pipeline to import data from blob storage to Azure Cognitive Search index for staging phase.":::

   - In the **Sink** tab, select your Azure Cognitive Search index. Leave the remaining options with the default values.

      :::image type="content" source="media/search-power-query-connectors/search-sink.png" alt-text="Screenshot showing how to configure the Sink in a pipeline to import data from blob storage to Azure Cognitive Search index as final step from pipeline.":::

   - Select **Save**.

### Step 10: Configure Activity order 

1. In the Pipeline canvas editor, select the little green square at the edge of the pipeline activity tile. Drag it to the "Indexes from Storage Account to Azure Cognitive Search" activity to set the execution order. 

1. Select **Save**.

   :::image type="content" source="media/search-power-query-connectors/pipeline-link-activities-snowflake-storage-index.png" alt-text="Screenshot showing how to link Pipeline activities to provide the order of execution for Snowflake.":::

### Step 11: Add a Pipeline trigger

1. Select [Add trigger](../data-factory/how-to-create-schedule-trigger.md) to schedule the pipeline run and select **New/Edit**.

   :::image type="content" source="media/search-power-query-connectors/add-pipeline-trigger.png" alt-text="Screenshot showing how to add a new trigger for a Pipeline in Data Factory to run for Snowflake." border="true":::

1. From the **Choose trigger** dropdown, select **New**.

   :::image type="content" source="media/search-power-query-connectors/choose-trigger-new.png" alt-text="Screenshot showing how to select adding a new trigger for a Pipeline in Data Factory for Snowflake.":::

1. Review the trigger options to run the pipeline and select **OK**.

   :::image type="content" source="media/search-power-query-connectors/new-trigger.png" alt-text="Screenshot showing how to configure a trigger to run a Pipeline in Data Factory for Snowflake.":::

1. Select **Save**.

1. Select **Publish**.

   :::image type="content" source="media/search-power-query-connectors/publish-pipeline.png" alt-text="How to Publish a Pipeline in Data Factory for Snowflake ingestion to index." border="true":::

## Migrate a PostgreSQL data pipeline

This section explains how to copy data from a PostgreSQL database to an [Azure Cognitive Search index](search-what-is-an-index.md). There's no process for directly indexing from PostgreSQL to Azure Cognitive Search, so this section includes a staging phase that copies database content to an Azure Storage blob container. You'll then index from that staging container using a [Data Factory pipeline](../data-factory/quickstart-create-data-factory-portal.md).

### Step 1: Configure PostgreSQL Linked Service

1. Sign in to [Azure Data Factory Studio](https://ms-adf.azure.com/) with your Azure account.

1. Choose your Data Factory and select **Continue**.

1. From the left menu, select the **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="How to choose the Manage icon in Azure Data Factory.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "postgresql". Select the **PostgreSQL** tile that represents where your PostgreSQL database is located (Azure or other) and select **Continue**. In this example, PostgreSQL database is located in Azure.

   :::image type="content" source="media/search-power-query-connectors/search-postgresql-data-store.png" alt-text="How to choose PostgreSQL data store for a Linked Service in Azure Data Factory.":::

1. Fill out the **New linked service** values:

   - In **Account selection method**, select **Enter manually**.
   - From your Azure Database for PostgreSQL Overview page in the [Azure portal](https://portal.azure.com/), paste the following values into their respective field:
     - Add *Server name* to **Fully qualified domain name**.
     - Add *Admin username* to **User name**.
     - Add *Database* to **Database name**.
     - Enter the Admin username password to **Username password**.
     - Select **Create**.

     :::image type="content" source="media/search-power-query-connectors/new-linked-service-postgresql.png" alt-text="Choose the Manage icon in Azure Data Factory":::

### Step 2: Configure PostgreSQL Dataset

1. From the left menu, select **Author** icon. 

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "postgresql". Select the **Azure PostgreSQL** tile. Select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-postgresql.png" alt-text="Screenshot showing how to choose PostgreSQL data store for a Dataset in Azure Data Factory." border="true":::

1. Fill out the **Set properties** values:

   - Choose the PostgreSQL Linked Service created in [Step 1](#step-1-configure-postgresql-linked-service).
   - Select the table you would like to import/index.
   - Select **OK**.

     :::image type="content" source="media/search-power-query-connectors/postgresql-set-properties.png" alt-text="Screenshot showing how to set PostgreSQL properties for dataset in Azure Data Factory.":::

1. Select **Save**.

### Step 3: Create a new index in Azure Cognitive Search

[Create a new index](/rest/api/searchservice/create-index) in your Azure Cognitive Search service with the same schema as the one used for your PostgreSQL data.

You can repurpose the index you're currently using for the PostgreSQL Power Connector. In the Azure portal, find the index and then select **Index Definition (JSON)**. Select the definition and copy it to the body of your new index request.

   :::image type="content" source="media/search-power-query-connectors/postgresql-index.png" alt-text="Screenshot showing how to copy existing Azure Cognitive Search index JSON configuration.":::

### Step 4: Configure Azure Cognitive Search Linked Service

1. From the left menu, select the **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="Screenshot showing how to choose the Manage icon in Azure Data Factory to link a service.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "search". Select **Azure Search** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/linked-service-search-new.png" alt-text="Screenshot showing how to choose New Linked Search service in Azure Data Factory." border="true":::

1. Fill out the **New linked service** values:

   - Choose the Azure subscription where your Azure Cognitive Search service resides.
   - Choose the Azure Cognitive Search service that has your Power Query connector indexer.
   - Select **Create**.
   
   :::image type="content" source="media/search-power-query-connectors/new-linked-service-search.png" alt-text="Screenshot showing how to choose New Linked Search Service in Azure Data Factory with its properties to import from PostgreSQL.":::

### Step 5: Configure Azure Cognitive Search Dataset

1. From the left menu, select **Author** icon. 

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "search". Select the **Azure Search** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-search.png" alt-text="Screenshot showing how to choose an Azure Cognitive Search service for a Dataset in Azure Data Factory.":::

1. In **Set properties**:

   - Select the Linked service created for Azure Cognitive Search in [Step 4](#step-4-configure-azure-cognitive-search-linked-service).
   - Choose the index that you created as part of [Step 3](#step-3-create-a-new-index-in-azure-cognitive-search).
   - Select **OK**.

      :::image type="content" source="media/search-power-query-connectors/set-search-postgresql-properties.png" alt-text="Screenshot showing how to fill out Set Properties for search dataset.":::

1. Select **Save**.

### Step 6: Configure Azure Blob Storage Linked Service

1. From the left menu, select **Manage** icon.

   :::image type="content" source="media/search-power-query-connectors/azure-data-factory-manage-icon.png" alt-text="Screenshot showing how to choose the Manage icon in Azure Data Factory to link a service.":::

1. Under **Linked services**, select **New**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service.png" alt-text="Screenshot showing how to choose New Linked Service in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "storage". Select the **Azure Blob Storage** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-linked-service-blob.png" alt-text="Screenshot showing how to choose a new data store":::

1. Fill out the **New linked service** values:

   - Choose the **Authentication type**: *SAS URI*. Only this method can be used to import data from PostgreSQL into Azure Blob Storage.
   - [Generate a SAS URL](../cognitive-services/Translator/document-translation/create-sas-tokens.md) for the storage account you will be using for staging and copy the Blob SAS URL to SAS URL field.
   - Select **Create**.

     :::image type="content" source="media/search-power-query-connectors/sas-url-storage-linked-service-postgresql.png" alt-text="Screenshot showing how to fill out New Linked Search Service form in Azure Data Factory with its properties to import from PostgreSQL.":::

### Step 7: Configure Storage dataset

1. From the left menu, select **Author** icon. 

1. Select **Datasets**, and then select the Datasets Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-datasets.png" alt-text="Screenshot showing how to choose the Author icon and datasets option.":::

1. Select **New dataset**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset.png" alt-text="Screenshot showing how to choose a new dataset in Azure Data Factory.":::

1. On the right pane, in the data store search, enter "storage". Select the **Azure Blob Storage** tile and select **Continue**.

   :::image type="content" source="media/search-power-query-connectors/new-dataset-blob-storage.png" alt-text="Screenshot showing how to choose a new blob storage data store in Azure Data Factory.":::

1. Select **DelimitedText** format and select **Continue**.

1. In **Row delimiter**, select *Line feed (\n)*.

1. Check **First row as a header** box.

1. Select **Save**.

   :::image type="content" source="media/search-power-query-connectors/delimited-text-save-postgresql.png" alt-text="Screenshot showing options to import data to Azure Storage blob." border="true":::

### Step 8: Configure Pipeline

1. From the left menu, select **Author** icon. 

1. Select **Pipelines**, and then select the Pipelines Actions ellipses menu (`...`).

   :::image type="content" source="media/search-power-query-connectors/author-pipelines.png" alt-text="Screenshot showing how to choose the Author icon and Pipelines option.":::

1. Select **New pipeline**.

   :::image type="content" source="media/search-power-query-connectors/new-pipeline.png" alt-text="Screenshot showing how to choose a new Pipeline in Azure Data Factory.":::

1. Create and configure the [Data Factory activities](../data-factory/concepts-pipelines-activities.md) that copy from PostgreSQL to Azure Storage container.

   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.

      :::image type="content" source="media/search-power-query-connectors/postgresql-pipeline-general.png" alt-text="Screenshot showing how to drag and drop in Azure Data Factory to copy data from PostgreSQL." border="true":::

   - Open the **General** tab, accept the default values, unless you need to customize the execution.

   - In the **Source** tab, select your PostgreSQL table. Leave the remaining options with the default values.

      :::image type="content" source="media/search-power-query-connectors/source-postgresql.png" alt-text="Screenshot showing how to configure Source to import data from PostgreSQL into Azure Storage blob in staging phase." border="true":::

   - In the **Sink** tab:
      - Select the Storage DelimitedText PostgreSQL dataset configured in [Step 7](#step-7-configure-storage-dataset).
      - In **File Extension**, add *.csv*
      - Leave the remaining options with the default values.

         :::image type="content" source="media/search-power-query-connectors/sink-storage-postgresql.png" alt-text="Screenshot showing how to configure sink to import data from PostgreSQL into Azure Storage blob." border="true":::

   - Select **Save**.

1. Configure the activities that copy from Azure Storage to a search index:

   - Expand **Move & transform** section and drag and drop **Copy Data** activity to the blank pipeline editor canvas.

      :::image type="content" source="media/search-power-query-connectors/index-from-storage-activity-postgresql.png" alt-text="Screenshot showing how to drag and drop in Azure Data Factory to configure a copy activity." border="true":::

   - In the **General** tab, leave the default values, unless you need to customize the execution.

   - In the **Source** tab:
      - Select the Storage source dataset configured in [Step 7](#step-7-configure-storage-dataset).
      - In the **File path type** field, select *Wildcard file path*.
      - Leave all remaining fields with default values.

      :::image type="content" source="media/search-power-query-connectors/source-storage-postgresql.png" alt-text="Screenshot showing how to configure Source for indexing from Storage to Azure Cognitive Search index." border="true":::

   - In the **Sink** tab, select your Azure Cognitive Search index. Leave the remaining options with the default values.

      :::image type="content" source="media/search-power-query-connectors/sink-search-index-postgresql.png" alt-text="Screenshot showing how to configure Sink for indexing from Storage to Azure Cognitive Search index." border="true":::

   - Select **Save**.

### Step 9: Configure Activity order

1. In the Pipeline canvas editor, select the little green square at the edge of the pipeline activity. Drag it to the "Indexes from Storage Account to Azure Cognitive Search" activity to set the execution order. 

1. Select **Save**.

   :::image type="content" source="media/search-power-query-connectors/pipeline-link-acitivities-postgresql.png" alt-text="Screenshot showing how to configure activity order in the pipeline for proper execution." border="true":::

### Step 10: Add a Pipeline trigger

1. Select [Add trigger](../data-factory/how-to-create-schedule-trigger.md) to schedule the pipeline run and select **New/Edit**.

   :::image type="content" source="media/search-power-query-connectors/add-pipeline-trigger-postgresql.png" alt-text="Screenshot showing how to add a new trigger for a Pipeline in Data Factory." border="true":::

1. From the **Choose trigger** dropdown, select **New**.

   :::image type="content" source="media/search-power-query-connectors/choose-trigger-new.png" alt-text="Screenshot showing how to select adding a new trigger for a Pipeline in Data Factory." border="true":::

1. Review the trigger options to run the pipeline and select **OK**.

   :::image type="content" source="media/search-power-query-connectors/trigger-postgresql.png" alt-text="Screenshot showing how to configure a trigger to run a Pipeline in Data Factory." border="true":::

1. Select **Save**.

1. Select **Publish**.

   :::image type="content" source="media/search-power-query-connectors/publish-pipeline-postgresql.png" alt-text="Screenshot showing how to Publish a Pipeline in Data Factory for PostgreSQL data copy." border="true":::

## Legacy content for Power Query connector preview

A Power Query connector is used with a search indexer to automate data ingestion from various data sources, including those on other cloud providers. It uses [Power Query](/power-query/power-query-what-is-power-query) to retrieve the data. 

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

+ Pulling binary data from your data source isn't supported. 

+ [Debug session](cognitive-search-debug-session.md) isn't supported.

### Getting started using the Azure portal

The Azure portal provides support for the Power Query connectors. By sampling data and reading metadata on the container, the Import data wizard in Azure Cognitive Search can create a default index, map source fields to target index fields, and load the index in a single operation. Depending on the size and complexity of source data, you could have an operational full text search index in minutes.

 The following video shows how to set up a Power Query connector in Azure Cognitive Search.
 
> [!VIDEO https://www.youtube.com/embed/uy-l4xFX1EE]

#### Step 1 – Prepare source data

Make sure your data source contains data. The Import data wizard reads metadata and performs data sampling to infer an index schema, but it also loads data from your data source. If the data is missing, the wizard will stop and return and error. 

#### Step 2 – Start Import data wizard

After you're approved for the preview, the Azure Cognitive Search team will provide you with an Azure portal link that uses a feature flag so that you can access the  Power Query connectors. Open this page and start the wizard from the command bar in the Azure Cognitive Search service page by selecting **Import data**.

:::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

#### Step 3 – Select your data source

There are a few data sources that you can pull data from using this preview. All data sources that use Power Query will include a "Powered By Power Query" on their tile. 
Select your data source. 

:::image type="content" source="media/search-power-query-connectors/power-query-import-data.png" alt-text="Screenshot of the Select a data source page." border="true":::

After you've selected your data source, select **Next: Configure your data** to move to the next section.

#### Step 4 – Configure your data

In this step, you'll configure your connection. Each data source will require different information. For a few data sources, the Power Query documentation provides more detail on how to connect to your data. 

+ [PostgreSQL](/power-query/connectors/postgresql)
+ [Salesforce Objects](/power-query/connectors/salesforceobjects)
+ [Salesforce Reports](/power-query/connectors/salesforcereports)

After you've provided your connection credentials, select **Next**.

#### Step 5 – Select your data

The import wizard will preview various tables that are available in your data source. In this step, you'll check one table that contains the data you want to import into your index.

:::image type="content" source="media/search-power-query-connectors/power-query-preview-data.png" alt-text="Screenshot of data preview." border="true":::

Once you've selected your table, select **Next**.

#### Step 6 – Transform your data (Optional)

Power Query connectors provide you with a rich UI experience that allows you to manipulate your data so you can send the right data to your index. You can remove columns, filter rows, and much more. 

It's not required that you transform your data before importing it into Azure Cognitive Search.

:::image type="content" source="media/search-power-query-connectors/power-query-transform-your-data.png" alt-text="Screenshot of Transform your data page." border="true":::

For more information about transforming data with Power Query, look at [Using Power Query in Power BI Desktop](/power-query/power-query-quickstart-using-power-bi). 

After data is transformed, select **Next**.

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

You can add any enrichments that add benefit to your scenario. When complete, select **Next: Customize target index**.

#### Step 9 – Customize target index

On the Index page, you should see a list of fields with a data type and a series of checkboxes for setting index attributes. The wizard can generate a fields list based on metadata and by sampling the source data.

You can bulk-select attributes by selecting the checkbox at the top of an attribute column. Choose Retrievable and Searchable for every field that should be returned to a client app and subject to full text search processing. You'll notice that integers aren't full text or fuzzy searchable (numbers are evaluated verbatim and are often useful in filters).

Review the description of index attributes and language analyzers for more information.

Take a moment to review your selections. Once you run the wizard, physical data structures are created and you won't be able to edit most of the properties for these fields without dropping and recreating all objects.

:::image type="content" source="media/search-power-query-connectors/power-query-index.png" alt-text="Screenshot of Create your index page." border="true":::

When complete, select **Next: Create an Indexer**.

#### Step 10 – Create an indexer

The last step creates the indexer. Naming the indexer allows it to exist as a standalone resource, which you can schedule and manage independently of the index and data source object, created in the same wizard sequence.

The output of the Import data wizard is an indexer that crawls your data source and imports the data you selected into an index on Azure Cognitive Search.

When creating the indexer, you can optionally choose to run the indexer on a schedule and add change detection. To add change detection, designate a 'high water mark' column.

:::image type="content" source="media/search-power-query-connectors/power-query-indexer-configuration.png" alt-text="Screenshot of Create your indexer page." border="true":::

After you've finished filling out this page select **Submit**.

### High Water Mark Change Detection policy

This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated.

#### Requirements

+ All inserts specify a value for the column.
+ All updates to an item also change the value of the column.
+ The value of this column increases with each insert or update.

### Unsupported column names

Field names in an Azure Cognitive Search index have to meet certain requirements. One of these requirements is that some characters such as "/" aren't allowed. If a column name in your database does not meet these requirements, the index schema detection won't recognize your column as a valid field name and you won't see that column listed as a suggested field for your index. Normally, using [field mappings](search-indexer-field-mappings.md) would solve this problem but field mappings aren't supported in the portal.

To index content from a column in your table that has an unsupported field name, rename the column during the "Transform your data" phase of the import data process. For example, you can rename a column named "Billing code/Zip code" to "zipcode". By renaming the column, the index schema detection will recognize it as a valid field name and add it as a suggestion to your index definition.

## Next steps

This article explained how to pull data using the Power Query connectors. Because this preview feature is discontinued, it also explains how to migrate existing solutions to a supported scenario. 

To learn more about indexers, see [Indexers in Azure Cognitive Search](search-indexer-overview.md).
