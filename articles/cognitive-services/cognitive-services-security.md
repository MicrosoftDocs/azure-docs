---
title: Security
titleSuffix: Azure Cognitive Services
description: Learn about the various security considerations for Cognitive Services usage.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: dapine
---

# Azure Cognitive Services security

< TODO: Add introduction details, consider changing title? >

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce TLS 1.2. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should adhere to guidelines:

* The client Operating System (OS) would need to support TLS 1.2
* The language (and platform) used to make the HTTP call would need to specify TLS 1.2 as part of the request
  * Depending on the language and platform, specifying TLS is done either implicitly or explicitly

For .NET users, consider the <a href="https://docs.microsoft.com/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Authentication

When discussing authentication, there are several common misconceptions. Authentication and authorization are often confused for one another. Identity is also a major component in security. An identity is a collection of information about a <a href="https://en.wikipedia.org/wiki/Principal_(computer_security)" target="_blank">principal <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Identity providers (IdP) provide identities to authentication services. Authentication is the act of verifying a user's identity. Authorization is the specification of access rights and privileges to resources for a given identity.

< TODO: Add more details about authentication with Cog Svcs >

## Environment variables and application configuration

Environment variables are name-value pairs, stored within a specific environment. An alternative to using hardcoded values for sensitive data, is to use environment variables. Hardcoded values are insecure and should be avoided.

### Set environment variable

To set environment variables, use one the following commands - where the `ENVIRONMENT_VARIABLE_KEY` is the named key and `value` is the value stored in the environment variable.

# [Command Line](#tab/command-line)

```CMD
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

```Bash
# Assigns the env var to the value
export ENVIRONMENT_VARIABLE_KEY=value

# Prints the env var value
echo ENVIRONMENT_VARIABLE_KEY
```

---

> [!TIP]
> After setting an environment variable, restart your integrated development environment (IDE) to ensure that newly added environment variables are available.

### Get environment variable

To get an environment variable, it must be read into memory. Depending on the language you're using, consider the following code snippets. These code snippets demonstrate how to get environment variable given the `ENVIRONMENT_VARIABLE_KEY` and assign to a variable named `value`.

# [C#](#tab/csharp)

```csharp
// Get the named env var, and assign it to the value variable
var value =
    Environment.GetEnvironmentVariable(
        "ENVIRONMENT_VARIABLE_KEY");
```

# [C++](#tab/cpp)

```cpp
// Get the named env var, and assign it to the value variable
auto value =
    getenv("ENVIRONMENT_VARIABLE_KEY");
```

# [Java](#tab/java)

```java
// Get the named env var, and assign it to the value variable
String value =
    System.getenv(
        "ENVIRONMENT_VARIABLE_KEY")
```

# [Node.js](#tab/node-js)

```javascript
// Get the named env var, and assign it to the value variable
const value =
    process.env.ENVIRONMENT_VARIABLE_KEY;
```

# [Python](#tab/python)

```python
import os

# Get the named env var, and assign it to the value variable
value = os.environ['ENVIRONMENT_VARIABLE_KEY']
```

# [Objective-C](#tab/objective-c)

```objectivec
// Get the named env var, and assign it to the value variable
NSString* value =
    [[[NSProcessInfo processInfo]environment]objectForKey:@"ENVIRONMENT_VARIABLE_KEY"];
```

---

For more information, see <a href="https://docs.microsoft.com/azure/azure-app-configuration/overview" target="_blank">Azure App Configuration <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Next steps

* Explore the various [Cognitive Services](welcome.md)
* Learn more about [Cognitive Services Virtual Networks](cognitive-services-virtual-networks.md)
