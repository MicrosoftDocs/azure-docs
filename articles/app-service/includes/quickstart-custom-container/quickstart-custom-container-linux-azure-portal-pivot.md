---
author: cephalin
ms.service: app-service
ms.devlang: java
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: cephalin
---

[Azure App Service](../../overview.md) on Linux provides pre-defined application stacks on Linux with support for languages such as .NET, PHP, Node.js and others. You can also use a custom Docker image to run your web app on an application stack that isn't already defined in Azure. This quickstart shows you how to deploy an image from Azure Container Registry to Azure App Service.

> [!NOTE]
> For information regarding running containerized applications in a serverless environment, please see [Container Apps](../../../container-apps/overview.md).
>

To complete this quickstart, you need:

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- An [Azure container registry](../../../container-registry/container-registry-get-started-portal.md)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Docker](https://www.docker.com/community-edition)

## 1 - Clone the sample repository

Clone the [the .NET 6.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world) with the following command:

```bash
git clone https://github.com/Azure-Samples/dotnetcore-docs-hello-world.git
```

## 2 - Push the image to Azure Container Registry

Make sure you are in the cloned repository's root folder. This repository contains a **Dockerfile.linux** file.

1. Log in to the Azure CLI.

    ```azurecli
    az login
    ```

1. Log in to Azure Container Registry.

    ```azurecli
    az acr login -n <your_registry_name>
    ```

1. Build the container image. We are naming the image **dotnetcore-docs-hello-world-linux**.

    ```docker
    docker build -f Dockerfile.linux -t <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux . 
    ```

1. Push the container image to Azure Container Registry.

    ```docker
    docker push <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux:latest
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

1. Under **Instance details**, type a globally unique name for your web app and select **Docker Container**. Select *Linux* for the **Operating System**. Select a **Region** you want to serve your app from.

    :::image type="content" source="../../media/quickstart-custom-container/instance-details-linux.png" alt-text="Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size.":::

1. Under **App Service Plan**, select **Create new** App Service Plan. Type *myAppServicePlan* for the name. To change to the Free tier, select **Change size**, select the **Dev/Test** tab, select **F1**, and select the **Apply** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/app-service-plan-details-linux.png" alt-text="Screenshot of the Administrator account section where you provide the administrator username and password.":::

1. Select the **Next: Docker >** button at the bottom of the page.

1. In the **Docker** tab, select *Single Container* under **Options** and *Azure Container Registry* for the **Image Source**. Under **Azure container registry options**, set the following values:
   - **Registry**: Select your Azure Container Registry.
   - **Image**: Select *dotnetcore-docs-hello-world-linux*.
   - **Tag**: Select *latest*.

    :::image type="content" source="../../media/quickstart-custom-container/azure-container-registry-options-linux.png" alt-text="Screenshot showing the Azure Container Registry options.":::
    
1. Select the **Review + create** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page.":::

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

    :::image type="content" source="../../media/quickstart-custom-container/next-steps.png" alt-text="Screenshot showing the next step of going to the resource.":::

## 4 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-linux.png" alt-text="Screenshot showing the deployed application.":::

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
