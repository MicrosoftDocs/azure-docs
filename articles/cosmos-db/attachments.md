---
title: Azure Cosmos DB Attachments
description: This article presents an overview of Azure Cosmos DB Attachments. 
author: aliuy
ms.author: andrl
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/07/2020
ms.reviewer: mjbrown
---

# Azure Cosmos DB Attachments
[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Azure Cosmos DB attachments are special items that contain references to an associated metadata with an external blob or media file.

Azure Cosmos DB supports two types of attachments:

* **Unmanaged Attachments** are a wrapper around a URI reference to a blob that is stored in an external service (for example, Azure Storage, OneDrive, etc.). This approach is similar to storing a URI property in a standard Azure Cosmos DB item.
* **Managed Attachments** are blobs managed and stored internally by Azure Cosmos DB and exposed via a system-generated mediaLink.


> [!NOTE]
> Attachments are a legacy feature. Their support is scoped to offer continued functionality if you are already using this feature.
> 
> Instead of using attachments, we recommend you to use Azure Blob Storage as a purpose-built blob storage service to store blob data. You can continue to store metadata related to blobs, along with reference URI links, in Azure Cosmos DB as item properties. Storing this data in Azure Cosmos DB provides the ability to query metadata and links to blobs stored in Azure Blob Storage.
> 
> Microsoft is committed to provide a minimum 36-month notice prior to fully deprecating attachments – which will be announced at a further date.

## Known limitations

Azure Cosmos DB’s managed attachments are distinct from its support for standard items – for which it offers unlimited scalability, global distribution, and integration with other Azure services.

- Attachments aren't supported in all versions of the Azure Cosmos DB SDKs.
- Managed attachments are limited to 2 GB of storage per database account.
- Managed attachments aren't compatible with Azure Cosmos DB’s global distribution, and they aren't replicated across regions.

> [!NOTE]
> Azure Cosmos DB for MongoDB version 3.2 utilizes managed attachments for GridFS and these are subject to the same limitations.
>
> We recommend developers using the MongoDB GridFS feature set to upgrade to Azure Cosmos DB for MongoDB version 3.6 or higher, which is decoupled from attachments and provides a better experience. Alternatively, developers using the MongoDB GridFS feature set should also consider using Azure Blob Storage - which is purpose-built for storing blob content and offers expanded functionality at lower cost compared to GridFS.

## Migrating Attachments to Azure Blob Storage

We recommend migrating Azure Cosmos DB attachments to Azure Blob Storage by following these steps:

1. Copy attachments data from your source Azure Cosmos DB container to your target Azure Blob Storage container.
2. Validate the uploaded blob data in the target Azure Blob Storage container.
3. If applicable, add URI references to the blobs contained in Azure Blob Storage as string properties within your Azure Cosmos DB dataset.
4. Refactor your application code to read and write blobs from the new Azure Blob Storage container.

The following code sample shows how to copy attachments from Azure Cosmos DB to Azure Blob storage as part of a migration flow by using Azure Cosmos DB's .NET SDK v2 and Azure Blob Storage .NET SDK v12. Make sure to replace the `<placeholder values>` for the source Azure Cosmos DB account and target Azure Blob storage container.

```csharp

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace attachments
{
    class Program
    {
        private static string cosmosAccount = "<Your_Azure_Cosmos_account_URI>";
        private static string cosmosKey = "<Your_Azure_Cosmos_account_PRIMARY_KEY>";
        private static string cosmosDatabaseName = "<Your_Azure_Cosmos_database>";
        private static string cosmosCollectionName = "<Your_Azure_Cosmos_collection>";
        private static string storageConnectionString = "<Your_Azure_Storage_connection_string>";
        private static string storageContainerName = "<Your_Azure_Storage_container_name>";
        private static DocumentClient cosmosClient = new DocumentClient(new Uri(cosmosAccount), cosmosKey);
        private static BlobServiceClient storageClient = new BlobServiceClient(storageConnectionString);
        private static BlobContainerClient storageContainerClient = storageClient.GetBlobContainerClient(storageContainerName);

        static void Main(string[] args)
        {
            CopyAttachmentsToBlobsAsync().Wait();
        }

        private async static Task CopyAttachmentsToBlobsAsync()
        {
            Console.WriteLine("Copying Azure Cosmos DB Attachments to Azure Blob Storage ...");

            int totalCount = 0;
            string docContinuation = null;

            // Iterate through each item (document in v2) in the Azure Cosmos DB container (collection in v2) to look for attachments.
            do
            {
                FeedResponse<dynamic> response = await cosmosClient.ReadDocumentFeedAsync(
                    UriFactory.CreateDocumentCollectionUri(cosmosDatabaseName, cosmosCollectionName),
                    new FeedOptions
                    {
                        MaxItemCount = -1,
                        RequestContinuation = docContinuation
                    });
                docContinuation = response.ResponseContinuation;

                foreach (Document document in response)
                {
                    string attachmentContinuation = null;
                    PartitionKey docPartitionKey = new PartitionKey(document.Id);

                    // Iterate through each attachment within the item (if any).
                    do
                    {
                        FeedResponse<Attachment> attachments = await cosmosClient.ReadAttachmentFeedAsync(
                            document.SelfLink,
                            new FeedOptions
                            {
                                PartitionKey = docPartitionKey,
                                RequestContinuation = attachmentContinuation
                            }
                        );
                        attachmentContinuation = attachments.ResponseContinuation;

                        foreach (var attachment in attachments)
                        {
                            // Download the attachment in to local memory.
                            MediaResponse content = await cosmosClient.ReadMediaAsync(attachment.MediaLink);

                            byte[] buffer = new byte[content.ContentLength];
                            await content.Media.ReadAsync(buffer, 0, buffer.Length);

                            // Upload the locally buffered attachment to blob storage
                            string blobId = String.Concat(document.Id, "-", attachment.Id);

                            Azure.Response<BlobContentInfo> uploadedBob = await storageContainerClient.GetBlobClient(blobId).UploadAsync(
                                new MemoryStream(buffer, writable: false),
                                true
                            );

                            Console.WriteLine("Copied attachment ... Item Id: {0} , Attachment Id: {1}, Blob Id: {2}", document.Id, attachment.Id, blobId);
                            totalCount++;

                            // Clean up attachment from Azure Cosmos DB.
                            // Warning: please verify you've succesfully migrated attachments to blog storage prior to cleaning up Azure Cosmos DB.
                            // await cosmosClient.DeleteAttachmentAsync(
                            //     attachment.SelfLink,
                            //     new RequestOptions { PartitionKey = docPartitionKey }
                            // );

                            // Console.WriteLine("Cleaned up attachment ... Document Id: {0} , Attachment Id: {1}", document.Id, attachment.Id);
                        }

                    } while (!string.IsNullOrEmpty(attachmentContinuation));
                }
            }
            while (!string.IsNullOrEmpty(docContinuation));

            Console.WriteLine("Finished copying {0} attachments to blob storage", totalCount);
        }
    }
}

```

## Next steps

- Get started with [Azure Blob storage](../storage/blobs/storage-quickstart-blobs-dotnet.md)
- Get references for using attachments via [Azure Cosmos DB's .NET SDK v2](/dotnet/api/microsoft.azure.documents.attachment)
- Get references for using attachments via [Azure Cosmos DB's Java SDK v2](/java/api/com.microsoft.azure.documentdb.attachment)
- Get references for using attachments via [Azure Cosmos DB's REST API](/rest/api/cosmos-db/attachments)
