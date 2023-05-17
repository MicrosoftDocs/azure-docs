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

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/search-azure-spring-apps-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-microservice-apps/search-azure-spring-apps-service.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted." lightbox="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **Service Details**:

        - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
        - **Plan**: Select **Standard** for the **Pricing tier** option.
        - **Region**: Select the region for your service instance.
        - **Zone Redundant**: Select the zone redundant checkout if you want to create your Azure Spring Apps service in an Azure availability zone.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/standard-plan-creation.png" alt-text="Screenshot of Azure portal showing standard plan for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-microservice-apps/standard-plan-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Config Server** in the left navigational menu, on the **Config Server** page, enter *https://github.com/spring-petclinic/spring-petclinic-microservices-config.git* as **URI**, enter *main* as **Label**, select **Validate**.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/validate-config-server.png" alt-text="Screenshot of Azure portal showing config server for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-microservice-apps/validate-config-server.png":::

1. After validation, select **Apply** to finish the Config Server configuration.

## Deploy the app to Azure Spring Apps

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy.

1. Since Azure Spring Apps uses the name of the app as the service name of the built-in eureka service, the Maven plugin for Azure Spring Apps extracts the artifact ID in the POM file as the app name by default, so it needs to be consistent with the `spring.application.name` of each module. Update the artifact id of each submodule to a non `spring-petclinic-` prefix. The detailed changes are as follows:

   - Update the artifact ID `spring-petclinic-customers-service` to `customers-service`.
   - Update the artifact ID `spring-petclinic-vets-service` to `vets-service`.
   - Update the artifact ID `spring-petclinic-visits-service` to `visits-service`.
   - Update the artifact ID `spring-petclinic-api-gateway` to `api-gateway`.
   - Update the artifact ID `spring-petclinic-admin-server` to `admin-server`.

1. Navigate to the sample project directory and execute the following command to config the apps in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
   - **Select child modules to configure(input numbers separated by comma, eg: [1-2,4,6], ENTER to select ALL)**: Exclude `spring-petclinic-config-server` and `spring-petclinic-discovery-server`, others need to be configured, enter `1,2,3,4,7`.
   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press Enter directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press Enter directly.
   - **Select apps to expose public access:(input numbers separated by comma, eg: [1-2,4,6], ENTER to select NONE)**: Enter `5` for `api-gateway`.
   - **Confirm to save all the above configurations (Y/n)**: Enter *y*. If Enter *n*, the configuration won't be saved in the POM files.

1. Build the sample project by using the following commands. Skip this step if doesn't update the Maven plugin configuration.

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
