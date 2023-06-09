---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 06/9/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Basic/Standard plan.

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

-->

## 2 Prepare Spring Project

Use the following steps to prepare the sample locally.

1. Use the following command to clone the sample GitHub project:

   ```bash
   git clone https://github.com/Azure-Samples/spring-petclinic-microservices.git
   ```

1. Use the following command to change to the sample root path and execute the shell script to run the sample project locally:

   ```bash
   ./script/run_all_without_infra.sh
   ```

1. After the script executes successfully, go to `http://localhost:8080` in your browser to access the PetClinic app.

## 3 Provision

The main resource you need to run this sample is an Azure Spring Apps instance. Use the following steps to create this resource.

### 3.1 Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2 Provision an instance of Azure Spring Apps

1. Select **Create a resource**.

1. On the **Create a resource** page, select **Compute** in the navigation pane and on the **Azure Services** tab select **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/1-create-azure-spring-apps.png" alt-text="Screenshot of the Azure portal showing the Create a Resource Page page with Azure Spring Apps highlighted.":::

1. On the **Create Azure Spring Apps** page, fill out the form on the **Basics** tab.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/2-create-basics.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with the Basics tab selected.":::

   Use the following table as a guide for completing the form.

   | Setting        |Suggested Value|Description|
   |----------------|---------------|-----------|
   | Subscription   |Your subscription name|The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.|
   | Resource group |*myresourcegroup*| A new resource group name or an existing one from your subscription.|
   | Name           |*myasa*|A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.|
   | Plan           |*Basic*|Pricing plan determines the resource and cost associated with your instance.|
   | Region         |The region closest to your users| The location that is closest to your users.|
   | Zone Redundant |Unchecked|Creates your Azure Spring Apps service in an Azure availability zone. Not currently supported in all regions.|

1. Navigate to the **Diagnostic settings** tab on the **Crete Azure Spring Apps** page and then select **Create new** to create a new Log Analytics workspaces instance. On the **Create new Log Analytics workspace** page, update the name of the **Log Analytics workspace** as needed, then select **OK** to confirm the creation.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/diagnostic-settings.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with the Diagnostics tab selected and the Create new button highlighted." lightbox="../../media/quickstart-deploy-microservice-apps/diagnostic-settings.png":::

1. Navigate to the **Application Insights** tab on the **Crete Azure Spring Apps** page and then select **Create new** to create a new Application Insights instance. On the **Create new Application Insights resource** page, update the **Application insights name** as needed, select the **Classic** for **Resource mode**, then select **OK** to confirm the creation.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/application-insights-creation.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with the Create new Application Insights resource pane showing." lightbox="../../media/quickstart-deploy-microservice-apps/application-insights-creation.png":::

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. Select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard** to create a shortcut on your Azure portal dashboard to the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/3-asa-notifications.png" alt-text="Screenshot of the Azure portal showing a deployment of a resource and the Notification pane with Go to resource and Pin to dashboard buttons.":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Config Server** in the navigation pane, and then on the **Config Server** page, for **URI** enter *https://github.com/Azure-Samples/spring-petclinic-microservices-config.git* and select **Validate**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/validate-config-server.png" alt-text="Screenshot of the Azure portal showing the Config Server page with the Default URI and the Validate button highlighted and the Apply button disabled." lightbox="../../media/quickstart-deploy-microservice-apps/validate-config-server.png":::

1. After validation, select **Apply** to finish the Config Server configuration.

## 4 Deployment

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy microservice applications.

1. Navigate to the sample project directory and use the following command to config the apps in Azure Spring Apps:

   ```bash
   ./mvnw -P spring-apps com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
   - **Select child modules to configure(input numbers separated by comma, eg: [1-2,4,6], ENTER to select ALL)**: Press `Enter` to select all.
   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press `Enter` directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press `Enter` directly.
   - **Select apps to expose public access:(input numbers separated by comma, eg: [1-2,4,6], ENTER to select NONE)**: Enter `1,5` for `admin-server` and `api-gateway`.
   - **Confirm to save all the above configurations (Y/n)**: Enter `y`. If Enter `n`, the configuration isn't saved in the POM files.

1. Use the following command to build and deploy each application:

   ```bash
   ./mvnw -P spring-apps com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:deploy
   ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.

   > [!NOTE]
   > Deployment to Azure Spring Apps can take up to 25 minutes.

   After the command is executed, a log displays similar to the following output that indicates that all deployments are successful.

   ```text
   [INFO] Deployment(default) is successfully updated.
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:admin-server-default-xx-xx-xxx  Status:Running Reason:null       DiscoverStatus:UP
   [INFO] Getting public url of app(admin-server)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-admin-server.azuremicroservices.io
   
   ...
   
   [INFO] Getting public url of app(api-gateway)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io
   ```
