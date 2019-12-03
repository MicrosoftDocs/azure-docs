---
title: Cluster management best practices - Azure HDInsight
description: Learn best practices for managing HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 12/02/2019
---
# HDInsight cluster management best practices

Learn best practices for managing HDInsight clusters.

## How do I create HDInsight clusters?

| Option | Documents |
|---|---|
| Azure Data Factory | [Create on-demand Apache Hadoop clusters in HDInsight using Azure Data Factory](./hdinsight-hadoop-create-linux-clusters-adf.md) |
| Custom Resource Manager template | [Create Apache Hadoop clusters in HDInsight by using Resource Manager templates](./hdinsight-hadoop-create-linux-clusters-arm-templates.md) |
| Quickstart templates | [HDInsight Quickstart templates](https://azure.microsoft.com/resources/templates/?term=hdinsight) |
| Azure samples | [HDInsight Azure samples](https://docs.microsoft.com/samples/browse/?products=azure-hdinsight) |
| Azure portal | [Create Linux-based clusters in HDInsight by using the Azure portal](./spark/apache-spark-intellij-tool-plugin.md) |
| Azure CLI | [Create HDInsight clusters using the Azure CLI](./hdinsight-hadoop-create-linux-clusters-azure-cli.md) |
| Azure PowerShell | [Create Linux-based clusters in HDInsight using Azure PowerShell](./hdinsight-hadoop-create-linux-clusters-azure-powershell.md) |
| cURL | [Create Apache Hadoop clusters using the Azure REST API](./hdinsight-hadoop-create-linux-clusters-curl-rest.md) |
| SDKs (.NET, Python, Java) | [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight?view=azure-dotnet), [Python](https://docs.microsoft.com/python/api/overview/azure/hdinsight?view=azure-python), [Java](https://docs.microsoft.com/java/api/overview/azure/hdinsight?view=azure-java-stable), [Go](https://docs.microsoft.com/azure/hdinsight/hdinsight-go-sdk-overview) |

> [!Note]
> If you are creating a cluster and re-using the cluster name from a previously created cluster, wait until the previous cluster deletion is completed before creating your cluster.

## How do I customize HDInsight clusters?

| Option | Documents |
|---|---|
| Script actions | [Customize Azure HDInsight clusters by using script actions](./hdinsight-hadoop-customize-cluster-linux.md) |
| Bootstrap | [Customize HDInsight clusters using Bootstrap](./hdinsight-hadoop-customize-cluster-bootstrap.md) |
| External metastores | [Use external metadata stores in Azure HDInsight](./hdinsight-use-external-metadata-stores.md) |
| Custom Ambari DB | [Set up HDInsight clusters with a custom Ambari DB](./hdinsight-custom-ambari-db.md) |

## What are some errors I might face when creating clusters?

| Error | More information |
|---|---|
| No quota | There are quotas for the number of quotas that you can create on your subscription in each region. For more information, see [Capacity planning: quotas](./hdinsight-capacity-planning.md). |
| No more IP addresses available | Each VNet has a limited number of IP addresses. When you create a HDInsight cluster, each node (including zookeeper and gateway nodes) uses some of these allotted IP addresses. When all of the IP addresses are in use, you will encounter this error.  |
| Network security group (NSG) rules don't allow communication with HDInsight resource providers | If you use NSGs or user-defined routes (UDRs) to control inbound traffic to your HDInsight cluster, you must ensure that your cluster can communicate with critical Azure health and management services. For more information, see [Network security group (NSG) service tags for Azure HDInsight](./hdinsight-service-tags.md) |
| Reuse of cluster name | When you use a cluster name that you have used before, you need to wait X number of minutes before recreating the cluster. Otherwise you will see a message that the resource already exists. |

## How do I manage running HDInsight clusters?

| Option | Documents |
|---|---|
| Autoscale | [Automatically scale Azure HDInsight clusters](./hdinsight-autoscale-clusters.md) |
| Manual scaling | [Scale Azure HDInsight clusters](./hdinsight-scaling-best-practices.md) |
| Monitoring with Ambari| [Monitor cluster performance in Azure HDInsight](./hdinsight-key-scenarios-to-monitor.md) |
| Monitoring with Azure Monitor logs | [Use Azure Monitor logs to monitor HDInsight clusters](./hdinsight-hadoop-oms-log-analytics-tutorial.md) |

## How do I check on deleted HDInsight clusters?

### Azure Monitor logs

You can use the following query with Azure Monitor logs to monitor deleted clusters.

```loganalytics
AzureActivity
| where ResourceProvider == "Microsoft.HDInsight" and (OperationName == "Create or Update Cluster" or OperationName == "Delete Cluster") and ActivityStatus == "Succeeded"
```

## Next steps

* [Capacity planning for HDInsight clusters](./hdinsight-capacity-planning.md)
* [What are the default and recommended node configurations for Azure HDInsight?](./hdinsight-supported-node-configuration.md)