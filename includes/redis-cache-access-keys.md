To connect to an Azure Redis Cache instance, cache clients need the host name, ports, and keys of the cache. Some clients may refer to these items by slightly different names. 

* [Retrieve host name, ports, and access keys using Azure CLI](#retrieve-host-name-ports-and-access-keys-using-azure-cli)
* [Retrieve host name, ports, and access keys using the Azure Portal](#retrieve-host-name-ports-and-access-keys-using-the-azure-portal)

### Retrieve host name, ports, and access keys using Azure CLI
To retrieve the host name and ports you can call [az redis show](https://docs.microsoft.com/cli/azure/redis#show) and to retrieve the keys you can call [az redis list-keys](https://docs.microsoft.com/cli/azure/redis#list-keys). The following script calls these two commands and echos the hostname, ports, and keys to the console.

[!code-azurecli[main](../../../cli_scripts/redis-cache/cache-keys-ports/cache-keys-ports.sh "Azure Redis Cache")]

### Retrieve host name, ports, and access keys using the Azure Portal
To retrieve host name, ports, and access keys using the Azure Portal, [browse](../articles/redis-cache/cache-configure.md#configure-redis-cache-settings) to your cache in the [Azure portal](https://portal.azure.com) and click the desired item in the **Resource menu**. 

![Redis cache settings](media/redis-cache-access-keys/redis-cache-settings.png)

#### Host name and ports
To access the host name and ports click **Properties**.

![Redis cache properties](media/redis-cache-access-keys/redis-cache-properties.png)

#### Access keys
To retrieve the access keys, click **Access keys**.

![Redis cache access keys](media/redis-cache-access-keys/redis-cache-access-keys.png)



