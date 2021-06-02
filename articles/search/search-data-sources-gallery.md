---
title: Data sources gallery
titleSuffix: Azure Cognitive Search
description: Lists all of the supported data sources for importing into an Azure Cognitive Search index.
author: vkurpad
ms.author: vikurpad

ms.service: cognitive-search
ms.topic: conceptual
layout: LandingPage
ms.date: 06/03/2021

---

# Data sources gallery

## Generally available data sources by Cognitive Search

Pull in content from other Azure services using indexers and the following data source connectors.

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

New data sources are issued as preview features. [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to get started.

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

## Power Query Connectors (preview)

Connect to data on other cloud platforms using indexers and a Power Query connector as the data source. [Sign up](https://aka.ms/azure-cognitive-search/indexer-preview) to get started.

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

Connect to [Elasticsearch](https://www.elastic.co/elasticsearch) in the cloud and extract searchable content for indexing in Cognitive Search.

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

Data source connectors are also provided by third-party Microsoft partners. See our [Terms of Use statement](search-data-sources-terms-of-use.md) and check the partner licensing and usage instructions before using a data source.

:::row:::
:::column span="":::

---

### Adobe AEM

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from the Adobe Active Experience Manager (AEM) and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, attachments and other generated document types from Adobe AEM in near real time. The connector fully supports Adobe AEM’s permission model, its built-in user and group management, as well as AEM installations based on Active Directory or other directory services.

[More details](https://www.raytion.com/connectors/adobe-experience-manager-aem)

:::column-end:::
:::column span="":::

---

### Alfresco

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Alfresco One and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files, folders and user profiles from Alfresco One in near real time. The connector fully supports Alfresco One’s permission model, its built-in user and group management, as well as Alfresco One installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-alfresco-connector)

:::column-end:::
:::column span="":::

---

### Azure AD

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Microsoft Azure Active Directory (Azure AD) and intelligently searching it with Microsoft Azure Cognitive Search. It indexes objects from Azure AD via the Microsoft Graph API. The connector can be used for ingesting principals into Microsoft Graph in near real time to implement use cases like expert search, equipment search, and location search or to provide early-binding security trimming in conjunction with custom data sources. The connector supports federated authentication against Microsoft 365.

[More details](https://www.raytion.com/connectors/raytion-azure-ad-connector)

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

### Box

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Box and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files, folders, comments, users, groups, and tasks from Box in near real time. The connector fully supports Box’ built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-box-connector)

:::column-end:::
:::column span="":::

---

### Confluence Cloud

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Atlassian Confluence Cloud and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, blog posts, attachments, comments, spaces, profiles, and hub sites for tags from Confluence Cloud instances in near real time. The connector fully supports Atlassian Confluence Cloud’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-confluence-cloud-connector)

:::column-end:::
:::column span="":::

---

### Confluence

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Atlassian Confluence and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, blog posts, attachments, comments, spaces, profiles, and hub sites for tags from on-premise Confluence instances in near real time. The connector fully supports Atlassian Confluence’s built-in user and group management, as well as Confluence installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-confluence-connector)

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

### Documentum

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from OpenText Documentum and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes repositories, folders and files together with their meta data and properties from Documentum in near real time. The connector fully supports OpenText Documentum’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-documentum-connector)

:::column-end:::
:::column span="":::

---

### Facebook Workplace

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Facebook Workplace and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes project groups, conversations and shared documents from Facebook Workplace in near real time. The connector fully supports Facebook Workplace’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-facebook-workplace-connector)

:::column-end:::
:::column span="":::

---

### File System

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from locally mounted file systems and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files and folders from file systems in near real time.

[More details](https://www.raytion.com/connectors/raytion-file-system-connector)

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

### FirstSpirit

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from e-Spirit FirstSpirit and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, attachments and other generated document types from FirstSpirit in near real time. The connector fully supports e-Spirit FirstSpirit’s built-in user, group and permission management, as well as FirstSpirit installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-firstspirit-connector)

:::column-end:::
:::column span="":::

---

### GitLab

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from GitLab and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes projects, files, folders, commit messages, issues, and wiki pages from GitLab in near real time. The connector fully supports GitLab’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-gitlab-connector)

:::column-end:::
:::column span="":::

---

### Google Drive

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Google Drive and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files, folders, and comments on personal drives and team drives from Google Drive in near real time. The connector fully supports Google Drive’s built-in permission model and the user and group management by the Google Admin Directory.

