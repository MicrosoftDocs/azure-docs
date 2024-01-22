---
title: Outbound traffic on HDInsight on AKS
description: Learn required outbound traffic on HDInsight on AKS. 
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# Required outbound traffic for HDInsight on AKS

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article outlines the networking information to help manage the network policies at enterprise and make necessary changes to the network security groups (NSGs) for smooth functioning of HDInsight on AKS.

If you use firewall to control outbound traffic to your HDInsight on AKS cluster, you must ensure that your cluster can communicate with critical Azure services. 
Some of the security rules for these services are region-specific, and some of them apply to all Azure regions.

You need to configure the following network and application security rules in your firewall to allow outbound traffic.

## Common traffic

|Type| Destination Endpoint              | Protocol | Port | Azure Firewall Rule Type | Use |
|----|-----------------------------------|----------|------|-----| ----|
| ServiceTag | AzureCloud.`<Region>` | UDP      | 1194 | Network security rule| Tunneled secure communication between the nodes and the control plane.|
| ServiceTag | AzureCloud.`<Region>` | TCP      | 9000 | Network security rule|Tunneled secure communication between the nodes and the control plane.|
| FQDN Tag| AzureKubernetesService | HTTPS      | 443 |Application security rule| Required by AKS Service.|
| Service Tag  | AzureMonitor | TCP      | 443 |Application security rule| Required for integration with Azure Monitor.|
| FQDN| hiloprodrpacr00.azurecr.io|HTTPS|443|Application security rule| Downloads metadata info of the docker image for setup of HDInsight on AKS and monitoring.|
| FQDN| *.blob.core.windows.net|HTTPS|443|Application security rule| Monitoring and setup of HDInsight on AKS.|
| FQDN|graph.microsoft.com|HTTPS|443|Application security rule| Authentication.|
| FQDN|*.servicebus.windows.net|HTTPS|443|Application security rule| Monitoring.|
| FQDN|*.table.core.windows.net|HTTPS|443|Application security rule| Monitoring.
| FQDN|gcs.prod.monitoring.core.windows.net|HTTPS|443|Application security rule| Monitoring.|
| FQDN|API Server FQDN (available once AKS cluster is created)|TCP|443|Network security rule| Required as the running pods/deployments use it to access the API Server. You can get this information from the AKS cluster running behind the cluster pool. For more information, see [how to get API Server FQDN](secure-traffic-by-firewall-azure-portal.md#get-aks-cluster-details-created-behind-the-cluster-pool) using Azure portal.|


## Cluster specific traffic

The below section outlines any specific network traffic, which a cluster shape requires, to help enterprises plan and update the network rules accordingly.

### Trino

| Type | Destination Endpoint              | Protocol | Port | Azure Firewall Rule Type |Use |
|------|-----------------------------------|----------|------|-----|----|
| FQDN|*.dfs.core.windows.net|HTTPS|443|Application security rule|Required if Hive is enabled. It's user's own Storage account, such as contosottss.dfs.core.windows.net|
| FQDN|*.database.windows.net|mysql|1433|Application security rule|Required if Hive is enabled. It's user's own SQL server, such as contososqlserver.database.windows.net|
|Service Tag | Sql.`<Region>`|TCP|11000-11999|Network security rule|Required if Hive is enabled. It's used in connecting to SQL server. It's recommended to allow outbound communication from the client to all Azure SQL IP addresses in the region on ports in the range of 11000 to 11999. Use the Service Tags for SQL to make this process easier to manage. When using the Redirect connection policy, refer to the [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow.|

### Spark

| Type | Destination Endpoint| Protocol | Port | Azure Firewall Rule Type |Use |
|------|---------------------|----------|------|-----|---|
| FQDN|*.dfs.core.windows.net|HTTPS|443|Application security rule|Spark Azure Data Lake Storage Gen2. It's user's Storage account: such as contosottss.dfs.core.windows.net|
|Service Tag | Storage.`<Region>`|TCP|445|Network security rule|Use SMB protocol to connect to Azure File|
| FQDN|*.database.windows.net|mysql|1433|Application security rule|Required if Hive is enabled. It's user's own SQL server, such as contososqlserver.database.windows.net|
|Service Tag | Sql.`<Region>`|TCP|11000-11999|Network security rule|Required if Hive is enabled. It's used to connect to SQL server. It's recommended to allow outbound communication from the client to all Azure SQL IP addresses in the region on ports in the range of 11000 to 11999. Use the Service Tags for SQL to make this process easier to manage. When using the Redirect connection policy, refer to the [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow. |

### Apache Flink

|Type|Destination Endpoint|Protocol|Port|Azure Firewall Rule Type |Use|
|-|-|-|-|-|--|
|FQDN|`*.dfs.core.windows.net`|HTTPS|443|Application security rule|Flink Azure Data Lake Storage Gens. It's user's Storage account: such as contosottss.dfs.core.windows.net|

## Next steps
* [How to use firewall to control outbound traffic and apply rules](./secure-traffic-by-firewall.md).
* [How to use NSG to restrict traffic](./secure-traffic-by-nsg.md).
