<!-- Understand how to fill out Properties and Tags by visiting: https://github.com/Azure/azure-content/blob/master/contributor-guide/article-metadata.md -->

<properties
   pageTitle="Azure Functions Overview"
   description="Understand how Azure Functions can optimize asynchronous workloads by creating simple functions that can be written in minutes."
   services="app-service"
   documentationCenter=""
   authors="GitHub-alias-of-only-one-author"
   manager="manager-alias"
   editor=""
   tags="optional"
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
   ms.service="azure-functions"
   ms.devlang="multiple"
   ms.topic="index-page"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="03/09/2016"
   ms.author="Your MSFT alias or your full email address;semicolon separates two or more"/>
   
   
# Azure Functions Overview

## Life's about to get a whole lot easier 

Write any function under a minute - either when you need a simple job to cleanse a database or to build functionality that processes millions of messages from connected devices. User your development language of choice (C#, Node.JS, Python and more). Pay only for the time your code runs and trust Azure to scale as needed.

## Understanding Azure Functions

### I'd like to learn more about Azure Functions

* What are the [Supported Features]() and [integration Partners]()
* [How much does Azure Functions cost?]()

### Getting Started

* [Create my first Azure Functions via Template]()
* [Create my first Azure Functions from Scratch]()

## Feature Scope

Azure Functions makes achieving complicated integration and connectivity tasks trivial. With this core set of capabilities, developers using Azure Functions can become even more productive by focusing only on their goal rather than putting together infrastructure pieces.

### Features

Feature | Supported | Notes 
--------|-----------|-------
Build Custom Backend | <span class="wa-check wa-check-green"></span> | &nbsp; 
Compute On-Demand | <span class="wa-check wa-check-green"></span> | &nbsp;
Bring Your Own Code | <span class="wa-check wa-check-green"></span> | App Services: C#, node.js, Python, F#, PHP, batch, Java or any executable
Pay Per Use & Pricing Model | <span class="wa-check wa-check-green"></span> | Price competitive pay per use, options for using memory more efficiently, support for dedicated compute
Integrated Security Model | <span class="wa-cancel"></span> | &nbsp;
Event Driven Trigger | <span class="wa-check wa-check-green"></span> | &nbsp;
On-Premises Connectivity | <span class="wa-check wa-check-green"></span> | App Service support hybrid connection and VNET integration 
Development Experience | <span class="wa-check wa-check-green"></span> | Azure has out of the box DevOps features (CI/CD, Slots, etc.) and Local Development support 
Code-less SaaS & PaaS Connectors | <span class="wa-check wa-check-green"></span> | Azure has input/output bindings, making connecting moving data between services a code-less gesture
Open Source | <span class="wa-check wa-check-green"></span> | &nbsp;
Community Extensions | <span class="wa-check wa-check-green"></span> | &nbsp;

### Integrations

Azure Functions supports a variety of integrations with Azure and 3rd-party services. You can use these to trigger your function and start execution or to serve as input and output for your code. The table below shows some examples integrations supported by Azure Functions.

Integration type | Service | Trigger | Input | Output 
----------|---------------|----------
Schedule | Azure Functions | <span class="wa-check wa-check-green"></span> | <span class="wa-cancel"></span> | <span class="wa-cancel"></span>
HTTP (REST or webhook) | Azure Functions | <span class="wa-check wa-check-green"></span> | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span>
Blob Storage | Azure Storage | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span> 
Queues | Azure Storage | <span class="wa-check wa-check-green"></span> | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span>
Tables | Azure Storage | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span>
Tables | Azure Mobile Apps Easy Tables | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span>
No-SQL DB | Azure DocumentDB | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span>
Streams | Azure Event Hubs | <span class="wa-check wa-check-green"></span> | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span>
Brokered queues | Azure Service Bus | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span> | <span class="wa-check wa-check-green"></span>
Push Notifications | Azure Notification Hubs | <span class="wa-cancel"></span> | <span class="wa-cancel"></span> | <span class="wa-check wa-check-green"></span>

## How much does Functions cost?

Full pricing details are available on the [Pricing]() page.
