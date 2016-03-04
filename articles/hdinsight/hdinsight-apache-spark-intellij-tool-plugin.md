 <properties 
	pageTitle="Create Spark Scala applications using HDInsight plugin for IntelliJ IDEA | Microsoft Azure" 
	description="Learn how to create a standalone Spark application to run on HDInsight Spark clusters." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/03/2016" 
	ms.author="nitinme"/>


# Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications (Linux)

This article provides step-by-step guidance on developing Spark applications written in Scala and submitting it to an HDInsight Spark cluster using HDInsight plugin for IntelliJ IDEA. You can use the plugin in a few different ways:

* To develop and submit a Scala Spark application on an HDInsight Spark cluster
* To access your Azure HDInsight Spark cluster resources
* To develop and run a Scala Spark application locally

>[AZURE.IMPORTANT] This tool can be used to create and submit applications only for an HDInsight Spark cluster on Linux.


**Prerequisites**

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).
* Oracle Java Development kit. You can install it from [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
* IntelliJ IDEA. This article uses version 15.0.1. You can install it from [here](https://www.jetbrains.com/idea/download/). 


## Install Scala plugin for IntelliJ IDEA

If IntelliJ IDEA installation did not not prompt for enabling Scala plugin, launch IntelliJ IDEA and go through the following steps to install the plugin:

1. Start IntelliJ IDEA and from welcome screen click **Configure** and then click **Plugins**.

	![Enable scala plugin](./media/hdinsight-apache-spark-intellij-tool-plugin/enable-scala-plugin.png)

2. In the next screen, click **Install JetBrains plugin** from the lower left corner. In the **Browse JetBrains Plugins** dialog box that opens, search for Scala and then click **Install**.

	![Install scala plugin](./media/hdinsight-apache-spark-intellij-tool-plugin/install-scala-plugin.png)

3. After the plugin installs successfully, you will be prompted to restart the IDE. You can skip that for now.

## Install HDInsight Tools plugin for IntelliJ IDEA

1. If you are back on the IntelliJ IDEA welcome screen, click click **Configure** and then click **Plugins** again.

2. In the next screen, click **Browse Repositories** from the lower left corner. In the **Browse Repositories** dialog box that opens, search for **HDInsight**, select the **Microsoft Azure HDInsight Tools for IntelliJ (Preview)**, and then click **Install**.

	![Install HDInsight plugin](./media/hdinsight-apache-spark-intellij-tool-plugin/install-hdinsight-plugin.png)

3. When prompted, click the **Restart IntelliJ IDEA** button to restart the IDE.

## Run a Spark Scala application on an HDInsight Spark cluster

1. Launch IntelliJ IDEA and create a new project. In the new project dialog box, make the following choices, and then click **Next**.

	![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/create-hdi-scala-app.png)

	* From the left pane, select **HDInsight**.
	* From the right pane, select **Spark on HDInsight (Scala)**.
	* Click **Next**.

2. In the next window, provide the project details.

	* Provide a project name and project location.
	* For **Project SDK**, make sure you provide a Java version greater than 7.
	* For **Scala SDK**, click **Create**, click **Download**, and then select the version of Scala to use. **Make sure you do not use version 2.11.x**. This sample uses version **2.10.6**.
	
		![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-version.png)

	* For **Spark SDK**, download and use the SDK from [here](http://go.microsoft.com/fwlink/?LinkID=723585&clcid=0x409).

		![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-project-details.png)

	* Click **Finish**.

3. Define the project structure to create an artifact (packaged jar) that will eventually contain the code that runs on the cluster. 

	1. From the **File** menu, click **Project Structure**.
	2. In the **Project Structure** dialog box, click **Artifacts** and then click the plus symbol. From the pop-up dialog box, click **JAR**, and then click **Empty**.

		![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin/create-jar-1.png)

	3. Enter a name for the JAR file (e.g. **MyClusterApp**). From the Available Elements pane, right-click **'MyClusterApp' compile output**, and then click **Put into Output Root**.

		![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin/create-jar-2.png)	
	
	4. Click **Apply** and then click **OK**.

4. Add your application source code.

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
			
			    val rdd = sc.textFile("wasb:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")
			
			    //find the rows which have only one digit in the 7th column in the CSV
				val rdd1 =  rdd.filter(s => s.split(",")(6).length() == 1)
			
			    rdd1.saveAsTextFile("wasb:///HVACOut")
			  }
			
			}

5. Run the application on an HDInsight Spark cluster.

	1. From the **Project Explorer**, right-click the project name, and then select **Submit Spark Application to HDInsight**.

		![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-1.png)

	2. You will be prompted to enter your Azure subscription credentials. In the **Spark Submission** dialog box, provide the following values.

		![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-2.png)

		* For **Spark clusters (Linux only)**, select the HDInsight Spark cluster on which you want to run your application.

		* The **Build Artifacts** drop-down should list the JAR name you specified in the previous steps.

		* Against the **Main class name** text box, click the ellipsis (![ellipsis](./media/hdinsight-apache-spark-intellij-tool-plugin/ellipsis.png) ), select the main class in your application source code, and then click **OK**.

			![Submit Spark application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-submit-spark-app-3.png)
	
		* Because the application code in this example does not require any command line arguments or reference JARs or files, you can leave the remaining text boxes empty.
	
		* Click **Submit**.

	3. The **Spark Submission** tab at the bottom of the window should start displaying the progress.

	In the next section, you learn how to access the job output using the HDInsight plugin for IntelliJ IDEA.


## Access and manage HDInsight Spark clusters using the HDInsight plugin for IntelliJ

You can perform a variety of operations using the HDInsight plugin.

### Access the storage container for the cluster

1. From the **View** menu, point to **Tool Windows**, and then click **HDInsight Explorer**. If prompted, enter the credentials to access your Azure subscription.

2. Expand **HDInsight** root node to see a list of HDInsight Spark clusters that are available.

3. Expand the cluster name to see the storage account and the default storage container for the cluster.

	![Access cluster storage](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-access-storage.png)

4. Click the storage container name associated with the cluster. In the right-pane, you should see a folder called **HVACOut**. Double-click to open the folder and you will see **part-*** files. Open one of those files to see the output of the application.

### Access the Spark History Server

1. From the **HDInsight Explorer**, right-click your Spark cluster name and then select **Open Spark History UI**. When prompted, enter the admin credentials for the cluster. You must have specified these while provisioning the cluster.

2. In the Spark History Server dashboard, you can look for the application you just finished running by using the application name. In the code above, you set the application name using `val conf = new SparkConf().setAppName("MyClusterApp")`. Hence, your Spark application name was **MyClusterApp**.

### Launch the Ambari portal

From the **HDInsight Explorer**, right-click your Spark cluster name and then select **Open Cluster Management Portal (Ambari)**. When prompted, enter the admin credentials for the cluster. You must have specified these while provisioning the cluster.

### Manage Azure subscriptions

By default, the HDInsight plugin lists the Spark clusters from all your Azure subscriptions. If required, you can specify the subscriptions for which you want to access the cluster. From the **HDInsight Explorer**, right-click the **HDInsight** root node, and then click **Manage Subscriptions**. From the dialog box, clear the check boxes against the subscription that you do not want to access and then click **Close**. You can also click **Sign Out** if you want to log off from your Azure subscription.


## Run a Spark Scala application locally

You can use the HDInsight Tools plugin for IntelliJ IDEA to run Spark Scala applications locally on your workstation. Typically, such applications do not need access to cluster resources such as storage container and can be run and tested locally.

### Prerequisite

While running the local Spark Scala application on a Windows computer, you might get an exception as explained in [SPARK-2356](https://issues.apache.org/jira/browse/SPARK-2356) that occurs due to a missing WinUtils.exe on Windows. To work around this error, you must [download the executable from here](http://public-repo-1.hortonworks.com/hdp-win-alpha/winutils.exe) to a location like **C:\WinUtils\bin**. You must then add an environment variable **HADOOP_HOME** and set the value of the variable to **C\WinUtils**.

### Run a local Spark Scala application	 

1. Launch IntelliJ IDEA and create a new project. In the new project dialog box, make the following choices, and then click **Next**.

	![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/create-hdi-scala-app.png)

	* From the left pane, select **HDInsight**.
	* From the right pane, select **Spark on HDInsight (Scala)**.
	* Click **Next**.

2. In the next window, provide the project details.

	* Provide a project name and project location.
	* For **Project SDK**, make sure you provide a Java version greater than 7.
	* For **Scala SDK**, click **Create**, click **Download**, and then select the version of Scala to use. **Make sure you do not use version 2.11.x**. This sample uses version **2.10.6**.
	
		![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-version.png)

	* For **Spark SDK**, download and use the SDK from [here](http://go.microsoft.com/fwlink/?LinkID=723585&clcid=0x409).
	* Click **Finish**.

		![Create Spark Scala application](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-scala-local-project-details.png)

3. Define the project structure to create an artifact (packaged jar) that will eventually contain the code that runs on the cluster. 

	1. From the **File** menu, click **Project Structure**.
	2. In the **Project Structure** dialog box, click **Artifacts** and then click the plus symbol. From the pop-up dialog box, click **JAR**, and then click **Empty**.

		![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin/create-jar-1.png)

	3. Enter a name for the JAR file (e.g. **MyLocalApp**). From the Available Elements pane, right-click **'MyLocalApp' compile output**, and then click **Put into Output Root**.

		![Create JAR](./media/hdinsight-apache-spark-intellij-tool-plugin/create-local-jar-2.png)	
	
	4. Click **Apply** and then click **OK**.

4. Add your application source code.

	1. From the **Project Explorer**, right-click **src**, point to **New**, and then click **Scala class**.

		![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-local-scala-code.png)

	2. In the **Create New Scala Class** dialog box, provide a name, for **Kind** select **Object**, and then click **OK**.

		![Add source code](./media/hdinsight-apache-spark-intellij-tool-plugin/hdi-spark-local-scala-code-object.png)

	3. In the **MyLocalApp.scala** file, paste the following code. This code reads a sample input text file on your computer and prints out the number of lines in that text file that contain the characters "a" and "b".


			import org.apache.spark.SparkContext
			import org.apache.spark.SparkContext._
			import org.apache.spark.SparkConf
			
			object MyLocalApp {
			  def main(args: Array[String]) {
			    val logFile = "C:/users/nitinme/Desktop/commands.txt" // Should be some file on your system
			    val conf = new SparkConf().setAppName("MyLocalApp").setMaster("local[2]")
			    val sc = new SparkContext(conf)
			    val logData = sc.textFile(logFile, 2).cache()
			    val numAs = logData.filter(line => line.contains("a")).count()
			    val numBs = logData.filter(line => line.contains("b")).count()
			    println("Lines with a: %s, Lines with b: %s".format(numAs, numBs))
			  }
			}

5. Run the application locally on your workstation. From the **Run** menu, click **Run 'MyLocalApp'**. You will see an output like this in the **Run** tab at the bottom.

		...
		...
		Lines with a: 4, Lines with b: 4
		...
		...
		16/02/01 15:04:05 INFO SparkContext: Successfully stopped SparkContext
		16/02/01 15:04:05 INFO ShutdownHookManager: Shutdown hook called
		16/02/01 15:04:05 INFO ShutdownHookManager: Deleting directory C:\Users\nitinme\AppData\Local\Temp\spark-618dee33-45a3-4bce-a8fc-bf85663133b3
		
		Process finished with exit code 0


## Convert existing IntelliJ IDEA applications to use the HDInsight tool plugin

You can also convert your existing Spark Scala applications created in IntelliJ IDEA to be compatible with the HDInsight tool plugin. This will enable you to use the tool to submit the applications to an HDInsight Spark cluster. You can do so by performing the following steps:

1. For an existing Spark Scala appliction created using IntelliJ IDEA, open the associated .iml file.
2. At the root level, you will see a **module** element like this:

		<module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4">

3. Edit the element to add `UniqueKey="HDInsightTool"` so that the **module** element looks like the following:

		<module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" type="JAVA_MODULE" version="4" UniqueKey="HDInsightTool">

4. Save the changes. Your application should now be compatible with the HDInsight tool plugin. You can test this by right-clicking on the project name in the Project Explorer. The pop-up menu should now have the option to **Submit Spark Application to HDInsight**.

## <a name="seealso"></a>See also


* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)

### Scenarios

* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](hdinsight-apache-spark-ipython-notebook-machine-learning.md)

* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)

* [Spark Streaming: Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-eventhub-streaming.md)

* [Website log analysis using Spark in HDInsight](hdinsight-apache-spark-custom-library-website-log-analysis.md)

### Create and run applications

* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)

### Tools and extensions

* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-use-zeppelin-notebook.md)

* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)

### Manage resources

* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
