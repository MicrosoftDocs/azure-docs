---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [provision-event-driven](../../includes/quickstart-deploy-event-driven-app/provision-event-driven.md)]

-->

The main resources you need to run this sample are an Azure Spring Apps instance, an Azure Key Vaults and an Azure Service Bus instance. This section provides the steps to create these resources.

### [Azure portal](#tab/Azure-portal)

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create a Service Bus instance

[!INCLUDE [provision-service-bus](../../includes/quickstart-deploy-event-driven-app/provision-service-bus.md)]

### 3.3. Create a Key Vaults instance

[!INCLUDE [provision-key-vault](../../includes/quickstart-deploy-event-driven-app/provision-key-vault.md)]

### 3.4. Create an Azure Spring Apps instance

1. Select Create a resource (+) in the upper-left corner of the portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/1-create-azure-spring-apps.png" alt-text="The Azure Spring Apps in menu":::

1. Fill out the **Basics** form with the following information:

   Use the following table as a guide for completing the form, the recommended **Plan** is `Basic`.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/2-create-basics.png" alt-text="Create an Azure Spring Apps service":::

   | Setting        | Suggested Value | Description                                                                                                                                                                                                                                                                                        |
      |----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
   | Subscription   | Your subscription name | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                       |
   | Resource group | *myresourcegroup* | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | Name           | *myasa*        | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | Plan           | *Basic*        | Pricing Tier determines the resource and cost associated with your instance.                                                                                                                                                                                                                       |
   | Region         | The region closest to your users | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | Zone Redundant | Unchecked      | Whether to create your Azure Spring Apps service in an Azure availability zone, it could only be supported in several regions at the moment.                                                                                                                                                       |

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Selecting **Go to resource** opens the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/3-asa-notifications.png" alt-text="The Notifications pane for Azure Spring Apps Creation":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Apps** in the left navigational menu, select **Create App**.

1. On the **Create App** page, enter `simple-event-driven-app` for **App name**, select *Java 17* for **Runtime platform**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png" alt-text="Screenshot of Azure portal showing basic plan App creation for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png":::

1. Select **Create** to finish creating the Azure Spring Apps instance.

1. After the app creation, select the app name you created in the previous step.

1. On the **Configuration** page, select **Environment variables** tab page, enter `AZURE_KEY_VAULT_ENDPOINT` for **Key**, enter the Key Vault URI for **Value**, then select **Save**

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/app-config-env.png" alt-text="Screenshot of Azure portal showing config env for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/app-config-env.png":::

### 3.5. Config Key Vault access policy

1. Go to the Azure Spring Apps instance overview page.

1. Select **Apps** in the left navigational menu, select the app name you created in the previous step.

1. On the **App Overview** page, select **Identity** in the left navigational menu, select the **on** state switch, then select **Save**, and continue to select **Yes** when prompt `Enable system assigned managed identity`.

1. Go to the Key vault instance overview page.

1. Select **Access policies** in the left navigational menu, select **Create**.

1. On the **Create an access policy** page, select **Get** and **List** for **Secret permissions**, select **Next**.

1. On the search box, enter your Azure Spring Apps instance name, you can see the similar search result:

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/create-access-policy-app.png" alt-text="Screenshot of Azure portal showing access policy creation" lightbox="../../media/quickstart-deploy-event-driven-app/create-access-policy-app.png":::

1. select the principal of your Azure Spring Apps instance, select **Next**, and select **Next** to review the creation parameters, then select **Create** to finish creating the access policy.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

1. Run the following command to log in Azure with OAuth2, ignore this step if you have already logged in.

   ```bash
   azd auth login
   ```

1. Run the following command to enable Azure Spring Apps feature.

   ```bash
   azd config set alpha.springapp on
   ```

1. Run the following command to package a deployable copy of your application, provision the template's infrastructure to Azure and also deploy the application code to those newly provisioned resources.

   ```bash
   azd provision
   ```

   Command interaction description:

    - **Please select an Azure Subscription to use**: Use arrows to move, type to filter, then press Enter.
    - **Please select an Azure location to use**: Use arrows to move, type to filter, then press Enter.

   The console outputs messages similar to the ones below:

   ```text
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name>-<random-string>> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>/overview
   ```

   > [!NOTE]
   > This may take a while to complete. You will see a progress indicator as it provisions Azure resources.

---