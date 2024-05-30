---
title: Implement a retry policy using the Azure Storage client library for JavaScript
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client library for JavaScript. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/22/2024
ms.custom: devx-track-js, devguide-js
---

# Implement a retry policy with JavaScript

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

In this article, you learn how to use the Azure Storage client library for JavaScript to configure a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options

Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

The following table lists the parameters available when creating a [StorageRetryOptions](/javascript/api/@azure/storage-blob/storageretryoptions) instance, along with the type, a brief description, and the default value if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `maxRetryDelayInMs` | `number` | Optional. Specifies the maximum delay allowed before retrying an operation. | 120 seconds (or 120 * 1000 ms) |
| `maxTries` | `number` | Optional. The maximum number of retry attempts before giving up. | 4 |
| `retryDelayInMs` | `number` | Optional. Specifies the amount of delay to use before retrying an operation. | 4 seconds (or 4 * 1000 ms) |
| `retryPolicyType` | [StorageRetryPolicyType](/javascript/api/@azure/storage-blob/storageretrypolicytype) | Optional. StorageRetryPolicyType, default is exponential retry policy. | StorageRetryPolicyType.Exponential |
| `secondaryHost` | `string` | Optional. Secondary storage account endpoint to retry requests against. Before setting this value, you should understand the issues around reading stale and potentially inconsistent data. To learn more, see [Use geo-redundancy to design highly available applications](../common/geo-redundant-design.md). | None |
| `tryTimeoutInMs` | `number` | Optional. Maximum time allowed before a request is canceled and assumed failed. This timeout applies to the operation request, and should be based on the bandwidth available to the host machine and proximity to the Storage service. | A value of 0 or undefined results in no default timeout on the client, and the server-side default timeout is used. To learn more, see [Timeouts for Blob service operations](/rest/api/storageservices/setting-timeouts-for-blob-service-operations). |

In the following code example, we configure the retry options in an instance of [StorageRetryOptions](/javascript/api/@azure/storage-blob/storageretryoptions), pass it to a new [StoragePipelineOptions](/javascript/api/@azure/storage-blob/storagepipelineoptions) instance, and pass `pipeline` when instantiating `BlobServiceClient`:

```javascript
const options = {
  retryOptions: {
    maxTries: 4,
    retryDelayInMs: 3 * 1000,
    maxRetryDelayInMs: 120 * 1000,
    retryPolicyType: StorageRetryPolicyType.EXPONENTIAL
  },
};

const pipeline = newPipeline(credential, options);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential,
  pipeline
);
```

In this example, each service request issued from the `BlobServiceClient` object uses the retry options as defined in `retryOptions`. This policy applies to client requests. You can configure various retry strategies for service clients based on the needs of your app.

## Related content

- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
