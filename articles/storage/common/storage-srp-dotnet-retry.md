---
title: Configure retry options with Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Learn how to configure retry options with Azure Storage management library for .NET
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 11/07/2024
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Implement a retry policy for Azure Storage management APIs in .NET

When working with Azure Storage management plane APIs, handling transient faults and rate limits effectively is crucial for building resilient applications. The [scale targets](scalability-targets-resource-provider.md) are different between the Storage resource provider and the data plane, so it's important to configure retry options based on where the request is being sent. In this article, you learn how to configure retry options for an application that calls management plane APIs. 

## Configure retry options

Retry policies for management plane operations can be configured programmatically, offering control over how retry options are applied to various service requests and scenarios.

The following table lists the properties of the [RetryOptions](/dotnet/api/azure.core.retryoptions) class, along with the type, a brief description, and the default value if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| [Delay](/dotnet/api/azure.core.retryoptions.delay) | [TimeSpan](/dotnet/api/system.timespan) | The delay between retry attempts for a fixed approach or the delay on which to base calculations for a backoff-based approach. If the service provides a Retry-After response header, the next retry is delayed by the duration specified by the header value. | 0.8 second |
| [MaxDelay](/dotnet/api/azure.core.retryoptions.maxdelay) | [TimeSpan](/dotnet/api/system.timespan) | The maximum permissible delay between retry attempts when the service doesn't provide a Retry-After response header. If the service provides a Retry-After response header, the next retry is delayed by the duration specified by the header value. | 1 minute |
| [MaxRetries](/dotnet/api/azure.core.retryoptions.maxretries) | int | The maximum number of retry attempts before giving up. | 3 |
| [Mode](/dotnet/api/azure.core.retryoptions.mode) | [RetryMode](/dotnet/api/azure.core.retrymode) | The approach to use for calculating retry delays. | Exponential |
| [NetworkTimeout](/dotnet/api/azure.core.retryoptions.networktimeout) | [TimeSpan](/dotnet/api/system.timespan) | The timeout applied to an individual network operation. | 100 seconds |

In this code example for Blob Storage, we configure the retry options in the `Retry` property of the [BlobClientOptions](/dotnet/api/azure.storage.blobs.blobclientoptions) class. Then, we create a client object for the blob service using the retry options.

### Use the default retry policy

```csharp
// Authenticate to Azure and create the top-level ArmClient
ArmClient armClient = new(new DefaultAzureCredential(), subscriptionId, armClientOptions);
```

### Set the Retry-After header

When you reach the rate limit for Azure Storage management plane APIs, you receive an HTTP status code `429 Too Many Requests`. The response includes a `Retry-After` header, which specifies the number of seconds your application should wait before sending the next request. This approach ensures that your application respects the rate limits imposed by the service.

In this example, the application reads the Retry-After header and waits for the specified duration before retrying the request.

```csharp
var response = await httpClient.GetAsync(requestUri);
if (response.StatusCode == HttpStatusCode.TooManyRequests)
{
    var retryAfter = response.Headers.RetryAfter.Delta.Value;
    await Task.Delay(retryAfter);
    // Retry the request
}
```

### Configure a custom retry policy

A custom retry policy allows you to define specific retry logic tailored to your application's needs. This approach provides greater control over the retry behavior, such as setting custom intervals, maximum retry attempts, and handling specific exceptions.

```csharp
// Provide configuration options for the ArmClient
ArmClientOptions armClientOptions = new()
{
    Retry = {
        Delay = TimeSpan.FromSeconds(2),
        MaxRetries = 5,
        Mode = RetryMode.Exponential,
        MaxDelay = TimeSpan.FromSeconds(10),
        NetworkTimeout = TimeSpan.FromSeconds(100)
    },
};

// Authenticate to Azure and create the top-level ArmClient
ArmClient armClient = new(new DefaultAzureCredential(), subscriptionId, armClientOptions);
```

Choosing the right retry strategy depends on your application's requirements and the specific scenarios you need to handle. The default retry policy offers simplicity and is suitable for most cases. Using the `Retry-After` header ensures compliance with rate limits, while a custom retry policy provides the highest level of control and customization.

By understanding these differences, you can implement an effective retry strategy that enhances the resilience and reliability of your .NET applications interacting with Azure Storage management plane APIs.
