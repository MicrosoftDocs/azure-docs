---
title: Cognitive Services Security
titleSuffix: Azure Cognitive Services
description: Learn about the various security considerations for Cognitive Services usage.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/13/2020
ms.author: dapine
---

# Cognitive Services Security

< Add introduction details, consider changing title? >

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce TLS 1.2. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should adhere to guidelines:

* The client Operating System (OS) would need to support TLS 1.2
* The language (and platform) used to make the HTTP call would need to specify TLS 1.2 as part of the request
    * Depending on the language and platform, this can be done either implicitly or explicitly

For .NET users, consider the <a href="https://docs.microsoft.com/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Authentication

< Add introduction details, consider changing title? >

## Environment variables and application configuration

An alternative to using hardcoded values for sensitive data, is to use environment variables. Hardcoded values are insecure and should be avoided.

### Set environment variable

To set environment variables, use one the following commands where the `ENVIRONMENT_VARIABLE_KEY` is the key and `value` is the value to store in the environment variable.

# [Command Line](#tab/command-line)

```cmd
:: Assigns the env var to the value
set ENVIRONMENT_VARIABLE_KEY=value

:: Prints the env var value
echo %ENVIRONMENT_VARIABLE_KEY%
```

# [PowerShell](#tab/powershell)

```powershell
# Assigns the env var to the value
$Env:ENVIRONMENT_VARIABLE_KEY="value"

# Prints the env var value
$Env:ENVIRONMENT_VARIABLE_KEY
```

# [Bash](#tab/bash)

```bash
# Assigns the env var to the value
export ENVIRONMENT_VARIABLE_KEY=value

# Prints the env var value
echo ENVIRONMENT_VARIABLE_KEY
```

---

### Get environment variable

# [C#](#tab/csharp)

```csharp
var value =
    Environment.GetEnvironmentVariable(
        "ENVIRONMENT_VARIABLE_KEY");
```

# [C++](#tab/cpp)

```cpp
auto value =
    getenv("ENVIRONMENT_VARIABLE_KEY");
```

# [Java](#tab/java)

```java
String value =
    System.getenv(
        "ENVIRONMENT_VARIABLE_KEY")
```

# [Node.js](#tab/node-js)

```javascript
const value =
    process.env.ENVIRONMENT_VARIABLE_KEY;
```

# [Python](#tab/python)

```python
import os

value = os.environ['ENVIRONMENT_VARIABLE_KEY']
```

---

For more information, see <a href="https://docs.microsoft.com/azure/azure-app-configuration/overview" target="_blank">Azure App Configuration <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Next steps

* Explore the various [Cognitive Services](welcome.md)
* Learn more about [Cognitive Services Virtual Networks](cognitive-services-virtual-networks.md)
