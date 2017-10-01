---
title: Install the Durable Functions extension for Azure Functions
description: Learn how to install the Durable Functions extension for Azure Functions, for portal development or Visual Studio development.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: cgillum
---

# Install the Durable Functions extension
Durable Functions is an extension of Azure Functions which uses a brand new binding extensibility model. Binding extensions can be added to a function app project using a simple NuGet package reference. The details of how to install this NuGet reference depends on how you are developing your function app.

When using Visual Studio to author functions using this Durable Task extension, you can simply add a NuGet reference to the `Microsoft.Azure.WebJobs.Extensions.DurableTask`. For Azure Portal development, manual setup is required (details below).

## Visual Studio 2017 (Recommended)
Visual Studio currently provides the best experience for developing against Durable Functions. Here is how to get started:

1. Install the [latest version of Visual Studio](https://www.visualstudio.com/downloads/) (VS 2017 15.3 or greater) if you haven't already and include the Azure tools in your setup options.
2. Create a new Function App project. Even better, start with the [Visual Studio Sample App (.zip)](~/files/VSDFSampleApp.zip).
3. Add the following NuGet package reference to your .csproj file (NOTE: the sample app already has this):

```xml
<PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="1.0.0-beta" />
```

This allows your project to download and reference the **DurableTask** extension which is required for Durable Functions. Your functions can be run locally and can also be published to and run in Azure.

## Azure Portal (TODO: REVIEW)
When using the Azure Portal for development, you can create a new function and select the **Durable Orchestration Trigger - C#** template. This will take care of automatically downloading the DurableTask extension from nuget.org and creating a new orchestrator function.

## Other
When using development tools other than Visual Studio (for example, VS Code or the Azure Portal), the steps for configuring the binding extension are a little different.

TODO: What are these steps??

