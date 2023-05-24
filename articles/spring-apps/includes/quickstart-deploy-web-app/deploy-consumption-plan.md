---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps consumption plan.

[!INCLUDE [deploy-to-azure-spring-apps-conusumption-plan](includes/quickstart-deploy-web-app/deploy-conusumption-plan.md)]

-->

## Prepare the Spring project

Use the following steps to clone and run the app locally.

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
   ```

2. Use the following command to build the sample project:

   ```bash
   cd ASA-Samples-Web-Application
   ./mvnw clean package -DskipTests
   ```

3. Use the following command to run the sample application by Maven:

   ```bash
   java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

4. Go to `http://localhost:8080` in your browser to access the application.

## Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### Create a new resource group

### Create an Azure Spring Apps instance

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/search-azure-spring-apps-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-event-driven-app/search-azure-spring-apps-service.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/azure-spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **Service Details**:

        - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
        - **Plan**: Select **Standard** for the **Pricing tier** option.
        - **Region**: Select the region for your service instance.
        - **Zone Redundant**: Select the zone redundant checkout if you want to create your Azure Spring Apps service in an Azure availability zone.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/standard-plan-creation.png" alt-text="Screenshot of Azure portal showing standard plan for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/standard-plan-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

[!INCLUDE [provision-psql-flexible](includes/quickstart-deploy-web-app/provision-psql.md)]

## Deploy the app to Azure Spring Apps

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy.

1. Navigate to the sample project directory and execute the following command to config the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you just created, which defaults to the first subscription in the list. If you use the default number, press Enter directly.
   - **Select Azure Spring Apps for deployment**: Select the number of the Azure Spring Apps instance you just created, If you use the default number, press Enter directly.
   - **Input the app name**: Provide an app name. If you use the default project artifact id, press Enter directly.
   - **Expose public access for this app (Simple Event Driven App)?**: Enter *n*.
   - **Confirm to save all the above configurations (Y/n)**: Enter *y*. If Enter *n*, the configuration will not be saved in the pom files.

2. Build the sample project by using the following commands:

   ```bash
   ./mvnw clean package -DskipTests
   ```

3. Use the following command to deploy the app:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:deploy
   ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.

   After the command is executed, you can see the following log signs that the deployment was successful.

   ```text
   [INFO] Deployment(default) is successfully updated.
   [INFO] Deployment Status: Running
   ```
