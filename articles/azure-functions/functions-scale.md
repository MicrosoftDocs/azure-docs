<properties
   pageTitle="How to scale Azure Functions | Microsoft Azure"
   description="Understand how Azure Functions scale to meet the needs of your event-driven workloads."
   services="functions"
   documentationCenter="na"
   authors="eduardolaureano"
   manager="erikre"
   editor=""
   tags=""
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="reference"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="03/09/2016"
   ms.author="edlaure"/>

# How to scale Azure Functions

## Introduction

An advantage of Azure Functions is that compute resources are only consumed when needed. This means that you don’t pay for idle VMs or have to reserve capacity for when you might need it. Instead, the platform allocates compute power when your code is running, scales up as necessary to handle load, and then scales down when code is not running.

The mechanism for this new capability is the Dynamic Service plan.  

This article provides an overview of how the Dynamic Service plan works and how the platform scales on demand to run your code.

If you are not yet familiar with Azure Functions, make sure to check the [Azure Functions overview](functions-overview.md) article to better understand its capabilities.

## Configure Azure Functions

Two main settings are related to scaling:

* [Azure App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) or Dynamic Service plan
* Memory size for the execution environment

The cost of a function changes depending on the service plan that you select. With a Dynamic Service plan, cost is a function of execution time, memory size, and number of executions. Charges accrue only when your code is actually running.

An App Service plan hosts your functions on existing VMs, which might also be used to run other code. After you pay for these VMs each month, there is no extra charge for execution functions on them.

## Choose a service plan

When you create functions, you can select to run them on a Dynamic Service plan or an [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).
In the App Service plan, your functions will run on a dedicated VM, just like web apps work today for Basic, Standard, or Premium SKUs.
This dedicated VM is allocated to your apps and functions and is always available whether code is being actively executed or not. This is a good option if you have existing, under-utilized VMs that are already running other code or if you expect to run functions continuously or almost continuously. A VM decouples cost from both runtime and memory size. As a result, you can limit the cost of many long-running functions to the cost of the one or more VMs that they run on.

[AZURE.INCLUDE [Dynamic Service plan](../../includes/functions-dynamic-service-plan.md)]
