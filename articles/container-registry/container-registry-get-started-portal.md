---
title: Quickstart - Create a private Docker registry in Azure with the Azure portal
description: Quickly learn to create a private Docker container registry with the Azure portal.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 01/11/2019
ms.author: danlep
ms.custom: mvc
---
# Quickstart: Create a container registry using the Azure portal

An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. In this quickstart, you create a container registry with the Azure portal, push a container image into the registry, and finally deploy the container from your registry into Azure Container Instances (ACI).

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

## Push image to ACR

To push an image to your Azure Container Registry, you must first have an image. If needed, run the following [docker pull][docker-pull] command to pull an existing image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

Before you push the image to your registry, you must tag the image with the ACR login server name. Tag the image using the [docker tag][docker-tag] command. Replace *login server* with the login server name you recorded earlier. Add a *repository name* such as **`myrepo`** to place your image in a repository. 

```bash
docker tag microsoft/aci-helloworld <login server>/<repository name>/aci-helloworld:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace *login server* with the login server name of your ACR instance, and replace the *repository name* with the name of the repository you used in the previous command. The repository gets created automatically when you push the image. 

```bash
docker push <login server>/<repository name>/aci-helloworld:v1
```

Output from a successful `docker push` command is similar to:

```
The push refers to repository [specificregistryname.azurecr.io/myrepo/aci-helloworld]
31ba1ebd9cf5: Pushed
cd07853fe8be: Pushed
73f25249687f: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:565dba8ce20ca1a311c2d9485089d7ddc935dd50140510050345a1b0ea4ffa6e size: 1576
```

## List container images

To list the images in your ACR instance, navigate to your registry in the portal and select **Repositories**, then select the repository you created with `docker push`.

In this example, we select the **aci-helloworld** repository, and we can see the `v1`-tagged image under **TAGS**.

![List container images in the Azure portal][qs-portal-09]

## Deploy image to ACI

To deploy to an instance from the registry, navigate to the repository (aci-helloworld), and then click on the ellipsis next to v1.

![Launching an Azure Container Instance from the portal][qs-portal-10]

A context menu appears. Select **Run instance**:

![Launch ACI context menu][qs-portal-11]

Fill in **Container name**, ensure the correct subscription is selected, select the existing **Resource group**: "myResourceGroup". Ensure that the "Public IP address" options is enabled by setting to **Yes**, and then click **OK** to launch the Azure Container Instance.

![Create container instance options][qs-portal-12]

When deployment starts, a tile is placed on your portal dashboard indicating deployment progress. Once deployment completes, the tile is updated to show your new **mycontainer** container group.

![ACI deployment status][qs-portal-13]

Select the mycontainer container group to display the container group properties. Take note of the **IP address** of the container group, as well as the **STATUS** of the container.

![ACI container details][qs-portal-14]

## View the application

Once the container is in the **Running** state, use your favorite browser to navigate to the IP address you noted in the previous step to display the application.

![Hello world app in the browser][qs-portal-15]

## Clean up resources

To clean up your resources, navigate to the **myResourceGroup** resource group in the portal. Once the resource group is loaded click on **Delete resource group** to remove the resource group, the Azure Container Registry, and all Azure Container Instances.

![Delete resource group in the Azure portal][qs-portal-08]

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure portal, pushed a container image, and launched an instance of it via Azure Container Instances. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-quick-task]

<!-- IMAGES -->
[qs-portal-01]: ./media/container-registry-get-started-portal/qs-portal-01.png
[qs-portal-02]: ./media/container-registry-get-started-portal/qs-portal-02.png
[qs-portal-03]: ./media/container-registry-get-started-portal/qs-portal-03.png
[qs-portal-05]: ./media/container-registry-get-started-portal/qs-portal-05.png
[qs-portal-08]: ./media/container-registry-get-started-portal/qs-portal-08.png
[qs-portal-09]: ./media/container-registry-get-started-portal/qs-portal-09.png
[qs-portal-10]: ./media/container-registry-get-started-portal/qs-portal-10.png
[qs-portal-11]: ./media/container-registry-get-started-portal/qs-portal-11.png
[qs-portal-12]: ./media/container-registry-get-started-portal/qs-portal-12.png
[qs-portal-13]: ./media/container-registry-get-started-portal/qs-portal-13.png
[qs-portal-14]: ./media/container-registry-get-started-portal/qs-portal-14.png
[qs-portal-15]: ./media/container-registry-get-started-portal/qs-portal-15.png

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-login]: /cli/azure/acr#az-acr-login
