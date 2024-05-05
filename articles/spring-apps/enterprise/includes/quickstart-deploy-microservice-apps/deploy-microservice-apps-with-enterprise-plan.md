---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 02/01/2024
---

<!--
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Enterprise plan.

[!INCLUDE [deploy-microservice-apps-with-enterprise-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the next section launches an Azure portal experience that downloads a JAR package from the [ASA-Samples-Web-Application releases](https://github.com/Azure-Samples/ASA-Samples-Web-Application/releases) page on GitHub. No local preparation steps are needed.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

[!INCLUDE [prepare-spring-project-for-enterprise-plan](prepare-spring-project-enterprise-plan.md)]

### [Azure CLI](#tab/Azure-CLI-ent)

[!INCLUDE [prepare-spring-project-for-enterprise-plan](prepare-spring-project-enterprise-plan.md)]

---

## 3. Prepare the cloud environment

The main resource you need to run this sample is an Azure Spring Apps instance. This section describes how to create this resource.

### [Azure portal](#tab/Azure-portal-ent)

This section uses a **Deploy to Azure** button to launch a deployment experience in the Azure portal. This experience uses an [ARM template](../../../../azure-resource-manager/templates/overview.md) to create Azure resources.

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create Azure resources

Use the following steps to create all the Azure resources that the app depends on:

1. Select the following **Deploy to Azure** button to launch the deployment experience in the Azure portal:

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fspring-petclinic-microservices%2Fazure%2Finfra%2Fazuredeploy.json":::

1. Fill out the form on the **Basics** tab. Use the following table as a guide for completing the form:

   | Setting            | Suggested value                   | Description                                                                                                                                                                 |
   |--------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**   | Your subscription name.           | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource. |
   | **Resource group** | *myresourcegroup*                 | A new resource group name or an existing one from your subscription.                                                                                                        |
   | **Region**         | The region closest to your users. | The region is used to create the resource group.                                                                                                                            |

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/custom-deployment-microservice.png" alt-text="Screenshot of the Azure portal that shows the Custom deployment page." lightbox="../../media/quickstart-deploy-microservice-apps/custom-deployment-microservice.png":::

1. Select **Review and Create** to review your selections. Then, select **Create** to deploy the app to Azure Spring Apps.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/custom-deployment-notifications.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the custom deployment notifications pane open." lightbox="../../media/quickstart-deploy-microservice-apps/custom-deployment-notifications.png":::

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

[!INCLUDE [provision-enterprise-azure-spring-apps](provision-enterprise-azure-spring-apps.md)]

### [Azure CLI](#tab/Azure-CLI-ent)

[!INCLUDE [provision-enterprise-azure-spring-apps-azure-cli](provision-enterprise-azure-spring-apps-azure-cli.md)]

---

## 4. Deploy the apps to Azure Spring Apps

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the previous section launches an Azure portal experience that includes application deployment, so nothing else is needed.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

[!INCLUDE [microservice-spring-apps-maven-plugin](microservice-spring-apps-maven-plugin.md)]

2. Use the following command to deploy the backend applications:

   ```bash
   ./mvnw azure-spring-apps:deploy
   ```

   After the command runs, you can see from the following log messages that the deployment was successful:

   ```output
   [INFO] Start deploying artifact(customers-service-3.0.1.jar) to deployment(default) of app(customers-service)...
   [INFO] Artifact(customers-service-3.0.1.jar) is successfully deployed to deployment(default) of app(customers-service).
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running

   ...

   [INFO] Start deploying artifact(vets-service-3.0.1.jar) to deployment(default) of app(vets-service)...
   [INFO] Artifact(vets-service-3.0.1.jar) is successfully deployed to deployment(default) of app(vets-service).
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running

   ...

   [INFO] Start deploying artifact(visits-service-3.0.1.jar) to deployment(default) of app(visits-service)...
   [INFO] Artifact(visits-service-3.0.1.jar) is successfully deployed to deployment(default) of app(visits-service).
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running
   ```

1. The Azure portal doesn't support deploying the frontend applications, so use the following Azure CLI command to deploy the frontend application:

   ```azurecli
   az spring app deploy \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS_NAME} \
       --name ${APP_FRONTEND} \
       --source-path spring-petclinic-frontend \
       --build-env BP_WEB_SERVER=nginx
   ```

   After the command runs, you can see from the following log messages that the deployment was successful:

   ```output
   [5/5] Updating deployment in app "frontend" (this operation can take a while to complete)
   Azure Spring Apps will use rolling upgrade to update your deployment, you have 1 instance, Azure Spring Apps will update the deployment in 1 round.
   The deployment is in round 1, 1 old instance is deleted/deleting and 1 new instance is started/starting
   Your application is successfully deployed.
   ```

### [Azure CLI](#tab/Azure-CLI-ent)

[!INCLUDE [deploy-microservice-apps-azure-cli](deploy-microservice-apps-azure-cli.md)]

---
