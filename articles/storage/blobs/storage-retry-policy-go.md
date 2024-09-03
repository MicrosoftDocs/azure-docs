---
title: Implement a retry policy using the Azure Storage client module for Go
titleSuffix: Azure Storage
description: Learn about retry policies and how to implement them for Blob Storage. This article helps you set up a retry policy for Blob Storage requests using the Azure Storage client module for Go. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.custom: devx-track-go, devguide-go
---

# Implement a retry policy with Go

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for these applications to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

In this article, you learn how to use the Azure Storage client module for Go to configure a retry policy for an application that connects to Azure Blob Storage. Retry policies define how the application handles failed requests, and should always be tuned to match the business requirements of the application and the nature of the failure.

## Configure retry options

Retry policies for Blob Storage are configured programmatically, offering control over how retry options are applied to various service requests and scenarios. For example, a web app issuing requests based on user interaction might implement a policy with fewer retries and shorter delays to increase responsiveness and notify the user when an error occurs. Alternatively, an app or component running batch requests in the background might increase the number of retries and use an exponential backoff strategy to allow the request time to complete successfully.

The following table lists the fields available to configure in a [RetryOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore/policy#RetryOptions) instance, along with the type, a brief description, and the default value if you make no changes. You should be proactive in tuning the values of these properties to meet the needs of your app.

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `MaxRetries` | `int32` | Optional. Specifies the maximum number of attempts a failed operation is retried before producing an error. A value less than zero means one try and no retries. | 3 |
| `TryTimeout` | `time.Duration` | Optional. Indicates the maximum time allowed for any single try of an HTTP request. Specify a value greater than zero to enable. Note: Setting this field to a small value might cause premature HTTP request timeouts. | Disabled by default. |
| `RetryDelay` | `time.Duration` | Optional. Specifies the initial amount of delay to use before retrying an operation. The value is used only if the HTTP response doesn't contain a Retry-After header. The delay increases exponentially with each retry up to the maximum specified by MaxRetryDelay. A value less than zero means no delay between retries. | 4 seconds |
| `MaxRetryDelay` | `time.Duration` | Optional. Specifies the maximum delay allowed before retrying an operation. Typically, the value is greater than or equal to the value specified in `RetryDelay`. A value less than zero means there's no maximum. | 60 seconds |
| `StatusCodes` | []int | Optional. Specifies the HTTP status codes that indicate the operation should be retried. Specifying values replaces the default values. Specifying an empty slice disables retries for HTTP status codes. | 408 - http.StatusRequestTimeout</br>429 - http.StatusTooManyRequests</br>500 - http.StatusInternalServerError</br>502 - http.StatusBadGateway</br>503 - http.StatusServiceUnavailable</br>504 - http.StatusGatewayTimeout |
| `ShouldRetry` | `func(*http.Response, error) bool` | Optional. evaluates if the retry policy should retry the request. When specified, the function overrides comparison against the list of HTTP status codes and error checking within the retry policy. `Context` and `NonRetriable` errors remain evaluated before calling `ShouldRetry`. The `*http.Response` and `error` parameters are mutually exclusive, that is, if one is `nil`, the other isn't `nil`. A return value of true means the retry policy should retry. | |

To work with the code example in this article, add the following `import` paths to your code:

```go
import (
	"context"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)
```

In the following code example, we configure the retry options in an instance of [RetryOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore/policy#RetryOptions), include it in a [ClientOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore/policy#ClientOptions) instance, and create a new client object:

```go
options := azblob.ClientOptions{
	ClientOptions: azcore.ClientOptions{
		Retry: policy.RetryOptions{
			MaxRetries:    10,
			TryTimeout:    time.Minute * 15,
			RetryDelay:    time.Second * 1,
			MaxRetryDelay: time.Second * 60,
			StatusCodes:   []int{408, 429, 500, 502, 503, 504},
		},
	},
}

credential, err := azidentity.NewDefaultAzureCredential(nil)
handleError(err)

client, err := azblob.NewClient(accountURL, credential, &options)
handleError(err)
```

In this example, each service request issued from `client` uses the retry options as defined in the `RetryOptions` struct. This policy applies to client requests. You can configure various retry strategies for service clients based on the needs of your app.

## Related content

- For architectural guidance and general best practices for retry policies, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- For guidance on implementing a retry pattern for transient failures, see [Retry pattern](/azure/architecture/patterns/retry).
