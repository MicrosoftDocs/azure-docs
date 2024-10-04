--- 


ms.service: cache
ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

## Add a new Redis user access policy

The identity that accesses Azure Cache for Redis must be assigned a data access policy. For this example, you assign a data access policy to the same Microsoft Entra ID account that you use to sign in to the Azure CLI or Visual Studio.

1. In the Azure portal, go to your cache.

1. On the service menu, under **Settings**, select **Data Access Configuration**.

1. On the **Data Access Configuration** pane, select **Add** > **New Redis User**.

    :::image type="content" source="media/redis-access-policy/assign-access-policy.png" alt-text="Screenshot showing the data access configuration pane with New Redis User highlighted.":::

1. On the **New Redis User** pane, select the **Data Contributor** policy, and then select **Next: Redis Users**.

1. Choose **Select Member** to open the flyout menu. Search for your user account and select it in the results.

    :::image type="content" source="media/redis-access-policy/select-user.png" alt-text="Screenshot showing the Redis User tab on the New Redis User pane with Select member highlighted.":::

1. Select **Review + assign** to assign the policy to the selected user.
