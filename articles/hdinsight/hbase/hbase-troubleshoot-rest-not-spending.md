---
title: Apache HBase REST not responding to requests in Azure HDInsight
description: Resolve issue with Apache HBase REST not responding to requests in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/01/2019
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
sudo service hdinsight-hbrest restart
```

This command will stop HBase Region Server on the same host. You can either manually start HBase Region Server through Ambari, or let Ambari auto restart functionality recover HBase Region Server automatically.

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

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
