---
title: Quickstart - Create your first Azure Container Instances container
description: Deploy and get started with Azure Container Instances
services: container-instances
author: seanmck
manager: timlt

ms.service: container-instances
ms.topic: quickstart
ms.date: 02/22/2018
ms.author: seanmck
ms.custom: mvc
---

# Create your first container in Azure Container Instances
Azure Container Instances makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines or adopt a higher-level service. In this quickstart, you create a container in Azure and expose it to the internet with a fully qualified domain name (FQDN). This operation is completed in a single command. Within just a few seconds, you'll see this in your browser:

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

If you don't have an Azure subscription, create a [free account][azure-account] before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli-install].

## Create a resource group

Azure Container Instances are Azure resources and must be placed in an Azure resource group, a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create][az-group-create] command.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container

You can create a container by providing a name, a Docker image, and an Azure resource group to the [az container create][az-container-create] command. You can optionally expose the container to the internet by specifying a DNS name label. In this quickstart, you deploy a container that hosts a small web app written in [Node.js][node-js].

Execute the following command to start a container instance. The `--dns-name-label` value must be unique within the Azure region you create the instance, so you might need to modify this value to ensure uniqueness.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image microsoft/aci-helloworld --dns-name-label aci-demo --ports 80
```

Within a few seconds, you should get a response to your request. Initially, the container is in the **Creating** state, but it should start within a few seconds. You can check the status using the [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
```

When you run the command, the container's fully qualified domain name (FQDN) and its provisioning state are displayed:

```console
$ az container show --resource-group myResourceGroup --name mycontainer --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
FQDN                               ProvisioningState
---------------------------------  -------------------
aci-demo.eastus.azurecontainer.io  Succeeded
```

Once the container moves to the **Succeeded** state, you can reach it in your browser by navigating to its FQDN:

![Browser screenshot showing application running in an Azure container instance][aci-app-browser]

## Pull the container logs

You can pull the logs for the container you created using the [az container logs][az-container-logs] command:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer
```

Output:

```bash
listening on port 80
::ffff:10.240.255.107 - - [29/Nov/2017:20:48:50 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
::ffff:10.240.255.107 - - [29/Nov/2017:20:48:50 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://52.224.178.107/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
```

## Delete the container

When you are done with the container, you can remove it using the [az container delete][az-container-delete] command:

```azurecli-interactive
az container delete --resource-group myResourceGroup --name mycontainer
```

To verify that the container has been deleted, execute the [az container list](/cli/azure/container#az_container_list) command:

```azurecli-interactive
az container list --resource-group myResourceGroup --output table
```

The **mycontainer** container should not appear in the command's output. If you have no other containers in the resource group, no output is displayed.

## Next steps

All of the code for the container used in this quickstart is available [on GitHub][app-github-repo], along with its Dockerfile. If you'd like to try building it yourself and deploying it to Azure Container Instances using the Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](./container-instances-tutorial-prepare-app.md)

To try out options for running containers in an orchestration system on Azure, see the [Service Fabric][service-fabric] or [Azure Container Service (AKS)][container-service] quickstarts.

<!-- IMAGES -->
[aci-app-browser]: ./media/container-instances-quickstart/aci-app-browser.png

<!-- LINKS - External -->
[app-github-repo]: https://github.com/Azure-Samples/aci-helloworld.git
[azure-account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[node-js]: http://nodejs.org

<!-- LINKS - Internal -->
[az-group-create]: /cli/azure/group?view=azure-cli-latest#az_group_create
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az_container_create
[az-container-delete]: /cli/azure/container?view=azure-cli-latest#az_container_delete
[az-container-list]: /cli/azure/container?view=azure-cli-latest#az_container_list
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az_container_logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show
[azure-cli-install]: /cli/azure/install-azure-cli
[container-service]: ../aks/kubernetes-walkthrough.md
[service-fabric]: ../service-fabric/service-fabric-quickstart-containers.md
