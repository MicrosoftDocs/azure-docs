---
title: Manually install or update Azure Functions binding extensions
description: Learn how to install or update Azure Functions binding extensions for deployed function apps.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, binding extensions, NuGet, updates

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 09/26/2018
ms.author: glenga
---

# Manually install or update Azure Functions binding extensions from the portal

The Azure Functions version 2.x runtime uses binding extensions to implement code for triggers and bindings. Binding extensions are provided in NuGet packages, and to register an extension you install a package. When developing functions, the way that you install binding extensions depends on the development environment. For more information, see [Register binding extensions](functions-triggers-bindings.md#register-binding-extensions) in the triggers and bindings article.

In some situations, you must manually install or update your binding extensions in the portal. For example, you may need to update the binding registration for an existing function app to a newer version. You may also need to add a binding that is supported by the runtime but that does not have a portal template for installation. When developing your functions locally using Azure Functions Core Tools, you should use the `func extensions install --force` command. For more information, see [Register extensions](functions-run-local.md#register-extensions) in the Core Tools article. For a C# class library project (.csproj), you just update the NuGet packages in your project in Visual Studio.

## Update your extensions from portal

Follow the instructions in this section to update a function app which is created/managed from portal.
Stop the function app.
Access kudu console through Platform Features -> Advanced Tools -> Debug Console (cmd)
Navigate to d:\home\site\wwwroot
Delete the bin directory (click the circle icon next to folder)
Edit extensions.csproj
Update the extensions with the version you need to install (See the table below)
Note - if you use blob/queue/table bindings make sure you include Microsoft.Azure.WebJobs.Extensions.Storage 
Save the changes
Run dotnet build extensions.csproj -o bin --no-incremental --packages D:\home\.nuget 
Start the function app

  