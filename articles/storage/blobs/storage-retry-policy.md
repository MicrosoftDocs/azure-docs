---
title: Implement a retry policy for Azure Storage services
description: Learn about retry policies and how to implement them for Azure Storage services. This article helps you set up a retry policy for blob storage requests using the .NET v12 SDK. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: storage
ms.topic: how-to
ms.date: 09/16/2022
ms.custom: template-how-to
---

# Implement a retry policy for Azure Storage services

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

This article shows you how to use .NET client libraries to set up a retry policy for an application that connects to Azure blob storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

> [!NOTE]
> The examples in this article assume that you're working with an existing app or that you've created a sample console app using the guidance in the [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md) article.

## Configure retry options
Retry policies for Azure storage services are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

In this example for blob storage, we'll configure the retry options in the `Retry` property of the [BlobClientOptions](/dotnet/api/azure.storage.blobs.blobclientoptions) class. Then, we'll create a client object for the blob service using the retry options.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptions":::

In the code above, each service request issued from `blobServiceClient` will use the retry options as defined in `blobOptions`. You can configure various retry strategies for service clients based on the needs of your app.

## Use geo-redundancy to improve app resiliency
If your app requires high availability and greater resiliency against failures, you can leverage Azure Storage geo-redundancy options as part of your retry policy. Storage accounts configured for geo-redundant replication are synchronously replicated in the primary region, and asynchronously replicated to a secondary region that is hundreds of miles away.

Azure Storage offers two options for geo-redundant replication: [Geo-redundant storage (GRS)](storage-redundancy.md#geo-redundant-storage) and [Geo-zone-redundant storage (GZRS)](storage-redundancy.md#geo-zone-redundant-storage). To make use of geo-redundancy options in your app, make sure that your storage account is configured for read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If it's not, you can learn more about how to [change your storage account replication type](redundancy-migration.md).

In this example, we set the `GeoRedundantSecondaryUri` property in `BlobClientOptions`. When this property is set, read request failures in the primary region will seamlessly switch to perform retries against the secondary region endpoint. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptionsGRS" highlight="20":::

Apps that use geo-redundant storage To learn more about design considerations when using geo-redundancy, see [Use geo-redundancy to design highly available applications](../common/geo-redundant-design.md).

## Next steps

- For architectural guidance and general best practices around retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
