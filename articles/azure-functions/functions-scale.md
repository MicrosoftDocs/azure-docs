<properties
   pageTitle="Azure Functions developer reference | Microsoft Azure"
   description="Understand how Azure Functions are develop and configured using triggers and bindings which use a domain specific language."
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

One of best advantages of Azure Functions is that resources are only consumed as needed by your running code. 
If more compute power is needed to process your requests faster, the platform scales up to ensure you're making the most out of it.  

The Dynamic Hosting Plan is being introduced so you are only charged by the amount of seconds your code was running in 
the selected memory size for your Function App.

This article gives an overview if  the platform handles scaling up and down, as well as how the Dynamic Hosting Plan works. 
If you are not yet familiar with Azure Functions, make sure to check the Azure Functions Overview for some basic info: ADD LINK           

### Configuring your Function App

There are two main setting related to scaling: 
* App Hosting Plan or Dynamic Hosting Plan 
* Memory Size 

![]()

[AZURE.INCLUDE [dynamic compute](../../includes/functions-dynamic-compute.md)]