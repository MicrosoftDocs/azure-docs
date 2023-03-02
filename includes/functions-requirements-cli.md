---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---
## Configure your local environment

Before you begin, you must have the following requirements in place:

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-cli-dotnet-prerequisites](functions-cli-dotnet-prerequisites.md)]
::: zone-end  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"
+ [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#v2).

+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.
:::zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (16.16.0 and 14.20.0 recommended).
::: zone-end

::: zone pivot="programming-language-python"
+ [Python 3.8 (64-bit)](https://www.python.org/downloads/release/python-382/), [Python 3.7 (64-bit)](https://www.python.org/downloads/release/python-375/), [Python 3.6 (64-bit)](https://www.python.org/downloads/release/python-368/), which are supported by Azure Functions. 
::: zone-end
::: zone pivot="programming-language-powershell"
+ The [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)
::: zone-end
::: zone pivot="programming-language-java"  
+ The [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support) version 8 or 11.

+ [Apache Maven](https://maven.apache.org) version 3.0 or above.

::: zone-end
::: zone pivot="programming-language-other"
+ Development tools for the language you're using. This tutorial uses the [R programming language](https://www.r-project.org/) as an example.
::: zone-end

If you don't have an [Azure subscription](../articles/guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
