---
# Mandatory fields. See more on aka.ms/skyeye/meta.
#Intent: I want to use my existing containers as is and deploy them to Azure. (Windows or Linux) 
title: Quickstart - Deploy Hello World to Azure Service Fabric Mesh | Microsoft Docs
description: This quickstart shows you how to deploy a application to Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: Don’t add or edit keywords without consulting your SEO champ. 
author: rwike77
ms.author: ryanwi
ms.date: 06/27/2018
ms.topic: quickstart
ms.service: service-fabric-mesh
manager: timlt
---
# Quickstart: Deploy Hello World to Service Fabric Mesh

[Service Fabric Mesh](service-fabric-mesh-overview.md) makes it easy to create and manage microservices applications in Azure, without having to provision virtual machines. In this quickstart, you will create a Hello World application in Azure and expose it to the internet. This operation is completed in a single command. Within just a couple minutes, you'll see this in your browser:

![Hello world app in the browser][sfm-app-browser]

[!INCLUDE [preview note](./includes/include-preview-note.md)]

If you don't already have an Azure account, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you choose to install and use the CLI locally, this quickstart requires that you're running the Azure CLI version 2.0.35 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install].

## Install the Azure Service Fabric Mesh CLI
Remove any previous install of the Azure Service Fabric Mesh CLI module.

```azurecli-interactive
az extension remove --name mesh
```
Install the Azure Service Fabric Mesh CLI extension module. For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI, however, at public preview it would ship as a part of the Azure CLI.

```azurecli-interactive
az extension add --source https://meshcli.blob.core.windows.net/cli/mesh-0.7.0-py2.py3-none-any.whl
```

## Create a resource group

Create a resource group to deploy the application to. Alternatively, you can use an existing resource group and export rg to the name.

```azurecli-interactive
az account set --subscription "SubscriptionID"
export rg=myResourceGroup
az group create --name $rg --location eastus
```

## Deploy the application

Create your application using the `az mesh deployment create` command:

```azurecli-interactive
az mesh deployment create --resource-group $rg --template-uri https://raw.githubusercontent.com/Azure-Samples/service-fabric-configuration/master/container-configuration.json
```

In just over a minute, your command should return with `"provisioningState": "Succeeded"`. 

## Check application deployment status

At this point, your application has been deployed. You can check to see its status by using the `az mesh app show` command. This command provides useful information that you can follow up on.

The application name for this quickstart application is helloWorldApp, to gather the details on the application execute the following command:

```azurecli-interactive
az mesh app show --resource-group $rg --name helloWorldApp
```

## Browse to the application

Once the application status is returned as `"provisioningState": "Succeeded"`, you will need the ingress endpoint of the service. To retrieve the IP address query the network resource for the application where the service is deployed, and open it on a browser.

The network resource for this quickstart application is helloWorldNetwork, you can use the `az mesh network show` command to get the IP address:

```azurecli-interactive
az mesh network show --resource-group $rg --name helloWorldNetwork
```

The command will return with information like the json snippet below when running the command in [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).

From the output, copy the IP address.

```json
    "publicIpAddress": "40.121.47.57",
    "qosLevel": "Bronze"
  },
  "location": "eastus",
  "name": "helloWorldNetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "tags": {},
  "type": "Microsoft.ServiceFabric/networks"
}
```

In the example above, the service end point IP is 40.121.47.57.  Take your corresponding IP address and open it in your favorite browser.

## See all the application you have currently deployed to your subscription

You can use the `az mesh app list` command to get a list of applications you have deployed to your subscription.

```azurecli-interactive
az mesh app list --output table
```

## See the application logs

Examine the logs for the deployed application using the `az mesh code-package-log get` command:

```azurecli-interactive
az mesh code-package-log get --resource-group $rg --application-name helloWorldApp --service-name helloWorldService --replica-name 0 --code-package-name helloWorldCode
```

## Clean up resources

When you are ready to delete the application run the `az mesh app delete` command, you'll be prompted to confirm deletion enter `y` to confirm the command.

```azurecli-interactive
az mesh app delete -g $rg -n helloWorldApp
```

If you no longer need any of the resources you created in this quickstart, you can execute the [az group delete][az-group-delete] command to remove the resource group and all the resources it contains.

```azurecli-interactive
az group delete --name $rg
```

## Next steps

To learn more about Service Fabric Mesh, take a look at this tutorial.
> [!div class="nextstepaction"]
> [Next steps](service-fabric-mesh-tutorial-create-dotnetcore.md)

<!-- Images -->
[sfm-app-browser]: ./media/service-fabric-mesh-quickstart-deploy-container/HelloWorld.png

<!-- Links / Internal -->
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest
