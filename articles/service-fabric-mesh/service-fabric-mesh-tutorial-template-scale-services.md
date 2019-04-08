---
title: Tutorial- Scale an app running in Azure Service Fabric Mesh | Microsoft Docs
description: In this tutorial, you learn how to scale the services in an application running in Service Fabric Mesh.
services: service-fabric-mesh
documentationcenter: .net
author: dkkapur
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: dekapur
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Scale an application running in Service Fabric Mesh

This tutorial is part two of a series. Learn how to manually scale the number service instances of an application that was [previously deployed to Service Fabric Mesh](service-fabric-mesh-tutorial-template-deploy-app.md). When you're finished, you'll have a front-end service running three instances and a data service running two instances.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Configure the desired number of service instances
> * Perform an upgrade

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Deploy an application to Service Fabric Mesh using a template](service-fabric-mesh-tutorial-template-deploy-app.md)
> * Scale an application running in Service Fabric Mesh
> * [Upgrade an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-upgrade-app.md)
> * [Remove an application](service-fabric-mesh-tutorial-template-remove-app.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* [Install the Azure CLI and Service Fabric Mesh CLI locally](service-fabric-mesh-howto-setup-cli.md#install-the-azure-service-fabric-mesh-cli).

## Manually scale your services in or out

One of the main advantages of deploying applications to Service Fabric Mesh is the ability for you to easily scale your services in or out. This should be used for handling varying amounts of load on your services, or improving availability.

This tutorial uses the To Do List sample as an example, which was [deployed previously](service-fabric-mesh-tutorial-template-deploy-app.md) and should now be running. The application has two services: WebFrontEnd and ToDoService. Each service was initially deployed with a replica count of 1.  To view the number of running replicas for the WebFrontEnd service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name WebFrontEnd --app-name todolistapp --query "replicaCount"
```

To view the number of running replicas for the ToDoService service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name ToDoService --app-name todolistapp --query "replicaCount"
```

In the deployment template for the application resource, each service has a *replicaCount* property that can be used to set the number of times you want that service deployed. An application can consist of multiple services, each service with a unique *replicaCount* number, which are deployed and managed together. In order to scale the number of service replicas, modify the *replicaCount* value for each service you want to scale in the deployment template or parameters file.  Then upgrade the application.

### Modify the deployment template parameters

When you have values in your template that you anticipate changing once the application is deployed, or would like to have the option to change on a per deployment basis (if you plan on reusing this template for other deployments), the best practice is to parameterize the values.

Previously, the application was deployed using the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json) and [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) files.

Open the [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) file locally and set the *frontEndReplicaCount* value to 3 and the *serviceReplicaCount* value to 2:

```json
      "frontEndReplicaCount":{
        "value": "3"
      },
      "serviceReplicaCount":{
        "value": "2"
      }
```

Save your changes to the parameters file.  The *frontEndReplicaCount* and *serviceReplicaCount* parameters are declared in the *parameters* section of the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json):

```json
"frontEndReplicaCount":{
      "defaultValue": "1",
      "type": "string"
    },
    "serviceReplicaCount":{
      "defaultValue": "1",
      "type": "string"
    }
```

The WebFrontEnd service *replicaCount* property references the *frontEndReplicaCount* parameter and the ToDoService service *replicaCount* property references the *serviceReplicaCount* parameter:

```json
    "services": [
    {
    "name": "WebFrontEnd",
    "properties": {
        "description": "WebFrontEnd description.",
        "osType": "Windows",
        "codePackages": [
        {
            ...
        }
        ],
        "replicaCount": "[parameters('frontEndReplicaCount')]",
        "networkRefs": [
        {
            "name": "[resourceId('Microsoft.ServiceFabricMesh/networks', 'todolistappNetwork')]"
        }
        ]
    }
    },
    {
    "name": "ToDoService",
    "properties": {
        "description": "ToDoService description.",
        "osType": "Windows",
        "codePackages": [
        {
            ...
        }
        ],
        "replicaCount": "[parameters('serviceReplicaCount')]",
        "networkRefs": [
        {
            "name": "[resourceId('Microsoft.ServiceFabricMesh/networks', 'todolistappNetwork')]"
        }
        ]
    }
    }
],
```

Once your template has been modified, upgrade your application.

### Upgrade your application

While the application is running, you can upgrade it by redeploying the template and updated parameters file:

```azurecli
az mesh deployment create --resource-group myResourceGroup --template-file c:\temp\mesh_rp.windows.json --parameters c:\temp\mesh_rp.windows.parameters.json
```

This will start a rolling upgrade to your application and you should see the services instances increase in a few minutes.  To view the number of running replicas for the WebFrontEnd service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name WebFrontEnd --app-name todolistapp --query "replicaCount"
```

To view the number of running replicas for the ToDoService service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name ToDoService --app-name todolistapp --query "replicaCount"
```

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Configure the desired number of service instances
> * Perform an upgrade

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Upgrade an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-upgrade-app.md)
