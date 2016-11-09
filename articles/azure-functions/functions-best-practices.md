---
title: Best Practices for Azure Functions | Microsoft Docs
description: Learn best practices and patterns for Azure Functions.
services: functions
documentationcenter: na
author: wesmc7777
manager: erikre
editor: ''
tags: ''
keywords: azure functions, patterns, best practice, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/09/2016
ms.author: wesmc
---

# Best Practices for Azure Functions

##Overview

This article provides a collection of best practices for you to consider when implementing function apps. 


## Avoid long running functions

Large long running functions can cause unexpected timeout issues. A function can be large because of many Node.js dependencies. These can cause increased load times resulting in unexpected timeouts. These Node.js dependencies could be explicit loaded by multiple `require()` statements in your code. They could also be implicit based on a single module loaded by your code that has it's own internal dependencies.  

Whenever possible refactor large functions into small function sets that work together. For example a webhook or HTTP trigger function might receive a fairly large payload and pass that payload off to a function on a queue trigger as follows:  

--- Need more explanation for the relevance of this example  ---

	module.exports = function (context, data) {
	    context.log('Webhook was triggered, queuing data');
	    if (data != null) {
	        context.bindings.outQ = data;
	    }
	    context.done();
	};


## Cross function communication.

When integrating multiple functions, it is generally a best practice to use storage queues for cross function communications.  The main reason for this being storage queues are cheaper and much easier to provision. 

Individual messages in a storage queue are limited in size to 64KB. If you need a pass larger messages across functions, an Azure Service Bus queue could be used to support message sizes up to 256KB.

Service Bus topics are useful if you require message filtering before processing.

Event hubs are useful to support high volume communications but, this is usually not the case for cross function communication.



## Write functions to be stateless 

Functions should be stateless and idempotent if possible. Associate any state information with your data. For example an order being processed would likely have an associated `state` member. A function could process an order based on that state while the function itself remains stateless. 

Idempotent functions are especially recommended with timer triggers. For example, if you have something that absolutely must run once a day, write it so it can run every minute of the day with the same end results. The function can just exit if there is no work for a particular day. Also if a previous run failed to complete, the next run should pick up where it left off.

- Building on that, assume your function host can crash at any time. If you're processing a bunch of items in a single function, something downstream may throw unexpectedly and bring your function down. You should be prepared to continue from that point when the function next runs.


## Don't mix test and production code and components in the same function app.

Functions within a function app share resources. If you're using a function App in production, don't add test related functions and resources to it. This can unexpectedly increase overhead for production execution.

If you have a shared assembly referenced in multiple .Net functions, put it in a common shared folder. Then reference it with a statement similar to the following: 

	#r "..\Shared\MyAssembly.dll". 

Otherwise, it's easy to accidentally deploy multiple test versions of the same binary that behave differently between functions.

Also verbose logging should not be used in production code. It has a negative performance impact.



## Avoid references to the Task.Result property

If you are using asynchronous C# code, avoid referencing the Task.Result property. This essentially does a busy-wait on a lock of another thread. Holding a lock creates the potential for deadlocks.




## Next steps
For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)