[More details](https://www.raytion.com/connectors/raytion-google-drive-connector)

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

### IBM Connections Cloud

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from IBM Connections Cloud and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes public and personal files, blogs, wikis, forums, communities, profiles, and status updates from Connections Cloud in near real time. The connector fully supports IBM Connections Cloud’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-ibm-connections-cloud-connector)

:::column-end:::
:::column span="":::

---

### IBM Connections

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from IBM Connections and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes public and personal files, blogs, wikis, forums, communities, bookmarks, profiles, and status updates from on-premises Connections instances in near real time. The connector fully supports IBM Connection’s built-in user and group management, as well as Connections installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-ibm-connections-connector)

:::column-end:::
:::column span="":::

---

### Jira Cloud

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Atlassian Jira Cloud and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes projects, issues, attachments, comments, work logs, issue histories, links and profiles from Jira Cloud in near real time. The connector fully supports Atlassian Jira Cloud’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-jira-cloud-connector)

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

### Jira

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Atlassian Jira and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes projects, issues, attachments, comments, work logs, issue histories, links, and profiles from on-premise Jira instances in near real time. The connector fully supports Atlassian Jira’s built-in user and group management, as well as Jira installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-jira-connector)

:::column-end:::
:::column span="":::

---

### Jive

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Jive and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes discussions, polls, files, blogs, spaces, groups, projects, tasks, videos, messages, ideas, profiles, and status updates from on-premise and cloud-hosted Jive instances in near real time. The connector fully supports Jive’s built-in user and group management and supports Jive’s native authentication models, OAuth and Basic authentication.

[More details](https://www.raytion.com/connectors/raytion-jive-connector)

:::column-end:::
:::column span="":::

---

### LDAP

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from directory services compatible with the Lightweight Directory Access Protocol (LDAP) and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes LDAP objects from Active Directory, Novell E-Directory and other LDAP-compatible directory services in near real time. The connector can be used for ingesting principals into Google Cloud Search for use cases like expert, equipment and location searches or for implementing security trimming for custom data sources. The connector supports LDAP over SSL.

[More details](https://www.raytion.com/connectors/raytion-ldap-connector)

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

### MediaWiki

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from MediaWiki and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, discussion pages, and attachments from MediaWiki instances in near real time. The connector fully supports MediaWiki’s built-in permission model, as well as MediaWiki installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-mediawiki-connector)

:::column-end:::
:::column span="":::

---

### Microsoft Windows File Server

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Microsoft Windows File Server including its Distributed File System (DFS) and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files and folders from Windows File Server in near real time. The connector fully supports Microsoft Windows File Server’s document-level security and the latest versions of the SMB2 and SMB3 protocols.

[More details](https://www.raytion.com/connectors/raytion-windows-file-server-connector)

:::column-end:::
:::column span="":::

---

### Notes

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from IBM Notes (formerly Lotus Note) and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes records from a configurable set of Notes databases in near real time. The connector fully supports IBM Notes’ built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-notes-connector)

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

### OpenText Content Server

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from OpenText Content Server and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files, folders, virtual folders, compound documents, news, emails, volumes, collections, classifications, and many more objects from Content Server instances in near real time. The connector fully supports OpenText Content Server’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-opentext-content-server-connector)

:::column-end:::
:::column span="":::

---

### OpenText Documentum eRoom

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from OpenText Documentum eRoom and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes repositories, folders and files together with their meta data and properties from Documentum eRoom in near real time. The connector fully supports OpenText Documentum eRoom’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-opentext-documentum-eroom-connector)

:::column-end:::
:::column span="":::

---

### Oracle KA Cloud

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Oracle Knowledge Advanced (KA) Cloud and intelligently searching it Microsoft Azure Cognitive Search. It robustly indexes pages and attachments from Oracle KA Cloud in near real time. The connector fully supports Oracle KA Cloud’s built-in user and group management. In particular, the connector handles snippet-based permissions within Oracle KA Cloud pages.

[More details](https://www.raytion.com/connectors/raytion-oracle-ka-cloud-connector)

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

### pirobase CMS

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from pirobase CMS and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, attachments, and other generated document types from pirobase CMS in near real time. The connector fully supports pirobase CMS’ built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-pirobase-cms-connector)

:::column-end:::
:::column span="":::

---

### Salesforce

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Salesforce and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes accounts, chatter messages, profiles, leads, cases, and all other record objects from Salesforce in near real time. The connector fully supports Salesforce’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-salesforce-connector)

:::column-end:::
:::column span="":::

---

