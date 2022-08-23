---
author: msangapu-msft
ms.service: app-service
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

> [!NOTE]
> For information regarding running containerized applications in a serverless environment, please see [Container Apps](../../../container-apps/overview.md).
>

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Azure Container Registry to Azure App Service. 

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- [Azure CLI](/cli/azure/install-azure-cli)
- [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

## 1 - Clone the sample repository

Clone the [the .NET 6.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world) with the following command:

```bash
git clone https://github.com/Azure-Samples/dotnetcore-docs-hello-world.git
```

## 2 - Create a resource group

Create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## 3 - Create a container registry

In this quickstart you create a *Basic* registry, which is a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry service tiers][container-registry-skus].

Create an ACR instance using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. Update `mycontainerregistry` to a unique value.

```azurecli
az acr create --resource-group myResourceGroup --name mycontainerregistry --sku Basic
```

When the registry is created, the output is similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2019-01-08T22:32:13.175925+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry007",
  "location": "eastus",
  "loginServer": "mycontainerregistry.azurecr.io",
  "name": "myContainerRegistry007",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Take note of `loginServer` in the output, which is the fully qualified registry name (all lowercase). Throughout the rest of this quickstart `<registry-name>` is a placeholder for the container registry name, and `<login-server>` is a placeholder for the registry's login server name.

[!INCLUDE [container-registry-quickstart-sku](../../../../includes/container-registry-quickstart-sku.md)]

## 4 - Log in to registry

Before pushing and pulling container images, you must log in to the registry. To do so, use the [az acr login][az-acr-login] command. Specify only the registry resource name when logging in with the Azure CLI. Don't use the fully qualified login server name. 

```azurecli
az acr login --name <registry-name>
```

Example:

```azurecli
az acr login --name mycontainerregistry
```

The command returns a `Login Succeeded` message once completed.

## 5 - Push the image to Azure Container Registry

Make sure you are in the cloned repository's root folder. This repository contains a **Dockerfile.windows** file. We will be using Windows Nano Server Long Term Servicing Channel (LTSC) 2022 as the base operating system, explicitly calling out our Windows base.

> [!NOTE]
> Even though this is a Windows container, the paths still need to use forward slashes. See [Write a Dockerfile](/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile#considerations-for-using-copy-with-windows) for more details.

1. Log in to the Azure CLI.

    ```azurecli
    az login
    ```

1. Build the container image. We are naming the image **dotnetcore-docs-hello-world-windows**.

    ```docker
    docker build -f Dockerfile.windows -t <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-windows . 
    ```

1. Push the container image to Azure Container Registry.

    ```docker
    docker push <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-windows:latest
    ```

    > [!NOTE]
    > The Dockerfile sets the port number to 80 internally. For more information about configuring the container, see [Configure custom container](../../configure-custom-container.md).

## 6 - Deploy to Azure

You now create the required Azure resources then deploy the web app.

1. Create your App Service Plan.

    ```azurecli
    az appservice plan create --resource-group myResourceGroup --location eastus --name pv3aspcli2 --hyper-v --sku p1v3
    ```

    > [!NOTE]
    > If you run into the error, `The behavior of this command has been altered by the following extension: appservice-kube`, remove the `appservice-kube` extension. 
    >

1. Create your web app

    ```azurecli
    az webapp create --resource-group myResourceGroup --plan pv3aspcli2 --name myContainerApp --deployment-container-image-name mycontainerregistry.azurecr.io/dotnetcore-docs-hello-world-windows
    ```
##  7 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed will run in background mode.":::

Note that the Host operating system appears in the footer, confirming we are running in a Windows container.

## 8 - Clean up resources

[!INCLUDE [Clean-up Portal web app resources](../../../../includes/clean-up-section-portal-no-h.md)]

## Next steps

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry every time it starts. If you rebuild your image, you just need to push it to your container registry, and the app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

> [!div class="nextstepaction"]
> [Configure custom container](../../configure-custom-container.md)

> [!div class="nextstepaction"]
> [Custom container tutorial](../../tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Multi-container app tutorial](../../tutorial-multi-container-app.md)


<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: /container-registry/container-registry-skus.md