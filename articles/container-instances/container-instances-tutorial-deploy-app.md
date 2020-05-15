---
title: Tutorial - Deploy container app to container instance
description: Azure Container Instances tutorial part 3 of 3 - Deploy container application to Azure Container Instances
ms.topic: tutorial
ms.date: 03/21/2018
ms.custom: "seodec18, mvc"
---

# Tutorial: Deploy a container application to Azure Container Instances

This is the final tutorial in a three-part series. Earlier in the series, [a container image was created](container-instances-tutorial-prepare-app.md) and [pushed to Azure Container Registry](container-instances-tutorial-prepare-acr.md). This article completes the series by deploying the container to Azure Container Instances.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy the container from Azure Container Registry to Azure Container Instances
> * View the running application in the browser
> * Display the container's logs

## Before you begin

[!INCLUDE [container-instances-tutorial-prerequisites](../../includes/container-instances-tutorial-prerequisites.md)]

## Deploy the container using the Azure CLI

In this section, you use the Azure CLI to deploy the image built in the [first tutorial](container-instances-tutorial-prepare-app.md) and pushed to Azure Container Registry in the [second tutorial](container-instances-tutorial-prepare-acr.md). Be sure you've completed those tutorials before proceeding.

### Get registry credentials

When you deploy an image that's hosted in a private Azure container registry like the one created in the [second tutorial](container-instances-tutorial-prepare-acr.md), you must supply credentials to access the registry. 

A best practice for many scenarios is to create and configure an Azure Active Directory service principal with *pull* permissions to your registry. See [Authenticate with Azure Container Registry from Azure Container Instances](../container-registry/container-registry-auth-aci.md) for sample scripts to create a service principal with the necessary permissions. Take note of the *service principal ID* and *service principal password*. You use these credentials to access the registry when you deploy the container.

You also need the full name of the container registry login server (replace `<acrName>` with the name of your registry):

```azurecli
az acr show --name <acrName> --query loginServer
```

### Deploy container

Now, use the [az container create][az-container-create] command to deploy the container. Replace `<acrLoginServer>` with the value you obtained from the previous command. Replace `<service-principal-ID>` and `<service-principal-password>` with the service principal ID and password that you created to access the registry. Replace `<aciDnsLabel>` with a desired DNS name.

```azurecli
az container create --resource-group myResourceGroup --name aci-tutorial-app --image <acrLoginServer>/aci-tutorial-app:v1 --cpu 1 --memory 1 --registry-login-server <acrLoginServer> --registry-username <service-principal-ID> --registry-password <service-principal-password> --dns-name-label <aciDnsLabel> --ports 80
```

Within a few seconds, you should receive an initial response from Azure. The `--dns-name-label` value must be unique within the Azure region you create the container instance. Modify the value in the preceding command if you receive a **DNS name label** error message when you execute the command.

### Verify deployment progress

To view the state of the deployment, use [az container show][az-container-show]:

```azurecli
az container show --resource-group myResourceGroup --name aci-tutorial-app --query instanceView.state
```

Repeat the [az container show][az-container-show] command until the state changes from *Pending* to *Running*, which should take under a minute. When the container is *Running*, proceed to the next step.

## View the application and container logs

Once the deployment succeeds, display the container's fully qualified domain name (FQDN) with the [az container show][az-container-show] command:

```azurecli
az container show --resource-group myResourceGroup --name aci-tutorial-app --query ipAddress.fqdn
```

For example:
```output
"aci-demo.eastus.azurecontainer.io"
```

To see the running application, navigate to the displayed DNS name in your favorite browser:

![Hello world app in the browser][aci-app-browser]

You can also view the log output of the container:

```azurecli
az container logs --resource-group myResourceGroup --name aci-tutorial-app
```

Example output:

```output
listening on port 80
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://aci-demo.eastus.azurecontainer.io/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial series, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you completed the process of deploying your container to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Deployed the container from Azure Container Registry using the Azure CLI
> * Viewed the application in the browser
> * Viewed the container logs

Now that you have the basics down, move on to learning more about Azure Container Instances, such as how container groups work:

> [!div class="nextstepaction"]
> [Container groups in Azure Container Instances](container-instances-container-groups.md)

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
[az-container-create]: /cli/azure/container#az-container-create
[az-container-show]: /cli/azure/container#az-container-show
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-cli-install]: /cli/azure/install-azure-cli
[prepare-app]: ./container-instances-tutorial-prepare-app.md
