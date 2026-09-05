---
title: Azure Event Grid - Troubleshooting subscription validation
description: Resolve the endpoint validation handshake error that occurs when you create an Azure Event Grid event subscription for a webhook.
ms.topic: troubleshooting-problem-resolution
ms.date: 08/26/2026
ai-usage: ai-assisted
#customer intent: As a developer, I want to resolve the endpoint validation error I get when I create an Event Grid event subscription so that events are delivered to my webhook.
---

# Troubleshoot Azure Event Grid subscription validation failures

When you create an Event Grid event subscription for a webhook endpoint, Event Grid must confirm that you own the endpoint before it delivers events. If that validation handshake doesn't complete, subscription creation fails. This article helps you identify why the handshake fails and how to fix it.

## Symptoms

When you create an event subscription, you see an error message similar to the following text:

`The attempt to validate the provided endpoint https://your-endpoint-here failed. For more details, visit https://aka.ms/esvalidation`

The error indicates that Event Grid couldn't complete the validation handshake with your webhook endpoint, so Event Grid doesn't create the subscription.

## Cause

Event Grid requires you to prove ownership of a webhook endpoint before it starts delivering events. This requirement prevents a malicious user from flooding an endpoint with events. The validation error appears when the handshake between Event Grid and your endpoint doesn't succeed. Common causes include:

- Your endpoint doesn't echo back the validation code for the synchronous handshake, or doesn't return `200 OK` for the asynchronous (manual) handshake.
- A firewall, Azure Application Gateway, or web application firewall (WAF) in front of your endpoint blocks the validation request and returns `403 (Forbidden)`.
- Your endpoint uses the CloudEvents v1.0 schema but doesn't respond to the **HTTP OPTIONS** validation request.
- Your endpoint uses a self-signed certificate, which Event Grid doesn't support for validation.

For a full description of the validation handshake, see [Endpoint validation with Event Grid event schema](end-point-validation-event-grid-events-schema.md) and [Endpoint validation by using CloudEvents schema](end-point-validation-cloud-events-schema.md).

## Solution 1: Test the validation handshake for an Event Grid schema subscription

Send a sample [SubscriptionValidationEvent](end-point-validation-event-grid-events-schema.md#validation-details) to your webhook and confirm the response:

1. Send an HTTP POST request to your webhook URL with a sample `SubscriptionValidationEvent` request body by using curl or a similar tool.
1. If your webhook implements the synchronous handshake, verify that your webhook returns the `validationCode` in the response. You must return an `HTTP 200 OK` status code. Event Grid doesn't recognize `HTTP 202 Accepted` as a valid response, and the request must complete within 30 seconds.
1. If your webhook implements the asynchronous (manual) handshake, verify that your endpoint returns `200 OK`. Then complete the handshake by sending a GET request to the `validationUrl` in the event data within 10 minutes. The validation URL uses port 553, so update your firewall rules if that port is blocked.

Here's a sample `SubscriptionValidationEvent` JSON payload that you can send:

```json
[
  {
    "id": "aaaa0000-bb11-2222-33cc-444444dddddd",
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subject": "",
    "data": {
      "validationCode": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
    },
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "eventTime": "2018-01-25T22:12:19.4556811Z",
    "metadataVersion": "1",
    "dataVersion": "1"
  }
]
```

Here's the expected successful response:

```json
{
  "validationResponse": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
}
```

Here's the equivalent curl command for validating a webhook subscription that uses the Event Grid event schema:

```bash
curl -X POST -d '[{"id": "aaaa0000-bb11-2222-33cc-444444dddddd","topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","subject": "","data": {"validationCode": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"},"eventType": "Microsoft.EventGrid.SubscriptionValidationEvent","eventTime": "2018-01-25T22:12:19.4556811Z", "metadataVersion": "1","dataVersion": "1"}]' -H 'Content-Type: application/json' https://{your-webhook-url.com}
```

To learn more, see [Endpoint validation with Event Grid event schema](end-point-validation-event-grid-events-schema.md).

## Solution 2: Remove firewall or WAF rules that block the validation request

If your webhook returns `403 (Forbidden)`, check whether it's behind an Azure Application Gateway or web application firewall. If it is, disable the following firewall rules and do the HTTP POST again:

- 920300 (Request missing an accept header)
- 942430 (Restricted SQL character anomaly detection (args): number of special characters exceeded (12))
- 920230 (Multiple URL encoding detected)
- 942130 (SQL injection attack: SQL tautology detected)
- 931130 (Possible remote file inclusion (RFI) attack: off-domain reference or link)

## Solution 3: Validate a CloudEvents schema subscription

If your subscription uses the CloudEvents v1.0 schema, Event Grid uses CloudEvents abuse protection instead of the subscription validation event. Your endpoint must respond to the **HTTP OPTIONS** method and return the `WebHook-Allowed-Origin` header. To learn more, see [Endpoint validation by using CloudEvents schema](end-point-validation-cloud-events-schema.md).

## Related content

If you need more help, ask your question on the [Microsoft Q&A page for Event Grid](/answers/tags/56/azure-event-grid) or open a [support ticket](https://azure.microsoft.com/support/options//).
