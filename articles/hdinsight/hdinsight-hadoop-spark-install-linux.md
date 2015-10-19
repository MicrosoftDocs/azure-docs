<properties 
	pageTitle="Use Script Action to install Spark on Hadoop cluster | Microsoft Azure" 
	description="Learn how to customize an HDInsight cluster with Spark. You'll use a Script Action configuration option to use a script to install Spark." 
	services="hdinsight" 
	documentationCenter="" 
	authors="Blackmist" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/19/2015" 
	ms.author="larryfr"/>

# Install and use Spark on HDInsight Hadoop clusters

In this document, you will learn how to install Spark by using Script Action. Script Action lets you run scripts to customize a cluster, only when the cluster is being created. For more information, see [Customize HDInsight cluster using Script Action][hdinsight-cluster-customize]. Once you have installed Spark, you'll also learn how to run a Spark query on HDInsight clusters.

> [AZURE.NOTE] HDInsight also provides Spark as a cluster type, which means you can now directly provision a Spark cluster without modifying a Hadoop cluster. However, this is limited to Windows-based clusters currently. Using the Spark cluster type, you get a Windows-based HDInsight version 3.2 cluster with Spark version 1.3.1. For more information, see [Get Started with Apache Spark on HDInsight](hdinsight-apache-spark-zeppelin-notebook-jupyter-spark-sql.md).

## <a name="whatis"></a>What is Spark?

<a href="http://spark.apache.org/docs/latest/index.html" target="_blank">Apache Spark</a> is an open-source parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Spark's in-memory computation capabilities make it a good choice for iterative algorithms in machine learning and graph computations.

Spark can also be used to perform conventional disk-based data processing. Spark improves the traditional MapReduce framework by avoiding writes to disk in the intermediate stages. Also, Spark is compatible with the Hadoop Distributed File System (HDFS) and Azure Blob storage so the existing data can easily be processed via Spark. 

This topic provides instructions on how to customize an HDInsight cluster to install Spark.

## <a name="whatis"></a>Which version of Spark can I install?

In this topic, we use a Script Action custom script to install Spark on an HDInsight cluster. This script installs Spark 1.5.1.

You can modify this script or create your own script to install other versions of Spark.

## What the script does

This script installs Spark version 1.5.1 into `/usr/hdp/current/spark`.

> [AZURE.WARNING] You may discover that some Spark 1.3.1 binaries are installed by default on your HDInsight cluster. These should not be used, and will be removed from the HDInsight cluster image in a future update.

## <a name="install"></a>Install Spark using Script Actions

