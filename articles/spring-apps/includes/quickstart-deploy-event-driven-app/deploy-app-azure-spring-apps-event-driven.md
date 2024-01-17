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

### [Azure portal](#tab/Azure-portal)

The **Deploy to Azure** button in the previous section launches an Azure portal experience that includes application deployment, so nothing else is needed.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

[!INCLUDE [event-driven-spring-apps-maven-plugin](event-driven-spring-apps-maven-plugin.md)]

2. Use the following command to deploy the app:

   ```bash
   ./mvnw azure-spring-apps:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.

   After the command is executed, you can see from the following log messages that the deployment was successful:

   ```output 
   [INFO] Deployment(default) is successfully created
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running
   ```

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following steps to use AZD to package the app, provision the Azure resources required by the web application, and then deploy to Azure Spring Apps.

1. Use the following command to package a deployable copy of your application:

   ```bash
   azd package
   ```

   The console outputs messages similar to the following example:

   ```output
   SUCCESS: Your application was packaged for Azure in xx seconds.
   ```

1. Use the following command to deploy the application code to those newly provisioned resources:

   ```bash
   azd deploy
   ```

   The console outputs messages similar to the following example:

   ```output
   Deploying services (azd deploy)
   
   (✓) Done: Deploying service simple-event-driven-app
   - No endpoints were found
   
   SUCCESS: Your application was deployed to Azure in xx minutes xx seconds.
   You can view the resources created under the resource group rg-<your-environment-name> in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-subscription-id>/resourceGroups/rg-<your-environment-name>/overview
   ```

> [!NOTE]
> You can also use `azd up` to combine the previous three commands: `azd provision` (provisions Azure resources), `azd package` (packages a deployable copy of your application), and `azd deploy` (deploys application code). For more information, see [Azure-Samples/ASA-Samples-Event-Driven-Application](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git).

---
