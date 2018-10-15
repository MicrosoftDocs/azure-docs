---
# Mandatory fields. See more on aka.ms/skyeye/meta.
#Intent: I want to use my existing containers as is and deploy them to Azure. (Windows or Linux) 
title: Quickstart - Deploy Hello World to Azure Service Fabric Mesh | Microsoft Docs
description: This quickstart shows you how to deploy a Service Fabric Mesh application to Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: Don’t add or edit keywords without consulting your SEO champ. 
author: rwike77
ms.author: ryanwi
ms.date: 08/24/2018
ms.topic: quickstart
ms.service: service-fabric-mesh
manager: timlt 
---
# Quickstart: Deploy Hello World to Service Fabric Mesh

[Service Fabric Mesh](service-fabric-mesh-overview.md) makes it easy to create and manage microservices applications in Azure, without having to provision virtual machines. In this quickstart, you will create a Hello World application in Azure and expose it to the internet. This operation is completed in a single command. Within just a couple minutes, you'll see this view in your browser:

![Hello world app in the browser][sfm-app-browser]

[!INCLUDE [preview note](./includes/include-preview-note.md)]

If you don't already have an Azure account, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Set up Service Fabric Mesh CLI 
You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

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

## Deploy the application
Create your application in the resource group using the `az mesh deployment create` command.  Run the following:

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.linux.json --parameters "{'location': {'value': 'eastus'}}" 
```

The preceding command deploys a Linux application using [mesh_rp.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.linux.json). If you want to deploy a Windows application, use [mesh_rp.windows.json template](https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.windows.json). Windows container images are larger than Linux container images and may take more time to deploy.

In a few minutes, the command returns:

`helloWorldApp has been deployed successfully on helloWorldNetwork with public ip address <IP Address>` 

## Open the application
Once the application successfully deploys, copy the public IP address for the service endpoint from the CLI output. Open the IP address in a web browser. A web page with the Azure Service Fabric Mesh logo displays.

## Check the application details
You can check the application's status using the `az mesh app show` command. This command provides useful information that you can follow up on.

The application name for this quickstart is `helloWorldApp`, to gather the details on the application execute the following command:

```azurecli-interactive
az mesh app show --resource-group myResourceGroup --name helloWorldApp
```

## See the application logs

Examine the logs for the deployed application using the `az mesh code-package-log get` command:

```azurecli-interactive
az mesh code-package-log get --resource-group myResourceGroup --application-name helloWorldApp --service-name helloWorldService --replica-name 0 --code-package-name helloWorldCode
```

## Clean up resources

When you are ready to delete the application, run the [az group delete][az-group-delete] command to remove the resource group and the application and network resources it contains.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

To learn more about creating and deploying Service Fabric Mesh applications, continue to the tutorial.
> [!div class="nextstepaction"]
> [Create and deploy a multi-service web application](service-fabric-mesh-tutorial-create-dotnetcore.md)

<!-- Images -->
[sfm-app-browser]: ./media/service-fabric-mesh-quickstart-deploy-container/HelloWorld.png

<!-- Links / Internal -->
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest
