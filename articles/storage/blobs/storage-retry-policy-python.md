---
title: Implement a retry policy using the Azure Storage client library for Python
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client library for Python. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/08/2024
ms.custom: devx-track-python, devguide-python
---

# Implement a retry policy with Python

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

This article shows you how to use the Azure Storage client library for Python to set up a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options
Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

The following sections show the properties of the [ExponentialRetry](/dotnet/api/azure.core.retryoptions) and [LinearRetry](/dotnet/api/azure.core.retryoptions) classes, along with the type, a brief description, default values, and a code example. You should be proactive in tuning the values of these properties to meet the needs of your app.

#### Exponential backoff

An exponential backoff strategy increases the backoff interval between each retry attempt. The following table shows the properties of the [ExponentialRetry](/python/api/azure-storage-blob/azure.storage.blob.exponentialretry) class:

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `initial_backoff` | int | The initial backoff interval, in seconds, for the first retry. | 15 seconds |
| `increment_base` | int | The base, in seconds, to increment the initial_backoff by after the first retry. | 3 seconds |
| `max_attempts` | int | The maximum number of retry attempts. |  |
| `retry_to_secondary` | bool | Whether the request should be retried to the secondary endpoint, if able. Only use this option for storage accounts with geo-redundant replication enabled, such as RA-GRS or RA-GZRS. You should also ensure your app can handle potentially stale data. | `False` |
| `random_jitter_range` | int | A number in seconds which indicates a range to jitter/randomize for the backoff interval. For example, setting `random_jitter_range` to 3 means that a backoff interval of x can vary between x+3 and x-3. | 3 seconds |
| `retry_total` | int |  | 3 |

In the following code example, we configure the retry options in the `ExponentialRetry` class. Then, we create a client object for the blob service using the retry options.

:::code language="python" source="~/azure-storage-snippets/blobs\howto\python\blob-devguide-py\blob_devguide_retry.py" id="Snippet_retry_exponential":::

In this example, each service request issued from the `BlobServiceClient` object uses the retry options defined in the `ExponentialRetry` object. You can configure various retry strategies for service clients based on the needs of your app.

#### Linear retry

A linear retry strategy increases the backoff interval by a fixed amount for each retry attempt. The following table shows the properties of the [LinearRetry](/python/api/azure-storage-blob/azure.storage.blob.linearretry) class:

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `backoff` | int | The backoff interval, in seconds, between each retry. | 15 seconds |
| `max_attempts` | int | The maximum number of retry attempts. |  |
| `retry_to_secondary` | bool | Whether the request should be retried to the secondary endpoint, if able. Only use this option for storage accounts with geo-redundant replication enabled, such as RA-GRS or RA-GZRS. You should also ensure your app can handle potentially stale data. | `False` |
| `random_jitter_range` | int | A number in seconds which indicates a range to jitter/randomize for the backoff interval. For example, setting `random_jitter_range` to 3 means that a backoff interval of x can vary between x+3 and x-3. | 3 seconds |
| `retry_total` | int |  | 3 |

In the following code example, we configure the retry options in the `LinearRetry` class. Then, we create a client object for the blob service using the retry options.

:::code language="python" source="~/azure-storage-snippets/blobs\howto\python\blob-devguide-py\blob_devguide_retry.py" id="Snippet_retry_linear":::

In this example, each service request issued from the `BlobServiceClient` object uses the retry options defined in the `LinearRetry` object. You can configure various retry strategies for clients based on the needs of your app.

## Next steps

Now that you understand how to implement a retry policy using the Azure Storage client library for Python, see the following articles for detailed architectural guidance:

- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
