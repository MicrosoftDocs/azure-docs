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

# Authenticating access to Azure Event Grid resources
This article provides information on the following scenarios:  

- Authenticate clients that publish events to Azure Event Grid topics using Shared Access Signature (SAS) or key. 
- Secure your webhook endpoint using Azure Active Directory (Azure AD) to authenticate Event Grid to **deliver** events to the endpoint.

## Authenticate publishing clients using SAS or key
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

The resource is the path for the event grid topic to which you're sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events?api-version=2019-06-01`. To see all the supported API versions, see [Microsoft.EventGrid resource types](https://docs.microsoft.com/azure/templates/microsoft.eventgrid/allversions). 

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

## Authenticate event delivery to webhook endpoints using Azure AD 
You can secure your webhook endpoint by using Azure Active Directory (Azure AD) to authenticate and authorize Event Grid to deliver events to your endpoints. You'll need to create an Azure AD Application, create a role and service principle in your application authorizing Event Grid, and configure the event subscription to use the Azure AD Application. [Learn how to configure Azure Active Directory with Event Grid](secure-webhook-delivery.md).

You can secure your webhook endpoint by adding query parameters to the webhook URL when creating an Event Subscription. Set one of these query parameters to be a secret such as an [access token](https://en.wikipedia.org/wiki/Access_token). The webhook can use the secret to recognize the event is coming from Event Grid with valid permissions. Event Grid will include these query parameters in every event delivery to the webhook.

When editing the Event Subscription, the query parameters aren't displayed or returned unless the [--include-full-endpoint-url](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-show) parameter is used in Azure [CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

Finally, it's important to note that Azure Event Grid only supports HTTPS webhook endpoints. 

> [!NOTE]
> For more information on delivering events to webhooks, see [Webhook event delivery](webhook-event-delivery.md)

## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md)
