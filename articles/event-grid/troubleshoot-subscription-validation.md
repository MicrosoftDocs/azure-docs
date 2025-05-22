---
title: Azure Event Grid - Troubleshooting subscription validation
description: This article shows you how you can troubleshoot subscription validations for Event Grid events and cloud events. 
ms.topic: how-to
ms.date: 01/22/2025
# Customer intent: I want to know how to troubleshoot issues with event subscriptions in Azure Event Grid. 
---

# Troubleshoot Azure Event Grid subscription validations
During event subscription creation, if you're seeing an error message such as `The attempt to validate the provided endpoint https://your-endpoint-here failed. For more details, visit https://aka.ms/esvalidation`, it indicates that there's a failure in the validation handshake. To resolve this error, verify the following aspects:

- Do an HTTP POST to your webhook url with a [sample SubscriptionValidationEvent](end-point-validation-event-grid-events-schema.md#validation-details) request body using curl or similar tool.
- If your webhook is implementing synchronous validation handshake mechanism, verify that the ValidationCode is returned as part of the response.
- If your webhook is implementing asynchronous validation handshake mechanism, verify that you're the HTTP POST is returning 200 OK.
- If your webhook is returning `403 (Forbidden)` in the response, check if your webhook is behind an Azure Application Gateway or Web Application Firewall. If it is, then your need to disable these firewall rules and do an HTTP POST again:
    - 920300 (Request missing an accept header)
    - 942430 (Restricted SQL character anomaly detection (args): # of special characters exceeded (12))
    - 920230 (Multiple URL encoding detected)
    - 942130 (SQL injection attack: SQL tautology detected.)
    - 931130 (Possible remote file inclusion (RFI) attack = Off-domain reference/link)

> [!IMPORTANT]
> For detailed information on endpoint validation for webhooks, see [Webhook event delivery](end-point-validation-cloud-events-schema.md).

Here's a sample **SubscriptionValidationEvent** JSON you can send using a tool such as CURL: 

```json
[
  {
    "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subject": "",
    "data": {
      "validationCode": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
    },
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "eventTime": "2018-01-25T22:12:19.4556811Z",
    "metadataVersion": "1",
    "dataVersion": "1"
  }
]
```

Here's the sample successful response:

```json
{
  "validationResponse": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
}
```


## Validate Event Grid event subscription using Curl 
Here's the sample Curl command for validating a webhook subscription of an Event Grid event: 

```bash
curl -X POST -d '[{"id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66","topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","subject": "","data": {"validationCode": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"},"eventType": "Microsoft.EventGrid.SubscriptionValidationEvent","eventTime": "2018-01-25T22:12:19.4556811Z", "metadataVersion": "1","dataVersion": "1"}]' -H 'Content-Type: application/json' https://{your-webhook-url.com}
```



To learn more about Event Grid event validation for webhooks, see [Endpoint validation with Event Grid events](end-point-validation-cloud-events-schema.md).

## Validate cloud event subscription
Use the **HTTP OPTIONS** method for validation with cloud events. To learn more about cloud event validation for webhooks, see [Endpoint validation with cloud events](end-point-validation-cloud-events-schema.md).

## Related content
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
