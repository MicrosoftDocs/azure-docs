---
title: Azure Event Grid security and authentication
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 07/21/2017
ms.author: babanisa
---

# Event Grid security and authentication 

Azure Event Grid has three types of authentication:

* Event Subscriptions
* Event Publishing
* WebHook event delivery

WebHook authentication is not available in the preview release.

## Event Subscription Creation

You subscribe to events through Azure Resource Manager operations. The resource provider for the published is extended to enable events.

### System topics (Azure service publishers)

As the topic in this model is implicit in that it is the Resource Manager resource for which events are being enabled such as an Event Hub or a storage account as shown below: `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

Role-based access control (RBAC) is used on this publisher resource to check for the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the given resource. If a user is assigned to a role with this permission, they are able to create event subscriptions on the publisher resource. Each Azure resource provider can define roles that map this permission.

### User Topics

For user topics, which are explicitly created, the resource is the actual Azure Event Grid topic resource as shown below with the same role permissions applied. `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

## User Topic Publishing

User topics use either Shared Access Signature (SAS) or key authentication. We recommend SAS, but key authentication provides simple programming, and is compatibile with many existing webhook publishers. 

You include the authentication value in the HTTP header. For SAS, use `aeg-sas-token` for the header value. For key authentication, use `aeg-sas-key` for the header value.

### Key authentication

Key authentication is the simplest form of authentication. Use the format: `aeg-sas-key: <your key>`

For example, you pass a key with: `aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==`

### SAS Tokens

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the topic to which you are sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events`. You generate the signature from a key.

You include the token as an HTTP header called **aeg-sas-token**.

`aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2feventGrid%2fapi%2fevent&e=6%2f15%2f2017+6%3a20%3a15+PM&s=a4oNHpRZygINC%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d` 

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