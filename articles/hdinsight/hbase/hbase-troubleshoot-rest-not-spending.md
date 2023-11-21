---
title: Apache HBase REST not responding to requests in Azure HDInsight
description: Resolve issue with Apache HBase REST not responding to requests in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 11/21/2023
---

# Scenario: Apache HBase REST not responding to requests in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The Apache HBase REST service does not respond to requests in Azure HDInsight.

## Cause

The possible cause here could be Apache HBase REST service is leaking sockets, which is especially common when the service has been running for a long time (for example, months). From the client SDK, you may see an error message similar to:

```
System.Net.WebException : Unable to connect to the remote server --->
System.Net.Sockets.SocketException : A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond 10.0.0.19:8090
```

## Resolution

Restart HBase REST using the below command after SSHing to the host. You can also use script actions to restart this service on all worker nodes:

```bash
sudo /usr/hdp/current/hbase-master/bin/hbase-daemon.sh restart rest
```

If the issue still persists, you can install the following mitigation script as a CRON job that runs every 5 minutes on every worker node. This mitigation script pings the REST service and restarts it in case the REST service does not respond.

```bash
#!/bin/bash
nc localhost 8090 < /dev/null
if [ $? -ne 0 ]
    then
    echo "RESTServer is not responding. Restarting"
    sudo /usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh restart rest
fi
```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
