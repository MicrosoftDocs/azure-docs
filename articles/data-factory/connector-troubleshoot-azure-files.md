---
title: Troubleshoot the Azure Files connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Files connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 10/23/2022
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Azure Files connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Files connector in Azure Data Factory and Azure Synapse.

## Error code: AzureFileOperationFailed

- **Message**: `Azure File operation Failed. Path: %path;. ErrorMessage: %msg;.`

- **Cause**: A problem with the Azure Files storage operation.

- **Recommendation**:  To check the error details, see [Azure Files help](/rest/api/storageservices/file-service-error-codes). For further help, contact the Azure Files team.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
