---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/05/2019
ms.author: glenga
---

## Create the local function app project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory. A GitHub repo is also created in `MyFunctionProj`.

```bash
func init MyFunctionProj
```

When prompted, select a worker runtime from the following language choices:

+ `dotnet`: creates a .NET class library project (.csproj).
+ `node`: creates a Node.js-based project. Choose either `javascript` or `typescript`. A TypeScript project requires a few additional steps to run locally and publish.
+ `python`: For a Python project, please instead complete [Create an HTTP triggered function in Azure](../articles/azure-functions/functions-create-first-function-python.md).
+ `powershell`: For a PowerShell project, please instead complete [Create your first PowerShell function in Azure (preview)](../articles/azure-functions/functions-create-first-function-powershell.md). 


After the project is created, use the following command to navigate to the new `MyFunctionProj` project folder.

```bash
cd MyFunctionProj
```
