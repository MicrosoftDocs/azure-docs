---
title: Issues with JDBC/ODBC & Apache Thrift framework - Azure HDInsight
description: Unable to download large data sets using JDBC/ODBC and Apache Thrift software framework in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/20/2023
---

# Unable to download large data sets using JDBC/ODBC and Apache Thrift software framework in HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

When trying to download large data sets using JDBC/ODBC and the Apache Thrift software framework in Azure HDInsight, you receive an error message similar as follows:

```
org.apache.spark.SparkException: Kryo serialization failed:
Buffer overflow. Available: 0, required: 36518. To avoid this, increase spark.kryoserializer.buffer.max value.
```

## Cause

This exception is caused by the serialization process trying to use more buffer space than is allowed. In Spark 2.0.0, the class `org.apache.spark.serializer.KryoSerializer` is used for serializing objects when data is accessed through the Apache Thrift software framework. A different class is used for data that will be sent over the network or cached in serialized form.

## Resolution

Increase the `Kryoserializer` buffer value. Add a key named `spark.kryoserializer.buffer.max` and set it to `2047` in spark2 config under `Custom spark2-thrift-sparkconf`. Restart all affected components.

> [!IMPORTANT]
> The value for `spark.kryoserializer.buffer.max` must be less than 2048. Fractional values are not supported.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
