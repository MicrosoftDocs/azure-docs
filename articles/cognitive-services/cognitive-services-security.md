---
title: Azure Cognitive Services security
titleSuffix: Azure Cognitive Services
description: Learn about the security considerations for Cognitive Services usage.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.date: 08/09/2022
ms.author: pafarley
ms.custom: "devx-track-python, devx-track-js, devx-track-csharp"
---

# Azure Cognitive Services security

Security should be considered a top priority in the development of all applications. With the growth of artificial intelligence enabled applications, security is even more important. This article outlines various aspects of Azure Cognitive Services security, such as the use of transport layer security, authentication, securely configuring sensitive data, and more.

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce the TLS 1.2 protocol. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should follow these guidelines:

* The client Operating System (OS) needs to support TLS 1.2.
* The language (and platform) used to make the HTTP call need to specify TLS 1.2 as part of the request.
  * Depending on the language and platform, specifying TLS is done either implicitly or explicitly.

For .NET users, consider the <a href="/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices </a>.

## Authentication

Authentication is the act of verifying a user's identity. Authorization, by contrast, is the specification of access rights and privileges to resources for a given identity.

An identity is a collection of information about a <a href="https://en.wikipedia.org/wiki/Principal_(computer_security)" target="_blank">principal </a>. Identity providers (IdP) provide identities to authentication services.  Several of the Cognitive Services offerings, include Azure role-based access control (Azure RBAC), can be used to simplify some of the work of manually managing principals. For more information, see [Azure role-based access control for Azure resources](../role-based-access-control/overview.md).

For more information on authentication with subscription keys, access tokens and Azure Active Directory (AAD), see <a href="/azure/cognitive-services/authentication" target="_blank">Authenticate requests to Azure Cognitive Services</a>.

## Environment variables and application configuration

Environment variables are name-value pairs that are stored within a specific development environment. They're a more secure alternative to using hardcoded values for sensitive data.

> [!CAUTION]
> Do not use hardcoded values for sensitive data, doing so is a major security vulnerability.

> [!NOTE]
> While environment variables are stored in plain text, they are isolated to an environment. But if an environment is compromised, then the environment variables are as well.

### Set an environment variable

To set environment variables, use one the following commands, where the `ENVIRONMENT_VARIABLE_KEY` is the named key and `value` is the value stored in the environment variable.

# [Command Line](#tab/command-line)

Use the following command to create and assign a persisted environment variable, given the input value.

```CMD
:: Assigns the env var to the value
setx ENVIRONMENT_VARIABLE_KEY="value"
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

### Use an environment variable

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

For more information, see <a href="/cpp/c-runtime-library/reference/getenv-wgetenv" target="_blank">`getenv` </a>.

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

## Customer Lockbox

Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It's used in cases where a Microsoft engineer needs to access customer data during a support request. For information on how Customer Lockbox requests are initiated, tracked, and stored for later reviews and audits, see the [Customer Lockbox guide](../security/fundamentals/customer-lockbox-overview.md).

Customer Lockbox is available for the following services:

* Translator
* Conversational language understanding
* Custom text classification
* Custom named entity recognition
* Orchestration workflow

For the following services, Microsoft engineers will not access any customer data in the E0 tier:

* Language Understanding
* Face
* Content Moderator
* Personalizer

To request the ability to use the E0 SKU, fill out and submit the [Request form](https://aka.ms/cogsvc-cmk). In approximately 3-5 business days you'll get an update on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once you're approved for using the E0 SKU, you'll need to create a new resource from the Azure portal and select E0 as the Pricing Tier. Users won't be able to upgrade from F0 to the new E0 SKU.

The Speech service doesn't currently support Customer Lockbox. However, customer data can be stored using Bring your own storage (BYOS), allowing you to achieve similar data controls to Customer Lockbox. Keep in mind that Speech service data stays and is processed in the region where the Speech resource was created. This applies to any data at rest and data in transit. For customization features like Custom Speech and Custom Voice, all customer data is transferred, stored, and processed in the same region where the BYOS resouce (if used) and Speech service resource reside.

> [!IMPORTANT]
> Microsoft does not use customer data to improve its Speech models. Additionally, if endpoint logging is disabled and no customizations are used, then no customer data is stored.

## Next steps

* Explore [Cognitive Services](./what-are-cognitive-services.md)