---
title: 'Azure Toolkit for IntelliJ: Create Spark applications for an HDInsight cluster '
description: Use the Azure Toolkit for IntelliJ to develop Spark applications written in Scala, and submit them to an HDInsight Spark cluster.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/11/2018
ms.author: maxluk
---
# Use Azure Toolkit for IntelliJ to create Spark applications for an HDInsight cluster

Use the Azure Toolkit for IntelliJ plug-in to develop Spark applications written in Scala, and then submit them to an HDInsight Spark cluster directly from the IntelliJ integrated development environment (IDE). You can use the plug-in in a few ways:

* Develop and submit a Scala Spark application on an HDInsight Spark cluster.
* Access your Azure HDInsight Spark cluster resources.
* Develop and run a Scala Spark application locally.

To create your project, view the [Create Spark Applications with the Azure Toolkit for IntelliJ](https://channel9.msdn.com/Series/AzureDataLake/Create-Spark-Applications-with-the-Azure-Toolkit-for-IntelliJ) video.

> [!IMPORTANT]
> You can use this plug-in to create and submit applications only for an HDInsight Spark cluster on Linux.
> 

## Prerequisites

- An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).
- Oracle Java Development Kit. You can install it from the [Oracle website](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
- IntelliJ IDEA. This article uses version 2017.1. You can install it from the [JetBrains website](https://www.jetbrains.com/idea/download/).

## Install Azure Toolkit for IntelliJ
For installation instructions, see [Install Azure Toolkit for IntelliJ](https://docs.microsoft.com/azure/azure-toolkit-for-intellij-installation).

## Get Started
User can either [sign in to Azure subscription](#sign-in-to-your-azure-subscription), or [link a HDInsight cluster](#link-a-cluster) using Ambari username/password or domain joined credential to start.


## Sign in to your Azure subscription

1. Start the IntelliJ IDE, and open Azure Explorer. On the **View** menu, select **Tool Windows**, and then select **Azure Explorer**.
       
   ![The Azure Explorer link](./media/apache-spark-intellij-tool-plugin/show-azure-explorer.png)

1. Right-click the **Azure** node, and then select **Sign In**.

1. In the **Azure Sign In** dialog box, select **Sign in**, and then enter your Azure credentials.

    ![The Azure Sign In dialog box](./media/apache-spark-intellij-tool-plugin/view-explorer-2.png)

1. After you're signed in, the **Select Subscriptions** dialog box lists all the Azure subscriptions that are associated with the credentials. Select the **Select** button.

    ![The Select Subscriptions dialog box](./media/apache-spark-intellij-tool-plugin/Select-Subscriptions.png)

1. On the **Azure Explorer** tab, expand **HDInsight** to view the HDInsight Spark clusters that are in your subscription.
   
    ![HDInsight Spark clusters in Azure Explorer](./media/apache-spark-intellij-tool-plugin/view-explorer-3.png)

1. To view the resources (for example, storage accounts) that are associated with the cluster, you can further expand a cluster-name node.
   
    ![An expanded cluster-name node](./media/apache-spark-intellij-tool-plugin/view-explorer-4.png)

## Link a cluster
You can link a normal HDInsight cluster by using the Ambari managed username. Similarly, for a domain-joined HDInsight cluster, you can link by using the domain and username, such as user1@contoso.com. Also you can link Livy Service cluster.

1. Select **Link a cluster** from **Azure Explorer**.

   ![link cluster context menu](./media/apache-spark-intellij-tool-plugin/link-a-cluster-context-menu.png)

2. You have two options to link clusters. 

   * For linking HDInsight cluster, choose **HDInsight Cluster** in field **Cluster Info**, enter **Cluster Name/URL**, **User Name**, and **Password**.

      ![link hdinsight cluster dialog](./media/apache-spark-intellij-tool-plugin/link-hdinsight-cluster-dialog.png)

   * For linking Livy Service cluster, choose **Livy Service** in field **Cluster Info**, enter **Livy Endpoint**, **Cluster Name**. **Yarn Endpoint** is optional. In field **Authentication**, two options are provided. They are **Basic Authentication** and  **No Authentication**. When you select **Basic Authentication**, **User Name** and **Password** should be provided. You need check the username and password if got the authentication failure.
      
      ![link livy cluster dialog](./media/apache-spark-intellij-tool-plugin/link-livy-cluster-dialog.png)
   
3. You can see a Linked cluster in **HDInsight** node if the input information is right. Now you can submit an application to this linked cluster.

   ![linked cluster](./media/apache-spark-intellij-tool-plugin/linked-cluster.png)

4. You also can unlink a cluster from **Azure Explorer**.
   
   ![unlinked cluster](./media/apache-spark-intellij-tool-plugin/unlink.png)

## Create a Spark Scala application on an HDInsight Spark cluster

1. Start IntelliJ IDEA, and then create a project. In the **New Project** dialog box, follow below steps: 

   a. Select **HDInsight** > **Spark on HDInsight (Scala)**.

   b. In the **Build tool** list, select either of the following, according to your need:

      * **Maven**, for Scala project-creation wizard support
      * **SBT**, for managing the dependencies and building for the Scala project

    ![The New Project dialog box](./media/apache-spark-intellij-tool-plugin/create-hdi-scala-app.png)

1. Select **Next**.

1. The Scala project-creation wizard automatically detects whether you've installed the Scala plug-in. Select **Install**.

   ![Scala Plugin Check](./media/apache-spark-intellij-tool-plugin/Scala-Plugin-check-Reminder.PNG) 

1. To download the Scala plug-in, select **OK**. Follow the instructions to restart IntelliJ. 

   ![The Scala plugin installation dialog box](./media/apache-spark-intellij-tool-plugin/Choose-Scala-Plugin.PNG)

1. In the **New Project** window, do the following:  

    ![Selecting the Spark SDK](./media/apache-spark-intellij-tool-plugin/hdi-new-project.png)

   a. Enter a project name and location.

   b. In the **Project SDK** drop-down list, select **Java 1.8** for the Spark 2.x cluster, or select **Java 1.7** for the Spark 1.x cluster.

   c. In the **Spark version** drop-down list, Scala project creation wizard integrates the proper version for Spark SDK and Scala SDK. If the Spark cluster version is earlier than 2.0, select **Spark 1.x**. Otherwise, select **Spark2.x**. This example uses **Spark 2.0.2 (Scala 2.11.8)**.

1. Select **Finish**.

1. The Spark project automatically creates an artifact for you. To view the artifact, do the following:

   a. On the **File** menu, select **Project Structure**.

   b. In the **Project Structure** dialog box, select **Artifacts** to view the default artifact that is created. You can also create your own artifact by selecting the plus sign (**+**).

      ![Artifact info in the dialog box](./media/apache-spark-intellij-tool-plugin/default-artifact.png)
      
1. Add your application source code by doing the following:

   a. In Project Explorer, right-click **src**, point to **New**, and then select **Scala Class**.
      
      ![Commands for creating a Scala class from Project Explorer](./media/apache-spark-intellij-tool-plugin/hdi-spark-scala-code.png)

   b. In the **Create New Scala Class** dialog box, provide a name, select **Object** in the **Kind** box, and then select **OK**.
      
      ![Create New Scala Class dialog box](./media/apache-spark-intellij-tool-plugin/hdi-spark-scala-code-object.png)

   c. In the **MyClusterApp.scala** file, paste the following code. The code reads the data from HVAC.csv (available on all HDInsight Spark clusters), retrieves the rows that have only one digit in the seventh column in the CSV file, and writes the output to **/HVACOut** under the default storage container for the cluster.

        import org.apache.spark.SparkConf
        import org.apache.spark.SparkContext
    
        object MyClusterApp{
            def main (arg: Array[String]): Unit = {
            val conf = new SparkConf().setAppName("MyClusterApp")
            val sc = new SparkContext(conf)
    
            val rdd = sc.textFile("wasb:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")
    
            //find the rows that have only one digit in the seventh column in the CSV file
            val rdd1 =  rdd.filter(s => s.split(",")(6).length() == 1)
    
            rdd1.saveAsTextFile("wasb:///HVACOut")
            }
    
        }

## Run a Spark Scala application on an HDInsight Spark cluster
After creating a Scala application, you can submit it to the cluster.

1. In the Project Explorer, locate a Java or Scala file and then select **Submit Spark Application to HDInsight** in the right-click menu.
    
      ![The Submit Spark Application to HDInsight command](./media/apache-spark-intellij-tool-plugin/hdi-submit-spark-app-1.png)

2. In the configuration dialog window, provide the following values, then click **SparkJobRun**.

      ![The Spark Submission dialog box](./media/apache-spark-intellij-tool-plugin/hdi-submit-spark-app-2.png)
      
    * For **Spark clusters (Linux only)**, select the HDInsight Spark cluster on which you want to run your application.

    * Select an artifact from the IntelliJ project, or select one from the hard drive.

    * **Main class name** field: The default value is the main class from the selected file. You can change the class by selecting the ellipsis(**...**)  and choosing another class.   

    * **Job Configurations** field:  The default values are set as picture shown above. You can change the value or add new key/value for your job submission. For more information: [Apache Livy REST API](http://livy.incubator.apache.org./docs/latest/rest-api.html)

      ![The Spark Submission dialog box job configuration meaning](./media/apache-spark-intellij-tool-plugin/submit-job-configurations.png)

    * **Command line arguments** field: You can enter the arguments values split by space for the main class if needed.

    * **Referenced Jars** and **Referenced Files** fields: You can enter the paths for the referenced Jars and files if any. For more information: [Spark Configuration](https://spark.apache.org/docs/latest/configuration.html#runtime-environment) 

      ![The Spark Submission dialog box jar files meaning](./media/apache-spark-intellij-tool-plugin/jar-files-meaning.png)

       > [!NOTE]
       > To upload your Referenced JARs and Referenced Files, refer to: [How to upload resources to cluster](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-storage-explorer)
                         
    * **Upload Path**: You can indicate the storage location for the Jar or Scala project resources submission. There are three storage types supported: **Azure Blob**, **Use Spark interactive session to upload artifacts**, and **Use cluster default storage account**. Below screenshot is an example for Azure Blob.

        ![The Spark Submission dialog box](./media/apache-spark-intellij-tool-plugin/hdi-submit-spark-upload-storage-types.png)

        ![The Spark Submission dialog box](./media/apache-spark-intellij-tool-plugin/hdi-submit-spark-upload-storage-blob.png)

3. Click **SparkJobRun** to submit your project to the selected cluster. The **Remote Spark Job in Cluster** tab displays the job execution progress at the bottom. You can stop the application by clicking the red button. To learn how to access the job output, see the "Access and manage HDInsight Spark clusters by using Azure Toolkit for IntelliJ" section later in this article.
      
     ![The Spark Submission window](./media/apache-spark-intellij-tool-plugin/hdi-spark-app-result.png)


## Debug Spark applications locally or remotely on an HDInsight cluster 
We also recommend another way of submitting the Spark application to the cluster. You can do so by setting the parameters in the **Run/Debug configurations** IDE. For more information, see [Debug Spark applications locally or remotely on an HDInsight cluster with Azure Toolkit for IntelliJ through SSH](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-intellij-tool-debug-remotely-through-ssh).



## Access and manage HDInsight Spark clusters by using Azure Toolkit for IntelliJ
You can perform various operations by using Azure Toolkit for IntelliJ.

### Access the job view
1. In Azure Explorer, expand **HDInsight**, expand the Spark cluster name, and then select **Jobs**.  

    ![Job view node](./media/apache-spark-intellij-tool-plugin/job-view-node.png)

1. In the right pane, the **Spark Job View** tab displays all the applications that were run on the cluster. Select the name of the application for which you want to see more details.

    ![Application details](./media/apache-spark-intellij-tool-plugin/view-job-logs.png)
    >Note
    >

1. To display basic running job information, hover over the job graph. To view the stages graph and information that every job generates, select a node on the job graph.

    ![Job stage details](./media/apache-spark-intellij-tool-plugin/Job-graph-stage-info.png)

1. To view frequently used logs, such as *Driver Stderr*, *Driver Stdout*, and *Directory Info*, select the **Log** tab.

    ![Log details](./media/apache-spark-intellij-tool-plugin/Job-log-info.png)

1. You can also view the Spark history UI and the YARN UI (at the application level) by selecting a link at the top of the window.

### Access the Spark history server
1. In Azure Explorer, expand **HDInsight**, right-click your Spark cluster name, and then select **Open Spark History UI**. 

1. When you're prompted, enter the cluster's admin credentials, which you specified when you set up the cluster.

1. On the Spark history server dashboard, you can use the application name to look for the application that you just finished running. In the preceding code, you set the application name by using `val conf = new SparkConf().setAppName("MyClusterApp")`. Therefore, your Spark application name is **MyClusterApp**.

### Start the Ambari portal
1. In Azure Explorer, expand **HDInsight**, right-click your Spark cluster name, and then select **Open Cluster Management Portal (Ambari)**. 

1. When you're prompted, enter the admin credentials for the cluster. You specified these credentials during the cluster setup process.

### Manage Azure subscriptions
By default, Azure Toolkit for IntelliJ lists the Spark clusters from all your Azure subscriptions. If necessary, you can specify the subscriptions that you want to access. 

1. In Azure Explorer, right-click the **Azure** root node, and then select **Manage Subscriptions**. 

1. In the dialog box, clear the check boxes next to the subscriptions that you don't want to access, and then select **Close**. You can also select **Sign Out** if you want to sign out of your Azure subscription.

## Spark Console
You can run Spark Local Console(Scala) or run Spark Livy Interactive Session Console(Scala).

### Spark Local Console(Scala)
1. You need add the dependencies manually. In menu **File**->**Project Structures**->**Project Settings**->**Libraries**, then click **+**, choose **From Maven...**. Then enter **org.apache.spark:spark-repl_2.11:2.1.0** in the pop-up dialog. After adding the dependencies in libraries, you need move the dependency to the first line in **Modules** in **Project Structures** window. Before moving, change the **Scope** to **Runtime**.

    ![Local Console Add Dependency Libraries](./media/apache-spark-intellij-tool-plugin/local-console-add-dependency-libraries.png)

    ![Local Console Move to First Line](./media/apache-spark-intellij-tool-plugin/local-console-move-first-line.png)

2. Set up the configuration if you do not have any before. In **Run/Debug Configurations** window, click **+**->**Azure HDInsight Spark**, select tab **Locally Run**, choose the main class, then click **OK**.

    ![Local Console Set Configuration](./media/apache-spark-intellij-tool-plugin/console-set-configuration.png)
 
3. Open the file corresponding your main class file and right click **Spark Console**, then click **Run Spark Local Console(Scala)**. Or go to menu **Tools**->**Spark Console**->**Run Spark Local Console(Scala)** to launch the console.

    ![Spark Local Entry point](./media/apache-spark-intellij-tool-plugin/spark-console-local-entry-script.png)

4. After launching local console successfully. It looks like below. You can do something you want. For example, enter **sc.appName**, press ctrl+Enter, then the result will be shown.

    ![Local Console Result](./media/apache-spark-intellij-tool-plugin/local-console-result.png)

### Spark Livy Interactive Session Console(Scala)
It is only supported on IntelliJ 2018.2.

1. Set up the configuration if you do not have any before. In **Run/Debug Configurations** window, click **+**->**Azure HDInsight Spark**, select tab **Remotely Run in Cluster**, choose the cluster name and main class, then click **OK**.

    ![Interactive Console Add Config Entry](./media/apache-spark-intellij-tool-plugin/interactive-console-add-config-entry.png)

    ![Interactive Console Set Configuration](./media/apache-spark-intellij-tool-plugin/interactive-console-configuration.png)

2. Open the file corresponding your main class and right click **Spark Console**, then click **Run Spark Livy Interactive Session Console(Scala)**. Or go to menu **Tools**, then click **Spark Console**, then **Run Spark Livy Interactive Session Console(Scala)** to launch the console.

3. After launching the console successfully, you can do something you want. For example, enter **sc.appName**, press ctrl+Enter, then the result will be shown.

    ![Interactive Console Result](./media/apache-spark-intellij-tool-plugin/interactive-console-result.png)

## Convert existing IntelliJ IDEA applications to use Azure Toolkit for IntelliJ
You can convert the existing Spark Scala applications that you created in IntelliJ IDEA to be compatible with Azure Toolkit for IntelliJ. You can then use the plug-in to submit the applications to an HDInsight Spark cluster.

1. For an existing Spark Scala application that was created through IntelliJ IDEA, open the associated .iml file.

1. At the root level is a **module** element like the following:
   
        <module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4">

   Edit the element to add `UniqueKey="HDInsightTool"` so that the **module** element looks like the following:
   
        <module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4" UniqueKey="HDInsightTool">

1. Save the changes. Your application should now be compatible with Azure Toolkit for IntelliJ. You can test it by right-clicking the project name in Project Explorer. The pop-up menu now has the option **Submit Spark Application to HDInsight**.

## Troubleshooting

### Error in local run: *Please use a larger heap size*
In Spark 1.6, if you're using a 32-bit Java SDK during local run, you might encounter the following errors:

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

These errors happen because the heap size is not large enough for Spark to run. Spark requires at least 471 MB. (For more information, see [SPARK-12081](https://issues.apache.org/jira/browse/SPARK-12081).) One simple solution is to use a 64-bit Java SDK. You can also change the JVM settings in IntelliJ by adding the following options:

    -Xms128m -Xmx512m -XX:MaxPermSize=300m -ea

![Adding options to the "VM options" box in IntelliJ](./media/apache-spark-intellij-tool-plugin/change-heap-size.png)

## FAQ
When link a cluster, I would suggest you to provide credential of storage.

![Link cluster, provide storage credential](./media/apache-spark-intellij-tool-plugin/link-cluster-with-storage-credential-intellij.png)

There are two modes to submit the jobs. If storage credential is provided, batch mode will be used to submit the job. Otherwise, interactive mode will be used. If the cluster is busy, you might get the error below.

![Intellij get error when cluster busy](./media/apache-spark-intellij-tool-plugin/intellij-interactive-cluster-busy-upload.png)

![Intellij get error when cluster busy](./media/apache-spark-intellij-tool-plugin/intellij-interactive-cluster-busy-submit.png)

## Feedback and known issues
Currently, viewing Spark outputs directly is not supported.

If you have any suggestions or feedback, or if you encounter any problems when you use this plug-in, email us at hdivstool@microsoft.com.

## <a name="seealso"></a>Next steps
* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)

### Demo
* Create Scala project (video): [Create Spark Scala Applications](https://channel9.msdn.com/Series/AzureDataLake/Create-Spark-Applications-with-the-Azure-Toolkit-for-IntelliJ)
* Remote debug (video): [Use Azure Toolkit for IntelliJ to debug Spark applications remotely on HDInsight Cluster](https://channel9.msdn.com/Series/AzureDataLake/Debug-HDInsight-Spark-Applications-with-Azure-Toolkit-for-IntelliJ)

### Scenarios
* [Spark with BI: Perform interactive data analysis by using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight to analyze building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)

### Creating and running applications
* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](apache-spark-livy-rest-interface.md)

### Tools and extensions
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through VPN](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through SSH](apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](../hadoop/hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](apache-spark-eclipse-tool-plugin.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Managing resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
