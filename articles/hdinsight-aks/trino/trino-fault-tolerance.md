---
title: Configure fault-tolerance
description: Learn how to configure fault-tolerance in Trino with HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 10/19/2023
---

# Fault-tolerant execution

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Trino supports [fault-tolerant execution](https://trino.io/docs/current/admin/fault-tolerant-execution.html) to mitigate query failures and increase resilience.
This article describes how you can enable fault tolerance for your Trino cluster with HDInsight on AKS.

## Configuration

Fault-tolerant execution is disabled by default. It can be enabled by adding `retry-policy` property in config.properties settings. Learn how to [manage configurations](./trino-service-configuration.md) of your cluster.

|Property|Allowed Values|Description|
|-|-|-|
|`retry-policy`|QUERY or TASK| Setting determines whether Trino retries failing tasks or entire queries if there's a failure.|

For more details, refer [Trino documentation](https://trino.io/docs/current/admin/fault-tolerant-execution.html).

To enable fault-tolerant execution on queries/tasks with a larger result set, configure an exchange manager that utilizes external storage for spooled data beyond the in-memory buffer size.

## Exchange manager

Exchange manager is responsible for managing spooled data to back fault-tolerant execution. For more details, refer [Trino documentation]( https://trino.io/docs/current/admin/fault-tolerant-execution.html#fte-exchange-manager).
<br>Trino with HDInsight on AKS supports `filesystem` based exchange managers that can store the data in Azure Blob Storage (ADLS Gen 2). This section describes how to configure exchange manager with Azure Blob Storage.

To set up exchange manager with Azure Blob Storage as spooling destination, you need three required properties in `exchange-manager.properties` file.

|Property|Description|
|-|-|
|`exchange-manager.name`| Kind of storage that is used for spooled data.|
|`exchange.base-directories`| Comma-separated list of URI locations that are used by exchange manager to store spooled data.|
|`exchange.azure.connection-string`| Connection string property used to access the directories specified in `exchange.base-directories`. |


> [!TIP]
> You need to add `exchange-manager.properties` file in `common` component inside `serviceConfigsProfiles.serviceName[“trino”]` section in the cluster ARM template. Refer to [manage confgurations](./trino-service-configuration.md#using-arm-template) on how to add configuration files to your cluster.

Example:

```json
exchange-manager.name=filesystem
exchange.base-directories=abfs://container_name@account_name.dfs.core.windows.net
exchange.azure.connection-string=connection-string
```

The connection string takes the following form:
```
DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net
```


You can find the connection string in *Security + Networking* -> *Access keys* section in the Azure portal page for your storage account, as shown in the following example: 

:::image type="content" source="./media/trino-fault-tolerance/connection-string.png" alt-text="Screenshot showing storage account connection string." border="true" lightbox="./media/trino-fault-tolerance/connection-string.png":::

> [!NOTE]
> Trino with HDInsight on AKS currently does not support MSI authentication in exchange manager set up backed by Azure Blob Storage.
