---
title: Getting started with Azure Functions
description: Take the first steps toward working with Azure Functions.
ms.topic: overview
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 09/18/2024
zone_pivot_groups: programming-languages-set-functions-full
---

# Getting started with Azure Functions

[Azure Functions](./functions-overview.md) allows you to implement your system's logic as event-driven, readily available blocks of code. These code blocks are called "functions". This article is to help you find your way to the most helpful Azure Functions content as quickly as possible. For more general information about Azure Functions, see the [Introduction to Azure Functions](./functions-overview.md).

Make sure to choose your preferred development language at the top of the article. 

## Create your first function

Complete one of our quickstart articles to create and deploy your first functions in less than five minutes. 

::: zone pivot="programming-language-csharp"  
You can create C# functions by using one of the following tools:

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-csharp)
+ [Command line](./create-first-function-cli-csharp.md)
+ [Visual Studio](./functions-create-your-first-function-visual-studio.md)
+ [Visual Studio Code](./create-first-function-vs-code-csharp.md)


::: zone-end
::: zone pivot="programming-language-java"  
You can create Java functions by using one of the following tools:

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-java)
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

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-javascript)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app)
+ [Command line](./create-first-function-cli-node.md)
+ [Visual Studio Code](./create-first-function-vs-code-node.md)

::: zone-end
::: zone pivot="programming-language-powershell"  
You can create PowerShell functions by using one of the following tools:

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-powershell)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app)
+ [Command line](./create-first-function-cli-powershell.md)
+ [Visual Studio Code](./create-first-function-vs-code-powershell.md)

::: zone-end
::: zone pivot="programming-language-python"  
You can create Python functions by using one of the following tools:

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-python)
+ [Azure portal](./functions-create-function-app-portal.md#create-a-function-app)
+ [Command line](./create-first-function-cli-python.md)
+ [Visual Studio Code](./create-first-function-vs-code-python.md)

::: zone-end
::: zone pivot="programming-language-typescript"  
You can create TypeScript functions by using one of the following tools:

+ [Azure Developer CLI (azd)](create-first-function-azure-developer-cli.md?pivots=programming-language-typescript)
+ [Command line](./create-first-function-cli-typescript.md)
+ [Visual Studio Code](./create-first-function-vs-code-typescript.md)

::: zone-end
::: zone pivot="programming-language-other"  
Besides the natively supported programming languages, you can use [custom handlers](functions-custom-handlers.md) to create functions in any language that supports HTTP primitives. The article [Create a Go or Rust function in Azure using Visual Studio Code](./create-first-function-vs-code-other.md) shows you how to use custom handlers to write your function code in either Rust or Go. 
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript" 
## Review end-to-end samples

These sites let you browse existing functions reference projects and samples in your desired language:
::: zone-end
::: zone pivot="programming-language-csharp"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=dotnetCsharp)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=C%23)
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=csharp&products=azure-functions) 
::: zone-end
::: zone pivot="programming-language-java"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=java)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Java)
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=java&products=azure-functions)
::: zone-end
::: zone pivot="programming-language-javascript"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=javascript)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=JavaScript)
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=javascript&products=azure-functions)
::: zone-end
::: zone pivot="programming-language-typescript"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=typescript)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=TypeScript)
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=typescript&products=azure-functions)
::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=powershell)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=PowerShell) 
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=powershell&products=azure-functions)
::: zone-end  
::: zone pivot="programming-language-python"  
+ [Awesome azd template library](https://azure.github.io/awesome-azd/?tags=functions&tags=python)
+ [Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Python) 
+ [Azure Samples Browser](/samples/browse/?expanded=azure&languages=python&products=azure-functions)
::: zone-end  

## Explore an interactive tutorial

Complete one of the following interactive training modules to learn more about Functions:

+ [Choose the best Azure serverless technology for your business scenario](/training/modules/serverless-fundamentals/) 
+ [Well-Architected Framework - Performance efficiency](/training/modules/azure-well-architected-performance-efficiency/)
+ [Execute an Azure Function with triggers](/training/modules/execute-azure-function-with-triggers/)

To learn even more, see the [full listing of interactive tutorials](/training/browse/?expanded=azure&products=azure-functions).
 
## Related content

::: zone pivot="programming-language-csharp"  
Learn more about developing functions by reviewing one of these C# reference articles:

+ [In-process C# class library functions](./functions-dotnet-class-library.md)
+ [Isolated worker process C# class library functions](./dotnet-isolated-process-guide.md)
::: zone-end
::: zone pivot="programming-language-java"  
Learn more about developing functions by reviewing the [Java language reference](./functions-reference-java.md) article. 
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
Learn more about developing functions by reviewing the [Node.js language reference](./functions-reference-node.md) article. 
::: zone-end
::: zone pivot="programming-language-powershell"  
Learn more about developing functions by reviewing the [PowerShell language reference](./functions-reference-powershell.md) article. 
::: zone-end
::: zone pivot="programming-language-python"  
Learn more about developing functions by reviewing the [Python language reference](./functions-reference-python.md) article. 
::: zone-end
::: zone pivot="programming-language-other"  
Learn more about developing functions using Rust, Go, and other languages by reviewing the [custom handlers](functions-custom-handlers.md) documentation. 
::: zone-end

You might also be interested in these articles:

+ [Deploying Azure Functions](./functions-deployment-technologies.md)
+ [Monitoring Azure Functions](./functions-monitoring.md) 
+ [Performance and reliability](./functions-best-practices.md)
+ [Securing Azure Functions](./security-concepts.md)
+ [Durable Functions](./durable/durable-functions-overview.md)
