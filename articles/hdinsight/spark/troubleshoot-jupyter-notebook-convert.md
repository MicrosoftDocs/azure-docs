---
title: Unable to create Jupyter Notebook in Azure HDInsight
description: Learn about the troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 02/27/2023
---

# Unable to create Jupyter Notebook in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

When starting a Jupyter Notebook, you receive an error message that contains:

```error
Cannot convert notebook to v5 because that version doesn't exist
```

## Cause

A version mismatch.

## Resolution

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Open `_version.py` by executing the following command:

    ```bash
    sudo nano /usr/bin/anaconda/lib/python2.7/site-packages/nbformat/_version.py
    ```

1. Change **5** to **4** so the modified line appears as follows:

    ```python
    version_info = (4, 0, 3)
    ```

    Save changes by entering **Ctrl + X**, **Y**, **Enter**.

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/JUPYTER`, where `CLUSTERNAME` is the name of your cluster.

1. Restart the Jupyter service.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
