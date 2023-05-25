---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with standard plan.

[!INCLUDE [deploy-to-azure-spring-apps-standard-plan](includes/quickstart-deploy-web-app/deploy-standard-plan.md)]

-->

## Prepare the Spring project

#### [Azure portal](#tab/Azure-portal)

Use the following steps to clone and run the app locally.

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
   ```

1. Use the following command to build the sample project:

   ```bash
   cd ASA-Samples-Web-Application
   ./mvnw clean package
   ```

1. Use the following command to run the sample application by Maven:

   ```bash
   java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

1. Go to `http://localhost:8080` in your browser to access the application.

#### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Install the [Azure Developer CLI](https://aka.ms/azd-install), version 1.0.

Use AZD to initialize the web application from the Azure Developer CLI templates.

1. Open a terminal, create a new empty folder, and change directory to it.
2. Run the following command to initialize the project.

    ```bash
    azd init --template https://github.com/Azure-Samples/ASA-Samples-Web-Application
    ```

    Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Please enter a new environment name**: Provide an environment name, which will be used as a suffix for the resource group that will be created to hold all Azure resources. This name should be unique within your Azure subscription.

    The console outputs messages similar to the following:

    ```text
    Initializing a new project (azd init)
    (✓) Done: Initialized git repository
    (✓) Done: Downloading template code to: D:\samples\event-driven-app
    
      Please enter a new environment name: wingtiptoy
    
      Please enter a new environment name: wingtiptoy
    
    SUCCESS: New project initialized!
    You can view the template code in your directory: D:\samples\event-driven-app
    Learn more about running 3rd party code on our DevHub: https://learn.microsoft.com/azure/developer/azure-developer-cli/azd-templates#guidelines-for-using-azd-templates
    ```

---

## Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

#### [Azure portal](#tab/Azure-portal)

### Create a new resource group

### Create an Azure Spring Apps instance

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="../../media/quickstart-deploy-web-app/search-azure-spring-apps-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-web-app/search-azure-spring-apps-service.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-web-app/azure-spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted." lightbox="../../media/quickstart-deploy-web-app/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **Service Details**:

        - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
        - **Plan**: Select **Standard** for the **Pricing tier** option.
        - **Region**: Select the region for your service instance.
        - **Zone Redundant**: Select the zone redundant checkout if you want to create your Azure Spring Apps service in an Azure availability zone.

   :::image type="content" source="../../media/quickstart-deploy-web-app/standard-plan-creation.png" alt-text="Screenshot of Azure portal showing standard plan for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-web-app/standard-plan-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

[!INCLUDE [provision-psql-flexible](./provision-psql.md)]

#### [Azure Developer CLI](#tab/Azure-Developer-CLI)

No extra action needs to take at this step.

---

## Deploy the app to Azure Spring Apps

#### [Azure portal](#tab/Azure-portal)

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

1. Build the sample project by using the following commands:

   ```bash
   ./mvnw clean package -DskipTests
   ```

1. Use the following command to deploy the app:

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

#### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use AZD to package the app, provision the Azure resources required by the web application and then deploy to Azure Spring Apps.

1. Run the following command to log in Azure with OAuth2, ignore this step if you have already logged in.

   ```bash
   azd auth login
   ```

1. Run the following command to package a deployable copy of your application, provision the template's infrastructure to Azure and also deploy the application code to those newly provisioned resources.

   ```bash
   azd up
   ```

   Command interaction description:
   - **Please select an Azure Subscription to use**: Use arrows to move, type to filter, then press Enter.
   - **Please select an Azure location to use**: Use arrows to move, type to filter, then press Enter.

   > [!NOTE]
   > 1. This template may only be used with the following Azure locations:
   >    - Australia East
   >    - Brazil South
   >    - Canada Central
   >    - Central US
   >    - East Asia
   >    - East US
   >    - East US 2
   >    - Germany West Central
   >    - Japan East
   >    - Korea Central
   >    - North Central US
   >    - North Europe
   >    - South Central US
   >    - UK South
   >    - West Europe
   >    - West US
   >
   >    If you attempt to use the template with an unsupported region, the provision step will fail.
   >
   > 2. The `Basic` plan of Azure Spring Apps is used by default. If you want to use the `Standard` plan,
   >    you can update the SKU information of the *asaInstance* resource in the bicep script *infra/modules/springapps/springapps.bicep* to the following:
   >
   >    ```text
   >    sku: {
   >      name: 'S0'
   >      tier: 'Standard'
   >    }
   >    ```

   The console outputs messages similar to the following:

   ```text
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group rg-<your-environment-name>-<a-random-string> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<>your-subscription-id/resourceGroups/rg-<your-environment-name>-<a-random-string>/overview
   ```

> [!NOTE]
> This may take a while to complete as it executes three commands: `azd package` (packages a deployable copy of your application), `azd provision` (provisions Azure resources), and `azd deploy` (deploys application code). You will see a progress indicator as it packages, provisions and deploys your application. See more details from [Azure-Samples/ASA-Samples-Web-Application](https://github.com/Azure-Samples/ASA-Samples-Web-Application).

---
