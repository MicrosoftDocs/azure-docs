---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
To reuse the Service Bus instance creation steps in other articles, a separate markdown file is used to describe how to provision Service Bus instance.

[!INCLUDE [provision-service-bus](provision-service-bus.md)]

-->
Use the following steps to create a Service Bus instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. In the **Search services and marketplace** search box, search for *service bus*.

1. On the **Service Bus** section, select **Create**.

1. Fill out the form on the **Basics** tab. Use the following table as a guide for completing the form:

   | Setting                       | Suggested value                     | Description                                                                                                                                                                 |
   |-------------------------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**              | Your subscription name.             | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource. |
   | **Resource group**            | *myresourcegroup*                   | A new resource group name or an existing one from your subscription.                                                                                                        |
   | **Namespace name**            | *my-srvbus*                         | A unique name that identifies your Service Bus service.                                                                                                                     |
   | **Location**                  | The location closest to your users. | The location that is closest to your users.                                                                                                                                 |
   | **Hosting options and plans** | **Basic**                           | The pricing plan determines the resource and cost associated with your instance.                                                                                            |

1. Select **Review and Create** to review the creation parameters. Then, select **Create** to finish creating the Service Bus instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/service-bus-notifications.png" alt-text="Screenshot of the Azure portal that shows the Notifications pane of the Deployment Overview page." lightbox="../../media/quickstart-deploy-event-driven-app/service-bus-notifications.png":::

1. Select **Go to resource** to go to the **Service Bus Namespace** page.
