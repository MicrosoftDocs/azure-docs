---
title: Implement a retry policy using the Azure Storage client library for Python
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client library for Python. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/29/2024
ms.custom: devx-track-python, devguide-python
---

# Implement a retry policy with Python

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

In this article, you learn how to use the Azure Storage client library for Python to set up a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options

Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

To configure a retry policy for client requests, you can choose from the following approaches:

- **Use the default values**: The default retry policy for the Azure Storage client library for Python is an instance of [ExponentialRetry](/python/api/azure-storage-blob/azure.storage.blob.exponentialretry) with the default values. If you don't specify a retry policy, the default retry policy is used.
- **Pass values as keywords to the client constructor**: You can pass values for the retry policy properties as keyword arguments when you create a client object for the service. This approach allows you to customize the retry policy for the client, and is useful if you only need to configure a few options.
- **Create an instance of a retry policy class**: You can create an instance of the [ExponentialRetry](/python/api/azure-storage-blob/azure.storage.blob.exponentialretry) or [LinearRetry](/python/api/azure-storage-blob/azure.storage.blob.linearretry) class and set the properties to configure the retry policy. Then, you can pass the instance to the client constructor to apply the retry policy to all service requests.

The following table shows all the properties you can use to configure a retry policy. Any of these properties can be passed as keywords to the client constructor, but some are only available to use with an `ExponentialRetry` or `LinearRetry` instance. These restrictions are noted in the table, along with the default values for each property if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value | ExponentialRetry | LinearRetry |
| --- | --- | --- | --- | --- | --- |
| `retry_total` | int | The maximum number of retries. | 3 | Yes | Yes |
| `retry_connect` | int | The maximum number of connect retries | 3 | Yes | Yes |
| `retry_read` | int | The maximum number of read retries | 3 | Yes | Yes |
| `retry_status` | int | The maximum number of status retries | 3 | Yes | Yes |
| `retry_to_secondary` | bool | Whether the request should be retried to the secondary endpoint, if able. Only use this option for storage accounts with geo-redundant replication enabled, such as RA-GRS or RA-GZRS. You should also ensure your app can handle potentially stale data. | `False` | Yes | Yes |
| `initial_backoff` | int | The initial backoff interval (in seconds) for the first retry. Only applies to exponential backoff strategy. | 15 seconds | Yes | No |
| `increment_base` | int | The base (in seconds) to increment the initial_backoff by after the first retry. Only applies to exponential backoff strategy. | 3 seconds | Yes | No |
| `backoff` | int | The backoff interval (in seconds) between each retry. Only applies to linear backoff strategy. | 15 seconds | No | Yes |
| `random_jitter_range` | int | A number (in seconds) which indicates a range to jitter/randomize for the backoff interval. For example, setting `random_jitter_range` to 3 means that a backoff interval of x can vary between x+3 and x-3. | 3 seconds | Yes | Yes |

> [!NOTE]
> The properties `retry_connect`, `retry_read`, and `retry_status` are used to count different types of errors. The remaining retry count is calculated as the *minimum* of the following values: `retry_total`, `retry_connect`, `retry_read`, and `retry_status`. Because of this, setting only `retry_total` might not have an effect unless you also set the other properties. In most cases, you can set all four properties to the same value to enforce a maximum number of retries. However, you should tune these properties based on the specific needs of your app.

The following sections show how to configure a retry policy using different approaches:

- [Use the default retry policy](#use-the-default-retry-policy)
- [Create an ExponentialRetry policy](#create-an-exponentialretry-policy)
- [Create a LinearRetry policy](#create-a-linearretry-policy)

### Use the default retry policy

The default retry policy for the Azure Storage client library for Python is an instance of [ExponentialRetry](/python/api/azure-storage-blob/azure.storage.blob.exponentialretry) with the default values. If you don't specify a retry policy, the default retry policy is used. You can also pass any configuration properties as keyword arguments when you create a client object for the service.

The following code example shows how to pass a value for the `retry_total` property as a keyword argument when creating a client object for the blob service. In this example, the client object uses the default retry policy with the `retry_total` property and other retry count properties set to 5:

:::code language="python" source="~/azure-storage-snippets/blobs\howto\python\blob-devguide-py\blob_devguide_retry.py" id="Snippet_retry_default":::

### Create an ExponentialRetry policy

You can configure a retry policy by creating an instance of [ExponentialRetry](/python/api/azure-storage-blob/azure.storage.blob.exponentialretry), and passing the instance to the client constructor using the `retry_policy` keyword argument. This approach can be useful if you need to configure multiple properties or multiple policies for different clients.

The following code example shows how to configure the retry options using an instance of `ExponentialRetry`. In this example, we set `initial_backoff` to 10 seconds, `increment_base` to 4 seconds, and `retry_total` to 3 retries:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_retry.py" id="Snippet_retry_exponential":::

### Create a LinearRetry policy

You can configure a retry policy by creating an instance of [LinearRetry](/python/api/azure-storage-blob/azure.storage.blob.linearretry), and passing the instance to the client constructor using the `retry_policy` keyword argument. This approach can be useful if you need to configure multiple properties or multiple policies for different clients.

The following code example shows how to configure the retry options using an instance of `LinearRetry`. In this example, we set `backoff` to 10 seconds, `retry_total` to 3 retries, and `retry_to_secondary` to `True`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_retry.py" id="Snippet_retry_linear":::

## Related content

- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
