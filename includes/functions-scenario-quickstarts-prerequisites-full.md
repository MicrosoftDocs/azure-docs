---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/02/2025
ms.author: glenga
---

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. This extension requires [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md). When this tool isn't available locally, the extension tries to install it by using a package-based installer. You can also install or update the Core Tools package by running `Azure Functions: Install or Update Azure Functions Core Tools` from the command palette. If you don't have npm or Homebrew installed on your local computer, you must instead [manually install or update Core Tools](../articles/azure-functions/functions-run-local.md#install-the-azure-functions-core-tools).
::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download)

+ [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  
::: zone-end  
::: zone pivot="programming-language-java"  
+ The [Java Development Kit](/azure/developer/java/fundamentals/java-support-on-azure), version 8, 11, 17 or 21 (Linux).

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.

+ The [Java extension pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)       
::: zone-end  
::: zone pivot="programming-language-typescript"  
+ [Node.js 18.x](https://nodejs.org/en/about/previous-releases) or above. Use the `node --version` command to check your version.
::: zone-end 
::: zone pivot="programming-language-powershell"  
+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows)

+ [.NET 6.0 runtime](https://dotnet.microsoft.com/download/dotnet)     

+ The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell).  
::: zone-end
::: zone pivot="programming-language-python" 
+ Python versions that are [supported by Azure Functions](../articles/azure-functions/supported-languages.md#languages-by-runtime-version). For more information, see [How to install Python](https://wiki.python.org/moin/BeginnersGuide/Download).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
+ The [Azure Developer CLI extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev) for Visual Studio Code.
::: zone-end 