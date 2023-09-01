---
title: Troubleshoot the Azure Cosmos DB connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Cosmos DB and Azure Cosmos DB for NoSQL connectors in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 04/20/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse, ignite-2022
---

# Troubleshoot the Azure Cosmos DB connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Cosmos DB and Azure Cosmos DB for NoSQL connectors in Azure Data Factory and Azure Synapse.

## Error message: Request size is too large

- **Symptoms**: When you copy data into Azure Cosmos DB with a default write batch size, you receive the following error: `Request size is too large.`

- **Cause**: Azure Cosmos DB limits the size of a single request to 2 MB. The formula is *request size = single document size \* write batch size*. If your document size is large, the default behavior will result in a request size that's too large.

- **Resolution**: <br>
You can tune the write batch size. In the copy activity sink, reduce the *write batch size* value (the default value is 10000). <br>
If reducing the *write batch size* value to 1 still doesn't work, change your Azure Cosmos DB SQL API from V2 to V3. To complete this configuration, you have two options:

     - **Option 1**: Change your authentication type to service principal or system-assigned managed identity or user-assigned managed identity.
     - **Option 2**: If you still want to use account key authentication, follow these steps:
         1. Create an Azure Cosmos DB for NoSQL linked service.
         2. Update the linked service with the following template. 
         
            ```json
            {
              "name": "<CosmosDbV3>",
              "type": "Microsoft.DataFactory/factories/linkedservices",
              "properties": {
                "annotations": [],
                "type": "CosmosDb",
                "typeProperties": {
                  "useV3": true,
                  "accountEndpoint": "<account endpoint>",
                  "database": "<database name>",
                  "accountKey": {
                    "type": "SecureString",
                    "value": "<account key>"
                  }
                }
              }
            }
            ```

## Error message: Unique index constraint violation

- **Symptoms**: When you copy data into Azure Cosmos DB, you receive the following error:

    `Message=Partition range id 0 | Failed to import mini-batch. 
    Exception was Message: {"Errors":["Encountered exception while executing function. Exception = Error: {\"Errors\":[\"Unique index constraint violation.\"]}...`

- **Cause**: There are two possible causes:

    - Cause 1: If you use **Insert** as the write behavior, this error means that your source data has rows or objects with same ID.
    - Cause 2: If you use **Upsert** as the write behavior and you set another unique key to the container, this error means that your source data has rows or objects with different IDs but the same value for the defined unique key.

- **Resolution**: 

    - For cause 1, set **Upsert** as the write behavior.
    - For cause 2, make sure that each document has a different value for the defined unique key.

## Error message: Request rate is large

- **Symptoms**: When you copy data into Azure Cosmos DB, you receive the following error:

    `Type=Microsoft.Azure.Documents.DocumentClientException,
    Message=Message: {"Errors":["Request rate is large"]}`

- **Cause**: The number of used request units (RUs) is greater than the available RUs configured in Azure Cosmos DB. To learn how
Azure Cosmos DB calculates RUs, see [Request units in Azure Cosmos DB](../cosmos-db/request-units.md#request-unit-considerations).

- **Resolution**: Try either of the following two solutions:

    - Increase the *container RUs* number to a greater value in Azure Cosmos DB. This solution will improve the copy activity performance, but it will incur more cost in Azure Cosmos DB. 
    - Decrease *writeBatchSize* to a lesser value, such as 1000, and decrease *parallelCopies* to a lesser value, such as 1. This solution will reduce copy run performance, but it won't incur more cost in Azure Cosmos DB.

## Columns missing in column mapping

- **Symptoms**: When you import a schema for Azure Cosmos DB for column mapping, some columns are missing. 

- **Cause**: Azure Data Factory and Synapse pipelines infer the schema from the first 10 Azure Cosmos DB documents. If some document columns or properties don't contain values, the schema isn't detected and consequently isn't displayed.

- **Resolution**: You can tune the query as shown in the following code to force the column values to be displayed in the result set with empty values. Assume that the *impossible* column is missing in the first 10 documents). Alternatively, you can manually add the column for mapping.

    ```sql
    select c.company, c.category, c.comments, (c.impossible??'') as impossible from c
    ```

## Error message: The GuidRepresentation for the reader is CSharpLegacy

- **Symptoms**: When you copy data from Azure Cosmos DB MongoAPI or MongoDB with the universally unique identifier (UUID) field, you receive the following error:

    `Failed to read data via MongoDB client., 
    Source=Microsoft.DataTransfer.Runtime.MongoDbV2Connector,Type=System.FormatException, 
    Message=The GuidRepresentation for the reader is CSharpLegacy which requires the binary sub type to be UuidLegacy not UuidStandard.,Source=MongoDB.Bson,’“,`

- **Cause**: There are two ways to represent the UUID in Binary JSON (BSON): UuidStardard and UuidLegacy. By default, UuidLegacy is used to read data. You will receive an error if your UUID data in MongoDB is UuidStandard.

- **Resolution**: In the MongoDB connection string, add the *uuidRepresentation=standard* option. For more information, see [MongoDB connection string](connector-mongodb.md#linked-service-properties).

## Error code: CosmosDbSqlApiOperationFailed

- **Message**: `CosmosDbSqlApi operation Failed. ErrorMessage: %msg;.`

- **Cause**: A problem with the CosmosDbSqlApi operation.  This applies to the Azure Cosmos DB for NoSQL connector specifically.

- **Recommendation**:  To check the error details, see [Azure Cosmos DB help document](../cosmos-db/troubleshoot-dot-net-sdk.md). For further help, contact the Azure Cosmos DB team.

## Error code: CosmosDbSqlApiPartitionKeyExceedStorage

- **Message**: `The size of data each logical partition can store is limited, current partitioning design and workload failed to store more than the allowed amount of data for a given partition key value.`

- **Cause**: The data size of each logical partition is limited, and the partition key reached the maximum size of your logical partition.

- **Recommendation**: Check your Azure Cosmos DB partition design. For more information, see [Logical partitions](../cosmos-db/partitioning-overview.md#logical-partitions).

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
