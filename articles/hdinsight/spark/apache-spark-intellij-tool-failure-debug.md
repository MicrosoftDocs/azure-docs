---
title: 'Debug Spark job with IntelliJ Azure Toolkit (preview) - HDInsight'
description: Guidance using HDInsight Tools in Azure Toolkit for IntelliJ to debug applications
keywords: debug remotely intellij, remote debugging intellij, ssh, intellij, hdinsight, debug intellij, debugging
ms.service: azure-hdinsight
ms.custom: hdinsightactive, devx-track-extended-java
ms.topic: conceptual
ms.date: 07/12/2024
---

# Failure spark job debugging with Azure Toolkit for IntelliJ (preview)

This article provides step-by-step guidance on how to use HDInsight Tools in [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij) to run **Spark Failure Debug** applications.

## Prerequisites

* [Oracle Java Development kit](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). This tutorial uses Java version 8.0.202.
  
* IntelliJ IDEA. This article uses [IntelliJ IDEA Community 2019.1.3](https://www.jetbrains.com/idea/download/#section=windows).
  
* Azure Toolkit for IntelliJ. See [Installing the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/installation).

* Connect to your HDInsight cluster. See [Connect to your HDInsight cluster](apache-spark-intellij-tool-plugin.md).

* Microsoft Azure Storage Explorer. See [Download Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Create a project with debugging template

Create a spark2.3.2 project to continue failure debug, take failure task​ debugging sample file in this document.

1. Open IntelliJ IDEA. Open the **New Project** window.

   a. Select **Azure Spark/HDInsight** from the left pane.

   b. Select **Spark Project with Failure Task Debugging Sample(Preview)(Scala)** from the main window.

     :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-create-projectfor-failure-debug.png" alt-text="IntelliJ Create a debug project." border="true":::

   c. Select **Next**.

2. In the **New Project** window, do the following steps:

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-create-new-project.png" alt-text="IntelliJ New Project select Spark version." border="true":::

   a. Enter a project name and project location.

   b. In the **Project SDK** drop-down list, select **Java 1.8** for **Spark 2.3.2** cluster.

   c. In the **Spark Version** drop-down list, select **Spark 2.3.2(Scala 2.11.8)**.

   d. Select **Finish**.

3. Select **src** > **main** > **scala** to open your code in the project. This example uses the **AgeMean_Div()** script.

## Run a Spark ​Scala/Java application on an HDInsight cluster

Create a spark Scala​/Java application, then run the application on a Spark cluster by doing the following steps:

1. Click **Add Configuration** to open **Run/Debug Configurations** window.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-add-new-configuration.png" alt-text="HDI IntelliJ Add configuration." border="true":::

2. In the **Run/Debug Configurations** dialog box, select the plus sign (**+**). Then select the **Apache Spark on HDInsight** option.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-create-new-configuraion-01.png" alt-text="IntelliJ Add new configuration." border="true":::

3. Switch to **Remotely Run in Cluster** tab. Enter information for **Name**, **Spark cluster**, and **Main class name**. Our tools support debug with **Executors**. The **numExecutors**, the default value is 5, and you'd better not set higher than 3. To reduce the run time, you can add **spark.yarn.maxAppAttempts** into **job Configurations** and set the value to 1. Click **OK** button to save the configuration.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-create-new-configuraion-002.png" alt-text="IntelliJ Run debug configurations new." border="true":::

4. The configuration is now saved with the name you provided. To view the configuration details, select the configuration name. To make changes, select **Edit Configurations**.

5. After you complete the configurations settings, you can run the project against the remote cluster.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-local-run-configuration.png" alt-text="IntelliJ Debug Remote Spark Job Remote run button." border="true":::

6. You can check the application ID from the output window.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-remotely-run-result.png" alt-text="IntelliJ Debug Remote Spark Job Remote run result." border="true":::

## Download failed job profile

​If the job submission fails, you could download the failed job profile to the local machine for further debugging.

1. Open **Microsoft Azure Storage Explorer**, locate the HDInsight account of the cluster for the failed job, download the failed job resources from the corresponding location: **\hdp\spark2-events\\.spark-failures\\\<application ID>** to a local folder.​ The **activities** window will show the download progress.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-find-spark-file-001.png" alt-text="Azure Storage Explorer download failure." border="true":::

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/spark-on-cosmos-doenload-file-2.png" alt-text="Azure Storage Explorer download success." border="true":::

## Configure local debugging environment and debug on failure​​

1. Open the original project​ or create a new project and associate it with the original source code​.​ Only spark2.3.2 version is supported for failure debugging currently.

1. In IntelliJ IDEA, create a **Spark Failure Debug** config file, select the FTD file from the previously downloaded failed job resources for the **Spark Job Failure Context location** field.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/hdinsight-create-failure-configuration-01.png" alt-text="crete failure configuration." border="true":::

1. Click the local run button in the toolbar, the error will display in Run window.

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/local-run-failure-configuraion-01.png" alt-text="run-failure-configuration1." border="true":::

   :::image type="content" source="./media/apache-spark-intellij-tool-failure-debug/local-run-failure-configuration.png" alt-text="run-failure-configuration2." border="true":::

1. Set break point as the log indicates, then click local debug button to do local debugging just as your normal Scala / Java projects in IntelliJ.

1. After debugging, ​if the project completes successfully​​​, ​you could resubmit the failed job to your spark on HDInsight cluster.

## <a name="seealso"></a>Next steps

* [Overview: Debug Apache Spark applications](apache-spark-intellij-tool-debug-remotely-through-ssh.md)

### Scenarios

* [Apache Spark with BI: Do interactive data analysis by using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to analyze building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Apache Spark in HDInsight](./apache-spark-custom-library-website-log-analysis.md)

### Create and run applications

* [Create a standalone application using Scala](./apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](apache-spark-livy-rest-interface.md)

### Tools and extensions

* [Use Azure Toolkit for IntelliJ to create Apache Spark applications for an HDInsight cluster](apache-spark-intellij-tool-plugin.md)
* [Use Azure Toolkit for IntelliJ to debug Apache Spark applications remotely through VPN](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Apache Spark applications](./apache-spark-eclipse-tool-plugin.md)
* [Use Apache Zeppelin notebooks with an Apache Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter Notebook in the Apache Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter Notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Manage resources

* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
