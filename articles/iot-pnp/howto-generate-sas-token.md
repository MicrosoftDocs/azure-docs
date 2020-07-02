---
title: Generate security token to access IoT Plug and Play Preview repository | Microsoft Docs
description: Generate a shared access signature token to use when you access an IoT Plug and Play Preview model repository programmatically.
author: Philmea
ms.author: philmea
ms.date: 12/27/2019
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I need to generate shared access signature token to use with model repository APIs.
---

# Generate SAS token

This how-to guide shows you how to programmatically generate a shared access signature (SAS) token to use with the IoT Plug and Play Preview model repository APIs.

## Python

The following snippet shows you how to generate a SAS token using Python:

```python
from base64 import b64decode, b64encode
from hashlib import sha256
from hmac import digest
from time import time
from urllib.parse import quote_plus, urlencode

def calculate_sas_token(hostname, repo_id, key_name, key, expiry_in_second):
    expire = int(time() + expiry_in_second)
    sign_value = "{0}\n{1}\n{2}".format(repo_id, quote_plus(hostname), expire)
    sig = b64encode(digest(b64decode(key), sign_value.encode("utf-8"), sha256))
    token = "SharedAccessSignature " + urlencode({
        "sr": hostname, 
        "sig": sig,
        "se": str(expire),
        "skn": key_name,
        "rid": repo_id
        })
    return token
```

## C\#

The following snippet shows you how to generate a SAS token using C\#:

```csharp
public static string generateSasToken(string hostName, string repoId, string key, string keyName, int expiryInSeconds = 3600)
{
    TimeSpan fromEpochStart = DateTime.UtcNow - new DateTime(1970, 1, 1);
    string expiry = Convert.ToString((int)fromEpochStart.TotalSeconds + expiryInSeconds);

    string stringToSign = repoId + "\n" + WebUtility.UrlEncode(hostName) + "\n" + expiry;

    HMACSHA256 hmac = new HMACSHA256(Convert.FromBase64String(key));
    string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));

    string token = String.Format(
        CultureInfo.InvariantCulture,
        "SharedAccessSignature sr={0}&sig={1}&se={2}&skn={3}&rid={4}",
        WebUtility.UrlEncode(hostName),
        WebUtility.UrlEncode(signature),
        expiry,
        keyName,
        repoId);

    return token;
}
```

## Use the SAS token

After you generate a SAS token, you can use it to make an HTTP POST request. For example:

```text
POST https:///models/{modelId}?repositoryId={repositoryId}&api-version=2019-07-01-preview
```

If you give a client a SAS token, the client doesn't have the resource's primary key, and can't reverse the hash to obtain it. A SAS token gives you control over what the client can access, and for how long. When you change the primary key in the policy, any SAS tokens created from it are invalidated.

## Next steps

Now that you've learned about generating security tokens to use to access the model IoT Plug and Play Preview model repositories, a suggested next step is to learn more in the [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md).
