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

## July 2023

### Change Data Capture

Top-level CDC resource now supports schema evolution. [Learn more](how-to-change-data-capture-resource-with-schema-evolution.md)

### Data flow

Merge schema option in delta sink now supports schema evolution in Mapping Data Flows. [Learn more](format-delta.md#delta-sink-optimization-options)

### Data movement

- Comment Out Part of Pipeline with Deactivation. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/comment-out-part-of-pipeline/ba-p/3868069)
- Pipeline return value is now generally available. [Learn more](tutorial-pipeline-return-value.md)

### Developer productivity

Documentation search now included in the Azure Data Factory search toolbar. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/documentation-search-now-embedded-in-azure-data-factory/ba-p/3873890)

## June 2023

### Continuous integration and continuous deployment

npm package now supports pre-downloaded bundle for building ARM templates. If your firewall setting is blocking direct download for your npm package, you can now pre-load the package upfront, and let npm package consume local version instead. This is a super boost for your CI/CD pipeline in a firewalled environment.

### Region expansion

Azure Data Factory is now available in Sweden Central. You can co-locate your ETL workflow in this new region if you are utilizing the region for storing and managing your modern data warehouse. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/continued-region-expansion-azure-data-factory-just-became/ba-p/3857249)

### Data movement

Securing outbound traffic with Azure Data Factory's outbound network rules is now supported. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/securing-outbound-traffic-with-azure-data-factory-s-outbound/ba-p/3844032)

### Connectors

The Amazon S3 connector is now supported as a sink destination using Mapping Data Flows. [Learn more](connector-amazon-simple-storage-service.md)

### Data flow

We introduce optional Source settings for DelimitedText and JSON sources in top-level CDC resource. The top-level CDC resource in data factory now supports optional source configurations for Delimited and JSON sources. You can now select the column/row delimiters for delimited sources and set the document type for JSON sources. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-optional-source-settings-for-delimitedtext-and-json/ba-p/3824274)

## May 2023

### Data Factory in Microsoft Fabric

[Data factory in Microsoft Fabric](/fabric/data-factory/) provides cloud-scale data movement and data transformation services that allow you to solve the most complex data factory and ETL scenarios. It's intended to make your data factory experience easy to use, powerful, and truly enterprise-grade.

## April 2023

### Data flow

Easily unroll multiple arrays in ADF data flows. ADF updated the **Flatten** transformation that now makes it super easy to unroll multiple arrays from a single **Flatten** transformation step. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/unroll-multiple-arrays-in-a-single-flatten-step-in-adf/ba-p/3802457)

### Continuous integration and continuous deployment

You can customize the commit message in Git mode now. Type in a detailed description about the changes you make, and we will save it to Git repository.

### Connectors

The Azure Blob Storage connector now supports anonymous authentication. [Learn more](connector-azure-blob-storage.md#anonymous-authentication)

## More information

- [What's new archive](whats-new-archive.md)
- [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv)
- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)
