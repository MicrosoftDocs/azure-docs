---
title: Troubleshoot the MongoDB connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the MongoDB connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 05/15/2024
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the MongoDB connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the MongoDB connector in Azure Data Factory and Azure Synapse.

## Error code: MongoDbUnsupportedUuidType

- **Message**:
    `Failed to read data via MongoDB client.,
    Source=Microsoft.DataTransfer.Runtime.MongoDbV2Connector,Type=System.FormatException,
    Message=The GuidRepresentation for the reader is CSharpLegacy which requires the binary sub type to be UuidLegacy not UuidStandard.,Source=MongoDB.Bson,’“,`

- **Cause**: When you copy data from Azure Cosmos DB MongoAPI or MongoDB with the universally unique identifier (UUID) field, there are two ways to represent the UUID in Binary JSON (BSON): UuidStandard and UuidLegacy. By default, UuidLegacy is used to read data. You will receive an error if your UUID data in MongoDB is UuidStandard.

- **Resolution**: In the MongoDB connection string, add the *uuidRepresentation=standard* option. For more information, see [MongoDB connection string](connector-mongodb.md#linked-service-properties).

## Migrate to the new version of MongoDB connector

- **Symptoms**: You meet the following error code and error message:
    - **Error code**: `DeprecatedMongoDbOdbcConnector`
    - **Error message**: `The legacy MongoDB connector has been deprecated. To ensure your pipeline works, please create a new MongoDB linked service. Detailed instructions can be found in this documentation: https://learn.microsoft.com/azure/data-factory/connector-mongodb#upgrade-the-mongodb-linked-service`

- **Cause**: 
    Your pipeline is still running on a legacy MongoDB connector that causes the error. 

- **Resolution**: 
    Upgrade your MongoDB linked service to the latest version. Refer to this [article](connector-mongodb.md#upgrade-the-mongodb-linked-service).

## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)