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
