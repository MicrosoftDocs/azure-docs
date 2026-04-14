---
title: Troubleshoot the Microsoft Fabric Lakehouse connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Microsoft Fabric Lakehouse connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 12/16/2025
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Microsoft Fabric Lakehouse connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Microsoft Fabric Lakehouse connector in Azure Data Factory and Azure Synapse.

## Error code: LakehouseForbiddenError

- **Message**: `ErrorCode=LakehouseForbiddenError,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Lakehouse failed for forbidden which may be caused by user account or service principal doesn't have enough permission to access Lakehouse. Workspace: '4137113f-8f02-4c59-9a33-ec9d6f0f1468'. Path: '606c4b64-92ad-4621-b116-a9a871ac099d/Tables/dbo'. ErrorCode: 'Forbidden'. Message: 'Forbidden'. TimeStamp: 'Tue, 04 Nov 2025 11:57:11 GMT'.`

- **Cause**: The service principal, system-assigned managed identity or user-assigned managed identity doesn't have sufficient permission to access Microsoft Fabric Lakehouse.

- **Recommendation**: Grant the service principal, system-assigned managed identity or user-assigned managed identity at least Contributor role in the Microsoft Fabric workspace with the Lakehouse. For more information, see [Grant permissions in Microsoft Fabric workspace](connector-microsoft-fabric-lakehouse.md#grant-permissions-in-microsoft-fabric-workspace).

## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](/shows/data-exposed/?products=azure&terms=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)