---
title: Use Azure Toolkit for IntelliJ to create Scala applications for Spark | Microsoft Docs
description: Use HDInsight Tools in Azure Toolkit for IntelliJ to develop Spark applications written in Scala and submit them to an HDInsight Spark cluster.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 73304272-6c8b-482e-af7c-cd25d95dab4d
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: nitinme

---
# Use Azure Toolkit for IntelliJ to create Spark applications for HDInsight cluster

Use HDInsight Tools in Azure Toolkit for IntelliJ to develop Spark applications written in Scala and submit them to an HDInsight Spark cluster, directly from them the IntelliJ IDE. You can use the HDInsight Tools plugin in a few different ways:

* To develop and submit a Scala Spark application on an HDInsight Spark cluster
* To access your Azure HDInsight Spark cluster resources
* To develop and run a Scala Spark application locally

You can also follow a video [here](https://mix.office.com/watch/1nqkqjt5xonza) to get you started.

> [!IMPORTANT]
> This tool can be used to create and submit applications only for an HDInsight Spark cluster on Linux.
> 
> 

## Prerequisites
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).
* Oracle Java Development kit. You can install it from [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
* IntelliJ IDEA. This article uses version 15.0.1. You can install it from [here](https://www.jetbrains.com/idea/download/).

## Install HDInsight Tools in Azure Toolkit for IntelliJ
HDInsight tools for IntelliJ are available as part of the Azure Toolkit for IntelliJ. For instructions on how to install the Azure Toolkit, see [Installing the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-installation.md).

## Log into your Azure subscription
1. Launch the IntelliJ IDE and open the Azure Explorer. From the **View** menu in the IDE, click **Tool Windows** and then click **Azure Explorer**.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/show-azure-explorer.png)
2. Right-click the **Azure** node in the **Azure Explorer**, and then click **Sign In**.
3. In the **Azure Sign In** dialog box, click **Sign In** and enter your Azure credentials.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/view-explorer-2.png)
4. After you are logged in, the **Select Subscriptions** dialog box lists all the Azure subscriptions associated with the credentials. Click **Select** in the dialog box to close.

    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/Select-Subscriptions.png)
5. In the **Azure Explorer** tab, expand **HDInsight** to see the HDInsight Spark clusters under your subscription.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/view-explorer-3.png)
6. You can further expand a cluster name node to see the resources (e.g. storage accounts) associated with the cluster.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/view-explorer-4.png)

## Run a Spark Scala application on an HDInsight Spark cluster
1. Launch IntelliJ IDEA and create a project. In the new project dialog box, make the following choices, and then click **Next**.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/create-hdi-scala-app.png)
   
   * From the left pane, select **HDInsight**.
   * From the right pane, select **Spark on HDInsight (Scala)**.
   * Click **Next**.
2. In the next window, provide the project details.
   
   * Provide a project name and project location.
   * For **Project SDK**, Java 1.8 for Spark1.6 and Spark 2.0 cluster.
   * For **Scala SDK**, click **Create**, click **Download**, and then select the version of Scala to use.
   * * Choose **JDK 1.8 and Scala 2.11.x** if you're willing to submit job to Spark 2.0 cluster.
   * * Choose **JDK 1.8(language level 7) and Scala 2.10.x** if you're willing to submit job to Spark 1.6 cluster.

        ![](./media/hdinsight-apache-spark-intellij-tool-plugin/show-scala2.11.x-select.png)
   * For **Spark SDK**, download and use the SDK from [here] (http://go.microsoft.com/fwlink/?LinkID=723585&clcid=0x409)(spark-assembly-2.0.0-hadoop2.7.0-SNAPSHOT.jar is for Spark 2.0 cluster and spark-assembly-1.6.1.2.4.2.0-258-hadoop2.7.1.2.4.2.0-258.jar is for Spark 1.6 cluster). You can also use the [Spark Maven repository](http://mvnrepository.com/search?q=spark) instead, however make sure you have the right maven repository installed to develop your Spark applications. (For example, make sure you have the Spark Streaming part installed if you are using Spark Streaming. Also make sure you are using the repository marked as Scala 2.10 for Spark 1.6 cluster and marked as Scala 2.11 for Spark 2.0 cluster.)
     
       ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-project-details.png)
   * Click **Finish**.
