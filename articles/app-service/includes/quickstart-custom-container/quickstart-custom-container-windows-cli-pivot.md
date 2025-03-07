---
author: msangapu-msft
ms.service: azure-app-service
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 02/14/2025
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides predefined application stacks on Windows, like ASP.NET or Node.js, that run on IIS. The preconfigured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions. They let developers fully customize the containers and give containerized applications full access to Windows functionality.

This quickstart shows you how to deploy an ASP.NET app in a Windows image from [Microsoft Artifact Registry](https://mcr.microsoft.com/) to Azure App Service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- [Azure CLI](/cli/azure/install-azure-cli)

## Connect to Azure

Sign into your Azure account by using the [az login](/cli/azure/authenticate-azure-cli) command and following the prompt:

```bash
az login
```

## Create a resource group

Create a resource group with the [`az group create`](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. To see all supported locations for App Service, run the [az appservice list-locations](/cli/azure/appservice#az-appservice-list-locations) command.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create your App Service Plan

Create an App Service plan in the resource group with the [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) command.

The following example creates an App Service plan named `myAppServicePlan` in the **P1V3** pricing tier (`--sku P1V3`).

```azurecli-interactive
az appservice plan create --resource-group myResourceGroup --location eastus --name myAppServicePlan --hyper-v --sku p1v3
```

> [!NOTE]
> If you run into the error, *The behavior of this command has been altered by the following extension: appservice-kube*, remove the `appservice-kube` extension.
>

## Create your web app

Create a custom container [web app](../../overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#az-webapp-create) command. Don't forget to replace *myContainerApp* with a unique app name (valid characters are `a-z`, `0-9`, and `-`).

```azurecli-interactive
az webapp create --name myContainerApp --plan myAppServicePlan --resource-group myResourceGroup --deployment-container-image-name mcr.microsoft.com/azure-app-service/windows/parkingpage:latest
```

- The Name parameter specifies the web app name.
- The AppServicePlan parameter specifies the App Service Plan Name.
- The Location parameter specifies the location.
- The ResourceGroupName parameter specifies the name of the Resource Group.
- The deployment-container-image-name parameter specifies a container image name and optional tag.

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows-cli.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed runs in background mode." lightbox="../../media/quickstart-custom-container/browse-custom-container-windows-cli.png":::

## Clean up resources

Remove the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli-interactive
az group delete --no-wait --name <resource_group>
```

## Related content

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry each time it starts. If you rebuild your image, just push it to your container registry. The app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

- [Configure custom container](../../configure-custom-container.md)
- [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)
- [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Secure with custom domain and certificate](../../tutorial-secure-domain-certificate.md)
- [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)
- [Use Private Endpoints for App Service apps](../../networking/private-endpoint.md)
- [Migrate to Windows container in Azure](../../tutorial-custom-container.md)
- [Deploy a container with Azure Pipelines](../../deploy-container-azure-pipelines.md)
- [Deploy a container with GitHub Actions](../../deploy-container-github-action.md)


<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: /container-registry/container-registry-skus.md
