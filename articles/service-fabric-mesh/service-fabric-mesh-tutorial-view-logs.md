---
title: Tutorial- Monitor and diagnose an Azure Service Fabric Mesh app | Microsoft Docs
description: In this tutorial, examine the logs of a deployed Service Fabric Mesh web app
services: service-fabric-mesh
documentationcenter: .net
author: TylerMSFT
manager: jeconnoc 
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/18/2018
ms.author: twhitney
ms.custom: mvc, devcenter 
#Customer intent: As a developer, I want learn how to view app logs and monitor my Service Fabric Mesh app.
---

# Tutorial: Monitor and diagnose an Azure Service Fabric Mesh app

This tutorial is part four of a series and shows you how to view the app logs for a deployed Azure Service Fabric Mesh web app. You will also integrate App Insights to generate app level telemetry.

In this tutorial you will learn:

> [!div class="checklist"]
> * How to view the logs for a deployed Service Fabric Mesh app
> * How to integrate App Insights and generate a diagnostic message when a task is added to the to-do app.

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create a Service Fabric Mesh app in Visual Studio](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * [Debug a Service Fabric Mesh app running in your local development cluster](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)
> * [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)
> Monitor and diagnose a Service Fabric Mesh app using Application Insights
> * [Upgrade a Service Fabric Mesh app](service-fabric-mesh-tutorial-upgrade.md)
> * [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* Deploy the to-do app. If you have not done that yet, follow the instructions in [Publish the app to Azure](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md).

## See the application logs

Examine the logs for the deployed to-do app:

Sign in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

Then get the logs:

```azurecli-interactive
az mesh code-package-log get --resource-group sfmeshTutorial1RG --application-name todolistapp  --service-name todoservice --replica-name 0 --code-package-name todolistapp
```

## Integrate App-Insights

App Insights is a good solution for writing and monitoring Application level telemetry. It does not reflect container lifecycle events, nor performance counters.

JTW: TBD

## Next steps

In this part of the tutorial, you learned:
> [!div class="checklist"]
> * How to view the logs for a deployed Service Fabric Mesh app

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Upgrade a Service Fabric Mesh app](service-fabric-mesh-tutorial-upgrade.md)