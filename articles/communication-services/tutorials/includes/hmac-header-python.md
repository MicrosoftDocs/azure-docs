---
title: Sign an HTTP request with Python
description: This tutorial explains the Python version of signing an HTTP request with an HMAC signature for Azure Communication Services.
author: maximrytych-ms
manager: anitharaju
services: azure-communication-services

ms.author: maximrytych
ms.date: 08/05/2022
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites

Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Download and install [Python](https://www.python.org/).
- Download and install [Visual Studio Code](https://code.visualstudio.com/).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md). You'll need to record your **resourceEndpoint** and **resourceAccessKey** for this tutorial.

## Sign an HTTP request with Python

Access key authentication uses a shared secret key to generate an HMAC signature for each HTTP request. This signature is generated with the SHA256 algorithm and is sent in the `Authorization` header by using the `HMAC-SHA256` scheme. For example:

```
Authorization: "HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"
```

The `hmac-sha256-signature` consists of:

- HTTP verb (for example, `GET` or `PUT`)
- HTTP request path
- x-ms-date
- Host
- x-ms-content-sha256

## Setup

The following steps describe how to construct the authorization header.

### Create a new Python script

Open Visual Studio Code and create a new file named `SignHmacTutorial.py`. Save this file to a known folder.

## Add necessary imports

Update the `SignHmacTutorial.py` script with the following code to begin.

```python
import json
import requests
import hashlib
import base64
import datetime
import hmac
from wsgiref.handlers import format_date_time
from datetime import datetime
from time import mktime
```

## Prepare data for the request

For this example, we'll sign a request to create a new identity by using the Communication Services Authentication API (version `2021-03-07`).

Add the following code to the `SignHmacTutorial.py` script.

```python
host = "resourceEndpointName"
resource_endpoint = f"https://{host}"
path_and_query = "/identities?api-version=2021-03-07"
secret = "resourceEndpointSecret"

# Create a uri you are going to call.
request_uri = f"{resource_endpoint}{path_and_query}"

# Endpoint identities?api-version=2021-03-07 accepts list of scopes as a body.
scopes = ["chat"]

serialized_body = json.dumps(scopes)
content = serialized_body.encode("utf-8")
```

Replace `resourceEndpointName` with your real resource endpoint name value.
Replace `resourceEndpointSecret` with your real resource endpoit secret value.

## Create a content hash

The content hash is a part of your HMAC signature. Use the following code to compute the content hash. You can add this method to `SignHmacTutorial.py` script.

```python
def compute_content_hash(content):
    sha_256 = hashlib.sha256()
    sha_256.update(content)
    hashed_bytes = sha_256.digest()
    base64_encoded_bytes = base64.b64encode(hashed_bytes)
    content_hash = base64_encoded_bytes.decode('utf-8')
    return content_hash
```

## Compute a signature

Use the following code to create a method for computing your HMAC signature.

```python
def compute_signature(string_to_sign, secret):
    decoded_secret = base64.b64decode(secret)
    encoded_string_to_sign = string_to_sign.encode('ascii')
    hashed_bytes = hmac.digest(decoded_secret, encoded_string_to_sign, digest=hashlib.sha256)
    encoded_signature = base64.b64encode(hashed_bytes)
    signature = encoded_signature.decode('utf-8')
    return signature
```

## Create an authorization header string

We'll now construct the string that we'll add to our authorization header.

1. Prepare values for the headers to be signed.
   1. Specify the current timestamp using the Coordinated Universal Time (UTC) timezone.
   1. Get the request authority (DNS host name or IP address and the port number).
   1. Compute a content hash.
1. Prepare a string to sign.
1. Compute the signature.
1. Concatenate the string, which will be used in the authorization header.
 
Add the following code to the `SignHmacTutorial.py` script.

```python
# Specify the 'x-ms-date' header as the current UTC timestamp according to the RFC1123 standard
now = datetime.now()
stamp = mktime(now.timetuple())
date = format_date_time(stamp)
# Compute a content hash for the 'x-ms-content-sha256' header.
content_hash = compute_content_hash(content)

# Prepare a string to sign.
string_to_sign = f"POST\n{path_and_query}\n{date};{host};{content_hash}"
# Compute the signature.
signature = compute_signature(string_to_sign, secret)
# Concatenate the string, which will be used in the authorization header.
authorization_header = f"HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature={signature}"
```

## Add headers

Use the following code to add the required headers.

```python
request_headers = {}

# Add content type header.
request_headers["Content-Type"] = "text/plain; charset=utf-8"

# Add a date header.
request_headers["x-ms-date"] = date

# Add content hash header.
request_headers["x-ms-content-sha256"] = content_hash

# Add authorization header.
request_headers["Authorization"] = authorization_header
```

## Test the client

Call the endpoint by using `Requests`, and check the response.

```python
response = requests.post(request_uri, data=content, headers=request_headers)
response_string = response.content.decode("utf-8")
print(response_string)
```
