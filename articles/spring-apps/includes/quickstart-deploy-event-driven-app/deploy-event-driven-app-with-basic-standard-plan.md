---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Basic/Standard plan.

[!INCLUDE [deploy-event-driven-app-with-basic-standard-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-with-basic-standard-plan.md)]

-->

## 2 Prepare Spring Project

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [prepare-spring-project-event-driven](../../includes/quickstart-deploy-event-driven-app/prepare-spring-project-event-driven.md)]

## 3 Provision

The main resources you need to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

### 3.1 Sign in to the Azure portal

Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2 Provision an instance of Service Bus

[!INCLUDE [provision-service-bus](../../includes/quickstart-deploy-event-driven-app/provision-service-bus.md)]

### 3.3 Provision an instance of Key Vaults

[!INCLUDE [provision-key-vault](../../includes/quickstart-deploy-event-driven-app/provision-key-vault.md)]

### 3.4 Provision an instance of Azure Spring Apps

1. Select Create a resource (+) in the upper-left corner of the portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/1-create-azure-spring-apps.png" alt-text="The Azure Spring Apps in menu":::

1. Fill out the **Basics** form with the following information:

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/2-create-basics.png" alt-text="Create an Azure Spring Apps service":::

   | Setting        | Suggested Value |Description|
   |----------------|-----------------|----------|
   | Subscription   | Your subscription name |The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.|
   | Resource group | *myresourcegroup* | A new resource group name or an existing one from your subscription.|
   | Name           | *myasa*        |A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.|
   | Plan           | *Basic*        |Pricing Tier determines the resource and cost associated with your instance.|
   | Region         | The region closest to your users | The location that is closest to your users.|
   | Zone Redundant | Unchecked      |Wether to create your Azure Spring Apps service in an Azure availability zone, this could only be supported in several regions at the moment.|

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Selecting **Go to resource** opens the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/3-asa-notifications.png" alt-text="The Notifications pane for Azure Spring Apps Creation":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

1. Select **Apps** in the left navigational menu, select **Create App**.

1. On the **Create App** page, enter `simple-event-driven-app` for **App name**, select *Java 17* for **Runtime platform**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png" alt-text="Screenshot of Azure portal showing basic plan App creation for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/basic-app-creation.png":::

1. Select **Create** to finish creating the Azure Spring Apps instance.

1. After the app creation, select the app name you created in the previous step.

1. On the **Configuration** page, select **Environment variables** tab page, enter `AZURE_KEY_VAULT_ENDPOINT` for **Key**, enter the Key Vault URI for **Value**., then select **Save**

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/app-config-env.png" alt-text="Screenshot of Azure portal showing config env for Azure Spring Apps instance" lightbox="../../media/quickstart-deploy-event-driven-app/app-config-env.png":::

### 3.5 Config Key Vault access policy

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
    azd init --template Azure-Samples/ASA-Samples-Event-Driven-Application
    ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Please enter a new environment name**: Provide an environment name, which will be used as a suffix for the resource group that will be created to hold all Azure resources. This name should be unique within your Azure subscription.

   The console outputs messages similar to the following:

    ```text
    Initializing a new project (azd init)
    
    (✓) Done: Initialized git repository
    (✓) Done: Downloading template code to: D:\samples\event-driven-app
    
    ? Please enter a new environment name: [? for help] (event-driven-app-dev) wingtiptoy
    
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
   - No endpoints were found
   
   SUCCESS: Your application was provisioned and deployed to Azure in xx minutes xx seconds.
   ```

---
