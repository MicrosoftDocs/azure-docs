---
title: Index data using Power Query connectors (preview)
titleSuffix: Azure Cognitive Search
description: Import data from different data sources using the Power Query connectors.

manager: luisca
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/25/2021
---

# Index data using Power Query connectors (preview)

> [!IMPORTANT] 
> Power Query connector support is currently in a **gated public preview**. You can request access to the gated preview by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview).
>
> Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> The Azure portal provides this feature. There is currently no SDK support.

## Overview
An indexer in Azure Cognitive Search is a crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that adds data to an index. Indexers provide a convenient way for users to index content from their data source without having to write their own crawler or push model. Indexers also allow you to add a skillset to their pipeline so that they can further enrich their data.

With the new Power Query data connector integration, you can pull data from many new data sources that are outside of the Azure cloud. [Power Query](https://docs.microsoft.com/power-query/power-query-what-is-power-query) is a data transformation and data preparation engine. Power Query connectors are used in products like Power BI and Excel. Azure Cognitive Search has added support for select Power Query data connectors so that you can pull data from more data sources. These new data sources are supported in the Azure portal.

## Supported data sources
+ Amazon Redshift
+ Elasticsearch
+ PostgreSQL
+ Salesforce Objects
+ Salesforce Reports
+ Smartsheet
+ Snowflake

## Supported functionality
Indexers that reference Power Query data sources have the same level of support for skillsets, schedules, and high water mark change detection logic as other indexers.

### High Water Mark Change Detection policy
This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated.

#### Requirements

+ All inserts specify a value for the column.
+ All updates to an item also change the value of the column.
+ The value of this column increases with each insert or update.

## Preview limitations
Although there is a lot to be excited about with this preview, there are a few limitations. This section describes a few limitations that are specific to the current version of the preview.
+ The initial preview requires you to supply a Blob storage account.
+ Support for this preview is limited to the Azure portal for all data sources and the 2020-06-30-Preview API for some data sources.
+ The preview is only available to customers with search services in the following regions:
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
+ Pulling binary data from your data source is not supported in this version of the preview. 
+ Debug sessions are not supported at this time.

## Prerequisites
Before you start pulling data from one of the supported data sources, you'll want to make sure you have all your resources set up.
+ Azure Cognitive Search service
    + Azure Cognitive Search service set up in a supported region.
    + Ensure that the Azure Cognitive Search team has enabled your search service for the preview. You can sign up for the preview filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview). 
+ Azure Blob storage account
    + A Blob storage account is required for the preview to be used as an intermediary for your data. The data will flow from your data source, then to Blob storage, then to the index. This limitation only exists with the initial gated preview.

## Getting started using the Azure portal
The Azure portal provides support for the Power Query connectors. By sampling data and reading metadata on the container, the Import data wizard in Azure Cognitive Search can create a default index, map source fields to target index fields, and load the index in a single operation. Depending on the size and complexity of source data, you could have an operational full text search index in minutes.

### Step 1 – Prepare source data
Make sure your data source contains data. The Import data wizard reads metadata and performs data sampling to infer an index schema, but it also loads data from your data source. If the data is missing, the wizard will stop and return and error. 

### Step 2 – Start Import data wizard
After you're approved for the preview, the Azure Cognitive Search team will provide you with an Azure portal link that uses a feature flag so that you can access the  Power Query connectors. Open this page and start the start the wizard from the command bar in the Azure Cognitive Search service page by selecting "Import data". 

![Import data command in portal](./media/search-import-data-portal/import-data-cmd2.png "Start the Import data wizard")

### Step 3 – Select your data source
There are a few data sources that you can pull data from using this preview. All data sources that use Power Query will include a "Powered By Power Query" on their tile. 
Select your data source. 
 
![Select a data source](./media/search-power-query-connectors/powerquery-import-data.png "Select a data source")

Once you've selected your data source, select **Next: Configure your data** to move to the next section.

### Step 4 – Configure your data
Once you've selected your data source, you'll configure your connection. Each data source will require different information. For a few data sources, the Power Query documentation provides additional details on how to connect to your data. 

+ [PostgreSQL](https://docs.microsoft.com/power-query/connectors/postgresql)
+ [Salesforce Objects](https://docs.microsoft.com/power-query/connectors/salesforceobjects)
+ [Salesforce Reports](https://docs.microsoft.com/power-query/connectors/salesforcereports)

Once you've provided your connection credentials, select **Next**.

### Step 5 – Select your data
The import wizard will preview various tables that are available in your data source. In this step you'll check one table that contains the data you want to import into your index.
 
![Preview your data](./media/search-power-query-connectors/powerquery-preview-data.png "Preview your data")

Once you've selected your table, select **Next**.

### Step 6 – Transform your data (Optional)
Power Query connectors provide you with a rich UI experience that allows you to manipulate your data so you can send the right data to your index. You can remove columns, filter rows, and much more. 

It's not required that you transform your data before importing it into Azure Cognitive Search.

![Transform your data](./media/search-power-query-connectors/powerquery-transform-data.png "Transform your data") 

For more information about transforming data with Power Query, look at [Using Power Query in Power BI Desktop](https://docs.microsoft.com/power-query/power-query-quickstart-using-power-bi). 

Once you're done transforming your data, select **Next**.

### Step 7 – Add Azure Blob storage
The Power Query connector preview currently requires you to provide a blob storage account. This blob storage account will serve as temporary storage for data that moves from your data source to an Azure Cognitive Search index.

We recommend providing a full access storage account connection string: 
```
{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }
```

You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Settings > Access keys (for Azure Resource Manager storage accounts).

After you've provided a data source name and connection string, select “Next: Add cognitive skills (Optional)”. 

### Step 8 – Add cognitive skills (Optional)
[AI enrichment](cognitive-search-concept-intro.md) is an extension of indexers that can be used to make your content more searchable.

This is an optional step for this preview. When complete, select **Next: Customize target index**.

### Step 9 – Customize target index
On the Index page, you should see a list of fields with a data type and a series of checkboxes for setting index attributes. The wizard can generate a fields list based on metadata and by sampling the source data.

You can bulk-select attributes by clicking the checkbox at the top of an attribute column. Choose Retrievable and Searchable for every field that should be returned to a client app and subject to full text search processing. You'll notice that integers are not full text or fuzzy searchable (numbers are evaluated verbatim and are often useful in filters).

Review the description of index attributes and language analyzers for more information.

Take a moment to review your selections. Once you run the wizard, physical data structures are created and you won't be able to edit most of the properties for these fields without dropping and recreating all objects.

![Create your index](./media/search-power-query-connectors/powerquery-index.png "Create your index")

When complete, select **Next: Create an Indexer**.

### Step 10 – Create an indexer
The last step creates the indexer. Naming the indexer allows it to exist as a standalone resource, which you can schedule and manage independently of the index and data source object, created in the same wizard sequence.

The output of the Import data wizard is an indexer that crawls your data source and imports the data you selected into an index on Azure Cognitive Search.

When creating the indexer, you can optionally choose to run the indexer on a schedule and add change detection. To add change detection, designate a 'high water mark' column.

![Create your indexer](./media/search-power-query-connectors/powerquery-indexer-configuration.png "Create your indexer")

Once you've finished filling out this page select **Submit**.

## Next steps
Congratulations! You have learned how to pull data from new data sources using the Power Query connectors. To learn more about indexers, see [Indexers in Azure Cognitive Search](search-indexer-overview.md).