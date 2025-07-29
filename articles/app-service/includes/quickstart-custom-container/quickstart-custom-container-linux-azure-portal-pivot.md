---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.custom: linux-related-content
ms.topic: quickstart
ms.date: 02/14/2025
ms.author: cephalin
---

[Azure App Service](../../overview.md) on Linux provides predefined application stacks on Linux with support for languages such as .NET, Java, Node.js, and PHP. You can also use a custom Docker image to run your web app on an application stack that isn't already defined in Azure. This quickstart shows you how to deploy an image from Azure Container Registry to Azure App Service.

For more information about containerized applications in a serverless environment, see [Container Apps](../../../container-apps/overview.md).

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- An [Azure Container Registry](/azure/container-registry/container-registry-get-started-portal)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Docker](https://www.docker.com/community-edition)

## Clone the sample repository

Clone the [the .NET 6.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world) with the following command:

```bash
git clone https://github.com/Azure-Samples/dotnetcore-docs-hello-world.git
```

## Push the image to Azure Container Registry

Make sure you are in the cloned repository's root folder. This repository contains a *Dockerfile.linux* file.

1. Sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. Sign in to Azure Container Registry.

   ```azurecli
   az acr login -n <your_registry_name>
   ```

1. Build the container image. This example uses the image name *dotnetcore-docs-hello-world-linux*.

   ```docker
   docker build -f Dockerfile.linux -t <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux . 
   ```

1. Push the container image to Azure Container Registry.

   ```docker
   docker push <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux:latest
   ```

   > [!NOTE]
   > The Dockerfile sets the port number to 80 internally. For more information about configuring the container, see [Configure custom container](../../configure-custom-container.md).

## Deploy to Azure

### Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

### Create Azure resources

1. Type **app services** in the search. Under **Services**, select **App Services**.

   :::image type="content" source="../../media/quickstart-custom-container/portal-search.png" alt-text="Screenshot of searching for 'app services' in the Azure portal.":::

1. In the **App Services** page, select **Create** > **Web App**.

1. In the **Basics** tab, under **Project details**, select the correct subscription. Select **Create new** resource group. Type *myResourceGroup* for the name.

   :::image type="content" source="../../media/quickstart-custom-container/project-details.png" alt-text="Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the web app.":::

1. Under **Instance details**:

   - Enter a globally unique name for your web app.
   - Select **Container**.
   - For the **Operating System**, select **Linux**.
   - Select a **Region** that you want to serve your app from.

   :::image type="content" source="../../media/quickstart-custom-container/instance-details-linux.png" alt-text="Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image, and size.":::

1. Under **App Service Plan**, select **Create new** App Service Plan. Enter *myAppServicePlan* for the name. To change to the Free tier, select **Change size**, select the **Dev/Test** tab, select **F1**. Select **Apply**.

   :::image type="content" source="../../media/quickstart-custom-container/app-service-plan-details-linux.png" alt-text="Screenshot of the App Service plan options.":::

1. At the top of the page, select the **Container** tab.

1. In the **Container** tab, for **Image Source**, select **Azure Container Registry**. Under **Azure Container Registry options**, set the following values:

   - **Registry**: Select your Azure Container Registry.
   - **Image**: Select **dotnetcore-docs-hello-world-linux**.
   - **Tag**: Select **latest**.

   :::image type="content" source="../../media/quickstart-custom-container/azure-container-registry-options-linux.png" alt-text="Screenshot showing the Azure Container Registry options.":::

1. Select **Review + create** at the bottom of the page.

   :::image type="content" source="../../media/quickstart-custom-container/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page.":::

1. After validation runs, select **Create**.

1. After deployment finishes, select **Go to resource**.

   :::image type="content" source="../../media/quickstart-custom-container/next-steps.png" alt-text="Screenshot showing the next step of going to the resource.":::

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-linux.png" alt-text="Screenshot showing the deployed application.":::

## Clean up resources

[!INCLUDE [Clean-up Portal web app resources](../../../../includes/clean-up-section-portal-no-h.md)]

## Related content

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry each time it starts. If you rebuild your image, just push it to your container registry. The app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

- [Secure with custom domain and certificate](../../tutorial-secure-domain-certificate.md)
- [Migrate to Windows container in Azure](../../tutorial-custom-container.md)
- [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)
- [Use Private Endpoints for App Service apps](../../networking/private-endpoint.md)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)
- [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)
- [Configure custom container](../../configure-custom-container.md)
- [Sidecar container tutorial](../../tutorial-custom-container-sidecar.md)
