---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 06/9/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Basic/Standard plan.

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

-->

## 2. Prepare the Spring project

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to prepare the sample locally.

1. Use the following command to clone the sample GitHub project:

   ```bash
   git clone https://github.com/Azure-Samples/spring-petclinic-microservices.git
   ```

1. Use the following command to change to the sample root path and execute the shell script to run the sample project locally:

   ```bash
   bash ./scripts/run_all_without_infra.sh
   ```

1. After the script executes successfully, go to `http://localhost:8080` in your browser to access the PetClinic app.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to initialize the Pet Clinic application using Azure Developer CLI templates:

1. Open a terminal, create a new, empty folder, and then navigate to it.

1. Use the following command to initialize the project:

   ```bash
   azd init --template Azure-Samples/spring-petclinic-microservices
   ```

   The following list describes the command interaction:

   - **Enter a new environment name**: Provide an environment name, which is used as a suffix for the resource group that is created to hold all Azure resources. This name should be unique within your Azure subscription.

   The console outputs messages similar to the following example:

   ```output
   Initializing a new project (azd init)
   
   Downloading template code to: <your-local-path>
   (✓) Done: Initialized git repository
   Enter a new environment name: <your-env-name>
   
   SUCCESS: New project initialized!
   You can view the template code in your directory: <your-local-path>
   Learn more about running 3rd party code on our DevHub: https://aka.ms/azd-third-party-code-notice
   ```

---

## 3. Prepare the cloud environment

This section describes how to create an Azure Spring Apps service instance and prepare the Azure cloud environment.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

Use the following steps to create the service instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. On the **Azure Services** tab, select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/create-azure-spring-apps.png" alt-text="Screenshot of the Azure portal that shows the Create a Resource page with Azure Spring Apps highlighted." lightbox="../../media/quickstart-deploy-microservice-apps/create-azure-spring-apps.png":::

1. On the **Create Azure Spring Apps** page, fill out the form on the **Basics** tab.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/create-basics.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Spring Apps page with the Basics tab selected." lightbox="../../media/quickstart-deploy-microservice-apps/create-basics.png":::

   Use the following table as a guide for completing the form. The recommended **Plan** is **Standard**.

   | Setting            | Suggested value                   | Description                                                                                                                                                                                                                                                                                         |
   |--------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**   | Your subscription name.           | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription for which you'd like to be billed for the resource.                                                                                                                        |
   | **Resource group** | *myresourcegroup*                 | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                                |
   | **Name**           | *myasa*                           | A unique name that identifies your Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | **Plan**           | **Standard**                      | The pricing plan determines the resources and cost associated with your instance.                                                                                                                                                                                                                   |
   | **Region**         | The region closest to your users. | The location that is closest to your users.                                                                                                                                                                                                                                                         |
   | **Zone Redundant** | Unchecked                         | Creates your Azure Spring Apps service in an Azure availability zone. Not currently supported in all regions.                                                                                                                                                                                       |

1. Navigate to the **Diagnostic settings** tab on the **Create Azure Spring Apps** page and then select **Create new** to create a new Log Analytics workspaces instance. On the **Create new Log Analytics workspace** page, update the name of the **Log Analytics workspace** as needed, and then select **OK** to confirm the creation.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/diagnostic-settings.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Spring Apps page with the Diagnostics tab selected and the Create new button highlighted." lightbox="../../media/quickstart-deploy-microservice-apps/diagnostic-settings.png":::

1. Navigate to the **Application Insights** tab on the **Create Azure Spring Apps** page and then select **Create new** to create a new Application Insights instance. On the **Create new Application Insights resource** page, update the **Application insights name** as needed, select **Workspace-based** for **Resource mode**, and then select **OK** to confirm the creation.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/application-insights-creation.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Spring Apps page with the Create new Application Insights resource pane showing." lightbox="../../media/quickstart-deploy-microservice-apps/application-insights-creation.png":::

1. Select **Review and Create** to review your selections. Then, select **Create** to provision the Azure Spring Apps instance.

1. Select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard** to create a shortcut on your Azure portal dashboard to the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-notifications.png" alt-text="Screenshot of the Azure portal that shows a deployment of a resource and the Notification pane with Go to resource and Pin to dashboard buttons." lightbox="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-notifications.png":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Config Server** in the navigation pane.

