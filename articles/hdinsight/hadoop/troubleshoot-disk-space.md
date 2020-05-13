---
title: Manage disk space in Azure HDInsight
description: Troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 02/17/2020
---

# Manage disk space in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Hive log configurations

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

1. Navigate to **Hive** > **Configs** > **Advanced** > **Advanced hive-log4j**. Review the following settings:

    * `hive.root.logger=DEBUG,RFA`. This is the default value, modify the [log level](https://logging.apache.org/log4j/2.x/log4j-api/apidocs/org/apache/logging/log4j/Level.html) to `INFO` to print less logs entries.

    * `log4jhive.log.maxfilesize=1024MB`. This is the default value, modify as desired.

    * `log4jhive.log.maxbackupindex=10`. This is the default value, modify as desired. If the parameter has been omitted, the generated log files will be endless.

## Yarn log configurations

Review the following configurations:

* Apache Ambari

    1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

    1. Navigate to **Hive** > **Configs** > **Advanced** > **Resource Manager**. Ensure **Enable Log Aggregation** is checked. If disabled, name nodes will keep the logs locally and not aggregate them in remote store on application completion or termination.

* Ensure that the cluster size is appropriate for the workload. The workload might have changed recently or the cluster might have been resized. [Scale up](../hdinsight-scaling-best-practices.md) the cluster to match a higher workload.

* `/mnt/resource` might be filled with orphaned files (as in the case of resource manager restart). If necessary, manually clean `/mnt/resource/hadoop/yarn/log` and `/mnt/resource/hadoop/yarn/local`.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
