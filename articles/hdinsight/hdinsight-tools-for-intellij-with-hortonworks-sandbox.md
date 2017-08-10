---
title: Use Azure Toolkit for IntelliJ with the Hortonworks Sandbox | Microsoft Docs
description: Learn how to use HDInsight Tools in Azure Toolkit for IntelliJ with the Hortonworks Sandbox.
keywords: hadoop tools,hive query,intellij,hortonworks sandbox,azure toolkit for intellij
services: HDInsight
documentationcenter: ''
tags: azure-portal
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: b587cc9b-a41a-49ac-998f-b54d6c0bdfe0
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/25/2017
ms.author: jgao

---
# Use HDInsight Tools for IntelliJ with Hortonworks Sandbox

Learn how to use HDInsight Tools for IntelliJ to develop Apache Scala applications and then test the applications on [Hortonworks Sandbox](http://hortonworks.com/products/sandbox/) running on your workstation. 

[IntelliJ IDEA](https://www.jetbrains.com/idea/) is a Java-integrated development environment (IDE) for developing computer software. After you have developed and tested your applications on Hortonworks Sandbox, you can move them to [Azure HDInsight](hdinsight-hadoop-introduction.md).

## Prerequisites

Before you begin this tutorial, you must have:

- Hortonworks Data Platform (HDP) 2.4 on Hortonworks Sandbox running on your local environment. To configure it, see [Get started in the Hadoop ecosystem with a Hadoop sandbox on a virtual machine](hdinsight-hadoop-emulator-get-started.md). 
    >[!NOTE]
    >HDInsight Tools for IntelliJ has been tested only with HDP 2.4. To get it, expand **Hortonworks Sandbox Archive** from the [Hortonworks Sandbox download site](http://hortonworks.com/downloads/#sandbox).

- [Java Developer Kit (JDK) version 1.8 or later](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). JDK is required by the Azure Toolkit for IntelliJ.

- [IntelliJ IDEA community edition](https://www.jetbrains.com/idea/download) with the [Scala](https://plugins.jetbrains.com/idea/plugin/1347-scala) plug-in and the [Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij.md) plug-in. HDInsight Tools for IntelliJ is available as a part of the Azure Toolkit for IntelliJ. 

  To install the plug-ins, do the following:

  1. Open IntelliJ IDEA.
  2. On the **Welcome** screen, select **Configure**, and then select **Plugins**.
  3. Select **Install JetBrains plugin** in the lower-left corner.
  4. Use the search function to search for **Scala**, and then select **Install**.
  5. Select **Restart IntelliJ IDEA** to complete the installation.
  6. Repeat step 4 and 5 to install the **Azure Toolkit for IntelliJ**. For more information, see [Install the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-installation.md).

## Create a Spark Scala application

In this section, you create a sample scala project by using IntelliJ IDEA. In the next section, you link IntelliJ IDEA to the Hortonworks Sandbox (emulator) before you submit the project.

1. Open IntelliJ IDEA from your workstation.

2. Select **Create New Project**.

3. Select **HDInsight** > **Spark on HDInsight(Scala)**, and then select **Next**.

    ![Create IntelliJ Scala project](./media/hdinsight-tools-for-intellij-with-hortonworks-sandbox/intellij-create-scala-project.png)
    - Build tool: Scala project creation wizard support Maven or SBT managing the dependencies and building for scala project. You select one according to need.
4. Enter the following information:

    ![Create IntelliJ Scala project properties](./media/hdinsight-tools-for-intellij-with-hortonworks-sandbox/intellij-create-scala-project-properties.png)

    - **Project name**: Provide a project name.
    - **Project location**: Provide a project location.
    - **Project SDK**: Select **New**, select **JDK**, and then specify the folder of Java JDK version 7 or later. Use Java 1.8 for spark 2.x cluster, Java 1.7 for spark 1.x cluster. The default location is C:\Program Files\Java\jdk1.8.x_xxx.
    - **Spark Version**: Scala project creation wizard integrates proper version for Spark SDK and Scala SDK. If the spark cluster version is lower 2.0, choose spark 1.x. Otherwise, you should select spark2.x. This example uses Spark1.6.2(Scala 2.10.5). Also please make sure you are using the repository marked as Scala 2.10.x - do not use the repository marked as Scala 2.11.x)
5. Select **Finish**.
6. Press **[ALT]+1** to open the Project view if it is not opened.
7. From **Project Explorer**, expand the project, and then select **src**.
8. Right-click **src**, point to **New**, and then select **Scala class**.
9. Enter a name, select **Object** in **Kind**, and then select **OK**.

    ![Create new IntelliJ Scala class](./media/hdinsight-tools-for-intellij-with-hortonworks-sandbox/intellij-create-new-scala-class.png)
10. In the .scala file, paste the following code:

        import java.util.Random
        import org.apache.spark.{SparkConf, SparkContext}
        import org.apache.spark.SparkContext._

        /**
        * Usage: GroupByTest [numMappers] [numKVPairs] [valSize] [numReducers]
        */
        object GroupByTest {
            def main(args: Array[String]) {
                val sparkConf = new SparkConf().setAppName("GroupBy Test")
                var numMappers = 3
                var numKVPairs = 10
                var valSize = 10
                var numReducers = 2

                val sc = new SparkContext(sparkConf)

                val pairs1 = sc.parallelize(0 until numMappers, numMappers).flatMap { p =>
                val ranGen = new Random
                var arr1 = new Array[(Int, Array[Byte])](numKVPairs)
                for (i <- 0 until numKVPairs) {
                    val byteArr = new Array[Byte](valSize)
                    ranGen.nextBytes(byteArr)
                    arr1(i) = (ranGen.nextInt(Int.MaxValue), byteArr)
                }
                arr1
                }.cache
                // Enforce that everything has been calculated and in cache
                pairs1.count

                println(pairs1.groupByKey(numReducers).count)
            }
        }

11. On the **Build** menu, select **Build project**. Make sure the compilation is completed successfully.


## Link to the HortonWorks Sandbox

You need to have an existing IntelliJ application before you can link to a Hortonworks Sandbox(emulator).

**To link to an emulator**

1. Open the project in IntelliJ if it is not opened yet.
2. From the **View** menu, select **Tools Windows**, and then select **Azure Explorer**.
3. Expand **Azure**, right-click **HDInsight**, and then select **Link an Emulator**.
4. Enter the password you have configured for the root account of the Hortonworks Sandbox, and the rest of the values simliar to the following screenshot, and then select **OK**. 

  ![IntelliJ link an emulator](./media/hdinsight-tools-for-intellij-with-hortonworks-sandbox/intellij-link-an-emulator.png)

5. Select **Yes** to configure the emulator.

  When it is connected successfully, you can see the emulator (Hortonworks Sandbox) listed under the HDInsight node.

## Submit the Spark Scala application to the Sandbox

After you have linked the IntelliJ IDEA to the emulator, you can submit your project.

**To submit a project to an emulator**

1. From the **Project explorer**, right-click the project, and then select **Submit Spark application to HDInsight**.
2. Specify the following fields:

    - **Spark cluster (Linux only)**: Select your local Hortonworks Sandbox.
    - **Main class name**: Choose or enter the main class name.  For this tutorial, it is **GroupByTest**.
3. Select **Submit**. The job submission logs are shown in the Spark submission tool window.

## Next steps

- To learn how to create Spark applications for HDInsight using HDInsight Tools for IntelliJ, see [Use HDInsight Tools in Azure Toolkit for IntelliJ to create Spark applications for HDInsight Spark Linux cluster](hdinsight-apache-spark-intellij-tool-plugin.md).
- To watch a video of HDInsight Tools for IntelliJ, see [Introduce HDInsight Tools for IntelliJ for Spark Development](https://www.youtube.com/watch?v=YTZzYVgut6c).
- To learn how to debug Spark applications using the toolkit remotely on HDInsight through SSH, see [Remotely debug Spark applications on an HDInsight cluster with Azure Toolkit for IntelliJ through SSH](hdinsight-apache-spark-intellij-tool-debug-remotely-through-ssh.md).
- To learn how to debug Spark applications using the toolkit remotely on HDInsight through VPN, see [Use HDInsight Tools in Azure Toolkit for IntelliJ to debug Spark applications remotely on HDInsight Spark Linux cluster](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md).
- To learn how to use HDInsight Tools for Eclipse to create Spark application, see [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](hdinsight-apache-spark-eclipse-tool-plugin.md).
- To watch a video of HDInsight Tools for Eclipse, see [Use HDInsight Tool for Eclipse to create Spark applications](https://mix.office.com/watch/1rau2mopb6fha).