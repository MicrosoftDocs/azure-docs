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

When working with Azure Storage management plane APIs, handling transient faults and rate limits effectively is crucial for building resilient applications. The scale targets are different between the Storage resource provider and the data plane, so it's important to configure retry options based on where the request is being sent.
In this article, you learn how to configure retry options for an application that calls management plane APIs. 

### Configure retry options



## Use the default retry policy

The default retry policy in the Azure Storage management library for .NET is designed to handle transient faults automatically. This policy uses an exponential backoff strategy, which increases the delay between retries after each failed attempt. The default settings are typically sufficient for most scenarios, providing a balance between retry attempts and wait times.

In this example, the `ArmClient` uses the default retry policy defined in `ArmClientOptions`.

```csharp
// Blank configuration options for the ArmClient
ArmClientOptions armClientOptions = new() { };

// Authenticate to Azure and create the top-level ArmClient
ArmClient armClient = new(new DefaultAzureCredential(), subscriptionId, armClientOptions);
```

## Set the Retry-After header

When you reach the rate limit for Azure Storage management plane APIs, you receive an HTTP status code 429 Too Many Requests. The response includes a Retry-After header, which specifies the number of seconds your application should wait before sending the next request. This approach ensures that your application respects the rate limits imposed by the service.

Example
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

## Configure a custom retry policy

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

Choosing the right retry strategy depends on your application's requirements and the specific scenarios you need to handle. The default retry policy offers simplicity and is suitable for most cases. Using the Retry-After header ensures compliance with rate limits, while a custom retry policy provides the highest level of control and customization.

By understanding these differences, you can implement an effective retry strategy that enhances the resilience and reliability of your .NET applications interacting with Azure Storage management plane APIs.
