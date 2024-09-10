--- 


ms.service: cache
ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

## Add the Redis access policy

You need to assign a data access policy to the identity that accesses Azure Cache for Redis. For this example, you assign a data access policy to the same Microsoft Entra ID account you use to log into the Azure CLI or Visual Studio.

1. Select **Settings** Resource menu on the cache and select the **Data Access Configuration**.

1. On the **Data Access Configuration** page, select **Add > New Redis User** from the top navigation.

    :::image type="content" source="media/redis-access-policy/assign-access-policy.png" alt-text="Screenshot showing the data access configuration screen.":::

1. On the **New Redis User** page, select the **Data Contributor** policy, and select **Next: Redis Users**.

1. Choose **+ Select Member** to open the flyout menu. Search for your user account and select it from the results.

    :::image type="content" source="media/redis-access-policy/select-user.png" alt-text="Screenshot showing the Redis user tab in the working pane with select member highlighted with a red box.":::

1. Select **Review + assign** to assign the policy to the selected user.
