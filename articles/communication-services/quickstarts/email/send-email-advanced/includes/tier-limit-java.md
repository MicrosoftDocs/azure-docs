---
title: include file
description: Tier limit Java SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Throw an exception when email sending tier limit is reached

The Email API has throttling with limitations on the number of email messages that you can send. Email sending has limits applied per minute and per hour as mentioned in [API Throttling and Timeouts](/azure/communication-services/concepts/service-limits). When you've reached these limits, subsequent email sends with `beginSend` calls receive an error response of “429: Too Many Requests”. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](/azure/developer/java/sdk/logging-overview) to capture these response codes.

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
