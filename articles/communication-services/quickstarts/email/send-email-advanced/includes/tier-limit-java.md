---
title: include file
description: Tier limit Java SDK
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Throw an exception when email sending tier limit is reached

The Email API uses throttling with limitations on the number of email messages that you can send. Email sending limits are applied per minute and per hour as described in [API Throttling and Timeouts](/azure/communication-services/concepts/service-limits). When you reach these limits, subsequent email sends with `SendAsync` calls receive an error response of `429: Too Many Requests`. By default, the SDK is configured to retry these requests after waiting a certain period of time. To capture these response codes, we recommend you [set up logging with the Azure SDK](/azure/developer/python/sdk/azure-sdk-logging).

Alternatively, you can manually define a custom policy:

```java
import com.azure.core.http.HttpResponse;
import com.azure.core.http.policy.ExponentialBackoff;

public class CustomStrategy extends ExponentialBackoff {
    @Override
    public boolean shouldRetry(HttpResponse httpResponse) {
        int code = httpResponse.getStatusCode();

        if (code == HTTP_STATUS_TOO_MANY_REQUESTS) {
            throw new RuntimeException(httpResponse);
        }
        else {
            return super.shouldRetry(httpResponse);
        }
    }
}
```

Add this retry policy to your email client to ensure that 429 response codes throw an exception rather than being retried.

```java
import com.azure.core.http.policy.RetryPolicy;

EmailClient emailClient = new EmailClientBuilder()
    .connectionString(connectionString)
    .retryPolicy(new RetryPolicy(new CustomStrategy()))
    .buildClient();
```
