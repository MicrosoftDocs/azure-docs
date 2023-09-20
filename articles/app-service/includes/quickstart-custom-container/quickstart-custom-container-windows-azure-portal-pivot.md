---
author: cephalin
ms.service: app-service
ms.devlang: java
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: cephalin
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Azure Container Registry to Azure App Service. 

To complete this quickstart, you need:

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- An [Azure container registry](../../../container-registry/container-registry-get-started-portal.md)
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

### Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

### Create Azure resources

1. Type **app services** in the search. Under **Services**, select **App Services**.

     :::image type="content" source="../../media/quickstart-custom-container/portal-search.png?text=Azure portal search details" alt-text="Screenshot of searching for 'app services' in the Azure portal.":::

1. In the **App Services** page, select **+ Create**.

1. In the **Basics** tab, under **Project details**, ensure the correct subscription is selected and then select to **Create new** resource group. Type *myResourceGroup* for the name.

    :::image type="content" source="../../media/quickstart-custom-container/project-details.png" alt-text="Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the web app.":::

1. Under **Instance details**, type a globally unique name for your web app and select **Docker Container**. Select *Windows* for the **Operating System**. Select a **Region** you want to serve your app from.

    :::image type="content" source="../../media/quickstart-custom-container/instance-details-windows.png" alt-text="Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size.":::

1. Under **App Service Plan**, select **Create new** App Service Plan. Type *myAppServicePlan* for the name. To change to the Free tier, select **Change size**, select the **Dev/Test** tab, select **P1v3**, and select the **Apply** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/app-service-plan-details-windows.png" alt-text="Screenshot of the Administrator account section where you provide the administrator username and password.":::

1. Select the **Next: Docker >** button at the bottom of the page.

1. In the **Docker** tab, select *Azure Container Registry* for the **Image Source**. Under **Azure container registry options**, set the following values:
   - **Registry**: Select your Azure Container Registry.
   - **Image**: Select *dotnetcore-docs-hello-world-windows*.
   - **Tag**: Select *latest*.

    :::image type="content" source="../../media/quickstart-custom-container/azure-container-registry-options-windows.png" alt-text="Screenshot showing the Azure Container Registry options.":::

1. Select the **Review + create** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page.":::

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

    :::image type="content" source="../../media/quickstart-custom-container/next-steps.png" alt-text="Screenshot showing the next step of going to the resource.":::

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
> [Secure with custom domain and certificate](../../tutorial-secure-domain-certificate.md)

> [!div class="nextstepaction"]
> [Migrate to Windows container in Azure](../../tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)

> [!div class="nextstepaction"]
> [Use Private Endpoints for App Service apps](../../networking/private-endpoint.md)

> [!div class="nextstepaction"]
> [Azure Monitor overview](/azure/azure-monitor/overview)

> [!div class="nextstepaction"]
> [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)

> [!div class="nextstepaction"]
> [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)

> [!div class="nextstepaction"]
> [Configure custom container](../../configure-custom-container.md)

> [!div class="nextstepaction"]
> [Multi-container app tutorial](../../tutorial-multi-container-app.md)
