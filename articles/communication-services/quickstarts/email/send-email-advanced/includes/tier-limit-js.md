---
title: include file
description: Tier limit JS SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Throw an exception when email sending tier limit is reached

The Email API has throttling with limitations on the number of email messages that you can send. Email sending has limits applied per minute and per hour as mentioned in [API Throttling and Timeouts](/azure/communication-services/concepts/service-limits). When you've reached these limits, subsequent email sends with `send` calls receive an error response of “429: Too Many Requests”. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](/javascript/api/overview/azure/logger-readme) to capture these response codes.

There are per minute and per hour [limits to the amount of emails you can send using the Azure Communication Email Service](/azure/communication-services/concepts/service-limits). When you've reached these limits, any further `beginSend` calls receive a `429: Too Many Requests` response. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](/javascript/api/overview/azure/logger-readme) to capture these response codes.

Alternatively, you can manually define a custom policy:

```javascript
const catch429Policy = {
  name: "catch429Policy",
  async sendRequest(request, next) {
    const response = await next(request);
    if (response.status === 429) {
      throw new Error(response);
    }
    return response;
  }
};
```

Add this policy to your email client to ensure that 429 response codes throw an exception rather than being retried.

```java
const clientOptions = {
  additionalPolicies: [
    {
      policy: catch429Policy,
      position: "perRetry"
    }
  ]
}

const emailClient = new EmailClient(connectionString, clientOptions);
```
