---
title: Data sources gallery
titleSuffix: Azure Cognitive Search
description: Lists all of the supported data sources for importing into an Azure Cognitive Search index.
author: vkurpad
ms.author: vikurpad

ms.service: cognitive-search
ms.topic: conceptual
layout: LandingPage
ms.date: 05/29/2021

---

# Data sources gallery

## Generally available data sources by Cognitive Search

:::row:::
:::column span="":::

---

### Azure Blob Storage

by [Cognitive Search](search-what-is-azure-search.md)

Extract blob metadata and content, serialized into JSON documents, and imported into a search index as search documents. Set properties in both data source and indexer definitions to optimize for various blob content types. Change detection is supported automatically.

[More details](search-howto-indexing-azure-blob-storage.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_storage.png":::

:::column-end:::
:::column span="":::

---

### Azure Cosmos DB (SQL API)

by [Cognitive Search](search-what-is-azure-search.md)

Connect to Cosmos DB through the SQL API to extract items from a container, serialized into JSON documents, and imported into a search index as search documents. Configure change tracking to refresh the search index with the latest changes in your database.

[More details](search-howto-index-cosmosdb.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_cosmos_db_logo_small.png":::

:::column-end:::
:::column span="":::

---

### Azure SQL Database

by [Cognitive Search](search-what-is-azure-search.md)

Extract field values from a single table or view, serialized into JSON documents, and imported into a search index as search documents. Configure change tracking to refresh the search index with the latest changes in your database.

[More details](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)

:::image type="icon" source="media/search-data-sources-gallery/azuresqlconnectorlogo_medium.png":::

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

:::row:::
:::column span="":::

---

### Azure Table Storage

by [Cognitive Search](search-what-is-azure-search.md)

Extract rows from an Azure Table, serialized into JSON documents, and imported into a search index as search documents. 

[More details](search-howto-indexing-azure-tables.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_storage.png":::

:::column-end:::
:::column span="":::

---

### Azure Data Lake Storage Gen2

by [Cognitive Search](search-what-is-azure-search.md)

Connect to Azure Storage through Azure Data Laker Storage Gen2 to extract content from a hierarchy of directories and nested subdirectories.

[More details](search-howto-index-azure-data-lake-storage.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_storage.png":::

:::column-end:::
:::column span="":::

---

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

---

## Preview data sources by Cognitive Search

:::row:::
:::column span="":::

---

### Cosmos DB (Gremlin API)

by [Cognitive Search](search-what-is-azure-search.md)

Connect to Cosmos DB through the Gremlin API to extract items from a container, serialized into JSON documents, and imported into a search index as search documents. Configure change tracking to refresh the search index with the latest changes in your database.

[More details](search-howto-index-cosmosdb-gremlin.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_cosmos_db_logo_small.png":::

:::column-end:::
:::column span="":::

---

### Cosmos DB (Cassandra API)

by [Cognitive Search](search-what-is-azure-search.md)

Connect to Cosmos DB through the Cassandra API to extract items from a container, serialized into JSON documents, and imported into a search index as search documents. Configure change tracking to refresh the search index with the latest changes in your database.

[More details](search-howto-index-cosmosdb.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_cosmos_db_logo_small.png":::

:::column-end:::
:::column span="":::

---

### Cosmos DB (Mongo API)

by [Cognitive Search](search-what-is-azure-search.md)

Connect to Cosmos DB through the Mongo API to extract items from a container, serialized into JSON documents, and imported into a search index as search documents. Configure change tracking to refresh the search index with the latest changes in your database.

[More details](search-howto-index-cosmosdb.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_cosmos_db_logo_small.png":::

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

:::row:::
:::column span="":::

---

### SharePoint Online

by [Cognitive Search](search-what-is-azure-search.md)

Connect to a SharePoint Online site and index documents from one or more Document Libraries, for accounts and search services in the same tenant. Text and normalized images will be extracted by default. Optionally, you can configure a skillset for more content transformation and enrichment, or configure change tracking to refresh a search index with new or changed content in SharePoint.

[More details](search-howto-index-sharepoint-online.md)

:::image type="icon" source="media/search-data-sources-gallery/sharepoint_online_logo.png":::

:::column-end:::
:::column span="":::

---

### Azure MySQL

by [Cognitive Search](search-what-is-azure-search.md)

Connect to MySQL database on Azure to extract rows in a table, serialized into JSON documents, and imported into a search index as search documents. On subsequent runs, the indexer will take all changes, uploads, and deletes for your MySQL database and reflect these changes in your search index.

[More details](search-howto-index-mysql.md)

:::image type="icon" source="media/search-data-sources-gallery/azure_mysql.png":::

:::column-end:::
:::column span="":::

---

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

---

## Power Query Connectors

Connect to data on other cloud platforms using indexers and a Power Query connector as the data source.

:::row:::
:::column span="":::

---

### Amazon Redshift

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to [Amazon Redshift](https://aws.amazon.com/redshift/) and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::column span="":::

---

### Elasticsearch

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to [Elasticsearch](www.elastic.co/elasticsearch) in the cloud and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::column span="":::

---

### PostgreSQL

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to a [PostgreSQL](https://www.postgresql.org/) database in the cloud and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

:::row:::
:::column span="":::

---

### Salesforce Objects

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to Salesforce Objects and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::column span="":::

---

### Salesforce Reports

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to Salesforce Reports and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::column span="":::

---

### Smartsheet

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Connect to Smartsheet and extract searchable content for indexing in Cognitive Search.

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

:::row:::
:::column span="":::

---

### Snowflake

Powered by [Power Query](/power-query/power-query-what-is-power-query)

Extract searchable data and metadata from a Snowflake database and populate an index based on field-to-field mappings between the index and your data source. 

[More details](search-how-to-index-power-query-data-sources.md)

:::column-end:::
:::column span="":::

---

:::column-end:::
:::column span="":::

---

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::

## Data sources from our Partners

:::row:::
:::column span="":::

---

### TBD-1

by [Raytion](https://www.raytion.com/)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[More details](https://www.raytion.com/)

:::column-end:::
:::column span="":::

---

### TBD-2

by [Raytion](https://www.raytion.com/)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[More details](https://www.raytion.com/)

:::column-end:::
:::column span="":::

---

### TBD-3

by [BA Insight](https://www.bainsight.com/)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[More details](https://www.bainsight.com/)

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::