3. The Spark project automatically creates an artifact for you. To see the artifact, follow these steps.
   
   1. From the **File** menu, click **Project Structure**.
   2. In the **Project Structure** dialog box, click **Artifacts** to see the default artifact that is created.
      
       ![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin/default-artifact.png)
      
      You can also create your own artifact by clicking the **+** icon as highlighted in the image above.
4. In the **Project Structure** dialog box, click **Project**. If the **Project SDK** is set to 1.8, make sure the **Project language level** is set to **7 - Diamonds, ARM, multi-catch, etc**(It's optional for Spark 2.0 cluster).
   
    ![Set project language level](./media/hdinsight-apache-spark-intellij-tool-plugin/set-project-language-level.png)
5. Add your application source code.
   
   1. From the **Project Explorer**, right-click **src**, point to **New**, and then click **Scala class**.
      
       ![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-scala-code.png)
   2. In the **Create New Scala Class** dialog box, provide a name, for **Kind** select **Object**, and then click **OK**.
      
       ![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-scala-code-object.png)
   3. In the **MyClusterApp.scala** file, paste the following code. This code reads the data from the HVAC.csv (available on all HDInsight Spark clusters), retrieves the rows that only have one digit in the seventh column in the CSV, and writes the output to **/HVACOut** under the default storage container for the cluster.

            import org.apache.spark.SparkConf
            import org.apache.spark.SparkContext

            object MyClusterApp{
              def main (arg: Array[String]): Unit = {
                val conf = new SparkConf().setAppName("MyClusterApp")
                val sc = new SparkContext(conf)

                val rdd = sc.textFile("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")

                //find the rows which have only one digit in the 7th column in the CSV
                val rdd1 =  rdd.filter(s => s.split(",")(6).length() == 1)

                rdd1.saveAsTextFile("wasbs:///HVACOut")
              }

            }

1. Run the application on an HDInsight Spark cluster.
   
   1. From the **Project Explorer**, right-click the project name, and then select **Submit Spark Application to HDInsight**.
      
       ![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-1.png)
   2. You are prompted to enter your Azure subscription credentials. In the **Spark Submission** dialog box, provide the following values:
      
      * For **Spark clusters (Linux only)**, select the HDInsight Spark cluster on which you want to run your application.
      * You need either select an Artifact from the IntelliJ project, or select one from hard disk.
      * Against the **Main class name** text box, click the ellipsis (![ellipsis](./media/hdinsight-apache-spark-intellij-tool-plugin/ellipsis.png) ), select the main class in your application source code, and then click **OK**.
        
          ![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-3.png)
      * Because the application code in this example does not require any command-line arguments or reference JARs or files, you can leave the remaining text boxes empty.
      * After providing all the inputs, the dialog box should resemble as the following image.
        
          ![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-2.png)
      * Click **Submit**.
   3. The **Spark Submission** tab at the bottom of the window should start displaying the progress. You can also stop the application by clicking the red button in the "Spark Submission" window.
      
       ![Spark Application Result](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-app-result.png)
      
      In the Access and manage HDInsight Spark clusters... section, you learn how to access the job output using the HDInsight Tools in Azure Toolkit for IntelliJ.

## Choose ADLS as a Spark Scala application storage
* If you want to submit application to ADLS, you must choose **Interactive** mode during Azure Sign In process. 

    ![Sign In Interactive](./media/hdinsight-apache-spark-intellij-tool-plugin/authentication-interactive.png)

* If you submit for Automated mode, you get the following error:

    ![Sign In Error](./media/hdinsight-apache-spark-intellij-tool-plugin/authentication-error.png)

## Access and manage HDInsight Spark clusters using the HDInsight Tools in Azure Toolkit for IntelliJ
You can perform various operations using the HDInsight tools that are part of Azure Toolkit for IntelliJ.

### Access the job view directly from the HDInsight tools
1. From the **Azure Explorer**, expand **HDInsight**, expand the Spark cluster name, and then click **Jobs**.
2. In the right pane, the **Spark Job View** tab displays all the applications that were run on the cluster. Click the application name for which you want to see more details.
   
    ![Access job view](./media/hdinsight-apache-spark-intellij-tool-plugin/view-job-logs.png)
3. The boxes for **Error Message**, **Job Output**, **Livy Job Logs**, and **Spark Driver Logs** are populated based on the application you select.
4. You can also open the **Spark History UI** and the **YARN UI** (at the application level) by clicking the respective buttons at the top of the screen.

### Access the Spark History Server
1. From the **Azure Explorer**, expand **HDInsight**, right-click your Spark cluster name, and then select **Open Spark History UI**. When prompted, enter the admin credentials for the cluster. You must have specified these while provisioning the cluster.
2. In the Spark History Server dashboard, you can look for the application you just finished running by using the application name. In the code above, you set the application name using `val conf = new SparkConf().setAppName("MyClusterApp")`. Hence, your Spark application name was **MyClusterApp**.

### Launch the Ambari portal
From the **Azure Explorer**, expand **HDInsight**, right-click your Spark cluster name, and then select **Open Cluster Management Portal (Ambari)**. When prompted, enter the admin credentials, which have been specified during the cluster provisioning process, for the cluster.

### Manage Azure subscriptions
By default, the HDInsight tools list the Spark clusters from all your Azure subscriptions. If required, you can specify the subscriptions for which you want to access the cluster. From the **Azure Explorer**, right-click the **Azure** root node, and then click **Manage Subscriptions**. From the dialog box, clear the check boxes against the subscription that you do not want to access and then click **Close**. You can also click **Sign Out** if you want to log off from your Azure subscription.

## Run a Spark Scala application locally
You can use the HDInsight Tools in Azure Toolkit for IntelliJ to run Spark Scala applications locally on your workstation. Typically, such applications do not need access to cluster resources such as storage container and can be run and tested locally.

### Prerequisite
While running the local Spark Scala application on a Windows computer, you might get an exception as explained in [SPARK-2356](https://issues.apache.org/jira/browse/SPARK-2356) that occurs due to a missing WinUtils.exe on Windows. To work around this error, you must [download the executable from here](http://public-repo-1.hortonworks.com/hdp-win-alpha/winutils.exe) to a location like **C:\WinUtils\bin**, then add an environment variable **HADOOP_HOME** and set the value of the variable to **C\WinUtils**.

### Run a local Spark Scala application
1. Launch IntelliJ IDEA and create a project. In the new project dialog box, make the following choices, and then click **Next**.
   
    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-app-local-run.png)
   
   * From the left pane, select **HDInsight**.
   * From the right pane, select **Spark on HDInsight Local Run Sample (Scala)**.
   * Click **Next**.
2. In the next window, provide the project details.
   
   * Provide a project name and project location.
   * For **Project SDK**, make sure you provide a Java version greater than 7.
   * For **Scala SDK**, click **Create**, click **Download**, and then select the version of Scala to use.**Scala 2.11.x for Spark 2.0 and Scala 2.10.x for Spark 1.6**.
     
       ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-version.png)
   * For **Spark SDK**, download and use the SDK from [here](http://go.microsoft.com/fwlink/?LinkID=723585&clcid=0x409). You can also ignore this and use the [Spark Maven repository](http://mvnrepository.com/search?q=spark) instead, however please make sure you have the right maven repository installed to develop your Spark applications. (For example, you need to make sure you have the Spark Streaming part installed if you are using Spark Streaming; Also please make sure you are using the repository marked as Scala 2.10 for Spark 1.6 cluster and marked as Scala 2.11 for Spark 2.0 cluster.)
     
       ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-app-local-create-project.png)
   * Click **Finish**.
