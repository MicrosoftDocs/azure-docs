To create a cache, first sign in to the [Azure Portal](https://portal.azure.com), and click **New**, **Data + Storage**, **Redis Cache**.

>[AZURE.NOTE] In addition to creating caches in the Azure Portal, you can also create them using ARM templates, PowerShell, or Azure CLI.
>
>-	To create a cache using ARM templates, see [Create a Redis cache using a template](cache-redis-cache-arm-provision.md).
>-	To create a cache using Azure PowerShell, see [Manage Azure Redis Cache with Azure PowerShell](cache-howto-manage-redis-cache-powershell.md).
>-	To create a cache using Azure CLI, see [How to create and manage Azure Redis Cache using the Azure Command-Line Interface (Azure CLI)](cache-manage-cli.md).

![New cache](./media/cache-dotnet-how-to-use-azure-redis-cache/redis-cache-new-cache-menu.png)

>[AZURE.NOTE] If you don't have an Azure account, you can [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero) in just a couple of minutes.

In the **New Redis Cache** blade, specify the desired configuration for the cache.

![Create cache](./media/cache-dotnet-how-to-use-azure-redis-cache/redis-cache-cache-create.png)

-	In **Dns name**, enter a cache name to use for the cache endpoint. The cache name must be a string between 1 and 63 characters and contain only numbers, letters, and the `-` character. The cache name cannot start or end with the `-` character, and consecutive `-` characters are not valid.
-	For **Subscription**, select the Azure subscription that you want to use for the cache. If your account has only one subscription, it will be automatically selected and the **Subscription** drop-down will not be displayed.
-	In **Resource group**, select or create a resource group for your cache. For more information, see [Using Resource groups to manage your Azure resources](./resource-group-overview.md). 
-	Use **Location** to specify the geographic location in which your cache is hosted. For the best performance, Microsoft strongly recommends that you create the cache in the same region as the cache client application.
-	Use **Pricing Tier** to select the desired cache size and features.
-	**Redis cluster** allows you to create caches larger than 53 GB and to shard data across multiple Redis nodes. For more information, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).
-	**Redis persistence** offers the ability to persist your cache to an Azure Storage account. For instructions on configuring persistence, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md).
-	**Virtual Network** provides enhanced security and isolation by restricting access to your cache to only those clients within the specified Azure Virtual Network. You can use all the features of VNet such as subnets, access control policies, and other features to further restrict access to Redis. For more information, see [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).
-	Use **Diagnostics** to specify a storage account for cache metrics. For more information on configuring and viewing cache metrics, see [How to monitor Azure Redis Cache](cache-how-to-monitor.md).

Once the new cache options are configured, click **Create**. It can take a few minutes for the cache to be created. To check the status, you can monitor the progress on the startboard. After the cache has been created, your new cache has a **Running** status and is ready for use with default settings.

![Cache created](./media/cache-dotnet-how-to-use-azure-redis-cache/redis-cache-cache-created.png)

