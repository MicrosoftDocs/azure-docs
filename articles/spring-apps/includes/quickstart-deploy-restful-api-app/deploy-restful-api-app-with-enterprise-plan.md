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

1. If you want to run the app locally, complete the steps in the [Expose RESTful APIs](#expose-restful-apis) and [Update the application configuration](#update-the-application-configuration) sections first, and then use the following command to run the sample application with Maven:

   ```bash
   cd ASA-Samples-Restful-Application
   ./mvnw spring-boot:run
   ```

## 3. Prepare the cloud environment

The main resources required to run this sample app are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. Use the following steps to create these resources.

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-enterprise-spring-apps](provision-enterprise-azure-spring-apps.md)]

### 3.3. Prepare the PostgreSQL instance

[!INCLUDE [provision-postgresql-flexible](provision-postgresql.md)]

### 3.4. Connect app instance to PostgreSQL instance

[!INCLUDE [connect-app-instance-to-postgresql](connect-app-instance-to-postgresql.md)]

### 3.5 Expose RESTful APIs

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

### 3.6 Update the application configuration

[!INCLUDE [provision-postgresql-flexible](update-application-configuration.md)]

## 4. Deploy the app to Azure Spring Apps

Now, you can deploy the app to Azure Spring Apps.

[!INCLUDE [deploy-restful-api-app-with-maven-plugin](restful-api-spring-apps-maven-plugin.md)]

   ```output  
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:simple-todo-api-default-15-xxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:N/A       
   [INFO] Getting public url of app(simple-todo-api)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-simple-todo-api.azuremicroservices.io
   ```