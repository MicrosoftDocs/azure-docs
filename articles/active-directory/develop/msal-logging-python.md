---
title: Logging errors and exceptions in MSAL for Python
titleSuffix: Microsoft identity platform
description: Learn how to log errors and exceptions in MSAL for Python
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2021
ms.author: marsma
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---
# Logging in MSAL for Python

[!INCLUDE [MSAL logging introduction](../../../includes/active-directory-develop-error-logging-introduction.md)]

## MSAL for Python logging

Logging in MSAL Python uses the standard Python logging mechanism, for example `logging.info("msg")` You can configure MSAL logging as follows (and see it in action in the [username_password_sample](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/1.0.0/sample/username_password_sample.py#L31L32)):

### Enable debug logging for all modules

By default, the logging in any Python script is turned off. If you want to enable debug logging for all of the modules in your entire Python script, use:

```python
logging.basicConfig(level=logging.DEBUG)
```

### Silence only MSAL logging

To silence only MSAL library logging, while enabling debug logging in all of the other modules in your Python script, turn off the logger used by MSAL Python:

```Python
logging.getLogger("msal").setLevel(logging.WARN)
```

### Personal and organizational data in Python

MSAL for Python does not log personal data or organizational data. There is no property to turn personal or organization data logging on or off.

You can use standard Python logging to log whatever you want, but you are responsible for safely handling sensitive data and following regulatory requirements.

For more information about logging in Python, please refer to Python's  [Logging: how-to](https://docs.python.org/3/howto/logging.html#logging-basic-tutorial).

## Next steps

For more code samples, refer to [Microsoft identity platform code samples](sample-v2-code.md).
