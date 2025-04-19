---
title: include file
description: Tier limit Python SDK
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

Alternatively, you can manually define a custom policy to ensure that 429 response codes throw an exception rather than being retried.

```python
def callback(response):
    if response.http_response.status_code == 429:
        raise Exception(response.http_response)

email_client = EmailClient.from_connection_string(<connection_string>, raw_response_hook=callback)
```
