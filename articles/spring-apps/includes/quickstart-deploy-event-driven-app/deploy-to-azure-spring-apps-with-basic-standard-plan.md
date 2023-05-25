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

[!INCLUDE [deploy-to-azure-spring-apps-with-basic-standard-plan](includes/quickstart-deploy-event-driven-app/deploy-to-azure-spring-apps-with-basic-standard-plan.md)]

-->

## 2 Prepare Spring Project

### [Azure portal](#tab/Azure-portal)

Use the following steps to prepare the sample locally.

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
   ```

1. Build the sample project by using the following commands:

   ```bash
   cd ASA-Samples-Event-Driven-Application
   ./mvnw clean package -DskipTests
   ```

## 3 Provision

The main resources you need to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

### 3.1 Provision an instance of Service Bus

1. In the search box, search for *Service Bus*, and then select **Service Bus** in the results.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/search-service-bus-service.png" alt-text="Screenshot of Azure portal showing Service Bus in search results, with Service Bus highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-event-driven-app/search-service-bus-service.png":::

1. On the Service Bus page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/service-bus-create.png" alt-text="Screenshot of Azure portal showing Service Bus page with the Create button highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/service-bus-create.png":::

1. Fill out the **Basics** form on the Service Bus **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Create a new one, such as: `rg-wingtiptoy`.

    - **Instance Details**:

        - **Namespace Name**: Create the namespace name for the Service Bus instance.
        - **Location**: Select the location for your service instance.
        - **Pricing tier**: Select `Basic` tier.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/service-bus-creation.png" alt-text="Screenshot of Azure portal showing Service Bus creation" lightbox="../../media/quickstart-deploy-event-driven-app/service-bus-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Service Bus instance.

1. Select **Go to resource** to go to the **Service Bus Namespace** page.

1. Select **Shared access policies** in the left navigational menu, select **RootManageSharedAccessKey**.

1. On the **SAS Policy: RootManageSharedAccessKey** page, copy and save the **Primary Connection String**, which is used to set up connections from the Spring app.

1. Select **Queues** in the left navigational menu, select **Queue**.

1. On the **Create Queue** page, enter `lower-case` as **Name**, select **Create**.

1. Repeat the previous step, enter `upper-case` as **Name**, select **Create**.

### 3.2 Provision an instance of Key Vaults

1. In the search box, search for *Key vaults*, and then select **Key vaults** in the results.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/search-key-vaults.png" alt-text="Screenshot of Azure portal showing Key vaults in search results, with Key vaults highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-event-driven-app/search-key-vaults.png":::

1. On the Key vaults page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-create.png" alt-text="Screenshot of Azure portal showing Key Vault page with the Create button highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-create.png":::

1. Fill out the **Basics** form on the Service Bus **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select the resource group you just created.

    - **Instance Details**:

        - **Key vault name**: Create the name for the Key Vault instance.
        - **Region**: Select the region for your service instance.
        - **Pricing tier**: Select `Standard` tier.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-creation-basic.png" alt-text="Screenshot of Azure portal showing Key Vault creation for basic tab" lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-creation-basic.png":::

1. Navigate to the tab **Access configuration** on the key vault **Create** page, select `Vault access policy` for **Permission model**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-creation-access-configuration.png" alt-text="Screenshot of Azure portal showing Key Vault creation for Access configuration tab" lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-creation-access-configuration.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Key Vault instance.

1. Select **Go to resource** to go to the **Key Vault Overview** page.

1. Copy **Vault URI** and save it for later use.

1. Select **Secrets** in the left navigational menu, select **Generate/Import**.

1. On the **Create a secret** page, enter `SERVICE-BUS-CONNECTION-STRING` for **Name**, paste the connection string of Service Bus for **Secret value**, then select **Create**.

### 3.3 Provision an instance of Azure Spring Apps

1. Sign in to the Azure portal at https://portal.azure.com.

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/search-azure-spring-apps-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-event-driven-app/search-azure-spring-apps-service.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/azure-spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

    - **Project Details**:

        - **Subscription**: Select the subscription you want to be billed for this resource.
        - **Resource group**: Select the resource group you just created.

    - **Service Details**:

        - **Name**: Create the name for the Azure Spring Apps instance.
        - **Plan**: Select **Basic** for the **Pricing tier** option.
        - **Region**: Select the region for your service instance.
        - **Zone Redundant**: Select the zone redundant checkout if you want to create your Azure Spring Apps service in an Azure availability zone.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/basic-plan-creation.png" alt-text="Screenshot of Azure portal showing basic plan for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/basic-plan-creation.png":::

1. Select **Review and Create** to review the creation parameters, then select **Create** to finish creating the Azure Spring Apps instance.

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Apps** in the left navigational menu, select **Create App**.

1. On the **Create App** page, enter `simple-event-driven-app` for **App name**, select *Java 17* for **Runtime platform**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png" alt-text="Screenshot of Azure portal showing basic plan App creation for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png":::

1. Select **Create** to finish creating the Azure Spring Apps instance.

1. After the app creation, select the app name you created in the previous step.

1. On the **Configuration** page, select **Environment variables** tab page, enter `AZURE_KEY_VAULT_ENDPOINT` for **Key**, enter the Key Vault URI for **Value**., then select **Save**

### 3.4 Config Key Vault access policy

1. Go to the Azure Spring Apps instance overview page.

1. Select **Apps** in the left navigational menu, select the app name you created in the previous step.

1. On the **App Overview** page, select **Identity** in the left navigational menu, select the **on** state switch, then select **Save**, and continue to select **Yes** when prompt `Enable system assigned managed identity`.

1. Go to the Key vault instance overview page.

1. Select **Access policies** in the left navigational menu, select **Create**.

1. On the **Create an access policy** page, select **Get** and **List** for **Secret permissions**, select **Next**.

1. On the search box, enter your Azure Spring Apps instance name, you can see the below similar search result:

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/create-access-policy-app.png" alt-text="Screenshot of Azure portal showing access policy creation" lightbox="../../media/quickstart-deploy-event-driven-app/create-access-policy-app.png":::

1. select the principal of your Azure Spring Apps instance, select **Next**, and select **Next** to review the creation parameters, then select **Create** to finish creating the access policy.

## 4 Deployment

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
    - **Expose public access for this app (Simple Event Driven App)?**: Enter *n*.
    - **Confirm to save all the above configurations (Y/n)**: Enter `y`. If Enter `n`, the configuration will not be saved in the pom files.

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

Install the [Azure Developer CLI](https://aka.ms/azd-install), version 1.0.0.

Use AZD to initialize the event-driven application from the Azure Developer CLI templates.

1. Open a terminal, create a new empty folder, and change into it.
1. Run the following command to initialize the project.

    ```bash
    azd init --template https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application/
    ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Please enter a new environment name**: Provide an environment name, which will be used as a suffix for the resource group that will be created to hold all Azure resources. This name should be unique within your Azure subscription.

   The console outputs messages similar to the following:

    ```text
    Initializing a new project (azd init)
    
    (✓) Done: Initialized git repository
    (✓) Done: Downloading template code to: D:\samples\event-driven-may24
    
    ? Please enter a new environment name: [? for help] (event-driven-app) wingtiptoy
    
    ? Please enter a new environment name: wingtiptoy
    
    SUCCESS: New project initialized!
    You can view the template code in your directory: D:\samples\event-driven-app
    Learn more about running 3rd party code on our DevHub: https://aka.ms/azd-third-party-code-notice
    ```

