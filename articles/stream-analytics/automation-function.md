---
title: Auto-pause with PowerShell on Azure Functions
description: This article describes how to auto-pause a job on a schedule via either Azure Functions
services: stream-analytics
author: fleid

ms.author: fleide
ms.service: stream-analytics
ms.topic: how-to
ms.date: 11/03/2021
---

# Auto-pause a Stream Analytics job on a schedule with PowerShell via Azure Functions

Some applications require a stream processing approach, made easy with Azure Stream Analytics (ASA), but don't strictly need to run continuously.

The reasons are various:

- Input data arriving on a schedule (top of the hour...)
- A very sparse and low volume of incoming data (few records per minute)
- Business processes that benefit from time windowing capabilities, but are running in batch by essence (Finance or HR...)
- ...

These applications are usually either focused on narrow business scenarios, or more typically built for demonstrations, prototypes or tests that involve **long running jobs**.

The benefit of not running these jobs continuously will be **cost savings**, as Stream Analytics jobs are [billed](https://azure.microsoft.com/en-us/pricing/details/stream-analytics/) per Streaming Unit **over time.**

This article will explain how to set up auto-pause for Azure Stream Analytics, thanks to Azure Functions. Please note that if we are using the term **pause** in this article, we really mean **stop**, as to avoid any billing. We will discuss the overall design first, go through the required components, and discuss some implementation details.

> ! Note
> There are downsides to auto-pausing a job. The main ones being the loss of the low latency / real time capabilities, and the potential risks from allowing the input event backlog to grow unsupervised while a job is paused. This should not be considered for most production scenarios running at scale.

## Design

For this example, we want to set a job to run only for N minutes, before pausing it for M minutes. When the job is paused, the input data will not be consumed, accumulating upstream. When the job is started, it will catch-up with that backlog, process the additional data trickling in, before being shut down again.

![Behavior of the auto-paused job over time](./media/automation/principle.png)

To make sure the job has time to process the entire input backlog when it's running, we won't stop it again until there is no backlogged input events for a couple of minutes. In terms of behavior, we will need two actions:

- A running job needs to be stopped after N minutes, if it has no backlogged input events
- A stopped job needs to be started after M minutes

![State diagram of the job](./media/automation/States.png)

To illustrate, if we put N at 5 minutes, and M at 10, that means that a job has 5 minutes to process all the data that was received in input in 15. This also means potential cost savings of up to 66%.

Finally we will make these actions idempotent, meaning that they can be repeated at will with no side effects, for ease of use and resiliency.

## Components

### API calls

We anticipate the need to interact with ASA on the following **aspects**:

- **Get the current job status** (*ASA Resource Management*)
  - If running
    - **Get the current backlogged event count** (*Metrics*)
    - If applicable, **stop the job** (*ASA Resource Management*)
  - If stopped
    - **Get the time since stopped** (*Logs*)
    - If applicable, **start the job** (*ASA Resource Management*)

For *ASA Resource Management*, we can use either the [REST API](https://docs.microsoft.com/en-us/rest/api/streamanalytics/), the [.NET SDK](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.streamanalytics?view=azure-dotnet) or one of the CLI libraries ([Az CLI](https://docs.microsoft.com/en-us/cli/azure/stream-analytics?view=azure-cli-latest), [PowerShell](https://docs.microsoft.com/en-us/powershell/module/az.streamanalytics/?view=azps-6.6.0)). For *Metrics* and *Logs*, in Azure everything is centralized under [Azure Monitor](https://docs.microsoft.com/en-ca/azure/azure-monitor/overview), with a similar choice of API surfaces.

For this article, we decided to implement auto-pause in **PowerShell**. [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7.1) is now cross-platform, and since it returns objects, it makes parsing and processing easy for automation tasks. That means we will use the [Az PowerShell](https://docs.microsoft.com/en-us/powershell/azure/new-azureps-module-az?view=azps-6.6.0) module, which embarks [Az.Monitor](https://docs.microsoft.com/en-us/powershell/module/az.monitor/?view=azps-6.6.0) and [Az.StreamAnalytics](https://docs.microsoft.com/en-us/powershell/module/az.streamanalytics/?view=azps-6.6.0) for everything we need here:

- [Get-AzStreamAnalyticsJob](https://docs.microsoft.com/en-us/powershell/module/az.streamanalytics/get-azstreamanalyticsjob?view=azps-6.6.0) for the current job status
- [Start-AzStreamAnalyticsJob](https://docs.microsoft.com/en-us/powershell/module/az.streamanalytics/start-azstreamanalyticsjob?view=azps-6.6.0) / [Stop-AzStreamAnalyticsJob](https://docs.microsoft.com/en-us/powershell/module/az.streamanalytics/stop-azstreamanalyticsjob?view=azps-6.6.0)
- [Get-AzMetric](https://docs.microsoft.com/en-us/powershell/module/az.monitor/get-azmetric?view=azps-6.6.0) with `InputEventsSourcesBacklogged` [(from ASA metrics)](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported#microsoftstreamanalyticsstreamingjobs)
- [Get-AzActivityLog](https://docs.microsoft.com/en-us/powershell/module/az.monitor/get-azactivitylog?view=azps-6.6.0) for event names beginning with `Stop Job`

### Hosting service

We will need a host for our PowerShell task, that offers scheduled runs. There are lots of options, but going as serverless as possible that leaves:

- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview), a serverless compute engine that can run almost any piece of code. Functions offer a [timer trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=csharp) that can run up to every second
- [Azure Automation](https://docs.microsoft.com/en-us/azure/automation/overview), a managed service built for operating cloud workloads and resources. Which fits the bill, but whose minimal schedule interval is 1h (but there are [workarounds](https://docs.microsoft.com/en-us/azure/automation/shared-resources/schedules#schedule-runbooks-to-run-more-frequently) for that)

If you don't mind the workaround to get a schedule down the minute, then Azure Automation is the easier way to deploy the task. But in this article we will be exploring Functions, if only to learn more about a service that can also be used as [an output from ASA](https://docs.microsoft.com/en-us/azure/stream-analytics/azure-functions-output).

## Implementation details

We highly recommend local development in VSCode, both for [Functions](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-powershell) and [ASA](https://docs.microsoft.com/en-us/azure/stream-analytics/quick-create-visual-studio-code), if only to use source control. But for this article we will illustrate the process in the [Azure portal](https://portal.azure.com) for the sake of brevity.

### PowerShell Script

The best way to develop the entire job is to do it step by step, locally on Windows with [Windows Terminal](https://www.microsoft.com/p/windows-terminal/9n0dx20hk701), [PowerShell 7](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.1) and [Az PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0), or any other OS really.

...

### Setting up the function

- Creation
- Authentication via managed identity (enable, add role in ASA)
- App Settings for environment variables
- App files for requirements

Both services support managed identity, we will need to configure it :https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=dotnet

## Outcome




