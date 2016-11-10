---
title: Monitoring Azure Functions | Microsoft Docs
description: Learn how to monitor your Azure Functions.
services: functions
documentationcenter: na
author: wesmc7777
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/03/2016
ms.author: wesmc
---

# Monitoring Azure Functions

## Overview

> [!IMPORTANT]
> The monitoring tile in the main resource blade will not contain monitoring information for functions on the [Dynamic Hosting plan](functions-overview.md#pricing).


 
Content in progress...


## Monitor functions by streaming log files to the command line


You can stream log files to a command line session on a local workstation using the Azure Command Line Interface (CLI) or PowerShell.

#### Streaming function app log file with the Azure CLI

To get started, [install the Azure CLI](../xplat-cli-install.md) and [connect to your Azure subscription](../xplat-cli-connect.md).

Use the following command to enable Azure CLI Service Management (ASM) mode:.

	azure config mode asm

The following command will stream the log files of your function app to the command line:

	azure site log tail -v <function app name>

#### Streaming function app log file with PowerShell

To get started, [install and configure Azure PowerShell](../powershell-install-configure.md).

Add your Azure account by running the following command:

	PS C:\> Add-AzureAccount

If you have multiple subscriptions, you can list them by name with the following command to see if the correct subscription is the currently selected based on `IsCurrent` property:

	PS C:\> Get-AzureSubscription

If you need to set the active subscription to the one containing your function app, use the following command:

	PS C:\> Get-AzureSubscription -SubscriptionName "MyFunctionAppSubscription" | Select-AzureSubscription

Stream the logs to your PowerShell session with the following command:

	PS C:\> Get-AzureWebSiteLog -Name MyFunctionApp -Tail

For more information refer to [How to: Stream logs for web apps](../app-service-web/web-sites-enable-diagnostic-log.md#streamlogs). 

## Next steps
For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)

