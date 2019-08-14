---
title: Apache Ambari heartbeat issues in Azure HDInsight
description: Various reasons for Apache Ambari heartbeat issues in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.date: 08/02/2019
---

# Apache Ambari heartbeat issues in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Scenario: High CPU utilization

### Issue

Ambari agent has high CPU utilization, which results in alerts from Ambari UI that for some nodes the Ambari agent heartbeat is lost.

### Cause

Due to various ambari-agent bugs, in rare cases, your ambari-agent can have high (close to 100) percentage CPU utilization.

### Resolution

1. Identify process ID (pid) of ambari-agent:

    ```bash
    ps -ef | grep ambari_agent
    ```

1. Then run the following command to show CPU utilization:

    ```bash
    top -p <ambari-agent-pid>
    ```

1. Restart ambari-agent to mitigate issue:

    ```bash
    service ambari-agent restart
    ```

1. If restart does not work, kill the ambari-agent process and then start it up:

    ```bash
    kill -9 <ambari-agent-pid>
    service ambari-agent start
    ```

---

## Scenario: Ambari agent not started

### Issue

Ambari agent has not started which results in alerts from Ambari UI that for some nodes the Ambari agent heartbeat is lost.

### Cause

The alerts are caused by the Ambari agent not running.

### Resolution

1. Confirm status of ambari-agent:

    ```bash
    service ambari-agent status
    ```

1. Confirm if failover controller services are running:

    ```bash
    ps -ef | grep failover
    ```

    If failover controller services are not running, it is likely due to a problem prevent hdinsight-agent from starting failover controller. Check hdinsight-agent log from `/var/log/hdinsight-agent/hdinsight-agent.out` file.

---

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
