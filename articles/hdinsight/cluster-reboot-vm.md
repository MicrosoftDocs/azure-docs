---
title: Reboot VMs for Azure HDInsight clusters 
description: Learn how to reboot unresponsive VMs for Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: how-to
ms.date: 06/22/2020
---

# Reboot VMs for HDInsight clusters

Azure HDInsight clusters contain groups of virtual machines (VMs) as cluster nodes. For long-running clusters, these nodes might become unresponsive for various reasons. This article describes how to reboot unresponsive VMs in an HDInsight cluster.

## When to reboot

> [!WARNING]
> When you reboot VMs in a cluster, the node is unavailable for use and the services on the node must restart.

When a node is rebooting, the cluster might become unhealthy, and jobs might slow down or fail. If you're trying to reboot the active head node, all running jobs will be stopped. You won't be able to submit jobs to the cluster until the services are up and running again. For these reasons, you should reboot VMs only when necessary. Consider rebooting VMs when:

- You can't use SSH to get into the node, but it does respond to pings.
- The worker node is down without a heartbeat in the Ambari UI.
- The temp disk is full on the node.
- The process table on the VM has many entries where the process has completed, but it's listed with "Terminated state."

> [!NOTE]
> Rebooting VMs is not supported  for **HBase** and **Kafka** clusters because rebooting might cause data to be lost.

## Use PowerShell to reboot VMs

Two steps are required to use the node reboot operation: list nodes and restart nodes.

1. List nodes. You can get the cluster node list at [Get-AzHDInsightHost](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsighthost).

      ```
      Get-AzHDInsightHost -ClusterName myclustername
      ```

1. Restart hosts. After you get the names of the nodes that you want to reboot, restart the nodes by using [Restart-AzHDInsightHost](https://docs.microsoft.com/powershell/module/az.hdinsight/restart-azhdinsighthost).

      ```
      Restart-AzHDInsightHost -ClusterName myclustername -Name wn0-myclus, wn1-myclus
      ```

## Use a REST API to reboot VMs

You can use the **Try it** feature in the API doc to send requests to HDInsight. Two steps are required to use the node reboot operation: list nodes and restart nodes.

1. List nodes. You can get the cluster node list from the REST API or in Ambari. For more information, see [HDInsight list hosts REST API operation](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines/listhosts).

    ```
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/listHosts?api-version=2018-06-01-preview
    ```

1. Restart hosts. After you get the names of the nodes that you want to reboot, restart the nodes by using the REST API to reboot the nodes. The node name follows the pattern of *NodeType(wn/hn/zk/gw)* + *x* + *first six characters of cluster name*. For more information, see [HDInsight restart hosts REST API operation](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines/restarthosts).

    ```
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/restartHosts?api-version=2018-06-01-preview
    ```

The actual names of the nodes that you want to reboot are specified in a JSON array in the request body.

```json
[
  "wn0-abcdef",
  "zk1-abcdef"
]
```

## Next steps

* [Restart-AzHDInsightHost](https://docs.microsoft.com/powershell/module/az.hdinsight/restart-azhdinsighthost)
* [HDInsight virtual machines REST API](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines)
* [HDInsight REST API](https://docs.microsoft.com/rest/api/hdinsight/)
