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

Below is the currently supported list of features for the [Application Insights integration with Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitoring). Review Azure Functions' guide for [Getting started](https://github.com/Azure/Azure-Functions/wiki/App-Insights).


| Azure Functions                   	| V1            	| V2 (Ignite 2018) 	| 
|-----------------------------------	|---------------	|------------------	|
| **Application Insights .NET SDK**     	| **2.5.0**         	| **2.7.2**             	|
| | | | 
| **Automatic  collection of**          	|               	|                  	|           	
| &bull; Requests                        	| Yes           	| Yes              	| 
| &bull; Exceptions                      	| Yes           	| Yes              	| 
| &bull; Dependencies           	|               	|                  	|           	
| &mdash; HTTP                            	|               	| Yes              	| 
| &mdash; ServiceBus                      	|               	| Yes              	| 
| &mdash; EventHub                        	|               	| Yes              	| 
| &mdash; SQL                              	|               	| Yes              	| 
| | | | 
| **Supported features**                	|               	|                  	|           	
| &bull; QuickPulse/LiveMetrics                      	| Yes           	| Yes              	| 
| &bull; Sampling                        	| Yes           	| Yes              	| 
| &bull; Heartbeats                      	|   	| Yes              	| 
| | | | 
| **Correlation**                       	|               	|                  	|           	
| &bull; ServiceBus                      	|               	| Yes              	| 
| &bull; EventHub                        	|               	| Yes              	| 
| | | | 
| **Configurable**                	|               	|                  	|           
| &bull;Fully configurable.<br/>See [Azure Functions](https://github.com/Microsoft/ApplicationInsights-aspnetcore/issues/759#issuecomment-426687852) for instructions.<br/>See [Asp.NET Core](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration) for all options.           	|               	| Yes                 	| 