3. The template adds a sample code (**LogQuery**) under the **src** folder that you can run locally on your computer.
   
    ![Local Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/local-app.png)
4. Right click the **LogQuery** application, and then click **"Run 'LogQuery'"**. You see an output like the following in the **Run** tab at the bottom.
   
   ![Spark Application local run result](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-app-local-run-result.png)

## Convert existing IntelliJ IDEA applications to use the HDInsight Tools in Azure Toolkit for IntelliJ
You can also convert your existing Spark Scala applications created in IntelliJ IDEA to be compatible with the HDInsight Tools in Azure Toolkit for IntelliJ. This feature enables you to use the tool to submit the applications to an HDInsight Spark cluster. You can do so by performing the following steps:

1. For an existing Spark Scala application created using IntelliJ IDEA, open the associated .iml file.
2. At the root level, you see a **module** element like this:
   
        <module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4">
3. Edit the element to add `UniqueKey="HDInsightTool"` so that the **module** element looks like the following:
   
        <module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4" UniqueKey="HDInsightTool">
4. Save the changes. Your application should now be compatible with the HDInsight Tools in Azure Toolkit for IntelliJ. You can test it by right-clicking on the project name in the Project Explorer. The pop-up menu now has the option to **Submit Spark Application to HDInsight**.

## Troubleshooting
### "Please use a larger heap size" error in local run
In Spark 1.6, If you are using a 32-bit Java SDK during local run, you may encounter the following errors:

    Exception in thread "main" java.lang.IllegalArgumentException: System memory 259522560 must be at least 4.718592E8. Please use a larger heap size.
        at org.apache.spark.memory.UnifiedMemoryManager$.getMaxMemory(UnifiedMemoryManager.scala:193)
        at org.apache.spark.memory.UnifiedMemoryManager$.apply(UnifiedMemoryManager.scala:175)
        at org.apache.spark.SparkEnv$.create(SparkEnv.scala:354)
        at org.apache.spark.SparkEnv$.createDriverEnv(SparkEnv.scala:193)
        at org.apache.spark.SparkContext.createSparkEnv(SparkContext.scala:288)
        at org.apache.spark.SparkContext.<init>(SparkContext.scala:457)
        at LogQuery$.main(LogQuery.scala:53)
        at LogQuery.main(LogQuery.scala)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at com.intellij.rt.execution.application.AppMain.main(AppMain.java:144)

