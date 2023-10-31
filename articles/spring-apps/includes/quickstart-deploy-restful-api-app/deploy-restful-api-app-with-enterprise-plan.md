---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 10/02/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with enterprise plan.

[!INCLUDE [deploy-restful-api-app-with-enterprise-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

To deploy the RESTful API app, the first step is to prepare the Spring project to run locally.

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

## 3. Prepare the cloud environment

The main resources required to run this sample app are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. The following sections describe how to create these resources.

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-enterprise-azure-spring-apps](provision-enterprise-azure-spring-apps.md)]

### 3.3. Prepare the PostgreSQL instance

[!INCLUDE [provision-postgresql](provision-postgresql.md)]

### 3.4. Connect app instance to PostgreSQL instance

Use the following steps to connect your service instances:

1. Go to your Azure Spring Apps instance in the Azure portal.

1. From the navigation menu, open **Apps**, and then select **Create App**.

1. On the **Create App** page, fill in the app name *simple-todo-api*, and then select **Java artifacts** as the deployment type.

1. Select **Create** to finish the app creation and then select the app to view the details.

1. Go to the app you created in the Azure portal. On the **Overview** page, select **Assign endpoint** to expose the public endpoint for the app. Save the URL for accessing the app after deployment.

1. Select **Service Connector** from the navigation pane, then select **Create** to create a new service connection.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/restful-api-app-service-connector-enterprise.png" alt-text="Screenshot of the Azure portal that shows the enterprise plan Service Connector page with the Create button highlighted." lightbox="../../media/quickstart-deploy-restful-api-app/restful-api-app-service-connector-enterprise.png":::

1. Fill out the **Basics** tab with the following information:

   - **Service type**: **DB for PostgreSQL flexible server**
   - **Connection name**: An automatically generated name is populated, which can also be modified.
   - **Subscription**: Select your subscription.
   - **PostgreSQL flexible server**: *my-demo-pgsql*
   - **PostgreSQL database**: Select the database you created.
   - **Client type**: **SpringBoot**

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/app-service-connector-basics.png" alt-text="Screenshot of the Azure portal that shows the Basics tab of the Create connection pane for connecting to Service Bus." lightbox="../../media/quickstart-deploy-restful-api-app/app-service-connector-basics.png":::

1. Configure the **Next: Authentication** tab with the following information:

   - **Select the authentication type you'd like to use between your compute service and target service.**: Select **Connection string**.
   - **Continue with...**: Select **Database credentials**
   - **Username**: *myadmin*
   - **Password**: Enter your password.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/app-service-connector-authentication.png" alt-text="Screenshot of the Azure portal that shows the Authentication tab of the Create connection pane with the Connection string option highlighted." lightbox="../../media/quickstart-deploy-restful-api-app/app-service-connector-authentication.png":::

1. Select **Next: Networking**. Use the default option **Configure firewall rules to enable access to target service**.

1. Select **Next: Review and Create** to review your selections, then select **Create** to create the connection.

### 3.5. Expose RESTful APIs

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

### 3.6. Update the application configuration

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

## 4. Deploy the app to Azure Spring Apps

You can now deploy the app to Azure Spring Apps.

[!INCLUDE [deploy-restful-api-app-with-maven-plugin](restful-api-spring-apps-maven-plugin.md)]
   
   ```output  
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:simple-todo-api-default-15-xxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:N/A       
   [INFO] Getting public url of app(simple-todo-api)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-simple-todo-api.azuremicroservices.io
   ```