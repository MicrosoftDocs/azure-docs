---
title: How to target Azure Functions runtime versions | Microsoft Docs
description: Learn how to chose your .
services: ''
documentationcenter: 
author: ggailey777
manager: cfowler
editor: ''

ms.service: functions
ms.workload: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: glenga

---
# How to target Azure Functions runtime versions

The Azure Functions runtime implements the serverless execution of your code in Azure. You find this runtime in various environments other than hosted in Azure. The [Azure Functions Core Tools](functions-run-local.md) implements this runtime on your development computer. [Azure Functions Runtime](functions-runtime-overview.md) lets you use Functions in on-premise environments. 

Functions supports multiple versions of the runtime. These versions provide the ability to support new features and enhancements while maintaining backward compatibility for existing function apps. This topic describes how you can target your function apps to a specific runtime version when hosted in Azure. 

To learn how to test your function apps locally against a specific runtime, see [Azure Functions Core Tools](functions-run-local.md). 

>[!IMPORTANT]   
> Azure Functions runtime 2.0 is in preview, and currently not all features of Azure Functions are supported. For more information, see [Azure Functions runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues)  

<!-- Add a table comparing the 1.x and 2.x runtime features-->

[!INCLUDE [functions-set-runtime-version](../../includes/functions-set-runtime-version.md)]

You can add this application setting to your function app in several ways.

## Require the Functions 2.x runtime in the portal



## Require the Functions 2.x runtime using the Azure CLI

 Add the application setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#set) command.

```azurecli-interactive
az functionapp config appsettings set --name <function_app> \
--resource-group <my_resource_group> \
--settings FUNCTIONS_EXTENSION_VERSION=beta
```
In this code, replace `<function_app>` with the name of your function app and `<my_resource_group>` with the name of the resource group for your function app.  