This is because the heap size is not large enough for Spark to run, since Spark requires at least 471MB (you can get more details from [SPARK-12081](https://issues.apache.org/jira/browse/SPARK-12081) if you want). One simple solution is to use a 64-bit Java SDK. You can also change the JVM settings in IntelliJ by adding the following options:

    -Xms128m -Xmx512m -XX:MaxPermSize=300m -ea

![Spark Application local run result](./media/hdinsight-apache-spark-intellij-tool-plugin/change-heap-size.png)

## Feedback & Known issues
Currently viewing Spark outputs directly is not supported and we are working on this feature.

If you have any suggestions or feedbacks, or if you encounter any problems when using this tool, feel free to drop us an email at hdivstool at microsoft dot com.

## <a name="seealso"></a>See also
* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)

### Scenarios
* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](hdinsight-apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)
* [Spark Streaming: Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-eventhub-streaming.md)
* [Website log analysis using Spark in HDInsight](hdinsight-apache-spark-custom-library-website-log-analysis.md)

### Create and run applications
* [Create a standalone application using Scala](hdinsight-apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)

### Tools and extensions
* [Use HDInsight Tools in Azure Toolkit for IntelliJ to debug Spark applications remotely](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](hdinsight-apache-spark-eclipse-tool-plugin.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-use-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](hdinsight-apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](hdinsight-apache-spark-job-debugging.md)

