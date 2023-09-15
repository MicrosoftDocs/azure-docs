---
title: Troubleshoot the Azure Data Explorer connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Data Explorer connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 07/20/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Azure Data Explorer connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Data Explorer connector in Azure Data Factory and Azure Synapse.

## Error code: KustoMappingReferenceHasWrongKind

- **Message**: `Mapping reference should be of kind 'Csv'. Mapping reference: '%reference;'. Kind '%kind;'.`

- **Cause**: The ingestion mapping reference is not CSV type.

- **Recommendation**: Create a CSV ingestion mapping reference.

## Error code: KustoWriteFailed

- **Message**: `Write to Kusto failed with following error: '%message;'.`

- **Cause**: Wrong configuration or transient errors when the sink reads data from the source.

- **Recommendation**: For transient failures, set retries for the activity. For permanent failures, check your configuration and contact support.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
