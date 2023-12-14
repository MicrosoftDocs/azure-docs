---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [provision-event-driven](provision-event-driven.md)]

-->

The main resources you need to run this sample are an Azure Spring Apps instance, an Azure Key Vault instance, and an Azure Service Bus instance. Use the following steps to create these resources.

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [prepare-cloud-environment-on-azure-portal](event-driven-prepare-cloud-environment-standard-azure-portal.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create a Service Bus instance

[!INCLUDE [provision-service-bus](provision-service-bus.md)]

8. Select **Shared access policies** on the navigation menu and then select **RootManageSharedAccessKey**.

1. On the **SAS Policy: RootManageSharedAccessKey** page, copy and save the **Primary Connection String** value, which is used to set up connections from the Spring app.

1. Select **Queues** on the navigation menu and then select **Queue**.

1. On the **Create Queue** page, enter *lower-case* for **Name** and then select **Create**.

1. Create another queue by repeating the previous step using *upper-case* for **Name**.

### 3.3. Create an Azure Spring Apps instance

Use the following steps to create an Azure Spring Apps instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. Select **Compute** > **Azure Spring Apps**.

1. Fill out the **Basics** form with the following information:

   Use the following table as a guide for completing the form. The recommended **Plan** is **Standard**.

   | Setting            | Suggested value                  | Description                                                                                                                                                                                                                                                                                        |
   |--------------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**   | Your subscription name           | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                       |
   | **Resource group** | *myresourcegroup*                | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | **Name**           | *myasa*                          | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | **Plan**           | **Standard**                     | The plan determines the resource and cost associated with your instance.                                                                                                                                                                                                                           |
   | **Region**         | The region closest to your users | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | **Zone Redundant** | Unchecked                        | Whether to create your Azure Spring Apps service in an Azure availability zone, it could only be supported in several regions at the moment.                                                                                                                                                       |

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Selecting **Go to resource** opens the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/notifications.png" alt-text="Screenshot of the Azure portal showing the Notifications pane of the Deployment page." lightbox="../../media/quickstart-deploy-event-driven-app/notifications.png":::

### 3.4. Connect app instance to Service Bus instance

1. Go to your Azure Spring Apps instance in the Azure portal.

1. Select **Apps** in the navigation menu, then select **Create App**.

1. On the **Create App** page, enter *simple-event-driven-app* for **App name** and select *Java 17* for **Runtime platform**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png" alt-text="Screenshot of the Azure portal showing the Create App pane with App name and Runtime platform options selected." lightbox="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png":::

1. After the app creation, select the app name you created in the previous step.

1. On the **Configuration** page, select the **Environment variables** tab, enter *SERVICE_BUS_CONNECTION_STRING* for **Key**, paste the Service Bus connection string for **Value**, then select **Save**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/app-configuration-environment-variables.png" alt-text="Screenshot of the Azure portal showing the Environment variables tab of the App Configuration page." lightbox="../../media/quickstart-deploy-event-driven-app/app-configuration-environment-variables.png":::

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

1. Use the following command to sign in to Azure with OAuth2. Ignore this step if you already logged in.

   ```bash
   azd auth login
   ```

   The console outputs messages similar to the following example:

   ```text
   Logged in to Azure.
   ```

1. Use the following command to set the template using the **standard** plan:

   ```bash
   azd env set PLAN standard
   ```

1. Use the following command to package a deployable copy of your application, provision the template's infrastructure to Azure, and deploy the application code to those newly provisioned resources:

   ```bash
   azd provision
   ```

   The following list describes the command interactions:

   - **Select an Azure Subscription to use**: Use arrows to move, type to filter, then press Enter.
   - **Select an Azure location to use**: Use arrows to move, type to filter, then press Enter.

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

   > [!NOTE]
   > This command may take a while to complete. You're shown a progress indicator as it provisions Azure resources.

---
