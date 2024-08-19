---
author: flang-msft

ms.service: azure-cache-redis
ms.topic: include
ms.date: 08/16/2024
ms.author: franlanglois
ms.topic: include
---

### Enable Microsoft Entra ID authentication on your cache

If you have a cache already, you first want to check to see if Microsoft Entra Authentication has been enabled. If not, then enable it. We recommend using Microsoft Entra ID for your applications.

1. In the Azure portal, select the Azure Cache for Redis instance where you'd like to use Microsoft Entra token-based authentication.

1. Select **Authentication** from the Resource menu.

1. Check in the working pane to see if **Enable Microsoft Entra Authentication** is checked. If so, you can move on.

1. Select **Enable Microsoft Entra Authentication**, and enter the name of a valid user. The user you enter is automatically assigned _Data Owner Access Policy_ by default when you select **Save**. You can also enter a managed identity or service principal to connect to your cache instance.

    :::image type="content" source="media/cache-entra-access/cache-enable-microsoft-entra.png" alt-text="Screenshot showing authentication selected in the resource menu and the enable Microsoft Entra authentication checked.":::

1. A popup dialog box displays asking if you want to update your configuration, and informing you that it takes several minutes. Select **Yes.**

   > [!IMPORTANT]
   > Once the enable operation is complete, the nodes in your cache instance reboots to load the new configuration. We recommend performing this operation during your maintenance window or outside your peak business hours. The operation can take up to 30 minutes.

For information on using Microsoft Entra ID with Azure CLI, see the [references pages for identity](/cli/azure/redis/identity).
