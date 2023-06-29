---
title: Unable to read Apache Yarn log in Azure HDInsight
description: Troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/26/2023
---

# Scenario: Unable to read Apache Yarn log in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The Apache Yarn logs found from storage account isn't human-readable. The file parser doesn't work and produces the following error message:

```
java.io.IOException: Not a valid BCFile.
```

## Cause

The Apache Yarn log is aggregated into `IndexFile` format, which is not supported by the file parser.

## Resolution

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

1. From Ambari UI, navigate to **YARN** > **Configs** > **Advanced** > **Advanced yarn-site**.

1. For WASB storage: The default value for `yarn.log-aggregation.file-formats` is `IndexedFormat,TFile`. Change the value to `TFile`.

1. For ADLS storage: The default value for `yarn.nodemanager.log-aggregation.compression-type` is `gz`. Change the value to `none`.

1. Save the change and restart all affected services.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
