---
title: Apache Ambari heartbeat issues in Azure HDInsight
description: Review of various reasons for Apache Ambari heartbeat issues in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/10/2023
---

# Apache Ambari heartbeat issues in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Scenario: High CPU utilization

### Issue

Ambari agent has high CPU utilization, which results in alerts from Ambari UI that for some nodes the Ambari agent heartbeat is lost. The heartbeat lost alert is usually transient.

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

Ambari agent hasn't started which results in alerts from Ambari UI that for some nodes the Ambari agent heartbeat is lost.

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

    If failover controller services aren't running, it's likely due to a problem prevent hdinsight-agent from starting failover controller. Check hdinsight-agent log from `/var/log/hdinsight-agent/hdinsight-agent.out` file.

## Scenario: Heartbeat lost for Ambari

### Issue

Ambari heartbeat agent was lost.

### Cause

OMS logs are causing high CPU utilization.

### Resolution

* Disable Azure Monitor logging using the [Disable-AzHDInsightMonitoring](/powershell/module/az.hdinsight/disable-azhdinsightmonitoring) PowerShell cmdlet.
* Delete the `mdsd.warn` log file

---

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
