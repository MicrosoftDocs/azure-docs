---
author: karlerickson
ms.author: caiqing
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 02/09/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Standard consumption plan.

[!INCLUDE [deploy-template-with-basic-standard-plan](includes/quickstart-template/deploy-template-with-standard-consumption-plan.md)]

-->

### [Azure portal](#tab/Azure-portal)

## Clone the sample project

Use the following steps to prepare the sample locally.

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone https://github.com/xxx/xxxx.git
   ```

## Prepare the cloud environment

The main resources you need to run this sample is an Azure Spring Apps instance, an Azure {Service 1}, an Azure {Service 2} and an Azure {Service 3} instance. Use the following steps to create these resources.

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

   [**Provide the standard consumption plan creation screenshot here**]

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

### Provision an instance of Azure {Service 1}

1. In the search box, search for *Azure {Service 1}*, and then select **Azure {Service 1}** in the results.

   :::image type="content" source="../../media/quickstart-template/search-service-1.png" alt-text="Screenshot of Azure portal showing {Service 1} in search results, with {Service 1} highlighted in the search bar and in the results." lightbox="../../media/quickstart-template/search-service-1.png":::

1. On the {Service 1} page, select **Create**.

   :::image type="content" source="../../media/quickstart-template/service-1-create.png" alt-text="Screenshot of Azure portal showing {Service 1} page with the Create button highlighted." lightbox="../../media/quickstart-template/service-1-create.png":::

1. Fill out the **Basics** form on the {Service 1} **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **XXX Details**:

        - **xxx**: Create the xxx name for the {Service 1} instance.
        - **xxx**: Select `xxx` type.

   
    [**Provide the {service 1} creation screenshot here**]

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the {Service 1} instance.

1. Select **Go to resource** to go to the **{Service 1}** page.

1. Select **xxx** in the left navigational menu, select **xxx**.

1. On the **xxx** page, do ba la ba la.

   [**Provide the sub function of {service 1} creation screenshot here**]

### Provision an instance of Azure {Service 2}

1. In the search box, search for *Azure {Service 2}*, and then select **Azure {Service 2}** in the results.

   :::image type="content" source="../../media/quickstart-template/search-service-1.png" alt-text="Screenshot of Azure portal showing {Service 1} in search results, with {Service 1} highlighted in the search bar and in the results." lightbox="../../media/quickstart-template/search-service-1.png":::

1. On the {Service 2} page, select **Create**.

   :::image type="content" source="../../media/quickstart-template/service-1-create.png" alt-text="Screenshot of Azure portal showing {Service 1} page with the Create button highlighted." lightbox="../../media/quickstart-template/service-1-create.png":::

1. Fill out the **Basics** form on the {Service 2} **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select an existing resource group or create a new one.

    - **XXX Details**:

        - **xxx**: Create the xxx name for the {Service 2} instance.
        - **xxx**: Select `xxx` type.

    [**Provide the {service 2} creation screenshot here**]

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the {Service 2} instance.

1. Select **Go to resource** to go to the **{Service 2}** page.

1. Select **xxx** in the left navigational menu, select **xxx**.

1. On the **xxx** page, do ba la ba la.

   [**Provide the sub function of {service 2} creation screenshot here**]

## Deploy the app to Azure Spring Apps

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy.

1. Navigate to the sample project directory and execute the following command to config the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you just created, which defaults to the first subscription in the list. If you use the default number, press Enter directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you just created, If you use the default number, press Enter directly.
   - **Input the app name**: Provide an app name. If you use the default project artifact id, press Enter directly.
   - **Expose public access for this app (xxx App)?**: Enter *n*.
   - **Confirm to save all the above configurations (Y/n)**: Enter *y*. If Enter *n*, the configuration will not be saved in the pom files.

1. Update the configuration file if needed. 

1. Build the sample project by using the following commands. Skip this step if does not update the code and configuration files.

   ```bash
   cd ASA-Samples-xxx-xxx-Application
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

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Install the [Azure Developer CLI](https://aka.ms/azd-install), version 1.0.

### Initialize the project

Use AZD to initialize the {application type} application from the Azure Developer CLI templates.

1. Open a terminal, create a new empty folder, and change into it.
1. Run the following command to initialize the project.

    ```bash
    azd init --template https://github.com/xxx/xxx-Application/
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
