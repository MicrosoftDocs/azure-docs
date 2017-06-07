---
title: Using .NET class libraries with Azure Functions | Microsoft Docs
description: Learn how to author .NET class libraries for use with Azure Functions
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: 9f5db0c2-a88e-4fa8-9b59-37a7096fc828
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 06/07/2017
ms.author: donnam

---
# Using .NET class libraries with Azure Functions

In addition to script files, Azure Functions supports publishing a class library as the implementation for one or more functions in a Function App. We recommend that you use the [Azure Functions Visual Studio 2017 Tools](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/).

## Prerequisites 

This article has the following prerequisites:

- [Visual Studio 2017 15.3 Preview](https://www.visualstudio.com/vs/preview/). Install the workloads **ASP.NET and web development** and **Azure development**.
- [Azure Function Tools for Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=AndrewBHall-MSFT.AzureFunctionToolsforVisualStudio2017)

## Creating a class library project

From Visual Studio, create a new Azure Functions project. This creates the files *host.json* and *local.settings.json*. You can [customize Azure Functions runtime settings in host.json](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json). 

The file *local.settings.json* stores app settings, connection strings, and settings for Azure Functions Core Tools. To learn more about its structure, see [Code and test Azure functions locally](functions-run-local.md#local-settings).

## Triggers and bindings

The following table lists the triggers and bindings that are available in an Azure Functions class library project. All attributes are in the namespace `Microsoft.Azure.WebJobs`.

| Binding | Attribute | NuGet package | Sample |
|------   | ------    | ------        | ------ |
| Blob storage trigger, input, output | [`BlobAttribute`] | [Microsoft.Azure.WebJobs] | [Blob storage sample](#blob-sample) |
| Cosmos DB input and output binding | [`DocumentDBAttribute`] | [Microsoft.Azure.WebJobs.Extensions.DocumentDB] | [Cosmos DB sample](#cosmos-db-sample) |
| Event Hubs trigger and output | [`EventHubAttribute`] | [Microsoft.Azure.WebJobs.ServiceBus] | [Event Hub sample](#event-hub-sample) |
| External file input and output | [`ApiHubFileAttribute`] | [Microsoft.Azure.WebJobs.Extensions.ApiHub] |  | 
| HTTP trigger | [`HttpTriggerAttribute`] | [Microsoft.Azure.WebJobs.Extensions.Http] | [HTTP sample](#http-sample) |
| Mobile Apps input and output | [`MobileTableAttribute`] | [Microsoft.Azure.WebJobs.Extensions.MobileApps] |  |
| Notification Hubs output | [`NotificationHubAttribute`] | [Microsoft.Azure.WebJobs.Extensions.NotificationHubs] | |
| Queue storage trigger and output | [`QueueAttribute`] | [Microsoft.Azure.WebJobs] | [Queue sample](#queue-sample) |
| SendGrid output | [`SendGridAttribute`] | [Microsoft.Azure.WebJobs.Extensions.SendGrid] | [SendGrid sample](#sendgrid-sample) |
| Service Bus trigger and output | [`ServiceBusAttribute`], [`ServiceBusAccountAttribute`] | [Microsoft.Azure.WebJobs.ServiceBus] | [Service Bus sample](#service-bus-sample) |
| Table storage input and output | [`TableAttribute`] | [Microsoft.Azure.WebJobs] | [Table storage sample](#table-sample) |
| Timer trigger | [`TimerTriggerAttribute`] | [Microsoft.Azure.WebJobs.Extensions] | [Timer trigger sample](#timer-sample) |
| Twilio output | [`TwilioSmsAttribute`] | [Microsoft.Azure.WebJobs.Extensions.Twilio] | [Twilio sample](#twilio-sample) |


<!-- NuGet packages --> 
[Microsoft.Azure.WebJobs]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs/2.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions.DocumentDB]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DocumentDB/1.1.0-beta1
[Microsoft.Azure.WebJobs.ServiceBus]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus/2.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions.MobileApps]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.MobileApps/1.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions.NotificationHubs]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.NotificationHubs/1.1.0-beta1
[Microsoft.Azure.WebJobs.ServiceBus]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus/2.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions.SendGrid]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid/2.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions.Http]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http/1.0.0-beta1
[Microsoft.Azure.WebJobs.Extensions.BotFramework]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.BotFramework/1.0.15-beta
[Microsoft.Azure.WebJobs.Extensions.ApiHub]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ApiHub/1.0.0-beta4
[Microsoft.Azure.WebJobs.Extensions.Twilio]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Twilio/1.1.0-beta1
[Microsoft.Azure.WebJobs.Extensions]: http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions/2.1.0-beta1


<!-- Links to source --> 
[`DocumentDBAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.DocumentDB/DocumentDBAttribute.cs
[`EventHubAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubAttribute.cs
[`MobileTableAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs
[`NotificationHubAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.NotificationHubs/NotificationHubAttribute.cs 
[`ServiceBusAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAttribute.cs
[`ServiceBusAccountAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAccountAttribute.cs
[`QueueAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueAttribute.cs
[`StorageAccountAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs
[`BlobAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/BlobAttribute.cs
[`TableAttribute`]: https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/TableAttribute.cs
[`TwilioSmsAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Twilio/TwilioSMSAttribute.cs
[`SendGridAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.SendGrid/SendGridAttribute.cs
[`HttpTriggerAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/dev/src/WebJobs.Extensions.Http/HttpTriggerAttribute.cs
[`ApiHubFileAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.ApiHub/ApiHubFileAttribute.cs
[`TimerTriggerAttribute`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerTriggerAttribute.cs