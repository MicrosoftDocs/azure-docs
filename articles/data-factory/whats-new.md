---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Data Factory is a managed cloud service that's built for complex hybrid extract-transform-and-load (ETL), extract-load-and-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: references_regions
ms.date: 10/11/2023
---

# What's new in Azure Data Factory

Azure Data Factory is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases.
- Known issues.
- Bug fixes.
- Deprecated functionality.
- Plans for changes.

This page is updated monthly, so revisit it regularly.  For older months' updates, refer to the [What's new archive](whats-new-archive.md).

Check out our [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv) for all of our monthly update videos.

## April 2024

### Data flow

We're updating Azure Data Factory Mapping Data Flows to use Spark 3.3.

### Data movement

Pipeline activity limit lifted to 80 activities. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-factory-increases-maximum-activities-per-pipeline-to-80/ba-p/4096418)

## March 2024

### Data movement

- PostgreSQL Connector available for Copy activity with improved native PostgreSQL support and better copy performance. [Learn more](connector-postgresql.md) 
- Google BigQuery Connector available for Copy activity with improved native support and better copy performance. [Learn more](connector-google-bigquery.md)
- Snowflake Connector available for Copy activity with support for Basic and Key pair authentication for both source and sink. [Learn more](connector-snowflake.md)
- New connectors available for Microsoft Fabric Warehouse, for Copy, Lookup, Get Metadata, Script and Stored procedure activities. [Learn more](connector-microsoft-fabric-warehouse.md)

## February 2024

### Data movement

- Mysql Connector driver upgrade available for Copy activity. [Learn more](connector-mysql.md)
- MariaDB Connector driver upgrade available for Copy activity. [Learn more](connector-mariadb.md)
- We added native UI support of parameterization for the following linked services: SAP HANA; MariaDB; Google BigQuery. [Learn more](parameterize-linked-services.md#supported-linked-service-types)

## January 2024

### Data movement

- The new Salesforce connector now supports OAuth authentication on Bulk API 2.0 for both source and sink. [Learn more](connector-salesforce.md)
- The new Salesforce Service Cloud connector now supports OAuth authentication on Bulk API 2.0 for both source and sink. [Learn more](connector-salesforce-service-cloud.md) 
- The Google Ads connector now supports upgrading to the newer driver version with the native Google Ads Query Language (GAQL). [Learn more](connector-google-adwords.md#upgrade-the-google-ads-driver-version) 

### Region expansion 

Azure Data Factory is now available in Israel Central and Italy North. You can co-locate your ETL workflow in this new region if you are utilizing the region for storing and managing your modern data warehouse. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/continued-region-expansion-azure-data-factory-is-generally/ba-p/4029391) 

## November 2023

### Continuous integration and continuous deployment

Azure Data Factory now supports Azure DevOps Server 2022 for Git integration, including on-premises ADO server. [Learn more](source-control.md)

## October 2023

### Data movement

General Availability of Time to Live (TTL) for Managed Virtual Network [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/general-availability-of-time-to-live-ttl-for-managed-virtual/ba-p/3922218)

### Region expansion

Azure Data Factory is generally available in Poland Central [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/continued-region-expansion-azure-data-factory-is-generally/ba-p/3965769)

## September 2023

### Pipelines

Added support for metadata driven pipelines for dynamic full and incremental processing in Azure SQL [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/metadata-driven-pipelines-for-dynamic-full-and-incremental/ba-p/3925362)

## August 2023

### Change Data Capture

- Azure Synapse Analytics target availability in top-level CDC resource [Learn more](concepts-change-data-capture-resource.md#azure-synapse-analytics-as-target)
- Snowflake connector in Mapping Data Flows support for Change Data Capture in public preview [Learn more](connector-snowflake.md?tabs=data-factory#mapping-data-flow-properties)

### Data flow

- Integer type available for pipeline variables [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/integer-type-available-for-pipeline-variables/ba-p/3902472)
- Snowflake CDC source connector available in top-level CDC resource [Learn more](concepts-change-data-capture-resource.md)
- Native UI support of parameterization for more linked services [Learn more](parameterize-linked-services.md?tabs=data-factory#supported-linked-service-types)

### Data movement

- Managed private endpoints support for Application Gateway and MySQL Flexible Server [Learn more](managed-virtual-network-private-endpoint.md#time-to-live)
- Managed virtual network time-to-live (TTL) general availability [Learn more](managed-virtual-network-private-endpoint.md#time-to-live)

### Integration runtime

Self-hosted integration runtime now supports self-contained interactive authoring (Preview) [Learn more](create-self-hosted-integration-runtime.md?tabs=data-factory#self-contained-interactive-authoring-preview)

## Related content

- [What's new archive](whats-new-archive.md)
- [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv)
- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)
