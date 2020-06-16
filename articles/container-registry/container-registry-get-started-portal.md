---
title: Quickstart - Create registry in portal
description: Quickly learn to create a private Docker registry in Azure Container Registry with the Azure portal.
ms.topic: quickstart
ms.date: 06/11/2020
ms.custom: "seodec18, mvc"
---
# Quickstart: Create a private container registry using the Azure portal

An Azure container registry is a private Docker registry in Azure where you can store and manage private Docker container images and related artifacts. In this quickstart, you create a container registry with the Azure portal. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

To log in to the registry to work with container images, this quickstart requires that you are running the Azure CLI (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a container registry

Select **Create a resource** > **Containers** > **Container Registry**.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-01.png" alt-text="Navigate to container registry in portal":::

In the **Basics** tab, enter values for **Resource group** and **Registry name**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. For this quickstart create a new resource group in the `West US` location named `myResourceGroup`, and for **SKU**, select 'Basic'.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-03.png" alt-text="Create container registry in the portal":::

Accept default values for the remaining settings. Then select **Review + create**. After reviewing the settings, select **Create**.

In this quickstart you create a *Basic* registry, which is a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers (SKUs), see [Container registry service tiers][container-registry-skus].

When the **Deployment succeeded** message appears, select the container registry in the portal. 

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-05.png" alt-text="Container registry Overview in the portal":::

Take note of the value of the **Login server**. You use this value in the following steps when you push and pull images with Docker.

## Log in to registry

Before pushing and pulling container images, you must log in to the registry instance. [Sign into the Azure CLI][get-started-with-azure-cli] on your local machine, then run the [az acr login][az-acr-login] command. (Specify only the registry name when logging in with the Azure CLI. Don't include the 'azurecr.io' suffix.)

```azurecli
az acr login --name <registry-name>
```

The command returns `Login Succeeded` once completed. 

[!INCLUDE [container-registry-quickstart-docker-push](../../includes/container-registry-quickstart-docker-push.md)]

## List container images

To list the images in your registry, navigate to your registry in the portal and select **Repositories**, then select the  **hello-world** repository you created with `docker push`.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-09.png" alt-text="List container images in the portal":::

By selecting the **hello-world** repository, you see the `v1`-tagged image under **Tags**.

[!INCLUDE [container-registry-quickstart-docker-pull](../../includes/container-registry-quickstart-docker-pull.md)]

## Clean up resources

To clean up your resources, navigate to the **myResourceGroup** resource group in the portal. Once the resource group is loaded, click on **Delete resource group** to remove the resource group, the container registry, and the container images stored there.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-08.png" alt-text="Delete resource group in the portal":::


## Next steps

In this quickstart, you created an Azure Container Registry with the Azure portal, pushed a container image, and pulled and ran the image from the registry. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-prepare-registry]

> [!div class="nextstepaction"]
> [Azure Container Registry Tasks tutorials][container-registry-tutorial-quick-task]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-rmi]: https://docs.docker.com/engine/reference/commandline/rmi/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[container-registry-tutorial-prepare-registry]: container-registry-tutorial-prepare-registry.md
[container-registry-skus]: container-registry-skus.md
[azure-cli]: /cli/azure/install-azure-cli
[get-started-with-azure-cli]: /cli/azure/get-started-with-azure-cli
[az-acr-login]: /cli/azure/acr#az-acr-login
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
