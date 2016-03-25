<properties
   pageTitle="Azure Functions Overview | Microsoft Azure"
   description="Understand how Azure Functions can optimize asynchronous workloads by creating simple functions that can be written in minutes."
   services="functions"
   documentationCenter="na"
   authors="mattchenderson"
   manager="erikre"
   editor=""
   tags=""
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="03/09/2016"
   ms.author="cfowler;mahender"/>
   
   
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
Build Custom Backend | &#10004; | &nbsp; 
Compute On-Demand | &#10004; | &nbsp;
Bring Your Own Code | &#10004; | App Services: C#, node.js, Python, F#, PHP, batch, Java or any executable
Pay Per Use & Pricing Model | &#10004; | Price competitive pay per use, options for using memory more efficiently, support for dedicated compute
Integrated Security Model | &nbsp; | &nbsp;
Event Driven Trigger | &#10004; | &nbsp;
On-Premises Connectivity | &#10004; | App Service support hybrid connection and VNET integration 
Development Experience | &#10004; | Azure has out of the box DevOps features (CI/CD, Slots, etc.) and Local Development support 
Code-less SaaS & PaaS Connectors | &#10004; | Azure has input/output bindings, making connecting moving data between services a code-less gesture
Open Source | &#10004; | &nbsp;
Community Extensions | &#10004; | &nbsp;

### Integrations

Azure Functions supports a variety of integrations with Azure and 3rd-party services. You can use these to trigger your function and start execution or to serve as input and output for your code. The table below shows some examples integrations supported by Azure Functions.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

## How much does Functions cost?

Full pricing details are available on the [Pricing]() page.
