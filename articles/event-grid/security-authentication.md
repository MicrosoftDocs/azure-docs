---
title: Azure Event Grid security and authentication
description: This article describes different ways of authenticating access to your Event Grid resources (WebHook, subscriptions, custom topics)
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 03/06/2020
ms.author: babanisa
---
# Authenticating access to Event Grid resources

Azure Event Grid has three types of authentication:

* WebHook event delivery
* Event subscriptions
* Custom topic publishing

## WebHook Event delivery

Webhooks are one of the many ways to receive events from Azure Event Grid. When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event in the request body.

Like many other services that support webhooks, Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint. This requirement prevents a malicious user from flooding your endpoint with events. When you use any of the three Azure services listed below, the Azure infrastructure automatically handles this validation:

* Azure Logic Apps with [Event Grid Connector](https://docs.microsoft.com/connectors/azureeventgrid/)
* Azure Automation via [webhook](../event-grid/ensure-tags-exists-on-new-virtual-machines.md)
* Azure Functions with [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md)

If you're using any other type of endpoint, such as an HTTP trigger based Azure function, your endpoint code needs to participate in a validation handshake with Event Grid. Event Grid supports two ways of validating the subscription.

1. **ValidationCode handshake (programmatic)**: If you control the source code for your endpoint, this method is recommended. At the time of event subscription creation, Event Grid sends a subscription validation event to your endpoint. The schema of this event is similar to any other Event Grid event. The data portion of this event includes a `validationCode` property. Your application verifies that the validation request is for an expected event subscription, and echoes the validation code to Event Grid. This handshake mechanism is supported in all Event Grid versions.

2. **ValidationURL handshake (manual)**: In certain cases, you can't access the source code of the endpoint to implement the ValidationCode handshake. For example, if you use a third-party service (like [Zapier](https://zapier.com) or [IFTTT](https://ifttt.com/)), you can't programmatically respond with the validation code.

   Starting with version 2018-05-01-preview, Event Grid supports a manual validation handshake. If you're creating an event subscription with an SDK or tool that uses API version 2018-05-01-preview or later, Event Grid sends a `validationUrl` property in the data portion of the subscription validation event. To complete the handshake, find that URL in the event data and manually send a GET request to it. You can use either a REST client or your web browser.

   The provided URL is valid for 5 minutes. During that time, the provisioning state of the event subscription is `AwaitingManualAction`. If you don't complete the manual validation within 5 minutes, the provisioning state is set to `Failed`. You'll have to create the event subscription again before starting the manual validation.

    This authentication mechanism also requires the webhook endpoint to return an HTTP status code of 200 so that it knows that the POST for the validation event was accepted before it can be put in the manual validation mode. In other words, if the endpoint returns 200 but doesn't return back a validation response programmatically, the mode is transitioned to the manual validation mode. If there's a GET on the validation URL within 5 minutes, the validation handshake is considered to be successful.

> [!NOTE]
> Using self-signed certificates for validation isn't supported. Use a signed certificate from a certificate authority (CA) instead.

### Validation details

* At the time of event subscription creation/update, Event Grid posts a subscription validation event to the target endpoint. 
* The event contains a header value "aeg-event-type: SubscriptionValidation".
* The event body has the same schema as other Event Grid events.
* The eventType property of the event is `Microsoft.EventGrid.SubscriptionValidationEvent`.
* The data property of the event includes a `validationCode` property with a randomly generated string. For example, "validationCode: acb13…".
* The event data also includes a `validationUrl` property with a URL for manually validating the subscription.
* The array contains only the validation event. Other events are sent in a separate request after you echo back the validation code.
* The EventGrid DataPlane SDKs have classes corresponding to the subscription validation event data and subscription validation response.

An example SubscriptionValidationEvent is shown in the following example:

```json
[{
  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subject": "",
  "data": {
    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",
    "validationUrl": "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/estest/validate?id=512d38b6-c7b8-40c8-89fe-f46f9e9622b6&t=2018-04-26T20:30:54.4538837Z&apiVersion=2018-05-01-preview&token=1A1A1A1A"
  },
  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
  "eventTime": "2018-01-25T22:12:19.4556811Z",
  "metadataVersion": "1",
  "dataVersion": "1"
}]
```

To prove endpoint ownership, echo back the validation code in the validationResponse property, as shown in the following example:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

You must return an HTTP 200 OK response status code. HTTP 202 Accepted is not recognized as a valid Event Grid subscription validation response. The http request must complete within 30 seconds. If the operation doesn't finish within 30 seconds, then the operation will be canceled and it may be reattempted after 5 seconds. If all the attempts fail, then it will be treated as validation handshake error.

Or, you can manually validate the subscription by sending a GET request to the validation URL. The event subscription stays in a pending state until validated. The validation Url uses port 553. If your firewall rules block port 553 then rules may need to be updated for successful manual handshake.

For an example of handling the subscription validation handshake, see a [C# sample](https://github.com/Azure-Samples/event-grid-dotnet-publish-consume-events/blob/master/EventGridConsumer/EventGridConsumer/Function1.cs).

### Checklist

During event subscription creation, if you're seeing an error message such as "The attempt to validate the provided endpoint https:\//your-endpoint-here failed. For more details, visit https:\//aka.ms/esvalidation", it indicates that there's a failure in the validation handshake. To resolve this error, verify the following aspects:

* Do you control of the application code running in the target endpoint? For example, if you're writing an HTTP trigger based Azure Function, do you have access to the application code to make changes to it?
* If you have access to the application code, implement the ValidationCode based handshake mechanism as shown in the sample above.

* If you don't have access to the application code (for example, if you're using a third-party service that supports webhooks), you can use the manual handshake mechanism. Make sure you're using the 2018-05-01-preview API version or later (install Event Grid Azure CLI extension) to receive the validationUrl in the validation event. To complete the manual validation handshake, get the value of the `validationUrl` property and visit that URL in your web browser. If validation is successful, you should see a message in your web browser that validation is successful. You'll see that event subscription's provisioningState is "Succeeded". 

### Event delivery security

#### Azure AD

You can secure your webhook endpoint by using Azure Active Directory to authenticate and authorize Event Grid to publish events to your endpoints. You'll need to create an Azure Active Directory Application, create a role and service principle in your application authorizing Event Grid, and configure the event subscription to use the Azure AD Application. [Learn how to configure AAD with Event Grid](secure-webhook-delivery.md).

#### Query parameters
You can secure your webhook endpoint by adding query parameters to the webhook URL when creating an Event Subscription. Set one of these query parameters to be a secret such as an [access token](https://en.wikipedia.org/wiki/Access_token). The webhook can use the secret to recognize the event is coming from Event Grid with valid permissions. Event Grid will include these query parameters in every event delivery to the webhook.

When editing the Event Subscription, the query parameters aren't displayed or returned unless the [--include-full-endpoint-url](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-show) parameter is used in Azure [CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

Finally, it's important to note that Azure Event Grid only supports HTTPS webhook endpoints.

## Event subscription

To subscribe to an event, you must prove that you have access to the event source and handler. Proving that you own a WebHook was covered in the preceding section. If you're using an event handler that isn't a WebHook (such as an event hub or queue storage), you need write access to that resource. This permissions check prevents an unauthorized user from sending events to your resource.

You must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the resource that is the event source. You need this permission because you're writing a new subscription at the scope of the resource. The required resource differs based on whether you're subscribing to a system topic or custom topic. Both types are described in this section.

### System topics (Azure service publishers)

For system topics, you need permission to write a new event subscription at the scope of the resource publishing the event. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

For example, to subscribe to an event on a storage account named **myacct**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.Storage/storageAccounts/myacct`

### Custom topics

For custom topics, you need permission to write a new event subscription at the scope of the event grid topic. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

For example, to subscribe to a custom topic named **mytopic**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.EventGrid/topics/mytopic`

## Custom topic publishing

Custom topics use either Shared Access Signature (SAS) or key authentication. We recommend SAS, but key authentication provides simple programming, and is compatible with many existing webhook publishers. 

You include the authentication value in the HTTP header. For SAS, use **aeg-sas-token** for the header value. For key authentication, use **aeg-sas-key** for the header value.

### Key authentication

Key authentication is the simplest form of authentication. Use the format: `aeg-sas-key: <your key>`

For example, you pass a key with:

```
aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### SAS tokens

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the event grid topic to which you're sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events`

You generate the signature from a key.

For example, a valid **aeg-sas-token** value is:

```http
aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2feventGrid%2fapi%2fevent&e=6%2f15%2f2017+6%3a20%3a15+PM&s=a4oNHpRZygINC%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

The following example creates a SAS token for use with Event Grid:

```cs
static string BuildSharedAccessSignature(string resource, DateTime expirationUtc, string key)
{
    const char Resource = 'r';
    const char Expiration = 'e';
    const char Signature = 's';

    string encodedResource = HttpUtility.UrlEncode(resource);
    var culture = CultureInfo.CreateSpecificCulture("en-US");
    var encodedExpirationUtc = HttpUtility.UrlEncode(expirationUtc.ToString(culture));

    string unsignedSas = $"{Resource}={encodedResource}&{Expiration}={encodedExpirationUtc}";
    using (var hmac = new HMACSHA256(Convert.FromBase64String(key)))
    {
        string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(unsignedSas)));
        string encodedSignature = HttpUtility.UrlEncode(signature);
        string signedSas = $"{unsignedSas}&{Signature}={encodedSignature}";

        return signedSas;
    }
}
```

### Encryption at rest

All events or data written to disk by the Event Grid service is encrypted by a Microsoft-managed key ensuring that it's encrypted at rest. Additionally, the maximum period of time that events or data retained is 24 hours in adherence with the [Event Grid retry policy](delivery-and-retry.md). Event Grid will automatically delete all events or data after 24 hours, or the event time-to-live, whichever is less.

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md)
