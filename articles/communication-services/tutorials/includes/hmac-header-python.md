---
title: Sign an HTTP Request with Python
description: This article describes how to use Python to sign an HTTP request with an HMAC signature for Azure Communication Services.
author: maximrytych-ms
manager: anitharaju
services: azure-communication-services

ms.author: maximrytych
ms.date: 08/05/2022
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites

- Create an Azure account with an active subscription. If you don't have an Azure subscription, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Download and install [Python](https://www.python.org/).
- Download and install [Visual Studio Code](https://code.visualstudio.com/) or another integrated development environment (IDE) that supports Python.
- Create an Azure Communication Services resource. If you don't have a resource, see [Create a Communication Services resource](../../quickstarts/create-communication-resource.md). You need your `resource_endpoint_name` and `resource_endpoint_secret` parameters for this example.

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

## Set up the authorization header

Complete following steps to construct the authorization header.

### Create a new Python script

Open Visual Studio Code or another IDE or editor of your choice. Create a new file named `sign_hmac_tutorial.py`. Save this file to a known folder.

## Add necessary imports

Update the `sign_hmac_tutorial.py` script with the following code to begin.

```python
import base64
import hashlib
import hmac
import json
from datetime import datetime, timezone
from urllib import request
```

## Prepare data for the request

For this example, you sign a request to create a new identity by using the Communication Services Authentication API [(version `2021-03-07`)](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/communication/data-plane/Identity/stable/2021-03-07).

Add the following code to the `sign_hmac_tutorial.py` script.

- Replace `resource_endpoint_name` with your real resource endpoint name value. You can find this value in the **Overview** section of your Communication Services resource. It's the value of `Endpoint` after `https://`.
- Replace `resource_endpoint_secret` with your real resource endpoint secret value. You can find this value in the **Keys** section of your Communication Services resource. It's the value of **Key**, which is either primary or secondary.

```python
host = "resource_endpoint_name"
resource_endpoint = f"https://{host}"
path_and_query = "/identities?api-version=2021-03-07"
secret = "resource_endpoint_secret"

# Create a uri you are going to call.
request_uri = f"{resource_endpoint}{path_and_query}"

# Endpoint identities?api-version=2021-03-07 accepts the list of scopes as a body.
body = { "createTokenWithScopes": ["chat"] }

serialized_body = json.dumps(body)
content = serialized_body.encode("utf-8")
```

## Create a content hash

The content hash is a part of your HMAC signature. Use the following code to compute the content hash. You can add this method to the `sign_hmac_tutorial.py` script.

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
    encoded_string_to_sign = string_to_sign.encode('utf-8')
    hashed_bytes = hmac.digest(decoded_secret, encoded_string_to_sign, digest=hashlib.sha256)
    encoded_signature = base64.b64encode(hashed_bytes)
    signature = encoded_signature.decode('utf-8')
    return signature
```

## Get a current UTC timestamp according to the RFC1123 standard

Use the following code to get the date format that you want that's independent of locale settings.

```python
def format_date(dt):
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    utc = dt.utctimetuple()

    return "{}, {:02} {} {:04} {:02}:{:02}:{:02} GMT".format(
    days[utc.tm_wday],
    utc.tm_mday,
    months[utc.tm_mon-1],
    utc.tm_year,
    utc.tm_hour, 
    utc.tm_min, 
    utc.tm_sec)
```

## Create an authorization header string

Now you construct the string that you add to your authorization header.

1. Prepare values for the headers to be signed.
   1. Specify the current timestamp by using the Coordinated Universal Time (UTC) timezone.
   1. Get the request authority. Use the Domain Name System (DNS) host name or IP address and the port number.
   1. Compute a content hash.
1. Prepare a string to sign.
1. Compute the signature.
1. Concatenate the string, which is used in the authorization header.

Add the following code to the `sign_hmac_tutorial.py` script.

```python
# Specify the 'x-ms-date' header as the current UTC timestamp according to the RFC1123 standard.
utc_now = datetime.now(timezone.utc)
date = format_date(utc_now)
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

# Add a date header.
request_headers["x-ms-date"] = date

# Add a content hash header.
request_headers["x-ms-content-sha256"] = content_hash

# Add an authorization header.
request_headers["Authorization"] = authorization_header

# Add a content type header.
request_headers["Content-Type"] = "application/json"
```

## Test the client

Call the endpoint and check the response.

```python
req = request.Request(request_uri, content, request_headers, method='POST')
with request.urlopen(req) as response:
  response_string = json.load(response)
print(response_string)
```
