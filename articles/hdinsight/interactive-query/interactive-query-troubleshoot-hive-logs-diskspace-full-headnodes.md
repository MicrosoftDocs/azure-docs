---
title: Apache Hive Logs filling up disk space - Azure HDInsight
description: The Apache Hive logs are filling up the disk space on the head nodes in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
author: nisgoel
ms.author: nisgoel
ms.reviewer: jasonh
ms.date: 03/05/2020
---

# Scenario: Apache Hive logs are filling up the disk space on the Head nodes in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues related to not enough disk space on the head nodes in Azure HDInsight clusters.

## Issue

On an Apache Hive/LLAP cluster, unwanted logs are taking up the entire disk space on the head nodes. Due to which, following issues could be seen.

1. SSH access fails because of no space is left on the head node.
2. Ambari gives *HTTP ERROR: 503 Service Unavailable*.

The `ambari-agent` logs would show the following when the issue happens.
```
ambari_agent - Controller.py - [54697] - Controller - ERROR - Error:[Errno 28] No space left on device
```
```
ambari_agent - HostCheckReportFileHandler.py - [54697] - ambari_agent.HostCheckReportFileHandler - ERROR - Can't write host check file at /var/lib/ambari-agent/data/hostcheck.result
```

## Cause

In advanced Hive-log4j configurations, the parameter *log4j.appender.RFA.MaxBackupIndex* is omitted. It causes endless generation of log files.

## Resolution

1. Navigate to Hive component summary on the Ambari portal and click on `Configs` tab.

2. Go to the `Advanced hive-log4j` section within Advanced settings.

3. Set `log4j.appender.RFA` parameter as RollingFileAppender. 

4. Set `log4j.appender.RFA.MaxFileSize` and `log4j.appender.RFA.MaxBackupIndex` as follows.

```
log4jhive.log.maxfilesize=1024MB
log4jhive.log.maxbackupindex=10

log4j.appender.RFA=org.apache.log4j.RollingFileAppender
log4j.appender.RFA.File=${hive.log.dir}/${hive.log.file}
log4j.appender.RFA.MaxFileSize=${log4jhive.log.maxfilesize}
log4j.appender.RFA.MaxBackupIndex=${log4jhive.log.maxbackupindex}
log4j.appender.RFA.layout=org.apache.log4j.PatternLayout
log4j.appender.RFA.layout.ConversionPattern=%d{ISO8601} %-5p [%t] %c{2}: %m%n
```
5. Set `hive.root.logger` to `INFO,RFA` as follows. The default setting is DEBUG, which makes logs become very large.

```
# Define some default values that can be overridden by system properties
hive.log.threshold=ALL
hive.root.logger=INFO,RFA
hive.log.dir=${java.io.tmpdir}/${user.name}
hive.log.file=hive.log
```

6. Save the configs and restart the required components.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
