---
title: Apache Phoenix connectivity issues in Azure HDInsight
description: Connectivity issues between Apache HBase and Apache Phoenix in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/14/2019
---

# Scenario: Apache Phoenix connectivity issues in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to connect to Apache HBase with Apache Phoenix. Reasons may vary.

## Cause: Incorrect IP

Incorrect IP of active Zookeeper node.

### Resolution

The IP of the active Zookeeper node can be identified from the Ambari UI by following the links to **HBase** > **Quick Links** > **ZK (Active)** > **Zookeeper Info**. Correct the IP as needed.

---

## Cause: SYSTEM.CATALOG table offline

When running commands such as `!tables`, you receive an error message similar to:

```output
Error while connecting to sqlline.py (Hbase - phoenix) Setting property: [isolation, TRANSACTION_READ_COMMITTED] issuing: !connect jdbc:phoenix:10.2.0.7 none none org.apache.phoenix.jdbc.PhoenixDriver Connecting to jdbc:phoenix:10.2.0.7 SLF4J: Class path contains multiple SLF4J bindings.
```

When running commands such as `count 'SYSTEM.CATALOG'`, you receive an error message similar to:

```output
ERROR: org.apache.hadoop.hbase.NotServingRegionException: Region SYSTEM.CATALOG,,1485464083256.c0568c94033870c517ed36c45da98129. is not online on 10.2.0.5,16020,1489466172189)
```

### Resolution

From the Apache Ambari UI, complete the following steps to restart the HMaster service on all ZooKeeper nodes:

1. From the **Summary** section of HBase, go to **HBase** > **Active HBase Master**.

1. From the **Components** section, restart the HBase Master service.

1. Repeat these steps for all remaining **Standby HBase Master** services.

It can take up to five minutes for the HBase Master service to stabilize and finish the recovery. After the `SYSTEM.CATALOG` table is back to normal, the connectivity issue to Apache Phoenix should get resolved automatically.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
