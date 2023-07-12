---
title: Troubleshoot Apache Spark in Azure HDInsight
description: Get answers to common questions about working with Apache Spark and Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 03/20/2023
ms.custom: seodec18
---

# Troubleshoot Apache Spark by using Azure HDInsight

Learn about the top issues and their resolutions when working with Apache Spark payloads in [Apache Ambari](https://ambari.apache.org/).

## How do I configure an Apache Spark application by using Apache Ambari on clusters?

Spark configuration values can be tuned help avoid an Apache Spark application `OutofMemoryError` exception. The following steps show default Spark configuration values in Azure HDInsight:

1. Log in to Ambari at `https://CLUSTERNAME.azurehdidnsight.net` with your cluster credentials. The initial screen displays an overview dashboard. There are slight cosmetic differences between HDInsight 4.0.

1. Navigate to **Spark2** > **Configs**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config2.png" alt-text="Select the Configs tab" border="true":::

1. In the list of configurations, select and expand **Custom-spark2-defaults**.

1. Look for the value setting that you need to adjust, such as **spark.executor.memory**. In this case, the value of **9728m** is too high.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config4.png" alt-text="Select custom-spark-defaults" border="true":::

1. Set the value to the recommended setting. The value **2048m** is recommended for this setting.

1. Save the value, and then save the configuration. Select **Save**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config6a.png" alt-text="Change value to 2048m" border="true":::

    Write a note about the configuration changes, and then select **Save**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config6c.png" alt-text="Enter a note about the changes you made" border="true":::

    You're notified if any configurations need attention. Note the items, and then select **Proceed Anyway**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config6b.png" alt-text="Select Proceed Anyway" border="true":::

1. Whenever a configuration is saved, you're prompted to restart the service. Select **Restart**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config7a.png" alt-text="Select restart" border="true":::

    Confirm the restart.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config7b.png" alt-text="Select Confirm Restart All" border="true":::

    You can review the processes that are running.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config7c.png" alt-text="Review running processes" border="true":::

1. You can add configurations. In the list of configurations, select **Custom-spark2-defaults**, and then select **Add Property**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config8.png" alt-text="Select add property" border="true":::

1. Define a new property. You can define a single property by using a dialog box for specific settings such as the data type. Or, you can define multiple properties by using one definition per line.

    In this example, the **spark.driver.memory** property is defined with a value of **4g**.

    :::image type="content" source="./media/apache-troubleshoot-spark/apache-spark-ambari-config9.png" alt-text="Define new property" border="true":::

1. Save the configuration, and then restart the service as described in steps 6 and 7.

These changes are cluster-wide but can be overridden when you submit the Spark job.

## How do I configure an Apache Spark application by using a Jupyter Notebook on clusters?

In the first cell of the Jupyter Notebook, after the **%%configure** directive, specify the Spark configurations in valid JSON format. Change the actual values as necessary:

:::image type="content" source="./media/apache-troubleshoot-spark/add-configuration-cell.png" alt-text="Add a configuration" border="true":::

## How do I configure an Apache Spark application by using Apache Livy on clusters?

Submit the Spark application to Livy by using a REST client like cURL. Use a command similar to the following. Change the actual values as necessary:

```apache
curl -k --user 'username:password' -v -H 'Content-Type: application/json' -X POST -d '{ "file":"wasb://container@storageaccountname.blob.core.windows.net/example/jars/sparkapplication.jar", "className":"com.microsoft.spark.application", "numExecutors":4, "executorMemory":"4g", "executorCores":2, "driverMemory":"8g", "driverCores":4}'  
```

## How do I configure an Apache Spark application by using spark-submit on clusters?

Launch spark-shell by using a command similar to the following. Change the actual value of the configurations as necessary:

```apache
spark-submit --master yarn-cluster --class com.microsoft.spark.application --num-executors 4 --executor-memory 4g --executor-cores 2 --driver-memory 8g --driver-cores 4 /home/user/spark/sparkapplication.jar
```

### Extra reading

[Apache Spark job submission on HDInsight clusters](/archive/blogs/azuredatalake/spark-job-submission-on-hdinsight-101)

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* [Spark memory management overview](https://spark.apache.org/docs/latest/tuning.html#memory-management-overview).

* [Debugging Spark application on HDInsight clusters](/archive/blogs/azuredatalake/spark-debugging-101).

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
