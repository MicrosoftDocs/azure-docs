---
title: Scale services in an Azure Service Fabric Mesh application | Microsoft Docs
description: Learn how to independently scale services within an application running on Service Fabric Mesh using the Azure CLI.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/26/2018
ms.author: ryanwi
ms.custom: mvc, devcenter 
---

# Scale services within an application running on Service Fabric Mesh

This article shows how to independently scale microservices within an application. In this example, Visual Objects application consists of two microservices; `web` and `worker`. 

The `web` service is an ASP.NET Core application with a web page that shows triangles in the browser. The browser displays one triangle for each instance of the `worker` service. 

The `worker` service moves the triangle at a predefined interval in the space and sends location of the triangle to `web` service. It uses DNS to resolve the address of the `web` service.

## Set up Service Fabric Mesh CLI 
You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Sign in to Azure
Sign in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

## Create resource group
Create a resource group to deploy the application to. You can use an existing resource group and skip this step. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus 
```

## Deploy the application with one worker service
Create your application in the resource group using the `deployment create` command.

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.base.linux.json --parameters "{\"location\": {\"value\": \"eastus\"}}"
  
```
The preceding command deploys a Linux application using [mesh_rp.base.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.base.linux.json). If you want to deploy a Windows application, use [mesh_rp.base.windows.json template](https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.base.windows.json). Windows container images are larger than Linux container images and may take more time to deploy.

In a few minutes, your command should return with:

`visualObjectsApp has been deployed successfully on visualObjectsNetwork with public ip address <IP Address>` 

## Open the application
Once the application successfully deploys, get the public IP address for the service endpoint, and open it on a browser. It displays a web page with one triangle moving through the space.

The deployment command returns the public IP address of the service endpoint. Optionally, You can also query the network resource to find the public IP address of the service endpoint. 
 
The network resource name for this application is `visualObjectsNetwork`, fetch information about it using the following command. 

```azurecli-interactive
az mesh network show --resource-group myResourceGroup --name visualObjectsNetwork
```

## Scale `worker` service

Scale the `worker` service to three instances using the following command. 

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.scaleout.linux.json --parameters "{\"location\": {\"value\": \"eastus\"}}"
  
```
The preceding command deploys a Linux using [mesh_rp.scaleout.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.scaleout.linux.json). If you want to deploy a Windows application, use [mesh_rp.scaleout.windows.json template](https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.scaleout.windows.json). Windows container images are larger than Linux container images and may take more time to deploy.

Once the application successfully deploys, the browser should be displaying a web page with three triangles moving through the space.

## Delete the resources

To conserve the limited resources assigned for the preview program, delete the resources frequently. To delete resources related to this example, delete the resource group in which they were deployed.

```azurecli-interactive
az group delete --resource-group myResourceGroup 
```

## Next steps
- View the Visual Objects sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/visualobjects).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).