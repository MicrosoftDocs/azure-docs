---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [deployment-event-driven](deployment-event-driven.md)]

-->

This section provides the steps to deploy your application to Azure Spring Apps.

### [Azure portal](#tab/Azure-portal)

The **Deploy to Azure** button in the previous section launches an Azure portal experience that includes application deployment, so nothing else is needed.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to deploy your JAR file with the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps).

1. Navigate to the sample project directory and use the following command to configure the app for Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.18.0:config
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd>.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd>.
   - **Input the app name(simple-event-driven-app)**: Provide an app name. To use the default project artifact ID as the name, press <kbd>Enter</kbd>.
   - **Expose public access for this app (Simple Event Driven App)?**: Press <kbd>n</kbd>.
   - **Confirm to save all the above configurations (Y/n)**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM file.

1. Use the following command to deploy the app:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.18.0:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.

   After the command is executed, you can see the following output, which indicates that the deployment was successful.

   ```output
   [INFO] Deployment(default) is successfully updated.
   [INFO] Deployment Status: Running
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to use AZD to package the app, provision the Azure resources required by the web application, and then deploy to Azure Spring Apps.

1. Use the following command to package a deployable copy of your application:

   ```bash
   azd package
   ```

1. Use the following command to deploy the application code to those newly provisioned resources:

   ```bash
   azd deploy
   ```

   The console outputs messages similar to the following example:

   ```output
   Deploying services (azd deploy)
   
   WARNING: Feature 'springapp' is in alpha stage.
   To learn more about alpha features and their support, visit https://aka.ms/azd-feature-stages.
   
   (✓) Done: Deploying service simple-event-driven-app
   - No endpoints were found
   
   SUCCESS: Your application was deployed to Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

> [!NOTE]
> You can also use `azd up` to combine the previous three commands: `azd provision` (provisions Azure resources), `azd package` (packages a deployable copy of your application), and `azd deploy` (deploys application code). For more information, see [Azure-Samples/ASA-Samples-Event-Driven-Application](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git).

---
