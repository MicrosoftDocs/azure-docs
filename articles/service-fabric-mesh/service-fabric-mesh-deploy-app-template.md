---
title: Deploy an application to Service Fabric Mesh on Azure | Microsoft Docs
description: Learn how to deploy a .NET Core application to Service Fabric Mesh from a template using the Azure CLI.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/04/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
---
# Deploy an application to Service Fabric Mesh from a template
This article shows how to deploy a .NET Core application to Service Fabric Mesh using a template. When you're finished, you have a voting application with an ASP.NET Core web front end that saves voting results in a stateful back-end service in the cluster.

You can easily create a free Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin. 

[!INCLUDE [preview note](./includes/include-preview-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you choose to install and use the CLI locally, you must install the Azure CLI version 2.0.35 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install]. 

Also install the [Service Fabric Mesh CLI module](service-fabric-mesh-setup-developer-environment-sdk.md#install-the-service-fabric-mesh-cli) if it's not already installed.

## Deploy the application
Login to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionID>"
```

Create a resource group to deploy the application to. You can use an existing resource group and skip this step. 

```azurecli-interactive
az group create --name MeshTest-rg --location eastus 
```

Create your application in the resource group using the `deployment create` command, using our [quickstart-linux.json](https://github.com/Azure/service-fabric-mesh-preview-pr/blob/master/samples/templates/votingapp/quickstart-linux.json), or [quickstart-windows.json](https://github.com/Azure/service-fabric-mesh-preview-pr/blob/master/samples/templates/votingapp/quickstart-windows.json):

```azurecli-interactive
az mesh deployment create --resource-group MeshTest-rg --template-file C:\templates\votingapp\quickstart-linux.json
```

In a few seconds, your command should return with `"provisioningState": "Succeeded"`. 

## Check the application deployment status
Your application is now deployed. You can check the application's status using the `app show` command. The application name for the deployed application is "SbzVoting", so fetch its details. 

```azurecli-interactive
az mesh app show --resource-group MeshTest-rg --name VotingApp
```

## List the deployed applications
You can use the "app list" command to get a list of applications you have deployed to your subscription. 

```azurecli-interactive
az mesh app list -o table
```

## Open the application
Once the application status is returned as ""provisioningState": "Succeeded", get the ingress endpoint of the service.  Query the network resource to find the IP address of the container where the service is deployed.

The network resource for the application is "SbzVotingNetwork", so fetch its details.

```azurecli-interactive
az mesh network show --resource-group MeshTest-rg --name VotingAppNetwork
```

The command should now return with the following information:

```json
{
  "addressPrefix": "10.0.0.4/22",
  "description": "Private network for application",
  "id": "/subscriptions/<subscriptionID>/resourcegroups/MeshTest-rg/providers/Microsoft.ServiceFabric/networks/SbzVotingNetwork",
  "ingressConfig": {
    "layer4": [
      {
        "applicationName": "SbzVoting",
        "endpointName": "Endpoint1",
        "publicPort": "80",
        "serviceName": "VotingWeb"
      }
    ],
    "publicIpAddress": "13.68.129.22",
    "qosLevel": "Bronze"
  },
  "location": "eastus",
  "name": "SbzVotingNetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "MeshTest-rg",
  "tags": {},
  "type": "Microsoft.ServiceFabric/networks"
}
```

From the output, copy the public IP address of the service (13.68.129.22 in the preceding example) and open in a browser.

![Voting application](./media/service-fabric-mesh-deploy-app-template/VotingApplication.png)

You can now add voting options to the application and vote on it, or delete the voting options.

## Clean up resources
When you no longer need the application and it's related resources, delete the resource group containing them. 

```azurecli-interactive
az group delete --resource-group MeshTest-rg  
```

## Next steps
To learn more about Service Fabric Mesh, read the overview:
> [!div class="nextstepaction"]
> [Service Fabric Mesh overview](service-fabric-mesh-overview.md)


[azure-cli-install]: /cli/azure/install-azure-cli

