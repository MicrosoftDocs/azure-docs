---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Data Factory is a managed cloud service that's built for complex hybrid extract-transform-and-load (ETL), extract-load-and-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: references_regions
ms.date: 01/21/2022
---

# What's new in Azure Data Factory

Azure Data Factory is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases.
- Known issues.
- Bug fixes.
- Deprecated functionality.
- Plans for changes.

This page is updated monthly, so revisit it regularly.  For older months' updates refer to the [What's new archive](whats-new-archive.md).

Check out our [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv) for all of our monthly update videos.

## August 2022

### Data flow
- Appfigures connector added as Source (Preview) [Doc](connector-appfigures.md)
- Cast transformation added – visually convert data types [Doc](data-flow-cast.md)
- New UI for inline datasets - categories added to easily find data sources [Doc](data-flow-source.md#inline-datasets)

### Data movement
Service principal authentication type added for Azure Blob storage [Doc](connector-azure-blob-storage.md?tabs=data-factory#service-principal-authentication)

### Developer productivity
- Default activity time-out changed from 7 days to 12 hours [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-changing-default-pipeline-activity-timeout/ba-p/3598729)
- New data factory creation experience - 1 click to have your factory ready within seconds [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/new-experience-for-creating-data-factory-within-seconds/ba-p/3561249)
- Expression builder UI update – categorical tabs added for easier use [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/coming-soon-to-adf-more-pipeline-expression-builder-ease-of-use/ba-p/3567196)

### Continuous integration and continuous delivery (CI/CD)
When CI/CD integrating ARM template, instead of turning off all triggers, it can exclude triggers that did not change in deployment [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvements-related-to-pipeline-triggers-deployment/ba-p/3605064)

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=KCJ2F6Y_nfo&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=5]

## July 2022

### Data flow

- Asana connector added as source. [Doc](connector-asana.md)
- 3 new data transformation functions now supported. [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/3-new-data-transformation-functions-in-adf/ba-p/3582738)
   - collectUnique() - Create a new collection of unique values in an array.
   - substringIndex() - Extract the substring before n occurrences of a delimiter.
   - topN() - Return the top n results after sorting your data.
- Refetch from source available in Refresh for data source change scenarios. [Doc](concepts-data-flow-debug-mode.md#data-preview)
- User defined functions (GA) - Create reusable and customized expressions to avoid building complex logic over and over. [Doc](concepts-data-flow-udf.md) [Video](https://www.youtube.com/watch?v=ZFTVoe8eeOc&t=170s)
- Easier configuration on data flow runtime - choose compute size among Small, Medium and Large to pre-configure all integration runtime settings. [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-makes-it-easy-to-select-azure-ir-size-for-data-flows/ba-p/3578033)

### Continuous integration and continuous delivery (CI/CD)

Include Global parameters supported in ARM template. [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvement-using-global-parameters-in-azure-data-factory/ba-p/3557265#M665)
### Developer productivity

Be a part of Azure Data Factory studio preview features - Experience the latest Azure Data Factory capabilities and be the first to share your feedback. [Blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-azure-data-factory-studio-preview-experience/ba-p/3563880)

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=EOVVt4qYvZI&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=4]

## More information

- [What's new archive](whats-new-archive.md)
- [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv)
- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)
