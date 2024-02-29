---
title: The account being accessed does not support http error in Azure HDInsight
description: This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/25/2023
---

# The account being accessed does not support http error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The following error message is received:

```
com.microsoft.azure.storage.StorageException: The account being accessed does not support http.
```

## Cause

There are multiple reasons why the error message is received:

* The storage account has [secure transfer](../../storage/common/storage-require-secure-transfer.md) enabled and the incorrect [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme) is being used.

* A cluster was created with a storage account that had secure transfer *disabled*. Thereafter, secure transfer was enabled on the storage account.

## Resolution

If secure transfer is enabled for Azure Storage or Data Lake Storage Gen2, the URI would be `wasbs://` or `abfss://`, respectively.  See also, [secure transfer](../../storage/common/storage-require-secure-transfer.md).

For new clusters, use a storage account that already has the desired secure transfer setting. Do not change the secure transfer setting for a storage account that is in use by an existing cluster.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
