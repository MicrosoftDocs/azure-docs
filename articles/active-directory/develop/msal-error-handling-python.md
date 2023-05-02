---
title: Handle errors and exceptions in MSAL for Python
description: Learn how to handle errors and exceptions, Conditional Access claims challenges, and retries in MSAL for Python applications.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/16/2023
ms.author: dmwendia
ms.reviewer: saeeda, rayluo
ms.custom: aaddev
---
# Handle errors and exceptions in MSAL for Python

[!INCLUDE [Active directory error handling introduction](../../../includes/active-directory-develop-error-handling-introduction.md)]

## Error handling in MSAL for Python

In MSAL for Python, most errors are conveyed as a return value from the API call. The error is represented as a dictionary containing the JSON response from the Microsoft identity platform.

* A successful response contains the `"access_token"` key. The format of the response is defined by the OAuth2 protocol. For more information, see [5.1 Successful Response](https://tools.ietf.org/html/rfc6749#section-5.1)
* An error response contains `"error"` and usually `"error_description"`. The format of the response is defined by the OAuth2 protocol. For more information, see [5.2 Error Response](https://tools.ietf.org/html/rfc6749#section-5.2)

When an error is returned, the `"error"` key contains a machine-readable code. If the `"error"` is, for example, an `"interaction_required"`, you may prompt the user to provide additional information to complete the authentication process. If the `"error"` is `"invalid_grant"`, you may prompt the user to reenter their credentials. The following snippet is an example of error handling in MSAL for Python.

```python

from msal import ConfidentialClientApplication

authority_url = "https://login.microsoftonline.com/your_tenant_id"
client_id = "your_client_id"
client_secret = "your_client_secret"
scopes = ["https://graph.microsoft.com/.default"]

app = ConfidentialClientApplication(client_id, authority=authority_url, client_credential=client_secret)

result = app.acquire_token_silent(scopes=scopes, account=None)

if not result:
    result = app.acquire_token_silent(scopes=scopes)

if "access_token" in result:
    print("Access token: %s" % result["access_token"])
else:
    print("Error: %s" % result.get("error"))

```

When an error is returned, the `"error_description"` key also contains a human-readable message, and there is typically also an `"error_code"` key which contains a machine-readable Microsoft identity platform error code. For more information about the various Microsoft identity platform error codes, see [Authentication and authorization error codes](./reference-error-codes.md).

In MSAL for Python, exceptions are rare because most errors are handled by returning an error value. The `ValueError` exception is only thrown when there's an issue with how you're attempting to use the library, such as when API parameter(s) are malformed.

[!INCLUDE [Active directory error handling claims challenges](../../../includes/active-directory-develop-error-handling-claims-challenges.md)]

[!INCLUDE [Active directory error handling retries](../../../includes/active-directory-develop-error-handling-retries.md)]

## Next steps

Consider enabling [Logging in MSAL for Python](msal-logging-python.md) to help you diagnose and debug issues.
