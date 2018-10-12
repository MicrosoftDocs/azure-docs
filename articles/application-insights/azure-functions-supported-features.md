---
title: Azure Application Insights - Azure Functions Supported Features | Microsoft Docs
description: Application Insights Supported Features for Azure Functions 
services: application-insights
documentationcenter: .net
author: MS-TimothyMothra
manager: 

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: reference
ms.date: 10/05/2018
ms.reviewer: mbullwin
ms.author: tilee

---

# Application Insights for Azure Functions supported features

Azure Functions offers [built-in integration](https://docs.microsoft.com/azure/azure-functions/functions-monitoring) with Application Insights, which is available through the ILogger Interface. Below is the list of currently supported features. Review Azure Functions' guide for [Getting started](https://github.com/Azure/Azure-Functions/wiki/App-Insights).


| Azure Functions                   | V1            | V2 (Ignite 2018) |
|-----------------------------------|---------------|------------------|
| **Application Insights .NET SDK** | **2.5.0**     | **2.7.2**        |
| **Automatic  collection of**<br> &bull; Requests<br> &bull; Exceptions<br> &bull; Dependencies<br> &nbsp;&nbsp;&nbsp;&nbsp;&bull; HTTP<br> &nbsp;&nbsp;&nbsp;&nbsp;&bull; ServiceBus<br> &nbsp;&nbsp;&nbsp;&nbsp;&bull; EventHub<br> &nbsp;&nbsp;&nbsp;&nbsp;&bull; SQL |<br> Yes<br> Yes<br> <br> <br> <br> <br> <br>| <br> Yes<br> Yes<br> <br> Yes<br> Yes<br> Yes<br> Yes<br>|
| **Supported features**<br> &bull; QuickPulse/LiveMetrics<br> &bull; Sampling<br> &bull; Heartbeats<br>|<br> Yes<br> Yes<br>Yes<br>| |
| **Correlation**<br> &bull; ServiceBus<br> &bull; EventHub<br>|<br> Yes<br> Yes<br>| Yes<br> Yes<br>|
| **Configurable**<br>&bull;Fully configurable.<br/>See [Azure Functions](https://github.com/Microsoft/ApplicationInsights-aspnetcore/issues/759#issuecomment-426687852) for instructions.<br/>See [Asp.NET Core](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration) for all options.           |               | Yes                 |

## Sampling

Azure Functions enables Sampling by default in their configuration. For more information, see [Configure Sampling](https://docs.microsoft.com/azure/azure-functions/functions-monitoring#configure-sampling).
