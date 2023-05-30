---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to provision Spring Apps instance.

[!INCLUDE [provision-spring-apps](../../includes/quickstart/provision-enterprise-azure-spring-apps.md)]

-->
1. Select Create a resource (+) in the upper-left corner of the portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart/1-create-azure-spring-apps.png" alt-text="The Azure Spring Apps in menu":::

1. Fill out the **Basics** form with the following information:

   :::image type="content" source="../../media/quickstart/2-create-enterprise-basics.png" alt-text="Create an Azure Spring Apps service":::

   | Setting        |Suggested Value|Description|
----------------|----------------|---------------|-----------|
   | Subscription   |Your subscription name|The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.|
   | Resource group |*myresourcegroup*| A new resource group name or an existing one from your subscription.|
   | Name           |*myasa*|A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.|
   | Plan           |*Enterprise* |Pricing Tier determines the resource and cost associated with your instance.|
   | Region         |The region closest to your users| The location that is closest to your users.|
   | Zone Redundant |Unchecked |Whether to create your Azure Spring Apps service in an Azure availability zone, this could only be supported in several regions at the moment.|
   | Software IP plan |Pay-as-You-Go|Pay as you go with Azure Spring Apps.|
   | Terms          |Checked |It's required to select the agreement checkbox associated with [Marketplace offering](https://aka.ms/ascmpoffer).|

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Selecting **Go to resource** opens the service's **Overview** page.

   :::image type="content" source="../../media/quickstart/3-asa-notifications.png" alt-text="The Notifications pane for Azure Spring Apps Creation":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.
