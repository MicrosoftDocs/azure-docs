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
ms.date: 11/26/2020
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

When an error is returned, the `"error_description"` key contains a human-readable message; which in turn typically contains a Microsoft identity platform error code. For details about the various error codes, see [Authentication and authorization error codes](./reference-aadsts-error-codes.md).

In MSAL for Python, exceptions are rare because most errors are handled by returning an error value. The `ValueError` exception is only thrown when there is an issue with how you are attempting to use the library, such as when API parameter(s) are malformed.

[!INCLUDE [Active directory error handling claims challenges](../../../includes/active-directory-develop-error-handling-claims-challenges.md)]

[!INCLUDE [Active directory error handling retries](../../../includes/active-directory-develop-error-handling-retries.md)]

## Next steps

Consider enabling [Logging in MSAL for Python](msal-logging-python.md) to help you diagnose and debug issues.
