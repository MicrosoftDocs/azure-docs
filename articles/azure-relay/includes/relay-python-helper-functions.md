---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 05/16/2024
ms.author: samurp
---

### Create a Python Script

This script provides helper functions for applications utilizing Azure Relay Hybrid Connections. 
These functions likely assist with tasks like generating SAS tokens and establishing Websocket 
connections for secure communication.

### Dependencies

1. Install the following Python libraries using pip before running the helper function script

	base64, hashlib, hmac, math, time, urllib

	These can be installed using the following command:

	```bash
	pip install <package name>
	```

### Write the helper function script

1. Import the dependencies into your `relaylib.py` script.

    ```python
    import base64
	import hashlib
	import hmac
	import math
	import time
	import urllib
    ```

3. Add the following code to the `relaylib.py` file. The main script should look like the following code:

    ```python
	def hmac_sha256(key, msg):
		hash_obj = hmac.new(key=key, msg=msg, digestmod=hashlib._hashlib.openssl_sha256)
		return hash_obj.digest()

	def createListenUrl(serviceNamespace, entityPath, token = None):
		url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=listen&sb-hc-id=123456'
		if token is not None:
			url = url + '&sb-hc-token=' + urllib.parse.quote(token)
		return url

	def createSendUrl(serviceNamespace, entityPath, token = None):
		url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=connect&sb-hc-id=123456'
		if token is not None:
			url = url + '&sb-hc-token=' + urllib.parse.quote(token)
		return url

	# Function which creates the Service Bus SAS token. 
	def createSasToken(serviceNamespace, entityPath, sasKeyName, sasKey):
		uri = "http://" + serviceNamespace + "/" + entityPath
		encodedResourceUri = urllib.parse.quote(uri, safe = '')
        
		tokenValidTimeInSeconds = 60 * 60 * 48 # One Hour
		unixSeconds = math.floor(time.time())
		expiryInSeconds = unixSeconds + tokenValidTimeInSeconds

		plainSignature = encodedResourceUri + "\n" + str(expiryInSeconds)
		sasKeyBytes = sasKey.encode("utf-8")
		plainSignatureBytes = plainSignature.encode("utf-8")
		hashBytes = hmac_sha256(sasKeyBytes, plainSignatureBytes)
		base64HashValue = base64.b64encode(hashBytes)

		token = "SharedAccessSignature sr=" + encodedResourceUri + "&sig=" +  urllib.parse.quote(base64HashValue) + "&se=" + str(expiryInSeconds) + "&skn=" + sasKeyName
		return token
    ```
    Here's what your `relaylib.py` file should look like:

    ```python
	import base64
	import hashlib
	import hmac
	import math
	import time
	import urllib

	def hmac_sha256(key, msg):
		hash_obj = hmac.new(key=key, msg=msg, digestmod=hashlib._hashlib.openssl_sha256)
		return hash_obj.digest()

	def createListenUrl(serviceNamespace, entityPath, token = None):
		url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=listen&sb-hc-id=123456'
		if token is not None:
			url = url + '&sb-hc-token=' + urllib.parse.quote(token)
		return url

	def createSendUrl(serviceNamespace, entityPath, token = None):
		url = 'wss://' + serviceNamespace + '/$hc/' + entityPath + '?sb-hc-action=connect&sb-hc-id=123456'
		if token is not None:
			url = url + '&sb-hc-token=' + urllib.parse.quote(token)
		return url

	# Function which creates the Service Bus SAS token. 
	def createSasToken(serviceNamespace, entityPath, sasKeyName, sasKey):
		uri = "http://" + serviceNamespace + "/" + entityPath
		encodedResourceUri = urllib.parse.quote(uri, safe = '')
        
		tokenValidTimeInSeconds = 60 * 60 * 48 # One Hour
		unixSeconds = math.floor(time.time())
		expiryInSeconds = unixSeconds + tokenValidTimeInSeconds

		plainSignature = encodedResourceUri + "\n" + str(expiryInSeconds)
		sasKeyBytes = sasKey.encode("utf-8")
		plainSignatureBytes = plainSignature.encode("utf-8")
		hashBytes = hmac_sha256(sasKeyBytes, plainSignatureBytes)
		base64HashValue = base64.b64encode(hashBytes)

		token = "SharedAccessSignature sr=" + encodedResourceUri + "&sig=" +  urllib.parse.quote(base64HashValue) + "&se=" + str(expiryInSeconds) + "&skn=" + sasKeyName
		return token
    ```
