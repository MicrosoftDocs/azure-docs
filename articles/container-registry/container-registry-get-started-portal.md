---
title: Quickstart - Create a private Docker registry in Azure with the Azure portal
description: Quickly learn to create a private Docker container registry with the Azure portal.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 03/03/2018
ms.author: danlep
ms.custom: mvc
---
# Quickstart: Create a container registry using the Azure portal

An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. In this quickstart, you create a container registry with the Azure portal, push a container image into the registry and finally deploy the container from your registry into Azure Container Instances (ACI).

To complete this quickstart, you must have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a container registry

Select **Create a resource** > **Containers** > **Azure Container Registry**.

![Creating a container registry in the Azure portal][qs-portal-01]

Enter values for **Registry name** and **Resource group**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. Create a new resource group named `myResourceGroup`, and for **SKU**, select 'Basic'. Select **Create** to deploy the ACR instance.

![Creating a container registry in the Azure portal][qs-portal-03]

In this quickstart, we create a *Basic* registry. Azure Container Registry is available in several different SKUs, described briefly in the following table. For extended details on each, see [Container registry SKUs][container-registry-skus].

[!INCLUDE [container-registry-sku-matrix](../../includes/container-registry-sku-matrix.md)]

When the **Deployment succeeded** message appears, select the container registry in the portal, then select **Access keys**.

![Creating a container registry in the Azure portal][qs-portal-05]

Under **Admin user**, select **Enable**. Take note of the following values:

* Login server
* Username
* password

You use these values in the following steps while working with your registry with the Docker CLI.

![Creating a container registry in the Azure portal][qs-portal-06]

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [docker login][docker-login] command. Replace the *username*, *password*, and *login server* values with those you noted in the previous step.

```bash
docker login --username <username> --password <password> <login server>
```

The command returns `Login Succeeded` once completed. You might also see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. See the [docker login][docker-login] command reference for more information.

## Push image to ACR

To push an image to your Azure Container Registry, you must first have an image. If needed, run the following command to pull an existing image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

Before you push the image to your registry, you must tag the image with the ACR login server name. Tag the image using the [docker tag][docker-tag] command. Replace *login server* with the login server name you recorded earlier.

```bash
docker tag microsoft/aci-helloworld <login server>/aci-helloworld:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace *login server* with the login server name of your ACR instance.

```bash
docker push <login server>/aci-helloworld:v1
```

Output from a successful `docker push` command is similar to:

```
The push refers to a repository [uniqueregistryname.azurecr.io/aci-helloworld]
7c701b1aeecd: Pushed
c4332f071aa2: Pushed
0607e25cc175: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:f2867748615cc327d31c68b1172cc03c0544432717c4d2ba2c1c2d34b18c62ba size: 1577
```

## List container images

To list the images in your ACR instance, navigate to your registry in the portal and select **Repositories**, then select the repository you created with `docker push`.

In this example, we select the **aci-helloworld** repository, and we can see the `v1`-tagged image under **TAGS**.

![Creating a container registry in the Azure portal][qs-portal-09]

## Deploy image to ACI

In order to deploy to an instance from the registry we need to navigate to the repository (aci-helloworld), and then click on the ellipsis next to v1.

![Launching an Azure Container Instance from the portal][qs-portal-10]

A context menu will appear, select **Run instance**:

![Launch ACI context menu][qs-portal-11]

Fill in **Container name**, ensure the correct subscription is selected, select the existing **Resource group**: "myResourceGroup" and then click **OK** to launch the Azure Container Instance.

![Launch ACI deployment options][qs-portal-12]

When deployment starts a tile is placed on your portal dashboard indicating deployment progress. Once deployment completes, the tile is updated to show your new **mycontainer** container group.

![ACI deployment status][qs-portal-13]

Select the mycontainer container group to display the container group properties. Take note of the **IP address** of the container group, as well as the **STATUS** of the container.

![ACI container details][qs-portal-14]

## View the application

Once the container is in the **Running** state, use your favorite browser to navigate to the IP address you noted in the previous step to display the application.

![Hello world app in the browser][qs-portal-15]

## Clean up resources

To clean up your resources navigate to the **myResourceGroup** resource group in the portal. Once the resource group is loaded click on **Delete resource group** to remove the resource group, the Azure Container Registry, and all Azure Container Instances.

![Creating a container registry in the Azure portal][qs-portal-08]

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI, and launched an instance of it via Azure Container Instances. Continue to the Azure Container Instances tutorial for a deeper look at ACI.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials][container-instances-tutorial-prepare-app]

<!-- IMAGES -->
[qs-portal-01]: ./media/container-registry-get-started-portal/qs-portal-01.png
[qs-portal-02]: ./media/container-registry-get-started-portal/qs-portal-02.png
[qs-portal-03]: ./media/container-registry-get-started-portal/qs-portal-03.png
[qs-portal-04]: ./media/container-registry-get-started-portal/qs-portal-04.png
[qs-portal-05]: ./media/container-registry-get-started-portal/qs-portal-05.png
[qs-portal-06]: ./media/container-registry-get-started-portal/qs-portal-06.png
[qs-portal-07]: ./media/container-registry-get-started-portal/qs-portal-07.png
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
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[container-instances-tutorial-prepare-app]: ../container-instances/container-instances-tutorial-prepare-app.md
[container-registry-skus]: container-registry-skus.md
