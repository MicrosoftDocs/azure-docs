---
author: karlerickson
ms.author: v-muyaofeng
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/31/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [prepare-cloud-environment-event-driven-consumption.md](prepare-cloud-environment-event-driven-consumption.md)]

-->

The main resources you need to run this sample are an Azure Spring Apps instance, an Azure Key Vault, and an Azure Service Bus instance. Use the following steps to create these resources.

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [prepare-cloud-environment-on-azure-portal](event-driven-prepare-cloud-env-consumption-azure-portal.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create a Service Bus instance

[!INCLUDE [provision-service-bus](provision-service-bus.md)]

### 3.3. Create an Azure Spring Apps instance

Use the following steps to create the service instance:

1. Select **Create a resource** in the corner of the portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/create-azure-spring-apps.png" alt-text="Screenshot of the Azure portal that shows the Create a resource page with Azure Spring Apps highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/create-azure-spring-apps.png":::

1. Fill out the **Standard consumption & dedicated (preview)** form with the following information:

   | Setting                        | Suggested value                              | Description                                                                                                                                                                                                                                                                                        |
   |--------------------------------|----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**               | Your subscription name                       | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                       |
   | **Resource group**             | *myresourcegroup*                            | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | **Name**                       | *myasa*                                      | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | **Plan**                       | *Standard consumption & dedicated (preview)* | The pricing plan determines the resources and cost associated with your instance.                                                                                                                                                                                                              |
   | **Region**                     | The region closest to your users             | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | **Container Apps Environment** | *myacaenv*                                   | The environment is a secure boundary around one or more container apps that can communicate with each other and share a virtual network, logging, and Dapr configuration.                                                                                                                          |

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/create-consumption.png" alt-text="Screenshot of the Azure portal that shows the consumption tab of the Create Azure Spring Apps page." lightbox="../../media/quickstart-deploy-event-driven-app/create-consumption.png":::

1. (Optional) Use the following steps to create a Container Apps Environment:

   [!INCLUDE [prepare-container-apps-environment](prepare-container-apps-environment.md)]

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Selecting **Go to resource** opens the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/notifications.png" alt-text="Screenshot of the Azure portal that shows the Notifications pane of the Deployment page." lightbox="../../media/quickstart-deploy-event-driven-app/notifications.png":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Apps** in the left navigational menu, and then select **Create App**.

1. On the **Create App** page, enter `simple-event-driven-app` for **App name**, and then select **Use quick start sample app** to create app.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/consumption-create-app.png" alt-text="Screenshot of the Azure portal that shows the Create App pane with consumption plan." lightbox="../../media/quickstart-deploy-event-driven-app/consumption-create-app.png":::

1. Select **Create** to finish creating the Azure Spring Apps instance.

1. After the app creation, select the app name you created in the previous step.

1. Select **Configuration** from the navigation pane, and then configure the following property on the **Environment variables** tab.

   - **SERVICE_BUS_CONNECTION_STRING**: Enter the Service Bus primary connection string.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/app-configuration-environment-variables-consumption.png" alt-text="Screenshot of the Azure portal that shows the Environment variables tab of the App Configuration page for consumption plan." lightbox="../../media/quickstart-deploy-event-driven-app/app-configuration-environment-variables-consumption.png":::

1. Select **Save** to save the connection properties.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

1. Use the following command to log in Azure with OAuth2. Ignore this step if you've already logged in.

   ```bash
   azd auth login
   ```

   The console outputs messages similar to the following example:

   ```text
   Logged in to Azure.
   ```

1. Use the following command to provision the template's infrastructure to Azure:

   ```bash
   azd provision
   ```

   The following list describes the command interactions:

   - **Please select an Azure Subscription to use**: Use arrows to move, type to filter, and then press <kbd>Enter</kbd>.
   - **Please select an Azure location to use**: Use arrows to move, type to filter, and then press <kbd>Enter</kbd>.

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name>-<random-string>> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

   > [!NOTE]
   > This command may take a while to complete. You see a progress indicator as it provisions Azure resources.

---
