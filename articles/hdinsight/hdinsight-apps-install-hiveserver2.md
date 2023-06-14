---
title: Scale HiveServer2 on Azure HDInsight
description: Horizontally scale HiveServer2 on Azure HDInsight clusters using edge nodes to increase fault tolerance and availability.
services: hdinsight
ms.service: hdinsight
ms.topic: conceptual
ms.author: kecheung
author: kcheeeung
ms.date: 09/28/2022
---

# Scale HiveServer2 on Azure HDInsight Clusters for High Availability

Learn how to deploy an additional HiveServer2 into your cluster to increase availability and load distribution. When increasing the headnode size isn't desired, you can also use edge nodes to deploy HiveServer2. 

> [!NOTE]
> Depending on your usage, increasing the number of HiveServer2 may increase the number of connections to the Hive metastore. Also ensure your Azure SQL database is properly sized.

## Prerequisites

To use this guide, you'll need to understand the following article:
- [Use empty edge nodes on Apache Hadoop clusters in HDInsight](hdinsight-apps-use-edge-node.md)

## Install HiveServer2

In this section, you'll install an additional HiveServer2 onto your target hosts.

1. Open Ambari in your browser and click on your target host.

:::image type="content" source="media/hdinsight-apps-install-hiveserver2/hdinsight-install-hiveserver2-a.png" alt-text="Hosts menu of Ambari.":::

2. Click the add button and click on HiveServer2

:::image type="content" source="media/hdinsight-apps-install-hiveserver2/hdinsight-install-hiveserver2-b.png" alt-text="Add HiveServer2 panel of host.":::

3. Confirm and the process will run. Repeat 1-3 for all desired hosts.

4. When you have finished installing, restart all services with stale configs and start HiveServer2.

:::image type="content" source="media/hdinsight-apps-install-hiveserver2/hdinsight-install-hiveserver2-c.png" alt-text="Start HiveServer2 panel.":::

## Next steps

In this article, you've learned how to install HiveServer2 onto your cluster. To learn more about edge nodes and applications, see the following articles:

* [Install edge node](hdinsight-apps-use-edge-node.md): Learn how to install an edge node onto your HDInsight cluster.
* [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
* [Azure SQL DTU Connection Limits](/azure/azure-sql/database/resource-limits-dtu-single-databases): Learn about Azure SQL database limits using DTU.
* [Azure SQL vCore Connection Limits](/azure/azure-sql/database/resource-limits-vcore-elastic-pools): Learn about Azure SQL database limits using vCores.
