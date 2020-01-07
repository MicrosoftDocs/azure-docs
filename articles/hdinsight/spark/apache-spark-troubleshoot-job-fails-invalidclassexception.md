---
title: InvalidClassException error from Apache Spark - Azure HDInsight
description: Apache Spark job fails with InvalidClassException, class version mismatch, in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
---

# Apache Spark job fails with InvalidClassException, class version mismatch, in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

You try to create an Apache Spark job in a Spark 2.x cluster. It fails with an error similar to the following:

```
18/09/18 09:32:26 WARN TaskSetManager: Lost task 0.0 in stage 1.0 (TID 1, wn7-dev-co.2zyfbddadfih0xdq0cdja4g.ax.internal.cloudapp.net, executor 4): java.io.InvalidClassException:
org.apache.commons.lang3.time.FastDateFormat; local class incompatible: stream classdesc serialVersionUID = 2, local class serialVersionUID = 1
        at java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:699)
        at java.io.ObjectInputStream.readNonProxyDesc(ObjectInputStream.java:1885)
        at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1751)
        at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:2042)
        at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1573)
```

## Cause

This error can be caused by adding an additional jar to the `spark.yarn.jars` config, specifically a shaded jar that includes a different version of the `commons-lang3` package and introduces a class mismatch. By default, Spark 2.1/2/3 uses version 3.5 of `commons-lang3`.

> [!TIP]
> To shade a library is to put its contents into your own jar, changing its package. This differs from packaging the library, which is putting the library into your own jar without repackaging.

## Resolution

Either remove the jar, or recompile the customized jar (AzureLogAppender) and use [maven-shade-plugin](https://maven.apache.org/plugins/maven-shade-plugin/examples/class-relocation.html) to relocate classes.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
