---
title: Tutorial- View Azure Service Fabric Mesh app logs | Microsoft Docs
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
#Customer intent: As a developer, I want learn how to debug a Service Fabric Mesh app that communicates with another service.
---

# Tutorial: View Azure Service Fabric Mesh app logs

This tutorial is part four of a series and shows you how to view the app logs for a deployed Azure Service Fabric Mesh web app.

In this tutorial you will learn:

> [!div class="checklist"]
> * How to view the logs for a deployed Service Fabric Mesh app

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Build a Service Fabric Mesh application](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * Debug the app locally
> * [Publish the app to Azure](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* Deploy the to-do app. If you have not done that yet, follow the instructions in [Publish the app to Azure](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md).

## See the application logs

Examine the logs for the deployed to-do app:

```azurecli-interactive
az mesh code-package-log get --resource-group $rg --application-name ServiceMeshApp --service-name todoservice --replica-name 0 --code-package-name ServiceMeshApp
```

JTW: To view the logs of your own app, supply the value for the  your resource group in place of `$rg` ...

## Next steps

In this part of the tutorial, you learned:
> [!div class="checklist"]
> * How to view the logs for a deployed Service Fabric Mesh app

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)