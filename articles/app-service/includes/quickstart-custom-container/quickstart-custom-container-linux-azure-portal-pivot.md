---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.custom: linux-related-content
ms.topic: quickstart
ms.date: 02/14/2025
ms.author: cephalin
---

In this quickstart, you learn how to deploy an image from Azure Container Registry to Azure App Service.

[Azure App Service](../../overview.md) on Linux provides predefined application stacks on Linux with support for languages such as .NET, Java, Node.js, and PHP. You can also use a custom Docker image to run your web app on an application stack that isn't already defined in Azure.

For more information about containerized applications in a serverless environment, see [Azure Container Apps overview](../../../container-apps/overview.md).

## Prerequisites

- An [Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- [Azure Container Registry](/azure/container-registry/container-registry-get-started-portal)
- The [Azure CLI](/cli/azure/install-azure-cli)
- [Docker](https://www.docker.com/community-edition)

## Clone the sample repository

Clone the [the .NET 6.0 sample app](https://github.com/Azure-Samples/dotnetcore-docs-hello-world) by using the following command:

```bash
git clone https://github.com/Azure-Samples/dotnetcore-docs-hello-world.git
```

## Push the image to Azure Container Registry

Make sure that you're in the cloned repository's root folder, which contains a `Dockerfile.linux` file.

1. Sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. Sign in to Azure Container Registry.

   ```azurecli
   az acr login -n <your_registry_name>
   ```

1. Build the container image. This example uses the image name `dotnetcore-docs-hello-world-linux`.

   ```docker
   docker build -f Dockerfile.linux -t <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux . 
   ```

1. Push the container image to Azure Container Registry.

   ```docker
   docker push <your_registry_name>.azurecr.io/dotnetcore-docs-hello-world-linux:latest
   ```

   > [!NOTE]
   > The Dockerfile sets the port number to 80 internally. For more information, go to [Configure custom container](../../configure-custom-container.md).

## Deploy to Azure

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type **app services** in the search. Under **Services**, select **App Services**.

   :::image type="content" source="../../media/quickstart-custom-container/portal-search.png" alt-text="Screenshot that shows how to search for app services in the Azure portal.":::

1. On the **App Services** pane, select **Create** > **Web App**.

1. On the **Basics** tab, under **Project details**, select the correct subscription. To create a new resource group, select **Create new**. Type **myResourceGroup** for the name.

   :::image type="content" source="../../media/quickstart-custom-container/project-details.png" alt-text="Screenshot that shows the project details section where you select the Azure subscription and the resource group for the web app.":::

1. Under **Instance details**:

   - Enter a globally unique name for your web app.
   - Select **Container**.
   - For **Operating System**, select **Linux**.
   - In **Region**, select the region from which you plan to serve your app.

   :::image type="content" source="../../media/quickstart-custom-container/instance-details-linux.png" alt-text="Screenshot that shows the instance details section where you provide a name for the virtual machine and select its region, image, and size.":::

1. Under **App Service Plan**, select **Create new**. Enter **myAppServicePlan** for the name. To change to the Free tier, select **Change size** > **Dev/Test** > **F1** > **Apply**.

   :::image type="content" source="../../media/quickstart-custom-container/app-service-plan-details-linux.png" alt-text="Screenshot that shows plan options.":::

1. At the top of the pane, select the **Container** tab.

1. On the **Container** tab, for **Image Source**, select **Azure Container Registry**. Under **Azure Container Registry options**, set the following values:

   - **Registry**: Select your container registry.
   - **Image**: Select **dotnetcore-docs-hello-world-linux**.
   - **Tag**: Select **latest**.

   :::image type="content" source="../../media/quickstart-custom-container/azure-container-registry-options-linux.png" alt-text="Screenshot that shows Azure Container Registry options.":::

1. Select **Review + create** at the bottom of the pane.

   :::image type="content" source="../../media/quickstart-custom-container/review-create.png" alt-text="Screenshot that shows the button at the bottom of the pane.":::

1. After validation runs, select **Create**.

1. After deployment finishes, select **Go to resource**.

   :::image type="content" source="../../media/quickstart-custom-container/next-steps.png" alt-text="Screenshot that shows the button to go to the resource.":::

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-linux.png" alt-text="Screenshot that shows the deployed application.":::

The App Service app pulls from the container registry each time it starts. If you rebuild your image, push it to your container registry. The app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

## Clean up resources

[!INCLUDE [Clean-up Portal web app resources](../../../../includes/clean-up-section-portal-no-h.md)]

## Related content

- [Secure with a custom domain and certificate](../../tutorial-secure-domain-certificate.md)
- [Migrate to a Windows container in Azure](../../tutorial-custom-container.md)
- [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)
- [Use private endpoints for App Service apps](../../networking/private-endpoint.md)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)
- [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)
- [Configure custom container](../../configure-custom-container.md)
- [Sidecar container tutorial](../../tutorial-custom-container-sidecar.md)