### SAP NetWeaver Portal

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from the SAP NetWeaver Portal (NWP) and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, attachments, and other document types from SAP NWP, its Knowledge Management and Collaboration (KMC) and Portal Content Directory (PCD) areas in near real time. The connector fully supports SAP NetWeaver Portal’s built-in user and group management, as well as SAP NWP installations based on Active Directory and other directory services.

[More details](https://www.raytion.com/connectors/raytion-sap-netweaver-portal-connector)

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

### SAP PLM DMS

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from SAP PLM DMS and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes documents, attachments, and other records from SAP PLM DMS in near real time.

[More details](https://www.raytion.com/connectors/raytion-sap-plm-dms-connector)

:::column-end:::
:::column span="":::

---

### ServiceNow

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from ServiceNow and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes issues, tasks, attachments, knowledge management articles, pages, among others from ServiceNow in near real time. The connector supports ServiceNow’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-servicenow-connector)

:::column-end:::
:::column span="":::

---

### SharePoint

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Microsoft SharePoint and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes sites, webs, modern (SharePoint 2016 and later) and classic pages, wiki pages, OneNote documents, list items, tasks, calendar items, attachments, and files from SharePoint on-premises instances in near real time. The connector fully supports Microsoft SharePoint’s built-in user and group management, as well as Active Directory and also OAuth providers like SiteMinder and Okta. The connector comes with support for Basic, NTLM and Kerberos authentication.

[More details](https://www.raytion.com/connectors/raytion-sharepoint-connector)

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

### Sitecore

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Sitecore and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes pages, attachments, and further generated document types in near real time. The connector fully supports Sitecore’s permission model and the user and group management in the associated Active Directory.

[More details](https://www.raytion.com/connectors/raytion-sitecore-connector)

:::column-end:::
:::column span="":::

---

### Slack

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Slack and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes messages, threads, and shared files from all public channels from Slack in near real time.

[More details](https://www.raytion.com/connectors/raytion-slack-connector)

:::column-end:::
:::column span="":::

---

### SMB File Share

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from SMB file shares and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files and folders from file shares in near real time. The connector fully supports SMB’s document-level security and the latest versions of the SMB2 and SMB3 protocols.

[More details](https://www.raytion.com/connectors/raytion-smb-file-share-connector)

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

### SQL Database

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from SQL databases, such as Microsoft SQL Server or Oracle, and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes records and fields including binary documents from SQL databases in near real time. The connector supports the implementation of a custom document-level security model.

[More details](https://www.raytion.com/connectors/raytion-sql-database-connector)

:::column-end:::
:::column span="":::

---

### Symantec Enterprise Vault

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Symantec Enterprise Vault and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes archived data, such as e-mails, attachments, files, calendar items and contacts from Enterprise Vault in near real time. The connector fully supports Symantec Enterprise Vault’s authentication models Basic, NTLM and Kerberos authentication.

[More details](https://www.raytion.com/connectors/raytion-symantec-enterprise-vault-connector)

:::column-end:::
:::column span="":::

---

### Veritas Enterprise Vault

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Veritas Enterprise Vault and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes archived data, such as e-mails, attachments, files, calendar items and contacts from Enterprise Vault in near real time. The connector fully supports Veritas Enterprise Vault’s authentication models Basic, NTLM and Kerberos authentication.

[More details](https://www.raytion.com/connectors/raytion-veritas-enterprise-vault-connector)

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

### windream ECM-System

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from windream ECM-System and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes files and folders including the comprehensive sets of metadata associated by windream ECM-System in near real time. The connector fully supports windream ECM-System’s permission model and the user and group management in the associated Active Directory.

[More details](https://www.raytion.com/connectors/raytion-windream-ecm-system-connector)

:::column-end:::
:::column span="":::

---

### Xerox DocuShare

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Xerox DocuShare and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes data repositories, folders, profiles, groups, and files from DocuShare in near real time. The connector fully supports Xerox DocuShare’s built-in user and group management.

[More details](https://www.raytion.com/connectors/raytion-xerox-docushare-connector)

:::column-end:::
:::column span="":::

---

### Yammer

by [Raytion](https://www.raytion.com/contact)

Secure enterprise search connector for reliably indexing content from Microsoft Yammer and intelligently searching it with Microsoft Azure Cognitive Search. It robustly indexes channels, posts, replies, attachments, polls and announcements from Yammer in near real time. The connector fully supports Microsoft Yammer’s built-in user and group management and in particular federated authentication against Microsoft 365.

[More details](https://www.raytion.com/connectors/raytion-yammer-connector)

:::column-end:::
:::row-end:::
:::row:::
:::column span="":::

   :::column-end:::
   :::column span="":::
   :::column-end:::

:::row-end:::