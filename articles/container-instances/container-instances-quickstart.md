---
title: Quickstart - Deploy Docker container to container instance - Azure CLI
description: In this quickstart, you use the Azure CLI to quickly deploy a containerized web app that runs in an isolated Azure container instance
ms.topic: quickstart
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: mvc, devx-track-azurecli, mode-api
---

# Quickstart: Deploy a container instance in Azure using the Azure CLI

Use Azure Container Instances to run serverless Docker containers in Azure with simplicity and speed. Deploy an application to a container instance on-demand when you don't need a full container orchestration platform like Azure Kubernetes Service.

In this quickstart, you use the Azure CLI to deploy an isolated Docker container and make its application available with a fully qualified domain name (FQDN). A few seconds after you execute a single deployment command, you can browse to the application running in the container:

![View an app deployed to Azure Container Instances in browser][aci-app-browser]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.55 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

  > [!WARNING]
  > Best practice: User’s credentials passed via command line interface (CLI) are stored as plain text in the backend. Storing credentials in plain text is a security risk; Microsoft advises customers to store user credentials in CLI environment variables to ensure they are encrypted/transformed when stored in the backend.     

## Create a resource group

Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create][az-group-create] command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container

Now that you have a resource group, you can run a container in Azure. To create a container instance with the Azure CLI, provide a resource group name, container instance name, and Docker container image to the [az container create][az-container-create] command. In this quickstart, you use the public `mcr.microsoft.com/azuredocs/aci-helloworld` image. This image packages a small web app written in Node.js that serves a static HTML page.

You can expose your containers to the internet by specifying one or more ports to open, a DNS name label, or both. In this quickstart, you deploy a container with a DNS name label so that the web app is publicly reachable.

Execute a command similar to the following to start a container instance. Set a `--dns-name-label` value that's unique within the Azure region where you create the instance. If you receive a "DNS name label not available" error message, try a different DNS name label.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image mcr.microsoft.com/azuredocs/aci-helloworld --dns-name-label aci-demo --ports 80
```

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
```

When you run the command, the container's fully qualified domain name (FQDN) and its provisioning state are displayed.

```output
FQDN                               ProvisioningState
---------------------------------  -------------------
aci-demo.eastus.azurecontainer.io  Succeeded
```

If the container's `ProvisioningState` is **Succeeded**, go to its FQDN in your browser. If you see a web page similar to the following, congratulations! You've successfully deployed an application running in a Docker container to Azure.

![View an app deployed to Azure Container Instances in browser][aci-app-browser]

If at first the application isn't displayed, you might need to wait a few seconds while DNS propagates, then try refreshing your browser.

## Pull the container logs

When you need to troubleshoot a container or the application it runs (or just see its output), start by viewing the container instance's logs.

Pull the container instance logs with the [az container logs][az-container-logs] command:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer
```

The output displays the logs for the container, and should show the HTTP GET requests generated when you viewed the application in your browser.

```output
listening on port 80
::ffff:10.240.255.55 - - [21/Mar/2019:17:43:53 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [21/Mar/2019:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [21/Mar/2019:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
```

## Attach output streams

In addition to viewing the logs, you can attach your local standard out and standard error streams to that of the container.

First, execute the [az container attach][az-container-attach] command to attach your local console to the container's output streams:

```azurecli-interactive
az container attach --resource-group myResourceGroup --name mycontainer
```

Once attached, refresh your browser a few times to generate some additional output. When you're done, detach your console with `Control+C`. You should see output similar to the following:

```output
Container 'mycontainer' is in state 'Running'...
(count: 1) (last timestamp: 2019-03-21 17:27:20+00:00) pulling image "mcr.microsoft.com/azuredocs/aci-helloworld"
(count: 1) (last timestamp: 2019-03-21 17:27:24+00:00) Successfully pulled image "mcr.microsoft.com/azuredocs/aci-helloworld"
(count: 1) (last timestamp: 2019-03-21 17:27:27+00:00) Created container
(count: 1) (last timestamp: 2019-03-21 17:27:27+00:00) Started container

Start streaming logs:
listening on port 80

::ffff:10.240.255.55 - - [21/Mar/2019:17:43:53 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [21/Mar/2019:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [21/Mar/2019:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [21/Mar/2019:17:47:01 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.56 - - [21/Mar/2019:17:47:12 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
```

## Clean up resources

When you're done with the container, remove it using the [az container delete][az-container-delete] command:

```azurecli-interactive
az container delete --resource-group myResourceGroup --name mycontainer
```

To verify that the container has been deleted, execute the [az container list](/cli/azure/container#az-container-list) command:

```azurecli-interactive
az container list --resource-group myResourceGroup --output table
```

The **mycontainer** container should not appear in the command's output. If you have no other containers in the resource group, no output is displayed.

If you're done with the *myResourceGroup* resource group and all the resources it contains, delete it with the [az group delete][az-group-delete] command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure container instance by using a public Microsoft image. If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

To try out options for running containers in an orchestration system on Azure, see the [Azure Kubernetes Service (AKS)][container-service] quickstarts.

<!-- IMAGES -->
[aci-app-browser]: ./media/container-instances-quickstart/view-an-application-running-in-an-azure-container-instance.png

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
