---
title: Azure Event Grid security and authentication
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 08/14/2017
ms.author: babanisa
---

# Event Grid security and authentication 

Azure Event Grid has three types of authentication:

* Event subscriptions
* Event publishing
* WebHook event delivery

## WebHook Event delivery

Webhooks are one of many ways to receive events in real time from Azure Event Grid.

Every time there is a new event ready to be delivered, Event Grid sends an HTTP request with to your WebHook with the event in the body.

When you register your own WebHook endpoint with Event Grid, it sends you a GET request with a simple validation code in order to prove endpoint ownership. Your app needs to respond by echoing back the validation code. Event Grid will not deliver events to WebHook endpoints that have not passed the validation.
 
### Validation details:

* At the time of event subscription creation/update, Event Grid posts a “SubscriptionValidationEvent” event to the target endpoint.
* The event contains a header value “Event-Type: Validation”.
* The event body has the same schema as other Event Grid events.
* The event data includes a “validation_code” property with a randomly generated string e.g. “validation_code: acb13…”.

In order to prove endpoint ownership, echo back the validation code e.g “validation_response: acb13…”.

Finally, it is important to note that Azure Event Grid only supports HTTPS webhook endpoints.
## Event subscription

To subscribe to an event, you must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the required resource. You need this permission because you are writing a new subscription at the scope of the resource. The required resource differs based on whether you are subscribing to a system topic or custom topic. Both types are described in this section.

### System topics (Azure service publishers)

For system topics, you need permission to write a new event subscription at the scope of the resource publishing the event. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

For example, to subscribe to an event on a storage account named **myacct**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.Storage/storageAccounts/myacct`

### Custom topics

For custom topics, you need permission to write a new event subscription at the scope of the Event Grid topic. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

For example, to subscribe to a custom topic named **mytopic**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.EventGrid/topics/mytopic`

## Topic publishing

Topics use either Shared Access Signature (SAS) or key authentication. We recommend SAS, but key authentication provides simple programming, and is compatible with many existing webhook publishers. 

You include the authentication value in the HTTP header. For SAS, use **aeg-sas-token** for the header value. For key authentication, use **aeg-sas-key** for the header value.

### Key authentication

Key authentication is the simplest form of authentication. Use the format: `aeg-sas-key: <your key>`

For example, you pass a key with: 

```
aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### SAS tokens

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the topic to which you are sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events`

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
    string encodedExpirationUtc = HttpUtility.UrlEncode(expirationUtc.ToString());

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

## Next steps

* For an introduction to Event Grid, see [About Event Grid?](overview.md)
