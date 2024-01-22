---
title: Broker fails to start due to a full disk in Azure HDInsight
description: Troubleshooting steps for Apache Kafka broker process that can't start due to disk full error. 
ms.service: hdinsight
ms.topic: troubleshooting
author: yeturis
ms.author: sairamyeturi 
ms.date: 09/19/2023
---

# Scenario: Brokers are unhealthy or can't restart due to disk space full issue

This article describes troubleshooting steps and possible resolutions for issues using  Apache Kafka in Azure HDInsight clusters.

## Issue

The data disks used by Apache Kafka brokers in Azure HDInsight clusters can fill up. When that happens, the Apache Kafka broker process can't start and fails because of the disk full error. If you have made any recent configuration changes, those changes don't take effect because the Kafka broker process doesn't start.

## Cause

The issue might be caused by one or more of the following scenarios:

- You can't increase the number of disks or increase the disk size after you create the Kafka cluster.
- Usually, disk alerts are configured in the Apache Ambari UI. Whenever the usage of disk increases above 60%, an alert notifies you that you must either scale out or reduce the number of logs present in Kafka cluster.
- This issue happens only if you ignore the disk alerts. You could scale out the cluster to make more space available to respond to the disk space alerts.
- Messages aren't immediately deleted, even though the retention time passes. Messages that are to be deleted will be marked for deletion. Later, a background cleanup process deletes the messages. Only messages in passive segments are deleted.

> [!IMPORTANT]
> You can use a configuration to enhance the log cleaner performance, but *use caution* when you apply this enhancement because it might affect producing or consuming messages.

## Mitigation

To mitigate the issue:

1. Check the `server.properties` files to find the retention time for every topic. Sometimes, the log retention policy is set at topic level. To find retention time configured at topic level, run the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --describe --zookeeper <zookeeper-list>
    ```

2. When you have that information, check to see which heavy partitions occupy the maximum disk space.

    ```bash
    # Command to sort the directories based on size:
    du -hs * | sort -rh | head -5 
    ```

3. Back up the files that are older than the new retention time.

4. When there is some free space available, you can restart the brokers to use the new retention time configuration. Restarting the brokers cleans the older logs and frees up some space on disk.

   > [!IMPORTANT]
   > Sometimes, taking a backup might not be an option because either the OS disk might get full or it would overload other Kafka disks. In this scenario, you might have to delete files that are older than the retention time.

## Resolution

Even though you can decrease the retention time, the configuration isn't scalable if you want to add more topics in the cluster or if the load or amount of data that's ingested increases.

To avoid these scenarios, consider using one of the following options:

- If the partitions are too large, increase the number of partitions for the heaviest topics.

  > [!NOTE]
  > Increasing the partitions in an existing topic doesn't reorganize the data in the topic. You must first manually copy data from an old, low-partition topic to a new, higher-partition topic. 

- Scale out the cluster and rebalance all the partitions across multiple disks.

- Create a cluster that has a bigger SKU and more disks attached.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
