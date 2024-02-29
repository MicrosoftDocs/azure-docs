---
title: Getting started with Azure Functions
description: Take the first steps toward working with Azure Functions.
ms.topic: overview
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 12/13/2022
zone_pivot_groups: programming-languages-set-functions-full
---

# Getting started with Azure Functions

[Azure Functions](./functions-overview.md) allows you to implement your system's logic as event-driven, readily available blocks of code. These code blocks are called "functions". This article is to help you find your way to the most helpful Azure Functions content as quickly as possible. For more general information about Azure Functions, see the [Introduction to Azure Functions](./functions-overview.md).

Make sure to choose your preferred development language at the top of the article. 

## Create your first function

Complete one of our quickstart articles to create and deploy your first functions in less than five minutes. 

::: zone pivot="programming-language-csharp"  
You can create C# functions by using one of the following tools:

+ [Visual Studio](./functions-create-your-first-function-visual-studio.md)
+ [Visual Studio Code](./create-first-function-vs-code-csharp.md)
+ [Command line](./create-first-function-cli-csharp.md)

::: zone-end
::: zone pivot="programming-language-java"  
You can create Java functions by using one of the following tools:

+ [Eclipse](functions-create-maven-eclipse.md)
+ [Gradle](functions-create-first-java-gradle.md)
+ [IntelliJ IDEA](functions-create-maven-intellij.md) 
+ [Maven](create-first-function-cli-java.md)
+ [Quarkus](functions-create-first-quarkus.md)
+ [Spring Cloud](/azure/developer/java/spring-framework/getting-started-with-spring-cloud-function-in-azure?toc=/azure/azure-functions/toc.json)
+ [Visual Studio Code](create-first-function-vs-code-java.md) 

::: zone-end
::: zone pivot="programming-language-javascript"  
You can create JavaScript functions by using one of the following tools:

+ [Visual Studio Code](./create-first-function-vs-code-node.md)
+ [Command line](./create-first-function-cli-node.md)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app)

::: zone-end
::: zone pivot="programming-language-powershell"  
You can create PowerShell functions by using one of the following tools:

+ [Visual Studio Code](./create-first-function-vs-code-powershell.md)
+ [Command line](./create-first-function-cli-powershell.md)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app)

::: zone-end
::: zone pivot="programming-language-python"  
You can create Python functions by using one of the following tools:

+ [Visual Studio Code](./create-first-function-vs-code-python.md)
+ [Command line](./create-first-function-cli-python.md)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app) 

::: zone-end
::: zone pivot="programming-language-typescript"  
You can create TypeScript functions by using one of the following tools:

+ [Visual Studio Code](./create-first-function-vs-code-typescript.md)
+ [Command line](./create-first-function-cli-typescript.md)

::: zone-end
::: zone pivot="programming-language-other"  
Besides the natively supported programming languages, you can use [custom handlers](functions-custom-handlers.md) to create functions in any language that supports HTTP primitives. The article [Create a Go or Rust function in Azure using Visual Studio Code](./create-first-function-vs-code-other.md) shows you how to use custom handlers to write your function code in either Rust or Go. 
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript" 
## Review end-to-end samples

::: zone-end
::: zone pivot="programming-language-csharp"  
The following sites let you browse existing C# functions reference projects and samples:  

+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=csharp&products=azure-functions)  
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=C%23)

::: zone-end
::: zone pivot="programming-language-java"  
The following sites let you browse existing Java functions reference projects and samples: 

+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=java&products=azure-functions)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Java)

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
The following sites let you browse existing Node.js functions reference projects and samples: 

+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=javascript%2ctypescript&products=azure-functions)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=JavaScript%2CTypeScript)
 
::: zone-end
::: zone pivot="programming-language-powershell"  
The following sites let you browse existing PowerShell functions reference projects and samples: 

+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=powershell&products=azure-functions)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=PowerShell) 

::: zone-end
::: zone pivot="programming-language-python"
The following sites let you browse existing Python functions reference projects and samples:

+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=python&products=azure-functions)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Python) 
::: zone-end

## Explore an interactive tutorial

Complete one of the following interactive training modules to learn more about Functions:

+ [Choose the best Azure serverless technology for your business scenario](/training/modules/serverless-fundamentals/) 
+ [Well-Architected Framework - Performance efficiency](/training/modules/azure-well-architected-performance-efficiency/)
+ [Execute an Azure Function with triggers](/training/modules/execute-azure-function-with-triggers/)

To learn even more, see the [full listing of interactive tutorials](/training/browse/?expanded=azure&products=azure-functions).
 
## Next steps

::: zone pivot="programming-language-csharp"  
If you're already familiar with developing C# functions, consider reviewing one of the following language reference articles:

+ [In-process C# class library functions](./functions-dotnet-class-library.md)
+ [Isolated worker process C# class library functions](./dotnet-isolated-process-guide.md)
+ [C# Script functions](./functions-reference-csharp.md)

::: zone-end
::: zone pivot="programming-language-java"  
If you're already familiar with developing Java functions, consider reviewing the [language reference](./functions-reference-java.md) article. 
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
If you're already familiar with developing Node.js functions, consider reviewing the [language reference](./functions-reference-node.md) article. 
::: zone-end
::: zone pivot="programming-language-powershell"  
If you're already familiar with developing PowerShell functions, consider reviewing the [language reference](./functions-reference-powershell.md) article. 
::: zone-end
::: zone pivot="programming-language-python"  
If you're already familiar with developing Python functions, consider reviewing the [language reference](./functions-reference-python.md) article. 
::: zone-end
::: zone pivot="programming-language-other"  
Consider reviewing the [custom handlers](functions-custom-handlers.md) documentation. 
::: zone-end

You might also be interested in one of these more advanced articles:

+ [Deploying Azure Functions](./functions-deployment-technologies.md)
+ [Monitoring Azure Functions](./functions-monitoring.md) 
+ [Performance and reliability](./functions-best-practices.md)
+ [Securing Azure Functions](./security-concepts.md)
