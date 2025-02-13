---
title: Troubleshoot the Azure Database for PostgreSQL connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Database for PostgreSQL connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/16/2025
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Azure Database for PostgreSQL connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Database for PostgreSQL connector in Azure Data Factory and Azure Synapse.

## <a name="error-code-azurepostgresqlnpgsqlpartitioncolumnnamenotprovided"></a> Error code: 23704 - AzurePostgreSqlNpgsqlPartitionColumnNameNotProvided

- **Message**: `Partition column name must be specified.`

- **Cause**: No partition column name is provided, and it couldn't be decided automatically.

## <a name="error-code-azurepostgresqlnpgsqldatatypenotsupported"></a> Error code: 23705 - AzurePostgreSqlNpgsqlDataTypeNotSupported

- **Message**: `The data type of the chosen Partition Column, '%partitionColumn;', is '%dataType;' and this data type is not supported for partitioning.`

- **Recommendation**: Pick a partition column with int, bigint, smallint, serial, bigserial, smallserial, timestamp with or without time zone, time without time zone or date data type.

## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
