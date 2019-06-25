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
ms.topic: reference
ms.date: 4/23/2019
ms.reviewer: mbullwin
ms.author: tilee
---

# Application Insights for Azure Functions supported features

Azure Functions offers [built-in integration](https://docs.microsoft.com/azure/azure-functions/functions-monitoring) with Application Insights, which is available through the ILogger Interface. Below is the list of currently supported features. Review Azure Functions' guide for [Getting started](https://github.com/Azure/Azure-Functions/wiki/App-Insights).

## Supported features

| Azure Functions                   	| V1            	| V2 (Ignite 2018) 	| 
|-----------------------------------	|---------------	|------------------	|
| **Application Insights .NET SDK**   | **2.5.0**       | **2.9.1**         |
| | | | 
| **Automatic  collection of**        |               	|                  	|           	
| &bull; Requests                     | Yes           	| Yes              	| 
| &bull; Exceptions                   | Yes           	| Yes              	| 
| &bull; Performance Counters         | Yes             | Yes               |
| &bull; Dependencies           	    |               	|                  	|           	
| &nbsp;&nbsp;&nbsp;&mdash; HTTP      |               	| Yes              	| 
| &nbsp;&nbsp;&nbsp;&mdash; ServiceBus|               	| Yes              	| 
| &nbsp;&nbsp;&nbsp;&mdash; EventHub  |               	| Yes              	| 
| &nbsp;&nbsp;&nbsp;&mdash; SQL       |               	| Yes              	| 
| | | | 
| **Supported features**             	|               	|                  	|           	
| &bull; QuickPulse/LiveMetrics       | Yes           	| Yes              	| 
| &nbsp;&nbsp;&nbsp;&mdash; Secure Control Channel|               	| Yes              	| 
| &bull; Sampling                     | Yes           	| Yes              	| 
| &bull; Heartbeats                   |   	            | Yes              	| 
| | | | 
| **Correlation**                    	|               	|                  	|           	
| &bull; ServiceBus                  	|               	| Yes              	| 
| &bull; EventHub                    	|               	| Yes              	| 
| | | | 
| **Configurable**                  	|               	|                  	|           
| &bull;Fully configurable.<br/>See [Azure Functions](https://github.com/Microsoft/ApplicationInsights-aspnetcore/issues/759#issuecomment-426687852) for instructions.<br/>See [Asp.NET Core](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration) for all options.           	|               	| Yes                 	| 


## Performance Counters

Automatic collection of Performance Counters only work Windows machines.


## Live Metrics & Secure Control Channel

The custom filters criteria you specify are sent back to the Live Metrics component in the Application Insights SDK. The filters could potentially contain sensitive information such as customerIDs. You can make the channel secure with a secret API key. See [Secure the control channel](https://docs.microsoft.com/azure/azure-monitor/app/live-stream#secure-the-control-channel) for instructions.

## Sampling

Azure Functions enables Sampling by default in their configuration. For more information, see [Configure Sampling](https://docs.microsoft.com/azure/azure-functions/functions-monitoring#configure-sampling).

If your project takes a dependency on the Application Insights SDK to do manual telemetry tracking, you may experience strange behavior if your sampling configuration is different than the Functions' sampling configuration. 

We recommend using the same configuration as Functions. With **Functions v2**, you can get the same configuration using dependency injection in your constructor:

```csharp
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;

public class Function1 
{

    private readonly TelemetryClient telemetryClient;

    public Function1(TelemetryConfiguration configuration)
    {
        this.telemetryClient = new TelemetryClient(configuration);
    }

    [FunctionName("Function1")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req, ILogger logger)
    {
        this.telemetryClient.TrackTrace("C# HTTP trigger function processed a request.");
    }
}
```
