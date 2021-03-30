---
title: WebJob, background tasks, on Azure
description: Learn about WebJobs. 
author: ggailey777

ms.assetid: af01771e-54eb-4aea-af5f-f883ff39572b
ms.topic: conceptual
ms.date: 10/16/2018
ms.author: glenga
ROBOTS: NOINDEX,NOFOLLOW
---


# WebJobs run background tasks in Azure App Service

This article shows how to deploy WebJobs by using the [Azure portal](https://portal.azure.com) to upload an executable or script. For information about how to develop and deploy WebJobs by using Visual Studio, see [Deploy WebJobs using Visual Studio](webjobs-dotnet-deploy-vs.md).

## Overview
WebJobs is a feature of [Azure App Service](index.yml) that enables you to run a program or script in the same instance as a web app, API app, or mobile app. There is no additional cost to use WebJobs.

> [!IMPORTANT]
> WebJobs is not yet supported for App Service on Linux.

The Azure WebJobs SDK can be used with WebJobs to simplify many programming tasks. For more information, see [What is the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).

Azure Functions provides another way to run programs and scripts. For a comparison between WebJobs and Functions, see [Choose between Flow, Logic Apps, Functions, and WebJobs](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## WebJob types

The following table describes the differences between *continuous* and *triggered* WebJobs.


|Continuous  |Triggered  |
|---------|---------|
| Starts immediately when the WebJob is created. To keep the job from ending, the program or script typically does its work inside an endless loop. If the job does end, you can restart it. | Starts only when triggered manually or on a schedule. |
| Runs on all instances that the web app runs on. You can optionally restrict the WebJob to a single instance. |Runs on a single instance that Azure selects for load balancing.|
| Supports remote debugging. | Doesn't support remote debugging.|

[!INCLUDE [webjobs-always-on-note](../../includes/webjobs-always-on-note.md)]

## Add WebJob to source control

If you have source control configured with your application, the Webjobs should be deployed as part of the source control integration. Once source control is configured with your application a WebJob cannot be add from the Azure Portal.

## <a name="acceptablefiles"></a>Supported file types for scripts or programs

The following file types are supported:

* .cmd, .bat, .exe (using Windows cmd)
* .ps1 (using PowerShell)
* .sh (using Bash)
* .php (using PHP)
* .py (using Python)
* .js (using Node.js)
* .jar (using Java)

## Next steps

* Learn how to [create a WebJob](./webjobs-create-ieux.md)
* View log history of [WebJobs](./webjobs-create-ieux-view-log.md)
