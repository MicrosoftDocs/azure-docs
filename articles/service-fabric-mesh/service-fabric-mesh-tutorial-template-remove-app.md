---
title: Tutorial- Remove an app running in Azure Service Fabric Mesh | Microsoft Docs
description: In this tutorial, learn how to remove an application running in Service Fabric Mesh and delete resources.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/15/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Remove an application and resources

This tutorial is part four of a series. You'll learn how to remove a running application that was [previously deployed to Service Fabric Mesh](service-fabric-mesh-tutorial-template-deploy-app.md). 

In part four of the series, you learn how to:

> [!div class="checklist"]
> * Delete an app running in Service Fabric Mesh
> * Delete the application resources

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Deploy an application to Service Fabric Mesh using a template](service-fabric-mesh-tutorial-template-deploy-app.md)
> * [Scale an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-scale-services.md)
> * [Upgrade an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-upgrade-app.md)
> * Remove an application

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Open [Azure Cloud Shell](service-fabric-mesh-howto-setup-cli.md), or [install the Azure CLI and Service Fabric Mesh CLI locally](service-fabric-mesh-howto-setup-cli.md#install-the-service-fabric-mesh-cli-locally).

## Delete the resource group and all the resources

When no longer needed, delete all of the resources you created. Previously, you [created an new resource group](service-fabric-mesh-tutorial-template-deploy-app.md#create-a-container-registry) to host the Azure Container Registry instance and the Service Fabric Mesh application resources.  You can delete this resource group, which will delete all of the associated resources.

```azurecli
az group delete --resource-group myResourceGroup
```

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Individually delete the resources
You can also delete the ACR instance, Service Fabric Mesh application, and network resources individually.

To delete the ACR instance:

```azurecli
az acr delete --resource-group myResourceGroup --name myContainerRegistry
```

To delete the Service Fabric Mesh application:

```azurecli
az mesh app delete --resource-group myResourceGroup --name todolistapp
```

To delete the network:
```azurecli
az mesh network delete --resource-group myResourceGroup --name todolistappNetwork
```

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Delete an app running in Service Fabric Mesh
> * Delete the application resources