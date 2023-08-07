---
title: Troubleshoot the DB2 connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the DB2 connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/20/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the DB2 connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Database for PostgreSQL connector in Azure Data Factory and Azure Synapse.

## Error code: DB2DriverRunFailed

- **Message**: `Error thrown from driver. Sql code: '%code;'`

- **Cause**: If the error message contains the string "SQLSTATE=51002 SQLCODE=-805", follow the "Tip" in [Copy data from DB2](./connector-db2.md#linked-service-properties).

- **Recommendation**:  Try to set "NULLID" in the `packageCollection`  property.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
