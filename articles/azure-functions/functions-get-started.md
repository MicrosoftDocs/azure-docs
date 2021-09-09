---
title: Getting started with Azure Functions
description: Take the first steps toward working with Azure Functions.
author: craigshoemaker
ms.topic: overview
ms.date: 11/19/2020
ms.author: cshoe
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Getting started with Azure Functions

## Introduction

[Azure Functions](./functions-overview.md) allows you to implement your system's logic into readily-available blocks of code. These code blocks are called "functions".

Use the following resources to get started.

::: zone pivot="programming-language-csharp"

| Action | Resources |
| --- | --- |
| **Create your first function** | Using one of the following tools:<br><br><li>[Visual Studio](./functions-create-your-first-function-visual-studio.md)<li>[Visual Studio Code](./create-first-function-vs-code-csharp.md)<li>[Command line](./create-first-function-cli-csharp.md) |
| **See a function running** | <li>[Azure Samples Browser](/samples/browse/?expanded=azure&languages=csharp&products=azure-functions)<li>[Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=C%23) |
| **Explore an interactive tutorial**| <li>[Choose the best Azure serverless technology for your business scenario](/learn/modules/serverless-fundamentals/)<li>[Well-Architected Framework - Performance efficiency](/learn/modules/azure-well-architected-performance-efficiency/)<li>[Execute an Azure Function with triggers](/learn/modules/execute-azure-function-with-triggers/) <br><br>See Microsoft Learn for a [full listing of interactive tutorials](/learn/browse/?expanded=azure&products=azure-functions).|
| **Review best practices** |<li>[Performance and reliability](./functions-best-practices.md)<li>[Manage connections](./manage-connections.md)<li>[Error handling and function retries](./functions-bindings-error-pages.md?tabs=csharp)<li>[Security](./security-concepts.md)|
| **Learn more in-depth** | <li>Learn how functions [automatically increase or decrease](./functions-scale.md) instances to match demand<li>Explore the different [deployment methods](./functions-deployment-technologies.md) available<li>Use built-in [monitoring tools](./functions-monitoring.md) to help analyze your functions<li>Read the [C# language reference](./functions-dotnet-class-library.md)|

::: zone-end

::: zone pivot="programming-language-java"
| Action | Resources |
| --- | --- |
| **Create your first function** | Using one of the following tools:<br><br><li>[Visual Studio Code](./create-first-function-vs-code-java.md)<li>[Java/Maven function with terminal/command prompt](./create-first-function-cli-java.md)<li>[Gradle](./functions-create-first-java-gradle.md)<li>[Eclipse](./functions-create-maven-eclipse.md)<li>[IntelliJ IDEA](./functions-create-maven-intellij.md) |
| **See a function running** | <li>[Azure Samples Browser](/samples/browse/?expanded=azure&languages=java&products=azure-functions)<li>[Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Java) |
| **Explore an interactive tutorial**| <li>[Choose the best Azure serverless technology for your business scenario](/learn/modules/serverless-fundamentals/)<li>[Well-Architected Framework - Performance efficiency](/learn/modules/azure-well-architected-performance-efficiency/)<li>[Develop an App using the Maven Plugin for Azure Functions](/learn/modules/develop-azure-functions-app-with-maven-plugin/) <br><br>See Microsoft Learn for a [full listing of interactive tutorials](/learn/browse/?expanded=azure&products=azure-functions).|
| **Review best practices** |<li>[Performance and reliability](./functions-best-practices.md)<li>[Manage connections](./manage-connections.md)<li>[Error handling and function retries](./functions-bindings-error-pages.md?tabs=java)<li>[Security](./security-concepts.md)|
| **Learn more in-depth** | <li>Learn how functions [automatically increase or decrease](./functions-scale.md) instances to match demand<li>Explore the different [deployment methods](./functions-deployment-technologies.md) available<li>Use built-in [monitoring tools](./functions-monitoring.md) to help analyze your functions<li>Read the [Java language reference](./functions-reference-java.md)|
::: zone-end

::: zone pivot="programming-language-javascript"
| Action | Resources |
| --- | --- |
| **Create your first function** | Using one of the following tools:<br><br><li>[Visual Studio Code](./create-first-function-vs-code-node.md)<li>[Node.js terminal/command prompt](./create-first-function-cli-node.md) |
| **See a function running** | <li>[Azure Samples Browser](/samples/browse/?expanded=azure&languages=javascript%2ctypescript&products=azure-functions)<li>[Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=JavaScript%2CTypeScript) |
| **Explore an interactive tutorial** | <li>[Choose the best Azure serverless technology for your business scenario](/learn/modules/serverless-fundamentals/)<li>[Well-Architected Framework - Performance efficiency](/learn/modules/azure-well-architected-performance-efficiency/)<li>[Build Serverless APIs with Azure Functions](/learn/modules/build-api-azure-functions/)<li>[Create serverless logic with Azure Functions](/learn/modules/create-serverless-logic-with-azure-functions/)<li>[Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](/learn/modules/shift-nodejs-express-apis-serverless/) <br><br>See Microsoft Learn for a [full listing of interactive tutorials](/learn/browse/?expanded=azure&products=azure-functions).|
| **Review best practices** |<li>[Performance and reliability](./functions-best-practices.md)<li>[Manage connections](./manage-connections.md)<li>[Error handling and function retries](./functions-bindings-error-pages.md?tabs=javascript)<li>[Security](./security-concepts.md)|
| **Learn more in-depth** | <li>Learn how functions [automatically increase or decrease](./functions-scale.md) instances to match demand<li>Explore the different [deployment methods](./functions-deployment-technologies.md) available<li>Use built-in [monitoring tools](./functions-monitoring.md) to help analyze your functions<li>Read the [JavaScript](./functions-reference-node.md) or [TypeScript](./functions-reference-node.md#typescript) language reference|
::: zone-end

::: zone pivot="programming-language-powershell"
| Action | Resources |
| --- | --- |
| **Create your first function** | <li>Using [Visual Studio Code](./create-first-function-vs-code-powershell.md) |
| **See a function running** | <li>[Azure Samples Browser](/samples/browse/?expanded=azure&languages=powershell&products=azure-functions)<li>[Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=PowerShell) |
| **Explore an interactive tutorial** | <li>[Choose the best Azure serverless technology for your business scenario](/learn/modules/serverless-fundamentals/)<li>[Well-Architected Framework - Performance efficiency](/learn/modules/azure-well-architected-performance-efficiency/)<li>[Build Serverless APIs with Azure Functions](/learn/modules/build-api-azure-functions/)<li>[Create serverless logic with Azure Functions](/learn/modules/create-serverless-logic-with-azure-functions/)<li>[Execute an Azure Function with triggers](/learn/modules/execute-azure-function-with-triggers/) <br><br>See Microsoft Learn for a [full listing of interactive tutorials](/learn/browse/?expanded=azure&products=azure-functions).|
| **Review best practices** |<li>[Performance and reliability](./functions-best-practices.md)<li>[Manage connections](./manage-connections.md)<li>[Error handling and function retries](./functions-bindings-error-pages.md?tabs=powershell)<li>[Security](./security-concepts.md)|
| **Learn more in-depth** | <li>Learn how functions [automatically increase or decrease](./functions-scale.md) instances to match demand<li>Explore the different [deployment methods](./functions-deployment-technologies.md) available<li>Use built-in [monitoring tools](./functions-monitoring.md) to help analyze your functions<li>Read the [PowerShell language reference](./functions-reference-powershell.md))|
::: zone-end

::: zone pivot="programming-language-python"
| Action | Resources |
| --- | --- |
| **Create your first function** | Using one of the following tools:<br><br><li>[Visual Studio Code](./create-first-function-vs-code-python.md)<li>[Terminal/command prompt](./create-first-function-cli-python.md) |
| **See a function running** | <li>[Azure Samples Browser](/samples/browse/?expanded=azure&languages=python&products=azure-functions)<li>[Azure Community Library](https://www.serverlesslibrary.net/?technology=Functions%202.x&language=Python) |
| **Explore an interactive tutorial** | <li>[Choose the best Azure serverless technology for your business scenario](/learn/modules/serverless-fundamentals/)<li>[Well-Architected Framework - Performance efficiency](/learn/modules/azure-well-architected-performance-efficiency/)<li>[Build Serverless APIs with Azure Functions](/learn/modules/build-api-azure-functions/)<li>[Create serverless logic with Azure Functions](/learn/modules/create-serverless-logic-with-azure-functions/) <br><br>See Microsoft Learn for a [full listing of interactive tutorials](/learn/browse/?expanded=azure&products=azure-functions).|
| **Review best practices** |<li>[Performance and reliability](./functions-best-practices.md)<li>[Manage connections](./manage-connections.md)<li>[Error handling and function retries](./functions-bindings-error-pages.md?tabs=python)<li>[Security](./security-concepts.md)<li>[Improve throughput performance](./python-scale-performance-reference.md)|
| **Learn more in-depth** | <li>Learn how functions [automatically increase or decrease](./functions-scale.md) instances to match demand<li>Explore the different [deployment methods](./functions-deployment-technologies.md) available<li>Use built-in [monitoring tools](./functions-monitoring.md) to help analyze your functions<li>Read the [Python language reference](./functions-reference-python.md)|
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Learn about the anatomy of an Azure Functions application](./functions-reference.md)
