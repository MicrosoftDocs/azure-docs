---
title: Quickstart - Create a private Docker registry in Azure - Azure portal
description: Quickly learn to create a private Docker container registry with the Azure portal.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 01/22/2019
ms.author: danlep
ms.custom: "seodec18, mvc"
---
# Quickstart: Create a private container registry using the Azure portal

An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. In this quickstart, you create a container registry with the Azure portal. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

To log in to the registry to work with container images, this quickstart requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a container registry

Select **Create a resource** > **Containers** > **Container Registry**.

![Creating a container registry in the Azure portal][qs-portal-01]

Enter values for **Registry name** and **Resource group**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. For this quickstart create a new resource group in the `West US` location named `myResourceGroup`, and for **SKU**, select 'Basic'. Select **Create** to deploy the ACR instance.

![Create container registry in the Azure portal][qs-portal-03]

In this quickstart you create a *Basic* registry, which is a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry SKUs][container-registry-skus].

When the **Deployment succeeded** message appears, select the container registry in the portal. 

![Container registry Overview in the Azure portal][qs-portal-05]

Take note of the value of the **Login server**. You use this value in the following steps while working with your registry with the Azure CLI and Docker.

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. Here, use the [az acr login][az-acr-login] command in the Azure CLI.

```azurecli
az acr login --name <acrName>
```

The command returns `Login Succeeded` once completed. 

To push an image to an Azure Container registry, you must first have an image. If you don't yet have any local container images, run the following [docker pull][docker-pull] command to pull an existing image from Docker Hub.

```bash
docker pull busybox
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server. Run the following command to obtain the full login server name (all lowercase) of the ACR instance. 

```azurecli
az acr show --name myContainerRegistry007 --query "{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag][docker-tag] command. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```bash
docker tag busybox <acrLoginServer>/busybox:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace `<acrLoginServer>` with the login server name of your ACR instance. This example creates the **busybox** repository, containing the `busybox:v1` image.

```bash
docker push <acrLoginServer>/busybox:v1
```

Output from a successful `docker push` command is similar to:

```
The push refers to repository [mycontainerregistry007.azurecr.io/busybox]
31ba1ebd9cf5: Pushed
cd07853fe8be: Pushed
73f25249687f: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:662dd8e65ef7ccf13f417962c2f77567d3b132f12c95909de6c85ac3c326a345 size: 527
```

## List container images

After pushing the image to your container registry, remove the `busybox:v1` image from your local environment. (Note that this [docker rmi][docker-rmi] command does not remove the image from the **busybox** repository in your Azure container registry.)

```bash
docker rmi <acrLoginServer>/busybox:v1
```

To list the images in your ACR instance, navigate to your registry in the portal and select **Repositories**, then select the repository you created with `docker push`.

In this example, we select the **busybox** repository, and we can see the `v1`-tagged image under **TAGS**.

![List container images in the Azure portal][qs-portal-09]

## Run image from ACR

Now, you can pull and run the `busybox:v1` container image from your container registry. This [docker run][docker-run] example displays the current date and time:

```bash
docker run <acrLoginServer>/busybox:v1 date
```

Example output:

```
Unable to find image 'mycontainerregistry007.azurecr.io/busybox:v1' locally
v1: Pulling from busybox
Digest: sha256:662dd8e65ef7ccf13f417962c2f77567d3b132f12c95909de6c85ac3c326a345
Status: Downloaded newer image for mycontainerregistry007.azurecr.io/busybox:v1
Wed Jan 23 00:45:03 UTC 2019
```

## Clean up resources

To clean up your resources, navigate to the **myResourceGroup** resource group in the portal. Once the resource group is loaded click on **Delete resource group** to remove the resource group, ACR instance, and all container images.

![Delete resource group in the Azure portal][qs-portal-08]

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure portal, pushed a container image, and pulled and ran the image from the registry. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-quick-task]

<!-- IMAGES -->
[qs-portal-01]: ./media/container-registry-get-started-portal/qs-portal-01.png
[qs-portal-02]: ./media/container-registry-get-started-portal/qs-portal-02.png
[qs-portal-03]: ./media/container-registry-get-started-portal/qs-portal-03.png
[qs-portal-05]: ./media/container-registry-get-started-portal/qs-portal-05.png
[qs-portal-08]: ./media/container-registry-get-started-portal/qs-portal-08.png
[qs-portal-09]: ./media/container-registry-get-started-portal/qs-portal-09.png

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-rmi]: https://docs.docker.com/engine/reference/commandline/rmi/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/

<!-- LINKS - internal -->
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-login]: /cli/azure/acr#az-acr-login
