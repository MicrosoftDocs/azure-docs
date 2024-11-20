---

ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

1. To create an Azure Managed Redis (preview) instance, sign in to the Azure portal and select **Create a resource**.

1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.
   <!-- Fran, need screenshot. -->
   <!-- :::image type="content" source="../media/managed-redis-create/new-cache-menu.png" alt-text="Screenshot showing how to select Azure Managed Redis."::: -->

1. On the **New Redis Cache** page, configure the settings for your new cache.

   | Setting      |  Choose a value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Managed Redis instance. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **DNS name** | Enter a name that is unique in the region. | The cache name must be a string between 1 and 63 characters when _combined with the cache's region name_ that contain only numbers, letters, or hyphens. (If the cache name is fewer than 45 characters long it should work in all currently available regions.) The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's _host name_ is `\<DNS name\>.\<Azure region\>.redis.azure.net`. |
   | **Location** | Drop down and select a location. | Azure Managed Redis is available in selected Azure regions. |
   | **Cache type** | Drop down and select the performance tier and cache size. |  The tier determines the performance of the Redis instance, while the cache size determines the memory available to store data. For guidance on choosing the right performance tier, see [Chosing the right tier](../managed-redis/managed-redis-overview.md#choosing-the-right-tier) |

   :::image type="content" source="media/managed-redis-create/managed-redis-new-cache-basics.png" alt-text="Screenshot showing the Azure Managed Redis Basics tab.":::

1. Select **Next: Networking** and select either a public or private endpoint.

1. Select **Next: Advanced**. 
   Here, you can configure any [Redis modules](../managed-redis/managed-redis-redis-modules.md) to be added to the instance.
   
   Set **Clustering policy** to **Enterprise** for a nonclustered cache, or to **OSS** for a clustered cache. For more information on choosing **Clustering policy**, see [Cluster policy](../managed-redis/managed-redis-architecture.md#cluster-policies).

   :::image type="content" source="media/managed-redis-create/managed-redis-advanced-settings.png" alt-text="Screenshot that shows the Azure Managed Redis Advanced tab.":::

   If you are using **Active geo-replication**, it must be configured during creation. For instructions on how do to this, see [Configure active geo-replication for Azure Managed Redis instances](../managed-redis/managed-redis-how-to-active-geo-replication.md).
   
   > [!IMPORTANT]
   > You can't change the clustering policy of an Azure Managed Redis (preview) instance after you create it. If you're using [RediSearch](../managed-redis/managed-redis-redis-modules.md#redisearch), the Enterprise cluster policy is required, and `NoEviction` is the only eviction policy supported.
   >

   > [!IMPORTANT]
   >  If you're using this cache instance in a geo-replication group, eviction policies cannot be changed after the instance is created. Be sure to know the eviction policies of your primary nodes before you create the cache. For more information on active geo-replication, see [Active geo-replication prerequisites](../managed-redis/managed-redis-how-to-active-geo-replication.md#active-geo-replication-prerequisites).
   >
   
   > [!IMPORTANT]
   > You can't change modules after you create a cache instance. Modules must be enabled at the time you create an Azure Cache for Redis instance. There is no option to enable the configuration of a module after you create a cache.
   >

1. Select **Next: Tags** and skip.

1. Select **Next: Review + create**.

   :::image type="content" source="media/managed-redis-create/managed-redis-summary.png" alt-text="Screenshot showing the Azure Managed Redis Review + Create tab.":::

1. Review the settings and select **Create**.

   It will take several minutes for the Redis instance to create. You can monitor progress on the Azure Managed Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.
