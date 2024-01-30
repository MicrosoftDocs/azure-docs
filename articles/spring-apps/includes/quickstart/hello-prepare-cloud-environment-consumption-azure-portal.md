---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/11/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare cloud env (consumption plan) using Azure Portal.

[!INCLUDE [hello-prepare-cloud-environment-consumption-azure-portal](includes/quickstart/hello-prepare-cloud-environment-consumption-azure-portal.md)]

-->

This section uses a **Deploy to Azure** button to launch a deployment experience in the Azure portal. This experience uses an [ARM template](../../../azure-resource-manager/templates/overview.md) to create Azure resources.

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create Azure resources

Use the following steps to create all the Azure resources that the app depends on:

1. Select the following **Deploy to Azure** button to launch the deployment experience in the Azure portal:

   :::image type="content" source="../../../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fspring-guides%2Fgs-spring-boot-for-azure%2Fmain%2Finfra%2Fazuredeploy-asa-consumption.json":::

1. Fill out the form on the **Basics** tab. Use the following table as a guide for completing the form:

   | Setting            | Suggested value                   | Description                                                                                                                                                                 |
   |--------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**   | Your subscription name.           | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource. |
   | **Resource group** | *myresourcegroup*                 | A new resource group name or an existing one from your subscription.                                                                                                        |
   | **Region**         | The region closest to your users. | The region is used to create the resource group.                                                                                                                            |

1. Select **Review and Create** to review your selections. Then, select **Create** to deploy the app to Azure Spring Apps.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/quickstart/custom-deployment-notifications.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the custom deployment notifications pane open." lightbox="../../media/quickstart/custom-deployment-notifications.png":::

