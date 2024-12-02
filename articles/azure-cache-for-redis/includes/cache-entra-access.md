---



ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

### Enable Microsoft Entra ID authentication on your cache

For an existing cache, first check to see if Microsoft Entra authentication is enabled. If it's not, complete the following steps to enable Microsoft Entra authentication. We recommend that you use Microsoft Entra ID for authentication in your applications.

1. In the Azure portal, select the Azure Cache for Redis instance where you'd like to use Microsoft Entra token-based authentication.

1. On the service menu, under **Settings**, select **Authentication**.

1. On the **Authentication** pane, check to see whether the **Enable Microsoft Entra Authentication** checkbox is selected. If it is, you can move on to the next section.

1. Otherwise, select the **Enable Microsoft Entra Authentication** checkbox. Then, enter the name of a valid user. Select **Save**. The user name that you enter is automatically assigned the Data Owner Access Policy.

   You also can enter a managed identity or a service principal to connect to your cache.

   :::image type="content" source="media/cache-entra-access/cache-enable-microsoft-entra.png" alt-text="Screenshot that shows Authentication selected in the service menu and the Enable Microsoft Entra Authentication checkbox selected.":::

1. In a dialog box, you're asked if you want to update your configuration, and you're informed that making the update takes several minutes to finish. Select **Yes.**

   > [!IMPORTANT]
   > When the enable operation is finished, the nodes in your cache reboot to load the new configuration. We recommend that you complete this operation during your standard maintenance window or outside your peak business hours. The process can take up to 30 minutes.

For information about using Microsoft Entra ID with the Azure CLI, see the [identity reference pages](/cli/azure/redis/identity).
