---
title: Event schema compatibility
description: When a subscription is created, an outgoing event schema is defined. The following table shows you the compatibility allowed when creating a subscription. 
ms.topic: concept-article
ms.date: 09/25/2024
ms.custom: FY25Q1-Linter
#customer intent: As a developer, I want to know hw to validate a Webhook endpoint using the CloudEvents v1.0 schema.
---


# Event schema compatibility
When a topic is created, an incoming event schema is defined. And, when a subscription is created, an outgoing event schema is defined. This article shows you the compatibility between input and output schema that's allowed when creating an event subscription.

## Input schema to output schema
The following table shows you the compatibility allowed when creating a subscription. 

| Incoming event schema | Outgoing event schema | Supported |
| ---- | ---- | ---- |
| Event Grid schema | Event Grid schema | Yes |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | No |
| Cloud Events v1.0 schema | Event Grid schema | No |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | No |
| Custom input schema | Event Grid schema | Yes |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | Yes |

## Related content
See the following article to learn how to troubleshoot event subscription validations: [Troubleshoot event subscription validations](troubleshoot-subscription-validation.md).
