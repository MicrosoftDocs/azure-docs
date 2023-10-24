---
title: Configure caching
description: Learn how to configure caching in Trino
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Configure caching

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Querying object storage using the Hive connector is a common use case for Trino. This process often involves sending large amounts of data. Objects are retrieved from HDFS or another supported object store by multiple workers and processed by those workers. Repeated queries with different parameters, or even different queries from different users, often access and transfer the same objects. 

HDInsight on AKS Trino has added **final result caching** capability, which provides the following benefits:

* Reduce the load on object storage.
* Improve the query performance.
* Reduce the query cost.

## Caching options

 Different options for caching:

* [**Final result caching**](#final-result-caching): When enabled (in coordinator component configuration section), a result for any query for any catalog caches on a coordinator VM.
* [**Hive/Iceberg/Delta Lake catalog caching**](#hiveicebergdelta-lake-caching): When enabled (for a specific catalog of corresponding type), a split data for each query caches within cluster on worker VMs.

## Final result caching

Final result caching can be configured in two ways: 
* [Using Azure portal](#using-azure-portal)
* [Using ARM template](#using-arm-template)
   
Available configuration parameters are:

|Property|Default|Description|
|---|---|---|
|`query.cache.enabled`|false|Enables final result caching if true.|
|`query.cache.ttl`|-|Defines a time till cache data is kept prior to eviction. For example: "10m","1h" |
|`query.cache.disk-usage-percentage`|80|Percentage of disk space used for cached data.|
|`query.cache.max-result-data-size`|0|Max data size for a result. If this value exceeded, then result doesn't cache.|

> [!NOTE]
> Final result caching is using query plan and ttl as a cache key.

Final result caching can also be controlled through the following session parameters:

|Session parameter|Default|Description|
|---|---|---|
|`query_cache_enabled`|Original configuration value|Enables/disables final result caching for a query/session.|
|`query_cache_ttl`|Original configuration value|Defines a time till cache data is kept prior to eviction.|
|`query_cache_max_result_data_size`|Original configuration value|Max data size for a result. If this value exceeded, then result doesn't cache.|
|`query_cache_forced_refresh`|false|When set to true, forces the result of query execution to be cached that is,  the result replaces existing cached data if it exists).|

> [!NOTE]
> Session parameters can be set for a session (for example, if Trino CLI is used) or can be set in multi-statement before query text.
>For example,
>```
>set session query_cache_enabled=true;
>select cust.name, *
>from tpch.tiny.orders 
>join tpch.tiny.customer as cust on cust.custkey = orders.custkey
>order by cust.name
>limit 10;
>```

### Using Azure portal

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/trino-caching/portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster.":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/trino-caching/portal-search-result.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list.":::

1. Navigate to **Configuration Management** blade.

   :::image type="content" source="./media/trino-caching/azure-portal-configuration-management.png" alt-text="Screenshot showing Azure portal configuration management.":::
   
1. Go to config.properties -> Custom configurations and then click **Add**.

   :::image type="content" source="./media/trino-caching/configuration-properties.png" alt-text="Screenshot showing custom configuration.":::
  
1. Set the required properties, and click **OK**.

   :::image type="content" source="./media/trino-caching/set-properties.png" alt-text="Screenshot showing configuration properties.":::
   
1. **Save** the configuration.

   :::image type="content" source="./media/trino-caching/save-configuration.png" alt-text="Screenshot showing how to save the configuration."::: 

### Using ARM template

#### Prerequisites

* An operational HDInsight on AKS Trino cluster.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

You need to define the properties in coordinator component in `properties.clusterProfile.serviceConfigsProfiles` section in the ARM template.
The following example demonstrates where to add the properties.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
            "type": "microsoft.hdinsight/clusterpools/clusters",
            "apiVersion": "<api-version>",
            "name": "<cluster-pool-name>/<cluster-name>",
            "location": "<region, e.g. westeurope>",
            "tags": {},
            "properties": {
                "clusterType": "Trino",

                "clusterProfile": {

                    "serviceConfigsProfiles": [
                        {
                            "serviceName": "trino",
                            "configs": [
                                {
                                    "component": "coordinator",
                                    "files": [
                                        {
                                            "fileName": "config.properties",
                                            "values": {
                                                "query.cache.enabled": "true",
                                                "query.cache.ttl": "10m"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }

            }
        }
    ]
}
```


## Hive/Iceberg/Delta Lake caching

All three connectors share the same set of parameters as described in [Hive caching](https://trino.io/docs/current/connector/hive-caching.html).

> [!NOTE]
> Certain parameters are not configurable and always set to their default values: <br>hive.cache.data-transfer-port=8898, <br>hive.cache.bookkeeper-port=8899, <br>hive.cache.location=/etc/trino/cache, <br>hive.cache.disk-usage-percentage=80

The following example demonstrates where to add the properties to enable Hive caching using ARM template.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
            "type": "microsoft.hdinsight/clusterpools/clusters",
            "apiVersion": "<api-version>",
            "name": "<cluster-pool-name>/<cluster-name>",
            "location": "<region, e.g. westeurope>",
            "tags": {},
            "properties": {
                "clusterType": "Trino",

                "clusterProfile": {

                    "serviceConfigsProfiles": [
                        {
                            "serviceName": "trino",
                            "configs": [
                                {
                                    "component": "catalogs",
                                    "files": [
                                        {
                                            "fileName": "hive1.properties",
                                            "values": {
                                                "connector.name": "hive"
                                                "hive.cache.enabled": "true",
                                                "hive.cache.ttl": "5d"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }

            }
        }
    ]
}
```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
