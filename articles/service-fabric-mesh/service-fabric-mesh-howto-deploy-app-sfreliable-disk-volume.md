---
title: Use highly available Service Fabric Reliable Disk Volume in an Azure Service Fabric Mesh application | Microsoft Docs
description: Learn how to store state in an Azure Service Fabric Mesh application by mounting Service Fabric Reliable Disk based volume inside the container using the Azure CLI.
services: service-fabric-mesh
documentationcenter: .net
author: ashishnegi
manager: raunakpandya
editor: ''
ms.assetid:
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/03/2018
ms.author: asnegi
ms.custom: mvc, devcenter
---

# Mount highly available Service Fabric Reliable Disk based volume in a Service Fabric Mesh application 
The common method of persisting state with container apps is to use remote storage like Azure File Storage or database like Azure Cosmos DB. This incurs significant read and write network latency to the remote store.

This article shows how to store state in highly available Service Fabric Reliable Disk by mounting a volume inside the container of a Service Fabric Mesh application.
Service Fabric Reliable Disk provides volumes for local reads with writes replicated within the Service Fabric Cluster for high availability. This removes network calls for reads and reduces network latency for writes. If the container restarts or moves to another node, new container instance will see the same volume as older one. Thus it is both efficient and highly available.

In this example, the Counter application has an ASP.NET Core service with a web page that shows counter value in a browser.

The `counterService` periodically reads a counter value from a file, increments it and write it back to the file. The file is stored in a folder that is mounted on the volume backed by Service Fabric Reliable Disk.

## Prerequisites

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. To use the Azure CLI with this article, ensure that `az --version` returns at least `azure-cli (2.0.43)`.  Install (or update) the Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Sign in to Azure

Sign in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

## Create a resource group

Create a resource group to deploy the application to. The following command creates a resource group named `myResourceGroup` in a location in the eastern United States. If you change the resource group name in below command, remember to change it in all commands that follow.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Deploy the template

The following command deploys a Linux application using the [counter.sfreliablevolume.linux.json template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/counter/counter.sfreliablevolume.linux.json). To deploy a Windows application, use the [counter.sfreliablevolume.windows.json template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/counter/counter.sfreliablevolume.windows.json). Be aware that larger container images may take longer to deploy.

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://raw.githubusercontent.com/Azure-Samples/service-fabric-mesh/master/templates/counter/counter.sfreliablevolume.linux.json
```

You can also see the state of the deployment with the command

```azurecli-interactive
az group deployment show --name counter.sfreliablevolume.linux --resource-group myResourceGroup
```

Notice the name of gateway resource which has resource type as `Microsoft.ServiceFabricMesh/gateways`. This will be used in getting public IP address of the app.

## Open the application

Once the application successfully deploys, get the ipAddress of the gateway resource for the app. Use the gateway name you noticed in above section.
```azurecli-interactive
az mesh gateway show --resource-group myResourceGroup --name counterGateway
```

The output should have a property `ipAddress` which is the public IP address for the service endpoint. Open it from a browser. It will display a web page with the counter value being updated every second.

## Verify that the application is able to use the volume

The application creates a file named `counter.txt` in the volume inside `counter/counterService` folder. The content of this file is the counter value being displayed on the web page.

## Delete the resources

Frequently delete the resources you are no longer using in Azure. To delete the resources related to this example, delete the resource group in which they were deployed (which deletes everything associated with the resource group) with the following command:

```azurecli-interactive
az group delete --resource-group myResourceGroup
```

## Next steps

- View the Service Fabric Reliable Volume Disk sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).
