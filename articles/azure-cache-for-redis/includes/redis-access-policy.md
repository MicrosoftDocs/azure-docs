## Add the Redis access policy

You'll need to assign a data access policy to the identity that will access Azure Cache for Redis. For this example, you'll assign a data access policy to the same Azure Entra ID account you use to log into the Azure CLI or Visual Studio

1. Expand the **Settings** node of the left nav on the Azure Cache for Redis service and select the **Data Access Configuration**.
1. On the **Data Access Configuration** page, select **Add > New Redis User** from the top navigation.

    :::image type="content" source="media/cache-entra-access/assign-access-policy.png" alt-text="Assign the access policy.":::

1. On the **New Redis User** page, select the **Data Contributor** policy and choose **Next: Redis Users**.
1. Choose **+ Select Member** to open the flyout menu. Search for your user account and select it from the results.

    :::image type="content" source="media/cache-entra-access/select-user.png" alt-text="Assign the access policy.":::
 
1. Select **Review + assign** to assign the policy to the selected user.

