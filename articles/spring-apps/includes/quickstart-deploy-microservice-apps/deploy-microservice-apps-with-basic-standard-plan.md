---
author: karlerickson
ms.author: caiqing
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 02/09/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Basic/Standard plan.

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

-->

### [Azure portal](#tab/Azure-portal)

## Clone and run the sample project locally

Use the following steps to prepare the sample locally.

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone https://github.com/spring-petclinic/spring-petclinic-microservices.git
   git clone https://github.com/spring-petclinic/spring-petclinic-microservices-config.git
   ```

1. Use the following commands to build the sample project:

   ```bash
   cd spring-petclinic-microservices
   ./mvnw clean package -DskipTests
   ```

1. Use the following command to start the Config Server. Be sure to replace the placeholder value with your local git config repository path.
   ```bash
   GIT_REPO=<local path for spring-petclinic-microservices-config>
   java -jar spring-petclinic-config-server/target/spring-petclinic-config-server-3.0.1.jar
   ```

1. Use the following command to start the Discovery Server.
   ```bash
   java -jar spring-petclinic-discovery-server/target/spring-petclinic-discovery-server-3.0.1.jar
   ```

1. Execute the following commands respectively to start other applications.

   ```bash
   java -jar spring-petclinic-customers-service/target/spring-petclinic-customers-service-3.0.1.jar
   java -jar spring-petclinic-vets-service/target/spring-petclinic-vets-service-3.0.1.jar
   java -jar spring-petclinic-visits-service/target/spring-petclinic-visits-service-3.0.1.jar
   java -jar spring-petclinic-api-gateway/target/spring-petclinic-api-gateway-3.0.1.jar
   java -jar spring-petclinic-admin-server/target/spring-petclinic-admin-server-3.0.1.jar
   ```

1. Go to `http://localhost:8080` in your browser to access the PetClinic.

## Prepare the cloud environment

The main resources you need to run this sample is an Azure Spring Apps instance. Use the following steps to create these resources.

### Provision an instance of Azure Spring Apps

1. Sign in to the Azure portal at https://portal.azure.com.

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="../../media/quickstart-template/search-azure-spring-apps-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="../../media/quickstart-template/search-azure-spring-apps-service.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="../../media/quickstart-template/azure-spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted." lightbox="../../media/quickstart-template/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **Service Details**:

        - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
        - **Plan**: Select **Standard** for the **Pricing tier** option.
        - **Region**: Select the region for your service instance.
        - **Zone Redundant**: Select the zone redundant checkout if you want to create your Azure Spring Apps service in an Azure availability zone.

   :::image type="content" source="../../media/quickstart-template/standard-plan-creation.png" alt-text="Screenshot of Azure portal showing standard plan for Azure Spring Apps instance" lightbox="../../media/quickstart-template/standard-plan-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Config Server** in the left navigational menu, on the **Config Server** page, enter *https://github.com/spring-petclinic/spring-petclinic-microservices-config.git* as **URI**, enter *main* as **Label**, select **Validate**.

   :::image type="content" source="../../media/quickstart-template/validate-config-server.png" alt-text="Screenshot of Azure portal showing config server for Azure Spring Apps instance" lightbox="../../media/quickstart-template/validate-config-server.png":::

1. After validation, select **Apply** to finish the Config Server configuration.

## Deploy the app to Azure Spring Apps

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy.

1. Since Azure Spring Apps will use the name of the app as the service name of the built-in eureka service, the Maven plugin for Azure Spring Apps extracts the artifact id in the pom file as the app name by default, so it needs to be consistent with the spring.application.name of each module. Update the artifact id of each submodule to a non `spring-petclinic-` prefix. The detailed changes are as follows:

   - Update the artifact id of the `spring-petclinic-customers-service` module to `customers-service`.
   - Update the artifact id of the `spring-petclinic-vets-service` module to `vets-service`.
   - Update the artifact id of the `spring-petclinic-visits-service` module to `visits-service`.
   - Update the artifact id of the `spring-petclinic-api-gateway` module to `api-gateway`.
   - Update the artifact id of the `spring-petclinic-admin-server` module to `admin-server`.

1. Navigate to the sample project directory and execute the following command to config the apps in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
   - **Select child modules to configure(input numbers separated by comma, eg: [1-2,4,6], ENTER to select ALL)**: Exclude `spring-petclinic-config-server` and `spring-petclinic-discovery-server`, others need to be configured, enter `1,2,3,4,7`.
   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you just created, which defaults to the first subscription in the list. If you use the default number, press Enter directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you just created, If you use the default number, press Enter directly.
   - **Select apps to expose public access:(input numbers separated by comma, eg: [1-2,4,6], ENTER to select NONE)**: Enter `5` for `api-gateway`.
   - **Confirm to save all the above configurations (Y/n)**: Enter *y*. If Enter *n*, the configuration will not be saved in the pom files.

1. Build the sample project by using the following commands. Skip this step if does not update the Maven plugin configuration.

   ```bash
   ./mvnw clean package -DskipTests
   ```

1. Use the following command to deploy each application:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:deploy
   ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.

   After the command is executed, you can finally see a log similar to the following, indicating that all deployments are successful.

   ```text
   [INFO] Deployment(default) is successfully updated.
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:api-gateway-default-xx-xx-xxx  Status:Running Reason:null       DiscoverStatus:UP
   [INFO] Getting public url of app(api-gateway)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Install the [Azure Developer CLI](https://aka.ms/azd-install), version 1.0.

### Initialize the project

Use AZD to initialize the {application type} application from the Azure Developer CLI templates.

1. Open a terminal, create a new empty folder, and change into it.
1. Run the following command to initialize the project.

    ```bash
    azd init --template https://github.com/Azure-Samples/spring-petclinic-microservices.git
    ```

    Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Please enter a new environment name**: Provide an environment name, which will be used as a suffix for the resource group that will be created to hold all Azure resources. This name should be unique within your Azure subscription.

    The console outputs messages similar to the following:

    ```text
    Initializing a new project (azd init)

    (✓) Done: Initialized git repository
    (✓) Done: Downloading template code to: D:\samples\xxx-app
    
      Please enter a new environment name: wingtiptoy
    
      Please enter a new environment name: wingtiptoy
    
    SUCCESS: New project initialized!
    You can view the template code in your directory: D:\samples\xxx-app
    Learn more about running 3rd party code on our DevHub: https://learn.microsoft.com/azure/developer/azure-developer-cli/azd-templates#guidelines-for-using-azd-templates
    ```

## Deploy the app to Azure Spring Apps

Use AZD to package the app, provision the Azure resources required by the {application type} application and then deploy to Azure Spring Apps.

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
> This may take a while to complete as it executes three commands: `azd package` (packages a deployable copy of your application), `azd provision` (provisions Azure resources), and `azd deploy` (deploys application code). You will see a progress indicator as it packages, provisions and deploys your application. See more details from [Azure-Samples/ASA-Samples-XXX-XXX-Application](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application).

---
