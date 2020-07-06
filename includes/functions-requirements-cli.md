---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/25/2020
ms.author: glenga
---
## Configure your local environment

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell"  
+ The [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#v2) version 2.7.1846 or a later 2.x version.
::: zone-end  
::: zone pivot="programming-language-python"
+ The Azure Functions Core Tools version that corresponds to your installed Python version:

   | Python version | Core Tools version |
   | -------------- | ------------------ |
   | Python 3.8     | [version 3.x](../articles/azure-functions/functions-run-local.md#v2) |
   | Python 3.6<br/>Python 3.7 | [Version 2.7.1846 or a later version](../articles/azure-functions/functions-run-local.md#v2) |
  
::: zone-end

+ The [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later. 
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
::: zone-end

::: zone pivot="programming-language-python"
+ [Python 3.8 (64-bit)](https://www.python.org/downloads/release/python-382/), [Python 3.7 (64-bit)](https://www.python.org/downloads/release/python-375/), [Python 3.6 (64-bit)](https://www.python.org/downloads/release/python-368/), which are supported by Azure Functions. 
::: zone-end
::: zone pivot="programming-language-powershell"
+ [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-windows)

+ The [.NET Core SDK 2.2+](https://www.microsoft.com/net/download)
::: zone-end
::: zone pivot="programming-language-java"  
+ The [Java Developer Kit](https://aka.ms/azure-jdks), version 8.

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.

> [!IMPORTANT]
> The JAVA_HOME environment variable must be set to the install location of the JDK to complete this quickstart.
::: zone-end
