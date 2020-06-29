---
title: Reboot VMs for Azure HDInsight cluster 
description: Learn how to reboot unresponsive VMs for HDInsight cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/22/2020
---

# Reboot VMs for HDInsight cluster

HDInsight clusters contain groups of VMs as cluster nodes. For long running clusters, these nodes may become unresponsive for various reasons. This article describes how to reboot unresponsive VMs in an HDInsight cluster.

## When to reboot

Rebooting VMs in the cluster brings downtime of the node and restarting of services on the node. While the node is rebooting, the cluster may become unhealthy, jobs may slow down or fail. If you are trying to reboot the active head node, all running jobs will be killed, and you cannot submit jobs to the cluster until the services are up and running again. You should consider rebooting VMs only when necessary. Here is some guidance for when to consider rebooting VMs.

- You cannot SSH into the node, but it does respond to pings.
- The worker node is down without heartbeat in Ambari UI.
- The temp disk is full on the node.
- The process table on the VM has many entries where the process has completed, but it is listed with "Terminated state"

## Use REST API to reboot VMs

Node rebooting is only supported via REST API currently. You can use the **Try it** feature in the API doc to send requests to HDInsight. There are two steps required to use the node reboot operation: list nodes and restart nodes.

1. List nodes. You can get the cluster node list from the REST API or in Ambari. More details can be found at [HDInsight List Hosts REST API operation](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines/listhosts)

    ```
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/listHosts?api-version=2018-06-01-preview
    ```

2. Restart hosts. After getting the names of the nodes that you want to reboot, use restart hosts REST API to reboot the nodes. More details can be found at [HDInsight Restart Hosts REST API operation](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines/restarthosts)

    ```
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/restartHosts?api-version=2018-06-01-preview
    ```

The actual names of the nodes which you want to reboot are specified in a JSON array in the request body.

```json
[
  "gateway1",
  "gateway3"
]
```

## Next steps

* [HDInsight Virtual machines REST API](https://docs.microsoft.com/rest/api/hdinsight/virtualmachines)
* [HDInsight REST API](https://docs.microsoft.com/rest/api/hdinsight/)