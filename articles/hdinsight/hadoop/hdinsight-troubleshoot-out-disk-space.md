---
title: Cluster node runs out of disk space in Azure HDInsight
description: Troubleshooting Apache Hadoop cluster node disk space issues in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/30/2020
---

# Scenario: Cluster node runs out of disk space in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

A job may fail with error message similar to: `/usr/hdp/2.6.3.2-14/hadoop/libexec/hadoop-config.sh: fork: No space left on device.`

Or you may receive Apache Ambari alert similar to: `local-dirs usable space is below configured utilization percentage`.

## Cause

Apache Yarn application cache may have consumed all available disk space. Your Spark application is likely running inefficiently.

## Resolution

1. Use Ambari UI to determine which node is running out of disk space.

1. Determine which folder in the troubling node contributes to most of the disk space. SSH to the node first, then run `df` to list disk usage for all mounts. Usually it is `/mnt` which is a temp disk used by OSS. You can enter into a folder, then type `sudo du -hs` to show summarized file sizes under a folder. If you see a folder similar to `/mnt/resource/hadoop/yarn/local/usercache/livy/appcache/application_1537280705629_0007`, this means the application is still running. This could be due to RDD persistence or intermediate shuffle files.

1. To mitigate the issue, kill the application, which will release disk space used by that application.

1. If the issue happens frequently on the worker nodes, you can tune the YARN local cache settings on the cluster.

    Open the Ambari UI
    Navigate to YARN --> Configs --> Advanced.  
    Add the following 2 properties to the custom yarn-site.xml section and save:

    ```
    yarn.nodemanager.localizer.cache.target-size-mb=2048
    yarn.nodemanager.localizer.cache.cleanup.interval-ms=300000
    ```

1. If the above does not permanently fix the issue, optimize your application.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
