---
title: Azure Event Grid - Troubleshooting subscription validation
description: This article shows you how you can troubleshoot subscription validations. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/21/2020
ms.author: spelluru
---

# Troubleshoot Azure Event Grid subscription validations
This article provides you information on troubleshooting event subscription validations. 

> [!IMPORTANT]
> For detailed information on endpoint validation for webhooks, see [Webhook event delivery](webhook-event-delivery.md).

## Validate Event Grid event subscription using Postman
Here's an example of using Postman for validating a webhook subscription of an Event Grid event: 

![Event grid event subscription validation using Postman](./media/troubleshoot-subscription-validation/event-subscription-validation-postman.png)

Here is a sample **SubscriptionValidationEvent** JSON:

```json
[
  {
    "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subject": "",
    "data": {
      "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",
    },
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "eventTime": "2018-01-25T22:12:19.4556811Z",
    "metadataVersion": "1",
    "dataVersion": "1"
  }
]
```

Here is the sample successful response:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

To learn more about Event Grid event validation for webhooks, see [Endpoint validation with event grid events](webhook-event-delivery.md#endpoint-validation-with-event-grid-events).


## Validate Event Grid event subscription using Curl 
Here's the sample Curl command for validating a webhook subscription of an Event Grid event: 

```bash
curl -X POST -d '[{"id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66","topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","subject": "","data": {"validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"},"eventType": "Microsoft.EventGrid.SubscriptionValidationEvent","eventTime": "2018-01-25T22:12:19.4556811Z", "metadataVersion": "1","dataVersion": "1"}]' -H 'Content-Type: application/json' https://{your-webhook-url.com}
```

## Validate cloud event subscription using Postman
Here's an example of using Postman for validating a webhook subscription of a cloud event: 

![Cloud event subscription validation using Postman](./media/troubleshoot-subscription-validation/cloud-event-subscription-validation-postman.png)

Use the **HTTP OPTIONS** method for validation with cloud events. To learn more about cloud event validation for webhooks, see [Endpoint validation with cloud events](webhook-event-delivery.md#endpoint-validation-with-event-grid-events).

## Error code: 403
If your webhook is returning 403 (Forbidden) in the response, check if your webhook is behind an Azure Application Gateway or Web Application Firewall. If it's, you need to disable the following firewall rules and do an HTTP POST again:

  - 920300 (Request Missing an Accept Header, we can fix this)
  - 942430 (Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12))
  - 920230 (Multiple URL Encoding Detected)
  - 942130 (SQL Injection Attack: SQL Tautology Detected.)
  - 931130 (Possible Remote File Inclusion (RFI) Attack = Off-Domain Reference/Link)

## Next steps
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
