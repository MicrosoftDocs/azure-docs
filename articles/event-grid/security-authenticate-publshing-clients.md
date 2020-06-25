---
title: Authenticate clients publishing events to Event Grid custom topics or domains
description: This article describes different ways of authenticating clients publishing events to Event Grid custom topics. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/25/2020
ms.author: spelluru
---

# Authenticate publishing clients (Azure Event Grid)
This article provides information on authenticating clients that publish events to Azure Event Grid topics or domains using **access key** or **Shared Access Signature (SAS)** token. We recommend using SAS token, but key authentication provides simple programming, and is compatible with many existing webhook publishers.  

## Authenticate using access key
Access key authentication is the simplest form of authentication. To use it, pass the access key as a value for the HTTP header: **aeg-sas-key** as shown in the following example: 

```
aeg-sas-key: XXXXXXXXXXXXXXXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### aeg-sas-key as a query parameter
You can also specify `aeg-sas-key` as a query parameter. 

```
https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events?api-version=2019-06-01&&aeg-sas-key=XXXXXXXX53249XX8XXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### Get the access key

#### Azure portal

#### Azure PowerShell
https://docs.microsoft.com/en-us/powershell/module/az.eventgrid/get-azeventgridtopickey?view=azps-4.3.0

https://docs.microsoft.com/en-us/powershell/module/az.eventgrid/get-azeventgriddomainkey?view=azps-4.3.0


#### Azure CLI
https://docs.microsoft.com/en-us/cli/azure/eventgrid/topic/key?view=azure-cli-latest#az-eventgrid-topic-key-list


### SAS tokens

You include the authentication value in the HTTP header. For SAS, use **aeg-sas-token** for the header value. 

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the event grid topic to which you're sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events?api-version=2019-06-01`. To see all the supported API versions, see [Microsoft.EventGrid resource types](https://docs.microsoft.com/azure/templates/microsoft.eventgrid/allversions). 

You generate the signature from a key.

For example, a valid **aeg-sas-token** value is:

#### Using aeg-sas-token header

```http
aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2feventGrid%2fapi%2fevent&e=6%2f15%2f2017+6%3a20%3a15+PM&s=a4oNHpRZygINC%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

#### Using Authorization header

```azurecli
Authorization: SharedAccessSignature <SAS Token>
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

All events or data written to disk by the Event Grid service are encrypted by a Microsoft-managed key ensuring that it's encrypted at rest. Additionally, the maximum period of time that events or data retained is 24 hours in adherence with the [Event Grid retry policy](delivery-and-retry.md). Event Grid will automatically delete all events or data after 24 hours, or the event time-to-live, whichever is less.

## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md)
