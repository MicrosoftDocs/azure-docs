---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/05/2019
ms.author: glenga
---

## Create the local function app project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory. A GitHub repo is also created in `MyFunctionProj`.

```command
func init MyFunctionProj
```

When prompted, select a worker runtime from the following language choices:

+ `dotnet`: creates a .NET class library project (.csproj).
+ `node`: creates a Node.js-based project. Choose either `javascript` or `typescript`. 
+ `python`: for a Python project, please instead complete [Create an HTTP triggered function in Azure](../articles/azure-functions/create-first-function-cli-python.md).
+ `powershell`: for a PowerShell project, please instead complete [Create your first PowerShell function in Azure](../articles/azure-functions/create-first-function-vs-code-powershell.md). 


After the project is created, use the following command to navigate to the new `MyFunctionProj` project folder.

```command
cd MyFunctionProj
```