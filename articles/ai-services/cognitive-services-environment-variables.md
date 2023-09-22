---
title: Use environment variables with Azure AI services
titleSuffix: Azure AI services
description: "This guide shows you how to set and retrieve environment variables to handle your Azure AI services subscription credentials in a more secure way when you test out applications."
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: how-to
ms.date: 09/09/2022
ms.author: pafarley
---

# Use environment variables with Azure AI services

This guide shows you how to set and retrieve environment variables to handle your Azure AI services subscription credentials in a more secure way when you test out applications.

## Set an environment variable

To set environment variables, use one the following commands, where the `ENVIRONMENT_VARIABLE_KEY` is the named key and `value` is the value stored in the environment variable.

# [Command Line](#tab/command-line)

Use the following command to create and assign a persisted environment variable, given the input value.

```CMD
:: Assigns the env var to the value
setx ENVIRONMENT_VARIABLE_KEY "value"
```

In a new instance of the Command Prompt, use the following command to read the environment variable.

```CMD
:: Prints the env var value
echo %ENVIRONMENT_VARIABLE_KEY%
```

# [PowerShell](#tab/powershell)

Use the following command to create and assign a persisted environment variable, given the input value.

```powershell
# Assigns the env var to the value
[System.Environment]::SetEnvironmentVariable('ENVIRONMENT_VARIABLE_KEY', 'value', 'User')
```

In a new instance of the Windows PowerShell, use the following command to read the environment variable.

```powershell
# Prints the env var value
[System.Environment]::GetEnvironmentVariable('ENVIRONMENT_VARIABLE_KEY')
```

# [Bash](#tab/bash)

Use the following command to create and assign a persisted environment variable, given the input value.

```Bash
# Assigns the env var to the value
echo export ENVIRONMENT_VARIABLE_KEY="value" >> /etc/environment && source /etc/environment
```

In a new instance of the **Bash**, use the following command to read the environment variable.

```Bash
# Prints the env var value
echo "${ENVIRONMENT_VARIABLE_KEY}"

# Or use printenv:
# printenv ENVIRONMENT_VARIABLE_KEY
```

---

> [!TIP]
> After you set an environment variable, restart your integrated development environment (IDE) to ensure that the newly added environment variables are available.

## Retrieve an environment variable

To use an environment variable in your code, it must be read into memory. Use one of the following code snippets, depending on which language you're using. These code snippets demonstrate how to get an environment variable given the `ENVIRONMENT_VARIABLE_KEY` and assign the value to a program variable named `value`.

# [C#](#tab/csharp)

For more information, see <a href="/dotnet/api/system.environment.getenvironmentvariable" target="_blank">`Environment.GetEnvironmentVariable` </a>.

```csharp
using static System.Environment;

class Program
{
    static void Main()
    {
        // Get the named env var, and assign it to the value variable
        var value =
            GetEnvironmentVariable(
                "ENVIRONMENT_VARIABLE_KEY");
    }
}
```

# [C++](#tab/cpp)

For more information, see <a href="/cpp/c-runtime-library/reference/getenv-s-wgetenv-s" target="_blank">`getenv_s`</a> and <a href="/cpp/c-runtime-library/reference/getenv-wgetenv" target="_blank">`getenv`</a>.

```cpp
#include <iostream> 
#include <stdlib.h>

std::string GetEnvironmentVariable(const char* name);

int main()
{
    // Get the named env var, and assign it to the value variable
    auto value = GetEnvironmentVariable("ENVIRONMENT_VARIABLE_KEY");
}

std::string GetEnvironmentVariable(const char* name)
{
#if defined(_MSC_VER)
    size_t requiredSize = 0;
    (void)getenv_s(&requiredSize, nullptr, 0, name);
    if (requiredSize == 0)
    {
        return "";
    }
    auto buffer = std::make_unique<char[]>(requiredSize);
    (void)getenv_s(&requiredSize, buffer.get(), requiredSize, name);
    return buffer.get();
#else
    auto value = getenv(name);
    return value ? value : "";
#endif
}
```

# [Java](#tab/java)

For more information, see <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getenv(java.lang.String)" target="_blank">`System.getenv` </a>.

```java
import java.lang.*;

public class Program {
   public static void main(String[] args) throws Exception {
    // Get the named env var, and assign it to the value variable
    String value =
        System.getenv(
            "ENVIRONMENT_VARIABLE_KEY")
   }
}
```

# [Node.js](#tab/node-js)

For more information, see <a href="https://nodejs.org/api/process.html#process_process_env" target="_blank">`process.env` </a>.

```javascript
// Get the named env var, and assign it to the value variable
const value =
    process.env.ENVIRONMENT_VARIABLE_KEY;
```

# [Python](#tab/python)

For more information, see <a href="https://docs.python.org/2/library/os.html#os.environ" target="_blank">`os.environ` </a>.

```python
import os

# Get the named env var, and assign it to the value variable
value = os.environ['ENVIRONMENT_VARIABLE_KEY']
```

# [Objective-C](#tab/objective-c)

For more information, see <a href="https://developer.apple.com/documentation/foundation/nsprocessinfo/1417911-environment?language=objc" target="_blank">`environment` </a>.

```objectivec
// Get the named env var, and assign it to the value variable
NSString* value =
    [[[NSProcessInfo processInfo]environment]objectForKey:@"ENVIRONMENT_VARIABLE_KEY"];
```

---

## Next steps

* Explore [Azure AI services](./what-are-ai-services.md) and choose a service to get started.
