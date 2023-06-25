---
title: include file
description: Tier limit .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Throw an exception when email sending tier limit is reached

The Email API has throttling with limitations on the number of email messages that you can send. Email sending has limits applied per minute and per hour as mentioned in [API Throttling and Timeouts](../../../../concepts/service-limits.md). When you've reached these limits, subsequent email sends with `SendAsync` calls receive an error response of “429: Too Many Requests”. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](/dotnet/azure/sdk/logging) to capture these response codes.

Alternatively, you can manually define a custom policy:

```csharp
using Azure.Core.Pipeline;

public class Catch429Policy : HttpPipelineSynchronousPolicy
{
    public override void OnReceivedResponse(HttpMessage message)
    {
        if (message.Response.Status == 429)
        {
            throw new Exception(message.Response);
        }
        else
        {
            base.OnReceivedResponse(message);
        }
    }
}
```

Add this policy to your email client to ensure that 429 response codes throw an exception rather than being retried.

```csharp
EmailClientOptions emailClientOptions = new EmailClientOptions();
emailClientOptions.AddPolicy(new Catch429Policy(), HttpPipelinePosition.PerRetry);

EmailClient emailClient = new EmailClient(connectionString, emailClientOptions);
```
