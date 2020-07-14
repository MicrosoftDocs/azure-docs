---
title: Security
titleSuffix: Azure Cognitive Services
description: Learn about the various security considerations for Cognitive Services usage.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: dapine
ms.custom: tracking-python
---

# Azure Cognitive Services security

Security should be considered a top priority when developing any and all applications. With the onset of artificial intelligence enabled applications, security is even more important. In this article various aspects of Azure Cognitive Services security are outlined, such as the use of transport layer security, authentication, securely configuring sensitive data, and Customer Lockbox for customer data access.

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce TLS 1.2. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should adhere to these guidelines:

* The client Operating System (OS) needs to support TLS 1.2
* The language (and platform) used to make the HTTP call need to specify TLS 1.2 as part of the request
  * Depending on the language and platform, specifying TLS is done either implicitly or explicitly

For .NET users, consider the <a href="https://docs.microsoft.com/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Authentication

When discussing authentication, there are several common misconceptions. Authentication and authorization are often confused for one another. Identity is also a major component in security. An identity is a collection of information about a <a href="https://en.wikipedia.org/wiki/Principal_(computer_security)" target="_blank">principal <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Identity providers (IdP) provide identities to authentication services. Authentication is the act of verifying a user's identity. Authorization is the specification of access rights and privileges to resources for a given identity. Several of the Cognitive Services offerings, include role-based access control (RBAC). RBAC could be used to simplify some of the ceremony involved with manually managing principals. For more details, see [role-based access control for Azure resources](../role-based-access-control/overview.md).

For more information on authentication with subscription keys, access tokens and Azure Active Directory (AAD), see <a href="https://docs.microsoft.com/azure/cognitive-services/authentication" target="_blank">authenticate requests to Azure Cognitive Services<span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Environment variables and application configuration

Environment variables are name-value pairs, stored within a specific environment. A more secure alternative to using hardcoded values for sensitive data, is to use environment variables. Hardcoded values are insecure and should be avoided.

> [!CAUTION]
> Do **not** use hardcoded values for sensitive data, doing so is a major security vulnerability.

> [!NOTE]
> While environment variables are stored in plain text, they are isolated to an environment. If an environment is compromised, so too are the variables with the environment.

### Set environment variable

To set environment variables, use one the following commands - where the `ENVIRONMENT_VARIABLE_KEY` is the named key and `value` is the value stored in the environment variable.

# [Command Line](#tab/command-line)

Create and assign persisted environment variable, given the value.

```CMD
:: Assigns the env var to the value
setx ENVIRONMENT_VARIABLE_KEY="value"
```

In a new instance of the **Command Prompt**, read the environment variable.

```CMD
:: Prints the env var value
echo %ENVIRONMENT_VARIABLE_KEY%
```

# [PowerShell](#tab/powershell)

Create and assign persisted environment variable, given the value.

```powershell
# Assigns the env var to the value
[System.Environment]::SetEnvironmentVariable('ENVIRONMENT_VARIABLE_KEY', 'value', 'User')
```

In a new instance of the **Windows PowerShell**, read the environment variable.

```powershell
# Prints the env var value
[System.Environment]::GetEnvironmentVariable('ENVIRONMENT_VARIABLE_KEY')
```

# [Bash](#tab/bash)

Create and assign persisted environment variable, given the value.

```Bash
# Assigns the env var to the value
echo export ENVIRONMENT_VARIABLE_KEY="value" >> /etc/environment && source /etc/environment
```

In a new instance of the **Bash**, read the environment variable.

```Bash
# Prints the env var value
echo "${ENVIRONMENT_VARIABLE_KEY}"

# Or use printenv:
# printenv ENVIRONMENT_VARIABLE_KEY
```

---

> [!TIP]
> After setting an environment variable, restart your integrated development environment (IDE) to ensure that newly added environment variables are available.

### Get environment variable

To get an environment variable, it must be read into memory. Depending on the language you're using, consider the following code snippets. These code snippets demonstrate how to get environment variable given the `ENVIRONMENT_VARIABLE_KEY` and assign to a variable named `value`.

# [C#](#tab/csharp)

For more information, see <a href="https://docs.microsoft.com/dotnet/api/system.environment.getenvironmentvariable" target="_blank">`Environment.GetEnvironmentVariable` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

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

For more information, see <a href="https://docs.microsoft.com/cpp/c-runtime-library/reference/getenv-wgetenv" target="_blank">`getenv` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

```cpp
#include <stdlib.h>

int main()
{
    // Get the named env var, and assign it to the value variable
    auto value =
        getenv("ENVIRONMENT_VARIABLE_KEY");
}
```

# [Java](#tab/java)

For more information, see <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getenv(java.lang.String)" target="_blank">`System.getenv` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

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

For more information, see <a href="https://nodejs.org/api/process.html#process_process_env" target="_blank">`process.env` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

```javascript
// Get the named env var, and assign it to the value variable
const value =
    process.env.ENVIRONMENT_VARIABLE_KEY;
```

# [Python](#tab/python)

For more information, see <a href="https://docs.python.org/2/library/os.html#os.environ" target="_blank">`os.environ` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

```python
import os

# Get the named env var, and assign it to the value variable
value = os.environ['ENVIRONMENT_VARIABLE_KEY']
```

# [Objective-C](#tab/objective-c)

For more information, see <a href="https://developer.apple.com/documentation/foundation/nsprocessinfo/1417911-environment?language=objc" target="_blank">`environment` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

```objectivec
// Get the named env var, and assign it to the value variable
NSString* value =
    [[[NSProcessInfo processInfo]environment]objectForKey:@"ENVIRONMENT_VARIABLE_KEY"];
```

---

## Customer Lockbox

[Customer Lockbox for Microsoft Azure](../security/fundamentals/customer-lockbox-overview.md) provides an interface for customers to review, and approve or reject customer data access requests. It is used in cases where a Microsoft engineer needs to access customer data during a support request. For information on how Customer Lockbox requests are initiated, tracked, and stored for later reviews and audits, see [Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md). 

Customer Lockbox is available for this Cognitive Service:

* Translator

For Language Understanding, Microsoft engineers will not access any customer data in the E0 SKU. To request the ability to use the E0 SKU, fill out and submit the [LUIS Service Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using the E0 SKU with LUIS, you'll need to create a new Language Understanding resource from the Azure portal and select E0 as the Pricing Tier. Users won't be able to upgrade from the F0 to the new E0 SKU.

The Speech service doesn't currently support Customer Lockbox. However, customer data can be stored using BYOS, allowing you to achieve similar data controls to [Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md). Keep in mind that Speech service data stays and is processed in the region where the Speech resource was created. This applies to any data at rest and data in transit. When using customization features, like Custom Speech and Custom Voice, all customer data is transferred, stored, and processed in the same region where your BYOS (if used) and Speech service resource reside.

> [!IMPORTANT]
> Microsoft **does not** use customer data to improve its Speech models. Additionally, if endpoint logging is disabled and no customizations are used, then no customer data is stored. 

## Next steps

* Explore the various [Cognitive Services](welcome.md)
* Learn more about [Cognitive Services Virtual Networks](cognitive-services-virtual-networks.md)
