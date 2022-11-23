---
title: Troubleshoot the file system connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the file system connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 11/23/2022
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the file system connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the file system connector in Azure Data Factory and Azure Synapse.

## Error code: AccessToOnPremFileSystemDenied

- **Message**: `Access to '%path;' is not allowed.`

- **Cause**: To be compliant with security best practice, access to local file system in an on-premises scenario is not supported.

- **Recommendation**: To opt out the security feature, please leverage [self-hosted integration runtime command line](create-self-hosted-integration-runtime.md#set-up-an-existing-self-hosted-ir-via-local-powershell).


## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)