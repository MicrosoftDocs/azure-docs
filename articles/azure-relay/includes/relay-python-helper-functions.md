---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 05/16/2024
ms.author: samurp
---

### Create a Python Script

This script provides helper functions for applications utilizing Azure Relay Hybrid Connections. 
These functions likely assist with tasks like generating SAS tokens and establishing WebSocket 
connections for secure communication.

### Dependencies

Install the following Python libraries using pip before generating the helper function script: `base64`, `hashlib`, `hmac`, `math`, `time`, `urllib`

These libraries can be installed using the following command:

```bash
pip install <package name>
```

### Write the helper function script

Here's what your `relaylib.py` file should look like:

 ```python
import base64
import hashlib
import hmac
import math
import time
import urllib

# Function which generates the HMAC-SHA256 of a given message
def hmac_sha256(key, msg):
    hash_obj = hmac.new(key=key, msg=msg, digestmod=hashlib._hashlib.openssl_sha256)
    return hash_obj.digest()

# Function to create a WebSocket URL for listening for a server application
def createListenUrl(serviceNamespace, entityPath, token = None):
    url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=listen&sb-hc-id=123456'
    if token is not None:
        url = url + '&sb-hc-token=' + urllib.parse.quote(token)
    return url

# Function which creates the url for the client application
def createSendUrl(serviceNamespace, entityPath, token = None):
    url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=connect&sb-hc-id=123456'
    if token is not None:
	url = url + '&sb-hc-token=' + urllib.parse.quote(token)
    return url

# Function which creates the Service Bus SAS token. 
def createSasToken(serviceNamespace, entityPath, sasKeyName, sasKey):
    uri = "http://" + serviceNamespace + "/" + entityPath
    encodedResourceUri = urllib.parse.quote(uri, safe = '')

    # Define the token validity period in seconds (48 hours in this case)   
    tokenValidTimeInSeconds = 60 * 60 * 48 
    unixSeconds = math.floor(time.time())
    expiryInSeconds = unixSeconds + tokenValidTimeInSeconds

    # Create the plain signature string by combining the encoded URI and the expiry time
    plainSignature = encodedResourceUri + "\n" + str(expiryInSeconds)

    # Encode the SAS key and the plain signature as bytes
    sasKeyBytes = sasKey.encode("utf-8")
    plainSignatureBytes = plainSignature.encode("utf-8")
    hashBytes = hmac_sha256(sasKeyBytes, plainSignatureBytes)
    base64HashValue = base64.b64encode(hashBytes)

     # Construct the SAS token string
    token = "SharedAccessSignature sr=" + encodedResourceUri + "&sig=" +  urllib.parse.quote(base64HashValue) + "&se=" + str(expiryInSeconds) + "&skn=" + sasKeyName
    return token
 ```
