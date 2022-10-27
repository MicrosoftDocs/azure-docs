---
title: Logging errors and exceptions in MSAL for Python
description: Learn how to log errors and exceptions in MSAL for Python
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2021
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---
# Logging in MSAL for Python

[!INCLUDE [MSAL logging introduction](../../../includes/active-directory-develop-error-logging-introduction.md)]

## MSAL for Python logging

Logging in MSAL for Python leverages the [logging module in the Python standard library](https://docs.python.org/3/library/logging.html). You can configure MSAL logging as follows (and see it in action in the [username_password_sample](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/1.0.0/sample/username_password_sample.py#L31L32)):

### Enable debug logging for all modules

By default, the logging in any Python script is turned off. If you want to enable verbose logging for **all** Python modules in your script, use `logging.basicConfig` with a level of `logging.DEBUG`:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
```

This will print all log messages given to the logging module to the standard output.

### Configure MSAL logging level

You can configure the logging level of the MSAL for Python log provider by using the `logging.getLogger()` method with the logger name `"msal"`:

```python
import logging

logging.getLogger("msal").setLevel(logging.WARN)
```

### Configure MSAL logging with Azure App Insights

Python logs are given to a log handler, which by default is the `StreamHandler`. To send MSAL logs to an Application Insights with an Instrumentation Key, use the `AzureLogHandler` provided by the `opencensus-ext-azure` library.

To install, `opencensus-ext-azure` add the `opencensus-ext-azure` package from PyPI to your dependencies or pip install:

```console
pip install opencensus-ext-azure
```

Then change the default handler of the `"msal"` log provider to an instance of `AzureLogHandler` with an instrumentation key set in the `APP_INSIGHTS_KEY` environment variable:

```python
import logging
import os

from opencensus.ext.azure.log_exporter import AzureLogHandler

APP_INSIGHTS_KEY = os.getenv('APP_INSIGHTS_KEY')

logging.getLogger("msal").addHandler(AzureLogHandler(connection_string='InstrumentationKey={0}'.format(APP_INSIGHTS_KEY))
```

### Personal and organizational data in Python

MSAL for Python does not log personal data or organizational data. There is no property to turn personal or organization data logging on or off.

You can use standard Python logging to log whatever you want, but you are responsible for safely handling sensitive data and following regulatory requirements.

For more information about logging in Python, please refer to Python's  [Logging: how-to](https://docs.python.org/3/howto/logging.html#logging-basic-tutorial).

## Next steps

For more code samples, refer to [Microsoft identity platform code samples](sample-v2-code.md).
