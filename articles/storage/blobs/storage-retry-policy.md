---
title: Implement a retry policy using the Azure Storage client library for .NET
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client library for .NET. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 12/14/2022
ms.custom: devx-track-dotnet
---

# Implement a retry policy with the Azure Storage client library for .NET

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

This article shows you how to use the Azure Storage client library for .NET to set up a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options
Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

The following table lists the properties of the [RetryOptions](/dotnet/api/azure.core.retryoptions) class, along with the type, a brief description, and the default value if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| [Delay](/dotnet/api/azure.core.retryoptions.delay) | [TimeSpan](/dotnet/api/system.timespan) | The delay between retry attempts for a fixed approach or the delay on which to base calculations for a backoff-based approach. If the service provides a Retry-After response header, the next retry will be delayed by the duration specified by the header value. | 0.8 second |
| [MaxDelay](/dotnet/api/azure.core.retryoptions.maxdelay) | [TimeSpan](/dotnet/api/system.timespan) | The maximum permissible delay between retry attempts when the service doesn't provide a Retry-After response header. If the service provides a Retry-After response header, the next retry will be delayed by the duration specified by the header value. | 1 minute |
| [MaxRetries](/dotnet/api/azure.core.retryoptions.maxretries) | int | The maximum number of retry attempts before giving up. | 5 |
| [Mode](/dotnet/api/azure.core.retryoptions.mode) | [RetryMode](/dotnet/api/azure.core.retrymode) | The approach to use for calculating retry delays. | Exponential |
| [NetworkTimeout](/dotnet/api/azure.core.retryoptions.networktimeout) | [TimeSpan](/dotnet/api/system.timespan) | The timeout applied to an individual network operation. | 100 seconds |

In this code example for blob storage, we'll configure the retry options in the `Retry` property of the [BlobClientOptions](/dotnet/api/azure.storage.blobs.blobclientoptions) class. Then, we'll create a client object for the blob service using the retry options.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptions":::

In this example, each service request issued from the `BlobServiceClient` object will use the retry options as defined in the `BlobClientOptions` object. You can configure various retry strategies for service clients based on the needs of your app.

## Use geo-redundancy to improve app resiliency
If your app requires high availability and greater resiliency against failures, you can leverage Azure Storage geo-redundancy options as part of your retry policy. Storage accounts configured for geo-redundant replication are synchronously replicated in the primary region, and asynchronously replicated to a secondary region that is hundreds of miles away.

Azure Storage offers two options for geo-redundant replication: [Geo-redundant storage (GRS)](../common/storage-redundancy.md#geo-redundant-storage) and [Geo-zone-redundant storage (GZRS)](../common/storage-redundancy.md#geo-zone-redundant-storage). In addition to enabling geo-redundancy for your storage account, you also need to configure read access to the data in the secondary region. To learn how to change replication options for your storage account, see [Change how a storage account is replicated](../common/redundancy-migration.md).

In this example, we set the `GeoRedundantSecondaryUri` property in `BlobClientOptions`. When this property is set and a read request failure occurs in the primary region, the app will seamlessly switch to perform retries against the secondary region endpoint. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptionsGRS" highlight="20":::

Apps that make use of geo-redundancy need to keep in mind some specific design considerations. To learn more, see [Use geo-redundancy to design highly available applications](../common/geo-redundant-design.md).

## Next steps
Now that you understand how to implement a retry policy using the Azure Storage client library for .NET, see the following articles for more detailed architectural guidance:
- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
