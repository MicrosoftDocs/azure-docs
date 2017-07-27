---
title: Azure Toolkit for IntelliJ - Debug applications remotely on HDInsight Spark | Microsoft Docs
description: Learn how use HDInsight Tools in Azure Toolkit for IntelliJ to remotely debug applications running on HDInsight Spark clusters through vpn.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 55fb454f-c7dc-46de-a978-e242e9a94f4c
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: nitinme

---
# Use Azure Toolkit for IntelliJ to debug applications remotely on HDInsight Spark through VPN

We recommend the way of debugging spark applicaltion remotely through ssh. For instructions, see [Remotely debug Spark applications on an HDInsight cluster with Azure Toolkit for IntelliJ through SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-intellij-tool-debug-remotely-through-ssh).

This article provides step-by-step guidance on how to use the HDInsight Tools in Azure Toolkit for IntelliJ to submit a Spark job on HDInsight Spark cluster and then debug it remotely from your desktop computer. To do so, you must perform the following high-level steps:

1. Create a site-to-site or point-to-site Azure Virtual Network. The steps in this document assume that you use a site-to-site network.
2. Create a Spark cluster in Azure HDInsight that is part of the site-to-site Azure Virtual Network.
3. Verify the connectivity between the cluster headnode and your desktop.
4. Create a Scala application in IntelliJ IDEA and configure it for remote debugging.
5. Run and debug the application.