## 2 Provision

Use AZD to provision the Azure resources required by the event-driven application.

1. Run the following command to log in Azure with OAuth2, ignore this step if you have already logged in.

   ```bash
   azd auth login
   ```

1. Run the following command to enable Azure Spring Apps feature.

   ```bash
   azd config set alpha.springapp on
   ```

1. Run the following command to package a deployable copy of your application, provision the template's infrastructure to Azure and also deploy the application code to those newly provisioned resources.

   ```bash
   azd provision
   ```

   Command interaction description:

    - **Please select an Azure Subscription to use**: Use arrows to move, type to filter, then press Enter.
    - **Please select an Azure location to use**: Use arrows to move, type to filter, then press Enter.

   The console outputs messages similar to the following:

   ```text
   SUCCESS: Your application was provisioned in Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name>-<random-string>> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>/overview
   ```

   > [!NOTE]
   > This may take a while to complete. You will see a progress indicator as it provisions Azure resources. See more details from [Azure-Samples/ASA-Samples-Event-Driven-Application](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application).

## 3 Deployment

Use AZD to package the app, provision the Azure resources required by the event-driven application and then deploy to Azure Spring Apps.

1. Run the following command to provision the template's infrastructure to Azure.

   ```bash
   azd up
   ```

   The console outputs messages similar to the following:

   ```text
   Deploying services (azd deploy)
   
   WARNING: Feature 'springapp' is in alpha stage.
   To learn more about alpha features and their support, visit https://aka.ms/azd-feature-stages.
   
   (✓) Done: Deploying service simple-event-driven-app
   - Endpoint: https://<your-Azure-Spring-Apps-instance-name>-simple-event-driven-app.azuremicroservices.io/
   
   
   SUCCESS: Your application was provisioned and deployed to Azure in xx minutes xx seconds.
   ```

---
