---
title: Implement a retry policy using the Azure Storage client library for Java
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client library for Java. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/03/2024
ms.custom: devx-track-java, devguide-java
---

# Implement a retry policy with Java

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

In this article, you learn how to use the Azure Storage client library for Java to configure a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options

Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

The following table lists the parameters available when constructing a [RequestRetryOptions](/java/api/com.azure.storage.common.policy.requestretryoptions) instance, along with the type, a brief description, and the default value if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `retryPolicyType` | [RetryPolicyType](/java/api/com.azure.storage.common.policy.retrypolicytype) | Optional. The approach to use for calculating retry delays. | [EXPONENTIAL](/java/api/com.azure.storage.common.policy.retrypolicytype#com-azure-storage-common-policy-retrypolicytype-exponential) |
| `maxTries` | Integer | Optional. The maximum number of retry attempts before giving up. | 4 |
| `tryTimeoutInSeconds` | Integer | Optional. Maximum time allowed before a request is canceled and assumed failed. Note that the timeout applies to the operation request, not the overall operation end to end. This value should be based on the bandwidth available to the host machine and proximity to the Storage service. A good starting point might be 60 seconds per MB of anticipated payload size. | Integer.MAX_VALUE (seconds) |
| `retryDelayInMs` | Long | Optional. Specifies the amount of delay to use before retrying an operation. | 4ms for [EXPONENTIAL](/java/api/com.azure.storage.common.policy.retrypolicytype#com-azure-storage-common-policy-retrypolicytype-exponential), 30ms for [FIXED](/java/api/com.azure.storage.common.policy.retrypolicytype#com-azure-storage-common-policy-retrypolicytype-fixed) |
| `maxRetryDelayInMs` | Long | Optional. Specifies the maximum delay allowed before retrying an operation. | 120ms |
| `secondaryHost` | String | Optional. Secondary storage account endpoint to retry requests against. Before setting this value, you should understand the issues around reading stale and potentially inconsistent data. To learn more, see [Use geo-redundancy to design highly available applications](../common/geo-redundant-design.md). | None |

In the following code example, we configure the retry options in an instance of [RequestRetryOptions](/java/api/com.azure.storage.common.policy.requestretryoptions) and pass it to `BlobServiceClientBuilder` to create a client object:

```java
RequestRetryOptions retryOptions = new RequestRetryOptions(RetryPolicyType.FIXED, 2, 3, 1000L, 1500L, null);
BlobServiceClient client = new BlobServiceClientBuilder()
        .endpoint("https://<storage-account-name>.blob.core.windows.net/")
        .credential(credential)
        .retryOptions(retryOptions)
        .buildClient();
```


In this example, each service request issued from the `BlobServiceClient` object uses the retry options as defined in the `RequestRetryOptions` instance. This policy applies to client requestsYou can configure various retry strategies for service clients based on the needs of your app.

## Related content

- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
