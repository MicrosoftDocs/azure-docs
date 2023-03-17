---
title: Storage exception after connection reset in Azure HDInsight
description: Storage exception after connection reset in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/31/2022
---

# Scenario: Storage exception after connection reset in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to create new Apache HBase table.

## Cause

During a table truncation process, there was a storage connection issue. The table entry was deleted in HBase metadata table. All but one blob file was deleted.

Although there was no folder blob called `/hbase/data/default/ThatTable` sitting in the storage. The WASB driver found the existence of the above the blob file and would not allow to create any blob called `/hbase/data/default/ThatTable` because it assumed the parent folders existed, thus creating table will fail.

## Resolution

1. From Apache Ambari UI, restart the active HMaster. This will let one of the two standby HMaster becoming the active one and the new active HMaster will reload the metadata table info. Thus you will not see the `already-deleted` table in HMaster UI.

1. You can find the orphan blob file from UI tools like Cloud Explorer or running command like `hdfs dfs -ls /xxxxxx/yyyyy`. Run `hdfs dfs -rmr /xxxxx/yyyy` to delete that blob. For example, `hdfs dfs -rmr /hbase/data/default/ThatTable/ThatFile`.

Now you can create new table with the same name in HBase.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
