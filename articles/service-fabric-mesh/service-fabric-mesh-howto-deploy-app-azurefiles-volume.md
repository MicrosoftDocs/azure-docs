---
title: Store state in an Azure Service Fabric Mesh application by mounting an Azure Files based volume inside the container  | Microsoft Docs
description: Learn how to store state in an Azure Service Fabric Mesh application by mounting an Azure Files based volume inside the container using the Azure CLI.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: jeconnoc
editor: ''
ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/09/2018
ms.author: ryanwi
ms.custom: mvc, devcenter 
---

# Store state in an Azure Service Fabric Mesh application by mounting an Azure Files based volume inside the container

This article shows how to store state in Azure Files by mounting a volume inside the container of a Service Fabric Mesh application. In this example, the Counter application has an ASP.NET Core service with a web page that shows counter value in a browser. 

The `counterService` periodically reads a counter value from a file, increments it and write it back to the file. The file is stored in a folder that is mounted on the volume backed by Azure Files share.

## Prerequisites

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. To use the Azure CLI with this article, ensure that `az --version` returns at least `azure-cli (2.0.43)`.  Install (or update) the Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Sign in to Azure

Sign in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

## Create a file share

Create an Azure file share by following these [instructions](/azure/storage/files/storage-how-to-create-file-share). The storage account name, storage account key and the file share name are referenced as `<storageAccountName>`, `<storageAccountKey>`, and `<fileShareName>` in the following instructions. These values are available in your Azure portal:
* <storageAccountName> - Under **Storage Accounts**, it is the name of the storage account you used when you created the file share.
* <storageAccountKey> - Select your storage account under **Storage Accounts** and then select **Access keys** and use the value under **key1**.
* <fileShareName> - Select your storage account under  **Storage Accounts** and then select **Files**. The name to use is the name of the file share you just created.

## Create a resource group

Create a resource group to deploy the application to. The following command creates a resource group named `myResourceGroup` in a location in the eastern United States.

```azurecli-interactive
az group create --name myResourceGroup --location eastus 
```

## Deploy the template

Create the application and related resources using the following command, and provide the values for `storageAccountName`, `storageAccountKey` and `fileShareName` from the earlier [Create a file share](#create-a-file-share) step.

The `storageAccountKey` parameter in the template is a secure string. It will not be displayed in the deployment status and `az mesh service show` commands. Ensure that it is correctly specified in the following command.

The following command deploys a Linux application using the [mesh_rp.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.linux.json). To deploy a Windows application, use the [mesh_rp.windows.json template](https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.windows.json). Be aware that larger container images may take longer to deploy.

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/counter/mesh_rp.linux.json  --parameters "{\"location\": {\"value\": \"eastus\"}, \"fileShareName\": {\"value\": \"<fileShareName>\"}, \"storageAccountName\": {\"value\": \"<storageAccountName>\"}, \"storageAccountKey\": {\"value\": \"<storageAccountKey>\"}}"
```

In a few minutes, the command should return with `counterApp has been deployed successfully on counterAppNetwork with public ip address <IP Address>`

## Open the application

The deployment command will return the public IP address of the service endpoint. Once the application successfully deploys, get the public IP address for the service endpoint and open it from a browser. It will display a web page with the counter value being updated every second.

The network resource name for this application is `counterAppNetwork`. You can see info about the app such as its description, location, resource group, etc. by using the following command:

```azurecli-interactive
az mesh network show --resource-group myResourceGroup --name counterAppNetwork
```

## Verify that the application is able to use the volume

The application creates a file named `counter.txt` in the file share inside `counter/counterService` folder. The content of this file is the counter value being displayed on the web page.

The file may be downloaded using any tool that enables browsing an Azure Files file share, such as the [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Delete the resources

Frequently delete the resources you are no longer using in Azure. To delete the resources related to this example, delete the resource group in which they were deployed (which deletes everything associated with the resource group) with the following command:

```azurecli-interactive
az group delete --resource-group myResourceGroup
```

## Next steps

- View the Azure Files volume sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).