---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 10/02/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Consumption plan.

[!INCLUDE [deploy-restful-api-app-with-consumption-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-consumption-plan.md)]

-->

## 2. Prepare the Spring project

To deploy the RESTful API app, the first step is to prepare the Spring project to run locally.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to clone and run the app locally:

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Restful-Application.git
   ```

1. If you want to run the app locally, complete the steps in the [Expose RESTful APIs](#35-expose-restful-apis) and [Update the application configuration](#36-update-the-application-configuration) sections first, and then use the following command to run the sample application with Maven:

   ```bash
   cd ASA-Samples-Restful-Application
   ./mvnw spring-boot:run
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to initialize the web application from Azure Developer CLI templates:

1. Open a terminal, create a new empty folder, and then change directory to it.

1. Run the following command to initialize the project:

   ```bash
   azd init --template Azure-Samples/ASA-Samples-Restful-Application
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Please enter a new environment name**: Provide an environment name. This name is used as a suffix for the resource group created to hold all the Azure resources. This name should be unique within your Azure subscription.

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

The main resources required to run this sample app are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. The following sections describe how to create these resources.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

Use the following steps to create a service instance:

1. Select **Create a resource** in the corner of the portal.

1. Select **Compute** > **Azure Spring Apps**.

1. Fill out the **Basics** form. Use the following table as a guide for completing the form. The recommended **Plan** value is **Standard consumption & dedicated (preview)**.

   | Setting                        | Suggested value                                | Description                                                                                                                                                                                                                                                                                        |
   |--------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**               | Your subscription name.                        | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                        |
   | **Resource group**             | *myresourcegroup*                              | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | **Name**                       | *myasa*                                        | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | **Plan**                       | **Standard consumption & dedicated (preview)** | The pricing plan determines the resources and cost associated with your instance.                                                                                                                                                                                                                  |
   | **Region**                     | The region closest to your users.              | The location that's closest to your users.                                                                                                                                                                                                                                                         |
   | **Container Apps Environment** | *myenvironment*                                | The option to select which Container Apps environment instance to share the same virtual network with other services and resources.                                                                                                                                                                |

   Use the following table as a guide for the Container Apps Environment creation:

   | Setting              | Suggested value | Description                                                                                 |
   |----------------------|-----------------|---------------------------------------------------------------------------------------------|
   | **Environment name** | *myenvironment* | A unique name that identifies your Azure Container Apps Environment service.                |
   | **Plan**             | **Consumption** | The pricing plan determines the resources and cost associated with your instance.           |
   | **Zone Redundant**   | Disabled        | The option to create your Container Apps Environment service in an Azure availability zone. |

1. Select **Review and Create** to review your selections. Then, select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. 

1. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/notifications.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the Notifications page open." lightbox="../../media/quickstart-deploy-restful-api-app/notifications.png":::

> [!IMPORTANT]
> The Consumption workload profile has a pay-as-you-go billing model, with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Azure Container Apps](../../../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

### 3.3. Prepare the PostgreSQL instance

[!INCLUDE [provision-postgresql-flexible](provision-postgresql.md)]

### 3.4. Connect app instance to PostgreSQL instance

Use the following steps to connect your service instances:

1. Go to your Azure Spring Apps instance in the Azure portal.

1. From the navigation menu, open **Apps**, and then select **Create App**.

1. On the **Create App** page, fill in the app name *simple-todo-api* and select **Java artifacts** as the deployment type.

1. Select **Create** to finish the app creation and select the app to view the details.

1. Go to the app you created in the Azure portal. On the **Overview** page, select **Assign endpoint** to expose the public endpoint for the app. Save the URL for accessing the app after deployment.

1. Go to the app you created, expand **Settings** and select **Configuration** from the navigation menu, and then select **Environment variables** to set the environment variables.

1. Add the following environment variables for the PostgreSQL connection, and then select **Save** to finish the app configuration update. Be sure to replace the placeholders with your own values that you created previously.

   | Environment variable         | Value                                                                                  |
   |------------------------------|----------------------------------------------------------------------------------------|
   | `SPRING_DATASOURCE_URL`      | `jdbc:postgresql://<your-PostgreSQL-server-name>:5432/<your-PostgreSQL-database-name>` |
   | `SPRING_DATASOURCE_USERNAME` | `<your-PostgreSQL-admin-user>`                                                         |
   | `SPRING_DATASOURCE_PASSWORD` | `<your-PostgreSQL-admin-password>`                                                     |

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/consumption-app-environment-variables.png" alt-text="Screenshot of the Azure portal that shows the Environment variables tab with all the values for the PostgreSQL connection." lightbox="../../media/quickstart-deploy-restful-api-app/consumption-app-environment-variables.png":::

### 3.5. Expose RESTful APIs

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

### 3.6. Update the application configuration

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

### 3.1. Prepare the Azure resources

Use the following steps to provision the required Azure resources:

1. Run the following command to log in to Azure with OAuth2. Ignore this step if you already logged in.

   ```bash
   azd auth login
   ```

1. Run the following command to enable the Azure Spring Apps feature:

   ```bash
   azd config set alpha.springapp on
   ```

1. Run the following command to package a deployable copy of your application, provision the template's infrastructure to Azure, and deploy the application code to those newly provisioned resources:

   ```bash
   azd provision
   ```

   The following list describes the command interactions:

   - **Select an Azure Subscription to use**: Use arrows to move, type to filter, then press <kbd>Enter</kbd>.
   - **Select an Azure location to use**: Use arrows to move, type to filter, then press <kbd>Enter</kbd>.

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name>> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>/overview
   ```

   > [!NOTE]
   > This command might take a while to complete. You see a progress indicator as it provisions Azure resources.

### 3.2. Expose RESTful APIs

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

### 3.3. Update the application configuration

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

---

## 4. Deploy the app to Azure Spring Apps

You can now deploy the app to Azure Spring Apps.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

[!INCLUDE [restful-api-spring-apps-maven-plugin](restful-api-spring-apps-maven-plugin.md)]
   
   ```output
   [INFO] Deployment(default) is successfully created
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:demo--default-xxxxxxx-xxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:NONE
   [INFO] Getting public url of app(demo)...
   [INFO] Application url: https://demo.<unique-identifier>.<region-name>.azurecontainerapps.io
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to package the app, provision the Azure resources required by the web application, and then deploy to Azure Spring Apps.

1. Run the following command to package a deployable copy of your application:

   ```bash
   azd package
   ```

1. Run the following command to deploy the application code to those newly provisioned resources:

   ```bash
   azd deploy
   ```

   The console outputs messages similar to the following example:

   ```output
   Deploying services (azd deploy)
   
   WARNING: Feature 'springapp' is in alpha stage.
   To learn more about alpha features and their support, visit https://aka.ms/azd-feature-stages.
   
   ...
   
   Deploying service simple-todo-api (Fetching endpoints for spring app service)
   - Endpoint: https://simple-todo-api.xxxxxxxx-xxxxxxxx.xxxxxx.azurecontainerapps.io
   
   
   SUCCESS: Your application was deployed to Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

   The output **Endpoint** is the base endpoint to access the ToDo API application.

> [!NOTE]
> You can also use `azd up` to combine the previous three commands: `azd provision` (provisions Azure resources), `azd package` (packages a deployable copy of your application), and `azd deploy` (deploys application code). For more information, see [Azure-Samples/ASA-Samples-API-Application](https://github.com/Azure-Samples/ASA-Samples-API-Application).

---
