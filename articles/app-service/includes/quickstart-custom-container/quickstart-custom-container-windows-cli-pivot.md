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
- [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

## 1 - Connect to Azure

Sign into your Azure account by using the [`az login`](/cli/azure/authenticate-azure-cli) command and following the prompt:

```bash
az login
```

## 2 - Create a resource group

Create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## 3 - Create your App Service Plan

You now create the required Azure resources then deploy the web app.

Create your App Service Plan.

```azurecli-interactive
az appservice plan create --resource-group myResourceGroup --location eastus --name PV3ASP --hyper-v --sku p1v3
```

> [!NOTE]
> If you run into the error, `The behavior of this command has been altered by the following extension: appservice-kube`, remove the `appservice-kube` extension. 
>

## 4 - Create your web app

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan pv3aspcli2 --name myContainerApp --deployment-container-image-name mcr.microsoft.com/azure-app-service/windows/parkingpage:latest
```
## 5 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed will run in background mode.":::

Note that the Host operating system appears in the footer, confirming we are running in a Windows container.

## 6 - Clean up resources

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