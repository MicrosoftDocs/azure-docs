---
title: How to scale Azure Functions | Microsoft Docs
description: Understand how Azure Functions scale to meet the needs of your event-driven workloads.
services: functions
documentationcenter: na
author: dariagrigoriu
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 08/03/2016
ms.author: dariagrigoriu

---
# Scaling Azure Functions

## Introduction

The Azure Functions platform allocates compute power when your code is running, scales out as necessary to handle load, and then scales in when code is not running. This means you don’t pay for idle VMs or have to reserve capacity before it is needed. The mechanism for this capability is the Consumption service plan. This article provides an overview of how the Consumption service plan works. 

If you are not yet familiar with Azure Functions, see the [Azure Functions overview](functions-overview.md) article.

## Choose a service plan

When you create functions, you can select to run them on a Consumption service plan or an [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

In the **Consumption plan**, your Function Apps are assigned to a compute processing instance. If needed more instances are added or removed dynamically. Moreover, your functions run in parallel minimizing the total time needed to process requests. Execution time for each function is aggregated by the containing Function App. Cost is driven by memory size and total execution time across all functions in a Function App as measured in gigabyte-seconds. This is an excellent option if your compute needs are intermittent or your job times tend to be very short as it allows you to only pay for compute resources when they are actually in use. 

In the **App Service plan**, your Function Apps run on dedicated VMs, just like Web Apps work today for Basic, Standard, or Premium SKUs. Dedicated VMs are allocated to your App Service apps and Function Apps and are always available whether code is being actively executed or not. This is a good option if you have existing, under-utilized VMs that are already running other code or if you expect to run functions continuously or almost continuously. A VM decouples cost from both runtime and memory size. As a result, you can limit the cost of many long-running functions to the cost of the one or more VMs that they run on.

## Consumption service plan

The Consumption service plan automatically scales CPU and memory resources by adding additional processing instances based on the runtime needs of the functions in the Function App. Every Function App processing instance is allocated memory resources up to 1.5GB.

### Runtime scaling

The Azure Functions platform uses a central listener to evaluate compute needs based on the configured triggers and to decide when to scale out or scale in. The central listener constantly processes hints for memory requirements and trigger specific data points. For example, in the case of an Azure Queue Storage trigger the data points include queue length and queue time for oldest entry.

![](./media/functions-scale/central-listener.png)

The unit of scaling is the Function App. Scaling out in this case means adding more instances of a Function App. Inversely as compute demand is reduced, Function App instances are removed - eventually scaling in to zero when none are running. 

### Billing model

Billing for the Consumption service plan is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions). Usage is reported per Function App, only for time when code is being executed. The following are units for billing: 
* **Resource consumption in GB-s (gigabyte-seconds)** computed as a combination of memory size and execution time for all functions running in a Function App. 
* **Executions** counted each time a function is executed in response to an event, triggered by a binding.
