---
title: Implement a retry policy for Azure Storage services
description: Learn about retry policies and how to implement them for Azure Storage services. This article helps you set up a retry policy for blob storage requests using the .NET v12 SDK. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: storage
ms.topic: how-to
ms.date: 08/23/2022
ms.custom: template-how-to
---

# Implement a retry policy for Azure Storage services

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for cloud applications and services to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

This article shows you how to set up a basic retry strategy for an application that connects to Azure blob storage. This strategy is one element to consider as part of a broader retry policy for your application.

<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Configure retry options
Retry policies for Azure storage services are configured programmatically, offering control over how retry options are applied to various services and scenarios. It's important to note that any retry policy should be tuned to match the business requirements of the application and that nature of the failure.

In this example for blob storage, we'll define the retry options in the `Retry` property of the `BlobClientOptions` class.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptions":::

Next, we'll create a client object for the blob service with the retry options defined above.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptionsCreateClient":::

This method of instantiating `blobServiceClient` means that each service request issued from the client will use the retry options as defined in the parameter `blobOptions`. You can configure various retry strategies and service clients based on the needs of your app.

## Use geo-redundancy to improve app resiliency
If your app requires high availability and greater resiliency against failures, you can leverage Azure Storage geo-redundancy options. Storage accounts configured for geo-redundant replication are synchronously replicated in the primary region, and asynchronously replicated to a secondary region that is hundreds of miles away.

Azure Storage offers two options for geo-redundant replication: [Geo-redundant storage (GRS)](storage-redundancy.md#geo-redundant-storage) and [Geo-zone-redundant storage (GZRS)](storage-redundancy.md#geo-zone-redundant-storage). To make use of geo-redundancy options in your app, make sure that your storage account is configured for read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If it's not, you can learn more about how to [change your storage account replication type](redundancy-migration.md).

In this example, we set the `GeoRedundantSecondaryUri` property in `BlobClientOptions`. When this property is set, read request failures in the primary region will seamlessly switch to perform retries against the secondary region endpoint. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptionsGRS":::

Next, we'll create a client object for the blob service with the options defined in `blobOptionsGRS`.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Retry.cs" id="Snippet_RetryOptionsCreateClientGRS":::

## Remarks
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Next steps

- For architectural guidance and general best practices around retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
