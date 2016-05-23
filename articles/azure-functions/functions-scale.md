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

One of the advantages of Azure Functions is that resources are only consumed as needed by your running code. This means that you don’t pay for idle VM’s or have to reserve capacity for when you might need it. Instead, the platform allocates compute power when your code is running, scaling up as necessary to handle load, and then back down again when code is not running.

The mechanism for this new capability is the Dynamic Service Plan. This new service plan provides a dynamic container for your code which scales up on demand, while you are charged only for the amount of memory your code uses and the time it takes to execute as measured in Gigabyte seconds.  

This article provides an overview of how the Dynamic Service Plan works and how the platform scales on demand to run you code. 

If you are not yet familiar with Azure Functions, make sure to check the [Azure Functions Overview](functions-overview.md) to better understand its capabilities.           

## Configuring your Function App

There are two main settings related to scaling:

* [App Service Plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) or Dynamic Service Plan 
* Memory Size for the execution environment 

The cost of a function changes depending on the type of service plan you select. With Dynamic service plans, cost is a function of execution time, memory size, and number of executions. With charges only accruing when you are actually running code. 

Regular service plans allow you to host your functions on existing VM’s which might also be used to run other code. After paying for these VM’s each month, there is no extra charge for execution functions on them. 

## Choosing a Service Plan

When creating functions apps you can select to run them on a Dynamic Service Plan (new!) or a regular [App Service Plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 
In the App Service Plan, your functions will run on a dedicated VM, just like web apps work today (for Basic, Standard or Premium SKUs). 
This dedicated VM is allocated to your apps and/or functions and is available regardless of any code being actively executed. This is a good option if you have existing VM’s that are already running other code but which are not fully utilized or if you expect to be running functions continuously or near continuously. Using a VM decouples cost from both run time and memory size, allowing you to limit the cost of large numbers of long running functions to the cost of the one or more VM’s they run on.

[AZURE.INCLUDE [Dynamic Service Plan](../../includes/functions-dynamic-service-plan.md)]
