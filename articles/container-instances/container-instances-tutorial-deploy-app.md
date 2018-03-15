---
title: Azure Container Instances tutorial - Deploy app
description: Azure Container Instances tutorial part 3 of 3 - Deploy application
services: container-instances
author: seanmck
manager: timlt

ms.service: container-instances
ms.topic: tutorial
ms.date: 02/22/2018
ms.author: seanmck
ms.custom: mvc
---

# Deploy a container to Azure Container Instances

This is the final tutorial in a three-part series. Earlier in the series, [a container image was created](container-instances-tutorial-prepare-app.md) and [pushed to an Azure Container Registry](container-instances-tutorial-prepare-acr.md). This article completes the tutorial series by deploying the container to Azure Container Instances.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy the container from the Azure Container Registry using the Azure CLI
> * View the application in the browser
> * View the container logs

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli-install].

To complete this tutorial, you need a Docker development environment installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. You must install the Azure CLI and Docker development environment on your local computer to complete this tutorial.

## Deploy the container using the Azure CLI

The Azure CLI enables deployment of a container to Azure Container Instances in a single command. Since the container image is hosted in the private Azure Container Registry, you must include the credentials required to access it. Obtain the credentials with the following Azure CLI commands.

Container registry login server (update with your registry name):

```azurecli
az acr show --name <acrName> --query loginServer
```

Container registry password:

```azurecli
az acr credential show --name <acrName> --query "passwords[0].value"
```

Your application will need to have
been [prepared in advance][prepare-app]; to deploy your container image from the container registry with a
resource request of 1 CPU core and 1 GB of memory, run the following
 [az container create][az-container-create] command. Replace
`<acrLoginServer>` and `<acrPassword>` with the values you obtained
from the previous two commands. Replace `<acrName>` with the name of
your container registry; you can also replace `aci-tutorial-app` with
the name you want to give the new application.

```azurecli
az container create --resource-group myResourceGroup --name aci-tutorial-app --image <acrLoginServer>/aci-tutorial-app:v1 --cpu 1 --memory 1 --registry-username <acrName> --registry-password <acrPassword> --dns-name-label aci-demo --ports 80
```

Within a few seconds, you should receive an initial response from Azure Resource Manager. The `--dns-name-label` value must be unique within the Azure region you create the container instance. Update the value in the preceding example if you receive a **DNS name label** error message when you execute the command.

To view the state of the deployment, use [az container show][az-container-show]:

```azurecli
az container show --resource-group myResourceGroup --name aci-tutorial-app --query instanceView.state
```

Repeat the [az container show][az-container-show] command until the state changes from *Pending* to *Running*, which should take under a minute. When the container is *Running*, proceed to the next step.

## View the application and container logs

Once the deployment succeeds, display the container's fully qualified domain name (FQDN) with the [az container show][az-container-show] command:

```bash
az container show --resource-group myResourceGroup --name aci-tutorial-app --query ipAddress.fqdn
```

Example output: `"aci-demo.eastus.azurecontainer.io"`

To see the running application, navigate to the displayed DNS name in your favorite browser:

![Hello world app in the browser][aci-app-browser]

You can also view the log output of the container:

```azurecli
az container logs --resource-group myResourceGroup --name aci-tutorial-app
```

Output:

```bash
listening on port 80
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://13.88.176.27/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial series, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you completed the process of deploying your containers to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Deployed the container from the Azure Container Registry using the Azure CLI
> * Viewed the application in the browser
> * Viewed the container logs

<!-- IMAGES -->
[aci-app-browser]: ./media/container-instances-quickstart/aci-app-browser.png

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-show]: /cli/azure/container#az_container_show
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: /cli/azure/install-azure-cli
[prepare-app]: ./container-instances-tutorial-prepare-app.md
