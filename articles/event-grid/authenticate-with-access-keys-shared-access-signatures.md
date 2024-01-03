---
title: Authenticate Azure Event Grid publishing clients using access keys or shared access signatures
description: This article describes how to authenticate Azure Event Grid publishing clients using access keys and shared access signatures. 
ms.topic: conceptual
ms.custom: build-2023
ms.date: 08/10/2021
---

# Authenticate Azure Event Grid publishing clients using access keys or shared access signatures
This article provides information on authenticating clients that publish events to Azure Event Grid topics, domains, partner namespaces using **access key** or **Shared Access Signature (SAS)** token. 

> [!IMPORTANT]
> - Authenticating and authorizing users or applications using Microsoft Entra identities provides superior security and ease of use over key-based and shared access signatures (SAS) authentication. With Microsoft Entra ID, there is no need to store secrets used for authentication in your code and risk potential security vulnerabilities. We strongly recommend you use Microsoft Entra ID with your Azure Event Grid event publishing applications. For more information, see [Authenticate publishing clients using Microsoft Entra ID](authenticate-with-microsoft-entra-id.md).
> - Microsoft Entra authentication isn't supported for namespace topics. 


## Authenticate using access key
Access key authentication is the simplest form of authentication. You can pass the access key as an HTTP header or a URL query parameter. 

### Access key in an HTTP header
Pass the access key as a value for the HTTP header: `aeg-sas-key`.

```
aeg-sas-key: XXXXXXXXXXXXXXXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### Access key as a query parameter
You can also specify `aeg-sas-key` as a query parameter. 

```
https://<yourtopic>.<region>.eventgrid.azure.net/api/events?aeg-sas-key=XXXXXXXX53249XX8XXXXX0GXXX/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

For instructions on how to get access keys for a topic or domain, see [Get access keys](get-access-keys.md).

## Authenticate using SAS 
SAS tokens for an Event Grid resource include the resource, expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the Event Grid topic to which you're sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/api/events`. To see all the supported API versions, see [Microsoft.EventGrid resource types](/azure/templates/microsoft.eventgrid/allversions). 

First, programmatically generate a SAS token and then use the `aeg-sas-token` header or `Authorization SharedAccessSignature` header to authenticate with Event Grid. 

### Generate SAS token programmatically
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
Here's an example of passing the SAS token as a value for the `aeg-sas-token` header. 

```http
aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2fapi%2fevents&e=6%2f15%2f2017+6%3a20%3a15+PM&s=XXXXXXXXXXXXX%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

### Using Authorization header
Here's an example of passing the SAS token as a value for the `Authorization` header. 

```http
Authorization: SharedAccessSignature r=https%3a%2f%2fmytopic.eventgrid.azure.net%2fapi%2fevents&e=6%2f15%2f2017+6%3a20%3a15+PM&s=XXXXXXXXXXXXX%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

## Next steps
See [Event delivery authentication](security-authentication.md) to learn about authentication with event handlers to deliver events. 
