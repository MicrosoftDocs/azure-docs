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

[!INCLUDE [deploy-app-with-basic-standard-plan](includes/quickstart/deploy-app-with-basic-standard-plan.md)]

-->

## 2 Prepare Spring Project

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [prepare-spring-project](../../includes/quickstart/prepare-spring-project.md)]

## 3 Provision

The main resources you need to run this sample is an Azure Spring Apps instance . Use the following steps to create these resources.

### 3.1 Sign in to the Azure portal

Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2 Provision an instance of Azure Spring Apps

[!INCLUDE [provision-spring-apps](../../includes/quickstart/provision-basic-azure-spring-apps.md)]

## 4 Deployment

Use the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy.

1. Navigate to the `complete` directory and execute the following command to config the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config
   ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you just created, which defaults to the first subscription in the list. If you use the default number, press Enter directly.
    - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you just created, If you use the default number, press Enter directly.
    - **Input the app name**: Provide an app name. If you use the default project artifact id, press Enter directly.
    - **Expose public access for this app (boot-for-azure)?**: Enter *y*.
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
   [INFO]   InstanceName:demo-default-x-xxxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:UNREGISTERED
   [INFO] Getting public url of app(demo)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Install the [Azure Developer CLI](https://aka.ms/azd-install), version 1.0.0.

Use AZD to initialize the application from the Azure Developer CLI templates.

1. Open a terminal, create a new empty folder, and change into it.
1. Run the following command to initialize the project.

    ```bash
    azd init --template spring-guides/gs-spring-boot-for-azure
    ```

   Command interaction description:
    - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
    - **Please enter a new environment name**: Provide an environment name, which will be used as a suffix for the resource group that will be created to hold all Azure resources. This name should be unique within your Azure subscription.

   The console outputs messages similar to the following:

    ```text
    Initializing a new project (azd init)
    
    (✓) Done: Initialized git repository
    (✓) Done: Downloading template code to: D:\samples\app
    
    ? Please enter a new environment name: [? for help] (app-dev) demo
    
    ? Please enter a new environment name: demo
    
    SUCCESS: New project initialized!
    You can view the template code in your directory: D:\samples\app
    Learn more about running 3rd party code on our DevHub: https://aka.ms/azd-third-party-code-notice
    ```

## 2 Provision

Use AZD to provision the Azure resources required by the application.

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
   > This may take a while to complete. You will see a progress indicator as it provisions Azure resources. See more details from [spring-guides/gs-spring-boot-for-azure](https://github.com/spring-guides/gs-spring-boot-for-azure).

## 3 Deployment

Use AZD to package the app, provision the Azure resources required by the application and then deploy to Azure Spring Apps.

1. Run the following command to provision the template's infrastructure to Azure.

   ```bash
   azd up
   ```

   The console outputs messages similar to the following:

   ```text
   Deploying services (azd deploy)
   
   WARNING: Feature 'springapp' is in alpha stage.
   To learn more about alpha features and their support, visit https://aka.ms/azd-feature-stages.
   
   (✓) Done: Deploying service boot-for-azure
   - Endpoint: https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io/
   
   
   SUCCESS: Your application was provisioned and deployed to Azure in xx minutes xx seconds.
   ```

---