## Prerequisites
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).
* Oracle Java Development kit. You can install it from [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
* IntelliJ IDEA. This article uses version 2017.1. You can install it from [here](https://www.jetbrains.com/idea/download/).
* HDInsight Tools in Azure Toolkit for IntelliJ. HDInsight tools for IntelliJ are available as part of the Azure Toolkit for IntelliJ. For instructions on how to install the Azure Toolkit, see [Installing the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-installation.md).
* Log into your Azure Subscription from IntelliJ IDEA. Follow the instructions [here](hdinsight-apache-spark-intellij-tool-plugin.md).
* While running Spark Scala application for remote debugging on a Windows computer, you might get an exception as explained in [SPARK-2356](https://issues.apache.org/jira/browse/SPARK-2356) that occurs due to a missing WinUtils.exe on Windows. To work around this error, you must [download the executable from here](http://public-repo-1.hortonworks.com/hdp-win-alpha/winutils.exe) to a location like **C:\WinUtils\bin**. You must then add an environment variable **HADOOP_HOME** and set the value of the variable to **C\WinUtils**.

## Step 1: Create an Azure Virtual Network
Follow the instructions from the below links to create an Azure Virtual Network and then verify the connectivity between the desktop and Azure Virtual Network.

* [Create a VNet with a site-to-site VPN connection using Azure Portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)
* [Create a VNet with a site-to-site VPN connection using PowerShell](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
* [Configure a point-to-site connection to a virtual network using PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

## Step 2: Create an HDInsight Spark cluster
You should also create an Apache Spark cluster on Azure HDInsight that is part of the Azure Virtual Network that you created. Use the information available at [Create Linux-based clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md). As part of optional configuration, select the Azure Virtual Network that you created in the previous step.

## Step 3: Verify the connectivity between the cluster headnode and your desktop
1. Get the IP address of the headnode. Open Ambari UI for the cluster. From the cluster blade, click **Dashboard**.

    ![Find headnode IP](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/launch-ambari-ui.png)
2. From the Ambari UI, from the top-right corner, click **Hosts**.

    ![Find headnode IP](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/ambari-hosts.png)
3. You should see a list of headnodes, worker nodes, and zookeeper nodes. The headnodes have the **hn*** prefix. Click the first headnode.

    ![Find headnode IP](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/cluster-headnodes.png)
4. At the bottom of the page that opens, from the **Summary** box, copy the IP address of the headnode and the host name.

    ![Find headnode IP](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/headnode-ip-address.png)
5. Include the IP address and the host name of the headnode to the **hosts** file on the computer from where you want to run and remotely debug the Spark jobs. This will enable you to communicate with the headnode using the IP address as well as the hostname.

   1. Open a notepad with elevated permissions. From the file menu, click **Open** and then navigate to the location of the hosts file. On a Windows computer, it is `C:\Windows\System32\Drivers\etc\hosts`.
   2. Add the following to the **hosts** file.

           # For headnode0
           192.xxx.xx.xx hn0-nitinp
           192.xxx.xx.xx hn0-nitinp.lhwwghjkpqejawpqbwcdyp3.gx.internal.cloudapp.net

           # For headnode1
           192.xxx.xx.xx hn1-nitinp
           192.xxx.xx.xx hn1-nitinp.lhwwghjkpqejawpqbwcdyp3.gx.internal.cloudapp.net
6. From the computer that you connected to the Azure Virtual Network that is used by the HDInsight cluster, verify that you can ping both the headnodes using the IP address as well as the hostname.
7. SSH into the cluster headnode using the instructions at [Connect to an HDInsight cluster using SSH](hdinsight-hadoop-linux-use-ssh-unix.md). From the cluster headnode, ping the IP address of the desktop computer. You should test connectivity to both the IP addresses assigned to the computer, one for the network connection and the other for the Azure Virtual Network that the computer is connected to.
8. Repeat the steps for the other headnode as well.

## Step 4: Create a Spark Scala application using the HDInsight Tools in Azure Toolkit for IntelliJ and configure it for remote debugging
1. Launch IntelliJ IDEA and create a new project. In the new project dialog box, make the following choices, and then click **Next**.

    ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/create-hdi-scala-app.png)

   * From the left pane, select **HDInsight**.
   * From the right pane, select **Spark on HDInsight (Scala)**.
   * Click **Next**.
2. In the next window, provide the following project details, and then click **Finish**.  
   - Provide a project name and project location.
   - For **Project SDK**, Use Java 1.8 for spark 2.x cluster, Java 1.7 for spark 1.x cluster.
   - For **Spark Version**, Scala project creation wizard integrates proper version for Spark SDK and Scala SDK. If the spark cluster version is lower 2.0, choose spark 1.x. Otherwise, you should select spark2.x. This example uses Spark2.0.2(Scala 2.11.8).
       ![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/hdi-scala-project-details.png)
  
3. The Spark project will automatically create an artifact for you. To see the artifact, follow these steps.

   1. From the **File** menu, click **Project Structure**.
   2. In the **Project Structure** dialog box, click **Artifacts** to see the default artifact that is created.
   ![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/default-artifact.png)

      You can also create your own artifact bly clicking on the **+** icon, highlighted in the image above.

4. Add libraries to your project. To add a library, right-click the project name in the project tree, and then click **Open Module Settings**. In the **Project Structure** dialog box, from the left pane, click **Libraries**, click the (+) symbol, and then click **From Maven**.

    ![Add library](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/add-library.png)

    In the **Download Library from Maven Repository** dialog box, search and add the following libraries.

   * `org.scalatest:scalatest_2.10:2.2.1`
   * `org.apache.hadoop:hadoop-azure:2.7.1`
5. Copy `yarn-site.xml` and `core-site.xml` from the cluster headnode and add it to the project. Use the following commands to copy the files. You can use [Cygwin](https://cygwin.com/install.html) to run the following `scp` commands to copy the files from the cluster headnodes.

        scp <ssh user name>@<headnode IP address or host name>://etc/hadoop/conf/core-site.xml .

    Because we already added the cluster headnode IP address and hostnames fo the hosts file on the desktop, we can use the **scp** commands in the following manner.

        scp sshuser@hn0-nitinp:/etc/hadoop/conf/core-site.xml .
        scp sshuser@hn0-nitinp:/etc/hadoop/conf/yarn-site.xml .

    Add these files to your project by copying them under the **/src** folder in your project tree, for example `<your project directory>\src`.
6. Update the `core-site.xml` to make the following changes.

   1. `core-site.xml` includes the encrypted key to the storage account associated with the cluster. In the `core-site.xml` that you added to the project, replace the encrypted key with the actual storage key associated with the default storage account. See [Manage your storage access keys](../storage/storage-create-storage-account.md#manage-your-storage-account).

           <property>
                 <name>fs.azure.account.key.hdistoragecentral.blob.core.windows.net</name>
                 <value>access-key-associated-with-the-account</value>
           </property>
   2. Remove the following entries from the `core-site.xml`.

           <property>
                 <name>fs.azure.account.keyprovider.hdistoragecentral.blob.core.windows.net</name>
                 <value>org.apache.hadoop.fs.azure.ShellDecryptionKeyProvider</value>
           </property>

           <property>
                 <name>fs.azure.shellkeyprovider.script</name>
                 <value>/usr/lib/python2.7/dist-packages/hdinsight_common/decrypt.sh</value>
           </property>

           <property>
                 <name>net.topology.script.file.name</name>
                 <value>/etc/hadoop/conf/topology_script.py</value>
           </property>
   3. Save the file.
7. Add the Main class for your application. From the **Project Explorer**, right-click **src**, point to **New**, and then click **Scala class**.

    ![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/hdi-spark-scala-code.png)
8. In the **Create New Scala Class** dialog box, provide a name, for **Kind** select **Object**, and then click **OK**.

    ![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/hdi-spark-scala-code-object.png)
9. In the `MyClusterAppMain.scala` file, paste the following code. This code creates the Spark context and launches an `executeJob` method from the `SparkSample` object.

        import org.apache.spark.{SparkConf, SparkContext}

        object SparkSampleMain {
          def main (arg: Array[String]): Unit = {
            val conf = new SparkConf().setAppName("SparkSample")
                                      .set("spark.hadoop.validateOutputSpecs", "false")
            val sc = new SparkContext(conf)

            SparkSample.executeJob(sc,
                                   "wasb:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv",
                                   "wasb:///HVACOut")
          }
        }

10. Repeat steps 8 and 9 above to add a new Scala object called `SparkSample`. To this class add the following code. This code reads the data from the HVAC.csv (available on all HDInsight Spark clusters), retrieves the rows that only have one digit in the seventh column in the CSV, and writes the output to **/HVACOut** under the default storage container for the cluster.

        import org.apache.spark.SparkContext

        object SparkSample {
         def executeJob (sc: SparkContext, input: String, output: String): Unit = {
           val rdd = sc.textFile(input)

           //find the rows which have only one digit in the 7th column in the CSV
           val rdd1 =  rdd.filter(s => s.split(",")(6).length() == 1)

           val s = sc.parallelize(rdd.take(5)).cartesian(rdd).count()
           println(s)

           rdd1.saveAsTextFile(output)
           //rdd1.collect().foreach(println)
         }
        }
11. Repeat steps 8 and 9 above to add a new class called `RemoteClusterDebugging`. This class implements the Spark test framework that is used for debugging applications. Add the following code to the `RemoteClusterDebugging` class.

        import org.apache.spark.{SparkConf, SparkContext}
        import org.scalatest.FunSuite

        class RemoteClusterDebugging extends FunSuite {

         test("Remote run") {
           val conf = new SparkConf().setAppName("SparkSample")
                                     .setMaster("yarn-client")
                                     .set("spark.yarn.am.extraJavaOptions", "-Dhdp.version=2.4")
                                     .set("spark.yarn.jar", "wasb:///hdp/apps/2.4.2.0-258/spark-assembly-1.6.1.2.4.2.0-258-hadoop2.7.1.2.4.2.0-258.jar")
                                     .setJars(Seq("""C:\workspace\IdeaProjects\MyClusterApp\out\artifacts\MyClusterApp_DefaultArtifact\default_artifact.jar"""))
                                     .set("spark.hadoop.validateOutputSpecs", "false")
           val sc = new SparkContext(conf)

           SparkSample.executeJob(sc,
             "wasb:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv",
             "wasb:///HVACOut")
         }
        }

     Couple of important things to note here:

   * For `.set("spark.yarn.jar", "wasb:///hdp/apps/2.4.2.0-258/spark-assembly-1.6.1.2.4.2.0-258-hadoop2.7.1.2.4.2.0-258.jar")`, make sure the Spark assembly JAR is available on the cluster storage at the specified path.
   * For `setJars`, specify the location where the artifact jar will be created. Typically it is `<Your IntelliJ project directory>\out\<project name>_DefaultArtifact\default_artifact.jar`.
12. In the `RemoteClusterDebugging` class, right-click the `test` keyword and select **Create RemoteClusterDebugging Configuration**.

    ![Create remote configuration](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/create-remote-config.png)

13. In the dialog box, provide a name for the configuration, and select the **Test kind** as **Test name**. Leave all other values as default, click **Apply**, and then click **OK**.

    ![Create remote configuration](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/provide-config-value.png)
14. You should now see a **Remote Run** configuration drop-down in the menu bar.

    ![Create remote configuration](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/config-run.png)

## Step 5: Run the application in debug mode
1. In your IntelliJ IDEA project, open `SparkSample.scala` and create a breakpoint next to `val rdd1'. In the pop-up menu for creating a breakpoint, select **line in function executeJob**.

    ![Add a breakpoint](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/create-breakpoint.png)
2. Click the **Debug Run** button next to the **Remote Run** configuration drop-down to start running the application.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-run-mode.png)
3. When the program execution reaches the breakpoint, you should see a **Debugger** tab in the bottom pane.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-add-watch.png)
4. Click the (**+**) icon to add a watch as shown in the image below.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-add-watch-variable.png)

    Here, because the application broke before the variable `rdd1` was created, using this watch we can see what are the first 5 rows in the variable `rdd`. Press **ENTER**.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-add-watch-variable-value.png)

    What you see in the image above is that at runtime, you could query terrabytes of data and debug how your application progresses. For example, in the output shown in the image above, you can see that the first row of the output is a header. Based on this, you can modify your application code to skip the header row if required.
5. You can now click the **Resume Program** icon to proceed with your application run.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-continue-run.png)
6. If the application completes successfully, you should see an output like the following.

    ![Run the program in debug mode](./media/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely-through-vpn/debug-complete.png)

## <a name="seealso"></a>See also
* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)

### Demo
* Create Scala Project (Video): [Create Spark Scala Applications](https://channel9.msdn.com/Series/AzureDataLake/Create-Spark-Applications-with-the-Azure-Toolkit-for-IntelliJ)
* Remote Debug (Video): [Use Azure Toolkit for IntelliJ to debug Spark applications remotely on HDInsight Cluster](https://channel9.msdn.com/Series/AzureDataLake/Debug-HDInsight-Spark-Applications-with-Azure-Toolkit-for-IntelliJ)

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
* [Use HDInsight Tools in Azure Toolkit for IntelliJ to create and submit Spark Scala applicatons](hdinsight-apache-spark-intellij-tool-plugin.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through SSH](hdinsight-apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](hdinsight-apache-spark-eclipse-tool-plugin.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](hdinsight-apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](hdinsight-apache-spark-job-debugging.md)
