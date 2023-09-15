---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 9/15/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Enterprise plan.

[!INCLUDE [deploy-microservice-apps-with-enterprise-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

This section isn't required to prepare the jar package for deployment, the Deploy to azure button process downloads the jar from [GitHub release](https://github.com/Azure-Samples/spring-petclinic-microservices/releases).

## 3. Prepare the cloud environment

The main resource you need to run this sample is an Azure Spring Apps instance. Use the following steps to create this resource.

Use [ARM template](../../../azure-resource-manager/templates/overview.md) to create Azure resources.

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create Azure resources

Use the following steps to create all the Azure resources that the app depends on:

1. Select the following **Deploy to Azure** button:

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fspring-petclinic-microservices%2Fazure%2Finfra%2Fazuredeploy.json)

1. Fill out the **Basics** form with the following information:

   | Setting         | Suggested Value                  | Description                                                                                                                                                                                                                                                                                        |
   -----------------|----------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Subscription               | Your subscription name           | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                          |
   | Resource group             | *myresourcegroup*                | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                                  |
   | Region                     | The region closest to your users | The region is used to create the resource group.                                                                                                                                                                                                                                                           |

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/custom-deployment-microservice.png" alt-text="Screenshot of the Azure portal showing the custom deployment for microservice." lightbox="../../media/quickstart-deploy-microservice-apps/custom-deployment-microservice.png":::

1. Select **Review and Create** to review your selections. Select **Create** to deploy the app to Azure Spring Apps.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/custom-deployment-notifications.png" alt-text="Screenshot of the Azure portal showing the Overview page with the custom deployment notifications pane open." lightbox="../../media/quickstart-deploy-microservice-apps/custom-deployment-notifications.png":::

## 4. Deploy the apps to Azure Spring Apps

The application deployment step has been integrated in the process of the `Deploy to Azure` button, which has been completed in the previous step.