1. On the **Config Server** page, for **URI**, enter *`https://github.com/Azure-Samples/spring-petclinic-microservices-config.git`*, and then select **Validate**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/validate-config-server.png" alt-text="Screenshot of the Azure portal that shows the Config Server page with the Default URI and the Validate button highlighted and the Apply button disabled." lightbox="../../media/quickstart-deploy-microservice-apps/validate-config-server.png":::

1. After validation, select **Apply** to finish the Config Server configuration.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to create the required resources:

1. Use the following command to sign in to Azure with OAuth2. Ignore this step if you've already signed in.

   ```bash
   azd auth login
   ```

   The console outputs messages similar to the following example:

   ```text
   Logged in to Azure.
   ```

1. Use the following command to package a deployable copy of your application, provision the template's infrastructure to Azure, and then deploy the application code to those newly provisioned resources:

   ```bash
   azd provision
   ```

   The following list describes the command interactions:

   - **Select an Azure Subscription to use**: Use arrows to move, type to filter, then press <kbd>Enter</kbd>.
   - **Select an Azure location to use**: Use arrows to move, type to filter, then press <kbd>Enter</kbd>.

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

   > [!NOTE]
   > This command may take a while to complete. You're shown a progress indicator as it provisions Azure resources.

---

## 4. Deploy the apps to Azure Spring Apps

You can now deploy the app to Azure Spring Apps.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to deploy the microservice applications using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the sample project directory and use the following command to configure the apps for Azure Spring Apps:

   ```bash
   ./mvnw -P spring-apps com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

1. The following list describes the command interactions:

   - **Select child modules to configure(input numbers separated by comma, eg: [1-2,4,6], ENTER to select ALL)**: Press <kbd>Enter</kbd> to select all.
   - **OAuth2 login**: Authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Select apps to expose public access:(input numbers separated by comma, eg: [1-2,4,6], ENTER to select NONE)**: Enter *1,5* for `admin-server` and `api-gateway`.
   - **Confirm to save all the above configurations (Y/n)**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.

1. Use the following command to build and deploy each application:

   ```bash
   ./mvnw azure-spring-apps:deploy
   ```

1. For the **OAuth2 login** prompt, authorize the login to Azure based on the OAuth2 protocol.

   > [!NOTE]
   > Deployment to Azure Spring Apps can take up to 25 minutes.

After the command is executed, a log displays output similar to the following example, which indicates that all deployments are successful:

```output
[INFO] Deployment(default) is successfully updated.
[INFO] Deployment Status: Running
[INFO]   InstanceName:admin-server-default-xx-xx-xxx  Status:Running Reason:null       DiscoverStatus:UP
[INFO] Getting public url of app(admin-server)...
[INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-admin-server.azuremicroservices.io

...

[INFO] Getting public url of app(api-gateway)...
[INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io
```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to package the app, provision the Azure resources required by the web application, and then deploy to Azure Spring Apps:

1. Use the following command to package a deployable copy of your application:

   ```bash
   azd package
   ```

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was packaged for Azure in xx minutes xx seconds.
   ```

1. Use the following command to deploy the application code to those newly provisioned resources:

   ```bash
   azd deploy
   ```

   The console outputs messages similar to the following example:

   ```output
   Deploying services (azd deploy)
   
   (✓) Done: Deploying service admin-server
   - Endpoint: https://<your-Azure-Spring-Apps-instance-name>-admin-server.azuremicroservices.io
   
   (✓) Done: Deploying service api-gateway
   - Endpoint: https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io
   
   (✓) Done: Deploying service customers-service
   - No endpoints were found
   
   (✓) Done: Deploying service vets-service
   - No endpoints were found
   
   (✓) Done: Deploying service visits-service
   - No endpoints were found
   
   
   SUCCESS: Your application was deployed to Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

> [!NOTE]
> You can also use `azd up` to combine the previous three commands: `azd package` (packages a deployable copy of your application), `azd provision` (provisions Azure resources), and `azd deploy` (deploys application code). For more information, see [Azure-Samples/spring-petclinic-microservices](https://github.com/Azure-Samples/spring-petclinic-microservices.git).

---