A sample script to install Spark on an HDInsight cluster is available from a read-only Azure storage blob at [https://hdiconfigactions.blob.core.windows.net/linuxsparkconfigactionv02/spark-installer-v02.sh](https://hdiconfigactions.blob.core.windows.net/linuxsparkconfigactionv02/spark-installer-v02.sh). This section provides instructions on how to use the sample script while creating the cluster by using the Azure portal. 

> [AZURE.NOTE] You can also use Azure PowerShell or the HDInsight .NET SDK to create a cluster using this script. For more information on using these methods, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start creating a cluster by using the steps in [Create Linux-based HDInsight clusters](hdinsight-provision-linux-clusters.md#portal), but do not complete creation.

2. On the **Optional Configuration** blade, select **Script Actions**, and provide the information below:

	* __NAME__: Enter a friendly name for the script action.
	* __SCRIPT URI__: https://hdiconfigactions.blob.core.windows.net/linuxsparkconfigactionv02/spark-installer-v02.sh
	* __HEAD__: Check this option
	* __WORKER__: Check this option
	* __ZOOKEEPER__: Check this option to install on the Zookeeper node.
	* __PARAMETERS__: Leave this field blank

3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration. Finally, use the **Select** button at the bottom of the **Optional Configuration** blade to save the optional configuration information.

4. Continue provisining the cluster as described in [Create Linux-based HDInsight clusters](hdinsight-provision-linux-clusters.md#portal).

## <a name="usespark"></a>How do I use Spark in HDInsight?

Spark provides APIs in Scala, Python, and Java. You can also use the interactive Spark shell to run Spark queries. Once your cluster has finished creation, use the following to connect to your HDInsight cluster:

	ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
	
For more information on using SSH with HDInsight, see the following:

* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

Once connected, use the following sections for specific steps on using Spark:

- [Using the Spark shell to run interactive queries](#sparkshell)
- [Using the Spark shell to run Spark SQL queries](#sparksql) 
- [Using a standalone Scala program](#standalone)

###<a name="sparkshell"></a>Using the Spark shell to run interactive queries

1. Run the following command to start the Spark shell:

		 /usr/hdp/current/spark/bin/spark-shell --master yarn

	After the command finishes running, you should get a Scala prompt:

		 scala>

5. On the Scala prompt, enter the Spark query shown below. This query counts the occurrence of each word in the davinci.txt file that is available at the /example/data/gutenberg/ location on the Azure Blob storage associated with the cluster.

		val file = sc.textFile("/example/data/gutenberg/davinci.txt")
		val counts = file.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
		counts.toArray().foreach(println)

6. The output should resemble the following:

		(felt,,1)
		(axle-tree,1)
		(deals,9)
		(virtuous,4)

7. Enter :q to exit the Scala prompt.

		:q

###<a name="sparksql"></a>Using the Spark shell to run Spark SQL queries

Spark SQL allows you to use Spark to run relational queries expressed in Structured Query Language (SQL), HiveQL, or Scala. In this section, we look at using Spark to run a Hive query on a sample Hive table. The Hive table used in this section (called **hivesampletable**) is available by default when you create a cluster.

1. Run the following command to start the Spark shell:

		 /usr/hdp/current/spark/bin/spark-shell --master yarn

	After the command finishes running, you should get a Scala prompt:

		 scala>

2. On the Scala prompt, set the Hive context. This is required to work with Hive queries by using Spark.

		val hiveContext = new org.apache.spark.sql.hive.HiveContext(sc)

	> [AZURE.NOTE]  `sc` in this statement is the default Spark context that is set when you start the Spark shell.

5. Run a Hive query by using the Hive context and print the output to the console. The query retrieves data on devices of a specific make and limits the number of records retrieved to 20.

		hiveContext.sql("""SELECT * FROM hivesampletable WHERE devicemake LIKE "HTC%" LIMIT 20""").collect().foreach(println)

6. You should see an output like the following:

		[820,11:35:17,en-US,Android,HTC,Inspire 4G,Louisiana,UnitedStates, 2.7383836,0,1]
		[1055,17:24:08,en-US,Android,HTC,Incredible,Ohio,United States,18.0894738,0,0]
		[1067,03:42:29,en-US,Windows Phone,HTC,HD7,District Of Columbia,United States,null,0,0]

7. Enter :q to exit the Scala prompt.

		:q

### <a name="standalone"></a>Using a standalone Scala program

In this section, you will create a Scala application that counts the number of lines containing the letters 'a' and 'b' in a sample data file (/example/data/gutenberg/davinci.txt.) 

1. Use the following commands to install the Scala Build Tool:

		echo "deb http://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
		sudo apt-get update
		sudo apt-get install sbt
		
	When prompted, select __Y__ to continue.

2. Create the directory structure for the Scala project:

		mkdir -p SimpleScalaApp/src/main/scala
		
3. Create a new file named __simple.sbt__, which contains the configuration information for this project.

		cd SimpleScalaApp
		nano simple.sbt
		
	Use the following as the contents of the file:

		name := "SimpleApp"
	
		version := "1.0"
	
		scalaVersion := "2.10.4"
	
		libraryDependencies += "org.apache.spark" %% "spark-core" % "1.2.0"


	> [AZURE.NOTE] Make sure you retain the empty lines between each entry.
	
	Use __Ctrl+X__, then __Y__ and __Enter__ to save the file.

4. Use the following command to create a new file named __SimpleApp.scala__ in the __SimpleScalaApp/src/main/scala__ directory:

		nano src/main/scala/SimpleApp.scala

	Use the following as the contents of the file:

		/* SimpleApp.scala */
		import org.apache.spark.SparkContext
		import org.apache.spark.SparkContext._
		import org.apache.spark.SparkConf
		
		object SimpleApp {
		  def main(args: Array[String]) {
		    val logFile = "/example/data/gutenberg/davinci.txt"			//Location of the sample data file on Azure Blob storage
		    val conf = new SparkConf().setAppName("SimpleApplication")
		    val sc = new SparkContext(conf)
		    val logData = sc.textFile(logFile, 2).cache()
		    val numAs = logData.filter(line => line.contains("a")).count()
		    val numBs = logData.filter(line => line.contains("b")).count()
		    println("Lines with a: %s, Lines with b: %s".format(numAs, numBs))
		  }
		}

	Use __Ctrl+X__, then __Y__, and __Enter__ to save the file.

5. From the __SimpleScalaApp__ directory, use the following command to build the application, and store it in a jar file:

		sbt package

	Once the application is compiled, you will see a **simpleapp_2.10-1.0.jar** file created in the __SimpleScalaApp/target/scala-2.10** directory.

6. Use the following command to run the SimpleApp.scala program:


		/usr/hdp/current/spark/bin/spark-submit --class "SimpleApp" --master yarn target/scala-2.10/simpleapp_2.10-1.0.jar

4. When the program finishes running, the output is displayed on the console.

		Lines with a: 21374, Lines with b: 11430

## Next steps

- [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Hue is a web UI that makes it easy to create, run and save Pig and Hive jobs, as well as browse the default storage for your HDInsight cluster.

- [Install R on HDInsight clusters][hdinsight-install-r] provides instructions on how to use cluster customization to install and use R on HDInsight Hadoop clusters. R is an open-source language and environment for statistical computing. It provides hundreds of built-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.

- [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing by using Hadoop, and can be used with Azure HDInsight.

- [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform powerful search operations on data stored.

- [Install Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Use cluster customization to install Hue on HDInsight Hadoop clusters. Hue is a set of Web applications used to interact with a Hadoop cluster.



[hdinsight-provision]: hdinsight-provision-clusters-linux.md
[hdinsight-install-r]: hdinsight-hadoop-r-scripts-linux.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
[powershell-install-configure]: ../install-configure-powershell.md
 
