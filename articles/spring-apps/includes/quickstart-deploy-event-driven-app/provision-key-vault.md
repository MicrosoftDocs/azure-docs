---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
To reuse the Key Vault instance creation steps in other articles, a separate markdown file is used to describe how to provision Key Vault instance.

[!INCLUDE [provision-key-vault](../../includes/quickstart-deploy-event-driven-app/provision-key-vault.md)]

-->

Use the following steps to create a Key Vault instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. In the **Search services and marketplace** search box, search for *key vault*.

1. On the **Key Vault** section, select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/search-key-vault-service.png" alt-text="Screenshot of the Azure portal showing the Marketplace search results with Key Vault highlighted." lightbox="../../media/quickstart-deploy-event-driven-app/search-key-vault-service.png":::

1. Fill out the **Basics** form with the following information:

   | Setting        | Suggested value                  | Description                                                                                                                                                                  |
   |----------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Subscription   | Your subscription name           | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource. |
   | Resource group | *myresourcegroup*                | A new resource group name or an existing one from your subscription.                                                                                                         |
   | Key vault name | *mykeyvault*                     | A unique name that identifies your Key Vault service instance.                                                                                                               |
   | Region         | The region closest to your users | The location that is closest to your users.                                                                                                                                  |
   | Pricing tier   | *Standard*                       | Pricing Tier determines the resource and cost associated with your instance.                                                                                                 |

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-creation-basic.png" alt-text="Screenshot of the Azure portal showing the Basics tab of the Create a key vault page." lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-creation-basic.png":::

1. Navigate to the **Access configuration** tab on the **Create a key vault** page, then select **Vault access policy** for **Permission model**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-creation-access-configuration.png" alt-text="Screenshot of the Azure portal showing the Create a key vault page with the Vault access policy option selected." lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-creation-access-configuration.png":::

1. Select **Review and Create** to review your selections. Select **Create** to provision the key vault.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

1. Copy the **Vault URI** value and save it for later use.

1. Select **Secrets** on the navigation menu, then select **Generate/Import**.

1. On the **Create a secret** page, enter *SERVICE-BUS-CONNECTION-STRING* for **Name**, paste the Service Bus connection string for **Secret value**, and then select **Create**.

   :::image type="content" source="../../media/quickstart-deploy-event-driven-app/key-vault-add-secret.png" alt-text="Screenshot of the Azure portal showing the Create a secret page." lightbox="../../media/quickstart-deploy-event-driven-app/key-vault-add-secret.png":::
