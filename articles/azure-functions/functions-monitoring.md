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

ms.assetid: 501722c3-f2f7-4224-a220-6d59da08a320
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


The *Monitor* tab provided for each function allows you to review each execution along with log files and input data.

![Azure Functions monitor tab](./media/functions-monitoring/monitor-tab.png) 

Clicking each execution allows you to review errors and log files associated with the execution. This is useful when you want to review a history of errors or the execution duration for your functions.


> [!IMPORTANT]
> When using the [Consumption hosting plan](functions-overview.md#pricing) for Azure Functions, the Monitoring tile in the Function App overview blade will not show any data. This is because the platform dynamically scales and manages compute instances for you, so these metrics are not meaningful on a Consumption plan. To monitor the usage of your Function Apps, you should instead use the guidance in this article.
> 
> The following screen-shot shows an example:
> 
> ![Monitoring on the main resource blade](./media/functions-monitoring/app-service-overview-monitoring.png)



## Real-time monitoring

Real-time monitoring is available by clicking *live event stream* as shown below: 

![Live event stream option for the monitor tab](./media/functions-monitoring/monitor-tab-live-event-stream.png)

The live event stream will graph the following statistics for your function:

* Executions started per second
* Executions completed per second
* Executions failed per second
* Average execution time.

These statistic are near real-time. The actual graphing of the execution data may have around 10 seconds of latency.

![Live event stream example](./media/functions-monitoring/live-event-stream.png)










## Monitoring log files from a command line


You can stream log files to a command line session on a local workstation using the Azure Command Line Interface (CLI) or PowerShell.

### Streaming function app log file with the Azure CLI

To get started, [install the Azure CLI](../xplat-cli-install.md) and [connect to your Azure subscription](../xplat-cli-connect.md).

Use the following command to enable Azure CLI Service Management (ASM) mode:.

	azure config mode asm

The following command will stream the log files of your function app to the command line:

	azure site log tail -v <function app name>

### Streaming function app log file with PowerShell

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

