---
author: karlerickson
ms.author: v-muyaofeng
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/31/2023
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to provision Spring Apps instance.

[!INCLUDE [provision-spring-apps](../../includes/quickstart/provision-consumption-azure-spring-apps.md)]

-->

Use the following steps to create an Azure Spring Apps service instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart/create-azure-spring-apps.png" alt-text="Screenshot of the Azure portal that shows Azure Spring Apps in the list of compute resources." lightbox="../../media/quickstart/create-azure-spring-apps.png":::

1. Fill out the **Basics** form with the following information.

   Use the following table as a guide for completing the form. The recommended **Plan** is `Standard consumption & dedicated (preview)`.

   | Setting                    | Suggested value                                | Description                                                                                                                                                                                                                                                                                        |
   |----------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Subscription               | Your subscription name                         | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                       |
   | Resource group             | *myresourcegroup*                              | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | Name                       | *myasa*                                        | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | Plan                       | **Standard consumption & dedicated (preview)** | The pricing plan determines the resource and cost associated with your instance.                                                                                                                                                                                                                   |
   | Region                     | The region closest to your users               | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | Container Apps Environment | *myacaenv*                                     | The environment is a secure boundary around one or more container apps that can communicate with each other and share a virtual network, logging, and Dapr configuration.                                                                                                                          |

   :::image type="content" source="../../media/quickstart/create-consumption.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Spring Apps page." lightbox="../../media/quickstart/create-consumption.png":::

1. (Optional) Create a Container Apps Environment.

   [!INCLUDE [prepare-container-apps-environment](prepare-container-apps-environment.md)]

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page.

   :::image type="content" source="../../media/quickstart/notifications.png" alt-text="Screenshot of the Azure portal that shows the Notifications pane for Azure Spring Apps creation." lightbox="../../media/quickstart/notifications.png":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.
