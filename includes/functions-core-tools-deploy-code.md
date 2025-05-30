---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/28/2025
ms.author: glenga
---

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
To publish your local code to a function app in Azure, use the [`func azure functionapp publish`](../articles/azure-functions/functions-core-tools-reference.md#func-azure-functionapp-publish) command, as in the following example:

```
func azure functionapp publish <FunctionAppName>
```

This command publishes project files from the current directory to the `<FunctionAppName>` as a .zip deployment package. If the project requires compilation, it's done remotely during deployment. 
::: zone-end
::: zone pivot="programming-language-java"
Java uses Maven to publish your local project to Azure instead of Core Tools. Use the following Maven command to publish your project to Azure: 

```
mvn azure-functions:deploy
```

When you run this command, Azure resources are created during the initial deployment based on the settings in your _pom.xml_ file. For more information, see [Deploy the function project to Azure](../articles/azure-functions/create-first-function-cli-java.md#deploy-the-function-project-to-azure).
::: zone-end 