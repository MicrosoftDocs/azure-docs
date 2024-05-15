---
title: Authenticate Azure Event Grid clients using access keys or shared access signatures
description: This article describes how to authenticate Azure Event Grid clients using access keys and shared access signatures. 
ms.topic: conceptual
ms.custom: build-2024
ms.date: 05/08/2024
ms.author: robece
---

# Authenticate Azure Event Grid clients using access keys or shared access signatures (Preview)

This article provides information on authenticating clients to Azure Event Namespace Topics, custom topics, domains, and partner namespaces using **access key** or **Shared Access Signature (SAS)** token.

> [!IMPORTANT]
> - Authenticating and authorizing users or applications using Microsoft Entra identities provides superior security and ease of use over key-based and shared access signatures (SAS) authentication. With Microsoft Entra ID, there is no need to store secrets used for authentication in your code and risk potential security vulnerabilities. We strongly recommend using Microsoft Entra ID with your applications.

## Authenticate using access key

Access key authentication is the simplest form of authentication. You can pass the access key as an HTTP header or a URL query parameter.

### Access key in an HTTP header

Pass the access key as a value for the HTTP header: `aeg-sas-key`.

```
aeg-sas-key: XXXXXXXXXXXXXXXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### Access key as a query parameter
You can also specify `aeg-sas-key` as a query parameter.

For example, for namespace topics this is the way your HTTP request URL could look passing a key as a parameter.
```
https://<namespace_name>.<region>.eventgrid.azure.net/topics/<topic_name>:publish?aeg-sas-key=XXXXXXXX53249XX8XXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

For custom topics, domains, and partner namespaces, your HTTP request URL should look like the following:  

```
https://<yourtopic>.<region>.eventgrid.azure.net/api/events?aeg-sas-key=XXXXXXXX53249XX8XXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

## Shared Access Signatures

Shared Access Signatures (SAS) provides you with access control over resources with which clients can communicate. Here are some of the controls you can set in a SAS:

- Set a SAS expiration time. This value effectively defines the interval over which the SAS is valid can be used for authentication.
- The resource for which a SAS can be used. SAS token can be created to access custom topics, domains, partner namespaces, and namespaces. If you create a SAS for a custom topic, domain, or partner namespace, a client can use it to publish events to any one of those resources. When you create a SAS for namespace resources, you have granular control over what a client can access. If you create a SAS whose resource is a namespace, a client can publish events to any namespace topic inside the namespace and can receive events from any event subscription on any of the namespace's topics. Similarly, when you create a SAS for a namespace topic, a client can publish events to that namespace topic and receive events from any event subscription on that topic. When a SAS is created for an event subscription, the client can receive events through that event subscription.
- Only clients that present a valid SAS can send or receive data to Event Grid.

## Shared Access Signature token

You can generate a SAS token to be included when your client application communicates with Event Grid. SAS tokens for Event Grid resources are `Base64` encoded strings with the following format: `r={resource}&e={expiration_utc}&s={signature}`.

- `{resource}` is the URL that represents the Event Grid resource the client accesses.
  - The valid URL format for custom topics, domains, and partner namespaces is `https://<yourtopic>.<region>.eventgrid.azure.net/api/events`.
  - The valid format for namespace resources is as follows:
    - Namespaces: ``https://<namespace-name>.<region>.eventgrid.azure.net``
    - Namespace topics: ``https://<namespace_name>.<region>.eventgrid.azure.net/topics/<topic_name>``
    - Event subscriptions: ``https://<namespace_name>.<region>.eventgrid.azure.net/topics/<topic_name>/eventsubscriptions/<event_subscription_name>``
- ``{expiration_utc}`` is the SAS' URL encoded UTC expiration time.
- ``{signature}`` is the SHA-256 hash computed over the resource URI and the string representation of the token expiry instant, separated by CRLF. The hash computation looks similar to the following pseudo code and returns a 256-bit/32-byte hash value.

```
SHA-256('https://<namespace_name>.eventgrid.azure.net/'+'\n'+ 1438205742)
```

The token contains the non-hashed values so that the recipient (Event Grid) can recompute the hash with the same parameters, verifying that the token hasn't been modified (data integrity).

A SAS token is valid for all resources prefixed with the resource URI used in the signature string.

To consult all the supported API versions when using Event Grid, see [Microsoft.EventGrid resource types](/azure/templates/microsoft.eventgrid/allversions).

## Authenticate using SAS

Your application can authenticate before an Event Grid resource by presenting a SAS token. This can be done by using the `aeg-sas-token` header or the `Authorization SharedAccessSignature` header with an HTTP request. The following sections describe the way to generate a SAS token and how to use it when your client application makes HTTP requests to send or receive (pull delivery) events.

### Generate SAS token programmatically

The following C# and Python examples show you how to create a SAS token for use with Event Grid:

**C# example**

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

**Python example**

```python
def generate_sas_token(uri, key, expiry=3600):
    ttl = datetime.datetime.utcnow() + datetime.timedelta(seconds=expiry)
    encoded_resource = urllib.parse.quote_plus(uri)
    encoded_expiration_utc = urllib.parse.quote_plus(ttl.isoformat())

    unsigned_sas = f'r={encoded_resource}&e={encoded_expiration_utc}'
    signature = b64encode(HMAC(b64decode(key), unsigned_sas.encode('utf-8'), sha256).digest())
    encoded_signature = urllib.parse.quote_plus(signature)
    
    token = f'r={encoded_resource}&e={encoded_expiration_utc}&s={encoded_signature}'

    return token
```

### Using aeg-sas-token header

Here's an example that shows how to pass a SAS token as a value for the `aeg-sas-token` header.

```http
aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2fapi%2fevents&e=6%2f15%2f2017+6%3a20%3a15+PM&s=XXXXXXXXXXXXX%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

### Using Authorization header

This example shows how to pass a SAS token as a value for the `Authorization` header.

```http
Authorization: SharedAccessSignature r=https%3a%2f%2fmytopic.eventgrid.azure.net%2fapi%2fevents&e=6%2f15%2f2017+6%3a20%3a15+PM&s=XXXXXXXXXXXXX%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

## Next steps

- [Send events to your custom topic](custom-event-quickstart.md).
- [Publish events to namespace topics using Java](publish-events-to-namespace-topics-java.md)
- [Receive events using pull delivery with Java](receive-events-from-namespace-topics-java.md)