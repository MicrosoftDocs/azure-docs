---
title: Tutorial - Deploy a Spot container group on Azure Container Instances
description: In this quickstart, you use the Azure CLI to quickly deploy a Spot container on Azure Container Instances
ms.topic: tutorial
ms.author: atsenthi
author: athinanthny
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.date:  05/11/2023
---

# Tutorial: Deploy a Spot container with Azure Container Instances using the Azure CLI (Preview)

Spot Containers combine the simplicity of ACI with the low cost of Spot VMs making it easy and affordable for customers to run containerized interruptible workloads at scale.  Use Azure Container Instances to run serverless Spot containers. Deploy an application to a Spot container  on-demand when you want to run interruptible, containerized workloads on unused Azure capacity at low cost and you don't need a full container orchestration platform like Azure Kubernetes Service.

In this quickstart, you use the Azure CLI to deploy a helloworld container using Spot containers. A few seconds after you execute a single deployment command, you can browse to the container logs:

- This quickstart requires version 2xxx later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

First, create a resource group named *myResourceGroup* in the *westus* location with the following [az group create][az-group-create] command:

```azurecli-interactive
az group create --name myResourceGroup --location westus
```

## Create a container

Now that you have a resource group, you can run a Spot container in Azure. To create a Spot container group with the Azure CLI, provide a resource group name, container instance name, container image  and new property called 'priority' with value of 'Spot' to the [az container create][az-container-create] command. In this quickstart, you use the public `mcr.microsoft.com/azuredocs/aci-helloworld` image. This image packages a small web app written in Node.js that serves a static HTML page.

You can't expose your spot containers to the internet by specifying one or more ports to open, a DNS name label, or both. In this quickstart, you deploy a container using helloworld image without a DNS name label. It won't be publicly reachable. You can query the container logs to verify container is listening on default port 80.

Execute a command similar to the following to start a container instance.  

```azurecli-interactive
az container create --resource-group acispotdemo --name acispotclitest --image mcr.microsoft.com/azuredocs/aci-helloworld --priority spot
```

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group acispotdemo --name acispotclitest --query "{ProvisioningState:provisioningState}" --out table
```

When you run the command, the container's fully qualified domain name (FQDN) and its provisioning state are displayed.

```output
ContainerGroupName                               ProvisioningState
---------------------------------  -------------------
acispotclitest                        Succeeded
```

If the container's `ProvisioningState` is **Succeeded**, congratulations! You've successfully deployed an application running in a Docker container to Azure.

## Pull the container logs

When you need to troubleshoot a container or the application it runs (or just see its output), start by viewing the container instance's logs.

Pull the container instance logs with the [az container logs][az-container-logs] command:

```azurecli-interactive
az container logs --resource-group acispotdemo --name acispotclitest
```

The output displays the logs for the container, and should show the below output

```output
listening on port 80
```

## Attach output streams

In addition to viewing the logs, you can attach your local standard out and standard error streams to that of the container.

First, execute the [az container attach][az-container-attach] command to attach your local console to the container's output streams:

```azurecli-interactive
az container attach --resource-group acispotdemo --name acispotclitest
```

Once attached, refresh your browser a few times to generate some more output. When you're done, detach your console with `Control+C`. You should see output similar to the following:

```output
Container 'acispotclitest' is in state 'Running'...
Start streaming logs:
listening on port 80
```

## Clean up resources

When you're done with the container, remove it using the [az container delete][az-container-delete] command:

```azurecli-interactive
az container delete --resource-group acispotdemo --name acispotclitest
```

To verify that the container has been deleted, execute the [az container list](/cli/azure/container#az-container-list) command:

```azurecli-interactive
az container list --resource-group acispotdemo --output table
```

The **acispotclitest** container shouldn't appear in the command's output. If you have no other containers in the resource group, no output is displayed.

If you're done with the *acispotdemo* resource group and all the resources it contains, delete it with the [az group delete][az-group-delete] command:

```azurecli-interactive
az group delete --name acispotdemo
```

## Next steps

In this tutorial, you created a Spot container on Azure Container Instances with a default quota and eviction policy using the Azure CLI.

* [Check out the overview for ACI Spot containers](container-instances-spot-containers-overview.md)
* [Try out Spot containers with Azure Container Instances using the Azure portal](container-instances-tutorial-deploy-spot-containers-portal.md)

<!-- LINKS - External -->
[app-github-repo]: https://github.com/Azure-Samples/aci-helloworld.git
[azure-account]: https://azure.microsoft.com/free/
[node-js]: https://nodejs.org

<!-- LINKS - Internal -->
[az-container-attach]: /cli/azure/container#az_container_attach
[az-container-create]: /cli/azure/container#az_container_create
[az-container-delete]: /cli/azure/container#az_container_delete
[az-container-list]: /cli/azure/container#az_container_list
[az-container-logs]: /cli/azure/container#az_container_logs
[az-container-show]: /cli/azure/container#az_container_show
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: /cli/azure/install-azure-cli
[container-service]: ../aks/intro-kubernetes.md
