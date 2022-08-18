---
author: msangapu-msft
ms.service: app-service
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Azure Container Registry to Azure App Service. 

To complete this quickstart, you need:

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- An [Azure container registry](/azure/container-registry/container-registry-get-started-portal)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
- [Switch Docker to run Windows containers](/virtualization/windowscontainers/quick-start/quick-start-windows-10)

## 1 - Clone the sample repository

Clone the [the .NET 6.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world) with the following command:

```bash
git clone https://github.com/Azure-Samples/dotnetcore-docs-hello-world.git
```

## 2 - Push the image to Azure Container Registry

Make sure you are in the cloned repository's root folder. This repository contains a **Dockerfile.windows** file. We will be using Windows Nano Server Long Term Servicing Channel (LTSC) 2022 as the base operating system, explicitly calling out our Windows base.

> [!NOTE]
> Even though this is a Windows container, the paths still need to use forward slashes. See [Write a Dockerfile](/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile#considerations-for-using-copy-with-windows) for more details.

1. Log in to the Azure CLI.

    ```azurecli
    az login
    ```

1. Log in to Azure Container Registry.

    ```azurecli
    az acr login -n <your_registry_name>
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

## 3 - Deploy to Azure

You now create the required Azure resources then deploy the web app.

1. Create a new resource group.

    ```cli
    az group create --location eastus --resource-group my-xenon-rg
    ```

1. Create your App Service Plan.

    ```cli
    az appservice plan create --resource-group jefmarti-xenon-cli-delete --location eastus --name pv3aspcli2 --hyper-v --sku p1v3
    ```

> [!NOTE]
> If you run into the follow error during this step, make sure the appservice-kube extension is removed:

```The behavior of this command has been altered by thef ollowing extension: appservice-kube
Invalid sku entered: P1V3
```

1. Create your web app

    ```cli
    az webapp create --resource-group jefmarti-cli-x-delete --plan pv3aspcli2 --name jefmarti-delete-webapp-xenon-cli --deployment-container-image-name mcr.microsoft.com/azure-app-service/windows/parkingpage:latest
    ```
##  4 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed will run in background mode.":::

Note that the Host operating system appears in the footer, confirming we are running in a Windows container.

## 5 - Clean up resources

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
