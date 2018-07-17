---
title: Store state by mounting Azure Files based volume inside the container in Service Fabric Mesh application | Microsoft Docs
description: Learn how to store state by mounting Azure Files based volume inside the container in Service Fabric Mesh application using the Azure CLI.
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

# Store state by mounting Azure Files based volume in Service Fabric Mesh application

This article shows how to store state in Azure Files by mounting a volume inside the container of a Service Fabric Mesh application. In this example, Counter application has an ASP.NET Core service with a web page that shows counter value in a browser. 

The `counterService` perodically reads a counter value from a file, increments it and write it back to the file. The file is stored in a folder that is mounted on the volume backed by Azure Files share. 

## Set up Service Fabric Mesh CLI 
You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Sign in to Azure
Sign in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

## Create file share 
Create an Azure file share by following these [instructions](/azure/storage/files/storage-how-to-create-file-share). The storage account name, storage account key and the file share name are referenced as  `<storageAccountName>`, `<storageAccountKey>`, and `<fileShareName>` in the following instructions.

## Create resource group
Create a resource group to deploy the application to. You can use an existing resource group and skip this step. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus 
```

## Deploy the template

Create the application and related resources using the following command, and provide the values for `storageAccountName`, `storageAccountKey` and `fileShareName` from the previous step.

The `storageAccountKey` parameter in the template is a `securestring`. It will not be displayed in the deployment status and `az mesh service show` commands. Ensure that it is correctly specified in the following command.

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.linux.json  --parameters "{\"location\": {\"value\": \"eastus\"}, \"fileShareName\": {\"value\": \"<fileShareName>\"}, \"storageAccountName\": {\"value\": \"<storageAccountName>\"}, \"storageAccountKey\": {\"value\": \"<storageAccountKey>\"}}"
```

The preceding command deploys a Linux application using [mesh_rp.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.linux.json). If you want to deploy a Windows application, use [mesh_rp.windows.json template](https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.windows.json). Windows container images are larger than Linux container images and may take more time to deploy.

In a few minutes, your command should return with:

`counterApp has been deployed successfully on counterAppNetwork with public ip address <IP Address>` 

## Open the application
Once the application successfully deploys, get the public IP address for the service endpoint, and open it on a browser. It displays a web page with the counter value being updated every second.

The deployment command returns the public IP address of the service endpoint. Optionally, You can also query the network resource to find the public IP address of the service endpoint. 
 
The network resource name for this application is `counterAppNetwork`, fetch information about it using the following command. 

```azurecli-interactive
az mesh network show --resource-group myResourceGroup --name counterAppNetwork
```

## Verify that the application is able to use the volume
The application creates a file named `counter.txt` in the file share inside `counter/counterService` folder. The content of this file is the counter value being displayed on the web page.

The file may be downloaded using any tool that enables browsing an Azure Files file share. The [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is an example of such a tool.

## Delete the resources

To conserve the limited resources assigned for the preview program, delete the resources frequently. To delete resources related to this example, delete the resource group in which they were deployed.

```azurecli-interactive
az group delete --resource-group myResourceGroup 
```

## Next steps

- View the Azure Files volume sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).
