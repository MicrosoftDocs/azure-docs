---
title: Quickstart - Create registry in portal
description: Quickly learn to create a private Azure container registry using the Azure portal.
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.topic: quickstart
ms.custom: mvc, contperf-fy21q4, mode-ui
---
# Quickstart: Create an Azure container registry using the Azure portal

Azure Container Registry is a private registry service for building, storing, and managing container images and related artifacts. In this quickstart, you create an Azure container registry instance with the Azure portal. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

### [Azure CLI](#tab/azure-cli)

To log in to the registry to work with container images, this quickstart requires that you are running the Azure CLI (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

To log in to the registry to work with container images, this quickstart requires that you are running the Azure PowerShell (version 7.5.0 or later recommended). Run `Get-Module Az -ListAvailable` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module][azure-powershell-install].

---

You must also have Docker installed locally with the daemon running. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a container registry

Select **Create a resource** > **Containers** > **Container Registry**.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-01.png" alt-text="Navigate to container registry in portal":::

In the **Basics** tab, enter values for **Resource group** and **Registry name**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. For this quickstart create a new resource group in the `West US` location named `myResourceGroup`, and for **SKU**, select 'Basic'.

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-03.png" alt-text="Create container registry in the portal":::

Accept default values for the remaining settings. Then select **Review + create**. After reviewing the settings, select **Create**.

[!INCLUDE [container-registry-quickstart-sku](../../includes/container-registry-quickstart-sku.md)]

When the **Deployment succeeded** message appears, select the container registry in the portal. 

:::image type="content" source="media/container-registry-get-started-portal/qs-portal-05.png" alt-text="Container registry Overview in the portal":::

Take note of the registry name and the value of the **Login server**, which is a fully qualified name ending with `azurecr.io` in the Azure cloud. You use these values in the following steps when you push and pull images with Docker.

## Log in to registry

### [Azure CLI](#tab/azure-cli)

Before pushing and pulling container images, you must log in to the registry instance. [Sign into the Azure CLI][get-started-with-azure-cli] on your local machine, then run the [az acr login][az-acr-login] command. Specify only the registry resource name when logging in with the Azure CLI. Don't use the fully qualified login server name.

```azurecli
az acr login --name <registry-name>
```

Example:

```azurecli
az acr login --name mycontainerregistry
```

The command returns `Login Succeeded` once completed. 

### [Azure PowerShell](#tab/azure-powershell)

Before pushing and pulling container images, you must log in to the registry instance. [Sign into the Azure PowerShell][get-started-with-azure-powershell] on your local machine, then run the [Connect-AzContainerRegistry][connect-azcontainerregistry] cmdlet. Specify only the registry resource name when logging in with the Azure PowerShell. Don't use the fully qualified login server name.

```azurepowershell
Connect-AzContainerRegistry -Name <registry-name>
```

Example:

```azurepowershell
Connect-AzContainerRegistry -Name mycontainerregistry
```

The command returns `Login Succeeded` once completed. 

---

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
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-started-with-azure-cli]: /cli/azure/get-started-with-azure-cli
[get-started-with-azure-powershell]: /powershell/azure/get-started-azureps
[az-acr-login]: /cli/azure/acr#az_acr_login
[connect-azcontainerregistry]: /powershell/module/az.containerregistry/connect-azcontainerregistry
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
